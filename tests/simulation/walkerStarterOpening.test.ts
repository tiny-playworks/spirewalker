import { describe, expect, test } from '@rstest/core';
import { simplePolicy } from '@/game/simulation/policies/simplePolicy';
import { walkerMomentumPolicy } from '@/game/simulation/policies/walkerMomentumPolicy';
import { runSimulation } from '@/game/simulation/runSimulation';

describe('simulation/walkerStarterOpening', () => {
  test('SimplePolicy 满足 v0.5 前两回合接触起势入口强约束', () => {
    const summary = runSimulation({ seed: 1001, runs: 100, policy: simplePolicy, characterId: 'walker' });

    expect(summary.totalRuns).toBe(100);
    expect(summary.momentumOpenedByTurn2Rate).toBe(1);
  });

  test('WalkerMomentumPolicy 满足 v0.5 前两回合接触起势入口强约束', () => {
    const summary = runSimulation({
      seed: 2001,
      runs: 100,
      policy: walkerMomentumPolicy,
      characterId: 'walker',
    });

    expect(summary.totalRuns).toBe(100);
    expect(summary.momentumOpenedByTurn2Rate).toBe(1);
  });
});
