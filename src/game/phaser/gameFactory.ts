import { AUTO, Game, Scale } from 'phaser';
import { BattleScene } from './scenes/BattleScene';

/**
 * 固定设计分辨率（逻辑坐标系）。场景里敌人 x=760、手牌 y 等数字都按此尺寸排布。
 * 若用父容器像素去 `scale.resize`，会把世界变窄/变矮，坐标仍按 920 宽排布 → 敌人出屏、牌叠在一起。
 * 正确做法：保持此分辨率不变，由 Scale.FIT 把画布整体缩放塞进 `.phaser-wrap`。
 */
export const DESIGN_WIDTH = 920;
export const DESIGN_HEIGHT = 520;

/** Canvas 经 CSS 放大时，Phaser.Text 用更高内部分辨率绘制，减轻发糊。 */
export function getBattleCanvasTextResolution(): number {
  if (typeof window === 'undefined') return 1;
  return Math.min(window.devicePixelRatio || 1, 2.25);
}

export function createBattleGame(parent: HTMLElement): Game {
  return new Game({
    type: AUTO,
    parent,
    backgroundColor: '#0f0e0c',
    scene: [BattleScene],
    render: {
      roundPixels: true,
    },
    scale: {
      mode: Scale.FIT,
      autoCenter: Scale.CENTER_BOTH,
      autoRound: true,
      width: DESIGN_WIDTH,
      height: DESIGN_HEIGHT,
    },
  });
}
