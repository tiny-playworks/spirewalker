import type { GameEvent } from '../../events/types';
import type { BattleState } from '../../model/battle';
import type { RunState } from '../../model/run';
import type { CombatUnit } from '../../model/unit';
import { addStatusStacks, decayStatus, getStatusStacks } from '../../combat/statusCombat';
import { STATUS_MOMENTUM } from '../../definitions/statuses';
import { runOnBeforeDealDamage, runOnBeforeTakeDamage, runOnTurnEnd, runOnTurnStart } from '../status/statusHooks';
import { refreshEnemyIntent } from '../enemy/enemyAi';
import { syncRunPlayerFromBattle } from '../common/runGuards';
import { mulberry32 } from '../../utils/rng';
import { shuffleInPlace } from '../../utils/shuffle';

function drawUpTo(
  battle: BattleState,
  count: number,
  events: GameEvent[],
  random: () => number,
): void {
  let need = count - battle.player.hand.length;
  while (need > 0) {
    if (battle.player.drawPile.length === 0) {
      if (battle.player.discardPile.length === 0) break;
      battle.player.drawPile = [...battle.player.discardPile];
      battle.player.discardPile = [];
      shuffleInPlace(battle.player.drawPile, random);
    }
    const id = battle.player.drawPile.shift();
    if (!id) break;
    battle.player.hand.push(id);
    events.push({ type: 'CARD_DRAWN', unitId: battle.playerUnitId, cardInstanceId: id });
    need -= 1;
  }
}

function discardHand(battle: BattleState): void {
  const { hand, discardPile } = battle.player;
  while (hand.length) {
    const id = hand.shift();
    if (id) discardPile.push(id);
  }
}

function dealDamageTo(
  battle: BattleState,
  sourceId: string,
  target: CombatUnit,
  baseAmount: number,
  events: GameEvent[],
): void {
  if (!target.alive) return;
  const source = battle.units[sourceId];
  let remaining = source ? runOnBeforeDealDamage(source, baseAmount) : baseAmount;
  remaining = runOnBeforeTakeDamage(target, remaining);
  const blockAbsorb = Math.min(target.block, remaining);
  if (blockAbsorb > 0) {
    target.block -= blockAbsorb;
    remaining -= blockAbsorb;
  }
  const hpLoss = Math.min(target.hp, remaining);
  target.hp -= hpLoss;
  if (hpLoss > 0) events.push({ type: 'DAMAGE_DEALT', sourceUnitId: sourceId, targetUnitId: target.id, value: hpLoss });
  target.alive = target.hp > 0;
  if (!target.alive) events.push({ type: 'UNIT_DIED', unitId: target.id });
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
  if (intent.type === 'attack') {
    dealDamageTo(battle, enemyUnitId, player, intent.value, events);
    monster.moveHistory.push('attack');
    return;
  }

  if (intent.type === 'block') {
    enemy.block += intent.value;
    events.push({ type: 'BLOCK_GAINED', unitId: enemyUnitId, value: intent.value });
    monster.moveHistory.push('block');
    return;
  }

  if (intent.type === 'buff') {
    addStatusStacks(enemy, intent.statusId, intent.value);
    events.push({
      type: 'STATUS_APPLIED',
      unitId: enemyUnitId,
      statusId: intent.statusId,
      value: getStatusStacks(enemy, intent.statusId),
    });
    monster.moveHistory.push('buff');
    return;
  }

  if (intent.type === 'debuff') {
    addStatusStacks(player, intent.statusId, intent.value);
    events.push({
      type: 'STATUS_APPLIED',
      unitId: battle.playerUnitId,
      statusId: intent.statusId,
      value: getStatusStacks(player, intent.statusId),
    });
    monster.moveHistory.push('debuff');
    return;
  }

  if (intent.type === 'reduce_status') {
    const reduction = intent.statusId === STATUS_MOMENTUM && relicIds.includes('guard_knot')
      ? Math.max(0, intent.value - 1)
      : intent.value;
    decayStatus(player, intent.statusId, reduction);
    events.push({
      type: 'STATUS_APPLIED',
      unitId: battle.playerUnitId,
      statusId: intent.statusId,
      value: getStatusStacks(player, intent.statusId),
    });
    monster.moveHistory.push('reduce_status');
    return;
  }

  if (intent.type === 'punish_multi_play') {
    if (battle.playerCardsPlayedThisTurn >= intent.threshold) {
      enemy.block += intent.block;
      events.push({ type: 'BLOCK_GAINED', unitId: enemyUnitId, value: intent.block });
    }
    monster.moveHistory.push('punish_multi_play');
    return;
  }

  if (intent.type === 'attack_buff') {
    dealDamageTo(battle, enemyUnitId, player, intent.attack, events);
    addStatusStacks(enemy, intent.statusId, intent.value);
    events.push({
      type: 'STATUS_APPLIED',
      unitId: enemyUnitId,
      statusId: intent.statusId,
      value: getStatusStacks(enemy, intent.statusId),
    });
    monster.moveHistory.push('attack_buff');
  }
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
  events.push({ type: 'TURN_ENDED', unitId: battle.playerUnitId });
  runOnTurnEnd(battle);

  battle.phase = 'enemy_turn';
  const player = battle.units[battle.playerUnitId];
  if (!player) return;
  for (const eid of battle.enemyUnitIds) {
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
  battle.turn += 1;
  runOnTurnStart(battle);
  events.push({ type: 'TURN_STARTED', turn: battle.turn, unitId: battle.playerUnitId });
  player.block = 0;
  battle.player.energy = battle.player.maxEnergy;
  events.push({ type: 'ENERGY_CHANGED', unitId: battle.playerUnitId, value: battle.player.energy });
  const rng = mulberry32(run.seed ^ battle.turn * 0x1bf58);
  drawUpTo(battle, 5, events, () => rng());
  battle.phase = 'player_action';
}

export function resolveAnimationDoneFlow(run: RunState): void {
  const battle = run.battle;
  if (!battle || battle.inputMode !== 'animation_lock') return;
  battle.lastResolvedEvents = [];
  battle.pendingAction = null;
  battle.inputMode = 'idle';
}
