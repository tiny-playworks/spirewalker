import type { GameObjects, Scene } from 'phaser';
import { getStatusMeta } from '@/game/core/definitions/statuses';
import type { StatusInstance } from '@/game/core/model/unit';

const BADGE_W = 26;
const BADGE_H = 20;
const BADGE_GAP = 4;

/**
 * 依状态 id 给每个 badge 配一个偏色，这里只做视觉区分，不承担语义校验 —— 未知状态走灰色。
 */
function colorForStatus(id: string): { fill: number; stroke: number; text: string } {
  switch (id) {
    case 'strength':
      return { fill: 0x6b2a1f, stroke: 0xc06a52, text: '#ffd1c4' };
    case 'weak':
      return { fill: 0x3a2a4a, stroke: 0x9a7ac2, text: '#d9caf0' };
    case 'vulnerable':
      return { fill: 0x5a2a2a, stroke: 0xc07878, text: '#f0c4c4' };
    case 'momentum':
      return { fill: 0x2a4a38, stroke: 0x6ac28c, text: '#caf0d2' };
    case 'metallicize':
      return { fill: 0x2a3a4a, stroke: 0x7aa4c2, text: '#c4d8f0' };
    case 'steady_guard':
      return { fill: 0x2a4a4a, stroke: 0x7ac2c2, text: '#c4f0f0' };
    case 'primed_break':
      return { fill: 0x4a3a2a, stroke: 0xc2a47a, text: '#f0d8c4' };
    default:
      return { fill: 0x333333, stroke: 0x808080, text: '#e8e8e8' };
  }
}

/**
 * 单位脚下的状态条 —— 直接显示在单位模型附近，避免玩家只能靠顶部 HUD 读 buff/debuff。
 *
 * 每个 badge 用短标签（例如「势」「弱」）配数量，统一画在一个 container 里；重建时整体重画。
 */
export class UnitStatusBar {
  readonly container: GameObjects.Container;
  private readonly scene: Scene;
  private readonly textRes: number;

  constructor(scene: Scene, x: number, y: number, textRes = 1) {
    this.scene = scene;
    this.textRes = textRes;
    this.container = scene.add.container(x, y);
    this.container.setDepth(18);
  }

  setStatuses(statuses: StatusInstance[]): void {
    this.container.removeAll(true);
    const active = statuses.filter((s) => s.stacks !== 0);
    if (active.length === 0) {
      this.container.setVisible(false);
      return;
    }
    this.container.setVisible(true);
    const total = active.length;
    const totalWidth = total * BADGE_W + (total - 1) * BADGE_GAP;
    let x = -totalWidth / 2 + BADGE_W / 2;
    for (const status of active) {
      const meta = getStatusMeta(status.id);
      const palette = colorForStatus(status.id);
      const g = this.scene.add.graphics();
      g.fillStyle(palette.fill, 0.92);
      g.lineStyle(1, palette.stroke, 1);
      g.fillRoundedRect(x - BADGE_W / 2, -BADGE_H / 2, BADGE_W, BADGE_H, 5);
      g.strokeRoundedRect(x - BADGE_W / 2, -BADGE_H / 2, BADGE_W, BADGE_H, 5);
      const labelText = this.scene.add
        .text(x - 7, 0, meta.shortLabel, {
          resolution: this.textRes,
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          fontSize: '11px',
          color: palette.text,
          fontStyle: 'bold',
        })
        .setOrigin(0.5, 0.5);
      const countText = this.scene.add
        .text(x + 6, 0, String(status.stacks), {
          resolution: this.textRes,
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          fontSize: '11px',
          color: palette.text,
          fontStyle: 'bold',
        })
        .setOrigin(0.5, 0.5);
      this.container.add([g, labelText, countText]);
      x += BADGE_W + BADGE_GAP;
    }
  }

  destroy(): void {
    this.container.destroy(true);
  }
}
