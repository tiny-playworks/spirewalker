import { buildFloor2Nodes } from '../engine/createMapRun';
import { generateBranchingFloorMap } from '../engine/generateBranchingFloor';
import type { RunState } from '../model/run';
import { RUN_SAVE_VERSION } from './saveVersion';

/** 固定 id 的旧版单层线性图；载入时整图替换为当前分支生成器结果。 */
const LEGACY_NODE_IDS = new Set([
  'start',
  'battle_a',
  'shop_1',
  'event_1',
  'rest_1',
  'battle_b',
  'boss',
  'f2_start',
  'f2_battle',
  'f2_rest',
  'f2_elite',
  'f2_boss',
]);

export function isLegacyLinearMap(nodes: Record<string, { id: string }>): boolean {
  return Object.keys(nodes).some((id) => LEGACY_NODE_IDS.has(id));
}

/**
 * 将旧版地图换成 seed 驱动的分支图，当前回营地、仅营地已访问。
 * 若当时不在地图屏，会清掉战斗/商店/奖励子状态以免引用旧节点 id（一次性代价）。
 */
export function migrateLegacyLinearMapInPlace(run: RunState): void {
  const floor = run.meta.floor;
  const nodes =
    floor === 1
      ? generateBranchingFloorMap(1, run.seed >>> 0)
      : buildFloor2Nodes((run.seed ^ 0xaced) >>> 0);
  const camp = Object.keys(nodes).find((id) => nodes[id]!.x === 0) ?? Object.keys(nodes)[0]!;
  for (const id of Object.keys(nodes)) {
    nodes[id]!.visited = id === camp;
  }
  run.map = { nodes, currentNodeId: camp };
  if (run.screen.type !== 'map') {
    run.screen = { type: 'map' };
    run.battle = undefined;
    run.shop = undefined;
    run.reward = undefined;
  }
  run.saveVersion = RUN_SAVE_VERSION;
}
