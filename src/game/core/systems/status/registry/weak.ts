import { decayStatus } from '../../../combat/statusCombat';
import type { StatusBehavior } from './types';

export const weakBehavior: StatusBehavior = {
  onBeforeDealDamage: (_source, amount) => Math.floor(amount * 0.75),
  onTurnEnd: (_battle, unit, statusId) => {
    decayStatus(unit, statusId, 1);
  },
};
