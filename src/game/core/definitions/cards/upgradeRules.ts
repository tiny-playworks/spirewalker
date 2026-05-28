/**
 * 卡牌升级规则表与运行态 helper。
 *
 * 设计取舍：
 * - masterDeck 保持为 `string[]`，升级表现为「新的 id」：`strike` -> `strike+` -> `strike++`。
 * - 升级规则在模块初始化阶段从基础 `CardDefinition` 派生升级版 `CardDefinition`，
 *   并塞入同一个 `CARD_DEFINITIONS` 表；所有消费方（战斗、商店、奖励、UI）
 *   按原有的 `definitionId` 读取即可。
 * - `CardInstance.upgraded` 在战斗时由 `definitionId.endsWith('+')` 判定，保留旧字段。
 */

import { CARD_DEFINITIONS } from './starter';
import type { CardDefinition, EffectDefinition } from '../../model/card';
import { GENERATED_UPGRADE_RULES } from './generated_upgrade_rules';

export type UpgradeLevel = 0 | 1 | 2;

export const UPGRADE_SUFFIX_BY_LEVEL: Record<UpgradeLevel, '' | '+' | '++'> = {
  0: '',
  1: '+',
  2: '++',
};

/**
 * 单次升级对一条效果的结构化修改。
 * - `path` 仅用于 `custom` 脚本：按 `params.xxx` 定位字段
 */
export type EffectPatch =
  | { effectIndex: number; kind: 'damage' | 'block' | 'heal' | 'draw' | 'gain_energy' | 'stacks'; delta: number }
  | { effectIndex: number; kind: 'cost'; delta: number }
  | { effectIndex: number; kind: 'custom_param'; paramKey: string; delta: number };

export interface CardUpgradeLevelRule {
  nameSuffix: '' | '+' | '++';
  descriptionPatch: string;
  costDelta?: number;
  /** 对 `effects` 结构化加成；不支持的效果会被忽略（例如空效果的污染牌） */
  patches?: EffectPatch[];
  /** 可选：完全替换 description（用于 `++` 加入新分支的情况） */
  descriptionOverride?: string;
  /** 可选：完全替换 effects（用于 `++` 加入新效果分支） */
  effectsOverride?: EffectDefinition[];
}

export interface CardUpgradeRule {
  baseId: string;
  levels: Partial<Record<1 | 2, CardUpgradeLevelRule>>;
}

/**
 * 说明：
 * - 数值微调默认走 `patches`，保持现有 effects 结构
 * - `++` 里若增加「新分支效果」才使用 `effectsOverride`
 * - 污染牌 (junk_*) 无升级
 */
