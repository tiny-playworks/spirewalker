import {
  STATUS_METALLICIZE,
  STATUS_MOMENTUM,
  STATUS_PRIMED_BREAK,
  STATUS_STEADY_GUARD,
  STATUS_STRENGTH,
  STATUS_VULNERABLE,
} from '../statuses';
import type { CardDefinition } from '../../model/card';

export const STRIKE: CardDefinition = {
  id: 'strike',
  name: '打击',
  description: '造成 6 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'damage', value: 6, target: 'selected' }],
};

export const DEFEND: CardDefinition = {
  id: 'defend',
  name: '防御',
  description: '获得 5 点格挡。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'block', value: 5, target: 'self' }],
};

/** 施加易伤（本回合后结算用 modifyIncomingAttackDamage） */
export const BASH: CardDefinition = {
  id: 'bash',
  name: '重击',
  description: '造成 7 点伤害，施加 2 层易伤。',
  type: 'attack',
  rarity: 'common',
  cost: 2,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 7, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_VULNERABLE, stacks: 2, target: 'selected' },
  ],
};

export const FLEX: CardDefinition = {
  id: 'flex',
  name: '柔韧',
  description: '获得 2 点力量。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 2, target: 'self' }],
};

/** 全体攻击：拖到右侧战域或任意敌人上松手 */
export const CLEAVE: CardDefinition = {
  id: 'cleave',
  name: '顺劈',
  description: '对所有敌人造成 8 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 2,
  target: 'all_enemies',
  effects: [{ type: 'damage', value: 8, target: 'all_enemies' }],
};

/** 本回合能量 +1（0 费技能） */
export const SURGE: CardDefinition = {
  id: 'surge',
  name: '涌能',
  description: '获得 1 点能量。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [{ type: 'gain_energy', value: 1 }],
};

/** 过牌（文档 EffectDefinition.draw） */
export const SKIM: CardDefinition = {
  id: 'skim',
  name: '扫视',
  description: '抽 2 张牌。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'draw', value: 2 }],
};

/** 连势：后续每出一牌获格挡并衰减一层（由 statusHooks onAfterPlayCard 处理） */
export const MOMENTUM: CardDefinition = {
  id: 'momentum',
  name: '蓄势',
  description: '获得 2 层连势（每次出牌后获得等同层数的格挡，并衰减 1 层）。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 2, target: 'self' }],
};

/** 规则样板：主效果结算完成后，再触发 momentum 的 onAfterPlayCard。 */
export const TEMPO_GUARD: CardDefinition = {
  id: 'tempo_guard',
  name: '守势',
  description: '获得 3 点格挡，并获得 2 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 3, target: 'self' },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 2, target: 'self' },
  ],
};

/** 低成本起势样板：小额起势并修正手牌。 */
export const PRIME_RHYTHM: CardDefinition = {
  id: 'prime_rhythm',
  name: '起手式',
  description: '获得 2 层连势，抽 1 张牌。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 2, target: 'self' },
    { type: 'draw', value: 1 },
  ],
};

/** 防守起势样板：在承压回合建立少量 momentum。 */
export const BRACE_RHYTHM: CardDefinition = {
  id: 'brace_rhythm',
  name: '稳架',
  description: '获得 5 点格挡，并获得 2 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 5, target: 'self' },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 2, target: 'self' },
  ],
};

/** 主动消耗样板：把当前连势全部转成伤害。 */
export const BURST_STRIKE: CardDefinition = {
  id: 'burst_strike',
  name: '破势击',
  description: '造成 4 点伤害，并消耗全部连势，每层额外造成 3 点伤害。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 1,
  target: 'single_enemy',
  effects: [
    {
      type: 'custom',
      scriptId: 'momentum_burst_damage',
      params: {
        consumeMode: 'all',
        baseDamage: 4,
        damagePerStack: 3,
      },
    },
  ],
};

/** 固定消耗样板：吃固定层数 momentum，保留剩余层数。 */
export const SNAP_STRIKE: CardDefinition = {
  id: 'snap_strike',
  name: '断势击',
  description: '造成 5 点伤害，并消耗至多 2 层连势，每层额外造成 4 点伤害。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 1,
  target: 'single_enemy',
  effects: [
    {
      type: 'custom',
      scriptId: 'momentum_burst_damage',
      params: {
        consumeMode: 'fixed',
        consumeValue: 2,
        baseDamage: 5,
        damagePerStack: 4,
      },
    },
  ],
};

