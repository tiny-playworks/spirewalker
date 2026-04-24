import { describe, expect, test } from "@rstest/core";
import { GameEngine } from "@/game/core/engine/GameEngine";
import { createMapRun } from "@/game/core/engine/createMapRun";
import { PLAYER_UNIT_ID } from "@/game/core/engine/createMvpRun";

function firstBattleFromCamp(run: ReturnType<typeof createMapRun>): string {
  const b = run.map.nodes[run.map.currentNodeId!]!.nextNodeIds.find(
    (id) => run.map.nodes[id]!.type === "battle",
  );
  if (!b) throw new Error("no battle from camp");
  return b;
}

describe("reward/upgrade", () => {
  test("战后可以用 TAKE_REWARD_UPGRADE_CARD 升级 masterDeck 里的卡", () => {
    const engine = new GameEngine();
    let run = createMapRun(55);
    run = engine.dispatch(run, {
      type: "CHOOSE_MAP_NODE",
      nodeId: firstBattleFromCamp(run),
    }).nextRun;
    run.battle!.units[PLAYER_UNIT_ID]!.hp =
      run.battle!.units[PLAYER_UNIT_ID]!.maxHp;
    run.battle!.phase = "victory";
    run = engine.dispatch(run, { type: "LEAVE_BATTLE_TO_REWARD" }).nextRun;
    expect(run.screen.type).toBe("reward");

    const strikeIdx = run.masterDeck.indexOf("strike");
    expect(strikeIdx).toBeGreaterThanOrEqual(0);

    run = engine.dispatch(run, {
      type: "TAKE_REWARD_UPGRADE_CARD",
      masterDeckIndex: strikeIdx,
    }).nextRun;
    expect(run.masterDeck[strikeIdx]).toBe("strike+");
    expect(run.reward).toBeUndefined();
    expect(run.screen.type).not.toBe("reward");
  });

  test("不可升级的卡（junk_sludge）无法作为奖励升级目标", () => {
    const engine = new GameEngine();
    let run = createMapRun(56);
    run = engine.dispatch(run, {
      type: "CHOOSE_MAP_NODE",
      nodeId: firstBattleFromCamp(run),
    }).nextRun;
    run.battle!.units[PLAYER_UNIT_ID]!.hp =
      run.battle!.units[PLAYER_UNIT_ID]!.maxHp;
    run.battle!.phase = "victory";
    run = engine.dispatch(run, { type: "LEAVE_BATTLE_TO_REWARD" }).nextRun;

    run.masterDeck.push("junk_sludge");
    const junkIdx = run.masterDeck.length - 1;
    const deckBefore = [...run.masterDeck];
    run = engine.dispatch(run, {
      type: "TAKE_REWARD_UPGRADE_CARD",
      masterDeckIndex: junkIdx,
    }).nextRun;
    expect(run.masterDeck).toEqual(deckBefore);
    expect(run.screen.type).toBe("reward");
  });
});
