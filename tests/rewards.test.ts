import { describe, expect, test } from '@rstest/core';
import { ITEM_BY_ID, WEAPONS, MUZZLES, CORES, RELICS } from '@/game/content';
import { createDefaultProfile, getCombatModifiers } from '@/game/progression';
import { generateRewardOffers, generateRouteChoices } from '@/game/rewards';
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

  test('宝箱三选一同时保留当前路线、横向替换与转向空间', () => {
    const args = {
      seed: 2_026_080_3,
      roomIndex: 1,
      category: 'core' as const,
      elite: false,
      count: 3,
      currentTags: ['arc', 'arc'] as BuildTag[],
      modifiers: getCombatModifiers(createDefaultProfile()),
    };
    const offers = generateRewardOffers(args);
    expect(offers).toEqual(generateRewardOffers(args));
    expect(offers).toHaveLength(3);
    expect(new Set(offers.map((item) => item.definitionId)).size).toBe(3);
    const tags = offers.map((item) => ITEM_BY_ID.get(item.definitionId)?.tag);
    expect(tags).toContain('arc');
    expect(tags.some((tag) => tag !== 'arc' && tag !== 'neutral')).toBe(true);
  });
});
