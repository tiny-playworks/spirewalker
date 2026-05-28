import type { CardDefinition } from '../../../model/card';
import {
  STATUS_STRENGTH,
  STATUS_VULNERABLE,
  STATUS_WEAK,
} from '../../statuses';

/**
 * 通用流派 - 稀有卡牌 (30张)
 * 主题：通用强化、过牌、能量、减益
 */

// ==================== 攻击牌 ====================

export const NEUTRAL_UNCOMMON_ATK_1: CardDefinition = {
  id: 'neutral_uncommon_atk_1',
  name: '重击',
  description: '造成 14 点伤害。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'damage', value: 14, target: 'selected' }],
  archetype: 'neutral',
  tags: ['damage'],
};

export const NEUTRAL_UNCOMMON_ATK_2: CardDefinition = {
  id: 'neutral_uncommon_atk_2',
  name: '连击',
  description: '造成 6 点伤害两次。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'repeat', times: 2, effects: [{ type: 'damage', value: 6, target: 'selected' }] }],
  archetype: 'neutral',
  tags: ['damage', 'multi_hit'],
};

export const NEUTRAL_UNCOMMON_ATK_3: CardDefinition = {
  id: 'neutral_uncommon_atk_3',
  name: '顺劈',
  description: '对所有敌人造成 10 点伤害。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'all_enemies',
  effects: [{ type: 'damage', value: 10, target: 'all_enemies' }],
  archetype: 'neutral',
  tags: ['damage', 'aoe'],
};

export const NEUTRAL_UNCOMMON_ATK_4: CardDefinition = {
  id: 'neutral_uncommon_atk_4',
  name: '破甲击',
  description: '造成 8 点伤害，施加 2 层易伤。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 8, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_VULNERABLE, stacks: 2, target: 'selected' },
  ],
  archetype: 'neutral',
  tags: ['damage', 'debuff'],
};

export const NEUTRAL_UNCOMMON_ATK_5: CardDefinition = {
  id: 'neutral_uncommon_atk_5',
  name: '虚弱打击',
  description: '造成 7 点伤害，施加 2 层虚弱。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 7, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_WEAK, stacks: 2, target: 'selected' },
  ],
  archetype: 'neutral',
  tags: ['damage', 'debuff'],
};

export const NEUTRAL_UNCOMMON_ATK_6: CardDefinition = {
  id: 'neutral_uncommon_atk_6',
  name: '力量打击',
  description: '造成 10 点伤害。获得 2 层力量。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 10, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 2, target: 'self' },
  ],
  archetype: 'neutral',
  tags: ['damage', 'strength'],
};

// ==================== 技能牌 ====================

export const NEUTRAL_UNCOMMON_SKILL_1: CardDefinition = {
  id: 'neutral_uncommon_skill_1',
  name: '铁壁',
  description: '获得 12 点格挡。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'block', value: 12, target: 'self' }],
  archetype: 'neutral',
  tags: ['block'],
};

export const NEUTRAL_UNCOMMON_SKILL_2: CardDefinition = {
  id: 'neutral_uncommon_skill_2',
  name: '扫视',
  description: '抽 3 张牌。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'draw', value: 3 }],
  archetype: 'neutral',
  tags: ['draw'],
};

export const NEUTRAL_UNCOMMON_SKILL_3: CardDefinition = {
  id: 'neutral_uncommon_skill_3',
  name: '涌能',
  description: '获得 2 点能量。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 0,
  target: 'none',
  effects: [{ type: 'gain_energy', value: 2 }],
  archetype: 'neutral',
  tags: ['energy'],
};

export const NEUTRAL_UNCOMMON_SKILL_4: CardDefinition = {
  id: 'neutral_uncommon_skill_4',
  name: '柔韧',
  description: '获得 3 层力量。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 1,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 3, target: 'self' }],
  archetype: 'neutral',
  tags: ['strength'],
};

export const NEUTRAL_UNCOMMON_SKILL_5: CardDefinition = {
  id: 'neutral_uncommon_skill_5',
  name: '治疗',
  description: '回复 10 点生命。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'heal', value: 10, target: 'self' }],
  archetype: 'neutral',
  tags: ['heal'],
};

