import {
  addStatusStacks,
  decayStatus,
  getStatusStacks,
  modifyIncomingAttackDamage,
  modifyOutgoingAttackDamage,
} from '../combat/statusCombat';
import { CARD_DEFINITIONS } from '../definitions/cards/starter';
import { STATUS_VULNERABLE, STATUS_WEAK } from '../definitions/statuses';
import type { GameCommand } from '../commands/types';
import type { GameEvent } from '../events/types';
import type { BattleState } from '../model/battle';
import type { EffectDefinition } from '../model/card';
import type { RunState } from '../model/run';
import type { CombatUnit } from '../model/unit';
import { mulberry32 } from '../utils/rng';
import { shuffleInPlace } from '../utils/shuffle';
import { resolveEventOptionFlow } from './flows/eventFlow';
import { chooseMapNodeFlow } from './flows/mapFlow';
import { leaveBattleToRewardFlow, selectRewardCardFlow, takeRewardGoldFlow } from './flows/postBattleFlow';
import { usePotionFlow } from './flows/potionFlow';
import { leaveRestToMapFlow } from './flows/restFlow';
import {
  buyShopCardFlow,
  buyShopPotionFlow,
  buyShopRelicFlow,
  buyShopRemoveCardFlow,
  leaveShopToMapFlow,
} from './flows/shopFlow';
import { applyGameOverIfDefeat, syncRunPlayerFromBattle } from './flows/shared';

export interface EngineResult {
  nextRun: RunState;
  events: GameEvent[];
}

function nextEnemyDamage(moveCount: number): number {
  return moveCount % 2 === 0 ? 6 : 9;
}

function refreshEnemyIntent(battle: BattleState, enemyUnitId: string): void {
  const m = battle.monsters[enemyUnitId];
  if (m) {
    m.intent = { type: 'attack', value: nextEnemyDamage(m.moveHistory.length) };
  }
}

function tickEndOfPlayerTurnStatuses(battle: BattleState): void {
  const p = battle.units[battle.playerUnitId];
  if (p) decayStatus(p, STATUS_WEAK, 1);
  for (const eid of battle.enemyUnitIds) {
    const u = battle.units[eid];
    if (u) decayStatus(u, STATUS_VULNERABLE, 1);
  }
}

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
    events.push({
      type: 'CARD_DRAWN',
      unitId: battle.playerUnitId,
      cardInstanceId: id,
    });
    need -= 1;
  }
}

