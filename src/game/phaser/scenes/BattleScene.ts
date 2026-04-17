import type { GameObjects, Input } from 'phaser';
import { Geom, Scene, Scenes } from 'phaser';
import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import type { BattleState, MonsterIntent } from '@/game/core/model/battle';
import { PLAYER_UNIT_ID } from '@/game/core/engine/createMvpRun';
import { useGameStore } from '@/game/store/gameStore';
import { decidePlayCardCommand } from '../controllers/DragController';
import {
  consumePendingEvents,
  dispatchGameCommand,
  getBattleSnapshot,
  isFastModeEnabled,
} from '../controllers/SceneBridge';
import { getBattleCanvasTextResolution } from '../gameFactory';

/** 手牌区与敌人 AABB 分离，避免第 4～5 张默认就压在敌人命中盒上导致误判 / 输入抢优先级。 */
const HAND_START_X = 200;
const HAND_GAP_X = 96;
/** 设计高度 520 时手牌行略上移，避免贴底裁切 */
const HAND_Y = 400;
/** 高于敌人装饰（1），避免右侧牌叠在敌人矩形下抢不到拖拽。 */
const HAND_DEPTH_BASE = 40;

const ENEMY_SLOT_X0 = 760;
const ENEMY_SLOT_DX = 168;

const PANEL_W = 150;
const PANEL_H = 200;
const PANEL_R = 14;

function formatIntentLine(intent: MonsterIntent | null | undefined): string {
  if (!intent) return '意图 · —';
  switch (intent.type) {
    case 'attack':
      return `意图 · 攻击 ${intent.value}`;
    case 'block':
      return `意图 · 防御 ${intent.value}`;
    case 'buff':
      return `意图 · 增益 ${intent.value}`;
    case 'debuff':
      return `意图 · 减益 ${intent.value}`;
    case 'attack_buff':
      return `意图 · 攻 ${intent.attack} +状态`;
    default:
      return '意图 · —';
  }
}

export class BattleScene extends Scene {
  /** 全体攻击牌松手判定区（与敌人区重叠也算命中） */
  private aoePlayRect!: Geom.Rectangle;
  private enemyHitRects: { unitId: string; rect: Geom.Rectangle }[] = [];
  private lastSceneKey = '';
  private unsub?: () => void;
  private floatGroup!: GameObjects.Group;
  private enemyLayer!: GameObjects.Container;
  private playerLayer!: GameObjects.Container;
  private textRes = 1;

  constructor() {
    super('BattleScene');
  }

  private canUseDisplay(): boolean {
    return Boolean(this.add && this.sys?.isActive());
  }

  private detachStore(): void {
    this.unsub?.();
    this.unsub = undefined;
  }

  private txt(
    x: number,
    y: number,
    content: string,
    style: Phaser.Types.GameObjects.Text.TextStyle,
  ): GameObjects.Text {
    return this.add.text(x, y, content, {
      resolution: this.textRes,
      fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      ...style,
    });
  }

  private battleVisualKey(battle: BattleState | null | undefined): string {
    if (!battle) return '';
    const pu = battle.units[battle.playerUnitId];
    return JSON.stringify({
      hand: battle.player.hand,
      enemies: battle.enemyUnitIds,
      ph: pu?.hp,
      pb: pu?.block,
      eh: battle.enemyUnitIds.map((id) => {
        const u = battle.units[id];
        const m = battle.monsters[id];
        return { hp: u?.hp, block: u?.block, intent: m?.intent };
      }),
    });
  }

  private drawStageBackdrop(): void {
    const g = this.add.graphics().setDepth(0);
    g.fillGradientStyle(0x141210, 0x141210, 0x1c1a16, 0x1c1a16, 1);
    g.fillRect(0, 0, 920, 520);
    g.fillStyle(0xc08457, 0.04);
    g.fillCircle(120, 80, 220);
    g.fillStyle(0x5a6b4e, 0.045);
    g.fillCircle(780, 120, 260);
    g.lineStyle(1, 0x3d3528, 0.35);
    for (let x = 0; x < 920; x += 40) {
      g.lineBetween(x, 0, x, 520);
    }
    for (let y = 0; y < 520; y += 40) {
      g.lineBetween(0, y, 920, y);
    }
  }

