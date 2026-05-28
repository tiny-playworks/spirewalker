import type { CardDefinition } from '../../../model/card';
import {
  STATUS_METALLICIZE,
  STATUS_MOMENTUM,
  STATUS_PRIMED_BREAK,
  STATUS_STEADY_GUARD,
  STATUS_STRENGTH,
  STATUS_VULNERABLE,
} from '../../statuses';

/**
 * 守势流派 - 稀有卡牌 (25张)
 * 主题：格挡联动、稳势回报、金属化堆叠、防守反击
 */

// ==================== 攻击牌 ====================

export const GUARD_UNCOMMON_ATK_1: CardDefinition = {
  id: 'guard_uncommon_atk_1',
  name: '铁壁反击',
  description: '造成等同于你格挡值的伤害。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'block_to_damage', params: { multiplier: 1 } }],
  archetype: 'guard',
  tags: ['damage', 'block_scaling'],
};

export const GUARD_UNCOMMON_ATK_2: CardDefinition = {
  id: 'guard_uncommon_atk_2',
  name: '稳势重击',
  description: '造成 12 点伤害。若你有稳势，造成额外 6 点伤害。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'conditional_damage', params: { baseDamage: 12, bonusDamage: 6, condition: 'has_steady_guard' } }],
  archetype: 'guard',
  tags: ['damage', 'steady_guard'],
};

export const GUARD_UNCOMMON_ATK_3: CardDefinition = {
  id: 'guard_uncommon_atk_3',
  name: '金属化打击',
  description: '造成 8 点伤害，获得等同于你金属化层数的格挡。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'metallicize_to_block', params: { baseDamage: 8 } }],
  archetype: 'guard',
  tags: ['damage', 'metallicize'],
};

export const GUARD_UNCOMMON_ATK_4: CardDefinition = {
  id: 'guard_uncommon_atk_4',
  name: '守势连击',
  description: '造成 4 点伤害三次。每击获得 2 点格挡。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'multi_hit_with_block', params: { hits: 3, damagePerHit: 4, blockPerHit: 2 } }],
  archetype: 'guard',
  tags: ['damage', 'multi_hit', 'block'],
};

export const GUARD_UNCOMMON_ATK_5: CardDefinition = {
  id: 'guard_uncommon_atk_5',
  name: '破甲打击',
  description: '造成 10 点伤害，施加 2 层易伤。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 10, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_VULNERABLE, stacks: 2, target: 'selected' },
  ],
  archetype: 'guard',
  tags: ['damage', 'debuff'],
};

export const GUARD_UNCOMMON_ATK_6: CardDefinition = {
  id: 'guard_uncommon_atk_6',
  name: '蓄力反击',
  description: '造成 14 点伤害。消耗 3 层连势。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'fixed', consumeValue: 3, baseDamage: 14, damagePerStack: 0 } }],
  archetype: 'guard',
  tags: ['damage', 'momentum'],
};

export const GUARD_UNCOMMON_ATK_7: CardDefinition = {
  id: 'guard_uncommon_atk_7',
  name: '盾墙猛击',
  description: '造成 6 点伤害，获得 8 点格挡。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 6, target: 'selected' },
    { type: 'block', value: 8, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['damage', 'block'],
};

// ==================== 技能牌 ====================

export const GUARD_UNCOMMON_SKILL_1: CardDefinition = {
  id: 'guard_uncommon_skill_1',
  name: '铁壁防御',
  description: '获得 12 点格挡。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'block', value: 12, target: 'self' }],
  archetype: 'guard',
  tags: ['block'],
};

export const GUARD_UNCOMMON_SKILL_2: CardDefinition = {
  id: 'guard_uncommon_skill_2',
  name: '稳势防御',
  description: '获得 8 点格挡，获得 2 层稳势。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'block', value: 8, target: 'self' },
    { type: 'apply_status', statusId: STATUS_STEADY_GUARD, stacks: 2, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['block', 'steady_guard'],
};

export const GUARD_UNCOMMON_SKILL_3: CardDefinition = {
  id: 'guard_uncommon_skill_3',
  name: '金属化防御',
  description: '获得 6 点格挡，获得 3 层金属化。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'block', value: 6, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 3, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['block', 'metallicize'],
};

export const GUARD_UNCOMMON_SKILL_4: CardDefinition = {
  id: 'guard_uncommon_skill_4',
  name: '连势防御',
  description: '获得 5 点格挡，获得 3 层连势。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 1,
  target: 'none',
  effects: [
    { type: 'block', value: 5, target: 'self' },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 3, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['block', 'momentum'],
};

export const GUARD_UNCOMMON_SKILL_5: CardDefinition = {
  id: 'guard_uncommon_skill_5',
  name: '坚守阵地',
  description: '获得 10 点格挡，抽 1 张牌。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'block', value: 10, target: 'self' },
    { type: 'draw', value: 1 },
  ],
  archetype: 'guard',
  tags: ['block', 'draw'],
};

export const GUARD_UNCOMMON_SKILL_6: CardDefinition = {
  id: 'guard_uncommon_skill_6',
  name: '防御强化',
  description: '获得 7 点格挡，获得 1 层力量。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'block', value: 7, target: 'self' },
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 1, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['block', 'strength'],
};

export const GUARD_UNCOMMON_SKILL_7: CardDefinition = {
  id: 'guard_uncommon_skill_7',
  name: '稳势连击',
  description: '获得 6 点格挡两次。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'repeat', times: 2, effects: [{ type: 'block', value: 6, target: 'self' }] }],
  archetype: 'guard',
  tags: ['block'],
};

export const GUARD_UNCOMMON_SKILL_8: CardDefinition = {
  id: 'guard_uncommon_skill_8',
  name: '防御姿态',
  description: '获得 5 点格挡，对所有敌人造成 5 点伤害。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'block', value: 5, target: 'self' },
    { type: 'damage', value: 5, target: 'all_enemies' },
  ],
  archetype: 'guard',
  tags: ['block', 'damage'],
};

// ==================== 能力牌 ====================

export const GUARD_UNCOMMON_POWER_1: CardDefinition = {
  id: 'guard_uncommon_power_1',
  name: '金属化强化',
  description: '获得 5 层金属化。',
  type: 'power',
  rarity: 'uncommon',
  cost: 3,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 5, target: 'self' }],
  archetype: 'guard',
  tags: ['metallicize', 'scaling'],
};

