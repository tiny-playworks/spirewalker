import type { CardDefinition } from '../../../model/card';
import {
  STATUS_STRENGTH,
  STATUS_VULNERABLE,
  STATUS_WEAK,
} from '../../statuses';

/**
 * 通用流派 - 普通卡牌 (40张)
 * 主题：基础牌、污染牌、消耗牌、通用修复
 */

// ==================== 攻击牌 ====================

export const NEUTRAL_COMMON_ATK_1: CardDefinition = {
  id: 'neutral_common_atk_1',
  name: '打击',
  description: '造成 6 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'damage', value: 6, target: 'selected' }],
  archetype: 'neutral',
  tags: ['damage'],
};

export const NEUTRAL_COMMON_ATK_2: CardDefinition = {
  id: 'neutral_common_atk_2',
  name: '重击',
  description: '造成 8 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'damage', value: 8, target: 'selected' }],
  archetype: 'neutral',
  tags: ['damage'],
};

export const NEUTRAL_COMMON_ATK_3: CardDefinition = {
  id: 'neutral_common_atk_3',
  name: '猛击',
  description: '造成 12 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'damage', value: 12, target: 'selected' }],
  archetype: 'neutral',
  tags: ['damage'],
};

export const NEUTRAL_COMMON_ATK_4: CardDefinition = {
  id: 'neutral_common_atk_4',
  name: '连击',
  description: '造成 4 点伤害两次。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'repeat', times: 2, effects: [{ type: 'damage', value: 4, target: 'selected' }] }],
  archetype: 'neutral',
  tags: ['damage', 'multi_hit'],
};

export const NEUTRAL_COMMON_ATK_5: CardDefinition = {
  id: 'neutral_common_atk_5',
  name: '顺劈',
  description: '对所有敌人造成 6 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'all_enemies',
  effects: [{ type: 'damage', value: 6, target: 'all_enemies' }],
  archetype: 'neutral',
  tags: ['damage', 'aoe'],
};

export const NEUTRAL_COMMON_ATK_6: CardDefinition = {
  id: 'neutral_common_atk_6',
  name: '破甲击',
  description: '造成 5 点伤害，施加 1 层易伤。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 5, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_VULNERABLE, stacks: 1, target: 'selected' },
  ],
  archetype: 'neutral',
  tags: ['damage', 'debuff'],
};

export const NEUTRAL_COMMON_ATK_7: CardDefinition = {
  id: 'neutral_common_atk_7',
  name: '虚弱打击',
  description: '造成 5 点伤害，施加 1 层虚弱。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 5, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_WEAK, stacks: 1, target: 'selected' },
  ],
  archetype: 'neutral',
  tags: ['damage', 'debuff'],
};

export const NEUTRAL_COMMON_ATK_8: CardDefinition = {
  id: 'neutral_common_atk_8',
  name: '力量打击',
  description: '造成 7 点伤害。获得 1 层力量。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 7, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 1, target: 'self' },
  ],
  archetype: 'neutral',
  tags: ['damage', 'strength'],
};

// ==================== 技能牌 ====================

export const NEUTRAL_COMMON_SKILL_1: CardDefinition = {
  id: 'neutral_common_skill_1',
  name: '防御',
  description: '获得 5 点格挡。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'block', value: 5, target: 'self' }],
  archetype: 'neutral',
  tags: ['block'],
};

export const NEUTRAL_COMMON_SKILL_2: CardDefinition = {
  id: 'neutral_common_skill_2',
  name: '铁壁',
  description: '获得 8 点格挡。',
  type: 'skill',
  rarity: 'common',
  cost: 2,
  target: 'none',
  effects: [{ type: 'block', value: 8, target: 'self' }],
  archetype: 'neutral',
  tags: ['block'],
};

export const NEUTRAL_COMMON_SKILL_3: CardDefinition = {
  id: 'neutral_common_skill_3',
  name: '扫视',
  description: '抽 2 张牌。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'draw', value: 2 }],
  archetype: 'neutral',
  tags: ['draw'],
};

