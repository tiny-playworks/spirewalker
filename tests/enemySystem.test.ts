import { describe, expect, test } from '@rstest/core';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { buildInitialBattle, PLAYER_UNIT_ID } from '@/game/core/engine/createMvpRun';
import { pressureProfileHint, pressureProfileLabel } from '@/game/core/battleUiText';
import { listMonsterDefinitions } from '@/game/core/definitions/monsters';
import { listEncountersByPool, resolveEncounterTemplate } from '@/game/core/definitions/encounters';
import { createEmptyEncounterHistory, type RunState } from '@/game/core/model/run';
import { RUN_SAVE_VERSION } from '@/game/core/persistence/saveVersion';

function historyFromIds(ids: string[]) {
  return { ids, tags: [], archetypes: [] };
}

describe('enemy system content', () => {
  test('敌人池满足 36 普通 / 12 精英 / 6 Boss', () => {
    const defs = listMonsterDefinitions();
    expect(defs.filter((def) => def.tier === 'normal')).toHaveLength(36);
    expect(defs.filter((def) => def.tier === 'elite')).toHaveLength(12);
    expect(defs.filter((def) => def.tier === 'boss')).toHaveLength(6);
  });

  test('encounter 模板池至少 12 个，且普通/精英/Boss 池都存在', () => {
    const pools = ['act_1_normal', 'act_1_elite', 'act_1_boss', 'act_2_normal', 'act_3_boss'] as const;
    const total = ['act_1_normal', 'act_1_elite', 'act_1_boss', 'act_2_normal', 'act_2_elite', 'act_2_boss', 'act_3_normal', 'act_3_elite', 'act_3_boss']
      .flatMap((poolId) => listEncountersByPool(poolId))
      .length;
    expect(total).toBeGreaterThanOrEqual(12);
    for (const pool of pools) {
      expect(listEncountersByPool(pool).length).toBeGreaterThan(0);
    }
  });

  test('selector 对同一 seed / node / history 稳定', () => {
    const history = createEmptyEncounterHistory();
    const a = resolveEncounterTemplate(2, 'act_2_normal', 'act2_5_3', 123456, history);
    const b = resolveEncounterTemplate(2, 'act_2_normal', 'act2_5_3', 123456, history);
    expect(a.id).toBe(b.id);
  });

  test('selector 避免立刻重复同一 encounterId', () => {
    const first = resolveEncounterTemplate(1, 'act_1_normal', 'node_a', 42, createEmptyEncounterHistory(), 2);
    const second = resolveEncounterTemplate(1, 'act_1_normal', 'node_b', 42, {
      ids: [first.id],
      tags: [...first.tags],
      archetypes: [],
    }, 3);
    expect(second.id).not.toBe(first.id);
  });

  test('Act1 普通战按阶段开放 pressureProfile', () => {
    const second = resolveEncounterTemplate(1, 'act_1_normal', 'node_second', 42, historyFromIds(['act1_normal_press']), 3);
    expect(['frontload', 'attrition']).toContain(second.pressureProfile);

    const fourth = resolveEncounterTemplate(
      1,
      'act_1_normal',
      'node_fourth',
      42,
      historyFromIds(['act1_normal_press', 'act1_normal_shell', 'act1_normal_multi']),
      5,
    );
    expect(['frontload', 'attrition', 'disruption']).toContain(fourth.pressureProfile);
    expect(['snowball', 'execution_check']).not.toContain(fourth.pressureProfile);

    const seeds = Array.from({ length: 240 }, (_, index) => index + 1);
    const sixthProfiles = new Set(
      seeds.map((seed) =>
        resolveEncounterTemplate(
          1,
          'act_1_normal',
          `node_sixth_${seed}`,
          seed,
          historyFromIds([
            'act1_normal_press',
            'act1_normal_shell',
            'act1_normal_multi',
            'act1_normal_tax',
            'act1_normal_reactive',
          ]),
          8,
        ).pressureProfile,
      ),
    );
    expect(sixthProfiles.has('snowball') || sixthProfiles.has('execution_check')).toBe(true);
  });

  test('Act1 前 6 层 disruption 最多两次且不连续', () => {
    const nonConsecutive = Array.from({ length: 120 }, (_, index) =>
      resolveEncounterTemplate(
        1,
        'act_1_normal',
        `node_no_chain_${index}`,
        index + 1,
        historyFromIds(['act1_normal_press', 'act1_normal_shell', 'act1_normal_drain']),
        6,
      ).pressureProfile,
    );
    expect(nonConsecutive.every((profile) => profile !== 'disruption')).toBe(true);

    const capped = Array.from({ length: 120 }, (_, index) =>
      resolveEncounterTemplate(
        1,
        'act_1_normal',
        `node_capped_${index}`,
        index + 400,
        historyFromIds([
          'act1_normal_press',
          'act1_normal_drain',
          'act1_normal_shell',
          'act1_normal_tax',
        ]),
        7,
      ).pressureProfile,
    );
    expect(capped.every((profile) => profile !== 'disruption')).toBe(true);
  });

  test('execution_check 在 Act1 普通战中不早于第 6 场且最多出现两次', () => {
    const earlyProfiles = Array.from({ length: 120 }, (_, index) =>
      resolveEncounterTemplate(
        1,
        'act_1_normal',
        `node_early_exec_${index}`,
        index + 1,
        historyFromIds(['act1_normal_press', 'act1_normal_shell', 'act1_normal_multi', 'act1_normal_tax']),
        6,
      ).pressureProfile,
    );
    expect(earlyProfiles.every((profile) => profile !== 'execution_check')).toBe(true);

    const cappedProfiles = Array.from({ length: 120 }, (_, index) =>
      resolveEncounterTemplate(
        1,
        'act_1_normal',
        `node_exec_cap_${index}`,
        index + 900,
        historyFromIds([
          'act1_normal_press',
          'act1_normal_heavy',
          'act1_normal_shell',
          'act1_normal_heavy',
          'act1_normal_multi',
        ]),
        8,
      ).pressureProfile,
    );
    expect(cappedProfiles.every((profile) => profile !== 'execution_check')).toBe(true);
  });

  test('Act1 首个精英不会抽到 elite_open，之后恢复进入池子', () => {
    const firstEliteProfiles = Array.from({ length: 180 }, (_, index) =>
      resolveEncounterTemplate(1, 'act_1_elite', `elite_first_${index}`, index + 1, createEmptyEncounterHistory(), 6).id,
    );
    expect(firstEliteProfiles.every((id) => id !== 'act1_elite_open')).toBe(true);

    const laterEliteIds = new Set(
      Array.from({ length: 400 }, (_, index) =>
        resolveEncounterTemplate(
          1,
          'act_1_elite',
          `elite_later_${index}`,
          index + 2000,
          historyFromIds(['act1_elite_heavy']),
          8,
        ).id,
      ),
    );
    expect(laterEliteIds.has('act1_elite_open')).toBe(true);
  });

  test('pressureProfile 文案映射稳定', () => {
    expect(pressureProfileLabel('frontload')).toBe('前压');
    expect(pressureProfileLabel('attrition')).toBe('消耗');
    expect(pressureProfileLabel('snowball')).toBe('滚雪球');
    expect(pressureProfileLabel('disruption')).toBe('干扰');
    expect(pressureProfileLabel('execution_check')).toBe('爆发检定');
    expect(pressureProfileHint('frontload')).toContain('前两回合');
    expect(pressureProfileHint('execution_check')).toContain('危险窗口');
  });
});

