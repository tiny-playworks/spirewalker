import { POTION_DEFINITIONS } from '../../definitions/potions';
import type { GameCommand } from '../../commands/types';
import type { GameEvent } from '../../events/types';
import type { RunState } from '../../model/run';

export function usePotionFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'USE_POTION' }>,
  events: GameEvent[],
): void {
  const battle = run.battle;
  if (!battle || battle.phase !== 'player_action') return;
  const { slotIndex } = command;
  if (slotIndex < 0 || slotIndex >= run.meta.potions.length) return;
  const potionId = run.meta.potions[slotIndex];
  const def = POTION_DEFINITIONS[potionId];
  if (!def) return;
  const playerUnit = battle.units[battle.playerUnitId];
  if (!playerUnit) return;
  const heal = def.healAmount;
  playerUnit.hp = Math.min(playerUnit.maxHp, playerUnit.hp + heal);
  run.player.currentHp = playerUnit.hp;
  run.meta.potions.splice(slotIndex, 1);
  events.push({ type: 'POTION_USED', potionId, value: heal });
}
