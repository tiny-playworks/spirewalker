import { describe, expect, test } from '@rstest/core';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { buildInitialBattle, createMvpRun, ENEMY_UNIT_ID, lineupGuard, lineupSapper, lineupShell } from '@/game/core/engine/createMvpRun';
import { MONSTER_DEFINITIONS } from '@/game/core/definitions/monsters';
import { STATUS_MOMENTUM, STATUS_STRENGTH } from '@/game/core/definitions/statuses';
import { computeIntentForMonster } from '@/game/core/systems/enemy/enemyAi';
import { createEmptyEncounterHistory, type RunState } from '@/game/core/model/run';
import { RUN_SAVE_VERSION } from '@/game/core/persistence/saveVersion';

describe('monster/enemyAi', () => {
  test('MONSTER_DEFINITIONS 含当前编队用到的 id', () => {
    expect(MONSTER_DEFINITIONS.slime).toBeDefined();
    expect(MONSTER_DEFINITIONS.slime_elite).toBeDefined();
    expect(MONSTER_DEFINITIONS.slime_boss).toBeDefined();
    expect(MONSTER_DEFINITIONS.slime_sapper).toBeDefined();
    expect(MONSTER_DEFINITIONS.slime_guard).toBeDefined();
    expect(MONSTER_DEFINITIONS.slime_shell).toBeDefined();
  });

  test('交替攻击意图与 moveHistory 长度一致（与旧 nextEnemyDamage 对齐）', () => {
    expect(computeIntentForMonster('slime', 0).intent).toEqual({ type: 'attack', value: 8 });
    expect(computeIntentForMonster('slime', 1).intent).toEqual({ type: 'attack', value: 11 });
    expect(computeIntentForMonster('slime', 2).intent).toEqual({ type: 'attack', value: 8 });
    expect(computeIntentForMonster('slime_elite', 0).intent).toEqual({ type: 'attack', value: 8 });
    expect(computeIntentForMonster('slime_elite', 1).intent).toEqual({
      type: 'reduce_status',
      statusId: STATUS_MOMENTUM,
      value: 3,
    });
    expect(computeIntentForMonster('slime_boss', 2).intent).toEqual({
      type: 'buff',
      statusId: STATUS_STRENGTH,
      value: 1,
    });
    expect(computeIntentForMonster('slime_sapper', 0).intent).toEqual({ type: 'attack', value: 6 });
    expect(computeIntentForMonster('slime_sapper', 1).intent).toEqual({
      type: 'reduce_status',
      statusId: STATUS_MOMENTUM,
      value: 3,
    });
    expect(computeIntentForMonster('slime_guard', 0).intent).toEqual({ type: 'attack', value: 6 });
    expect(computeIntentForMonster('slime_guard', 1).intent).toEqual({
      type: 'counter',
      threshold: 2,
      damage: 5,
    });
    expect(computeIntentForMonster('slime_shell', 0).intent).toEqual({ type: 'attack', value: 6 });
    expect(computeIntentForMonster('slime_shell', 1).intent).toEqual({ type: 'block', value: 12 });
  });

  test('computeIntentForMonster 对未知 id 抛错', () => {
    expect(() => computeIntentForMonster('no_such_monster', 0)).toThrow(/unknown monsterId/);
  });

  test('END_TURN 后意图按 AI 刷新（集成）', () => {
    const engine = new GameEngine();
    let run = createMvpRun(201);
    const m0 = run.battle!.monsters[ENEMY_UNIT_ID]!;
    expect(m0.intent).toEqual({ type: 'attack', value: 8 });
    expect(m0.aiTrace).toContain('len=0');
    const { nextRun } = engine.dispatch(run, { type: 'END_TURN' });
    run = nextRun;
    const m1 = run.battle!.monsters[ENEMY_UNIT_ID]!;
    expect(m1.intent).toEqual({ type: 'attack', value: 11 });
    expect(m1.aiTrace).toContain('len=1');
  });

  test('干扰型敌人会在攻击后切到 reduce_status 意图', () => {
    const engine = new GameEngine();
    const battle = buildInitialBattle(301, undefined, 'sapper_battle', ['strike', 'defend', 'defend', 'strike', 'strike'], lineupSapper(), []);
    let run: RunState = {
      seed: 301,
      saveVersion: RUN_SAVE_VERSION,
      player: { maxHp: 50, currentHp: 50 },
      masterDeck: ['strike', 'defend', 'defend', 'strike', 'strike'],
      map: { nodes: {}, currentNodeId: null },
      screen: { type: 'battle' },
      battle,
      meta: {
        act: 1,
        actFloor: 1,
        floor: 1,
        gold: 0,
        characterId: 'walker',
        relics: [],
        potions: [],
        encounterHistory: createEmptyEncounterHistory(),
      },
    };
    const m0 = run.battle!.monsters[ENEMY_UNIT_ID]!;
    expect(m0.intent).toEqual({ type: 'attack', value: 6 });

    run = engine.dispatch(run, { type: 'END_TURN' }).nextRun;
    const m1 = run.battle!.monsters[ENEMY_UNIT_ID]!;
    expect(m1.intent).toEqual({ type: 'reduce_status', statusId: STATUS_MOMENTUM, value: 3 });
    expect(m1.aiTrace).toContain('reduce momentum by 3');
  });

  test('反连打敌人会在攻击后切到 counter 意图', () => {
    const engine = new GameEngine();
    const battle = buildInitialBattle(303, undefined, 'guard_battle', ['strike', 'defend', 'defend', 'strike', 'strike'], lineupGuard(), []);
    let run: RunState = {
      seed: 303,
      saveVersion: RUN_SAVE_VERSION,
      player: { maxHp: 50, currentHp: 50 },
      masterDeck: ['strike', 'defend', 'defend', 'strike', 'strike'],
      map: { nodes: {}, currentNodeId: null },
      screen: { type: 'battle' },
      battle,
      meta: {
        act: 1,
        actFloor: 1,
        floor: 1,
        gold: 0,
        characterId: 'walker',
        relics: [],
        potions: [],
        encounterHistory: createEmptyEncounterHistory(),
      },
    };
    const m0 = run.battle!.monsters[ENEMY_UNIT_ID]!;
    expect(m0.intent).toEqual({ type: 'attack', value: 6 });

    run = engine.dispatch(run, { type: 'END_TURN' }).nextRun;
    const m1 = run.battle!.monsters[ENEMY_UNIT_ID]!;
    expect(m1.intent).toEqual({ type: 'counter', threshold: 2, damage: 5 });
    expect(m1.aiTrace).toContain('counter');
  });

  test('拖延型敌人会在攻击后切到 block 意图', () => {
    const engine = new GameEngine();
    const battle = buildInitialBattle(304, undefined, 'shell_battle', ['strike', 'defend', 'defend', 'strike', 'strike'], lineupShell(), []);
    let run: RunState = {
      seed: 304,
      saveVersion: RUN_SAVE_VERSION,
      player: { maxHp: 50, currentHp: 50 },
      masterDeck: ['strike', 'defend', 'defend', 'strike', 'strike'],
      map: { nodes: {}, currentNodeId: null },
      screen: { type: 'battle' },
      battle,
      meta: {
        act: 1,
        actFloor: 1,
        floor: 1,
        gold: 0,
        characterId: 'walker',
        relics: [],
        potions: [],
        encounterHistory: createEmptyEncounterHistory(),
      },
    };
    const m0 = run.battle!.monsters[ENEMY_UNIT_ID]!;
    expect(m0.intent).toEqual({ type: 'attack', value: 6 });

    run = engine.dispatch(run, { type: 'END_TURN' }).nextRun;
    const m1 = run.battle!.monsters[ENEMY_UNIT_ID]!;
    expect(m1.intent).toEqual({ type: 'block', value: 12 });
    expect(m1.aiTrace).toContain('block=12');
  });

  test('Act1 Boss 定义符合新的双核压力校准', () => {
    const hivePhases = MONSTER_DEFINITIONS.slime_boss.ai.phases;
    const gatePhases = MONSTER_DEFINITIONS.act1_boss_gate.ai.phases;
    expect(hivePhases?.[1]?.threshold).toBe(0.65);
    expect(hivePhases?.[0]?.rotation[2]).toEqual({
      type: 'buff',
      statusId: STATUS_STRENGTH,
      value: 1,
    });
    expect(gatePhases?.[0]?.rotation[4]).toEqual({ type: 'counter', threshold: 2, damage: 8 });
    expect(gatePhases?.[1]?.rotation[2]).toEqual({ type: 'thorns', damage: 4 });
  });

  test('Act1 首精英 rotation 符合新的构筑检定设计', () => {
    const executioner = MONSTER_DEFINITIONS.act1_executioner.ai.rotation;
    const twinHunter = MONSTER_DEFINITIONS.act1_twin_hunter.ai.rotation;
    const debtMonk = MONSTER_DEFINITIONS.act1_debt_monk.ai.rotation;

    expect(executioner).toEqual([
      { type: 'counter', threshold: 4, damage: 7 },
      { type: 'attack_buff', attack: 12, statusId: 'vulnerable', value: 0 },
      { type: 'heavy_charge', value: 20, charge: 1 },
    ]);
    expect(twinHunter).toEqual([
      { type: 'counter', threshold: 2, damage: 7 },
      { type: 'multi_hit', value: 5, hits: 2 },
      { type: 'punish_multi_play', threshold: 5, block: 12 },
    ]);
    expect(debtMonk).toEqual([
      { type: 'lock_hand', count: 2 },
      { type: 'heavy_charge', value: 22, charge: 1 },
      { type: 'draw_pressure', value: 2 },
    ]);
  });
});
