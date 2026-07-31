import { describe, expect, test } from '@rstest/core';
import { existsSync, statSync } from 'node:fs';
import { ACT2_ENEMY_VISUAL_IDS } from '@/features/battle/enemyVisuals';

describe('Act 2 序章敌人图', () => {
  test('正式序章敌人都有独立 WebP 且不超过 130KB', () => {
    expect(ACT2_ENEMY_VISUAL_IDS).toHaveLength(12);
    for (const enemyId of ACT2_ENEMY_VISUAL_IDS) {
      const path = `public/assets/combat/enemies/${enemyId}.webp`;
      expect(existsSync(path)).toBe(true);
      expect(statSync(path).size).toBeLessThanOrEqual(130 * 1024);
    }
  });

  test('Act 2 战斗场景图存在且控制在 130KB 内', () => {
    const path = 'public/assets/combat/fractured-tribunal.webp';
    expect(existsSync(path)).toBe(true);
    expect(statSync(path).size).toBeLessThanOrEqual(130 * 1024);
  });
});
