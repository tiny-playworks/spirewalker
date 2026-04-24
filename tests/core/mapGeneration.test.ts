import { describe, expect, test } from '@rstest/core';
import { actFloorCount, buildActNodes } from '@/game/core/engine/createMapRun';
import type { MapAct, MapNodeType, MapRouteBias } from '@/game/core/model/map';

const ACTS: MapAct[] = [1, 2, 3];
const SAMPLE_SEEDS = [3, 11, 27, 77];

function maxGapBetweenDepths(depths: number[], endDepth: number): number {
  if (depths.length === 0) return endDepth;
  let previous = 2;
  let maxGap = 0;
  for (const depth of depths) {
    maxGap = Math.max(maxGap, depth - previous);
    previous = depth;
  }
  return Math.max(maxGap, endDepth - previous);
}

type RouteShape = {
  normalFights: number;
  eliteFights: number;
  bufferNodes: number;
  maxBattleStreak: number;
  nodeTypes: MapNodeType[];
};

function isBufferType(type: MapNodeType): boolean {
  return type === 'event' || type === 'shop' || type === 'rest' || type === 'treasure';
}

function enumerateRouteShapes(act: MapAct, seed: number): RouteShape[] {
  const nodes = buildActNodes(act, seed);
  const start = Object.values(nodes).find((node) => node.depth === 1);
  if (!start) return [];

  const routes: RouteShape[] = [];
  const stack: Array<{
    nodeId: string;
    normalFights: number;
    eliteFights: number;
    bufferNodes: number;
    battleStreak: number;
    maxBattleStreak: number;
    nodeTypes: MapNodeType[];
  }> = [{
    nodeId: start.id,
    normalFights: 0,
    eliteFights: 0,
    bufferNodes: 0,
    battleStreak: 0,
    maxBattleStreak: 0,
    nodeTypes: [],
  }];

  while (stack.length > 0) {
    const current = stack.pop()!;
    const node = nodes[current.nodeId];
    if (!node) continue;

    const shouldCount = node.depth > 1 && node.type !== 'boss';
    const normalFights = current.normalFights + (shouldCount && node.type === 'battle' ? 1 : 0);
    const eliteFights = current.eliteFights + (shouldCount && node.type === 'elite' ? 1 : 0);
    const bufferNodes = current.bufferNodes + (shouldCount && isBufferType(node.type) ? 1 : 0);
    const battleStreak = shouldCount && node.type === 'battle' ? current.battleStreak + 1 : 0;
    const maxBattleStreak = Math.max(current.maxBattleStreak, battleStreak);
    const nodeTypes = shouldCount ? [...current.nodeTypes, node.type] : current.nodeTypes;

    if (node.type === 'boss') {
      routes.push({ normalFights, eliteFights, bufferNodes, maxBattleStreak, nodeTypes });
      continue;
    }

    for (const nextNodeId of node.nextNodeIds) {
      stack.push({ nodeId: nextNodeId, normalFights, eliteFights, bufferNodes, battleStreak, maxBattleStreak, nodeTypes });
    }
  }

  return routes;
}