/** 转化样板：把 momentum 兑现成过牌，而不是伤害。 */
export const CASH_FLOW: CardDefinition = {
  id: 'cash_flow',
  name: '转势',
  description: '抽 1 张牌，并消耗全部连势，每层额外抽 1 张牌。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 1,
  target: 'none',
  effects: [
    {
      type: 'custom',
      scriptId: 'momentum_burst_draw',
      params: {
        consumeMode: 'all',
        baseDraw: 1,
        drawPerStack: 1,
      },
    },
  ],
};

/** 固定转化样板：吃固定层数 momentum 换成过牌。 */
export const RELEASE_FLOW: CardDefinition = {
  id: 'release_flow',
  name: '放势',
  description: '抽 1 张牌，并消耗至多 2 层连势，每层额外抽 1 张牌。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 1,
  target: 'none',
  effects: [
    {
      type: 'custom',
      scriptId: 'momentum_burst_draw',
      params: {
        consumeMode: 'fixed',
        consumeValue: 2,
        baseDraw: 1,
        drawPerStack: 1,
      },
    },
  ],
};

/** 节奏修复样板：低风险回稳，补一点防守和手牌效率。 */
export const STEADY_STEP: CardDefinition = {
  id: 'steady_step',
  name: '整步',
  description: '获得 6 点格挡，抽 1 张牌。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 6, target: 'self' },
    { type: 'draw', value: 1 },
  ],
};

/** 节奏修复样板：修复资源断档，适合过渡回合。 */
export const RECENTER: CardDefinition = {
  id: 'recenter',
  name: '回气',
  description: '抽 1 张牌，获得 1 点能量。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [
    { type: 'draw', value: 1 },
    { type: 'gain_energy', value: 1 },
  ],
};

/** 节奏修复样板：同时补少量生存与续航。 */
export const PATCH_BREATH: CardDefinition = {
  id: 'patch_breath',
  name: '调息',
  description: '回复 4 点生命，获得 4 点格挡。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'heal', value: 4, target: 'self' },
    { type: 'block', value: 4, target: 'self' },
  ],
};

/** 节奏修复样板：稳住防守同时不丢下回合行动空间。 */
export const SECOND_WIND: CardDefinition = {
  id: 'second_wind',
  name: '续拍',
  description: '获得 5 点格挡，获得 1 点能量。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 5, target: 'self' },
    { type: 'gain_energy', value: 1 },
  ],
};

/** 保势补强：低费补一点防守，同时把连势重新托起来。 */
export const SOFT_STEP: CardDefinition = {
  id: 'soft_step',
  name: '垫步',
  description: '获得 3 点格挡，并获得 1 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [
    { type: 'block', value: 3, target: 'self' },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 1, target: 'self' },
  ],
};

/** 保势补强：把稳守路线和持续防御连接起来。 */
export const ANCHORED_BREATH: CardDefinition = {
  id: 'anchored_breath',
  name: '定息',
  description: '获得 5 点格挡，并获得 1 层金属化与 1 层稳势。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 5, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 1, target: 'self' },
    { type: 'apply_status', statusId: STATUS_STEADY_GUARD, stacks: 1, target: 'self' },
  ],
};

export const HELD_BREATH: CardDefinition = {
  id: 'held_breath',
  name: '屏息',
  description: '获得 6 点格挡。获得 1 层稳势。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 6, target: 'self' },
    { type: 'apply_status', statusId: STATUS_STEADY_GUARD, stacks: 1, target: 'self' },
  ],
};

export const PATIENT_CUT: CardDefinition = {
  id: 'patient_cut',
  name: '缓收',
  description: '造成 6 点伤害。获得等同当前连势层数的格挡，不消耗连势。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 6, target: 'selected' },
    {
      type: 'custom',
      scriptId: 'momentum_guard_by_stacks',
      params: {
        baseBlock: 0,
        blockPerStack: 1,
      },
    },
  ],
};

/** 防守流专项桥梁：承压回合仍可推进并为后续回合留稳势。 */
export const ANCHOR_SLASH: CardDefinition = {
  id: 'anchor_slash',
  name: '定锋',
  description: '造成 6 点伤害，获得 4 点格挡，并获得 1 层稳势。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 6, target: 'selected' },
    { type: 'block', value: 4, target: 'self' },
    { type: 'apply_status', statusId: STATUS_STEADY_GUARD, stacks: 1, target: 'self' },
  ],
};

