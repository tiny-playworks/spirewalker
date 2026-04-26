import { addStatusStacks, decayStatus, getStatusStacks } from '../../combat/statusCombat';
import { CARD_DEFINITIONS } from '../../definitions/cards/starter';
import { STATUS_MOMENTUM, STATUS_PRIMED_BREAK } from '../../definitions/statuses';
import type { GameCommand } from '../../commands/types';
import type { GameEvent } from '../../events/types';
import type { BattleState } from '../../model/battle';
import type {
  CardType,
  EffectDefinition,
  MomentumBurstDamageParams,
  MomentumBurstDrawParams,
  MomentumConditionalDrawParams,
  MomentumGuardByStacksParams,
} from '../../model/card';
import type { RunState } from '../../model/run';
import { applyEnemyReactionToPlayerCard, dealDamageToUnit } from '../enemy/runtimeHooks';

function pickRandomLivingEnemyId(battle: BattleState, random: () => number): string | undefined {
  const living = battle.enemyUnitIds.filter((id) => battle.units[id]?.alive);
  if (living.length === 0) return undefined;
  return living[Math.floor(random() * living.length)]!;
}

function notifyCardExhausted(battle: BattleState, relicIds: string[]): void {
  battle.playerExhaustedCardThisTurn = true;
  if (relicIds.includes('blaze_core')) {
    battle.blazeCoreAttackBonus += 2;
  }
}

export interface CardEffectContext {
  cardType: CardType;
  fractureDoubleAttack: boolean;
}
import { runOnAfterPlayCard } from '../status/statusHooks';
import { mulberry32 } from '../../utils/rng';
import { shuffleInPlace } from '../../utils/shuffle';

