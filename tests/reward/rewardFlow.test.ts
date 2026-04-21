import { describe, expect, test } from '@rstest/core';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
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

  test('v0.5 两条构筑都满足 2 张核心牌 + 1 个核心遗物', () => {
    const walker = getCharacterDefinition('walker');
    expect(walker.buildBranches).toHaveLength(2);
    for (const branch of walker.buildBranches) {
      expect(branch.coreCardIds).toHaveLength(2);
      expect(walker.rewardCardPool).toContain(branch.coreCardIds[0]);
      expect(walker.rewardCardPool).toContain(branch.coreCardIds[1]);
      expect(walker.rewardRelicPool).toContain(branch.coreRelicId);
    }
  });

  test('奖励池按章节分层投放，仍限定在角色奖励池内', () => {
    const characterPool = new Set(getCharacterDefinition('walker').rewardCardPool);
    const act1 = generateCardRewardChoices(1, 0x1234, 'normal', 'walker', 1);
    const act3 = generateCardRewardChoices(1, 0x1234, 'boss', 'walker', 3);

    for (const card of [...act1, ...act3]) {
      expect(characterPool.has(card)).toBe(true);
    }
    expect(act1).not.toEqual(act3);
  });
});
