import { describe, expect, test } from '@rstest/core';
import { existsSync, statSync } from 'node:fs';
import { ACT1_REWARD_CARD_IDS } from '@/game/core/definitions/act1Content';

describe('Act 1 正式卡图', () => {
  test('36 张正式卡都有独立 WebP 且不超过 130KB', () => {
    expect(ACT1_REWARD_CARD_IDS).toHaveLength(36);
    for (const cardId of ACT1_REWARD_CARD_IDS) {
      const path = `public/assets/cards/art/${cardId}.webp`;
      expect(existsSync(path)).toBe(true);
      expect(statSync(path).size).toBeLessThanOrEqual(130 * 1024);
    }
  });
});
