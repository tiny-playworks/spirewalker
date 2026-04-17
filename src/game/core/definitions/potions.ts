/** 战斗内可使用的一次性药水（definitionId 存在 meta.potions 中） */
export interface PotionDefinition {
  id: string;
  name: string;
  description: string;
  /** 回复生命（战斗内作用于玩家单位） */
  healAmount: number;
}

export const HEALING_DEW: PotionDefinition = {
  id: 'healing_dew',
  name: '露水滴',
  description: '回复 10 点生命。',
  healAmount: 10,
};

export const POTION_DEFINITIONS: Record<string, PotionDefinition> = {
  [HEALING_DEW.id]: HEALING_DEW,
};

/** 与杀戮尖塔类似，背包栏位上限 */
export const MAX_POTIONS = 5;