export const CARD_UPGRADE_RULES: Record<string, CardUpgradeRule> = {
  strike: {
    baseId: 'strike',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '造成 9 点伤害。',
        patches: [{ effectIndex: 0, kind: 'damage', delta: 3 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '造成 11 点伤害。',
        patches: [{ effectIndex: 0, kind: 'damage', delta: 5 }],
      },
    },
  },
  defend: {
    baseId: 'defend',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '获得 8 点格挡。',
        patches: [{ effectIndex: 0, kind: 'block', delta: 3 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '获得 10 点格挡。',
        patches: [{ effectIndex: 0, kind: 'block', delta: 5 }],
      },
    },
  },
  bash: {
    baseId: 'bash',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '造成 10 点伤害，施加 2 层易伤。',
        patches: [{ effectIndex: 0, kind: 'damage', delta: 3 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '造成 10 点伤害，施加 3 层易伤。',
        patches: [
          { effectIndex: 0, kind: 'damage', delta: 3 },
          { effectIndex: 1, kind: 'stacks', delta: 1 },
        ],
      },
    },
  },
  flex: {
    baseId: 'flex',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 3 点力量。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 4 点力量。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  cleave: {
    baseId: 'cleave',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '对所有敌人造成 11 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 3 }] },
      2: { nameSuffix: '++', descriptionPatch: '对所有敌人造成 13 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 5 }] },
    },
  },
  surge: {
    baseId: 'surge',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 1 点能量并抽 1 张牌。', effectsOverride: [
        { type: 'gain_energy', value: 1 },
        { type: 'draw', value: 1 },
      ] },
      2: { nameSuffix: '++', descriptionPatch: '获得 2 点能量并抽 1 张牌。', effectsOverride: [
        { type: 'gain_energy', value: 2 },
        { type: 'draw', value: 1 },
      ] },
    },
  },
  skim: {
    baseId: 'skim',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '抽 3 张牌。', patches: [{ effectIndex: 0, kind: 'draw', delta: 1 }] },
      2: {
        nameSuffix: '++',
        descriptionPatch: '抽 3 张牌，获得 1 点能量。',
        effectsOverride: [
          { type: 'draw', value: 3 },
          { type: 'gain_energy', value: 1 },
        ],
      },
    },
  },
  momentum: {
    baseId: 'momentum',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 3 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 4 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  tempo_guard: {
    baseId: 'tempo_guard',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '获得 5 点格挡，并获得 2 层连势。',
        patches: [{ effectIndex: 0, kind: 'block', delta: 2 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '获得 5 点格挡，并获得 3 层连势。',
        patches: [
          { effectIndex: 0, kind: 'block', delta: 2 },
          { effectIndex: 1, kind: 'stacks', delta: 1 },
        ],
      },
    },
  },
  prime_rhythm: {
    baseId: 'prime_rhythm',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '获得 3 层连势，抽 1 张牌。',
        patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '获得 3 层连势，抽 2 张牌。',
        patches: [
          { effectIndex: 0, kind: 'stacks', delta: 1 },
          { effectIndex: 1, kind: 'draw', delta: 1 },
        ],
      },
    },
  },
  brace_rhythm: {
    baseId: 'brace_rhythm',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '获得 7 点格挡，并获得 2 层连势。',
        patches: [{ effectIndex: 0, kind: 'block', delta: 2 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '获得 8 点格挡，并获得 3 层连势。',
        patches: [
          { effectIndex: 0, kind: 'block', delta: 3 },
          { effectIndex: 1, kind: 'stacks', delta: 1 },
        ],
      },
    },
  },
  burst_strike: {
    baseId: 'burst_strike',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '造成 6 点伤害，并消耗全部连势，每层额外造成 3 点伤害。',
        patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '造成 6 点伤害，并消耗全部连势，每层额外造成 4 点伤害。',
        patches: [
          { effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 },
          { effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 },
        ],
      },
    },
  },
  snap_strike: {
    baseId: 'snap_strike',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '造成 7 点伤害，并消耗至多 2 层连势，每层额外造成 4 点伤害。',
        patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '造成 7 点伤害，并消耗至多 2 层连势，每层额外造成 5 点伤害。',
        patches: [
          { effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 },
          { effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 },
        ],
      },
    },
  },
  cash_flow: {
    baseId: 'cash_flow',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '抽 1 张牌，并消耗全部连势，每层额外抽 1 张，并获得 1 点能量。',
        effectsOverride: [
          {
            type: 'custom',
            scriptId: 'momentum_burst_draw',
            params: { consumeMode: 'all', baseDraw: 1, drawPerStack: 1 },
          },
          { type: 'gain_energy', value: 1 },
        ],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '抽 2 张牌，并消耗全部连势，每层额外抽 1 张，并获得 1 点能量。',
        effectsOverride: [
          {
            type: 'custom',
            scriptId: 'momentum_burst_draw',
            params: { consumeMode: 'all', baseDraw: 2, drawPerStack: 1 },
          },
          { type: 'gain_energy', value: 1 },
        ],
      },
    },
  },
  release_flow: {
    baseId: 'release_flow',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '抽 2 张牌，并消耗至多 2 层连势，每层额外抽 1 张。',
        patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDraw', delta: 1 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '抽 2 张牌，并消耗至多 2 层连势，每层额外抽 2 张。',
        patches: [
          { effectIndex: 0, kind: 'custom_param', paramKey: 'baseDraw', delta: 1 },
          { effectIndex: 0, kind: 'custom_param', paramKey: 'drawPerStack', delta: 1 },
        ],
      },
    },
  },
  steady_step: {
    baseId: 'steady_step',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '获得 8 点格挡，抽 1 张牌。',
        patches: [{ effectIndex: 0, kind: 'block', delta: 2 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '获得 8 点格挡，抽 2 张牌。',
        patches: [
          { effectIndex: 0, kind: 'block', delta: 2 },
          { effectIndex: 1, kind: 'draw', delta: 1 },
        ],
      },
    },
  },
  recenter: {
    baseId: 'recenter',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '抽 2 张牌，获得 1 点能量。',
        patches: [{ effectIndex: 0, kind: 'draw', delta: 1 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '抽 2 张牌，获得 2 点能量。',
        patches: [
          { effectIndex: 0, kind: 'draw', delta: 1 },
          { effectIndex: 1, kind: 'gain_energy', delta: 1 },
        ],
      },
    },
  },
  patch_breath: {
    baseId: 'patch_breath',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '回复 6 点生命，获得 5 点格挡。',
        patches: [
          { effectIndex: 0, kind: 'heal', delta: 2 },
          { effectIndex: 1, kind: 'block', delta: 1 },
        ],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '回复 8 点生命，获得 6 点格挡。',
        patches: [
          { effectIndex: 0, kind: 'heal', delta: 4 },
          { effectIndex: 1, kind: 'block', delta: 2 },
        ],
      },
    },
  },
  second_wind: {
    baseId: 'second_wind',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '获得 7 点格挡，获得 1 点能量。',
        patches: [{ effectIndex: 0, kind: 'block', delta: 2 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '获得 8 点格挡，获得 2 点能量。',
        patches: [
          { effectIndex: 0, kind: 'block', delta: 3 },
          { effectIndex: 1, kind: 'gain_energy', delta: 1 },
        ],
      },
    },
  },
  soft_step: {
    baseId: 'soft_step',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '获得 5 点格挡，并获得 1 层连势。',
        patches: [{ effectIndex: 0, kind: 'block', delta: 2 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '获得 5 点格挡，并获得 2 层连势。',
        patches: [
          { effectIndex: 0, kind: 'block', delta: 2 },
          { effectIndex: 1, kind: 'stacks', delta: 1 },
        ],
      },
    },
  },
  anchored_breath: {
    baseId: 'anchored_breath',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '获得 7 点格挡，并获得 1 层金属化与 1 层稳势。',
        patches: [{ effectIndex: 0, kind: 'block', delta: 2 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '获得 8 点格挡，并获得 1 层金属化与 2 层稳势。',
        patches: [
          { effectIndex: 0, kind: 'block', delta: 3 },
          { effectIndex: 2, kind: 'stacks', delta: 1 },
        ],
      },
    },
  },
  held_breath: {
    baseId: 'held_breath',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '获得 8 点格挡。获得 1 层稳势。',
        patches: [{ effectIndex: 0, kind: 'block', delta: 2 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '获得 9 点格挡。获得 2 层稳势。',
        patches: [
          { effectIndex: 0, kind: 'block', delta: 3 },
          { effectIndex: 1, kind: 'stacks', delta: 1 },
        ],
      },
    },
  },
  patient_cut: {
    baseId: 'patient_cut',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '造成 8 点伤害。获得等同当前连势层数的格挡，不消耗连势。',
        patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '造成 8 点伤害。获得等同当前连势层数两倍的格挡，不消耗连势。',
        patches: [
          { effectIndex: 0, kind: 'damage', delta: 2 },
          { effectIndex: 1, kind: 'custom_param', paramKey: 'blockPerStack', delta: 1 },
        ],
      },
    },
  },
  anchor_slash: {
    baseId: 'anchor_slash',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '造成 8 点伤害，获得 5 点格挡，并获得 1 层稳势。',
        patches: [
          { effectIndex: 0, kind: 'damage', delta: 2 },
          { effectIndex: 1, kind: 'block', delta: 1 },
        ],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '造成 8 点伤害，获得 6 点格挡，并获得 2 层稳势。',
        patches: [
          { effectIndex: 0, kind: 'damage', delta: 2 },
          { effectIndex: 1, kind: 'block', delta: 2 },
          { effectIndex: 2, kind: 'stacks', delta: 1 },
        ],
      },
    },
  },
  stable_mind: {
    baseId: 'stable_mind',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '获得 9 点格挡。若本回合未主动消耗连势，再抽 1 张牌并获得 1 层连势。',
        patches: [{ effectIndex: 0, kind: 'block', delta: 2 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '获得 10 点格挡。若本回合未主动消耗连势，再抽 2 张牌并获得 2 层连势。',
        patches: [
          { effectIndex: 0, kind: 'block', delta: 3 },
          { effectIndex: 1, kind: 'custom_param', paramKey: 'drawIfNoMomentumConsume', delta: 1 },
          { effectIndex: 1, kind: 'custom_param', paramKey: 'momentumIfNoMomentumConsume', delta: 1 },
        ],
      },
    },
  },
  guard_strike: {
    baseId: 'guard_strike',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '造成 8 点伤害，获得 5 点格挡。',
        patches: [
          { effectIndex: 0, kind: 'damage', delta: 2 },
          { effectIndex: 1, kind: 'block', delta: 1 },
        ],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '造成 9 点伤害，获得 6 点格挡。',
        patches: [
          { effectIndex: 0, kind: 'damage', delta: 3 },
          { effectIndex: 1, kind: 'block', delta: 2 },
        ],
      },
    },
  },
  quick_release: {
    baseId: 'quick_release',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '造成 4 点伤害，并消耗至多 1 层连势，每层额外造成 6 点伤害。',
        patches: [
          { effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 1 },
          { effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 },
        ],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '造成 5 点伤害，并消耗至多 1 层连势，每层额外造成 8 点伤害。',
        patches: [
          { effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 },
          { effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 3 },
        ],
      },
    },
  },
  follow_through: {
    baseId: 'follow_through',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '造成 6 点伤害，并消耗至多 2 层连势，每层额外造成 3 点伤害。若实际消耗了连势，获得 1 点能量。',
        patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '造成 7 点伤害，并消耗至多 2 层连势，每层额外造成 4 点伤害。若实际消耗了连势，获得 1 点能量并抽 1 张牌。',
        patches: [
          { effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 3 },
          { effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 },
        ],
      },
    },
  },
  break_opening: {
    baseId: 'break_opening',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '获得 3 层连势。获得 1 层破势预热。',
        patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '获得 3 层连势。获得 2 层破势预热。',
        patches: [
          { effectIndex: 0, kind: 'stacks', delta: 1 },
          { effectIndex: 1, kind: 'stacks', delta: 1 },
        ],
      },
    },
  },
  full_release: {
    baseId: 'full_release',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '造成 8 点伤害，并消耗全部连势，每层额外造成 3 点伤害。抽 1 张牌。',
        patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '造成 8 点伤害，并消耗全部连势，每层额外造成 4 点伤害。抽 2 张牌。',
        patches: [
          { effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 },
          { effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 },
          { effectIndex: 1, kind: 'draw', delta: 1 },
        ],
      },
    },
  },
  survey_field: {
    baseId: 'survey_field',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '抽 3 张牌。获得 1 层连势。',
        patches: [{ effectIndex: 0, kind: 'draw', delta: 1 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '抽 3 张牌。获得 2 层连势。',
        patches: [
          { effectIndex: 0, kind: 'draw', delta: 1 },
          { effectIndex: 1, kind: 'stacks', delta: 1 },
        ],
      },
    },
  },
  measured_rest: {
    baseId: 'measured_rest',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '回复 5 点生命，获得 5 点格挡，并获得 1 层连势。',
        patches: [
          { effectIndex: 0, kind: 'heal', delta: 2 },
          { effectIndex: 1, kind: 'block', delta: 1 },
        ],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '回复 6 点生命，获得 6 点格挡，并获得 2 层连势。',
        patches: [
          { effectIndex: 0, kind: 'heal', delta: 3 },
          { effectIndex: 1, kind: 'block', delta: 2 },
          { effectIndex: 2, kind: 'stacks', delta: 1 },
        ],
      },
    },
  },
  guard_vigil_banner: {
    baseId: 'guard_vigil_banner',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '获得 10 点格挡。',
        patches: [{ effectIndex: 0, kind: 'block', delta: 3 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '获得 12 点格挡。',
        patches: [{ effectIndex: 0, kind: 'block', delta: 5 }],
      },
    },
  },
  burst_signal_banner: {
    baseId: 'burst_signal_banner',
    levels: {
      1: {
        nameSuffix: '+',
        descriptionPatch: '造成 10 点伤害。',
        patches: [{ effectIndex: 0, kind: 'damage', delta: 3 }],
      },
      2: {
        nameSuffix: '++',
        descriptionPatch: '造成 12 点伤害。',
        patches: [{ effectIndex: 0, kind: 'damage', delta: 5 }],
      },
    },
  },
};

