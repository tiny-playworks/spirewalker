import type { MapNode, MapNodeType } from '../model/map';
const ACT2_ENTRY_NORMAL_IDS = [
  'act2_entry_curse',
  'act2_entry_support',
  'act2_entry_blast',
  'act2_entry_finish',
] as const;

const ACT2_FORMAL_NORMAL_IDS = [
  'act2_normal_combo',
  'act2_normal_reflect',
  'act2_normal_curse',
  'act2_normal_support',
  'act2_normal_blast',
  'act2_normal_disrupt',
] as const;

const ACT2_FORMAL_ELITE_IDS = [
  'act2_elite_open',
  'act2_elite_counter',
  'act2_elite_lock',
] as const;

const ACT2_FORMAL_BOSS_IDS = ['act2_boss_bishop', 'act2_boss_dual'] as const;

export const ACT2_ENTRY_ELITE_ID = 'act2_elite_lock';
export const ACT2_ENTRY_SAFE_BRANCH_ID = 'act2_entry_reflect';
export const ACT2_ENTRY_BOSS_ID = 'act2_boss_bishop';

export type Act2FormalRouteId = 'safe' | 'build' | 'risk';

export interface Act2FormalRouteTemplate {
  id: Act2FormalRouteId;
  name: string;
  summary: string;
  normalEncounterIds: readonly string[];
  eliteEncounterId: string;
  bossEncounterId: string;
  branchAtDepth4: 'rest' | 'shop' | 'both';
  eventNodeId: string;
  eventScriptId: string;
}

/**
 * Act 2 正式短路线。每条路线仍保持 11 层，差异只集中在补给选择、精英风险和
 * 章节事件，便于玩家一眼理解取舍，也便于固定 seed 的自动验证稳定复现。
 */
export const ACT2_FORMAL_ROUTE_TEMPLATES: readonly Act2FormalRouteTemplate[] = [
  {
    id: 'safe',
    name: '稳势回廊',
    summary: '营火与反刺教学优先，适合先把守势循环站稳。',
    normalEncounterIds: [
      'act2_normal_reflect',
      'act2_normal_support',
      'act2_normal_curse',
      'act2_normal_combo',
    ],
    // 统一使用锁牌精英作为首局风险教学，另外两只保留在正式池供后续路线扩展。
    eliteEncounterId: ACT2_ENTRY_ELITE_ID,
    // 双核首领保留在正式池，短路线先用主教完成可读的首局收束。
    bossEncounterId: ACT2_ENTRY_BOSS_ID,
    branchAtDepth4: 'rest',
    eventNodeId: 'a2v_archive_event',
    eventScriptId: 'a2_mirror_archive',
  },
  {
    id: 'build',
    name: '均衡回廊',
    summary: '商店或营火二选一，保留最多的构筑调整空间。',
    normalEncounterIds: [
      'act2_normal_curse',
      'act2_normal_support',
      'act2_normal_blast',
      'act2_normal_combo',
    ],
    eliteEncounterId: ACT2_ENTRY_ELITE_ID,
    bossEncounterId: ACT2_ENTRY_BOSS_ID,
    branchAtDepth4: 'both',
    eventNodeId: 'a2v_burst_altar',
    eventScriptId: 'burst_altar',
  },
  {
    id: 'risk',
    name: '裂响回廊',
    summary: '商亭后直入锁牌精英，以更高压力换取更强奖励节奏。',
    normalEncounterIds: [
      'act2_normal_blast',
      'act2_normal_disrupt',
      'act2_normal_combo',
      'act2_normal_curse',
    ],
    eliteEncounterId: 'act2_elite_lock',
    bossEncounterId: ACT2_ENTRY_BOSS_ID,
    branchAtDepth4: 'shop',
    eventNodeId: 'a2v_oath_event',
    eventScriptId: 'a2_oath_of_silence',
  },
] as const;

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
  routeBias: MapNode['routeBias'] = 'balance',
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
    routeBias,
    ...encounterMetaForType(type, encounterId),
    ...(eventScriptId ? { eventScriptId } : {}),
  };
}

