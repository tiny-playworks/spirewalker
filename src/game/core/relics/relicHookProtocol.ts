import type { GameEvent } from '../events/types';
import type { CardType } from '../model/card';
import type { BattleState } from '../model/battle';
import type { RunState } from '../model/run';

export type RelicTrigger =
  | 'battleStart'
  | 'turnStart'
  | 'cardPlayed'
  | 'cardDrawn'
  | 'cardDiscarded'
  | 'cardExhausted'
  | 'momentumCost'
  | 'momentumGained'
  | 'momentumConsumed'
  | 'lifeSpent'
  | 'blockGained'
  | 'damageTaken'
  | 'damageDealt'
  | 'statusGained'
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
  cardHasBlock?: boolean;
  cardWillExhaust?: boolean;
  cardWasDiscarded?: boolean;
  currentBlock?: number;
  firstCardThisBattle?: boolean;
  cardCountAfterPlay?: number;
  attackCountAfterPlay?: number;
  skillCountAfterPlay?: number;
  powerCountAfterPlay?: number;
  cardTypeSequence?: CardType[];
  amount?: number;
  actualAmount?: number;
  consumedStacks?: number;
  remainingMomentum?: number;
  previousMomentum?: number;
  consumedAll?: boolean;
  damagePhase?: 'before' | 'after';
  sourceUnitId?: string;
  targetUnitId?: string;
  hpLoss?: number;
  blockAbsorbed?: number;
  targetAlive?: boolean;
  wasFatal?: boolean;
  isPlayerAttack?: boolean;
  isMomentumAttack?: boolean;
  isSecondaryDamage?: boolean;
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
  cardDamageBonus?: number;
  cardBlockBonus?: number;
  damageAllEnemies?: number;
  extraDamage?: number;
  secondaryDamage?: number;
  damageMultiplier?: number;
  damageReduction?: number;
  blockMultiplier?: number;
  heal?: number;
  momentumCostReduction?: number;
  momentumCostMultiplier?: number;
  nextCardCostReduction?: number;
  maxHpLoss?: number;
  nextTurnDraw?: number;
  nextTurnPrimedBreak?: number;
  retainBlock?: number;
  retainBlockRatio?: number;
  momentumOverflow?: number;
  skillBlockBonus?: number;
  nextBattleMomentum?: number;
  battleAttackBonus?: number;
  preventDeath?: boolean;
  upgradeRandomHand?: boolean;
  goldMin?: number;
  goldMax?: number;
  turnAttackBonus?: number;
  forceExhaustAttack?: boolean;
  forceZeroCost?: boolean;
  harmonyTriggered?: boolean;
  vulnerableStacks?: number;
  goldBonus?: number;
  primedBreak?: number;
  costReduction?: number;
}

export type RelicHook = (context: RelicHookContext) => RelicHookResult | undefined;
