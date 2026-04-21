import { addStatusStacks, decayStatus, getStatusStacks } from '../../combat/statusCombat';
import { CARD_DEFINITIONS } from '../../definitions/cards/starter';
import { STATUS_MOMENTUM } from '../../definitions/statuses';
import type { GameCommand } from '../../commands/types';
import type { GameEvent } from '../../events/types';
import type { BattleState } from '../../model/battle';
import type {
  EffectDefinition,
  MomentumBurstDamageParams,
  MomentumBurstDrawParams,
} from '../../model/card';
import type { RunState } from '../../model/run';
import { runOnAfterPlayCard } from '../status/statusHooks';
import { mulberry32 } from '../../utils/rng';
import { shuffleInPlace } from '../../utils/shuffle';
import { applyEnemyReactionToPlayerCard, dealDamageToUnit } from '../enemy/runtimeHooks';

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
    events.push({ type: 'CARD_DRAWN', unitId: battle.playerUnitId, cardInstanceId: id });
  }
}

function readMomentumBurstParams(params: unknown): MomentumBurstDamageParams | null {
  if (!params || typeof params !== 'object') return null;
  const raw = params as Partial<MomentumBurstDamageParams>;
  if (raw.consumeMode !== 'all' && raw.consumeMode !== 'fixed') return null;
  if (typeof raw.baseDamage !== 'number' || typeof raw.damagePerStack !== 'number') return null;
  if (raw.consumeMode === 'fixed' && typeof raw.consumeValue !== 'number') return null;
  return raw as MomentumBurstDamageParams;
}

function readMomentumBurstDrawParams(params: unknown): MomentumBurstDrawParams | null {
  if (!params || typeof params !== 'object') return null;
  const raw = params as Partial<MomentumBurstDrawParams>;
  if (raw.consumeMode !== 'all' && raw.consumeMode !== 'fixed') return null;
  if (typeof raw.baseDraw !== 'number' || typeof raw.drawPerStack !== 'number') return null;
  if (raw.consumeMode === 'fixed' && typeof raw.consumeValue !== 'number') return null;
  return raw as MomentumBurstDrawParams;
}

function applyMomentumBurstDamage(
  battle: BattleState,
  sourceUnitId: string,
  targetUnitId: string | undefined,
  params: MomentumBurstDamageParams,
  relicIds: string[],
  events: GameEvent[],
): void {
  if (!targetUnitId) return;
  const source = battle.units[sourceUnitId];
  const target = battle.units[targetUnitId];
  if (!source || !target) return;

  const currentStacks = getStatusStacks(source, STATUS_MOMENTUM);
  const requestedConsume =
    params.consumeMode === 'all' ? currentStacks : Math.max(0, params.consumeValue ?? 0);
  const consumedStacks = Math.min(currentStacks, requestedConsume);

  if (consumedStacks > 0) {
    decayStatus(source, STATUS_MOMENTUM, consumedStacks);
  }

  const relicBonus =
    (relicIds.includes('burst_emblem') ? 2 : 0)
    + (relicIds.includes('sighted_edge') ? consumedStacks : 0);
  const damage = params.baseDamage + consumedStacks * params.damagePerStack + relicBonus;
  dealDamageToUnit(battle, sourceUnitId, targetUnitId, damage, events);
  if (relicIds.includes('quick_fuse')) {
    battle.player.energy += 1;
    events.push({ type: 'ENERGY_CHANGED', unitId: battle.playerUnitId, value: battle.player.energy });
  }
}

function applyMomentumBurstDraw(
  battle: BattleState,
  sourceUnitId: string,
  params: MomentumBurstDrawParams,
  relicIds: string[],
  events: GameEvent[],
  random: () => number,
): void {
  const source = battle.units[sourceUnitId];
  if (!source) return;

  const currentStacks = getStatusStacks(source, STATUS_MOMENTUM);
  const requestedConsume =
    params.consumeMode === 'all' ? currentStacks : Math.max(0, params.consumeValue ?? 0);
  const consumedStacks = Math.min(currentStacks, requestedConsume);

  if (consumedStacks > 0) {
    decayStatus(source, STATUS_MOMENTUM, consumedStacks);
  }

  const relicBonus = relicIds.includes('insight_lens') ? 1 : 0;
  const drawCount = params.baseDraw + consumedStacks * params.drawPerStack + relicBonus;
  drawAdditionalCards(battle, drawCount, events, random);
}

