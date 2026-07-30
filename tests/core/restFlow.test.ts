import { describe, expect, test } from '@rstest/core';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { createMapRun } from '@/game/core/engine/createMapRun';

function restRun(seed: number) {
  const run = createMapRun(seed);
  run.screen = { type: 'rest' };
  return run;
}

describe('core/restFlow', () => {
  test('疗伤回复 30% 最大生命并返回地图', () => {
    const run = restRun(301);
    run.player.currentHp = 20;

    const result = new GameEngine().dispatch(run, {
      type: 'RESOLVE_REST_OPTION',
      option: 'heal',
    });

    expect(result.nextRun.player.currentHp).toBe(35);
    expect(result.nextRun.screen.type).toBe('map');
  });

  test('满血时不能选择疗伤', () => {
    const run = restRun(302);

    const result = new GameEngine().dispatch(run, {
      type: 'RESOLVE_REST_OPTION',
      option: 'heal',
    });

    expect(result.nextRun.player.currentHp).toBe(result.nextRun.player.maxHp);
    expect(result.nextRun.screen.type).toBe('rest');
  });

  test('静心为下一战增加 2 层连势', () => {
    const run = restRun(303);

    const result = new GameEngine().dispatch(run, {
      type: 'RESOLVE_REST_OPTION',
      option: 'meditate',
    });

    expect(result.nextRun.meta.pendingBattleMomentum).toBe(2);
    expect(result.nextRun.screen.type).toBe('map');
  });

  test('锻造升级指定卡牌', () => {
    const run = restRun(304);
    const strikeIndex = run.masterDeck.findIndex((cardId) => cardId === 'strike');

    const result = new GameEngine().dispatch(run, {
      type: 'RESOLVE_REST_OPTION',
      option: 'upgrade',
      masterDeckIndex: strikeIndex,
    });

    expect(result.nextRun.masterDeck[strikeIndex]).toBe('strike+');
    expect(result.nextRun.screen.type).toBe('map');
  });

  test('模拟器兼容入口在满血时自动选择静心', () => {
    const run = restRun(305);

    const result = new GameEngine().dispatch(run, {
      type: 'LEAVE_REST_TO_MAP',
    });

    expect(result.nextRun.meta.pendingBattleMomentum).toBe(2);
    expect(result.nextRun.screen.type).toBe('map');
  });
});