/** 从完整 id 里拆出 base id 与升级级别。`strike` / `strike+` / `strike++`。 */
export function parseCardId(id: string): { baseId: string; level: UpgradeLevel } {
  if (id.endsWith('++')) return { baseId: id.slice(0, -2), level: 2 };
  if (id.endsWith('+')) return { baseId: id.slice(0, -1), level: 1 };
  return { baseId: id, level: 0 };
}

export function cardIdFor(baseId: string, level: UpgradeLevel): string {
  return baseId + UPGRADE_SUFFIX_BY_LEVEL[level];
}

/** 当前 id 是否还可以再升一级；考虑规则表是否有定义、是否已到 `++`。 */
export function canUpgradeCardId(id: string): boolean {
  const { baseId, level } = parseCardId(id);
  if (level >= 2) return false;
  const rule = CARD_UPGRADE_RULES[baseId];
  if (!rule) return false;
  const nextLevel = (level + 1) as 1 | 2;
  return Boolean(rule.levels[nextLevel]);
}

export function nextUpgradedId(id: string): string | null {
  if (!canUpgradeCardId(id)) return null;
  const { baseId, level } = parseCardId(id);
  return cardIdFor(baseId, (level + 1) as UpgradeLevel);
}

/** 应用单个 patch，得到升级后的 effect 副本；仅对兼容的 effect 类型生效。 */
function applyPatch(effects: EffectDefinition[], patch: EffectPatch): EffectDefinition[] {
  const next = effects.map((e, idx) => (idx === patch.effectIndex ? cloneEffect(e) : e));
  const target = next[patch.effectIndex];
  if (!target) return next;

  if (patch.kind === 'damage' && target.type === 'damage') target.value += patch.delta;
  else if (patch.kind === 'block' && target.type === 'block') target.value += patch.delta;
  else if (patch.kind === 'heal' && target.type === 'heal') target.value += patch.delta;
  else if (patch.kind === 'draw' && target.type === 'draw') target.value += patch.delta;
  else if (patch.kind === 'gain_energy' && target.type === 'gain_energy') target.value += patch.delta;
  else if (patch.kind === 'stacks' && target.type === 'apply_status') target.stacks += patch.delta;
  else if (patch.kind === 'custom_param' && target.type === 'custom') {
    const params = (target.params ?? {}) as Record<string, unknown>;
    const current = typeof params[patch.paramKey] === 'number' ? (params[patch.paramKey] as number) : 0;
    target.params = { ...params, [patch.paramKey]: current + patch.delta };
  }
  return next;
}

