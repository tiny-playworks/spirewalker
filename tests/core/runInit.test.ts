import { describe, expect, test } from '@rstest/core';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
import { buildFloor2Nodes, createMapRun } from '@/game/core/engine/createMapRun';
import { createStarterMasterDeck } from '@/game/core/engine/starterDeck';

describe('core/runInit', () => {
  test('starter deck 直接读取当前角色定义', () => {
    const walker = getCharacterDefinition('walker');
    expect(createStarterMasterDeck('walker')).toEqual(walker.starterDeck);
  });

  test('createMapRun 对同一 seed 生成稳定的起点与地图节点集合', () => {
    const a = createMapRun(77);
    const b = createMapRun(77);

    expect(a.map.currentNodeId).toBe(b.map.currentNodeId);
    expect(Object.keys(a.map.nodes)).toEqual(Object.keys(b.map.nodes));
    expect(a.meta.characterId).toBe('walker');
  });

  test('第二层地图节点全部属于 floor 2 且含 Boss 与起点营地', () => {
    const floor2 = buildFloor2Nodes(19);
    expect(Object.values(floor2).every((node) => node.floor === 2)).toBe(true);
    expect(Object.values(floor2).some((node) => node.type === 'boss')).toBe(true);
    expect(Object.values(floor2).some((node) => node.x === 0)).toBe(true);
  });
});
