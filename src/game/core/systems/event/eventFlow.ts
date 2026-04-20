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
  resolveEventOption(run, eventId, optionId, events);
}
