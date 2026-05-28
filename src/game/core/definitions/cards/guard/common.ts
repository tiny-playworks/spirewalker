import type { CardDefinition } from '../../../model/card';
import {
  STATUS_METALLICIZE,
  STATUS_MOMENTUM,
  STATUS_STEADY_GUARD,
  STATUS_STRENGTH,
  STATUS_VULNERABLE,
} from '../../statuses';

/**
 * 守势流派 - 普通卡牌 (30张)
 * 主题：格挡、稳势、金属化、不消耗连势也能吃 momentum 收益
 */

// ==================== 攻击牌 ====================

export const GUARD_STRIKE_1: CardDefinition = {
  id: 'guard_strike_1',
  name: '守卫打击',
  description: '造成 5 点伤害，获得 3 点格挡。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 5, target: 'selected' },
    { type: 'block', value: 3, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['damage', 'block'],
};

export const GUARD_STRIKE_2: CardDefinition = {
  id: 'guard_strike_2',
  name: '盾击',
  description: '造成等同于当前格挡值的伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'block_to_damage', params: { multiplier: 1 } }],
  archetype: 'guard',
  tags: ['damage', 'block_scaling'],
};

export const GUARD_STRIKE_3: CardDefinition = {
  id: 'guard_strike_3',
  name: '防御反击',
  description: '造成 8 点伤害。若你有格挡，额外造成 4 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'conditional_damage', params: { baseDamage: 8, bonusDamage: 4, condition: 'has_block' } }],
  archetype: 'guard',
  tags: ['damage', 'conditional'],
};

export const GUARD_STRIKE_4: CardDefinition = {
  id: 'guard_strike_4',
  name: '稳扎稳打',
  description: '造成 4 点伤害，获得 4 点格挡。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 4, target: 'selected' },
    { type: 'block', value: 4, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['damage', 'block'],
};

export const GUARD_STRIKE_5: CardDefinition = {
  id: 'guard_strike_5',
  name: '铁壁打击',
  description: '造成 6 点伤害，获得 2 层金属化。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 6, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 2, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['damage', 'metallicize'],
};

export const GUARD_STRIKE_6: CardDefinition = {
  id: 'guard_strike_6',
  name: '坚守打击',
  description: '造成 7 点伤害。若你本回合未消耗连势，获得 3 点格挡。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_conditional_block', params: { baseDamage: 7, blockIfNoConsume: 3 } }],
  archetype: 'guard',
  tags: ['damage', 'momentum'],
};

export const GUARD_STRIKE_7: CardDefinition = {
  id: 'guard_strike_7',
  name: '盾墙打击',
  description: '造成 5 点伤害，获得 5 点格挡。',
  type: 'attack',
  rarity: 'common',
  cost: 2,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 5, target: 'selected' },
    { type: 'block', value: 5, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['damage', 'block'],
};

export const GUARD_STRIKE_8: CardDefinition = {
  id: 'guard_strike_8',
  name: '稳健出击',
  description: '造成 6 点伤害，施加 1 层易伤。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 6, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_VULNERABLE, stacks: 1, target: 'selected' },
  ],
  archetype: 'guard',
  tags: ['damage', 'debuff'],
};

export const GUARD_STRIKE_9: CardDefinition = {
  id: 'guard_strike_9',
  name: '守势连击',
  description: '造成 3 点伤害两次。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'repeat', times: 2, effects: [{ type: 'damage', value: 3, target: 'selected' }] }],
  archetype: 'guard',
  tags: ['damage', 'multi_hit'],
};

export const GUARD_STRIKE_10: CardDefinition = {
  id: 'guard_strike_10',
  name: '格挡之刃',
  description: '造成等同于你格挡值一半的伤害（向下取整）。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'block_to_damage', params: { multiplier: 0.5 } }],
  archetype: 'guard',
  tags: ['damage', 'block_scaling'],
};

// ==================== 技能牌 ====================

export const GUARD_SKILL_1: CardDefinition = {
  id: 'guard_skill_1',
  name: '坚守',
  description: '获得 8 点格挡。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'block', value: 8, target: 'self' }],
  archetype: 'guard',
  tags: ['block'],
};

export const GUARD_SKILL_2: CardDefinition = {
  id: 'guard_skill_2',
  name: '铁壁',
  description: '获得 6 点格挡，获得 1 层金属化。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 6, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 1, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['block', 'metallicize'],
};

export const GUARD_SKILL_3: CardDefinition = {
  id: 'guard_skill_3',
  name: '稳势防御',
  description: '获得 5 点格挡，获得 1 层稳势。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 5, target: 'self' },
    { type: 'apply_status', statusId: STATUS_STEADY_GUARD, stacks: 1, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['block', 'steady_guard'],
};

export const GUARD_SKILL_4: CardDefinition = {
  id: 'guard_skill_4',
  name: '蓄力防御',
  description: '获得 4 点格挡，获得 2 层连势。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 4, target: 'self' },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 2, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['block', 'momentum'],
};

export const GUARD_SKILL_5: CardDefinition = {
  id: 'guard_skill_5',
  name: '坚守阵地',
  description: '获得 10 点格挡。',
  type: 'skill',
  rarity: 'common',
  cost: 2,
  target: 'none',
  effects: [{ type: 'block', value: 10, target: 'self' }],
  archetype: 'guard',
  tags: ['block'],
};

export const GUARD_SKILL_6: CardDefinition = {
  id: 'guard_skill_6',
  name: '防御姿态',
  description: '获得 3 点格挡，抽 1 张牌。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 3, target: 'self' },
    { type: 'draw', value: 1 },
  ],
  archetype: 'guard',
  tags: ['block', 'draw'],
};

