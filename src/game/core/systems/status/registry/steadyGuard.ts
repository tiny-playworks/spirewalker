import { addStatusStacks, decayStatus } from '../../../combat/statusCombat';
import { STATUS_MOMENTUM } from '../../../definitions/statuses';
import type { StatusBehavior } from './types';

export const steadyGuardBehavior: StatusBehavior = {
  onTurnEnd: (battle, unit, statusId) => {
    const isPlayer = unit.id === battle.playerUnitId;
    if (isPlayer && unit.alive && !battle.playerConsumedMomentumThisTurn) {
      unit.block += 4;
      addStatusStacks(unit, STATUS_MOMENTUM, 1);
    }
    decayStatus(unit, statusId, 1);
  },
};
