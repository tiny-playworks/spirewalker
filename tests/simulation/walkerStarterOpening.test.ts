import { describe, expect, test } from '@rstest/core';
import { simplePolicy } from '@/game/simulation/policies/simplePolicy';
import { walkerMomentumPolicy } from '@/game/simulation/policies/walkerMomentumPolicy';
import { runSimulation } from '@/game/simulation/runSimulation';

describe('simulation/walkerStarterOpening', () => {
  test('SimplePolicy 的前两回合起势接触率落在新护栏内', () => {
    const summary = runSimulation({ seed: 1001, runs: 30, policy: simplePolicy, characterId: 'walker' });

    expect(summary.totalRuns).toBe(30);
    expect(summary.momentumOpenedByTurn2Rate).toBeGreaterThanOrEqual(0.7);
    expect(summary.momentumOpenedByTurn2Rate).toBeLessThanOrEqual(0.96);
  });

  test('WalkerMomentumPolicy 的前两回合起势接触率落在新护栏内', () => {
    const summary = runSimulation({
      seed: 2001,
      runs: 30,
      policy: walkerMomentumPolicy,
      characterId: 'walker',
    });

    expect(summary.totalRuns).toBe(30);
    expect(summary.momentumOpenedByTurn2Rate).toBeGreaterThanOrEqual(0.7);
    expect(summary.momentumOpenedByTurn2Rate).toBeLessThanOrEqual(0.96);
  });
});
