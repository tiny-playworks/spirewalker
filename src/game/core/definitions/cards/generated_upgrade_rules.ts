import type { CardUpgradeRule } from './upgradeRules';

/**
 * 生成卡牌升级规则表（共 218 张）
 * 覆盖 generated_a (55) / generated_b (55) / generated_c (55) / generated_d (53) 全部新卡。
 */
export const GENERATED_UPGRADE_RULES: Record<string, CardUpgradeRule> = {
  // =========================================================================
  //  MIXED A — 55 张
  // =========================================================================

  // --- 普通攻击牌 (15) ---
  mx_a_gentle_slash: {
    baseId: 'mx_a_gentle_slash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 7 点伤害，获得 5 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 9 点伤害，获得 7 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  mx_a_adaptive_strike: {
    baseId: 'mx_a_adaptive_strike',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 9 点伤害。若你有格挡，额外造成 3 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 11 点伤害。若你有格挡，额外造成 4 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'bonusDamage', delta: 1 }] },
    },
  },
  mx_a_rising_blade: {
    baseId: 'mx_a_rising_blade',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 7 点伤害，获得 1 层连势。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 9 点伤害，获得 2 层连势。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  mx_a_rapid_flurry: {
    baseId: 'mx_a_rapid_flurry',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 3 点伤害三次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 4 点伤害三次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 2 }] },
    },
  },
  mx_a_balanced_cut: {
    baseId: 'mx_a_balanced_cut',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 8 点伤害，获得 4 点格挡，抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 10 点伤害，获得 6 点格挡，抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  mx_a_steel_edge: {
    baseId: 'mx_a_steel_edge',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 10 点伤害，获得 1 层金属化。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 12 点伤害，获得 2 层金属化。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  mx_a_guard_breaker: {
    baseId: 'mx_a_guard_breaker',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 8 点伤害，施加 1 层易伤。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 10 点伤害，施加 2 层易伤。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  mx_a_resonant_strike: {
    baseId: 'mx_a_resonant_strike',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 7 点伤害。若你有力量，额外造成 3 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 9 点伤害。若你有力量，额外造成 4 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'bonusDamage', delta: 1 }] },
    },
  },
  mx_a_quick_jab: {
    baseId: 'mx_a_quick_jab',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 6 点伤害，抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 8 点伤害，抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }] },
    },
  },
  mx_a_heavy_push: {
    baseId: 'mx_a_heavy_push',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 11 点伤害，获得 5 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 13 点伤害，获得 7 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  mx_a_double_tap: {
    baseId: 'mx_a_double_tap',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 4 点伤害两次，获得 3 点格挡。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 1 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 5 点伤害两次，获得 5 点格挡。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  mx_a_sudden_bolt: {
    baseId: 'mx_a_sudden_bolt',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 8 点伤害。消耗 1 层连势，造成额外 3 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 10 点伤害。消耗 1 层连势，造成额外 4 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }] },
    },
  },
  mx_a_reactive_cut: {
    baseId: 'mx_a_reactive_cut',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 7 点伤害。若你有格挡，额外造成 4 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 9 点伤害。若你有格挡，额外造成 5 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'bonusDamage', delta: 1 }] },
    },
  },
  mx_a_iron_slash: {
    baseId: 'mx_a_iron_slash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '对所有敌人造成 6 点伤害，获得 4 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '对所有敌人造成 8 点伤害，获得 6 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  mx_a_crescent_slash: {
    baseId: 'mx_a_crescent_slash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 12 点伤害，获得 7 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 14 点伤害，获得 9 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },

  // --- 普通技能牌 (15) ---
  mx_a_steady_block: {
    baseId: 'mx_a_steady_block',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 8 点格挡，获得 1 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 10 点格挡，获得 2 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  mx_a_adaptive_guard: {
    baseId: 'mx_a_adaptive_guard',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 7 点格挡，抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 9 点格挡，抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }] },
    },
  },
  mx_a_iron_cover: {
    baseId: 'mx_a_iron_cover',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 10 点格挡，获得 1 层金属化。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 12 点格挡，获得 2 层金属化。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  mx_a_quick_surge: {
    baseId: 'mx_a_quick_surge',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 1 点能量，抽 1 张牌。', costDelta: -1 },
      2: { nameSuffix: '++', descriptionPatch: '获得 2 点能量，抽 1 张牌。', costDelta: -1, patches: [{ effectIndex: 0, kind: 'gain_energy', delta: 1 }] },
    },
  },
  mx_a_counter_pulse: {
    baseId: 'mx_a_counter_pulse',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 5 点格挡，对所有敌人造成 3 点伤害。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }, { effectIndex: 1, kind: 'damage', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 7 点格挡，对所有敌人造成 4 点伤害。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'damage', delta: 2 }] },
    },
  },
  mx_a_momentum_flow: {
    baseId: 'mx_a_momentum_flow',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 6 点格挡，获得 2 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 8 点格挡，获得 3 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  mx_a_flexible_stance: {
    baseId: 'mx_a_flexible_stance',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 1 层力量，获得 2 层金属化。', patches: [{ effectIndex: 1, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 2 层力量，获得 2 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  mx_a_heavy_ward: {
    baseId: 'mx_a_heavy_ward',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 9 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 11 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }] },
    },
  },
  mx_a_steel_breath: {
    baseId: 'mx_a_steel_breath',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '回复 5 点生命，获得 5 点格挡。', patches: [{ effectIndex: 0, kind: 'heal', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '回复 7 点生命，获得 7 点格挡。', patches: [{ effectIndex: 0, kind: 'heal', delta: 4 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  mx_a_momentum_drain: {
    baseId: 'mx_a_momentum_drain',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 6 点格挡。消耗 1 层连势，获得 1 点能量。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 8 点格挡。消耗 1 层连势，获得 2 点能量。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'custom_param', paramKey: 'energyGain', delta: 1 }] },
    },
  },
  mx_a_guardian_pulse: {
    baseId: 'mx_a_guardian_pulse',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 7 点格挡，获得 1 层稳势。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 9 点格挡，获得 2 层稳势。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  mx_a_breath_control: {
    baseId: 'mx_a_breath_control',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '回复 4 点生命，抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'heal', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '回复 6 点生命，抽 2 张牌。', patches: [{ effectIndex: 0, kind: 'heal', delta: 4 }, { effectIndex: 1, kind: 'draw', delta: 1 }] },
    },
  },
  mx_a_energy_siphon: {
    baseId: 'mx_a_energy_siphon',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 1 点能量，获得 2 层连势。', patches: [{ effectIndex: 1, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 2 点能量，获得 2 层连势。', patches: [{ effectIndex: 0, kind: 'gain_energy', delta: 1 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  mx_a_momentum_sense: {
    baseId: 'mx_a_momentum_sense',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '抽 3 张牌，获得 4 点格挡。', patches: [{ effectIndex: 0, kind: 'draw', delta: 1 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '抽 4 张牌，获得 6 点格挡。', patches: [{ effectIndex: 0, kind: 'draw', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  mx_a_responsive_guard: {
    baseId: 'mx_a_responsive_guard',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 6 点格挡，获得 2 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 8 点格挡，获得 3 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },

  // --- 稀有卡牌 (15) ---
  mx_a_momentum_cleave: {
    baseId: 'mx_a_momentum_cleave',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '对所有敌人造成 9 点伤害。消耗 2 层连势，造成额外 3 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '对所有敌人造成 11 点伤害。消耗 2 层连势，造成额外 4 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }] },
    },
  },
  mx_a_adaptive_rush: {
    baseId: 'mx_a_adaptive_rush',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 12 点伤害，获得 7 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 14 点伤害，获得 9 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  mx_a_steel_flurry: {
    baseId: 'mx_a_steel_flurry',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 4 点伤害四次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 5 点伤害四次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 2 }] },
    },
  },
  mx_a_breaking_point: {
    baseId: 'mx_a_breaking_point',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 10 点伤害，施加 2 层易伤。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 12 点伤害，施加 3 层易伤。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  mx_a_resonant_slash: {
    baseId: 'mx_a_resonant_slash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 8 点伤害。消耗所有连势，每层额外造成 2 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 10 点伤害。消耗所有连势，每层额外造成 3 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }] },
    },
  },
  mx_a_fortified_stance: {
    baseId: 'mx_a_fortified_stance',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 10 点格挡，获得 2 层金属化。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 12 点格挡，获得 3 层金属化。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  mx_a_momentum_surge: {
    baseId: 'mx_a_momentum_surge',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 8 点格挡，获得 3 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 10 点格挡，获得 4 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  mx_a_adaptive_flow: {
    baseId: 'mx_a_adaptive_flow',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '抽 3 张牌，获得 6 点格挡。', patches: [{ effectIndex: 0, kind: 'draw', delta: 1 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '抽 4 张牌，获得 8 点格挡。', patches: [{ effectIndex: 0, kind: 'draw', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  mx_a_iron_resolve: {
    baseId: 'mx_a_iron_resolve',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 2 层力量，获得 3 层金属化。', patches: [{ effectIndex: 1, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 3 层力量，获得 3 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  mx_a_defiant_parry: {
    baseId: 'mx_a_defiant_parry',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 8 点格挡，对所有敌人造成 4 点伤害。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }, { effectIndex: 1, kind: 'damage', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 10 点格挡，对所有敌人造成 5 点伤害。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'damage', delta: 2 }] },
    },
  },
  mx_a_momentum_overflow: {
    baseId: 'mx_a_momentum_overflow',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 4 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 5 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  mx_a_steel_aura: {
    baseId: 'mx_a_steel_aura',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 4 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 5 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  mx_a_adaptive_instinct: {
    baseId: 'mx_a_adaptive_instinct',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 3 层力量。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 4 层力量。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  mx_a_balanced_dance: {
    baseId: 'mx_a_balanced_dance',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 3 层连势，获得 2 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 3 层连势，获得 3 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  mx_a_guardian_fury: {
    baseId: 'mx_a_guardian_fury',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 3 层力量，获得 2 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 3 层力量，获得 3 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },

  // --- 史诗卡牌 (10) ---
  mx_a_momentum_devastation: {
    baseId: 'mx_a_momentum_devastation',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 14 点伤害。消耗所有连势，每层额外造成 4 点伤害。抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 16 点伤害。消耗所有连势，每层额外造成 5 点伤害。抽 2 张牌。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }, { effectIndex: 1, kind: 'draw', delta: 1 }] },
    },
  },
  mx_a_absolute_break: {
    baseId: 'mx_a_absolute_break',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 17 点伤害，施加 2 层易伤，获得 8 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 2, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 19 点伤害，施加 3 层易伤，获得 10 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }, { effectIndex: 2, kind: 'block', delta: 4 }] },
    },
  },
  mx_a_momentum_crescendo: {
    baseId: 'mx_a_momentum_crescendo',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 6 点伤害两次。消耗 2 层连势，额外造成 5 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 7 点伤害两次。消耗 2 层连势，额外造成 6 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 2 }, { effectIndex: 1, kind: 'custom_param', paramKey: 'baseDamage', delta: 1 }] },
    },
  },
  mx_a_iron_curtain: {
    baseId: 'mx_a_iron_curtain',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 14 点格挡，获得 2 层金属化，抽 2 张牌。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 16 点格挡，获得 3 层金属化，抽 3 张牌。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }, { effectIndex: 2, kind: 'draw', delta: 1 }] },
    },
  },
  mx_a_momentum_unleash: {
    baseId: 'mx_a_momentum_unleash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '抽 4 张牌，获得 2 点能量。消耗 2 层连势。', patches: [{ effectIndex: 0, kind: 'draw', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '抽 5 张牌，获得 3 点能量。消耗 2 层连势。', patches: [{ effectIndex: 0, kind: 'draw', delta: 2 }, { effectIndex: 2, kind: 'gain_energy', delta: 1 }] },
    },
  },
  mx_a_fortified_momentum: {
    baseId: 'mx_a_fortified_momentum',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 12 点格挡，获得 4 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 14 点格挡，获得 5 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  mx_a_adaptive_mastery: {
    baseId: 'mx_a_adaptive_mastery',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 3 层力量，获得 4 层金属化。', patches: [{ effectIndex: 1, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 4 层力量，获得 4 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  mx_a_momentum_ascension: {
    baseId: 'mx_a_momentum_ascension',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 5 层连势，获得 2 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 6 层连势，获得 3 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  mx_a_balanced_harmony: {
    baseId: 'mx_a_balanced_harmony',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 4 层力量，获得 3 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 4 层力量，获得 4 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  mx_a_unyielding_guard: {
    baseId: 'mx_a_unyielding_guard',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 4 层金属化，获得 2 层稳势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 5 层金属化，获得 3 层稳势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },

  // =========================================================================
  //  BURST B — 55 张
  // =========================================================================

  // --- 普通攻击牌 (15) ---
  br_b_rupture_slash: {
    baseId: 'br_b_rupture_slash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 9 点伤害。消耗所有连势，每层造成额外 2 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 11 点伤害。消耗所有连势，每层造成额外 3 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }] },
    },
  },
  br_b_momentum_strike: {
    baseId: 'br_b_momentum_strike',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 7 点伤害。消耗 2 层连势，造成额外 5 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 9 点伤害。消耗 2 层连势，造成额外 6 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }] },
    },
  },
  br_b_quick_slash: {
    baseId: 'br_b_quick_slash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 5 点伤害两次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 6 点伤害两次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 2 }] },
    },
  },
  br_b_heavy_strike: {
    baseId: 'br_b_heavy_strike',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 12 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 14 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }] },
    },
  },
  br_b_armor_break: {
    baseId: 'br_b_armor_break',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 8 点伤害，施加 2 层易伤。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 10 点伤害，施加 3 层易伤。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  br_b_chain_slash: {
    baseId: 'br_b_chain_slash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 4 点伤害三次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 5 点伤害三次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 2 }] },
    },
  },
  br_b_momentum_heavy: {
    baseId: 'br_b_momentum_heavy',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 14 点伤害。消耗 3 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 16 点伤害。消耗 3 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }] },
    },
  },
  br_b_burst_slash: {
    baseId: 'br_b_burst_slash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 17 点伤害。消耗所有连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 19 点伤害。消耗所有连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }] },
    },
  },
  br_b_primed_strike: {
    baseId: 'br_b_primed_strike',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 9 点伤害。若你有破势预热，造成额外 7 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 11 点伤害。若你有破势预热，造成额外 8 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'bonusDamage', delta: 1 }] },
    },
  },
  br_b_dual_slash: {
    baseId: 'br_b_dual_slash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 6 点伤害两次。消耗 2 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 7 点伤害两次。消耗 2 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
    },
  },
  br_b_cleave: {
    baseId: 'br_b_cleave',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '对所有敌人造成 10 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '对所有敌人造成 12 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }] },
    },
  },
  br_b_rapid_strike: {
    baseId: 'br_b_rapid_strike',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 3 点伤害四次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 4 点伤害四次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 2 }] },
    },
  },
  br_b_devastate: {
    baseId: 'br_b_devastate',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 20 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 22 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }] },
    },
  },
  br_b_momentum_cleave: {
    baseId: 'br_b_momentum_cleave',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '对所有敌人造成 7 点伤害。消耗所有连势，每层造成额外 1 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '对所有敌人造成 9 点伤害。消耗所有连势，每层造成额外 2 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }] },
    },
  },
  br_b_vengeful_strike: {
    baseId: 'br_b_vengeful_strike',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 11 点伤害。消耗 2 层连势，施加 1 层虚弱。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 13 点伤害。消耗 2 层连势，施加 2 层虚弱。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },

  // --- 普通技能牌 (10) ---
  br_b_primed_blow: {
    baseId: 'br_b_primed_blow',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 3 层破势预热。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 4 层破势预热。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  br_b_build_momentum: {
    baseId: 'br_b_build_momentum',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 4 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 5 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  br_b_energy_burst: {
    baseId: 'br_b_energy_burst',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '消耗 3 层连势，获得 3 点能量。', patches: [{ effectIndex: 1, kind: 'gain_energy', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '消耗 3 层连势，获得 4 点能量。', patches: [{ effectIndex: 1, kind: 'gain_energy', delta: 2 }] },
    },
  },
  br_b_momentum_draw: {
    baseId: 'br_b_momentum_draw',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '抽 3 张牌。消耗 2 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDraw', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '抽 4 张牌。消耗 2 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDraw', delta: 2 }] },
    },
  },
  br_b_power_surge: {
    baseId: 'br_b_power_surge',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 2 层力量。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 3 层力量。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  br_b_deep_draw: {
    baseId: 'br_b_deep_draw',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '抽 4 张牌。消耗 1 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDraw', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '抽 5 张牌。消耗 1 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDraw', delta: 2 }] },
    },
  },
  br_b_primed_defense: {
    baseId: 'br_b_primed_defense',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 7 点格挡。消耗 2 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 9 点格挡。消耗 2 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }] },
    },
  },
  br_b_momentum_energy: {
    baseId: 'br_b_momentum_energy',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 2 点能量。消耗 1 层连势。', patches: [{ effectIndex: 0, kind: 'gain_energy', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 3 点能量。消耗 1 层连势。', patches: [{ effectIndex: 0, kind: 'gain_energy', delta: 2 }] },
    },
  },
  br_b_primed_draw: {
    baseId: 'br_b_primed_draw',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '抽 3 张牌。消耗 2 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDraw', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '抽 4 张牌。消耗 2 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDraw', delta: 2 }] },
    },
  },
  br_b_primed_energy: {
    baseId: 'br_b_primed_energy',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 2 点能量。消耗 1 层连势。', patches: [{ effectIndex: 0, kind: 'gain_energy', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 3 点能量。消耗 1 层连势。', patches: [{ effectIndex: 0, kind: 'gain_energy', delta: 2 }] },
    },
  },

  // --- 稀有攻击牌 (7) ---
  br_b_burst_combo: {
    baseId: 'br_b_burst_combo',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 10 点伤害两次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 12 点伤害两次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 4 }] },
    },
  },
  br_b_primed_strike_u: {
    baseId: 'br_b_primed_strike_u',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 14 点伤害。若你有破势预热，造成额外 8 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 16 点伤害。若你有破势预热，造成额外 10 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'bonusDamage', delta: 2 }] },
    },
  },
  br_b_momentum_slash: {
    baseId: 'br_b_momentum_slash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 18 点伤害。消耗 4 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 20 点伤害。消耗 4 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }] },
    },
  },
  br_b_burst_slash_u: {
    baseId: 'br_b_burst_slash_u',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 27 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 29 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }] },
    },
  },

  // --- 稀有技能牌 (4) ---
  br_b_primed_fortify: {
    baseId: 'br_b_primed_fortify',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 4 层破势预热。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 5 层破势预热。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  br_b_momentum_fortify: {
    baseId: 'br_b_momentum_fortify',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 6 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 7 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  br_b_primed_draw_u: {
    baseId: 'br_b_primed_draw_u',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '抽 4 张牌。消耗 3 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDraw', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '抽 5 张牌。消耗 3 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDraw', delta: 2 }] },
    },
  },
  br_b_energy_burst_u: {
    baseId: 'br_b_energy_burst_u',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 3 点能量。消耗 2 层连势。', patches: [{ effectIndex: 0, kind: 'gain_energy', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 4 点能量。消耗 2 层连势。', patches: [{ effectIndex: 0, kind: 'gain_energy', delta: 2 }] },
    },
  },

  // --- 稀有能力牌 (4) ---
  br_b_primed_fortify_p: {
    baseId: 'br_b_primed_fortify_p',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 5 层破势预热。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 6 层破势预热。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  br_b_momentum_fortify_p: {
    baseId: 'br_b_momentum_fortify_p',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 5 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 6 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  br_b_power_surge_u: {
    baseId: 'br_b_power_surge_u',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 3 层力量。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 4 层力量。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  br_b_burst_mastery: {
    baseId: 'br_b_burst_mastery',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 4 层破势预热和 3 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 4 层破势预热和 4 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },

  // --- 史诗攻击牌 (6) ---
  br_b_final_rupture: {
    baseId: 'br_b_final_rupture',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 32 点伤害。消耗所有连势和破势预热，每层造成额外 5 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 34 点伤害。消耗所有连势和破势预热，每层造成额外 6 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }] },
    },
  },
  br_b_momentum_storm: {
    baseId: 'br_b_momentum_storm',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 10 点伤害五次。消耗 5 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 12 点伤害五次。消耗 5 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }] },
    },
  },
  br_b_primed_devastate: {
    baseId: 'br_b_primed_devastate',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 37 点伤害。消耗 8 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 39 点伤害。消耗 8 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }] },
    },
  },
  br_b_momentum_rupture: {
    baseId: 'br_b_momentum_rupture',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 20 点伤害。消耗所有连势，每层造成额外 4 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 22 点伤害。消耗所有连势，每层造成额外 5 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }] },
    },
  },
  br_b_triple_slash: {
    baseId: 'br_b_triple_slash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 8 点伤害三次。消耗 3 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 10 点伤害三次。消耗 3 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }] },
    },
  },
  br_b_primed_heavy: {
    baseId: 'br_b_primed_heavy',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 24 点伤害。消耗 5 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 26 点伤害。消耗 5 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }] },
    },
  },
  br_b_energy_annihilation: {
    baseId: 'br_b_energy_annihilation',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 40 点伤害。消耗所有能量。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerEnergy', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 40 点伤害。消耗所有能量。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerEnergy', delta: 4 }] },
    },
  },
  br_b_triple_rupture: {
    baseId: 'br_b_triple_rupture',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 12 点伤害三次。消耗 6 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 14 点伤害三次。消耗 6 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }] },
    },
  },
  br_b_momentum_slash_r: {
    baseId: 'br_b_momentum_slash_r',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 16 点伤害两次。消耗 5 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 18 点伤害两次。消耗 5 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }] },
    },
  },
  br_b_primed_master: {
    baseId: 'br_b_primed_master',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 6 层破势预热。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 7 层破势预热。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  br_b_momentum_master: {
    baseId: 'br_b_momentum_master',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 9 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 10 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  br_b_primed_draw_r: {
    baseId: 'br_b_primed_draw_r',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '抽 6 张牌。消耗 4 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDraw', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '抽 7 张牌。消耗 4 层连势。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDraw', delta: 2 }] },
    },
  },
  br_b_energy_master: {
    baseId: 'br_b_energy_master',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 5 点能量。消耗 5 层连势。', patches: [{ effectIndex: 0, kind: 'gain_energy', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 6 点能量。消耗 5 层连势。', patches: [{ effectIndex: 0, kind: 'gain_energy', delta: 2 }] },
    },
  },
  br_b_primed_fortify_r: {
    baseId: 'br_b_primed_fortify_r',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 7 层破势预热。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 8 层破势预热。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  br_b_momentum_fortify_r: {
    baseId: 'br_b_momentum_fortify_r',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 7 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 8 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  br_b_power_master: {
    baseId: 'br_b_power_master',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 4 层力量。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 5 层力量。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  br_b_burst_master: {
    baseId: 'br_b_burst_master',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 5 层破势预热和 4 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 5 层破势预热和 5 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  br_b_momentum_master_p: {
    baseId: 'br_b_momentum_master_p',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 6 层连势和 2 层力量。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 7 层连势和 3 层力量。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },

  // =========================================================================
  //  GUARD C — 53 张
  // =========================================================================

  // --- 普通技能牌 (15) ---
  gd_c_iron_wall: {
    baseId: 'gd_c_iron_wall',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 10 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 12 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }] },
    },
  },
  gd_c_stone_skin: {
    baseId: 'gd_c_stone_skin',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 8 点格挡，获得 1 层金属化。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 10 点格挡，获得 2 层金属化。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_bastion: {
    baseId: 'gd_c_bastion',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 7 点格挡，获得 1 层稳势。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 9 点格挡，获得 2 层稳势。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_fortify: {
    baseId: 'gd_c_fortify',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 6 点格挡，获得 2 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 8 点格挡，获得 3 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_impenetrable: {
    baseId: 'gd_c_impenetrable',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 13 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 15 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }] },
    },
  },
  gd_c_rampart: {
    baseId: 'gd_c_rampart',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 5 点格挡，抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 7 点格挡，抽 2 张牌。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'draw', delta: 1 }] },
    },
  },
  gd_c_steel_ward: {
    baseId: 'gd_c_steel_ward',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 9 点格挡。若你有金属化，额外获得 3 点格挡。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseBlock', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 11 点格挡。若你有金属化，额外获得 4 点格挡。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseBlock', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'blockPerStack', delta: 1 }] },
    },
  },
  gd_c_guard_posture: {
    baseId: 'gd_c_guard_posture',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 7 点格挡，获得 1 层力量。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 9 点格挡，获得 2 层力量。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_iron_resolve: {
    baseId: 'gd_c_iron_resolve',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 8 点格挡，获得 2 层金属化。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 10 点格挡，获得 3 层金属化。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_turtle_shell: {
    baseId: 'gd_c_turtle_shell',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 15 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 17 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }] },
    },
  },
  gd_c_steady_breath: {
    baseId: 'gd_c_steady_breath',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 6 点格挡，获得 2 层稳势。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 8 点格挡，获得 3 层稳势。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_warding_shout: {
    baseId: 'gd_c_warding_shout',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '对所有敌人造成 4 点伤害，获得 7 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 1 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '对所有敌人造成 5 点伤害，获得 9 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  gd_c_anvil_stance: {
    baseId: 'gd_c_anvil_stance',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 11 点格挡。若你本回合未消耗连势，额外获得 3 点格挡。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseBlock', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 13 点格挡。若你本回合未消耗连势，额外获得 4 点格挡。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseBlock', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'blockPerStack', delta: 1 }] },
    },
  },
  gd_c_solid_ground: {
    baseId: 'gd_c_solid_ground',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 9 点格挡，获得 1 层金属化和 1 层稳势。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 11 点格挡，获得 2 层金属化和 1 层稳势。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_last_stand: {
    baseId: 'gd_c_last_stand',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 12 点格挡，抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 14 点格挡，抽 2 张牌。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'draw', delta: 1 }] },
    },
  },

  // --- 普通攻击牌 (10) ---
  gd_c_shield_bash: {
    baseId: 'gd_c_shield_bash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 7 点伤害，获得 5 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 9 点伤害，获得 7 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  gd_c_iron_strike: {
    baseId: 'gd_c_iron_strike',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 8 点伤害，获得 2 层金属化。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 10 点伤害，获得 3 层金属化。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_guard_slash: {
    baseId: 'gd_c_guard_slash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 6 点伤害，获得 6 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 8 点伤害，获得 8 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  gd_c_sure_strike: {
    baseId: 'gd_c_sure_strike',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 8 点伤害，施加 1 层易伤。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 10 点伤害，施加 2 层易伤。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_wall_breaker: {
    baseId: 'gd_c_wall_breaker',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成等同于当前格挡值的伤害。', costDelta: -1 },
      2: { nameSuffix: '++', descriptionPatch: '造成等同于当前格挡值两倍的伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'multiplier', delta: 1 }] },
    },
  },
  gd_c_defensive_cleave: {
    baseId: 'gd_c_defensive_cleave',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '对所有敌人造成 6 点伤害，获得 6 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '对所有敌人造成 8 点伤害，获得 8 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  gd_c_riposte: {
    baseId: 'gd_c_riposte',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 10 点伤害。若你有格挡，额外造成 4 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 12 点伤害。若你有格挡，额外造成 5 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'custom_param', paramKey: 'multiplier', delta: 0.25 }] },
    },
  },
  gd_c_grounded_slash: {
    baseId: 'gd_c_grounded_slash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 9 点伤害，获得 6 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 11 点伤害，获得 8 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  gd_c_guardian_lunge: {
    baseId: 'gd_c_guardian_lunge',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 6 点伤害两次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 7 点伤害两次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 2 }] },
    },
  },
  gd_c_rampart_strike: {
    baseId: 'gd_c_rampart_strike',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 11 点伤害，获得 7 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 13 点伤害，获得 9 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },

  // --- 稀有卡牌 (15) ---
  gd_c_fortification: {
    baseId: 'gd_c_fortification',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 14 点格挡，获得 2 层金属化。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 16 点格挡，获得 3 层金属化。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_iron_clad: {
    baseId: 'gd_c_iron_clad',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 12 点伤害，获得等同于你金属化层数的格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 14 点伤害，获得等同于你金属化层数两倍的格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'custom_param', paramKey: 'blockPerStack', delta: 1 }] },
    },
  },
  gd_c_steady_fortress: {
    baseId: 'gd_c_steady_fortress',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 10 点格挡，获得 3 层稳势。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 12 点格挡，获得 4 层稳势。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_iron_maiden: {
    baseId: 'gd_c_iron_maiden',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 14 点伤害，施加 2 层易伤。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 16 点伤害，施加 3 层易伤。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_momentum_surge: {
    baseId: 'gd_c_momentum_surge',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 8 点格挡，获得 4 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 10 点格挡，获得 5 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_warden_strike: {
    baseId: 'gd_c_warden_strike',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 16 点伤害。消耗 3 层连势。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 18 点伤害。消耗 3 层连势。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }] },
    },
  },
  gd_c_bulwark: {
    baseId: 'gd_c_bulwark',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 12 点格挡，获得 1 层力量。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 14 点格挡，获得 2 层力量。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_multi_parry: {
    baseId: 'gd_c_multi_parry',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 7 点格挡两次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 8 点格挡两次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 2 }] },
    },
  },
  gd_c_heavy_bash: {
    baseId: 'gd_c_heavy_bash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 10 点伤害，获得 10 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 12 点伤害，获得 12 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  gd_c_metallic_fortitude: {
    baseId: 'gd_c_metallic_fortitude',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 6 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 7 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  gd_c_unyielding_will: {
    baseId: 'gd_c_unyielding_will',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 4 层稳势和 2 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 4 层稳势和 3 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_sentinel: {
    baseId: 'gd_c_sentinel',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 7 点伤害三次。每击获得 2 点格挡。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 8 点伤害三次。每击获得 3 点格挡。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 2 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'blockPerHit', delta: 1 }] },
    },
  },
  gd_c_aegis_power: {
    baseId: 'gd_c_aegis_power',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 3 层力量和 2 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 3 层力量和 3 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_bulwark_stance: {
    baseId: 'gd_c_bulwark_stance',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 17 点格挡，抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 19 点格挡，抽 2 张牌。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'draw', delta: 1 }] },
    },
  },
  gd_c_primed_defense: {
    baseId: 'gd_c_primed_defense',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 10 点格挡，获得 2 层破势预热。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 12 点格挡，获得 3 层破势预热。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },

  // --- 史诗卡牌 (15) ---
  gd_c_impenetrable_wall: {
    baseId: 'gd_c_impenetrable_wall',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 23 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 3 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 26 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 6 }] },
    },
  },
  gd_c_guardian_devastation: {
    baseId: 'gd_c_guardian_devastation',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成等同于你格挡值两倍的伤害。', costDelta: -1 },
      2: { nameSuffix: '++', descriptionPatch: '造成等同于你格挡值三倍的伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'multiplier', delta: 1 }] },
    },
  },
  gd_c_eternal_fortress: {
    baseId: 'gd_c_eternal_fortress',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 14 点格挡，获得 4 层金属化。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 16 点格挡，获得 5 层金属化。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_momentum_bastion: {
    baseId: 'gd_c_momentum_bastion',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 10 点格挡，获得 6 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 12 点格挡，获得 7 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_titan_slam: {
    baseId: 'gd_c_titan_slam',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 20 点伤害。消耗所有稳势，每层造成额外 5 点伤害。', costDelta: -1 },
      2: { nameSuffix: '++', descriptionPatch: '造成 20 点伤害。消耗所有稳势，每层造成额外 6 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'multiplier', delta: 1 }] },
    },
  },
  gd_c_metallic_mastery: {
    baseId: 'gd_c_metallic_mastery',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 10 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 12 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 4 }] },
    },
  },
  gd_c_steady_master: {
    baseId: 'gd_c_steady_master',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 7 层稳势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 9 层稳势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 4 }] },
    },
  },
  gd_c_momentum_lord: {
    baseId: 'gd_c_momentum_lord',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 10 层连势，抽 2 张牌。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 12 层连势，抽 3 张牌。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 4 }, { effectIndex: 1, kind: 'draw', delta: 1 }] },
    },
  },
  gd_c_unstoppable_bulwark: {
    baseId: 'gd_c_unstoppable_bulwark',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 17 点格挡，获得 3 层力量。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 19 点格挡，获得 4 层力量。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_guardian_wrath: {
    baseId: 'gd_c_guardian_wrath',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 16 点伤害四次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 17 点伤害四次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 2 }] },
    },
  },
  gd_c_ultimate_defense: {
    baseId: 'gd_c_ultimate_defense',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 17 点格挡，获得 3 层金属化，抽 2 张牌。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 19 点格挡，获得 4 层金属化，抽 3 张牌。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }, { effectIndex: 2, kind: 'draw', delta: 1 }] },
    },
  },
  gd_c_fortress_master: {
    baseId: 'gd_c_fortress_master',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 4 层力量和 5 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 4 层力量和 6 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_breaking_guard: {
    baseId: 'gd_c_breaking_guard',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 5 层破势预热，获得 3 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 6 层破势预热，获得 4 层连势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_aegis_mastery: {
    baseId: 'gd_c_aegis_mastery',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 7 层稳势和 4 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 8 层稳势和 5 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  gd_c_last_wall: {
    baseId: 'gd_c_last_wall',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 30 点格挡。消耗。', patches: [{ effectIndex: 0, kind: 'block', delta: 5 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 35 点格挡。消耗。', patches: [{ effectIndex: 0, kind: 'block', delta: 10 }] },
    },
  },

  // =========================================================================
  //  NEUTRAL D — 53 张
  // =========================================================================

  // --- 第一批：15 张普通攻/技混合 ---
  nt_d_slash: {
    baseId: 'nt_d_slash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 9 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 11 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }] },
    },
  },
  nt_d_riposte: {
    baseId: 'nt_d_riposte',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 8 点伤害，获得 6 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 10 点伤害，获得 8 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  nt_d_cleave_strike: {
    baseId: 'nt_d_cleave_strike',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '对所有敌人造成 7 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '对所有敌人造成 9 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }] },
    },
  },
  nt_d_double_tap: {
    baseId: 'nt_d_double_tap',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 4 点伤害两次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 5 点伤害两次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 2 }] },
    },
  },
  nt_d_sunder: {
    baseId: 'nt_d_sunder',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 7 点伤害，施加 1 层易伤。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 9 点伤害，施加 2 层易伤。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  nt_d_hinder: {
    baseId: 'nt_d_hinder',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 6 点伤害，施加 1 层虚弱。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 8 点伤害，施加 2 层虚弱。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  nt_d_heavy_slash: {
    baseId: 'nt_d_heavy_slash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 14 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 16 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }] },
    },
  },
  nt_d_quick_guard: {
    baseId: 'nt_d_quick_guard',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 8 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 10 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }] },
    },
  },
  nt_d_momentum_strike: {
    baseId: 'nt_d_momentum_strike',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 8 点伤害。若你有连势，额外造成 3 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 10 点伤害。若你有连势，额外造成 4 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }] },
    },
  },
  nt_d_scan_blow: {
    baseId: 'nt_d_scan_blow',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 6 点伤害，抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 8 点伤害，抽 2 张牌。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'draw', delta: 1 }] },
    },
  },
  nt_d_flank_strike: {
    baseId: 'nt_d_flank_strike',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 10 点伤害。施加 1 层易伤。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 12 点伤害。施加 2 层易伤。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  nt_d_siphon: {
    baseId: 'nt_d_siphon',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 7 点伤害，回复 5 点生命。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 1, kind: 'heal', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 9 点伤害，回复 7 点生命。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'heal', delta: 4 }] },
    },
  },
  nt_d_ward: {
    baseId: 'nt_d_ward',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 6 点格挡，获得 1 层力量。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 8 点格挡，获得 2 层力量。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  nt_d_quick_dash: {
    baseId: 'nt_d_quick_dash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 4 点伤害，获得 4 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 1 }, { effectIndex: 1, kind: 'block', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 5 点伤害，获得 5 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
    },
  },
  nt_d_momentum_tap: {
    baseId: 'nt_d_momentum_tap',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 4 点伤害两次。消耗 1 层连势，每层额外造成 1 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 5 点伤害两次。消耗 1 层连势，每层额外造成 2 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 2 }, { effectIndex: 1, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }] },
    },
  },

  // --- 第二批：15 张普通技能卡 ---
  nt_d_fortify: {
    baseId: 'nt_d_fortify',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 7 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 9 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }] },
    },
  },
  nt_d_iron_wall: {
    baseId: 'nt_d_iron_wall',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 10 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 12 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }] },
    },
  },
  nt_d_glimpse: {
    baseId: 'nt_d_glimpse',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '抽 3 张牌。', patches: [{ effectIndex: 0, kind: 'draw', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '抽 4 张牌。', patches: [{ effectIndex: 0, kind: 'draw', delta: 2 }] },
    },
  },
  nt_d_surge: {
    baseId: 'nt_d_surge',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 1 点能量。', costDelta: -1 },
      2: { nameSuffix: '++', descriptionPatch: '获得 2 点能量。', patches: [{ effectIndex: 0, kind: 'gain_energy', delta: 1 }] },
    },
  },
  nt_d_soothe: {
    baseId: 'nt_d_soothe',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '回复 7 点生命。', patches: [{ effectIndex: 0, kind: 'heal', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '回复 9 点生命。', patches: [{ effectIndex: 0, kind: 'heal', delta: 4 }] },
    },
  },
  nt_d_tenacity: {
    baseId: 'nt_d_tenacity',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 3 层力量。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 4 层力量。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  nt_d_discard_draw: {
    baseId: 'nt_d_discard_draw',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '弃 1 张牌，抽 3 张牌。', patches: [{ effectIndex: 1, kind: 'draw', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '弃 1 张牌，抽 4 张牌。', patches: [{ effectIndex: 1, kind: 'draw', delta: 2 }] },
    },
  },
  nt_d_defense_up: {
    baseId: 'nt_d_defense_up',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 6 点格挡，获得 1 层力量。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 8 点格挡，获得 2 层力量。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  nt_d_momentum_surge: {
    baseId: 'nt_d_momentum_surge',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 3 层连势，抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 4 层连势，抽 2 张牌。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }, { effectIndex: 1, kind: 'draw', delta: 1 }] },
    },
  },
  nt_d_careful_step: {
    baseId: 'nt_d_careful_step',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 5 点格挡，获得 2 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 7 点格挡，获得 3 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  nt_d_inspire: {
    baseId: 'nt_d_inspire',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 2 层力量，抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 3 层力量，抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  nt_d_second_wind: {
    baseId: 'nt_d_second_wind',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 7 点格挡，获得 1 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 9 点格挡，获得 2 层连势。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  nt_d_calibrate: {
    baseId: 'nt_d_calibrate',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '抽 3 张牌，获得 4 点格挡。', patches: [{ effectIndex: 0, kind: 'draw', delta: 1 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '抽 4 张牌，获得 6 点格挡。', patches: [{ effectIndex: 0, kind: 'draw', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  nt_d_cautious_retreat: {
    baseId: 'nt_d_cautious_retreat',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 9 点格挡。消耗。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 11 点格挡。消耗。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }] },
    },
  },
  nt_d_momentum_guard: {
    baseId: 'nt_d_momentum_guard',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得格挡。每层连势额外提供 3 点格挡。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseBlock', delta: 2 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'blockPerStack', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得格挡。每层连势额外提供 4 点格挡。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseBlock', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'blockPerStack', delta: 2 }] },
    },
  },

  // --- 第三批：13 张稀有卡 ---
  nt_d_ricochet: {
    baseId: 'nt_d_ricochet',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '对所有敌人造成 10 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '对所有敌人造成 12 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }] },
    },
  },
  nt_d_flurry: {
    baseId: 'nt_d_flurry',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 5 点伤害三次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 6 点伤害三次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 2 }] },
    },
  },
  nt_d_piercing_thrust: {
    baseId: 'nt_d_piercing_thrust',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 12 点伤害，施加 2 层易伤。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 14 点伤害，施加 3 层易伤。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  nt_d_momentum_cleave: {
    baseId: 'nt_d_momentum_cleave',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 6 点伤害两次。消耗 2 层连势，每层额外造成 2 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 7 点伤害两次。消耗 2 层连势，每层额外造成 3 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 2 }, { effectIndex: 1, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }] },
    },
  },
  nt_d_culling_blow: {
    baseId: 'nt_d_culling_blow',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 16 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 18 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }] },
    },
  },
  nt_d_resilient_block: {
    baseId: 'nt_d_resilient_block',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 12 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 14 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }] },
    },
  },
  nt_d_bolster: {
    baseId: 'nt_d_bolster',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 10 点格挡，获得 2 层力量。', patches: [{ effectIndex: 0, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 12 点格挡，获得 3 层力量。', patches: [{ effectIndex: 0, kind: 'block', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },
  nt_d_momentum_flourish: {
    baseId: 'nt_d_momentum_flourish',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 4 层连势。消耗 1 层连势时额外抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 5 层连势。消耗 1 层连势时额外抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }, { effectIndex: 1, kind: 'custom_param', paramKey: 'baseDraw', delta: 1 }] },
    },
  },
  nt_d_metallicize: {
    baseId: 'nt_d_metallicize',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 3 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 4 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  nt_d_steady_stance: {
    baseId: 'nt_d_steady_stance',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 2 层稳势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 3 层稳势。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  nt_d_overwhelm: {
    baseId: 'nt_d_overwhelm',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 11 点伤害，获得 8 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 13 点伤害，获得 10 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  nt_d_momentum_burst: {
    baseId: 'nt_d_momentum_burst',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 6 点伤害。消耗所有连势，每层额外造成 2 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 8 点伤害。消耗所有连势，每层额外造成 3 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }] },
    },
  },
  nt_d_power_siphon: {
    baseId: 'nt_d_power_siphon',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 10 点伤害。获得 1 层力量。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 12 点伤害。获得 2 层力量。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },

  // --- 第四批：10 张史诗卡 ---
  nt_d_judgement_cut: {
    baseId: 'nt_d_judgement_cut',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 23 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 3 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 26 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 6 }] },
    },
  },
  nt_d_storm_slash: {
    baseId: 'nt_d_storm_slash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 6 点伤害四次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 7 点伤害四次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'value', delta: 2 }] },
    },
  },
  nt_d_momentum_unleash: {
    baseId: 'nt_d_momentum_unleash',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 10 点伤害。消耗所有连势，每层造成额外 4 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 12 点伤害。消耗所有连势，每层造成额外 5 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }] },
    },
  },
  nt_d_annihilation: {
    baseId: 'nt_d_annihilation',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '对所有敌人造成 17 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 3 }] },
      2: { nameSuffix: '++', descriptionPatch: '对所有敌人造成 20 点伤害。', patches: [{ effectIndex: 0, kind: 'damage', delta: 6 }] },
    },
  },
  nt_d_citadel: {
    baseId: 'nt_d_citadel',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 21 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 3 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 24 点格挡。', patches: [{ effectIndex: 0, kind: 'block', delta: 6 }] },
    },
  },
  nt_d_momentum_draw_burst: {
    baseId: 'nt_d_momentum_draw_burst',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '抽 4 张牌。消耗 3 层连势，每层额外抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDraw', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '抽 5 张牌。消耗 3 层连势，每层额外抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDraw', delta: 2 }] },
    },
  },
  nt_d_fortress: {
    baseId: 'nt_d_fortress',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 4 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 5 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
    },
  },
  nt_d_steady_fortification: {
    baseId: 'nt_d_steady_fortification',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 3 层稳势，获得 12 点格挡。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 4 层稳势，获得 14 点格挡。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  nt_d_mighty_blow: {
    baseId: 'nt_d_mighty_blow',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 18 点伤害，获得 10 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 2 }, { effectIndex: 1, kind: 'block', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 20 点伤害，获得 12 点格挡。', patches: [{ effectIndex: 0, kind: 'damage', delta: 4 }, { effectIndex: 1, kind: 'block', delta: 4 }] },
    },
  },
  nt_d_momentum_overflow: {
    baseId: 'nt_d_momentum_overflow',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 6 层力量，获得 2 层连势。消耗。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 7 层力量，获得 3 层连势。消耗。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
    },
  },

  // =========================================================================
  //  LEGENDARY — 15 张
  // =========================================================================

  // --- 守势传说 (5) ---
  guard_legendary_1: {
    baseId: 'guard_legendary_1',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 13 点格挡。若你本回合未消耗连势，额外获得 13 点格挡。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseBlock', delta: 3 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'blockIfNoConsume', delta: 3 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 16 点格挡。若你本回合未消耗连势，额外获得 16 点格挡。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseBlock', delta: 6 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'blockIfNoConsume', delta: 6 }] },
    },
  },
  guard_legendary_2: {
    baseId: 'guard_legendary_2',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 10 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 12 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 4 }] },
    },
  },
  guard_legendary_3: {
    baseId: 'guard_legendary_3',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '消耗所有稳势，每层造成 7 点伤害。消耗所有连势，每层造成 5 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }, { effectIndex: 1, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '消耗所有稳势，每层造成 8 点伤害。消耗所有连势，每层造成 6 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 2 }, { effectIndex: 1, kind: 'custom_param', paramKey: 'damagePerStack', delta: 2 }] },
    },
  },
  guard_legendary_4: {
    baseId: 'guard_legendary_4',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成等同于你格挡值 3 倍的伤害。消耗。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'multiplier', delta: 0.5 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成等同于你格挡值 3.5 倍的伤害。消耗。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'multiplier', delta: 1 }] },
    },
  },
  guard_legendary_5: {
    baseId: 'guard_legendary_5',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 6 点伤害并获得 6 点格挡，重复 4 次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerHit', delta: 1 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'blockPerHit', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 7 点伤害并获得 7 点格挡，重复 4 次。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerHit', delta: 2 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'blockPerHit', delta: 2 }] },
    },
  },

  // --- 爆发传说 (5) ---
  burst_legendary_1: {
    baseId: 'burst_legendary_1',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '消耗所有能量，每点造成 20 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerEnergy', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '消耗所有能量，每点造成 22 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerEnergy', delta: 4 }] },
    },
  },
  burst_legendary_2: {
    baseId: 'burst_legendary_2',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '消耗所有连势，每层造成 6 点伤害。消耗所有破势预热，每层造成 9 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }, { effectIndex: 1, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '消耗所有连势，每层造成 7 点伤害。消耗所有破势预热，每层造成 10 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 2 }, { effectIndex: 1, kind: 'custom_param', paramKey: 'damagePerStack', delta: 2 }] },
    },
  },
  burst_legendary_3: {
    baseId: 'burst_legendary_3',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '消耗 5 点格挡，造成 40 点伤害。消耗。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'bonusDamage', delta: 5 }] },
      2: { nameSuffix: '++', descriptionPatch: '消耗 5 点格挡，造成 45 点伤害。消耗。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'bonusDamage', delta: 10 }] },
    },
  },
  burst_legendary_4: {
    baseId: 'burst_legendary_4',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '消耗所有破势预热，每层造成 7 点伤害并抽 1 张牌。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '消耗所有破势预热，每层造成 8 点伤害并抽 2 张牌。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 2 }, { effectIndex: 1, kind: 'draw', delta: 1 }] },
    },
  },
  burst_legendary_5: {
    baseId: 'burst_legendary_5',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '消耗所有连势，每层造成 3 点伤害并抽 1 张牌。获得 3 点能量。', patches: [{ effectIndex: 1, kind: 'gain_energy', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '消耗所有连势，每层造成 4 点伤害并抽 1 张牌。获得 3 点能量。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }, { effectIndex: 1, kind: 'gain_energy', delta: 1 }] },
    },
  },

  // --- 混合传说 (5) ---
  mixed_legendary_1: {
    baseId: 'mixed_legendary_1',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '消耗 3 层连势，获得 4 点能量。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'energyGain', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '消耗 2 层连势，获得 4 点能量。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'consumeValue', delta: -1 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'energyGain', delta: 1 }] },
    },
  },
  mixed_legendary_2: {
    baseId: 'mixed_legendary_2',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成等同于你金属化层数 2 倍的伤害，然后获得等同于金属化层数的格挡。', patches: [] },
      2: { nameSuffix: '++', descriptionPatch: '造成等同于你金属化层数 3 倍的伤害，然后获得等同于金属化层数的格挡。', patches: [] },
    },
  },
  mixed_legendary_3: {
    baseId: 'mixed_legendary_3',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 10 点伤害。若你有格挡，额外造成 18 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 2 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'bonusDamage', delta: 3 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 12 点伤害。若你有格挡，额外造成 21 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseDamage', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'bonusDamage', delta: 6 }] },
    },
  },
  mixed_legendary_4: {
    baseId: 'mixed_legendary_4',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 4 层连势和 4 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 1 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 5 层连势和 5 层金属化。', patches: [{ effectIndex: 0, kind: 'stacks', delta: 2 }, { effectIndex: 1, kind: 'stacks', delta: 2 }] },
    },
  },
  mixed_legendary_5: {
    baseId: 'mixed_legendary_5',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '消耗所有连势，每层造成 5 点伤害。获得 3 层力量。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }, { effectIndex: 1, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '消耗所有连势，每层造成 6 点伤害。获得 4 层力量。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 2 }, { effectIndex: 1, kind: 'stacks', delta: 2 }] },
    },
  },
  guard_legendary_6: {
    baseId: 'guard_legendary_6',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 18 点格挡。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseBlock', delta: 3 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 22 点格挡。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'baseBlock', delta: 7 }] },
    },
  },
  burst_legendary_6: {
    baseId: 'burst_legendary_6',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '每层造成 6 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '每层造成 7 点伤害。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerStack', delta: 2 }] },
    },
  },
  mixed_legendary_6: {
    baseId: 'mixed_legendary_6',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '造成 10 点伤害并获得 10 点格挡。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerHit', delta: 2 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'blockPerHit', delta: 2 }] },
      2: { nameSuffix: '++', descriptionPatch: '造成 12 点伤害并获得 12 点格挡。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'damagePerHit', delta: 4 }, { effectIndex: 0, kind: 'custom_param', paramKey: 'blockPerHit', delta: 4 }] },
    },
  },
  neutral_legendary_1: {
    baseId: 'neutral_legendary_1',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '抽等量的牌并获得等量格挡。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'drawPerStack', delta: 0 }] },
      2: { nameSuffix: '++', descriptionPatch: '抽等量的牌并获得等量格挡。', patches: [{ effectIndex: 0, kind: 'custom_param', paramKey: 'drawPerStack', delta: 0 }] },
    },
  },
  neutral_legendary_2: {
    baseId: 'neutral_legendary_2',
    levels: {
      1: { nameSuffix: '+', descriptionPatch: '获得 4 层连势和 4 层稳势。', patches: [{ effectIndex: 1, kind: 'stacks', delta: 1 }, { effectIndex: 2, kind: 'stacks', delta: 1 }] },
      2: { nameSuffix: '++', descriptionPatch: '获得 5 层连势和 5 层稳势。', patches: [{ effectIndex: 1, kind: 'stacks', delta: 2 }, { effectIndex: 2, kind: 'stacks', delta: 2 }] },
    },
  },
};
