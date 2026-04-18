import type { MapNode, MapNodeType } from '../model/map';
import { mulberry32 } from '../utils/rng';
import { shuffleInPlace } from '../utils/shuffle';

/** 游荡商人：`MapNode.eventScriptId` 与 `run.screen.eventId` 共用此字面量。 */
export const WANDERING_MERCHANT_EVENT_ID = 'wandering_merchant';

/** 与地图 SVG 布局一致：节点 `y` 取 0..MAX_ROW（含）。 */
export const MAP_MAX_ROW_FLOOR1 = 6;
export const MAP_MAX_ROW_FLOOR2 = 5;

function layerDepth(floor: number): number {
  return floor === 2 ? 6 : 8;
}

function maxRowForFloor(floor: number): number {
  return floor === 2 ? MAP_MAX_ROW_FLOOR2 : MAP_MAX_ROW_FLOOR1;
}

/** 单层内行号不重复、带轻微抖动，类尖塔「层宽」在 2～4 间起伏。 */
function buildJitteredLayerRows(floor: number, rnd: () => number): number[][] {
  const D = layerDepth(floor);
  const maxRow = maxRowForFloor(floor);
  const widths: number[] = [];
  widths.push(1);
  for (let x = 1; x < D - 2; x++) {
    const prev = widths[widths.length - 1]!;
    const jitter = rnd() < 0.42 ? -1 : rnd() < 0.58 ? 0 : 1;
    widths.push(Math.max(2, Math.min(4, prev + jitter)));
  }
  widths.push(1);
  widths.push(1);

  const rows: number[][] = [];
  for (let x = 0; x < D; x++) {
    rows.push(spreadRowsInColumn(widths[x]!, maxRow, rnd));
  }
  return rows;
}

function spreadRowsInColumn(w: number, maxRow: number, rnd: () => number): number[] {
  if (w <= 1) return [Math.floor(maxRow / 2)];
  const out: number[] = [];
  for (let k = 0; k < w; k++) {
    const base = Math.round(((k + 1) / (w + 1)) * maxRow);
    const j = Math.floor(rnd() * 3) - 1;
    out.push(Math.max(0, Math.min(maxRow, base + j)));
  }
  out.sort((a, b) => a - b);
  for (let k = 1; k < out.length; k++) {
    if (out[k]! <= out[k - 1]!) out[k] = Math.min(maxRow, out[k - 1]! + 1);
  }
  return out;
}

function nodeId(floor: number, x: number, row: number): string {
  return `f${floor}_x${x}_r${row}`;
}

/**
 * 类尖塔连边：只连 |Δy|≤1 的候选；每条出边 1～2 条（随机），减少「全扇出」；
 * 再修复下一层每个节点至少一条入边。
 */
function connectLayersStS(
  nodes: Record<string, MapNode>,
  layerIds: string[][],
  random: () => number,
): void {
  for (let x = 0; x < layerIds.length - 1; x++) {
    const curLayer = layerIds[x]!;
    const nextLayer = layerIds[x + 1]!;
    for (const id of curLayer) {
      const row = nodes[id]!.y;
      let candidates = nextLayer.filter((nid) => Math.abs(nodes[nid]!.y - row) <= 1);
      if (candidates.length === 0) {
        const sorted = [...nextLayer].sort(
          (a, b) => Math.abs(nodes[a]!.y - row) - Math.abs(nodes[b]!.y - row),
        );
        candidates = [sorted[0]!];
      }
      let targets = [...candidates];
      if (targets.length > 2) {
        shuffleInPlace(targets, random);
        targets = targets.slice(0, random() < 0.52 ? 2 : 1);
      } else if (targets.length === 2 && random() < 0.38) {
        targets = [targets[Math.floor(random() * 2)]!];
      }
      nodes[id]!.nextNodeIds = [...new Set(targets)];
    }
    for (const nid of nextLayer) {
      const hasIn = curLayer.some((pid) => nodes[pid]!.nextNodeIds.includes(nid));
      if (!hasIn) {
        const ny = nodes[nid]!.y;
        const sortedP = [...curLayer].sort(
          (a, b) => Math.abs(nodes[a]!.y - ny) - Math.abs(nodes[b]!.y - ny),
        );
        const best = sortedP[0]!;
        nodes[best]!.nextNodeIds.push(nid);
        nodes[best]!.nextNodeIds = [...new Set(nodes[best]!.nextNodeIds)];
      }
    }
  }
}

/**
 * 生成单层「类尖塔」DAG：层宽随机起伏、岔路行号带抖动；出边受限并保证连通。
 * 首节点为营地（event、无脚本），末层 Boss；倒数第二层精英。
 * 中间房间类型由 seed 洗牌，含至少一处宝箱（`treasure`），并保证至少一场游荡商人事件（`eventScriptId`）。
 */
