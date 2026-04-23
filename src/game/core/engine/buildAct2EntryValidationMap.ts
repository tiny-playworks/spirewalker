import type { MapNode, MapNodeType } from '../model/map';
import { mulberry32 } from '../utils/rng';

const ACT2_ENTRY_NORMAL_IDS = [
  'act2_normal_reflect',
  'act2_normal_curse',
  'act2_normal_support',
  'act2_normal_blast',
] as const;

export const ACT2_ENTRY_ELITE_ID = 'act2_elite_lock';
export const ACT2_ENTRY_SAFE_BRANCH_ID = 'act2_normal_reflect';

type Act2EntryNormalEncounterId = typeof ACT2_ENTRY_NORMAL_IDS[number];

type EncounterMeta = Pick<MapNode, 'encounterTier' | 'encounterPoolId' | 'encounterId'>;

function encounterMetaForType(
  type: MapNodeType,
  encounterId: string | null = null,
): EncounterMeta {
  if (type === 'battle') {
    return {
      encounterTier: 'normal',
      encounterPoolId: encounterId ? null : 'act_2_normal',
      encounterId,
    };
  }
  if (type === 'elite') {
    return {
      encounterTier: 'elite',
      encounterPoolId: encounterId ? null : 'act_2_elite',
      encounterId,
    };
  }
  return { encounterTier: 'none', encounterPoolId: null, encounterId: null };
}

function createNode(
  id: string,
  depth: number,
  y: number,
  type: MapNodeType,
  nextNodeIds: string[],
  encounterId: string | null = null,
): MapNode {
  return {
    id,
    act: 2,
    depth,
    floor: 2,
    x: depth - 1,
    y,
    type,
    nextNodeIds,
    visited: false,
    routeBias: 'balance',
    ...encounterMetaForType(type, encounterId),
  };
}

function isScaleSupportEncounter(encounterId: Act2EntryNormalEncounterId): boolean {
  return encounterId === 'act2_normal_support';
}

function isCountdownEncounter(encounterId: Act2EntryNormalEncounterId): boolean {
  return encounterId === 'act2_normal_blast';
}

function isLegalSequence(sequence: readonly Act2EntryNormalEncounterId[]): boolean {
  const [slotA, slotB, slotC, slotD] = sequence;
  if (!slotA || !slotB || !slotC || !slotD) return false;
  if (slotA === slotB) return false;
  if (slotA === 'act2_normal_blast' || slotB === 'act2_normal_blast') return false;
  if (isCountdownEncounter(slotA)) return false;
  if (isScaleSupportEncounter(slotA) && isScaleSupportEncounter(slotB)) return false;
  if (isScaleSupportEncounter(slotB) && isScaleSupportEncounter(slotC)) return false;
  if (isScaleSupportEncounter(slotC) && isScaleSupportEncounter(slotD)) return false;
  return true;
}

function permute<T>(items: readonly T[]): T[][] {
  if (items.length <= 1) return [items.slice() as T[]];
  const out: T[][] = [];
  for (let index = 0; index < items.length; index += 1) {
    const current = items[index]!;
    const rest = items.filter((_, itemIndex) => itemIndex !== index);
    for (const tail of permute(rest)) out.push([current, ...tail]);
  }
  return out;
}

function buildLegalSequences(): Act2EntryNormalEncounterId[][] {
  return permute(ACT2_ENTRY_NORMAL_IDS).filter((sequence) => isLegalSequence(sequence));
}

const ACT2_ENTRY_LEGAL_SEQUENCES = buildLegalSequences();

if (ACT2_ENTRY_LEGAL_SEQUENCES.length === 0) {
  throw new Error('act2 entry validation map has no legal normal encounter layouts');
}

export function act2EntryEncounterWhitelist(): readonly string[] {
  return [...ACT2_ENTRY_NORMAL_IDS, ACT2_ENTRY_ELITE_ID];
}

export function buildAct2EntryValidationMap(seed: number): Record<string, MapNode> {
  const rng = mulberry32((seed ^ 0x2a11ced) >>> 0);
  const layout = ACT2_ENTRY_LEGAL_SEQUENCES[Math.floor(rng() * ACT2_ENTRY_LEGAL_SEQUENCES.length)]!;
  const [slotA, slotB, slotC, slotD] = layout;

  const nodes: Record<string, MapNode> = {
    a2v_start: createNode('a2v_start', 1, 3, 'event', ['a2v_battle_a']),
    a2v_battle_a: createNode('a2v_battle_a', 2, 3, 'battle', ['a2v_battle_b'], slotA),
    a2v_battle_b: createNode('a2v_battle_b', 3, 3, 'battle', ['a2v_shop', 'a2v_rest'], slotB),
    a2v_shop: createNode('a2v_shop', 4, 2, 'shop', ['a2v_battle_c']),
    a2v_rest: createNode('a2v_rest', 4, 4, 'rest', ['a2v_battle_c']),
    a2v_battle_c: createNode('a2v_battle_c', 5, 3, 'battle', ['a2v_safe_branch', 'a2v_risk_elite'], slotC),
    a2v_safe_branch: createNode('a2v_safe_branch', 6, 2, 'battle', ['a2v_battle_d'], ACT2_ENTRY_SAFE_BRANCH_ID),
    a2v_risk_elite: createNode('a2v_risk_elite', 6, 4, 'elite', ['a2v_battle_d'], ACT2_ENTRY_ELITE_ID),
    a2v_battle_d: createNode('a2v_battle_d', 7, 3, 'battle', [], slotD),
  };

  nodes.a2v_start!.visited = true;
  return nodes;
}
