import { decayStatus, getStatusStacks } from '../../../combat/statusCombat';
import { STATUS_MOMENTUM } from '../../../definitions/statuses';
import type { StatusBehavior } from './types';
import { applyRelicResourceResult, ensureRelicRuntime, resolveRelicHooks } from '../../relic/relicHooks';

export const momentumBehavior: StatusBehavior = {
  onAfterPlayCard: (battle, payload) => {
    if (payload.skipMomentumAutoConsume) return;
    if (payload.card.definitionId === 'momentum') return;
    const source = battle.units[payload.sourceUnitId];
    if (!source) return;
    const currentMomentum = getStatusStacks(source, STATUS_MOMENTUM);
    if (currentMomentum <= 0) return;
    const firstConsumeThisTurn = !battle.playerConsumedMomentumThisTurn;
    const costResult = resolveRelicHooks(battle.relicIds, {
      battle,
      trigger: 'momentumCost',
      amount: 1,
      momentumKind: 'draw',
      firstConsumeThisTurn,
      events: payload.events,
    });
    const consume = Math.min(
      currentMomentum,
      Math.max(0, Math.floor((1 - (costResult.momentumCostReduction ?? 0)) * (costResult.momentumCostMultiplier ?? 1))),
    );
    if (consume <= 0) return;
    decayStatus(source, STATUS_MOMENTUM, consume);
    battle.playerConsumedMomentumThisTurn = true;
    battle.playerMomentumConsumedAmountThisTurn += consume;
    const runtime = ensureRelicRuntime(battle);
    runtime.momentumConsumeCountThisTurn = (runtime.momentumConsumeCountThisTurn as number | undefined ?? 0) + 1;
    runtime.momentumConsumedThisTurn = (runtime.momentumConsumedThisTurn as number | undefined ?? 0) + consume;
    runtime.momentumConsumedTotal = (runtime.momentumConsumedTotal as number | undefined ?? 0) + consume;
    payload.events.push({
      type: 'MOMENTUM_CONSUMED',
      unitId: source.id,
      value: consume,
      remaining: getStatusStacks(source, STATUS_MOMENTUM),
    });
    source.block += currentMomentum;
    payload.events.push({ type: 'BLOCK_GAINED', unitId: source.id, value: currentMomentum });
    const relicResult = resolveRelicHooks(battle.relicIds, {
      battle,
      trigger: 'momentumConsumed',
      consumedStacks: consume,
      previousMomentum: currentMomentum,
      remainingMomentum: getStatusStacks(source, STATUS_MOMENTUM),
      consumedAll: consume >= currentMomentum,
      momentumKind: 'draw',
      firstConsumeThisTurn,
      events: payload.events,
    });
    applyRelicResourceResult(battle, relicResult, payload.events);
    if (relicResult.block) {
      source.block += relicResult.block;
      payload.events.push({ type: 'BLOCK_GAINED', unitId: source.id, value: relicResult.block });
    }
    if (relicResult.nextAttackBonus) battle.twinCoreNextAttackBonus += relicResult.nextAttackBonus;
    if (relicResult.skillBlockBonus) {
      runtime.skillBlockBonus = (runtime.skillBlockBonus as number | undefined ?? 0) + relicResult.skillBlockBonus;
    }
    if (relicResult.turnAttackBonus) {
      runtime.turnAttackBonus = (runtime.turnAttackBonus as number | undefined ?? 0) + relicResult.turnAttackBonus;
    }
    if (relicResult.battleAttackBonus) {
      runtime.battleAttackBonus = (runtime.battleAttackBonus as number | undefined ?? 0) + relicResult.battleAttackBonus;
    }
  },
};
