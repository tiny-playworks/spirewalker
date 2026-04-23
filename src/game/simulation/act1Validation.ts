import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import {
  DEFENSE_LINE_CARD_IDS,
  MOMENTUM_PAYOFF_CARD_IDS,
  MOMENTUM_SETUP_CARD_IDS,
  TEMPO_RECOVERY_CARD_IDS,
} from '@/game/core/definitions/cards/starter';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { WANDERING_MERCHANT_EVENT_ID } from '@/game/core/engine/generateBranchingFloor';
import { skipCardGoldAmount } from '@/game/core/engine/postBattleExtras';
import { rewardEncounterTierFromRun } from '@/game/core/engine/rewardEncounter';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { getEncounterById } from '@/game/core/definitions/encounters';
import type { PressureProfile } from '@/game/core/definitions/encounters';
import type { GameCommand } from '@/game/core/commands/types';
import { isLegalMapStep } from '@/game/core/model/mapGraph';
import type { MapNodeType } from '@/game/core/model/map';
import type { RunState } from '@/game/core/model/run';
import type {
  Act1DeathStage,
  Act1DeathStageMetric,
  Act1BattleTimelineEntry,
  BattleGuardrailMode,
  Act1NonBattleEndReason,
  Act1NonBattleReasonMetric,
  Act1NonBattleTrace,
  Act1NodeChoiceMetric,
  Act1PressureMetric,
  Act1StageMetric,
  Act1SummaryInvariantMetric,
  Act1SummaryInvariantTrace,
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
const ACT1_FIRST_ELITE_MONSTER_IDS = ['act1_executioner', 'act1_twin_hunter', 'act1_debt_monk'] as const;

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
  battleIndex: number;
  encounterId: string;
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
  battleTimeline: Act1BattleTimelineEntry[];
  firstEliteEncounterId: string | null;
  firstEliteBattleIndex: number | null;
  deathEncounterTier: 'normal' | 'elite' | 'boss' | null;
  deathEncounterId: string | null;
  endStage: Act1DeathStage;
  endReason?: Act1NonBattleEndReason;
  endTrace?: Act1NonBattleTrace;
  summaryInvariantTrace?: Act1SummaryInvariantTrace;
  firstEliteDeckSnapshot?: FirstEliteDeckSnapshot;
  firstEliteFailureTrace?: FirstEliteFailureTrace;
  firstEliteExecutionerFailureTrace?: FirstEliteExecutionerFailureTrace;
};

type FirstEliteDeckSnapshot = {
  deckSize: number;
  setupCount: number;
  payoffCount: number;
  bridgeCount: number;
  defenseCoreCount: number;
  momentumRelatedCount: number;
};

type FirstEliteTurnTrace = {
  turn: number;
  hpBeforeTurn: number;
  blockBeforeTurn: number;
  hpAfterActions: number;
  blockAfterActions: number;
  counterTriggeredByPlayerAction: boolean;
  heavyExecutedOnEnemyTurn: boolean;
};

type FirstEliteFailureTrace = {
  deathTurn: number;
  heavyInLastThreeTurns: boolean;
  counterTriggeredInLastThreeTurns: boolean;
  recentTurns: FirstEliteTurnTrace[];
};

type FirstEliteExecutionerFailureTrace = {
  deathTurn: number;
  enemyHpAtDeath: number;
  enemyEffectiveHpAtDeath: number;
  playerHpAtDeath: number;
  playerBlockAtDeath: number;
};

type FirstEliteExecutionerSnapshot = {
  enemyHp: number;
  enemyEffectiveHp: number;
  playerHp: number;
  playerBlock: number;
};