/** 出牌效果用：额外抽 n 张（与当前手牌目标张数无关） */
function drawAdditionalCards(
  battle: BattleState,
  n: number,
  events: GameEvent[],
  random: () => number,
): void {
  for (let i = 0; i < n; i++) {
    if (battle.player.drawPile.length === 0) {
      if (battle.player.discardPile.length === 0) break;
      battle.player.drawPile = [...battle.player.discardPile];
      battle.player.discardPile = [];
      shuffleInPlace(battle.player.drawPile, random);
    }
    const id = battle.player.drawPile.shift();
    if (!id) break;
    battle.player.hand.push(id);
    events.push({
      type: 'CARD_DRAWN',
      unitId: battle.playerUnitId,
      cardInstanceId: id,
    });
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
  let remaining = source ? modifyOutgoingAttackDamage(source, baseAmount) : baseAmount;
  remaining = modifyIncomingAttackDamage(target, remaining);

  const blockAbsorb = Math.min(target.block, remaining);
  if (blockAbsorb > 0) {
    target.block -= blockAbsorb;
    remaining -= blockAbsorb;
  }
  const hpLoss = Math.min(target.hp, remaining);
  target.hp -= hpLoss;
  if (hpLoss > 0) {
    events.push({
      type: 'DAMAGE_DEALT',
      sourceUnitId: sourceId,
      targetUnitId: target.id,
      value: hpLoss,
    });
  }
  target.alive = target.hp > 0;
  if (!target.alive) {
    events.push({ type: 'UNIT_DIED', unitId: target.id });
  }
}

function applyEffects(
  battle: BattleState,
  effects: EffectDefinition[],
  sourceUnitId: string,
  targetUnitId: string | undefined,
  events: GameEvent[],
  random: () => number,
): void {
  const playerUnit = battle.units[battle.playerUnitId];
  for (const e of effects) {
    if (e.type === 'damage') {
      if (e.target === 'all_enemies') {
        for (const eid of battle.enemyUnitIds) {
          const t = battle.units[eid];
          if (t?.alive) dealDamageTo(battle, sourceUnitId, t, e.value, events);
        }
      } else {
        const tid =
          e.target === 'selected'
            ? targetUnitId
            : e.target === 'self'
              ? sourceUnitId
              : battle.enemyUnitIds[0];
        if (!tid) continue;
        const t = battle.units[tid];
        if (!t) continue;
        dealDamageTo(battle, sourceUnitId, t, e.value, events);
      }
    } else if (e.type === 'block') {
      const tid = e.target === 'self' ? sourceUnitId : targetUnitId;
      if (!tid) continue;
      const t = battle.units[tid];
      if (!t) continue;
      t.block += e.value;
      events.push({ type: 'BLOCK_GAINED', unitId: tid, value: e.value });
    } else if (e.type === 'apply_status') {
      const tid = e.target === 'self' ? battle.playerUnitId : targetUnitId;
      if (!tid) continue;
      const t = battle.units[tid];
      if (!t) continue;
      addStatusStacks(t, e.statusId, e.stacks);
      events.push({
        type: 'STATUS_APPLIED',
        unitId: tid,
        statusId: e.statusId,
        value: getStatusStacks(t, e.statusId),
      });
    } else if (e.type === 'draw') {
      drawAdditionalCards(battle, e.value, events, random);
    } else if (e.type === 'gain_energy') {
      battle.player.energy += e.value;
      events.push({
        type: 'ENERGY_CHANGED',
        unitId: battle.playerUnitId,
        value: battle.player.energy,
      });
    }
  }
  if (playerUnit && !playerUnit.alive) {
    events.push({ type: 'BATTLE_LOST' });
  }
  const allDead = battle.enemyUnitIds.every((id) => !battle.units[id]?.alive);
  if (allDead) {
    events.push({ type: 'BATTLE_WON' });
  }
}

export class GameEngine {
  dispatch(run: RunState, command: GameCommand): EngineResult {
    const nextRun = structuredClone(run);
    const events: GameEvent[] = [];

    switch (command.type) {
      case 'PLAY_CARD':
        this.playCard(nextRun, command, events);
        break;
      case 'RESOLVE_ANIMATION_DONE':
        this.resolveAnimationDone(nextRun);
        break;
      case 'END_TURN':
        this.endTurn(nextRun, events);
        break;
      case 'CHOOSE_MAP_NODE':
        chooseMapNodeFlow(nextRun, command, events);
        break;
      case 'LEAVE_BATTLE_TO_REWARD':
        leaveBattleToRewardFlow(nextRun, events);
        break;
      case 'SELECT_REWARD_CARD':
        selectRewardCardFlow(nextRun, command, events);
        break;
      case 'TAKE_REWARD_GOLD':
        takeRewardGoldFlow(nextRun, command, events);
        break;
      case 'BUY_SHOP_CARD':
        buyShopCardFlow(nextRun, command, events);
        break;
      case 'BUY_SHOP_RELIC':
        buyShopRelicFlow(nextRun, command, events);
        break;
      case 'BUY_SHOP_REMOVE_CARD':
        buyShopRemoveCardFlow(nextRun, command, events);
        break;
      case 'LEAVE_SHOP_TO_MAP':
        leaveShopToMapFlow(nextRun);
        break;
      case 'LEAVE_REST_TO_MAP':
        leaveRestToMapFlow(nextRun);
        break;
      case 'RESOLVE_EVENT_OPTION':
        resolveEventOptionFlow(nextRun, command, events);
        break;
      case 'USE_POTION':
        usePotionFlow(nextRun, command, events);
        break;
      case 'BUY_SHOP_POTION':
        buyShopPotionFlow(nextRun, command, events);
        break;
      default:
        break;
    }

    syncRunPlayerFromBattle(nextRun);
    applyGameOverIfDefeat(nextRun, events);
    return { nextRun, events };
  }

  private playCard(
    run: RunState,
    command: Extract<GameCommand, { type: 'PLAY_CARD' }>,
    events: GameEvent[],
  ): void {
    const battle = run.battle;
    if (!battle || battle.phase !== 'player_action') return;
    if (battle.inputMode === 'animation_lock') return;

    const { cardInstanceId, sourceUnitId, targetUnitId } = command;
    if (sourceUnitId !== battle.playerUnitId) return;
    if (battle.inputMode === 'selecting_target') {
      const pending = battle.pendingAction;
      if (!pending) return;
      if (pending.cardInstanceId !== cardInstanceId || pending.sourceUnitId !== sourceUnitId) return;
    }
    if (!battle.player.hand.includes(cardInstanceId)) return;

    const card = battle.player.cards[cardInstanceId];
    if (!card) return;

    const def = CARD_DEFINITIONS[card.definitionId];
    if (!def) return;

    if (battle.player.energy < card.costForTurn) return;

    if (def.target === 'single_enemy') {
      if (!targetUnitId) {
        battle.pendingAction = { type: 'play_card', cardInstanceId, sourceUnitId };
        battle.inputMode = 'selecting_target';
        return;
      }
      const t = battle.units[targetUnitId];
      if (!t || t.side !== 'enemy' || !t.alive) return;
      if (!battle.enemyUnitIds.includes(targetUnitId)) return;
    } else if (battle.inputMode === 'selecting_target') {
      return;
    }
    if (def.target === 'all_enemies' && targetUnitId) return;

    const eventStart = events.length;
    battle.player.energy -= card.costForTurn;
    events.push({
      type: 'ENERGY_CHANGED',
      unitId: battle.playerUnitId,
      value: battle.player.energy,
    });

    battle.player.hand = battle.player.hand.filter((id) => id !== cardInstanceId);
    battle.player.discardPile.push(cardInstanceId);

    events.push({
      type: 'CARD_PLAYED',
      unitId: sourceUnitId,
      cardInstanceId,
      targetUnitId,
    });

    const effectRng = mulberry32((run.seed ^ battle.turn * 0xc001d ^ cardInstanceId.length * 0x9e37) >>> 0);
    applyEffects(battle, def.effects, sourceUnitId, targetUnitId, events, () => effectRng());

    if (events.some((e) => e.type === 'BATTLE_WON')) {
      battle.phase = 'victory';
    }
    if (events.some((e) => e.type === 'BATTLE_LOST')) {
      battle.phase = 'defeat';
    }
    battle.pendingAction = null;
    const resolved = events.slice(eventStart);
    battle.lastResolvedEvents = resolved;
    battle.inputMode = resolved.length > 0 ? 'animation_lock' : 'idle';
  }

  private endTurn(run: RunState, events: GameEvent[]): void {
    const battle = run.battle;
    if (!battle || battle.phase !== 'player_action') return;
    if (battle.inputMode === 'animation_lock') return;
    if (battle.inputMode === 'selecting_target') {
      battle.pendingAction = null;
      battle.inputMode = 'idle';
    }

    discardHand(battle);
    events.push({ type: 'TURN_ENDED', unitId: battle.playerUnitId });
    tickEndOfPlayerTurnStatuses(battle);

    battle.phase = 'enemy_turn';
    const player = battle.units[battle.playerUnitId];
    if (!player) return;

    for (const eid of battle.enemyUnitIds) {
      const enemy = battle.units[eid];
      const monster = battle.monsters[eid];
      if (!enemy?.alive || !monster?.intent || monster.intent.type !== 'attack') continue;
      const dmg = monster.intent.value;
      dealDamageTo(battle, eid, player, dmg, events);
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
    events.push({
      type: 'TURN_STARTED',
      turn: battle.turn,
      unitId: battle.playerUnitId,
    });

    player.block = 0;
    battle.player.energy = battle.player.maxEnergy;
    events.push({
      type: 'ENERGY_CHANGED',
      unitId: battle.playerUnitId,
      value: battle.player.energy,
    });

    const rng = mulberry32(run.seed ^ battle.turn * 0x1bf58);
    const random = () => rng();
    drawUpTo(battle, 5, events, random);

    battle.phase = 'player_action';
  }

  private resolveAnimationDone(run: RunState): void {
    const battle = run.battle;
    if (!battle || battle.inputMode !== 'animation_lock') return;
    battle.lastResolvedEvents = [];
    battle.pendingAction = null;
    battle.inputMode = 'idle';
  }

}
