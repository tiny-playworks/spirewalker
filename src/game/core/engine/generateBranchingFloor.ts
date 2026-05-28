import type { MapAct, MapNode, MapNodeType, MapRouteBias } from '../model/map';
import { PILOT_EVENT_IDS } from '../systems/event/eventRuntime';
import { mulberry32 } from '../utils/rng';

export const WANDERING_MERCHANT_EVENT_ID = 'wandering_merchant';
export const STILLNESS_SHRINE_EVENT_ID = 'stillness_shrine';
export const BURST_ALTAR_EVENT_ID = 'burst_altar';
export const PURGING_POOL_EVENT_ID = 'purging_pool';

/**
 * 每章总深度（含 Boss 层与倒数第 2 层固定休息）。
 *
 * - Act1 已按创始人测试反馈缩短：14 -> 12（约 -14%），节奏与旧版「缩到 14」再压一档。
 * - Act2 / Act3 暂不动，保持多 seed 长跑数据可比。
 */
export const ACT_FLOOR_COUNTS: Record<MapAct, number> = {
  1: 12,
  2: 24,
  3: 26,
};

export const MAP_MAX_ROW = 6;

const MAP_CENTER_ROW = 3;
const FIRST_STEP_ROWS = [1, 2, 4, 5] as const;
const CROSS_LINK_CHANCE = 0.3;
const EARLY_ELITE_PROTECTION_DEPTH = 4;
const ELITE_DEPTH_GAP = 5;
const EVENT_CHAIN_LIMIT = 2;
const SAFE_SUPPLY_CHAIN_LIMIT = 1;
const SOFT_SUPPLY_PITY_START = 6;

const ACT_START_FLOOR: Record<MapAct, number> = {
  1: 1,
  2: 21,
  3: 45,
};

const PATH_BIASES: readonly MapRouteBias[] = ['risk', 'balance', 'balance', 'safe'];

const BIAS_ANCHOR_ROW: Record<MapRouteBias, number> = {
  risk: 1,
  balance: MAP_CENTER_ROW,
  safe: 5,
};

const EVENT_POOLS: Record<MapAct, string[]> = {
  1: [WANDERING_MERCHANT_EVENT_ID, STILLNESS_SHRINE_EVENT_ID, ...PILOT_EVENT_IDS],
  2: [BURST_ALTAR_EVENT_ID, PURGING_POOL_EVENT_ID, STILLNESS_SHRINE_EVENT_ID],
  3: [BURST_ALTAR_EVENT_ID, PURGING_POOL_EVENT_ID, WANDERING_MERCHANT_EVENT_ID],
};

type Phase = 'early' | 'mid' | 'late';
type WeightedNodeType = Exclude<MapNodeType, 'boss' | 'treasure'>;
type GeneratedPath = {
  bias: MapRouteBias;
  rows: number[];
};

const PHASE_WEIGHTS: Record<Phase, Record<WeightedNodeType, number>> = {
  early: {
    battle: 72,
    elite: 2,
    event: 18,
    shop: 3,
    rest: 5,
  },
  mid: {
    battle: 45,
    elite: 15,
    event: 20,
    shop: 10,
    rest: 10,
  },
  late: {
    battle: 40,
    elite: 25,
    event: 10,
    shop: 10,
    rest: 15,
  },
};

const BIAS_WEIGHT_DELTA: Record<MapRouteBias, Partial<Record<WeightedNodeType, number>>> = {
  risk: {
    battle: 8,
    elite: 10,
    event: -2,
    shop: -3,
    rest: -8,
  },
  balance: {},
  safe: {
    battle: -2,
    elite: -10,
    event: 1,
    shop: 5,
    rest: 6,
  },
};

const BIAS_SCORE: Record<MapRouteBias, number> = {
  risk: -1,
  balance: 0,
  safe: 1,
};

function nodeId(act: MapAct, depth: number, row: number): string {
  return `a${act}_d${depth}_r${row}`;
}

