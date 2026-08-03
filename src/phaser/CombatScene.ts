import Phaser from 'phaser';
import { ITEM_BY_ID } from '@/game/content';
import { CombatSimulation, type CombatFx, type EnemyRenderState, type ProjectileRenderState } from '@/game/combat/CombatSimulation';
import type { CombatInput } from '@/game/input';
import type { CombatBridge, CombatEvent, EncounterConfig } from '@/game/types';
import { SynthAudio } from './SynthAudio';
import { createProceduralTextures, drawArena } from './proceduralTextures';

export interface CombatSceneOptions {
  config: EncounterConfig;
  bridge: CombatBridge;
  masterVolume: number;
  reducedMotion: boolean;
  showDamageNumbers: boolean;
}

export class CombatScene extends Phaser.Scene {
  private options: CombatSceneOptions | null = null;
  private simulation: CombatSimulation | null = null;
  private playerSprite: Phaser.GameObjects.Image | null = null;
  private playerShadow: Phaser.GameObjects.Image | null = null;
  private weaponSprite: Phaser.GameObjects.Image | null = null;
  private enemyViews = new Map<number, Phaser.GameObjects.Image>();
  private enemyShadows = new Map<number, Phaser.GameObjects.Image>();
  private projectileViews = new Map<number, Phaser.GameObjects.Image>();
  private stressProjectileBatch: Phaser.GameObjects.Graphics | null = null;
  private readonly enemyViewPool: Phaser.GameObjects.Image[] = [];
  private readonly enemyShadowPool: Phaser.GameObjects.Image[] = [];
  private readonly projectileViewPool: Phaser.GameObjects.Image[] = [];
  private readonly circleFxPool: Phaser.GameObjects.Arc[] = [];
  private readonly lineFxPool: Phaser.GameObjects.Graphics[] = [];
  private readonly damageTextPool: Phaser.GameObjects.Text[] = [];
  private readonly activeEnemyIds = new Set<number>();
  private readonly activeProjectileIds = new Set<number>();
  private bars: Phaser.GameObjects.Graphics | null = null;
  private pauseLabel: Phaser.GameObjects.Text | null = null;
  private audio: SynthAudio | null = null;
  private keys: Record<'up' | 'down' | 'left' | 'right' | 'reload' | 'swap' | 'dodge' | 'ability' | 'pause', Phaser.Input.Keyboard.Key> | null = null;
  private swapQueued = false;
  private paused = false;
  private resultSent = false;
  private lastHudAt = 0;
  private cleanDirectionReady = false;

  constructor() {
    super('CombatScene');
  }

  configure(options: CombatSceneOptions): this {
    this.options = options;
    return this;
  }

  preload(): void {
    for (let index = 0; index < 8; index += 1) {
      this.load.image(`artificer-dir-${index}`, assetUrl(`characters/artificer/directions/${String(index + 1).padStart(2, '0')}.png`));
    }
  }

