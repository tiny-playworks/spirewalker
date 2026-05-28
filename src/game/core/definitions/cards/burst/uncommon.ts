import type { CardDefinition } from '../../../model/card';
import {
  STATUS_MOMENTUM,
  STATUS_PRIMED_BREAK,
  STATUS_STRENGTH,
} from '../../statuses';

/**
 * 爆发流派 - 稀有卡牌 (25张)
 * 主题：连势消耗、破势爆发、能量兑现、高伤害连击
 */

// ==================== 攻击牌 ====================

export const BURST_UNCOMMON_ATK_1: CardDefinition = {
  id: 'burst_uncommon_atk_1',
  name: '破势猛击',
  description: '造成 18 点伤害。消耗所有连势，每层造成额外 4 点伤害。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'all', baseDamage: 18, damagePerStack: 4 } }],
  archetype: 'burst',
  tags: ['damage', 'momentum'],
};

export const BURST_UNCOMMON_ATK_2: CardDefinition = {
  id: 'burst_uncommon_atk_2',
  name: '连势连击',
  description: '造成 6 点伤害三次。消耗 3 层连势。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'fixed', consumeValue: 3, baseDamage: 6, damagePerStack: 0, hits: 3 } }],
  archetype: 'burst',
  tags: ['damage', 'multi_hit', 'momentum'],
};

export const BURST_UNCOMMON_ATK_3: CardDefinition = {
  id: 'burst_uncommon_atk_3',
  name: '破势重击',
  description: '造成 22 点伤害。消耗 5 层连势。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'fixed', consumeValue: 5, baseDamage: 22, damagePerStack: 0 } }],
  archetype: 'burst',
  tags: ['damage', 'momentum'],
};

export const BURST_UNCOMMON_ATK_4: CardDefinition = {
  id: 'burst_uncommon_atk_4',
  name: '爆发连击',
  description: '造成 8 点伤害两次。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'repeat', times: 2, effects: [{ type: 'damage', value: 8, target: 'selected' }] }],
  archetype: 'burst',
  tags: ['damage', 'multi_hit'],
};

export const BURST_UNCOMMON_ATK_5: CardDefinition = {
  id: 'burst_uncommon_atk_5',
  name: '破势打击',
  description: '造成 12 点伤害。若你有破势预热，造成额外 8 点伤害。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'conditional_damage', params: { baseDamage: 12, bonusDamage: 8, condition: 'has_primed_break' } }],
  archetype: 'burst',
  tags: ['damage', 'primed_break'],
};

export const BURST_UNCOMMON_ATK_6: CardDefinition = {
  id: 'burst_uncommon_atk_6',
  name: '连势猛击',
  description: '造成 16 点伤害。消耗 4 层连势。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'fixed', consumeValue: 4, baseDamage: 16, damagePerStack: 0 } }],
  archetype: 'burst',
  tags: ['damage', 'momentum'],
};

export const BURST_UNCOMMON_ATK_7: CardDefinition = {
  id: 'burst_uncommon_atk_7',
  name: '爆发猛击',
  description: '造成 25 点伤害。',
  type: 'attack',
  rarity: 'uncommon',
  cost: 3,
  target: 'single_enemy',
  effects: [{ type: 'damage', value: 25, target: 'selected' }],
  archetype: 'burst',
  tags: ['damage'],
};

// ==================== 技能牌 ====================

export const BURST_UNCOMMON_SKILL_1: CardDefinition = {
  id: 'burst_uncommon_skill_1',
  name: '破势强化',
  description: '获得 3 层破势预热。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 3, target: 'self' }],
  archetype: 'burst',
  tags: ['primed_break', 'setup'],
};

export const BURST_UNCOMMON_SKILL_2: CardDefinition = {
  id: 'burst_uncommon_skill_2',
  name: '连势强化',
  description: '获得 5 层连势。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 5, target: 'self' }],
  archetype: 'burst',
  tags: ['momentum', 'setup'],
};

export const BURST_UNCOMMON_SKILL_3: CardDefinition = {
  id: 'burst_uncommon_skill_3',
  name: '破势过牌',
  description: '抽 3 张牌。消耗 3 层连势。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_draw', params: { consumeMode: 'fixed', consumeValue: 3, baseDraw: 3, drawPerStack: 0 } }],
  archetype: 'burst',
  tags: ['draw', 'momentum'],
};

export const BURST_UNCOMMON_SKILL_4: CardDefinition = {
  id: 'burst_uncommon_skill_4',
  name: '连势能量',
  description: '获得 2 点能量。消耗 2 层连势。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 0,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_to_energy', params: { consumeValue: 2, energyGain: 2 } }],
  archetype: 'burst',
  tags: ['energy', 'momentum'],
};

