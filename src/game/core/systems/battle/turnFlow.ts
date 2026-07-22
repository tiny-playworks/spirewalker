import type { GameEvent } from '../../events/types';
import { getStatusStacks } from '../../combat/statusCombat';
import { STATUS_MOMENTUM } from '../../definitions/statuses';
import type { BattleState } from '../../model/battle';
import type { RunState } from '../../model/run';
import { runOnTurnEnd, runOnTurnStart } from '../status/statusHooks';
import { refreshEnemyIntent } from '../enemy/enemyAi';
import { executeMonsterIntent } from '../enemy/intentExecutor';
import { applyStartOfPlayerTurnPressure, dealDamageToUnit, tickEnemyCountdown } from '../enemy/runtimeHooks';
import { syncRunPlayerFromBattle } from '../common/runGuards';
import {
  applyRelicResourceResult,
  ensureRelicRuntime,
  gainMomentumWithRelics,
  resolveRelicHooks,
  type RelicHookResult,
} from '../relic/relicHooks';
import { mulberry32 } from '../../utils/rng';
import { shuffleInPlace } from '../../utils/shuffle';

function drawUpTo(
  battle: BattleState,
  count: number,
  relicIds: string[],
  events: GameEvent[],
  random: () => number,
): void {
  let need = count - battle.player.hand.length;
  while (need > 0) {
    if (battle.player.drawPile.length === 0) {
      if (battle.player.discardPile.length === 0) break;
      const fromDiscardCount = battle.player.discardPile.length;
      battle.player.drawPile = [...battle.player.discardPile];
      battle.player.discardPile = [];
      shuffleInPlace(battle.player.drawPile, random);
      events.push({
        type: 'DRAWPILE_RESHUFFLED',
        unitId: battle.playerUnitId,
        fromDiscardCount,
      });
    }
    const id = battle.player.drawPile.shift();
    if (!id) break;
    battle.player.hand.push(id);
    events.push({ type: 'CARD_DRAWN', unitId: battle.playerUnitId, cardInstanceId: id });
    const runtime = ensureRelicRuntime(battle);
    const relicResult = resolveRelicHooks(relicIds, {
      battle,
      trigger: 'cardDrawn',
      cardId: battle.player.cards[id]?.definitionId,
      events,
    });
    applyRelicResourceResult(battle, relicResult, events);
    if (relicResult.block) {
      battle.units[battle.playerUnitId]!.block += relicResult.block;
      events.push({ type: 'BLOCK_GAINED', unitId: battle.playerUnitId, value: relicResult.block });
      battle.playerGainedBlockThisTurn = true;
      battle.playerTurnBlockGained += relicResult.block;
    }
    if (relicIds.includes('draw_power_sigil')) {
      runtime.drawPowerSigilTriggersThisTurn = (runtime.drawPowerSigilTriggersThisTurn as number | undefined ?? 0) + 1;
    }
    if (relicIds.includes('surge_tide')) {
      runtime.surgeTideDrawsThisTurn = (runtime.surgeTideDrawsThisTurn as number | undefined ?? 0) + 1;
    }
    if (relicResult.draw) {
      drawUpTo(battle, battle.player.hand.length + relicResult.draw, relicIds, events, random);
    }
    need -= 1;
  }
  if (battle.player.pendingHandLocks > 0) {
    const candidates = battle.player.hand.filter((cardId) => !battle.player.lockedCardInstanceIds.includes(cardId));
    battle.player.lockedCardInstanceIds.push(...candidates.slice(0, battle.player.pendingHandLocks));
    battle.player.pendingHandLocks = 0;
  }
}

function applyRelicTurnResult(
  battle: BattleState,
  result: RelicHookResult,
  relicIds: string[],
  events: GameEvent[],
  random: () => number,
): void {
  applyRelicResourceResult(battle, { ...result, momentum: undefined }, events);
  const player = battle.units[battle.playerUnitId];
  if (!player) return;
  if (result.momentum) {
    const gained = gainMomentumWithRelics(battle, relicIds, result.momentum, events);
    applyRelicResourceResult(battle, { ...gained, momentum: undefined }, events);
    if (gained.block) {
      player.block += gained.block;
      events.push({ type: 'BLOCK_GAINED', unitId: battle.playerUnitId, value: gained.block });
      battle.playerGainedBlockThisTurn = true;
      battle.playerTurnBlockGained += gained.block;
    }
    if (gained.draw) drawUpTo(battle, battle.player.hand.length + gained.draw, relicIds, events, random);
  }
  if (result.block) {
    player.block += result.block;
    events.push({ type: 'BLOCK_GAINED', unitId: battle.playerUnitId, value: result.block });
    battle.playerGainedBlockThisTurn = true;
    battle.playerTurnBlockGained += result.block;
  }
  if (result.maxHpLoss) {
    player.maxHp = Math.max(1, player.maxHp - result.maxHpLoss);
    player.hp = Math.min(player.hp, player.maxHp);
  }
}

