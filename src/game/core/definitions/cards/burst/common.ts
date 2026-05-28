import type { CardDefinition } from '../../../model/card';
import {
  STATUS_MOMENTUM,
  STATUS_PRIMED_BREAK,
  STATUS_STRENGTH,
  STATUS_VULNERABLE,
} from '../../statuses';

/**
 * 爆发流派 - 普通卡牌 (30张)
 * 主题：消耗连势、高伤害、能量兑现、破势预热
 */

// ==================== 攻击牌 ====================

export const BURST_COMMON_ATK_1: CardDefinition = {
  id: 'burst_common_atk_1',
  name: '破势击',
  description: '造成 8 点伤害。消耗所有连势，每层造成额外 3 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'all', baseDamage: 8, damagePerStack: 3 } }],
  archetype: 'burst',
  tags: ['damage', 'momentum'],
};

export const BURST_COMMON_ATK_2: CardDefinition = {
  id: 'burst_common_atk_2',
  name: '连击',
  description: '造成 4 点伤害两次。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'repeat', times: 2, effects: [{ type: 'damage', value: 4, target: 'selected' }] }],
  archetype: 'burst',
  tags: ['damage', 'multi_hit'],
};

export const BURST_COMMON_ATK_3: CardDefinition = {
  id: 'burst_common_atk_3',
  name: '猛击',
  description: '造成 12 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'damage', value: 12, target: 'selected' }],
  archetype: 'burst',
  tags: ['damage'],
};

export const BURST_COMMON_ATK_4: CardDefinition = {
  id: 'burst_common_atk_4',
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
  tags: ['damage', 'debuff'],
};

export const BURST_COMMON_ATK_5: CardDefinition = {
  id: 'burst_common_atk_5',
  name: '连势打击',
  description: '造成 5 点伤害。消耗 2 层连势，造成额外 5 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'fixed', consumeValue: 2, baseDamage: 5, damagePerStack: 0, bonusDamage: 5 } }],
  archetype: 'burst',
  tags: ['damage', 'momentum'],
};

export const BURST_COMMON_ATK_6: CardDefinition = {
  id: 'burst_common_atk_6',
  name: '爆发连击',
  description: '造成 3 点伤害三次。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'repeat', times: 3, effects: [{ type: 'damage', value: 3, target: 'selected' }] }],
  archetype: 'burst',
  tags: ['damage', 'multi_hit'],
};

export const BURST_COMMON_ATK_7: CardDefinition = {
  id: 'burst_common_atk_7',
  name: '破势重击',
  description: '造成 10 点伤害。消耗 3 层连势。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'fixed', consumeValue: 3, baseDamage: 10, damagePerStack: 0 } }],
  archetype: 'burst',
  tags: ['damage', 'momentum'],
};

export const BURST_COMMON_ATK_8: CardDefinition = {
  id: 'burst_common_atk_8',
  name: '连势猛击',
  description: '造成 15 点伤害。消耗所有连势。',
  type: 'attack',
  rarity: 'common',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'all', baseDamage: 15, damagePerStack: 0 } }],
  archetype: 'burst',
  tags: ['damage', 'momentum'],
};

export const BURST_COMMON_ATK_9: CardDefinition = {
  id: 'burst_common_atk_9',
  name: '爆发打击',
  description: '造成 7 点伤害。若你有破势预热，造成额外 7 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'conditional_damage', params: { baseDamage: 7, bonusDamage: 7, condition: 'has_primed_break' } }],
  archetype: 'burst',
  tags: ['damage', 'primed_break'],
};

export const BURST_COMMON_ATK_10: CardDefinition = {
  id: 'burst_common_atk_10',
  name: '连击猛击',
  description: '造成 5 点伤害两次。消耗 2 层连势。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'fixed', consumeValue: 2, baseDamage: 5, damagePerStack: 0, hits: 2 } }],
  archetype: 'burst',
  tags: ['damage', 'multi_hit', 'momentum'],
};

// ==================== 技能牌 ====================

export const BURST_COMMON_SKILL_1: CardDefinition = {
  id: 'burst_common_skill_1',
  name: '破势',
  description: '获得 2 层破势预热。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 2, target: 'self' }],
  archetype: 'burst',
  tags: ['primed_break', 'setup'],
};

