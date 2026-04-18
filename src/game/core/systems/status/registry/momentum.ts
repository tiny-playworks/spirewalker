import { decayStatus, getStatusStacks } from '../../../combat/statusCombat';
import { STATUS_MOMENTUM } from '../../../definitions/statuses';
import type { StatusBehavior } from './types';

export const momentumBehavior: StatusBehavior = {
  onAfterPlayCard: (battle, payload) => {
    if (payload.skipMomentumAutoConsume) return;
    if (payload.card.definitionId === 'momentum') return;
    const source = battle.units[payload.sourceUnitId];
    if (!source) return;
    const stacks = getStatusStacks(source, STATUS_MOMENTUM);
    if (stacks <= 0) return;
    source.block += stacks;
    payload.events.push({ type: 'BLOCK_GAINED', unitId: source.id, value: stacks });
    decayStatus(source, STATUS_MOMENTUM, 1);
  },
};