export function globalFloorFor(act: MapAct, depth: number): number {
  return ACT_START_FLOOR[act] + depth - 1;
}

function clampRow(row: number): number {
  return Math.max(0, Math.min(MAP_MAX_ROW, row));
}

function biasForAverageScore(score: number): MapRouteBias {
  if (score <= -0.35) return 'risk';
  if (score >= 0.35) return 'safe';
  return 'balance';
}

function phaseForDepth(depth: number, totalDepth: number): Phase {
  // Act1 被缩短到 12 层后，纯比例判定会让 depth=4 掉到 mid，从而在前 4 层出现 shop/rest。
  // 明确保证前 4 层始终按 early 相权处理，避免早期补给/精英穿插破坏节奏目标。
  if (depth <= EARLY_ELITE_PROTECTION_DEPTH) return 'early';
  const ratio = depth / Math.max(1, totalDepth);
  if (ratio <= 0.3) return 'early';
  if (ratio <= 0.7) return 'mid';
  return 'late';
}

function lateRiskStartDepth(totalDepth: number): number {
  return Math.max(6, Math.ceil(totalDepth * 0.8));
}

function idealRowFor(depth: number, totalDepth: number, bias: MapRouteBias): number {
  if (depth >= totalDepth - 4) return MAP_CENTER_ROW;
  return BIAS_ANCHOR_ROW[bias];
}

function nudgeToward(current: number, target: number, chance: number, rnd: () => number): number {
  if (current === target || rnd() >= chance) return current;
  return current + Math.sign(target - current);
}

function generatePathRows(
  totalDepth: number,
  bias: MapRouteBias,
  startRow: number,
  rnd: () => number,
): number[] {
  const rows: number[] = [];
  let current = startRow;
  for (let depth = 2; depth <= totalDepth - 2; depth++) {
    if (depth > 2) {
      current = clampRow(current + Math.floor(rnd() * 3) - 1);
      current = clampRow(nudgeToward(current, idealRowFor(depth, totalDepth, bias), 0.45, rnd));
      if (depth >= totalDepth - 2) {
        // 只在最后一个内容层（depth = totalDepth - 2）再强制向中心合拢，
        // 确保前中段不同路线保持自己的行，避免 safe 路被迫共享 risk 路上的精英节点。
        current = clampRow(nudgeToward(current, MAP_CENTER_ROW, 0.75, rnd));
      }
    }
    rows.push(current);
  }
  return rows;
}

function encounterMetaForType(type: MapNodeType, act: MapAct): Pick<MapNode, 'encounterTier' | 'encounterPoolId' | 'encounterId'> {
  if (type === 'battle') return { encounterTier: 'normal', encounterPoolId: `act_${act}_normal`, encounterId: null };
  if (type === 'elite') return { encounterTier: 'elite', encounterPoolId: `act_${act}_elite`, encounterId: null };
  if (type === 'boss') return { encounterTier: 'boss', encounterPoolId: `act_${act}_boss`, encounterId: null };
  if (type === 'treasure') return { encounterTier: 'treasure', encounterPoolId: `act_${act}_treasure`, encounterId: null };
  return { encounterTier: 'none', encounterPoolId: null, encounterId: null };
}

function addEdge(nodes: Record<string, MapNode>, fromId: string, toId: string): void {
  if (fromId === toId) return;
  const from = nodes[fromId];
  if (!from) return;
  if (from.nextNodeIds.includes(toId)) return;
  if (from.x > 0 && from.nextNodeIds.length >= 3) return;
  from.nextNodeIds.push(toId);
}

function isSupplyType(type: MapNodeType): boolean {
  return type === 'shop' || type === 'rest';
}

