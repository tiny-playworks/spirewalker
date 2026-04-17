import { WANDERING_MERCHANT_EVENT_ID } from '../generateBranchingFloor';
import type { GameCommand } from '../../commands/types';
import type { GameEvent } from '../../events/types';
import type { RunState } from '../../model/run';

export function resolveEventOptionFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'RESOLVE_EVENT_OPTION' }>,
  events: GameEvent[],
): void {
  if (run.screen.type !== 'event') return;
  const { eventId } = run.screen;
  const { optionId } = command;
  if (eventId === WANDERING_MERCHANT_EVENT_ID) {
    if (optionId === 'gold') run.meta.gold += 25;
    else if (optionId === 'heal') {
      run.player.currentHp = Math.min(run.player.maxHp, run.player.currentHp + 12);
    } else if (optionId === 'relic') {
      if (!run.meta.relics.includes('vajra')) run.meta.relics.push('vajra');
    } else return;
    run.screen = { type: 'map' };
    events.push({ type: 'EVENT_RESOLVED', eventId, optionId });
  }
}
