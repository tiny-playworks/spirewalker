import { describe, expect, test } from '@rstest/core';
import { intentDamage, projectedIncomingDamage } from '@/game/simulation/battleProjection';

describe('simulation/battleProjection', () => {
  test('蓄力、多段和吸血意图按完整伤害展开', () => {
    expect(intentDamage({ type: 'multi_hit', value: 5, hits: 2 })).toBe(10);
    expect(intentDamage({ type: 'heavy_charge', value: 20, charge: 1 })).toBe(20);
    expect(intentDamage({ type: 'leech', attack: 7, healRatio: 0.5 })).toBe(7);
  });

  test('只汇总存活敌人的下一次直接伤害', () => {
    const run = {
      battle: {
        enemyUnitIds: ['a', 'b', 'dead'],
        units: {
          a: { alive: true },
          b: { alive: true },
          dead: { alive: false },
        },
        monsters: {
          a: { intent: { type: 'multi_hit', value: 4, hits: 2 } },
          b: { intent: { type: 'heavy_charge', value: 12, charge: 1 } },
          dead: { intent: { type: 'attack', value: 99 } },
        },
      },
    } as never;
    expect(projectedIncomingDamage(run)).toBe(20);
  });
});