function applySoftGuarantees(
  weights: Record<WeightedNodeType, number>,
  depth: number,
  totalDepth: number,
  sinceShop: number,
  sinceRest: number,
): void {
  if (depth >= totalDepth - 2) return;
  if (sinceShop >= SOFT_SUPPLY_PITY_START) {
    weights.shop += 6 + (sinceShop - SOFT_SUPPLY_PITY_START) * 4;
    weights.battle = Math.max(8, weights.battle - 4);
  }
  if (sinceRest >= SOFT_SUPPLY_PITY_START) {
    weights.rest += 7 + (sinceRest - SOFT_SUPPLY_PITY_START) * 4;
    weights.battle = Math.max(8, weights.battle - 4);
  }
}

function openingTypeForDepth(depth: number, routeBias: MapRouteBias, rnd: () => number): WeightedNodeType {
  if (depth <= 2) return 'battle';
  if (depth === 3) return rnd() < 0.18 && routeBias !== 'risk' ? 'event' : 'battle';
  if (depth === 4) {
    if (routeBias === 'risk') return rnd() < 0.16 ? 'event' : 'battle';
    if (routeBias === 'safe') return rnd() < 0.28 ? 'event' : 'battle';
    return rnd() < 0.24 ? 'event' : 'battle';
  }
  return 'battle';
}

function chooseWeightedType(
  depth: number,
  totalDepth: number,
  routeBias: MapRouteBias,
  lastEliteDepth: number,
  sinceShop: number,
  sinceRest: number,
  previousType: MapNodeType | null,
  rnd: () => number,
): WeightedNodeType {
  if (depth <= 4) return openingTypeForDepth(depth, routeBias, rnd);
  const baseWeights = { ...PHASE_WEIGHTS[phaseForDepth(depth, totalDepth)] };
  const delta = BIAS_WEIGHT_DELTA[routeBias];
  for (const key of Object.keys(delta) as WeightedNodeType[]) {
    baseWeights[key] = Math.max(0, baseWeights[key] + (delta[key] ?? 0));
  }
  applySoftGuarantees(baseWeights, depth, totalDepth, sinceShop, sinceRest);
  if (depth <= EARLY_ELITE_PROTECTION_DEPTH || depth - lastEliteDepth < ELITE_DEPTH_GAP) {
    baseWeights.elite = 0;
  }
  if (previousType === 'shop') {
    baseWeights.shop = 0;
    baseWeights.rest = Math.max(0, baseWeights.rest - 4);
  }
  if (previousType === 'rest') {
    baseWeights.rest = 0;
    baseWeights.shop = Math.max(0, baseWeights.shop - 4);
  }
  if (routeBias === 'safe' && isSupplyType(previousType ?? 'battle')) {
    baseWeights.shop = 0;
    baseWeights.rest = 0;
    baseWeights.event += 2;
    baseWeights.battle += 3;
  }
  const totalWeight = Object.values(baseWeights).reduce((sum, value) => sum + value, 0);
  let roll = rnd() * totalWeight;
  for (const type of Object.keys(baseWeights) as WeightedNodeType[]) {
    roll -= baseWeights[type];
    if (roll <= 0) return type;
  }
  return 'battle';
}

function pickChunkCandidate(
  nodes: MapNode[],
  preferredBiases: MapRouteBias[],
  blockedTypes: MapNodeType[],
): MapNode | undefined {
  return nodes
    .filter((node) => !blockedTypes.includes(node.type))
    .sort((a, b) => {
      const biasDelta =
        preferredBiases.indexOf(a.routeBias ?? 'balance') - preferredBiases.indexOf(b.routeBias ?? 'balance');
      if (biasDelta !== 0) return biasDelta;
      return a.depth - b.depth;
    })[0];
}

function ensureEventFallback(allNodes: MapNode[]): void {
  const eventExists = allNodes.some((node) => node.type === 'event');
  if (eventExists) return;
  const fallback =
    pickChunkCandidate(allNodes, ['balance', 'safe', 'risk'], ['boss', 'rest', 'shop', 'treasure']) ??
    pickChunkCandidate(allNodes, ['balance', 'safe', 'risk'], ['boss', 'treasure']);
  if (fallback) fallback.type = 'event';
}

