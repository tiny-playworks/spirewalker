import { describe, expect, test } from '@rstest/core';
import { CombatSimulation } from '@/game/combat/CombatSimulation';
import { deriveStats } from '@/game/derivedStats';
import { EMPTY_COMBAT_INPUT, type CombatInput } from '@/game/input';
import { createDefaultProfile } from '@/game/progression';
import { createEliteObjective, createEncounterConfig, createRun } from '@/game/run';

function createSimulation() {
  const profile = createDefaultProfile();
  const run = createRun(profile, 2_026_080_3);
  return new CombatSimulation(createEncounterConfig(run, profile, { debugFast: true }));
}

function input(patch: Partial<CombatInput> = {}): CombatInput {
  return { ...EMPTY_COMBAT_INPUT, ...patch };
}

function runIdealPacingSample(roomIndex: number, boss = false): number {
  const profile = createDefaultProfile();
  const run = createRun(profile, 99);
  run.roomIndex = roomIndex;
  run.shield = 100_000;
  run.currentRoute = { id: 'pacing-sample', category: 'weapon', elite: false };
  const simulation = new CombatSimulation(createEncounterConfig(run, profile, { boss }));

  for (let frame = 0; frame < 30_000; frame += 1) {
    // 固定敌人只测命中充分时的最短输出节奏，实际游玩只会比这个样本更慢。
    for (const enemy of simulation.enemies) enemy.freezeRemainingMs = 999_999;
    const hud = simulation.getHudSnapshot(60, false);
    const target = (boss ? simulation.enemies.find((enemy) => enemy.kind === 'boss' && enemy.hp > 0) : null)
      ?? simulation.enemies
        .filter((enemy) => enemy.hp > 0)
        .sort((left, right) => (
          Math.hypot(left.x - simulation.player.x, left.y - simulation.player.y)
          - Math.hypot(right.x - simulation.player.x, right.y - simulation.player.y)
        ))[0];
    const active = hud.activeWeapon;
    const other = active === 0 ? 1 : 0;
    simulation.step(16, input(target ? {
      aimX: target.x,
      aimY: target.y,
      shooting: true,
      swapPressed: hud.weapons[active].reloading && !hud.weapons[other].reloading,
      abilityPressed: hud.overclockCooldownMs <= 0 && hud.overclockRemainingMs <= 0,
    } : {}));
    const result = simulation.getResult();
    if (result) return result.durationMs;
  }

  throw new Error('pacing sample did not finish');
}

