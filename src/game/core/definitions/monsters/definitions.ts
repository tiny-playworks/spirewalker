import {
  STATUS_MOMENTUM,
  STATUS_STRENGTH,
  STATUS_VULNERABLE,
  STATUS_WEAK,
} from '../statuses';
import type { MonsterIntent } from '../../model/battle';

export type MonsterAiScriptId =
  | 'cycle_attack'
  | 'cycle_attack_block'
  | 'cycle_attack_debuff'
  | 'momentum_break'
  | 'multi_play_punish'
  | 'boss_phase_shift';

export type MonsterAiKind = MonsterAiScriptId;

type IntentAttack = Extract<MonsterIntent, { type: 'attack' }>;
type IntentBlock = Extract<MonsterIntent, { type: 'block' }>;
type IntentBuff = Extract<MonsterIntent, { type: 'buff' }>;
type IntentDebuff = Extract<MonsterIntent, { type: 'debuff' }>;
type IntentReduceStatus = Extract<MonsterIntent, { type: 'reduce_status' }>;
type IntentPunish = Extract<MonsterIntent, { type: 'punish_multi_play' }>;
type IntentAttackBuff = Extract<MonsterIntent, { type: 'attack_buff' }>;

export type BossPhaseIntent =
  | IntentAttack
  | IntentBlock
  | IntentBuff
  | IntentDebuff
  | IntentReduceStatus
  | IntentPunish
  | IntentAttackBuff;

export type MonsterAiDefinition =
  | {
      scriptId: 'cycle_attack';
      params: { attacks: IntentAttack[] };
    }
  | {
      scriptId: 'cycle_attack_block';
      params: { attacks: IntentAttack[]; block: number };
    }
  | {
      scriptId: 'cycle_attack_debuff';
      params: { attacks: IntentAttack[]; statusId: string; value: number; mode: 'buff' | 'debuff' };
    }
  | {
      scriptId: 'momentum_break';
      params: { attack: number; reduceValue: number };
    }
  | {
      scriptId: 'multi_play_punish';
      params: { attack: number; threshold: number; block: number };
    }
  | {
      scriptId: 'boss_phase_shift';
      params: {
        threshold: number;
        phaseLabels: [string, string];
        phase1: BossPhaseIntent[];
        phase2: BossPhaseIntent[];
      };
    };

export type MonsterAiConfig = MonsterAiDefinition;

export interface MonsterDefinition {
  id: string;
  displayName: string;
  baseMaxHp: number;
  ai: MonsterAiDefinition;
}

function attack(value: number, hits?: number): IntentAttack {
  return hits ? { type: 'attack', value, hits } : { type: 'attack', value };
}