export const BURST_UNCOMMON_SKILL_5: CardDefinition = {
  id: 'burst_uncommon_skill_5',
  name: '破势防御',
  description: '获得 8 点格挡。消耗 2 层连势。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 1,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_block', params: { consumeValue: 2, baseBlock: 8 } }],
  archetype: 'burst',
  tags: ['block', 'momentum'],
};

export const BURST_UNCOMMON_SKILL_6: CardDefinition = {
  id: 'burst_uncommon_skill_6',
  name: '势能抽取',
  description: '抽 4 张牌。消耗 2 层连势。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_draw', params: { consumeMode: 'fixed', consumeValue: 2, baseDraw: 4, drawPerStack: 0 } }],
  archetype: 'burst',
  tags: ['draw', 'momentum'],
};

export const BURST_UNCOMMON_SKILL_7: CardDefinition = {
  id: 'burst_uncommon_skill_7',
  name: '破势能量',
  description: '获得 3 点能量。消耗 4 层连势。',
  type: 'skill',
  rarity: 'uncommon',
  cost: 0,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_to_energy', params: { consumeValue: 4, energyGain: 3 } }],
  archetype: 'burst',
  tags: ['energy', 'momentum'],
};

// ==================== 能力牌 ====================

export const BURST_UNCOMMON_POWER_1: CardDefinition = {
  id: 'burst_uncommon_power_1',
  name: '破势精通',
  description: '获得 4 层破势预热。',
  type: 'power',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 4, target: 'self' }],
  archetype: 'burst',
  tags: ['primed_break', 'setup'],
};

export const BURST_UNCOMMON_POWER_2: CardDefinition = {
  id: 'burst_uncommon_power_2',
  name: '连势精通',
  description: '获得 4 层连势。',
  type: 'power',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 4, target: 'self' }],
  archetype: 'burst',
  tags: ['momentum', 'setup'],
};

export const BURST_UNCOMMON_POWER_3: CardDefinition = {
  id: 'burst_uncommon_power_3',
  name: '力量激发',
  description: '获得 2 层力量。',
  type: 'power',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 2, target: 'self' }],
  archetype: 'burst',
  tags: ['strength', 'scaling'],
};

export const BURST_UNCOMMON_POWER_4: CardDefinition = {
  id: 'burst_uncommon_power_4',
  name: '爆发精通',
  description: '获得 3 层破势预热和 3 层连势。',
  type: 'power',
  rarity: 'uncommon',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 3, target: 'self' },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 3, target: 'self' },
  ],
  archetype: 'burst',
  tags: ['primed_break', 'momentum'],
};

// 导出所有爆发稀有卡牌
export const BURST_UNCOMMON_CARDS: Record<string, CardDefinition> = {
  [BURST_UNCOMMON_ATK_1.id]: BURST_UNCOMMON_ATK_1,
  [BURST_UNCOMMON_ATK_2.id]: BURST_UNCOMMON_ATK_2,
  [BURST_UNCOMMON_ATK_3.id]: BURST_UNCOMMON_ATK_3,
  [BURST_UNCOMMON_ATK_4.id]: BURST_UNCOMMON_ATK_4,
  [BURST_UNCOMMON_ATK_5.id]: BURST_UNCOMMON_ATK_5,
  [BURST_UNCOMMON_ATK_6.id]: BURST_UNCOMMON_ATK_6,
  [BURST_UNCOMMON_ATK_7.id]: BURST_UNCOMMON_ATK_7,
  [BURST_UNCOMMON_SKILL_1.id]: BURST_UNCOMMON_SKILL_1,
  [BURST_UNCOMMON_SKILL_2.id]: BURST_UNCOMMON_SKILL_2,
  [BURST_UNCOMMON_SKILL_3.id]: BURST_UNCOMMON_SKILL_3,
  [BURST_UNCOMMON_SKILL_4.id]: BURST_UNCOMMON_SKILL_4,
  [BURST_UNCOMMON_SKILL_5.id]: BURST_UNCOMMON_SKILL_5,
  [BURST_UNCOMMON_SKILL_6.id]: BURST_UNCOMMON_SKILL_6,
  [BURST_UNCOMMON_SKILL_7.id]: BURST_UNCOMMON_SKILL_7,
  [BURST_UNCOMMON_POWER_1.id]: BURST_UNCOMMON_POWER_1,
  [BURST_UNCOMMON_POWER_2.id]: BURST_UNCOMMON_POWER_2,
  [BURST_UNCOMMON_POWER_3.id]: BURST_UNCOMMON_POWER_3,
  [BURST_UNCOMMON_POWER_4.id]: BURST_UNCOMMON_POWER_4,
};
