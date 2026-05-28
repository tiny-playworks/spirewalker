import type { CardDefinition } from '../../../model/card';
import { STATUS_MOMENTUM, STATUS_METALLICIZE, STATUS_STRENGTH } from '../../statuses';

/**
 * 混合流派 - 传说卡牌 (5张)
 * 独特机制组合，非"大号 rare"：
 * - 连势→能量转化
 * - 金属化→伤害转化
 * - 双属性条件爆发
 * - 复合兑现窗口
 */

export const MIXED_LEGENDARY_1: CardDefinition = {
  id: 'mixed_legendary_1',
  name: '连势转化',
  description: '消耗 3 层连势，获得 3 点能量。',
  type: 'skill',
  rarity: 'legendary',
  cost: 0,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_to_energy', params: { consumeValue: 3, energyGain: 3 } }],
  archetype: 'mixed',
  tags: ['momentum', 'energy', 'conversion'],
};

export const MIXED_LEGENDARY_2: CardDefinition = {
  id: 'mixed_legendary_2',
  name: '金属风暴',
  description: '造成等同于你金属化层数 2 倍的伤害，然后获得等同于金属化层数的格挡。',
  type: 'attack',
  rarity: 'legendary',
  cost: 3,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'metallicize_to_block', params: { baseDamage: 0 } }],
  archetype: 'mixed',
  tags: ['metallicize', 'damage', 'block'],
};

export const MIXED_LEGENDARY_3: CardDefinition = {
  id: 'mixed_legendary_3',
  name: '攻守兼备',
  description: '造成 8 点伤害。若你有格挡，额外造成 15 点伤害。',
  type: 'attack',
  rarity: 'legendary',
  cost: 2,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'conditional_damage', params: { baseDamage: 8, bonusDamage: 15, condition: 'has_block' } }],
  archetype: 'mixed',
  tags: ['damage', 'conditional', 'block'],
};

export const MIXED_LEGENDARY_4: CardDefinition = {
  id: 'mixed_legendary_4',
  name: '双势合一',
  description: '获得 3 层连势和 3 层金属化。',
  type: 'skill',
  rarity: 'legendary',
  cost: 2,
  target: 'none',
  effects: [
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 3, target: 'self' },
    { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 3, target: 'self' },
  ],
  archetype: 'mixed',
  tags: ['momentum', 'metallicize', 'setup'],
};

export const MIXED_LEGENDARY_5: CardDefinition = {
  id: 'mixed_legendary_5',
  name: '势能爆发',
  description: '消耗所有连势，每层造成 4 点伤害。获得 2 层力量。',
  type: 'attack',
  rarity: 'legendary',
  cost: 3,
  target: 'single_enemy',
  effects: [
    { type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'all', baseDamage: 0, damagePerStack: 4 } },
    { type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 2, target: 'self' },
  ],
  archetype: 'mixed',
  tags: ['momentum', 'damage', 'strength'],
};

export const MIXED_LEGENDARY_6: CardDefinition = {
  id: 'mixed_legendary_6',
  name: '双生风暴',
  description: '造成 8 点伤害并获得 8 点格挡，重复 2 次。消耗。',
  type: 'attack',
  rarity: 'legendary',
  cost: 3,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'multi_hit_with_block', params: { hits: 2, damagePerHit: 8, blockPerHit: 8 } }],
  exhaustOnPlay: true,
  archetype: 'mixed',
  tags: ['damage', 'block', 'multi_hit', 'exhaust'],
};

export const MIXED_LEGENDARY_CARDS: Record<string, CardDefinition> = {
  [MIXED_LEGENDARY_1.id]: MIXED_LEGENDARY_1,
  [MIXED_LEGENDARY_2.id]: MIXED_LEGENDARY_2,
  [MIXED_LEGENDARY_3.id]: MIXED_LEGENDARY_3,
  [MIXED_LEGENDARY_4.id]: MIXED_LEGENDARY_4,
  [MIXED_LEGENDARY_5.id]: MIXED_LEGENDARY_5,
  [MIXED_LEGENDARY_6.id]: MIXED_LEGENDARY_6,
};
