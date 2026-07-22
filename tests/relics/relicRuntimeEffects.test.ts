import { describe, expect, test } from '@rstest/core';
import { getStatusStacks } from '@/game/core/combat/statusCombat';
import { STATUS_METALLICIZE } from '@/game/core/definitions/statuses';
import { buildInitialBattle, DEFAULT_ENEMY_LINEUP } from '@/game/core/engine/createMvpRun';
import { addRelicAwareStatusStacks } from '@/game/core/systems/relic/relicHooks';

describe('Relic runtime effects', () => {
  test('战斗开始遗物会真正改变战斗状态', () => {
    const battle = buildInitialBattle(
      901,
      undefined,
      'relic-runtime-start',
      undefined,
      DEFAULT_ENEMY_LINEUP,
      ['quickstep_boots', 'war_cry'],
    );

    expect(battle.player.energy).toBe(5);
    expect(battle.units[battle.enemyUnitIds[0]!]!.hp).toBe(37);
  });

  test('石盾圣印按金属化每跨过 3 层补格挡，而不是被连势增长误触发', () => {
    const battle = buildInitialBattle(
      902,
      undefined,
      'relic-runtime-stone-aegis',
      undefined,
      DEFAULT_ENEMY_LINEUP,
      ['stone_aegis'],
    );
    addRelicAwareStatusStacks(
      battle,
      battle.playerUnitId,
      STATUS_METALLICIZE,
      4,
    );
    expect(getStatusStacks(battle.units[battle.playerUnitId]!, STATUS_METALLICIZE)).toBe(4);
    expect(battle.units[battle.playerUnitId]!.block).toBe(2);

    addRelicAwareStatusStacks(
      battle,
      battle.playerUnitId,
      STATUS_METALLICIZE,
      2,
    );
    expect(getStatusStacks(battle.units[battle.playerUnitId]!, STATUS_METALLICIZE)).toBe(6);
    expect(battle.units[battle.playerUnitId]!.block).toBe(4);
  });
});
