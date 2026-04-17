import { decayStatus } from '../../../combat/statusCombat';
import type { StatusBehavior } from './types';

export const vulnerableBehavior: StatusBehavior = {
  onBeforeTakeDamage: (_target, amount) => Math.floor(amount * 1.5),
  onTurnEnd: (_battle, unit, statusId) => {
    decayStatus(unit, statusId, 1);
  },
};
