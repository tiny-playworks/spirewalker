import Phaser from 'phaser';
import { ITEM_BY_ID, RARITY_LABELS } from '@/game/content';
import type { LootDrop, RunStateV2, WorldBridge, WorldInteraction, WorldOverlay } from '@/game/types';
import { createProceduralTextures } from './proceduralTextures';

interface WorldSceneOptions {
  bridge: WorldBridge;
  run: RunStateV2 | null;
  reducedMotion: boolean;
}

interface InteractionTarget extends WorldInteraction {
  x: number;
  y: number;
  radius: number;
  overlay?: Exclude<WorldOverlay, 'none'>;
}

const WORLD_WIDTH = 1_280;
const WORLD_HEIGHT = 720;

export class WorldScene extends Phaser.Scene {
  private options: WorldSceneOptions | null = null;
  private run: RunStateV2 | null = null;
  private player: Phaser.GameObjects.Image | null = null;
  private playerShadow: Phaser.GameObjects.Image | null = null;
  private weapon: Phaser.GameObjects.Image | null = null;
  private chest: Phaser.GameObjects.Image | null = null;
  private keys: Record<'up' | 'down' | 'left' | 'right' | 'interact' | 'swap', Phaser.Input.Keyboard.Key> | null = null;
  private readonly worldObjects: Phaser.GameObjects.GameObject[] = [];
  private readonly interactions: InteractionTarget[] = [];
  private currentInteraction: InteractionTarget | null = null;
  private externalPaused = false;
  private chestOpening = false;
  private renderSignature = '';
  private revealedChestId: string | null = null;
  private direction = 4;
  private activeWeapon: 0 | 1 = 0;
  private swapQueued = false;

  constructor() {
    super('WorldScene');
  }

  configure(options: WorldSceneOptions): this {
    this.options = options;
    this.run = options.run;
    return this;
  }

  sync(run: RunStateV2 | null, reducedMotion: boolean): void {
    this.run = run;
    this.activeWeapon = run?.activeWeapon ?? this.activeWeapon;
    if (this.options) {
      this.options.run = run;
      this.options.reducedMotion = reducedMotion;
    }
    const signature = worldSignature(run);
    if (this.sys?.isActive() && signature !== this.renderSignature) this.renderWorld(false);
    else if (this.sys?.isActive()) this.updateWeaponTexture();
  }

  setExternalPaused(paused: boolean): void {
    if (this.externalPaused === paused && (!this.sys?.isActive() || this.time.paused === paused)) return;
    this.externalPaused = paused;
    if (!this.sys?.isActive()) return;
    this.time.paused = paused;
    if (paused) this.tweens.pauseAll();
    else this.tweens.resumeAll();
  }

  preload(): void {
    for (let index = 0; index < 8; index += 1) {
      const key = `artificer-dir-${index}`;
      if (!this.textures.exists(key)) {
        this.load.image(key, assetUrl(`characters/artificer/directions/${String(index + 1).padStart(2, '0')}.png`));
      }
    }
  }

  create(): void {
    if (!this.options) throw new Error('WorldScene must be configured before boot');
    this.player = null;
    this.playerShadow = null;
    this.weapon = null;
    this.chest = null;
    this.worldObjects.length = 0;
    this.interactions.length = 0;
    this.currentInteraction = null;
    this.chestOpening = false;
    this.time.paused = this.externalPaused;
    createProceduralTextures(this);
    createWorldTextures(this);
    this.createPlayer();
    this.renderWorld(true);

    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error('Keyboard input is required');
    this.keys = {
      up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      interact: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      swap: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
    };
    keyboard.addCapture([
      Phaser.Input.Keyboard.KeyCodes.W,
      Phaser.Input.Keyboard.KeyCodes.A,
      Phaser.Input.Keyboard.KeyCodes.S,
      Phaser.Input.Keyboard.KeyCodes.D,
      Phaser.Input.Keyboard.KeyCodes.E,
      Phaser.Input.Keyboard.KeyCodes.Q,
    ]);
    this.input.on('wheel', this.queueSwap, this);
    this.game.events.on(Phaser.Core.Events.BLUR, this.pauseFromBlur, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.dispose, this);
    if (this.externalPaused) this.tweens.pauseAll();
  }

