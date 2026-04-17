import { describe, expect, test } from '@rstest/core';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { createMapRun } from '@/game/core/engine/createMapRun';
import type { MapNode } from '@/game/core/model/map';

function findNodeId(run: ReturnType<typeof createMapRun>, pred: (n: MapNode) => boolean): string {
  const n = Object.values(run.map.nodes).find(pred);
  if (!n) throw new Error('map node not found');
  return n.id;
}

function jumpToBeforeNode(run: ReturnType<typeof createMapRun>, targetId: string): void {
  const target = run.map.nodes[targetId]!;
  const prev = Object.values(run.map.nodes).find((n) => n.nextNodeIds.includes(target.id));
  if (!prev) throw new Error('no predecessor');
  run.map.currentNodeId = prev.id;
  prev.visited = true;
}

describe('shop/shopFlow', () => {
  test('BUY_SHOP_CARD 扣金币并加入牌组', () => {
    const engine = new GameEngine();
    let run = createMapRun(105);
    const shopId = findNodeId(run, (n) => n.type === 'shop');
    jumpToBeforeNode(run, shopId);
    run.meta.gold = 999;
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: shopId }).nextRun;
    const offer = run.shop!.cards[0]!;
    const beforeDeck = run.masterDeck.length;
    run = engine.dispatch(run, { type: 'BUY_SHOP_CARD', definitionId: offer.definitionId }).nextRun;
    expect(run.masterDeck.length).toBe(beforeDeck + 1);
  });
});
