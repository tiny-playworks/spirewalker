import type { CardDefinition } from '../../../model/card';
import {
  STATUS_MOMENTUM,
  STATUS_METALLICIZE,
  STATUS_STRENGTH,
} from '../../statuses';

/**
 * 混合流派 - 史诗卡牌 (10张)
 * 主题：终极攻防、条件爆发、灵活转换、桥梁牌
 */

// ==================== 攻击牌 ====================

export const MIXED_RARE_ATK_1: CardDefinition = {
  id: 'mixed_rare_atk_1',
  name: '攻防一体',
  description: '造成 15 点伤害，获得 10 点格挡。',
  type: 'attack',
  rarity: 'rare',
  cost: 3,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 15, target: 'selected' },
    { type: 'block', value: 10, target: 'self' },
  ],
  archetype: 'mixed',
  tags: ['damage', 'block'],
};

export const MIXED_RARE_ATK_2: CardDefinition = {
  id: 'mixed_rare_atk_2',
  name: '条件爆发',
  description: '造成 10 点伤害。若你有格挡，造成额外 15 点伤害。',
  type: 'attack',
  rarity: 'rare',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'conditional_damage', params: { baseDamage: 10, bonusDamage: 15, condition: 'has_block' } }],
  archetype: 'mixed',
  tags: ['damage', 'conditional'],
};

export const MIXED_RARE_ATK_3: CardDefinition = {
  id: 'mixed_rare_atk_3',
  name: '灵活连击',
  description: '造成 6 点伤害三次，获得 6 点格挡。',
  type: 'attack',
  rarity: 'rare',
  cost: 3,
  target: 'single_enemy',
  effects: [
    { type: 'repeat', times: 3, effects: [{ type: 'damage', value: 6, target: 'selected' }] },
    { type: 'block', value: 6, target: 'self' },
  ],
  archetype: 'mixed',
  tags: ['damage', 'multi_hit', 'block'],
};

export const MIXED_RARE_ATK_4: CardDefinition = {
  id: 'mixed_rare_atk_4',
  name: '连势打击',
  description: '造成 8 点伤害。消耗 3 层连势，造成额外 12 点伤害。',
  type: 'attack',
  rarity: 'rare',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'fixed', consumeValue: 3, baseDamage: 8, damagePerStack: 0, bonusDamage: 12 } }],
  archetype: 'mixed',
  tags: ['damage', 'momentum'],
};

// ==================== 技能牌 ====================

export const MIXED_RARE_SKILL_1: CardDefinition = {
  id: 'mixed_rare_skill_1',
  name: '灵活防御',
  description: '获得 12 点格挡，造成 5 点伤害。',
  type: 'skill',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [
    { type: 'block', value: 12, target: 'self' },
    { type: 'damage', value: 5, target: 'all_enemies' },
  ],
  archetype: 'mixed',
  tags: ['block', 'damage'],
};

export const MIXED_RARE_SKILL_2: CardDefinition = {
  id: 'mixed_rare_skill_2',
  name: '势能壁垒',
  description: '获得 10 点格挡，获得 5 层连势。',
  type: 'skill',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [
    { type: 'block', value: 10, target: 'self' },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 5, target: 'self' },
  ],
  archetype: 'mixed',
  tags: ['block', 'momentum'],
};

export const MIXED_RARE_SKILL_3: CardDefinition = {
  id: 'mixed_rare_skill_3',
  name: '灵活过牌',
  description: '抽 4 张牌，获得 6 点格挡。',
  type: 'skill',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [
    { type: 'draw', value: 4 },
    { type: 'block', value: 6, target: 'self' },
  ],
  archetype: 'mixed',
  tags: ['draw', 'block'],
};

// ==================== 能力牌 ====================

export const MIXED_RARE_POWER_1: CardDefinition = {
  id: 'mixed_rare_power_1',
  name: '连势大师',
  description: '获得 6 层连势。',
  type: 'power',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 6, target: 'self' }],
  archetype: 'mixed',
  tags: ['momentum', 'setup'],
};

export const MIXED_RARE_POWER_2: CardDefinition = {
  id: 'mixed_rare_power_2',
  name: '金属化精通',
  description: '获得 6 层金属化。',
  type: 'power',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 6, target: 'self' }],
  archetype: 'mixed',
  tags: ['metallicize', 'scaling'],
};

export const MIXED_RARE_POWER_3: CardDefinition = {
  id: 'mixed_rare_power_3',
  name: '力量领悟',
  description: '获得 3 层力量。',
  type: 'power',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 3, target: 'self' }],
  archetype: 'mixed',
  tags: ['strength', 'scaling'],
};

// 导出所有混合史诗卡牌
export const MIXED_RARE_CARDS: Record<string, CardDefinition> = {
  [MIXED_RARE_ATK_1.id]: MIXED_RARE_ATK_1,
  [MIXED_RARE_ATK_2.id]: MIXED_RARE_ATK_2,
  [MIXED_RARE_ATK_3.id]: MIXED_RARE_ATK_3,
  [MIXED_RARE_ATK_4.id]: MIXED_RARE_ATK_4,
  [MIXED_RARE_SKILL_1.id]: MIXED_RARE_SKILL_1,
  [MIXED_RARE_SKILL_2.id]: MIXED_RARE_SKILL_2,
  [MIXED_RARE_SKILL_3.id]: MIXED_RARE_SKILL_3,
  [MIXED_RARE_POWER_1.id]: MIXED_RARE_POWER_1,
  [MIXED_RARE_POWER_2.id]: MIXED_RARE_POWER_2,
  [MIXED_RARE_POWER_3.id]: MIXED_RARE_POWER_3,
};
