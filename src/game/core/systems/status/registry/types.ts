import type { GameEvent } from '../../../events/types';
import type { BattleState } from '../../../model/battle';
import type { CardInstance } from '../../../model/card';
import type { CombatUnit } from '../../../model/unit';

export interface AfterPlayCardPayload {
  card: CardInstance;
  sourceUnitId: string;
  events: GameEvent[];
  skipMomentumAutoConsume?: boolean;
}

export interface StatusBehavior {
  onBeforeDealDamage?: (source: CombatUnit, amount: number) => number;
  onBeforeTakeDamage?: (target: CombatUnit, amount: number) => number;
  onTurnEnd?: (battle: BattleState, unit: CombatUnit, statusId: string) => void;
  onAfterPlayCard?: (battle: BattleState, payload: AfterPlayCardPayload) => void;
}
