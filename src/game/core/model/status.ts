import type { CombatUnit } from './unit';

export type StatusHookPoint =
  | 'onTurnStart'
  | 'onTurnEnd'
  | 'onBeforeDealDamage'
  | 'onBeforeTakeDamage'
  | 'onAfterPlayCard';

export interface StatusHookContext {
  source?: CombatUnit;
  target?: CombatUnit;
  amount?: number;
}