export function act2FormalRouteForSeed(seed: number): Act2FormalRouteTemplate {
  const routeIndex = ((seed ^ 0x2a11ced) >>> 0) % ACT2_FORMAL_ROUTE_TEMPLATES.length;
  return ACT2_FORMAL_ROUTE_TEMPLATES[routeIndex] ?? ACT2_FORMAL_ROUTE_TEMPLATES[1]!;
}

export function act2EntryEncounterWhitelist(): readonly string[] {
  return [
    ...ACT2_ENTRY_NORMAL_IDS,
    ...ACT2_FORMAL_NORMAL_IDS,
    ...ACT2_FORMAL_ELITE_IDS,
    ...ACT2_FORMAL_BOSS_IDS,
    ACT2_ENTRY_SAFE_BRANCH_ID,
  ];
}

export function buildAct2EntryValidationMap(
  seed: number,
  routeId?: Act2FormalRouteId,
): Record<string, MapNode> {
  const route = routeId
    ? ACT2_FORMAL_ROUTE_TEMPLATES.find((candidate) => candidate.id === routeId)
      ?? act2FormalRouteForSeed(seed)
    : act2FormalRouteForSeed(seed);
  const [slotA, slotB, slotC, slotD] = route.normalEncounterIds;
  const branchAtDepth4 = route.branchAtDepth4 === 'both'
    ? ['a2v_shop', 'a2v_rest']
    : route.branchAtDepth4 === 'shop'
      ? ['a2v_shop']
      : ['a2v_rest'];
  // 第二个分岔始终保留安全/风险两项，让玩家可以主动改变模板建议；
  // route.id 只改变默认遭遇与前段供给，不把玩家锁死在单一路线。
  const branchAtDepth6 = ['a2v_safe_branch', 'a2v_risk_elite'];

  const nodes: Record<string, MapNode> = {
    a2v_start: createNode('a2v_start', 1, 3, 'event', ['a2v_battle_a'], null, 'a2_mirror_archive', 'balance'),
    a2v_battle_a: createNode('a2v_battle_a', 2, 3, 'battle', ['a2v_battle_b'], slotA, null, route.id === 'safe' ? 'safe' : 'balance'),
    a2v_battle_b: createNode('a2v_battle_b', 3, 3, 'battle', branchAtDepth4, slotB, null, route.id === 'risk' ? 'risk' : 'balance'),
    a2v_shop: createNode('a2v_shop', 4, 2, 'shop', ['a2v_battle_c'], null, null, 'risk'),
    a2v_rest: createNode('a2v_rest', 4, 4, 'rest', ['a2v_battle_c'], null, null, 'safe'),
    a2v_battle_c: createNode('a2v_battle_c', 5, 3, 'battle', branchAtDepth6, slotC, null, route.id === 'risk' ? 'risk' : 'balance'),
    a2v_safe_branch: createNode('a2v_safe_branch', 6, 2, 'battle', ['a2v_battle_d'], ACT2_ENTRY_SAFE_BRANCH_ID, null, 'safe'),
    a2v_risk_elite: createNode('a2v_risk_elite', 6, 4, 'elite', ['a2v_battle_d'], route.eliteEncounterId, null, 'risk'),
    a2v_battle_d: createNode('a2v_battle_d', 7, 3, 'battle', [route.eventNodeId], slotD, null, route.id === 'risk' ? 'risk' : 'balance'),
    a2v_burst_altar: createNode('a2v_burst_altar', 8, 3, 'event', ['a2v_treasure'], null, 'burst_altar', 'balance'),
    a2v_archive_event: createNode('a2v_archive_event', 8, 2, 'event', ['a2v_treasure'], null, 'a2_mirror_archive', 'safe'),
    a2v_oath_event: createNode('a2v_oath_event', 8, 4, 'event', ['a2v_treasure'], null, 'a2_oath_of_silence', 'risk'),
    a2v_treasure: createNode('a2v_treasure', 9, 3, 'treasure', ['a2v_rest_before_boss']),
    a2v_rest_before_boss: createNode('a2v_rest_before_boss', 10, 3, 'rest', ['a2v_boss_silence']),
    a2v_boss_silence: createNode('a2v_boss_silence', 11, 3, 'boss', [], route.bossEncounterId),
  };

  nodes.a2v_start!.visited = true;
  return nodes;
}
