import type { CardDefinition } from '../../../model/card';
import {
  STATUS_MOMENTUM,
  STATUS_METALLICIZE,
  STATUS_STRENGTH,
  STATUS_VULNERABLE,
  STATUS_STEADY_GUARD,
} from '../../statuses';

/**
 * 混合流派 - 生成卡牌 A (55张)
 * 主题：攻防切换、条件增益、连势运用、灵活转换
 * 分布：15普通攻击 / 15普通技能 / 15稀有(攻/技/能混合) / 10史诗(攻/技/能混合)
 */

// ==================== 普通攻击牌 (15张) ====================

export const MX_A_GENTLE_SLASH: CardDefinition = {
  id: 'mx_a_gentle_slash',
  name: '轻斩',
  description: '造成 5 点伤害，获得 3 点格挡。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 5, target: 'selected' },
    { type: 'block', value: 3, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 1,
  tags: ['damage', 'block'],
};

export const MX_A_ADAPTIVE_STRIKE: CardDefinition = {
  id: 'mx_a_adaptive_strike',
  name: '适应打击',
  description: '造成 7 点伤害。若你有格挡，额外造成 3 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    {
      type: 'custom',
      scriptId: 'conditional_damage',
      params: { baseDamage: 7, bonusDamage: 3, condition: 'has_block' },
    },
  ],
  archetype: 'mixed',
  chapter: 1,
  tags: ['damage', 'conditional'],
};

export const MX_A_RISING_BLADE: CardDefinition = {
  id: 'mx_a_rising_blade',
  name: '升势斩',
  description: '造成 5 点伤害，获得 1 层连势。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 5, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 1, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 1,
  tags: ['damage', 'momentum'],
};

export const MX_A_RAPID_FLURRY: CardDefinition = {
  id: 'mx_a_rapid_flurry',
  name: '急风乱斩',
  description: '造成 2 点伤害三次。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    {
      type: 'repeat',
      times: 3,
      effects: [{ type: 'damage', value: 2, target: 'selected' }],
    },
  ],
  archetype: 'mixed',
  chapter: 1,
  tags: ['damage', 'multi_hit'],
};

export const MX_A_BALANCED_CUT: CardDefinition = {
  id: 'mx_a_balanced_cut',
  name: '平衡斩',
  description: '造成 6 点伤害，获得 2 点格挡，抽 1 张牌。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 6, target: 'selected' },
    { type: 'block', value: 2, target: 'self' },
    { type: 'draw', value: 1 },
  ],
  archetype: 'mixed',
  chapter: 1,
  tags: ['damage', 'block', 'draw'],
};

export const MX_A_STEEL_EDGE: CardDefinition = {
  id: 'mx_a_steel_edge',
  name: '钢锋',
  description: '造成 8 点伤害，获得 1 层金属化。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 8, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 1, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['damage', 'metallicize'],
};

export const MX_A_GUARD_BREAKER: CardDefinition = {
  id: 'mx_a_guard_breaker',
  name: '破盾击',
  description: '造成 6 点伤害，施加 1 层易伤。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 6, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_VULNERABLE, stacks: 1, target: 'selected' },
  ],
  archetype: 'mixed',
  chapter: 1,
  tags: ['damage', 'debuff'],
};

export const MX_A_RESONANT_STRIKE: CardDefinition = {
  id: 'mx_a_resonant_strike',
  name: '共鸣击',
  description: '造成 5 点伤害。若你有力量，额外造成 3 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    {
      type: 'custom',
      scriptId: 'conditional_damage',
      params: { baseDamage: 5, bonusDamage: 3, condition: 'has_strength' },
    },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['damage', 'conditional', 'strength'],
};

export const MX_A_QUICK_JAB: CardDefinition = {
  id: 'mx_a_quick_jab',
  name: '快刺',
  description: '造成 4 点伤害，抽 1 张牌。',
  type: 'attack',
  rarity: 'common',
  cost: 0,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 4, target: 'selected' },
    { type: 'draw', value: 1 },
  ],
  archetype: 'mixed',
  chapter: 1,
  tags: ['damage', 'draw'],
};

