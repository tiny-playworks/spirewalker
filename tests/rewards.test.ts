import { describe, expect, test } from '@rstest/core';
import { WEAPONS, MUZZLES, CORES, RELICS } from '@/game/content';
import { createDefaultProfile, getCombatModifiers } from '@/game/progression';
import { generateChestDrops, generateRouteChoices, rollChestRarity } from '@/game/rewards';
import type { BuildTag } from '@/game/types';

describe('V2 路线与奖励', () => {
  test('内容量锁定为 6 把武器、6 个枪头、6 个核心和 12 件秘宝', () => {
    expect(WEAPONS).toHaveLength(6);
    expect(MUZZLES).toHaveLength(6);
    expect(CORES).toHaveLength(6);
    expect(RELICS).toHaveLength(12);
  });

  test('相同种子生成相同路线，第一房不出现精英', () => {
    for (let seed = 1; seed <= 100; seed += 1) {
      const left = generateRouteChoices(seed, 0);
      expect(left).toEqual(generateRouteChoices(seed, 0));
      expect(left).toHaveLength(2);
      expect(new Set(left.map((route) => route.category)).size).toBe(2);
      expect(left.some((route) => route.elite)).toBe(false);
    }
  });

  test('第二、三房每次最多给一个可选精英入口', () => {
    for (let seed = 1; seed <= 500; seed += 1) {
      for (const roomIndex of [1, 2]) {
        const routes = generateRouteChoices(seed, roomIndex);
        expect(routes.filter((route) => route.elite).length).toBeLessThanOrEqual(1);
      }
    }
  });

  test('本局已经完成精英战后不再生成第二个精英入口', () => {
    for (let seed = 1; seed <= 500; seed += 1) {
      expect(generateRouteChoices(seed, 2, false).some((route) => route.elite)).toBe(false);
    }
  });

  test('普通宝箱固定种子生成 1–2 件可全部处理的地面掉落', () => {
    const args = {
      seed: 2_026_080_3,
      roomIndex: 1,
      category: 'core' as const,
      elite: false,
      currentTags: ['arc', 'arc'] as BuildTag[],
      modifiers: getCombatModifiers(createDefaultProfile()),
    };
    const drops = generateChestDrops(args);
    expect(drops).toEqual(generateChestDrops(args));
    expect(drops.length).toBeGreaterThanOrEqual(1);
    expect(drops.length).toBeLessThanOrEqual(2);
    expect(drops.every((drop) => !drop.resolved && drop.item?.kind === 'core')).toBe(true);
  });

  test('三档宝箱品质边界符合普通、精英与 Boss 权重', () => {
    const modifiers = getCombatModifiers(createDefaultProfile());
    expect(rollChestRarity(0.005, 'normal', modifiers)).toBe('legendary');
    expect(rollChestRarity(0.05, 'normal', modifiers)).toBe('epic');
    expect(rollChestRarity(0.2, 'normal', modifiers)).toBe('rare');
    expect(rollChestRarity(0.8, 'normal', modifiers)).toBe('common');
    expect(rollChestRarity(0.04, 'elite', modifiers)).toBe('legendary');
    expect(rollChestRarity(0.2, 'elite', modifiers)).toBe('epic');
    expect(rollChestRarity(0.6, 'elite', modifiers)).toBe('rare');
    expect(rollChestRarity(0.12, 'boss', modifiers)).toBe('legendary');
    expect(rollChestRarity(0.3, 'boss', modifiers)).toBe('epic');
  });
});
