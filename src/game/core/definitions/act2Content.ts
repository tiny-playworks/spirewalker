/** Act 2 正式奖励内容。其余批量生成卡牌不进入运行时奖励池。 */
export const ACT2_REWARD_CARD_IDS = [
  'a2_guard_iron_bastion',
  'a2_guard_reinforced_edge',
  'a2_burst_rupture',
  'a2_burst_triple_cut',
  'a2_mixed_flow_guard',
  'a2_mixed_balance',
] as const;

export const ACT2_FORMAL_REWARD_CARD_IDS = new Set<string>(ACT2_REWARD_CARD_IDS);

