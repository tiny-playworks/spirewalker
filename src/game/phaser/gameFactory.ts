import { AUTO, Game, Scale } from "phaser";
import { BattleScene } from "./scenes/BattleScene";

/**
 * 固定设计分辨率（逻辑坐标系）。场景里敌人 x=760、手牌 y 等数字都按此尺寸排布。
 * 内部画布为逻辑尺寸的 2 倍（约 1840×1040），接近「2K 档」清晰度，兼顾锐度与 GPU/内存。
 * 场景里用摄像机 zoom = BATTLE_RENDER_SCALE，可见世界仍是 LOGICAL_WIDTH×LOGICAL_HEIGHT。
 */
export const LOGICAL_WIDTH = 920;
export const LOGICAL_HEIGHT = 520;
export const BATTLE_RENDER_SCALE = 2;
export const DESIGN_WIDTH = LOGICAL_WIDTH * BATTLE_RENDER_SCALE;
export const DESIGN_HEIGHT = LOGICAL_HEIGHT * BATTLE_RENDER_SCALE;

/** Canvas 经 CSS 放大时，Phaser.Text 用更高内部分辨率绘制，减轻发糊。 */
export function getBattleCanvasTextResolution(): number {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio || 1, 2);
}

export function createBattleGame(parent: HTMLElement): Game {
  return new Game({
    type: AUTO,
    parent,
    backgroundColor: "#0f0e0c",
    scene: [BattleScene],
    antialias: true,
    antialiasGL: true,
    powerPreference: "high-performance",
    render: {
      roundPixels: true,
    },
    scale: {
      // FIT 会保留纵横比，容器与画布比例不一致时易出现左右或上下大黑边。
      // ENVELOP 铺满父节点（类似 CSS cover），无黑边，极端比例下可能裁切上下或左右少量边。
      mode: Scale.FIT,
      autoCenter: Scale.CENTER_BOTH,
      autoRound: true,
      width: DESIGN_WIDTH,
      height: DESIGN_HEIGHT,
    },
  });
}