export const GUARD_UNCOMMON_POWER_2: CardDefinition = {
  id: 'guard_uncommon_power_2',
  name: '稳势强化',
  description: '获得 3 层稳势。',
  type: 'power',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STEADY_GUARD, stacks: 3, target: 'self' }],
  archetype: 'guard',
  tags: ['steady_guard', 'scaling'],
};

export const GUARD_UNCOMMON_POWER_3: CardDefinition = {
  id: 'guard_uncommon_power_3',
  name: '守势精通',
  description: '获得 2 层力量和 2 层金属化。',
  type: 'power',
  rarity: 'uncommon',
  cost: 3,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 2, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 2, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['strength', 'metallicize'],
};

export const GUARD_UNCOMMON_POWER_4: CardDefinition = {
  id: 'guard_uncommon_power_4',
  name: '连势储备',
  description: '获得 4 层连势。',
  type: 'power',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 4, target: 'self' }],
  archetype: 'guard',
  tags: ['momentum', 'setup'],
};

export const GUARD_UNCOMMON_POWER_5: CardDefinition = {
  id: 'guard_uncommon_power_5',
  name: '破势预热',
  description: '获得 2 层破势预热。',
  type: 'power',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 2, target: 'self' }],
  archetype: 'guard',
  tags: ['primed_break', 'setup'],
};

export const GUARD_UNCOMMON_POWER_6: CardDefinition = {
  id: 'guard_uncommon_power_6',
  name: '防御专注',
  description: '获得 2 层金属化和 2 层稳势。',
  type: 'power',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 2, target: 'self' },
    { type: 'apply_status', statusId: STATUS_STEADY_GUARD, stacks: 2, target: 'self' },
  ],
  archetype: 'guard',
  tags: ['metallicize', 'steady_guard'],
};

export const GUARD_UNCOMMON_POWER_7: CardDefinition = {
  id: 'guard_uncommon_power_7',
  name: '蓄力防御',
  description: '获得 3 层力量。',
  type: 'power',
  rarity: 'uncommon',
  cost: 3,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 3, target: 'self' }],
  archetype: 'guard',
  tags: ['strength', 'scaling'],
};

// 导出所有守势稀有卡牌
export const GUARD_UNCOMMON_CARDS: Record<string, CardDefinition> = {
  [GUARD_UNCOMMON_ATK_1.id]: GUARD_UNCOMMON_ATK_1,
  [GUARD_UNCOMMON_ATK_2.id]: GUARD_UNCOMMON_ATK_2,
  [GUARD_UNCOMMON_ATK_3.id]: GUARD_UNCOMMON_ATK_3,
  [GUARD_UNCOMMON_ATK_4.id]: GUARD_UNCOMMON_ATK_4,
  [GUARD_UNCOMMON_ATK_5.id]: GUARD_UNCOMMON_ATK_5,
  [GUARD_UNCOMMON_ATK_6.id]: GUARD_UNCOMMON_ATK_6,
  [GUARD_UNCOMMON_ATK_7.id]: GUARD_UNCOMMON_ATK_7,
  [GUARD_UNCOMMON_SKILL_1.id]: GUARD_UNCOMMON_SKILL_1,
  [GUARD_UNCOMMON_SKILL_2.id]: GUARD_UNCOMMON_SKILL_2,
  [GUARD_UNCOMMON_SKILL_3.id]: GUARD_UNCOMMON_SKILL_3,
  [GUARD_UNCOMMON_SKILL_4.id]: GUARD_UNCOMMON_SKILL_4,
  [GUARD_UNCOMMON_SKILL_5.id]: GUARD_UNCOMMON_SKILL_5,
  [GUARD_UNCOMMON_SKILL_6.id]: GUARD_UNCOMMON_SKILL_6,
  [GUARD_UNCOMMON_SKILL_7.id]: GUARD_UNCOMMON_SKILL_7,
  [GUARD_UNCOMMON_SKILL_8.id]: GUARD_UNCOMMON_SKILL_8,
  [GUARD_UNCOMMON_POWER_1.id]: GUARD_UNCOMMON_POWER_1,
  [GUARD_UNCOMMON_POWER_2.id]: GUARD_UNCOMMON_POWER_2,
  [GUARD_UNCOMMON_POWER_3.id]: GUARD_UNCOMMON_POWER_3,
  [GUARD_UNCOMMON_POWER_4.id]: GUARD_UNCOMMON_POWER_4,
  [GUARD_UNCOMMON_POWER_5.id]: GUARD_UNCOMMON_POWER_5,
  [GUARD_UNCOMMON_POWER_6.id]: GUARD_UNCOMMON_POWER_6,
  [GUARD_UNCOMMON_POWER_7.id]: GUARD_UNCOMMON_POWER_7,
};
