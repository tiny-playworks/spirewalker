import { describe, expect, test } from '@rstest/core';
import { CombatSimulation } from '@/game/combat/CombatSimulation';
import { deriveStats } from '@/game/derivedStats';
import { EMPTY_COMBAT_INPUT, type CombatInput } from '@/game/input';
import { createDefaultProfile } from '@/game/progression';
import { createEncounterConfig, createRun } from '@/game/run';

function createSimulation() {
  const profile = createDefaultProfile();
  const run = createRun(profile, 2_026_080_3);
  return new CombatSimulation(createEncounterConfig(run, profile, { debugFast: true }));
}

function input(patch: Partial<CombatInput> = {}): CombatInput {
  return { ...EMPTY_COMBAT_INPUT, ...patch };
}

describe('V2 基础战斗节奏', () => {
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
});
