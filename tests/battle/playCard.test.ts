import { describe, expect, test } from '@rstest/core';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { createMvpRun, ENEMY_UNIT_ID, PLAYER_UNIT_ID } from '@/game/core/engine/createMvpRun';

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
});