  update(_time: number, delta: number): void {
    if (!this.keys || !this.player || !this.options) return;
    if (this.externalPaused || this.chestOpening) return;
    if (Phaser.Input.Keyboard.JustDown(this.keys.swap) || this.consumeSwapQueue()) {
      this.activeWeapon = this.activeWeapon === 0 ? 1 : 0;
      this.updateWeaponTexture();
      this.options.bridge.onWeaponSwapped(this.activeWeapon);
    }

    let moveX = Number(this.keys.right.isDown) - Number(this.keys.left.isDown);
    let moveY = Number(this.keys.down.isDown) - Number(this.keys.up.isDown);
    const magnitude = Math.hypot(moveX, moveY);
    if (magnitude > 0) {
      moveX /= magnitude;
      moveY /= magnitude;
      const speed = 260;
      this.player.x = Phaser.Math.Clamp(this.player.x + moveX * speed * Math.min(delta, 34) / 1_000, 58, WORLD_WIDTH - 58);
      this.player.y = Phaser.Math.Clamp(this.player.y + moveY * speed * Math.min(delta, 34) / 1_000, 82, WORLD_HEIGHT - 58);
      this.direction = movementDirection(moveX, moveY);
      this.player.setTexture(`artificer-dir-${this.direction}`);
    }
    this.player.setDepth(20 + this.player.y * 0.001);
    this.playerShadow?.setPosition(this.player.x, this.player.y + 38);
    const pointer = this.input.activePointer;
    const rotation = Math.atan2(pointer.worldY - this.player.y, pointer.worldX - this.player.x);
    this.weapon?.setPosition(this.player.x + Math.cos(rotation) * 23, this.player.y + Math.sin(rotation) * 23 - 3)
      .setRotation(rotation)
      .setFlipY(Math.cos(rotation) < 0)
      .setDepth(22 + this.player.y * 0.001);

    this.updateInteraction();
    if (Phaser.Input.Keyboard.JustDown(this.keys.interact) && this.currentInteraction) {
      this.activateInteraction(this.currentInteraction);
    }
  }

  private createPlayer(): void {
    const startY = new URLSearchParams(window.location.search).has('e2e') ? 290 : 570;
    this.playerShadow = this.add.image(640, startY + 38, 'entity-shadow').setDisplaySize(92, 28).setDepth(15).setAlpha(0.3);
    this.player = this.add.image(640, startY, 'artificer-dir-4').setDisplaySize(116, 116).setDepth(21);
    this.weapon = this.add.image(680, startY, 'weapon-arc').setOrigin(0.18, 0.5).setDepth(22);
    this.activeWeapon = this.run?.activeWeapon ?? 0;
    this.updateWeaponTexture();
  }

  private renderWorld(resetPlayer: boolean): void {
    for (const object of this.worldObjects) object.destroy();
    this.worldObjects.length = 0;
    this.interactions.length = 0;
    this.chest = null;
    this.currentInteraction = null;
    this.options?.bridge.onInteraction(null);
    this.renderSignature = worldSignature(this.run);

    this.drawBaseFloor();
    if (!this.run) this.drawWorkshop();
    else if (this.run.phase === 'route') this.drawRouteHall();
    else if (this.run.phase === 'chest' || this.run.phase === 'loot') this.drawChestRoom();
    else if (this.run.phase === 'prototype-complete') this.drawPrototypeComplete();

    if (resetPlayer && this.player) {
      this.player.setPosition(640, new URLSearchParams(window.location.search).has('e2e') ? 290 : 570);
      this.playerShadow?.setPosition(this.player.x, this.player.y + 38);
    } else if (this.run?.phase === 'route' && this.player) {
      this.player.setPosition(640, 570);
      this.playerShadow?.setPosition(640, 608);
    }
  }