export const NEUTRAL_COMMON_SKILL_4: CardDefinition = {
  id: 'neutral_common_skill_4',
  name: '涌能',
  description: '获得 1 点能量。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [{ type: 'gain_energy', value: 1 }],
  archetype: 'neutral',
  tags: ['energy'],
};

export const NEUTRAL_COMMON_SKILL_5: CardDefinition = {
  id: 'neutral_common_skill_5',
  name: '柔韧',
  description: '获得 2 层力量。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 2, target: 'self' }],
  archetype: 'neutral',
  tags: ['strength'],
};

export const NEUTRAL_COMMON_SKILL_6: CardDefinition = {
  id: 'neutral_common_skill_6',
  name: '治疗',
  description: '回复 6 点生命。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'heal', value: 6, target: 'self' }],
  archetype: 'neutral',
  tags: ['heal'],
};

export const NEUTRAL_COMMON_SKILL_7: CardDefinition = {
  id: 'neutral_common_skill_7',
  name: '弃牌',
  description: '弃 1 张牌，抽 2 张牌。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [
    { type: 'discard', value: 1 },
    { type: 'draw', value: 2 },
  ],
  archetype: 'neutral',
  tags: ['draw', 'discard'],
};

export const NEUTRAL_COMMON_SKILL_8: CardDefinition = {
  id: 'neutral_common_skill_8',
  name: '防御强化',
  description: '获得 4 点格挡，获得 1 层力量。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 4, target: 'self' },
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 1, target: 'self' },
  ],
  archetype: 'neutral',
  tags: ['block', 'strength'],
};

// ==================== 能力牌 ====================

export const NEUTRAL_COMMON_POWER_1: CardDefinition = {
  id: 'neutral_common_power_1',
  name: '力量强化',
  description: '获得 1 层力量。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 1, target: 'self' }],
  archetype: 'neutral',
  tags: ['strength', 'scaling'],
};

export const NEUTRAL_COMMON_POWER_2: CardDefinition = {
  id: 'neutral_common_power_2',
  name: '易伤强化',
  description: '对所有敌人施加 1 层易伤。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_VULNERABLE, stacks: 1, target: 'all_enemies' }],
  archetype: 'neutral',
  tags: ['debuff', 'aoe'],
};

// ==================== 补充普通卡牌 ====================

export const NEUTRAL_COMMON_ATK_9: CardDefinition = {
  id: 'neutral_common_atk_9',
  name: '重击',
  description: '造成 8 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'damage', value: 8, target: 'selected' }],
  archetype: 'neutral',
  tags: ['damage'],
};

export const NEUTRAL_COMMON_ATK_10: CardDefinition = {
  id: 'neutral_common_atk_10',
  name: '猛击',
  description: '造成 12 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'damage', value: 12, target: 'selected' }],
  archetype: 'neutral',
  tags: ['damage'],
};

export const NEUTRAL_COMMON_ATK_11: CardDefinition = {
  id: 'neutral_common_atk_11',
  name: '连击',
  description: '造成 4 点伤害两次。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'repeat', times: 2, effects: [{ type: 'damage', value: 4, target: 'selected' }] }],
  archetype: 'neutral',
  tags: ['damage', 'multi_hit'],
};

export const NEUTRAL_COMMON_ATK_12: CardDefinition = {
  id: 'neutral_common_atk_12',
  name: '顺劈',
  description: '对所有敌人造成 6 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'all_enemies',
  effects: [{ type: 'damage', value: 6, target: 'all_enemies' }],
  archetype: 'neutral',
  tags: ['damage', 'aoe'],
};

export const NEUTRAL_COMMON_ATK_13: CardDefinition = {
  id: 'neutral_common_atk_13',
  name: '破甲击',
  description: '造成 5 点伤害，施加 1 层易伤。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 5, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_VULNERABLE, stacks: 1, target: 'selected' },
  ],
  archetype: 'neutral',
  tags: ['damage', 'debuff'],
};

