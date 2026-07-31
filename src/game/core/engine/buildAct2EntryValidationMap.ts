import type { MapNode, MapNodeType } from '../model/map';
import { mulberry32 } from '../utils/rng';

const ACT2_ENTRY_NORMAL_IDS = [
  'act2_entry_curse',
  'act2_entry_support',
  'act2_entry_blast',
  'act2_entry_finish',
] as const;

export const ACT2_ENTRY_ELITE_ID = 'act2_elite_lock';
export const ACT2_ENTRY_SAFE_BRANCH_ID = 'act2_entry_reflect';
export const ACT2_ENTRY_BOSS_ID = 'act2_boss_bishop';

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
  if (type === 'boss') {
    return {
      encounterTier: 'boss',
      encounterPoolId: encounterId ? null : 'act_2_boss',
      encounterId,
    };
  }
  if (type === 'treasure') {
    return {
      encounterTier: 'treasure',
      encounterPoolId: 'act_2_treasure',
      encounterId: null,
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
  eventScriptId: string | null = null,
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
    ...(eventScriptId ? { eventScriptId } : {}),
  };
}

// 序章先教一个机制，再进入下一机制；避免反刺、倒计时和锁牌在同一场过早叠加。
// 保留 seed 参数用于地图稳定性，但路线结构本身固定，便于调试和玩家形成预期。
const ACT2_ENTRY_LEGAL_SEQUENCES = [
  ['act2_entry_curse', 'act2_entry_support', 'act2_entry_blast', 'act2_entry_finish'],
] satisfies Act2EntryNormalEncounterId[][];

if (ACT2_ENTRY_LEGAL_SEQUENCES.length === 0) {
  throw new Error('act2 entry validation map has no legal normal encounter layouts');
}

export function act2EntryEncounterWhitelist(): readonly string[] {
  return [
    ...ACT2_ENTRY_NORMAL_IDS,
    ACT2_ENTRY_SAFE_BRANCH_ID,
    ACT2_ENTRY_ELITE_ID,
    ACT2_ENTRY_BOSS_ID,
  ];
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
    a2v_battle_d: createNode('a2v_battle_d', 7, 3, 'battle', ['a2v_burst_altar'], slotD),
    a2v_burst_altar: createNode('a2v_burst_altar', 8, 3, 'event', ['a2v_treasure'], null, 'burst_altar'),
    a2v_treasure: createNode('a2v_treasure', 9, 3, 'treasure', ['a2v_rest_before_boss']),
    a2v_rest_before_boss: createNode('a2v_rest_before_boss', 10, 3, 'rest', ['a2v_boss_silence']),
    a2v_boss_silence: createNode('a2v_boss_silence', 11, 3, 'boss', [], 'act2_boss_bishop'),
  };

  nodes.a2v_start!.visited = true;
  return nodes;
}