function buildRuntimeRun(battle: ReturnType<typeof buildInitialBattle>): RunState {
  return {
    seed: 777,
    saveVersion: RUN_SAVE_VERSION,
    player: { maxHp: 50, currentHp: 50 },
    masterDeck: ['strike', 'defend', 'strike', 'defend', 'strike'],
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
}

describe('enemy system runtime', () => {
  test('甲虫死亡时造成 6 点全场爆炸伤害，但不会继续分裂', () => {
    const engine = new GameEngine();
    const battle = buildInitialBattle(
      7000,
      { currentHp: 40, maxHp: 40 },
      'beetle_burst_test',
      ['strike', 'defend', 'strike', 'defend', 'strike'],
      [
        { unitId: 'u_enemy_0', name: '甲虫', maxHp: 5, monsterId: 'buff_beetle' },
        { unitId: 'u_enemy_1', name: '破盾步兵', maxHp: 10, monsterId: 'slime_shell' },
      ],
      [],
    );
    battle.units[PLAYER_UNIT_ID]!.block = 2;
    battle.units.u_enemy_1!.block = 3;
    const strikeId = 'test_beetle_finisher';
    battle.player.cards[strikeId] = {
      instanceId: strikeId,
      definitionId: 'strike',
      baseCost: 1,
      costForTurn: 1,
      upgraded: false,
    };
    battle.player.hand.unshift(strikeId);
    const run = buildRuntimeRun(battle);

    const { nextRun } = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: strikeId,
      sourceUnitId: PLAYER_UNIT_ID,
      targetUnitId: 'u_enemy_0',
    });

    expect(nextRun.battle!.units[PLAYER_UNIT_ID]!.hp).toBe(36);
    expect(nextRun.battle!.units[PLAYER_UNIT_ID]!.block).toBe(0);
    expect(nextRun.battle!.units.u_enemy_0!.alive).toBe(false);
    expect(nextRun.battle!.units.u_enemy_1!.hp).toBe(7);
    expect(nextRun.battle!.units.u_enemy_1!.block).toBe(0);
    expect(nextRun.battle!.enemyUnitIds).toHaveLength(2);
    expect(nextRun.battle!.enemyUnitIds.filter((unitId) => nextRun.battle!.units[unitId]!.alive)).toEqual(['u_enemy_1']);
  });

  test('summon 意图会生成新敌人', () => {
    const engine = new GameEngine();
    const battle = buildInitialBattle(
      7001,
      undefined,
      'summon_test',
      ['strike', 'defend', 'strike', 'defend', 'strike'],
      [{ unitId: 'u_enemy_0', name: '三人组首脑', maxHp: 70, monsterId: 'slime_taxer' }],
      [],
    );
    const nextRun = engine.dispatch(buildRuntimeRun(battle), { type: 'END_TURN' }).nextRun;
    expect(nextRun.battle!.enemyUnitIds.length).toBeGreaterThan(1);
  });

  test('pollute_draw 会把污染牌塞进抽牌堆', () => {
    const engine = new GameEngine();
    const battle = buildInitialBattle(
      7002,
      undefined,
      'pollute_test',
      ['strike', 'defend', 'strike', 'defend', 'strike'],
      [{ unitId: 'u_enemy_0', name: '寄生体', maxHp: 30, monsterId: 'parasite' }],
      [],
    );
    const run = engine.dispatch(buildRuntimeRun(battle), { type: 'END_TURN' }).nextRun;
    const pollutedIds = Object.values(run.battle!.player.cards)
      .map((card) => card.definitionId)
      .filter((id) => id === 'junk_burn');
    expect(pollutedIds.length).toBeGreaterThan(0);
  });

  test('lock_hand 会锁住手牌，锁定牌无法打出', () => {
    const engine = new GameEngine();
    const battle = buildInitialBattle(
      7003,
      undefined,
      'lock_test',
      ['strike', 'defend', 'strike', 'defend', 'strike'],
      [{ unitId: 'u_enemy_0', name: '锁牌敌人', maxHp: 40, monsterId: 'card_bailiff' }],
      [],
    );
    let run = engine.dispatch(buildRuntimeRun(battle), { type: 'END_TURN' }).nextRun;
    const locked = run.battle!.player.lockedCardInstanceIds[0];
    expect(locked).toBeDefined();
    const energyBefore = run.battle!.player.energy;
    run = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: locked!,
      sourceUnitId: PLAYER_UNIT_ID,
    }).nextRun;
    expect(run.battle!.player.energy).toBe(energyBefore);
    expect(run.battle!.player.hand).toContain(locked!);
  });
});