function breakEventChains(nodes: MapNode[], totalDepth: number): void {
  const byBias: Record<MapRouteBias, MapNode[]> = {
    risk: [],
    balance: [],
    safe: [],
  };
  for (const node of nodes) {
    if (node.type !== 'event') continue;
    byBias[node.routeBias ?? 'balance'].push(node);
  }
  for (const bias of Object.keys(byBias) as MapRouteBias[]) {
    const depths = [...new Set(byBias[bias].map((node) => node.depth))].sort((a, b) => a - b);
    let previousDepth = -99;
    let streak = 0;
    for (const depth of depths) {
      streak = depth === previousDepth + 1 ? streak + 1 : 1;
      if (streak > EVENT_CHAIN_LIMIT) {
        for (const node of nodes) {
          if (node.routeBias !== bias || node.depth !== depth || node.type !== 'event') continue;
          node.type = depth >= lateRiskStartDepth(totalDepth) && bias === 'risk' ? 'elite' : 'battle';
        }
        previousDepth = -99;
        streak = 0;
        continue;
      }
      previousDepth = depth;
    }
  }
}

function enforceSupplySpacing(nodes: MapNode[]): void {
  const byBias: Record<MapRouteBias, MapNode[]> = {
    risk: [],
    balance: [],
    safe: [],
  };
  for (const node of nodes) {
    byBias[node.routeBias ?? 'balance'].push(node);
  }
  for (const bias of Object.keys(byBias) as MapRouteBias[]) {
    const ordered = byBias[bias].sort((a, b) => a.depth - b.depth || a.y - b.y);
    let supplyChain = 0;
    for (const node of ordered) {
      if (!isSupplyType(node.type)) {
        supplyChain = 0;
        continue;
      }
      supplyChain += 1;
      if (supplyChain <= SAFE_SUPPLY_CHAIN_LIMIT) continue;
      node.type = bias === 'safe' ? 'event' : 'battle';
      supplyChain = 0;
    }
  }
}

function repairSoftSupplies(nodes: MapNode[], totalDepth: number): void {
  let sinceShop = 0;
  let sinceRest = 0;
  for (let depth = 2; depth <= totalDepth - 2; depth++) {
    const layer = nodes.filter((node) => node.depth === depth);
    if (layer.some((node) => node.type === 'shop')) {
      sinceShop = 0;
    } else {
      sinceShop += 1;
    }
    if (layer.some((node) => node.type === 'rest')) {
      sinceRest = 0;
    } else {
      sinceRest += 1;
    }
    if (sinceShop >= SOFT_SUPPLY_PITY_START + 1) {
      const candidate =
        pickChunkCandidate(layer, ['safe', 'balance', 'risk'], ['boss', 'treasure', 'rest', 'shop']) ??
        pickChunkCandidate(layer, ['safe', 'balance', 'risk'], ['boss', 'treasure', 'shop']);
      if (candidate) {
        candidate.type = 'shop';
        sinceShop = 0;
      }
    }
    if (sinceRest >= SOFT_SUPPLY_PITY_START + 1) {
      const candidate =
        pickChunkCandidate(layer, ['safe', 'balance', 'risk'], ['boss', 'treasure', 'shop', 'rest']) ??
        pickChunkCandidate(layer, ['safe', 'balance', 'risk'], ['boss', 'treasure', 'rest']);
      if (candidate) {
        candidate.type = 'rest';
        sinceRest = 0;
      }
    }
  }
}

