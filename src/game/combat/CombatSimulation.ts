import { ARCANA_RARITY_MULTIPLIER, CORES, ITEM_BY_ID, MUZZLES } from '../content';
import { deriveWeaponStats } from '../derivedStats';
import type { CombatInput } from '../input';
import { createRandom, hashSeed, type RandomSource } from '../random';
import type {
  CombatEvent,
  CombatHudSnapshot,
  CombatResult,
  CoreDefinition,
  EliteObjectiveState,
  EncounterConfig,
  EquippedWeapon,
  MuzzleDefinition,
  WeaponDefinition,
} from '../types';

const WORLD_WIDTH = 1_280;
const WORLD_HEIGHT = 720;
const PLAYER_RADIUS = 24;
const NORMAL_ENEMY_HP_SCALE = 1.65;
const BOSS_HP = 9_600;

export type EnemyKind = 'chaser' | 'ranged' | 'charger' | 'overload' | 'boss';

export interface PlayerRenderState {
  x: number;
  y: number;
  rotation: number;
  direction: number;
  moving: boolean;
  dodging: boolean;
  invulnerable: boolean;
  overclocked: boolean;
  hitFlash: number;
}

export interface EnemyRenderState {
  id: number;
  kind: EnemyKind;
  x: number;
  y: number;
  rotation: number;
  radius: number;
  hp: number;
  maxHp: number;
  frozen: boolean;
  elite: boolean;
  telegraph: number;
  hitFlash: number;
}

export interface ProjectileRenderState {
  id: number;
  owner: 'player' | 'enemy';
  x: number;
  y: number;
  rotation: number;
  radius: number;
  tag: 'arc' | 'blast' | 'frost' | 'enemy';
}

export interface CombatFx {
  type: 'muzzle' | 'hit' | 'crit' | 'explosion' | 'chain' | 'shatter' | 'deflect' | 'dash' | 'warning' | 'death';
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  color?: number;
  radius?: number;
  value?: number;
}

interface WeaponRuntime {
  ammo: number;
  reloading: boolean;
  reloadRemainingMs: number;
  fireCooldownMs: number;
}

interface EnemyState extends EnemyRenderState {
  speed: number;
  contactCooldownMs: number;
  attackTimerMs: number;
  stateTimerMs: number;
  state: 'move' | 'telegraph' | 'charge';
  chargeVx: number;
  chargeVy: number;
  slowRatio: number;
  slowRemainingMs: number;
  freezeHits: number;
  freezeRemainingMs: number;
  burnDamage: number;
  burnRemainingMs: number;
  burnTickMs: number;
  bossPhaseTwoSpawned: boolean;
  bossPattern: 0 | 1 | 2;
}

interface ProjectileState extends ProjectileRenderState {
  vx: number;
  vy: number;
  damage: number;
  remainingMs: number;
  pierce: number;
  bounces: number;
  explosionRadius: number;
  core: CoreDefinition | null;
  legendary: boolean;
  hitIds: Set<number>;
}

interface PlayerState extends PlayerRenderState {
  hp: number;
  maxHp: number;
  shield: number;
  activeWeapon: 0 | 1;
  weapons: [WeaponRuntime, WeaponRuntime];
  dashCooldownMs: number;
  dodgeRemainingMs: number;
  dodgeVx: number;
  dodgeVy: number;
  overclockRemainingMs: number;
  overclockCooldownMs: number;
  overclockStrength: number;
  switchDamageRemainingMs: number;
  switchBonusUsed: boolean;
  deflectionCharges: number;
  deflectionRechargeMs: number;
  damageInvulnerabilityMs: number;
}

export class CombatSimulation {
  readonly config: EncounterConfig;
  readonly player: PlayerState;
  readonly enemies: EnemyState[] = [];
  readonly projectiles: ProjectileState[] = [];

  private readonly random: RandomSource;
  private readonly events: CombatEvent[] = [];
  private readonly fx: CombatFx[] = [];
  private nextEntityId = 1;
  private elapsedMs = 0;
  private damageTaken = 0;
  private waveIndex = 0;
  private waveDelayMs = 0;
  private finished = false;
  private result: CombatResult | null = null;
  private finishDelayMs = 0;
  private lastMoveX = 0;
  private lastMoveY = -1;
  private eliteObjective: EliteObjectiveState | null;
  private arcHitCount = 0;
  private swapArcanaWindowMs = 0;
  private swapArcanaCooldownMs = 0;
  private readonly reloadEmpowered: [boolean, boolean] = [false, false];

  constructor(config: EncounterConfig) {
    this.config = config;
    this.random = createRandom(hashSeed(config.seed, config.id));
    this.eliteObjective = config.eliteObjective ? structuredClone(config.eliteObjective) : null;
    const maxCharges = config.characterTalents.deflectionCharges;
    this.player = {
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT - 145,
      rotation: -Math.PI / 2,
      direction: 0,
      moving: false,
      dodging: false,
      invulnerable: false,
      overclocked: false,
      hitFlash: 0,
      hp: config.hp,
      maxHp: config.maxHp,
      shield: config.shield,
      activeWeapon: config.activeWeapon,
      weapons: [this.createWeaponRuntime(config.weapons[0]), this.createWeaponRuntime(config.weapons[1])],
      dashCooldownMs: 0,
      dodgeRemainingMs: 0,
      dodgeVx: 0,
      dodgeVy: 0,
      overclockRemainingMs: 0,
      overclockCooldownMs: 0,
      overclockStrength: 1,
      switchDamageRemainingMs: 0,
      switchBonusUsed: false,
      deflectionCharges: maxCharges,
      deflectionRechargeMs: 0,
      damageInvulnerabilityMs: 0,
    };

    if (config.stressTest) this.spawnStressTest();
    else if (config.boss) this.spawnBoss();
    else {
      this.spawnWave();
      if (this.eliteObjective?.type === 'overloads') this.spawnOverloadDevices();
    }
  }

  step(deltaMs: number, input: CombatInput): void {
    if (this.finished) return;
    const safeDelta = Math.min(34, Math.max(0, deltaMs));
    const dt = safeDelta / 1_000;
    this.elapsedMs += safeDelta;
    this.updateEliteObjective(safeDelta);
    this.updateTimers(safeDelta);
    this.updatePlayer(dt, safeDelta, input);
    this.updateEnemies(dt, safeDelta);
    this.updateProjectiles(dt, safeDelta);
    this.resolvePlayerProjectiles();
    this.resolveEnemyProjectiles();
    this.removeExpiredEntities();
    this.updateWaveFlow(safeDelta);
    this.checkOutcome(safeDelta);
  }

