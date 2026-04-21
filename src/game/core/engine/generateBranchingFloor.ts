import type { MapAct, MapNode, MapNodeType, MapRouteBias } from '../model/map';
import { mulberry32 } from '../utils/rng';

export const WANDERING_MERCHANT_EVENT_ID = 'wandering_merchant';
export const STILLNESS_SHRINE_EVENT_ID = 'stillness_shrine';
export const BURST_ALTAR_EVENT_ID = 'burst_altar';
export const PURGING_POOL_EVENT_ID = 'purging_pool';

export const ACT_FLOOR_COUNTS: Record<MapAct, number> = {
  1: 20,
  2: 24,
  3: 26,
};

export const MAP_MAX_ROW = 6;

const MAP_CENTER_ROW = 3;
const FIRST_STEP_ROWS = [1, 2, 4, 5] as const;
const CROSS_LINK_CHANCE = 0.3;
const EARLY_ELITE_PROTECTION_DEPTH = 4;
const ELITE_DEPTH_GAP = 5;

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
  1: [WANDERING_MERCHANT_EVENT_ID, STILLNESS_SHRINE_EVENT_ID],
  2: [BURST_ALTAR_EVENT_ID, PURGING_POOL_EVENT_ID, STILLNESS_SHRINE_EVENT_ID],
  3: [BURST_ALTAR_EVENT_ID, PURGING_POOL_EVENT_ID, WANDERING_MERCHANT_EVENT_ID],
};

type Phase = 'early' | 'mid' | 'late';
type WeightedNodeType = Exclude<MapNodeType, 'boss' | 'treasure'>;

const PHASE_WEIGHTS: Record<Phase, Record<WeightedNodeType, number>> = {
  early: {
    battle: 60,
    elite: 5,
    event: 20,
    shop: 5,
    rest: 10,
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
    battle: -4,
    elite: -12,
    event: 1,
    shop: 8,
    rest: 10,
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
  const ratio = depth / Math.max(1, totalDepth);
  if (ratio <= 0.3) return 'early';
  if (ratio <= 0.7) return 'mid';
  return 'late';
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
      if (depth >= totalDepth - 5) {
        current = clampRow(nudgeToward(current, MAP_CENTER_ROW, 0.75, rnd));
      }
    }
    rows.push(current);
  }
  return rows;
}

function encounterMetaForType(type: MapNodeType, act: MapAct): Pick<MapNode, 'encounterTier' | 'encounterTableId'> {
  if (type === 'battle') return { encounterTier: 'normal', encounterTableId: `act_${act}_normal` };
  if (type === 'elite') return { encounterTier: 'elite', encounterTableId: `act_${act}_elite` };
  if (type === 'boss') return { encounterTier: 'boss', encounterTableId: `act_${act}_boss` };
  if (type === 'treasure') return { encounterTier: 'treasure', encounterTableId: `act_${act}_treasure` };
  return { encounterTier: 'none', encounterTableId: null };
}

function addEdge(nodes: Record<string, MapNode>, fromId: string, toId: string): void {
  if (fromId === toId) return;
  const from = nodes[fromId];
  if (!from) return;
  if (from.nextNodeIds.includes(toId)) return;
  if (from.x > 0 && from.nextNodeIds.length >= 3) return;
  from.nextNodeIds.push(toId);
}

