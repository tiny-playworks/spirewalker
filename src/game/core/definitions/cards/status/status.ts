import type { CardDefinition } from '../../../model/card';

/**
 * 状态牌 (15张)
 * 主题：无法打出、临时卡牌、敌人注入
 */

export const STATUS_WOUND: CardDefinition = {
  id: 'status_wound',
  name: '创伤',
  description: '无法打出。回合结束时消耗。',
  type: 'status',
  rarity: 'common',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['status', 'unplayable', 'exhaust'],
};

export const STATUS_DAZED: CardDefinition = {
  id: 'status_dazed',
  name: '眩晕',
  description: '无法打出。回合结束时消耗。',
  type: 'status',
  rarity: 'common',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['status', 'unplayable', 'exhaust'],
};

export const STATUS_SLIMED: CardDefinition = {
  id: 'status_slimed',
  name: '粘液',
  description: '无法打出。回合结束时消耗。',
  type: 'status',
  rarity: 'common',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['status', 'unplayable', 'exhaust'],
};

export const STATUS_BURN: CardDefinition = {
  id: 'status_burn',
  name: '灼烧',
  description: '无法打出。回合结束时失去 2 点生命。',
  type: 'status',
  rarity: 'common',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['status', 'unplayable', 'hp_drain'],
};

export const STATUS_SHOCK: CardDefinition = {
  id: 'status_shock',
  name: '电击',
  description: '无法打出。回合结束时对所有敌人造成 2 点伤害。',
  type: 'status',
  rarity: 'common',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['status', 'unplayable', 'damage'],
};

export const STATUS_FROZEN: CardDefinition = {
  id: 'status_frozen',
  name: '冰冻',
  description: '无法打出。回合结束时获得 3 点格挡。',
  type: 'status',
  rarity: 'common',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['status', 'unplayable', 'block'],
};

export const STATUS_POISON: CardDefinition = {
  id: 'status_poison',
  name: '中毒',
  description: '无法打出。回合结束时失去等同于层数的生命。',
  type: 'status',
  rarity: 'common',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['status', 'unplayable', 'hp_drain'],
};

export const STATUS_BLEED: CardDefinition = {
  id: 'status_bleed',
  name: '流血',
  description: '无法打出。每打出一张攻击牌失去 2 点生命。',
  type: 'status',
  rarity: 'common',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['status', 'unplayable', 'hp_drain'],
};

export const STATUS_CURSE: CardDefinition = {
  id: 'status_curse',
  name: '诅咒',
  description: '无法打出。回合结束时获得 1 层易伤。',
  type: 'status',
  rarity: 'common',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['status', 'unplayable', 'debuff'],
};

export const STATUS_REGRET: CardDefinition = {
  id: 'status_regret',
  name: '悔恨',
  description: '无法打出。回合结束时失去等同于手牌数的生命。',
  type: 'status',
  rarity: 'uncommon',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['status', 'unplayable', 'hp_drain'],
};

export const STATUS_SHAME_2: CardDefinition = {
  id: 'status_shame_2',
  name: '耻辱',
  description: '无法打出。回合结束时获得 1 层虚弱。',
  type: 'status',
  rarity: 'uncommon',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['status', 'unplayable', 'debuff'],
};

export const STATUS_DOUBT_2: CardDefinition = {
  id: 'status_doubt_2',
  name: '疑虑',
  description: '无法打出。回合结束时获得 1 层易伤。',
  type: 'status',
  rarity: 'uncommon',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['status', 'unplayable', 'debuff'],
};

export const STATUS_PARALYSIS_2: CardDefinition = {
  id: 'status_paralysis_2',
  name: '麻痹',
  description: '无法打出。回合结束时随机弃 1 张牌。',
  type: 'status',
  rarity: 'uncommon',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['status', 'unplayable', 'discard'],
};

export const STATUS_CONFUSION_2: CardDefinition = {
  id: 'status_confusion_2',
  name: '混乱',
  description: '无法打出。所有卡牌费用随机增加 0-1 点。',
  type: 'status',
  rarity: 'uncommon',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['status', 'unplayable', 'cost'],
};

export const STATUS_DECAY_2: CardDefinition = {
  id: 'status_decay_2',
  name: '腐朽',
  description: '无法打出。回合结束时失去 2 点生命。',
  type: 'status',
  rarity: 'uncommon',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['status', 'unplayable', 'hp_drain'],
};

// 导出所有状态牌
export const STATUS_CARDS: Record<string, CardDefinition> = {
  [STATUS_WOUND.id]: STATUS_WOUND,
  [STATUS_DAZED.id]: STATUS_DAZED,
  [STATUS_SLIMED.id]: STATUS_SLIMED,
  [STATUS_BURN.id]: STATUS_BURN,
  [STATUS_SHOCK.id]: STATUS_SHOCK,
  [STATUS_FROZEN.id]: STATUS_FROZEN,
  [STATUS_POISON.id]: STATUS_POISON,
  [STATUS_BLEED.id]: STATUS_BLEED,
  [STATUS_CURSE.id]: STATUS_CURSE,
  [STATUS_REGRET.id]: STATUS_REGRET,
  [STATUS_SHAME_2.id]: STATUS_SHAME_2,
  [STATUS_DOUBT_2.id]: STATUS_DOUBT_2,
  [STATUS_PARALYSIS_2.id]: STATUS_PARALYSIS_2,
  [STATUS_CONFUSION_2.id]: STATUS_CONFUSION_2,
  [STATUS_DECAY_2.id]: STATUS_DECAY_2,
};