  private drawBaseFloor(): void {
    const graphics = this.track(this.add.graphics().setDepth(-30));
    graphics.fillStyle(0xf8edcf, 1).fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    graphics.fillStyle(0xe6f5e9, 1).fillRoundedRect(28, 28, 1_224, 664, 44);
    graphics.lineStyle(4, 0xffffff, 0.8).strokeRoundedRect(28, 28, 1_224, 664, 44);
    graphics.lineStyle(2, 0x83c7b7, 0.2);
    for (let x = 80; x < WORLD_WIDTH; x += 80) graphics.lineBetween(x, 40, x, 680);
    for (let y = 80; y < WORLD_HEIGHT; y += 80) graphics.lineBetween(40, y, 1_240, y);
    graphics.fillStyle(0x1a6c6d, 0.95).fillRoundedRect(30, 28, 1_220, 50, 22);
    graphics.fillStyle(0xf1bc55, 0.95);
    for (let index = 0; index < 11; index += 1) graphics.fillCircle(90 + index * 110, 53, 5);
  }

  private drawWorkshop(): void {
    this.addWorldTitle('辉芯工坊', '走进工坊，不是在菜单里翻页');
    this.drawGate(640, 150, '远征门', 0x23bdb5, 0xf2c65f);
    this.interactions.push({ kind: 'station', id: 'start-run', label: '启动远征门', hint: '开始本次试炼', x: 640, y: 205, radius: 150 });

    this.drawStation(230, 255, '角色台', 'C', 0x54cfc2);
    this.interactions.push({ kind: 'station', id: 'character', label: '查看魔导工匠', hint: '人物与技能', x: 230, y: 300, radius: 120, overlay: 'character' });
    this.drawStation(1_050, 255, '共享回路', '✦', 0xf2b84e);
    this.interactions.push({ kind: 'station', id: 'global-tree', label: '检查共享回路', hint: '全局技能树', x: 1_050, y: 300, radius: 120 });
    this.drawStation(250, 545, '图鉴柜', '?', 0xc067c8);
    this.interactions.push({ kind: 'station', id: 'codex', label: '打开图鉴柜', hint: '已发现物品', x: 250, y: 545, radius: 110, overlay: 'codex' });
    this.drawStation(1_030, 545, '控制台', '⚙', 0xff8662);
    this.interactions.push({ kind: 'station', id: 'settings', label: '使用控制台', hint: '声音与画面设置', x: 1_030, y: 545, radius: 110, overlay: 'settings' });
  }

  private drawRouteHall(): void {
    const room = (this.run?.roomIndex ?? 0) + 1;
    this.addWorldTitle(`试炼前厅 · 第 ${room} 房`, '门牌只预告宝箱类别，内容与品质进房后才决定');
    const choices = this.run?.routeChoices ?? [];
    choices.forEach((route, index) => {
      const x = index === 0 ? 390 : 890;
      const info = routeInfo(route.category, route.elite);
      this.drawGate(x, 205, info.label, info.color, route.elite ? 0xff6b62 : 0xf2c65f, info.symbol);
      this.track(this.add.text(x, 330, route.elite ? '精英风险 · 品质更高' : '普通战斗', textStyle(15, route.elite ? '#b83f45' : '#235d60'))
        .setOrigin(0.5).setDepth(5));
      this.interactions.push({
        kind: 'route', id: route.id, label: `进入${info.label}`, hint: route.elite ? '精英战斗' : '普通战斗',
        x, y: 285, radius: 175,
      });
    });
    this.track(this.add.text(640, 570, 'WASD 移动到门前 · E 进入', textStyle(18, '#2b686b')).setOrigin(0.5).setDepth(4));
  }

