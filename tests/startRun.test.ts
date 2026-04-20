import { describe, expect, test } from '@rstest/core';
import { buildInitialBattle } from '@/game/core/engine/createMvpRun';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { createStarterMasterDeck } from '@/game/core/engine/starterDeck';

describe('startRun', () => {
  test('行者 starter 固定为 v0.5 版高密度起势套牌', () => {
    const deck = createStarterMasterDeck();
    expect(deck).toHaveLength(10);
    expect(deck.filter((id) => id === 'strike')).toHaveLength(3);
    expect(deck.filter((id) => id === 'defend')).toHaveLength(3);
    expect(deck.filter((id) => id === 'prime_rhythm')).toHaveLength(2);
    expect(deck).toContain('brace_rhythm');
    expect(deck).toContain('soft_step');
  });

  test('createMapRun 会从角色定义读取生命、starter 与起始药水', () => {
    const run = createMapRun(9);
    expect(run.player.maxHp).toBe(50);
    expect(run.player.currentHp).toBe(50);
    expect(run.masterDeck).toEqual(createStarterMasterDeck());
    expect(run.meta.characterId).toBe('walker');
    expect(run.meta.potions).toEqual(['healing_dew']);
    expect(run.meta.relics).toEqual([]);
  });

  test('固定种子下前两回合一定能接触到起势牌', () => {
    for (let seed = 1; seed <= 120; seed++) {
      const battle = buildInitialBattle(seed);
      const seenInFirstTwoTurns = [...battle.player.hand, ...battle.player.drawPile].map(
        (instanceId) => battle.player.cards[instanceId]?.definitionId,
      );
      const coreCount = seenInFirstTwoTurns.filter(
        (id) => id === 'prime_rhythm' || id === 'brace_rhythm' || id === 'soft_step',
      ).length;
      expect(coreCount).toBe(4);
    }
  });

  test('第一步候选节点只提供 battle', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const run = createMapRun(seed);
      expect(run.meta.characterId).toBe('walker');
      const cur = run.map.currentNodeId!;
      const nextNodeIds = run.map.nodes[cur]!.nextNodeIds;
      expect(nextNodeIds.length).toBeGreaterThan(0);
      for (const nodeId of nextNodeIds) {
        expect(run.map.nodes[nodeId]!.type).toBe('battle');
      }
    }
  });
});
