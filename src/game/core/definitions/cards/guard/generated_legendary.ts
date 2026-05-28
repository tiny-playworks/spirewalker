import type { CardDefinition } from '../../../model/card';
import { STATUS_METALLICIZE } from '../../statuses';

/**
 * 守势流派 - 传说卡牌 (5张)
 * 独特机制组合，非"大号 rare"：
 * - 双资源转化（金属化→格挡+力量、稳势→伤害+格挡）
 * - 复合条件触发
 * - 跨系统联动
 */

export const GUARD_LEGENDARY_1: CardDefinition = {
  id: 'guard_legendary_1',
  name: '不动明王',
  description: '获得 10 点格挡。若你本回合未消耗连势，额外获得 10 点格挡。',
  type: 'skill',
  rarity: 'legendary',
  cost: 2,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_conditional_block', params: { baseBlock: 10, blockIfNoConsume: 10 } }],
  archetype: 'guard',
  tags: ['block', 'momentum', 'conditional'],
};

export const GUARD_LEGENDARY_2: CardDefinition = {
  id: 'guard_legendary_2',
  name: '铁壁圣殿',
  description: '获得 8 层金属化。',
  type: 'power',
  rarity: 'legendary',
  cost: 4,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 8, target: 'self' }],
  archetype: 'guard',
  tags: ['metallicize', 'scaling', 'engine'],
};

export const GUARD_LEGENDARY_3: CardDefinition = {
  id: 'guard_legendary_3',
  name: '定海神针',
  description: '消耗所有稳势，每层造成 6 点伤害。消耗所有连势，每层造成 4 点伤害。',
  type: 'attack',
  rarity: 'legendary',
  cost: 3,
  target: 'single_enemy',
  effects: [
    { type: 'custom', scriptId: 'steady_guard_burst_damage', params: { baseDamage: 0, damagePerStack: 6 } },
    { type: 'custom', scriptId: 'momentum_burst_damage', params: { consumeMode: 'all', baseDamage: 0, damagePerStack: 4 } },
  ],
  archetype: 'guard',
  tags: ['steady_guard', 'momentum', 'multi_resource'],
};

export const GUARD_LEGENDARY_4: CardDefinition = {
  id: 'guard_legendary_4',
  name: '钢铁洪流',
  description: '造成等同于你格挡值 2.5 倍的伤害。消耗。',
  type: 'attack',
  rarity: 'legendary',
  cost: 3,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'block_to_damage', params: { multiplier: 2.5 } }],
  exhaustOnPlay: true,
  archetype: 'guard',
  tags: ['damage', 'block_scaling', 'exhaust'],
};

export const GUARD_LEGENDARY_5: CardDefinition = {
  id: 'guard_legendary_5',
  name: '圣盾连击',
  description: '造成 5 点伤害并获得 5 点格挡，重复 4 次。',
  type: 'attack',
  rarity: 'legendary',
  cost: 4,
  target: 'single_enemy',
  effects: [{ type: 'custom', scriptId: 'multi_hit_with_block', params: { hits: 4, damagePerHit: 5, blockPerHit: 5 } }],
  archetype: 'guard',
  tags: ['damage', 'block', 'multi_hit'],
};

export const GUARD_LEGENDARY_6: CardDefinition = {
  id: 'guard_legendary_6',
  name: '永恒壁垒',
  description: '获得 15 点格挡。若你本回合未消耗连势，额外获得 5 点格挡。',
  type: 'skill',
  rarity: 'legendary',
  cost: 2,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_conditional_block', params: { baseBlock: 15, blockIfNoConsume: 5 } }],
  archetype: 'guard',
  tags: ['block', 'metallicize', 'scaling'],
};

export const GUARD_LEGENDARY_CARDS: Record<string, CardDefinition> = {
  [GUARD_LEGENDARY_1.id]: GUARD_LEGENDARY_1,
  [GUARD_LEGENDARY_2.id]: GUARD_LEGENDARY_2,
  [GUARD_LEGENDARY_3.id]: GUARD_LEGENDARY_3,
  [GUARD_LEGENDARY_4.id]: GUARD_LEGENDARY_4,
  [GUARD_LEGENDARY_5.id]: GUARD_LEGENDARY_5,
  [GUARD_LEGENDARY_6.id]: GUARD_LEGENDARY_6,
};
