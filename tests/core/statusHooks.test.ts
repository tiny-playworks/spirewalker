import { describe, expect, test } from "@rstest/core";
import {
  addStatusStacks,
  getStatusStacks,
} from "@/game/core/combat/statusCombat";
import {
  STATUS_METALLICIZE,
  STATUS_MOMENTUM,
  STATUS_VULNERABLE,
  STATUS_WEAK,
} from "@/game/core/definitions/statuses";
import {
  buildInitialBattle,
  ENEMY_UNIT_ID,
  PLAYER_UNIT_ID,
} from "@/game/core/engine/createMvpRun";
import {
  runOnAfterPlayCard,
  runOnBeforeTakeDamage,
  runOnTurnEnd,
} from "@/game/core/systems/status/statusHooks";

describe("core/statusHooks", () => {
  test("虚弱在回合结束后衰减 1 层", () => {
    const battle = buildInitialBattle(11);
    const player = battle.units[PLAYER_UNIT_ID]!;
    addStatusStacks(player, STATUS_WEAK, 2);

    runOnTurnEnd(battle);

    expect(getStatusStacks(player, STATUS_WEAK)).toBe(1);
  });

  test("易伤会放大受到的伤害", () => {
    const battle = buildInitialBattle(12);
    const enemy = battle.units[ENEMY_UNIT_ID]!;
    addStatusStacks(enemy, STATUS_VULNERABLE, 1);

    expect(runOnBeforeTakeDamage(enemy, 8)).toBe(12);
  });

  test("连势在出牌后提供格挡并自动衰减 1 层", () => {
    const battle = buildInitialBattle(13);
    const player = battle.units[PLAYER_UNIT_ID]!;
    const events: [] = [];
    const card = battle.player.cards[battle.player.hand[0]!]!;
    addStatusStacks(player, STATUS_MOMENTUM, 2);

    runOnAfterPlayCard(battle, {
      card,
      sourceUnitId: PLAYER_UNIT_ID,
      events,
      skipMomentumAutoConsume: false,
    });

    expect(player.block).toBe(2);
    expect(getStatusStacks(player, STATUS_MOMENTUM)).toBe(1);
  });

  test("金属化在回合结束时按层数提供格挡", () => {
    const battle = buildInitialBattle(14);
    const enemy = battle.units[ENEMY_UNIT_ID]!;
    addStatusStacks(enemy, STATUS_METALLICIZE, 2);

    runOnTurnEnd(battle);

    expect(enemy.block).toBe(2);
  });
});
