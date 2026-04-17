import type { RunState } from '../../model/run';

export function leaveRestToMapFlow(run: RunState): void {
  if (run.screen.type !== 'rest') return;
  const heal = Math.floor(run.player.maxHp * 0.3);
  run.player.currentHp = Math.min(run.player.maxHp, run.player.currentHp + heal);
  run.screen = { type: 'map' };
}
