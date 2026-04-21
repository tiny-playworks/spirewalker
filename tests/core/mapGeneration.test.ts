import { describe, expect, test } from '@rstest/core';
import { actFloorCount, buildActNodes } from '@/game/core/engine/createMapRun';
import type { MapAct, MapRouteBias } from '@/game/core/model/map';

const ACTS: MapAct[] = [1, 2, 3];
const SAMPLE_SEEDS = [3, 11, 27, 77];

function chunkRanges(totalDepth: number): Array<{ start: number; end: number }> {
  const ranges: Array<{ start: number; end: number }> = [];
  for (let start = 1; start <= totalDepth; start += 10) {
    ranges.push({ start, end: Math.min(totalDepth, start + 9) });
  }
  return ranges;
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

  test('每 10 层区间至少给一个商店和一个休息点', () => {
    for (const act of ACTS) {
      for (const seed of SAMPLE_SEEDS) {
        const nodes = Object.values(buildActNodes(act, seed));
        for (const { start, end } of chunkRanges(actFloorCount(act))) {
          const chunk = nodes.filter((node) => node.depth >= start && node.depth <= end);
          expect(chunk.some((node) => node.type === 'shop')).toBe(true);
          expect(chunk.some((node) => node.type === 'rest')).toBe(true);
        }
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
});
