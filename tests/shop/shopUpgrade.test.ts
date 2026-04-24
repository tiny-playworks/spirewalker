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

describe('shop/upgrade', () => {
  test('商店暴露 upgradePrice 且可升级 masterDeck 里的 strike', () => {
    const engine = new GameEngine();
    let run = createMapRun(42);
    const shopId = findNodeId(run, (n) => n.type === 'shop');
    jumpToBeforeNode(run, shopId);
    run.meta.gold = 999;
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: shopId }).nextRun;
    expect(typeof run.shop!.upgradePrice).toBe('number');

    const strikeIdx = run.masterDeck.indexOf('strike');
    expect(strikeIdx).toBeGreaterThanOrEqual(0);

    const priceBefore = run.shop!.upgradePrice!;
    const goldBefore = run.meta.gold;
    run = engine.dispatch(run, {
      type: 'BUY_SHOP_UPGRADE_CARD',
      masterDeckIndex: strikeIdx,
    }).nextRun;

    expect(run.masterDeck[strikeIdx]).toBe('strike+');
    expect(run.meta.gold).toBe(goldBefore - priceBefore);
    expect(run.shop!.upgradePrice).toBeUndefined();
  });

  test('金币不足时升级失败，不修改 masterDeck 或金币', () => {
    const engine = new GameEngine();
    let run = createMapRun(43);
    const shopId = findNodeId(run, (n) => n.type === 'shop');
    jumpToBeforeNode(run, shopId);
    run.meta.gold = 0;
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: shopId }).nextRun;
    const deckBefore = [...run.masterDeck];
    run = engine.dispatch(run, {
      type: 'BUY_SHOP_UPGRADE_CARD',
      masterDeckIndex: run.masterDeck.indexOf('strike'),
    }).nextRun;
    expect(run.masterDeck).toEqual(deckBefore);
    expect(run.meta.gold).toBe(0);
  });

  test('同一商店只能升级一次（upgradePrice 用完后不可再升）', () => {
    const engine = new GameEngine();
    let run = createMapRun(44);
    const shopId = findNodeId(run, (n) => n.type === 'shop');
    jumpToBeforeNode(run, shopId);
    run.meta.gold = 9999;
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: shopId }).nextRun;
    const firstIdx = run.masterDeck.indexOf('strike');
    run = engine.dispatch(run, { type: 'BUY_SHOP_UPGRADE_CARD', masterDeckIndex: firstIdx }).nextRun;
    expect(run.masterDeck[firstIdx]).toBe('strike+');
    const deckSnapshot = [...run.masterDeck];
    run = engine.dispatch(run, {
      type: 'BUY_SHOP_UPGRADE_CARD',
      masterDeckIndex: run.masterDeck.indexOf('defend'),
    }).nextRun;
    expect(run.masterDeck).toEqual(deckSnapshot);
  });
});
