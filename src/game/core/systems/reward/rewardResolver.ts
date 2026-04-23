import { CARD_DEFINITIONS } from '../../definitions/cards/starter';
import { MAX_POTIONS, POTION_DEFINITIONS } from '../../definitions/potions';
import { applyRelicPickupEffect, RELIC_DEFINITIONS } from '../../definitions/relics';
import type { GameEvent } from '../../events/types';
import { buildAct2EntryNodes } from '../../engine/createMapRun';
import type { RunState } from '../../model/run';
import { buildActNodes, isLastAct } from '../../engine/createMapRun';
import { globalFloorFor } from '../../engine/generateBranchingFloor';
import { rewardEncounterTierFromRun } from '../../engine/rewardEncounter';
import { skipCardGoldAmount } from '../../engine/postBattleExtras';

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

  let goldGain = pick.kind === 'skip_card' ? skipCardGoldAmount(tier) : 0;
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
  const validationSegmentEnded = Boolean(
    run.meta.validationSegment === 'act2_entry'
      && mapNode
      && mapNode.type === 'battle'
      && mapNode.nextNodeIds.length === 0,
  );
  if (validationSegmentEnded) {
    run.meta.validationCompleted = true;
    run.screen = { type: 'victory' };
    events.push({ type: 'RETURNED_TO_MAP_FROM_BATTLE' });
    return;
  }
  if (beatBoss && !isLastAct(run.meta.act)) {
    const nextAct = (run.meta.act + 1) as 2 | 3;
    run.meta.act = nextAct;
    run.meta.actFloor = 1;
    const enteringAct2Validation = nextAct === 2;
    const nextMap = enteringAct2Validation
      ? buildAct2EntryNodes((run.seed ^ nextAct * 0xaced) >>> 0)
      : buildActNodes(nextAct, (run.seed ^ nextAct * 0xaced) >>> 0);
    const nextStart = Object.keys(nextMap).find((id) => nextMap[id]!.depth === 1) ?? Object.keys(nextMap)[0]!;
    run.meta.floor = globalFloorFor(nextAct, 1);
    if (enteringAct2Validation) {
      run.meta.validationSegment = 'act2_entry';
      run.meta.validationCompleted = false;
      run.meta.enteredAct2EliteBranch = false;
    } else {
      delete run.meta.validationSegment;
      run.meta.validationCompleted = false;
      run.meta.enteredAct2EliteBranch = false;
    }
    run.map = { nodes: nextMap, currentNodeId: nextStart };
    run.screen = { type: 'map' };
  } else if (beatBoss && isLastAct(run.meta.act)) {
    run.screen = { type: 'victory' };
  } else {
    run.screen = { type: 'map' };
  }

  events.push({ type: 'RETURNED_TO_MAP_FROM_BATTLE' });
}
