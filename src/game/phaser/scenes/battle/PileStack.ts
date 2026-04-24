import type { GameObjects, Scene } from 'phaser';

export type PileKind = 'draw' | 'discard' | 'exhaust';

const PALETTE: Record<PileKind, { fill: number; stroke: number; label: string; accent: string }> = {
  draw: { fill: 0x243042, stroke: 0x5a7ab0, label: '抽', accent: '#c4d8ee' },
  discard: { fill: 0x3a2e28, stroke: 0xa07858, label: '弃', accent: '#e8c4b8' },
  exhaust: { fill: 0x2a2a2a, stroke: 0x6b6b6b, label: '消', accent: '#c8c8c8' },
};

/**
 * 战斗底部角落的一叠小卡背，用来展示 drawPile / discardPile / exhaustPile 的数量。
 *
 * 视觉：3 层叠放的圆角卡背 + 中央计数数字 + 下方类型标签。数量为 0 时整体转为半透明。
 */
export class PileStack {
  readonly container: GameObjects.Container;
  private readonly kind: PileKind;
  private readonly countText: GameObjects.Text;
  private readonly cardLayers: GameObjects.Graphics[];
  private lastCount = -1;

  constructor(scene: Scene, x: number, y: number, kind: PileKind, textRes = 1) {
    this.kind = kind;
    this.container = scene.add.container(x, y);
    this.container.setDepth(36);

    const w = 44;
    const h = 60;
    const r = 6;
    const p = PALETTE[kind];
    this.cardLayers = [];
    for (let i = 0; i < 3; i++) {
      const g = scene.add.graphics();
      g.fillStyle(p.fill, 1);
      g.lineStyle(1.5, p.stroke, 0.95);
      const ox = (i - 1) * 2;
      const oy = (i - 1) * 2;
      g.fillRoundedRect(ox - w / 2, oy - h / 2, w, h, r);
      g.strokeRoundedRect(ox - w / 2, oy - h / 2, w, h, r);
      this.container.add(g);
      this.cardLayers.push(g);
    }

    this.countText = scene.add
      .text(0, -4, '0', {
        resolution: textRes,
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        fontSize: '20px',
        color: p.accent,
        fontStyle: 'bold',
        align: 'center',
      })
      .setOrigin(0.5, 0.5);
    this.container.add(this.countText);

    const labelText = scene.add
      .text(0, h / 2 + 9, p.label, {
        resolution: textRes,
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        fontSize: '11px',
        color: p.accent,
        align: 'center',
      })
      .setOrigin(0.5, 0.5);
    this.container.add(labelText);
  }

  setCount(n: number): void {
    if (n === this.lastCount) return;
    this.lastCount = n;
    this.countText.setText(String(n));
    const alpha = n === 0 ? 0.4 : 1;
    for (const layer of this.cardLayers) layer.setAlpha(alpha);
    this.countText.setAlpha(alpha === 0.4 ? 0.55 : 1);
  }

  getKind(): PileKind {
    return this.kind;
  }

  /** 堆中心的世界坐标；供回洗动画起终点使用。 */
  getWorldPosition(): { x: number; y: number } {
    return { x: this.container.x, y: this.container.y };
  }

  destroy(): void {
    this.container.destroy(true);
  }
}
