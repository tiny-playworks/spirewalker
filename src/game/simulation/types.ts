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
  | 'battle_no_progress';

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

export type Act1ValidationSummary = {
  policyId: string;
  guardrailMode: BattleGuardrailMode;
  totalRuns: number;
  normal: Act1StageMetric;
  elite: Act1StageMetric;
  firstElite: Act1StageMetric;
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