export const BURST_COMMON_SKILL_2: CardDefinition = {
  id: 'burst_common_skill_2',
  name: '连势',
  description: '获得 3 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 3, target: 'self' }],
  archetype: 'burst',
  tags: ['momentum', 'setup'],
};

export const BURST_COMMON_SKILL_3: CardDefinition = {
  id: 'burst_common_skill_3',
  name: '爆发',
  description: '消耗 3 层连势，获得 2 点能量。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_to_energy', params: { consumeValue: 3, energyGain: 2 } }],
  archetype: 'burst',
  tags: ['momentum', 'energy'],
};

export const BURST_COMMON_SKILL_4: CardDefinition = {
  id: 'burst_common_skill_4',
  name: '破势连击',
  description: '抽 2 张牌。消耗 2 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_draw', params: { consumeMode: 'fixed', consumeValue: 2, baseDraw: 2, drawPerStack: 0 } }],
  archetype: 'burst',
  tags: ['draw', 'momentum'],
};

export const BURST_COMMON_SKILL_5: CardDefinition = {
  id: 'burst_common_skill_5',
  name: '爆发强化',
  description: '获得 1 层力量。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 1, target: 'self' }],
  archetype: 'burst',
  tags: ['strength', 'buff'],
};

export const BURST_COMMON_SKILL_6: CardDefinition = {
  id: 'burst_common_skill_6',
  name: '连势过牌',
  description: '抽 3 张牌。消耗 1 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_draw', params: { consumeMode: 'fixed', consumeValue: 1, baseDraw: 3, drawPerStack: 0 } }],
  archetype: 'burst',
  tags: ['draw', 'momentum'],
};

export const BURST_COMMON_SKILL_7: CardDefinition = {
  id: 'burst_common_skill_7',
  name: '破势防御',
  description: '获得 5 点格挡。消耗 2 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_block', params: { consumeValue: 2, baseBlock: 5 } }],
  archetype: 'burst',
  tags: ['block', 'momentum'],
};

export const BURST_COMMON_SKILL_8: CardDefinition = {
  id: 'burst_common_skill_8',
  name: '连势能量',
  description: '获得 1 点能量。消耗 1 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_to_energy', params: { consumeValue: 1, energyGain: 1 } }],
  archetype: 'burst',
  tags: ['energy', 'momentum'],
};

// ==================== 能力牌 ====================

export const BURST_COMMON_POWER_1: CardDefinition = {
  id: 'burst_common_power_1',
  name: '破势强化',
  description: '获得 2 层破势预热。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 2, target: 'self' }],
  archetype: 'burst',
  tags: ['primed_break', 'setup'],
};

export const BURST_COMMON_POWER_2: CardDefinition = {
  id: 'burst_common_power_2',
  name: '连势储备',
  description: '获得 2 层连势。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 2, target: 'self' }],
  archetype: 'burst',
  tags: ['momentum', 'setup'],
};

export const BURST_COMMON_POWER_3: CardDefinition = {
  id: 'burst_common_power_3',
  name: '力量强化',
  description: '获得 1 层力量。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 1, target: 'self' }],
  archetype: 'burst',
  tags: ['strength', 'scaling'],
};

// ==================== 补充普通卡牌 ====================

export const BURST_COMMON_ATK_11: CardDefinition = {
  id: 'burst_common_atk_11',
  name: '破势连击',
  description: '造成 3 点伤害三次。',
  type: 'attack',
  rarity: 'common',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'repeat', times: 3, effects: [{ type: 'damage', value: 3, target: 'selected' }] }],
  archetype: 'burst',
  tags: ['damage', 'multi_hit'],
};

export const BURST_COMMON_ATK_12: CardDefinition = {
  id: 'burst_common_atk_12',
  name: '破势猛击',
  description: '造成 12 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'damage', value: 12, target: 'selected' }],
  archetype: 'burst',
  tags: ['damage'],
};

