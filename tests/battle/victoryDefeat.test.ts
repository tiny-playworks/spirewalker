import { describe, expect, test } from '@rstest/core';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { createMvpRun, PLAYER_UNIT_ID } from '@/game/core/engine/createMvpRun';

describe('battle/victoryDefeat', () => {
  test('强制 defeat 后进入 game_over', () => {
    const engine = new GameEngine();
    let run = createMvpRun(103);
    run = engine.dispatch(run, { type: 'DEBUG_FORCE_BATTLE_OUTCOME', outcome: 'defeat' }).nextRun;
    run = engine.dispatch(run, { type: 'RESOLVE_ANIMATION_DONE' }).nextRun;
    const p = run.player.currentHp;
    expect(p).toBe(0);
  });

  test('强制 victory 可进入奖励流', () => {
    const engine = new GameEngine();
    let run = createMvpRun(104);
    run = engine.dispatch(run, { type: 'DEBUG_FORCE_BATTLE_OUTCOME', outcome: 'victory' }).nextRun;
    run = engine.dispatch(run, { type: 'LEAVE_BATTLE_TO_REWARD' }).nextRun;
    expect(run.screen.type).toBe('reward');
    expect(run.reward?.items.some((i) => i.type === 'card_choice')).toBe(true);
    expect(run.battle?.units[PLAYER_UNIT_ID]).toBeUndefined();
  });
});