function drawAdditionalCards(
  battle: BattleState,
  n: number,
  events: GameEvent[],
  random: () => number,
): void {
  for (let i = 0; i < n; i++) {
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

function readMomentumGuardByStacksParams(params: unknown): MomentumGuardByStacksParams | null {
  if (!params || typeof params !== 'object') return null;
  const raw = params as Partial<MomentumGuardByStacksParams>;
  if (typeof raw.baseBlock !== 'number' || typeof raw.blockPerStack !== 'number') return null;
  return raw as MomentumGuardByStacksParams;
}

function readMomentumConditionalDrawParams(params: unknown): MomentumConditionalDrawParams | null {
  if (!params || typeof params !== 'object') return null;
  const raw = params as Partial<MomentumConditionalDrawParams>;
  if (typeof raw.drawIfNoMomentumConsume !== 'number') return null;
  if (
    raw.momentumIfNoMomentumConsume !== undefined
    && typeof raw.momentumIfNoMomentumConsume !== 'number'
  ) return null;
  return raw as MomentumConditionalDrawParams;
}

function consumePrimedBreakBonus(
  battle: BattleState,
  sourceUnitId: string,
  kind: 'damage' | 'draw',
): number {
  const source = battle.units[sourceUnitId];
  if (!source) return 0;
  const stacks = getStatusStacks(source, STATUS_PRIMED_BREAK);
  if (stacks <= 0) return 0;
  decayStatus(source, STATUS_PRIMED_BREAK, 1);
  return kind === 'damage' ? 4 : 1;
}

function grantEnergy(
  battle: BattleState,
  amount: number,
  events: GameEvent[],
): void {
  if (amount <= 0) return;
  battle.player.energy += amount;
  events.push({ type: 'ENERGY_CHANGED', unitId: battle.playerUnitId, value: battle.player.energy });
}

function applyMomentumBurstDamage(
  battle: BattleState,
  sourceUnitId: string,
  targetUnitId: string | undefined,
  params: MomentumBurstDamageParams,
  relicIds: string[],
  events: GameEvent[],
  random: () => number,
  effectCtx?: CardEffectContext,
): void {
  if (!targetUnitId) return;
  const source = battle.units[sourceUnitId];
  const target = battle.units[targetUnitId];
  if (!source || !target) return;

  const currentStacks = getStatusStacks(source, STATUS_MOMENTUM);
  const requestedConsume =
    params.consumeMode === 'all' ? currentStacks : Math.max(0, params.consumeValue ?? 0);
  const consumedStacks = Math.min(currentStacks, requestedConsume);
  const firstConsumeThisTurn = consumedStacks > 0 && !battle.playerConsumedMomentumThisTurn;

  if (consumedStacks > 0) {
    decayStatus(source, STATUS_MOMENTUM, consumedStacks);
    battle.playerConsumedMomentumThisTurn = true;
  }

  const primedBonus = consumedStacks > 0 ? consumePrimedBreakBonus(battle, sourceUnitId, 'damage') : 0;
  const relicBonus =
    (relicIds.includes('burst_emblem') ? 2 : 0)
    + (relicIds.includes('sighted_edge') ? consumedStacks : 0);
  let damage = params.baseDamage + consumedStacks * params.damagePerStack + primedBonus + relicBonus;
  if (effectCtx?.cardType === 'attack') {
    damage += battle.blazeCoreAttackBonus;
    if (effectCtx.fractureDoubleAttack) damage *= 2;
    if (battle.twinCoreNextAttackBonus > 0) {
      damage += battle.twinCoreNextAttackBonus;
      battle.twinCoreNextAttackBonus = 0;
    }
  }
  dealDamageToUnit(battle, sourceUnitId, targetUnitId, damage, events);

  if (consumedStacks > 0 && relicIds.includes('burst_emblem') && firstConsumeThisTurn) {
    drawAdditionalCards(battle, 1, events, random);
  }
  if (consumedStacks > 0 && typeof params.gainEnergyIfConsumed === 'number') {
    grantEnergy(battle, params.gainEnergyIfConsumed, events);
  }
  if (consumedStacks > 0 && (relicIds.includes('quick_fuse') || relicIds.includes('flare_banner')) && firstConsumeThisTurn) {
    grantEnergy(battle, 1, events);
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
  const firstConsumeThisTurn = consumedStacks > 0 && !battle.playerConsumedMomentumThisTurn;

  if (consumedStacks > 0) {
    decayStatus(source, STATUS_MOMENTUM, consumedStacks);
    battle.playerConsumedMomentumThisTurn = true;
  }

  const primedBonus = consumedStacks > 0 ? consumePrimedBreakBonus(battle, sourceUnitId, 'draw') : 0;
  const relicBonus = relicIds.includes('insight_lens') ? 1 : 0;
  const drawCount = params.baseDraw + consumedStacks * params.drawPerStack + primedBonus + relicBonus;
  drawAdditionalCards(battle, drawCount, events, random);

  if (consumedStacks > 0 && (relicIds.includes('quick_fuse') || relicIds.includes('flare_banner')) && firstConsumeThisTurn) {
    grantEnergy(battle, 1, events);
  }
}

function applyMomentumGuardByStacks(
  battle: BattleState,
  sourceUnitId: string,
  params: MomentumGuardByStacksParams,
  relicIds: string[],
  events: GameEvent[],
): void {
  const source = battle.units[sourceUnitId];
  if (!source) return;
  const stacks = getStatusStacks(source, STATUS_MOMENTUM);
  let blockGain = params.baseBlock + stacks * params.blockPerStack;
  if (sourceUnitId === battle.playerUnitId && relicIds.includes('iron_heart')) {
    blockGain += 2;
  }
  if (blockGain <= 0) return;
  source.block += blockGain;
  events.push({ type: 'BLOCK_GAINED', unitId: sourceUnitId, value: blockGain });
  if (sourceUnitId === battle.playerUnitId) {
    battle.playerGainedBlockThisTurn = true;
    if (relicIds.includes('twin_core') && !battle.twinCoreFirstBlockUsed) {
      battle.twinCoreFirstBlockUsed = true;
      battle.twinCoreNextAttackBonus = 5;
    }
  }
}

function applyEffects(
  battle: BattleState,
  effects: EffectDefinition[],
  relicIds: string[],
  sourceUnitId: string,
  targetUnitId: string | undefined,
  events: GameEvent[],
  random: () => number,
  effectCtx?: CardEffectContext,
): void {
  const playerUnit = battle.units[battle.playerUnitId];
  for (const e of effects) {
    if (e.type === 'damage') {
      let dmg = e.value;
      if (effectCtx?.cardType === 'attack') {
        dmg += battle.blazeCoreAttackBonus;
        if (effectCtx.fractureDoubleAttack) dmg *= 2;
        if (battle.twinCoreNextAttackBonus > 0) {
          dmg += battle.twinCoreNextAttackBonus;
          battle.twinCoreNextAttackBonus = 0;
        }
      } else if (effectCtx?.cardType === 'skill' || effectCtx?.cardType === 'power') {
        if (battle.twinCoreNextSkillBonus > 0) {
          dmg += battle.twinCoreNextSkillBonus;
          battle.twinCoreNextSkillBonus = 0;
        }
      }
      if (e.target === 'all_enemies') {
        for (const enemyUnitId of battle.enemyUnitIds) {
          const target = battle.units[enemyUnitId];
          if (target?.alive) dealDamageToUnit(battle, sourceUnitId, enemyUnitId, dmg, events);
        }
      } else {
        const targetId =
          e.target === 'selected'
            ? targetUnitId
            : e.target === 'self'
              ? sourceUnitId
              : battle.enemyUnitIds[0];
        if (!targetId) continue;
        const target = battle.units[targetId];
        if (!target) continue;
        dealDamageToUnit(battle, sourceUnitId, targetId, dmg, events);
      }
    } else if (e.type === 'block') {
      const targetId = e.target === 'self' ? sourceUnitId : targetUnitId;
      if (!targetId) continue;
      const target = battle.units[targetId];
      if (!target) continue;
      let amount = e.value;
      if (targetId === battle.playerUnitId && relicIds.includes('iron_heart')) {
        amount += 2;
      }
      if (
        targetId === battle.playerUnitId
        && battle.twinCoreNextSkillBonus > 0
        && effectCtx
        && (effectCtx.cardType === 'skill' || effectCtx.cardType === 'power')
      ) {
        amount += battle.twinCoreNextSkillBonus;
        battle.twinCoreNextSkillBonus = 0;
      }
      target.block += amount;
      events.push({ type: 'BLOCK_GAINED', unitId: targetId, value: amount });
      if (targetId === battle.playerUnitId) {
        battle.playerGainedBlockThisTurn = true;
        if (relicIds.includes('twin_core') && !battle.twinCoreFirstBlockUsed) {
          battle.twinCoreFirstBlockUsed = true;
          battle.twinCoreNextAttackBonus = 5;
        }
      }
    } else if (e.type === 'apply_status') {
      if (e.target === 'all_enemies') {
        for (const enemyUnitId of battle.enemyUnitIds) {
          const target = battle.units[enemyUnitId];
          if (!target?.alive) continue;
          addStatusStacks(target, e.statusId, e.stacks);
          events.push({ type: 'STATUS_APPLIED', unitId: enemyUnitId, statusId: e.statusId, value: getStatusStacks(target, e.statusId) });
        }
      } else {
        const targetId = e.target === 'self' ? battle.playerUnitId : targetUnitId;
        if (!targetId) continue;
        const target = battle.units[targetId];
        if (!target) continue;
        addStatusStacks(target, e.statusId, e.stacks);
        events.push({ type: 'STATUS_APPLIED', unitId: targetId, statusId: e.statusId, value: getStatusStacks(target, e.statusId) });
      }
    } else if (e.type === 'draw') {
      drawAdditionalCards(battle, e.value, events, random);
    } else if (e.type === 'gain_energy') {
      grantEnergy(battle, e.value, events);
    } else if (e.type === 'discard') {
      for (let i = 0; i < e.value; i++) {
        const hand = battle.player.hand;
        if (hand.length === 0) break;
        const index = Math.floor(random() * hand.length);
        const [picked] = hand.splice(index, 1);
        if (picked) battle.player.discardPile.push(picked);
      }
    } else if (e.type === 'heal') {
      const targetId = e.target === 'self' ? sourceUnitId : targetUnitId;
      if (!targetId) continue;
      const target = battle.units[targetId];
      if (!target) continue;
      target.hp = Math.min(target.maxHp, target.hp + e.value);
    } else if (e.type === 'repeat') {
      const times = Math.max(0, e.times | 0);
      for (let i = 0; i < times; i += 1) {
        applyEffects(battle, e.effects, relicIds, sourceUnitId, targetUnitId, events, random, effectCtx);
      }
    } else if (e.type === 'custom') {
      if (e.scriptId === 'momentum_burst_damage') {
        const params = readMomentumBurstParams(e.params);
        if (!params) continue;
        applyMomentumBurstDamage(battle, sourceUnitId, targetUnitId, params, relicIds, events, random, effectCtx);
      } else if (e.scriptId === 'momentum_burst_draw') {
        const params = readMomentumBurstDrawParams(e.params);
        if (!params) continue;
        applyMomentumBurstDraw(battle, sourceUnitId, params, relicIds, events, random);
      } else if (e.scriptId === 'momentum_guard_by_stacks') {
        const params = readMomentumGuardByStacksParams(e.params);
        if (!params) continue;
        applyMomentumGuardByStacks(battle, sourceUnitId, params, relicIds, events);
      } else if (e.scriptId === 'overload_exhaust_attacks') {
        const handIds = [...battle.player.hand];
        for (const cid of handIds) {
          const inst = battle.player.cards[cid];
          if (!inst) continue;
          const cdef = CARD_DEFINITIONS[inst.definitionId];
          if (!cdef || cdef.type !== 'attack') continue;
          battle.player.hand = battle.player.hand.filter((id) => id !== cid);
          battle.player.exhaustPile.push(cid);
          events.push({ type: 'CARD_EXHAUSTED', unitId: sourceUnitId, cardInstanceId: cid });
          notifyCardExhausted(battle, relicIds);
          const eid = pickRandomLivingEnemyId(battle, random);
          if (eid) dealDamageToUnit(battle, sourceUnitId, eid, 8, events);
        }
      } else if (e.scriptId === 'blood_rush_strike') {
        if (!targetUnitId) continue;
        let dmg = battle.playerExhaustedCardThisTurn ? 16 : 6;
        if (effectCtx?.cardType === 'attack') {
          dmg += battle.blazeCoreAttackBonus;
          if (effectCtx.fractureDoubleAttack) dmg *= 2;
          if (battle.twinCoreNextAttackBonus > 0) {
            dmg += battle.twinCoreNextAttackBonus;
            battle.twinCoreNextAttackBonus = 0;
          }
        }
        dealDamageToUnit(battle, sourceUnitId, targetUnitId, dmg, events);
      } else if (e.scriptId === 'fortify_convert_flag') {
        battle.pendingFortifyConvert = true;
      } else if (e.scriptId === 'flow_shift') {
        if (battle.prevTurnPlayerPlayedAttack) {
          const player = battle.units[battle.playerUnitId];
          if (player) {
            let block = 12;
            if (relicIds.includes('iron_heart')) block += 2;
            player.block += block;
            events.push({ type: 'BLOCK_GAINED', unitId: battle.playerUnitId, value: block });
            battle.playerGainedBlockThisTurn = true;
            if (relicIds.includes('twin_core') && !battle.twinCoreFirstBlockUsed) {
              battle.twinCoreFirstBlockUsed = true;
              battle.twinCoreNextAttackBonus = 5;
            }
          }
        } else {
          const eid = pickRandomLivingEnemyId(battle, random);
          if (eid) dealDamageToUnit(battle, sourceUnitId, eid, 12, events);
        }
      } else if (e.scriptId === 'balance_edge') {
        if (!targetUnitId) continue;
        let dmg = 8;
        if (battle.playerGainedBlockThisTurn) dmg += 8;
        if (effectCtx?.cardType === 'attack') {
          dmg += battle.blazeCoreAttackBonus;
          if (effectCtx.fractureDoubleAttack) dmg *= 2;
          if (battle.twinCoreNextAttackBonus > 0) {
            dmg += battle.twinCoreNextAttackBonus;
            battle.twinCoreNextAttackBonus = 0;
          }
        }
        dealDamageToUnit(battle, sourceUnitId, targetUnitId, dmg, events);
      } else if (e.scriptId === 'momentum_conditional_draw') {
        const params = readMomentumConditionalDrawParams(e.params);
        if (!params) continue;
        if (!battle.playerConsumedMomentumThisTurn) {
          drawAdditionalCards(battle, params.drawIfNoMomentumConsume, events, random);
          if ((params.momentumIfNoMomentumConsume ?? 0) > 0) {
            addStatusStacks(battle.units[battle.playerUnitId]!, STATUS_MOMENTUM, params.momentumIfNoMomentumConsume!);
            events.push({
              type: 'STATUS_APPLIED',
              unitId: battle.playerUnitId,
              statusId: STATUS_MOMENTUM,
              value: getStatusStacks(battle.units[battle.playerUnitId]!, STATUS_MOMENTUM),
            });
          }
        }
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
      effect.type === 'custom'
      && (effect.scriptId === 'momentum_burst_damage' || effect.scriptId === 'momentum_burst_draw'),
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
    const target = battle.units[targetUnitId];
    if (!target || target.side !== 'enemy' || !target.alive) return;
    if (!battle.enemyUnitIds.includes(targetUnitId)) return;
  } else if (battle.inputMode === 'selecting_target') {
    return;
  }
  if (def.target === 'all_enemies' && targetUnitId) return;

  const eventStart = events.length;
  const hadSkillBefore = battle.playerPlayedSkillThisTurn;
  const hadAttackBefore = battle.playerPlayedAttackThisTurn;
  const isAttack = def.type === 'attack';
  const isFirstAttackThisTurn = isAttack && battle.playerAttacksPlayedThisTurn === 0;
  const useFractureExhaust =
    run.meta.relics.includes('fractured_blade') && isFirstAttackThisTurn;

  battle.player.energy -= card.costForTurn;
  events.push({ type: 'ENERGY_CHANGED', unitId: battle.playerUnitId, value: battle.player.energy });
  battle.player.hand = battle.player.hand.filter((id) => id !== cardInstanceId);
  if (def.exhaustOnPlay || useFractureExhaust) {
    battle.player.exhaustPile.push(cardInstanceId);
    events.push({ type: 'CARD_EXHAUSTED', unitId: sourceUnitId, cardInstanceId });
    notifyCardExhausted(battle, run.meta.relics);
  } else {
    battle.player.discardPile.push(cardInstanceId);
  }

  if (isAttack && run.meta.relics.includes('twin_core') && isFirstAttackThisTurn) {
    battle.twinCoreFirstAttackUsed = true;
    battle.twinCoreNextSkillBonus = 5;
  }
  if (isAttack) {
    battle.playerAttacksPlayedThisTurn += 1;
    battle.playerPlayedAttackThisTurn = true;
  }
  if (def.type === 'skill' || def.type === 'power') {
    battle.playerPlayedSkillThisTurn = true;
  }

  battle.playerCardsPlayedThisTurn += 1;
  events.push({ type: 'CARD_PLAYED', unitId: sourceUnitId, cardInstanceId, targetUnitId });
  const effectRng = mulberry32((run.seed ^ battle.turn * 0xc001d ^ cardInstanceId.length * 0x9e37) >>> 0);
  applyEffects(
    battle,
    def.effects,
    run.meta.relics,
    sourceUnitId,
    targetUnitId,
    events,
    () => effectRng(),
    { cardType: def.type, fractureDoubleAttack: useFractureExhaust },
  );

  if (
    run.meta.relics.includes('harmony_emblem')
    && !battle.harmonyEmblemTriggeredThisTurn
    && ((def.type === 'attack' && hadSkillBefore)
      || ((def.type === 'skill' || def.type === 'power') && hadAttackBefore))
  ) {
    battle.harmonyEmblemTriggeredThisTurn = true;
    drawAdditionalCards(battle, 1, events, () => effectRng());
    grantEnergy(battle, 1, events);
  }

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
  if (events.some((event) => event.type === 'BATTLE_WON')) battle.phase = 'victory';
  if (events.some((event) => event.type === 'BATTLE_LOST')) battle.phase = 'defeat';
  battle.pendingAction = null;
  const resolved = events.slice(eventStart);
  battle.lastResolvedEvents = resolved;
  battle.inputMode = resolved.length > 0 ? 'animation_lock' : 'idle';
}
