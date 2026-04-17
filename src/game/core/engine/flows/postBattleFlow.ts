import type { GameCommand } from '../../commands/types';
import { CARD_DEFINITIONS } from '../../definitions/cards/starter';
import { MAX_POTIONS, POTION_DEFINITIONS } from '../../definitions/potions';
import { applyRelicPickupEffect, RELIC_DEFINITIONS, rollBossRelicReward } from '../../definitions/relics';
import type { GameEvent } from '../../events/types';
import type { RewardItem } from '../../model/reward';
import type { RunState } from '../../model/run';
import { buildFloor2Nodes } from '../createMapRun';
import { generateCardRewardChoices } from '../generateRewardChoices';
import { rollPostBattlePotionOffer, skipCardGoldAmount } from '../postBattleExtras';
import { rewardEncounterTierFromRun } from '../rewardEncounter';
import { hashMapNodeId } from './shared';

const BASE_REWARD_CARD_GOLD = 15;

/** naobao：战斗胜利 → RewardState → screen reward */
export function leaveBattleToRewardFlow(run: RunState, events: GameEvent[]): void {
  const battle = run.battle;
  if (!battle || battle.phase !== 'victory') return;

  const curId = run.map.currentNodeId;
  const tier = rewardEncounterTierFromRun(run);
  const salt = (run.seed ^ run.meta.gold ^ 0xdec0de ^ hashMapNodeId(curId ?? '')) >>> 0;
  const cards = generateCardRewardChoices(run.seed, salt, tier);

  const items: RewardItem[] = [{ type: 'card_choice', cards }];
  if (tier === 'elite') items.push({ type: 'gold', amount: 25 });
  if (tier === 'boss') {
    items.push({ type: 'gold', amount: 45 });
    const relicId = rollBossRelicReward(run.seed, salt, run.meta.relics);
    if (relicId) items.push({ type: 'relic', relicId });
  }
  const potionId = rollPostBattlePotionOffer(run.seed, salt, tier, run.meta.potions.length);
  if (potionId) items.push({ type: 'potion', potionId });

  run.reward = {
    items,
    claimed: false,
  };
  run.battle = undefined;
  run.screen = { type: 'reward' };
  events.push({ type: 'ENTERED_REWARD_FROM_BATTLE' });
}

function settlePostBattleReward(
  run: RunState,
  events: GameEvent[],
  pick: { kind: 'card'; definitionId: string } | { kind: 'skip_card' },
): void {
  if (run.screen.type !== 'reward' || !run.reward || run.reward.claimed) return;

  const tier = rewardEncounterTierFromRun(run);

  if (pick.kind === 'card') {
    run.masterDeck.push(pick.definitionId);
  }

  let goldGain = pick.kind === 'card' ? BASE_REWARD_CARD_GOLD : skipCardGoldAmount(tier);
  for (const it of run.reward.items) {
    if (it.type === 'gold') goldGain += it.amount;
  }
  for (const it of run.reward.items) {
    if (it.type === 'relic' && RELIC_DEFINITIONS[it.relicId]) {
      if (!run.meta.relics.includes(it.relicId)) {
        run.meta.relics.push(it.relicId);
        applyRelicPickupEffect(run, it.relicId);
      }
    }
  }
  for (const it of run.reward.items) {
    if (it.type === 'potion' && POTION_DEFINITIONS[it.potionId]) {
      if (run.meta.potions.length < MAX_POTIONS) {
        run.meta.potions.push(it.potionId);
      }
    }
  }

  run.reward = undefined;
  run.meta.gold += goldGain;

  const mapNodeId = run.map.currentNodeId;
  const mapNode = mapNodeId ? run.map.nodes[mapNodeId] : undefined;
  const beatBoss = mapNode?.type === 'boss';

  if (beatBoss && run.meta.floor === 1) {
    run.meta.floor = 2;
    const f2 = buildFloor2Nodes((run.seed ^ 0xaced) >>> 0);
    const f2Start = Object.keys(f2).find((id) => f2[id]!.x === 0) ?? Object.keys(f2)[0]!;
    run.map = {
      nodes: f2,
      currentNodeId: f2Start,
    };
    run.screen = { type: 'map' };
  } else if (beatBoss && run.meta.floor === 2) {
    run.screen = { type: 'victory' };
  } else {
    run.screen = { type: 'map' };
  }

  events.push({ type: 'RETURNED_TO_MAP_FROM_BATTLE' });
}

export function selectRewardCardFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'SELECT_REWARD_CARD' }>,
  events: GameEvent[],
): void {
  if (run.screen.type !== 'reward' || !run.reward || run.reward.claimed) return;
  const { definitionId } = command;
  if (!CARD_DEFINITIONS[definitionId]) return;

  const choice = run.reward.items.find((i) => i.type === 'card_choice');
  if (!choice || choice.type !== 'card_choice') return;
  if (!choice.cards.includes(definitionId)) return;

  settlePostBattleReward(run, events, { kind: 'card', definitionId });
}

export function takeRewardGoldFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'TAKE_REWARD_GOLD' }>,
  events: GameEvent[],
): void {
  if (run.screen.type !== 'reward' || !run.reward || run.reward.claimed) return;
  const tier = rewardEncounterTierFromRun(run);
  if (command.amount !== skipCardGoldAmount(tier)) return;
  const choice = run.reward.items.find((i) => i.type === 'card_choice');
  if (!choice || choice.type !== 'card_choice') return;
  settlePostBattleReward(run, events, { kind: 'skip_card' });
}
