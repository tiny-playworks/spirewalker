import { describe, expect, test } from '@rstest/core';
import { simplePolicy } from '@/game/simulation/policies/simplePolicy';
import { walkerMomentumPolicy } from '@/game/simulation/policies/walkerMomentumPolicy';
import { runSimulation } from '@/game/simulation/runSimulation';

describe('simulation/combatLength', () => {
  test('SimplePolicy 的平均战斗回合数落在当前护栏内', () => {
    const summary = runSimulation({ seed: 5001, runs: 30, policy: simplePolicy, characterId: 'walker' });

    expect(summary.avgTurnsPerCombat).toBeGreaterThanOrEqual(2);
    expect(summary.avgTurnsPerCombat).toBeLessThanOrEqual(20);
  });

  test('WalkerMomentumPolicy 的平均战斗回合数落在当前护栏内', () => {
    const summary = runSimulation({
      seed: 5001,
      runs: 30,
      policy: walkerMomentumPolicy,
      characterId: 'walker',
    });

    expect(summary.avgTurnsPerCombat).toBeGreaterThanOrEqual(2);
    expect(summary.avgTurnsPerCombat).toBeLessThanOrEqual(20);
  });
});