export const GUARD_SKILL_7: CardDefinition = {
  id: 'guard_skill_7',
  name: '稳如磐石',
  description: '获得 7 点格挡。若你有金属化，额外获得 3 点格挡。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'conditional_block', params: { baseBlock: 7, bonusBlock: 3, condition: 'has_metallicize' } }],
  archetype: 'guard',
  tags: ['block', 'metallicize'],
};

export const GUARD_SKILL_8: CardDefinition = {
  id: 'guard_skill_8',
  name: '坚守不退',
  description: '获得 5 点格挡，获得 1 层力量。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 5, target: 'self' },
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 1, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['block', 'strength'],
};

export const GUARD_SKILL_9: CardDefinition = {
  id: 'guard_skill_9',
  name: '防御反击',
  description: '获得 4 点格挡，对所有敌人造成 3 点伤害。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 4, target: 'self' },
    { type: 'damage', value: 3, target: 'all_enemies' },
  ],
  archetype: 'guard',
  tags: ['block', 'damage'],
};

export const GUARD_SKILL_10: CardDefinition = {
  id: 'guard_skill_10',
  name: '铁壁防御',
  description: '获得 6 点格挡。若你本回合未消耗连势，额外获得 4 点格挡。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_conditional_block', params: { baseBlock: 6, blockIfNoConsume: 4 } }],
  archetype: 'guard',
  tags: ['block', 'momentum'],
};

// ==================== 能力牌 ====================

export const GUARD_POWER_1: CardDefinition = {
  id: 'guard_power_1',
  name: '金属化',
  description: '每回合结束获得 3 点格挡。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 3, target: 'self' }],
  archetype: 'guard',
  tags: ['metallicize', 'scaling'],
};

export const GUARD_POWER_2: CardDefinition = {
  id: 'guard_power_2',
  name: '稳势',
  description: '获得 2 层稳势。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STEADY_GUARD, stacks: 2, target: 'self' }],
  archetype: 'guard',
  tags: ['steady_guard', 'scaling'],
};

export const GUARD_POWER_3: CardDefinition = {
  id: 'guard_power_3',
  name: '守势强化',
  description: '获得 1 层力量。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 1, target: 'self' }],
  archetype: 'guard',
  tags: ['strength', 'scaling'],
};

export const GUARD_POWER_4: CardDefinition = {
  id: 'guard_power_4',
  name: '防御专注',
  description: '获得 1 层金属化和 1 层稳势。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 1, target: 'self' },
    { type: 'apply_status', statusId: STATUS_STEADY_GUARD, stacks: 1, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['metallicize', 'steady_guard'],
};

export const GUARD_POWER_5: CardDefinition = {
  id: 'guard_power_5',
  name: '连势储备',
  description: '获得 3 层连势。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 3, target: 'self' }],
  archetype: 'guard',
  tags: ['momentum', 'setup'],
};

// ==================== 额外普通卡牌 ====================

export const GUARD_STRIKE_11: CardDefinition = {
  id: 'guard_strike_11',
  name: '守卫连击',
  description: '造成 3 点伤害三次。',
  type: 'attack',
  rarity: 'common',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'repeat', times: 3, effects: [{ type: 'damage', value: 3, target: 'selected' }] }],
  archetype: 'guard',
  tags: ['damage', 'multi_hit'],
};

export const GUARD_STRIKE_12: CardDefinition = {
  id: 'guard_strike_12',
  name: '防御打击',
  description: '造成 4 点伤害，获得 6 点格挡。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 4, target: 'selected' },
    { type: 'block', value: 6, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['damage', 'block'],
};

export const GUARD_STRIKE_13: CardDefinition = {
  id: 'guard_strike_13',
  name: '守势猛击',
  description: '造成 9 点伤害。若你有格挡，消耗 3 点格挡，造成额外 3 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'consume_block_for_damage', params: { baseDamage: 9, blockCost: 3, bonusDamage: 3 } }],
  archetype: 'guard',
  tags: ['damage', 'block'],
};

export const GUARD_SKILL_11: CardDefinition = {
  id: 'guard_skill_11',
  name: '坚守姿态',
  description: '获得 9 点格挡。',
  type: 'skill',
  rarity: 'common',
  cost: 2,
  target: 'none',
  effects: [{ type: 'block', value: 9, target: 'self' }],
  archetype: 'guard',
  tags: ['block'],
};

export const GUARD_SKILL_12: CardDefinition = {
  id: 'guard_skill_12',
  name: '防御强化',
  description: '获得 4 点格挡，获得 1 层金属化。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 4, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 1, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['block', 'metallicize'],
};

// ==================== 补充普通卡牌 ====================

export const GUARD_STRIKE_14: CardDefinition = {
  id: 'guard_strike_14',
  name: '守卫重击',
  description: '造成 7 点伤害，获得 4 点格挡。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 7, target: 'selected' },
    { type: 'block', value: 4, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['damage', 'block'],
};

export const GUARD_STRIKE_15: CardDefinition = {
  id: 'guard_strike_15',
  name: '守卫连击',
  description: '造成 3 点伤害三次。',
  type: 'attack',
  rarity: 'common',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'repeat', times: 3, effects: [{ type: 'damage', value: 3, target: 'selected' }] }],
  archetype: 'guard',
  tags: ['damage', 'multi_hit'],
};

