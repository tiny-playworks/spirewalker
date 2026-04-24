import { addStatusStacks, getStatusStacks } from '../../../combat/statusCombat';
import { STATUS_PATIENCE, STATUS_STRENGTH } from '../../../definitions/statuses';
import type { StatusBehavior } from './types';

export const patienceBehavior: StatusBehavior = {
  onTurnEnd(battle, unit) {
    if (unit.side !== 'player' || !unit.alive) return;
    const stacks = getStatusStacks(unit, STATUS_PATIENCE);
    if (stacks <= 0) return;
    if (battle.playerPlayedAttackThisTurn) return;
    addStatusStacks(unit, STATUS_STRENGTH, 3 * stacks);
  },
};
