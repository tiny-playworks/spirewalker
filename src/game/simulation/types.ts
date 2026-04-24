import type { RewardEncounterTier } from '@/game/core/engine/generateRewardChoices';
import type { GameCommand } from '@/game/core/commands/types';
import type { PressureProfile } from '@/game/core/definitions/encounters';
import type { BattleState, MonsterIntent } from '@/game/core/model/battle';
import type { MapNode, MapNodeType } from '@/game/core/model/map';
import type { RewardState } from '@/game/core/model/reward';
import type { RunState } from '@/game/core/model/run';
import type { ShopState } from '@/game/core/model/shop';
import type { CardDefinition } from '@/game/core/model/card';

export type SimulationSummary = {
  totalRuns: number;
  winRate: number;
  avgTurnsPerCombat: number;
  momentumOpenedByTurn2Rate: number;
  defenseBranchRate: number;
  burstBranchRate: number;
  pollutedDeckRate: number;
};

export type Act2EntryEncounterMetric = {
  encounterId: string;
  attempts: number;
  survives: number;
  surviveRate: number;
  avgHpLoss: number;
  avgTurns: number;
};

export type Act2EntryPolicySummary = {
  policyId: string;
  totalRuns: number;
  act1BossReachCount: number;
  act1BossReachRate: number;
  act1BossDefeatCount: number;
  act1BossDefeatRate: number;
  act2EntrySamples: number;
  act2Floor13SurviveCount: number;
  act2Floor13SurviveRate: number;
  act2Floor15SurviveCount: number;
  act2Floor15SurviveRate: number;
  act2FrontWinRate: number;
  act2AvgHpLoss: number;
  act2AvgTurns: number;
  act2EliteBranchEnterCount: number;
  act2EliteBranchEnterRate: number;
  act2EliteBranchSamples: number;
  act2EliteBranchSurviveRate: number;
  encounterBreakdown: Act2EntryEncounterMetric[];
  /** 仅当 `includeAct1PreBossLossReport` 为 true 时填充：Boss 前 Act1 损耗分解（观测用） */
  act1PreBossLossReport?: Act1PreBossLossPolicyReport;
};

/** Act1 地图层数分段（用于 Boss 前漏斗观测） */
export type Act1FloorSegmentId = '1-7' | '8-13' | '14+';

/** 单场 Act1 战斗结束（仅统计 act===1 的战斗，含胜/负结算前记录胜场；败场仅体现在 death） */
export type Act1PreBossBattleEndRecord = {
  actFloor: number;
  floorSegment: Act1FloorSegmentId;
  tier: 'normal' | 'elite' | 'boss';
  encounterId: string;
  pressureProfile: PressureProfile | 'unknown';
  won: boolean;
  hpLoss: number;
  turns: number;
};

/** 终局 screen 粗分桶（观测用） */
export type Act1TerminationScreenBucket =
  | 'battle'
  | 'map'
  | 'reward'
  | 'shop'
  | 'rest'
  | 'event'
  | 'game_over'
  | 'victory'
  | 'other';

/** 终局 floor 粗分桶：Act1 层段 + Boss 节点 + Act2+ */
export type Act1TerminationFloorBucket = Act1FloorSegmentId | 'boss' | 'act2_plus';

export type Act1SimAbortReason =
  | 'battle_command_limit'
  | 'battle_no_progress_state'
  | 'battle_no_progress_combat'
  | 'battle_no_progress_both'
  | 'screen_limit'
  | 'other';

/** Act2 入口校验里 non_battle_end 的粗因（与 Act1 全量 trace 的 Act1NonBattleEndReason 区分） */
export type Act1PreBossNonBattleEndReason =
  | 'map_no_legal_next_nodes'
  | 'game_over_non_act1_combat_death'
  | 'other';

/** 单次 sim_abort / non_battle_end 时的状态快照（观测用） */
export type Act1TerminationSnapshot = {
  screenBucket: Act1TerminationScreenBucket;
  act: 1 | 2 | 3;
  actFloor: number;
  floorBucket: Act1TerminationFloorBucket;
  nodeDepth: number | null;
  recentNodeType: MapNodeType | 'none';
  recentScreenTransitions: string[];
  battleTurn: number | null;
  aliveEnemyCount: number | null;
  enemyTotalHp: number | null;
  playerHp: number | null;
  playerBlock: number | null;
  encounterId: string | null;
  mapNextNodesCount: number | null;
  mapNoLegalNext: boolean | null;
};