/** guard 专项：承压回合补足手牌质量，稳定过 execution_check 中段。 */
export const STABLE_MIND: CardDefinition = {
  id: 'stable_mind',
  name: '定心',
  description: '获得 7 点格挡。若本回合未主动消耗连势，再抽 1 张牌并获得 1 层连势。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 7, target: 'self' },
    {
      type: 'custom',
      scriptId: 'momentum_conditional_draw',
      params: { drawIfNoMomentumConsume: 1, momentumIfNoMomentumConsume: 1 },
    },
  ],
};

/** 前期桥梁：在承压回合同时推进收束与防守。 */
export const GUARD_STRIKE: CardDefinition = {
  id: 'guard_strike',
  name: '护锋',
  description: '造成 6 点伤害，获得 4 点格挡。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 6, target: 'selected' },
    { type: 'block', value: 4, target: 'self' },
  ],
};

/** 兑现补强：小额连势也能立刻换成伤害。 */
export const QUICK_RELEASE: CardDefinition = {
  id: 'quick_release',
  name: '疾放',
  description: '造成 3 点伤害，并消耗至多 1 层连势，每层额外造成 5 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 0,
  target: 'single_enemy',
  effects: [
    {
      type: 'custom',
      scriptId: 'momentum_burst_damage',
      params: {
        consumeMode: 'fixed',
        consumeValue: 1,
        baseDamage: 3,
        damagePerStack: 5,
      },
    },
  ],
};

export const BREAK_OPENING: CardDefinition = {
  id: 'break_opening',
  name: '压锋',
  description: '获得 2 层连势。获得 1 层破势预热。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 2, target: 'self' },
    { type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 1, target: 'self' },
  ],
};

/** 兑现补强：中段兑现后给一点后续行动空间。 */
export const FOLLOW_THROUGH: CardDefinition = {
  id: 'follow_through',
  name: '追击',
  description: '造成 4 点伤害，并消耗至多 2 层连势，每层额外造成 3 点伤害。若实际消耗了连势，获得 1 点能量。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 1,
  target: 'single_enemy',
  effects: [
    {
      type: 'custom',
      scriptId: 'momentum_burst_damage',
      params: {
        consumeMode: 'fixed',
        consumeValue: 2,
        baseDamage: 4,
        damagePerStack: 3,
        gainEnergyIfConsumed: 1,
      },
    },
  ],
};

export const FULL_RELEASE: CardDefinition = {
  id: 'full_release',
  name: '断流',
  description: '造成 6 点伤害，并消耗全部连势，每层额外造成 3 点伤害。抽 1 张牌。',
  type: 'attack',
  rarity: 'rare',
  cost: 1,
  target: 'single_enemy',
  effects: [
    {
      type: 'custom',
      scriptId: 'momentum_burst_damage',
      params: {
        consumeMode: 'all',
        baseDamage: 6,
        damagePerStack: 3,
      },
    },
    { type: 'draw', value: 1 },
  ],
};

/** 通用修复：整理手牌，不额外引入复杂机制。 */
export const SURVEY_FIELD: CardDefinition = {
  id: 'survey_field',
  name: '观势',
  description: '抽 2 张牌。获得 1 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [
    { type: 'draw', value: 2 },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 1, target: 'self' },
  ],
};

/** 通用修复：回一口血，同时不完全放弃下回合节奏。 */
export const MEASURED_REST: CardDefinition = {
  id: 'measured_rest',
  name: '养息',
  description: '回复 3 点生命，获得 4 点格挡，并获得 1 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'heal', value: 3, target: 'self' },
    { type: 'block', value: 4, target: 'self' },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 1, target: 'self' },
  ],
};

export const JUNK_SLUDGE: CardDefinition = {
  id: 'junk_sludge',
  name: '淤泥',
  description: '污染牌。没有任何效果。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [],
};

export const JUNK_BURN: CardDefinition = {
  id: 'junk_burn',
  name: '灼痕',
  description: '污染牌。没有任何效果。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [],
};

export const JUNK_STATIC: CardDefinition = {
  id: 'junk_static',
  name: '噪讯',
  description: '污染牌。没有任何效果。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [],
};

