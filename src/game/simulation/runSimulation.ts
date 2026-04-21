import type { GameCommand } from "@/game/core/commands/types";
import { CARD_DEFINITIONS } from "@/game/core/definitions/cards/starter";
import { getCharacterDefinition } from "@/game/core/definitions/characters";
import { GameEngine } from "@/game/core/engine/GameEngine";
import { WANDERING_MERCHANT_EVENT_ID } from "@/game/core/engine/generateBranchingFloor";
import { skipCardGoldAmount } from "@/game/core/engine/postBattleExtras";
import { rewardEncounterTierFromRun } from "@/game/core/engine/rewardEncounter";
import { createMapRun } from "@/game/core/engine/createMapRun";
import { isLegalMapStep } from "@/game/core/model/mapGraph";
import type { RunState } from "@/game/core/model/run";
import type {
  SimulationBattleContext,
  SimulationEventContext,
  SimulationMapContext,
  SimulationPlayableCommand,
  SimulationPolicy,
  SimulationRewardContext,
  SimulationShopContext,
  SimulationSummary,
} from "./types";

const TURN_TWO_SETUP_CARD_IDS = new Set([
  "prime_rhythm",
  "brace_rhythm",
  "soft_step",
]);
const MAX_COMMANDS_PER_BATTLE = 200;
const MAX_SCREENS_PER_RUN = 500;

type SimulationRunDetail = {
  won: boolean;
  totalCombatTurns: number;
  combats: number;
  momentumOpeningHits: number;
  defenseBranchFormed: boolean;
  burstBranchFormed: boolean;
  pollutedDeck: boolean;
};

type SimulationInput = {
  seed: number;
  runs: number;
  policy: SimulationPolicy;
  characterId?: "walker";
};

function asPlayCardCommand(
  battle: NonNullable<RunState["battle"]>,
): SimulationPlayableCommand[] {
  const result: SimulationPlayableCommand[] = [];
  const aliveEnemyIds = battle.enemyUnitIds.filter(
    (enemyUnitId) => battle.units[enemyUnitId]?.alive,
  );

  for (const cardInstanceId of battle.player.hand) {
    const cardInstance = battle.player.cards[cardInstanceId];
    const card = cardInstance
      ? CARD_DEFINITIONS[cardInstance.definitionId]
      : null;
    if (!card || battle.player.energy < cardInstance.costForTurn) continue;

    if (card.target === "single_enemy") {
      for (const enemyUnitId of aliveEnemyIds) {
        result.push({
          command: {
            type: "PLAY_CARD",
            cardInstanceId,
            sourceUnitId: battle.playerUnitId,
            targetUnitId: enemyUnitId,
          },
          card,
          targetIntent: battle.monsters[enemyUnitId]?.intent ?? null,
        });
      }
      continue;
    }

    result.push({
      command: {
        type: "PLAY_CARD",
        cardInstanceId,
        sourceUnitId: battle.playerUnitId,
      },
      card,
      targetIntent: null,
    });
  }

  return result;
}

function projectedIncomingDamage(run: RunState): number {
  const battle = run.battle;
  if (!battle) return 0;

  return battle.enemyUnitIds.reduce((sum, enemyUnitId) => {
    const unit = battle.units[enemyUnitId];
    const intent = battle.monsters[enemyUnitId]?.intent;
    if (!unit?.alive || !intent) return sum;
    if (intent.type === "attack")
      return sum + intent.value * (intent.hits ?? 1);
    if (intent.type === "attack_buff") return sum + intent.attack;
    return sum;
  }, 0);
}

function availableMapNodes(run: RunState) {
  const currentNodeId = run.map.currentNodeId;
  const current = currentNodeId ? run.map.nodes[currentNodeId] : null;
  if (!currentNodeId || !current) return [];
  return current.nextNodeIds
    .map((nodeId) => run.map.nodes[nodeId])
    .filter((node): node is NonNullable<typeof node> => Boolean(node))
    .filter((node) => isLegalMapStep(run.map.nodes, currentNodeId, node.id));
}

function availableEventOptionIds(run: RunState): string[] {
  if (run.screen.type !== "event") return [];

  switch (run.screen.eventId) {
    case WANDERING_MERCHANT_EVENT_ID:
      return run.meta.relics.includes("vajra")
        ? ["gold", "heal"]
        : ["gold", "heal", "relic"];
    case "stillness_shrine":
      return run.meta.relics.includes("guard_knot")
        ? ["guard_card", "leave"]
        : ["guard_relic", "guard_card", "leave"];
    case "burst_altar":
      return run.meta.relics.includes("burst_emblem")
        ? ["burst_card", "leave"]
        : ["burst_relic", "burst_card", "leave"];
    case "purging_pool":
      return [
        ...(run.masterDeck.includes("strike") ? ["remove_strike"] : []),
        ...(run.masterDeck.includes("defend") ? ["remove_defend"] : []),
        "leave",
      ];
    default:
      return ["leave"];
  }
}

