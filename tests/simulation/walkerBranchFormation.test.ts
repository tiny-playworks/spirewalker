import { describe, expect, test } from '@rstest/core';
import { simplePolicy } from '@/game/simulation/policies/simplePolicy';
import { walkerMomentumPolicy } from '@/game/simulation/policies/walkerMomentumPolicy';
import { runSimulation } from '@/game/simulation/runSimulation';

describe('simulation/walkerBranchFormation', () => {
  test('WalkerMomentumPolicy 的分支成型率不低于 SimplePolicy', () => {
    const baseline = runSimulation({ seed: 3001, runs: 30, policy: simplePolicy, characterId: 'walker' });
    const focused = runSimulation({
      seed: 3001,
      runs: 30,
      policy: walkerMomentumPolicy,
      characterId: 'walker',
    });

    expect(focused.defenseBranchRate + focused.burstBranchRate).toBeGreaterThanOrEqual(
      baseline.defenseBranchRate + baseline.burstBranchRate,
    );
  });
});
