import { WANDERING_MERCHANT_EVENT_ID } from '../../engine/generateBranchingFloor';
import type { GameCommand } from '../../commands/types';
import type { GameEvent } from '../../events/types';
import type { RunState } from '../../model/run';
import { resolveEventOption } from './eventResolver';

export function resolveEventOptionFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'RESOLVE_EVENT_OPTION' }>,
  events: GameEvent[],
): void {
  if (run.screen.type !== 'event') return;
  const { eventId } = run.screen;
  const { optionId } = command;
  if (eventId === WANDERING_MERCHANT_EVENT_ID) resolveEventOption(run, eventId, optionId, events);
}
