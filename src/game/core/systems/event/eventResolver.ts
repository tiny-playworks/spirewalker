import { WANDERING_MERCHANT_EVENT_ID } from '../../engine/generateBranchingFloor';
import type { GameEvent } from '../../events/types';
import type { RunState } from '../../model/run';

type EventOptionResolver = (run: RunState, optionId: string, events: GameEvent[]) => boolean;

const EVENT_OPTION_RESOLVERS: Record<string, EventOptionResolver> = {
  [WANDERING_MERCHANT_EVENT_ID]: (run, optionId, events) => {
    if (optionId === 'gold') run.meta.gold += 25;
    else if (optionId === 'heal') run.player.currentHp = Math.min(run.player.maxHp, run.player.currentHp + 12);
    else if (optionId === 'relic') {
      if (!run.meta.relics.includes('vajra')) run.meta.relics.push('vajra');
    } else return false;
    run.screen = { type: 'map' };
    events.push({ type: 'EVENT_RESOLVED', eventId: WANDERING_MERCHANT_EVENT_ID, optionId });
    return true;
  },
};

export function resolveEventOption(
  run: RunState,
  eventId: string,
  optionId: string,
  events: GameEvent[],
): boolean {
  const resolver = EVENT_OPTION_RESOLVERS[eventId];
  if (!resolver) return false;
  return resolver(run, optionId, events);
}
