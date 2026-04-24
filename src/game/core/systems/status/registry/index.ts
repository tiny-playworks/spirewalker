import {
  STATUS_METALLICIZE,
  STATUS_MOMENTUM,
  STATUS_PATIENCE,
  STATUS_PRIMED_BREAK,
  STATUS_STEADY_GUARD,
  STATUS_VULNERABLE,
  STATUS_WEAK,
} from '../../../definitions/statuses';
import { metallicizeBehavior } from './metallicize';
import { momentumBehavior } from './momentum';
import { patienceBehavior } from './patience';
import { primedBreakBehavior } from './primedBreak';
import { steadyGuardBehavior } from './steadyGuard';
import type { StatusBehavior } from './types';
import { vulnerableBehavior } from './vulnerable';
import { weakBehavior } from './weak';

export const STATUS_BEHAVIORS: Record<string, StatusBehavior> = {
  [STATUS_WEAK]: weakBehavior,
  [STATUS_VULNERABLE]: vulnerableBehavior,
  [STATUS_MOMENTUM]: momentumBehavior,
  [STATUS_METALLICIZE]: metallicizeBehavior,
  [STATUS_STEADY_GUARD]: steadyGuardBehavior,
  [STATUS_PRIMED_BREAK]: primedBreakBehavior,
  [STATUS_PATIENCE]: patienceBehavior,
};
