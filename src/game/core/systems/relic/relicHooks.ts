import type { GameEvent } from '../../events/types';
import type { CardType } from '../../model/card';
import type { BattleState } from '../../model/battle';
import type { RunState } from '../../model/run';
import {
  COMMON_RELIC_POOL,
  RELIC_DEFINITIONS,
} from '../../definitions/relics';

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
 * Hook 只返回领域层可理解的增量，具体结算仍由战斗系统完成。
 * 这样遗物定义不会直接依赖 React，也不会执行任意字符串脚本。
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
}

export type RelicHook = (context: RelicHookContext) => RelicHookResult | undefined;

export const RELIC_HOOKS: Record<string, RelicHook> = {
  vajra: ({ trigger }) => trigger === 'battleStart' ? { strength: 1 } : undefined,
  anchor: ({ trigger }) => trigger === 'pickup' ? { maxHp: 5, currentHp: 5 } : undefined,
  wind_chime: ({ trigger }) => trigger === 'battleStart' ? { momentum: 2 } : undefined,
  tactical_gloves: ({ trigger }) => trigger === 'battleStart' ? { openingHandDraw: 1 } : undefined,
  burst_emblem: ({ trigger, momentumKind, consumedStacks, firstConsumeThisTurn }) => {
    if (trigger !== 'momentumConsumed' || (consumedStacks ?? 0) <= 0) return undefined;
    return {
      damageBonus: momentumKind === 'damage' ? 2 : 0,
      draw: momentumKind === 'damage' && firstConsumeThisTurn ? 1 : 0,
    };
  },
  insight_lens: ({ trigger, momentumKind, consumedStacks }) => (
    trigger === 'momentumConsumed' && momentumKind === 'draw' && (consumedStacks ?? 0) > 0
      ? { draw: 1 }
      : undefined
  ),
  guard_knot: ({ trigger, statusId }) => {
    if (trigger === 'battleStart') return { steadyGuard: 1 };
    if (trigger === 'statusReduced' && statusId === 'momentum') return { momentumReduction: 1 };
    return undefined;
  },
  still_core: ({ trigger }) => (
    trigger === 'battleStart' ? { metallicize: 1, steadyGuard: 1 } : undefined
  ),
  soft_guard: ({ trigger }) => trigger === 'battleStart' ? { block: 4 } : undefined,
  quick_fuse: ({ trigger, firstConsumeThisTurn }) => (
    trigger === 'momentumConsumed' && firstConsumeThisTurn ? { energy: 1 } : undefined
  ),
  sighted_edge: ({ trigger, consumedStacks }) => (
    trigger === 'momentumConsumed' ? { damageBonus: consumedStacks ?? 0 } : undefined
  ),
  blaze_core: ({ trigger }) => trigger === 'cardExhausted' ? { damageBonus: 2 } : undefined,
  fractured_blade: ({ trigger, cardType, firstAttackThisTurn }) => (
    trigger === 'cardPlayed' && cardType === 'attack' && firstAttackThisTurn
      ? { forceExhaustAttack: true }
      : undefined
  ),
  iron_heart: ({ trigger }) => trigger === 'blockGained' ? { block: 2 } : undefined,
  counter_sigil: ({ trigger }) => trigger === 'damageTaken' ? { reflectRatio: 0.3 } : undefined,
  twin_core: ({ trigger, firstBlockThisTurn, firstAttackThisTurn, cardType }) => {
    if (trigger === 'blockGained' && firstBlockThisTurn) return { nextAttackBonus: 5 };
    if (trigger === 'cardPlayed' && cardType === 'attack' && firstAttackThisTurn) {
      return { nextSkillBonus: 5 };
    }
    return undefined;
  },
  harmony_emblem: ({
    trigger,
    cardType,
    playedAttackThisTurn,
    playedSkillThisTurn,
    harmonyTriggeredThisTurn,
  }) => {
    if (
      trigger !== 'cardPlayed'
      || harmonyTriggeredThisTurn
      || !cardType
      || !((cardType === 'attack' && playedSkillThisTurn)
        || ((cardType === 'skill' || cardType === 'power') && playedAttackThisTurn))
    ) {
      return undefined;
    }
    return { draw: 1, energy: 1, harmonyTriggered: true };
  },
  ward_banner: ({ trigger }) => trigger === 'battleStart' ? { block: 6 } : undefined,
  flare_banner: ({ trigger, firstConsumeThisTurn }) => (
    trigger === 'momentumConsumed' && firstConsumeThisTurn ? { energy: 1 } : undefined
  ),
};

/** 当前可进入奖励、商店或事件结果的遗物必须在这里有运行时 Hook。 */
export const RUNTIME_RELIC_IDS = [
  'vajra',
  'anchor',
  'wind_chime',
  'tactical_gloves',
  'burst_emblem',
  'insight_lens',
  'guard_knot',
  'still_core',
  'soft_guard',
  'quick_fuse',
  'sighted_edge',
  'blaze_core',
  'fractured_blade',
  'iron_heart',
  'counter_sigil',
  'twin_core',
  'harmony_emblem',
  'ward_banner',
  'flare_banner',
] as const;

export function resolveRelicHooks(
  relicIds: readonly string[],
  context: Omit<RelicHookContext, 'relicId'>,
): RelicHookResult {
  const result: RelicHookResult = {};
  for (const relicId of relicIds) {
    const hook = RELIC_HOOKS[relicId];
    if (!hook) continue;
    const next = hook({ ...context, relicId });
    if (!next) continue;
    for (const key of [
      'strength',
      'momentum',
      'metallicize',
      'steadyGuard',
      'block',
      'openingHandDraw',
      'damageBonus',
      'draw',
      'energy',
      'maxHp',
      'currentHp',
      'momentumReduction',
      'nextAttackBonus',
      'nextSkillBonus',
    ] as const) {
      const value = next[key];
      if (typeof value === 'number') result[key] = (result[key] ?? 0) + value;
    }
    if (typeof next.reflectRatio === 'number') {
      result.reflectRatio = Math.max(result.reflectRatio ?? 0, next.reflectRatio);
    }
    if (next.forceExhaustAttack) result.forceExhaustAttack = true;
    if (next.harmonyTriggered) result.harmonyTriggered = true;
  }
  return result;
}

export function applyRelicPickupHooks(run: RunState, relicId: string): void {
  const result = resolveRelicHooks([relicId], { run, trigger: 'pickup' });
  if (result.maxHp) run.player.maxHp += result.maxHp;
  if (result.currentHp) run.player.currentHp += result.currentHp;
}

export function hasRelicRuntimeHook(relicId: string): boolean {
  return typeof RELIC_HOOKS[relicId] === 'function' && Boolean(RELIC_DEFINITIONS[relicId]);
}

export function activeRelicPoolHasRuntimeHooks(): boolean {
  return COMMON_RELIC_POOL.every((relicId) => hasRelicRuntimeHook(relicId));
}
