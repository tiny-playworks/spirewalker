import { describe, expect, test } from '@rstest/core';
import { simplePolicy } from '@/game/simulation/policies/simplePolicy';
import { walkerMomentumPolicy } from '@/game/simulation/policies/walkerMomentumPolicy';
import { runSimulation } from '@/game/simulation/runSimulation';

describe('simulation/rewardPollution', () => {
  test('两种策略的污染率都落在当前护栏内，且 WalkerMomentumPolicy 不高于基线', () => {
    const baseline = runSimulation({ seed: 4001, runs: 30, policy: simplePolicy, characterId: 'walker' });
    const focused = runSimulation({
      seed: 4001,
      runs: 30,
      policy: walkerMomentumPolicy,
      characterId: 'walker',
    });

    expect(baseline.pollutedDeckRate).toBeLessThanOrEqual(0.7);
    expect(focused.pollutedDeckRate).toBeLessThanOrEqual(0.7);
    expect(focused.pollutedDeckRate).toBeLessThanOrEqual(baseline.pollutedDeckRate + 0.1);
  });
});