export const MX_A_HEAVY_PUSH: CardDefinition = {
  id: 'mx_a_heavy_push',
  name: '重推',
  description: '造成 9 点伤害，获得 3 点格挡。',
  type: 'attack',
  rarity: 'common',
  cost: 2,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 9, target: 'selected' },
    { type: 'block', value: 3, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['damage', 'block'],
};

export const MX_A_DOUBLE_TAP: CardDefinition = {
  id: 'mx_a_double_tap',
  name: '双重叩击',
  description: '造成 3 点伤害两次，获得 1 点格挡。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    {
      type: 'repeat',
      times: 2,
      effects: [{ type: 'damage', value: 3, target: 'selected' }],
    },
    { type: 'block', value: 1, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['damage', 'multi_hit', 'block'],
};

export const MX_A_SUDDEN_BOLT: CardDefinition = {
  id: 'mx_a_sudden_bolt',
  name: '突袭',
  description: '造成 6 点伤害。消耗 1 层连势，造成额外 3 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    {
      type: 'custom',
      scriptId: 'momentum_burst_damage',
      params: {
        consumeMode: 'fixed',
        consumeValue: 1,
        baseDamage: 6,
        damagePerStack: 0,
      },
    },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['damage', 'momentum'],
};

export const MX_A_REACTIVE_CUT: CardDefinition = {
  id: 'mx_a_reactive_cut',
  name: '反击斩',
  description: '造成 5 点伤害。若你有格挡，额外造成 4 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    {
      type: 'custom',
      scriptId: 'conditional_damage',
      params: { baseDamage: 5, bonusDamage: 4, condition: 'has_block' },
    },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['damage', 'conditional'],
};

export const MX_A_IRON_SLASH: CardDefinition = {
  id: 'mx_a_iron_slash',
  name: '铁斩',
  description: '对所有敌人造成 4 点伤害，获得 2 点格挡。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'all_enemies',
  effects: [
    { type: 'damage', value: 4, target: 'all_enemies' },
    { type: 'block', value: 2, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['damage', 'block', 'aoe'],
};

export const MX_A_CRESCENT_SLASH: CardDefinition = {
  id: 'mx_a_crescent_slash',
  name: '弧月斩',
  description: '造成 10 点伤害，获得 5 点格挡。',
  type: 'attack',
  rarity: 'common',
  cost: 2,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 10, target: 'selected' },
    { type: 'block', value: 5, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['damage', 'block'],
};

// ==================== 普通技能牌 (15张) ====================

export const MX_A_STEADY_BLOCK: CardDefinition = {
  id: 'mx_a_steady_block',
  name: '稳守',
  description: '获得 6 点格挡，获得 1 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 6, target: 'self' },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 1, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 1,
  tags: ['block', 'momentum'],
};

export const MX_A_ADAPTIVE_GUARD: CardDefinition = {
  id: 'mx_a_adaptive_guard',
  name: '适应防御',
  description: '获得 5 点格挡，抽 1 张牌。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 5, target: 'self' },
    { type: 'draw', value: 1 },
  ],
  archetype: 'mixed',
  chapter: 1,
  tags: ['block', 'draw'],
};

export const MX_A_IRON_COVER: CardDefinition = {
  id: 'mx_a_iron_cover',
  name: '铁幕',
  description: '获得 8 点格挡，获得 1 层金属化。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 8, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 1, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 1,
  tags: ['block', 'metallicize'],
};

export const MX_A_QUICK_SURGE: CardDefinition = {
  id: 'mx_a_quick_surge',
  name: '急涌',
  description: '获得 1 点能量，抽 1 张牌。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [
    { type: 'gain_energy', value: 1 },
    { type: 'draw', value: 1 },
  ],
  archetype: 'mixed',
  chapter: 1,
  tags: ['energy', 'draw'],
};