  create(): void {
    if (!this.options) throw new Error('CombatScene must be configured before boot');
    createProceduralTextures(this);
    this.prepareDirectionTexture();
    drawArena(this);
    this.simulation = new CombatSimulation(this.options.config);
    this.audio = new SynthAudio(this.options.masterVolume);
    this.playerShadow = this.add.image(640, 580, 'entity-shadow').setDisplaySize(92, 28).setDepth(5);
    this.playerSprite = this.add.image(640, 570, 'artificer-dir-4').setDisplaySize(116, 116).setDepth(11);
    this.weaponSprite = this.add.image(680, 570, 'weapon-arc').setOrigin(0.18, 0.5).setDepth(13);
    if (this.options.config.stressTest) this.stressProjectileBatch = this.add.graphics().setDepth(18);
    this.bars = this.add.graphics().setDepth(30);
    this.pauseLabel = this.add.text(640, 360, '暂停\n按 ESC 继续', {
      fontFamily: '"Arial Rounded MT Bold", "Microsoft YaHei", sans-serif',
      fontSize: '34px',
      color: '#fff8dc',
      align: 'center',
      backgroundColor: '#124f55e8',
      padding: { x: 34, y: 24 },
    }).setOrigin(0.5).setDepth(100).setVisible(false);

    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error('Keyboard input is required');
    this.keys = {
      up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      reload: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R),
      swap: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      dodge: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      ability: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      pause: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
    };
    this.input.on('wheel', this.queueSwap, this);
    this.input.on('pointerdown', this.unlockAudio, this);
    this.game.events.on(Phaser.Core.Events.BLUR, this.pauseFromBlur, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.dispose, this);
    this.cameras.main.setRoundPixels(false);
  }

  update(time: number, delta: number): void {
    if (!this.simulation || !this.options || !this.keys) return;
    if (Phaser.Input.Keyboard.JustDown(this.keys.pause)) this.setPaused(!this.paused);
    if (!this.paused) {
      this.simulation.step(delta, this.readInput());
      this.syncPlayer();
      this.syncEnemies();
      this.syncProjectiles();
      this.renderBars();
      for (const event of this.simulation.drainEvents()) this.handleCombatEvent(event);
      for (const fx of this.simulation.drainFx()) this.renderFx(fx);
    }

    if (time - this.lastHudAt >= 90) {
      this.lastHudAt = time;
      this.options.bridge.onHud(this.simulation.getHudSnapshot(this.game.loop.actualFps, this.paused));
    }
    const result = this.simulation.getResult();
    if (result && !this.resultSent) {
      this.resultSent = true;
      this.audio?.play(result.won ? 'victory' : 'defeat');
      this.time.delayedCall(this.options.reducedMotion ? 80 : 450, () => this.options?.bridge.onResult(result));
    }
  }

  private readInput(): CombatInput {
    if (!this.keys || !this.simulation || !this.options) throw new Error('Combat input is not ready');
    const pointer = this.input.activePointer;
    let shooting = pointer.leftButtonDown();
    let aimX = pointer.worldX;
    let aimY = pointer.worldY;
    if (this.options.config.debugFast && !this.options.config.stressTest && !shooting) {
      const nearest = this.simulation.enemies[0];
      if (nearest) {
        shooting = true;
        aimX = nearest.x;
        aimY = nearest.y;
      }
    }
    const input: CombatInput = {
      moveX: Number(this.keys.right.isDown) - Number(this.keys.left.isDown),
      moveY: Number(this.keys.down.isDown) - Number(this.keys.up.isDown),
      aimX,
      aimY,
      shooting,
      reloadPressed: Phaser.Input.Keyboard.JustDown(this.keys.reload),
      swapPressed: Phaser.Input.Keyboard.JustDown(this.keys.swap) || this.consumeSwapQueue(),
      dodgePressed: Phaser.Input.Keyboard.JustDown(this.keys.dodge),
      abilityPressed: Phaser.Input.Keyboard.JustDown(this.keys.ability) || pointer.rightButtonDown(),
    };
    return input;
  }

  private syncPlayer(): void {
    if (!this.simulation || !this.playerSprite || !this.playerShadow || !this.weaponSprite) return;
    const player = this.simulation.player;
    const directionTexture = player.direction === 1 && this.cleanDirectionReady
      ? 'artificer-dir-1-clean'
      : `artificer-dir-${player.direction}`;
    this.playerSprite.setPosition(player.x, player.y).setTexture(directionTexture);
    this.playerSprite.setTint(player.hitFlash > 0 ? 0xffb6a8 : player.overclocked ? 0xffef9a : 0xffffff);
    this.playerSprite.setAlpha(player.invulnerable && Math.floor(performance.now() / 60) % 2 === 0 ? 0.58 : 1);
    this.playerSprite.setDepth(10 + player.y * 0.001);
    this.playerShadow.setPosition(player.x, player.y + 38).setAlpha(player.dodging ? 0.12 : 0.28);

    const slot = this.options?.config.weapons[player.activeWeapon];
    const definition = slot ? ITEM_BY_ID.get(slot.weapon.definitionId) : null;
    const tag = definition?.tag === 'blast' ? 'blast' : definition?.tag === 'frost' ? 'frost' : 'arc';
    const distance = 23;
    this.weaponSprite
      .setTexture(`weapon-${tag}`)
      .setPosition(player.x + Math.cos(player.rotation) * distance, player.y + Math.sin(player.rotation) * distance - 3)
      .setRotation(player.rotation)
      .setFlipY(Math.cos(player.rotation) < 0)
      .setDepth(12 + player.y * 0.001);
  }

  private syncEnemies(): void {
    if (!this.simulation) return;
    const active = this.activeEnemyIds;
    active.clear();
    for (const enemy of this.simulation.enemies) {
      active.add(enemy.id);
      let view = this.enemyViews.get(enemy.id);
      let shadow = this.enemyShadows.get(enemy.id);
      if (!view) {
        view = this.borrowImage(this.enemyViewPool, enemyTexture(enemy), enemy.x, enemy.y, 10);
        shadow = this.borrowImage(this.enemyShadowPool, 'entity-shadow', enemy.x, enemy.y + enemy.radius * 0.72, 4).setAlpha(0.24);
        this.enemyViews.set(enemy.id, view);
        this.enemyShadows.set(enemy.id, shadow);
      }
      const size = enemy.radius * (enemy.kind === 'boss' ? 2.55 : 2.65);
      view.setTexture(enemyTexture(enemy)).setPosition(enemy.x, enemy.y).setDisplaySize(size, size)
        .setRotation(enemy.kind === 'charger' ? enemy.rotation : 0)
        .setDepth(9 + enemy.y * 0.001)
        .setTint(enemy.hitFlash > 0 ? 0xffffff : enemy.freezeRemainingMs > 0 ? 0x9eeaff : enemy.elite ? 0xffd36c : 0xffffff);
      shadow?.setPosition(enemy.x, enemy.y + enemy.radius * 0.7).setDisplaySize(enemy.radius * 2.2, enemy.radius * 0.6);
    }
    for (const [id, view] of this.enemyViews) {
      if (active.has(id)) continue;
      this.recycleImage(view, this.enemyViewPool);
      this.enemyViews.delete(id);
      const shadow = this.enemyShadows.get(id);
      if (shadow) this.recycleImage(shadow, this.enemyShadowPool);
      this.enemyShadows.delete(id);
    }
  }

  private syncProjectiles(): void {
    if (!this.simulation) return;
    if (this.options?.config.stressTest && this.stressProjectileBatch) {
      this.renderStressProjectiles(this.stressProjectileBatch);
      return;
    }
    const active = this.activeProjectileIds;
    active.clear();
    for (const projectile of this.simulation.projectiles) {
      active.add(projectile.id);
      let view = this.projectileViews.get(projectile.id);
      if (!view) {
        view = this.borrowImage(this.projectileViewPool, projectileTexture(projectile), projectile.x, projectile.y, 18);
        const size = Math.max(10, projectile.radius * 2.8);
        view.setDisplaySize(size, size);
        this.projectileViews.set(projectile.id, view);
      }
      view.setPosition(projectile.x, projectile.y);
    }
    for (const [id, view] of this.projectileViews) {
      if (active.has(id)) continue;
      this.recycleImage(view, this.projectileViewPool);
      this.projectileViews.delete(id);
    }
  }

  private renderStressProjectiles(graphics: Phaser.GameObjects.Graphics): void {
    if (!this.simulation) return;
    graphics.clear();
    const groups = [
      { tag: 'arc', color: 0x29d9cc },
      { tag: 'blast', color: 0xff9147 },
      { tag: 'frost', color: 0x8be8ff },
      { tag: 'enemy', color: 0xff5e72 },
    ] as const;
    for (const group of groups) {
      graphics.fillStyle(group.color, 0.9);
      for (const projectile of this.simulation.projectiles) {
        if (projectile.tag !== group.tag) continue;
        const size = projectile.tag === 'blast' ? 8 : 6;
        graphics.fillRect(projectile.x - size / 2, projectile.y - size / 2, size, size);
      }
    }
  }

  private renderBars(): void {
    if (!this.simulation || !this.bars) return;
    this.bars.clear();
    for (const enemy of this.simulation.enemies) {
      if (enemy.kind !== 'boss' && enemy.hp >= enemy.maxHp) continue;
      const width = enemy.kind === 'boss' ? 112 : 48;
      const y = enemy.y - enemy.radius - 16;
      this.bars.fillStyle(0x173f42, 0.8).fillRoundedRect(enemy.x - width / 2, y, width, 7, 3);
      this.bars.fillStyle(enemy.kind === 'boss' ? 0xff784b : 0x44d6b4, 1)
        .fillRoundedRect(enemy.x - width / 2 + 1, y + 1, (width - 2) * Math.max(0, enemy.hp / enemy.maxHp), 5, 2);
    }
  }

  private renderFx(fx: CombatFx): void {
    const duration = this.options?.reducedMotion ? 90 : 220;
    if (fx.type === 'chain' || (fx.type === 'warning' && fx.x2 !== undefined)) {
      const graphics = this.borrowLineFx(fx.type === 'warning' ? 6 : 24);
      graphics.lineStyle(fx.type === 'warning' ? 4 : 5, fx.color ?? 0xffffff, fx.type === 'warning' ? 0.48 : 0.9);
      graphics.lineBetween(fx.x, fx.y, fx.x2 ?? fx.x, fx.y2 ?? fx.y);
      this.tweens.add({
        targets: graphics,
        alpha: 0,
        duration: fx.type === 'warning' ? 520 : duration,
        onComplete: () => this.recycleLineFx(graphics),
      });
      return;
    }
    if ((fx.type === 'hit' || fx.type === 'crit') && fx.value !== undefined && this.options?.showDamageNumbers) {
      const style: Phaser.Types.GameObjects.Text.TextStyle = {
        fontFamily: '"Arial Rounded MT Bold", "Microsoft YaHei", sans-serif',
        fontSize: fx.type === 'crit' ? '21px' : '16px',
        color: fx.type === 'crit' ? '#ffd55f' : '#ffffff',
        stroke: '#174348',
        strokeThickness: 4,
      };
      const text = this.borrowDamageText(fx.x, fx.y - 18, String(fx.value), style);
      this.tweens.add({
        targets: text,
        y: text.y - 32,
        alpha: 0,
        duration: duration + 180,
        onComplete: () => this.recycleDamageText(text),
      });
      return;
    }
    const radius = fx.radius ?? (fx.type === 'muzzle' ? 12 : 34);
    const circle = this.borrowCircleFx(
      fx.x,
      fx.y,
      radius * 0.25,
      fx.color ?? 0xffffff,
      fx.type === 'warning' ? 0.16 : 0.62,
      fx.type === 'warning' ? 5 : 22,
    ).setStrokeStyle(fx.type === 'warning' ? 4 : 2, fx.color ?? 0xffffff, 0.9);
    this.tweens.add({
      targets: circle,
      scale: fx.type === 'muzzle' ? 1.7 : 4,
      alpha: 0,
      duration: fx.type === 'warning' ? 480 : duration,
      onComplete: () => this.recycleCircleFx(circle),
    });
    if (!this.options?.reducedMotion && (fx.type === 'explosion' || fx.type === 'crit')) this.cameras.main.shake(75, 0.0024);
  }

  private borrowImage(
    pool: Phaser.GameObjects.Image[],
    texture: string,
    x: number,
    y: number,
    depth: number,
  ): Phaser.GameObjects.Image {
    const image = pool.pop() ?? this.add.image(x, y, texture);
    return image.setActive(true).setVisible(true).setAlpha(1).setScale(1).setFlip(false, false)
      .setTexture(texture).setPosition(x, y).setRotation(0).setTint(0xffffff).setDepth(depth);
  }

  private recycleImage(image: Phaser.GameObjects.Image, pool: Phaser.GameObjects.Image[]): void {
    image.setActive(false).setVisible(false);
    pool.push(image);
  }

  private borrowLineFx(depth: number): Phaser.GameObjects.Graphics {
    const graphics = this.lineFxPool.pop() ?? this.add.graphics();
    return graphics.setActive(true).setVisible(true).setAlpha(1).setDepth(depth).clear();
  }

  private recycleLineFx(graphics: Phaser.GameObjects.Graphics): void {
    graphics.clear().setActive(false).setVisible(false);
    this.lineFxPool.push(graphics);
  }

  private borrowCircleFx(x: number, y: number, radius: number, color: number, alpha: number, depth: number): Phaser.GameObjects.Arc {
    const circle = this.circleFxPool.pop() ?? this.add.circle(x, y, radius, color, alpha);
    return circle.setActive(true).setVisible(true).setPosition(x, y).setRadius(radius).setScale(1).setAlpha(1)
      .setFillStyle(color, alpha).setDepth(depth);
  }

  private recycleCircleFx(circle: Phaser.GameObjects.Arc): void {
    circle.setActive(false).setVisible(false);
    this.circleFxPool.push(circle);
  }

  private borrowDamageText(
    x: number,
    y: number,
    value: string,
    style: Phaser.Types.GameObjects.Text.TextStyle,
  ): Phaser.GameObjects.Text {
    const text = this.damageTextPool.pop() ?? this.add.text(x, y, value, style);
    return text.setActive(true).setVisible(true).setPosition(x, y).setText(value).setStyle(style)
      .setOrigin(0.5).setAlpha(1).setScale(1).setDepth(40);
  }

  private recycleDamageText(text: Phaser.GameObjects.Text): void {
    text.setActive(false).setVisible(false);
    this.damageTextPool.push(text);
  }

  private handleCombatEvent(event: CombatEvent): void {
    this.options?.bridge.onEvent(event);
    if (event.type === 'shot-fired') {
      const slot = this.options?.config.weapons[event.weaponIndex];
      const definition = slot ? ITEM_BY_ID.get(slot.weapon.definitionId) : null;
      this.audio?.play(definition?.tag === 'blast' ? 'blast-shot' : definition?.tag === 'frost' ? 'frost-shot' : 'arc-shot');
    } else if (event.type === 'hit') {
      this.audio?.play(event.critical ? 'crit' : 'hit');
    } else if (event.type === 'weapon-swapped') this.audio?.play('swap');
    else if (event.type === 'reload-started') this.audio?.play('reload');
    else if (event.type === 'overclock-started') this.audio?.play('ability');
    else if (event.type === 'damage-prevented') this.audio?.play('deflect');
  }

  private prepareDirectionTexture(): void {
    const source = this.textures.get('artificer-dir-1').getSourceImage() as CanvasImageSource;
    const cleaned = this.textures.createCanvas('artificer-dir-1-clean', 192, 192);
    if (!cleaned) return;
    const context = cleaned.getContext();
    context.clearRect(0, 0, 192, 192);
    context.drawImage(source, 0, 0, 192, 192);
    context.clearRect(20, 108, 24, 42);
    cleaned.refresh();
    this.cleanDirectionReady = true;
  }

  private queueSwap(): void {
    this.swapQueued = true;
  }

  private consumeSwapQueue(): boolean {
    const queued = this.swapQueued;
    this.swapQueued = false;
    return queued;
  }

  private unlockAudio(): void {
    void this.audio?.unlock();
  }

  private pauseFromBlur(): void {
    this.setPaused(true);
  }

  private setPaused(paused: boolean): void {
    this.paused = paused;
    this.pauseLabel?.setVisible(paused);
  }

  private dispose(): void {
    this.input.off('wheel', this.queueSwap, this);
    this.input.off('pointerdown', this.unlockAudio, this);
    this.game.events.off(Phaser.Core.Events.BLUR, this.pauseFromBlur, this);
    this.audio?.dispose();
  }
}

function assetUrl(path: string): string {
  return new URL(`assets/v2/${path}`, document.baseURI).href;
}

function enemyTexture(enemy: EnemyRenderState): string {
  return `enemy-${enemy.kind}`;
}

function projectileTexture(projectile: ProjectileRenderState): string {
  return `projectile-${projectile.tag}`;
}
