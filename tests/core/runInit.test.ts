import { describe, expect, test } from '@rstest/core';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
import { act2EntryEncounterWhitelist } from '@/game/core/engine/buildAct2EntryValidationMap';
import { buildAct2EntryNodes, buildFloor2Nodes, createMapRun } from '@/game/core/engine/createMapRun';
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

  test('Act2 验证段地图只使用白名单 encounter，且 blast 不会出现在前两战', () => {
    const whitelist = new Set(act2EntryEncounterWhitelist());
    for (const seed of [3, 11, 29, 77]) {
      const nodes = buildAct2EntryNodes(seed);
      const encounterIds = Object.values(nodes)
        .map((node) => node.encounterId)
        .filter((encounterId): encounterId is string => Boolean(encounterId));

      expect(encounterIds.every((encounterId) => whitelist.has(encounterId))).toBe(true);
      expect(nodes.a2v_battle_a!.encounterId).not.toBe(nodes.a2v_battle_b!.encounterId);
      expect(nodes.a2v_battle_a!.encounterId).not.toBe('act2_normal_blast');
      expect(nodes.a2v_battle_b!.encounterId).not.toBe('act2_normal_blast');
      expect(
        nodes.a2v_battle_a!.encounterId === 'act2_normal_support'
          && nodes.a2v_battle_b!.encounterId === 'act2_normal_support',
      ).toBe(false);
      expect(
        nodes.a2v_battle_b!.encounterId === 'act2_normal_support'
          && nodes.a2v_battle_c!.encounterId === 'act2_normal_support',
      ).toBe(false);
      expect(
        nodes.a2v_battle_c!.encounterId === 'act2_normal_support'
          && nodes.a2v_battle_d!.encounterId === 'act2_normal_support',
      ).toBe(false);
      expect(nodes.a2v_risk_elite!.encounterId).toBe('act2_elite_lock');
    }
  });
});
