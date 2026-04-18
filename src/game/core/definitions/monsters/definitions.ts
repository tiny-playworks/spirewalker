/** 怪物 AI 种类（最小版：仅交替伤害） */
export type MonsterAiKind = 'alternating_attack';

export interface MonsterAiConfig {
  kind: MonsterAiKind;
  /** alternating_attack：moveHistory.length 为偶数时取 [0]，奇数时取 [1] */
  damages: [number, number];
}

export interface MonsterDefinition {
  id: string;
  displayName: string;
  /** 无编队覆盖时的默认最大生命 */
  baseMaxHp: number;
  ai: MonsterAiConfig;
}

export const MONSTER_DEFINITIONS: Record<string, MonsterDefinition> = {
  slime: {
    id: 'slime',
    displayName: '黏液怪',
    baseMaxHp: 40,
    ai: { kind: 'alternating_attack', damages: [6, 9] },
  },
  slime_elite: {
    id: 'slime_elite',
    displayName: '黏液精英',
    baseMaxHp: 48,
    ai: { kind: 'alternating_attack', damages: [6, 9] },
  },
  slime_boss: {
    id: 'slime_boss',
    displayName: '黏液领主',
    baseMaxHp: 60,
    ai: { kind: 'alternating_attack', damages: [6, 9] },
  },
};

export function getMonsterDefinition(monsterId: string): MonsterDefinition | undefined {
  return MONSTER_DEFINITIONS[monsterId];
}