function chooseWeightedType(
  depth: number,
  totalDepth: number,
  routeBias: MapRouteBias,
  lastEliteDepth: number,
  rnd: () => number,
): WeightedNodeType {
  if (depth <= 2) return 'battle';
  const baseWeights = { ...PHASE_WEIGHTS[phaseForDepth(depth, totalDepth)] };
  const delta = BIAS_WEIGHT_DELTA[routeBias];
  for (const key of Object.keys(delta) as WeightedNodeType[]) {
    baseWeights[key] = Math.max(0, baseWeights[key] + (delta[key] ?? 0));
  }
  if (depth <= EARLY_ELITE_PROTECTION_DEPTH || depth - lastEliteDepth < ELITE_DEPTH_GAP) {
    baseWeights.elite = 0;
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

function ensureChunkGuarantee(
  allNodes: MapNode[],
  totalDepth: number,
  type: 'shop' | 'rest',
): void {
  for (let chunkStart = 1; chunkStart <= totalDepth; chunkStart += 10) {
    const chunkEnd = Math.min(totalDepth, chunkStart + 9);
    const chunkNodes = allNodes.filter(
      (node) => node.depth >= chunkStart && node.depth <= chunkEnd && node.depth > 2,
    );
    if (chunkNodes.some((node) => node.type === type)) continue;
    const candidate =
      pickChunkCandidate(
        chunkNodes,
        type === 'shop' ? ['safe', 'balance', 'risk'] : ['safe', 'balance', 'risk'],
        ['boss', 'treasure', type, type === 'shop' ? 'rest' : 'shop'],
      ) ??
      pickChunkCandidate(
        chunkNodes,
        type === 'shop' ? ['safe', 'balance', 'risk'] : ['safe', 'balance', 'risk'],
        ['boss', type, type === 'shop' ? 'rest' : 'shop'],
      );
    if (candidate) candidate.type = type;
  }
}

function ensureEventFallback(allNodes: MapNode[]): void {
  const eventExists = allNodes.some((node) => node.type === 'event');
  if (eventExists) return;
  const fallback =
    pickChunkCandidate(allNodes, ['balance', 'safe', 'risk'], ['boss', 'rest', 'shop', 'treasure']) ??
    pickChunkCandidate(allNodes, ['balance', 'safe', 'risk'], ['boss', 'treasure']);
  if (fallback) fallback.type = 'event';
}

function repairChunkSupplies(allNodes: MapNode[], totalDepth: number): void {
  const restDepth = totalDepth - 1;
  for (let chunkStart = 1; chunkStart <= totalDepth; chunkStart += 10) {
    const chunkEnd = Math.min(totalDepth, chunkStart + 9);
    const chunkNodes = allNodes.filter(
      (node) => node.depth >= chunkStart && node.depth <= chunkEnd && node.depth > 2,
    );
    const shops = chunkNodes.filter((node) => node.type === 'shop');
    const rests = chunkNodes.filter((node) => node.type === 'rest');
    if (shops.length === 0) {
      const candidate = [...chunkNodes]
        .filter((node) => node.type !== 'boss' && node.type !== 'treasure')
        .filter((node) => node.type !== 'rest' || rests.length > 1)
        .sort((a, b) => {
          const aPenalty = a.depth === restDepth ? 1 : 0;
          const bPenalty = b.depth === restDepth ? 1 : 0;
          if (aPenalty !== bPenalty) return aPenalty - bPenalty;
          return a.depth - b.depth;
        })[0];
      if (candidate) candidate.type = 'shop';
    }
    if (rests.length === 0) {
      const candidate = [...chunkNodes]
        .filter((node) => node.type !== 'boss' && node.type !== 'treasure')
        .filter((node) => node.type !== 'shop' || shops.length > 1)
        .sort((a, b) => a.depth - b.depth)[0];
      if (candidate) candidate.type = 'rest';
    }
  }
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
  for (const node of mutableNodes) {
    const chosen = chooseWeightedType(
      node.depth,
      totalDepth,
      node.routeBias ?? 'balance',
      lastEliteDepth,
      rnd,
    );
    node.type = chosen;
    if (chosen === 'elite') lastEliteDepth = node.depth;
  }

  assignTreasureNode(mutableNodes, totalDepth);
  ensureChunkGuarantee(mutableNodes, totalDepth, 'shop');
  ensureChunkGuarantee([...mutableNodes, rest], totalDepth, 'rest');
  ensureChunkGuarantee([...mutableNodes, rest], totalDepth, 'shop');
  repairChunkSupplies([...mutableNodes, rest, boss], totalDepth);
  ensureEventFallback(mutableNodes);

  assignEventScripts(act, Object.values(nodes));
  camp.eventScriptId = EVENT_POOLS[act][0]!;
  finalizeEncounterMeta(act, nodes);

  return nodes;
}

export function generateBranchingFloorMap(act: MapAct, seed: number): Record<string, MapNode> {
  return generateActMap(act, seed);
}
