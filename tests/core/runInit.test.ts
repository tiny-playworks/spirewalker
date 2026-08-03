import { describe, expect, test } from '@rstest/core';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
import {
  ACT2_FORMAL_ROUTE_TEMPLATES,
  act2EntryEncounterWhitelist,
  act2FormalRouteForSeed,
} from '@/game/core/engine/buildAct2EntryValidationMap';
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

  test('Act2 验证段地图按 seed 选择三种正式短路线', () => {
    const whitelist = new Set(act2EntryEncounterWhitelist());
    for (const seed of [3, 11, 29, 77]) {
      const nodes = buildAct2EntryNodes(seed);
      const encounterIds = Object.values(nodes)
        .map((node) => node.encounterId)
        .filter((encounterId): encounterId is string => Boolean(encounterId));

      expect(encounterIds.every((encounterId) => whitelist.has(encounterId))).toBe(true);
      const route = act2FormalRouteForSeed(seed);
      expect([
        nodes.a2v_battle_a!.encounterId,
        nodes.a2v_battle_b!.encounterId,
        nodes.a2v_battle_c!.encounterId,
        nodes.a2v_battle_d!.encounterId,
      ]).toEqual(route.normalEncounterIds);
      expect(nodes.a2v_safe_branch!.encounterId).toBe('act2_entry_reflect');
      expect(nodes.a2v_risk_elite!.encounterId).toBe(route.eliteEncounterId);
      expect(nodes.a2v_boss_silence!.encounterId).toBe(route.bossEncounterId);
    }
  });

  test('三种路线至少在供给和章节事件上可区分', () => {
    const routes = [3, 11, 29].map((seed) => buildAct2EntryNodes(seed));
    expect(new Set(routes.map((nodes) => nodes.a2v_battle_b!.nextNodeIds.join(','))).size).toBe(3);
    expect(new Set(routes.map((nodes) => nodes.a2v_battle_d!.nextNodeIds.join(','))).size).toBe(3);
    expect(ACT2_FORMAL_ROUTE_TEMPLATES).toHaveLength(3);
  });

  test('Act2 验证地图可显式指定正式路线而不改变默认 seed 路线', () => {
    const safe = buildAct2EntryNodes(313, 'safe');
    const build = buildAct2EntryNodes(313, 'build');
    const risk = buildAct2EntryNodes(313, 'risk');

    expect(safe.a2v_rest!.type).toBe('rest');
    expect(build.a2v_shop!.type).toBe('shop');
    expect(risk.a2v_risk_elite!.type).toBe('elite');
    expect(buildAct2EntryNodes(313).a2v_battle_a!.encounterId).toBe(
      act2FormalRouteForSeed(313).normalEncounterIds[0],
    );
  });
});
