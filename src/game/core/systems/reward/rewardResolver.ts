import { CARD_DEFINITIONS } from '../../definitions/cards/starter';
import { MAX_POTIONS, POTION_DEFINITIONS } from '../../definitions/potions';
import { applyRelicPickupEffect, RELIC_DEFINITIONS } from '../../definitions/relics';
import type { GameEvent } from '../../events/types';
import type { RunState } from '../../model/run';
import { buildFloor2Nodes } from '../../engine/createMapRun';
import { rewardEncounterTierFromRun } from '../../engine/rewardEncounter';
import { skipCardGoldAmount } from '../../engine/postBattleExtras';

const BASE_REWARD_CARD_GOLD = 15;

export function canResolveRewardCard(run: RunState, definitionId: string): boolean {
  if (run.screen.type !== 'reward' || !run.reward || run.reward.claimed) return false;
  if (!CARD_DEFINITIONS[definitionId]) return false;
  const choice = run.reward.items.find((i) => i.type === 'card_choice');
  return Boolean(choice && choice.type === 'card_choice' && choice.cards.includes(definitionId));
}

export function canResolveRewardGold(run: RunState, amount: number): boolean {
  if (run.screen.type !== 'reward' || !run.reward || run.reward.claimed) return false;
  const tier = rewardEncounterTierFromRun(run);
  if (amount !== skipCardGoldAmount(tier)) return false;
  const choice = run.reward.items.find((i) => i.type === 'card_choice');
  return Boolean(choice && choice.type === 'card_choice');
}

export function resolveRewardPick(
  run: RunState,
  events: GameEvent[],
  pick: { kind: 'card'; definitionId: string } | { kind: 'skip_card' },
): void {
  if (run.screen.type !== 'reward' || !run.reward || run.reward.claimed) return;
  const tier = rewardEncounterTierFromRun(run);
  if (pick.kind === 'card') run.masterDeck.push(pick.definitionId);

  let goldGain = pick.kind === 'card' ? BASE_REWARD_CARD_GOLD : skipCardGoldAmount(tier);
  for (const it of run.reward.items) if (it.type === 'gold') goldGain += it.amount;
  for (const it of run.reward.items) {
    if (it.type === 'relic' && RELIC_DEFINITIONS[it.relicId] && !run.meta.relics.includes(it.relicId)) {
      run.meta.relics.push(it.relicId);
      applyRelicPickupEffect(run, it.relicId);
    }
  }
  for (const it of run.reward.items) {
    if (it.type === 'potion' && POTION_DEFINITIONS[it.potionId] && run.meta.potions.length < MAX_POTIONS) {
      run.meta.potions.push(it.potionId);
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
    run.map = { nodes: f2, currentNodeId: f2Start };
    run.screen = { type: 'map' };
  } else if (beatBoss && run.meta.floor === 2) run.screen = { type: 'victory' };
  else run.screen = { type: 'map' };

  events.push({ type: 'RETURNED_TO_MAP_FROM_BATTLE' });
}
