import { addStatusStacks, decayStatus, getStatusStacks } from '../../combat/statusCombat';
import { CARD_DEFINITIONS } from '../../definitions/cards';
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
import {
  addRelicAwareStatusStacks,
  applyRelicResourceResult,
  ensureRelicRuntime,
  gainMomentumWithRelics,
  resolveRelicHooks,
} from '../relic/relicHooks';

function pickRandomLivingEnemyId(battle: BattleState, random: () => number): string | undefined {
  const living = battle.enemyUnitIds.filter((id) => battle.units[id]?.alive);
  if (living.length === 0) return undefined;
  return living[Math.floor(random() * living.length)]!;
}

function notifyCardExhausted(
  battle: BattleState,
  relicIds: string[],
  events?: GameEvent[],
): void {
  battle.playerExhaustedCardThisTurn = true;
  const relicResult = resolveRelicHooks(relicIds, {
    battle,
    trigger: 'cardExhausted',
    events,
  });
  battle.blazeCoreAttackBonus += relicResult.damageBonus ?? 0;
  applyRelicResourceResult(battle, relicResult, events);
  const player = battle.units[battle.playerUnitId];
  if (player && relicResult.block) {
    player.block += relicResult.block;
    events?.push({ type: 'BLOCK_GAINED', unitId: battle.playerUnitId, value: relicResult.block });
    battle.playerGainedBlockThisTurn = true;
    battle.playerTurnBlockGained += relicResult.block;
  }
  if (relicResult.nextCardCostReduction) {
    const runtime = ensureRelicRuntime(battle);
    runtime.cardCostReductionThisTurn = (runtime.cardCostReductionThisTurn as number | undefined ?? 0)
      + relicResult.nextCardCostReduction;
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
  relicIds: string[] = battle.relicIds,
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
    const runtime = ensureRelicRuntime(battle);
    const relicResult = resolveRelicHooks(relicIds, {
      battle,
      trigger: 'cardDrawn',
      cardId: battle.player.cards[id]?.definitionId,
      events,
    });
    applyRelicResourceResult(battle, { ...relicResult, momentum: undefined }, events);
    if (relicResult.momentum) {
      const gainResult = gainMomentumWithRelics(battle, relicIds, relicResult.momentum, events);
      applyRelicResourceResult(battle, { ...gainResult, momentum: undefined }, events);
      applyRelicBlockResult(battle, gainResult.block, relicIds, events);
      if (gainResult.draw) drawAdditionalCards(battle, gainResult.draw, events, random, relicIds);
    }
    if (relicResult.block) {
      const player = battle.units[battle.playerUnitId];
      if (player) {
        player.block += relicResult.block;
        battle.playerGainedBlockThisTurn = true;
        battle.playerTurnBlockGained += relicResult.block;
        events.push({ type: 'BLOCK_GAINED', unitId: battle.playerUnitId, value: relicResult.block });
      }
    }
    if (relicIds.includes('draw_power_sigil')) {
      runtime.drawPowerSigilTriggersThisTurn = (runtime.drawPowerSigilTriggersThisTurn as number | undefined ?? 0) + 1;
    }
    if (relicIds.includes('surge_tide')) {
      runtime.surgeTideDrawsThisTurn = (runtime.surgeTideDrawsThisTurn as number | undefined ?? 0) + 1;
    }
    if (relicResult.draw) {
      drawAdditionalCards(battle, relicResult.draw, events, random, relicIds);
    }
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

function applyRelicBlockResult(
  battle: BattleState,
  amount: number | undefined,
  relicIds: string[],
  events: GameEvent[],
): void {
  if (!amount || amount <= 0) return;
  applyBlockGain(battle, battle.playerUnitId, amount, relicIds, events);
}

function applyRelicCombatResult(
  battle: BattleState,
  result: ReturnType<typeof resolveRelicHooks>,
  relicIds: string[],
  events: GameEvent[],
  random: () => number,
  includeDraw = true,
): void {
  applyRelicResourceResult(battle, { ...result, momentum: undefined }, events);
  if (result.momentum) {
    const gainResult = gainMomentumWithRelics(battle, relicIds, result.momentum, events);
    applyRelicResourceResult(battle, { ...gainResult, momentum: undefined }, events);
    applyRelicBlockResult(battle, gainResult.block, relicIds, events);
    if (gainResult.draw) drawAdditionalCards(battle, gainResult.draw, events, random, relicIds);
    if (relicIds.includes('guard_momentum_link')) {
      const runtime = ensureRelicRuntime(battle);
      runtime.guardMomentumLinkCountThisTurn = runtimeNumber(battle, 'guardMomentumLinkCountThisTurn') + 1;
    }
  }
  applyRelicBlockResult(battle, result.block, relicIds, events);
  if (includeDraw && result.draw) drawAdditionalCards(battle, result.draw, events, random, relicIds);
  if (result.nextAttackBonus) {
    battle.twinCoreNextAttackBonus += result.nextAttackBonus;
  }
  if (result.skillBlockBonus) {
    const runtime = ensureRelicRuntime(battle);
    runtime.skillBlockBonus = (runtime.skillBlockBonus as number | undefined ?? 0) + result.skillBlockBonus;
  }
  if (result.turnAttackBonus) {
    const runtime = ensureRelicRuntime(battle);
    runtime.turnAttackBonus = (runtime.turnAttackBonus as number | undefined ?? 0) + result.turnAttackBonus;
  }
  if (result.battleAttackBonus) {
    const runtime = ensureRelicRuntime(battle);
    runtime.battleAttackBonus = (runtime.battleAttackBonus as number | undefined ?? 0) + result.battleAttackBonus;
  }
  if (result.nextCardCostReduction && relicIds.includes('memory_shard')) {
    const runtime = ensureRelicRuntime(battle);
    runtime.memoryShardTriggersThisTurn = runtimeNumber(battle, 'memoryShardTriggersThisTurn') + 1;
  }
}

function consumeMomentumForCardEffect(
  battle: BattleState,
  sourceUnitId: string,
  requestedConsume: number,
  relicIds: string[],
  events: GameEvent[],
  random: () => number,
  options: { momentumKind?: 'damage' | 'draw'; isMomentumAttack?: boolean; includeDraw?: boolean } = {},
): {
  previousMomentum: number;
  consumedStacks: number;
  remainingMomentum: number;
  consumedAll: boolean;
  firstConsumeThisTurn: boolean;
  relicResult: ReturnType<typeof resolveRelicHooks>;
} {
  const source = battle.units[sourceUnitId];
  if (!source) {
    return {
      previousMomentum: 0,
      consumedStacks: 0,
      remainingMomentum: 0,
      consumedAll: false,
      firstConsumeThisTurn: false,
      relicResult: {},
    };
  }

  const previousMomentum = getStatusStacks(source, STATUS_MOMENTUM);
  const firstConsumeThisTurn = previousMomentum > 0 && !battle.playerConsumedMomentumThisTurn;
  const costResult = resolveRelicHooks(relicIds, {
    battle,
    trigger: 'momentumCost',
    events,
    amount: requestedConsume,
    momentumKind: options.momentumKind,
    isMomentumAttack: options.isMomentumAttack,
    firstConsumeThisTurn,
  });
  const adjustedConsume = Math.max(
    0,
    Math.floor(
      (requestedConsume - (costResult.momentumCostReduction ?? 0))
      * (costResult.momentumCostMultiplier ?? 1),
    ),
  );
  const consumedStacks = Math.min(previousMomentum, adjustedConsume);
  const consumedAll = previousMomentum > 0 && consumedStacks >= previousMomentum;
  const runtime = ensureRelicRuntime(battle);

  if (consumedStacks > 0) {
    if (relicIds.includes('cascade_gem') && runtime.cascadeGemArmed) {
      runtime.cascadeGemArmed = false;
    }
    decayStatus(source, STATUS_MOMENTUM, consumedStacks);
    battle.playerConsumedMomentumThisTurn = true;
    battle.playerMomentumConsumedAmountThisTurn += consumedStacks;
    runtime.momentumConsumeCountThisTurn = runtimeNumber(battle, 'momentumConsumeCountThisTurn') + 1;
    runtime.momentumConsumedThisTurn = runtimeNumber(battle, 'momentumConsumedThisTurn') + consumedStacks;
    runtime.momentumConsumedTotal = runtimeNumber(battle, 'momentumConsumedTotal') + consumedStacks;
    if (relicIds.includes('cascade_gem')) runtime.cascadeGemArmed = true;
    events.push({
      type: 'MOMENTUM_CONSUMED',
      unitId: sourceUnitId,
      value: consumedStacks,
      remaining: getStatusStacks(source, STATUS_MOMENTUM),
    });
  }

  const remainingMomentum = getStatusStacks(source, STATUS_MOMENTUM);
  const relicResult = resolveRelicHooks(relicIds, {
    battle,
    trigger: 'momentumConsumed',
    events,
    consumedStacks,
    remainingMomentum,
    previousMomentum,
    consumedAll,
    momentumKind: options.momentumKind,
    isMomentumAttack: options.isMomentumAttack,
    firstConsumeThisTurn,
  });
  applyRelicCombatResult(battle, relicResult, relicIds, events, random, options.includeDraw ?? true);
  return {
    previousMomentum,
    consumedStacks,
    remainingMomentum,
    consumedAll,
    firstConsumeThisTurn,
    relicResult,
  };
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
  const consumption = consumeMomentumForCardEffect(
    battle,
    sourceUnitId,
    requestedConsume,
    relicIds,
    events,
    random,
    { momentumKind: 'damage', isMomentumAttack: true },
  );
  const { consumedStacks, relicResult } = consumption;
  if (relicResult.vulnerableStacks && target.alive) {
    addStatusStacks(target, 'vulnerable', relicResult.vulnerableStacks);
  }

  const primedBonus = consumedStacks > 0 ? consumePrimedBreakBonus(battle, sourceUnitId, 'damage') : 0;
  const relicBonus = relicResult.damageBonus ?? 0;
  let damage = params.baseDamage + consumedStacks * params.damagePerStack + primedBonus + relicBonus;
  if (effectCtx?.cardType === 'attack') {
    damage += battle.blazeCoreAttackBonus;
    if (effectCtx.fractureDoubleAttack) damage *= 2;
    if (battle.twinCoreNextAttackBonus > 0) {
      damage += battle.twinCoreNextAttackBonus;
      battle.twinCoreNextAttackBonus = 0;
    }
  }
  dealDamageToUnit(battle, sourceUnitId, targetUnitId, damage, events, {
    isPlayerAttack: effectCtx?.cardType === 'attack',
    isMomentumAttack: true,
    consumedStacks,
  });
  if (relicResult.damageAllEnemies) {
    for (const enemyId of battle.enemyUnitIds) {
      const enemy = battle.units[enemyId];
      if (enemy?.alive) dealDamageToUnit(battle, sourceUnitId, enemyId, relicResult.damageAllEnemies, events, {
        isPlayerAttack: false,
        isMomentumAttack: true,
        isSecondaryDamage: true,
      });
    }
  }
  if (consumedStacks > 0 && typeof params.gainEnergyIfConsumed === 'number') {
    grantEnergy(battle, params.gainEnergyIfConsumed, events);
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
  const consumption = consumeMomentumForCardEffect(
    battle,
    sourceUnitId,
    requestedConsume,
    relicIds,
    events,
    random,
    { momentumKind: 'draw', includeDraw: false },
  );
  const { consumedStacks, relicResult } = consumption;
  // 抽牌型爆发的 Hook 抽牌已在公共结算中执行，牌面本身只再结算基础抽牌。
  // 这里避免把同一份 relicResult.draw 重复计入。

  const primedBonus = consumedStacks > 0 ? consumePrimedBreakBonus(battle, sourceUnitId, 'draw') : 0;
  const relicBonus = relicResult.draw ?? 0;
  const drawCount = params.baseDraw + consumedStacks * params.drawPerStack + primedBonus + relicBonus;
  drawAdditionalCards(battle, drawCount, events, random);

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
  const blockGain = params.baseBlock + stacks * params.blockPerStack;
  if (blockGain <= 0) return;
  applyBlockGain(battle, sourceUnitId, blockGain, relicIds, events);
}

function applyBlockGain(
  battle: BattleState,
  targetUnitId: string,
  baseAmount: number,
  relicIds: string[],
  events: GameEvent[],
  cardType?: CardType,
): number {
  const target = battle.units[targetUnitId];
  if (!target || baseAmount <= 0) return 0;

  let amount = baseAmount;
  if (targetUnitId === battle.playerUnitId) {
    const runtime = ensureRelicRuntime(battle);
    const relicResult = resolveRelicHooks(relicIds, {
      battle,
      trigger: 'blockGained',
      events,
      amount: baseAmount,
      cardType,
      currentBlock: target.block,
      firstBlockThisTurn: !battle.twinCoreFirstBlockUsed,
    });
    const cardBlockBonus = runtime.currentCardBlockBonus as number | undefined ?? 0;
    const skillBlockBonus = cardType === 'skill' ? runtimeNumber(battle, 'skillBlockBonus') : 0;
    amount = (amount + (relicResult.block ?? 0) + cardBlockBonus + skillBlockBonus)
      * (relicResult.blockMultiplier ?? 1);
    delete runtime.currentCardBlockBonus;
    applyRelicResourceResult(battle, relicResult, events);
    if (relicResult.nextAttackBonus && !battle.twinCoreFirstBlockUsed) {
      battle.twinCoreFirstBlockUsed = true;
      battle.twinCoreNextAttackBonus += relicResult.nextAttackBonus;
    }
  }

  target.block += amount;
  events.push({ type: 'BLOCK_GAINED', unitId: targetUnitId, value: amount });
  if (targetUnitId === battle.playerUnitId) {
    battle.playerGainedBlockThisTurn = true;
    battle.playerTurnBlockGained += amount;
    if (targetUnitId === battle.playerUnitId && relicIds.includes('sanctuary_bell')) {
      const runtime = ensureRelicRuntime(battle);
      const triggers = runtime.sanctuaryBellTriggersThisTurn as number | undefined ?? 0;
      if (battle.playerTurnBlockGained >= 15 && triggers < 2) {
        const sanctuaryResult = resolveRelicHooks(['sanctuary_bell'], {
          battle,
          trigger: 'blockGained',
          amount: 0,
          currentBlock: target.block,
          events,
        });
        applyRelicResourceResult(battle, sanctuaryResult, events);
        runtime.sanctuaryBellTriggersThisTurn = triggers + 1;
      }
    }
  }
  return amount;
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
  const damageContext = { isPlayerAttack: effectCtx?.cardType === 'attack' };
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
          if (target?.alive) {
            dealDamageToUnit(battle, sourceUnitId, enemyUnitId, dmg, events, {
              isPlayerAttack: effectCtx?.cardType === 'attack',
            });
          }
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
        dealDamageToUnit(battle, sourceUnitId, targetId, dmg, events, {
          isPlayerAttack: effectCtx?.cardType === 'attack',
        });
      }
    } else if (e.type === 'block') {
      const targetId = e.target === 'self' ? sourceUnitId : targetUnitId;
      if (!targetId) continue;
      const target = battle.units[targetId];
      if (!target) continue;
      let amount = e.value;
      if (
        targetId === battle.playerUnitId
        && battle.twinCoreNextSkillBonus > 0
        && effectCtx
        && (effectCtx.cardType === 'skill' || effectCtx.cardType === 'power')
      ) {
        amount += battle.twinCoreNextSkillBonus;
        battle.twinCoreNextSkillBonus = 0;
      }
      applyBlockGain(battle, targetId, amount, relicIds, events, effectCtx?.cardType);
    } else if (e.type === 'apply_status') {
      if (e.target === 'all_enemies') {
        for (const enemyUnitId of battle.enemyUnitIds) {
          const target = battle.units[enemyUnitId];
          if (!target?.alive) continue;
          addRelicAwareStatusStacks(battle, enemyUnitId, e.statusId, e.stacks, events, relicIds);
          events.push({ type: 'STATUS_APPLIED', unitId: enemyUnitId, statusId: e.statusId, value: getStatusStacks(target, e.statusId) });
        }
      } else {
        const targetId = e.target === 'self' ? battle.playerUnitId : targetUnitId;
        if (!targetId) continue;
        const target = battle.units[targetId];
        if (!target) continue;
        addRelicAwareStatusStacks(battle, targetId, e.statusId, e.stacks, events, relicIds);
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
        if (picked) {
          battle.player.discardPile.push(picked);
          const discardResult = resolveRelicHooks(relicIds, {
            battle,
            trigger: 'cardDiscarded',
            cardId: battle.player.cards[picked]?.definitionId,
            events,
          });
          applyRelicCombatResult(battle, discardResult, relicIds, events, random);
        }
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
          notifyCardExhausted(battle, relicIds, events);
          const eid = pickRandomLivingEnemyId(battle, random);
          if (eid) dealDamageToUnit(battle, sourceUnitId, eid, 8, events, damageContext);
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
        dealDamageToUnit(battle, sourceUnitId, targetUnitId, dmg, events, damageContext);
      } else if (e.scriptId === 'fortify_convert_flag') {
        battle.pendingFortifyConvert = true;
      } else if (e.scriptId === 'flow_shift') {
        if (battle.prevTurnPlayerPlayedAttack) {
          const player = battle.units[battle.playerUnitId];
          if (player) {
            applyBlockGain(battle, battle.playerUnitId, 12, relicIds, events, effectCtx?.cardType);
          }
        } else {
          const eid = pickRandomLivingEnemyId(battle, random);
          if (eid) dealDamageToUnit(battle, sourceUnitId, eid, 12, events, damageContext);
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
        dealDamageToUnit(battle, sourceUnitId, targetUnitId, dmg, events, damageContext);
      } else if (e.scriptId === 'momentum_conditional_draw') {
        const params = readMomentumConditionalDrawParams(e.params);
        if (!params) continue;
        if (!battle.playerConsumedMomentumThisTurn) {
          drawAdditionalCards(battle, params.drawIfNoMomentumConsume, events, random);
          if ((params.momentumIfNoMomentumConsume ?? 0) > 0) {
            applyRelicCombatResult(
              battle,
              { momentum: params.momentumIfNoMomentumConsume },
              relicIds,
              events,
              random,
            );
          }
        }
      } else if (e.scriptId === 'conditional_damage') {
        const params = e.params as { baseDamage: number; bonusDamage: number; condition: string } | undefined;
        if (!params) continue;
        if (!targetUnitId) continue;
        let dmg = params.baseDamage;
        const source = battle.units[sourceUnitId];
        if (params.condition === 'has_block' && source && source.block > 0) {
          dmg += params.bonusDamage;
        } else if (params.condition === 'has_steady_guard' && source) {
          const stacks = getStatusStacks(source, 'steady_guard');
          if (stacks > 0) dmg += params.bonusDamage;
        } else if (params.condition === 'has_primed_break' && source) {
          const stacks = getStatusStacks(source, 'primed_break');
          if (stacks > 0) dmg += params.bonusDamage;
        } else if (params.condition === 'has_metallicize' && source) {
          const stacks = getStatusStacks(source, 'metallicize');
          if (stacks > 0) dmg += params.bonusDamage;
        } else if (params.condition === 'has_momentum' && source) {
          const stacks = getStatusStacks(source, 'momentum');
          if (stacks > 0) dmg += params.bonusDamage;
        }
        if (effectCtx?.cardType === 'attack') {
          dmg += battle.blazeCoreAttackBonus;
          if (effectCtx.fractureDoubleAttack) dmg *= 2;
          if (battle.twinCoreNextAttackBonus > 0) {
            dmg += battle.twinCoreNextAttackBonus;
            battle.twinCoreNextAttackBonus = 0;
          }
        }
        dealDamageToUnit(battle, sourceUnitId, targetUnitId, dmg, events, damageContext);
      } else if (e.scriptId === 'momentum_to_energy') {
        const params = e.params as { consumeValue: number; energyGain: number } | undefined;
        if (!params) continue;
        const source = battle.units[sourceUnitId];
        if (!source) continue;
        const currentStacks = getStatusStacks(source, 'momentum');
        const consumedStacks = Math.min(currentStacks, params.consumeValue);
        consumeMomentumForCardEffect(
          battle,
          sourceUnitId,
          consumedStacks,
          relicIds,
          events,
          random,
        );
        grantEnergy(battle, params.energyGain, events);
      } else if (e.scriptId === 'block_to_damage') {
        const params = e.params as { multiplier: number } | undefined;
        if (!params) continue;
        if (!targetUnitId) continue;
        const source = battle.units[sourceUnitId];
        if (!source) continue;
        const dmg = Math.floor(source.block * params.multiplier);
        if (dmg <= 0) continue;
        dealDamageToUnit(battle, sourceUnitId, targetUnitId, dmg, events, damageContext);
      } else if (e.scriptId === 'momentum_burst_block') {
        const params = e.params as { consumeValue: number; baseBlock: number } | undefined;
        if (!params) continue;
        const source = battle.units[sourceUnitId];
        if (!source) continue;
        const currentStacks = getStatusStacks(source, 'momentum');
        const consumedStacks = Math.min(currentStacks, params.consumeValue);
        consumeMomentumForCardEffect(
          battle,
          sourceUnitId,
          consumedStacks,
          relicIds,
          events,
          random,
        );
        const blockGain = params.baseBlock;
        applyBlockGain(battle, sourceUnitId, blockGain, relicIds, events, effectCtx?.cardType);
      } else if (e.scriptId === 'metallicize_to_block') {
        const params = e.params as { baseDamage: number } | undefined;
        if (!params) continue;
        if (!targetUnitId) continue;
        const source = battle.units[sourceUnitId];
        if (!source) continue;
        const metallicizeStacks = getStatusStacks(source, 'metallicize');
        let dmg = params.baseDamage;
        if (effectCtx?.cardType === 'attack') {
          dmg += battle.blazeCoreAttackBonus;
          if (effectCtx.fractureDoubleAttack) dmg *= 2;
          if (battle.twinCoreNextAttackBonus > 0) {
            dmg += battle.twinCoreNextAttackBonus;
            battle.twinCoreNextAttackBonus = 0;
          }
        }
        dealDamageToUnit(battle, sourceUnitId, targetUnitId, dmg, events, damageContext);
        if (metallicizeStacks > 0) {
          applyBlockGain(battle, sourceUnitId, metallicizeStacks, relicIds, events, effectCtx?.cardType);
        }
      } else if (e.scriptId === 'momentum_conditional_block') {
        const params = e.params as { baseBlock: number; blockIfNoConsume: number } | undefined;
        if (!params) continue;
        const source = battle.units[sourceUnitId];
        if (!source) continue;
        let blockGain = params.baseBlock;
        if (!battle.playerConsumedMomentumThisTurn) {
          blockGain += params.blockIfNoConsume;
        }
        applyBlockGain(battle, sourceUnitId, blockGain, relicIds, events, effectCtx?.cardType);
      } else if (e.scriptId === 'steady_guard_burst_damage') {
        const params = e.params as { baseDamage: number; damagePerStack: number } | undefined;
        if (!params) continue;
        if (!targetUnitId) continue;
        const source = battle.units[sourceUnitId];
        if (!source) continue;
        const stacks = getStatusStacks(source, 'steady_guard');
        if (stacks > 0) {
          decayStatus(source, 'steady_guard', stacks);
        }
        let dmg = params.baseDamage + stacks * params.damagePerStack;
        if (effectCtx?.cardType === 'attack') {
          dmg += battle.blazeCoreAttackBonus;
          if (effectCtx.fractureDoubleAttack) dmg *= 2;
          if (battle.twinCoreNextAttackBonus > 0) {
            dmg += battle.twinCoreNextAttackBonus;
            battle.twinCoreNextAttackBonus = 0;
          }
        }
        dealDamageToUnit(battle, sourceUnitId, targetUnitId, dmg, events, damageContext);
      } else if (e.scriptId === 'primed_break_burst_damage') {
        const params = e.params as { baseDamage: number; damagePerStack: number } | undefined;
        if (!params) continue;
        if (!targetUnitId) continue;
        const source = battle.units[sourceUnitId];
        if (!source) continue;
        const stacks = getStatusStacks(source, 'primed_break');
        if (stacks > 0) {
          decayStatus(source, 'primed_break', stacks);
        }
        let dmg = params.baseDamage + stacks * params.damagePerStack;
        if (effectCtx?.cardType === 'attack') {
          dmg += battle.blazeCoreAttackBonus;
          if (effectCtx.fractureDoubleAttack) dmg *= 2;
          if (battle.twinCoreNextAttackBonus > 0) {
            dmg += battle.twinCoreNextAttackBonus;
            battle.twinCoreNextAttackBonus = 0;
          }
        }
        dealDamageToUnit(battle, sourceUnitId, targetUnitId, dmg, events, damageContext);
      } else if (e.scriptId === 'multi_hit_with_block') {
        const params = e.params as { hits: number; damagePerHit: number; blockPerHit: number } | undefined;
        if (!params) continue;
        for (let i = 0; i < params.hits; i++) {
          const eid = pickRandomLivingEnemyId(battle, random);
          if (eid) {
            let dmg = params.damagePerHit;
            if (effectCtx?.cardType === 'attack') {
              dmg += battle.blazeCoreAttackBonus;
              if (effectCtx.fractureDoubleAttack) dmg *= 2;
              if (battle.twinCoreNextAttackBonus > 0) {
                dmg += battle.twinCoreNextAttackBonus;
                battle.twinCoreNextAttackBonus = 0;
              }
            }
            dealDamageToUnit(battle, sourceUnitId, eid, dmg, events, damageContext);
          }
          const source = battle.units[sourceUnitId];
          if (source) {
            applyBlockGain(battle, sourceUnitId, params.blockPerHit, relicIds, events, effectCtx?.cardType);
          }
        }
      } else if (e.scriptId === 'energy_to_damage') {
        const params = e.params as { damagePerEnergy: number } | undefined;
        if (!params) continue;
        if (!targetUnitId) continue;
        const energySpent = battle.player.energy;
        if (energySpent > 0) {
          battle.player.energy = 0;
          events.push({ type: 'ENERGY_CHANGED', unitId: battle.playerUnitId, value: 0 });
        }
        let dmg = energySpent * params.damagePerEnergy;
        if (effectCtx?.cardType === 'attack') {
          dmg += battle.blazeCoreAttackBonus;
          if (effectCtx.fractureDoubleAttack) dmg *= 2;
          if (battle.twinCoreNextAttackBonus > 0) {
            dmg += battle.twinCoreNextAttackBonus;
            battle.twinCoreNextAttackBonus = 0;
          }
        }
        dealDamageToUnit(battle, sourceUnitId, targetUnitId, dmg, events, damageContext);
      } else if (e.scriptId === 'consume_block_for_damage') {
        const params = e.params as { baseDamage: number; blockCost: number; bonusDamage: number } | undefined;
        if (!params) continue;
        if (!targetUnitId) continue;
        const source = battle.units[sourceUnitId];
        if (!source) continue;
        let dmg = params.baseDamage;
        if (source.block >= params.blockCost) {
          source.block -= params.blockCost;
          dmg += params.bonusDamage;
        }
        if (effectCtx?.cardType === 'attack') {
          dmg += battle.blazeCoreAttackBonus;
          if (effectCtx.fractureDoubleAttack) dmg *= 2;
          if (battle.twinCoreNextAttackBonus > 0) {
            dmg += battle.twinCoreNextAttackBonus;
            battle.twinCoreNextAttackBonus = 0;
          }
        }
        dealDamageToUnit(battle, sourceUnitId, targetUnitId, dmg, events, damageContext);
      } else if (e.scriptId === 'conditional_block') {
        const params = e.params as { baseBlock: number; bonusBlock: number; condition: string } | undefined;
        if (!params) continue;
        const source = battle.units[sourceUnitId];
        if (!source) continue;
        let blockGain = params.baseBlock;
        if (params.condition === 'has_metallicize') {
          const stacks = getStatusStacks(source, 'metallicize');
          if (stacks > 0) blockGain += params.bonusBlock;
        } else if (params.condition === 'has_steady_guard') {
          const stacks = getStatusStacks(source, 'steady_guard');
          if (stacks > 0) blockGain += params.bonusBlock;
        } else if (params.condition === 'has_block') {
          if (source.block > 0) blockGain += params.bonusBlock;
        }
        applyBlockGain(battle, sourceUnitId, blockGain, relicIds, events, effectCtx?.cardType);
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

function cardHasBlock(effects: EffectDefinition[]): boolean {
  return effects.some((effect) => {
    if (effect.type === 'block') return true;
    if (effect.type === 'repeat') return cardHasBlock(effect.effects);
    return effect.type === 'custom' && [
      'momentum_guard_by_stacks',
      'momentum_burst_block',
      'momentum_conditional_block',
      'conditional_block',
      'multi_hit_with_block',
      'metallicize_to_block',
    ].includes(effect.scriptId);
  });
}

function runtimeNumber(battle: BattleState, key: string): number {
  const value = ensureRelicRuntime(battle)[key];
  return typeof value === 'number' ? value : 0;
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
  if (def.type === 'curse' || def.type === 'status') return;
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
  const isSkillOrPower = def.type === 'skill' || def.type === 'power';
  const runtime = ensureRelicRuntime(battle);
  const cardTypeSequence = [
    ...(Array.isArray(runtime.cardTypeSequence) ? runtime.cardTypeSequence : []),
    def.type,
  ] as Array<'attack' | 'skill' | 'power'>;
  const attackCountAfterPlay = battle.playerAttacksPlayedThisTurn + (isAttack ? 1 : 0);
  const skillCountAfterPlay = runtimeNumber(battle, 'skillCountThisTurn') + (isSkillOrPower ? 1 : 0);
  const powerCountAfterPlay = runtimeNumber(battle, 'powerCountThisTurn') + (def.type === 'power' ? 1 : 0);
  const cardRelicResult = resolveRelicHooks(run.meta.relics, {
    run,
    battle,
    trigger: 'cardPlayed',
    cardId: card.definitionId,
    cardType: def.type,
    cardHasBlock: cardHasBlock(def.effects),
    cardWillExhaust: def.exhaustOnPlay,
    cardWasDiscarded: !def.exhaustOnPlay,
    firstCardThisBattle: runtimeNumber(battle, 'cardCountThisBattle') === 0,
    cardCountAfterPlay: runtimeNumber(battle, 'cardCountThisBattle') + 1,
    attackCountAfterPlay,
    skillCountAfterPlay,
    powerCountAfterPlay,
    cardTypeSequence,
    firstAttackThisTurn: isFirstAttackThisTurn,
    playedAttackThisTurn: hadAttackBefore || isAttack,
    playedSkillThisTurn: hadSkillBefore || isSkillOrPower,
    harmonyTriggeredThisTurn: battle.harmonyEmblemTriggeredThisTurn,
    events,
  });
  const useFractureExhaust = Boolean(cardRelicResult.forceExhaustAttack);
  const pendingCardCostReduction = runtimeNumber(battle, 'nextCardCostReduction');
  const currentTurnCostReduction = runtimeNumber(battle, 'cardCostReductionThisTurn');
  const rawCost = card.costForTurn + battle.cursePrideCostPressure + battle.curseConfusionCostDelta;
  const effectiveCost = cardRelicResult.forceZeroCost
    ? 0
    : Math.max(0, rawCost - pendingCardCostReduction - currentTurnCostReduction - (cardRelicResult.costReduction ?? 0));
  if (battle.player.energy < effectiveCost) return;
  delete runtime.nextCardCostReduction;
  if (cardRelicResult.costReduction) runtime.dualityCrestUsedThisTurn = true;
  runtime.currentCardDamageBonus = cardRelicResult.cardDamageBonus ?? 0;
  runtime.currentCardBlockBonus = cardRelicResult.cardBlockBonus ?? 0;

  battle.player.energy -= Math.max(0, effectiveCost);
  events.push({ type: 'ENERGY_CHANGED', unitId: battle.playerUnitId, value: battle.player.energy });
  battle.player.hand = battle.player.hand.filter((id) => id !== cardInstanceId);
  if (def.exhaustOnPlay || useFractureExhaust) {
    battle.player.exhaustPile.push(cardInstanceId);
    events.push({ type: 'CARD_EXHAUSTED', unitId: sourceUnitId, cardInstanceId });
    notifyCardExhausted(battle, run.meta.relics, events);
  } else {
    battle.player.discardPile.push(cardInstanceId);
  }

  if (cardRelicResult.nextSkillBonus) {
    battle.twinCoreFirstAttackUsed = true;
    battle.twinCoreNextSkillBonus += cardRelicResult.nextSkillBonus;
  }
  if (isAttack) {
    battle.playerAttacksPlayedThisTurn += 1;
    battle.playerPlayedAttackThisTurn = true;
  }
  if (isSkillOrPower) {
    battle.playerPlayedSkillThisTurn = true;
  }

  battle.playerCardsPlayedThisTurn += 1;
  runtime.cardCountThisBattle = runtimeNumber(battle, 'cardCountThisBattle') + 1;
  runtime.skillCountThisTurn = skillCountAfterPlay;
  runtime.powerCountThisTurn = powerCountAfterPlay;
  runtime.cardTypeSequence = cardTypeSequence;
  if (cardRelicResult.nextCardCostReduction) {
    runtime.nextCardCostReduction = runtimeNumber(battle, 'nextCardCostReduction')
      + cardRelicResult.nextCardCostReduction;
  }
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

  if (cardRelicResult.harmonyTriggered) {
    battle.harmonyEmblemTriggeredThisTurn = true;
  }
  applyRelicCombatResult(battle, cardRelicResult, run.meta.relics, events, () => effectRng());
  if (
    run.meta.relics.includes('cycle_engine')
    && runtimeNumber(battle, 'cycleEngineDrawsThisTurn') < 2
    && cardRelicResult.draw
    && ((def.type === 'attack' && hadSkillBefore)
      || (isSkillOrPower && hadAttackBefore))
  ) {
    runtime.cycleEngineDrawsThisTurn = runtimeNumber(battle, 'cycleEngineDrawsThisTurn') + 1;
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
  delete runtime.currentCardDamageBonus;
  delete runtime.currentCardBlockBonus;
  if (events.some((event) => event.type === 'BATTLE_WON')) battle.phase = 'victory';
  if (events.some((event) => event.type === 'BATTLE_LOST')) battle.phase = 'defeat';
  battle.pendingAction = null;
  const resolved = events.slice(eventStart);
  battle.lastResolvedEvents = resolved;
  battle.inputMode = resolved.length > 0 ? 'animation_lock' : 'idle';
}
