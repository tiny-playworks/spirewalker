import { describe, expect, test } from '@rstest/core';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { availableEventOptionIds } from '@/game/simulation/availableEventOptions';

describe('simulation/availableEventOptionIds', () => {
  test('通用事件返回定义中的真实选项，不再伪造 leave', () => {
    const run = createMapRun(101);
    run.screen = { type: 'event', eventId: 'rusted_chest' };

    expect(availableEventOptionIds(run)).toEqual([
      'force_open',
      'careful_unlock',
      'leave_chest',
    ]);
    expect(availableEventOptionIds(run)).not.toContain('leave');
  });

  test('满血时游荡商人的治疗选项不可用', () => {
    const run = createMapRun(102);
    run.screen = { type: 'event', eventId: 'wandering_merchant' };

    expect(availableEventOptionIds(run)).toEqual(['gold', 'relic']);

    run.player.currentHp -= 10;
    expect(availableEventOptionIds(run)).toEqual(['gold', 'heal', 'relic']);
  });

  test('取得瓦哈纳需要支付生命，并正常离开事件页', () => {
    const run = createMapRun(103);
    run.player.currentHp = 40;
    run.screen = { type: 'event', eventId: 'wandering_merchant' };

    const result = new GameEngine().dispatch(run, {
      type: 'RESOLVE_EVENT_OPTION',
      optionId: 'relic',
    });

    expect(result.nextRun.player.currentHp).toBe(32);
    expect(result.nextRun.meta.relics).toContain('vajra');
    expect(result.nextRun.screen.type).toBe('map');
  });
});
