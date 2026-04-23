import type { EffectDefinition } from '../model/card';

/** 战斗内可使用的一次性药水（definitionId 存在 meta.potions 中） */
export interface PotionDefinition {
  id: string;
  name: string;
  description: string;
  effects: EffectDefinition[];
}

export const HEALING_DEW: PotionDefinition = {
  id: 'healing_dew',
  name: '露水滴',
  description: '回复 10 点生命。',
  effects: [{ type: 'heal', value: 10, target: 'self' }],
};

export const STILLWATER_TONIC: PotionDefinition = {
  id: 'stillwater_tonic',
  name: '定拍药',
  description: '获得 2 层连势。获得 1 层稳势。',
  effects: [
    { type: 'apply_status', statusId: 'momentum', stacks: 2, target: 'self' },
    { type: 'apply_status', statusId: 'steady_guard', stacks: 1, target: 'self' },
  ],
};

export const FLASH_POWDER: PotionDefinition = {
  id: 'flash_powder',
  name: '裂拍药',
  description: '获得 2 层连势。获得 1 层破势预热。',
  effects: [
    { type: 'apply_status', statusId: 'momentum', stacks: 2, target: 'self' },
    { type: 'apply_status', statusId: 'primed_break', stacks: 1, target: 'self' },
  ],
};

export const POTION_DEFINITIONS: Record<string, PotionDefinition> = {
  [HEALING_DEW.id]: HEALING_DEW,
  [STILLWATER_TONIC.id]: STILLWATER_TONIC,
  [FLASH_POWDER.id]: FLASH_POWDER,
};

/** 与杀戮尖塔类似，背包栏位上限 */
export const MAX_POTIONS = 5;
