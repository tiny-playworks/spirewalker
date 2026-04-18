import type { GameCommand } from '../../commands/types';
import type { RunState } from '../../model/run';

export function beginDragCardFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'BEGIN_DRAG_CARD' }>,
): void {
  const battle = run.battle;
  if (!battle || battle.phase !== 'player_action') return;
  if (battle.inputMode === 'animation_lock' || battle.inputMode === 'selecting_target') return;
  if (command.sourceUnitId !== battle.playerUnitId) return;
  if (!battle.player.hand.includes(command.cardInstanceId)) return;
  battle.inputMode = 'dragging_card';
}

export function cancelDragCardFlow(run: RunState): void {
  const battle = run.battle;
  if (!battle || battle.phase !== 'player_action') return;
  if (battle.inputMode !== 'dragging_card') return;
  battle.inputMode = 'idle';
}

export function cancelTargetSelectionFlow(run: RunState): void {
  const battle = run.battle;
  if (!battle || battle.phase !== 'player_action') return;
  if (battle.inputMode !== 'selecting_target') return;
  battle.pendingAction = null;
  battle.inputMode = 'idle';
}
