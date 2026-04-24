import type { GameObjects, Input } from 'phaser';
import { Geom, Scene, Scenes } from 'phaser';
import { buildCardKeywordHints, cardTargetLabel, cardTypeLabel, formatMonsterIntentText } from '@/game/core/battleUiText';
import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import { getCardArchetype, ARCHETYPE_DISPLAY } from '@/game/core/definitions/cards/archetypes';
import { POTION_DEFINITIONS } from '@/game/core/definitions/potions';
import type { BattleState } from '@/game/core/model/battle';
import type { CardTarget } from '@/game/core/model/card';
import { PLAYER_UNIT_ID } from '@/game/core/engine/createMvpRun';
import { useGameStore } from '@/game/store/gameStore';
import { decidePlayCardCommand } from '../controllers/DragController';
import {
  consumePendingEvents,
  dispatchGameCommand,
  getBattleSnapshot,
  isFastModeEnabled,
} from '../controllers/SceneBridge';
import { BATTLE_RENDER_SCALE, getBattleCanvasTextResolution, LOGICAL_HEIGHT, LOGICAL_WIDTH } from '../gameFactory';
import { PileStack } from './battle/PileStack';
import { UnitStatusBar } from './battle/UnitStatusBar';

/** 手牌区与敌人 AABB 分离，避免第 4～5 张默认就压在敌人命中盒上导致误判 / 输入抢优先级。 */
const HAND_START_X = 200;
const HAND_GAP_X = 96;
/** 在 ENVELOP 铺满策略下预留底部安全区，避免手牌在宽屏比例下被裁切。 */
const HAND_Y = 364;
/** 高于敌人装饰（1），避免右侧牌叠在敌人矩形下抢不到拖拽。 */
const HAND_DEPTH_BASE = 40;

const ENEMY_SLOT_X0 = 760;
const ENEMY_SLOT_DX = 168;

const PANEL_W = 150;
const PANEL_H = 200;
const PANEL_R = 14;

export class BattleScene extends Scene {
  /** 全体攻击牌松手判定区（与敌人区重叠也算命中） */
  private aoePlayRect!: Geom.Rectangle;
  private enemyHitRects: { unitId: string; rect: Geom.Rectangle }[] = [];
  private lastSceneKey = '';
  private unsub?: () => void;
  private floatGroup!: GameObjects.Group;
  private enemyLayer!: GameObjects.Container;
  private playerLayer!: GameObjects.Container;
  private enemyTargetZones: GameObjects.Zone[] = [];
  private previewLayer!: GameObjects.Container;
  private hoverOverlay!: GameObjects.Graphics;
  private dragHintText!: GameObjects.Text;
  private hoveredEnemyId: string | null = null;
  private aoeHover = false;
  private textRes = 1;
  private drawPile?: PileStack;
  private discardPile?: PileStack;
  private exhaustPile?: PileStack;
  private playerStatusBar?: UnitStatusBar;
  private enemyStatusBars = new Map<string, UnitStatusBar>();

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

