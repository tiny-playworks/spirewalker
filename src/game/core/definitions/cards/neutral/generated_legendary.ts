import type { CardDefinition } from '../../../model/card';
import { STATUS_MOMENTUM, STATUS_STEADY_GUARD } from '../../statuses';

/**
 * 中立流派 - 传说卡牌 (2张)
 * 通用强力效果，不限定流派。
 */

export const NEUTRAL_LEGENDARY_1: CardDefinition = {
  id: 'neutral_legendary_1',
  name: '命运之轮',
  description: '消耗所有连势。每消耗 1 层，抽 1 张牌。消耗。',
  type: 'skill',
  rarity: 'legendary',
  cost: 2,
  target: 'none',
  effects: [{ type: 'custom', scriptId: 'momentum_burst_draw', params: { consumeMode: 'all', baseDraw: 0, drawPerStack: 1 } }],
  exhaustOnPlay: true,
  archetype: 'neutral',
  tags: ['draw', 'block', 'exhaust'],
};

export const NEUTRAL_LEGENDARY_2: CardDefinition = {
  id: 'neutral_legendary_2',
  name: '虚空契约',
  description: '失去 6 点生命，获得 3 层连势和 3 层稳势。',
  type: 'skill',
  rarity: 'legendary',
  cost: 0,
  target: 'none',
  effects: [
    { type: 'damage', value: 6, target: 'self' },
    { type: 'apply_status', statusId: STATUS_MOMENTUM, stacks: 3, target: 'self' },
    { type: 'apply_status', statusId: STATUS_STEADY_GUARD, stacks: 3, target: 'self' },
  ],
  archetype: 'neutral',
  tags: ['momentum', 'steady_guard', 'risk'],
};

export const NEUTRAL_LEGENDARY_CARDS: Record<string, CardDefinition> = {
  [NEUTRAL_LEGENDARY_1.id]: NEUTRAL_LEGENDARY_1,
  [NEUTRAL_LEGENDARY_2.id]: NEUTRAL_LEGENDARY_2,
};
