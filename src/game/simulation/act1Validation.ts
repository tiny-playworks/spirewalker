import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { WANDERING_MERCHANT_EVENT_ID } from '@/game/core/engine/generateBranchingFloor';
import { skipCardGoldAmount } from '@/game/core/engine/postBattleExtras';
import { rewardEncounterTierFromRun } from '@/game/core/engine/rewardEncounter';
import { createMapRun } from '@/game/core/engine/createMapRun';
import type { PressureProfile } from '@/game/core/definitions/encounters';
import type { GameCommand } from '@/game/core/commands/types';
import { isLegalMapStep } from '@/game/core/model/mapGraph';
import type { MapNodeType } from '@/game/core/model/map';
import type { RunState } from '@/game/core/model/run';
import type {
  Act1DeathStage,
  Act1DeathStageMetric,
  BattleGuardrailMode,
  Act1NonBattleEndReason,
  Act1NonBattleReasonMetric,
  Act1NonBattleTrace,
  Act1NodeChoiceMetric,
  Act1PressureMetric,
  Act1StageMetric,
  Act1TraceNode,
  Act1TraceScreenTransition,
  Act1ValidationSummary,
  SimulationBattleContext,
  SimulationEventContext,
  SimulationMapContext,
  SimulationPlayableCommand,
  SimulationPolicy,
  SimulationRewardContext,
  SimulationShopContext,
} from './types';
import {
  walkerBasePolicies,
} from './policies/walkerPersonas';

const BASELINE_MAX_COMMANDS_PER_BATTLE = 200;
const PROGRESS_GUARD_MAX_COMMANDS_PER_BATTLE = 1000;
const NO_PROGRESS_STATE_REPEAT_LIMIT = 12;
const NO_PROGRESS_COMBAT_REPEAT_LIMIT = 60;
const MAX_SCREENS_PER_RUN = 500;
const TRACE_HISTORY_LIMIT = 6;

type Act1ValidationInput = {
  seed: number;
  runs: number;
  policy: SimulationPolicy;
  characterId?: 'walker';
  guardrailMode?: BattleGuardrailMode;
};

type Act1ValidationSuiteInput = {
  seed: number;
  runsPerPolicy: number;
  policies?: SimulationPolicy[];
  characterId?: 'walker';
  guardrailMode?: BattleGuardrailMode;
};

type Act1BattleRecord = {
  tier: 'normal' | 'elite' | 'boss';
  pressureProfile: PressureProfile;
  won: boolean;
  turns: number;
  hpLoss: number;
  firstElite: boolean;
};

