import { describe, expect, test } from '@rstest/core';
import { ARCANA, ARCANA_RARITY_MULTIPLIER, CORES, MUZZLES, RELICS, WEAPONS } from '@/game/content';
import { createDefaultProfile, getCombatModifiers } from '@/game/progression';
import { generateBossDrops, generateChestDrops, generateRouteChoices, generateShopOffers, rollChestRarity } from '@/game/rewards';
import type { BuildTag } from '@/game/types';

describe('V2 路线与奖励', () => {
  test('内容量锁定为 6 把武器、6 个枪头、6 个核心、12 件秘宝和 6 张秘仪牌', () => {
    expect(WEAPONS).toHaveLength(6);
    expect(MUZZLES).toHaveLength(6);
    expect(CORES).toHaveLength(6);
    expect(RELICS).toHaveLength(12);
    expect(ARCANA).toHaveLength(6);
    expect(ARCANA_RARITY_MULTIPLIER).toEqual({ common: 1, rare: 1.2, epic: 1.45, legendary: 1.8 });
  });

  test('第二房固定提供一个可选秘仪牌入口，但不会强制玩家进入', () => {
    for (let seed = 1; seed <= 100; seed += 1) {
      const routes = generateRouteChoices(seed, 1);
      expect(routes.filter((route) => route.category === 'arcana')).toHaveLength(1);
      expect(routes).toHaveLength(2);
    }
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
    expect(generateChestDrops({ ...args, extraDrop: true })).toHaveLength(drops.length + 1);
    expect(generateChestDrops({ ...args, objectiveBonus: true })).toHaveLength(drops.length + 1);
    expect(generateChestDrops({ ...args, reroll: 1 })).not.toEqual(drops);
  });

  test('Boss 宝箱固定生成五类物品并额外掉落金币', () => {
    const drops = generateBossDrops({ seed: 2_026_080_4, modifiers: getCombatModifiers(createDefaultProfile()) });
    expect(drops).toHaveLength(6);
    expect(drops.filter((drop) => drop.item).map((drop) => drop.item?.kind)).toEqual(['weapon', 'muzzle', 'core', 'relic', 'arcana']);
    expect(drops.filter((drop) => !drop.item)).toHaveLength(1);
    expect(drops.find((drop) => !drop.item)?.gold).toBeGreaterThan(0);
  });

  test('商店固定包含武器、枪头、核心、秘宝和一个随机商品', () => {
    const offers = generateShopOffers({
      seed: 2_026_080_4,
      reroll: 0,
      extraSlot: false,
      modifiers: getCombatModifiers(createDefaultProfile()),
    });
    expect(offers).toHaveLength(5);
    expect(offers.slice(0, 4).map((offer) => offer.item.kind)).toEqual(['weapon', 'muzzle', 'core', 'relic']);
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
