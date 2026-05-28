import type { CardDefinition } from '../../../model/card';
import {
  STATUS_MOMENTUM,
  STATUS_PRIMED_BREAK,
  STATUS_STRENGTH,
} from '../../statuses';

/**
 * 爆发流派 - 史诗卡牌 (15张)
 * 主题：终极破势、连势爆发、能量兑现、高风险高收益
 */

// ==================== 攻击牌 ====================

export const BURST_RARE_ATK_1: CardDefinition = {
  id: 'burst_rare_atk_1',
  name: '破势终结',
  description: '造成 30 点伤害。消耗所有连势和破势预热，每层造成额外 5 点伤害。',
  type: 'attack',
  rarity: 'rare',
  cost: 4,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'all', baseDamage: 30, damagePerStack: 5, consumePrimedBreak: true } }],
  archetype: 'burst',
  tags: ['damage', 'momentum', 'primed_break'],
};

export const BURST_RARE_ATK_2: CardDefinition = {
  id: 'burst_rare_atk_2',
  name: '连势风暴',
  description: '造成 8 点伤害五次。消耗 5 层连势。',
  type: 'attack',
  rarity: 'rare',
  cost: 3,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'fixed', consumeValue: 5, baseDamage: 8, damagePerStack: 0, hits: 5 } }],
  archetype: 'burst',
  tags: ['damage', 'multi_hit', 'momentum'],
};

export const BURST_RARE_ATK_3: CardDefinition = {
  id: 'burst_rare_atk_3',
  name: '破势猛击',
  description: '造成 35 点伤害。消耗 8 层连势。',
  type: 'attack',
  rarity: 'rare',
  cost: 3,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'fixed', consumeValue: 8, baseDamage: 35, damagePerStack: 0 } }],
  archetype: 'burst',
  tags: ['damage', 'momentum'],
};

export const BURST_RARE_ATK_4: CardDefinition = {
  id: 'burst_rare_atk_4',
  name: '爆发终结',
  description: '造成 40 点伤害。消耗所有能量。',
  type: 'attack',
  rarity: 'rare',
  cost: 0,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'energy_to_damage', params: { damagePerEnergy: 10 } }],
  archetype: 'burst',
  tags: ['damage', 'energy'],
};

export const BURST_RARE_ATK_5: CardDefinition = {
  id: 'burst_rare_atk_5',
  name: '破势连击',
  description: '造成 10 点伤害三次。消耗 6 层连势。',
  type: 'attack',
  rarity: 'rare',
  cost: 3,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'fixed', consumeValue: 6, baseDamage: 10, damagePerStack: 0, hits: 3 } }],
  archetype: 'burst',
  tags: ['damage', 'multi_hit', 'momentum'],
};

// ==================== 技能牌 ====================

export const BURST_RARE_SKILL_1: CardDefinition = {
  id: 'burst_rare_skill_1',
  name: '破势大师',
  description: '获得 5 层破势预热。',
  type: 'skill',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 5, target: 'self' }],
  archetype: 'burst',
  tags: ['primed_break', 'setup'],
};

export const BURST_RARE_SKILL_2: CardDefinition = {
  id: 'burst_rare_skill_2',
  name: '连势大师',
  description: '获得 8 层连势。',
  type: 'skill',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 8, target: 'self' }],
  archetype: 'burst',
  tags: ['momentum', 'setup'],
};

export const BURST_RARE_SKILL_3: CardDefinition = {
  id: 'burst_rare_skill_3',
  name: '破势过牌',
  description: '抽 5 张牌。消耗 4 层连势。',
  type: 'skill',
  rarity: 'rare',
  cost: 2,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_draw', params: { consumeMode: 'fixed', consumeValue: 4, baseDraw: 5, drawPerStack: 0 } }],
  archetype: 'burst',
  tags: ['draw', 'momentum'],
};