export type Act1TerminationPolicyBreakdown = {
  samples: number;
  byScreenBucket: Partial<Record<Act1TerminationScreenBucket, number>>;
  byFloorBucket: Partial<Record<Act1TerminationFloorBucket, number>>;
  /** sim_abort: Act1SimAbortReason；non_battle_end: Act1PreBossNonBattleEndReason */
  byReason: Record<string, number>;
  byRecentNodeType: Partial<Record<MapNodeType | 'none', number>>;
  /** recentScreenTransitions 整条链（用 \" > \" 拼接）出现次数，用于扫常见卡死路径 */
  transitionTailHistogram: Record<string, number>;
  battleSub: {
    samples: number;
    byAbortReason: Record<string, number>;
    sumBattleTurn: number;
    sumAliveEnemy: number;
    sumEnemyHp: number;
    sumPlayerHp: number;
    sumPlayerBlock: number;
  };
  mapSub: {
    samples: number;
    zeroNextNodes: number;
    sumNextNodesCount: number;
  };
};

export type Act1PreBossDeathDetail =
  | {
    kind: 'act1_battle';
    tier: 'normal' | 'elite' | 'boss';
    actFloor: number;
    floorSegment: Act1FloorSegmentId;
    encounterId: string;
    pressureProfile: PressureProfile | 'unknown';
    /** 仅当死于 Boss 时有值：进入 Boss 战时的当前 hp / maxHp */
    hpRatioAtBossEngage: number | null;
  }
  | { kind: 'sim_abort'; reason: Act1SimAbortReason; snapshot: Act1TerminationSnapshot }
  | { kind: 'non_battle_end'; reason: Act1PreBossNonBattleEndReason; snapshot: Act1TerminationSnapshot };

export type Act1PreBossLossPolicyReport = {
  totalRuns: number;
  /** 进入 Act2 的 run 数 */
  enteredAct2Count: number;
  /** 自然 game_over 于 Act1 战斗 */
  act1CombatGameOverCount: number;
  simAbortCount: number;
  nonBattleEndCount: number;
  /** 死于 normal / elite / boss（Act1 战斗 game_over） */
  deathTierCounts: Record<'normal' | 'elite' | 'boss', number>;
  /** 上述死亡按 floor 段 */
  deathFloorSegmentCounts: Record<Act1FloorSegmentId, number>;
  /** 仅 normal 死亡按 floor 段 */
  deathNormalFloorSegmentCounts: Record<Act1FloorSegmentId, number>;
  /** 死于 Boss 且进 Boss 时 hp 占比 < 40%（耗残） */
  bossDeathWornDownCount: number;
  /** 死于 Boss 且进 Boss 时 hp 占比 >= 40% */
  bossDeathFreshCount: number;
  /** Boss 前 normal：按 encounter 聚合（按 totalHpLoss 降序为主漏斗参考） */
  normalEncounterAgg: Array<{
    encounterId: string;
    pressureProfile: PressureProfile | 'unknown';
    attempts: number;
    wins: number;
    totalHpLoss: number;
    totalTurns: number;
    avgHpLoss: number;
    avgTurns: number;
    winRate: number;
  }>;
  /** Boss 前 normal：按 pressureProfile 聚合 */
  normalProfileAgg: Record<string, {
    attempts: number;
    wins: number;
    totalHpLoss: number;
    totalTurns: number;
  }>;
  /** Boss 前 normal：按 floor 段聚合 */
  normalFloorSegmentAgg: Record<Act1FloorSegmentId, {
    battles: number;
    wins: number;
    totalHpLoss: number;
    totalTurns: number;
  }>;
  /** 死于 Act1 战斗的 run：各 map 节点类型被选择次数之和（用于路线/资源倾向观测） */
  nodeChoiceSumAtAct1CombatDeath: Partial<Record<MapNodeType, number>>;
  nodeChoiceDeathSamples: number;
  /** sim_abort 归因（未记为 Act1 战斗 game_over 的终局） */
  simAbortBreakdown: Act1TerminationPolicyBreakdown;
  /** non_battle_end 归因 */
  nonBattleEndBreakdown: Act1TerminationPolicyBreakdown;
};

export type Act1StageMetric = {
  attempts: number;
  wins: number;
  winRate: number;
  avgTurns: number;
  avgHpLoss: number;
};

export type Act1PressureMetric = {
  profile: PressureProfile;
  fights: number;
  wins: number;
  winRate: number;
  avgTurns: number;
  avgHpLoss: number;
};

export type Act1NodeChoiceMetric = {
  type: MapNodeType;
  count: number;
  rate: number;
};

export type Act1DeathStage = 'normal' | 'elite' | 'boss' | 'non_battle' | 'survived';

export type Act1DeathStageMetric = {
  stage: Act1DeathStage;
  count: number;
  rate: number;
};

export type Act1NonBattleEndReason =
  | 'map_no_legal_nodes_before_boss'
  | 'invalid_map_choice'
  | 'screen_limit_map'
  | 'screen_limit_battle'
  | 'screen_limit_reward'
  | 'screen_limit_shop'
  | 'screen_limit_event'
  | 'screen_limit_rest'
  | 'battle_command_limit'
  | 'no_progress_loop_playable'
  | 'no_progress_loop_endturn';

