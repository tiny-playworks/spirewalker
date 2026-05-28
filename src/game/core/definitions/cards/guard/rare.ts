import type { CardDefinition } from '../../../model/card';
import {
  STATUS_METALLICIZE,
  STATUS_MOMENTUM,
  STATUS_PRIMED_BREAK,
  STATUS_STEADY_GUARD,
  STATUS_STRENGTH,
} from '../../statuses';

/**
 * 守势流派 - 史诗卡牌 (15张)
 * 主题：终极防御、格挡联动、稳势爆发、金属化堆叠
 */

// ==================== 攻击牌 ====================

export const GUARD_RARE_ATK_1: CardDefinition = {
  id: 'guard_rare_atk_1',
  name: '铁壁猛击',
  description: '造成等同于你格挡值两倍的伤害。',
  type: 'attack',
  rarity: 'rare',
  cost: 3,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'block_to_damage', params: { multiplier: 2 } }],
  archetype: 'guard',
  tags: ['damage', 'block_scaling'],
};

export const GUARD_RARE_ATK_2: CardDefinition = {
  id: 'guard_rare_atk_2',
  name: '稳势爆发',
  description: '造成 20 点伤害。消耗所有稳势，每层造成额外 5 点伤害。',
  type: 'attack',
  rarity: 'rare',
  cost: 3,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'steady_guard_burst_damage', params: { baseDamage: 20, damagePerStack: 5 } }],
  archetype: 'guard',
  tags: ['damage', 'steady_guard'],
};

export const GUARD_RARE_ATK_3: CardDefinition = {
  id: 'guard_rare_atk_3',
  name: '金属化打击',
  description: '造成 15 点伤害，获得等同于你金属化层数的格挡。',
  type: 'attack',
  rarity: 'rare',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'metallicize_to_block', params: { baseDamage: 15 } }],
  archetype: 'guard',
  tags: ['damage', 'metallicize'],
};

export const GUARD_RARE_ATK_4: CardDefinition = {
  id: 'guard_rare_atk_4',
  name: '守势连击',
  description: '造成 5 点伤害四次。',
  type: 'attack',
  rarity: 'rare',
  cost: 3,
  target: 'single_enemy',
  effects: [{ type: 'repeat', times: 4, effects: [{ type: 'damage', value: 5, target: 'selected' }] }],
  archetype: 'guard',
  tags: ['damage', 'multi_hit'],
};

export const GUARD_RARE_ATK_5: CardDefinition = {
  id: 'guard_rare_atk_5',
  name: '破势反击',
  description: '造成 25 点伤害。消耗所有破势预热，每层造成额外 8 点伤害。',
  type: 'attack',
  rarity: 'rare',
  cost: 4,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'primed_break_burst_damage', params: { baseDamage: 25, damagePerStack: 8 } }],
  archetype: 'guard',
  tags: ['damage', 'primed_break'],
};

// ==================== 技能牌 ====================

export const GUARD_RARE_SKILL_1: CardDefinition = {
  id: 'guard_rare_skill_1',
  name: '铁壁防御',
  description: '获得 20 点格挡。',
  type: 'skill',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [{ type: 'block', value: 20, target: 'self' }],
  archetype: 'guard',
  tags: ['block'],
};

