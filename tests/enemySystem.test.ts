import { describe, expect, test } from '@rstest/core';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { buildInitialBattle, PLAYER_UNIT_ID } from '@/game/core/engine/createMvpRun';
import { listMonsterDefinitions } from '@/game/core/definitions/monsters';
import { listEncountersByPool, resolveEncounterTemplate } from '@/game/core/definitions/encounters';
import { createEmptyEncounterHistory, type RunState } from '@/game/core/model/run';
import { RUN_SAVE_VERSION } from '@/game/core/persistence/saveVersion';

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
    const first = resolveEncounterTemplate(1, 'act_1_normal', 'node_a', 42, createEmptyEncounterHistory());
    const second = resolveEncounterTemplate(1, 'act_1_normal', 'node_b', 42, {
      ids: [first.id],
      tags: [...first.tags],
      archetypes: [],
    });
    expect(second.id).not.toBe(first.id);
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
