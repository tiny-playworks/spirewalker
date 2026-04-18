import { describe, expect, test } from '@rstest/core';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { createStarterMasterDeck } from '@/game/core/engine/starterDeck';

describe('startRun', () => {
  test('初始卡组包含 momentum 入口与节奏修复牌', () => {
    const deck = createStarterMasterDeck();
    expect(deck).toHaveLength(10);
    expect(deck.filter((id) => id === 'strike')).toHaveLength(4);
    expect(deck.filter((id) => id === 'defend')).toHaveLength(4);
    expect(deck).toContain('prime_rhythm');
    expect(deck).toContain('steady_step');
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
