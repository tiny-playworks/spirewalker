import { describe, expect, test } from "@rstest/core";
import {
  addStatusStacks,
  getStatusStacks,
} from "@/game/core/combat/statusCombat";
import {
  STATUS_METALLICIZE,
  STATUS_MOMENTUM,
  STATUS_PRIMED_BREAK,
  STATUS_STEADY_GUARD,
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

  test("稳势在本回合未主动消耗连势时，回合结束给格挡并回 1 层连势", () => {
    const battle = buildInitialBattle(15);
    const player = battle.units[PLAYER_UNIT_ID]!;
    addStatusStacks(player, STATUS_STEADY_GUARD, 1);

    runOnTurnEnd(battle);

    expect(player.block).toBe(4);
    expect(getStatusStacks(player, STATUS_MOMENTUM)).toBe(1);
    expect(getStatusStacks(player, STATUS_STEADY_GUARD)).toBe(0);
  });

  test("稳势在本回合已经主动消耗连势时只衰减，不给额外收益", () => {
    const battle = buildInitialBattle(16);
    const player = battle.units[PLAYER_UNIT_ID]!;
    addStatusStacks(player, STATUS_STEADY_GUARD, 1);
    battle.playerConsumedMomentumThisTurn = true;

    runOnTurnEnd(battle);

    expect(player.block).toBe(0);
    expect(getStatusStacks(player, STATUS_MOMENTUM)).toBe(0);
    expect(getStatusStacks(player, STATUS_STEADY_GUARD)).toBe(0);
  });

  test("破势预热在回合结束时会清空剩余层数", () => {
    const battle = buildInitialBattle(17);
    const player = battle.units[PLAYER_UNIT_ID]!;
    addStatusStacks(player, STATUS_PRIMED_BREAK, 2);

    runOnTurnEnd(battle);

    expect(getStatusStacks(player, STATUS_PRIMED_BREAK)).toBe(0);
  });
});
