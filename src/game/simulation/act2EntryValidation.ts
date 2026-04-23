import { GameEngine } from '@/game/core/engine/GameEngine';
import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import { rewardEncounterTierFromRun } from '@/game/core/engine/rewardEncounter';
import { WANDERING_MERCHANT_EVENT_ID } from '@/game/core/engine/generateBranchingFloor';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { skipCardGoldAmount } from '@/game/core/engine/postBattleExtras';
import { isLegalMapStep } from '@/game/core/model/mapGraph';
import type { RunState } from '@/game/core/model/run';
import type { GameCommand } from '@/game/core/commands/types';
import type {
  Act2EntryEncounterMetric,
  Act2EntryPolicySummary,
  SimulationBattleContext,
  SimulationEventContext,
  SimulationMapContext,
  SimulationPlayableCommand,
  SimulationPolicy,
  SimulationRewardContext,
  SimulationShopContext,
} from './types';
import { walkerBasePolicies } from './policies/walkerPersonas';

const MAX_COMMANDS_PER_BATTLE = 1000;
const MAX_SCREENS_PER_RUN = 800;

type Act2BattleRecord = {
  encounterId: string;
  won: boolean;
  hpLoss: number;
  turns: number;
};

type SingleRunResult = {
  act1BossReached: boolean;
  enteredAct2: boolean;
  act2Battles: Act2BattleRecord[];
  validationCompleted: boolean;
  enteredEliteBranch: boolean;
};

type ValidationInput = {
  seed: number;
  runsPerPolicy: number;
  policies?: readonly SimulationPolicy[];
  characterId?: 'walker';
  onProgress?: (progress: {
    policyId: string;
    policyIndex: number;
    policyCount: number;
    completedRuns: number;
    totalRuns: number;
  }) => void;
};