  private roundedPanel(
    cx: number,
    cy: number,
    fill: number,
    fillAlpha: number,
    stroke: number,
  ): GameObjects.Graphics {
    const g = this.add.graphics();
    const x0 = cx - PANEL_W / 2;
    const y0 = cy - PANEL_H / 2;
    g.fillStyle(fill, fillAlpha);
    g.lineStyle(2, stroke, 1);
    g.fillRoundedRect(x0, y0, PANEL_W, PANEL_H, PANEL_R);
    g.strokeRoundedRect(x0, y0, PANEL_W, PANEL_H, PANEL_R);
    return g;
  }

  private hpBar(cx: number, y: number, ratio: number, fg: number, track: number): GameObjects.Graphics {
    const g = this.add.graphics();
    const bw = 118;
    const bh = 7;
    const x0 = cx - bw / 2;
    g.fillStyle(track, 1);
    g.fillRoundedRect(x0, y, bw, bh, 3);
    const rw = Math.max(0, bw * Math.min(1, Math.max(0, ratio)));
    g.fillStyle(fg, 1);
    g.fillRoundedRect(x0, y, rw, bh, 3);
    g.lineStyle(1, 0x000000, 0.25);
    g.strokeRoundedRect(x0, y, bw, bh, 3);
    return g;
  }

  create(): void {
    this.textRes = getBattleCanvasTextResolution();
    this.drawStageBackdrop();

    this.txt(18, 10, '战域', {
      fontSize: '11px',
      color: '#7a7368',
    }).setAlpha(0.85);

    this.playerLayer = this.add.container(0, 0);
    this.playerLayer.setDepth(1);

    this.enemyLayer = this.add.container(0, 0);
    this.enemyLayer.setDepth(1);

    this.floatGroup = this.add.group();
    this.floatGroup.setDepth(35);

    this.aoePlayRect = new Geom.Rectangle(380, 72, 520, 320);

    this.unsub = useGameStore.subscribe((s) => {
      if (!this.canUseDisplay()) return;
      const battle = s.run?.battle;
      const key = this.battleVisualKey(battle ?? null);
      if (key === this.lastSceneKey) return;
      this.lastSceneKey = key;
      this.rebuildPlayerDisplay(battle ?? null);
      this.rebuildEnemyDisplay(battle ?? null);
      this.rebuildEnemyHitRects(battle ?? null);
      this.renderHand(battle ?? null);
    });

    const initial = useGameStore.getState().run?.battle ?? null;
    this.lastSceneKey = '';
    this.rebuildPlayerDisplay(initial);
    this.rebuildEnemyDisplay(initial);
    this.rebuildEnemyHitRects(initial);
    this.renderHand(initial);

    const detach = () => this.detachStore();
    this.events.once(Scenes.Events.SHUTDOWN, detach);
    this.events.once(Scenes.Events.DESTROY, detach);
  }

  update(): void {
    if (!this.canUseDisplay()) return;
    const battle = getBattleSnapshot();
    const events = consumePendingEvents();
    for (const e of events) {
      if (e.type === 'DAMAGE_DEALT') {
        const x = this.unitCenterX(battle, e.targetUnitId);
        this.spawnFloater(x, 140, `-${e.value}`, '#ff8a7a');
      } else if (e.type === 'BLOCK_GAINED') {
        const x = this.unitCenterX(battle, e.unitId);
        this.spawnFloater(x, 160, `+${e.value} 格挡`, '#8ad4ff');
      } else if (e.type === 'BATTLE_WON') {
        this.spawnFloater(480, 80, '胜利', '#f4d58d');
      } else if (e.type === 'BATTLE_LOST') {
        this.spawnFloater(480, 80, '失败', '#888888');
      } else if (e.type === 'POTION_USED') {
        this.spawnFloater(110, 180, `+${e.value} 生命`, '#7dffb3');
      }
    }
    if (battle?.inputMode === 'animation_lock' && this.floatGroup.getLength() === 0) {
      dispatchGameCommand({ type: 'RESOLVE_ANIMATION_DONE' });
    }
  }

