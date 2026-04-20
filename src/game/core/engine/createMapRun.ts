import { DEFAULT_CHARACTER_ID, getCharacterDefinition } from '../definitions/characters';
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
  const character = getCharacterDefinition(DEFAULT_CHARACTER_ID);
  const masterDeck = createStarterMasterDeck(character.id);
  const nodes = generateBranchingFloorMap(1, seed >>> 0);
  const startId = Object.keys(nodes).find((id) => nodes[id]!.x === 0) ?? Object.keys(nodes)[0]!;
  return {
    saveVersion: RUN_SAVE_VERSION,
    seed,
    player: { maxHp: character.baseMaxHp, currentHp: character.baseMaxHp },
    masterDeck,
    map: {
      nodes,
      currentNodeId: startId,
    },
    screen: { type: 'map' },
    meta: {
      floor: 1,
      gold: 0,
      characterId: character.id,
      relics: [...character.startingRelics],
      potions: [...character.startingPotions],
    },
  };
}
