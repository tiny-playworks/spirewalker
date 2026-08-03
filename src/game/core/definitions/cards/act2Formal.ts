import type { CardDefinition } from '../../model/card';
import {
  STATUS_METALLICIZE,
  STATUS_MOMENTUM,
  STATUS_PRIMED_BREAK,
  STATUS_STEADY_GUARD,
} from '../statuses';

/** Act 2 正式奖励牌；批量生成卡牌不进入首局奖励链路。 */
export const ACT2_FORMAL_CARDS: Record<string, CardDefinition> = {
  a2_guard_iron_bastion: {
    id: 'a2_guard_iron_bastion',
    name: '铸铁壁垒',
    description: '获得 6 点格挡，获得 1 层金属化。',
    type: 'skill',
    rarity: 'uncommon',
    cost: 1,
    target: 'none',
    effects: [
      { type: 'block', value: 6, target: 'self' },
      { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 1, target: 'self' },
    ],
    archetype: 'guard',
    chapter: 2,
    tags: ['block', 'metallicize'],
  },

  a2_guard_reinforced_edge: {
    id: 'a2_guard_reinforced_edge',
    name: '砺锋守势',
    description: '造成 7 点伤害，获得 3 点格挡。',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    target: 'single_enemy',
    effects: [
      { type: 'damage', value: 7, target: 'selected' },
      { type: 'block', value: 3, target: 'self' },
    ],
    archetype: 'guard',
    chapter: 2,
    tags: ['damage', 'block'],
  },

  a2_guard_steel_ritual: {
    id: 'a2_guard_steel_ritual',
    name: '钢纹仪式',
    description: '获得 5 点格挡，获得 1 层金属化。',
    type: 'skill',
    rarity: 'uncommon',
    cost: 1,
    target: 'none',
    effects: [
      { type: 'block', value: 5, target: 'self' },
      { type: 'apply_status', statusId: STATUS_METALLICIZE, stacks: 1, target: 'self' },
    ],
    archetype: 'guard',
    chapter: 2,
    tags: ['block', 'metallicize'],
  },

  a2_guard_anchor_line: {
    id: 'a2_guard_anchor_line',
    name: '锚线反击',
    description: '造成 6 点伤害，获得 3 点格挡，获得 1 层稳势。',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    target: 'single_enemy',
    effects: [
      { type: 'damage', value: 6, target: 'selected' },
      { type: 'block', value: 3, target: 'self' },
      { type: 'apply_status', statusId: STATUS_STEADY_GUARD, stacks: 1, target: 'self' },
    ],
    archetype: 'guard',
    chapter: 2,
    tags: ['damage', 'block', 'steady_guard'],
  },

  a2_burst_rupture: {
    id: 'a2_burst_rupture',
    name: '裂势斩',
    description: '造成 12 点伤害。消耗 2 层连势。',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'fixed', consumeValue: 2, baseDamage: 12, damagePerStack: 0 },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'momentum'],
  },

  a2_burst_triple_cut: {
    id: 'a2_burst_triple_cut',
    name: '三段破空',
    description: '造成 4 点伤害三次。',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    target: 'single_enemy',
    effects: [
      {
        type: 'repeat',
        times: 3,
        effects: [{ type: 'damage', value: 4, target: 'selected' }],
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'multi_hit'],
  },

  a2_burst_overdrive: {
    id: 'a2_burst_overdrive',
    name: '过载裂击',
    description: '造成 8 点伤害，消耗至多 1 层连势，每层额外造成 5 点伤害。',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    target: 'single_enemy',
    effects: [
      {
        type: 'custom',
        scriptId: 'momentum_burst_damage',
        params: { consumeMode: 'fixed', consumeValue: 1, baseDamage: 8, damagePerStack: 5 },
      },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'momentum'],
  },

  a2_burst_rebound: {
    id: 'a2_burst_rebound',
    name: '回响三连',
    description: '造成 6 点伤害两次，获得 1 层破势预热。',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    target: 'single_enemy',
    effects: [
      {
        type: 'repeat',
        times: 2,
        effects: [{ type: 'damage', value: 6, target: 'selected' }],
      },
      { type: 'apply_status', statusId: STATUS_PRIMED_BREAK, stacks: 1, target: 'self' },
    ],
    archetype: 'burst',
    chapter: 2,
    tags: ['damage', 'multi_hit', 'primed_break'],
  },

  a2_mixed_flow_guard: {
    id: 'a2_mixed_flow_guard',
    name: '流转护刃',
    description: '造成 5 点伤害，获得 4 点格挡，获得 1 层连势。',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    target: 'single_enemy',
    effects: [
      { type: 'damage', value: 5, target: 'selected' },
      { type: 'block', value: 4, target: 'self' },
      { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 1, target: 'self' },
    ],
    archetype: 'mixed',
    chapter: 2,
    tags: ['damage', 'block', 'momentum'],
  },

  a2_mixed_balance: {
    id: 'a2_mixed_balance',
    name: '均衡回响',
    description: '获得 5 点格挡，抽 1 张牌。',
    type: 'skill',
    rarity: 'uncommon',
    cost: 1,
    target: 'none',
    effects: [
      { type: 'block', value: 5, target: 'self' },
      { type: 'draw', value: 1 },
    ],
    archetype: 'mixed',
    chapter: 2,
    tags: ['block', 'draw'],
  },

  a2_mixed_guarded_draw: {
    id: 'a2_mixed_guarded_draw',
    name: '回身整备',
    description: '获得 4 点格挡，抽 1 张牌，获得 1 层连势。',
    type: 'skill',
    rarity: 'uncommon',
    cost: 1,
    target: 'none',
    effects: [
      { type: 'block', value: 4, target: 'self' },
      { type: 'draw', value: 1 },
      { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 1, target: 'self' },
    ],
    archetype: 'mixed',
    chapter: 2,
    tags: ['block', 'draw', 'momentum'],
  },

  a2_mixed_relay_strike: {
    id: 'a2_mixed_relay_strike',
    name: '接势回斩',
    description: '造成 6 点伤害，获得 3 点格挡，获得 1 层连势。',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    target: 'single_enemy',
    effects: [
      { type: 'damage', value: 6, target: 'selected' },
      { type: 'block', value: 3, target: 'self' },
      { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 1, target: 'self' },
    ],
    archetype: 'mixed',
    chapter: 2,
    tags: ['damage', 'block', 'momentum'],
  },
};