function discardHand(battle: BattleState): void {
  const { hand, discardPile } = battle.player;
  while (hand.length) {
    const id = hand.shift();
    if (id) discardPile.push(id);
  }
  battle.player.lockedCardInstanceIds = [];
}

function pickRandomLivingEnemyId(battle: BattleState, random: () => number): string | undefined {
  const living = battle.enemyUnitIds.filter((id) => battle.units[id]?.alive);
  if (living.length === 0) return undefined;
  return living[Math.floor(random() * living.length)]!;
}

/** 固守：玩家回合结束时将半数剩余格挡转为随机单体伤害。 */
function resolveFortifyEndOfTurn(
  battle: BattleState,
  events: GameEvent[],
  random: () => number,
): void {
  if (!battle.pendingFortifyConvert) return;
  battle.pendingFortifyConvert = false;
  const player = battle.units[battle.playerUnitId];
  if (!player?.alive || player.block <= 0) return;
  const conv = Math.floor(player.block * 0.5);
  if (conv <= 0) return;
  player.block -= conv;
  const tid = pickRandomLivingEnemyId(battle, random);
  if (tid) dealDamageToUnit(battle, battle.playerUnitId, tid, conv, events);
}

function applyEnemyIntent(
  relicIds: string[],
  battle: BattleState,
  enemyUnitId: string,
  events: GameEvent[],
): void {
  const enemy = battle.units[enemyUnitId];
  const monster = battle.monsters[enemyUnitId];
  const player = battle.units[battle.playerUnitId];
  if (!enemy?.alive || !monster?.intent || !player) return;

  const intent = monster.intent;
  executeMonsterIntent(relicIds, battle, enemyUnitId, intent, events);
  monster.moveHistory.push(intent.type);
}

