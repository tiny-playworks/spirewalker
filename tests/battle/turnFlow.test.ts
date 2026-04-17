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
});
