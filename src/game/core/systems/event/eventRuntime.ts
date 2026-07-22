import type { RunState } from '../../model/run';
import type { GameEvent } from '../../events/types';
import { evaluateChoiceRequirements } from '../../events/eventConditionParser';
import { EVENT_DEFINITIONS, type EventOutcome } from '../../definitions/events';
import { CARD_DEFINITIONS } from '../../definitions/cards';
import { RELIC_DEFINITIONS } from '../../definitions/relics';
import { applyRelicPickupHooks, resolveRelicHooks } from '../relic/relicHooks';

/**
 * 通用 EventOutcome → RunState 执行器。
 * 仅支持已有 EventOutcome type，不 invent 新类型。
 */
function applyOutcome(run: RunState, outcome: EventOutcome): boolean {
  switch (outcome.type) {
    case 'gain_gold':
      run.meta.gold += outcome.value ?? 0;
      return true;
    case 'lose_gold':
      if (run.meta.gold < (outcome.value ?? 0)) return false;
      run.meta.gold -= outcome.value ?? 0;
      return true;
    case 'gain_hp':
      run.player.currentHp = Math.min(run.player.maxHp, run.player.currentHp + (outcome.value ?? 0));
      return true;
    case 'lose_hp':
      {
        const amount = Math.max(0, outcome.value ?? 0);
        run.player.currentHp = Math.max(1, run.player.currentHp - amount);
        const relicResult = resolveRelicHooks(run.meta.relics, {
          run,
          trigger: 'lifeSpent',
          amount,
        });
        if (relicResult.momentum) {
          run.meta.pendingBattleMomentum = (run.meta.pendingBattleMomentum ?? 0) + relicResult.momentum;
        }
      }
      return true;
    case 'lose_max_hp':
      run.player.maxHp = Math.max(1, run.player.maxHp - (outcome.value ?? 0));
      run.player.currentHp = Math.min(run.player.currentHp, run.player.maxHp);
      return true;
    case 'gain_card':
      if (!outcome.cardId || !CARD_DEFINITIONS[outcome.cardId]) return false;
      run.masterDeck.push(outcome.cardId);
      return true;
    case 'gain_relic':
      if (!outcome.relicId || !RELIC_DEFINITIONS[outcome.relicId]) return false;
      if (run.meta.relics.includes(outcome.relicId)) return false;
      run.meta.relics.push(outcome.relicId);
      applyRelicPickupHooks(run, outcome.relicId);
      return true;
    case 'gain_momentum':
      run.meta.pendingBattleMomentum =
        (run.meta.pendingBattleMomentum ?? 0) + Math.max(0, outcome.value ?? 1);
      return true;
    case 'nothing':
      return true;
    default:
      return false;
  }
}

/**
 * 通用事件解析器：从 EVENT_DEFINITIONS 查找事件，
 * 将 choice 对应的 outcomes 逐个执行。
 */
export function resolveGenericEvent(
  run: RunState,
  eventId: string,
  optionId: string,
  events: GameEvent[],
): boolean {
  const def = EVENT_DEFINITIONS[eventId];
  if (!def) return false;

  const choice = def.choices.find(c => c.id === optionId);
  if (!choice) return false;

  if (!evaluateChoiceRequirements(choice, run)) return false;

  const snapshot = structuredClone({
    player: run.player,
    masterDeck: run.masterDeck,
    meta: run.meta,
  });
  for (const outcome of choice.outcomes) {
    if (!applyOutcome(run, outcome)) {
      run.player = snapshot.player;
      run.masterDeck = snapshot.masterDeck;
      run.meta = snapshot.meta;
      return false;
    }
  }

  run.screen = { type: 'map' };
  events.push({ type: 'EVENT_RESOLVED', eventId, optionId });
  return true;
}
