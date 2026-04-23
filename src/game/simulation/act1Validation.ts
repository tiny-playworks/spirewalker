import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { WANDERING_MERCHANT_EVENT_ID } from '@/game/core/engine/generateBranchingFloor';
import { skipCardGoldAmount } from '@/game/core/engine/postBattleExtras';
import { rewardEncounterTierFromRun } from '@/game/core/engine/rewardEncounter';
import { createMapRun } from '@/game/core/engine/createMapRun';
import type { PressureProfile } from '@/game/core/definitions/encounters';
import type { GameCommand } from '@/game/core/commands/types';
import { isLegalMapStep } from '@/game/core/model/mapGraph';
import type { RunState } from '@/game/core/model/run';
import type {
  Act1PressureMetric,
  Act1StageMetric,
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
  walkerBurstPolicy,
  walkerGuardPolicy,
  walkerMixedPolicy,
} from './policies/walkerPersonas';

const MAX_COMMANDS_PER_BATTLE = 200;
const MAX_SCREENS_PER_RUN = 500;

type Act1ValidationInput = {
  seed: number;
  runs: number;
  policy: SimulationPolicy;
  characterId?: 'walker';
};

type Act1ValidationSuiteInput = {
  seed: number;
  runsPerPolicy: number;
  policies?: SimulationPolicy[];
  characterId?: 'walker';
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
  records: Act1BattleRecord[];
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

function simulateSingleAct1(seed: number, policy: SimulationPolicy, characterId: 'walker'): Act1RunDetail {
  const engine = new GameEngine();
  let run = createMapRun(seed);
  if (run.meta.characterId !== characterId) {
    throw new Error(`unsupported character: ${run.meta.characterId}`);
  }

  const records: Act1BattleRecord[] = [];
  let screenTransitions = 0;
  let activeBattleId: string | null = null;
  let activeBattleTurn = 0;
  let activeBattleStartHp = 0;
  let activeBattleTier: 'normal' | 'elite' | 'boss' | null = null;
  let activeProfile: PressureProfile | null = null;
  let eliteResolved = false;
  let battleCommands = 0;

  const advanceScreenCounter = () => {
    screenTransitions += 1;
    return screenTransitions <= MAX_SCREENS_PER_RUN;
  };

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
        if (!advanceScreenCounter()) return { records };
        const ctx = buildMapContext(run);
        if (ctx.nextNodes.length === 0) return { records };
        run = dispatchWithGuard(engine, run, {
          type: 'CHOOSE_MAP_NODE',
          nodeId: policy.chooseMapNode(ctx),
        });
        break;
      }
      case 'battle': {
        const battle = run.battle!;
        if (activeBattleId !== battle.id) {
          if (!advanceScreenCounter()) return { records };
          activeBattleId = battle.id;
          activeBattleTurn = battle.turn;
          activeBattleStartHp = battle.units[battle.playerUnitId]?.hp ?? run.player.currentHp;
          activeBattleTier = battle.encounter.tier;
          activeProfile = battle.encounter.pressureProfile ?? 'frontload';
          battleCommands = 0;
        }
        activeBattleTurn = battle.turn;

        if (battle.inputMode === 'animation_lock') {
          run = dispatchWithGuard(engine, run, { type: 'RESOLVE_ANIMATION_DONE' });
          break;
        }

        if (battle.phase === 'victory') {
          if (finalizeBattle(true)) return { records };
          run = dispatchWithGuard(engine, run, { type: 'LEAVE_BATTLE_TO_REWARD' });
          break;
        }

        if (battle.phase === 'player_action') {
          if (battleCommands >= MAX_COMMANDS_PER_BATTLE) return { records };
          battleCommands += 1;
          run = dispatchWithGuard(engine, run, policy.chooseBattleCommand(buildBattleContext(run)));
          break;
        }

        throw new Error(`unexpected battle state: phase=${battle.phase} input=${battle.inputMode}`);
      }
      case 'reward': {
        if (!advanceScreenCounter()) return { records };
        const rewardChoice = policy.chooseReward(buildRewardContext(run));
        run = rewardChoice.type === 'card'
          ? dispatchWithGuard(engine, run, { type: 'SELECT_REWARD_CARD', definitionId: rewardChoice.definitionId })
          : dispatchWithGuard(engine, run, { type: 'TAKE_REWARD_GOLD', amount: skipCardGoldAmount(rewardEncounterTierFromRun(run)) });
        break;
      }
      case 'shop': {
        if (!advanceScreenCounter()) return { records };
        const action = policy.chooseShopAction(buildShopContext(run));
        run = action.type === 'leave_shop'
          ? dispatchWithGuard(engine, run, { type: 'LEAVE_SHOP_TO_MAP' })
          : dispatchWithGuard(engine, run, action);
        break;
      }
      case 'event': {
        if (!advanceScreenCounter()) return { records };
        run = dispatchWithGuard(engine, run, {
          type: 'RESOLVE_EVENT_OPTION',
          optionId: policy.chooseEventOption(buildEventContext(run)),
        });
        break;
      }
      case 'rest':
        if (!advanceScreenCounter()) return { records };
        run = dispatchWithGuard(engine, run, { type: 'LEAVE_REST_TO_MAP' });
        break;
      case 'victory':
        return { records };
      case 'game_over':
        if (activeBattleId) finalizeBattle(false);
        return { records };
      default:
        throw new Error(`unsupported screen: ${run.screen.type}`);
    }
  }

  return { records };
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

export function runAct1Validation(input: Act1ValidationInput): Act1ValidationSummary {
  const { seed, runs, policy, characterId = 'walker' } = input;
  if (runs <= 0) throw new Error('runs must be positive');

  const allRecords: Act1BattleRecord[] = [];
  for (let index = 0; index < runs; index += 1) {
    const detail = simulateSingleAct1((seed + index) >>> 0, policy, characterId);
    allRecords.push(...detail.records);
  }

  const normalRecords = allRecords.filter((record) => record.tier === 'normal');
  const firstEliteRecords = allRecords.filter((record) => record.firstElite);
  const bossRecords = allRecords.filter((record) => record.tier === 'boss');
  const overall = summarizeStage(allRecords);

  return {
    policyId: policy.id,
    totalRuns: runs,
    normal: summarizeStage(normalRecords),
    firstElite: summarizeStage(firstEliteRecords),
    boss: summarizeStage(bossRecords),
    avgTurns: overall.avgTurns,
    avgHpLoss: overall.avgHpLoss,
    pressureProfileBreakdown: summarizePressure(allRecords),
  };
}

export function runAct1ValidationSuite(input: Act1ValidationSuiteInput): Act1ValidationSummary[] {
  const {
    seed,
    runsPerPolicy,
    policies = [walkerGuardPolicy, walkerBurstPolicy, walkerMixedPolicy],
    characterId = 'walker',
  } = input;

  return policies.map((policy, index) =>
    runAct1Validation({
      seed: (seed + index * 1000) >>> 0,
      runs: runsPerPolicy,
      policy,
      characterId,
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
  const header = ['Bot', 'normalWin', 'eliteWin', 'bossWin', 'avgTurns', 'avgHpLoss'].join('\t');
  const rows = summaries.map((summary) =>
    [
      summary.policyId,
      formatRate(summary.normal.winRate),
      formatRate(summary.firstElite.winRate),
      formatRate(summary.boss.winRate),
      formatFloat(summary.avgTurns),
      formatFloat(summary.avgHpLoss),
    ].join('\t'),
  );
  return [header, ...rows].join('\n');
}
