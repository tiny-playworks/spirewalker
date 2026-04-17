import { STATUS_MOMENTUM, STATUS_VULNERABLE, STATUS_WEAK } from '../../../definitions/statuses';
import { momentumBehavior } from './momentum';
import type { StatusBehavior } from './types';
import { vulnerableBehavior } from './vulnerable';
import { weakBehavior } from './weak';

export const STATUS_BEHAVIORS: Record<string, StatusBehavior> = {
  [STATUS_WEAK]: weakBehavior,
  [STATUS_VULNERABLE]: vulnerableBehavior,
  [STATUS_MOMENTUM]: momentumBehavior,
};