export function generateBranchingFloorMap(floor: number, seed: number): Record<string, MapNode> {
  const rnd = mulberry32((seed ^ floor * 0x9e3779b1) >>> 0);
  const rowMatrix = buildJitteredLayerRows(floor, rnd);
  const layerIds: string[][] = [];

  for (let x = 0; x < rowMatrix.length; x++) {
    const col: string[] = [];
    for (const row of rowMatrix[x]!) {
      col.push(nodeId(floor, x, row));
    }
    layerIds.push(col);
  }

  const nodes: Record<string, MapNode> = {};
  for (let x = 0; x < rowMatrix.length; x++) {
    for (const row of rowMatrix[x]!) {
      const id = nodeId(floor, x, row);
      nodes[id] = {
        id,
        floor,
        x,
        y: row,
        type: 'battle',
        nextNodeIds: [],
        visited: false,
      };
    }
  }

  connectLayersStS(nodes, layerIds, rnd);

  const lastX = rowMatrix.length - 1;
  const preBossX = lastX - 1;

  for (const id of layerIds[lastX]!) {
    nodes[id]!.type = 'boss';
  }
  for (const id of layerIds[preBossX]!) {
    nodes[id]!.type = 'elite';
  }

  const startId = layerIds[0]![0]!;
  nodes[startId]!.type = 'event';
  nodes[startId]!.visited = true;

  const middleIds: string[] = [];
  for (let x = 1; x < preBossX; x++) {
    for (const id of layerIds[x]!) {
      middleIds.push(id);
    }
  }

  const midCount = middleIds.length;
  const pool: MapNodeType[] = [];
  const pushN = (t: MapNodeType, n: number) => {
    for (let i = 0; i < n; i++) pool.push(t);
  };
  const treasureN = 1;
  if (floor === 2) {
    pushN('battle', Math.max(2, Math.floor(midCount * 0.45) - treasureN));
    pushN('shop', 1);
    pushN('rest', 1);
    pushN('treasure', treasureN);
    pushN('event', Math.max(2, midCount - pool.length));
  } else {
    pushN('battle', Math.max(4, Math.floor(midCount * 0.38) - treasureN));
    pushN('shop', 2);
    pushN('rest', 2);
    pushN('treasure', treasureN);
    pushN('event', Math.max(2, midCount - pool.length));
  }
  while (pool.length < midCount) pool.push('battle');
  while (pool.length > midCount) {
    const bi = pool.lastIndexOf('battle');
    if (bi !== -1) pool.splice(bi, 1);
    else {
      const ei = pool.lastIndexOf('event');
      if (ei !== -1) pool.splice(ei, 1);
      else break;
    }
  }
  if (!pool.includes('treasure')) {
    const bi = pool.lastIndexOf('battle');
    if (bi !== -1) pool[bi] = 'treasure';
    else {
      const ei = pool.lastIndexOf('event');
      if (ei !== -1) pool[ei] = 'treasure';
    }
  }
  while (pool.length < midCount) pool.push('battle');
  while (pool.length > midCount) {
    const bi = pool.lastIndexOf('battle');
    if (bi !== -1) pool.splice(bi, 1);
    else break;
  }
  shuffleInPlace(pool, rnd);

  for (let i = 0; i < midCount; i++) {
    nodes[middleIds[i]!]!.type = pool[i]!;
  }

  const firstStepIds = nodes[startId]!.nextNodeIds;
  for (const id of firstStepIds) {
    nodes[id]!.type = 'battle';
    delete nodes[id]!.eventScriptId;
  }

  const nonFirstStepIds = middleIds.filter((id) => !firstStepIds.includes(id));
  const eventNodes = nonFirstStepIds.filter((id) => nodes[id]!.type === 'event');
  const merchantHost =
    eventNodes[0]
    ?? nonFirstStepIds.find((id) => nodes[id]!.type === 'battle')
    ?? middleIds.find((id) => nodes[id]!.type === 'battle')
    ?? middleIds[0];
  if (merchantHost) {
    nodes[merchantHost]!.type = 'event';
    nodes[merchantHost]!.eventScriptId = WANDERING_MERCHANT_EVENT_ID;
  }

  for (const id of middleIds) {
    if (nodes[id]!.type === 'event' && id !== merchantHost) {
      delete nodes[id]!.eventScriptId;
    }
  }

  /** 首步强转战斗可能吃掉唯一的宝箱，这里保证中间层仍至少有一处 treasure。 */
  if (midCount > 0 && !middleIds.some((id) => nodes[id]!.type === 'treasure')) {
    const battleIds = middleIds
      .filter((id) => id !== merchantHost && nodes[id]!.type === 'battle')
      .sort((a, b) => nodes[b]!.x - nodes[a]!.x);
    const fromBattle = battleIds[0];
    if (fromBattle) {
      nodes[fromBattle]!.type = 'treasure';
      delete nodes[fromBattle]!.eventScriptId;
    } else {
      const eventIds = middleIds
        .filter((id) => id !== merchantHost && nodes[id]!.type === 'event')
        .sort((a, b) => nodes[b]!.x - nodes[a]!.x);
      const fromEvent = eventIds[0];
      if (fromEvent) {
        nodes[fromEvent]!.type = 'treasure';
        delete nodes[fromEvent]!.eventScriptId;
      }
    }
  }

  return nodes;
}