export const MX_A_COUNTER_PULSE: CardDefinition = {
  id: 'mx_a_counter_pulse',
  name: '反冲脉',
  description: '获得 3 点格挡，对所有敌人造成 2 点伤害。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 3, target: 'self' },
    { type: 'damage', value: 2, target: 'all_enemies' },
  ],
  archetype: 'mixed',
  chapter: 1,
  tags: ['block', 'damage'],
};

export const MX_A_MOMENTUM_FLOW: CardDefinition = {
  id: 'mx_a_momentum_flow',
  name: '连势流转',
  description: '获得 4 点格挡，获得 2 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 4, target: 'self' },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 2, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['block', 'momentum'],
};

export const MX_A_FLEXIBLE_STANCE: CardDefinition = {
  id: 'mx_a_flexible_stance',
  name: '灵活架势',
  description: '获得 1 层力量，获得 1 层金属化。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 1, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 1, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['strength', 'metallicize'],
};

export const MX_A_HEAVY_WARD: CardDefinition = {
  id: 'mx_a_heavy_ward',
  name: '重障',
  description: '获得 7 点格挡。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'block', value: 7, target: 'self' }],
  archetype: 'mixed',
  chapter: 1,
  tags: ['block'],
};

export const MX_A_STEEL_BREATH: CardDefinition = {
  id: 'mx_a_steel_breath',
  name: '钢息',
  description: '回复 3 点生命，获得 3 点格挡。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'heal', value: 3, target: 'self' },
    { type: 'block', value: 3, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['heal', 'block'],
};

export const MX_A_MOMENTUM_DRAIN: CardDefinition = {
  id: 'mx_a_momentum_drain',
  name: '连势吸取',
  description: '获得 4 点格挡。消耗 1 层连势，获得 1 点能量。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [
    { type: 'block', value: 4, target: 'self' },
    {
      type: 'custom',
      scriptId: 'momentum_to_energy',
      params: { consumeValue: 1, energyGain: 1 },
    },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['block', 'momentum', 'energy'],
};

export const MX_A_GUARDIAN_PULSE: CardDefinition = {
  id: 'mx_a_guardian_pulse',
  name: '守护脉动',
  description: '获得 5 点格挡，获得 1 层稳势。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 5, target: 'self' },
    { type: 'apply_status', statusId: STATUS_STEADY_GUARD, stacks: 1, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['block', 'steady_guard'],
};

export const MX_A_BREATH_CONTROL: CardDefinition = {
  id: 'mx_a_breath_control',
  name: '调息术',
  description: '回复 2 点生命，抽 1 张牌。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [
    { type: 'heal', value: 2, target: 'self' },
    { type: 'draw', value: 1 },
  ],
  archetype: 'mixed',
  chapter: 1,
  tags: ['heal', 'draw'],
};

export const MX_A_ENERGY_SIPHON: CardDefinition = {
  id: 'mx_a_energy_siphon',
  name: '能量虹吸',
  description: '获得 1 点能量，获得 1 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [
    { type: 'gain_energy', value: 1 },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 1, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['energy', 'momentum'],
};

export const MX_A_MOMENTUM_SENSE: CardDefinition = {
  id: 'mx_a_momentum_sense',
  name: '连势感知',
  description: '抽 2 张牌，获得 2 点格挡。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'draw', value: 2 },
    { type: 'block', value: 2, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['draw', 'block'],
};

export const MX_A_RESPONSIVE_GUARD: CardDefinition = {
  id: 'mx_a_responsive_guard',
  name: '应变防御',
  description: '获得 4 点格挡，获得 2 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 4, target: 'self' },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 2, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['block', 'momentum'],
};

// ==================== 稀有卡牌 (15张：5攻击 / 5技能 / 5能力) ====================

// --- 稀有攻击牌 ---

export const MX_A_MOMENTUM_CLEAVE: CardDefinition = {
  id: 'mx_a_momentum_cleave',
  name: '连势横斩',
  description: '对所有敌人造成 7 点伤害。消耗 2 层连势，造成额外 3 点伤害。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'all_enemies',
  effects: [
    {
      type: 'custom',
      scriptId: 'momentum_burst_damage',
      params: {
        consumeMode: 'fixed',
        consumeValue: 2,
        baseDamage: 7,
        damagePerStack: 0,
      },
    },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['damage', 'momentum', 'aoe'],
};

export const MX_A_ADAPTIVE_RUSH: CardDefinition = {
  id: 'mx_a_adaptive_rush',
  name: '适应猛冲',
  description: '造成 10 点伤害，获得 5 点格挡。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 10, target: 'selected' },
    { type: 'block', value: 5, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['damage', 'block'],
};

export const MX_A_STEEL_FLURRY: CardDefinition = {
  id: 'mx_a_steel_flurry',
  name: '钢铁乱舞',
  description: '造成 3 点伤害四次。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [
    {
      type: 'repeat',
      times: 4,
      effects: [{ type: 'damage', value: 3, target: 'selected' }],
    },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['damage', 'multi_hit'],
};

export const MX_A_BREAKING_POINT: CardDefinition = {
  id: 'mx_a_breaking_point',
  name: '破裂点',
  description: '造成 8 点伤害，施加 2 层易伤。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 8, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_VULNERABLE, stacks: 2, target: 'selected' },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['damage', 'debuff'],
};

export const MX_A_RESONANT_SLASH: CardDefinition = {
  id: 'mx_a_resonant_slash',
  name: '共鸣斩',
  description: '造成 6 点伤害。消耗所有连势，每层额外造成 2 点伤害。',
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
        baseDamage: 6,
        damagePerStack: 2,
      },
    },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['damage', 'momentum'],
};

// --- 稀有技能牌 ---

export const MX_A_FORTIFIED_STANCE: CardDefinition = {
  id: 'mx_a_fortified_stance',
  name: '固守架势',
  description: '获得 8 点格挡，获得 2 层金属化。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'block', value: 8, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 2, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['block', 'metallicize'],
};

export const MX_A_MOMENTUM_SURGE: CardDefinition = {
  id: 'mx_a_momentum_surge',
  name: '连势涌动',
  description: '获得 6 点格挡，获得 3 层连势。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'block', value: 6, target: 'self' },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 3, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['block', 'momentum'],
};

export const MX_A_ADAPTIVE_FLOW: CardDefinition = {
  id: 'mx_a_adaptive_flow',
  name: '适应流转',
  description: '抽 2 张牌，获得 4 点格挡。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'draw', value: 2 },
    { type: 'block', value: 4, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['draw', 'block'],
};

export const MX_A_IRON_RESOLVE: CardDefinition = {
  id: 'mx_a_iron_resolve',
  name: '铁意',
  description: '获得 2 层力量，获得 2 层金属化。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 2, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 2, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['strength', 'metallicize'],
};

export const MX_A_DEFIANT_PARRY: CardDefinition = {
  id: 'mx_a_defiant_parry',
  name: '挑衅格挡',
  description: '获得 6 点格挡，对所有敌人造成 3 点伤害。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 6, target: 'self' },
    { type: 'damage', value: 3, target: 'all_enemies' },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['block', 'damage'],
};

// --- 稀有能力牌 ---

export const MX_A_MOMENTUM_OVERFLOW: CardDefinition = {
  id: 'mx_a_momentum_overflow',
  name: '连势溢出',
  description: '获得 3 层连势。',
  type: 'power',
  rarity: 'uncommon',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 3, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['momentum', 'setup'],
};

export const MX_A_STEEL_AURA: CardDefinition = {
  id: 'mx_a_steel_aura',
  name: '钢铁光环',
  description: '获得 3 层金属化。',
  type: 'power',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 3, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['metallicize', 'scaling'],
};

export const MX_A_ADAPTIVE_INSTINCT: CardDefinition = {
  id: 'mx_a_adaptive_instinct',
  name: '适应直觉',
  description: '获得 2 层力量。',
  type: 'power',
  rarity: 'uncommon',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 2, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['strength', 'scaling'],
};

export const MX_A_BALANCED_DANCE: CardDefinition = {
  id: 'mx_a_balanced_dance',
  name: '均衡之舞',
  description: '获得 2 层连势，获得 2 层金属化。',
  type: 'power',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 2, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 2, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['momentum', 'metallicize'],
};

export const MX_A_GUARDIAN_FURY: CardDefinition = {
  id: 'mx_a_guardian_fury',
  name: '守护狂怒',
  description: '获得 2 层力量，获得 2 层金属化。',
  type: 'power',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 2, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 2, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['strength', 'metallicize'],
};

// ==================== 史诗卡牌 (10张：3攻击 / 4技能 / 3能力) ====================

// --- 史诗攻击牌 ---

export const MX_A_MOMENTUM_DEVASTATION: CardDefinition = {
  id: 'mx_a_momentum_devastation',
  name: '连势毁灭',
  description: '造成 12 点伤害。消耗所有连势，每层额外造成 4 点伤害。抽 1 张牌。',
  type: 'attack',
  rarity: 'rare',
  cost: 2,
  target: 'single_enemy',
  effects: [
    {
      type: 'custom',
      scriptId: 'momentum_burst_damage',
      params: {
        consumeMode: 'all',
        baseDamage: 12,
        damagePerStack: 4,
      },
    },
    { type: 'draw', value: 1 },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['damage', 'momentum', 'draw'],
};

export const MX_A_ABSOLUTE_BREAK: CardDefinition = {
  id: 'mx_a_absolute_break',
  name: '绝对破击',
  description: '造成 15 点伤害，施加 2 层易伤，获得 6 点格挡。',
  type: 'attack',
  rarity: 'rare',
  cost: 3,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 15, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_VULNERABLE, stacks: 2, target: 'selected' },
    { type: 'block', value: 6, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['damage', 'debuff', 'block'],
};

export const MX_A_MOMENTUM_CRESCENDO: CardDefinition = {
  id: 'mx_a_momentum_crescendo',
  name: '连势渐强',
  description: '造成 5 点伤害两次。消耗 2 层连势，额外造成 5 点伤害。',
  type: 'attack',
  rarity: 'rare',
  cost: 2,
  target: 'single_enemy',
  effects: [
    {
      type: 'repeat',
      times: 2,
      effects: [{ type: 'damage', value: 5, target: 'selected' }],
    },
    {
      type: 'custom',
      scriptId: 'momentum_burst_damage',
      params: {
        consumeMode: 'fixed',
        consumeValue: 2,
        baseDamage: 0,
        damagePerStack: 0,
      },
    },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['damage', 'momentum', 'multi_hit'],
};

// --- 史诗技能牌 ---

export const MX_A_IRON_CURTAIN: CardDefinition = {
  id: 'mx_a_iron_curtain',
  name: '铁幕降临',
  description: '获得 12 点格挡，获得 2 层金属化，抽 2 张牌。',
  type: 'skill',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [
    { type: 'block', value: 12, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 2, target: 'self' },
    { type: 'draw', value: 2 },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['block', 'metallicize', 'draw'],
};

export const MX_A_MOMENTUM_UNLEASH: CardDefinition = {
  id: 'mx_a_momentum_unleash',
  name: '连势释放',
  description: '抽 3 张牌，获得 2 点能量。消耗 2 层连势。',
  type: 'skill',
  rarity: 'rare',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'draw', value: 3 },
    {
      type: 'custom',
      scriptId: 'momentum_burst_draw',
      params: {
        consumeMode: 'fixed',
        consumeValue: 2,
        baseDraw: 0,
        drawPerStack: 0,
      },
    },
    { type: 'gain_energy', value: 2 },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['draw', 'momentum', 'energy'],
};

export const MX_A_FORTIFIED_MOMENTUM: CardDefinition = {
  id: 'mx_a_fortified_momentum',
  name: '固守连势',
  description: '获得 10 点格挡，获得 4 层连势。',
  type: 'skill',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [
    { type: 'block', value: 10, target: 'self' },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 4, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['block', 'momentum'],
};

export const MX_A_ADAPTIVE_MASTERY: CardDefinition = {
  id: 'mx_a_adaptive_mastery',
  name: '适应精通',
  description: '获得 3 层力量，获得 3 层金属化。',
  type: 'skill',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 3, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 3, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['strength', 'metallicize'],
};

// --- 史感能力牌 ---

export const MX_A_MOMENTUM_ASCENSION: CardDefinition = {
  id: 'mx_a_momentum_ascension',
  name: '连势升腾',
  description: '获得 4 层连势，获得 2 层金属化。',
  type: 'power',
  rarity: 'rare',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 4, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 2, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 2,
  tags: ['momentum', 'metallicize'],
};

export const MX_A_BALANCED_HARMONY: CardDefinition = {
  id: 'mx_a_balanced_harmony',
  name: '均衡和谐',
  description: '获得 3 层力量，获得 3 层金属化。',
  type: 'power',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 3, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 3, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['strength', 'metallicize'],
};

export const MX_A_UNYIELDING_GUARD: CardDefinition = {
  id: 'mx_a_unyielding_guard',
  name: '不屈守卫',
  description: '获得 3 层金属化，获得 2 层稳势。',
  type: 'power',
  rarity: 'rare',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 3, target: 'self' },
    { type: 'apply_status', statusId: STATUS_STEADY_GUARD, stacks: 2, target: 'self' },
  ],
  archetype: 'mixed',
  chapter: 3,
  tags: ['metallicize', 'steady_guard'],
};

// ==================== 导出所有混合生成卡牌 A ====================

export const MIXED_GENERATED_A: Record<string, CardDefinition> = {
  // 普通攻击牌
  [MX_A_GENTLE_SLASH.id]: MX_A_GENTLE_SLASH,
  [MX_A_ADAPTIVE_STRIKE.id]: MX_A_ADAPTIVE_STRIKE,
  [MX_A_RISING_BLADE.id]: MX_A_RISING_BLADE,
  [MX_A_RAPID_FLURRY.id]: MX_A_RAPID_FLURRY,
  [MX_A_BALANCED_CUT.id]: MX_A_BALANCED_CUT,
  [MX_A_STEEL_EDGE.id]: MX_A_STEEL_EDGE,
  [MX_A_GUARD_BREAKER.id]: MX_A_GUARD_BREAKER,
  [MX_A_RESONANT_STRIKE.id]: MX_A_RESONANT_STRIKE,
  [MX_A_QUICK_JAB.id]: MX_A_QUICK_JAB,
  [MX_A_HEAVY_PUSH.id]: MX_A_HEAVY_PUSH,
  [MX_A_DOUBLE_TAP.id]: MX_A_DOUBLE_TAP,
  [MX_A_SUDDEN_BOLT.id]: MX_A_SUDDEN_BOLT,
  [MX_A_REACTIVE_CUT.id]: MX_A_REACTIVE_CUT,
  [MX_A_IRON_SLASH.id]: MX_A_IRON_SLASH,
  [MX_A_CRESCENT_SLASH.id]: MX_A_CRESCENT_SLASH,

  // 普通技能牌
  [MX_A_STEADY_BLOCK.id]: MX_A_STEADY_BLOCK,
  [MX_A_ADAPTIVE_GUARD.id]: MX_A_ADAPTIVE_GUARD,
  [MX_A_IRON_COVER.id]: MX_A_IRON_COVER,
  [MX_A_QUICK_SURGE.id]: MX_A_QUICK_SURGE,
  [MX_A_COUNTER_PULSE.id]: MX_A_COUNTER_PULSE,
  [MX_A_MOMENTUM_FLOW.id]: MX_A_MOMENTUM_FLOW,
  [MX_A_FLEXIBLE_STANCE.id]: MX_A_FLEXIBLE_STANCE,
  [MX_A_HEAVY_WARD.id]: MX_A_HEAVY_WARD,
  [MX_A_STEEL_BREATH.id]: MX_A_STEEL_BREATH,
  [MX_A_MOMENTUM_DRAIN.id]: MX_A_MOMENTUM_DRAIN,
  [MX_A_GUARDIAN_PULSE.id]: MX_A_GUARDIAN_PULSE,
  [MX_A_BREATH_CONTROL.id]: MX_A_BREATH_CONTROL,
  [MX_A_ENERGY_SIPHON.id]: MX_A_ENERGY_SIPHON,
  [MX_A_MOMENTUM_SENSE.id]: MX_A_MOMENTUM_SENSE,
  [MX_A_RESPONSIVE_GUARD.id]: MX_A_RESPONSIVE_GUARD,

  // 稀有卡牌
  [MX_A_MOMENTUM_CLEAVE.id]: MX_A_MOMENTUM_CLEAVE,
  [MX_A_ADAPTIVE_RUSH.id]: MX_A_ADAPTIVE_RUSH,
  [MX_A_STEEL_FLURRY.id]: MX_A_STEEL_FLURRY,
  [MX_A_BREAKING_POINT.id]: MX_A_BREAKING_POINT,
  [MX_A_RESONANT_SLASH.id]: MX_A_RESONANT_SLASH,
  [MX_A_FORTIFIED_STANCE.id]: MX_A_FORTIFIED_STANCE,
  [MX_A_MOMENTUM_SURGE.id]: MX_A_MOMENTUM_SURGE,
  [MX_A_ADAPTIVE_FLOW.id]: MX_A_ADAPTIVE_FLOW,
  [MX_A_IRON_RESOLVE.id]: MX_A_IRON_RESOLVE,
  [MX_A_DEFIANT_PARRY.id]: MX_A_DEFIANT_PARRY,
  [MX_A_MOMENTUM_OVERFLOW.id]: MX_A_MOMENTUM_OVERFLOW,
  [MX_A_STEEL_AURA.id]: MX_A_STEEL_AURA,
  [MX_A_ADAPTIVE_INSTINCT.id]: MX_A_ADAPTIVE_INSTINCT,
  [MX_A_BALANCED_DANCE.id]: MX_A_BALANCED_DANCE,
  [MX_A_GUARDIAN_FURY.id]: MX_A_GUARDIAN_FURY,

  // 史诗卡牌
  [MX_A_MOMENTUM_DEVASTATION.id]: MX_A_MOMENTUM_DEVASTATION,
  [MX_A_ABSOLUTE_BREAK.id]: MX_A_ABSOLUTE_BREAK,
  [MX_A_MOMENTUM_CRESCENDO.id]: MX_A_MOMENTUM_CRESCENDO,
  [MX_A_IRON_CURTAIN.id]: MX_A_IRON_CURTAIN,
  [MX_A_MOMENTUM_UNLEASH.id]: MX_A_MOMENTUM_UNLEASH,
  [MX_A_FORTIFIED_MOMENTUM.id]: MX_A_FORTIFIED_MOMENTUM,
  [MX_A_ADAPTIVE_MASTERY.id]: MX_A_ADAPTIVE_MASTERY,
  [MX_A_MOMENTUM_ASCENSION.id]: MX_A_MOMENTUM_ASCENSION,
  [MX_A_BALANCED_HARMONY.id]: MX_A_BALANCED_HARMONY,
  [MX_A_UNYIELDING_GUARD.id]: MX_A_UNYIELDING_GUARD,
};
