import { describe, expect, test } from '@rstest/core';
import { addStatusStacks } from '@/game/core/combat/statusCombat';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { createMvpRun, ENEMY_UNIT_ID, PLAYER_UNIT_ID } from '@/game/core/engine/createMvpRun';
import { STATUS_MOMENTUM, STATUS_PRIMED_BREAK, STATUS_STEADY_GUARD } from '@/game/core/definitions/statuses';

describe('battle/playCard', () => {
  test('PLAY_CARD 成功会产出事件并消耗能量', () => {
    const engine = new GameEngine();
    let run = createMvpRun(101);
    const strikeId = 'test_play_card_strike';
    run.battle!.player.cards[strikeId] = {
      instanceId: strikeId,
      definitionId: 'strike',
      baseCost: 1,
      costForTurn: 1,
      upgraded: false,
    };
    run.battle!.player.hand.unshift(strikeId);
    const cost = run.battle!.player.cards[strikeId]!.costForTurn;
    const energyBefore = run.battle!.player.energy;
    const { nextRun, events } = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: strikeId,
      sourceUnitId: PLAYER_UNIT_ID,
      targetUnitId: ENEMY_UNIT_ID,
    });
    run = nextRun;
    expect(run.battle!.player.energy).toBe(energyBefore - cost);
    expect(events.some((e) => e.type === 'CARD_PLAYED')).toBe(true);
    expect(events.some((e) => e.type === 'DAMAGE_DEALT')).toBe(true);
  });

  test('缓收会按当前连势获得格挡，但不消耗连势', () => {
    const engine = new GameEngine();
    let run = createMvpRun(102);
    addStatusStacks(run.battle!.units[PLAYER_UNIT_ID], STATUS_MOMENTUM, 3);
    run.battle!.player.cards.test_patient_cut = {
      instanceId: 'test_patient_cut',
      definitionId: 'patient_cut',
      baseCost: 1,
      costForTurn: 1,
      upgraded: false,
    };
    run.battle!.player.hand.unshift('test_patient_cut');

    run = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: 'test_patient_cut',
      sourceUnitId: PLAYER_UNIT_ID,
      targetUnitId: ENEMY_UNIT_ID,
    }).nextRun;

    expect(run.battle!.units[PLAYER_UNIT_ID].block).toBe(6);
    expect(run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0).toBe(2);
  });

  test('压锋会施加破势预热，下一张兑现牌额外获得 4 点伤害', () => {
    const engine = new GameEngine();
    let run = createMvpRun(103);
    run.battle!.player.cards.test_break_opening = {
      instanceId: 'test_break_opening',
      definitionId: 'break_opening',
      baseCost: 0,
      costForTurn: 0,
      upgraded: false,
    };
    run.battle!.player.cards.test_quick_release = {
      instanceId: 'test_quick_release',
      definitionId: 'quick_release',
      baseCost: 0,
      costForTurn: 0,
      upgraded: false,
    };
    run.battle!.player.hand.unshift('test_quick_release');
    run.battle!.player.hand.unshift('test_break_opening');

    run = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: 'test_break_opening',
      sourceUnitId: PLAYER_UNIT_ID,
    }).nextRun;
    run = engine.dispatch(run, { type: 'RESOLVE_ANIMATION_DONE' }).nextRun;
    expect(run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_PRIMED_BREAK)?.stacks ?? 0).toBe(1);

    const enemyHpBefore = run.battle!.units[ENEMY_UNIT_ID].hp;
    run = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: 'test_quick_release',
      sourceUnitId: PLAYER_UNIT_ID,
      targetUnitId: ENEMY_UNIT_ID,
    }).nextRun;

    expect(enemyHpBefore - run.battle!.units[ENEMY_UNIT_ID].hp).toBe(12);
    expect(run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_PRIMED_BREAK)?.stacks ?? 0).toBe(0);
  });

  test('屏息提供稳势，回合结束时会补格挡与连势', () => {
    const engine = new GameEngine();
    let run = createMvpRun(104);
    run.battle!.player.cards.test_held_breath = {
      instanceId: 'test_held_breath',
      definitionId: 'held_breath',
      baseCost: 1,
      costForTurn: 1,
      upgraded: false,
    };
    run.battle!.player.hand.unshift('test_held_breath');

    run = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: 'test_held_breath',
      sourceUnitId: PLAYER_UNIT_ID,
    }).nextRun;
    expect(run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_STEADY_GUARD)?.stacks ?? 0).toBe(1);

    run = engine.dispatch(run, { type: 'RESOLVE_ANIMATION_DONE' }).nextRun;
    run = engine.dispatch(run, { type: 'END_TURN' }).nextRun;
    expect(run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_STEADY_GUARD)?.stacks ?? 0).toBe(0);
    expect(run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0).toBe(1);
  });
});
