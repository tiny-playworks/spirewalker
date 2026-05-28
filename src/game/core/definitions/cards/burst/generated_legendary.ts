import type { CardDefinition } from '../../../model/card';

/**
 * 爆发流派 - 传说卡牌 (5张)
 * 独特机制组合，非"大号 rare"：
 * - 能量转化爆发
 * - 连势+破势预热双消耗
 * - 抽牌引擎
 * - 跨资源兑现
 */

export const BURST_LEGENDARY_1: CardDefinition = {
  id: 'burst_legendary_1',
  name: '能量湮灭',
  description: '消耗所有能量，每点造成 18 点伤害。',
  type: 'attack',
  rarity: 'legendary',
  cost: 0,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'energy_to_damage', params: { damagePerEnergy: 18 } }],
  archetype: 'burst',
  tags: ['damage', 'energy', 'burst'],
};

export const BURST_LEGENDARY_2: CardDefinition = {
  id: 'burst_legendary_2',
  name: '连势风暴',
  description: '消耗所有连势，每层造成 5 点伤害。消耗所有破势预热，每层造成 8 点伤害。',
  type: 'attack',
  rarity: 'legendary',
  cost: 3,
  target: 'single_enemy',
  effects: [
    { type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'all', baseDamage: 0, damagePerStack: 5 } },
    { type: 'custom', scriptId: 'primed_break_burst_damage', params: { baseDamage: 0, damagePerStack: 8 } },
  ],
  archetype: 'burst',
  tags: ['momentum', 'primed_break', 'multi_resource'],
};

export const BURST_LEGENDARY_3: CardDefinition = {
  id: 'burst_legendary_3',
  name: '破甲重击',
  description: '消耗 5 点格挡，造成 35 点伤害。消耗。',
  type: 'attack',
  rarity: 'legendary',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'consume_block_for_damage', params: { baseDamage: 5, blockCost: 5, bonusDamage: 30 } }],
  exhaustOnPlay: true,
  archetype: 'burst',
  tags: ['damage', 'block_consume', 'exhaust'],
};

export const BURST_LEGENDARY_4: CardDefinition = {
  id: 'burst_legendary_4',
  name: '破势洪流',
  description: '消耗所有破势预热，每层造成 6 点伤害并抽 1 张牌。',
  type: 'attack',
  rarity: 'legendary',
  cost: 3,
  target: 'single_enemy',
  effects: [
    { type: 'custom', scriptId: 'primed_break_burst_damage', params: { baseDamage: 0, damagePerStack: 6 } },
    { type: 'draw', value: 1 },
  ],
  archetype: 'burst',
  tags: ['primed_break', 'damage', 'draw'],
};

export const BURST_LEGENDARY_5: CardDefinition = {
  id: 'burst_legendary_5',
  name: '连势狂潮',
  description: '消耗所有连势，每层造成 3 点伤害并抽 1 张牌。获得 2 点能量。',
  type: 'attack',
  rarity: 'legendary',
  cost: 2,
  target: 'single_enemy',
  effects: [
    { type: 'custom', scriptId: 'momentum_burst_draw', params: { consumeMode: 'all', baseDraw: 0, drawPerStack: 1 } },
    { type: 'gain_energy', value: 2 },
  ],
  archetype: 'burst',
  tags: ['momentum', 'draw', 'energy'],
};

export const BURST_LEGENDARY_6: CardDefinition = {
  id: 'burst_legendary_6',
  name: '连锁爆破',
  description: '消耗所有连势，每层造成 5 点伤害，消耗后抽 1 张牌。',
  type: 'attack',
  rarity: 'legendary',
  cost: 3,
  target: 'single_enemy',
  effects: [
    { type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'all', baseDamage: 0, damagePerStack: 5 } },
    { type: 'custom', scriptId: 'momentum_burst_draw', params: { consumeMode: 'fixed', consumeValue: 0, baseDraw: 1, drawPerStack: 0 } },
  ],
  archetype: 'burst',
  tags: ['momentum', 'damage', 'draw'],
};

export const BURST_LEGENDARY_CARDS: Record<string, CardDefinition> = {
  [BURST_LEGENDARY_1.id]: BURST_LEGENDARY_1,
  [BURST_LEGENDARY_2.id]: BURST_LEGENDARY_2,
  [BURST_LEGENDARY_3.id]: BURST_LEGENDARY_3,
  [BURST_LEGENDARY_4.id]: BURST_LEGENDARY_4,
  [BURST_LEGENDARY_5.id]: BURST_LEGENDARY_5,
  [BURST_LEGENDARY_6.id]: BURST_LEGENDARY_6,
};
