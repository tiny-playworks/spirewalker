import { describe, expect, test } from '@rstest/core';
import { actFloorCount, buildActNodes } from '@/game/core/engine/createMapRun';
import type { MapAct, MapRouteBias } from '@/game/core/model/map';

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

describe('core/mapGeneration', () => {
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

        expect(shopDepths.length).toBeGreaterThanOrEqual(2);
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

  test('后 20% 区间至少保留一个风险波峰', () => {
    for (const act of ACTS) {
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