export const NEUTRAL_COMMON_ATK_14: CardDefinition = {
  id: 'neutral_common_atk_14',
  name: '虚弱打击',
  description: '造成 5 点伤害，施加 1 层虚弱。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 5, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_WEAK, stacks: 1, target: 'selected' },
  ],
  archetype: 'neutral',
  tags: ['damage', 'debuff'],
};

export const NEUTRAL_COMMON_ATK_15: CardDefinition = {
  id: 'neutral_common_atk_15',
  name: '力量打击',
  description: '造成 7 点伤害。获得 1 层力量。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 7, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 1, target: 'self' },
  ],
  archetype: 'neutral',
  tags: ['damage', 'strength'],
};

export const NEUTRAL_COMMON_SKILL_9: CardDefinition = {
  id: 'neutral_common_skill_9',
  name: '防御',
  description: '获得 5 点格挡。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'block', value: 5, target: 'self' }],
  archetype: 'neutral',
  tags: ['block'],
};

export const NEUTRAL_COMMON_SKILL_10: CardDefinition = {
  id: 'neutral_common_skill_10',
  name: '铁壁',
  description: '获得 8 点格挡。',
  type: 'skill',
  rarity: 'common',
  cost: 2,
  target: 'none',
  effects: [{ type: 'block', value: 8, target: 'self' }],
  archetype: 'neutral',
  tags: ['block'],
};

export const NEUTRAL_COMMON_SKILL_11: CardDefinition = {
  id: 'neutral_common_skill_11',
  name: '扫视',
  description: '抽 2 张牌。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'draw', value: 2 }],
  archetype: 'neutral',
  tags: ['draw'],
};

export const NEUTRAL_COMMON_SKILL_12: CardDefinition = {
  id: 'neutral_common_skill_12',
  name: '涌能',
  description: '获得 1 点能量。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [{ type: 'gain_energy', value: 1 }],
  archetype: 'neutral',
  tags: ['energy'],
};

export const NEUTRAL_COMMON_SKILL_13: CardDefinition = {
  id: 'neutral_common_skill_13',
  name: '柔韧',
  description: '获得 2 层力量。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 2, target: 'self' }],
  archetype: 'neutral',
  tags: ['strength'],
};

export const NEUTRAL_COMMON_SKILL_14: CardDefinition = {
  id: 'neutral_common_skill_14',
  name: '治疗',
  description: '回复 6 点生命。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'heal', value: 6, target: 'self' }],
  archetype: 'neutral',
  tags: ['heal'],
};

export const NEUTRAL_COMMON_SKILL_15: CardDefinition = {
  id: 'neutral_common_skill_15',
  name: '弃牌',
  description: '弃 1 张牌，抽 2 张牌。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [
    { type: 'discard', value: 1 },
    { type: 'draw', value: 2 },
  ],
  archetype: 'neutral',
  tags: ['draw', 'discard'],
};

export const NEUTRAL_COMMON_SKILL_16: CardDefinition = {
  id: 'neutral_common_skill_16',
  name: '防御强化',
  description: '获得 4 点格挡，获得 1 层力量。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 4, target: 'self' },
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 1, target: 'self' },
  ],
  archetype: 'neutral',
  tags: ['block', 'strength'],
};

export const NEUTRAL_COMMON_POWER_3: CardDefinition = {
  id: 'neutral_common_power_3',
  name: '力量强化',
  description: '获得 1 层力量。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 1, target: 'self' }],
  archetype: 'neutral',
  tags: ['strength', 'scaling'],
};

export const NEUTRAL_COMMON_POWER_4: CardDefinition = {
  id: 'neutral_common_power_4',
  name: '易伤强化',
  description: '对所有敌人施加 1 层易伤。',
  type: 'power',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_VULNERABLE, stacks: 1, target: 'all_enemies' }],
  archetype: 'neutral',
  tags: ['debuff', 'aoe'],
};

