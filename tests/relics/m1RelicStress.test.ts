import { describe, expect, test } from '@rstest/core';
import {
  COMMON_RELIC_POOL,
  RELIC_DEFINITIONS,
  rollBossRelicReward,
} from '@/game/core/definitions/relics';
import {
  RELIC_HOOKS,
  resolveRelicHooks,
  RUNTIME_RELIC_IDS,
  hasRelicRuntimeHook,
  activeRelicPoolHasRuntimeHooks,
  type RelicTrigger,
} from '@/game/core/systems/relic/relicHooks';
import { buildInitialBattle, DEFAULT_ENEMY_LINEUP } from '@/game/core/engine/createMvpRun';
import { createStarterMasterDeck } from '@/game/core/engine/starterDeck';
import { generateShop } from '@/game/core/engine/generateShop';
import { createMapRun } from '@/game/core/engine/createMapRun';

describe('Milestone 1 Relic & Pool Integration Stress Harness', () => {
  test('Pool integrity: no duplicate IDs in COMMON_RELIC_POOL or RUNTIME_RELIC_IDS', () => {
    const commonSet = new Set(COMMON_RELIC_POOL);
    expect(commonSet.size).toBe(COMMON_RELIC_POOL.length);

    const runtimeSet = new Set(RUNTIME_RELIC_IDS);
    expect(runtimeSet.size).toBe(RUNTIME_RELIC_IDS.length);

    expect(COMMON_RELIC_POOL.length).toBe(90);
    expect(RUNTIME_RELIC_IDS.length).toBe(COMMON_RELIC_POOL.length);
  });

  test('Definition coverage: every relic has non-empty id, name, and description', () => {
    for (const relicId of COMMON_RELIC_POOL) {
      const def = RELIC_DEFINITIONS[relicId];
      expect(def).toBeDefined();
      expect(def.id).toBe(relicId);
      expect(typeof def.name).toBe('string');
      expect(def.name.length).toBeGreaterThan(0);
      expect(typeof def.description).toBe('string');
      expect(def.description.length).toBeGreaterThan(0);
    }
  });

  test('Hook coverage: every relic has a registered function in RELIC_HOOKS', () => {
    expect(activeRelicPoolHasRuntimeHooks()).toBe(true);
    for (const relicId of COMMON_RELIC_POOL) {
      expect(hasRelicRuntimeHook(relicId)).toBe(true);
      expect(typeof RELIC_HOOKS[relicId]).toBe('function');
    }
  });

  test('Exhaustive Trigger Stress: testing all relics against 11 triggers with various params', () => {
    const battle = buildInitialBattle(1001, undefined, 'stress-run', createStarterMasterDeck(), DEFAULT_ENEMY_LINEUP, [...RUNTIME_RELIC_IDS]);

    const triggers: RelicTrigger[] = [
      'battleStart',
      'turnStart',
      'cardPlayed',
      'cardExhausted',
      'momentumConsumed',
      'blockGained',
      'damageTaken',
      'turnEnd',
      'battleEnd',
      'pickup',
      'statusReduced',
    ];

    const cardTypes: Array<'attack' | 'skill' | 'power'> = ['attack', 'skill', 'power'];
    const booleanCombos = [
      { first: true, second: false },
      { first: false, second: true },
      { first: true, second: true },
      { first: false, second: false },
    ];

    for (const trigger of triggers) {
      for (const cardType of cardTypes) {
        for (const consumedStacks of [0, 1, 2, 3, 5]) {
          for (const bools of booleanCombos) {
            const res = resolveRelicHooks(RUNTIME_RELIC_IDS, {
              battle,
              trigger,
              cardType,
              consumedStacks,
              momentumKind: 'damage',
              firstConsumeThisTurn: bools.first,
              firstBlockThisTurn: bools.first,
              firstAttackThisTurn: bools.first,
              playedAttackThisTurn: bools.second,
              playedSkillThisTurn: bools.first,
              harmonyTriggeredThisTurn: bools.second,
              amount: 5,
              statusId: 'momentum',
            });

            for (const value of Object.values(res)) {
              if (typeof value === 'number') {
                expect(Number.isNaN(value)).toBe(false);
                expect(Number.isFinite(value)).toBe(true);
              }
            }
          }
        }
      }
    }
  });

  test('All Relics Stacked Combined Resolution Stress', () => {
    const battle = buildInitialBattle(777, undefined, 'mega-relic-test', createStarterMasterDeck(), DEFAULT_ENEMY_LINEUP, [...RUNTIME_RELIC_IDS]);

    const startRes = resolveRelicHooks(RUNTIME_RELIC_IDS, { battle, trigger: 'battleStart' });
    expect(startRes.strength).toBeGreaterThan(0);
    expect(startRes.block).toBeGreaterThan(0);
    expect(startRes.metallicize).toBeGreaterThan(0);

    const attackRes = resolveRelicHooks(RUNTIME_RELIC_IDS, {
      battle,
      trigger: 'cardPlayed',
      cardType: 'attack',
      firstAttackThisTurn: true,
      playedSkillThisTurn: true,
    });
    expect(attackRes.forceExhaustAttack).toBe(true);

    const skillRes = resolveRelicHooks(RUNTIME_RELIC_IDS, {
      battle,
      trigger: 'cardPlayed',
      cardType: 'skill',
      playedAttackThisTurn: true,
    });
    expect(skillRes.harmonyTriggered).toBe(true);

    const momRes = resolveRelicHooks(RUNTIME_RELIC_IDS, {
      battle,
      trigger: 'momentumConsumed',
      consumedStacks: 3,
      momentumKind: 'damage',
      firstConsumeThisTurn: true,
    });
    expect(momRes.damageBonus).toBeGreaterThan(0);
  });

  test('Shop Relic Pool Generation across 100 seeds', () => {
    for (let seed = 1; seed <= 100; seed += 1) {
      const run = createMapRun(seed);
      const shop = generateShop(run.seed, run.meta.act, run.meta.actFloor, run.meta.relics);
      expect(shop.relics.length).toBeGreaterThan(0);
      for (const item of shop.relics) {
        expect(hasRelicRuntimeHook(item.relicId)).toBe(true);
        expect(RELIC_DEFINITIONS[item.relicId]).toBeDefined();
      }
    }
  });

  test('Boss Relic Roll Reward across 100 seeds with expanded pool', () => {
    for (let seed = 1; seed <= 100; seed += 1) {
      const reward = rollBossRelicReward(seed, 42, ['vajra', 'anchor'], 'walker');
      expect(reward).not.toBeNull();
      if (reward) {
        expect(hasRelicRuntimeHook(reward)).toBe(true);
        expect(RELIC_DEFINITIONS[reward]).toBeDefined();
      }
    }
  });
});
