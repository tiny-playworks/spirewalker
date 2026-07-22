import type { GameEvent } from '../events/types';
import type { CardType } from '../model/card';
import type { BattleState } from '../model/battle';
import type { RunState } from '../model/run';

export type RelicTrigger =
  | 'battleStart'
  | 'turnStart'
  | 'cardPlayed'
  | 'cardExhausted'
  | 'momentumConsumed'
  | 'blockGained'
  | 'damageTaken'
  | 'turnEnd'
  | 'battleEnd'
  | 'pickup'
  | 'statusReduced';

export interface RelicHookContext {
  run?: RunState;
  battle?: BattleState;
  relicId: string;
  trigger: RelicTrigger;
  events?: GameEvent[];
  cardId?: string;
  cardType?: CardType;
  amount?: number;
  consumedStacks?: number;
  momentumKind?: 'damage' | 'draw';
  firstConsumeThisTurn?: boolean;
  firstBlockThisTurn?: boolean;
  firstAttackThisTurn?: boolean;
  playedAttackThisTurn?: boolean;
  playedSkillThisTurn?: boolean;
  harmonyTriggeredThisTurn?: boolean;
  statusId?: string;
}

/**
 * Hook 返回领域层可理解的增量，具体结算由战斗系统完成。
 */
export interface RelicHookResult {
  strength?: number;
  momentum?: number;
  metallicize?: number;
  steadyGuard?: number;
  block?: number;
  openingHandDraw?: number;
  damageBonus?: number;
  draw?: number;
  energy?: number;
  maxHp?: number;
  currentHp?: number;
  momentumReduction?: number;
  reflectRatio?: number;
  nextAttackBonus?: number;
  nextSkillBonus?: number;
  forceExhaustAttack?: boolean;
  harmonyTriggered?: boolean;
  vulnerableStacks?: number;
  goldBonus?: number;
  primedBreak?: number;
  costReduction?: number;
}

export type RelicHook = (context: RelicHookContext) => RelicHookResult | undefined;