  private drawChestRoom(): void {
    const opened = this.run?.phase === 'loot';
    this.addWorldTitle(opened ? '战利品已落地' : '房间已清空', opened ? '靠近每件物品逐一检查、装备或分解' : '走到宝箱前亲手打开它');
    const halo = this.track(this.add.ellipse(640, 330, opened ? 330 : 230, opened ? 130 : 90, 0xffd568, opened ? 0.22 : 0.14).setDepth(2));
    if (!this.options?.reducedMotion) {
      this.tweens.add({ targets: halo, scaleX: 1.12, scaleY: 1.12, alpha: opened ? 0.1 : 0.06, yoyo: true, repeat: -1, duration: 900 });
    }
    this.chest = this.track(this.add.image(640, 320, opened ? 'chest-open' : 'chest-closed').setDepth(12));
    if (!opened) {
      this.interactions.push({ kind: 'chest', id: this.run?.chest?.id ?? 'chest', label: '打开宝箱', hint: '揭晓本房战利品', x: 640, y: 355, radius: 145 });
      return;
    }
    const chestId = this.run?.chest?.id ?? null;
    const animateReveal = chestId !== this.revealedChestId;
    let revealIndex = 0;
    for (const drop of this.run?.chest?.drops ?? []) {
      if (!drop.resolved) this.drawLoot(drop, animateReveal ? revealIndex++ : -1);
    }
    if (chestId) this.revealedChestId = chestId;
  }

  private drawLoot(drop: LootDrop, revealIndex: number): void {
    const rarity = drop.item?.rarity ?? 'common';
    const color = rarityColor(rarity);
    const beam = this.track(this.add.rectangle(drop.worldX, drop.worldY - 60, 24, 150, color, rarity === 'legendary' ? 0.42 : 0.27).setDepth(5));
    const texture = drop.item ? `loot-${drop.item.kind}` : 'loot-gold';
    const icon = this.track(this.add.image(drop.worldX, drop.worldY, texture).setDepth(13).setInteractive({ useHandCursor: true }));
    icon.on('pointerover', () => this.options?.bridge.onLootSelected(drop.id));
    const name = drop.item ? ITEM_BY_ID.get(drop.item.definitionId)?.name ?? '未知物品' : `${drop.gold} 金币`;
    const quality = drop.item ? RARITY_LABELS[drop.item.rarity] : '当局资源';
    const label = this.track(this.add.text(drop.worldX, drop.worldY + 52, `${name}\n${quality}`, {
      ...textStyle(14, `#${color.toString(16).padStart(6, '0')}`), align: 'center', lineSpacing: 4,
    }).setOrigin(0.5, 0).setDepth(14));
    if (revealIndex >= 0) {
      beam.setAlpha(0);
      icon.setAlpha(0).setScale(0.25).setY(drop.worldY - 42);
      label.setAlpha(0);
      this.time.delayedCall(revealIndex * 180, () => {
        this.tweens.add({ targets: beam, alpha: rarity === 'legendary' ? 0.42 : 0.27, duration: 170 });
        this.tweens.add({ targets: icon, alpha: 1, scale: 1, y: drop.worldY, duration: 290, ease: 'Back.Out' });
        this.tweens.add({ targets: label, alpha: 1, duration: 220, delay: 100 });
        if (!this.options?.reducedMotion) this.tweens.add({ targets: beam, alpha: 0.1, scaleY: 1.08, yoyo: true, repeat: -1, duration: 760, delay: 180 });
        if (rarity === 'legendary' && !this.options?.reducedMotion) this.cameras.main.shake(90, 0.0024);
      });
    } else if (!this.options?.reducedMotion) {
      this.tweens.add({ targets: beam, alpha: 0.1, scaleY: 1.08, yoyo: true, repeat: -1, duration: 760 });
    }
    this.interactions.push({ kind: 'loot', id: drop.id, label: `检查 ${name}`, hint: '查看详细数值', x: drop.worldX, y: drop.worldY, radius: 105 });
  }

  private drawPrototypeComplete(): void {
    this.addWorldTitle('G2 核心体验完成', '三次战斗与实体开箱已经跑通；完整商店和 Boss 等待下一道试玩闸门');
    this.drawGate(640, 200, '返回工坊', 0x2bbeb6, 0xf2c65f, '⌂');
    this.interactions.push({ kind: 'exit', id: 'return-workshop', label: '返回工坊', hint: '结束本次 G2 试玩', x: 640, y: 285, radius: 175 });
    this.track(this.add.text(640, 410, '请先判断：打完一房后，你是否还想立刻再开一个箱子？', textStyle(20, '#245f62')).setOrigin(0.5));
  }

