import type { GameEvent } from '../../events/types';
import type { RunState } from '../../model/run';

export function hashMapNodeId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = Math.imul(31, h) + id.charCodeAt(i);
  }
  return h | 0;
}

export function syncRunPlayerFromBattle(run: RunState): void {
  const b = run.battle;
  if (!b) return;
  const u = b.units[b.playerUnitId];
  if (u) {
    run.player.currentHp = u.hp;
    run.player.maxHp = u.maxHp;
  }
}

export function applyGameOverIfDefeat(run: RunState, events: GameEvent[]): void {
  if (run.battle?.phase !== 'defeat') return;
  run.battle = undefined;
  run.screen = { type: 'game_over' };
  events.push({ type: 'ENTERED_GAME_OVER' });
}