function applyEffects(
  battle: BattleState,
  effects: EffectDefinition[],
  relicIds: string[],
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
          if (t?.alive) dealDamageToUnit(battle, sourceUnitId, eid, e.value, events);
        }
      } else {
        const tid = e.target === 'selected' ? targetUnitId : e.target === 'self' ? sourceUnitId : battle.enemyUnitIds[0];
        if (!tid) continue;
        const t = battle.units[tid];
        if (!t) continue;
        dealDamageToUnit(battle, sourceUnitId, tid, e.value, events);
      }
    } else if (e.type === 'block') {
      const tid = e.target === 'self' ? sourceUnitId : targetUnitId;
      if (!tid) continue;
      const t = battle.units[tid];
      if (!t) continue;
      t.block += e.value;
      events.push({ type: 'BLOCK_GAINED', unitId: tid, value: e.value });
    } else if (e.type === 'apply_status') {
      if (e.target === 'all_enemies') {
        for (const eid of battle.enemyUnitIds) {
          const t = battle.units[eid];
          if (!t?.alive) continue;
          addStatusStacks(t, e.statusId, e.stacks);
          events.push({ type: 'STATUS_APPLIED', unitId: eid, statusId: e.statusId, value: getStatusStacks(t, e.statusId) });
        }
      } else {
        const tid = e.target === 'self' ? battle.playerUnitId : targetUnitId;
        if (!tid) continue;
        const t = battle.units[tid];
        if (!t) continue;
        addStatusStacks(t, e.statusId, e.stacks);
        events.push({ type: 'STATUS_APPLIED', unitId: tid, statusId: e.statusId, value: getStatusStacks(t, e.statusId) });
      }
    } else if (e.type === 'draw') drawAdditionalCards(battle, e.value, events, random);
    else if (e.type === 'gain_energy') {
      battle.player.energy += e.value;
      events.push({ type: 'ENERGY_CHANGED', unitId: battle.playerUnitId, value: battle.player.energy });
    } else if (e.type === 'discard') {
      for (let i = 0; i < e.value; i++) {
        const hand = battle.player.hand;
        if (hand.length === 0) break;
        const idx = Math.floor(random() * hand.length);
        const [picked] = hand.splice(idx, 1);
        if (picked) battle.player.discardPile.push(picked);
      }
    } else if (e.type === 'heal') {
      const tid = e.target === 'self' ? sourceUnitId : targetUnitId;
      if (!tid) continue;
      const t = battle.units[tid];
      if (!t) continue;
      t.hp = Math.min(t.maxHp, t.hp + e.value);
    } else if (e.type === 'repeat') {
      const times = Math.max(0, e.times | 0);
      for (let i = 0; i < times; i++) applyEffects(battle, e.effects, relicIds, sourceUnitId, targetUnitId, events, random);
    } else if (e.type === 'custom') {
      if (e.scriptId === 'momentum_burst_damage') {
        const params = readMomentumBurstParams(e.params);
        if (!params) continue;
        applyMomentumBurstDamage(battle, sourceUnitId, targetUnitId, params, relicIds, events);
      } else if (e.scriptId === 'momentum_burst_draw') {
        const params = readMomentumBurstDrawParams(e.params);
        if (!params) continue;
        applyMomentumBurstDraw(battle, sourceUnitId, params, relicIds, events, random);
      }
    }
  }
  if (playerUnit && !playerUnit.alive) events.push({ type: 'BATTLE_LOST' });
  const allDead = battle.enemyUnitIds.every((id) => !battle.units[id]?.alive);
  if (allDead) events.push({ type: 'BATTLE_WON' });
}

function shouldSkipMomentumAutoConsume(effects: EffectDefinition[]): boolean {
  return effects.some(
    (effect) =>
      effect.type === 'custom' &&
      (effect.scriptId === 'momentum_burst_damage' || effect.scriptId === 'momentum_burst_draw'),
  );
}

export function playCardFlow(
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
  if (battle.player.lockedCardInstanceIds.includes(cardInstanceId)) return;
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
  } else if (battle.inputMode === 'selecting_target') return;
  if (def.target === 'all_enemies' && targetUnitId) return;

  const eventStart = events.length;
  battle.player.energy -= card.costForTurn;
  events.push({ type: 'ENERGY_CHANGED', unitId: battle.playerUnitId, value: battle.player.energy });
  battle.player.hand = battle.player.hand.filter((id) => id !== cardInstanceId);
  battle.player.discardPile.push(cardInstanceId);
  battle.playerCardsPlayedThisTurn += 1;
  events.push({ type: 'CARD_PLAYED', unitId: sourceUnitId, cardInstanceId, targetUnitId });
  const effectRng = mulberry32((run.seed ^ battle.turn * 0xc001d ^ cardInstanceId.length * 0x9e37) >>> 0);
  applyEffects(battle, def.effects, run.meta.relics, sourceUnitId, targetUnitId, events, () => effectRng());
  // 规则固定：卡牌主效果全部结算完成后，再执行 after-play hook。
  runOnAfterPlayCard(battle, {
    card,
    sourceUnitId,
    events,
    skipMomentumAutoConsume: shouldSkipMomentumAutoConsume(def.effects),
  });
  for (const enemyUnitId of battle.enemyUnitIds) {
    applyEnemyReactionToPlayerCard(
      battle,
      enemyUnitId,
      def.type === 'attack',
      battle.playerCardsPlayedThisTurn,
      events,
    );
  }
  if (events.some((e) => e.type === 'BATTLE_WON')) battle.phase = 'victory';
  if (events.some((e) => e.type === 'BATTLE_LOST')) battle.phase = 'defeat';
  battle.pendingAction = null;
  const resolved = events.slice(eventStart);
  battle.lastResolvedEvents = resolved;
  battle.inputMode = resolved.length > 0 ? 'animation_lock' : 'idle';
}