export type Act1GuardFirstEliteDiagnosis = {
  policyId: string;
  totalRuns: number;
  firstEliteAttempts: number;
  firstEliteFailures: number;
  arrivalDeckAverages: {
    deckSize: number;
    setupCount: number;
    payoffCount: number;
    bridgeCount: number;
    defenseCoreCount: number;
    momentumRelatedCount: number;
  };
  failureLastTurns: {
    heavySeenRate: number;
    counterTriggeredRate: number;
    avgDeathTurn: number;
  };
  executionerFailures: {
    count: number;
    avgDeathTurn: number;
    avgEnemyHpAtDeath: number;
    avgEnemyEffectiveHpAtDeath: number;
    avgPlayerHpAtDeath: number;
    avgPlayerBlockAtDeath: number;
  };
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
  battleTimeline: Act1BattleTimelineEntry[],
  firstEliteEncounterId: string | null,
  firstEliteBattleIndex: number | null,
  deathEncounterTier: 'normal' | 'elite' | 'boss' | null,
  deathEncounterId: string | null,
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
  const enemyTotalEffectiveHp = battle
    ? battle.enemyUnitIds.reduce((sum, unitId) => {
      const unit = battle.units[unitId];
      return unit?.alive ? sum + unit.hp + unit.block : sum;
    }, 0)
    : null;

  return finalizeRunDetail({
    seed,
    policyId,
    guardrailMode,
    records,
    nodeChoices,
    battleTimeline,
    firstEliteEncounterId,
    firstEliteBattleIndex,
    deathEncounterTier,
    deathEncounterId,
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
      enemyTotalEffectiveHp,
      assertions,
      recentNodeHistory: cloneNodeHistory(nodeHistory),
      recentScreenTransitions: cloneScreenHistory(screenHistory),
      nextNodes,
    },
  });
}

function buildSummaryInvariantTrace(detail: Act1RunDetail): Act1SummaryInvariantTrace | undefined {
  const assertions: string[] = [];
  const eliteTimeline = detail.battleTimeline.filter((entry) => entry.tier === 'elite');
  const anyEliteRun = eliteTimeline.length > 0;
  const firstEliteRecord = detail.records.find((record) => record.firstElite);
  const firstEliteTimeline = eliteTimeline[0] ?? null;

  if (detail.endStage === 'elite' && !anyEliteRun) {
    assertions.push('endStage=elite 但该 run 没有 elite timeline');
  }
  if (detail.firstEliteBattleIndex !== null && !anyEliteRun) {
    assertions.push('存在 firstElite，但 anyEliteRun 为 false');
  }
  if (firstEliteRecord && !anyEliteRun) {
    assertions.push('存在 firstElite record，但 anyEliteRun 为 false');
  }
  if (detail.firstEliteBattleIndex !== null && firstEliteTimeline && detail.firstEliteBattleIndex !== firstEliteTimeline.battleIndex) {
    assertions.push('firstEliteBattleIndex 不是首个 elite battle');
  }
  if (detail.firstEliteEncounterId !== null && firstEliteTimeline && detail.firstEliteEncounterId !== firstEliteTimeline.encounterId) {
    assertions.push('firstEliteEncounterId 与首个 elite battle 不一致');
  }
  if (firstEliteTimeline && !firstEliteRecord) {
    assertions.push('首个 elite battle 已发生，但没有 firstElite record');
  }
  if (detail.deathEncounterTier === 'elite' && !detail.records.some((record) => record.tier === 'elite' && !record.won)) {
    assertions.push('死于 elite，但没有对应失败 elite battle record');
  }
  if (detail.deathEncounterTier === 'boss' && !detail.records.some((record) => record.tier === 'boss' && !record.won)) {
    assertions.push('死于 boss，但没有对应失败 boss battle record');
  }

  if (assertions.length === 0) return undefined;
  return {
    seed: detail.seed,
    policyId: detail.policyId,
    guardrailMode: detail.guardrailMode,
    reason: 'summary_invariant_failed',
    assertions,
    encounterTiersVisited: detail.battleTimeline.map((entry) => entry.tier),
    firstEliteEncounterId: detail.firstEliteEncounterId,
    firstEliteBattleIndex: detail.firstEliteBattleIndex,
    deathEncounterTier: detail.deathEncounterTier,
    deathEncounterId: detail.deathEncounterId,
    battleTimeline: detail.battleTimeline.map((entry) => ({ ...entry })),
  };
}