function buildBattleContext(run: RunState): SimulationBattleContext {
  return {
    run,
    battle: run.battle!,
    playableCommands: asPlayCardCommand(run.battle!),
    projectedIncomingDamage: projectedIncomingDamage(run),
  };
}

function buildMapContext(run: RunState): SimulationMapContext {
  return {
    run,
    currentNodeId: run.map.currentNodeId!,
    nextNodes: availableMapNodes(run),
  };
}

function buildRewardContext(run: RunState): SimulationRewardContext {
  const reward = run.reward!;
  const choice = reward.items.find((item) => item.type === "card_choice");
  return {
    run,
    reward,
    tier: rewardEncounterTierFromRun(run),
    offeredCards: choice?.type === "card_choice" ? choice.cards : [],
    skipGoldAmount: skipCardGoldAmount(rewardEncounterTierFromRun(run)),
  };
}

function buildShopContext(run: RunState): SimulationShopContext {
  return {
    run,
    shop: run.shop!,
  };
}

function buildEventContext(run: RunState): SimulationEventContext {
  return {
    run,
    eventId: run.screen.type === "event" ? run.screen.eventId : "",
    availableOptionIds: availableEventOptionIds(run),
  };
}

function firstTwoTurnMomentumOpening(run: RunState): boolean {
  const battle = run.battle;
  if (!battle) return false;
  const seen = [
    ...battle.player.hand,
    ...battle.player.drawPile.slice(0, 5),
  ].map((cardInstanceId) => battle.player.cards[cardInstanceId]?.definitionId);
  return seen.some((cardId) => TURN_TWO_SETUP_CARD_IDS.has(cardId ?? ""));
}

function isBranchFormed(
  run: RunState,
  branchId: "guard_line" | "burst_line",
): boolean {
  const branch = getCharacterDefinition(
    run.meta.characterId,
  ).buildBranches.find((item) => item.id === branchId);
  if (!branch) return false;
  return (
    branch.coreCardIds.every((cardId) => run.masterDeck.includes(cardId)) &&
    run.meta.relics.includes(branch.coreRelicId)
  );
}

function isPollutedDeck(run: RunState): boolean {
  const starterDeck = getCharacterDefinition(run.meta.characterId).starterDeck;
  const starterCounts = new Map<string, number>();
  for (const cardId of starterDeck)
    starterCounts.set(cardId, (starterCounts.get(cardId) ?? 0) + 1);

  const addedCards: string[] = [];
  for (const cardId of run.masterDeck) {
    const remaining = starterCounts.get(cardId) ?? 0;
    if (remaining > 0) {
      starterCounts.set(cardId, remaining - 1);
    } else {
      addedCards.push(cardId);
    }
  }

  if (addedCards.length === 0) return false;

  const characterPool = new Set(
    getCharacterDefinition(run.meta.characterId).rewardCardPool,
  );
  const pollutedCount = addedCards.filter(
    (cardId) => !characterPool.has(cardId),
  ).length;
  return pollutedCount / addedCards.length > 0.4;
}

function dispatchWithGuard(
  engine: GameEngine,
  run: RunState,
  command: GameCommand,
): RunState {
  return engine.dispatch(run, command).nextRun;
}