function ensureLateRiskPeak(nodes: MapNode[], totalDepth: number): void {
  const startDepth = lateRiskStartDepth(totalDepth);
  const endDepth = totalDepth - 2;
  const lateNodes = nodes.filter((node) => node.depth >= startDepth && node.depth <= endDepth);
  const existingElite = lateNodes.find((node) => node.type === 'elite');
  if (existingElite) {
    existingElite.routeBias = 'risk';
    return;
  }
  const targetDepth = Math.max(startDepth, totalDepth - 4);
  const candidate = ([...lateNodes]
    .filter((node) => node.type !== 'rest' && node.type !== 'shop' && node.type !== 'treasure')
    .sort((a, b) => {
      const biasScore =
        ['risk', 'balance', 'safe'].indexOf(a.routeBias ?? 'balance') -
        ['risk', 'balance', 'safe'].indexOf(b.routeBias ?? 'balance');
      if (biasScore !== 0) return biasScore;
      return Math.abs(a.depth - targetDepth) - Math.abs(b.depth - targetDepth);
    })[0])
    ?? [...lateNodes]
      .filter((node) => node.type !== 'rest')
      .sort((a, b) => {
        const biasScore =
          ['risk', 'balance', 'safe'].indexOf(a.routeBias ?? 'balance') -
          ['risk', 'balance', 'safe'].indexOf(b.routeBias ?? 'balance');
        if (biasScore !== 0) return biasScore;
        return Math.abs(a.depth - targetDepth) - Math.abs(b.depth - targetDepth);
      })[0]
    ?? [...lateNodes].sort((a, b) =>
      Math.abs(a.depth - targetDepth) - Math.abs(b.depth - targetDepth),
    )[0];
  if (!candidate) return;
  candidate.type = 'elite';
  candidate.routeBias = 'risk';
}

function assignTreasureNode(allNodes: MapNode[], totalDepth: number): void {
  const treasureDepth = Math.max(5, Math.min(totalDepth - 3, Math.round(totalDepth * 0.45)));
  const candidate = [...allNodes]
    .filter((node) => node.depth >= treasureDepth - 2 && node.depth <= treasureDepth + 2)
    .filter((node) => !['boss', 'rest', 'shop'].includes(node.type))
    .sort((a, b) => {
      const aBias = a.routeBias ?? 'balance';
      const bBias = b.routeBias ?? 'balance';
      const biasScore = ['balance', 'safe', 'risk'].indexOf(aBias) - ['balance', 'safe', 'risk'].indexOf(bBias);
      if (biasScore !== 0) return biasScore;
      return Math.abs(a.depth - treasureDepth) - Math.abs(b.depth - treasureDepth);
    })[0];
  if (candidate) candidate.type = 'treasure';
}

function assignEventScripts(act: MapAct, nodes: MapNode[]): void {
  const eventPool = EVENT_POOLS[act];
  const eventNodes = nodes
    .filter((node) => node.type === 'event')
    .sort((a, b) => a.depth - b.depth);
  eventNodes.forEach((node, index) => {
    node.eventScriptId = eventPool[index % eventPool.length]!;
  });
}

function nodesForGeneratedPath(
  act: MapAct,
  path: GeneratedPath,
  nodes: Record<string, MapNode>,
): MapNode[] {
  return path.rows
    .map((row, index) => nodes[nodeId(act, index + 2, row)])
    .filter((node): node is MapNode => Boolean(node));
}

function applyRoutePattern(nodes: MapNode[], pattern: Partial<Record<number, MapNodeType>>): void {
  for (const node of nodes) {
    const nextType = pattern[node.depth];
    if (!nextType) continue;
    node.type = nextType;
  }
}