function finalizeRunDetail(detail: Act1RunDetail): Act1RunDetail {
  return {
    ...detail,
    summaryInvariantTrace: buildSummaryInvariantTrace(detail),
  };
}

function countCardsByIds(deck: string[], ids: readonly string[]): number {
  const set = new Set(ids);
  return deck.reduce((sum, cardId) => sum + (set.has(cardId) ? 1 : 0), 0);
}

function createFirstEliteDeckSnapshot(deck: string[]): FirstEliteDeckSnapshot {
  const setupCount = countCardsByIds(deck, MOMENTUM_SETUP_CARD_IDS);
  const payoffCount = countCardsByIds(deck, MOMENTUM_PAYOFF_CARD_IDS);
  const bridgeCount = countCardsByIds(deck, TEMPO_RECOVERY_CARD_IDS);
  const defenseCoreCount = countCardsByIds(deck, DEFENSE_LINE_CARD_IDS);
  const momentumRelatedSet = new Set<string>([
    ...MOMENTUM_SETUP_CARD_IDS,
    ...MOMENTUM_PAYOFF_CARD_IDS,
  ]);
  const momentumRelatedCount = deck.reduce((sum, cardId) => sum + (momentumRelatedSet.has(cardId) ? 1 : 0), 0);
  return {
    deckSize: deck.length,
    setupCount,
    payoffCount,
    bridgeCount,
    defenseCoreCount,
    momentumRelatedCount,
  };
}

