import { CARD_DEFINITIONS } from '@/game/core/definitions/cards';
import {
  EVENT_DEFINITIONS,
  type EventChoice,
} from '@/game/core/definitions/events';
import { RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import {
  BURST_ALTAR_EVENT_ID,
  PURGING_POOL_EVENT_ID,
  STILLNESS_SHRINE_EVENT_ID,
  WANDERING_MERCHANT_EVENT_ID,
} from '@/game/core/engine/generateBranchingFloor';
import { evaluateChoiceRequirements } from '@/game/core/events/eventConditionParser';
import type { RunState } from '@/game/core/model/run';

function isGenericChoiceAvailable(
  run: RunState,
  choice: EventChoice,
): boolean {
  if (!evaluateChoiceRequirements(choice, run)) return false;

  return choice.outcomes.every((outcome) => {
    if (outcome.type === 'lose_gold') {
      return run.meta.gold >= Math.max(0, outcome.value ?? 0);
    }
    if (outcome.type === 'gain_card') {
      return Boolean(outcome.cardId && CARD_DEFINITIONS[outcome.cardId]);
    }
    if (outcome.type === 'gain_relic') {
      return Boolean(
        outcome.relicId
        && RELIC_DEFINITIONS[outcome.relicId]
        && !run.meta.relics.includes(outcome.relicId),
      );
    }
    return true;
  });
}

export function availableEventOptionIds(run: RunState): string[] {
  if (run.screen.type !== 'event') return [];

  switch (run.screen.eventId) {
    case WANDERING_MERCHANT_EVENT_ID:
      return [
        'gold',
        ...(run.player.currentHp < run.player.maxHp ? ['heal'] : []),
        ...(!run.meta.relics.includes('vajra') ? ['relic'] : []),
      ];
    case STILLNESS_SHRINE_EVENT_ID:
      return [
        ...(!run.meta.relics.includes('guard_knot') ? ['guard_relic'] : []),
        'guard_card',
        'leave',
      ];
    case BURST_ALTAR_EVENT_ID:
      return [
        ...(!run.meta.relics.includes('burst_emblem') ? ['burst_relic'] : []),
        'burst_card',
        'leave',
      ];
    case PURGING_POOL_EVENT_ID:
      return [
        ...(run.masterDeck.includes('strike') ? ['remove_strike'] : []),
        ...(run.masterDeck.includes('defend') ? ['remove_defend'] : []),
        'leave',
      ];
    default: {
      const definition = EVENT_DEFINITIONS[run.screen.eventId];
      if (!definition) return [];
      return definition.choices
        .filter((choice) => isGenericChoiceAvailable(run, choice))
        .map((choice) => choice.id);
    }
  }
}
