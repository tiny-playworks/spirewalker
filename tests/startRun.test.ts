import { describe, expect, test } from '@rstest/core';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { createStarterMasterDeck } from '@/game/core/engine/starterDeck';

describe('startRun', () => {
  test('行者 starter 固定为三章制版本的 10 张起始套牌', () => {
    const deck = createStarterMasterDeck();
    expect(deck).toHaveLength(10);
    expect(deck.filter((id) => id === 'strike')).toHaveLength(3);
    expect(deck.filter((id) => id === 'defend')).toHaveLength(3);
    expect(deck.filter((id) => id === 'prime_rhythm')).toHaveLength(1);
    expect(deck).toContain('brace_rhythm');
    expect(deck).toContain('burst_strike');
    expect(deck).toContain('measured_rest');
  });

  test('createMapRun 会从角色定义读取生命、starter 与起始药水', () => {
    const run = createMapRun(9);
    expect(run.player.maxHp).toBe(50);
    expect(run.player.currentHp).toBe(50);
    expect(run.masterDeck).toEqual(createStarterMasterDeck());
    expect(run.meta.characterId).toBe('walker');
    expect(run.meta.potions).toEqual(['healing_dew']);
    expect(run.meta.relics).toEqual([]);
    expect(run.meta.gold).toBe(50);
  });

  test('starter 用 4 张节奏牌覆盖起势、防守、兑现与恢复', () => {
    const deck = createStarterMasterDeck();
    const coreCount = deck.filter(
      (id) => (
        id === 'prime_rhythm'
        || id === 'brace_rhythm'
        || id === 'burst_strike'
        || id === 'measured_rest'
      ),
    ).length;
    expect(coreCount).toBe(4);
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
