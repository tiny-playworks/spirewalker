import { STATUS_STRENGTH, STATUS_VULNERABLE } from '../statuses';
import type { CardDefinition } from '../../model/card';

export const STRIKE: CardDefinition = {
  id: 'strike',
  name: '打击',
  description: '造成 6 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  target: 'single_enemy',
  effects: [{ type: 'damage', value: 6, target: 'selected' }],
};

export const DEFEND: CardDefinition = {
  id: 'defend',
  name: '防御',
  description: '获得 5 点格挡。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'block', value: 5, target: 'self' }],
};

/** 施加易伤（本回合后结算用 modifyIncomingAttackDamage） */
export const BASH: CardDefinition = {
  id: 'bash',
  name: '重击',
  description: '造成 7 点伤害，施加 2 层易伤。',
  type: 'attack',
  rarity: 'common',
  cost: 2,
  target: 'single_enemy',
  effects: [
    { type: 'damage', value: 7, target: 'selected' },
    { type: 'apply_status', statusId: STATUS_VULNERABLE, stacks: 2, target: 'selected' },
  ],
};

export const FLEX: CardDefinition = {
  id: 'flex',
  name: '柔韧',
  description: '获得 2 点力量。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [{ type: 'apply_status', statusId: STATUS_STRENGTH, stacks: 2, target: 'self' }],
};

/** 全体攻击：拖到右侧战域或任意敌人上松手 */
export const CLEAVE: CardDefinition = {
  id: 'cleave',
  name: '顺劈',
  description: '对所有敌人造成 8 点伤害。',
  type: 'attack',
  rarity: 'common',
  cost: 2,
  target: 'all_enemies',
  effects: [{ type: 'damage', value: 8, target: 'all_enemies' }],
};

/** 本回合能量 +1（0 费技能） */
export const SURGE: CardDefinition = {
  id: 'surge',
  name: '涌能',
  description: '获得 1 点能量。',
  type: 'skill',
  rarity: 'common',
  cost: 0,
  target: 'none',
  effects: [{ type: 'gain_energy', value: 1 }],
};

/** 过牌（文档 EffectDefinition.draw） */
export const SKIM: CardDefinition = {
  id: 'skim',
  name: '扫视',
  description: '抽 2 张牌。',
  type: 'skill',
  rarity: 'common',
  cost: 1,
  target: 'none',
  effects: [{ type: 'draw', value: 2 }],
};

export const CARD_DEFINITIONS: Record<string, CardDefinition> = {
  [STRIKE.id]: STRIKE,
  [DEFEND.id]: DEFEND,
  [BASH.id]: BASH,
  [FLEX.id]: FLEX,
  [CLEAVE.id]: CLEAVE,
  [SURGE.id]: SURGE,
  [SKIM.id]: SKIM,
};