function applyAct1RouteGuarantees(
  act: MapAct,
  pathRows: GeneratedPath[],
  nodes: Record<string, MapNode>,
): void {
  if (act !== 1) return;

  const riskPath = pathRows.find((path) => path.bias === 'risk');
  const balancePaths = pathRows.filter((path) => path.bias === 'balance');
  const balancePath = balancePaths[0];
  const pressurePath = balancePaths[1] ?? riskPath;
  const safePath = [...pathRows].reverse().find((path) => path.bias === 'safe');
  if (!riskPath || !balancePath || !pressurePath || !safePath) return;

  for (const node of Object.values(nodes)) {
    if (node.depth === 12 && node.type === 'elite') node.type = 'event';
  }

  applyRoutePattern(nodesForGeneratedPath(act, riskPath, nodes), {
    6: 'elite',
    9: 'elite',
  });

  applyRoutePattern(nodesForGeneratedPath(act, pressurePath, nodes), {
    5: 'elite',
    8: 'elite',
    10: 'shop',
  });

  applyRoutePattern(nodesForGeneratedPath(act, balancePath, nodes), {
    5: 'battle',
    6: 'event',
    7: 'battle',
    8: 'elite',
    9: 'battle',
    10: 'shop',
  });

  applyRoutePattern(nodesForGeneratedPath(act, safePath, nodes), {
    2: 'battle',
    3: 'event',
    4: 'battle',
    5: 'shop',
    6: 'battle',
    7: 'rest',
    8: 'battle',
    9: 'battle',
    10: 'event',
  });

  // 最后兜底：先让 risk / balance 达到目标精英数，再在最后一步统一把 safe 路上的
  // 任何 elite 清理为 battle（safe 在所有兜底里的优先级最高，保证「0 精英安全路」总是存在）。
  const riskNodes = nodesForGeneratedPath(act, riskPath, nodes);
  const riskEliteCount = riskNodes.filter((n) => n.type === 'elite').length;
  if (riskEliteCount < 2) {
    const candidates = riskNodes.filter(
      (n) =>
        n.depth > EARLY_ELITE_PROTECTION_DEPTH
        && n.depth < bossDepthFor(act) - 2
        && n.type !== 'elite'
        && n.type !== 'rest'
        && n.type !== 'shop'
        && n.type !== 'treasure',
    );
    for (let i = 0; i < 2 - riskEliteCount && i < candidates.length; i++) {
      candidates[candidates.length - 1 - i]!.type = 'elite';
    }
  }

  // 确保存在 1 精英均衡路：balancePath 上恰好一个 elite；pressurePath 不强制清理（它的 5/8 双 elite 更贴近 2+ 精英风险路补位）。
  const balanceNodes = nodesForGeneratedPath(act, balancePath, nodes);
  const balanceElites = balanceNodes.filter((n) => n.type === 'elite');
  if (balanceElites.length === 0) {
    const candidate = balanceNodes
      .filter(
        (n) =>
          n.depth > EARLY_ELITE_PROTECTION_DEPTH
          && n.depth < bossDepthFor(act) - 2
          && n.type !== 'rest'
          && n.type !== 'shop'
          && n.type !== 'treasure',
      )
      .find((n) => n.depth === 8)
      ?? balanceNodes.find(
        (n) => n.depth > EARLY_ELITE_PROTECTION_DEPTH && n.depth < bossDepthFor(act) - 2,
      );
    if (candidate) candidate.type = 'elite';
  } else if (balanceElites.length > 1) {
    // 过多精英会让“1 精英均衡路”退化成“2+ 精英路”，只保留 d8（或最接近 d8 的那一个）。
    const keep = balanceElites.sort((a, b) => Math.abs(a.depth - 8) - Math.abs(b.depth - 8))[0];
    for (const e of balanceElites) {
      if (e !== keep) e.type = 'battle';
    }
  }

  // 最后再次兜底：无论前面的补救怎么安排，safe 路上的任何节点都不能是精英。
  // （即使该节点被 riskPath 的兜底补成了 elite，此处一律改回 battle。）
  const safeNodes = nodesForGeneratedPath(act, safePath, nodes);
  for (const node of safeNodes) {
    if (node.type === 'elite') node.type = 'battle';
  }
}

function bossDepthFor(act: MapAct): number {
  return ACT_FLOOR_COUNTS[act];
}

type RouteElite = { elites: number; eliteNodeIds: string[] };

