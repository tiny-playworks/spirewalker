/** Act 1 正式可获得内容。大型生成库仍供图鉴与调试使用。 */
export const ACT1_REWARD_CARD_IDS = [
  // 守势 × 10
  'brace_rhythm', 'soft_step', 'held_breath', 'guard_strike_1', 'stable_mind',
  'patient_cut', 'anchor_slash', 'guard_strike', 'fortify', 'patience_stance',
  // 爆发 × 10
  'burst_strike', 'snap_strike', 'quick_release', 'follow_through', 'break_opening',
  'full_release', 'overload', 'blood_rush', 'burst_common_skill_1', 'burst_common_atk_1',
  // 混合 × 10
  'momentum', 'tempo_guard', 'prime_rhythm', 'cash_flow', 'release_flow',
  'flow_shift', 'balance_edge', 'mixed_common_atk_1', 'mixed_common_skill_1', 'mixed_common_power_1',
  // 通用 × 6
  'bash', 'flex', 'cleave', 'surge', 'skim', 'measured_rest',
] as const;

export const ACT1_ENCOUNTER_IDS = {
  normal: [
    'act1_normal_press', 'act1_normal_split', 'act1_normal_multi',
    'act1_normal_drain', 'act1_normal_shell', 'act1_normal_scale',
    'act1_normal_tax', 'act1_normal_heavy', 'act1_normal_reactive',
  ],
  elite: ['act1_elite_open', 'act1_elite_heavy', 'act1_elite_double', 'act1_elite_control'],
  boss: ['act1_boss_hive', 'act1_boss_gate'],
} as const;

export const ACT1_FORMAL_ENCOUNTER_IDS = new Set<string>([
  ...ACT1_ENCOUNTER_IDS.normal,
  ...ACT1_ENCOUNTER_IDS.elite,
  ...ACT1_ENCOUNTER_IDS.boss,
]);