function captureExecutionerSnapshot(run: RunState): FirstEliteExecutionerSnapshot | undefined {
  const battle = run.battle;
  if (!battle || battle.encounter.id !== 'act1_elite_heavy') return undefined;
  const enemyUnitId = battle.enemyUnitIds[0];
  if (!enemyUnitId) return undefined;
  const enemy = battle.units[enemyUnitId];
  const player = battle.units[battle.playerUnitId];
  if (!enemy || !player) return undefined;
  return {
    enemyHp: enemy.hp,
    enemyEffectiveHp: enemy.hp + enemy.block,
    playerHp: player.hp,
    playerBlock: player.block,
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
  const enemyTotalEffectiveHp = battle.enemyUnitIds.reduce((sum, unitId) => {
    const unit = battle.units[unitId];
    return unit?.alive ? sum + unit.hp + unit.block : sum;
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
    enemyTotalEffectiveHp,
  ].join('|');
}

function combatProgressFingerprint(run: RunState): string {
  const battle = run.battle;
  if (!battle) return 'no_battle';
  const player = battle.units[battle.playerUnitId];
  const aliveEnemyCount = battle.enemyUnitIds.filter((unitId) => battle.units[unitId]?.alive).length;
  const enemyTotalEffectiveHp = battle.enemyUnitIds.reduce((sum, unitId) => {
    const unit = battle.units[unitId];
    return unit?.alive ? sum + unit.hp + unit.block : sum;
  }, 0);
  return [
    player?.hp ?? 0,
    aliveEnemyCount,
    enemyTotalEffectiveHp,
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
  let activeBattleEncounterId: string | null = null;
  let activeBattleIndex = 0;
  let activeBattleTurn = 0;
  let activeBattleStartHp = 0;
  let activeBattleTier: 'normal' | 'elite' | 'boss' | null = null;
  let activeProfile: PressureProfile | null = null;
  let battleIndexSeq = 0;
  let eliteResolved = false;
  let battleCommands = 0;
  let lastBattleFingerprint: string | null = null;
  let lastCombatFingerprint: string | null = null;
  let stagnantBattleStateSteps = 0;
  let stagnantCombatSteps = 0;
  let stagnantPlayableSteps = 0;
  const battleTimeline: Act1BattleTimelineEntry[] = [];
  let firstEliteEncounterId: string | null = null;
  let firstEliteBattleIndex: number | null = null;
  let firstEliteDeckSnapshot: FirstEliteDeckSnapshot | undefined;
  let firstEliteFailureTrace: FirstEliteFailureTrace | undefined;
  let firstEliteExecutionerFailureTrace: FirstEliteExecutionerFailureTrace | undefined;
  let firstEliteExecutionerLastSnapshot: FirstEliteExecutionerSnapshot | undefined;
  let deathEncounterTier: 'normal' | 'elite' | 'boss' | null = null;
  let deathEncounterId: string | null = null;
  let firstEliteTurnTraces: FirstEliteTurnTrace[] = [];
  let firstEliteCurrentTurn = 0;
  let firstEliteHpBeforeTurn = 0;
  let firstEliteBlockBeforeTurn = 0;
  let firstEliteCounterTriggeredByPlayerAction = false;
  let firstEliteHeavyExecutedOnEnemyTurn = false;
  const guardrail = guardrailConfig(guardrailMode);

  const advanceScreenCounter = () => {
    screenTransitions += 1;
    return screenTransitions <= MAX_SCREENS_PER_RUN;
  };

  const finishRun = (
    endStage: Act1RunDetail['endStage'],
  ): Act1RunDetail => finalizeRunDetail({
    seed,
    policyId: policy.id,
    guardrailMode,
    records,
    nodeChoices,
    battleTimeline,
    firstEliteEncounterId,
    firstEliteBattleIndex,
    firstEliteDeckSnapshot,
    firstEliteFailureTrace,
    firstEliteExecutionerFailureTrace,
    deathEncounterTier,
    deathEncounterId,
    endStage,
  });

  const finalizeBattle = (won: boolean) => {
    if (!activeBattleEncounterId || !activeBattleTier || !activeProfile) return false;
    const hpLoss = Math.max(0, activeBattleStartHp - run.player.currentHp);
    const record: Act1BattleRecord = {
      battleIndex: activeBattleIndex,
      encounterId: activeBattleEncounterId,
      tier: activeBattleTier,
      pressureProfile: activeProfile,
      won,
      turns: activeBattleTurn,
      hpLoss,
      firstElite: activeBattleTier === 'elite' && !eliteResolved,
    };
    if (record.firstElite && !record.won) {
      const recentTurns = firstEliteTurnTraces.slice(-3);
      firstEliteFailureTrace = {
        deathTurn: activeBattleTurn,
        heavyInLastThreeTurns: recentTurns.some((item) => item.heavyExecutedOnEnemyTurn),
        counterTriggeredInLastThreeTurns: recentTurns.some((item) => item.counterTriggeredByPlayerAction),
        recentTurns,
      };
      if (activeBattleEncounterId === 'act1_elite_heavy') {
        const snapshot = firstEliteExecutionerLastSnapshot ?? captureExecutionerSnapshot(run);
        firstEliteExecutionerFailureTrace = {
          deathTurn: activeBattleTurn,
          enemyHpAtDeath: snapshot?.enemyHp ?? 0,
          enemyEffectiveHpAtDeath: snapshot?.enemyEffectiveHp ?? 0,
          playerHpAtDeath: snapshot?.playerHp ?? 0,
          playerBlockAtDeath: snapshot?.playerBlock ?? 0,
        };
      }
    }
    records.push(record);
    if (activeBattleTier === 'elite' && !eliteResolved) eliteResolved = true;
    const timelineEntry = battleTimeline.find((entry) => entry.battleIndex === activeBattleIndex);
    if (timelineEntry) timelineEntry.won = won;
    const isBoss = activeBattleTier === 'boss';
    activeBattleId = null;
    activeBattleEncounterId = null;
    activeBattleTier = null;
    activeProfile = null;
    firstEliteTurnTraces = [];
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
            battleTimeline,
            firstEliteEncounterId,
            firstEliteBattleIndex,
            deathEncounterTier,
            deathEncounterId,
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
            battleTimeline,
            firstEliteEncounterId,
            firstEliteBattleIndex,
            deathEncounterTier,
            deathEncounterId,
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
            battleTimeline,
            firstEliteEncounterId,
            firstEliteBattleIndex,
            deathEncounterTier,
            deathEncounterId,
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
              battleTimeline,
              firstEliteEncounterId,
              firstEliteBattleIndex,
              deathEncounterTier,
              deathEncounterId,
              nodeHistory,
              screenHistory,
              'screen_limit_battle',
              ['screen 卡死'],
            );
          }
          activeBattleId = battle.id;
          activeBattleEncounterId = battle.encounter.id;
          activeBattleIndex = battleIndexSeq;
          battleIndexSeq += 1;
          activeBattleTurn = battle.turn;
          activeBattleStartHp = battle.units[battle.playerUnitId]?.hp ?? run.player.currentHp;
          activeBattleTier = battle.encounter.tier;
          activeProfile = battle.encounter.pressureProfile ?? 'frontload';
          battleTimeline.push({
            battleIndex: activeBattleIndex,
            encounterId: battle.encounter.id,
            tier: battle.encounter.tier,
            won: null,
          });
          if (battle.encounter.tier === 'elite' && firstEliteEncounterId === null) {
            firstEliteEncounterId = battle.encounter.id;
            firstEliteBattleIndex = activeBattleIndex;
            firstEliteDeckSnapshot = createFirstEliteDeckSnapshot(run.masterDeck);
            firstEliteTurnTraces = [];
            firstEliteExecutionerLastSnapshot = captureExecutionerSnapshot(run);
          }
          battleCommands = 0;
          lastBattleFingerprint = battleFingerprint(run);
          lastCombatFingerprint = combatProgressFingerprint(run);
          stagnantBattleStateSteps = 0;
          stagnantCombatSteps = 0;
          stagnantPlayableSteps = 0;
        }
        if (activeBattleTier === 'elite' && !eliteResolved && activeBattleEncounterId === 'act1_elite_heavy') {
          firstEliteExecutionerLastSnapshot = captureExecutionerSnapshot(run) ?? firstEliteExecutionerLastSnapshot;
        }
        if (activeBattleTier === 'elite' && !eliteResolved && battle.turn !== firstEliteCurrentTurn) {
          const playerUnit = battle.units[battle.playerUnitId];
          firstEliteCurrentTurn = battle.turn;
          firstEliteHpBeforeTurn = playerUnit?.hp ?? 0;
          firstEliteBlockBeforeTurn = playerUnit?.block ?? 0;
          firstEliteCounterTriggeredByPlayerAction = false;
          firstEliteHeavyExecutedOnEnemyTurn = false;
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
              battleTimeline,
              firstEliteEncounterId,
              firstEliteBattleIndex,
              deathEncounterTier,
              deathEncounterId,
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
          const preDispatchExecutionerSnapshot = captureExecutionerSnapshot(run);
          const wasFirstEliteBattle = activeBattleTier === 'elite' && !eliteResolved;
          const beforePlayerHp = run.battle?.units[run.battle.playerUnitId]?.hp ?? 0;
          const beforeEnemyIds = run.battle?.enemyUnitIds ?? [];
          const beforeMoveHistoryLens = new Map(
            beforeEnemyIds.map((enemyUnitId) => [enemyUnitId, run.battle?.monsters[enemyUnitId]?.moveHistory.length ?? 0]),
          );
          const beforeScreen = run.screen.type;
          const beforeNodeId = run.map.currentNodeId;
          run = dispatchWithGuard(engine, run, command);
          firstEliteExecutionerLastSnapshot = captureExecutionerSnapshot(run)
            ?? preDispatchExecutionerSnapshot
            ?? firstEliteExecutionerLastSnapshot;
          if (wasFirstEliteBattle && run.battle) {
            const events = run.battle.lastResolvedEvents;
            if (command.type === 'PLAY_CARD') {
              const tookEnemyDamage = events.some((event) =>
                event.type === 'DAMAGE_DEALT'
                && event.targetUnitId === run.battle!.playerUnitId
                && run.battle!.enemyUnitIds.includes(event.sourceUnitId),
              );
              if (tookEnemyDamage) firstEliteCounterTriggeredByPlayerAction = true;
            }
            if (command.type === 'END_TURN') {
              for (const enemyUnitId of run.battle.enemyUnitIds) {
                const beforeLen = beforeMoveHistoryLens.get(enemyUnitId) ?? 0;
                const history = run.battle.monsters[enemyUnitId]?.moveHistory ?? [];
                if (history.length > beforeLen && history[history.length - 1] === 'heavy_charge') {
                  firstEliteHeavyExecutedOnEnemyTurn = true;
                }
              }
              const player = run.battle.units[run.battle.playerUnitId];
              firstEliteTurnTraces.push({
                turn: firstEliteCurrentTurn || activeBattleTurn,
                hpBeforeTurn: firstEliteHpBeforeTurn,
                blockBeforeTurn: firstEliteBlockBeforeTurn,
                hpAfterActions: player?.hp ?? beforePlayerHp,
                blockAfterActions: player?.block ?? 0,
                counterTriggeredByPlayerAction: firstEliteCounterTriggeredByPlayerAction,
                heavyExecutedOnEnemyTurn: firstEliteHeavyExecutedOnEnemyTurn,
              });
              if (firstEliteTurnTraces.length > TRACE_HISTORY_LIMIT) firstEliteTurnTraces.shift();
            }
          }
          const nextFingerprint = battleFingerprint(run);
          const nextCombatFingerprint = combatProgressFingerprint(run);
          const noCombatProgress = nextCombatFingerprint === lastCombatFingerprint;
          stagnantBattleStateSteps = nextFingerprint === lastBattleFingerprint ? stagnantBattleStateSteps + 1 : 0;
          stagnantCombatSteps = noCombatProgress ? stagnantCombatSteps + 1 : 0;
          if (noCombatProgress) {
            if (command.type === 'END_TURN') {
              stagnantPlayableSteps = 0;
            } else {
              stagnantPlayableSteps += 1;
            }
          } else {
            stagnantPlayableSteps = 0;
          }
          lastBattleFingerprint = nextFingerprint;
          lastCombatFingerprint = nextCombatFingerprint;
          if (
            stagnantBattleStateSteps >= guardrail.noProgressStateRepeatLimit
            || stagnantCombatSteps >= guardrail.noProgressCombatRepeatLimit
          ) {
            const noProgressReason = stagnantPlayableSteps > 0
              ? 'no_progress_loop_playable'
              : 'no_progress_loop_endturn';
            return finishNonBattleRun(
              run,
              seed,
              policy.id,
              guardrailMode,
              records,
              nodeChoices,
              battleTimeline,
              firstEliteEncounterId,
              firstEliteBattleIndex,
              deathEncounterTier,
              deathEncounterId,
              nodeHistory,
              screenHistory,
              noProgressReason,
              [
                noProgressReason === 'no_progress_loop_endturn'
                  ? '连续空过回合仍无推进'
                  : '仍有可行动作但局面未推进',
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
            battleTimeline,
            firstEliteEncounterId,
            firstEliteBattleIndex,
            deathEncounterTier,
            deathEncounterId,
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
            battleTimeline,
            firstEliteEncounterId,
            firstEliteBattleIndex,
            deathEncounterTier,
            deathEncounterId,
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
            battleTimeline,
            firstEliteEncounterId,
            firstEliteBattleIndex,
            deathEncounterTier,
            deathEncounterId,
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
            battleTimeline,
            firstEliteEncounterId,
            firstEliteBattleIndex,
            deathEncounterTier,
            deathEncounterId,
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
          deathEncounterTier = activeBattleTier;
          deathEncounterId = activeBattleEncounterId;
          if (
            activeBattleTier === 'elite'
            && !eliteResolved
            && activeBattleEncounterId === 'act1_elite_heavy'
          ) {
            const snapshot = firstEliteExecutionerLastSnapshot ?? captureExecutionerSnapshot(run);
            firstEliteExecutionerFailureTrace = {
              deathTurn: activeBattleTurn,
              enemyHpAtDeath: snapshot?.enemyHp ?? 0,
              enemyEffectiveHpAtDeath: snapshot?.enemyEffectiveHp ?? 0,
              playerHpAtDeath: snapshot?.playerHp ?? 0,
              playerBlockAtDeath: snapshot?.playerBlock ?? 0,
            };
          }
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
    battleTimeline,
    firstEliteEncounterId,
    firstEliteBattleIndex,
    deathEncounterTier,
    deathEncounterId,
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

function summarizeSummaryInvariants(details: Act1RunDetail[]): Act1SummaryInvariantMetric[] {
  const traces = details
    .map((detail) => detail.summaryInvariantTrace)
    .filter((trace): trace is Act1SummaryInvariantTrace => Boolean(trace));
  if (traces.length === 0) return [];
  return [{
    reason: 'summary_invariant_failed',
    count: traces.length,
    rate: details.length > 0 ? traces.length / details.length : 0,
    exampleSeeds: traces.slice(0, 3).map((trace) => trace.seed),
  }];
}

function summarizeFirstEliteByMonsterId(
  firstEliteRecords: Act1BattleRecord[],
): {
  attemptsByMonsterId: Record<string, number>;
  deathsByMonsterId: Record<string, number>;
  winRateByMonsterId: Record<string, number>;
} {
  const attemptsByMonsterId: Record<string, number> = {};
  const deathsByMonsterId: Record<string, number> = {};
  const winRateByMonsterId: Record<string, number> = {};

  for (const monsterId of ACT1_FIRST_ELITE_MONSTER_IDS) {
    attemptsByMonsterId[monsterId] = 0;
    deathsByMonsterId[monsterId] = 0;
    winRateByMonsterId[monsterId] = 0;
  }

  for (const record of firstEliteRecords) {
    const encounter = getEncounterById(record.encounterId);
    const monsterId = encounter?.lineup[0]?.enemyId ?? record.encounterId;
    attemptsByMonsterId[monsterId] = (attemptsByMonsterId[monsterId] ?? 0) + 1;
    if (!record.won) {
      deathsByMonsterId[monsterId] = (deathsByMonsterId[monsterId] ?? 0) + 1;
    } else if (!(monsterId in deathsByMonsterId)) {
      deathsByMonsterId[monsterId] = 0;
    }
  }

  for (const [monsterId, attempts] of Object.entries(attemptsByMonsterId)) {
    if (attempts <= 0) {
      winRateByMonsterId[monsterId] = 0;
      continue;
    }
    const deaths = deathsByMonsterId[monsterId] ?? 0;
    winRateByMonsterId[monsterId] = (attempts - deaths) / attempts;
  }

  return {
    attemptsByMonsterId,
    deathsByMonsterId,
    winRateByMonsterId,
  };
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
  const firstEliteRecords = details
    .map((detail) => detail.records.find((record) => record.firstElite))
    .filter((record): record is Act1BattleRecord => Boolean(record));
  const firstEliteByMonster = summarizeFirstEliteByMonsterId(firstEliteRecords);
  const bossRecords = allRecords.filter((record) => record.tier === 'boss');
  const overall = summarizeStage(allRecords);
  const anyEliteRuns = details.filter((detail) =>
    detail.battleTimeline.some((record) => record.tier === 'elite'),
  ).length;

  return {
    policyId: policy.id,
    guardrailMode,
    totalRuns: runs,
    normal: summarizeStage(normalRecords),
    elite: summarizeStage(eliteRecords),
    firstElite: summarizeStage(firstEliteRecords),
    firstEliteDeathsByMonsterId: firstEliteByMonster.deathsByMonsterId,
    firstEliteAttemptsByMonsterId: firstEliteByMonster.attemptsByMonsterId,
    firstEliteWinRateByMonsterId: firstEliteByMonster.winRateByMonsterId,
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
    summaryInvariantBreakdown: summarizeSummaryInvariants(details),
    summaryInvariantTraces: details
      .map((detail) => detail.summaryInvariantTrace)
      .filter((trace): trace is Act1SummaryInvariantTrace => Boolean(trace)),
  };
}

export function runAct1GuardFirstEliteDiagnosis(input: {
  seed: number;
  runs: number;
  guardrailMode?: BattleGuardrailMode;
}): Act1GuardFirstEliteDiagnosis {
  const policy = walkerBasePolicies.find((item) => item.id === 'walker-guard');
  if (!policy) throw new Error('walker-guard policy not found');
  const guardrailMode = input.guardrailMode ?? 'progress_guard';
  const details: Act1RunDetail[] = [];
  for (let index = 0; index < input.runs; index += 1) {
    details.push(simulateSingleAct1((input.seed + index) >>> 0, policy, 'walker', guardrailMode));
  }

  const firstEliteDetails = details.filter((detail) => detail.firstEliteEncounterId !== null);
  const firstEliteFailures = firstEliteDetails.filter((detail) =>
    detail.records.some((record) => record.firstElite && !record.won),
  );
  const deckSnapshots = firstEliteDetails
    .map((detail) => detail.firstEliteDeckSnapshot)
    .filter((item): item is FirstEliteDeckSnapshot => Boolean(item));
  const failureTraces = firstEliteFailures
    .map((detail) => detail.firstEliteFailureTrace)
    .filter((item): item is FirstEliteFailureTrace => Boolean(item));
  const executionerFailures = firstEliteFailures
    .filter((detail) => detail.firstEliteEncounterId === 'act1_elite_heavy')
    .map((detail) => detail.firstEliteExecutionerFailureTrace)
    .filter((item): item is FirstEliteExecutionerFailureTrace => Boolean(item));

  const avg = (values: number[]): number => (values.length > 0
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0);

  return {
    policyId: policy.id,
    totalRuns: input.runs,
    firstEliteAttempts: firstEliteDetails.length,
    firstEliteFailures: firstEliteFailures.length,
    arrivalDeckAverages: {
      deckSize: avg(deckSnapshots.map((item) => item.deckSize)),
      setupCount: avg(deckSnapshots.map((item) => item.setupCount)),
      payoffCount: avg(deckSnapshots.map((item) => item.payoffCount)),
      bridgeCount: avg(deckSnapshots.map((item) => item.bridgeCount)),
      defenseCoreCount: avg(deckSnapshots.map((item) => item.defenseCoreCount)),
      momentumRelatedCount: avg(deckSnapshots.map((item) => item.momentumRelatedCount)),
    },
    failureLastTurns: {
      heavySeenRate: avg(failureTraces.map((item) => (item.heavyInLastThreeTurns ? 1 : 0))),
      counterTriggeredRate: avg(failureTraces.map((item) => (item.counterTriggeredInLastThreeTurns ? 1 : 0))),
      avgDeathTurn: avg(failureTraces.map((item) => item.deathTurn)),
    },
    executionerFailures: {
      count: executionerFailures.length,
      avgDeathTurn: avg(executionerFailures.map((item) => item.deathTurn)),
      avgEnemyHpAtDeath: avg(executionerFailures.map((item) => item.enemyHpAtDeath)),
      avgEnemyEffectiveHpAtDeath: avg(executionerFailures.map((item) => item.enemyEffectiveHpAtDeath)),
      avgPlayerHpAtDeath: avg(executionerFailures.map((item) => item.playerHpAtDeath)),
      avgPlayerBlockAtDeath: avg(executionerFailures.map((item) => item.playerBlockAtDeath)),
    },
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
