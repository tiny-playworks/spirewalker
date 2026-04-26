/**
 * 战斗场景布局纯数据（无 Phaser 依赖），供 `BattleScene` 与单测共用。
 * 修改战场排布时请同步改此文件并跑 `tests/phaser/battleSceneLayout.test.ts`。
 */

export const BATTLE_CARD_W = 112;
export const BATTLE_CARD_H = 144;

export const BATTLE_HAND_Y = 458;
export const BATTLE_UNIT_Y = 172;

export function computeHandZoneTop(handY: number, cardH: number): number {
  return handY - cardH / 2;
}

/** 与 `BattleScene.rebuildEnemyHitRects` 中敌人命中盒一致 */
export function computeEnemyHitHeight(handZoneTop: number): number {
  return Math.min(268, handZoneTop - 46);
}

export function computeEnemyHitRect(cx: number, handZoneTop: number): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const height = computeEnemyHitHeight(handZoneTop);
  return { x: cx - 82, y: 52, width: 164, height };
}