  drainEvents(): CombatEvent[] {
    return this.events.splice(0);
  }

  drainFx(): CombatFx[] {
    return this.fx.splice(0);
  }

  getResult(): CombatResult | null {
    return this.result;
  }

  getHudSnapshot(fps: number, paused: boolean): CombatHudSnapshot {
    const boss = this.enemies.find((enemy) => enemy.kind === 'boss');
    return {
      hp: Math.max(0, this.player.hp),
      maxHp: this.player.maxHp,
      shield: Math.max(0, this.player.shield),
      activeWeapon: this.player.activeWeapon,
      weapons: [this.getWeaponHud(0), this.getWeaponHud(1)],
      overclockRemainingMs: this.player.overclockRemainingMs,
      overclockCooldownMs: this.player.overclockCooldownMs,
      deflectionCharges: this.player.deflectionCharges,
      deflectionCooldownMs: this.player.deflectionRechargeMs,
      dashCooldownMs: this.player.dashCooldownMs,
      enemiesRemaining: this.enemies.length,
      projectilesActive: this.projectiles.length,
      effectsActive: this.config.stressTest ? 150 : 0,
      eliteObjective: this.eliteObjective ? structuredClone(this.eliteObjective) : null,
      elapsedMs: this.elapsedMs,
      bossHp: boss?.hp ?? null,
      bossMaxHp: boss?.maxHp ?? null,
      paused,
      fps,
    };
  }

  private updateTimers(deltaMs: number): void {
    const player = this.player;
    player.dashCooldownMs = Math.max(0, player.dashCooldownMs - deltaMs);
    player.dodgeRemainingMs = Math.max(0, player.dodgeRemainingMs - deltaMs);
    player.damageInvulnerabilityMs = Math.max(0, player.damageInvulnerabilityMs - deltaMs);
    player.overclockRemainingMs = Math.max(0, player.overclockRemainingMs - deltaMs);
    if (player.overclockRemainingMs <= 0) player.overclockStrength = 1;
    player.overclockCooldownMs = Math.max(0, player.overclockCooldownMs - deltaMs);
    player.switchDamageRemainingMs = Math.max(0, player.switchDamageRemainingMs - deltaMs);
    this.swapArcanaWindowMs = Math.max(0, this.swapArcanaWindowMs - deltaMs);
    this.swapArcanaCooldownMs = Math.max(0, this.swapArcanaCooldownMs - deltaMs);
    player.hitFlash = Math.max(0, player.hitFlash - deltaMs);
    player.dodging = player.dodgeRemainingMs > 0;
    player.invulnerable = player.dodging || player.damageInvulnerabilityMs > 0;
    player.overclocked = player.overclockRemainingMs > 0;

    const maxCharges = this.config.characterTalents.deflectionCharges;
    if (player.deflectionCharges < maxCharges) {
      if (player.deflectionRechargeMs <= 0) {
        player.deflectionCharges += 1;
        if (player.deflectionCharges < maxCharges) {
          player.deflectionRechargeMs = this.config.characterTalents.deflectionCooldownMs;
        }
      } else {
        player.deflectionRechargeMs -= deltaMs;
      }
    }

    for (let index = 0; index < player.weapons.length; index += 1) {
      const weapon = player.weapons[index as 0 | 1];
      weapon.fireCooldownMs = Math.max(0, weapon.fireCooldownMs - deltaMs);
      if (!weapon.reloading) continue;
      weapon.reloadRemainingMs -= deltaMs * this.reloadSpeedMultiplier();
      if (weapon.reloadRemainingMs <= 0) {
        const definition = this.weaponDefinition(this.config.weapons[index as 0 | 1]);
        weapon.ammo = definition.magazine;
        weapon.reloading = false;
        weapon.reloadRemainingMs = 0;
        if (this.arcanaScale('arcana-loaded-burst') > 0) this.reloadEmpowered[index as 0 | 1] = true;
      }
    }
  }

  private updatePlayer(dt: number, _deltaMs: number, input: CombatInput): void {
    const player = this.player;
    player.rotation = Math.atan2(input.aimY - player.y, input.aimX - player.x);
    const aimDirection = angleToDirection(player.rotation);

    let moveX = input.moveX;
    let moveY = input.moveY;
    const magnitude = Math.hypot(moveX, moveY);
    if (magnitude > 0) {
      moveX /= magnitude;
      moveY /= magnitude;
      this.lastMoveX = moveX;
      this.lastMoveY = moveY;
    }

    if (input.dodgePressed && player.dashCooldownMs <= 0) {
      const dashX = magnitude > 0 ? moveX : this.lastMoveX;
      const dashY = magnitude > 0 ? moveY : this.lastMoveY;
      player.dodgeVx = dashX * 680;
      player.dodgeVy = dashY * 680;
      player.dodgeRemainingMs = 180;
      player.dashCooldownMs = 1_200 * this.config.combatModifiers.dashCooldownMultiplier;
      player.damageInvulnerabilityMs = Math.max(player.damageInvulnerabilityMs, 180);
      // 输入发生在本帧计时器刷新之后，因此这里立即同步，避免闪避起步帧仍可受伤。
      player.dodging = true;
      player.invulnerable = true;
      this.fx.push({ type: 'dash', x: player.x, y: player.y, color: 0x39d7cf });
    }

    player.moving = magnitude > 0 || player.dodgeRemainingMs > 0;
    if (player.dodgeRemainingMs > 0) player.direction = angleToDirection(Math.atan2(player.dodgeVy, player.dodgeVx));
    else if (magnitude > 0) player.direction = angleToDirection(Math.atan2(moveY, moveX));
    else player.direction = aimDirection;

    const overclockMove = player.overclocked
      ? this.overclockValue(1.15 + this.config.characterTalents.overclockMoveBonus)
      : 1;
    const speed = 270 * this.config.combatModifiers.moveSpeedMultiplier * overclockMove;
    if (player.dodgeRemainingMs > 0) {
      player.x += player.dodgeVx * dt;
      player.y += player.dodgeVy * dt;
    } else {
      player.x += moveX * speed * dt;
      player.y += moveY * speed * dt;
    }
    player.x = clamp(player.x, 58, WORLD_WIDTH - 58);
    player.y = clamp(player.y, 64, WORLD_HEIGHT - 58);

    if (input.swapPressed) this.swapWeapon();
    if (input.reloadPressed) this.startReload(player.activeWeapon);
    if (input.abilityPressed) this.activateOverclock();
    if (input.shooting) this.tryShoot(input.aimX, input.aimY);
  }

