/** Act 2 正式奖励内容。其余批量生成卡牌不进入运行时奖励池。 */
export const ACT2_REWARD_CARD_IDS = [
  'a2_guard_iron_bastion',
  'a2_guard_reinforced_edge',
  'a2_guard_steel_ritual',
  'a2_guard_anchor_line',
  'a2_burst_rupture',
  'a2_burst_triple_cut',
  'a2_burst_overdrive',
  'a2_burst_rebound',
  'a2_mixed_flow_guard',
  'a2_mixed_balance',
  'a2_mixed_guarded_draw',
  'a2_mixed_relay_strike',
] as const;

export const ACT2_FORMAL_REWARD_CARD_IDS = new Set<string>(ACT2_REWARD_CARD_IDS);

export const ACT2_FORMAL_NORMAL_ENCOUNTER_IDS = [
  'act2_normal_combo',
  'act2_normal_reflect',
  'act2_normal_curse',
  'act2_normal_support',
  'act2_normal_blast',
  'act2_normal_disrupt',
] as const;

export const ACT2_FORMAL_ELITE_ENCOUNTER_IDS = [
  'act2_elite_open',
  'act2_elite_counter',
  'act2_elite_lock',
] as const;

export const ACT2_FORMAL_BOSS_ENCOUNTER_IDS = [
  'act2_boss_bishop',
  'act2_boss_dual',
] as const;
