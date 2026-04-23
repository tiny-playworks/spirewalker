import { decayStatus } from '../../../combat/statusCombat';
import type { StatusBehavior } from './types';

export const primedBreakBehavior: StatusBehavior = {
  onTurnEnd: (_battle, unit, statusId) => {
    decayStatus(unit, statusId, Number.MAX_SAFE_INTEGER);
  },
};
