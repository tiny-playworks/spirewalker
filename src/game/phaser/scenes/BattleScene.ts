import type { GameObjects, Input } from 'phaser';
import { Geom, Scene, Scenes } from 'phaser';
import { buildCardKeywordHints, cardTargetLabel, cardTypeLabel, formatMonsterIntentText } from '@/game/core/battleUiText';
import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import { getCardArchetype, ARCHETYPE_DISPLAY } from '@/game/core/definitions/cards/archetypes';
import { POTION_DEFINITIONS } from '@/game/core/definitions/potions';
import { getStatusMeta } from '@/game/core/definitions/statuses';
import type { BattleState } from '@/game/core/model/battle';
import type { CardDefinition, CardTarget, EffectDefinition } from '@/game/core/model/card';
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
const HAND_START_X = 184;
const HAND_GAP_X = 106;
/** 手牌略高于底部牌堆，保证普通浏览器比例下所有文字完整可见。 */
const HAND_Y = 386;
/** 高于敌人装饰（1），避免右侧牌叠在敌人矩形下抢不到拖拽。 */
const HAND_DEPTH_BASE = 40;

const ENEMY_SLOT_X0 = 764;
const ENEMY_SLOT_DX = 176;
const PLAYER_X = 150;
const UNIT_Y = 206;
const UNIT_STATUS_Y = 318;
const CARD_W = 112;
const CARD_H = 144;
const CARD_R = 11;

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
    g.fillGradientStyle(0x15130f, 0x15130f, 0x242018, 0x201b15, 1);
    g.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    g.fillGradientStyle(0x0a0908, 0x15120f, 0x0a0908, 0x15120f, 0.78, 0.12, 0.78, 0.12);
    g.fillRect(0, 0, 92, LOGICAL_HEIGHT);
    g.fillGradientStyle(0x15120f, 0x0a0908, 0x15120f, 0x0a0908, 0.12, 0.78, 0.12, 0.78);
    g.fillRect(LOGICAL_WIDTH - 92, 0, 92, LOGICAL_HEIGHT);

    g.fillStyle(0x2a241a, 0.72);
    g.fillRoundedRect(42, 48, LOGICAL_WIDTH - 84, 274, 20);
    g.lineStyle(2, 0x6f5a3f, 0.36);
    g.strokeRoundedRect(42, 48, LOGICAL_WIDTH - 84, 274, 20);

    g.fillGradientStyle(0x17130f, 0x17130f, 0x2e271c, 0x2b241a, 0.4, 0.4, 0.82, 0.82);
    g.fillRect(0, 314, LOGICAL_WIDTH, LOGICAL_HEIGHT - 314);
    g.lineStyle(2, 0xb4895e, 0.28);
    g.lineBetween(54, 314, LOGICAL_WIDTH - 54, 314);
    g.lineStyle(1, 0x463a2a, 0.35);
    for (let y = 350; y < LOGICAL_HEIGHT; y += 36) {
      g.lineBetween(36, y, LOGICAL_WIDTH - 36, y + 8);
    }
    for (let x = 104; x < LOGICAL_WIDTH; x += 108) {
      g.lineBetween(x, 316, x - 58, LOGICAL_HEIGHT);
    }

    g.fillStyle(0x000000, 0.2);
    g.fillRect(0, 0, LOGICAL_WIDTH, 24);
    g.fillRect(0, LOGICAL_HEIGHT - 20, LOGICAL_WIDTH, 20);
  }

  private unitHpBar(
    cx: number,
    y: number,
    hp: number,
    maxHp: number,
    fg: number,
    track: number,
    textColor: string,
  ): GameObjects.GameObject[] {
    const g = this.add.graphics();
    const bw = 152;
    const bh = 14;
    const x0 = cx - bw / 2;
    const ratio = maxHp > 0 ? hp / maxHp : 0;
    g.fillStyle(track, 1);
    g.fillRoundedRect(x0, y, bw, bh, 5);
    g.fillStyle(fg, 1);
    g.fillRoundedRect(x0, y, Math.max(0, bw * Math.min(1, Math.max(0, ratio))), bh, 5);
    g.lineStyle(1, 0x0b0a08, 0.7);
    g.strokeRoundedRect(x0, y, bw, bh, 5);
    const label = this.txt(cx, y + bh / 2, `${hp} / ${maxHp}`, {
      fontSize: '10px',
      color: textColor,
      fontStyle: 'bold',
      align: 'center',
    }).setOrigin(0.5, 0.5);
    return [g, label];
  }

  private blockBadge(cx: number, y: number, block: number, tone: 'player' | 'enemy'): GameObjects.GameObject[] {
    if (block <= 0) return [];
    const fill = tone === 'player' ? 0x20394a : 0x3c3026;
    const stroke = tone === 'player' ? 0x8ad4ff : 0xd4a078;
    const text = tone === 'player' ? '#c7ebff' : '#f2d0b6';
    const g = this.add.graphics();
    g.fillStyle(fill, 0.95);
    g.lineStyle(1.5, stroke, 0.9);
    g.fillRoundedRect(cx - 31, y - 12, 62, 24, 8);
    g.strokeRoundedRect(cx - 31, y - 12, 62, 24, 8);
    const label = this.txt(cx, y, `盾 ${block}`, {
      fontSize: '11px',
      color: text,
      fontStyle: 'bold',
    }).setOrigin(0.5, 0.5);
    return [g, label];
  }

  private collectCardEffects(effects: readonly EffectDefinition[], repeatTimes = 1): EffectDefinition[] {
    const flat: EffectDefinition[] = [];
    for (const effect of effects) {
      if (effect.type === 'repeat') {
        flat.push(...this.collectCardEffects(effect.effects, repeatTimes * effect.times));
        continue;
      }
      for (let i = 0; i < repeatTimes; i += 1) flat.push(effect);
    }
    return flat;
  }

  private cardFocus(def: CardDefinition): { value: string; label: string; tone: 'attack' | 'block' | 'utility' } {
    const effects = this.collectCardEffects(def.effects);
    const damage = effects.reduce((sum, effect) => {
      if (effect.type === 'damage') return sum + effect.value;
      if (effect.type === 'custom' && effect.scriptId === 'momentum_burst_damage') {
        return sum + Number(effect.params?.baseDamage ?? 0);
      }
      return sum;
    }, 0);
    if (damage > 0) return { value: String(damage), label: '伤害', tone: 'attack' };

    const block = effects.reduce((sum, effect) => {
      if (effect.type === 'block') return sum + effect.value;
      if (effect.type === 'custom' && effect.scriptId === 'momentum_guard_by_stacks') {
        return sum + Number(effect.params?.baseBlock ?? 0);
      }
      return sum;
    }, 0);
    if (block > 0) return { value: String(block), label: '格挡', tone: 'block' };

    const draw = effects.find((effect) => effect.type === 'draw');
    if (draw?.type === 'draw') return { value: String(draw.value), label: '抽牌', tone: 'utility' };
    const energy = effects.find((effect) => effect.type === 'gain_energy');
    if (energy?.type === 'gain_energy') return { value: `+${energy.value}`, label: '能量', tone: 'utility' };
    const status = effects.find((effect) => effect.type === 'apply_status');
    if (status?.type === 'apply_status') return { value: String(status.stacks), label: getStatusMeta(status.statusId).shortLabel, tone: 'utility' };
    if (def.type === 'power') return { value: '持', label: '能力', tone: 'utility' };
    return { value: '技', label: cardTypeLabel(def.type), tone: 'utility' };
  }

  private unitNamePlate(cx: number, y: number, name: string, tone: 'player' | 'enemy'): GameObjects.GameObject[] {
    const fill = tone === 'player' ? 0x172030 : 0x241914;
    const stroke = tone === 'player' ? 0x5a7ab0 : 0xa07858;
    const g = this.add.graphics();
    g.fillStyle(fill, 0.72);
    g.lineStyle(1, stroke, 0.34);
    g.fillRoundedRect(cx - 60, y - 11, 120, 22, 9);
    g.strokeRoundedRect(cx - 60, y - 11, 120, 22, 9);
    const label = this.txt(cx, y, name, {
      fontSize: '12px',
      color: '#f0ebe3',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: 108 },
    }).setOrigin(0.5, 0.5);
    return [g, label];
  }

  private unitToken(cx: number, cy: number, tone: 'player' | 'enemy', alive: boolean): GameObjects.Graphics {
    const g = this.add.graphics();
    const alpha = alive ? 1 : 0.38;
    const fill = tone === 'player' ? 0x263752 : 0x4a2f24;
    const stroke = tone === 'player' ? 0x78a0d4 : 0xd08a68;
    const dark = tone === 'player' ? 0x111926 : 0x21130f;

    g.fillStyle(0x000000, 0.34 * alpha);
    g.fillEllipse(cx, cy + 76, 144, 28);
    g.fillStyle(dark, 0.82 * alpha);
    g.fillEllipse(cx, cy + 74, 110, 16);

    g.fillStyle(fill, 0.96 * alpha);
    g.lineStyle(2, stroke, 0.9 * alpha);
    if (tone === 'player') {
      g.fillRoundedRect(cx - 40, cy - 38, 80, 102, 22);
      g.strokeRoundedRect(cx - 40, cy - 38, 80, 102, 22);
      g.fillCircle(cx, cy - 68, 24);
      g.strokeCircle(cx, cy - 68, 24);
      g.fillStyle(0x182235, 0.86 * alpha);
      g.fillTriangle(cx - 58, cy + 2, cx - 28, cy + 70, cx - 10, cy + 40);
      g.fillTriangle(cx + 58, cy + 2, cx + 28, cy + 70, cx + 10, cy + 40);
      g.lineStyle(2, 0xb8cceb, 0.52 * alpha);
      g.lineBetween(cx - 22, cy - 10, cx + 22, cy - 10);
    } else {
      g.fillEllipse(cx, cy - 8, 92, 130);
      g.strokeEllipse(cx, cy - 8, 92, 130);
      g.fillCircle(cx, cy - 76, 27);
      g.strokeCircle(cx, cy - 76, 27);
      g.fillTriangle(cx - 24, cy - 82, cx - 56, cy - 102, cx - 40, cy - 64);
      g.fillTriangle(cx + 24, cy - 82, cx + 56, cy - 102, cx + 40, cy - 64);
      g.lineStyle(2, 0xf0b08a, 0.48 * alpha);
      g.lineBetween(cx - 24, cy - 32, cx + 24, cy - 32);
    }
    return g;
  }

  private enemyIntentPill(cx: number, y: number, text: string, intentType?: string): GameObjects.Container {
    const isAttack = intentType === 'attack' || intentType === 'multi_hit' || intentType === 'heavy_charge';
    const fill = isAttack ? 0x3f221c : 0x293421;
    const stroke = isAttack ? 0xd4846a : 0x8fb06a;
    const color = isAttack ? '#ffd0bf' : '#d7edc0';
    const c = this.add.container(cx, y);
    const label = this.txt(0, 0, text, {
      fontSize: '10px',
      color,
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: 118 },
    }).setOrigin(0.5, 0.5);
    const w = Math.max(78, Math.min(128, label.width + 24));
    const bg = this.add.graphics();
    bg.fillStyle(fill, 0.94);
    bg.lineStyle(1.5, stroke, 0.9);
    bg.fillRoundedRect(-w / 2, -14, w, 28, 9);
    bg.strokeRoundedRect(-w / 2, -14, w, 28, 9);
    c.add([bg, label]);
    return c;
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

    this.aoePlayRect = new Geom.Rectangle(330, 50, 560, 288);

    // 底部三堆可视化：抽牌堆/弃牌堆在左下，消耗堆在右下角避免与结束回合按钮冲突。
    this.drawPile = new PileStack(this, 56, LOGICAL_HEIGHT - 90, 'draw', this.textRes);
    this.discardPile = new PileStack(this, 116, LOGICAL_HEIGHT - 90, 'discard', this.textRes);
    this.exhaustPile = new PileStack(this, LOGICAL_WIDTH - 56, LOGICAL_HEIGHT - 90, 'exhaust', this.textRes);

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
          PLAYER_X,
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
    if (unitId === PLAYER_UNIT_ID) return PLAYER_X;
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
    const cx = PLAYER_X;
    const cy = UNIT_Y;
    this.playerLayer.add([
      ...this.unitNamePlate(cx, cy - 118, u.name, 'player'),
      this.unitToken(cx, cy, 'player', u.alive),
      ...this.blockBadge(cx, cy + 58, u.block, 'player'),
      ...this.unitHpBar(cx, cy + 82, u.hp, u.maxHp, 0x6a9dd4, 0x101722, '#eef6ff'),
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
      const cy = UNIT_Y;
      const intentLine = formatMonsterIntentText(monster?.intent);
      this.enemyLayer.add([
        this.enemyIntentPill(cx, cy - 132, intentLine, monster?.intent?.type),
        ...this.unitNamePlate(cx, cy - 112, u?.name ?? eid, 'enemy'),
        this.unitToken(cx, cy, 'enemy', u?.alive ?? true),
        ...(u ? this.blockBadge(cx, cy + 58, u.block, 'enemy') : []),
        ...(u ? this.unitHpBar(cx, cy + 82, u.hp, u.maxHp, 0xd4846a, 0x281915, '#fff0e6') : []),
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
      const rect = new Geom.Rectangle(cx - 88, 54, 176, 278);
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

    // 状态条贴近单位脚下，作为场上信息的一部分，而不是顶部调试读数。
    if (!battle) {
      this.playerStatusBar?.destroy();
      this.playerStatusBar = undefined;
    } else {
      const player = battle.units[battle.playerUnitId];
      if (player) {
        if (!this.playerStatusBar) {
          this.playerStatusBar = new UnitStatusBar(this, PLAYER_X, UNIT_STATUS_Y, this.textRes);
        } else {
          this.playerStatusBar.container.setPosition(PLAYER_X, UNIT_STATUS_Y);
        }
        this.playerStatusBar.setStatuses(player.statuses ?? []);
      } else if (this.playerStatusBar) {
        this.playerStatusBar.destroy();
        this.playerStatusBar = undefined;
      }
    }

    const existingIds = new Set(this.enemyStatusBars.keys());
    if (battle) {
      battle.enemyUnitIds.forEach((eid, i) => {
        const unit = battle.units[eid];
        if (!unit) return;
        const cx = ENEMY_SLOT_X0 - i * ENEMY_SLOT_DX;
        let bar = this.enemyStatusBars.get(eid);
        if (!bar) {
          bar = new UnitStatusBar(this, cx, UNIT_STATUS_Y, this.textRes);
          this.enemyStatusBars.set(eid, bar);
        } else {
          bar.container.setPosition(cx, UNIT_STATUS_Y);
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

  private cardPalette(def: CardDefinition): { fill: number; stroke: number; accent: number; label: string; text: string } {
    if (def.type === 'power') {
      return { fill: 0x32263f, stroke: 0x9b7ad4, accent: 0xb38ad4, label: '能力', text: '#eadcff' };
    }
    if (def.type === 'skill') {
      return { fill: 0x263c35, stroke: 0x6a9f8a, accent: 0x7dc29f, label: '技能', text: '#daf4e7' };
    }
    if (def.target === 'all_enemies') {
      return { fill: 0x463128, stroke: 0xd4a064, accent: 0xf0c078, label: '攻击', text: '#ffe3cc' };
    }
    return { fill: 0x3f2927, stroke: 0xb87870, accent: 0xd4846a, label: '攻击', text: '#ffe1d8' };
  }

  private compactCardDescription(text: string): string {
    const compact = text.replace(/\s+/g, '');
    return compact.length > 12 ? `${compact.slice(0, 10)}...` : compact;
  }

  private compactTargetLabel(target: CardTarget): string {
    if (target === 'single_enemy') return '单体';
    if (target === 'all_enemies') return '全体';
    if (target === 'self') return '自身';
    return '无需目标';
  }

  private makeHandCardBg(def: CardDefinition, upgraded: boolean): GameObjects.Graphics {
    const p = this.cardPalette(def);
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.22);
    g.fillRoundedRect(-CARD_W / 2 + 3, -CARD_H / 2 + 4, CARD_W, CARD_H, CARD_R);
    g.fillGradientStyle(p.fill, p.fill, 0x17130f, 0x17130f, 1, 1, 1, 1);
    g.lineStyle(2, p.stroke, 0.96);
    g.fillRoundedRect(-CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H, CARD_R);
    g.strokeRoundedRect(-CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H, CARD_R);

    g.fillStyle(p.accent, 0.16);
    g.fillRoundedRect(-CARD_W / 2 + 5, -CARD_H / 2 + 5, CARD_W - 10, 30, 8);
    g.lineStyle(1, p.accent, 0.35);
    g.strokeRoundedRect(-CARD_W / 2 + 5, -CARD_H / 2 + 5, CARD_W - 10, 30, 8);

    g.fillStyle(0x0d0b09, 0.34);
    g.fillRoundedRect(-CARD_W / 2 + 10, -24, CARD_W - 20, 54, 9);
    g.lineStyle(1, p.accent, 0.18);
    g.strokeRoundedRect(-CARD_W / 2 + 10, -24, CARD_W - 20, 54, 9);

    g.fillStyle(0x0d0b09, 0.58);
    g.fillRoundedRect(-CARD_W / 2 + 8, CARD_H / 2 - 26, CARD_W - 16, 18, 6);
    if (upgraded) {
      g.fillStyle(0xf4d58d, 0.95);
      g.fillTriangle(CARD_W / 2 - 24, -CARD_H / 2, CARD_W / 2, -CARD_H / 2, CARD_W / 2, -CARD_H / 2 + 24);
    }
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

      const palette = this.cardPalette(def);
      const upgraded = inst.upgraded || inst.definitionId.includes('+');
      const focus = this.cardFocus(def);
      const bg = this.makeHandCardBg(def, upgraded);
      const title = this.txt(12, -58, def.name, {
        fontSize: '12px',
        color: palette.text,
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: 72 },
      }).setOrigin(0.5, 0.5);
      const cost = this.txt(-42, -56, `${inst.costForTurn}`, {
        fontSize: '17px',
        color: '#f4d58d',
        fontStyle: 'bold',
      }).setOrigin(0.5, 0.5);

      const costBadge = this.add.graphics();
      costBadge.fillStyle(0x12100d, 0.92);
      costBadge.fillCircle(-42, -56, 16);
      costBadge.lineStyle(1.5, 0xf4d58d, 0.78);
      costBadge.strokeCircle(-42, -56, 16);

      const focusColor = focus.tone === 'attack' ? '#ffd0bf' : focus.tone === 'block' ? '#c7ebff' : '#f4d58d';
      const focusValue = this.txt(0, -8, focus.value, {
        fontSize: focus.value.length > 2 ? '25px' : '34px',
        color: focusColor,
        fontStyle: 'bold',
        align: 'center',
      }).setOrigin(0.5, 0.5);
      const focusLabel = this.txt(0, 19, focus.label, {
        fontSize: '10px',
        color: '#d7c9b7',
        fontStyle: 'bold',
        align: 'center',
      }).setOrigin(0.5, 0.5);

      const desc = this.txt(-43, 35, this.compactCardDescription(def.description), {
        fontSize: '8px',
        color: '#cfc2b1',
        lineSpacing: 0,
        wordWrap: { width: 86 },
      });

      const bottomLabel = this.txt(-42, 56, `${palette.label} · ${this.compactTargetLabel(def.target)}`, {
        fontSize: '8px',
        color: '#cdbfae',
        wordWrap: { width: 72 },
      }).setOrigin(0, 0.5);

      const nodes: GameObjects.GameObject[] = [bg, costBadge, cost, title, focusValue, focusLabel, desc, bottomLabel];
      if (upgraded) {
        nodes.push(
          this.txt(46, -60, '+', {
            fontSize: '13px',
            color: '#21180c',
            fontStyle: 'bold',
          }).setOrigin(0.5, 0.5),
        );
      }

      // 流派标识：只对 guard / burst / mixed 在牌面右下画一个小圆点，neutral 不画以免视觉噪音。
      const archetype = getCardArchetype(inst.definitionId);
      if (archetype !== 'neutral') {
        const meta = ARCHETYPE_DISPLAY[archetype];
        const dot = this.add.graphics();
        dot.fillStyle(meta.hexColor, 1);
        dot.lineStyle(1, 0x1a1814, 0.8);
        dot.fillCircle(40, 54, 8);
        dot.strokeCircle(40, 54, 8);
        const dotLabel = this.txt(40, 54, meta.shortLabel, {
          fontSize: '10px',
          color: '#1a1814',
          fontStyle: 'bold',
        }).setOrigin(0.5, 0.5);
        nodes.push(dot, dotLabel);
      }

      container.add(nodes);
      container.setSize(CARD_W, CARD_H);
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
