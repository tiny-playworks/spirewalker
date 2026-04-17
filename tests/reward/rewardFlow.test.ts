import { describe, expect, test } from '@rstest/core';
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
});
