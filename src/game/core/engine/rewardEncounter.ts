import type { RunState } from '../model/run';
import type { RewardEncounterTier } from './generateRewardChoices';

/** 由当前地图节点推断战后奖励档位（与 `leaveBattleToReward` 一致） */
export function rewardEncounterTierFromRun(run: RunState): RewardEncounterTier {
  const id = run.map.currentNodeId;
  const node = id ? run.map.nodes[id] : undefined;
  if (node?.type === 'boss') return 'boss';
  if (node?.type === 'elite') return 'elite';
  return 'normal';
}
