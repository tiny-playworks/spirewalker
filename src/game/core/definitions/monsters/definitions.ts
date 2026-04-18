import { STATUS_MOMENTUM } from '../statuses';

/** 怪物 AI 种类（最小版：交替攻击；样板扩展：交替攻击与减状态） */
export type MonsterAiKind =
  | 'alternating_attack'
  | 'alternating_attack_reduce_status'
  | 'alternating_attack_punish_multi_play'
  | 'alternating_attack_block';

export interface MonsterAiConfig {
  kind: 'alternating_attack';
  /** alternating_attack：moveHistory.length 为偶数时取 [0]，奇数时取 [1] */
  damages: [number, number];
}

export interface AlternatingAttackReduceStatusAiConfig {
  kind: 'alternating_attack_reduce_status';
  /** 偶数回合攻击，奇数回合削减状态。 */
  attackDamage: number;
  statusId: string;
  reduceValue: number;
}

export interface AlternatingAttackPunishMultiPlayAiConfig {
  kind: 'alternating_attack_punish_multi_play';
  /** 偶数回合攻击，奇数回合检查玩家本回合出牌数，达标则加格挡。 */
  attackDamage: number;
  threshold: number;
  blockValue: number;
}

export interface AlternatingAttackBlockAiConfig {
  kind: 'alternating_attack_block';
  /** 偶数回合攻击，奇数回合获得格挡。 */
  attackDamage: number;
  blockValue: number;
}

export type MonsterAiDefinition =
  | MonsterAiConfig
  | AlternatingAttackReduceStatusAiConfig
  | AlternatingAttackPunishMultiPlayAiConfig
  | AlternatingAttackBlockAiConfig;

export interface MonsterDefinition {
  id: string;
  displayName: string;
  /** 无编队覆盖时的默认最大生命 */
  baseMaxHp: number;
  ai: MonsterAiDefinition;
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
    ai: {
      kind: 'alternating_attack_reduce_status',
      attackDamage: 8,
      statusId: STATUS_MOMENTUM,
      reduceValue: 3,
    },
  },
  slime_boss: {
    id: 'slime_boss',
    displayName: '黏液领主',
    baseMaxHp: 60,
    ai: { kind: 'alternating_attack', damages: [6, 9] },
  },
  slime_sapper: {
    id: 'slime_sapper',
    displayName: '渗蚀黏液',
    baseMaxHp: 34,
    ai: {
      kind: 'alternating_attack_reduce_status',
      attackDamage: 5,
      statusId: STATUS_MOMENTUM,
      reduceValue: 2,
    },
  },
  slime_guard: {
    id: 'slime_guard',
    displayName: '戒备黏液',
    baseMaxHp: 38,
    ai: {
      kind: 'alternating_attack_punish_multi_play',
      attackDamage: 5,
      threshold: 3,
      blockValue: 8,
    },
  },
  slime_shell: {
    id: 'slime_shell',
    displayName: '壳甲黏液',
    baseMaxHp: 42,
    ai: {
      kind: 'alternating_attack_block',
      attackDamage: 4,
      blockValue: 10,
    },
  },
};

export function getMonsterDefinition(monsterId: string): MonsterDefinition | undefined {
  return MONSTER_DEFINITIONS[monsterId];
}