export const BURST_RARE_SKILL_4: CardDefinition = {
  id: 'burst_rare_skill_4',
  name: '连势能量',
  description: '获得 4 点能量。消耗 5 层连势。',
  type: 'skill',
  rarity: 'rare',
  cost: 0,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_to_energy', params: { consumeValue: 5, energyGain: 4 } }],
  archetype: 'burst',
  tags: ['energy', 'momentum'],
};

export const BURST_RARE_SKILL_5: CardDefinition = {
  id: 'burst_rare_skill_5',
  name: '破势防御',
  description: '获得 15 点格挡。消耗 3 层连势。',
  type: 'skill',
  rarity: 'rare',
  cost: 2,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_block', params: { consumeValue: 3, baseBlock: 15 } }],
  archetype: 'burst',
  tags: ['block', 'momentum'],
};

// ==================== 能力牌 ====================

export const BURST_RARE_POWER_1: CardDefinition = {
  id: 'burst_rare_power_1',
  name: '破势精通',
  description: '获得 6 层破势预热。',
  type: 'power',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 6, target: 'self' }],
  archetype: 'burst',
  tags: ['primed_break', 'setup'],
};

export const BURST_RARE_POWER_2: CardDefinition = {
  id: 'burst_rare_power_2',
  name: '连势精通',
  description: '获得 6 层连势。',
  type: 'power',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 6, target: 'self' }],
  archetype: 'burst',
  tags: ['momentum', 'setup'],
};

export const BURST_RARE_POWER_3: CardDefinition = {
  id: 'burst_rare_power_3',
  name: '力量精通',
  description: '获得 3 层力量。',
  type: 'power',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 3, target: 'self' }],
  archetype: 'burst',
  tags: ['strength', 'scaling'],
};

export const BURST_RARE_POWER_4: CardDefinition = {
  id: 'burst_rare_power_4',
  name: '爆发大师',
  description: '获得 4 层破势预热和 4 层连势。',
  type: 'power',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 4, target: 'self' },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 4, target: 'self' },
  ],
  archetype: 'burst',
  tags: ['primed_break', 'momentum'],
};

export const BURST_RARE_POWER_5: CardDefinition = {
  id: 'burst_rare_power_5',
  name: '连势大师',
  description: '获得 5 层连势和 2 层力量。',
  type: 'power',
  rarity: 'rare',
  cost: 3,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 5, target: 'self' },
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 2, target: 'self' },
  ],
  archetype: 'burst',
  tags: ['momentum', 'strength'],
};

// 导出所有爆发史诗卡牌
export const BURST_RARE_CARDS: Record<string, CardDefinition> = {
  [BURST_RARE_ATK_1.id]: BURST_RARE_ATK_1,
  [BURST_RARE_ATK_2.id]: BURST_RARE_ATK_2,
  [BURST_RARE_ATK_3.id]: BURST_RARE_ATK_3,
  [BURST_RARE_ATK_4.id]: BURST_RARE_ATK_4,
  [BURST_RARE_ATK_5.id]: BURST_RARE_ATK_5,
  [BURST_RARE_SKILL_1.id]: BURST_RARE_SKILL_1,
  [BURST_RARE_SKILL_2.id]: BURST_RARE_SKILL_2,
  [BURST_RARE_SKILL_3.id]: BURST_RARE_SKILL_3,
  [BURST_RARE_SKILL_4.id]: BURST_RARE_SKILL_4,
  [BURST_RARE_SKILL_5.id]: BURST_RARE_SKILL_5,
  [BURST_RARE_POWER_1.id]: BURST_RARE_POWER_1,
  [BURST_RARE_POWER_2.id]: BURST_RARE_POWER_2,
  [BURST_RARE_POWER_3.id]: BURST_RARE_POWER_3,
  [BURST_RARE_POWER_4.id]: BURST_RARE_POWER_4,
  [BURST_RARE_POWER_5.id]: BURST_RARE_POWER_5,
};