export const GUARD_STRIKE_16: CardDefinition = {
  id: 'guard_strike_16',
  name: '防御打击',
  description: '造成 4 点伤害，获得 6 点格挡。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 4, target: 'selected' },
    { type: 'block', value: 6, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['damage', 'block'],
};

export const GUARD_SKILL_13: CardDefinition = {
  id: 'guard_skill_13',
  name: '坚守姿态',
  description: '获得 9 点格挡。',
  type: 'skill',
  rarity: 'common',
  cost: 2,
  target: 'none',
  effects: [{ type: 'block', value: 9, target: 'self' }],
  archetype: 'guard',
  tags: ['block'],
};

export const GUARD_SKILL_14: CardDefinition = {
  id: 'guard_skill_14',
  name: '防御强化',
  description: '获得 4 点格挡，获得 1 层金属化。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 4, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 1, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['block', 'metallicize'],
};

export const GUARD_SKILL_15: CardDefinition = {
  id: 'guard_skill_15',
  name: '守卫连击',
  description: '造成 2 点伤害两次。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'repeat', times: 2, effects: [{ type: 'damage', value: 2, target: 'all_enemies' }] }],
  archetype: 'guard',
  tags: ['damage', 'multi_hit'],
};

// 导出所有守势普通卡牌
export const GUARD_COMMON_CARDS: Record<string, CardDefinition> = {
  [GUARD_STRIKE_1.id]: GUARD_STRIKE_1,
  [GUARD_STRIKE_2.id]: GUARD_STRIKE_2,
  [GUARD_STRIKE_3.id]: GUARD_STRIKE_3,
  [GUARD_STRIKE_4.id]: GUARD_STRIKE_4,
  [GUARD_STRIKE_5.id]: GUARD_STRIKE_5,
  [GUARD_STRIKE_6.id]: GUARD_STRIKE_6,
  [GUARD_STRIKE_7.id]: GUARD_STRIKE_7,
  [GUARD_STRIKE_8.id]: GUARD_STRIKE_8,
  [GUARD_STRIKE_9.id]: GUARD_STRIKE_9,
  [GUARD_STRIKE_10.id]: GUARD_STRIKE_10,
  [GUARD_STRIKE_11.id]: GUARD_STRIKE_11,
  [GUARD_STRIKE_12.id]: GUARD_STRIKE_12,
  [GUARD_STRIKE_13.id]: GUARD_STRIKE_13,
  [GUARD_STRIKE_14.id]: GUARD_STRIKE_14,
  [GUARD_STRIKE_15.id]: GUARD_STRIKE_15,
  [GUARD_STRIKE_16.id]: GUARD_STRIKE_16,
  [GUARD_SKILL_1.id]: GUARD_SKILL_1,
  [GUARD_SKILL_2.id]: GUARD_SKILL_2,
  [GUARD_SKILL_3.id]: GUARD_SKILL_3,
  [GUARD_SKILL_4.id]: GUARD_SKILL_4,
  [GUARD_SKILL_5.id]: GUARD_SKILL_5,
  [GUARD_SKILL_6.id]: GUARD_SKILL_6,
  [GUARD_SKILL_7.id]: GUARD_SKILL_7,
  [GUARD_SKILL_8.id]: GUARD_SKILL_8,
  [GUARD_SKILL_9.id]: GUARD_SKILL_9,
  [GUARD_SKILL_10.id]: GUARD_SKILL_10,
  [GUARD_SKILL_11.id]: GUARD_SKILL_11,
  [GUARD_SKILL_12.id]: GUARD_SKILL_12,
  [GUARD_SKILL_13.id]: GUARD_SKILL_13,
  [GUARD_SKILL_14.id]: GUARD_SKILL_14,
  [GUARD_SKILL_15.id]: GUARD_SKILL_15,
  [GUARD_POWER_1.id]: GUARD_POWER_1,
  [GUARD_POWER_2.id]: GUARD_POWER_2,
  [GUARD_POWER_3.id]: GUARD_POWER_3,
  [GUARD_POWER_4.id]: GUARD_POWER_4,
  [GUARD_POWER_5.id]: GUARD_POWER_5,
};
