import type { MapNode, MapState } from './map';

/** 从某节点沿 `nextNodeIds` 正向可达的集合（含起点）。 */
export function getForwardReachableNodeIds(
  nodes: Record<string, MapNode>,
  fromId: string | null,
): Set<string> {
  const out = new Set<string>();
  if (!fromId || !nodes[fromId]) return out;
  const stack = [fromId];
  while (stack.length) {
    const id = stack.pop()!;
    if (out.has(id)) continue;
    out.add(id);
    for (const nxt of nodes[id]!.nextNodeIds) stack.push(nxt);
  }
  return out;
}

/**
 * 是否允许从当前地图格走到 `targetId`：必须是一步邻接，且在正向可达子树内（与 UI 可选边一致）。
 */
export function isLegalMapStep(
  nodes: Record<string, MapNode>,
  currentId: string | null,
  targetId: string,
): boolean {
  if (!currentId || !nodes[currentId] || !nodes[targetId]) return false;
  if (!nodes[currentId]!.nextNodeIds.includes(targetId)) return false;
  const forward = getForwardReachableNodeIds(nodes, currentId);
  return forward.has(targetId);
}

/**
 * 存档/内存图剪枝：alive = 已访问 ∪ 从当前格正向可达。
 * 不在 alive 的节点清空出边；在 alive 的节点只保留指向 alive 的后继（未选岔路从数据层移除）。
 */
export function pruneMapEdgesToAlive(map: MapState): void {
  const { nodes } = map;
  const cur = map.currentNodeId;
  if (!cur || !nodes[cur]) return;
  const forward = getForwardReachableNodeIds(nodes, cur);
  const alive = new Set<string>(forward);
  for (const id of Object.keys(nodes)) {
    if (nodes[id]!.visited) alive.add(id);
  }
  for (const id of Object.keys(nodes)) {
    const n = nodes[id]!;
    if (!alive.has(id)) {
      n.nextNodeIds = [];
      continue;
    }
    n.nextNodeIds = n.nextNodeIds.filter((m) => {
      const t = nodes[m];
      return Boolean(t && alive.has(m));
    });
  }
}

export function getCampNodeId(map: MapState): string | null {
  const hit = Object.keys(map.nodes).find((id) => map.nodes[id]!.x === 0);
  return hit ?? null;
}

/** 在 DAG 上从 `fromId` 到 `toId` 的最短路径（BFS），不含分叉的其它枝。 */
export function shortestPathIds(
  map: MapState,
  fromId: string,
  toId: string,
): string[] | null {
  const { nodes } = map;
  if (!nodes[fromId] || !nodes[toId]) return null;
  const q: string[] = [fromId];
  const prev: Record<string, string | undefined> = { [fromId]: undefined };
  while (q.length) {
    const id = q.shift()!;
    if (id === toId) {
      const out: string[] = [];
      let cur: string | undefined = toId;
      while (cur) {
        out.push(cur);
        cur = prev[cur];
      }
      out.reverse();
      return out;
    }
    for (const nxt of nodes[id]!.nextNodeIds) {
      if (!(nxt in prev)) {
        prev[nxt] = id;
        q.push(nxt);
      }
    }
  }
  return null;
}

/** 从营地沿最短路径走到 `targetId`，将该路径上节点标为已访问（用于测试或调试传送）。 */
export function markVisitedFromCampTo(map: MapState, targetId: string): void {
  const camp = getCampNodeId(map);
  if (!camp) return;
  const path = shortestPathIds(map, camp, targetId);
  if (!path) return;
  for (const id of path) {
    map.nodes[id]!.visited = true;
  }
}

export function pickPredecessorId(map: MapState, targetId: string): string | undefined {
  const { nodes } = map;
  const camp = getCampNodeId(map);
  const preds = Object.keys(nodes).filter((id) => nodes[id]!.nextNodeIds.includes(targetId));
  if (preds.length === 0) return undefined;
  if (!camp) return preds[0];
  for (const p of preds) {
    if (shortestPathIds(map, camp, p)) return p;
  }
  return preds[0];
}
