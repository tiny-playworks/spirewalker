import { addStatusStacks, getStatusStacks } from '../../combat/statusCombat';
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
  let totalHeal = 0;
  for (const effect of def.effects) {
    if (effect.type === 'heal') {
      playerUnit.hp = Math.min(playerUnit.maxHp, playerUnit.hp + effect.value);
      totalHeal += effect.value;
    } else if (effect.type === 'block') {
      playerUnit.block += effect.value;
      events.push({ type: 'BLOCK_GAINED', unitId: battle.playerUnitId, value: effect.value });
    } else if (effect.type === 'apply_status') {
      addStatusStacks(playerUnit, effect.statusId, effect.stacks);
      events.push({
        type: 'STATUS_APPLIED',
        unitId: battle.playerUnitId,
        statusId: effect.statusId,
        value: getStatusStacks(playerUnit, effect.statusId),
      });
    } else if (effect.type === 'gain_energy') {
      battle.player.energy += effect.value;
      events.push({ type: 'ENERGY_CHANGED', unitId: battle.playerUnitId, value: battle.player.energy });
    }
  }
  run.player.currentHp = playerUnit.hp;
  run.meta.potions.splice(slotIndex, 1);
  events.push({ type: 'POTION_USED', potionId, value: totalHeal });
}
