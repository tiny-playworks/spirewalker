import type { GameEvent } from '../../events/types';
import type { BattleState } from '../../model/battle';
import type { RunState } from '../../model/run';
import { runOnTurnEnd, runOnTurnStart } from '../status/statusHooks';
import { refreshEnemyIntent } from '../enemy/enemyAi';
import { executeMonsterIntent } from '../enemy/intentExecutor';
import { applyStartOfPlayerTurnPressure, tickEnemyCountdown } from '../enemy/runtimeHooks';
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
    need -= 1;
  }
  if (battle.player.pendingHandLocks > 0) {
    const candidates = battle.player.hand.filter((cardId) => !battle.player.lockedCardInstanceIds.includes(cardId));
    battle.player.lockedCardInstanceIds.push(...candidates.slice(0, battle.player.pendingHandLocks));
    battle.player.pendingHandLocks = 0;
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
  events.push({ type: 'TURN_ENDED', unitId: battle.playerUnitId });
  runOnTurnEnd(battle);

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
  battle.turn += 1;
  runOnTurnStart(battle);
  events.push({ type: 'TURN_STARTED', turn: battle.turn, unitId: battle.playerUnitId });
  player.block = 0;
  battle.player.energy = battle.player.maxEnergy;
  events.push({ type: 'ENERGY_CHANGED', unitId: battle.playerUnitId, value: battle.player.energy });
  const drawPenalty = applyStartOfPlayerTurnPressure(battle);
  const rng = mulberry32(run.seed ^ battle.turn * 0x1bf58);
  drawUpTo(battle, Math.max(0, 5 - drawPenalty), events, () => rng());
  battle.phase = 'player_action';
}

export function resolveAnimationDoneFlow(run: RunState): void {
  const battle = run.battle;
  if (!battle || battle.inputMode !== 'animation_lock') return;
  battle.lastResolvedEvents = [];
  battle.pendingAction = null;
  battle.inputMode = 'idle';
}
