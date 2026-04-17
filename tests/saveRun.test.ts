import { describe, expect, test } from '@rstest/core';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { createStarterMasterDeck } from '@/game/core/engine/starterDeck';
import {
  normalizeRunState,
  RUN_SAVE_VERSION,
} from '@/game/core/persistence/saveRun';
import type { RunState } from '@/game/core/model/run';

describe('normalizeRunState / 存档迁移', () => {
  test('旧线性图 id 载入时替换为分支图并升版本', () => {
    const raw: RunState = {
      seed: 0xabcddcba,
      saveVersion: 1,
      player: { maxHp: 50, currentHp: 42 },
      masterDeck: createStarterMasterDeck(),
      map: {
        nodes: {
          start: {
            id: 'start',
            floor: 1,
            x: 0,
            y: 0,
            type: 'rest',
            nextNodeIds: ['battle_a'],
            visited: true,
          },
          battle_a: {
            id: 'battle_a',
            floor: 1,
            x: 1,
            y: 0,
            type: 'battle',
            nextNodeIds: [],
            visited: false,
          },
        },
        currentNodeId: 'battle_a',
      },
      screen: { type: 'map' },
      meta: { floor: 1, gold: 7, relics: [], potions: [] },
    };

    const run = normalizeRunState(raw);
    expect(run).not.toBeNull();
    expect(run!.saveVersion).toBe(RUN_SAVE_VERSION);
    expect(run!.map.nodes.start).toBeUndefined();
    expect(run!.map.nodes.battle_a).toBeUndefined();
    const campId = Object.keys(run!.map.nodes).find(
      (id) => run!.map.nodes[id]!.x === 0,
    );
    expect(campId).toBeDefined();
    expect(run!.map.currentNodeId).toBe(campId);
    expect(run!.map.nodes[campId!]!.visited).toBe(true);
    Object.entries(run!.map.nodes).forEach(([id, n]) => {
      if (id !== campId) expect(n.visited).toBe(false);
    });
    expect(run!.player.currentHp).toBe(42);
    expect(run!.meta.gold).toBe(7);
  });

  test('旧线性图且不在地图屏时清子状态并回到地图', () => {
    const raw = {
      seed: 1,
      saveVersion: 1,
      player: { maxHp: 50, currentHp: 50 },
      masterDeck: createStarterMasterDeck(),
      map: {
        nodes: {
          start: {
            id: 'start',
            floor: 1,
            x: 0,
            y: 0,
            type: 'rest',
            nextNodeIds: [],
            visited: true,
          },
        },
        currentNodeId: 'start',
      },
      screen: { type: 'battle' },
      battle: { stub: true },
      meta: { floor: 1, gold: 0, relics: [], potions: [] },
    } as unknown;

    const run = normalizeRunState(raw);
    expect(run).not.toBeNull();
    expect(run!.screen).toEqual({ type: 'map' });
    expect(run!.battle).toBeUndefined();
    expect(run!.saveVersion).toBe(RUN_SAVE_VERSION);
  });

  test('已是分支图仅 saveVersion 低于当前时升版本、不替换节点集合', () => {
    const fresh = createMapRun(0x11223344);
    const raw = JSON.parse(JSON.stringify(fresh)) as RunState;
    raw.saveVersion = 1;

    const run = normalizeRunState(raw);
    expect(run).not.toBeNull();
    expect(run!.saveVersion).toBe(RUN_SAVE_VERSION);
    expect(new Set(Object.keys(run!.map.nodes))).toEqual(
      new Set(Object.keys(fresh.map.nodes)),
    );
    expect(run!.map.currentNodeId).toBe(fresh.map.currentNodeId);
  });
});