export const GUARD_RARE_SKILL_2: CardDefinition = {
  id: 'guard_rare_skill_2',
  name: '稳势防御',
  description: '获得 12 点格挡，获得 3 层稳势。',
  type: 'skill',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [
    { type: 'block', value: 12, target: 'self' },
    { type: 'apply_status', statusId: STATUS_STEADY_GUARD, stacks: 3, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['block', 'steady_guard'],
};

export const GUARD_RARE_SKILL_3: CardDefinition = {
  id: 'guard_rare_skill_3',
  name: '金属化防御',
  description: '获得 10 点格挡，获得 4 层金属化。',
  type: 'skill',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [
    { type: 'block', value: 10, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 4, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['block', 'metallicize'],
};

export const GUARD_RARE_SKILL_4: CardDefinition = {
  id: 'guard_rare_skill_4',
  name: '势能壁垒',
  description: '获得 8 点格挡，获得 5 层连势。',
  type: 'skill',
  rarity: 'rare',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'block', value: 8, target: 'self' },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 5, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['block', 'momentum'],
};

export const GUARD_RARE_SKILL_5: CardDefinition = {
  id: 'guard_rare_skill_5',
  name: '坚守阵地',
  description: '获得 15 点格挡，抽 2 张牌。',
  type: 'skill',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [
    { type: 'block', value: 15, target: 'self' },
    { type: 'draw', value: 2 },
  ],
  archetype: 'guard',
  tags: ['block', 'draw'],
};

// ==================== 能力牌 ====================

export const GUARD_RARE_POWER_1: CardDefinition = {
  id: 'guard_rare_power_1',
  name: '金属化精通',
  description: '获得 8 层金属化。',
  type: 'power',
  rarity: 'rare',
  cost: 4,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 8, target: 'self' }],
  archetype: 'guard',
  tags: ['metallicize', 'scaling'],
};

export const GUARD_RARE_POWER_2: CardDefinition = {
  id: 'guard_rare_power_2',
  name: '稳势精通',
  description: '获得 5 层稳势。',
  type: 'power',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STEADY_GUARD, stacks: 5, target: 'self' }],
  archetype: 'guard',
  tags: ['steady_guard', 'scaling'],
};

export const GUARD_RARE_POWER_3: CardDefinition = {
  id: 'guard_rare_power_3',
  name: '守势大师',
  description: '获得 3 层力量和 5 层金属化。',
  type: 'power',
  rarity: 'rare',
  cost: 4,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 3, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 5, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['strength', 'metallicize'],
};

export const GUARD_RARE_POWER_4: CardDefinition = {
  id: 'guard_rare_power_4',
  name: '连势大师',
  description: '获得 6 层连势。',
  type: 'power',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 6, target: 'self' }],
  archetype: 'guard',
  tags: ['momentum', 'setup'],
};

export const GUARD_RARE_POWER_5: CardDefinition = {
  id: 'guard_rare_power_5',
  name: '破势预热精通',
  description: '获得 4 层破势预热。',
  type: 'power',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 4, target: 'self' }],
  archetype: 'guard',
  tags: ['primed_break', 'setup'],
};

// 导出所有守势史诗卡牌
export const GUARD_RARE_CARDS: Record<string, CardDefinition> = {
  [GUARD_RARE_ATK_1.id]: GUARD_RARE_ATK_1,
  [GUARD_RARE_ATK_2.id]: GUARD_RARE_ATK_2,
  [GUARD_RARE_ATK_3.id]: GUARD_RARE_ATK_3,
  [GUARD_RARE_ATK_4.id]: GUARD_RARE_ATK_4,
  [GUARD_RARE_ATK_5.id]: GUARD_RARE_ATK_5,
  [GUARD_RARE_SKILL_1.id]: GUARD_RARE_SKILL_1,
  [GUARD_RARE_SKILL_2.id]: GUARD_RARE_SKILL_2,
  [GUARD_RARE_SKILL_3.id]: GUARD_RARE_SKILL_3,
  [GUARD_RARE_SKILL_4.id]: GUARD_RARE_SKILL_4,
  [GUARD_RARE_SKILL_5.id]: GUARD_RARE_SKILL_5,
  [GUARD_RARE_POWER_1.id]: GUARD_RARE_POWER_1,
  [GUARD_RARE_POWER_2.id]: GUARD_RARE_POWER_2,
  [GUARD_RARE_POWER_3.id]: GUARD_RARE_POWER_3,
  [GUARD_RARE_POWER_4.id]: GUARD_RARE_POWER_4,
  [GUARD_RARE_POWER_5.id]: GUARD_RARE_POWER_5,
};
