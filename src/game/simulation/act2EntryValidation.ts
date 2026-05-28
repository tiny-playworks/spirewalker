import { GameEngine } from '@/game/core/engine/GameEngine';
import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import { rewardEncounterTierFromRun } from '@/game/core/engine/rewardEncounter';
import { WANDERING_MERCHANT_EVENT_ID } from '@/game/core/engine/generateBranchingFloor';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { skipCardGoldAmount } from '@/game/core/engine/postBattleExtras';
import { isLegalMapStep } from '@/game/core/model/mapGraph';
import type { MapNodeType, MapRouteBias } from '@/game/core/model/map';
import type { RunState } from '@/game/core/model/run';
import type { GameCommand } from '@/game/core/commands/types';
import { getEncounterById } from '@/game/core/definitions/encounters';
import type { PressureProfile } from '@/game/core/definitions/encounters';
import type {
  Act1FloorSegmentId,
  Act1FirstEliteRegressionMetric,
  Act1MapNormalFightShapeMetric,
  Act1PreBossBattleEndRecord,
  Act1PreBossDeathDetail,
  Act1PreBossLossPolicyReport,
  Act1RouteShapeByBiasMetric,
  Act1RouteShapeMetric,
  Act1SimAbortReason,
  Act1TerminationFloorBucket,
  Act1TerminationPolicyBreakdown,
  Act1TerminationScreenBucket,
  Act1TerminationSnapshot,
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
const NO_PROGRESS_STATE_REPEAT_LIMIT = 12;
const NO_PROGRESS_COMBAT_REPEAT_LIMIT = 60;
const ACT1_FLOOR_SEGMENTS: Act1FloorSegmentId[] = ['1-5', '6-9', '10+'];
const ROUTE_SHAPE_KEYS = ['risk', 'balance', 'safe', 'mixed'] as const;

function actFloorSegment(actFloor: number): Act1FloorSegmentId {
  if (actFloor <= 5) return '1-5';
  if (actFloor <= 9) return '6-9';
  return '10+';
}

function pushTerminationTransition(buffer: string[], entry: string): void {
  buffer.push(entry);
  if (buffer.length > 5) buffer.shift();
}

function terminationScreenBucket(screen: RunState['screen']): Act1TerminationScreenBucket {
  const t = screen.type;
  if (
    t === 'map'
    || t === 'battle'
    || t === 'reward'
    || t === 'shop'
    || t === 'event'
    || t === 'rest'
    || t === 'game_over'
    || t === 'victory'
  ) {
    return t;
  }
  return 'other';
}

function terminationFloorBucket(run: RunState): Act1TerminationFloorBucket {
  if (run.screen.type === 'battle' && run.battle?.encounter.tier === 'boss') return 'boss';
  const nodeId = run.map.currentNodeId;
  const node = nodeId ? run.map.nodes[nodeId] : null;
  if (node?.type === 'boss') return 'boss';
  if (run.meta.act !== 1) return 'act2_plus';
  return actFloorSegment(run.meta.actFloor);
}

function buildTerminationSnapshot(
  run: RunState,
  recentScreenTransitions: readonly string[],
): Act1TerminationSnapshot {
  const nodeId = run.map.currentNodeId;
  const curNode = nodeId ? run.map.nodes[nodeId] : null;
  const recentNodeType: MapNodeType | 'none' = curNode?.type ?? 'none';
  const nextNodes = run.screen.type === 'map' ? availableMapNodes(run) : [];
  const mapNextNodesCount = run.screen.type === 'map' ? nextNodes.length : null;
  const mapNoLegalNext = run.screen.type === 'map' ? nextNodes.length === 0 : null;

  let battleTurn: number | null = null;
  let aliveEnemyCount: number | null = null;
  let enemyTotalHp: number | null = null;
  let playerHp: number | null = null;
  let playerBlock: number | null = null;
  let encounterId: string | null = null;
  const battle = run.battle;
  if (run.screen.type === 'battle' && battle) {
    battleTurn = battle.turn;
    encounterId = battle.encounter.id;
    aliveEnemyCount = battle.enemyUnitIds.filter((unitId) => battle.units[unitId]?.alive).length;
    enemyTotalHp = battle.enemyUnitIds.reduce((sum, unitId) => {
      const unit = battle.units[unitId];
      return unit?.alive ? sum + unit.hp : sum;
    }, 0);
    const player = battle.units[battle.playerUnitId];
    playerHp = player?.hp ?? null;
    playerBlock = player?.block ?? null;
  }

  return {
    screenBucket: terminationScreenBucket(run.screen),
    act: run.meta.act,
    actFloor: run.meta.actFloor,
    floorBucket: terminationFloorBucket(run),
    nodeDepth: curNode?.depth ?? null,
    recentNodeType,
    recentScreenTransitions: [...recentScreenTransitions],
    battleTurn,
    aliveEnemyCount,
    enemyTotalHp,
    playerHp,
    playerBlock,
    encounterId,
    mapNextNodesCount,
    mapNoLegalNext,
  };
}

function emptyTerminationBreakdown(): Act1TerminationPolicyBreakdown {
  return {
    samples: 0,
    byScreenBucket: {},
    byFloorBucket: {},
    byReason: {},
    byRecentNodeType: {},
    transitionTailHistogram: {},
    battleSub: {
      samples: 0,
      byAbortReason: {},
      sumBattleTurn: 0,
      sumAliveEnemy: 0,
      sumEnemyHp: 0,
      sumPlayerHp: 0,
      sumPlayerBlock: 0,
    },
    mapSub: {
      samples: 0,
      zeroNextNodes: 0,
      sumNextNodesCount: 0,
    },
  };
}

function bumpTerminationRecord(record: Record<string, number>, key: string, delta = 1): void {
  record[key] = (record[key] ?? 0) + delta;
}

function ingestTerminationBreakdown(
  target: Act1TerminationPolicyBreakdown,
  reason: string,
  snapshot: Act1TerminationSnapshot,
): void {
  target.samples += 1;
  bumpTerminationRecord(target.byScreenBucket as Record<string, number>, snapshot.screenBucket, 1);
  bumpTerminationRecord(target.byFloorBucket as Record<string, number>, snapshot.floorBucket, 1);
  bumpTerminationRecord(target.byReason, reason, 1);
  bumpTerminationRecord(target.byRecentNodeType as Record<string, number>, snapshot.recentNodeType, 1);
  const tail = snapshot.recentScreenTransitions.join(' > ');
  if (tail.length > 0) bumpTerminationRecord(target.transitionTailHistogram, tail, 1);

  if (snapshot.screenBucket === 'battle') {
    target.battleSub.samples += 1;
    bumpTerminationRecord(target.battleSub.byAbortReason, reason, 1);
    if (snapshot.battleTurn != null) target.battleSub.sumBattleTurn += snapshot.battleTurn;
    if (snapshot.aliveEnemyCount != null) target.battleSub.sumAliveEnemy += snapshot.aliveEnemyCount;
    if (snapshot.enemyTotalHp != null) target.battleSub.sumEnemyHp += snapshot.enemyTotalHp;
    if (snapshot.playerHp != null) target.battleSub.sumPlayerHp += snapshot.playerHp;
    if (snapshot.playerBlock != null) target.battleSub.sumPlayerBlock += snapshot.playerBlock;
  }
  if (snapshot.screenBucket === 'map') {
    target.mapSub.samples += 1;
    if (snapshot.mapNoLegalNext) target.mapSub.zeroNextNodes += 1;
    if (snapshot.mapNextNodesCount != null) target.mapSub.sumNextNodesCount += snapshot.mapNextNodesCount;
  }
}

function mergeTerminationBreakdown(
  left: Act1TerminationPolicyBreakdown,
  right: Act1TerminationPolicyBreakdown,
): Act1TerminationPolicyBreakdown {
  const out = emptyTerminationBreakdown();
  for (const part of [left, right]) {
    out.samples += part.samples;
    for (const [k, v] of Object.entries(part.byScreenBucket)) {
      bumpTerminationRecord(out.byScreenBucket as Record<string, number>, k, v ?? 0);
    }
    for (const [k, v] of Object.entries(part.byFloorBucket)) {
      bumpTerminationRecord(out.byFloorBucket as Record<string, number>, k, v ?? 0);
    }
    for (const [k, v] of Object.entries(part.byReason)) {
      bumpTerminationRecord(out.byReason, k, v ?? 0);
    }
    for (const [k, v] of Object.entries(part.byRecentNodeType)) {
      bumpTerminationRecord(out.byRecentNodeType as Record<string, number>, k, v ?? 0);
    }
    for (const [k, v] of Object.entries(part.transitionTailHistogram)) {
      bumpTerminationRecord(out.transitionTailHistogram, k, v ?? 0);
    }
    out.battleSub.samples += part.battleSub.samples;
    for (const [k, v] of Object.entries(part.battleSub.byAbortReason)) {
      bumpTerminationRecord(out.battleSub.byAbortReason, k, v ?? 0);
    }
    out.battleSub.sumBattleTurn += part.battleSub.sumBattleTurn;
    out.battleSub.sumAliveEnemy += part.battleSub.sumAliveEnemy;
    out.battleSub.sumEnemyHp += part.battleSub.sumEnemyHp;
    out.battleSub.sumPlayerHp += part.battleSub.sumPlayerHp;
    out.battleSub.sumPlayerBlock += part.battleSub.sumPlayerBlock;
    out.mapSub.samples += part.mapSub.samples;
    out.mapSub.zeroNextNodes += part.mapSub.zeroNextNodes;
    out.mapSub.sumNextNodesCount += part.mapSub.sumNextNodesCount;
  }
  return out;
}

function resolveEncounterPressure(
  encounterId: string,
  metaProfile?: PressureProfile,
): PressureProfile | 'unknown' {
  const def = getEncounterById(encounterId);
  return (def?.pressureProfile ?? metaProfile) ?? 'unknown';
}

type Act2BattleRecord = {
  encounterId: string;
  won: boolean;
  hpLoss: number;
  turns: number;
};

type SingleRunResult = {
  act1BossReached: boolean;
  act1BossDefeatedByBoss: boolean;
  enteredAct2: boolean;
  act2Battles: Act2BattleRecord[];
  validationCompleted: boolean;
  enteredEliteBranch: boolean;
  nodeChoices: MapNodeType[];
  act1BattleEnds: Act1PreBossBattleEndRecord[];
  act1Death: Act1PreBossDeathDetail | null;
  hpAtBossEngage: number | null;
  maxHpAtBossEngage: number | null;
  mapNormalFightShape: Act1MapNormalFightShapeMetric;
  routeShapeByBias: Act1RouteShapeByBiasMetric;
  firstElite: {
    monsterId: string | null;
    won: boolean;
    deckSize: number | null;
    normalFightsBefore: number | null;
  };
};

type ValidationInput = {
  seed: number;
  runsPerPolicy: number;
  policies?: readonly SimulationPolicy[];
  characterId?: 'walker';
  bypassAct1Boss?: boolean;
  bypassAct1Midgame?: boolean;
  bypassAct1Elite?: boolean;
  bypassAct1ToBoss?: boolean;
  includeAct1PreBossLossReport?: boolean;
  onProgress?: (progress: {
    policyId: string;
    policyIndex: number;
    policyCount: number;
    completedRuns: number;
    totalRuns: number;
  }) => void;
};

function summarizeMapNormalFightShape(run: RunState): Act1MapNormalFightShapeMetric {
  const start = Object.values(run.map.nodes).find((node) => node.depth === 1);
  if (!start) {
    return { samples: 0, avgNormalFights: 0, minNormalFights: 0, maxNormalFights: 0 };
  }

  let pathCount = 0;
  let totalNormalFights = 0;
  let minNormalFights = Number.POSITIVE_INFINITY;
  let maxNormalFights = 0;
  const stack: Array<{ nodeId: string; normalFights: number }> = [{ nodeId: start.id, normalFights: 0 }];

  while (stack.length > 0) {
    const current = stack.pop()!;
    const node = run.map.nodes[current.nodeId];
    if (!node) continue;
    const normalFights = current.normalFights + (node.depth > 1 && node.type === 'battle' ? 1 : 0);
    if (node.type === 'boss') {
      pathCount += 1;
      totalNormalFights += normalFights;
      minNormalFights = Math.min(minNormalFights, normalFights);
      maxNormalFights = Math.max(maxNormalFights, normalFights);
      continue;
    }
    for (const nextNodeId of node.nextNodeIds) {
      stack.push({ nodeId: nextNodeId, normalFights });
    }
  }

  return {
    samples: pathCount,
    avgNormalFights: pathCount > 0 ? totalNormalFights / pathCount : 0,
    minNormalFights: Number.isFinite(minNormalFights) ? minNormalFights : 0,
    maxNormalFights,
  };
}

type RouteShapeSample = {
  bias: MapRouteBias | 'mixed';
  eliteFights: number;
  normalFights: number;
  bufferNodes: number;
  maxBattleStreak: number;
};

function emptyRouteShapeMetric(): Act1RouteShapeMetric {
  return {
    samples: 0,
    avgEliteFights: 0,
    minEliteFights: 0,
    maxEliteFights: 0,
    avgNormalFights: 0,
    minNormalFights: 0,
    maxNormalFights: 0,
    avgBufferNodes: 0,
    minBufferNodes: 0,
    maxBufferNodes: 0,
    maxBattleStreak: 0,
    zeroEliteRoutes: 0,
    oneEliteRoutes: 0,
    twoPlusEliteRoutes: 0,
  };
}

function emptyRouteShapeByBias(): Act1RouteShapeByBiasMetric {
  return {
    risk: emptyRouteShapeMetric(),
    balance: emptyRouteShapeMetric(),
    safe: emptyRouteShapeMetric(),
    mixed: emptyRouteShapeMetric(),
  };
}

function isRouteBufferType(type: MapNodeType): boolean {
  return type === 'event' || type === 'shop' || type === 'rest' || type === 'treasure';
}

function classifyRouteBias(counts: Record<MapRouteBias, number>): MapRouteBias | 'mixed' {
  const ordered = (['risk', 'balance', 'safe'] as const)
    .map((bias) => ({ bias, count: counts[bias] }))
    .sort((left, right) => right.count - left.count);
  const top = ordered[0]!;
  const second = ordered[1]!;
  return top.count > second.count ? top.bias : 'mixed';
}

function metricFromRouteSamples(samples: RouteShapeSample[]): Act1RouteShapeMetric {
  if (samples.length === 0) return emptyRouteShapeMetric();
  const sumElite = samples.reduce((sum, item) => sum + item.eliteFights, 0);
  const sumNormal = samples.reduce((sum, item) => sum + item.normalFights, 0);
  const sumBuffer = samples.reduce((sum, item) => sum + item.bufferNodes, 0);
  return {
    samples: samples.length,
    avgEliteFights: sumElite / samples.length,
    minEliteFights: Math.min(...samples.map((item) => item.eliteFights)),
    maxEliteFights: Math.max(...samples.map((item) => item.eliteFights)),
    avgNormalFights: sumNormal / samples.length,
    minNormalFights: Math.min(...samples.map((item) => item.normalFights)),
    maxNormalFights: Math.max(...samples.map((item) => item.normalFights)),
    avgBufferNodes: sumBuffer / samples.length,
    minBufferNodes: Math.min(...samples.map((item) => item.bufferNodes)),
    maxBufferNodes: Math.max(...samples.map((item) => item.bufferNodes)),
    maxBattleStreak: Math.max(...samples.map((item) => item.maxBattleStreak)),
    zeroEliteRoutes: samples.filter((item) => item.eliteFights === 0).length,
    oneEliteRoutes: samples.filter((item) => item.eliteFights === 1).length,
    twoPlusEliteRoutes: samples.filter((item) => item.eliteFights >= 2).length,
  };
}

function summarizeAct1RouteShape(run: RunState): Act1RouteShapeByBiasMetric {
  const start = Object.values(run.map.nodes).find((node) => node.depth === 1);
  if (!start) return emptyRouteShapeByBias();

  const samplesByBias: Record<MapRouteBias | 'mixed', RouteShapeSample[]> = {
    risk: [],
    balance: [],
    safe: [],
    mixed: [],
  };
  const stack: Array<{
    nodeId: string;
    eliteFights: number;
    normalFights: number;
    bufferNodes: number;
    battleStreak: number;
    maxBattleStreak: number;
    biasCounts: Record<MapRouteBias, number>;
  }> = [{
    nodeId: start.id,
    eliteFights: 0,
    normalFights: 0,
    bufferNodes: 0,
    battleStreak: 0,
    maxBattleStreak: 0,
    biasCounts: { risk: 0, balance: 0, safe: 0 },
  }];

  while (stack.length > 0) {
    const current = stack.pop()!;
    const node = run.map.nodes[current.nodeId];
    if (!node) continue;

    const shouldCount = node.depth > 1 && node.type !== 'boss';
    const bias = node.routeBias ?? 'balance';
    const biasCounts = { ...current.biasCounts };
    if (shouldCount) biasCounts[bias] += 1;
    const normalFights = current.normalFights + (shouldCount && node.type === 'battle' ? 1 : 0);
    const eliteFights = current.eliteFights + (shouldCount && node.type === 'elite' ? 1 : 0);
    const bufferNodes = current.bufferNodes + (shouldCount && isRouteBufferType(node.type) ? 1 : 0);
    const battleStreak = shouldCount && node.type === 'battle' ? current.battleStreak + 1 : 0;
    const maxBattleStreak = Math.max(current.maxBattleStreak, battleStreak);

    if (node.type === 'boss') {
      const routeBias = classifyRouteBias(biasCounts);
      samplesByBias[routeBias].push({
        bias: routeBias,
        eliteFights,
        normalFights,
        bufferNodes,
        maxBattleStreak,
      });
      continue;
    }

    for (const nextNodeId of node.nextNodeIds) {
      stack.push({
        nodeId: nextNodeId,
        eliteFights,
        normalFights,
        bufferNodes,
        battleStreak,
        maxBattleStreak,
        biasCounts,
      });
    }
  }

  return {
    risk: metricFromRouteSamples(samplesByBias.risk),
    balance: metricFromRouteSamples(samplesByBias.balance),
    safe: metricFromRouteSamples(samplesByBias.safe),
    mixed: metricFromRouteSamples(samplesByBias.mixed),
  };
}

function mergeRouteShapeMetrics(
  reports: Act1RouteShapeByBiasMetric[],
): Act1RouteShapeByBiasMetric {
  const merged = emptyRouteShapeByBias();
  for (const key of ROUTE_SHAPE_KEYS) {
    let samples = 0;
    let eliteSum = 0;
    let normalSum = 0;
    let bufferSum = 0;
    let minElite = Number.POSITIVE_INFINITY;
    let minNormal = Number.POSITIVE_INFINITY;
    let minBuffer = Number.POSITIVE_INFINITY;
    for (const report of reports) {
      const row = report[key];
      samples += row.samples;
      eliteSum += row.avgEliteFights * row.samples;
      normalSum += row.avgNormalFights * row.samples;
      bufferSum += row.avgBufferNodes * row.samples;
      if (row.samples > 0) {
        minElite = Math.min(minElite, row.minEliteFights);
        minNormal = Math.min(minNormal, row.minNormalFights);
        minBuffer = Math.min(minBuffer, row.minBufferNodes);
      }
      merged[key].maxEliteFights = Math.max(merged[key].maxEliteFights, row.maxEliteFights);
      merged[key].maxNormalFights = Math.max(merged[key].maxNormalFights, row.maxNormalFights);
      merged[key].maxBufferNodes = Math.max(merged[key].maxBufferNodes, row.maxBufferNodes);
      merged[key].maxBattleStreak = Math.max(merged[key].maxBattleStreak, row.maxBattleStreak);
      merged[key].zeroEliteRoutes += row.zeroEliteRoutes;
      merged[key].oneEliteRoutes += row.oneEliteRoutes;
      merged[key].twoPlusEliteRoutes += row.twoPlusEliteRoutes;
    }
    merged[key].samples = samples;
    merged[key].avgEliteFights = samples > 0 ? eliteSum / samples : 0;
    merged[key].avgNormalFights = samples > 0 ? normalSum / samples : 0;
    merged[key].avgBufferNodes = samples > 0 ? bufferSum / samples : 0;
    merged[key].minEliteFights = Number.isFinite(minElite) ? minElite : 0;
    merged[key].minNormalFights = Number.isFinite(minNormal) ? minNormal : 0;
    merged[key].minBufferNodes = Number.isFinite(minBuffer) ? minBuffer : 0;
  }
  return merged;
}

function emptyFirstEliteRegression(): Act1FirstEliteRegressionMetric {
  return {
    attempts: 0,
    wins: 0,
    winRate: 0,
    avgDeckSizeAtFirstElite: 0,
    avgNormalFightsBeforeFirstElite: 0,
    byMonsterId: {},
  };
}

function monsterIdForEncounter(encounterId: string): string {
  const encounter = getEncounterById(encounterId);
  return encounter?.lineup[0]?.enemyId ?? encounterId;
}

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
    if (!card || card.type === 'curse' || card.type === 'status') continue;
    if (battle.player.energy < cardInstance.costForTurn) continue;
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
  stagnantBattleStateSteps: number,
  stagnantCombatSteps: number,
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
  bypassAct1Boss: boolean,
  bypassAct1Midgame: boolean,
  bypassAct1Elite: boolean,
  bypassAct1ToBoss: boolean,
): SingleRunResult {
  const engine = new GameEngine();
  let run = createMapRun(seed);
  if (run.meta.characterId !== characterId) {
    throw new Error(`unsupported character: ${run.meta.characterId}`);
  }
  const mapNormalFightShape = summarizeMapNormalFightShape(run);
  const routeShapeByBias = summarizeAct1RouteShape(run);

  let screenTransitions = 0;
  let activeBattleId: string | null = null;
  let activeBattleTurn = 0;
  let activeBattleStartHp = 0;
  let battleCommands = 0;
  let act1BossReached = false;
  let act1BossDefeatedByBoss = false;
  let enteredAct2 = false;
  let enteredEliteBranch = false;
  let firstEliteResolved = false;
  let firstEliteMonsterId: string | null = null;
  let firstEliteWon = false;
  let firstEliteDeckSize: number | null = null;
  let firstEliteNormalFightsBefore: number | null = null;
  const act2Battles: Act2BattleRecord[] = [];
  const nodeChoices: MapNodeType[] = [];
  const act1BattleEnds: Act1PreBossBattleEndRecord[] = [];
  let hpAtBossEngage: number | null = null;
  let maxHpAtBossEngage: number | null = null;
  let activeBattleActFloor = 0;
  let lastBattleFingerprint: string | null = null;
  let lastCombatFingerprint: string | null = null;
  let stagnantBattleStateSteps = 0;
  let stagnantCombatSteps = 0;
  const terminationTransitions: string[] = [];
  /** game_over 时引擎会清空 run.battle，用此快照恢复 Act1 战斗致死归因（仅观测） */
  let lastAct1CombatSnapshot: {
    tier: 'normal' | 'elite' | 'boss';
    encounterId: string;
    actFloor: number;
  } | null = null;

  const finishFail = (
    act1Death: Act1PreBossDeathDetail | null,
    validationCompleted = false,
  ): SingleRunResult => ({
    act1BossReached,
    act1BossDefeatedByBoss,
    enteredAct2,
    act2Battles,
    validationCompleted,
    enteredEliteBranch,
    nodeChoices,
    act1BattleEnds,
    act1Death,
    hpAtBossEngage,
    maxHpAtBossEngage,
    mapNormalFightShape,
    routeShapeByBias,
    firstElite: {
      monsterId: firstEliteMonsterId,
      won: firstEliteWon,
      deckSize: firstEliteDeckSize,
      normalFightsBefore: firstEliteNormalFightsBefore,
    },
  });

  while (screenTransitions < MAX_SCREENS_PER_RUN) {
    switch (run.screen.type) {
      case 'map': {
        screenTransitions += 1;
        const ctx = buildMapContext(run);
        if (ctx.nextNodes.length === 0) {
          enteredEliteBranch = enteredEliteBranch || Boolean(run.meta.enteredAct2EliteBranch);
          return finishFail(
            {
              kind: 'non_battle_end',
              reason: 'map_no_legal_next_nodes',
              snapshot: buildTerminationSnapshot(run, terminationTransitions),
            },
            Boolean(run.meta.validationCompleted),
          );
        }
        run = dispatchWithGuard(engine, run, {
          type: 'CHOOSE_MAP_NODE',
          nodeId: chooseMapNodeWithValidationRule(policy, run),
        });
        const landedNodeId = run.map.currentNodeId;
        const landedNode = landedNodeId ? run.map.nodes[landedNodeId] : null;
        if (landedNode?.type) nodeChoices.push(landedNode.type);
        enteredAct2 = enteredAct2 || run.meta.validationSegment === 'act2_entry';
        enteredEliteBranch = enteredEliteBranch || Boolean(run.meta.enteredAct2EliteBranch);
        pushTerminationTransition(
          terminationTransitions,
          `map->${run.screen.type}@a${run.meta.act}f${run.meta.actFloor}d${landedNode?.depth ?? '?'}`,
        );
        break;
      }
      case 'battle': {
        const battle = run.battle!;
        if (activeBattleId !== battle.id) {
          screenTransitions += 1;
          activeBattleId = battle.id;
          activeBattleTurn = battle.turn;
          activeBattleStartHp = run.player.currentHp;
          activeBattleActFloor = run.meta.actFloor;
          battleCommands = 0;
          lastBattleFingerprint = battleFingerprint(run);
          lastCombatFingerprint = combatProgressFingerprint(run);
          stagnantBattleStateSteps = 0;
          stagnantCombatSteps = 0;
          if (run.meta.act === 1 && battle.encounter.tier === 'boss') {
            act1BossReached = true;
            hpAtBossEngage = run.player.currentHp;
            maxHpAtBossEngage = run.player.maxHp;
          }
          if (run.meta.act === 1 && battle.encounter.tier === 'elite' && firstEliteMonsterId === null) {
            firstEliteMonsterId = monsterIdForEncounter(battle.encounter.id);
            firstEliteDeckSize = run.masterDeck.length;
            firstEliteNormalFightsBefore = act1BattleEnds.filter((record) => record.tier === 'normal').length;
          }
          pushTerminationTransition(
            terminationTransitions,
            `to_battle:${battle.encounter.tier}:${battle.encounter.id}@f${run.meta.actFloor}`,
          );
        }
        activeBattleTurn = battle.turn;
        if (run.meta.act === 1) {
          const tb = battle.encounter.tier;
          if (tb === 'normal' || tb === 'elite' || tb === 'boss') {
            lastAct1CombatSnapshot = {
              tier: tb,
              encounterId: battle.encounter.id,
              actFloor: activeBattleActFloor,
            };
          }
        }

        const isAct1 = run.meta.act === 1;
        const isBoss = battle.encounter.tier === 'boss';
        const isElite = battle.encounter.tier === 'elite';
        const isNormal = battle.encounter.tier === 'normal';
        const isMidgameFloor = run.meta.actFloor >= 8;

        const shouldBypassAct1Battle = isAct1 && !isBoss && (
          (bypassAct1ToBoss && firstEliteResolved)
          || (bypassAct1Elite && isElite && isMidgameFloor)
          || (bypassAct1Midgame && isNormal && isMidgameFloor)
        );

        if (
          (bypassAct1Boss && isAct1 && isBoss && battle.phase !== 'victory')
          || (shouldBypassAct1Battle && battle.phase !== 'victory')
        ) {
          run = dispatchWithGuard(engine, run, {
            type: 'DEBUG_FORCE_BATTLE_OUTCOME',
            outcome: 'victory',
          });
          pushTerminationTransition(terminationTransitions, `battle_bypass_win->${run.screen.type}`);
          break;
        }

        if (battle.inputMode === 'animation_lock') {
          run = dispatchWithGuard(engine, run, { type: 'RESOLVE_ANIMATION_DONE' });
          const nextFingerprint = battleFingerprint(run);
          const nextCombatFingerprint = combatProgressFingerprint(run);
          stagnantBattleStateSteps = nextFingerprint === lastBattleFingerprint ? stagnantBattleStateSteps + 1 : 0;
          stagnantCombatSteps = nextCombatFingerprint === lastCombatFingerprint ? stagnantCombatSteps + 1 : 0;
          lastBattleFingerprint = nextFingerprint;
          lastCombatFingerprint = nextCombatFingerprint;
          if (
            stagnantBattleStateSteps >= NO_PROGRESS_STATE_REPEAT_LIMIT
            || stagnantCombatSteps >= NO_PROGRESS_COMBAT_REPEAT_LIMIT
          ) {
            const stateHit = stagnantBattleStateSteps >= NO_PROGRESS_STATE_REPEAT_LIMIT;
            const combatHit = stagnantCombatSteps >= NO_PROGRESS_COMBAT_REPEAT_LIMIT;
            const reason: Act1SimAbortReason = stateHit && combatHit
              ? 'battle_no_progress_both'
              : stateHit
                ? 'battle_no_progress_state'
                : 'battle_no_progress_combat';
            return finishFail({
              kind: 'sim_abort',
              reason,
              snapshot: buildTerminationSnapshot(run, terminationTransitions),
            });
          }
          break;
        }

        if (battle.phase === 'victory') {
          if (run.meta.act === 1) {
            const pressureProfile = resolveEncounterPressure(
              battle.encounter.id,
              battle.encounter.pressureProfile,
            );
            act1BattleEnds.push({
              actFloor: activeBattleActFloor,
              floorSegment: actFloorSegment(activeBattleActFloor),
              tier: battle.encounter.tier,
              encounterId: battle.encounter.id,
              pressureProfile,
              won: true,
              hpLoss: Math.max(0, activeBattleStartHp - run.player.currentHp),
              turns: battle.turn,
            });
          }
          if (run.meta.act === 1 && battle.encounter.tier === 'elite') {
            firstEliteResolved = true;
            if (monsterIdForEncounter(battle.encounter.id) === firstEliteMonsterId) {
              firstEliteWon = true;
            }
          }
          if (run.meta.validationSegment === 'act2_entry') {
            act2Battles.push({
              encounterId: battle.encounter.id,
              won: true,
              hpLoss: Math.max(0, activeBattleStartHp - run.player.currentHp),
              turns: battle.turn,
            });
          }
          activeBattleId = null;
          lastAct1CombatSnapshot = null;
          run = dispatchWithGuard(engine, run, { type: 'LEAVE_BATTLE_TO_REWARD' });
          pushTerminationTransition(terminationTransitions, `battle_victory->${run.screen.type}`);
          enteredAct2 = enteredAct2 || run.meta.validationSegment === 'act2_entry';
          enteredEliteBranch = enteredEliteBranch || Boolean(run.meta.enteredAct2EliteBranch);
          break;
        }

        if (battle.phase === 'player_action') {
          if (battleCommands >= MAX_COMMANDS_PER_BATTLE) {
            return finishFail({
              kind: 'sim_abort',
              reason: 'battle_command_limit',
              snapshot: buildTerminationSnapshot(run, terminationTransitions),
            });
          }
          const command = policy.chooseBattleCommand(
            buildBattleContext(run, stagnantBattleStateSteps, stagnantCombatSteps),
          );
          battleCommands += 1;
          run = dispatchWithGuard(engine, run, command);
          const nextFingerprint = battleFingerprint(run);
          const nextCombatFingerprint = combatProgressFingerprint(run);
          stagnantBattleStateSteps = nextFingerprint === lastBattleFingerprint ? stagnantBattleStateSteps + 1 : 0;
          stagnantCombatSteps = nextCombatFingerprint === lastCombatFingerprint ? stagnantCombatSteps + 1 : 0;
          lastBattleFingerprint = nextFingerprint;
          lastCombatFingerprint = nextCombatFingerprint;
          if (
            stagnantBattleStateSteps >= NO_PROGRESS_STATE_REPEAT_LIMIT
            || stagnantCombatSteps >= NO_PROGRESS_COMBAT_REPEAT_LIMIT
          ) {
            const stateHit = stagnantBattleStateSteps >= NO_PROGRESS_STATE_REPEAT_LIMIT;
            const combatHit = stagnantCombatSteps >= NO_PROGRESS_COMBAT_REPEAT_LIMIT;
            const reason: Act1SimAbortReason = stateHit && combatHit
              ? 'battle_no_progress_both'
              : stateHit
                ? 'battle_no_progress_state'
                : 'battle_no_progress_combat';
            return finishFail({
              kind: 'sim_abort',
              reason,
              snapshot: buildTerminationSnapshot(run, terminationTransitions),
            });
          }
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
        pushTerminationTransition(terminationTransitions, `reward->${run.screen.type}`);
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
        pushTerminationTransition(terminationTransitions, `shop->${run.screen.type}`);
        break;
      }
      case 'event': {
        screenTransitions += 1;
        run = dispatchWithGuard(engine, run, {
          type: 'RESOLVE_EVENT_OPTION',
          optionId: policy.chooseEventOption(buildEventContext(run)),
        });
        pushTerminationTransition(terminationTransitions, `event->${run.screen.type}`);
        break;
      }
      case 'rest':
        screenTransitions += 1;
        run = dispatchWithGuard(engine, run, { type: 'LEAVE_REST_TO_MAP' });
        pushTerminationTransition(terminationTransitions, `rest->${run.screen.type}`);
        break;
      case 'game_over': {
        screenTransitions += 1;
        pushTerminationTransition(terminationTransitions, 'game_over');
        if (activeBattleId && run.meta.validationSegment === 'act2_entry' && run.battle) {
          act2Battles.push({
            encounterId: run.battle.encounter.id,
            won: false,
            hpLoss: Math.max(0, activeBattleStartHp - run.player.currentHp),
            turns: activeBattleTurn,
          });
        }
        if (activeBattleId && run.meta.act === 1 && run.battle?.encounter.tier === 'boss') {
          act1BossDefeatedByBoss = true;
        }
        enteredEliteBranch = enteredEliteBranch || Boolean(run.meta.enteredAct2EliteBranch);
        let act1CombatDeath: Act1PreBossDeathDetail | null = null;
        if (run.meta.act === 1 && activeBattleId) {
          const snap = lastAct1CombatSnapshot;
          const tier = run.battle?.encounter.tier ?? snap?.tier;
          const encounterId = run.battle?.encounter.id ?? snap?.encounterId;
          if (
            encounterId
            && (tier === 'normal' || tier === 'elite' || tier === 'boss')
          ) {
            const actFloor = snap?.actFloor ?? run.meta.actFloor;
            const floorSegment = actFloorSegment(actFloor);
            const pressureProfile = resolveEncounterPressure(
              encounterId,
              run.battle?.encounter.pressureProfile,
            );
            const hpRatioAtBossEngage = tier === 'boss'
              && hpAtBossEngage != null
              && maxHpAtBossEngage != null
              && maxHpAtBossEngage > 0
              ? hpAtBossEngage / maxHpAtBossEngage
              : null;
            act1CombatDeath = {
              kind: 'act1_battle',
              tier,
              actFloor,
              floorSegment,
              encounterId,
              pressureProfile,
              hpRatioAtBossEngage,
            };
          }
        }
        if (act1CombatDeath) {
          return finishFail(act1CombatDeath);
        }
        return finishFail({
          kind: 'non_battle_end',
          reason: 'game_over_non_act1_combat_death',
          snapshot: buildTerminationSnapshot(run, terminationTransitions),
        });
      }
      case 'victory':
        screenTransitions += 1;
        enteredEliteBranch = enteredEliteBranch || Boolean(run.meta.enteredAct2EliteBranch);
        return {
          act1BossReached,
          act1BossDefeatedByBoss,
          enteredAct2,
          act2Battles,
          validationCompleted: Boolean(run.meta.validationCompleted),
          enteredEliteBranch,
          nodeChoices,
          act1BattleEnds,
          act1Death: null,
          hpAtBossEngage,
          maxHpAtBossEngage,
          mapNormalFightShape,
          routeShapeByBias,
          firstElite: {
            monsterId: firstEliteMonsterId,
            won: firstEliteWon,
            deckSize: firstEliteDeckSize,
            normalFightsBefore: firstEliteNormalFightsBefore,
          },
        };
      default:
        throw new Error(`unsupported screen: ${run.screen.type}`);
    }
  }

  return finishFail({
    kind: 'sim_abort',
    reason: 'screen_limit',
    snapshot: buildTerminationSnapshot(run, terminationTransitions),
  });
}

function buildAct1PreBossLossReport(details: SingleRunResult[]): Act1PreBossLossPolicyReport {
  const deathFloorSegmentCounts: Record<Act1FloorSegmentId, number> = { '1-5': 0, '6-9': 0, '10+': 0 };
  const deathNormalFloorSegmentCounts: Record<Act1FloorSegmentId, number> = { '1-5': 0, '6-9': 0, '10+': 0 };
  const deathTierCounts: Record<'normal' | 'elite' | 'boss', number> = { normal: 0, elite: 0, boss: 0 };
  const nodeChoiceSumAtAct1CombatDeath: Partial<Record<MapNodeType, number>> = {};
  let enteredAct2Count = 0;
  let act1CombatGameOverCount = 0;
  let simAbortCount = 0;
  let nonBattleEndCount = 0;
  let bossDeathWornDownCount = 0;
  let bossDeathFreshCount = 0;
  let nodeChoiceDeathSamples = 0;
  let observedNormalAttempts = 0;
  let mapShapeSamples = 0;
  let mapShapeWeightedNormalFights = 0;
  let mapShapeMinNormalFights = Number.POSITIVE_INFINITY;
  let mapShapeMaxNormalFights = 0;
  let firstEliteDeckSizeTotal = 0;
  let firstEliteNormalFightsTotal = 0;
  const firstEliteByMonster = new Map<string, { attempts: number; wins: number }>();
  const simAbortBreakdown = emptyTerminationBreakdown();
  const nonBattleEndBreakdown = emptyTerminationBreakdown();

  const normalEncMap = new Map<string, {
    pressureProfile: PressureProfile | 'unknown';
    attempts: number;
    wins: number;
    totalHpLoss: number;
    totalTurns: number;
  }>();

  const normalProfileAgg: Record<string, {
    attempts: number;
    wins: number;
    totalHpLoss: number;
    totalTurns: number;
  }> = {};

  const normalFloorSegmentAgg: Record<Act1FloorSegmentId, {
    battles: number;
    wins: number;
    totalHpLoss: number;
    totalTurns: number;
  }> = {
    '1-5': { battles: 0, wins: 0, totalHpLoss: 0, totalTurns: 0 },
    '6-9': { battles: 0, wins: 0, totalHpLoss: 0, totalTurns: 0 },
    '10+': { battles: 0, wins: 0, totalHpLoss: 0, totalTurns: 0 },
  };

  for (const detail of details) {
    observedNormalAttempts += detail.act1BattleEnds.filter((record) => record.tier === 'normal').length;
    if (detail.act1Death?.kind === 'act1_battle' && detail.act1Death.tier === 'normal') {
      observedNormalAttempts += 1;
    }
    if (detail.mapNormalFightShape.samples > 0) {
      mapShapeSamples += detail.mapNormalFightShape.samples;
      mapShapeWeightedNormalFights += detail.mapNormalFightShape.avgNormalFights * detail.mapNormalFightShape.samples;
      mapShapeMinNormalFights = Math.min(mapShapeMinNormalFights, detail.mapNormalFightShape.minNormalFights);
      mapShapeMaxNormalFights = Math.max(mapShapeMaxNormalFights, detail.mapNormalFightShape.maxNormalFights);
    }
    if (detail.firstElite.monsterId) {
      const row = firstEliteByMonster.get(detail.firstElite.monsterId) ?? { attempts: 0, wins: 0 };
      row.attempts += 1;
      if (detail.firstElite.won) row.wins += 1;
      firstEliteByMonster.set(detail.firstElite.monsterId, row);
      firstEliteDeckSizeTotal += detail.firstElite.deckSize ?? 0;
      firstEliteNormalFightsTotal += detail.firstElite.normalFightsBefore ?? 0;
    }
    if (detail.enteredAct2) {
      enteredAct2Count += 1;
      continue;
    }
    const death = detail.act1Death;
    if (!death) {
      nonBattleEndCount += 1;
      continue;
    }
    if (death.kind === 'sim_abort') {
      simAbortCount += 1;
      ingestTerminationBreakdown(simAbortBreakdown, death.reason, death.snapshot);
      continue;
    }
    if (death.kind === 'non_battle_end') {
      nonBattleEndCount += 1;
      ingestTerminationBreakdown(nonBattleEndBreakdown, death.reason, death.snapshot);
      continue;
    }
    act1CombatGameOverCount += 1;
    deathTierCounts[death.tier] += 1;
    deathFloorSegmentCounts[death.floorSegment] += 1;
    if (death.tier === 'normal') {
      deathNormalFloorSegmentCounts[death.floorSegment] += 1;
    }
    if (death.tier === 'boss') {
      const ratio = death.hpRatioAtBossEngage;
      if (ratio != null && ratio < 0.4) bossDeathWornDownCount += 1;
      else bossDeathFreshCount += 1;
    }
    for (const choice of detail.nodeChoices) {
      nodeChoiceSumAtAct1CombatDeath[choice] = (nodeChoiceSumAtAct1CombatDeath[choice] ?? 0) + 1;
    }
    nodeChoiceDeathSamples += 1;
  }

  for (const detail of details) {
    for (const end of detail.act1BattleEnds) {
      if (end.tier !== 'normal') continue;
      const row = normalEncMap.get(end.encounterId) ?? {
        pressureProfile: end.pressureProfile,
        attempts: 0,
        wins: 0,
        totalHpLoss: 0,
        totalTurns: 0,
      };
      row.attempts += 1;
      if (end.won) row.wins += 1;
      row.totalHpLoss += end.hpLoss;
      row.totalTurns += end.turns;
      normalEncMap.set(end.encounterId, row);

      const profileKey = end.pressureProfile;
      const profileRow = normalProfileAgg[profileKey] ?? {
        attempts: 0,
        wins: 0,
        totalHpLoss: 0,
        totalTurns: 0,
      };
      profileRow.attempts += 1;
      if (end.won) profileRow.wins += 1;
      profileRow.totalHpLoss += end.hpLoss;
      profileRow.totalTurns += end.turns;
      normalProfileAgg[profileKey] = profileRow;

      const segRow = normalFloorSegmentAgg[end.floorSegment];
      segRow.battles += 1;
      if (end.won) segRow.wins += 1;
      segRow.totalHpLoss += end.hpLoss;
      segRow.totalTurns += end.turns;
    }
  }

  const normalEncounterAgg = [...normalEncMap.entries()]
    .map(([encounterId, row]) => ({
      encounterId,
      pressureProfile: row.pressureProfile,
      attempts: row.attempts,
      wins: row.wins,
      totalHpLoss: row.totalHpLoss,
      totalTurns: row.totalTurns,
      avgHpLoss: row.attempts > 0 ? row.totalHpLoss / row.attempts : 0,
      avgTurns: row.attempts > 0 ? row.totalTurns / row.attempts : 0,
      winRate: row.attempts > 0 ? row.wins / row.attempts : 0,
    }))
    .sort((left, right) => right.totalHpLoss - left.totalHpLoss || right.attempts - left.attempts);
  const firstEliteAttempts = [...firstEliteByMonster.values()].reduce((sum, row) => sum + row.attempts, 0);
  const firstEliteWins = [...firstEliteByMonster.values()].reduce((sum, row) => sum + row.wins, 0);
  const firstEliteRegression: Act1FirstEliteRegressionMetric = {
    attempts: firstEliteAttempts,
    wins: firstEliteWins,
    winRate: firstEliteAttempts > 0 ? firstEliteWins / firstEliteAttempts : 0,
    avgDeckSizeAtFirstElite: firstEliteAttempts > 0 ? firstEliteDeckSizeTotal / firstEliteAttempts : 0,
    avgNormalFightsBeforeFirstElite: firstEliteAttempts > 0 ? firstEliteNormalFightsTotal / firstEliteAttempts : 0,
    byMonsterId: Object.fromEntries([...firstEliteByMonster.entries()]
      .sort((left, right) => left[0].localeCompare(right[0]))
      .map(([monsterId, row]) => [monsterId, {
        attempts: row.attempts,
        wins: row.wins,
        winRate: row.attempts > 0 ? row.wins / row.attempts : 0,
      }])),
  };

  return {
    totalRuns: details.length,
    enteredAct2Count,
    mapNormalFightShape: {
      samples: mapShapeSamples,
      avgNormalFights: mapShapeSamples > 0 ? mapShapeWeightedNormalFights / mapShapeSamples : 0,
      minNormalFights: Number.isFinite(mapShapeMinNormalFights) ? mapShapeMinNormalFights : 0,
      maxNormalFights: mapShapeMaxNormalFights,
    },
    routeShapeByBias: mergeRouteShapeMetrics(details.map((detail) => detail.routeShapeByBias)),
    avgObservedAct1NormalAttempts: details.length > 0 ? observedNormalAttempts / details.length : 0,
    firstEliteRegression,
    act1CombatGameOverCount,
    simAbortCount,
    nonBattleEndCount,
    deathTierCounts,
    deathFloorSegmentCounts,
    deathNormalFloorSegmentCounts,
    bossDeathWornDownCount,
    bossDeathFreshCount,
    normalEncounterAgg,
    normalProfileAgg,
    normalFloorSegmentAgg,
    nodeChoiceSumAtAct1CombatDeath,
    nodeChoiceDeathSamples,
    simAbortBreakdown,
    nonBattleEndBreakdown,
  };
}

export function mergeAct1PreBossLossReports(
  reports: Act1PreBossLossPolicyReport[],
): Act1PreBossLossPolicyReport {
  if (reports.length === 0) {
    return buildAct1PreBossLossReport([]);
  }
  const merged: Act1PreBossLossPolicyReport = {
    totalRuns: reports.reduce((sum, item) => sum + item.totalRuns, 0),
    enteredAct2Count: reports.reduce((sum, item) => sum + item.enteredAct2Count, 0),
    mapNormalFightShape: { samples: 0, avgNormalFights: 0, minNormalFights: 0, maxNormalFights: 0 },
    routeShapeByBias: emptyRouteShapeByBias(),
    avgObservedAct1NormalAttempts: 0,
    firstEliteRegression: emptyFirstEliteRegression(),
    act1CombatGameOverCount: reports.reduce((sum, item) => sum + item.act1CombatGameOverCount, 0),
    simAbortCount: reports.reduce((sum, item) => sum + item.simAbortCount, 0),
    nonBattleEndCount: reports.reduce((sum, item) => sum + item.nonBattleEndCount, 0),
    deathTierCounts: { normal: 0, elite: 0, boss: 0 },
    deathFloorSegmentCounts: { '1-5': 0, '6-9': 0, '10+': 0 },
    deathNormalFloorSegmentCounts: { '1-5': 0, '6-9': 0, '10+': 0 },
    bossDeathWornDownCount: reports.reduce((sum, item) => sum + item.bossDeathWornDownCount, 0),
    bossDeathFreshCount: reports.reduce((sum, item) => sum + item.bossDeathFreshCount, 0),
    normalEncounterAgg: [],
    normalProfileAgg: {},
    normalFloorSegmentAgg: {
      '1-5': { battles: 0, wins: 0, totalHpLoss: 0, totalTurns: 0 },
      '6-9': { battles: 0, wins: 0, totalHpLoss: 0, totalTurns: 0 },
      '10+': { battles: 0, wins: 0, totalHpLoss: 0, totalTurns: 0 },
    },
    nodeChoiceSumAtAct1CombatDeath: {},
    nodeChoiceDeathSamples: reports.reduce((sum, item) => sum + item.nodeChoiceDeathSamples, 0),
    simAbortBreakdown: emptyTerminationBreakdown(),
    nonBattleEndBreakdown: emptyTerminationBreakdown(),
  };
  let mapShapeWeightedNormalFights = 0;
  let mapShapeMinNormalFights = Number.POSITIVE_INFINITY;
  let mapShapeMaxNormalFights = 0;
  let observedNormalAttemptsTotal = 0;
  let firstEliteDeckSizeTotal = 0;
  let firstEliteNormalFightsTotal = 0;
  const firstEliteByMonster = new Map<string, { attempts: number; wins: number }>();
  const routeShapeReports: Act1RouteShapeByBiasMetric[] = [];
  for (const item of reports) {
    routeShapeReports.push(item.routeShapeByBias);
    merged.mapNormalFightShape.samples += item.mapNormalFightShape.samples;
    mapShapeWeightedNormalFights += item.mapNormalFightShape.avgNormalFights * item.mapNormalFightShape.samples;
    if (item.mapNormalFightShape.samples > 0) {
      mapShapeMinNormalFights = Math.min(mapShapeMinNormalFights, item.mapNormalFightShape.minNormalFights);
      mapShapeMaxNormalFights = Math.max(mapShapeMaxNormalFights, item.mapNormalFightShape.maxNormalFights);
    }
    observedNormalAttemptsTotal += item.avgObservedAct1NormalAttempts * item.totalRuns;
    firstEliteDeckSizeTotal += item.firstEliteRegression.avgDeckSizeAtFirstElite * item.firstEliteRegression.attempts;
    firstEliteNormalFightsTotal += item.firstEliteRegression.avgNormalFightsBeforeFirstElite * item.firstEliteRegression.attempts;
    for (const [monsterId, row] of Object.entries(item.firstEliteRegression.byMonsterId)) {
      const current = firstEliteByMonster.get(monsterId) ?? { attempts: 0, wins: 0 };
      current.attempts += row.attempts;
      current.wins += row.wins;
      firstEliteByMonster.set(monsterId, current);
    }
    for (const tier of ['normal', 'elite', 'boss'] as const) {
      merged.deathTierCounts[tier] += item.deathTierCounts[tier];
    }
    for (const seg of ACT1_FLOOR_SEGMENTS) {
      merged.deathFloorSegmentCounts[seg] += item.deathFloorSegmentCounts[seg];
      merged.deathNormalFloorSegmentCounts[seg] += item.deathNormalFloorSegmentCounts[seg];
      merged.normalFloorSegmentAgg[seg].battles += item.normalFloorSegmentAgg[seg].battles;
      merged.normalFloorSegmentAgg[seg].wins += item.normalFloorSegmentAgg[seg].wins;
      merged.normalFloorSegmentAgg[seg].totalHpLoss += item.normalFloorSegmentAgg[seg].totalHpLoss;
      merged.normalFloorSegmentAgg[seg].totalTurns += item.normalFloorSegmentAgg[seg].totalTurns;
    }
    for (const [profile, row] of Object.entries(item.normalProfileAgg)) {
      const current = merged.normalProfileAgg[profile] ?? {
        attempts: 0,
        wins: 0,
        totalHpLoss: 0,
        totalTurns: 0,
      };
      current.attempts += row.attempts;
      current.wins += row.wins;
      current.totalHpLoss += row.totalHpLoss;
      current.totalTurns += row.totalTurns;
      merged.normalProfileAgg[profile] = current;
    }
    for (const [nodeType, count] of Object.entries(item.nodeChoiceSumAtAct1CombatDeath)) {
      const key = nodeType as MapNodeType;
      merged.nodeChoiceSumAtAct1CombatDeath[key] = (merged.nodeChoiceSumAtAct1CombatDeath[key] ?? 0) + (count ?? 0);
    }
    merged.simAbortBreakdown = mergeTerminationBreakdown(merged.simAbortBreakdown, item.simAbortBreakdown);
    merged.nonBattleEndBreakdown = mergeTerminationBreakdown(
      merged.nonBattleEndBreakdown,
      item.nonBattleEndBreakdown,
    );
  }
  merged.mapNormalFightShape.avgNormalFights = merged.mapNormalFightShape.samples > 0
    ? mapShapeWeightedNormalFights / merged.mapNormalFightShape.samples
    : 0;
  merged.mapNormalFightShape.minNormalFights = Number.isFinite(mapShapeMinNormalFights)
    ? mapShapeMinNormalFights
    : 0;
  merged.mapNormalFightShape.maxNormalFights = mapShapeMaxNormalFights;
  merged.routeShapeByBias = mergeRouteShapeMetrics(routeShapeReports);
  merged.avgObservedAct1NormalAttempts = merged.totalRuns > 0
    ? observedNormalAttemptsTotal / merged.totalRuns
    : 0;
  const firstEliteAttempts = [...firstEliteByMonster.values()].reduce((sum, row) => sum + row.attempts, 0);
  const firstEliteWins = [...firstEliteByMonster.values()].reduce((sum, row) => sum + row.wins, 0);
  merged.firstEliteRegression = {
    attempts: firstEliteAttempts,
    wins: firstEliteWins,
    winRate: firstEliteAttempts > 0 ? firstEliteWins / firstEliteAttempts : 0,
    avgDeckSizeAtFirstElite: firstEliteAttempts > 0 ? firstEliteDeckSizeTotal / firstEliteAttempts : 0,
    avgNormalFightsBeforeFirstElite: firstEliteAttempts > 0 ? firstEliteNormalFightsTotal / firstEliteAttempts : 0,
    byMonsterId: Object.fromEntries([...firstEliteByMonster.entries()]
      .sort((left, right) => left[0].localeCompare(right[0]))
      .map(([monsterId, row]) => [monsterId, {
        attempts: row.attempts,
        wins: row.wins,
        winRate: row.attempts > 0 ? row.wins / row.attempts : 0,
      }])),
  };

  const encMap = new Map<string, {
    pressureProfile: PressureProfile | 'unknown';
    attempts: number;
    wins: number;
    totalHpLoss: number;
    totalTurns: number;
  }>();
  for (const item of reports) {
    for (const row of item.normalEncounterAgg) {
      const current = encMap.get(row.encounterId) ?? {
        pressureProfile: row.pressureProfile,
        attempts: 0,
        wins: 0,
        totalHpLoss: 0,
        totalTurns: 0,
      };
      current.attempts += row.attempts;
      current.wins += row.wins;
      current.totalHpLoss += row.totalHpLoss;
      current.totalTurns += row.totalTurns;
      encMap.set(row.encounterId, current);
    }
  }
  merged.normalEncounterAgg = [...encMap.entries()]
    .map(([encounterId, row]) => ({
      encounterId,
      pressureProfile: row.pressureProfile,
      attempts: row.attempts,
      wins: row.wins,
      totalHpLoss: row.totalHpLoss,
      totalTurns: row.totalTurns,
      avgHpLoss: row.attempts > 0 ? row.totalHpLoss / row.attempts : 0,
      avgTurns: row.attempts > 0 ? row.totalTurns / row.attempts : 0,
      winRate: row.attempts > 0 ? row.wins / row.attempts : 0,
    }))
    .sort((left, right) => right.totalHpLoss - left.totalHpLoss || right.attempts - left.attempts);

  return merged;
}

export function runAct2EntryValidation(input: ValidationInput): Act2EntryPolicySummary[] {
  const {
    seed,
    runsPerPolicy,
    policies = walkerBasePolicies,
    characterId = 'walker',
    bypassAct1Boss = false,
    bypassAct1Midgame = false,
    bypassAct1Elite = false,
    bypassAct1ToBoss = false,
    includeAct1PreBossLossReport = false,
    onProgress,
  } = input;
  if (runsPerPolicy <= 0) throw new Error('runsPerPolicy must be positive');

  return policies.map((policy, policyIndex) => {
    const details = Array.from({ length: runsPerPolicy }, (_, runIndex) => {
      const result = simulateSingleRun(
        (seed + policyIndex * 10000 + runIndex) >>> 0,
        policy,
        characterId,
        bypassAct1Boss,
        bypassAct1Midgame,
        bypassAct1Elite,
        bypassAct1ToBoss,
      );
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
    const act1BossDefeatCount = details.filter((detail) =>
      detail.act1BossReached && !detail.enteredAct2,
    ).length;
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
      act1PreBossLossReport: includeAct1PreBossLossReport ? buildAct1PreBossLossReport(details) : undefined,
    };
  });
}