function cloneEffect(e: EffectDefinition): EffectDefinition {
  return JSON.parse(JSON.stringify(e)) as EffectDefinition;
}

/**
 * 从基础 `CardDefinition` + 规则派生某一级升级卡定义。
 * 不修改传入对象。
 */
export function deriveUpgradedDefinition(
  base: CardDefinition,
  rule: CardUpgradeLevelRule,
): CardDefinition {
  const baseEffects = rule.effectsOverride ?? base.effects;
  const patched = (rule.patches ?? []).reduce<EffectDefinition[]>((eff, p) => applyPatch(eff, p), baseEffects.map(cloneEffect));
  return {
    ...base,
    id: base.id + rule.nameSuffix,
    name: base.name + rule.nameSuffix,
    description: rule.descriptionOverride ?? rule.descriptionPatch,
    cost: Math.max(0, base.cost + (rule.costDelta ?? 0)),
    effects: patched,
  };
}

/**
 * 模块初始化时被调用：根据 `CARD_UPGRADE_RULES` 向 `CARD_DEFINITIONS` 注入
 * 所有升级版卡定义（例如 `strike+`、`strike++`）。重复调用是幂等的。
 */
export function registerUpgradedCardDefinitions(
  registry: Record<string, CardDefinition> = CARD_DEFINITIONS,
): void {
  for (const [baseId, rule] of Object.entries(CARD_UPGRADE_RULES)) {
    const base = registry[baseId];
    if (!base) continue;
    const lvl1 = rule.levels[1];
    if (lvl1) registry[baseId + lvl1.nameSuffix] = deriveUpgradedDefinition(base, lvl1);
    const lvl2 = rule.levels[2];
    if (lvl2) {
      const upBase = lvl1 ? registry[baseId + lvl1.nameSuffix] ?? base : base;
      const baseForL2: CardDefinition = { ...upBase, id: baseId, name: base.name, cost: base.cost, effects: base.effects };
      registry[baseId + lvl2.nameSuffix] = deriveUpgradedDefinition(baseForL2, lvl2);
    }
  }
}

// 合并生成的升级规则
Object.assign(CARD_UPGRADE_RULES, GENERATED_UPGRADE_RULES);

registerUpgradedCardDefinitions();

/**
 * 升级 masterDeck 里指定下标的卡；若不可升级则返回 false，不修改状态。
 *
 * 用于 shop 升级服务与奖励升级选项：调用方负责扣金币、关闭 UI 等副作用。
 */
export function upgradeMasterDeckAt(run: { masterDeck: string[] }, index: number): boolean {
  if (index < 0 || index >= run.masterDeck.length) return false;
  const current = run.masterDeck[index]!;
  const next = nextUpgradedId(current);
  if (!next) return false;
  run.masterDeck[index] = next;
  return true;
}

/** 查询 masterDeck 中当前可升级的卡位置（按 index 去重）。 */
export function listUpgradableDeckIndices(masterDeck: string[]): number[] {
  const out: number[] = [];
  for (let i = 0; i < masterDeck.length; i++) {
    if (canUpgradeCardId(masterDeck[i]!)) out.push(i);
  }
  return out;
}

/** 供外部（脚本、构建工具）导出为 JSON。 */
export function exportUpgradeRulesJson(): string {
  return JSON.stringify(CARD_UPGRADE_RULES, null, 2);
}