function enumerateRouteEliteCounts(nodes: Record<string, MapNode>): RouteElite[] {
  const start = Object.values(nodes).find((node) => node.depth === 1);
  if (!start) return [];
  const routes: RouteElite[] = [];
  const stack: Array<{ nodeId: string; elites: number; eliteNodeIds: string[] }> = [
    { nodeId: start.id, elites: 0, eliteNodeIds: [] },
  ];
  while (stack.length > 0) {
    const current = stack.pop()!;
    const node = nodes[current.nodeId];
    if (!node) continue;
    const isElite = node.depth > 1 && node.type === 'elite';
    const elites = current.elites + (isElite ? 1 : 0);
    const eliteNodeIds = isElite ? [...current.eliteNodeIds, node.id] : current.eliteNodeIds;
    if (node.type === 'boss') {
      routes.push({ elites, eliteNodeIds });
      continue;
    }
    for (const nextId of node.nextNodeIds) {
      stack.push({ nodeId: nextId, elites, eliteNodeIds });
    }
  }
  return routes;
}

// Act1 的图被缩短后，pressurePath 的连续 elite 容易让 1-elite 均衡路消失；
// 本函数在最终阶段做一轮路径级核对：如果没有恰好 1 精英的路线，就把一个
// 在「多精英路线」上但「非 1-elite 路线必经」的精英回退成 battle，恢复 1-elite 存在性。
function ensureAct1RouteShapes(nodes: Record<string, MapNode>, totalDepth: number): void {
  for (let iter = 0; iter < 4; iter++) {
    const routes = enumerateRouteEliteCounts(nodes);
    if (routes.some((r) => r.elites === 1)) return;
    // 找所有 elites === 2 的最短路径，统计其中每个 elite 节点出现频率。
    const twoEliteRoutes = routes.filter((r) => r.elites === 2);
    if (twoEliteRoutes.length === 0) return;
    const freq = new Map<string, number>();
    for (const r of twoEliteRoutes) {
      for (const id of r.eliteNodeIds) freq.set(id, (freq.get(id) ?? 0) + 1);
    }
    // 选择一个精英节点：在 2-elite 路线上出现频率最高、且不在 boss-2 之前必经的位置。
    // 简化策略：挑 depth 最小的精英节点（一般是早期被 pressurePath 补出的那个）改成 battle。
    const candidate = [...freq.keys()]
      .map((id) => nodes[id]!)
      .filter((n) => n && n.depth > 4 && n.depth < totalDepth - 2)
      .sort((a, b) => a.depth - b.depth)[0];
    if (!candidate) return;
    candidate.type = 'battle';
  }
}

function finalizeEncounterMeta(act: MapAct, nodes: Record<string, MapNode>): void {
  for (const node of Object.values(nodes)) {
    Object.assign(node, encounterMetaForType(node.type, act));
    if (node.type !== 'event') delete node.eventScriptId;
  }
}