  private updateEnemies(dt: number, deltaMs: number): void {
    for (const enemy of this.enemies) {
      enemy.contactCooldownMs = Math.max(0, enemy.contactCooldownMs - deltaMs);
      enemy.attackTimerMs -= deltaMs;
      enemy.stateTimerMs -= deltaMs;
      enemy.slowRemainingMs = Math.max(0, enemy.slowRemainingMs - deltaMs);
      enemy.freezeRemainingMs = Math.max(0, enemy.freezeRemainingMs - deltaMs);
      enemy.hitFlash = Math.max(0, enemy.hitFlash - deltaMs);
      enemy.telegraph = enemy.state === 'telegraph' ? clamp(enemy.stateTimerMs / 700, 0, 1) : 0;
      this.updateBurn(enemy, deltaMs);
      if (enemy.hp <= 0 || enemy.freezeRemainingMs > 0) continue;
      if (enemy.kind === 'overload') continue;

      if (enemy.kind === 'boss') this.updateBoss(enemy, dt);
      else if (enemy.kind === 'ranged') this.updateRanged(enemy, dt);
      else if (enemy.kind === 'charger') this.updateCharger(enemy, dt);
      else this.moveTowardPlayer(enemy, dt, enemy.speed);

      const distance = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);
      if (distance < enemy.radius + PLAYER_RADIUS && enemy.contactCooldownMs <= 0) {
        this.damagePlayer(enemy.kind === 'boss' ? 18 : enemy.elite ? 14 : 9);
        enemy.contactCooldownMs = 800;
      }
    }
  }

  private updateProjectiles(dt: number, deltaMs: number): void {
    for (const projectile of this.projectiles) {
      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;
      projectile.remainingMs -= deltaMs;
      const hitHorizontal = projectile.x < 22 || projectile.x > WORLD_WIDTH - 22;
      const hitVertical = projectile.y < 28 || projectile.y > WORLD_HEIGHT - 22;
      if ((hitHorizontal || hitVertical) && projectile.bounces > 0) {
        if (hitHorizontal) projectile.vx *= -1;
        if (hitVertical) projectile.vy *= -1;
        projectile.rotation = Math.atan2(projectile.vy, projectile.vx);
        projectile.bounces -= 1;
        projectile.x = clamp(projectile.x, 24, WORLD_WIDTH - 24);
        projectile.y = clamp(projectile.y, 30, WORLD_HEIGHT - 24);
      } else if (hitHorizontal || hitVertical) {
        projectile.remainingMs = 0;
      }
    }
  }

  private resolvePlayerProjectiles(): void {
    for (const projectile of this.projectiles) {
      if (projectile.owner !== 'player' || projectile.remainingMs <= 0) continue;
      // 性能原型中的 500 枚展示弹丸不参与碰撞，避免把碰撞压测误当成渲染压测。
      if (projectile.damage <= 0) continue;
      for (const enemy of this.enemies) {
        if (enemy.hp <= 0 || projectile.hitIds.has(enemy.id)) continue;
        if (Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y) > projectile.radius + enemy.radius) continue;
        projectile.hitIds.add(enemy.id);
        const critical = this.random.next() < this.config.combatModifiers.critChance;
        const damage = projectile.damage * (critical ? this.config.combatModifiers.critMultiplier : 1);
        this.damageEnemy(enemy, damage, critical, projectile);
        if (projectile.explosionRadius > 0) {
          this.explode(projectile.x, projectile.y, projectile.explosionRadius, damage * 0.55, enemy.id, toCombatTag(projectile.tag), projectile.legendary);
        }
        this.applyCoreEffect(enemy, projectile, damage);
        this.applyArcanaOnHit(enemy, projectile, damage);
        projectile.pierce -= 1;
        if (projectile.pierce < 0) {
          projectile.remainingMs = 0;
          break;
        }
      }
    }
  }

  private resolveEnemyProjectiles(): void {
    for (const projectile of this.projectiles) {
      if (projectile.owner !== 'enemy' || projectile.remainingMs <= 0) continue;
      if (Math.hypot(projectile.x - this.player.x, projectile.y - this.player.y) > projectile.radius + PLAYER_RADIUS) continue;
      projectile.remainingMs = 0;
      this.damagePlayer(projectile.damage);
    }
  }

  private tryShoot(aimX: number, aimY: number): void {
    const player = this.player;
    const weaponIndex = player.activeWeapon;
    const runtime = player.weapons[weaponIndex];
    if (runtime.reloading || runtime.fireCooldownMs > 0) return;
    if (runtime.ammo <= 0) {
      this.startReload(weaponIndex);
      return;
    }

    const slot = this.config.weapons[weaponIndex];
    const weapon = this.weaponDefinition(slot);
    const muzzle = this.muzzleDefinition(slot);
    const core = this.coreDefinition(slot);
    const derived = deriveWeaponStats(slot, this.config.combatModifiers);
    const overclockRate = player.overclocked
      ? this.overclockValue(1.3 + this.config.characterTalents.overclockFireRateBonus)
      : 1;
    const fireRate = derived.fireRate * overclockRate;
    runtime.fireCooldownMs = 1_000 / Math.max(0.1, fireRate);
    runtime.ammo -= 1;

    const baseAngle = Math.atan2(aimY - player.y, aimX - player.x);
    const count = muzzle?.projectileCount ?? 1;
    const spread = ((muzzle?.spreadDeg ?? 0) * Math.PI) / 180;
    const startAngle = baseAngle - spread * (count - 1) / 2;
    const reloadArcanaScale = this.reloadEmpowered[weaponIndex] ? this.arcanaScale('arcana-loaded-burst') : 0;
    for (let index = 0; index < count; index += 1) {
      const angle = startAngle + spread * index;
      this.spawnPlayerProjectile(
        slot,
        weapon,
        muzzle,
        core,
        angle,
        1 + reloadArcanaScale * 0.35,
        1 + reloadArcanaScale * 0.45,
      );
    }
    if (reloadArcanaScale > 0) this.reloadEmpowered[weaponIndex] = false;
    this.events.push({ type: 'shot-fired', weaponIndex });
    this.fx.push({ type: 'muzzle', x: player.x + Math.cos(baseAngle) * 42, y: player.y + Math.sin(baseAngle) * 42, color: tagColor(toCombatTag(weapon.tag)) });
    if (runtime.ammo <= 0) this.startReload(weaponIndex);
  }

  private spawnPlayerProjectile(
    slot: EquippedWeapon,
    weapon: WeaponDefinition,
    muzzle: MuzzleDefinition | null,
    core: CoreDefinition | null,
    angle: number,
    arcanaDamageMultiplier = 1,
    arcanaRadiusMultiplier = 1,
  ): void {
    const derived = deriveWeaponStats(slot, this.config.combatModifiers);
    const speed = derived.projectileSpeed;
    const switchBonus = this.player.switchDamageRemainingMs > 0
      ? 1 + this.config.characterTalents.overclockSwitchDamageBonus
      : 1;
    const damage = derived.damage * switchBonus * arcanaDamageMultiplier;
    const projectileTag = toCombatTag(weapon.tag === 'neutral' ? core?.tag ?? 'arc' : weapon.tag);
    const legendaryRelic = this.config.relics.some((item) => {
      if (item.rarity !== 'legendary') return false;
      const definition = ITEM_BY_ID.get(item.definitionId);
      return definition?.tag === 'neutral' || definition?.tag === projectileTag;
    });
    const legendary = legendaryRelic || [slot.weapon, slot.muzzle, slot.core].some((item) => item?.rarity === 'legendary');
    this.projectiles.push({
      id: this.nextEntityId++, owner: 'player', x: this.player.x + Math.cos(angle) * 38,
      y: this.player.y + Math.sin(angle) * 38, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      rotation: angle, radius: weapon.projectileRadius * (muzzle?.id === 'muzzle-heavy' ? 1.45 : 1),
      tag: projectileTag,
      damage, remainingMs: 1_600, pierce: muzzle?.pierce ?? 0, bounces: muzzle?.bounces ?? 0,
      explosionRadius: derived.explosionRadius * arcanaRadiusMultiplier,
      core, legendary, hitIds: new Set(),
    });
  }

  private applyCoreEffect(enemy: EnemyState, projectile: ProjectileState, baseDamage: number): void {
    const core = projectile.core;
    if (!core) return;
    if (core.tag === 'arc' && (core.chainCount ?? 0) > 0) {
      this.chainFrom(enemy, core.chainCount ?? 1, baseDamage * (core.chainDamage ?? 0.5), projectile.legendary);
    }
    if (core.tag === 'blast' && (core.burnDamage ?? 0) > 0) {
      enemy.burnDamage = Math.max(enemy.burnDamage, core.burnDamage ?? 0);
      enemy.burnRemainingMs = Math.max(enemy.burnRemainingMs, 2_400);
    }
    if (core.tag === 'frost') {
      enemy.slowRatio = Math.max(enemy.slowRatio, core.slowRatio ?? 0);
      enemy.slowRemainingMs = Math.max(enemy.slowRemainingMs, 2_200);
      enemy.freezeHits += 1;
      if (enemy.freezeHits >= (core.freezeHits ?? 99)) {
        enemy.freezeHits = 0;
        enemy.freezeRemainingMs = projectile.legendary ? 1_650 : 1_150;
        const auraScale = this.arcanaScale('arcana-frozen-tide');
        if (auraScale > 0) {
          const radius = 155 + auraScale * 35;
          for (const nearby of this.enemies) {
            if (nearby.id === enemy.id || nearby.hp <= 0) continue;
            if (Math.hypot(nearby.x - enemy.x, nearby.y - enemy.y) > radius) continue;
            nearby.slowRatio = Math.max(nearby.slowRatio, Math.min(0.55, 0.18 * auraScale));
            nearby.slowRemainingMs = Math.max(nearby.slowRemainingMs, 1_600);
          }
          this.fx.push({ type: 'shatter', x: enemy.x, y: enemy.y, color: 0xa9f2ff, radius });
        }
      }
    }
  }

  private applyArcanaOnHit(enemy: EnemyState, projectile: ProjectileState, baseDamage: number): void {
    if (projectile.tag !== 'arc') return;
    const sixthScale = this.arcanaScale('arcana-sixth-circuit');
    if (sixthScale > 0) {
      this.arcHitCount += 1;
      if (this.arcHitCount % 6 === 0) this.chainFrom(enemy, 2, baseDamage * 0.38 * sixthScale, false);
    }
    const swapScale = this.arcanaScale('arcana-switch-spark');
    if (swapScale > 0 && this.swapArcanaWindowMs > 0) {
      this.swapArcanaWindowMs = 0;
      this.swapArcanaCooldownMs = 5_000;
      this.chainFrom(enemy, 2, baseDamage * 0.62 * swapScale, false);
    }
  }

  private damageEnemy(enemy: EnemyState, damage: number, critical: boolean, projectile?: ProjectileState): void {
    if (enemy.hp <= 0) return;
    const wasFrozen = enemy.freezeRemainingMs > 0;
    enemy.hp -= damage;
    enemy.hitFlash = 90;
    this.events.push({ type: 'hit', damage, critical });
    this.fx.push({ type: critical ? 'crit' : 'hit', x: enemy.x, y: enemy.y, color: critical ? 0xffd766 : 0xffffff, value: Math.round(damage) });
    if (enemy.hp > 0) return;
    this.events.push({ type: 'enemy-defeated', enemyType: enemy.kind });
    this.fx.push({ type: 'death', x: enemy.x, y: enemy.y, color: enemyColor(enemy.kind), radius: enemy.radius * 1.5 });
    if (enemy.kind === 'overload' && this.eliteObjective?.type === 'overloads' && !this.eliteObjective.failed) {
      this.eliteObjective.overloadsDestroyed += 1;
      if (this.eliteObjective.overloadsDestroyed >= this.eliteObjective.overloadsTotal) this.eliteObjective.completed = true;
    }
    if (projectile?.tag === 'frost' && projectile.legendary && wasFrozen) {
      this.spawnShards(enemy.x, enemy.y, projectile.damage * 0.45);
    }
    const shatterScale = projectile?.tag === 'frost' && wasFrozen ? this.arcanaScale('arcana-shatter-return') : 0;
    if (shatterScale > 0) {
      const runtime = this.player.weapons[this.player.activeWeapon];
      const weapon = this.weaponDefinition(this.config.weapons[this.player.activeWeapon]);
      runtime.ammo = Math.min(weapon.magazine, runtime.ammo + Math.max(1, Math.round(shatterScale)));
      this.player.dashCooldownMs = Math.max(0, this.player.dashCooldownMs - 800 * shatterScale);
    }
    if (projectile?.tag === 'blast' && projectile.legendary) {
      this.explode(enemy.x, enemy.y, 120, projectile.damage * 0.7, enemy.id, 'blast', true);
    }
  }

  private damagePlayer(amount: number): void {
    const player = this.player;
    if (this.config.stressTest) return;
    if (player.invulnerable || player.hp <= 0) return;
    if (player.deflectionCharges > 0) {
      player.deflectionCharges -= 1;
      if (player.deflectionRechargeMs <= 0) {
        player.deflectionRechargeMs = this.config.characterTalents.deflectionCooldownMs;
      }
      player.shield += this.config.characterTalents.deflectionShield;
      player.hp = Math.min(player.maxHp, player.hp + this.config.characterTalents.deflectionHeal);
      player.overclockCooldownMs = Math.max(0, player.overclockCooldownMs - this.config.characterTalents.deflectionReducesOverclockMs);
      if (this.config.characterTalents.deflectionTriggersOverclockMs > 0) {
        const wasOverclocked = player.overclockRemainingMs > 0;
        player.overclockRemainingMs = Math.max(player.overclockRemainingMs, this.config.characterTalents.deflectionTriggersOverclockMs);
        player.overclockStrength = wasOverclocked ? Math.max(player.overclockStrength, 0.5) : 0.5;
        this.events.push({ type: 'overclock-started' });
      }
      player.damageInvulnerabilityMs = 420;
      this.events.push({ type: 'damage-prevented' });
      this.fx.push({ type: 'deflect', x: player.x, y: player.y, color: 0x78f7e9, radius: 58 });
      return;
    }

    const original = amount;
    if (player.shield > 0) {
      const absorbed = Math.min(player.shield, amount);
      player.shield -= absorbed;
      amount -= absorbed;
    }
    if (amount > 0) player.hp -= amount;
    this.damageTaken += original;
    if (this.eliteObjective?.type === 'low-damage') {
      this.eliteObjective.damageTaken = this.damageTaken;
      if (this.damageTaken > this.player.maxHp * 0.2) this.eliteObjective.failed = true;
    }
    player.damageInvulnerabilityMs = 520;
    player.hitFlash = 140;
    if (player.hp <= 0 && this.config.lethalGuardAvailable) {
      player.hp = 1;
      this.config.lethalGuardAvailable = false;
      player.damageInvulnerabilityMs = 1_200;
      this.fx.push({ type: 'deflect', x: player.x, y: player.y, color: 0xffd766, radius: 72 });
    }
  }

  private activateOverclock(): void {
    const player = this.player;
    if (player.overclockCooldownMs > 0 || player.overclockRemainingMs > 0) return;
    let duration = this.config.characterTalents.overclockDurationMs;
    if (this.config.characterTalents.overclockRedline) duration = Math.max(2_000, duration - 2_000);
    player.overclockRemainingMs = duration;
    player.overclockStrength = 1;
    player.overclockCooldownMs = this.config.characterTalents.overclockCooldownMs;
    player.deflectionRechargeMs = Math.max(0, player.deflectionRechargeMs - this.config.characterTalents.overclockReducesDeflectionMs);
    player.switchBonusUsed = false;
    if (this.config.characterTalents.overclockInstantReload) {
      for (let index = 0; index < 2; index += 1) {
        const slot = this.config.weapons[index as 0 | 1];
        player.weapons[index as 0 | 1].ammo = this.weaponDefinition(slot).magazine;
        player.weapons[index as 0 | 1].reloading = false;
      }
    }
    this.events.push({ type: 'overclock-started' });
    this.fx.push({ type: 'deflect', x: player.x, y: player.y, color: 0xffd766, radius: 66 });
  }

  private swapWeapon(): void {
    const player = this.player;
    player.activeWeapon = player.activeWeapon === 0 ? 1 : 0;
    if (this.arcanaScale('arcana-switch-spark') > 0 && this.swapArcanaCooldownMs <= 0) {
      this.swapArcanaWindowMs = 3_000;
    }
    if (player.overclocked && !player.switchBonusUsed && this.config.characterTalents.overclockSwitchDamageMs > 0) {
      player.switchDamageRemainingMs = this.config.characterTalents.overclockSwitchDamageMs;
      player.switchBonusUsed = true;
    }
    this.events.push({ type: 'weapon-swapped', weaponIndex: player.activeWeapon });
  }

  private startReload(index: 0 | 1): void {
    const runtime = this.player.weapons[index];
    const definition = this.weaponDefinition(this.config.weapons[index]);
    if (runtime.reloading || runtime.ammo >= definition.magazine) return;
    runtime.reloading = true;
    runtime.reloadRemainingMs = definition.reloadMs;
    this.events.push({ type: 'reload-started', weaponIndex: index });
  }

  private reloadSpeedMultiplier(): number {
    const overclock = this.player.overclocked
      ? this.overclockValue(1.4 + this.config.characterTalents.overclockReloadBonus)
      : 1;
    return Math.max(0.2, this.config.combatModifiers.reloadMultiplier * overclock);
  }

  private overclockValue(value: number): number {
    const redlineMultiplier = this.config.characterTalents.overclockRedline ? 2 : 1;
    return 1 + (value - 1) * redlineMultiplier * this.player.overclockStrength;
  }

  private updateRanged(enemy: EnemyState, dt: number): void {
    const dx = this.player.x - enemy.x;
    const dy = this.player.y - enemy.y;
    const distance = Math.hypot(dx, dy) || 1;
    const desired = distance > 360 ? 1 : distance < 250 ? -0.7 : 0;
    const speed = enemy.speed * this.enemySpeedMultiplier(enemy);
    enemy.x += dx / distance * speed * desired * dt;
    enemy.y += dy / distance * speed * desired * dt;
    enemy.rotation = Math.atan2(dy, dx);
    // 压力夹具必须稳定保持 500 枚弹丸，避免远程怪继续增殖弹幕后测到另一种负载。
    if (this.config.stressTest) return;
    if (enemy.attackTimerMs <= 0) {
      this.spawnEnemyProjectile(enemy.x, enemy.y, enemy.rotation, enemy.elite ? 11 : 8, enemy.elite ? 360 : 310);
      enemy.attackTimerMs = enemy.elite ? 1_100 : 1_500;
      this.fx.push({ type: 'warning', x: enemy.x, y: enemy.y, x2: this.player.x, y2: this.player.y, color: 0xff6b69 });
    }
  }

  private updateCharger(enemy: EnemyState, dt: number): void {
    if (enemy.state === 'move') {
      this.moveTowardPlayer(enemy, dt, enemy.speed * 0.72);
      if (enemy.attackTimerMs <= 0) {
        enemy.state = 'telegraph';
        enemy.stateTimerMs = 700;
        enemy.attackTimerMs = 2_800;
        const angle = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
        enemy.rotation = angle;
        enemy.chargeVx = Math.cos(angle) * (enemy.elite ? 620 : 520);
        enemy.chargeVy = Math.sin(angle) * (enemy.elite ? 620 : 520);
        this.fx.push({ type: 'warning', x: enemy.x, y: enemy.y, x2: this.player.x, y2: this.player.y, color: 0xff755f });
      }
    } else if (enemy.state === 'telegraph') {
      if (enemy.stateTimerMs <= 0) {
        enemy.state = 'charge';
        enemy.stateTimerMs = 620;
      }
    } else {
      enemy.x += enemy.chargeVx * dt;
      enemy.y += enemy.chargeVy * dt;
      if (enemy.stateTimerMs <= 0 || enemy.x < 40 || enemy.x > WORLD_WIDTH - 40 || enemy.y < 45 || enemy.y > WORLD_HEIGHT - 40) {
        enemy.state = 'move';
        enemy.x = clamp(enemy.x, 42, WORLD_WIDTH - 42);
        enemy.y = clamp(enemy.y, 48, WORLD_HEIGHT - 42);
      }
    }
  }

  private updateBoss(enemy: EnemyState, dt: number): void {
    const phaseTwo = enemy.hp <= enemy.maxHp * 0.5;
    const targetX = WORLD_WIDTH / 2 + Math.sin(this.elapsedMs / 1_700) * 250;
    const targetY = 190 + Math.cos(this.elapsedMs / 2_100) * 45;
    enemy.x += (targetX - enemy.x) * dt * 0.8;
    enemy.y += (targetY - enemy.y) * dt * 0.8;
    enemy.rotation = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
    if (phaseTwo && !enemy.bossPhaseTwoSpawned) {
      enemy.bossPhaseTwoSpawned = true;
      this.spawnEnemy('chaser', 290, 180, true);
      this.spawnEnemy('charger', WORLD_WIDTH - 290, 180, true);
      this.fx.push({ type: 'explosion', x: enemy.x, y: enemy.y, color: 0xff7a46, radius: 180 });
      enemy.state = 'move';
      enemy.attackTimerMs = 1_200;
      return;
    }

    if (enemy.state === 'telegraph') {
      if (enemy.stateTimerMs > 0) return;
      this.fireBossPattern(enemy, enemy.bossPattern, phaseTwo);
      enemy.state = 'move';
      enemy.attackTimerMs = phaseTwo ? 1_450 : 1_800;
      return;
    }

    if (enemy.attackTimerMs > 0) return;
    enemy.bossPattern = ((enemy.bossPattern + 1) % 3) as 0 | 1 | 2;
    enemy.state = 'telegraph';
    enemy.stateTimerMs = phaseTwo ? 550 : 700;
    if (enemy.bossPattern === 1) {
      this.fx.push({ type: 'warning', x: enemy.x, y: enemy.y, x2: this.player.x, y2: this.player.y, color: 0xff5f5f });
    } else {
      this.fx.push({
        type: 'warning', x: enemy.x, y: enemy.y,
        color: enemy.bossPattern === 0 ? 0xff8b58 : 0xd95fff,
        radius: enemy.bossPattern === 0 ? 150 : 105,
      });
    }
  }

  private fireBossPattern(enemy: EnemyState, pattern: 0 | 1 | 2, phaseTwo: boolean): void {
    if (pattern === 0) {
      const count = phaseTwo ? 20 : 14;
      for (let index = 0; index < count; index += 1) {
        this.spawnEnemyProjectile(enemy.x, enemy.y, Math.PI * 2 * index / count, phaseTwo ? 7 : 5, phaseTwo ? 285 : 245);
      }
    } else if (pattern === 1) {
      const base = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
      for (let index = -2; index <= 2; index += 1) {
        this.spawnEnemyProjectile(enemy.x, enemy.y, base + index * 0.12, phaseTwo ? 9 : 7, phaseTwo ? 390 : 340);
      }
    } else {
      for (let index = 0; index < (phaseTwo ? 8 : 5); index += 1) {
        const angle = this.random.next() * Math.PI * 2;
        this.spawnEnemyProjectile(enemy.x, enemy.y, angle, phaseTwo ? 6 : 5, 190);
      }
    }
  }

  private moveTowardPlayer(enemy: EnemyState, dt: number, baseSpeed: number): void {
    const dx = this.player.x - enemy.x;
    const dy = this.player.y - enemy.y;
    const distance = Math.hypot(dx, dy) || 1;
    const speed = baseSpeed * this.enemySpeedMultiplier(enemy);
    enemy.x += dx / distance * speed * dt;
    enemy.y += dy / distance * speed * dt;
    enemy.rotation = Math.atan2(dy, dx);
  }

  private enemySpeedMultiplier(enemy: EnemyState): number {
    return enemy.slowRemainingMs > 0 ? 1 - enemy.slowRatio : 1;
  }

  private updateBurn(enemy: EnemyState, deltaMs: number): void {
    if (enemy.burnRemainingMs <= 0 || enemy.hp <= 0) return;
    enemy.burnRemainingMs -= deltaMs;
    enemy.burnTickMs -= deltaMs;
    if (enemy.burnTickMs <= 0) {
      enemy.burnTickMs = 400;
      this.damageEnemy(enemy, enemy.burnDamage, false);
    }
  }

  private chainFrom(source: EnemyState, count: number, damage: number, legendary: boolean): void {
    let current = source;
    const hit = new Set([source.id]);
    const maxChains = count + (legendary ? 1 : 0);
    for (let index = 0; index < maxChains; index += 1) {
      const target = this.enemies
        .filter((enemy) => enemy.hp > 0 && !hit.has(enemy.id) && Math.hypot(enemy.x - current.x, enemy.y - current.y) <= 230)
        .sort((left, right) => Math.hypot(left.x - current.x, left.y - current.y) - Math.hypot(right.x - current.x, right.y - current.y))[0];
      if (!target) break;
      this.fx.push({ type: 'chain', x: current.x, y: current.y, x2: target.x, y2: target.y, color: 0x62f4e8 });
      this.damageEnemy(target, damage, false);
      hit.add(target.id);
      current = target;
      damage *= 0.82;
    }
  }

  private explode(
    x: number,
    y: number,
    radius: number,
    damage: number,
    excludedId: number,
    tag: 'arc' | 'blast' | 'frost',
    legendary: boolean,
    allowAftershock = true,
  ): void {
    this.fx.push({ type: 'explosion', x, y, color: tagColor(tag), radius });
    for (const enemy of this.enemies) {
      if (enemy.id === excludedId || enemy.hp <= 0) continue;
      if (Math.hypot(enemy.x - x, enemy.y - y) <= radius + enemy.radius) {
        this.damageEnemy(enemy, damage, false);
        if (legendary && tag === 'blast' && enemy.hp <= 0) {
          this.explode(enemy.x, enemy.y, radius * 0.8, damage * 0.65, enemy.id, tag, true);
        }
        const aftershockScale = tag === 'blast' && allowAftershock && enemy.hp <= 0
          ? this.arcanaScale('arcana-aftershock')
          : 0;
        if (aftershockScale > 0) {
          this.explode(enemy.x, enemy.y, radius * 0.72, damage * 0.34 * aftershockScale, enemy.id, tag, false, false);
        }
      }
    }
  }

  private spawnShards(x: number, y: number, damage: number): void {
    this.fx.push({ type: 'shatter', x, y, color: 0xb8f5ff, radius: 90 });
    for (let index = 0; index < 6; index += 1) {
      const angle = Math.PI * 2 * index / 6;
      this.projectiles.push({
        id: this.nextEntityId++, owner: 'player', x, y, vx: Math.cos(angle) * 620, vy: Math.sin(angle) * 620,
        rotation: angle, radius: 4, tag: 'frost', damage, remainingMs: 900, pierce: 1, bounces: 0,
        explosionRadius: 0, core: null, legendary: false, hitIds: new Set(),
      });
    }
  }

  private spawnEnemyProjectile(x: number, y: number, angle: number, damage: number, speed: number): void {
    this.projectiles.push({
      id: this.nextEntityId++, owner: 'enemy', x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      rotation: angle, radius: 8, tag: 'enemy', damage, remainingMs: 4_200, pierce: 0, bounces: 0,
      explosionRadius: 0, core: null, legendary: false, hitIds: new Set(),
    });
  }

  private spawnWave(): void {
    this.waveIndex += 1;
    const totalWaves = this.config.debugFast ? 1 : 2;
    const baseCount = this.config.debugFast ? 2 : 5 + this.config.roomIndex * 2 + (this.config.elite ? 2 : 0);
    const count = this.waveIndex === totalWaves ? baseCount + 2 : baseCount;
    for (let index = 0; index < count; index += 1) {
      const kinds: EnemyKind[] = this.config.roomIndex === 0
        ? ['chaser', 'chaser', 'ranged']
        : ['chaser', 'ranged', 'charger'];
      const kind = this.random.pick(kinds);
      const edge = this.random.int(0, 2);
      const x = edge === 0 ? this.random.int(90, WORLD_WIDTH - 90) : edge === 1 ? 80 : WORLD_WIDTH - 80;
      const y = edge === 0 ? 90 : this.random.int(100, 390);
      this.spawnEnemy(kind, x, y, this.config.elite);
    }
  }

  private spawnBoss(): void {
    const hp = this.config.debugFast ? 180 : BOSS_HP;
    this.enemies.push(this.makeEnemy('boss', WORLD_WIDTH / 2, 170, true, hp));
  }

  private spawnOverloadDevices(): void {
    const hp = this.config.debugFast ? 8 : 72;
    for (const [x, y] of [[360, 220], [640, 150], [920, 220]] as const) {
      this.enemies.push(this.makeEnemy('overload', x, y, true, hp));
    }
  }

  private spawnStressTest(): void {
    for (let index = 0; index < 50; index += 1) {
      this.spawnEnemy(index % 3 === 0 ? 'ranged' : index % 4 === 0 ? 'charger' : 'chaser',
        this.random.int(70, WORLD_WIDTH - 70), this.random.int(70, 420), false);
    }
    for (let index = 0; index < 500; index += 1) {
      const angle = this.random.next() * Math.PI * 2;
      this.projectiles.push({
        id: this.nextEntityId++, owner: 'player', x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2,
        vx: Math.cos(angle) * this.random.int(120, 520), vy: Math.sin(angle) * this.random.int(120, 520),
        rotation: angle, radius: 3, tag: index % 3 === 0 ? 'arc' : index % 3 === 1 ? 'blast' : 'frost',
        damage: 0, remainingMs: 120_000, pierce: 999, bounces: 99, explosionRadius: 0,
        core: null, legendary: false, hitIds: new Set(),
      });
    }
  }

  private spawnEnemy(kind: EnemyKind, x: number, y: number, elite: boolean): void {
    const hpByKind: Record<EnemyKind, number> = { chaser: 54, ranged: 46, charger: 82, overload: 72, boss: BOSS_HP };
    const roomScale = 1 + this.config.roomIndex * 0.18;
    const eliteScale = elite ? 1.65 : 1;
    const pacingScale = elite ? 1 : NORMAL_ENEMY_HP_SCALE;
    const debugScale = this.config.debugFast ? 0.15 : 1;
    this.enemies.push(this.makeEnemy(kind, x, y, elite, hpByKind[kind] * roomScale * eliteScale * pacingScale * debugScale));
  }

  private makeEnemy(kind: EnemyKind, x: number, y: number, elite: boolean, hp: number): EnemyState {
    const radius: Record<EnemyKind, number> = { chaser: 27, ranged: 24, charger: 33, overload: 31, boss: 82 };
    const speed: Record<EnemyKind, number> = { chaser: 116, ranged: 88, charger: 138, overload: 0, boss: 60 };
    return {
      id: this.nextEntityId++, kind, x, y, rotation: 0, radius: radius[kind], hp, maxHp: hp,
      frozen: false, elite, telegraph: 0, hitFlash: 0, speed: speed[kind], contactCooldownMs: 0,
      attackTimerMs: this.random.int(500, 1_200), stateTimerMs: 0, state: 'move', chargeVx: 0,
      chargeVy: 0, slowRatio: 0, slowRemainingMs: 0, freezeHits: 0, freezeRemainingMs: 0,
      burnDamage: 0, burnRemainingMs: 0, burnTickMs: 400, bossPhaseTwoSpawned: false, bossPattern: 2,
    };
  }

  private updateWaveFlow(deltaMs: number): void {
    if (this.config.boss || this.config.stressTest) return;
    const totalWaves = this.config.debugFast ? 1 : 2;
    if (this.enemies.length > 0 || this.waveIndex >= totalWaves) return;
    this.waveDelayMs += deltaMs;
    if (this.waveDelayMs >= 750) {
      this.waveDelayMs = 0;
      this.spawnWave();
    }
  }

  private removeExpiredEntities(): void {
    for (let index = this.enemies.length - 1; index >= 0; index -= 1) {
      if (this.enemies[index]?.hp !== undefined && (this.enemies[index]?.hp ?? 1) <= 0) this.enemies.splice(index, 1);
    }
    for (let index = this.projectiles.length - 1; index >= 0; index -= 1) {
      if ((this.projectiles[index]?.remainingMs ?? 1) <= 0) this.projectiles.splice(index, 1);
    }
  }

  private checkOutcome(deltaMs: number): void {
    if (this.result) return;
    if (this.player.hp <= 0) {
      this.finish(false);
      return;
    }
    if (this.config.stressTest) return;
    const totalWaves = this.config.debugFast ? 1 : 2;
    const encounterCleared = this.config.boss
      ? this.enemies.every((enemy) => enemy.kind !== 'boss')
      : this.waveIndex >= totalWaves && this.enemies.length === 0;
    if (!encounterCleared) {
      this.finishDelayMs = 0;
      return;
    }
    this.finishDelayMs += deltaMs;
    if (this.finishDelayMs >= 800) this.finish(true);
  }

  private updateEliteObjective(deltaMs: number): void {
    if (!this.eliteObjective) return;
    this.eliteObjective.elapsedMs += deltaMs;
    this.eliteObjective.damageTaken = this.damageTaken;
    if (this.eliteObjective.type === 'speed' && this.eliteObjective.elapsedMs > 90_000) this.eliteObjective.failed = true;
    if (this.eliteObjective.type === 'overloads' && this.eliteObjective.elapsedMs > 12_000 && !this.eliteObjective.completed) {
      this.eliteObjective.failed = true;
    }
  }

  private finish(won: boolean): void {
    this.finished = true;
    if (this.eliteObjective && won && !this.eliteObjective.failed) {
      if (this.eliteObjective.type === 'speed' && this.elapsedMs <= 90_000) this.eliteObjective.completed = true;
      if (this.eliteObjective.type === 'low-damage' && this.damageTaken <= this.player.maxHp * 0.2) this.eliteObjective.completed = true;
    } else if (this.eliteObjective && !won) this.eliteObjective.failed = true;
    const score = won ? Math.max(0, Math.round(15 - this.damageTaken / Math.max(1, this.player.maxHp) * 15)) : 0;
    this.result = {
      won,
      hp: Math.max(0, this.player.hp),
      shield: Math.max(0, this.player.shield),
      durationMs: this.elapsedMs,
      damageTaken: this.damageTaken,
      combatScore: score,
      lethalGuardAvailable: this.config.lethalGuardAvailable,
      activeWeapon: this.player.activeWeapon,
      eliteObjective: this.eliteObjective ? structuredClone(this.eliteObjective) : null,
    };
  }

  private arcanaScale(definitionId: string): number {
    const item = this.config.arcana.find((entry) => entry.definitionId === definitionId);
    return item ? ARCANA_RARITY_MULTIPLIER[item.rarity] : 0;
  }

  private createWeaponRuntime(slot: EquippedWeapon): WeaponRuntime {
    const definition = this.weaponDefinition(slot);
    return { ammo: definition.magazine, reloading: false, reloadRemainingMs: 0, fireCooldownMs: 0 };
  }

  private getWeaponHud(index: 0 | 1) {
    const slot = this.config.weapons[index];
    const definition = this.weaponDefinition(slot);
    const runtime = this.player.weapons[index];
    return {
      name: definition.name,
      ammo: runtime.ammo,
      magazine: definition.magazine,
      reloading: runtime.reloading,
      reloadProgress: runtime.reloading ? 1 - runtime.reloadRemainingMs / definition.reloadMs : 0,
      rarity: slot.weapon.rarity,
      tag: definition.tag,
    };
  }

  private weaponDefinition(slot: EquippedWeapon): WeaponDefinition {
    const definition = ITEM_BY_ID.get(slot.weapon.definitionId);
    if (!definition || definition.kind !== 'weapon') throw new Error(`Invalid weapon ${slot.weapon.definitionId}`);
    return definition;
  }

  private muzzleDefinition(slot: EquippedWeapon): MuzzleDefinition | null {
    if (!slot.muzzle) return null;
    return MUZZLES.find((entry) => entry.id === slot.muzzle?.definitionId) ?? null;
  }

  private coreDefinition(slot: EquippedWeapon): CoreDefinition | null {
    if (!slot.core) return null;
    return CORES.find((entry) => entry.id === slot.core?.definitionId) ?? null;
  }
}

function angleToDirection(angle: number): number {
  const normalized = (angle + Math.PI * 2 + Math.PI / 2) % (Math.PI * 2);
  return Math.round(normalized / (Math.PI / 4)) % 8;
}

function tagColor(tag: 'arc' | 'blast' | 'frost'): number {
  if (tag === 'blast') return 0xff9f45;
  if (tag === 'frost') return 0xa9f2ff;
  return 0x52f2df;
}

function toCombatTag(tag: string): 'arc' | 'blast' | 'frost' {
  if (tag === 'blast') return 'blast';
  if (tag === 'frost') return 'frost';
  return 'arc';
}

function enemyColor(kind: EnemyKind): number {
  if (kind === 'ranged') return 0xd559ef;
  if (kind === 'charger') return 0xff654f;
  if (kind === 'overload') return 0xffb84f;
  if (kind === 'boss') return 0xff8d46;
  return 0xb07a4a;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
