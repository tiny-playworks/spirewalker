import type { CardDefinition } from '../../../model/card';
import {
  STATUS_MOMENTUM,
  STATUS_METALLICIZE,
  STATUS_STRENGTH,
} from '../../statuses';

/**
 * 混合流派 - 普通卡牌 (25张)
 * 主题：攻防切换、条件增益、灵活转换、桥梁牌
 */

// ==================== 攻击牌 ====================

export const MIXED_COMMON_ATK_1: CardDefinition = {
  id: 'mixed_common_atk_1',
  name: '攻防切换',
  description: '造成 6 点伤害，获得 3 点格挡。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 6, target: 'selected' },
    { type: 'block', value: 3, target: 'self' },
  ],
  archetype: 'mixed',
  tags: ['damage', 'block'],
};

export const MIXED_COMMON_ATK_2: CardDefinition = {
  id: 'mixed_common_atk_2',
  name: '条件打击',
  description: '造成 8 点伤害。若你有格挡，造成额外 4 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'conditional_damage', params: { baseDamage: 8, bonusDamage: 4, condition: 'has_block' } }],
  archetype: 'mixed',
  tags: ['damage', 'conditional'],
};

export const MIXED_COMMON_ATK_3: CardDefinition = {
  id: 'mixed_common_atk_3',
  name: '灵活打击',
  description: '造成 5 点伤害，获得 2 点格挡，抽 1 张牌。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 5, target: 'selected' },
    { type: 'block', value: 2, target: 'self' },
    { type: 'draw', value: 1 },
  ],
  archetype: 'mixed',
  tags: ['damage', 'block', 'draw'],
};

export const MIXED_COMMON_ATK_4: CardDefinition = {
  id: 'mixed_common_atk_4',
  name: '连势打击',
  description: '造成 4 点伤害。消耗 1 层连势，造成额外 4 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'fixed', consumeValue: 1, baseDamage: 4, damagePerStack: 0, bonusDamage: 4 } }],
  archetype: 'mixed',
  tags: ['damage', 'momentum'],
};

export const MIXED_COMMON_ATK_5: CardDefinition = {
  id: 'mixed_common_atk_5',
  name: '双击',
  description: '造成 4 点伤害两次。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'repeat', times: 2, effects: [{ type: 'damage', value: 4, target: 'selected' }] }],
  archetype: 'mixed',
  tags: ['damage', 'multi_hit'],
};

// ==================== 技能牌 ====================

export const MIXED_COMMON_SKILL_1: CardDefinition = {
  id: 'mixed_common_skill_1',
  name: '灵活防御',
  description: '获得 5 点格挡，造成 2 点伤害。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 5, target: 'self' },
    { type: 'damage', value: 2, target: 'all_enemies' },
  ],
  archetype: 'mixed',
  tags: ['block', 'damage'],
};

export const MIXED_COMMON_SKILL_2: CardDefinition = {
  id: 'mixed_common_skill_2',
  name: '势能格挡',
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
  tags: ['block', 'momentum'],
};

export const MIXED_COMMON_SKILL_3: CardDefinition = {
  id: 'mixed_common_skill_3',
  name: '灵活过牌',
  description: '抽 2 张牌，获得 3 点格挡。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'draw', value: 2 },
    { type: 'block', value: 3, target: 'self' },
  ],
  archetype: 'mixed',
  tags: ['draw', 'block'],
};

export const MIXED_COMMON_SKILL_4: CardDefinition = {
  id: 'mixed_common_skill_4',
  name: '势流抽牌',
  description: '抽 2 张牌。消耗 1 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_draw', params: { consumeMode: 'fixed', consumeValue: 1, baseDraw: 2, drawPerStack: 0 } }],
  archetype: 'mixed',
  tags: ['draw', 'momentum'],
};

export const MIXED_COMMON_SKILL_5: CardDefinition = {
  id: 'mixed_common_skill_5',
  name: '灵活强化',
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
  tags: ['strength', 'metallicize'],
};

// ==================== 能力牌 ====================

export const MIXED_COMMON_POWER_1: CardDefinition = {
  id: 'mixed_common_power_1',
  name: '连势积蓄',
  description: '获得 2 层连势。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 2, target: 'self' }],
  archetype: 'mixed',
  tags: ['momentum', 'setup'],
};

export const MIXED_COMMON_POWER_2: CardDefinition = {
  id: 'mixed_common_power_2',
  name: '金属化',
  description: '获得 2 层金属化。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 2, target: 'self' }],
  archetype: 'mixed',
  tags: ['metallicize', 'scaling'],
};

export const MIXED_COMMON_POWER_3: CardDefinition = {
  id: 'mixed_common_power_3',
  name: '力量充能',
  description: '获得 1 层力量。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 1, target: 'self' }],
  archetype: 'mixed',
  tags: ['strength', 'scaling'],
};

// ==================== 补充普通卡牌 ====================

export const MIXED_COMMON_ATK_6: CardDefinition = {
  id: 'mixed_common_atk_6',
  name: '灵活连击',
  description: '造成 3 点伤害两次，获得 2 点格挡。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'repeat', times: 2, effects: [{ type: 'damage', value: 3, target: 'selected' }] },
    { type: 'block', value: 2, target: 'self' },
  ],
  archetype: 'mixed',
  tags: ['damage', 'multi_hit', 'block'],
};