  private addWorldTitle(title: string, subtitle: string): void {
    this.track(this.add.text(70, 105, title, textStyle(30, '#174f54')).setDepth(4));
    this.track(this.add.text(72, 145, subtitle, textStyle(14, '#52797b')).setDepth(4));
  }

  private drawGate(x: number, y: number, label: string, body: number, trim: number, symbol = '✦'): void {
    const graphics = this.track(this.add.graphics().setDepth(3));
    graphics.fillStyle(0x1b5659, 0.18).fillEllipse(x, y + 104, 220, 52);
    graphics.lineStyle(8, 0x21585b, 1).fillStyle(body, 1).fillRoundedRect(x - 102, y - 80, 204, 188, 38).strokeRoundedRect(x - 102, y - 80, 204, 188, 38);
    graphics.lineStyle(5, trim, 1).strokeRoundedRect(x - 82, y - 60, 164, 150, 28);
    graphics.fillStyle(0xeffcf1, 0.86).fillRoundedRect(x - 70, y - 46, 140, 120, 22);
    this.track(this.add.text(x, y - 4, symbol, textStyle(52, '#197f7c')).setOrigin(0.5).setDepth(4));
    this.track(this.add.text(x, y + 122, label, textStyle(19, '#174f54')).setOrigin(0.5).setDepth(4));
  }

  private drawStation(x: number, y: number, label: string, symbol: string, color: number): void {
    const graphics = this.track(this.add.graphics().setDepth(3));
    graphics.fillStyle(0x174d50, 0.18).fillEllipse(x, y + 52, 150, 38);
    graphics.lineStyle(5, 0x24575a, 1).fillStyle(0xfff7dc, 1).fillRoundedRect(x - 72, y - 46, 144, 94, 24).strokeRoundedRect(x - 72, y - 46, 144, 94, 24);
    graphics.fillStyle(color, 1).fillCircle(x, y - 2, 29);
    this.track(this.add.text(x, y - 2, symbol, textStyle(23, '#fffced')).setOrigin(0.5).setDepth(4));
    this.track(this.add.text(x, y + 66, label, textStyle(16, '#1d5a5e')).setOrigin(0.5).setDepth(4));
  }

  private updateInteraction(): void {
    if (!this.player) return;
    const nearest = this.interactions
      .map((target) => ({ target, distance: Phaser.Math.Distance.Between(this.player!.x, this.player!.y, target.x, target.y) }))
      .filter(({ target, distance }) => distance <= target.radius)
      .sort((left, right) => left.distance - right.distance)[0]?.target ?? null;
    if (nearest?.id === this.currentInteraction?.id) return;
    this.currentInteraction = nearest;
    this.options?.bridge.onInteraction(nearest ? {
      kind: nearest.kind, id: nearest.id, label: nearest.label, hint: nearest.hint,
    } : null);
  }

  private activateInteraction(target: InteractionTarget): void {
    if (!this.options) return;
    if (target.id === 'start-run') this.options.bridge.onStartRun();
    else if (target.kind === 'exit') this.options.bridge.onReturnToWorkshop();
    else if (target.id === 'global-tree') this.options.bridge.onMetaPanelRequested('global-tree');
    else if (target.kind === 'route') this.options.bridge.onRouteSelected(target.id);
    else if (target.kind === 'chest') this.playChestOpening();
    else if (target.kind === 'loot') this.options.bridge.onLootSelected(target.id);
    else if (target.overlay) this.options.bridge.onOverlayRequested(target.overlay);
  }

  private playChestOpening(): void {
    if (!this.chest || this.chestOpening || !this.options) return;
    this.chestOpening = true;
    this.currentInteraction = null;
    this.options.bridge.onInteraction(null);
    const duration = this.options.reducedMotion ? 320 : 1_150;
    this.tweens.add({ targets: this.chest, y: this.chest.y - 24, scaleX: 1.08, scaleY: 1.08, yoyo: true, duration: duration * 0.24 });
    this.time.delayedCall(duration * 0.46, () => {
      this.chest?.setTexture('chest-open');
      const burst = this.track(this.add.circle(640, 300, 28, 0xffdf72, 0.7).setDepth(10));
      this.tweens.add({ targets: burst, scale: 5.5, alpha: 0, duration: duration * 0.48 });
      if (!this.options?.reducedMotion) this.cameras.main.shake(95, 0.0025);
    });
    this.time.delayedCall(duration, () => {
      this.chestOpening = false;
      this.options?.bridge.onChestOpened();
    });
  }