describe('core/mapGeneration', () => {
  test('Act1 缩短为 12 层，Boss 前固定休息点在 11 层', () => {
    expect(actFloorCount(1)).toBe(12);
    const nodes = Object.values(buildActNodes(1, 19));

    expect(nodes.filter((node) => node.depth === 11)).toHaveLength(1);
    expect(nodes.filter((node) => node.depth === 11).every((node) => node.type === 'rest')).toBe(true);
    expect(nodes.filter((node) => node.depth === 12)).toHaveLength(1);
    expect(nodes.filter((node) => node.depth === 12).every((node) => node.type === 'boss')).toBe(true);
  });

  test('首步至少分出三路，且非营地节点的出边不超过三条', () => {
    for (const act of ACTS) {
      for (const seed of SAMPLE_SEEDS) {
        const nodes = Object.values(buildActNodes(act, seed));
        const camp = nodes.find((node) => node.x === 0);

        expect(camp).toBeDefined();
        expect(camp!.nextNodeIds.length).toBeGreaterThanOrEqual(3);
        expect(nodes.filter((node) => node.x > 0).every((node) => node.nextNodeIds.length <= 3)).toBe(true);
      }
    }
  });

  test('每章 Boss 前固定休息点，且前 3 次推进不会出现精英', () => {
    for (const act of ACTS) {
      const nodes = Object.values(buildActNodes(act, 19));
      const bossDepth = actFloorCount(act);
      const restDepth = bossDepth - 1;

      expect(nodes.filter((node) => node.depth === bossDepth)).toHaveLength(1);
      expect(nodes.filter((node) => node.depth === bossDepth).every((node) => node.type === 'boss')).toBe(true);
      expect(nodes.filter((node) => node.depth === restDepth)).toHaveLength(1);
      expect(nodes.filter((node) => node.depth === restDepth).every((node) => node.type === 'rest')).toBe(true);
      expect(nodes.filter((node) => node.depth <= 4).every((node) => node.type !== 'elite')).toBe(true);
    }
  });

  test('补给改为软保底：章内不会长时间断 shop 或 rest', () => {
    for (const act of ACTS) {
      for (const seed of SAMPLE_SEEDS) {
        const nodes = Object.values(buildActNodes(act, seed));
        const shopDepths = nodes.filter((node) => node.type === 'shop').map((node) => node.depth).sort((a, b) => a - b);
        const restDepths = nodes.filter((node) => node.type === 'rest').map((node) => node.depth).sort((a, b) => a - b);

        expect(shopDepths.length).toBeGreaterThanOrEqual(act === 1 ? 1 : 2);
        expect(restDepths.length).toBeGreaterThanOrEqual(2);
        expect(maxGapBetweenDepths(shopDepths, actFloorCount(act) - 1)).toBeLessThanOrEqual(8);
        expect(maxGapBetweenDepths(restDepths, actFloorCount(act) - 1)).toBeLessThanOrEqual(8);
      }
    }
  });

  test('前 1 到 4 层保留分支，但节点类型先收窄为 battle / event', () => {
    for (const act of ACTS) {
      for (const seed of SAMPLE_SEEDS) {
        const nodes = Object.values(buildActNodes(act, seed)).filter((node) => node.depth >= 2 && node.depth <= 4);
        expect(nodes.every((node) => node.type === 'battle' || node.type === 'event')).toBe(true);
      }
    }
  });

  test('路线语义会把高风险路径推向硬仗，把稳健路径推向补给', () => {
    const stats: Record<MapRouteBias, { total: number; hazard: number; relief: number }> = {
      risk: { total: 0, hazard: 0, relief: 0 },
      balance: { total: 0, hazard: 0, relief: 0 },
      safe: { total: 0, hazard: 0, relief: 0 },
    };

    for (const act of ACTS) {
      for (let seed = 1; seed <= 20; seed++) {
        const nodes = Object.values(buildActNodes(act, seed)).filter(
          (node) => node.depth > 1 && node.depth < actFloorCount(act),
        );
        for (const node of nodes) {
          const bias = node.routeBias ?? 'balance';
          stats[bias].total += 1;
          if (node.type === 'battle' || node.type === 'elite') stats[bias].hazard += 1;
          if (node.type === 'shop' || node.type === 'rest') stats[bias].relief += 1;
        }
      }
    }

    expect(stats.risk.total).toBeGreaterThan(0);
    expect(stats.safe.total).toBeGreaterThan(0);
    expect(stats.risk.hazard / stats.risk.total).toBeGreaterThan(stats.safe.hazard / stats.safe.total);
    expect(stats.safe.relief / stats.safe.total).toBeGreaterThan(stats.risk.relief / stats.risk.total);
  });

  test('同一路线语义上的事件链不会连续超过两层', () => {
    for (const act of ACTS) {
      for (const seed of SAMPLE_SEEDS) {
        const nodes = Object.values(buildActNodes(act, seed));
        for (const bias of ['risk', 'balance', 'safe'] as const) {
          const eventDepths = [...new Set(
            nodes
              .filter((node) => node.depth > 1 && node.depth < actFloorCount(act))
              .filter((node) => node.routeBias === bias)
              .filter((node) => node.type === 'event')
              .map((node) => node.depth),
          )].sort((a, b) => a - b);
          let streak = 1;
          let maxStreak = eventDepths.length > 0 ? 1 : 0;
          for (let index = 1; index < eventDepths.length; index++) {
            if (eventDepths[index]! === eventDepths[index - 1]! + 1) {
              streak += 1;
              maxStreak = Math.max(maxStreak, streak);
            } else {
              streak = 1;
            }
          }
          expect(maxStreak).toBeLessThanOrEqual(2);
        }
      }
    }
  });

  test('后 20% 区间至少保留一个风险波峰（Act2+）', () => {
    for (const act of ACTS.filter((item) => item !== 1)) {
      for (const seed of SAMPLE_SEEDS) {
        const totalDepth = actFloorCount(act);
        const lateStart = Math.max(6, Math.ceil(totalDepth * 0.8));
        const lateNodes = Object.values(buildActNodes(act, seed)).filter(
          (node) => node.depth >= lateStart && node.depth <= totalDepth - 2,
        );
        expect(lateNodes.some((node) => node.type === 'elite')).toBe(true);
      }
    }
  });

  test('短 Act1 仍保留补给、事件与风险路线', () => {
    for (const seed of SAMPLE_SEEDS) {
      const nodes = Object.values(buildActNodes(1, seed));
      const mutableNodes = nodes.filter((node) => node.depth > 1 && node.depth < actFloorCount(1));

      expect(mutableNodes.some((node) => node.type === 'shop')).toBe(true);
      expect(mutableNodes.some((node) => node.type === 'rest')).toBe(true);
      expect(mutableNodes.some((node) => node.type === 'event')).toBe(true);
      expect(mutableNodes.some((node) => node.routeBias === 'risk' && node.type === 'elite')).toBe(true);
    }
  });

  test('Act1 每张图都存在 0 精英安全路、1 精英均衡路、2+ 精英风险路', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const routes = enumerateRouteShapes(1, seed);

      expect(routes.some((route) =>
        route.eliteFights === 0
        && route.normalFights >= 4
        && route.normalFights <= 5
        && route.bufferNodes >= 2
        && route.maxBattleStreak <= 2,
      )).toBe(true);
      expect(routes.some((route) => route.eliteFights === 1)).toBe(true);
      expect(routes.some((route) => route.eliteFights >= 2)).toBe(true);
    }
  });

  test('safe 路不会轻易连成连续补给链', () => {
    for (const act of ACTS) {
      for (const seed of SAMPLE_SEEDS) {
        const safeSupplyDepths = [...new Set(
          Object.values(buildActNodes(act, seed))
            .filter((node) => node.routeBias === 'safe')
            .filter((node) => node.type === 'shop' || node.type === 'rest')
            .map((node) => node.depth),
        )].sort((a, b) => a - b);
        let streak = 1;
        let maxStreak = safeSupplyDepths.length > 0 ? 1 : 0;
        for (let index = 1; index < safeSupplyDepths.length; index++) {
          if (safeSupplyDepths[index]! === safeSupplyDepths[index - 1]! + 1) {
            streak += 1;
            maxStreak = Math.max(maxStreak, streak);
          } else {
            streak = 1;
          }
        }
        expect(maxStreak).toBeLessThanOrEqual(1);
      }
    }
  });
});