function asPlayCardCommand(
  battle: NonNullable<RunState['battle']>,
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
    if (battle.player.lockedCardInstanceIds.includes(cardInstanceId)) continue;

    if (card.target === 'single_enemy') {
      for (const enemyUnitId of aliveEnemyIds) {
        result.push({
          command: {
            type: 'PLAY_CARD',
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
        type: 'PLAY_CARD',
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
    if (intent.type === 'attack') return sum + intent.value * (intent.hits ?? 1);
    if (intent.type === 'attack_buff') return sum + intent.attack;
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
  if (run.screen.type !== 'event') return [];

  switch (run.screen.eventId) {
    case WANDERING_MERCHANT_EVENT_ID:
      return run.meta.relics.includes('vajra') ? ['gold', 'heal'] : ['gold', 'heal', 'relic'];
    case 'stillness_shrine':
      return run.meta.relics.includes('guard_knot')
        ? ['guard_card', 'leave']
        : ['guard_relic', 'guard_card', 'leave'];
    case 'burst_altar':
      return run.meta.relics.includes('burst_emblem')
        ? ['burst_card', 'leave']
        : ['burst_relic', 'burst_card', 'leave'];
    case 'purging_pool':
      return [
        ...(run.masterDeck.includes('strike') ? ['remove_strike'] : []),
        ...(run.masterDeck.includes('defend') ? ['remove_defend'] : []),
        'leave',
      ];
    default:
      return ['leave'];
  }
}

function buildBattleContext(run: RunState): SimulationBattleContext {
  return {
    run,
    battle: run.battle!,
    playableCommands: asPlayCardCommand(run.battle!),
    projectedIncomingDamage: projectedIncomingDamage(run),
    stagnantBattleStateSteps: 0,
    stagnantCombatSteps: 0,
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
  const choice = reward.items.find((item) => item.type === 'card_choice');
  return {
    run,
    reward,
    tier: rewardEncounterTierFromRun(run),
    offeredCards: choice?.type === 'card_choice' ? choice.cards : [],
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
    eventId: run.screen.type === 'event' ? run.screen.eventId : '',
    availableOptionIds: availableEventOptionIds(run),
  };
}

function dispatchWithGuard(engine: GameEngine, run: RunState, command: GameCommand): RunState {
  return engine.dispatch(run, command).nextRun;
}

function chooseMapNodeWithValidationRule(policy: SimulationPolicy, run: RunState): string {
  const ctx = buildMapContext(run);
  if (run.meta.validationSegment === 'act2_entry') {
    const eliteNode = ctx.nextNodes.find((node) => node.type === 'elite');
    if (eliteNode) return eliteNode.id;
  }
  const chosen = policy.chooseMapNode(ctx);
  return ctx.nextNodes.some((node) => node.id === chosen) ? chosen : ctx.nextNodes[0]!.id;
}

function summarizeEncounter(records: Act2BattleRecord[], encounterId: string): Act2EntryEncounterMetric {
  const fights = records.filter((record) => record.encounterId === encounterId);
  const survives = fights.filter((record) => record.won).length;
  const totalHpLoss = fights.reduce((sum, record) => sum + record.hpLoss, 0);
  const totalTurns = fights.reduce((sum, record) => sum + record.turns, 0);
  return {
    encounterId,
    attempts: fights.length,
    survives,
    surviveRate: fights.length > 0 ? survives / fights.length : 0,
    avgHpLoss: fights.length > 0 ? totalHpLoss / fights.length : 0,
    avgTurns: fights.length > 0 ? totalTurns / fights.length : 0,
  };
}

function simulateSingleRun(
  seed: number,
  policy: SimulationPolicy,
  characterId: 'walker',
): SingleRunResult {
  const engine = new GameEngine();
  let run = createMapRun(seed);
  if (run.meta.characterId !== characterId) {
    throw new Error(`unsupported character: ${run.meta.characterId}`);
  }

  let screenTransitions = 0;
  let activeBattleId: string | null = null;
  let activeBattleTurn = 0;
  let activeBattleStartHp = 0;
  let battleCommands = 0;
  let act1BossReached = false;
  let enteredAct2 = false;
  let enteredEliteBranch = false;
  const act2Battles: Act2BattleRecord[] = [];

  const failRun = (): SingleRunResult => ({
    act1BossReached,
    enteredAct2,
    act2Battles,
    validationCompleted: false,
    enteredEliteBranch,
  });

  while (screenTransitions < MAX_SCREENS_PER_RUN) {
    switch (run.screen.type) {
      case 'map': {
        screenTransitions += 1;
        const ctx = buildMapContext(run);
        if (ctx.nextNodes.length === 0) {
          return {
            act1BossReached,
            enteredAct2,
            act2Battles,
            validationCompleted: Boolean(run.meta.validationCompleted),
            enteredEliteBranch: enteredEliteBranch || Boolean(run.meta.enteredAct2EliteBranch),
          };
        }
        run = dispatchWithGuard(engine, run, {
          type: 'CHOOSE_MAP_NODE',
          nodeId: chooseMapNodeWithValidationRule(policy, run),
        });
        enteredAct2 = enteredAct2 || run.meta.validationSegment === 'act2_entry';
        enteredEliteBranch = enteredEliteBranch || Boolean(run.meta.enteredAct2EliteBranch);
        break;
      }
      case 'battle': {
        const battle = run.battle!;
        if (activeBattleId !== battle.id) {
          screenTransitions += 1;
          activeBattleId = battle.id;
          activeBattleTurn = battle.turn;
          activeBattleStartHp = run.player.currentHp;
          battleCommands = 0;
          if (run.meta.act === 1 && battle.encounter.tier === 'boss') act1BossReached = true;
        }
        activeBattleTurn = battle.turn;

        if (battle.inputMode === 'animation_lock') {
          run = dispatchWithGuard(engine, run, { type: 'RESOLVE_ANIMATION_DONE' });
          break;
        }

        if (battle.phase === 'victory') {
          if (run.meta.validationSegment === 'act2_entry') {
            act2Battles.push({
              encounterId: battle.encounter.id,
              won: true,
              hpLoss: Math.max(0, activeBattleStartHp - run.player.currentHp),
              turns: battle.turn,
            });
          }
          activeBattleId = null;
          run = dispatchWithGuard(engine, run, { type: 'LEAVE_BATTLE_TO_REWARD' });
          enteredAct2 = enteredAct2 || run.meta.validationSegment === 'act2_entry';
          enteredEliteBranch = enteredEliteBranch || Boolean(run.meta.enteredAct2EliteBranch);
          break;
        }

        if (battle.phase === 'player_action') {
          if (battleCommands >= MAX_COMMANDS_PER_BATTLE) return failRun();
          const command = policy.chooseBattleCommand(buildBattleContext(run));
          battleCommands += 1;
          run = dispatchWithGuard(engine, run, command);
          break;
        }

        throw new Error(`unexpected battle state: phase=${battle.phase} input=${battle.inputMode}`);
      }
      case 'reward': {
        screenTransitions += 1;
        const rewardChoice = policy.chooseReward(buildRewardContext(run));
        run = rewardChoice.type === 'card'
          ? dispatchWithGuard(engine, run, {
              type: 'SELECT_REWARD_CARD',
              definitionId: rewardChoice.definitionId,
            })
          : dispatchWithGuard(engine, run, {
              type: 'TAKE_REWARD_GOLD',
              amount: skipCardGoldAmount(rewardEncounterTierFromRun(run)),
            });
        enteredAct2 = enteredAct2 || run.meta.validationSegment === 'act2_entry';
        enteredEliteBranch = enteredEliteBranch || Boolean(run.meta.enteredAct2EliteBranch);
        break;
      }
      case 'shop': {
        screenTransitions += 1;
        const action = policy.chooseShopAction(buildShopContext(run));
        run = action.type === 'leave_shop'
          ? dispatchWithGuard(engine, run, { type: 'LEAVE_SHOP_TO_MAP' })
          : dispatchWithGuard(engine, run, action);
        break;
      }
      case 'event': {
        screenTransitions += 1;
        run = dispatchWithGuard(engine, run, {
          type: 'RESOLVE_EVENT_OPTION',
          optionId: policy.chooseEventOption(buildEventContext(run)),
        });
        break;
      }
      case 'rest':
        screenTransitions += 1;
        run = dispatchWithGuard(engine, run, { type: 'LEAVE_REST_TO_MAP' });
        break;
      case 'game_over':
        screenTransitions += 1;
        if (activeBattleId && run.meta.validationSegment === 'act2_entry' && run.battle) {
          act2Battles.push({
            encounterId: run.battle.encounter.id,
            won: false,
            hpLoss: Math.max(0, activeBattleStartHp - run.player.currentHp),
            turns: activeBattleTurn,
          });
        }
        return failRun();
      case 'victory':
        screenTransitions += 1;
        return {
          act1BossReached,
          enteredAct2,
          act2Battles,
          validationCompleted: Boolean(run.meta.validationCompleted),
          enteredEliteBranch: enteredEliteBranch || Boolean(run.meta.enteredAct2EliteBranch),
        };
      default:
        throw new Error(`unsupported screen: ${run.screen.type}`);
    }
  }

  return failRun();
}

export function runAct2EntryValidation(input: ValidationInput): Act2EntryPolicySummary[] {
  const {
    seed,
    runsPerPolicy,
    policies = walkerBasePolicies,
    characterId = 'walker',
    onProgress,
  } = input;
  if (runsPerPolicy <= 0) throw new Error('runsPerPolicy must be positive');

  return policies.map((policy, policyIndex) => {
    const details = Array.from({ length: runsPerPolicy }, (_, runIndex) => {
      const result = simulateSingleRun((seed + policyIndex * 10000 + runIndex) >>> 0, policy, characterId);
      onProgress?.({
        policyId: policy.id,
        policyIndex,
        policyCount: policies.length,
        completedRuns: runIndex + 1,
        totalRuns: runsPerPolicy,
      });
      return result;
    });
    const act2Details = details.filter((detail) => detail.enteredAct2);
    const allAct2Records = act2Details.flatMap((detail) => detail.act2Battles);
    const act1BossReachCount = details.filter((detail) => detail.act1BossReached).length;
    const act1BossDefeatCount = act2Details.length;
    const floor13Wins = act2Details.filter((detail) => {
      if (detail.act2Battles.length < 3) return false;
      return detail.act2Battles.slice(0, 3).every((record) => record.won);
    }).length;
    const floor15Wins = act2Details.filter((detail) => {
      if (detail.act2Battles.length < 5) return false;
      return detail.act2Battles.slice(0, 5).every((record) => record.won);
    }).length;
    const eliteBranchDetails = act2Details.filter((detail) => detail.enteredEliteBranch);
    const uniqueEncounterIds = [...new Set(allAct2Records.map((record) => record.encounterId))].sort();

    return {
      policyId: policy.id,
      totalRuns: runsPerPolicy,
      act1BossReachCount,
      act1BossReachRate: act1BossReachCount / runsPerPolicy,
      act1BossDefeatCount,
      act1BossDefeatRate: act1BossDefeatCount / runsPerPolicy,
      act2EntrySamples: act2Details.length,
      act2Floor13SurviveCount: floor13Wins,
      act2Floor13SurviveRate: act2Details.length > 0 ? floor13Wins / act2Details.length : 0,
      act2Floor15SurviveCount: floor15Wins,
      act2Floor15SurviveRate: act2Details.length > 0 ? floor15Wins / act2Details.length : 0,
      act2FrontWinRate: act2Details.length > 0
        ? act2Details.filter((detail) => detail.validationCompleted).length / act2Details.length
        : 0,
      act2AvgHpLoss: allAct2Records.length > 0
        ? allAct2Records.reduce((sum, record) => sum + record.hpLoss, 0) / allAct2Records.length
        : 0,
      act2AvgTurns: allAct2Records.length > 0
        ? allAct2Records.reduce((sum, record) => sum + record.turns, 0) / allAct2Records.length
        : 0,
      act2EliteBranchEnterCount: eliteBranchDetails.length,
      act2EliteBranchEnterRate: act2Details.length > 0 ? eliteBranchDetails.length / act2Details.length : 0,
      act2EliteBranchSamples: eliteBranchDetails.length,
      act2EliteBranchSurviveRate: eliteBranchDetails.length > 0
        ? eliteBranchDetails.filter((detail) => detail.validationCompleted).length / eliteBranchDetails.length
        : 0,
      encounterBreakdown: uniqueEncounterIds.map((encounterId) => summarizeEncounter(allAct2Records, encounterId)),
    };
  });
}
