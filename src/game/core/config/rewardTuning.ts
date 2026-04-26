/**
 * 奖励卡池流派权重倾斜（创始人反馈 #8 / 计划 §3.4②）。
 * 仅影响 `generateRewardChoices` 的加权抽样，不改变任何规则结算。
 * `RunState.meta.rewardArchetypeTiltEnabled === false` 可在单局内关闭（优先级高于本全局开关）。
 */
export const REWARD_ARCHETYPE_TILT_ENABLED = true;

export function isRewardArchetypeTiltEnabled(meta?: { rewardArchetypeTiltEnabled?: boolean }): boolean {
  if (!REWARD_ARCHETYPE_TILT_ENABLED) return false;
  if (meta?.rewardArchetypeTiltEnabled === false) return false;
  return true;
}