  private unitCenterX(battle: BattleState | null | undefined, unitId: string): number {
    if (!battle) return 480;
    if (unitId === PLAYER_UNIT_ID) return 110;
    const idx = battle.enemyUnitIds.indexOf(unitId);
    if (idx >= 0) return ENEMY_SLOT_X0 - idx * ENEMY_SLOT_DX;
    return 760;
  }

  private rebuildPlayerDisplay(battle: BattleState | null): void {
    if (!this.canUseDisplay()) return;
    this.playerLayer.removeAll(true);
    if (!battle) return;
    const u = battle.units[battle.playerUnitId];
    if (!u) return;
    const cx = 110;
    const cy = 220;
    const ratio = u.maxHp > 0 ? u.hp / u.maxHp : 0;
    this.playerLayer.add([
      this.roundedPanel(cx, cy, 0x243042, 0.94, 0x5a7ab0),
      this.hpBar(cx, cy + 58, ratio, 0x6a9dd4, 0x1a2533),
      this.txt(cx, cy - 72, u.name, {
        fontSize: '13px',
        color: '#e8e4dc',
        fontStyle: 'bold',
      }).setOrigin(0.5, 0.5),
      this.txt(cx, cy - 46, `${u.hp} / ${u.maxHp}`, {
        fontSize: '12px',
        color: '#c4d8ee',
      }).setOrigin(0.5, 0.5),
      this.txt(cx, cy - 18, `格挡 ${u.block}`, {
        fontSize: '11px',
        color: '#9adbc4',
      }).setOrigin(0.5, 0.5),
    ]);
  }

  private rebuildEnemyDisplay(battle: BattleState | null): void {
    if (!this.canUseDisplay()) return;
    this.enemyLayer.removeAll(true);
    if (!battle) return;
    battle.enemyUnitIds.forEach((eid, i) => {
      const u = battle.units[eid];
      const monster = battle.monsters[eid];
      const cx = ENEMY_SLOT_X0 - i * ENEMY_SLOT_DX;
      const cy = 220;
      const ratio = u && u.maxHp > 0 ? u.hp / u.maxHp : 0;
      const intentLine = formatIntentLine(monster?.intent);
      this.enemyLayer.add([
        this.roundedPanel(cx, cy, 0x3a2e28, 0.96, 0xa07858),
        this.hpBar(cx, cy + 58, ratio, 0xd4846a, 0x2a1e1c),
        this.txt(cx, cy - 72, u?.name ?? eid, {
          fontSize: '13px',
          color: '#f0ebe3',
          fontStyle: 'bold',
        }).setOrigin(0.5, 0.5),
        this.txt(cx, cy - 46, u ? `${u.hp} / ${u.maxHp}` : '', {
          fontSize: '12px',
          color: '#e8c4b8',
        }).setOrigin(0.5, 0.5),
        this.txt(cx, cy - 20, u ? `格挡 ${u.block}` : '', {
          fontSize: '11px',
          color: '#c4b8a8',
        }).setOrigin(0.5, 0.5),
        this.txt(cx, cy + 82, intentLine, {
          fontSize: '10px',
          color: '#f4d58d',
        }).setOrigin(0.5, 0.5),
      ]);
    });
  }

  private rebuildEnemyHitRects(battle: BattleState | null): void {
    if (!battle) {
      this.enemyHitRects = [];
      return;
    }
    this.enemyHitRects = battle.enemyUnitIds.map((unitId, i) => {
      const cx = ENEMY_SLOT_X0 - i * ENEMY_SLOT_DX;
      return { unitId, rect: new Geom.Rectangle(cx - 75, 120, 150, 200) };
    });
  }