export const BURST_COMMON_SKILL_9: CardDefinition = {
  id: 'burst_common_skill_9',
  name: '破势过牌',
  description: '抽 2 张牌。消耗 2 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_draw', params: { consumeMode: 'fixed', consumeValue: 2, baseDraw: 2, drawPerStack: 0 } }],
  archetype: 'burst',
  tags: ['draw', 'momentum'],
};

export const BURST_COMMON_SKILL_10: CardDefinition = {
  id: 'burst_common_skill_10',
  name: '破势能量',
  description: '获得 1 点能量。消耗 1 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_to_energy', params: { consumeValue: 1, energyGain: 1 } }],
  archetype: 'burst',
  tags: ['energy', 'momentum'],
};

export const BURST_COMMON_SKILL_11: CardDefinition = {
  id: 'burst_common_skill_11',
  name: '破势防御',
  description: '获得 6 点格挡。消耗 2 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_block', params: { consumeValue: 2, baseBlock: 6 } }],
  archetype: 'burst',
  tags: ['block', 'momentum'],
};

export const BURST_COMMON_POWER_4: CardDefinition = {
  id: 'burst_common_power_4',
  name: '破势强化',
  description: '获得 2 层破势预热。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 2, target: 'self' }],
  archetype: 'burst',
  tags: ['primed_break', 'setup'],
};

export const BURST_COMMON_POWER_5: CardDefinition = {
  id: 'burst_common_power_5',
  name: '连势储备',
  description: '获得 2 层连势。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 2, target: 'self' }],
  archetype: 'burst',
  tags: ['momentum', 'setup'],
};

// 导出所有爆发普通卡牌
export const BURST_COMMON_CARDS: Record<string, CardDefinition> = {
  [BURST_COMMON_ATK_1.id]: BURST_COMMON_ATK_1,
  [BURST_COMMON_ATK_2.id]: BURST_COMMON_ATK_2,
  [BURST_COMMON_ATK_3.id]: BURST_COMMON_ATK_3,
  [BURST_COMMON_ATK_4.id]: BURST_COMMON_ATK_4,
  [BURST_COMMON_ATK_5.id]: BURST_COMMON_ATK_5,
  [BURST_COMMON_ATK_6.id]: BURST_COMMON_ATK_6,
  [BURST_COMMON_ATK_7.id]: BURST_COMMON_ATK_7,
  [BURST_COMMON_ATK_8.id]: BURST_COMMON_ATK_8,
  [BURST_COMMON_ATK_9.id]: BURST_COMMON_ATK_9,
  [BURST_COMMON_ATK_10.id]: BURST_COMMON_ATK_10,
  [BURST_COMMON_ATK_11.id]: BURST_COMMON_ATK_11,
  [BURST_COMMON_ATK_12.id]: BURST_COMMON_ATK_12,
  [BURST_COMMON_SKILL_1.id]: BURST_COMMON_SKILL_1,
  [BURST_COMMON_SKILL_2.id]: BURST_COMMON_SKILL_2,
  [BURST_COMMON_SKILL_3.id]: BURST_COMMON_SKILL_3,
  [BURST_COMMON_SKILL_4.id]: BURST_COMMON_SKILL_4,
  [BURST_COMMON_SKILL_5.id]: BURST_COMMON_SKILL_5,
  [BURST_COMMON_SKILL_6.id]: BURST_COMMON_SKILL_6,
  [BURST_COMMON_SKILL_7.id]: BURST_COMMON_SKILL_7,
  [BURST_COMMON_SKILL_8.id]: BURST_COMMON_SKILL_8,
  [BURST_COMMON_SKILL_9.id]: BURST_COMMON_SKILL_9,
  [BURST_COMMON_SKILL_10.id]: BURST_COMMON_SKILL_10,
  [BURST_COMMON_SKILL_11.id]: BURST_COMMON_SKILL_11,
  [BURST_COMMON_POWER_1.id]: BURST_COMMON_POWER_1,
  [BURST_COMMON_POWER_2.id]: BURST_COMMON_POWER_2,
  [BURST_COMMON_POWER_3.id]: BURST_COMMON_POWER_3,
  [BURST_COMMON_POWER_4.id]: BURST_COMMON_POWER_4,
  [BURST_COMMON_POWER_5.id]: BURST_COMMON_POWER_5,
};
