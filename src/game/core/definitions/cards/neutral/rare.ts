import type { CardDefinition } from '../../../model/card';
import {
  STATUS_STRENGTH,
  STATUS_VULNERABLE,
  STATUS_WEAK,
} from '../../statuses';

/**
 * 通用流派 - 史诗卡牌 (15张)
 * 主题：终极通用、高伤害、强力减益、能量爆发
 */

// ==================== 攻击牌 ====================

export const NEUTRAL_RARE_ATK_1: CardDefinition = {
  id: 'neutral_rare_atk_1',
  name: '终极打击',
  description: '造成 20 点伤害。',
  type: 'attack',
  rarity: 'rare',
  cost: 3,
  target: 'single_enemy',
  effects: [{ type: 'damage', value: 20, target: 'selected' }],
  archetype: 'neutral',
  tags: ['damage'],
};

export const NEUTRAL_RARE_ATK_2: CardDefinition = {
  id: 'neutral_rare_atk_2',
  name: '连击风暴',
  description: '造成 5 点伤害四次。',
  type: 'attack',
  rarity: 'rare',
  cost: 3,
  target: 'single_enemy',
  effects: [{ type: 'repeat', times: 4, effects: [{ type: 'damage', value: 5, target: 'selected' }] }],
  archetype: 'neutral',
  tags: ['damage', 'multi_hit'],
};

export const NEUTRAL_RARE_ATK_3: CardDefinition = {
  id: 'neutral_rare_atk_3',
  name: '顺劈风暴',
  description: '对所有敌人造成 15 点伤害。',
  type: 'attack',
  rarity: 'rare',
  cost: 3,
  target: 'all_enemies',
  effects: [{ type: 'damage', value: 15, target: 'all_enemies' }],
  archetype: 'neutral',
  tags: ['damage', 'aoe'],
};

export const NEUTRAL_RARE_ATK_4: CardDefinition = {
  id: 'neutral_rare_atk_4',
  name: '破甲风暴',
  description: '造成 12 点伤害，施加 3 层易伤。',
  type: 'attack',
  rarity: 'rare',
  cost: 3,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 12, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_VULNERABLE, stacks: 3, target: 'selected' },
  ],
  archetype: 'neutral',
  tags: ['damage', 'debuff'],
};

// ==================== 技能牌 ====================

export const NEUTRAL_RARE_SKILL_1: CardDefinition = {
  id: 'neutral_rare_skill_1',
  name: '铁壁防御',
  description: '获得 20 点格挡。',
  type: 'skill',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [{ type: 'block', value: 20, target: 'self' }],
  archetype: 'neutral',
  tags: ['block'],
};

export const NEUTRAL_RARE_SKILL_2: CardDefinition = {
  id: 'neutral_rare_skill_2',
  name: '扫视风暴',
  description: '抽 5 张牌。',
  type: 'skill',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [{ type: 'draw', value: 5 }],
  archetype: 'neutral',
  tags: ['draw'],
};

export const NEUTRAL_RARE_SKILL_3: CardDefinition = {
  id: 'neutral_rare_skill_3',
  name: '涌能风暴',
  description: '获得 3 点能量。',
  type: 'skill',
  rarity: 'rare',
  cost: 0,
  target: 'none',
  effects: [{ type: 'gain_energy', value: 3 }],
  archetype: 'neutral',
  tags: ['energy'],
};

export const NEUTRAL_RARE_SKILL_4: CardDefinition = {
  id: 'neutral_rare_skill_4',
  name: '柔韧风暴',
  description: '获得 5 层力量。',
  type: 'skill',
  rarity: 'rare',
  cost: 2,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 5, target: 'self' }],
  archetype: 'neutral',
  tags: ['strength'],
};

export const NEUTRAL_RARE_SKILL_5: CardDefinition = {
  id: 'neutral_rare_skill_5',
  name: '治疗风暴',
  description: '回复 20 点生命。',
  type: 'skill',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [{ type: 'heal', value: 20, target: 'self' }],
  archetype: 'neutral',
  tags: ['heal'],
};

// ==================== 能力牌 ====================

export const NEUTRAL_RARE_POWER_1: CardDefinition = {
  id: 'neutral_rare_power_1',
  name: '力量精通',
  description: '获得 4 层力量。',
  type: 'power',
  rarity: 'rare',
  cost: 4,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 4, target: 'self' }],
  archetype: 'neutral',
  tags: ['strength', 'scaling'],
};

export const NEUTRAL_RARE_POWER_2: CardDefinition = {
  id: 'neutral_rare_power_2',
  name: '易伤精通',
  description: '对所有敌人施加 3 层易伤。',
  type: 'power',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_VULNERABLE, stacks: 3, target: 'all_enemies' }],
  archetype: 'neutral',
  tags: ['debuff', 'aoe'],
};

export const NEUTRAL_RARE_POWER_3: CardDefinition = {
  id: 'neutral_rare_power_3',
  name: '虚弱精通',
  description: '对所有敌人施加 3 层虚弱。',
  type: 'power',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_WEAK, stacks: 3, target: 'all_enemies' }],
  archetype: 'neutral',
  tags: ['debuff', 'aoe'],
};

// 导出所有通用史诗卡牌
export const NEUTRAL_RARE_CARDS: Record<string, CardDefinition> = {
  [NEUTRAL_RARE_ATK_1.id]: NEUTRAL_RARE_ATK_1,
  [NEUTRAL_RARE_ATK_2.id]: NEUTRAL_RARE_ATK_2,
  [NEUTRAL_RARE_ATK_3.id]: NEUTRAL_RARE_ATK_3,
  [NEUTRAL_RARE_ATK_4.id]: NEUTRAL_RARE_ATK_4,
  [NEUTRAL_RARE_SKILL_1.id]: NEUTRAL_RARE_SKILL_1,
  [NEUTRAL_RARE_SKILL_2.id]: NEUTRAL_RARE_SKILL_2,
  [NEUTRAL_RARE_SKILL_3.id]: NEUTRAL_RARE_SKILL_3,
  [NEUTRAL_RARE_SKILL_4.id]: NEUTRAL_RARE_SKILL_4,
  [NEUTRAL_RARE_SKILL_5.id]: NEUTRAL_RARE_SKILL_5,
  [NEUTRAL_RARE_POWER_1.id]: NEUTRAL_RARE_POWER_1,
  [NEUTRAL_RARE_POWER_2.id]: NEUTRAL_RARE_POWER_2,
  [NEUTRAL_RARE_POWER_3.id]: NEUTRAL_RARE_POWER_3,
};
