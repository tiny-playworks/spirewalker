import type { CardDefinition } from '../../../model/card';

/**
 * 诅咒牌 (20张)
 * 主题：无法打出、负面效果、卡组污染
 */

export const CURSE_BLOOD_MARK: CardDefinition = {
  id: 'curse_blood_mark',
  name: '血印',
  description: '无法打出。每回合开始时失去 2 点生命。',
  type: 'curse',
  rarity: 'common',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'hp_drain'],
};

export const CURSE_DARKNESS: CardDefinition = {
  id: 'curse_darkness',
  name: '黑暗',
  description: '无法打出。每回合结束时失去 1 点生命。',
  type: 'curse',
  rarity: 'common',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'hp_drain'],
};

export const CURSE_WEAKNESS: CardDefinition = {
  id: 'curse_weakness',
  name: '虚弱',
  description: '无法打出。你的攻击伤害降低 25%。',
  type: 'curse',
  rarity: 'common',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'debuff'],
};

export const CURSE_VULNERABILITY: CardDefinition = {
  id: 'curse_vulnerability',
  name: '易伤',
  description: '无法打出。你受到的伤害增加 25%。',
  type: 'curse',
  rarity: 'common',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'debuff'],
};

export const CURSE_PARALYSIS: CardDefinition = {
  id: 'curse_paralysis',
  name: '麻痹',
  description: '无法打出。每回合随机弃 1 张牌。',
  type: 'curse',
  rarity: 'common',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'discard'],
};

export const CURSE_CONFUSION: CardDefinition = {
  id: 'curse_confusion',
  name: '混乱',
  description: '无法打出。所有卡牌费用随机增加 0-2 点。',
  type: 'curse',
  rarity: 'uncommon',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'cost'],
};

export const CURSE_DECAY: CardDefinition = {
  id: 'curse_decay',
  name: '腐朽',
  description: '无法打出。每回合结束时失去 3 点生命。',
  type: 'curse',
  rarity: 'uncommon',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'hp_drain'],
};

export const CURSE_DOUBT: CardDefinition = {
  id: 'curse_doubt',
  name: '疑虑',
  description: '无法打出。每回合结束时获得 1 层易伤。',
  type: 'curse',
  rarity: 'uncommon',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'debuff'],
};

export const CURSE_SHAME: CardDefinition = {
  id: 'curse_shame',
  name: '耻辱',
  description: '无法打出。每回合结束时获得 1 层虚弱。',
  type: 'curse',
  rarity: 'uncommon',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'debuff'],
};

export const CURSE_GREED: CardDefinition = {
  id: 'curse_greed',
  name: '贪婪',
  description: '无法打出。每场战斗开始时失去 5 点生命。',
  type: 'curse',
  rarity: 'uncommon',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'hp_drain'],
};

export const CURSE_WRATH: CardDefinition = {
  id: 'curse_wrath',
  name: '愤怒',
  description: '无法打出。你的攻击伤害增加 50%，但你受到的伤害增加 50%。',
  type: 'curse',
  rarity: 'rare',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'buff', 'debuff'],
};

export const CURSE_ENVY: CardDefinition = {
  id: 'curse_envy',
  name: '嫉妒',
  description: '无法打出。敌人每回合获得 1 层力量。',
  type: 'curse',
  rarity: 'rare',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'enemy_buff'],
};

export const CURSE_SLOTH: CardDefinition = {
  id: 'curse_sloth',
  name: '懒惰',
  description: '无法打出。每回合少抽 1 张牌。',
  type: 'curse',
  rarity: 'rare',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'draw'],
};

export const CURSE_LUST: CardDefinition = {
  id: 'curse_lust',
  name: '欲望',
  description: '无法打出。每场战斗结束时失去 3 点最大生命。',
  type: 'curse',
  rarity: 'rare',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'max_hp'],
};

export const CURSE_GLUTTONY: CardDefinition = {
  id: 'curse_gluttony',
  name: '暴食',
  description: '无法打出。每场战斗结束时失去所有金币的 50%。',
  type: 'curse',
  rarity: 'rare',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'gold'],
};

export const CURSE_PRIDE: CardDefinition = {
  id: 'curse_pride',
  name: '傲慢',
  description: '无法打出。你的卡牌费用增加 1 点。',
  type: 'curse',
  rarity: 'rare',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'cost'],
};

export const CURSE_SILENCE: CardDefinition = {
  id: 'curse_silence',
  name: '沉默',
  description: '无法打出。每回合结束时消耗 1 张随机手牌。',
  type: 'curse',
  rarity: 'rare',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'exhaust'],
};

export const CURSE_FORGETFULNESS: CardDefinition = {
  id: 'curse_forgetfulness',
  name: '遗忘',
  description: '无法打出。每回合开始时消耗 1 张随机抽牌堆中的牌。',
  type: 'curse',
  rarity: 'rare',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'exhaust'],
};

export const CURSE_BURDEN: CardDefinition = {
  id: 'curse_burden',
  name: '重担',
  description: '无法打出。你的格挡值减少 25%。',
  type: 'curse',
  rarity: 'rare',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'block'],
};

export const CURSE_DREAD: CardDefinition = {
  id: 'curse_dread',
  name: '恐惧',
  description: '无法打出。每场战斗开始时获得 2 层虚弱和 2 层易伤。',
  type: 'curse',
  rarity: 'rare',
  cost: -1,
  target: 'none',
  effects: [],
  archetype: 'neutral',
  tags: ['curse', 'debuff'],
};

// 导出所有诅咒牌
export const CURSE_CARDS: Record<string, CardDefinition> = {
  [CURSE_BLOOD_MARK.id]: CURSE_BLOOD_MARK,
  [CURSE_DARKNESS.id]: CURSE_DARKNESS,
  [CURSE_WEAKNESS.id]: CURSE_WEAKNESS,
  [CURSE_VULNERABILITY.id]: CURSE_VULNERABILITY,
  [CURSE_PARALYSIS.id]: CURSE_PARALYSIS,
  [CURSE_CONFUSION.id]: CURSE_CONFUSION,
  [CURSE_DECAY.id]: CURSE_DECAY,
  [CURSE_DOUBT.id]: CURSE_DOUBT,
  [CURSE_SHAME.id]: CURSE_SHAME,
  [CURSE_GREED.id]: CURSE_GREED,
  [CURSE_WRATH.id]: CURSE_WRATH,
  [CURSE_ENVY.id]: CURSE_ENVY,
  [CURSE_SLOTH.id]: CURSE_SLOTH,
  [CURSE_LUST.id]: CURSE_LUST,
  [CURSE_GLUTTONY.id]: CURSE_GLUTTONY,
  [CURSE_PRIDE.id]: CURSE_PRIDE,
  [CURSE_SILENCE.id]: CURSE_SILENCE,
  [CURSE_FORGETFULNESS.id]: CURSE_FORGETFULNESS,
  [CURSE_BURDEN.id]: CURSE_BURDEN,
  [CURSE_DREAD.id]: CURSE_DREAD,
};