  private spawnFloater(x: number, y: number, text: string, color: string): void {
    if (!this.canUseDisplay()) return;
    const fast = isFastModeEnabled();
    const duration = fast ? 220 : 900;
    const t = this.txt(x, y, text, {
      fontSize: '20px',
      color,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.floatGroup.add(t);
    this.tweens.add({
      targets: t,
      y: y - 48,
      alpha: 0,
      duration,
      ease: 'Cubic.eOut',
      onComplete: () => t.destroy(),
    });
  }

  private makeHandCardBg(fill: number, stroke: number): GameObjects.Graphics {
    const g = this.add.graphics();
    const w = 96;
    const h = 128;
    const r = 12;
    g.fillStyle(fill, 1);
    g.lineStyle(2, stroke, 1);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, r);
    g.strokeRoundedRect(-w / 2, -h / 2, w, h, r);
    return g;
  }

  private renderHand(battle: BattleState | null): void {
    if (!this.canUseDisplay()) return;
    this.children.list
      .filter((c) => c.getData('isHandCard'))
      .forEach((c) => c.destroy());

    if (!battle) return;

    let i = 0;
    for (const id of battle.player.hand) {
      const inst = battle.player.cards[id];
      if (!inst) continue;
      const def = CARD_DEFINITIONS[inst.definitionId];
      if (!def) continue;
      const x = HAND_START_X + i * HAND_GAP_X;
      const y = HAND_Y;
      const slot = i;
      const container = this.add.container(x, y);
      container.setDepth(HAND_DEPTH_BASE + slot);
      container.setData('isHandCard', true);
      container.setData('instanceId', id);
      container.setData('defId', inst.definitionId);

      const bgColor =
        def.target === 'all_enemies' ? 0x5c3838 : def.type === 'attack' ? 0x4a3030 : 0x304a40;
      const strokeColor =
        def.target === 'all_enemies' ? 0xc9a060 : def.type === 'attack' ? 0xb87870 : 0x6a9f8a;
      const bg = this.makeHandCardBg(bgColor, strokeColor);
      const nameText = def.target === 'all_enemies' ? `${def.name}·全` : def.name;
      const label = this.txt(0, -28, nameText, {
        fontSize: '13px',
        color: '#f0ebe3',
        align: 'center',
        wordWrap: { width: 88 },
      });
      label.setOrigin(0.5);
      const cost = this.txt(-36, -56, `${inst.costForTurn}`, {
        fontSize: '17px',
        color: '#f4d58d',
        fontStyle: 'bold',
      });
      cost.setOrigin(0.5);

      const costBadge = this.add.graphics();
      costBadge.fillStyle(0x1a1814, 0.55);
      costBadge.fillCircle(-36, -56, 15);
      costBadge.lineStyle(1, 0xf4d58d, 0.35);
      costBadge.strokeCircle(-36, -56, 15);

      container.add([bg, costBadge, cost, label]);
      container.setSize(96, 128);
      container.setInteractive({ draggable: true });
      this.input.setDraggable(container);

      let dragOriginX = x;
      let dragOriginY = y;
      container.on('dragstart', () => {
        dragOriginX = container.x;
        dragOriginY = container.y;
        container.setDepth(120);
      });
      container.on('drag', (_p: Input.Pointer, dragX: number, dragY: number) => {
        container.setPosition(dragX, dragY);
      });
      container.on('dragend', () => {
        container.setDepth(HAND_DEPTH_BASE + slot);
        const command = decidePlayCardCommand(
          getBattleSnapshot(),
          id,
          container.getBounds(),
          this.enemyHitRects,
          this.aoePlayRect,
        );
        if (!command) {
          container.setPosition(dragOriginX, dragOriginY);
          return;
        }
        dispatchGameCommand(command);
      });

      i += 1;
    }
  }
}