export const MONSTER_DEFINITIONS: Record<string, MonsterDefinition> = {
  slime: {
    id: 'slime',
    displayName: '黏液怪',
    baseMaxHp: 40,
    ai: { scriptId: 'cycle_attack', params: { attacks: [attack(6), attack(9)] } },
  },
  slime_sapper: {
    id: 'slime_sapper',
    displayName: '渗蚀黏液',
    baseMaxHp: 34,
    ai: {
      scriptId: 'momentum_break',
      params: { attack: 5, reduceValue: 2 },
    },
  },
  slime_guard: {
    id: 'slime_guard',
    displayName: '戒备黏液',
    baseMaxHp: 38,
    ai: {
      scriptId: 'multi_play_punish',
      params: { attack: 5, threshold: 3, block: 8 },
    },
  },
  slime_shell: {
    id: 'slime_shell',
    displayName: '壳甲黏液',
    baseMaxHp: 42,
    ai: {
      scriptId: 'cycle_attack_block',
      params: { attacks: [attack(4)], block: 10 },
    },
  },
  slime_elite: {
    id: 'slime_elite',
    displayName: '黏液精英',
    baseMaxHp: 56,
    ai: {
      scriptId: 'momentum_break',
      params: { attack: 8, reduceValue: 3 },
    },
  },
  slime_boss: {
    id: 'slime_boss',
    displayName: '黏液领主',
    baseMaxHp: 60,
    ai: {
      scriptId: 'boss_phase_shift',
      params: {
        threshold: 0.5,
        phaseLabels: ['蓄压', '沸腾'],
        phase1: [attack(7), { type: 'block', value: 12 }],
        phase2: [attack(10), attack(6, 2)],
      },
    },
  },
  slime_brute: {
    id: 'slime_brute',
    displayName: '重压黏液',
    baseMaxHp: 40,
    ai: { scriptId: 'cycle_attack', params: { attacks: [attack(8), attack(12)] } },
  },
  slime_hexer: {
    id: 'slime_hexer',
    displayName: '咒液术士',
    baseMaxHp: 42,
    ai: {
      scriptId: 'cycle_attack_debuff',
      params: { attacks: [attack(6), attack(8)], statusId: STATUS_WEAK, value: 2, mode: 'debuff' },
    },
  },
  slime_bulwark: {
    id: 'slime_bulwark',
    displayName: '壁壳黏液',
    baseMaxHp: 48,
    ai: {
      scriptId: 'cycle_attack_block',
      params: { attacks: [attack(5), attack(8)], block: 14 },
    },
  },
  slime_breaker: {
    id: 'slime_breaker',
    displayName: '断势黏液',
    baseMaxHp: 40,
    ai: {
      scriptId: 'momentum_break',
      params: { attack: 7, reduceValue: 3 },
    },
  },
  slime_taxer: {
    id: 'slime_taxer',
    displayName: '征收者',
    baseMaxHp: 68,
    ai: {
      scriptId: 'cycle_attack_debuff',
      params: { attacks: [attack(9), attack(11)], statusId: STATUS_VULNERABLE, value: 2, mode: 'debuff' },
    },
  },
  slime_counter_judge: {
    id: 'slime_counter_judge',
    displayName: '连段法官',
    baseMaxHp: 70,
    ai: {
      scriptId: 'multi_play_punish',
      params: { attack: 8, threshold: 2, block: 14 },
    },
  },
  slime_reaver: {
    id: 'slime_reaver',
    displayName: '裂压兽',
    baseMaxHp: 48,
    ai: { scriptId: 'cycle_attack', params: { attacks: [attack(10), attack(14)] } },
  },
  slime_exhauster: {
    id: 'slime_exhauster',
    displayName: '灰烬蛭',
    baseMaxHp: 46,
    ai: {
      scriptId: 'cycle_attack_debuff',
      params: { attacks: [attack(7), attack(10)], statusId: STATUS_WEAK, value: 3, mode: 'debuff' },
    },
  },
  slime_fortress: {
    id: 'slime_fortress',
    displayName: '堡垒之口',
    baseMaxHp: 54,
    ai: {
      scriptId: 'cycle_attack_block',
      params: { attacks: [attack(7), attack(9)], block: 18 },
    },
  },
  slime_jammer: {
    id: 'slime_jammer',
    displayName: '相位干扰器',
    baseMaxHp: 45,
    ai: {
      scriptId: 'multi_play_punish',
      params: { attack: 9, threshold: 2, block: 12 },
    },
  },
  slime_raider_elite: {
    id: 'slime_raider_elite',
    displayName: '起手掠夺者',
    baseMaxHp: 82,
    ai: {
      scriptId: 'cycle_attack_debuff',
      params: { attacks: [attack(11), attack(13)], statusId: STATUS_VULNERABLE, value: 2, mode: 'debuff' },
    },
  },
  slime_counter_final: {
    id: 'slime_counter_final',
    displayName: '构筑终审者',
    baseMaxHp: 84,
    ai: {
      scriptId: 'multi_play_punish',
      params: { attack: 10, threshold: 2, block: 18 },
    },
  },
  act1_boss_gate: {
    id: 'act1_boss_gate',
    displayName: '沼门领主',
    baseMaxHp: 108,
    ai: {
      scriptId: 'boss_phase_shift',
      params: {
        threshold: 0.5,
        phaseLabels: ['稳压', '涨潮'],
        phase1: [attack(8), { type: 'block', value: 12 }, attack(9)],
        phase2: [attack(12), { type: 'reduce_status', statusId: STATUS_MOMENTUM, value: 3 }, attack(7, 2)],
      },
    },
  },
  act2_boss_silence: {
    id: 'act2_boss_silence',
    displayName: '寂律审判官',
    baseMaxHp: 128,
    ai: {
      scriptId: 'boss_phase_shift',
      params: {
        threshold: 0.45,
        phaseLabels: ['审讯', '裁决'],
        phase1: [attack(10), { type: 'debuff', statusId: STATUS_WEAK, value: 2 }, { type: 'block', value: 16 }],
        phase2: [attack(13), { type: 'punish_multi_play', threshold: 2, block: 16 }, attack(8, 2)],
      },
    },
  },
  act3_boss_crown: {
    id: 'act3_boss_crown',
    displayName: '冠冕吞噬者',
    baseMaxHp: 152,
    ai: {
      scriptId: 'boss_phase_shift',
      params: {
        threshold: 0.4,
        phaseLabels: ['试锋', '终噬'],
        phase1: [attack(12), { type: 'buff', statusId: STATUS_STRENGTH, value: 2 }, attack(9, 2)],
        phase2: [attack(16), { type: 'reduce_status', statusId: STATUS_MOMENTUM, value: 4 }, { type: 'attack_buff', attack: 12, statusId: STATUS_STRENGTH, value: 1 }],
      },
    },
  },
};

export function getMonsterDefinition(monsterId: string): MonsterDefinition | undefined {
  return MONSTER_DEFINITIONS[monsterId];
}