  private pauseFromBlur(): void {
    this.options?.bridge.onOverlayRequested('pause');
  }

  private dispose(): void {
    this.input.off('wheel', this.queueSwap, this);
    this.game.events.off(Phaser.Core.Events.BLUR, this.pauseFromBlur, this);
  }

  private updateWeaponTexture(): void {
    if (!this.weapon || !this.run) return;
    const slot = this.run.weapons[this.activeWeapon];
    const weapon = ITEM_BY_ID.get(slot.weapon.definitionId);
    const core = slot.core ? ITEM_BY_ID.get(slot.core.definitionId) : null;
    const tag = weapon?.tag === 'neutral' ? core?.tag ?? 'arc' : weapon?.tag ?? 'arc';
    this.weapon.setTexture(tag === 'blast' ? 'weapon-blast' : tag === 'frost' ? 'weapon-frost' : 'weapon-arc');
  }

  private queueSwap(): void {
    this.swapQueued = true;
  }

  private consumeSwapQueue(): boolean {
    const queued = this.swapQueued;
    this.swapQueued = false;
    return queued;
  }

  private track<T extends Phaser.GameObjects.GameObject>(object: T): T {
    this.worldObjects.push(object);
    return object;
  }
}

function createWorldTextures(scene: Phaser.Scene): void {
  if (!scene.textures.exists('chest-closed')) {
    const graphics = scene.add.graphics();
    graphics.fillStyle(0x174d50, 0.2).fillEllipse(90, 105, 170, 40);
    graphics.lineStyle(6, 0x5e3c26, 1).fillStyle(0xd99c42, 1).fillRoundedRect(18, 35, 144, 68, 20).strokeRoundedRect(18, 35, 144, 68, 20);
    graphics.fillStyle(0xffd86a, 1).fillRoundedRect(22, 39, 136, 26, 14);
    graphics.fillStyle(0x2fbdb4, 1).fillRoundedRect(73, 54, 34, 42, 9);
    graphics.fillStyle(0xfff2a8, 1).fillCircle(90, 72, 7);
    graphics.generateTexture('chest-closed', 180, 125);
    graphics.clear();
    graphics.fillStyle(0x174d50, 0.2).fillEllipse(90, 112, 170, 38);
    graphics.lineStyle(6, 0x5e3c26, 1).fillStyle(0xd99c42, 1).fillRoundedRect(18, 62, 144, 54, 18).strokeRoundedRect(18, 62, 144, 54, 18);
    graphics.fillStyle(0xffd86a, 1).fillRoundedRect(25, 12, 130, 42, 18);
    graphics.lineStyle(5, 0x5e3c26, 1).strokeRoundedRect(25, 12, 130, 42, 18);
    graphics.fillStyle(0xfff3a2, 0.7).fillTriangle(45, 64, 90, 20, 135, 64);
    graphics.generateTexture('chest-open', 180, 130);
    graphics.destroy();
  }
  const lootTextures: Array<[string, number]> = [
    ['loot-weapon', 0x28c6bd], ['loot-muzzle', 0xf0b84e], ['loot-core', 0x84dff1],
    ['loot-relic', 0xc367ca], ['loot-arcana', 0xff8465], ['loot-gold', 0xf1bd4e],
  ];
  for (const [key, color] of lootTextures) {
    if (scene.textures.exists(key)) continue;
    const graphics = scene.add.graphics();
    graphics.lineStyle(5, 0x254f52, 1).fillStyle(color, 1).fillCircle(40, 40, 31).strokeCircle(40, 40, 31);
    graphics.fillStyle(0xffffff, 0.45).fillCircle(30, 29, 8);
    graphics.lineStyle(4, 0xfff8d8, 1).fillStyle(0xfff8d8, 1);
    if (key === 'loot-weapon') {
      graphics.fillRoundedRect(19, 32, 43, 13, 6).strokeRoundedRect(19, 32, 43, 13, 6);
      graphics.fillRect(54, 35, 13, 7);
      graphics.fillTriangle(31, 44, 45, 44, 37, 60);
    } else if (key === 'loot-muzzle') {
      graphics.fillTriangle(19, 23, 63, 40, 19, 57);
      graphics.fillStyle(color, 1).fillTriangle(29, 31, 49, 40, 29, 49);
    } else if (key === 'loot-core' || key === 'loot-gold') {
      graphics.fillTriangle(40, 15, 64, 40, 40, 66);
      graphics.fillTriangle(40, 15, 16, 40, 40, 66);
      graphics.fillStyle(color, 1).fillCircle(40, 40, key === 'loot-core' ? 8 : 5);
    } else if (key === 'loot-relic') {
      graphics.fillCircle(40, 40, 17);
      graphics.fillTriangle(40, 13, 47, 31, 33, 31);
      graphics.fillTriangle(40, 67, 47, 49, 33, 49);
      graphics.fillTriangle(13, 40, 31, 33, 31, 47);
      graphics.fillTriangle(67, 40, 49, 33, 49, 47);
      graphics.fillStyle(color, 1).fillCircle(40, 40, 7);
    } else {
      graphics.fillRoundedRect(23, 15, 34, 50, 5).strokeRoundedRect(23, 15, 34, 50, 5);
      graphics.fillStyle(color, 1).fillTriangle(40, 24, 49, 40, 40, 56);
      graphics.fillTriangle(40, 24, 31, 40, 40, 56);
    }
    graphics.generateTexture(key, 80, 80);
    graphics.destroy();
  }
}

