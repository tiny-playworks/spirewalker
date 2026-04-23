import { DEFAULT_CHARACTER_ID, getCharacterDefinition } from '../definitions/characters';
import type { MapAct, MapNode } from '../model/map';
import { createEmptyEncounterHistory, type RunState } from '../model/run';
import { RUN_SAVE_VERSION } from '../persistence/saveVersion';
import { resetIdCounter } from '../utils/id';
import { buildAct2EntryValidationMap } from './buildAct2EntryValidationMap';
import { ACT_FLOOR_COUNTS, generateActMap, globalFloorFor } from './generateBranchingFloor';
import { createStarterMasterDeck } from './starterDeck';

export function buildActNodes(act: MapAct, seed = 0): Record<string, MapNode> {
  return generateActMap(act, seed >>> 0);
}

export function buildFloor2Nodes(seed = 0): Record<string, MapNode> {
  return buildActNodes(2, seed);
}

export function buildAct2EntryNodes(seed = 0): Record<string, MapNode> {
  return buildAct2EntryValidationMap(seed);
}

export function createMapRun(seed: number): RunState {
  resetIdCounter();
  const character = getCharacterDefinition(DEFAULT_CHARACTER_ID);
  const masterDeck = createStarterMasterDeck(character.id);
  const nodes = buildActNodes(1, seed >>> 0);
  const startId = Object.keys(nodes).find((id) => nodes[id]!.depth === 1) ?? Object.keys(nodes)[0]!;
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
      act: 1,
      actFloor: 1,
      floor: globalFloorFor(1, 1),
      gold: 0,
      characterId: character.id,
      relics: [...character.startingRelics],
      potions: [...character.startingPotions],
      encounterHistory: createEmptyEncounterHistory(),
      validationCompleted: false,
      enteredAct2EliteBranch: false,
    },
  };
}

export function isLastAct(act: MapAct): boolean {
  return act === 3;
}

export function actFloorCount(act: MapAct): number {
  return ACT_FLOOR_COUNTS[act];
}
