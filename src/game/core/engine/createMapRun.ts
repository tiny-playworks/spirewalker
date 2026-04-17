import type { MapNode } from '../model/map';
import type { RunState } from '../model/run';
import { RUN_SAVE_VERSION } from '../persistence/saveVersion';
import { resetIdCounter } from '../utils/id';
import { generateBranchingFloorMap } from './generateBranchingFloor';
import { createStarterMasterDeck } from './starterDeck';

/** 第二层地图（分支）；`seed` 不同则岔路与房间类型分布不同。 */
export function buildFloor2Nodes(seed = 0): Record<string, MapNode> {
  return generateBranchingFloorMap(2, seed >>> 0);
}

export function createMapRun(seed: number): RunState {
  resetIdCounter();
  const masterDeck = createStarterMasterDeck();
  const nodes = generateBranchingFloorMap(1, seed >>> 0);
  const startId = Object.keys(nodes).find((id) => nodes[id]!.x === 0) ?? Object.keys(nodes)[0]!;
  return {
    saveVersion: RUN_SAVE_VERSION,
    seed,
    player: { maxHp: 50, currentHp: 50 },
    masterDeck,
    map: {
      nodes,
      currentNodeId: startId,
    },
    screen: { type: 'map' },
    meta: { floor: 1, gold: 0, relics: [], potions: ['healing_dew'] },
  };
}
