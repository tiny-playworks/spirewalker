import { STATUS_BEHAVIORS } from './registry';
export type { AfterPlayCardPayload, StatusBehavior } from './registry/types';
import type { StatusBehavior } from './registry/types';

export function behaviorOf(statusId: string): StatusBehavior | undefined {
  return STATUS_BEHAVIORS[statusId];
}