export type BattleGuardrailMode = 'baseline_200' | 'progress_guard';

export type Act1TraceNode = {
  id: string;
  type: MapNodeType;
  depth: number;
  act: number;
};

export type Act1TraceScreenTransition = {
  from: string;
  to: string;
  command: string;
  actFloor: number;
  nodeId: string | null;
  nodeDepth: number | null;
};

export type Act1NonBattleTrace = {
  seed: number;
  policyId: string;
  guardrailMode: BattleGuardrailMode;
  reason: Act1NonBattleEndReason;
  screen: string;
  actFloor: number;
  nodeId: string | null;
  nodeDepth: number | null;
  battleTurn: number | null;
  aliveEnemyCount: number | null;
  playerHp: number | null;
  enemyTotalHp: number | null;
  enemyTotalEffectiveHp: number | null;
  assertions: string[];
  recentNodeHistory: Act1TraceNode[];
  recentScreenTransitions: Act1TraceScreenTransition[];
  nextNodes: Array<{
    id: string;
    type: MapNodeType;
    depth: number;
  }>;
};

export type Act1NonBattleReasonMetric = {
  reason: Act1NonBattleEndReason;
  count: number;
  rate: number;
  exampleSeeds: number[];
};

export type Act1BattleTimelineEntry = {
  battleIndex: number;
  encounterId: string;
  tier: 'normal' | 'elite' | 'boss';
  won: boolean | null;
};

export type Act1SummaryInvariantTrace = {
  seed: number;
  policyId: string;
  guardrailMode: BattleGuardrailMode;
  reason: 'summary_invariant_failed';
  assertions: string[];
  encounterTiersVisited: Array<'normal' | 'elite' | 'boss'>;
  firstEliteEncounterId: string | null;
  firstEliteBattleIndex: number | null;
  deathEncounterTier: 'normal' | 'elite' | 'boss' | null;
  deathEncounterId: string | null;
  battleTimeline: Act1BattleTimelineEntry[];
};

export type Act1SummaryInvariantMetric = {
  reason: 'summary_invariant_failed';
  count: number;
  rate: number;
  exampleSeeds: number[];
};

export type Act1ValidationSummary = {
  policyId: string;
  guardrailMode: BattleGuardrailMode;
  totalRuns: number;
  normal: Act1StageMetric;
  elite: Act1StageMetric;
  firstElite: Act1StageMetric;
  firstEliteDeathsByMonsterId: Record<string, number>;
  firstEliteAttemptsByMonsterId: Record<string, number>;
  firstEliteWinRateByMonsterId: Record<string, number>;
  boss: Act1StageMetric;
  anyEliteRuns: number;
  anyEliteRate: number;
  avgEliteFightsPerRun: number;
  avgNormalBeforeBoss: number;
  avgEliteBeforeBoss: number;
  avgTurns: number;
  avgHpLoss: number;
  pressureProfileBreakdown: Act1PressureMetric[];
  nodeChoiceBreakdown: Act1NodeChoiceMetric[];
  deathStageBreakdown: Act1DeathStageMetric[];
  nonBattleBreakdown: Act1NonBattleReasonMetric[];
  nonBattleTraces: Act1NonBattleTrace[];
  summaryInvariantBreakdown: Act1SummaryInvariantMetric[];
  summaryInvariantTraces: Act1SummaryInvariantTrace[];
};

export type SimulationPlayableCommand = {
  command: Extract<GameCommand, { type: 'PLAY_CARD' }>;
  card: CardDefinition;
  targetIntent: MonsterIntent | null;
};

export type SimulationBattleContext = {
  run: RunState;
  battle: BattleState;
  playableCommands: SimulationPlayableCommand[];
  projectedIncomingDamage: number;
  stagnantBattleStateSteps: number;
  stagnantCombatSteps: number;
};

export type SimulationMapContext = {
  run: RunState;
  currentNodeId: string;
  nextNodes: MapNode[];
};

export type SimulationRewardContext = {
  run: RunState;
  reward: RewardState;
  tier: RewardEncounterTier;
  offeredCards: string[];
  skipGoldAmount: number;
};

export type SimulationShopContext = {
  run: RunState;
  shop: ShopState;
};

export type SimulationEventContext = {
  run: RunState;
  eventId: string;
  availableOptionIds: string[];
};

export interface SimulationPolicy {
  id: string;
  chooseBattleCommand(ctx: SimulationBattleContext): GameCommand;
  chooseMapNode(ctx: SimulationMapContext): string;
  chooseReward(
    ctx: SimulationRewardContext,
  ): { type: 'card'; definitionId: string } | { type: 'gold' };
  chooseShopAction(ctx: SimulationShopContext): GameCommand | { type: 'leave_shop' };
  chooseEventOption(ctx: SimulationEventContext): string;
}