export const NEUTRAL_UNCOMMON_SKILL_6: CardDefinition = {
  id: 'neutral_uncommon_skill_6',
  name: '弃牌',
  description: '弃 2 张牌，抽 3 张牌。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 0,
  target: 'none',
  effects: [
    { type: 'discard', value: 2 },
    { type: 'draw', value: 3 },
  ],
  archetype: 'neutral',
  tags: ['draw', 'discard'],
};

export const NEUTRAL_UNCOMMON_SKILL_7: CardDefinition = {
  id: 'neutral_uncommon_skill_7',
  name: '防御灌注',
  description: '获得 8 点格挡，获得 2 层力量。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'block', value: 8, target: 'self' },
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 2, target: 'self' },
  ],
  archetype: 'neutral',
  tags: ['block', 'strength'],
};

// ==================== 能力牌 ====================

export const NEUTRAL_UNCOMMON_POWER_1: CardDefinition = {
  id: 'neutral_uncommon_power_1',
  name: '力量注入',
  description: '获得 2 层力量。',
  type: 'power',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 2, target: 'self' }],
  archetype: 'neutral',
  tags: ['strength', 'scaling'],
};

export const NEUTRAL_UNCOMMON_POWER_2: CardDefinition = {
  id: 'neutral_uncommon_power_2',
  name: '易伤强化',
  description: '对所有敌人施加 2 层易伤。',
  type: 'power',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_VULNERABLE, stacks: 2, target: 'all_enemies' }],
  archetype: 'neutral',
  tags: ['debuff', 'aoe'],
};

export const NEUTRAL_UNCOMMON_POWER_3: CardDefinition = {
  id: 'neutral_uncommon_power_3',
  name: '虚弱强化',
  description: '对所有敌人施加 2 层虚弱。',
  type: 'power',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_WEAK, stacks: 2, target: 'all_enemies' }],
  archetype: 'neutral',
  tags: ['debuff', 'aoe'],
};

// 导出所有通用稀有卡牌
export const NEUTRAL_UNCOMMON_CARDS: Record<string, CardDefinition> = {
  [NEUTRAL_UNCOMMON_ATK_1.id]: NEUTRAL_UNCOMMON_ATK_1,
  [NEUTRAL_UNCOMMON_ATK_2.id]: NEUTRAL_UNCOMMON_ATK_2,
  [NEUTRAL_UNCOMMON_ATK_3.id]: NEUTRAL_UNCOMMON_ATK_3,
  [NEUTRAL_UNCOMMON_ATK_4.id]: NEUTRAL_UNCOMMON_ATK_4,
  [NEUTRAL_UNCOMMON_ATK_5.id]: NEUTRAL_UNCOMMON_ATK_5,
  [NEUTRAL_UNCOMMON_ATK_6.id]: NEUTRAL_UNCOMMON_ATK_6,
  [NEUTRAL_UNCOMMON_SKILL_1.id]: NEUTRAL_UNCOMMON_SKILL_1,
  [NEUTRAL_UNCOMMON_SKILL_2.id]: NEUTRAL_UNCOMMON_SKILL_2,
  [NEUTRAL_UNCOMMON_SKILL_3.id]: NEUTRAL_UNCOMMON_SKILL_3,
  [NEUTRAL_UNCOMMON_SKILL_4.id]: NEUTRAL_UNCOMMON_SKILL_4,
  [NEUTRAL_UNCOMMON_SKILL_5.id]: NEUTRAL_UNCOMMON_SKILL_5,
  [NEUTRAL_UNCOMMON_SKILL_6.id]: NEUTRAL_UNCOMMON_SKILL_6,
  [NEUTRAL_UNCOMMON_SKILL_7.id]: NEUTRAL_UNCOMMON_SKILL_7,
  [NEUTRAL_UNCOMMON_POWER_1.id]: NEUTRAL_UNCOMMON_POWER_1,
  [NEUTRAL_UNCOMMON_POWER_2.id]: NEUTRAL_UNCOMMON_POWER_2,
  [NEUTRAL_UNCOMMON_POWER_3.id]: NEUTRAL_UNCOMMON_POWER_3,
};