describe('V2 基础战斗节奏', () => {
  test('非调试章节在理想命中下仍保留递进的战斗时长', () => {
    expect(runIdealPacingSample(0)).toBeGreaterThanOrEqual(20_000);
    expect(runIdealPacingSample(1)).toBeGreaterThanOrEqual(32_000);
    expect(runIdealPacingSample(2)).toBeGreaterThanOrEqual(45_000);
    expect(runIdealPacingSample(3, true)).toBeGreaterThanOrEqual(140_000);
  });

  test('Boss 拥有完整生命池，并在弹幕前先发出预警', () => {
    const profile = createDefaultProfile();
    const run = createRun(profile, 100);
    run.roomIndex = 3;
    const simulation = new CombatSimulation(createEncounterConfig(run, profile, { boss: true }));
    expect(simulation.enemies.find((enemy) => enemy.kind === 'boss')?.maxHp).toBe(9_600);

    let warningSeen = false;
    for (let frame = 0; frame < 90 && !warningSeen; frame += 1) {
      simulation.step(16, input());
      warningSeen = simulation.drainFx().some((effect) => effect.type === 'warning');
    }
    expect(warningSeen).toBe(true);
    expect(simulation.projectiles.filter((projectile) => projectile.owner === 'enemy')).toHaveLength(0);

    for (let frame = 0; frame < 50 && simulation.projectiles.length === 0; frame += 1) {
      simulation.step(16, input());
    }
    expect(simulation.projectiles.some((projectile) => projectile.owner === 'enemy')).toBe(true);
  });

  test('主武器换弹时切到副武器，主武器仍会在后台完成换弹', () => {
    const simulation = createSimulation();
    let reloadStarted = false;
    for (let frame = 0; frame < 500 && !reloadStarted; frame += 1) {
      simulation.step(34, input({ shooting: true, aimX: 1_260, aimY: simulation.player.y }));
      reloadStarted ||= simulation.drainEvents().some((event) => event.type === 'reload-started' && event.weaponIndex === 0);
    }
    expect(reloadStarted).toBe(true);
    expect(simulation.getHudSnapshot(60, false).weapons[0].reloading).toBe(true);

    simulation.step(34, input({ swapPressed: true }));
    expect(simulation.getHudSnapshot(60, false).activeWeapon).toBe(1);
    for (let frame = 0; frame < 60; frame += 1) simulation.step(34, input());
    const hud = simulation.getHudSnapshot(60, false);
    expect(hud.weapons[0].reloading).toBe(false);
    expect(hud.weapons[0].ammo).toBe(hud.weapons[0].magazine);
    expect(hud.activeWeapon).toBe(1);
  });

  test('模块超频开局可用并进入 28 秒冷却', () => {
    const simulation = createSimulation();
    simulation.step(16, input({ abilityPressed: true }));
    const hud = simulation.getHudSnapshot(60, false);
    expect(hud.overclockRemainingMs).toBeGreaterThan(5_900);
    expect(hud.overclockCooldownMs).toBeGreaterThan(27_900);
    expect(simulation.drainEvents().some((event) => event.type === 'overclock-started')).toBe(true);
  });

  test('应急偏转开局立即免疫一次伤害并进入 60 秒恢复', () => {
    const simulation = createSimulation();
    const hpBefore = simulation.player.hp;
    const enemy = simulation.enemies[0]!;
    enemy.x = simulation.player.x;
    enemy.y = simulation.player.y;
    simulation.step(16, input());
    const hud = simulation.getHudSnapshot(60, false);
    expect(simulation.player.hp).toBe(hpBefore);
    expect(hud.deflectionCharges).toBe(0);
    expect(hud.deflectionCooldownMs).toBe(60_000);
    expect(simulation.drainEvents().some((event) => event.type === 'damage-prevented')).toBe(true);
  });

  test('闪避持续约 0.18 秒并触发 1.2 秒冷却', () => {
    const simulation = createSimulation();
    simulation.step(16, input({ moveX: 1, dodgePressed: true }));
    const hud = simulation.getHudSnapshot(60, false);
    expect(simulation.player.invulnerable).toBe(true);
    expect(hud.dashCooldownMs).toBe(1_200);
  });

  test('终极偏转触发的是 3 秒半强度超频', () => {
    const profile = createDefaultProfile();
    profile.characters.artificer.selections['5'] = 't5-adaptive';
    const run = createRun(profile, 12);
    const simulation = new CombatSimulation(createEncounterConfig(run, profile, { debugFast: true }));
    const enemy = simulation.enemies[0]!;
    enemy.x = simulation.player.x;
    enemy.y = simulation.player.y;
    simulation.step(16, input());
    expect(simulation.player.overclockRemainingMs).toBe(3_000);
    expect(simulation.player.overclockStrength).toBe(0.5);
  });

  test('传奇秘宝会把对应路线的弹丸接入传奇规则', () => {
    const profile = createDefaultProfile();
    const run = createRun(profile, 13);
    run.relics.push({
      uid: 'legendary-wrench',
      kind: 'relic',
      definitionId: 'relic-master-wrench',
      rarity: 'legendary',
    });
    const simulation = new CombatSimulation(createEncounterConfig(run, profile, { debugFast: true }));
    simulation.step(16, input({ shooting: true, aimX: 640, aimY: 0 }));
    expect(simulation.projectiles.find((projectile) => projectile.owner === 'player')?.legendary).toBe(true);
  });

  test('属性界面与战斗弹丸共用同一份最终伤害派生值', () => {
    const profile = createDefaultProfile();
    const run = createRun(profile, 14);
    run.weapons[0].muzzle = { uid: 'muzzle', kind: 'muzzle', definitionId: 'muzzle-fan', rarity: 'rare' };
    const displayed = deriveStats(profile, run).weapons[0];
    const simulation = new CombatSimulation(createEncounterConfig(run, profile, { debugFast: true }));
    simulation.step(16, input({ shooting: true, aimX: 640, aimY: 0 }));
    const projectile = simulation.projectiles.find((entry) => entry.owner === 'player');
    expect(projectile?.damage).toBeCloseTo(displayed.damage, 6);
    expect(simulation.projectiles.filter((entry) => entry.owner === 'player')).toHaveLength(displayed.projectileCount);
  });

  test('满膛冲击按秘仪牌品质强化换弹后的第一发', () => {
    const profile = createDefaultProfile();
    const run = createRun(profile, 15);
    run.arcana.push({ uid: 'loaded-burst', kind: 'arcana', definitionId: 'arcana-loaded-burst', rarity: 'epic' });
    const baseDamage = deriveStats(profile, run).weapons[0].damage;
    const simulation = new CombatSimulation(createEncounterConfig(run, profile, { debugFast: true }));
    for (const enemy of simulation.enemies) enemy.freezeRemainingMs = 999_999;
    for (let frame = 0; frame < 500 && !simulation.getHudSnapshot(60, false).weapons[0].reloading; frame += 1) {
      simulation.step(34, input({ shooting: true, aimX: simulation.player.x, aimY: 720 }));
    }
    expect(simulation.getHudSnapshot(60, false).weapons[0].reloading).toBe(true);
    while (simulation.getHudSnapshot(60, false).weapons[0].reloading) simulation.step(34, input());
    simulation.step(34, input({ shooting: true, aimX: simulation.player.x, aimY: 720 }));
    const newest = simulation.projectiles.filter((projectile) => projectile.owner === 'player').at(-1);
    expect(newest?.damage).toBeCloseTo(baseDamage * (1 + 1.45 * 0.35), 6);
  });

  test('精英限时目标在 90 秒内清场会完成', () => {
    const profile = createDefaultProfile();
    const run = createRun(profile, 16);
    run.currentRoute = { id: 'elite', category: 'elite', elite: true };
    run.eliteObjective = { ...createEliteObjective(16, 1), type: 'speed', overloadsTotal: 0 };
    const simulation = new CombatSimulation(createEncounterConfig(run, profile, { debugFast: true }));
    for (const enemy of simulation.enemies) enemy.hp = 0;
    for (let frame = 0; frame < 40 && !simulation.getResult(); frame += 1) simulation.step(34, input());
    expect(simulation.getResult()?.eliteObjective?.completed).toBe(true);
    expect(simulation.getResult()?.eliteObjective?.failed).toBe(false);
  });

  test('三座过载装置未在 12 秒内摧毁时目标失败但战斗继续', () => {
    const profile = createDefaultProfile();
    const run = createRun(profile, 17);
    run.currentRoute = { id: 'elite', category: 'elite', elite: true };
    run.eliteObjective = {
      type: 'overloads', elapsedMs: 0, damageTaken: 0, overloadsDestroyed: 0, overloadsTotal: 3, completed: false, failed: false,
    };
    const simulation = new CombatSimulation(createEncounterConfig(run, profile, { debugFast: true }));
    expect(simulation.enemies.filter((enemy) => enemy.kind === 'overload')).toHaveLength(3);
    for (const enemy of simulation.enemies) if (enemy.kind !== 'overload') enemy.freezeRemainingMs = 999_999;
    for (let frame = 0; frame < 360; frame += 1) simulation.step(34, input());
    expect(simulation.getHudSnapshot(60, false).eliteObjective?.failed).toBe(true);
    expect(simulation.getResult()).toBeNull();
  });
});
