import { getStatusStacks } from '../../../combat/statusCombat';
import type { StatusBehavior } from './types';

export const metallicizeBehavior: StatusBehavior = {
  onTurnEnd: (_battle, unit, statusId) => {
    const stacks = getStatusStacks(unit, statusId);
    if (stacks <= 0 || !unit.alive) return;
    unit.block += stacks;
  },
};