  private resetBattleUi(): void {
    // Phaser 会在 scene shutdown 时把 game objects 销毁，但我们自己持有的 PileStack /
    // UnitStatusBar / Map 引用仍会指向已销毁对象；在重入前清掉，避免下次 create 访问到脏数据。
    this.drawPile = undefined;
    this.discardPile = undefined;
    this.exhaustPile = undefined;
    this.playerStatusBar = undefined;
    this.enemyStatusBars.clear();
    this.lastSceneKey = '';
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
      ps: pu?.statuses?.map((s) => [s.id, s.stacks]),
      dp: battle.player.drawPile.length,
      dc: battle.player.discardPile.length,
      ex: battle.player.exhaustPile.length,
      eh: battle.enemyUnitIds.map((id) => {
        const u = battle.units[id];
        const m = battle.monsters[id];
        return {
          hp: u?.hp,
          block: u?.block,
          intent: m?.intent,
          st: u?.statuses?.map((s) => [s.id, s.stacks]),
        };
      }),
    });
  }

  private drawStageBackdrop(): void {
    const g = this.add.graphics().setDepth(0);
    g.fillGradientStyle(0x141210, 0x141210, 0x1c1a16, 0x1c1a16, 1);
    g.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    g.fillStyle(0xc08457, 0.04);
    g.fillCircle(120, 80, 220);
    g.fillStyle(0x5a6b4e, 0.045);
    g.fillCircle(780, 120, 260);
    g.lineStyle(1, 0x3d3528, 0.35);
    for (let x = 0; x < LOGICAL_WIDTH; x += 40) {
      g.lineBetween(x, 0, x, LOGICAL_HEIGHT);
    }
    for (let y = 0; y < LOGICAL_HEIGHT; y += 40) {
      g.lineBetween(0, y, LOGICAL_WIDTH, y);
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

  private clearPreview(): void {
    this.previewLayer.removeAll(true);
    this.previewLayer.setVisible(false);
  }

  private showCardPreview(defId: string): void {
    const def = CARD_DEFINITIONS[defId];
    if (!def) {
      this.clearPreview();
      return;
    }

    this.previewLayer.removeAll(true);
    this.previewLayer.setVisible(true);

    const x = 304;
    const y = 124;
    const bg = this.add.graphics();
    bg.fillStyle(0x171511, 0.96);
    bg.lineStyle(2, 0xc08457, 0.85);
    bg.fillRoundedRect(x - 94, y - 92, 188, 184, 16);
    bg.strokeRoundedRect(x - 94, y - 92, 188, 184, 16);

    const title = this.txt(x, y - 66, def.name, {
      fontSize: '15px',
      color: '#f4e8d4',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: 160 },
    }).setOrigin(0.5, 0.5);
    const meta = this.txt(x, y - 36, `${cardTypeLabel(def.type)} · ${cardTargetLabel(def.target)} · ${def.cost} 费`, {
      fontSize: '10px',
      color: '#d6b48c',
      align: 'center',
      wordWrap: { width: 160 },
    }).setOrigin(0.5, 0.5);
    const desc = this.txt(x - 76, y - 10, def.description, {
      fontSize: '11px',
      color: '#e8e1d6',
      wordWrap: { width: 152 },
      lineSpacing: 2,
    });

    const hintLines = buildCardKeywordHints(def);
    const nodes: GameObjects.GameObject[] = [bg, title, meta, desc];
    if (hintLines.length > 0) {
      nodes.push(
        this.txt(
          x - 76,
          y + 44,
          hintLines.join('\n'),
          {
            fontSize: '9px',
            color: '#a9c8b9',
            wordWrap: { width: 152 },
            lineSpacing: 1,
          },
        ),
      );
    }

    this.previewLayer.add(nodes);
  }

  private renderHoverOverlay(): void {
    this.hoverOverlay.clear();
    if (this.hoveredEnemyId) {
      const hit = this.enemyHitRects.find((item) => item.unitId === this.hoveredEnemyId);
      if (hit) {
        this.hoverOverlay.lineStyle(3, 0xf4d58d, 0.95);
        this.hoverOverlay.fillStyle(0xf4d58d, 0.08);
        this.hoverOverlay.fillRoundedRect(hit.rect.x, hit.rect.y, hit.rect.width, hit.rect.height, 16);
        this.hoverOverlay.strokeRoundedRect(hit.rect.x, hit.rect.y, hit.rect.width, hit.rect.height, 16);
      }
    }
    if (this.aoeHover) {
      this.hoverOverlay.lineStyle(2, 0x8ad4ff, 0.85);
      this.hoverOverlay.fillStyle(0x8ad4ff, 0.05);
      this.hoverOverlay.fillRoundedRect(
        this.aoePlayRect.x,
        this.aoePlayRect.y,
        this.aoePlayRect.width,
        this.aoePlayRect.height,
        20,
      );
      this.hoverOverlay.strokeRoundedRect(
        this.aoePlayRect.x,
        this.aoePlayRect.y,
        this.aoePlayRect.width,
        this.aoePlayRect.height,
        20,
      );
    }
  }

  private setDragHint(text: string, color = '#d6cbb9'): void {
    this.dragHintText.setText(text);
    this.dragHintText.setColor(color);
    this.dragHintText.setVisible(Boolean(text));
  }

  private dragHintForTarget(target: CardTarget): string {
    if (target === 'single_enemy') return '拖到敌人身上释放';
    if (target === 'all_enemies') return '拖到战区或敌人身上释放';
    return '松手即可打出';
  }

  private updateDragHintForCard(defId: string): void {
    const def = CARD_DEFINITIONS[defId];
    if (!def) return;
    if (this.hoveredEnemyId) {
      const battle = getBattleSnapshot();
      const enemyName = battle?.units[this.hoveredEnemyId]?.name ?? '目标';
      this.setDragHint(`当前目标：${enemyName}`, '#f4d58d');
      return;
    }
    if (this.aoeHover) {
      this.setDragHint('当前目标：全体敌人', '#8ad4ff');
      return;
    }
    this.setDragHint(this.dragHintForTarget(def.target));
  }

  private updateDropHint(cardBounds: Geom.Rectangle): void {
    this.hoveredEnemyId = null;
    this.aoeHover = false;
    for (const { unitId, rect } of this.enemyHitRects) {
      if (Geom.Rectangle.Overlaps(cardBounds, rect)) {
        this.hoveredEnemyId = unitId;
        break;
      }
    }
    if (Geom.Rectangle.Overlaps(cardBounds, this.aoePlayRect)) {
      this.aoeHover = true;
    }
    this.renderHoverOverlay();
  }

  create(): void {
    this.textRes = getBattleCanvasTextResolution();
    this.cameras.main.setZoom(BATTLE_RENDER_SCALE);
    this.cameras.main.centerOn(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2);
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

    this.previewLayer = this.add.container(0, 0);
    this.previewLayer.setDepth(37);
    this.previewLayer.setVisible(false);

    this.hoverOverlay = this.add.graphics().setDepth(34);
    this.dragHintText = this.txt(460, 26, '', {
      fontSize: '12px',
      color: '#d6cbb9',
      fontStyle: 'bold',
      align: 'center',
      backgroundColor: 'rgba(20,18,16,0.55)',
      padding: { x: 8, y: 4 },
    }).setOrigin(0.5, 0.5).setDepth(38).setVisible(false);

    this.aoePlayRect = new Geom.Rectangle(380, 72, 520, 320);

    // 底部三堆可视化：抽牌堆/弃牌堆在左下，消耗堆在右下角避免与结束回合按钮冲突。
    this.drawPile = new PileStack(this, 56, LOGICAL_HEIGHT - 72, 'draw', this.textRes);
    this.discardPile = new PileStack(this, 116, LOGICAL_HEIGHT - 72, 'discard', this.textRes);
    this.exhaustPile = new PileStack(this, LOGICAL_WIDTH - 56, LOGICAL_HEIGHT - 72, 'exhaust', this.textRes);

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
      this.refreshPiles(battle ?? null);
      this.refreshStatusBars(battle ?? null);
    });

    const initial = useGameStore.getState().run?.battle ?? null;
    this.lastSceneKey = '';
    this.rebuildPlayerDisplay(initial);
    this.rebuildEnemyDisplay(initial);
    this.rebuildEnemyHitRects(initial);
    this.renderHand(initial);
    this.refreshPiles(initial);
    this.refreshStatusBars(initial);

    const detach = () => {
      this.detachStore();
      this.resetBattleUi();
    };
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
        this.spawnFloater(
          110,
          180,
          e.value > 0 ? `+${e.value} 生命` : `${POTION_DEFINITIONS[e.potionId]?.name ?? e.potionId}`,
          '#7dffb3',
        );
      } else if (e.type === 'DRAWPILE_RESHUFFLED') {
        this.playReshuffleAnimation(e.fromDiscardCount);
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
      const intentLine = `意图 · ${formatMonsterIntentText(monster?.intent)}`;
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
    this.enemyTargetZones.forEach((zone) => zone.destroy());
    this.enemyTargetZones = [];
    if (!battle) {
      this.enemyHitRects = [];
      return;
    }
    this.enemyHitRects = battle.enemyUnitIds.map((unitId, i) => {
      const cx = ENEMY_SLOT_X0 - i * ENEMY_SLOT_DX;
      const rect = new Geom.Rectangle(cx - 88, 108, 176, 228);
      const zone = this.add.zone(rect.centerX, rect.centerY, rect.width, rect.height);
      zone.setDepth(33);
      zone.setInteractive({ useHandCursor: true });
      zone.on('pointerover', () => {
        const battleSnapshot = getBattleSnapshot();
        if (battleSnapshot?.inputMode !== 'selecting_target') return;
        this.hoveredEnemyId = unitId;
        this.renderHoverOverlay();
        const enemyName = battleSnapshot.units[unitId]?.name ?? '目标';
        this.setDragHint(`点击确认目标：${enemyName}`, '#f4d58d');
      });
      zone.on('pointerout', () => {
        const battleSnapshot = getBattleSnapshot();
        if (battleSnapshot?.inputMode !== 'selecting_target') return;
        this.hoveredEnemyId = null;
        this.renderHoverOverlay();
        this.setDragHint('请选择一个敌人作为目标', '#d6cbb9');
      });
      zone.on('pointerup', () => {
        const battleSnapshot = getBattleSnapshot();
        if (battleSnapshot?.inputMode !== 'selecting_target' || !battleSnapshot.pendingAction) return;
        dispatchGameCommand({
          type: 'PLAY_CARD',
          cardInstanceId: battleSnapshot.pendingAction.cardInstanceId,
          sourceUnitId: battleSnapshot.pendingAction.sourceUnitId,
          targetUnitId: unitId,
        });
      });
      this.enemyTargetZones.push(zone);
      return { unitId, rect };
    });
  }

  private refreshPiles(battle: BattleState | null): void {
    if (!this.canUseDisplay()) return;
    if (!this.drawPile || !this.discardPile || !this.exhaustPile) return;
    const draw = battle?.player.drawPile.length ?? 0;
    const discard = battle?.player.discardPile.length ?? 0;
    const exhaust = battle?.player.exhaustPile.length ?? 0;
    this.drawPile.setCount(draw);
    this.discardPile.setCount(discard);
    this.exhaustPile.setCount(exhaust);
    const visible = Boolean(battle);
    this.drawPile.container.setVisible(visible);
    this.discardPile.container.setVisible(visible);
    this.exhaustPile.container.setVisible(visible);
  }

  private refreshStatusBars(battle: BattleState | null): void {
    if (!this.canUseDisplay()) return;

    // 玩家状态条：粘在玩家面板下方，HP 条再往下一点，避免盖住格挡文字。
    if (!battle) {
      this.playerStatusBar?.destroy();
      this.playerStatusBar = undefined;
    } else {
      const player = battle.units[battle.playerUnitId];
      if (player) {
        if (!this.playerStatusBar) {
          this.playerStatusBar = new UnitStatusBar(this, 110, 340, this.textRes);
        }
        this.playerStatusBar.setStatuses(player.statuses ?? []);
      } else if (this.playerStatusBar) {
        this.playerStatusBar.destroy();
        this.playerStatusBar = undefined;
      }
    }

    // 敌人状态条：按槽位对齐 ENEMY_SLOT_X0 - i * ENEMY_SLOT_DX，y 放在意图行下方。
    const existingIds = new Set(this.enemyStatusBars.keys());
    if (battle) {
      battle.enemyUnitIds.forEach((eid, i) => {
        const unit = battle.units[eid];
        if (!unit) return;
        const cx = ENEMY_SLOT_X0 - i * ENEMY_SLOT_DX;
        let bar = this.enemyStatusBars.get(eid);
        if (!bar) {
          bar = new UnitStatusBar(this, cx, 340, this.textRes);
          this.enemyStatusBars.set(eid, bar);
        } else {
          bar.container.setPosition(cx, 340);
        }
        bar.setStatuses(unit.statuses ?? []);
        existingIds.delete(eid);
      });
    }
    for (const staleId of existingIds) {
      const bar = this.enemyStatusBars.get(staleId);
      bar?.destroy();
      this.enemyStatusBars.delete(staleId);
    }
  }

  private playReshuffleAnimation(fromDiscardCount: number): void {
    if (!this.canUseDisplay()) return;
    if (!this.drawPile || !this.discardPile) return;
    const fast = isFastModeEnabled();
    const duration = fast ? 140 : 480;
    const flyCount = Math.min(5, Math.max(1, Math.ceil(fromDiscardCount / 3)));
    const startX = this.discardPile.getWorldPosition().x;
    const startY = this.discardPile.getWorldPosition().y;
    const endX = this.drawPile.getWorldPosition().x;
    const endY = this.drawPile.getWorldPosition().y;
    for (let i = 0; i < flyCount; i++) {
      const g = this.add.graphics();
      g.setDepth(37);
      g.fillStyle(0x3a2e28, 1);
      g.lineStyle(1.5, 0xa07858, 1);
      g.fillRoundedRect(-18, -24, 36, 48, 5);
      g.strokeRoundedRect(-18, -24, 36, 48, 5);
      g.setPosition(startX, startY);
      g.setAlpha(0.95);
      this.tweens.add({
        targets: g,
        x: endX,
        y: endY,
        delay: i * (fast ? 20 : 60),
        duration,
        ease: 'Quad.easeInOut',
        onComplete: () => g.destroy(),
      });
    }
    const label = this.txt(
      (startX + endX) / 2,
      startY - 40,
      '弃牌堆回洗',
      { fontSize: '12px', color: '#e8c4b8', fontStyle: 'bold' },
    ).setOrigin(0.5, 0.5).setDepth(38);
    this.tweens.add({
      targets: label,
      alpha: 0,
      y: label.y - 20,
      duration: duration + 200,
      ease: 'Cubic.easeOut',
      onComplete: () => label.destroy(),
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
    this.clearPreview();
    this.hoveredEnemyId = null;
    this.aoeHover = false;
    this.renderHoverOverlay();
    this.setDragHint('');
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

      // 流派标识：只对 guard / burst / mixed 在牌面右下画一个小圆点，neutral 不画以免视觉噪音。
      const archetype = getCardArchetype(inst.definitionId);
      if (archetype !== 'neutral') {
        const meta = ARCHETYPE_DISPLAY[archetype];
        const dot = this.add.graphics();
        dot.fillStyle(meta.hexColor, 1);
        dot.lineStyle(1, 0x1a1814, 0.8);
        dot.fillCircle(36, 46, 8);
        dot.strokeCircle(36, 46, 8);
        const dotLabel = this.txt(36, 46, meta.shortLabel, {
          fontSize: '10px',
          color: '#1a1814',
          fontStyle: 'bold',
        }).setOrigin(0.5, 0.5);
        container.add([dot, dotLabel]);
      }
      container.setSize(96, 128);
      container.setInteractive({ draggable: true });
      this.input.setDraggable(container);

      container.on('pointerover', () => {
        container.setScale(1.06);
        this.showCardPreview(inst.definitionId);
      });
      container.on('pointerout', () => {
        if (!container.getData('dragging')) {
          container.setScale(1);
        }
        this.clearPreview();
        this.setDragHint('');
      });
      container.on('pointerup', () => {
        const battleSnapshot = getBattleSnapshot();
        if (!battleSnapshot || container.getData('dragging')) return;
        if (battleSnapshot.inputMode === 'animation_lock') return;
        if (battleSnapshot.inputMode === 'selecting_target') {
          const pending = battleSnapshot.pendingAction;
          if (pending?.cardInstanceId === id) {
            dispatchGameCommand({ type: 'CANCEL_TARGET_SELECTION' });
            this.setDragHint('');
          }
          return;
        }
        dispatchGameCommand({ type: 'PLAY_CARD', cardInstanceId: id, sourceUnitId: PLAYER_UNIT_ID });
      });

      let dragOriginX = x;
      let dragOriginY = y;
      container.on('dragstart', () => {
        dragOriginX = container.x;
        dragOriginY = container.y;
        container.setData('dragging', true);
        container.setDepth(120);
        container.setScale(1.08);
        this.showCardPreview(inst.definitionId);
        this.setDragHint(this.dragHintForTarget(def.target));
        dispatchGameCommand({ type: 'BEGIN_DRAG_CARD', cardInstanceId: id, sourceUnitId: PLAYER_UNIT_ID });
      });
      container.on('drag', (_p: Input.Pointer, dragX: number, dragY: number) => {
        container.setPosition(dragX, dragY);
        this.updateDropHint(container.getBounds());
        this.updateDragHintForCard(inst.definitionId);
      });
      container.on('dragend', () => {
        container.setData('dragging', false);
        container.setDepth(HAND_DEPTH_BASE + slot);
        container.setScale(1);
        this.hoveredEnemyId = null;
        this.aoeHover = false;
        this.renderHoverOverlay();
        const command = decidePlayCardCommand(
          getBattleSnapshot(),
          id,
          container.getBounds(),
          this.enemyHitRects,
          this.aoePlayRect,
        );
        if (!command) {
          this.setDragHint('当前释放无效', '#ff8a7a');
          this.tweens.add({
            targets: container,
            x: dragOriginX,
            y: dragOriginY,
            duration: 120,
            ease: 'Cubic.easeOut',
          });
          this.showCardPreview(inst.definitionId);
          this.spawnFloater(dragOriginX, dragOriginY - 80, '未命中目标', '#ff8a7a');
          dispatchGameCommand({ type: 'CANCEL_DRAG_CARD' });
          return;
        }
        this.setDragHint('');
        this.clearPreview();
        dispatchGameCommand(command);
      });

      i += 1;
    }
  }
}
