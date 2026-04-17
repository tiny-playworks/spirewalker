import { describe, expect, test } from '@rstest/core';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { createMvpRun, ENEMY_UNIT_ID, PLAYER_UNIT_ID } from '@/game/core/engine/createMvpRun';

describe('battle/playCard', () => {
  test('PLAY_CARD 成功会产出事件并消耗能量', () => {
    const engine = new GameEngine();
    let run = createMvpRun(101);
    const strikeId = run.battle!.player.hand.find((id) => run.battle!.player.cards[id]!.definitionId === 'strike')!;
    const energyBefore = run.battle!.player.energy;
    const { nextRun, events } = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: strikeId,
      sourceUnitId: PLAYER_UNIT_ID,
      targetUnitId: ENEMY_UNIT_ID,
    });
    run = nextRun;
    expect(run.battle!.player.energy).toBeLessThan(energyBefore);
    expect(events.some((e) => e.type === 'CARD_PLAYED')).toBe(true);
    expect(events.some((e) => e.type === 'DAMAGE_DEALT')).toBe(true);
  });
});
