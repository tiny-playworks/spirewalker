import type { GameCommand } from '../../commands/types';
import { CARD_DEFINITIONS } from '../../definitions/cards/starter';
import type { GameEvent } from '../../events/types';
import type { RunState } from '../../model/run';
import { generateBattleRewards } from './rewardGenerator';
import { canResolveRewardCard, canResolveRewardGold, resolveRewardPick } from './rewardResolver';
import { skipCardGoldAmount } from '../../engine/postBattleExtras';
import { rewardEncounterTierFromRun } from '../../engine/rewardEncounter';
import { hashMapNodeId } from '../common/runGuards';

export function leaveBattleToRewardFlow(run: RunState, events: GameEvent[]): void {
  const battle = run.battle;
  if (!battle || battle.phase !== 'victory') return;
  const curId = run.map.currentNodeId;
  const tier = rewardEncounterTierFromRun(run);
  const salt = (run.seed ^ run.meta.gold ^ 0xdec0de ^ hashMapNodeId(curId ?? '')) >>> 0;
  const items = generateBattleRewards({
    seed: run.seed,
    salt,
    tier,
    ownedRelicIds: run.meta.relics,
    potionCount: run.meta.potions.length,
  });
  run.reward = { items, claimed: false };
  run.battle = undefined;
  run.screen = { type: 'reward' };
  events.push({ type: 'ENTERED_REWARD_FROM_BATTLE' });
}

export function selectRewardCardFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'SELECT_REWARD_CARD' }>,
  events: GameEvent[],
): void {
  const { definitionId } = command;
  if (!CARD_DEFINITIONS[definitionId]) return;
  if (!canResolveRewardCard(run, definitionId)) return;
  resolveRewardPick(run, events, { kind: 'card', definitionId });
}

export function takeRewardGoldFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'TAKE_REWARD_GOLD' }>,
  events: GameEvent[],
): void {
  const tier = rewardEncounterTierFromRun(run);
  if (command.amount !== skipCardGoldAmount(tier)) return;
  if (!canResolveRewardGold(run, command.amount)) return;
  resolveRewardPick(run, events, { kind: 'skip_card' });
}
