import { describe, expect, test } from '@rstest/core';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { isLegalMapStep } from '@/game/core/model/mapGraph';

function findNodeByType(seed: number, type: 'shop' | 'event' | 'rest' | 'treasure') {
  const run = createMapRun(seed);
  return Object.values(run.map.nodes).find((node) => node.type === type);
}

describe('core/mapProgression', () => {
  test('不能一步跳到不相邻的节点', () => {
    const engine = new GameEngine();
    const run = createMapRun(31);
    const currentNodeId = run.map.currentNodeId!;
    const farNode = Object.values(run.map.nodes).find(
      (node) => node.x >= 2 && !isLegalMapStep(run.map.nodes, currentNodeId, node.id),
    );

    expect(farNode).toBeDefined();
    const { nextRun } = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: farNode!.id });

    expect(nextRun.map.currentNodeId).toBe(currentNodeId);
    expect(nextRun.screen.type).toBe('map');
  });

  test('选中合法首步后会剪枝未选择的营地分支', () => {
    const engine = new GameEngine();
    const run = createMapRun(32);
    const campId = run.map.currentNodeId!;
    const nextNodeIds = run.map.nodes[campId]!.nextNodeIds;
    const picked = nextNodeIds[0]!;
    const unpicked = nextNodeIds.find((nodeId) => nodeId !== picked)!;

    const { nextRun } = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: picked });

    expect(nextRun.map.nodes[campId]!.nextNodeIds).toEqual([picked]);
    expect(nextRun.map.nodes[unpicked]!.nextNodeIds).toEqual([]);
  });

  test('地图进入商店节点后会切到商店屏并生成库存', () => {
    let seed = 1;
    while (!findNodeByType(seed, 'shop') && seed < 100) seed += 1;
    const run = createMapRun(seed);
    const engine = new GameEngine();
    const shopNode = Object.values(run.map.nodes).find((node) => node.type === 'shop')!;
    const predecessor = Object.values(run.map.nodes).find((node) => node.nextNodeIds.includes(shopNode.id))!;

    run.map.currentNodeId = predecessor.id;
    predecessor.visited = true;

    const { nextRun } = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: shopNode.id });

    expect(nextRun.screen.type).toBe('shop');
    expect(nextRun.shop?.cards.length).toBeGreaterThan(0);
  });
});