type Act1RunDetail = {
  seed: number;
  policyId: string;
  guardrailMode: BattleGuardrailMode;
  records: Act1BattleRecord[];
  nodeChoices: MapNodeType[];
  endStage: Act1DeathStage;
  endReason?: Act1NonBattleEndReason;
  endTrace?: Act1NonBattleTrace;
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
    const card = cardInstance ? CARD_DEFINITIONS[cardInstance.definitionId] : null;
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

function buildBattleContext(
  run: RunState,
  stagnantBattleStateSteps = 0,
  stagnantCombatSteps = 0,
): SimulationBattleContext {
  return {
    run,
    battle: run.battle!,
    playableCommands: asPlayCardCommand(run.battle!),
    projectedIncomingDamage: projectedIncomingDamage(run),
    stagnantBattleStateSteps,
    stagnantCombatSteps,
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

function pushRecent<T>(items: T[], value: T): void {
  items.push(value);
  if (items.length > TRACE_HISTORY_LIMIT) items.shift();
}

function cloneNodeHistory(items: Act1TraceNode[]): Act1TraceNode[] {
  return items.map((item) => ({ ...item }));
}

function cloneScreenHistory(items: Act1TraceScreenTransition[]): Act1TraceScreenTransition[] {
  return items.map((item) => ({ ...item }));
}

function finishNonBattleRun(
  run: RunState,
  seed: number,
  policyId: string,
  guardrailMode: BattleGuardrailMode,
  records: Act1BattleRecord[],
  nodeChoices: MapNodeType[],
  nodeHistory: Act1TraceNode[],
  screenHistory: Act1TraceScreenTransition[],
  reason: Act1NonBattleEndReason,
  assertions: string[],
): Act1RunDetail {
  const currentNode = run.map.currentNodeId ? run.map.nodes[run.map.currentNodeId] : null;
  const nextNodes = run.screen.type === 'map'
    ? availableMapNodes(run).map((node) => ({
      id: node.id,
      type: node.type,
      depth: node.depth,
    }))
    : [];
  const battle = run.battle;
  const playerUnit = battle ? battle.units[battle.playerUnitId] : null;
  const aliveEnemyCount = battle
    ? battle.enemyUnitIds.filter((unitId) => battle.units[unitId]?.alive).length
    : null;
  const enemyTotalHp = battle
    ? battle.enemyUnitIds.reduce((sum, unitId) => {
      const unit = battle.units[unitId];
      return unit?.alive ? sum + unit.hp : sum;
    }, 0)
    : null;

  return {
    seed,
    policyId,
    guardrailMode,
    records,
    nodeChoices,
    endStage: 'non_battle',
    endReason: reason,
    endTrace: {
      seed,
      policyId,
      guardrailMode,
      reason,
      screen: run.screen.type,
      actFloor: run.meta.actFloor,
      nodeId: currentNode?.id ?? null,
      nodeDepth: currentNode?.depth ?? null,
      battleTurn: battle?.turn ?? null,
      aliveEnemyCount,
      playerHp: playerUnit?.hp ?? null,
      enemyTotalHp,
      assertions,
      recentNodeHistory: cloneNodeHistory(nodeHistory),
      recentScreenTransitions: cloneScreenHistory(screenHistory),
      nextNodes,
    },
  };
}

function battleFingerprint(run: RunState): string {
  const battle = run.battle;
  if (!battle) return 'no_battle';
  const player = battle.units[battle.playerUnitId];
  const aliveEnemyCount = battle.enemyUnitIds.filter((unitId) => battle.units[unitId]?.alive).length;
  const enemyTotalHp = battle.enemyUnitIds.reduce((sum, unitId) => {
    const unit = battle.units[unitId];
    return unit?.alive ? sum + unit.hp : sum;
  }, 0);
  return [
    battle.turn,
    battle.phase,
    battle.inputMode,
    player?.hp ?? 0,
    player?.block ?? 0,
    battle.player.energy,
    battle.player.hand.length,
    battle.player.drawPile.length,
    battle.player.discardPile.length,
    aliveEnemyCount,
    enemyTotalHp,
  ].join('|');
}

function combatProgressFingerprint(run: RunState): string {
  const battle = run.battle;
  if (!battle) return 'no_battle';
  const player = battle.units[battle.playerUnitId];
  const aliveEnemyCount = battle.enemyUnitIds.filter((unitId) => battle.units[unitId]?.alive).length;
  const enemyTotalHp = battle.enemyUnitIds.reduce((sum, unitId) => {
    const unit = battle.units[unitId];
    return unit?.alive ? sum + unit.hp : sum;
  }, 0);
  return [
    player?.hp ?? 0,
    aliveEnemyCount,
    enemyTotalHp,
  ].join('|');
}

function guardrailConfig(mode: BattleGuardrailMode) {
  if (mode === 'baseline_200') {
    return {
      maxCommandsPerBattle: BASELINE_MAX_COMMANDS_PER_BATTLE,
      noProgressStateRepeatLimit: Number.POSITIVE_INFINITY,
      noProgressCombatRepeatLimit: Number.POSITIVE_INFINITY,
    };
  }
  return {
    maxCommandsPerBattle: PROGRESS_GUARD_MAX_COMMANDS_PER_BATTLE,
    noProgressStateRepeatLimit: NO_PROGRESS_STATE_REPEAT_LIMIT,
    noProgressCombatRepeatLimit: NO_PROGRESS_COMBAT_REPEAT_LIMIT,
  };
}

function simulateSingleAct1(
  seed: number,
  policy: SimulationPolicy,
  characterId: 'walker',
  guardrailMode: BattleGuardrailMode,
): Act1RunDetail {
  const engine = new GameEngine();
  let run = createMapRun(seed);
  if (run.meta.characterId !== characterId) {
    throw new Error(`unsupported character: ${run.meta.characterId}`);
  }

  const records: Act1BattleRecord[] = [];
  const nodeChoices: MapNodeType[] = [];
  const nodeHistory: Act1TraceNode[] = [];
  const screenHistory: Act1TraceScreenTransition[] = [];
  let screenTransitions = 0;
  let activeBattleId: string | null = null;
  let activeBattleTurn = 0;
  let activeBattleStartHp = 0;
  let activeBattleTier: 'normal' | 'elite' | 'boss' | null = null;
  let activeProfile: PressureProfile | null = null;
  let eliteResolved = false;
  let battleCommands = 0;
  let lastBattleFingerprint: string | null = null;
  let lastCombatFingerprint: string | null = null;
  let stagnantBattleStateSteps = 0;
  let stagnantCombatSteps = 0;
  const guardrail = guardrailConfig(guardrailMode);

  const advanceScreenCounter = () => {
    screenTransitions += 1;
    return screenTransitions <= MAX_SCREENS_PER_RUN;
  };

  const finishRun = (
    endStage: Act1RunDetail['endStage'],
  ): Act1RunDetail => ({
    seed,
    policyId: policy.id,
    guardrailMode,
    records,
    nodeChoices,
    endStage,
  });

  const finalizeBattle = (won: boolean) => {
    if (!run.battle || !activeBattleTier || !activeProfile) return false;
    const playerUnit = run.battle.units[run.battle.playerUnitId];
    const hpLoss = Math.max(0, activeBattleStartHp - (playerUnit?.hp ?? 0));
    records.push({
      tier: activeBattleTier,
      pressureProfile: activeProfile,
      won,
      turns: activeBattleTurn,
      hpLoss,
      firstElite: activeBattleTier === 'elite' && !eliteResolved,
    });
    if (activeBattleTier === 'elite' && !eliteResolved) eliteResolved = true;
    const isBoss = activeBattleTier === 'boss';
    activeBattleId = null;
    activeBattleTier = null;
    activeProfile = null;
    return isBoss;
  };

  while (screenTransitions < MAX_SCREENS_PER_RUN) {
    switch (run.screen.type) {
      case 'map': {
        if (!advanceScreenCounter()) {
          return finishNonBattleRun(
            run,
            seed,
            policy.id,
            guardrailMode,
            records,
            nodeChoices,
            nodeHistory,
            screenHistory,
            'screen_limit_map',
            ['screen 卡死'],
          );
        }
        const ctx = buildMapContext(run);
        if (ctx.nextNodes.length === 0) {
          return finishNonBattleRun(
            run,
            seed,
            policy.id,
            guardrailMode,
            records,
            nodeChoices,
            nodeHistory,
            screenHistory,
            'map_no_legal_nodes_before_boss',
            ['地图结束未打 Boss', '无可选节点但未胜负'],
          );
        }
        const nextNodeId = policy.chooseMapNode(ctx);
        const nextNode = ctx.nextNodes.find((node) => node.id === nextNodeId);
        if (!nextNode) {
          return finishNonBattleRun(
            run,
            seed,
            policy.id,
            guardrailMode,
            records,
            nodeChoices,
            nodeHistory,
            screenHistory,
            'invalid_map_choice',
            ['非法 transition'],
          );
        }
        nodeChoices.push(nextNode.type);
        pushRecent(nodeHistory, {
          id: nextNode.id,
          type: nextNode.type,
          depth: nextNode.depth,
          act: nextNode.act,
        });
        const beforeScreen = run.screen.type;
        const beforeNodeId = run.map.currentNodeId;
        run = dispatchWithGuard(engine, run, {
          type: 'CHOOSE_MAP_NODE',
          nodeId: nextNodeId,
        });
        pushRecent(screenHistory, {
          from: beforeScreen,
          to: run.screen.type,
          command: 'CHOOSE_MAP_NODE',
          actFloor: run.meta.actFloor,
          nodeId: run.map.currentNodeId ?? beforeNodeId,
          nodeDepth: run.map.currentNodeId ? (run.map.nodes[run.map.currentNodeId]?.depth ?? null) : null,
        });
        break;
      }
      case 'battle': {
        const battle = run.battle!;
        if (activeBattleId !== battle.id) {
          if (!advanceScreenCounter()) {
            return finishNonBattleRun(
              run,
              seed,
              policy.id,
              guardrailMode,
              records,
              nodeChoices,
              nodeHistory,
              screenHistory,
              'screen_limit_battle',
              ['screen 卡死'],
            );
          }
          activeBattleId = battle.id;
          activeBattleTurn = battle.turn;
          activeBattleStartHp = battle.units[battle.playerUnitId]?.hp ?? run.player.currentHp;
          activeBattleTier = battle.encounter.tier;
          activeProfile = battle.encounter.pressureProfile ?? 'frontload';
          battleCommands = 0;
          lastBattleFingerprint = battleFingerprint(run);
          lastCombatFingerprint = combatProgressFingerprint(run);
          stagnantBattleStateSteps = 0;
          stagnantCombatSteps = 0;
        }
        activeBattleTurn = battle.turn;

        if (battle.inputMode === 'animation_lock') {
          const beforeScreen = run.screen.type;
          const beforeNodeId = run.map.currentNodeId;
          run = dispatchWithGuard(engine, run, { type: 'RESOLVE_ANIMATION_DONE' });
          const nextFingerprint = battleFingerprint(run);
          const nextCombatFingerprint = combatProgressFingerprint(run);
          stagnantBattleStateSteps = nextFingerprint === lastBattleFingerprint ? stagnantBattleStateSteps + 1 : 0;
          stagnantCombatSteps = nextCombatFingerprint === lastCombatFingerprint ? stagnantCombatSteps + 1 : 0;
          lastBattleFingerprint = nextFingerprint;
          lastCombatFingerprint = nextCombatFingerprint;
          pushRecent(screenHistory, {
            from: beforeScreen,
            to: run.screen.type,
            command: 'RESOLVE_ANIMATION_DONE',
            actFloor: run.meta.actFloor,
            nodeId: run.map.currentNodeId ?? beforeNodeId,
            nodeDepth: run.map.currentNodeId ? (run.map.nodes[run.map.currentNodeId]?.depth ?? null) : null,
          });
          break;
        }

        if (battle.phase === 'victory') {
          if (finalizeBattle(true)) return finishRun('survived');
          const beforeScreen = run.screen.type;
          const beforeNodeId = run.map.currentNodeId;
          run = dispatchWithGuard(engine, run, { type: 'LEAVE_BATTLE_TO_REWARD' });
          pushRecent(screenHistory, {
            from: beforeScreen,
            to: run.screen.type,
            command: 'LEAVE_BATTLE_TO_REWARD',
            actFloor: run.meta.actFloor,
            nodeId: run.map.currentNodeId ?? beforeNodeId,
            nodeDepth: run.map.currentNodeId ? (run.map.nodes[run.map.currentNodeId]?.depth ?? null) : null,
          });
          break;
        }

        if (battle.phase === 'player_action') {
          if (battleCommands >= guardrail.maxCommandsPerBattle) {
            return finishNonBattleRun(
              run,
              seed,
              policy.id,
              guardrailMode,
              records,
              nodeChoices,
              nodeHistory,
              screenHistory,
              'battle_command_limit',
              ['长战保险丝触发'],
            );
          }
          battleCommands += 1;
          const command = policy.chooseBattleCommand(
            buildBattleContext(run, stagnantBattleStateSteps, stagnantCombatSteps),
          );
          const beforeScreen = run.screen.type;
          const beforeNodeId = run.map.currentNodeId;
          run = dispatchWithGuard(engine, run, command);
          const nextFingerprint = battleFingerprint(run);
          const nextCombatFingerprint = combatProgressFingerprint(run);
          stagnantBattleStateSteps = nextFingerprint === lastBattleFingerprint ? stagnantBattleStateSteps + 1 : 0;
          stagnantCombatSteps = nextCombatFingerprint === lastCombatFingerprint ? stagnantCombatSteps + 1 : 0;
          lastBattleFingerprint = nextFingerprint;
          lastCombatFingerprint = nextCombatFingerprint;
          if (
            stagnantBattleStateSteps >= guardrail.noProgressStateRepeatLimit
            || stagnantCombatSteps >= guardrail.noProgressCombatRepeatLimit
          ) {
            return finishNonBattleRun(
              run,
              seed,
              policy.id,
              guardrailMode,
              records,
              nodeChoices,
              nodeHistory,
              screenHistory,
              'battle_no_progress',
              [
                stagnantBattleStateSteps >= guardrail.noProgressStateRepeatLimit
                  ? 'battle 状态无变化'
                  : 'battle 长时间无有效进展',
                'screen 卡死',
              ],
            );
          }
          pushRecent(screenHistory, {
            from: beforeScreen,
            to: run.screen.type,
            command: command.type,
            actFloor: run.meta.actFloor,
            nodeId: run.map.currentNodeId ?? beforeNodeId,
            nodeDepth: run.map.currentNodeId ? (run.map.nodes[run.map.currentNodeId]?.depth ?? null) : null,
          });
          break;
        }

        throw new Error(`unexpected battle state: phase=${battle.phase} input=${battle.inputMode}`);
      }
      case 'reward': {
        if (!advanceScreenCounter()) {
          return finishNonBattleRun(
            run,
            seed,
            policy.id,
            guardrailMode,
            records,
            nodeChoices,
            nodeHistory,
            screenHistory,
            'screen_limit_reward',
            ['screen 卡死'],
          );
        }
        const rewardChoice = policy.chooseReward(buildRewardContext(run));
        const command = rewardChoice.type === 'card'
          ? { type: 'SELECT_REWARD_CARD', definitionId: rewardChoice.definitionId } as const
          : { type: 'TAKE_REWARD_GOLD', amount: skipCardGoldAmount(rewardEncounterTierFromRun(run)) } as const;
        const beforeScreen = run.screen.type;
        const beforeNodeId = run.map.currentNodeId;
        run = dispatchWithGuard(engine, run, command);
        pushRecent(screenHistory, {
          from: beforeScreen,
          to: run.screen.type,
          command: command.type,
          actFloor: run.meta.actFloor,
          nodeId: run.map.currentNodeId ?? beforeNodeId,
          nodeDepth: run.map.currentNodeId ? (run.map.nodes[run.map.currentNodeId]?.depth ?? null) : null,
        });
        break;
      }
      case 'shop': {
        if (!advanceScreenCounter()) {
          return finishNonBattleRun(
            run,
            seed,
            policy.id,
            guardrailMode,
            records,
            nodeChoices,
            nodeHistory,
            screenHistory,
            'screen_limit_shop',
            ['screen 卡死'],
          );
        }
        const action = policy.chooseShopAction(buildShopContext(run));
        const command = action.type === 'leave_shop'
          ? { type: 'LEAVE_SHOP_TO_MAP' } as const
          : action;
        const beforeScreen = run.screen.type;
        const beforeNodeId = run.map.currentNodeId;
        run = dispatchWithGuard(engine, run, command);
        pushRecent(screenHistory, {
          from: beforeScreen,
          to: run.screen.type,
          command: command.type,
          actFloor: run.meta.actFloor,
          nodeId: run.map.currentNodeId ?? beforeNodeId,
          nodeDepth: run.map.currentNodeId ? (run.map.nodes[run.map.currentNodeId]?.depth ?? null) : null,
        });
        break;
      }
      case 'event': {
        if (!advanceScreenCounter()) {
          return finishNonBattleRun(
            run,
            seed,
            policy.id,
            guardrailMode,
            records,
            nodeChoices,
            nodeHistory,
            screenHistory,
            'screen_limit_event',
            ['screen 卡死'],
          );
        }
        const beforeScreen = run.screen.type;
        const beforeNodeId = run.map.currentNodeId;
        run = dispatchWithGuard(engine, run, {
          type: 'RESOLVE_EVENT_OPTION',
          optionId: policy.chooseEventOption(buildEventContext(run)),
        });
        pushRecent(screenHistory, {
          from: beforeScreen,
          to: run.screen.type,
          command: 'RESOLVE_EVENT_OPTION',
          actFloor: run.meta.actFloor,
          nodeId: run.map.currentNodeId ?? beforeNodeId,
          nodeDepth: run.map.currentNodeId ? (run.map.nodes[run.map.currentNodeId]?.depth ?? null) : null,
        });
        break;
      }
      case 'rest':
        if (!advanceScreenCounter()) {
          return finishNonBattleRun(
            run,
            seed,
            policy.id,
            guardrailMode,
            records,
            nodeChoices,
            nodeHistory,
            screenHistory,
            'screen_limit_rest',
            ['screen 卡死'],
          );
        }
        {
          const beforeScreen = run.screen.type;
          const beforeNodeId = run.map.currentNodeId;
          run = dispatchWithGuard(engine, run, { type: 'LEAVE_REST_TO_MAP' });
          pushRecent(screenHistory, {
            from: beforeScreen,
            to: run.screen.type,
            command: 'LEAVE_REST_TO_MAP',
            actFloor: run.meta.actFloor,
            nodeId: run.map.currentNodeId ?? beforeNodeId,
            nodeDepth: run.map.currentNodeId ? (run.map.nodes[run.map.currentNodeId]?.depth ?? null) : null,
          });
        }
        break;
      case 'victory':
        return finishRun('survived');
      case 'game_over':
        {
          const defeatTier = activeBattleTier;
          if (activeBattleId) finalizeBattle(false);
          return finishRun(defeatTier ?? 'non_battle');
        }
      default:
        throw new Error(`unsupported screen: ${run.screen.type}`);
    }
  }

  return finishNonBattleRun(
    run,
    seed,
    policy.id,
    guardrailMode,
    records,
    nodeChoices,
    nodeHistory,
    screenHistory,
    'screen_limit_map',
    ['screen 卡死'],
  );
}

function summarizeStage(records: Act1BattleRecord[]): Act1StageMetric {
  const attempts = records.length;
  const wins = records.filter((record) => record.won).length;
  const totalTurns = records.reduce((sum, record) => sum + record.turns, 0);
  const totalHpLoss = records.reduce((sum, record) => sum + record.hpLoss, 0);
  return {
    attempts,
    wins,
    winRate: attempts > 0 ? wins / attempts : 0,
    avgTurns: attempts > 0 ? totalTurns / attempts : 0,
    avgHpLoss: attempts > 0 ? totalHpLoss / attempts : 0,
  };
}

function summarizePressure(records: Act1BattleRecord[]): Act1PressureMetric[] {
  const profiles: PressureProfile[] = ['frontload', 'attrition', 'snowball', 'disruption', 'execution_check'];
  return profiles.map((profile) => {
    const fights = records.filter((record) => record.pressureProfile === profile);
    const summary = summarizeStage(fights);
    return {
      profile,
      fights: summary.attempts,
      wins: summary.wins,
      winRate: summary.winRate,
      avgTurns: summary.avgTurns,
      avgHpLoss: summary.avgHpLoss,
    };
  }).filter((entry) => entry.fights > 0);
}

function summarizeNodeChoices(details: Act1RunDetail[]): Act1NodeChoiceMetric[] {
  const types: MapNodeType[] = ['battle', 'elite', 'event', 'shop', 'rest', 'treasure', 'boss'];
  const totalChoices = details.reduce((sum, detail) => sum + detail.nodeChoices.length, 0);
  return types.map((type) => {
    const count = details.reduce(
      (sum, detail) => sum + detail.nodeChoices.filter((nodeType) => nodeType === type).length,
      0,
    );
    return {
      type,
      count,
      rate: totalChoices > 0 ? count / totalChoices : 0,
    };
  }).filter((entry) => entry.count > 0);
}

function summarizeDeathStages(details: Act1RunDetail[]): Act1DeathStageMetric[] {
  const stages: Act1DeathStage[] = ['survived', 'normal', 'elite', 'boss', 'non_battle'];
  return stages.map((stage) => {
    const count = details.filter((detail) => detail.endStage === stage).length;
    return {
      stage,
      count,
      rate: details.length > 0 ? count / details.length : 0,
    };
  }).filter((entry) => entry.count > 0);
}

function averageBeforeBoss(
  details: Act1RunDetail[],
  tier: 'normal' | 'elite',
): number {
  const runsThatReachedBoss = details.filter((detail) =>
    detail.records.some((record) => record.tier === 'boss'),
  );
  if (runsThatReachedBoss.length === 0) return 0;
  const total = runsThatReachedBoss.reduce((sum, detail) => {
    const bossIndex = detail.records.findIndex((record) => record.tier === 'boss');
    const beforeBoss = bossIndex >= 0 ? detail.records.slice(0, bossIndex) : detail.records;
    return sum + beforeBoss.filter((record) => record.tier === tier).length;
  }, 0);
  return total / runsThatReachedBoss.length;
}

function summarizeNonBattle(details: Act1RunDetail[]): Act1NonBattleReasonMetric[] {
  const traces = details
    .map((detail) => detail.endTrace)
    .filter((trace): trace is Act1NonBattleTrace => Boolean(trace));
  const reasons = new Map<Act1NonBattleEndReason, number[]>();
  for (const trace of traces) {
    const entries = reasons.get(trace.reason) ?? [];
    entries.push(trace.seed);
    reasons.set(trace.reason, entries);
  }
  return [...reasons.entries()]
    .map(([reason, seeds]) => ({
      reason,
      count: seeds.length,
      rate: details.length > 0 ? seeds.length / details.length : 0,
      exampleSeeds: seeds.slice(0, 3),
    }))
    .sort((a, b) => b.count - a.count);
}

export function runAct1Validation(input: Act1ValidationInput): Act1ValidationSummary {
  const {
    seed,
    runs,
    policy,
    characterId = 'walker',
    guardrailMode = 'progress_guard',
  } = input;
  if (runs <= 0) throw new Error('runs must be positive');

  const details: Act1RunDetail[] = [];
  const allRecords: Act1BattleRecord[] = [];
  for (let index = 0; index < runs; index += 1) {
    const detail = simulateSingleAct1((seed + index) >>> 0, policy, characterId, guardrailMode);
    details.push(detail);
    allRecords.push(...detail.records);
  }

  const normalRecords = allRecords.filter((record) => record.tier === 'normal');
  const eliteRecords = allRecords.filter((record) => record.tier === 'elite');
  const firstEliteRecords = allRecords.filter((record) => record.firstElite);
  const bossRecords = allRecords.filter((record) => record.tier === 'boss');
  const overall = summarizeStage(allRecords);
  const anyEliteRuns = details.filter((detail) =>
    detail.records.some((record) => record.tier === 'elite'),
  ).length;

  return {
    policyId: policy.id,
    guardrailMode,
    totalRuns: runs,
    normal: summarizeStage(normalRecords),
    elite: summarizeStage(eliteRecords),
    firstElite: summarizeStage(firstEliteRecords),
    boss: summarizeStage(bossRecords),
    anyEliteRuns,
    anyEliteRate: runs > 0 ? anyEliteRuns / runs : 0,
    avgEliteFightsPerRun: runs > 0 ? eliteRecords.length / runs : 0,
    avgNormalBeforeBoss: averageBeforeBoss(details, 'normal'),
    avgEliteBeforeBoss: averageBeforeBoss(details, 'elite'),
    avgTurns: overall.avgTurns,
    avgHpLoss: overall.avgHpLoss,
    pressureProfileBreakdown: summarizePressure(allRecords),
    nodeChoiceBreakdown: summarizeNodeChoices(details),
    deathStageBreakdown: summarizeDeathStages(details),
    nonBattleBreakdown: summarizeNonBattle(details),
    nonBattleTraces: details
      .map((detail) => detail.endTrace)
      .filter((trace): trace is Act1NonBattleTrace => Boolean(trace)),
  };
}

export function runAct1ValidationSuite(input: Act1ValidationSuiteInput): Act1ValidationSummary[] {
  const {
    seed,
    runsPerPolicy,
    policies = [...walkerBasePolicies],
    characterId = 'walker',
    guardrailMode = 'progress_guard',
  } = input;

  return policies.map((policy, index) =>
    runAct1Validation({
      seed: (seed + index * 1000) >>> 0,
      runs: runsPerPolicy,
      policy,
      characterId,
      guardrailMode,
    }),
  );
}

function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

function formatFloat(value: number): string {
  return value.toFixed(2);
}

export function formatAct1ValidationTable(summaries: Act1ValidationSummary[]): string {
  const header = [
    'Bot',
    'normalAttempts',
    'normalWin',
    'firstEliteAttempts',
    'firstEliteWin',
    'bossAttempts',
    'bossWin',
    'avgTurns',
    'avgHpLoss',
  ].join('\t');
  const rows = summaries.map((summary) =>
    [
      summary.policyId,
      summary.normal.attempts,
      formatRate(summary.normal.winRate),
      summary.firstElite.attempts,
      formatRate(summary.firstElite.winRate),
      summary.boss.attempts,
      formatRate(summary.boss.winRate),
      formatFloat(summary.avgTurns),
      formatFloat(summary.avgHpLoss),
    ].join('\t'),
  );
  return [header, ...rows].join('\n');
}