function worldSignature(run: RunStateV2 | null): string {
  if (!run) return 'workshop';
  const drops = run.chest?.drops.map((drop) => `${drop.id}:${drop.resolved}`).join('|') ?? '';
  return `${run.phase}:${run.roomIndex}:${run.currentRoute?.id ?? ''}:${run.chest?.stage ?? ''}:${drops}`;
}

function movementDirection(x: number, y: number): number {
  const angle = Math.atan2(y, x);
  const normalized = (angle + Math.PI * 2 + Math.PI / 2) % (Math.PI * 2);
  return Math.round(normalized / (Math.PI / 4)) % 8;
}

function routeInfo(category: string, elite: boolean): { label: string; symbol: string; color: number } {
  if (elite) return { label: '精英工坊', symbol: '♜', color: 0xe86155 };
  if (category === 'weapon') return { label: '武器宝箱', symbol: '⌁', color: 0x28bfb7 };
  if (category === 'muzzle') return { label: '枪头模块', symbol: '➤', color: 0xe7a943 };
  if (category === 'core') return { label: '元素核心', symbol: '◈', color: 0x77cfe1 };
  if (category === 'relic') return { label: '秘宝宝箱', symbol: '✦', color: 0xb45bc2 };
  if (category === 'arcana') return { label: '秘仪牌', symbol: '♢', color: 0xef785e };
  return { label: '金币储藏', symbol: '◆', color: 0xe8b447 };
}

function rarityColor(rarity: string): number {
  if (rarity === 'legendary') return 0xffb52e;
  if (rarity === 'epic') return 0xc264d7;
  if (rarity === 'rare') return 0x49aee7;
  return 0x80b9a8;
}

function textStyle(size: number, color: string): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    fontFamily: '"Arial Rounded MT Bold", "Microsoft YaHei", sans-serif',
    fontSize: `${size}px`,
    color,
    stroke: size >= 24 ? '#fff7d8' : undefined,
    strokeThickness: size >= 24 ? 4 : 0,
    fontStyle: 'bold',
  };
}

function assetUrl(path: string): string {
  return new URL(`assets/v2/${path}`, document.baseURI).href;
}