// 导出所有通用普通卡牌
export const NEUTRAL_COMMON_CARDS: Record<string, CardDefinition> = {
  [NEUTRAL_COMMON_ATK_1.id]: NEUTRAL_COMMON_ATK_1,
  [NEUTRAL_COMMON_ATK_2.id]: NEUTRAL_COMMON_ATK_2,
  [NEUTRAL_COMMON_ATK_3.id]: NEUTRAL_COMMON_ATK_3,
  [NEUTRAL_COMMON_ATK_4.id]: NEUTRAL_COMMON_ATK_4,
  [NEUTRAL_COMMON_ATK_5.id]: NEUTRAL_COMMON_ATK_5,
  [NEUTRAL_COMMON_ATK_6.id]: NEUTRAL_COMMON_ATK_6,
  [NEUTRAL_COMMON_ATK_7.id]: NEUTRAL_COMMON_ATK_7,
  [NEUTRAL_COMMON_ATK_8.id]: NEUTRAL_COMMON_ATK_8,
  [NEUTRAL_COMMON_ATK_9.id]: NEUTRAL_COMMON_ATK_9,
  [NEUTRAL_COMMON_ATK_10.id]: NEUTRAL_COMMON_ATK_10,
  [NEUTRAL_COMMON_ATK_11.id]: NEUTRAL_COMMON_ATK_11,
  [NEUTRAL_COMMON_ATK_12.id]: NEUTRAL_COMMON_ATK_12,
  [NEUTRAL_COMMON_ATK_13.id]: NEUTRAL_COMMON_ATK_13,
  [NEUTRAL_COMMON_ATK_14.id]: NEUTRAL_COMMON_ATK_14,
  [NEUTRAL_COMMON_ATK_15.id]: NEUTRAL_COMMON_ATK_15,
  [NEUTRAL_COMMON_SKILL_1.id]: NEUTRAL_COMMON_SKILL_1,
  [NEUTRAL_COMMON_SKILL_2.id]: NEUTRAL_COMMON_SKILL_2,
  [NEUTRAL_COMMON_SKILL_3.id]: NEUTRAL_COMMON_SKILL_3,
  [NEUTRAL_COMMON_SKILL_4.id]: NEUTRAL_COMMON_SKILL_4,
  [NEUTRAL_COMMON_SKILL_5.id]: NEUTRAL_COMMON_SKILL_5,
  [NEUTRAL_COMMON_SKILL_6.id]: NEUTRAL_COMMON_SKILL_6,
  [NEUTRAL_COMMON_SKILL_7.id]: NEUTRAL_COMMON_SKILL_7,
  [NEUTRAL_COMMON_SKILL_8.id]: NEUTRAL_COMMON_SKILL_8,
  [NEUTRAL_COMMON_SKILL_9.id]: NEUTRAL_COMMON_SKILL_9,
  [NEUTRAL_COMMON_SKILL_10.id]: NEUTRAL_COMMON_SKILL_10,
  [NEUTRAL_COMMON_SKILL_11.id]: NEUTRAL_COMMON_SKILL_11,
  [NEUTRAL_COMMON_SKILL_12.id]: NEUTRAL_COMMON_SKILL_12,
  [NEUTRAL_COMMON_SKILL_13.id]: NEUTRAL_COMMON_SKILL_13,
  [NEUTRAL_COMMON_SKILL_14.id]: NEUTRAL_COMMON_SKILL_14,
  [NEUTRAL_COMMON_SKILL_15.id]: NEUTRAL_COMMON_SKILL_15,
  [NEUTRAL_COMMON_SKILL_16.id]: NEUTRAL_COMMON_SKILL_16,
  [NEUTRAL_COMMON_POWER_1.id]: NEUTRAL_COMMON_POWER_1,
  [NEUTRAL_COMMON_POWER_2.id]: NEUTRAL_COMMON_POWER_2,
  [NEUTRAL_COMMON_POWER_3.id]: NEUTRAL_COMMON_POWER_3,
  [NEUTRAL_COMMON_POWER_4.id]: NEUTRAL_COMMON_POWER_4,
};
