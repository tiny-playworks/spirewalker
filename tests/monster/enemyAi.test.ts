import { describe, expect, test } from '@rstest/core';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { createMvpRun, ENEMY_UNIT_ID } from '@/game/core/engine/createMvpRun';
import { MONSTER_DEFINITIONS } from '@/game/core/definitions/monsters';
import { computeIntentForMonster } from '@/game/core/systems/enemy/enemyAi';

describe('monster/enemyAi', () => {
  test('MONSTER_DEFINITIONS 含当前编队用到的 id', () => {
    expect(MONSTER_DEFINITIONS.slime).toBeDefined();
    expect(MONSTER_DEFINITIONS.slime_elite).toBeDefined();
    expect(MONSTER_DEFINITIONS.slime_boss).toBeDefined();
  });

  test('交替攻击意图与 moveHistory 长度一致（与旧 nextEnemyDamage 对齐）', () => {
    expect(computeIntentForMonster('slime', 0).intent).toEqual({ type: 'attack', value: 6 });
    expect(computeIntentForMonster('slime', 1).intent).toEqual({ type: 'attack', value: 9 });
    expect(computeIntentForMonster('slime', 2).intent).toEqual({ type: 'attack', value: 6 });
    expect(computeIntentForMonster('slime_boss', 3).intent).toEqual({ type: 'attack', value: 9 });
  });

  test('computeIntentForMonster 对未知 id 抛错', () => {
    expect(() => computeIntentForMonster('no_such_monster', 0)).toThrow(/unknown monsterId/);
  });

  test('END_TURN 后意图按 AI 刷新（集成）', () => {
    const engine = new GameEngine();
    let run = createMvpRun(201);
    const m0 = run.battle!.monsters[ENEMY_UNIT_ID]!;
    expect(m0.intent).toEqual({ type: 'attack', value: 6 });
    expect(m0.aiTrace).toContain('len=0');
    const { nextRun } = engine.dispatch(run, { type: 'END_TURN' });
    run = nextRun;
    const m1 = run.battle!.monsters[ENEMY_UNIT_ID]!;
    expect(m1.intent).toEqual({ type: 'attack', value: 9 });
    expect(m1.aiTrace).toContain('len=1');
  });
});
