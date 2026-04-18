import { describe, expect, test } from '@rstest/core';
import {
  MOMENTUM_PAYOFF_CARD_IDS,
  MOMENTUM_SETUP_CARD_IDS,
} from '@/game/core/definitions/cards/starter';
import {
  MOMENTUM_BURST_RELIC_IDS,
  MOMENTUM_FLOW_RELIC_IDS,
} from '@/game/core/definitions/relics';
import { generateCardRewardChoices } from '@/game/core/engine/generateRewardChoices';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { createMapRun } from '@/game/core/engine/createMapRun';

function firstBattleFromCamp(run: ReturnType<typeof createMapRun>): string {
  const cur = run.map.currentNodeId!;
  const b = run.map.nodes[cur]!.nextNodeIds.find((id) => run.map.nodes[id]!.type === 'battle');
  if (!b) throw new Error('no battle from camp');
  return b;
}

describe('reward/rewardFlow', () => {
  test('战斗胜利后奖励可选牌并回到地图', () => {
    const engine = new GameEngine();
    let run = createMapRun(106);
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: firstBattleFromCamp(run) }).nextRun;
    run.battle!.phase = 'victory';
    run = engine.dispatch(run, { type: 'LEAVE_BATTLE_TO_REWARD' }).nextRun;
    const choice = run.reward!.items.find((i) => i.type === 'card_choice');
    if (!choice || choice.type !== 'card_choice') throw new Error('missing card choice');
    run = engine.dispatch(run, { type: 'SELECT_REWARD_CARD', definitionId: choice.cards[0]! }).nextRun;
    expect(run.screen.type).toBe('map');
  });

  test('v0.3 至少存在两条可描述的构筑路径', () => {
    const burstPathCards = ['momentum', 'tempo_guard', 'burst_strike', 'snap_strike'];
    const flowPathCards = ['prime_rhythm', 'brace_rhythm', 'cash_flow', 'release_flow'];

    expect(burstPathCards.every((id) => MOMENTUM_SETUP_CARD_IDS.includes(id as never) || MOMENTUM_PAYOFF_CARD_IDS.includes(id as never))).toBe(true);
    expect(flowPathCards.every((id) => MOMENTUM_SETUP_CARD_IDS.includes(id as never) || MOMENTUM_PAYOFF_CARD_IDS.includes(id as never))).toBe(true);
    expect(burstPathCards.length).toBeGreaterThanOrEqual(4);
    expect(flowPathCards.length).toBeGreaterThanOrEqual(4);
    expect(MOMENTUM_BURST_RELIC_IDS.length).toBeGreaterThanOrEqual(1);
    expect(MOMENTUM_FLOW_RELIC_IDS.length).toBeGreaterThanOrEqual(1);
  });

  test('高阶奖励池会持续给出路线牌', () => {
    const seen = new Set<string>();
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
      for (const card of generateCardRewardChoices(seed, seed ^ 0x1234, 'elite')) {
        seen.add(card);
      }
    }

    expect([...seen].some((id) => MOMENTUM_SETUP_CARD_IDS.includes(id as never))).toBe(true);
    expect([...seen].some((id) => MOMENTUM_PAYOFF_CARD_IDS.includes(id as never))).toBe(true);
  });
});