export function generateActMap(act: MapAct, seed: number): Record<string, MapNode> {
  const totalDepth = ACT_FLOOR_COUNTS[act];
  const restDepth = totalDepth - 1;
  const bossDepth = totalDepth;
  const rnd = mulberry32((seed ^ (act * 0x9e3779b1)) >>> 0);

  const pathRows = PATH_BIASES.map((bias, index) => ({
    bias,
    rows: generatePathRows(totalDepth, bias, FIRST_STEP_ROWS[index]!, rnd),
  }));

  const nodes: Record<string, MapNode> = {};
  const biasStats = new Map<string, { score: number; count: number }>();

  const ensureNode = (depth: number, row: number, routeBias: MapRouteBias): MapNode => {
    const id = nodeId(act, depth, row);
    if (!nodes[id]) {
      nodes[id] = {
        id,
        act,
        depth,
        floor: act,
        x: depth - 1,
        y: row,
        type: 'battle',
        routeBias,
        ...encounterMetaForType('battle', act),
        nextNodeIds: [],
        visited: false,
      };
    }
    const stat = biasStats.get(id) ?? { score: 0, count: 0 };
    stat.score += BIAS_SCORE[routeBias];
    stat.count += 1;
    biasStats.set(id, stat);
    return nodes[id]!;
  };

  const camp = ensureNode(1, MAP_CENTER_ROW, 'balance');
  camp.type = 'event';
  camp.visited = true;

  for (const path of pathRows) {
    path.rows.forEach((row, index) => {
      ensureNode(index + 2, row, path.bias);
    });
  }

  const rest = ensureNode(restDepth, MAP_CENTER_ROW, 'safe');
  rest.type = 'rest';
  const boss = ensureNode(bossDepth, MAP_CENTER_ROW, 'risk');
  boss.type = 'boss';

  for (const [id, stat] of biasStats.entries()) {
    nodes[id]!.routeBias = biasForAverageScore(stat.score / stat.count);
  }
  camp.routeBias = 'balance';
  rest.routeBias = 'safe';
  boss.routeBias = 'risk';

  for (const path of pathRows) {
    let previousId = camp.id;
    path.rows.forEach((row, index) => {
      const currentId = nodeId(act, index + 2, row);
      addEdge(nodes, previousId, currentId);
      previousId = currentId;
    });
    addEdge(nodes, previousId, rest.id);
  }

  for (let depth = 2; depth <= totalDepth - 3; depth++) {
    const depthIndex = depth - 2;
    for (let index = 0; index < pathRows.length - 1; index++) {
      if (rnd() >= CROSS_LINK_CHANCE) continue;
      const upper = pathRows[index]!;
      const lower = pathRows[index + 1]!;
      const forwardFromUpper = rnd() < 0.5;
      const source = forwardFromUpper ? upper : lower;
      const target = forwardFromUpper ? lower : upper;
      const fromRow = source.rows[depthIndex]!;
      const toRow = target.rows[depthIndex + 1]!;
      if (Math.abs(fromRow - toRow) > 3) continue;
      addEdge(nodes, nodeId(act, depth, fromRow), nodeId(act, depth + 1, toRow));
    }
  }

  addEdge(nodes, rest.id, boss.id);

  const mutableNodes = Object.values(nodes).filter(
    (node) => node.depth > 1 && node.depth < restDepth,
  );
  mutableNodes.sort((a, b) => a.depth - b.depth || a.y - b.y);

  let lastEliteDepth = -99;
  let sinceShop = 0;
  let sinceRest = 0;
  let previousType: MapNodeType | null = null;
  for (const node of mutableNodes) {
    const chosen = chooseWeightedType(
      node.depth,
      totalDepth,
      node.routeBias ?? 'balance',
      lastEliteDepth,
      sinceShop,
      sinceRest,
      previousType,
      rnd,
    );
    node.type = chosen;
    if (chosen === 'elite') lastEliteDepth = node.depth;
    sinceShop = chosen === 'shop' ? 0 : sinceShop + 1;
    sinceRest = chosen === 'rest' ? 0 : sinceRest + 1;
    previousType = chosen;
  }

  enforceSupplySpacing(mutableNodes);
  repairSoftSupplies(mutableNodes, totalDepth);
  enforceSupplySpacing(mutableNodes);
  breakEventChains(mutableNodes, totalDepth);
  ensureLateRiskPeak(mutableNodes, totalDepth);
  ensureEventFallback(mutableNodes);
  applyAct1RouteGuarantees(act, pathRows, nodes);
  if (act === 1) ensureAct1RouteShapes(nodes, totalDepth);
  // 宝箱放到路线 pattern 之后，否则 applyAct1RouteGuarantees 会把 treasure 覆盖成 battle/event/shop/rest。
  assignTreasureNode(mutableNodes, totalDepth);

  assignEventScripts(act, Object.values(nodes));
  camp.eventScriptId = EVENT_POOLS[act][0]!;
  finalizeEncounterMeta(act, nodes);

  return nodes;
}

export function generateBranchingFloorMap(act: MapAct, seed: number): Record<string, MapNode> {
  return generateActMap(act, seed);
}
