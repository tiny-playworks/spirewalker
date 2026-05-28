import {
  BURST_ALTAR_EVENT_ID,
  PURGING_POOL_EVENT_ID,
  STILLNESS_SHRINE_EVENT_ID,
  WANDERING_MERCHANT_EVENT_ID,
} from '../../engine/generateBranchingFloor';
import type { GameEvent } from '../../events/types';
import type { RunState } from '../../model/run';
import { resolveGenericEvent } from './eventRuntime';

type EventOptionResolver = (run: RunState, optionId: string, events: GameEvent[]) => boolean;

function removeOneCard(run: RunState, definitionId: string): boolean {
  const idx = run.masterDeck.findIndex((id) => id === definitionId);
  if (idx < 0) return false;
  run.masterDeck.splice(idx, 1);
  return true;
}

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
  [STILLNESS_SHRINE_EVENT_ID]: (run, optionId, events) => {
    if (optionId === 'guard_relic') {
      run.player.currentHp = Math.max(1, run.player.currentHp - 6);
      if (!run.meta.relics.includes('guard_knot')) run.meta.relics.push('guard_knot');
    } else if (optionId === 'guard_card') {
      run.masterDeck.push('tempo_guard');
    } else if (optionId === 'leave') {
      // noop
    } else return false;
    run.screen = { type: 'map' };
    events.push({ type: 'EVENT_RESOLVED', eventId: STILLNESS_SHRINE_EVENT_ID, optionId });
    return true;
  },
  [BURST_ALTAR_EVENT_ID]: (run, optionId, events) => {
    if (optionId === 'burst_relic') {
      run.player.currentHp = Math.max(1, run.player.currentHp - 6);
      if (!run.meta.relics.includes('burst_emblem')) run.meta.relics.push('burst_emblem');
    } else if (optionId === 'burst_card') {
      run.masterDeck.push('burst_strike');
    } else if (optionId === 'leave') {
      // noop
    } else return false;
    run.screen = { type: 'map' };
    events.push({ type: 'EVENT_RESOLVED', eventId: BURST_ALTAR_EVENT_ID, optionId });
    return true;
  },
  [PURGING_POOL_EVENT_ID]: (run, optionId, events) => {
    if (optionId === 'remove_strike') {
      if (!removeOneCard(run, 'strike')) return false;
    } else if (optionId === 'remove_defend') {
      if (!removeOneCard(run, 'defend')) return false;
    } else if (optionId === 'leave') {
      // noop
    } else return false;
    run.screen = { type: 'map' };
    events.push({ type: 'EVENT_RESOLVED', eventId: PURGING_POOL_EVENT_ID, optionId });
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
  if (resolver) return resolver(run, optionId, events);
  return resolveGenericEvent(run, eventId, optionId, events);
}
