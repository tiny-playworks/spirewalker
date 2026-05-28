import type { CardDefinition } from '../../../model/card';
import {
  STATUS_MOMENTUM,
  STATUS_PRIMED_BREAK,
  STATUS_STRENGTH,
  STATUS_VULNERABLE,
} from '../../statuses';

/**
 * 爆发流派 - 生成卡牌 B 系列 (55张)
 * 主题：连势消耗、高伤害爆发、能量兑现、破势预热
 */

export const BURST_GENERATED_B: Record<string, CardDefinition> = {
  // ==================== 普通攻击牌 (15张) ====================

  br_b_rupture_slash: {
    id: 'br_b_rupture_slash',
    name: '裂隙斩',
    description: '造成 7 点伤害。消耗所有连势，每层造成额外 2 点伤害。',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'all', baseDamage: 7, damagePerStack: 2 },
      },
    ],
    archetype: 'burst',
    chapter: 1,
    tags: ['damage', 'momentum'],
  },

  br_b_momentum_strike: {
    id: 'br_b_momentum_strike',
    name: '蓄势斩',
    description: '造成 5 点伤害。消耗 2 层连势，造成额外 5 点伤害。',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'fixed', consumeValue: 2, baseDamage: 5, damagePerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'momentum'],
  },

  br_b_quick_slash: {
    id: 'br_b_quick_slash',
    name: '快斩',
    description: '造成 4 点伤害两次。',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'single_enemy',
    effects: [
      {
        type: 'repeat',
        times: 2,
        effects: [{ type: 'damage', value: 4, target: 'selected' }],
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'multi_hit'],
  },

  br_b_heavy_strike: {
    id: 'br_b_heavy_strike',
    name: '重击',
    description: '造成 10 点伤害。',
    type: 'attack',
    rarity: 'common',
    cost: 2,
    target: 'single_enemy',
    effects: [{ type: 'damage', value: 10, target: 'selected' }],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage'],
  },

  br_b_armor_break: {
    id: 'br_b_armor_break',
    name: '破甲击',
    description: '造成 6 点伤害，施加 2 层易伤。',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'single_enemy',
    effects: [
      { type: 'damage', value: 6, target: 'selected' },
      { type: 'apply_status', statusId: STATUS_VULNERABLE, stacks: 2, target: 'selected' },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'debuff'],
  },

  br_b_chain_slash: {
    id: 'br_b_chain_slash',
    name: '连斩',
    description: '造成 3 点伤害三次。',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'single_enemy',
    effects: [
      {
        type: 'repeat',
        times: 3,
        effects: [{ type: 'damage', value: 3, target: 'selected' }],
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'multi_hit'],
  },

  br_b_momentum_heavy: {
    id: 'br_b_momentum_heavy',
    name: '连势重击',
    description: '造成 12 点伤害。消耗 3 层连势。',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'fixed', consumeValue: 3, baseDamage: 12, damagePerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'momentum'],
  },

  br_b_burst_slash: {
    id: 'br_b_burst_slash',
    name: '爆发斩',
    description: '造成 15 点伤害。消耗所有连势。',
    type: 'attack',
    rarity: 'common',
    cost: 2,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'all', baseDamage: 15, damagePerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'momentum'],
  },

  br_b_primed_strike: {
    id: 'br_b_primed_strike',
    name: '预热打击',
    description: '造成 7 点伤害。若你有破势预热，造成额外 7 点伤害。',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'conditional_damage',
        params: { baseDamage: 7, bonusDamage: 7, condition: 'has_primed_break' },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'primed_break'],
  },

  br_b_dual_slash: {
    id: 'br_b_dual_slash',
    name: '双重斩',
    description: '造成 5 点伤害两次。消耗 2 层连势。',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'fixed', consumeValue: 2, baseDamage: 5, damagePerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'multi_hit', 'momentum'],
  },

  br_b_cleave: {
    id: 'br_b_cleave',
    name: '横扫',
    description: '对所有敌人造成 8 点伤害。',
    type: 'attack',
    rarity: 'common',
    cost: 2,
    target: 'all_enemies',
    effects: [{ type: 'damage', value: 8, target: 'all_enemies' }],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'aoe'],
  },

  br_b_rapid_strike: {
    id: 'br_b_rapid_strike',
    name: '疾风击',
    description: '造成 2 点伤害四次。',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'single_enemy',
    effects: [
      {
        type: 'repeat',
        times: 4,
        effects: [{ type: 'damage', value: 2, target: 'selected' }],
      },
    ],
    archetype: 'burst',
    chapter: 3,
    tags: ['damage', 'multi_hit'],
  },

  br_b_devastate: {
    id: 'br_b_devastate',
    name: '毁灭一击',
    description: '造成 18 点伤害。',
    type: 'attack',
    rarity: 'common',
    cost: 2,
    target: 'single_enemy',
    effects: [{ type: 'damage', value: 18, target: 'selected' }],
    archetype: 'burst',
    chapter: 3,
    tags: ['damage'],
  },

  br_b_momentum_cleave: {
    id: 'br_b_momentum_cleave',
    name: '连势横扫',
    description: '对所有敌人造成 5 点伤害。消耗所有连势，每层造成额外 1 点伤害。',
    type: 'attack',
    rarity: 'common',
    cost: 2,
    target: 'all_enemies',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'all', baseDamage: 5, damagePerStack: 1 },
      },
    ],
    archetype: 'burst',
    chapter: 3,
    tags: ['damage', 'aoe', 'momentum'],
  },

  br_b_vengeful_strike: {
    id: 'br_b_vengeful_strike',
    name: '复仇之击',
    description: '造成 9 点伤害。消耗 2 层连势，施加 1 层虚弱。',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'fixed', consumeValue: 2, baseDamage: 9, damagePerStack: 0 },
      },
      { type: 'apply_status', statusId: 'weak', stacks: 1, target: 'selected' },
    ],
    archetype: 'burst',
    chapter: 3,
    tags: ['damage', 'debuff', 'momentum'],
  },

  // ==================== 普通技能牌 (10张) ====================

  br_b_primed_blow: {
    id: 'br_b_primed_blow',
    name: '破势',
    description: '获得 2 层破势预热。',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'none',
    effects: [
      { type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 2, target: 'self' },
    ],
    archetype: 'burst',
    chapter: 1,
    tags: ['primed_break', 'setup'],
  },

  br_b_build_momentum: {
    id: 'br_b_build_momentum',
    name: '蓄势',
    description: '获得 3 层连势。',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'none',
    effects: [
      { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 3, target: 'self' },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['momentum', 'setup'],
  },

  br_b_energy_burst: {
    id: 'br_b_energy_burst',
    name: '能量爆发',
    description: '消耗 3 层连势，获得 2 点能量。',
    type: 'skill',
    rarity: 'common',
    cost: 0,
    target: 'none',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_draw',
        params: { consumeMode: 'fixed', consumeValue: 3, baseDraw: 0, drawPerStack: 0 },
      },
      { type: 'gain_energy', value: 2 },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['energy', 'momentum'],
  },

  br_b_momentum_draw: {
    id: 'br_b_momentum_draw',
    name: '势能抽取',
    description: '抽 2 张牌。消耗 2 层连势。',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'none',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_draw',
        params: { consumeMode: 'fixed', consumeValue: 2, baseDraw: 2, drawPerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['draw', 'momentum'],
  },

  br_b_power_surge: {
    id: 'br_b_power_surge',
    name: '力量涌动',
    description: '获得 1 层力量。',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'none',
    effects: [
      { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 1, target: 'self' },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['strength', 'buff'],
  },

  br_b_deep_draw: {
    id: 'br_b_deep_draw',
    name: '深度挖掘',
    description: '抽 3 张牌。消耗 1 层连势。',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'none',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_draw',
        params: { consumeMode: 'fixed', consumeValue: 1, baseDraw: 3, drawPerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['draw', 'momentum'],
  },

  br_b_primed_defense: {
    id: 'br_b_primed_defense',
    name: '破势防御',
    description: '获得 5 点格挡。消耗 2 层连势。',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'none',
    effects: [
      { type: 'block', value: 5, target: 'self' },
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'fixed', consumeValue: 2, baseDamage: 0, damagePerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['block', 'momentum'],
  },

  br_b_momentum_energy: {
    id: 'br_b_momentum_energy',
    name: '连势能量',
    description: '获得 1 点能量。消耗 1 层连势。',
    type: 'skill',
    rarity: 'common',
    cost: 0,
    target: 'none',
    effects: [
      { type: 'gain_energy', value: 1 },
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'fixed', consumeValue: 1, baseDamage: 0, damagePerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['energy', 'momentum'],
  },

  br_b_primed_draw: {
    id: 'br_b_primed_draw',
    name: '破势过牌',
    description: '抽 2 张牌。消耗 2 层连势。',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'none',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_draw',
        params: { consumeMode: 'fixed', consumeValue: 2, baseDraw: 2, drawPerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 3,
    tags: ['draw', 'momentum'],
  },

  br_b_primed_energy: {
    id: 'br_b_primed_energy',
    name: '破势能量',
    description: '获得 1 点能量。消耗 1 层连势。',
    type: 'skill',
    rarity: 'common',
    cost: 0,
    target: 'none',
    effects: [
      { type: 'gain_energy', value: 1 },
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'fixed', consumeValue: 1, baseDamage: 0, damagePerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 3,
    tags: ['energy', 'momentum'],
  },

  // ==================== 稀有卡牌 (15张) ====================

  br_b_momentum_rupture: {
    id: 'br_b_momentum_rupture',
    name: '连势裂变',
    description: '造成 18 点伤害。消耗所有连势，每层造成额外 4 点伤害。',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'all', baseDamage: 18, damagePerStack: 4 },
      },
    ],
    archetype: 'burst',
    chapter: 1,
    tags: ['damage', 'momentum'],
  },

  br_b_triple_slash: {
    id: 'br_b_triple_slash',
    name: '三重斩',
    description: '造成 6 点伤害三次。消耗 3 层连势。',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'fixed', consumeValue: 3, baseDamage: 6, damagePerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'multi_hit', 'momentum'],
  },

  br_b_primed_heavy: {
    id: 'br_b_primed_heavy',
    name: '预热重击',
    description: '造成 22 点伤害。消耗 5 层连势。',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'fixed', consumeValue: 5, baseDamage: 22, damagePerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'momentum'],
  },

  br_b_burst_combo: {
    id: 'br_b_burst_combo',
    name: '爆发连击',
    description: '造成 8 点伤害两次。',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    target: 'single_enemy',
    effects: [
      {
        type: 'repeat',
        times: 2,
        effects: [{ type: 'damage', value: 8, target: 'selected' }],
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'multi_hit'],
  },

  br_b_primed_strike_u: {
    id: 'br_b_primed_strike_u',
    name: '预热打击·极',
    description: '造成 12 点伤害。若你有破势预热，造成额外 8 点伤害。',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'conditional_damage',
        params: { baseDamage: 12, bonusDamage: 8, condition: 'has_primed_break' },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'primed_break'],
  },

  br_b_momentum_slash: {
    id: 'br_b_momentum_slash',
    name: '连势猛击',
    description: '造成 16 点伤害。消耗 4 层连势。',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'fixed', consumeValue: 4, baseDamage: 16, damagePerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'momentum'],
  },

  br_b_burst_slash_u: {
    id: 'br_b_burst_slash_u',
    name: '爆发猛击',
    description: '造成 25 点伤害。',
    type: 'attack',
    rarity: 'uncommon',
    cost: 3,
    target: 'single_enemy',
    effects: [{ type: 'damage', value: 25, target: 'selected' }],
    archetype: 'burst',
    chapter: 3,
    tags: ['damage'],
  },

  br_b_primed_fortify: {
    id: 'br_b_primed_fortify',
    name: '破势强化',
    description: '获得 3 层破势预热。',
    type: 'skill',
    rarity: 'uncommon',
    cost: 2,
    target: 'none',
    effects: [
      { type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 3, target: 'self' },
    ],
    archetype: 'burst',
    chapter: 1,
    tags: ['primed_break', 'setup'],
  },

  br_b_momentum_fortify: {
    id: 'br_b_momentum_fortify',
    name: '连势强化',
    description: '获得 5 层连势。',
    type: 'skill',
    rarity: 'uncommon',
    cost: 2,
    target: 'none',
    effects: [
      { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 5, target: 'self' },
    ],
    archetype: 'burst',
    chapter: 1,
    tags: ['momentum', 'setup'],
  },

  br_b_primed_draw_u: {
    id: 'br_b_primed_draw_u',
    name: '破势过牌·极',
    description: '抽 3 张牌。消耗 3 层连势。',
    type: 'skill',
    rarity: 'uncommon',
    cost: 2,
    target: 'none',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_draw',
        params: { consumeMode: 'fixed', consumeValue: 3, baseDraw: 3, drawPerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['draw', 'momentum'],
  },

  br_b_energy_burst_u: {
    id: 'br_b_energy_burst_u',
    name: '能量爆发·极',
    description: '获得 2 点能量。消耗 2 层连势。',
    type: 'skill',
    rarity: 'uncommon',
    cost: 0,
    target: 'none',
    effects: [
      { type: 'gain_energy', value: 2 },
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'fixed', consumeValue: 2, baseDamage: 0, damagePerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['energy', 'momentum'],
  },

  br_b_primed_fortify_p: {
    id: 'br_b_primed_fortify_p',
    name: '破势精通',
    description: '获得 4 层破势预热。',
    type: 'power',
    rarity: 'uncommon',
    cost: 2,
    target: 'none',
    effects: [
      { type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 4, target: 'self' },
    ],
    archetype: 'burst',
    chapter: 1,
    tags: ['primed_break', 'setup'],
  },

  br_b_momentum_fortify_p: {
    id: 'br_b_momentum_fortify_p',
    name: '连势精通',
    description: '获得 4 层连势。',
    type: 'power',
    rarity: 'uncommon',
    cost: 2,
    target: 'none',
    effects: [
      { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 4, target: 'self' },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['momentum', 'setup'],
  },

  br_b_power_surge_u: {
    id: 'br_b_power_surge_u',
    name: '力量激发',
    description: '获得 2 层力量。',
    type: 'power',
    rarity: 'uncommon',
    cost: 2,
    target: 'none',
    effects: [
      { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 2, target: 'self' },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['strength', 'scaling'],
  },

  br_b_burst_mastery: {
    id: 'br_b_burst_mastery',
    name: '爆发精通',
    description: '获得 3 层破势预热和 3 层连势。',
    type: 'power',
    rarity: 'uncommon',
    cost: 2,
    target: 'none',
    effects: [
      { type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 3, target: 'self' },
      { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 3, target: 'self' },
    ],
    archetype: 'burst',
    chapter: 3,
    tags: ['primed_break', 'momentum'],
  },

  // ==================== 史诗卡牌 (15张) ====================

  br_b_final_rupture: {
    id: 'br_b_final_rupture',
    name: '终结裂变',
    description: '造成 30 点伤害。消耗所有连势和破势预热，每层造成额外 5 点伤害。',
    type: 'attack',
    rarity: 'rare',
    cost: 4,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'all', baseDamage: 30, damagePerStack: 5 },
      },
    ],
    archetype: 'burst',
    chapter: 1,
    tags: ['damage', 'momentum', 'primed_break'],
  },

  br_b_momentum_storm: {
    id: 'br_b_momentum_storm',
    name: '连势风暴',
    description: '造成 8 点伤害五次。消耗 5 层连势。',
    type: 'attack',
    rarity: 'rare',
    cost: 3,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'fixed', consumeValue: 5, baseDamage: 8, damagePerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 1,
    tags: ['damage', 'multi_hit', 'momentum'],
  },

  br_b_primed_devastate: {
    id: 'br_b_primed_devastate',
    name: '预热毁灭',
    description: '造成 35 点伤害。消耗 8 层连势。',
    type: 'attack',
    rarity: 'rare',
    cost: 3,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'fixed', consumeValue: 8, baseDamage: 35, damagePerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 1,
    tags: ['damage', 'momentum'],
  },

  br_b_energy_annihilation: {
    id: 'br_b_energy_annihilation',
    name: '能量湮灭',
    description: '造成 40 点伤害。消耗所有能量。',
    type: 'attack',
    rarity: 'rare',
    cost: 0,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'energy_to_damage',
        params: { damagePerEnergy: 10 },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'energy'],
  },

  br_b_triple_rupture: {
    id: 'br_b_triple_rupture',
    name: '三重裂变',
    description: '造成 10 点伤害三次。消耗 6 层连势。',
    type: 'attack',
    rarity: 'rare',
    cost: 3,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'fixed', consumeValue: 6, baseDamage: 10, damagePerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'multi_hit', 'momentum'],
  },

  br_b_momentum_slash_r: {
    id: 'br_b_momentum_slash_r',
    name: '连势裂斩',
    description: '造成 14 点伤害两次。消耗 5 层连势。',
    type: 'attack',
    rarity: 'rare',
    cost: 3,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'fixed', consumeValue: 5, baseDamage: 14, damagePerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 3,
    tags: ['damage', 'multi_hit', 'momentum'],
  },

  br_b_primed_master: {
    id: 'br_b_primed_master',
    name: '破势大师',
    description: '获得 5 层破势预热。',
    type: 'skill',
    rarity: 'rare',
    cost: 3,
    target: 'none',
    effects: [
      { type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 5, target: 'self' },
    ],
    archetype: 'burst',
    chapter: 1,
    tags: ['primed_break', 'setup'],
  },

  br_b_momentum_master: {
    id: 'br_b_momentum_master',
    name: '连势大师',
    description: '获得 8 层连势。',
    type: 'skill',
    rarity: 'rare',
    cost: 3,
    target: 'none',
    effects: [
      { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 8, target: 'self' },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['momentum', 'setup'],
  },

  br_b_primed_draw_r: {
    id: 'br_b_primed_draw_r',
    name: '破势过牌·极',
    description: '抽 5 张牌。消耗 4 层连势。',
    type: 'skill',
    rarity: 'rare',
    cost: 2,
    target: 'none',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_draw',
        params: { consumeMode: 'fixed', consumeValue: 4, baseDraw: 5, drawPerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['draw', 'momentum'],
  },

  br_b_energy_master: {
    id: 'br_b_energy_master',
    name: '能量大师',
    description: '获得 4 点能量。消耗 5 层连势。',
    type: 'skill',
    rarity: 'rare',
    cost: 0,
    target: 'none',
    effects: [
      { type: 'gain_energy', value: 4 },
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'fixed', consumeValue: 5, baseDamage: 0, damagePerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 3,
    tags: ['energy', 'momentum'],
  },

  br_b_primed_fortify_r: {
    id: 'br_b_primed_fortify_r',
    name: '破势精通·极',
    description: '获得 6 层破势预热。',
    type: 'power',
    rarity: 'rare',
    cost: 3,
    target: 'none',
    effects: [
      { type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 6, target: 'self' },
    ],
    archetype: 'burst',
    chapter: 1,
    tags: ['primed_break', 'setup'],
  },

  br_b_momentum_fortify_r: {
    id: 'br_b_momentum_fortify_r',
    name: '连势精通·极',
    description: '获得 6 层连势。',
    type: 'power',
    rarity: 'rare',
    cost: 3,
    target: 'none',
    effects: [
      { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 6, target: 'self' },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['momentum', 'setup'],
  },

  br_b_power_master: {
    id: 'br_b_power_master',
    name: '力量奥义',
    description: '获得 3 层力量。',
    type: 'power',
    rarity: 'rare',
    cost: 3,
    target: 'none',
    effects: [
      { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 3, target: 'self' },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['strength', 'scaling'],
  },

  br_b_burst_master: {
    id: 'br_b_burst_master',
    name: '爆发大师',
    description: '获得 4 层破势预热和 4 层连势。',
    type: 'power',
    rarity: 'rare',
    cost: 3,
    target: 'none',
    effects: [
      { type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 4, target: 'self' },
      { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 4, target: 'self' },
    ],
    archetype: 'burst',
    chapter: 3,
    tags: ['primed_break', 'momentum'],
  },

  br_b_momentum_master_p: {
    id: 'br_b_momentum_master_p',
    name: '连势大师·极',
    description: '获得 5 层连势和 2 层力量。',
    type: 'power',
    rarity: 'rare',
    cost: 3,
    target: 'none',
    effects: [
      { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 5, target: 'self' },
      { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 2, target: 'self' },
    ],
    archetype: 'burst',
    chapter: 3,
    tags: ['momentum', 'strength'],
  },
};
