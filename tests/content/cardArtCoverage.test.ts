import { describe, expect, test } from '@rstest/core';
import { existsSync, statSync } from 'node:fs';
import { ACT1_REWARD_CARD_IDS } from '@/game/core/definitions/act1Content';
import { ACT2_REWARD_CARD_IDS } from '@/game/core/definitions/act2Content';

describe('正式奖励卡图', () => {
  test('48 张正式卡都有独立 WebP 且不超过 130KB', () => {
    const formalCardIds = [...ACT1_REWARD_CARD_IDS, ...ACT2_REWARD_CARD_IDS];
    expect(formalCardIds).toHaveLength(48);
    for (const cardId of formalCardIds) {
      const path = `public/assets/cards/art/${cardId}.webp`;
      expect(existsSync(path)).toBe(true);
      expect(statSync(path).size).toBeLessThanOrEqual(130 * 1024);
    }
  });
});
