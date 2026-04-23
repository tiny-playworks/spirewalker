import { describe, expect, test } from '@rstest/core';
import {
  formatAct1ValidationTable,
  runAct1Validation,
  runAct1ValidationSuite,
} from '@/game/simulation/act1Validation';
import {
  walkerBasePolicies,
  walkerElitePriorityPolicies,
  walkerGuardPolicy,
} from '@/game/simulation/policies/walkerPersonas';

describe('simulation/act1Validation', () => {
  test('单 persona 验证返回 Act1 三段指标与 pressure breakdown', () => {
    const summary = runAct1Validation({
      seed: 7001,
      runs: 8,
      policy: walkerGuardPolicy,
      characterId: 'walker',
    });

    expect(summary.policyId).toBe('walker-guard');
    expect(summary.guardrailMode).toBe('progress_guard');
    expect(summary.totalRuns).toBe(8);
    expect(summary.normal.attempts).toBeGreaterThan(0);
    expect(summary.elite.attempts).toBeGreaterThanOrEqual(summary.firstElite.attempts);
    expect(summary.normal.wins).toBeLessThanOrEqual(summary.normal.attempts);
    expect(summary.firstElite.attempts).toBeLessThanOrEqual(8);
    expect(summary.boss.attempts).toBeLessThanOrEqual(8);
    expect(summary.anyEliteRuns).toBeLessThanOrEqual(8);
    expect(summary.avgEliteFightsPerRun).toBeGreaterThanOrEqual(0);
    expect(summary.pressureProfileBreakdown.length).toBeGreaterThan(0);
    expect(summary.pressureProfileBreakdown.every((item) => item.fights > 0)).toBe(true);
    expect(summary.nodeChoiceBreakdown.length).toBeGreaterThan(0);
    expect(summary.deathStageBreakdown.length).toBeGreaterThan(0);
    expect(summary.nonBattleBreakdown.every((item) => item.exampleSeeds.length > 0)).toBe(true);
    expect(summary.summaryInvariantBreakdown.length).toBe(0);
    expect(summary.summaryInvariantTraces.length).toBe(0);
  });

  test('suite 会返回三种 persona，且同种子结果可复现', () => {
    const first = runAct1ValidationSuite({
      seed: 7101,
      runsPerPolicy: 6,
      policies: [...walkerBasePolicies],
      characterId: 'walker',
    });
    const second = runAct1ValidationSuite({
      seed: 7101,
      runsPerPolicy: 6,
      policies: [...walkerBasePolicies],
      characterId: 'walker',
    });

    expect(first.map((item) => item.policyId)).toEqual([
      'walker-guard',
      'walker-burst',
      'walker-mixed',
    ]);
    expect(first).toEqual(second);
  });

  test('可以显式跑 baseline_200 口径做对照', () => {
    const summary = runAct1Validation({
      seed: 7121,
      runs: 4,
      policy: walkerGuardPolicy,
      characterId: 'walker',
      guardrailMode: 'baseline_200',
    });

    expect(summary.guardrailMode).toBe('baseline_200');
  });

  test('精英优先对照 persona 会返回独立 id', () => {
    const summaries = runAct1ValidationSuite({
      seed: 7151,
      runsPerPolicy: 4,
      policies: [...walkerElitePriorityPolicies],
      characterId: 'walker',
    });

    expect(summaries.map((item) => item.policyId)).toEqual([
      'walker-guard-elite',
      'walker-burst-elite',
      'walker-mixed-elite',
    ]);
  });

  test('格式化表格会输出表头和每个 persona 一行', () => {
    const summaries = runAct1ValidationSuite({
      seed: 7201,
      runsPerPolicy: 4,
      policies: [...walkerBasePolicies],
      characterId: 'walker',
    });
    const table = formatAct1ValidationTable(summaries);

    expect(table).toContain('Bot\tnormalAttempts\tnormalWin\tfirstEliteAttempts\tfirstEliteWin\tbossAttempts\tbossWin\tavgTurns\tavgHpLoss');
    expect(table).toContain('walker-guard');
    expect(table).toContain('walker-burst');
    expect(table).toContain('walker-mixed');
  });
});