export const MIXED_COMMON_ATK_7: CardDefinition = {
  id: 'mixed_common_atk_7',
  name: '连势打击',
  description: '造成 4 点伤害。消耗 1 层连势，造成额外 4 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'fixed', consumeValue: 1, baseDamage: 4, damagePerStack: 0, bonusDamage: 4 } }],
  archetype: 'mixed',
  tags: ['damage', 'momentum'],
};

export const MIXED_COMMON_SKILL_6: CardDefinition = {
  id: 'mixed_common_skill_6',
  name: '灵活防御',
  description: '获得 5 点格挡，造成 2 点伤害。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 5, target: 'self' },
    { type: 'damage', value: 2, target: 'all_enemies' },
  ],
  archetype: 'mixed',
  tags: ['block', 'damage'],
};

export const MIXED_COMMON_SKILL_7: CardDefinition = {
  id: 'mixed_common_skill_7',
  name: '势能格挡',
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
  tags: ['block', 'momentum'],
};

export const MIXED_COMMON_SKILL_8: CardDefinition = {
  id: 'mixed_common_skill_8',
  name: '灵活过牌',
  description: '抽 2 张牌，获得 3 点格挡。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'draw', value: 2 },
    { type: 'block', value: 3, target: 'self' },
  ],
  archetype: 'mixed',
  tags: ['draw', 'block'],
};

export const MIXED_COMMON_SKILL_9: CardDefinition = {
  id: 'mixed_common_skill_9',
  name: '势能抽取',
  description: '抽 2 张牌。消耗 1 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_draw', params: { consumeMode: 'fixed', consumeValue: 1, baseDraw: 2, drawPerStack: 0 } }],
  archetype: 'mixed',
  tags: ['draw', 'momentum'],
};

export const MIXED_COMMON_SKILL_10: CardDefinition = {
  id: 'mixed_common_skill_10',
  name: '灵活强化',
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
  tags: ['strength', 'metallicize'],
};

export const MIXED_COMMON_POWER_4: CardDefinition = {
  id: 'mixed_common_power_4',
  name: '连势积蓄',
  description: '获得 2 层连势。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 2, target: 'self' }],
  archetype: 'mixed',
  tags: ['momentum', 'setup'],
};

export const MIXED_COMMON_POWER_5: CardDefinition = {
  id: 'mixed_common_power_5',
  name: '金属化',
  description: '获得 2 层金属化。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 2, target: 'self' }],
  archetype: 'mixed',
  tags: ['metallicize', 'scaling'],
};

export const MIXED_COMMON_POWER_6: CardDefinition = {
  id: 'mixed_common_power_6',
  name: '力量凝聚',
  description: '获得 1 层力量。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 1, target: 'self' }],
  archetype: 'mixed',
  tags: ['strength', 'scaling'],
};

// 导出所有混合普通卡牌
export const MIXED_COMMON_CARDS: Record<string, CardDefinition> = {
  [MIXED_COMMON_ATK_1.id]: MIXED_COMMON_ATK_1,
  [MIXED_COMMON_ATK_2.id]: MIXED_COMMON_ATK_2,
  [MIXED_COMMON_ATK_3.id]: MIXED_COMMON_ATK_3,
  [MIXED_COMMON_ATK_4.id]: MIXED_COMMON_ATK_4,
  [MIXED_COMMON_ATK_5.id]: MIXED_COMMON_ATK_5,
  [MIXED_COMMON_ATK_6.id]: MIXED_COMMON_ATK_6,
  [MIXED_COMMON_ATK_7.id]: MIXED_COMMON_ATK_7,
  [MIXED_COMMON_SKILL_1.id]: MIXED_COMMON_SKILL_1,
  [MIXED_COMMON_SKILL_2.id]: MIXED_COMMON_SKILL_2,
  [MIXED_COMMON_SKILL_3.id]: MIXED_COMMON_SKILL_3,
  [MIXED_COMMON_SKILL_4.id]: MIXED_COMMON_SKILL_4,
  [MIXED_COMMON_SKILL_5.id]: MIXED_COMMON_SKILL_5,
  [MIXED_COMMON_SKILL_6.id]: MIXED_COMMON_SKILL_6,
  [MIXED_COMMON_SKILL_7.id]: MIXED_COMMON_SKILL_7,
  [MIXED_COMMON_SKILL_8.id]: MIXED_COMMON_SKILL_8,
  [MIXED_COMMON_SKILL_9.id]: MIXED_COMMON_SKILL_9,
  [MIXED_COMMON_SKILL_10.id]: MIXED_COMMON_SKILL_10,
  [MIXED_COMMON_POWER_1.id]: MIXED_COMMON_POWER_1,
  [MIXED_COMMON_POWER_2.id]: MIXED_COMMON_POWER_2,
  [MIXED_COMMON_POWER_3.id]: MIXED_COMMON_POWER_3,
  [MIXED_COMMON_POWER_4.id]: MIXED_COMMON_POWER_4,
  [MIXED_COMMON_POWER_5.id]: MIXED_COMMON_POWER_5,
  [MIXED_COMMON_POWER_6.id]: MIXED_COMMON_POWER_6,
};
