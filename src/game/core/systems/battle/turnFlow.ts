import type { GameEvent } from '../../events/types';
import type { BattleState } from '../../model/battle';
import type { RunState } from '../../model/run';
import type { CombatUnit } from '../../model/unit';
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
    const enemy = battle.units[eid];
    const monster = battle.monsters[eid];
    if (!enemy?.alive || !monster?.intent || monster.intent.type !== 'attack') continue;
    dealDamageTo(battle, eid, player, monster.intent.value, events);
    monster.moveHistory.push('attack');
    refreshEnemyIntent(battle, eid);
    if (!player.alive) break;
  }

  if (!player.alive) {
    events.push({ type: 'BATTLE_LOST' });
    battle.phase = 'defeat';
    syncRunPlayerFromBattle(run);
    return;
  }

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
