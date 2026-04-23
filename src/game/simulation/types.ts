import type { RewardEncounterTier } from '@/game/core/engine/generateRewardChoices';
import type { GameCommand } from '@/game/core/commands/types';
import type { PressureProfile } from '@/game/core/definitions/encounters';
import type { BattleState, MonsterIntent } from '@/game/core/model/battle';
import type { MapNode } from '@/game/core/model/map';
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

export type Act1ValidationSummary = {
  policyId: string;
  totalRuns: number;
  normal: Act1StageMetric;
  firstElite: Act1StageMetric;
  boss: Act1StageMetric;
  avgTurns: number;
  avgHpLoss: number;
  pressureProfileBreakdown: Act1PressureMetric[];
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
