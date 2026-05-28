import type { CardDefinition } from '../../../model/card';
import {
  STATUS_MOMENTUM,
  STATUS_METALLICIZE,
  STATUS_STRENGTH,
} from '../../statuses';

/**
 * 混合流派 - 稀有卡牌 (20张)
 * 主题：攻防一体、条件爆发、灵活转换、桥梁牌
 */

// ==================== 攻击牌 ====================

export const MIXED_UNCOMMON_ATK_1: CardDefinition = {
  id: 'mixed_uncommon_atk_1',
  name: '攻防一体',
  description: '造成 10 点伤害，获得 6 点格挡。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 10, target: 'selected' },
    { type: 'block', value: 6, target: 'self' },
  ],
  archetype: 'mixed',
  tags: ['damage', 'block'],
};

export const MIXED_UNCOMMON_ATK_2: CardDefinition = {
  id: 'mixed_uncommon_atk_2',
  name: '条件爆发',
  description: '造成 8 点伤害。若你有格挡，造成额外 8 点伤害。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'conditional_damage', params: { baseDamage: 8, bonusDamage: 8, condition: 'has_block' } }],
  archetype: 'mixed',
  tags: ['damage', 'conditional'],
};

export const MIXED_UNCOMMON_ATK_3: CardDefinition = {
  id: 'mixed_uncommon_atk_3',
  name: '灵活连击',
  description: '造成 5 点伤害两次，获得 4 点格挡。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [
    { type: 'repeat', times: 2, effects: [{ type: 'damage', value: 5, target: 'selected' }] },
    { type: 'block', value: 4, target: 'self' },
  ],
  archetype: 'mixed',
  tags: ['damage', 'multi_hit', 'block'],
};

export const MIXED_UNCOMMON_ATK_4: CardDefinition = {
  id: 'mixed_uncommon_atk_4',
  name: '连势打击',
  description: '造成 6 点伤害。消耗 2 层连势，造成额外 6 点伤害。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'fixed', consumeValue: 2, baseDamage: 6, damagePerStack: 0, bonusDamage: 6 } }],
  archetype: 'mixed',
  tags: ['damage', 'momentum'],
};

export const MIXED_UNCOMMON_ATK_5: CardDefinition = {
  id: 'mixed_uncommon_atk_5',
  name: '金属化打击',
  description: '造成 8 点伤害，获得等同于你金属化层数的格挡。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'metallicize_to_block', params: { baseDamage: 8 } }],
  archetype: 'mixed',
  tags: ['damage', 'metallicize'],
};

// ==================== 技能牌 ====================

export const MIXED_UNCOMMON_SKILL_1: CardDefinition = {
  id: 'mixed_uncommon_skill_1',
  name: '灵活防御',
  description: '获得 8 点格挡，造成 3 点伤害。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'block', value: 8, target: 'self' },
    { type: 'damage', value: 3, target: 'all_enemies' },
  ],
  archetype: 'mixed',
  tags: ['block', 'damage'],
};

export const MIXED_UNCOMMON_SKILL_2: CardDefinition = {
  id: 'mixed_uncommon_skill_2',
  name: '连势防御',
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
  tags: ['block', 'momentum'],
};

export const MIXED_UNCOMMON_SKILL_3: CardDefinition = {
  id: 'mixed_uncommon_skill_3',
  name: '灵活过牌',
  description: '抽 3 张牌，获得 4 点格挡。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'draw', value: 3 },
    { type: 'block', value: 4, target: 'self' },
  ],
  archetype: 'mixed',
  tags: ['draw', 'block'],
};

export const MIXED_UNCOMMON_SKILL_4: CardDefinition = {
  id: 'mixed_uncommon_skill_4',
  name: '连势过牌',
  description: '抽 3 张牌。消耗 2 层连势。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 1,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_draw', params: { consumeMode: 'fixed', consumeValue: 2, baseDraw: 3, drawPerStack: 0 } }],
  archetype: 'mixed',
  tags: ['draw', 'momentum'],
};

export const MIXED_UNCOMMON_SKILL_5: CardDefinition = {
  id: 'mixed_uncommon_skill_5',
  name: '灵活强化',
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
  tags: ['strength', 'metallicize'],
};

// ==================== 能力牌 ====================

export const MIXED_UNCOMMON_POWER_1: CardDefinition = {
  id: 'mixed_uncommon_power_1',
  name: '连势储备',
  description: '获得 4 层连势。',
  type: 'power',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 4, target: 'self' }],
  archetype: 'mixed',
  tags: ['momentum', 'setup'],
};

export const MIXED_UNCOMMON_POWER_2: CardDefinition = {
  id: 'mixed_uncommon_power_2',
  name: '金属化强化',
  description: '获得 4 层金属化。',
  type: 'power',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 4, target: 'self' }],
  archetype: 'mixed',
  tags: ['metallicize', 'scaling'],
};

export const MIXED_UNCOMMON_POWER_3: CardDefinition = {
  id: 'mixed_uncommon_power_3',
  name: '力量强化',
  description: '获得 2 层力量。',
  type: 'power',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 2, target: 'self' }],
  archetype: 'mixed',
  tags: ['strength', 'scaling'],
};

export const MIXED_UNCOMMON_POWER_4: CardDefinition = {
  id: 'mixed_uncommon_power_4',
  name: '灵活精通',
  description: '获得 2 层力量和 2 层金属化。',
  type: 'power',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 2, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 2, target: 'self' },
  ],
  archetype: 'mixed',
  tags: ['strength', 'metallicize'],
};

// 导出所有混合稀有卡牌
export const MIXED_UNCOMMON_CARDS: Record<string, CardDefinition> = {
  [MIXED_UNCOMMON_ATK_1.id]: MIXED_UNCOMMON_ATK_1,
  [MIXED_UNCOMMON_ATK_2.id]: MIXED_UNCOMMON_ATK_2,
  [MIXED_UNCOMMON_ATK_3.id]: MIXED_UNCOMMON_ATK_3,
  [MIXED_UNCOMMON_ATK_4.id]: MIXED_UNCOMMON_ATK_4,
  [MIXED_UNCOMMON_ATK_5.id]: MIXED_UNCOMMON_ATK_5,
  [MIXED_UNCOMMON_SKILL_1.id]: MIXED_UNCOMMON_SKILL_1,
  [MIXED_UNCOMMON_SKILL_2.id]: MIXED_UNCOMMON_SKILL_2,
  [MIXED_UNCOMMON_SKILL_3.id]: MIXED_UNCOMMON_SKILL_3,
  [MIXED_UNCOMMON_SKILL_4.id]: MIXED_UNCOMMON_SKILL_4,
  [MIXED_UNCOMMON_SKILL_5.id]: MIXED_UNCOMMON_SKILL_5,
  [MIXED_UNCOMMON_POWER_1.id]: MIXED_UNCOMMON_POWER_1,
  [MIXED_UNCOMMON_POWER_2.id]: MIXED_UNCOMMON_POWER_2,
  [MIXED_UNCOMMON_POWER_3.id]: MIXED_UNCOMMON_POWER_3,
  [MIXED_UNCOMMON_POWER_4.id]: MIXED_UNCOMMON_POWER_4,
};