export function endTurnFlow(run: RunState, events: GameEvent[]): void {
  const battle = run.battle;
  if (!battle || battle.phase !== 'player_action') return;
  if (battle.inputMode === 'animation_lock') return;
  if (battle.inputMode === 'selecting_target') {
    battle.pendingAction = null;
    battle.inputMode = 'idle';
  }

  discardHand(battle);
  const fortifyRng = mulberry32((run.seed ^ battle.turn * 0xf00d5a1) >>> 0);
  resolveFortifyEndOfTurn(battle, events, () => fortifyRng());

  const turnEndPlayer = battle.units[battle.playerUnitId];
  const turnEndRelics = resolveRelicHooks(run.meta.relics, {
    run,
    battle,
    trigger: 'turnEnd',
    remainingMomentum: turnEndPlayer ? getStatusStacks(turnEndPlayer, STATUS_MOMENTUM) : 0,
    events,
  });
  applyRelicTurnResult(battle, turnEndRelics, run.meta.relics, events, fortifyRng);
  const turnEndRuntime = ensureRelicRuntime(battle);
  if (turnEndPlayer && (turnEndRelics.retainBlock || turnEndRelics.retainBlockRatio)) {
    const ratio = turnEndRelics.retainBlockRatio ?? 1;
    turnEndRuntime.retainedBlock = Math.floor(turnEndPlayer.block * ratio);
  }
  if (turnEndRelics.nextTurnDraw) turnEndRuntime.nextTurnDraw = turnEndRelics.nextTurnDraw;
  if (turnEndRelics.nextTurnPrimedBreak) {
    turnEndRuntime.nextTurnPrimedBreak = turnEndRelics.nextTurnPrimedBreak;
  }

  events.push({ type: 'TURN_ENDED', unitId: battle.playerUnitId });
  runOnTurnEnd(battle);

  battle.prevTurnPlayerPlayedAttack = battle.playerPlayedAttackThisTurn;
  battle.playerPlayedAttackThisTurn = false;
  battle.playerPlayedSkillThisTurn = false;
  battle.blazeCoreAttackBonus = 0;

  battle.phase = 'enemy_turn';
  const player = battle.units[battle.playerUnitId];
  if (!player) return;
  for (const eid of battle.enemyUnitIds) {
    tickEnemyCountdown(battle, eid, events);
    applyEnemyIntent(run.meta.relics, battle, eid, events);
    if (!player.alive) break;
    refreshEnemyIntent(battle, eid);
  }

  if (!player.alive) {
    events.push({ type: 'BATTLE_LOST' });
    battle.phase = 'defeat';
    syncRunPlayerFromBattle(run);
    return;
  }

  battle.playerCardsPlayedThisTurn = 0;
  battle.playerConsumedMomentumThisTurn = false;
  battle.playerAttacksPlayedThisTurn = 0;
  battle.playerExhaustedCardThisTurn = false;
  battle.harmonyEmblemTriggeredThisTurn = false;
  battle.twinCoreFirstBlockUsed = false;
  battle.twinCoreFirstAttackUsed = false;
  battle.twinCoreNextAttackBonus = 0;
  battle.twinCoreNextSkillBonus = 0;
  battle.playerGainedBlockThisTurn = false;
  battle.playerMomentumConsumedAmountThisTurn = 0;
  battle.playerTurnBlockGained = 0;
  battle.cycleEngineDrawsThisTurn = 0;
  battle.chainBoltActive = false;
  const relicRuntime = ensureRelicRuntime(battle);
  relicRuntime.momentumConsumeCountThisTurn = 0;
  relicRuntime.momentumConsumedThisTurn = 0;
  relicRuntime.drawPowerSigilTriggersThisTurn = 0;
  relicRuntime.surgeTideDrawsThisTurn = 0;
  relicRuntime.guardMomentumLinkCountThisTurn = 0;
  relicRuntime.memoryShardTriggersThisTurn = 0;
  relicRuntime.flowResonanceTriggersThisTurn = 0;
  relicRuntime.playerWasAttackedThisTurn = false;
  relicRuntime.ironVeilUsed = false;
  relicRuntime.shellShardUsed = false;
  relicRuntime.dualityCrestUsedThisTurn = false;
  relicRuntime.skillBlockBonus = 0;
  relicRuntime.turnAttackBonus = 0;
  relicRuntime.cardCostReductionThisTurn = 0;
  battle.turn += 1;
  runOnTurnStart(battle);
  events.push({ type: 'TURN_STARTED', turn: battle.turn, unitId: battle.playerUnitId });
  player.block = typeof relicRuntime.retainedBlock === 'number' ? relicRuntime.retainedBlock : 0;
  delete relicRuntime.retainedBlock;
  battle.player.energy = battle.player.maxEnergy;
  events.push({ type: 'ENERGY_CHANGED', unitId: battle.playerUnitId, value: battle.player.energy });
  const rng = mulberry32(run.seed ^ battle.turn * 0x1bf58);
  const turnStartRelics = resolveRelicHooks(run.meta.relics, {
    run,
    battle,
    trigger: 'turnStart',
    events,
  });
  applyRelicTurnResult(battle, turnStartRelics, run.meta.relics, events, rng);
  const nextTurnPrimedBreak = typeof relicRuntime.nextTurnPrimedBreak === 'number'
    ? relicRuntime.nextTurnPrimedBreak
    : 0;
  if (nextTurnPrimedBreak > 0) {
    applyRelicResourceResult(battle, { primedBreak: nextTurnPrimedBreak });
    delete relicRuntime.nextTurnPrimedBreak;
  }
  const drawPenalty = applyStartOfPlayerTurnPressure(battle);
  drawUpTo(
    battle,
    Math.max(0, 5 - drawPenalty) + (turnStartRelics.draw ?? 0) + (relicRuntime.nextTurnDraw as number | undefined ?? 0),
    run.meta.relics,
    events,
    () => rng(),
  );
  delete relicRuntime.nextTurnDraw;
  battle.phase = 'player_action';
}

export function resolveAnimationDoneFlow(run: RunState): void {
  const battle = run.battle;
  if (!battle || battle.inputMode !== 'animation_lock') return;
  battle.lastResolvedEvents = [];
  battle.pendingAction = null;
  battle.inputMode = 'idle';
}
