import { describe, expect, test } from '@rstest/core';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { createMvpRun, ENEMY_UNIT_ID } from '@/game/core/engine/createMvpRun';

describe('battle/turnFlow', () => {
  test('END_TURN 后敌人行动并进入下一玩家回合', () => {
    const engine = new GameEngine();
    let run = createMvpRun(102);
    const turnBefore = run.battle!.turn;
    const { nextRun, events } = engine.dispatch(run, { type: 'END_TURN' });
    run = nextRun;
    expect(events.some((e) => e.type === 'DAMAGE_DEALT' && e.sourceUnitId === ENEMY_UNIT_ID)).toBe(true);
    expect(run.battle!.turn).toBe(turnBefore + 1);
    expect(run.battle!.phase).toBe('player_action');
  });

  test('BEGIN_DRAG_CARD / CANCEL_DRAG_CARD 能驱动输入状态', () => {
    const engine = new GameEngine();
    let run = createMvpRun(103);
    const anyCardId = run.battle!.player.hand[0]!;
    const begin = engine.dispatch(run, {
      type: 'BEGIN_DRAG_CARD',
      cardInstanceId: anyCardId,
      sourceUnitId: run.battle!.playerUnitId,
    });
    run = begin.nextRun;
    expect(run.battle!.inputMode).toBe('dragging_card');
    const cancel = engine.dispatch(run, { type: 'CANCEL_DRAG_CARD' });
    run = cancel.nextRun;
    expect(run.battle!.inputMode).toBe('idle');
  });

  test('metallicize 在回合结束时生效（敌方获得格挡）', () => {
    const engine = new GameEngine();
    let run = createMvpRun(104);
    const before = run.battle!.units[ENEMY_UNIT_ID]!.block;
    const add = engine.dispatch(run, {
      type: 'DEBUG_ADD_STATUS',
      statusId: 'metallicize',
      stacks: 2,
      unitId: ENEMY_UNIT_ID,
    });
    run = add.nextRun;
    const ended = engine.dispatch(run, { type: 'END_TURN' });
    run = ended.nextRun;
    expect(run.battle!.units[ENEMY_UNIT_ID]!.block).toBeGreaterThanOrEqual(before + 2);
  });
});