export const MOMENTUM_SETUP_CARD_IDS = [
  MOMENTUM.id,
  TEMPO_GUARD.id,
  PRIME_RHYTHM.id,
  BRACE_RHYTHM.id,
  SOFT_STEP.id,
  HELD_BREATH.id,
  BREAK_OPENING.id,
] as const;

export const MOMENTUM_PAYOFF_CARD_IDS = [
  BURST_STRIKE.id,
  SNAP_STRIKE.id,
  CASH_FLOW.id,
  RELEASE_FLOW.id,
  PATIENT_CUT.id,
  QUICK_RELEASE.id,
  FOLLOW_THROUGH.id,
  FULL_RELEASE.id,
] as const;

export const TEMPO_RECOVERY_CARD_IDS = [
  STEADY_STEP.id,
  RECENTER.id,
  PATCH_BREATH.id,
  SECOND_WIND.id,
  SURVEY_FIELD.id,
  MEASURED_REST.id,
  ANCHOR_SLASH.id,
  STABLE_MIND.id,
  GUARD_STRIKE.id,
] as const;

export const DEFENSE_LINE_CARD_IDS = [
  BRACE_RHYTHM.id,
  TEMPO_GUARD.id,
  SOFT_STEP.id,
  HELD_BREATH.id,
  ANCHORED_BREATH.id,
  STABLE_MIND.id,
  PATIENT_CUT.id,
  ANCHOR_SLASH.id,
  GUARD_STRIKE.id,
] as const;

export const BURST_LINE_CARD_IDS = [
  BURST_STRIKE.id,
  SNAP_STRIKE.id,
  QUICK_RELEASE.id,
  FOLLOW_THROUGH.id,
  BREAK_OPENING.id,
  FULL_RELEASE.id,
] as const;

export const CORE_STAPLE_CARD_IDS = [
  STRIKE.id,
  DEFEND.id,
  BASH.id,
  FLEX.id,
  CLEAVE.id,
  SKIM.id,
  SURGE.id,
] as const;

export const COMMON_REWARD_CARD_POOL = [
  BASH.id,
  FLEX.id,
  CLEAVE.id,
  SKIM.id,
  SURGE.id,
] as const;

export const CARD_DEFINITIONS: Record<string, CardDefinition> = {
  [STRIKE.id]: STRIKE,
  [DEFEND.id]: DEFEND,
  [BASH.id]: BASH,
  [FLEX.id]: FLEX,
  [CLEAVE.id]: CLEAVE,
  [SURGE.id]: SURGE,
  [SKIM.id]: SKIM,
  [MOMENTUM.id]: MOMENTUM,
  [TEMPO_GUARD.id]: TEMPO_GUARD,
  [PRIME_RHYTHM.id]: PRIME_RHYTHM,
  [BRACE_RHYTHM.id]: BRACE_RHYTHM,
  [BURST_STRIKE.id]: BURST_STRIKE,
  [SNAP_STRIKE.id]: SNAP_STRIKE,
  [CASH_FLOW.id]: CASH_FLOW,
  [RELEASE_FLOW.id]: RELEASE_FLOW,
  [STEADY_STEP.id]: STEADY_STEP,
  [RECENTER.id]: RECENTER,
  [PATCH_BREATH.id]: PATCH_BREATH,
  [SECOND_WIND.id]: SECOND_WIND,
  [SOFT_STEP.id]: SOFT_STEP,
  [ANCHORED_BREATH.id]: ANCHORED_BREATH,
  [HELD_BREATH.id]: HELD_BREATH,
  [PATIENT_CUT.id]: PATIENT_CUT,
  [ANCHOR_SLASH.id]: ANCHOR_SLASH,
  [STABLE_MIND.id]: STABLE_MIND,
  [GUARD_STRIKE.id]: GUARD_STRIKE,
  [QUICK_RELEASE.id]: QUICK_RELEASE,
  [FOLLOW_THROUGH.id]: FOLLOW_THROUGH,
  [BREAK_OPENING.id]: BREAK_OPENING,
  [FULL_RELEASE.id]: FULL_RELEASE,
  [SURVEY_FIELD.id]: SURVEY_FIELD,
  [MEASURED_REST.id]: MEASURED_REST,
  [JUNK_SLUDGE.id]: JUNK_SLUDGE,
  [JUNK_BURN.id]: JUNK_BURN,
  [JUNK_STATIC.id]: JUNK_STATIC,
};
