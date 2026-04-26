import { describe, expect, test } from '@rstest/core';
import {
  BATTLE_CARD_H,
  BATTLE_HAND_Y,
  computeEnemyHitHeight,
  computeEnemyHitRect,
  computeHandZoneTop,
} from '@/game/phaser/scenes/battle/battleSceneLayout';

describe('phaser/battleSceneLayout', () => {
  test('computeHandZoneTop 与牌高一致', () => {
    expect(computeHandZoneTop(BATTLE_HAND_Y, BATTLE_CARD_H)).toBe(BATTLE_HAND_Y - BATTLE_CARD_H / 2);
  });

  test('computeEnemyHitHeight 上限与顶缘间距', () => {
    const top = computeHandZoneTop(458, 144);
    const h = computeEnemyHitHeight(top);
    expect(h).toBe(Math.min(268, top - 46));
  });

  test('computeEnemyHitRect 与槽位中心对齐', () => {
    const top = computeHandZoneTop(BATTLE_HAND_Y, BATTLE_CARD_H);
    const cx = 400;
    const r = computeEnemyHitRect(cx, top);
    expect(r).toEqual({
      x: cx - 82,
      y: 52,
      width: 164,
      height: computeEnemyHitHeight(top),
    });
  });
});
