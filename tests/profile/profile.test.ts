import { describe, expect, test } from '@rstest/core';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { createEmptyProfile, observeRun, recordRunStarted, recordRunWin } from '@/game/core/model/profile';
import { migrateProfile, normalizeProfile } from '@/game/core/persistence/saveProfile';

describe('profile persistence model', () => {
  test('run observations and lifetime counters survive as pure state transitions', () => {
    const run = createMapRun(29);
    run.masterDeck = [...run.masterDeck, 'strike+', 'defend+', 'momentum+'];
    run.meta.relics = ['vajra'];
    run.meta.act = 2;
    run.meta.floor = 5;

    const started = recordRunStarted(createEmptyProfile(), run);
    expect(started.lifetimeStats.runs).toBe(1);
    expect(started.lifetimeStats.highestAct).toBe(2);
    expect(started.unlockedCards).toContain('strike+');
    expect(started.unlockedRelics).toEqual(['vajra']);
    expect(started.achievements).toEqual(expect.arrayContaining(['first_step', 'card_collection', 'relic_echo', 'deep_spire', 'act_two']));

    const won = recordRunWin(started, run);
    expect(won.lifetimeStats.wins).toBe(1);
  });

  test('invalid or old profile data falls back to a normalized version', () => {
    expect(normalizeProfile({ version: 0 })).toBeNull();
    expect(normalizeProfile({
      version: 1,
      unlockedCards: ['strike', 'strike', 3],
      unlockedRelics: ['vajra', 'vajra'],
      achievements: ['first_step'],
      lifetimeStats: { runs: 3.9, wins: -1, highestAct: 9 },
    })).toEqual({
      version: 1,
      unlockedCards: ['strike'],
      unlockedRelics: ['vajra'],
      achievements: ['first_step'],
      lifetimeStats: { runs: 3, wins: 0, highestAct: 3 },
    });
  });

  test('observing the same run is idempotent', () => {
    const run = createMapRun(31);
    const profile = observeRun(createEmptyProfile(), run);
    expect(observeRun(profile, run)).toEqual(profile);
  });

  test('旧版长期档案可迁移到版本 1', () => {
    expect(migrateProfile({
      version: 0,
      unlockedCards: ['strike', 'strike'],
      unlockedRelics: ['vajra'],
      stats: { runs: 2, wins: 1, highestAct: 2 },
    })).toEqual({
      version: 1,
      unlockedCards: ['strike'],
      unlockedRelics: ['vajra'],
      achievements: [],
      lifetimeStats: { runs: 2, wins: 1, highestAct: 2 },
    });
  });
});