function simulateSingleRun(
  seed: number,
  policy: SimulationPolicy,
  characterId: "walker",
): SimulationRunDetail {
  const engine = new GameEngine();
  let run = createMapRun(seed);
  if (run.meta.characterId !== characterId) {
    throw new Error(`unsupported character: ${run.meta.characterId}`);
  }

  let screenTransitions = 0;
  let activeBattleId: string | null = null;
  let activeBattleTurn = 0;
  let battleCommands = 0;
  let combats = 0;
  let totalCombatTurns = 0;
  let momentumOpeningHits = 0;

  const advanceScreenCounter = () => {
    screenTransitions += 1;
    if (screenTransitions > MAX_SCREENS_PER_RUN) {
      throw new Error(`screen transition limit exceeded for seed ${seed}`);
    }
  };

  while (screenTransitions < MAX_SCREENS_PER_RUN) {
    switch (run.screen.type) {
      case "map": {
        advanceScreenCounter();
        const ctx = buildMapContext(run);
        if (ctx.nextNodes.length === 0) {
          return {
            won: false,
            totalCombatTurns,
            combats,
            momentumOpeningHits,
            defenseBranchFormed: isBranchFormed(run, "guard_line"),
            burstBranchFormed: isBranchFormed(run, "burst_line"),
            pollutedDeck: isPollutedDeck(run),
          };
        }
        run = dispatchWithGuard(engine, run, {
          type: "CHOOSE_MAP_NODE",
          nodeId: policy.chooseMapNode(ctx),
        });
        break;
      }
      case "battle": {
        const battle = run.battle!;
        if (activeBattleId !== battle.id) {
          advanceScreenCounter();
          activeBattleId = battle.id;
          activeBattleTurn = battle.turn;
          battleCommands = 0;
          combats += 1;
          if (firstTwoTurnMomentumOpening(run)) momentumOpeningHits += 1;
        }
        activeBattleTurn = battle.turn;

        if (battle.inputMode === "animation_lock") {
          run = dispatchWithGuard(engine, run, {
            type: "RESOLVE_ANIMATION_DONE",
          });
          break;
        }

        if (battle.phase === "victory") {
          totalCombatTurns += battle.turn;
          activeBattleId = null;
          run = dispatchWithGuard(engine, run, {
            type: "LEAVE_BATTLE_TO_REWARD",
          });
          break;
        }

        if (battle.phase === "player_action") {
          if (battleCommands >= MAX_COMMANDS_PER_BATTLE) {
            throw new Error(`battle command limit exceeded for seed ${seed}`);
          }
          const command = policy.chooseBattleCommand(buildBattleContext(run));
          battleCommands += 1;
          run = dispatchWithGuard(engine, run, command);
          break;
        }

        throw new Error(
          `unexpected battle state: phase=${battle.phase} input=${battle.inputMode}`,
        );
      }
      case "reward": {
        advanceScreenCounter();
        const rewardChoice = policy.chooseReward(buildRewardContext(run));
        run =
          rewardChoice.type === "card"
            ? dispatchWithGuard(engine, run, {
                type: "SELECT_REWARD_CARD",
                definitionId: rewardChoice.definitionId,
              })
            : dispatchWithGuard(engine, run, {
                type: "TAKE_REWARD_GOLD",
                amount: skipCardGoldAmount(rewardEncounterTierFromRun(run)),
              });
        break;
      }
      case "shop": {
        advanceScreenCounter();
        const action = policy.chooseShopAction(buildShopContext(run));
        run =
          action.type === "leave_shop"
            ? dispatchWithGuard(engine, run, { type: "LEAVE_SHOP_TO_MAP" })
            : dispatchWithGuard(engine, run, action);
        break;
      }
      case "event": {
        advanceScreenCounter();
        run = dispatchWithGuard(engine, run, {
          type: "RESOLVE_EVENT_OPTION",
          optionId: policy.chooseEventOption(buildEventContext(run)),
        });
        break;
      }
      case "rest":
        advanceScreenCounter();
        run = dispatchWithGuard(engine, run, { type: "LEAVE_REST_TO_MAP" });
        break;
      case "victory":
        advanceScreenCounter();
        return {
          won: true,
          totalCombatTurns,
          combats,
          momentumOpeningHits,
          defenseBranchFormed: isBranchFormed(run, "guard_line"),
          burstBranchFormed: isBranchFormed(run, "burst_line"),
          pollutedDeck: isPollutedDeck(run),
        };
      case "game_over":
        advanceScreenCounter();
        if (activeBattleId) {
          totalCombatTurns += activeBattleTurn;
          activeBattleId = null;
        }
        return {
          won: false,
          totalCombatTurns,
          combats,
          momentumOpeningHits,
          defenseBranchFormed: isBranchFormed(run, "guard_line"),
          burstBranchFormed: isBranchFormed(run, "burst_line"),
          pollutedDeck: isPollutedDeck(run),
        };
      default:
        throw new Error(`unsupported screen: ${run.screen.type}`);
    }
  }

  throw new Error(`screen transition limit exceeded for seed ${seed}`);
}

export function runSimulation(input: SimulationInput): SimulationSummary {
  const { seed, runs, policy, characterId = "walker" } = input;
  if (runs <= 0) throw new Error("runs must be positive");

  let wins = 0;
  let totalCombatTurns = 0;
  let totalCombats = 0;
  let momentumOpeningHits = 0;
  let defenseBranchHits = 0;
  let burstBranchHits = 0;
  let pollutedDeckHits = 0;

  for (let index = 0; index < runs; index += 1) {
    const detail = simulateSingleRun((seed + index) >>> 0, policy, characterId);
    if (detail.won) wins += 1;
    totalCombatTurns += detail.totalCombatTurns;
    totalCombats += detail.combats;
    momentumOpeningHits += detail.momentumOpeningHits;
    if (detail.defenseBranchFormed) defenseBranchHits += 1;
    if (detail.burstBranchFormed) burstBranchHits += 1;
    if (detail.pollutedDeck) pollutedDeckHits += 1;
  }

  return {
    totalRuns: runs,
    winRate: wins / runs,
    avgTurnsPerCombat: totalCombats > 0 ? totalCombatTurns / totalCombats : 0,
    momentumOpenedByTurn2Rate:
      totalCombats > 0 ? momentumOpeningHits / totalCombats : 0,
    defenseBranchRate: defenseBranchHits / runs,
    burstBranchRate: burstBranchHits / runs,
    pollutedDeckRate: pollutedDeckHits / runs,
  };
}
