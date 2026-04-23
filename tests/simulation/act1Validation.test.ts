import { describe, expect, test } from '@rstest/core';
import {
  formatAct1ValidationTable,
  runAct1Validation,
  runAct1ValidationSuite,
} from '@/game/simulation/act1Validation';
import {
  walkerBurstPolicy,
  walkerGuardPolicy,
  walkerMixedPolicy,
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
    expect(summary.totalRuns).toBe(8);
    expect(summary.normal.attempts).toBeGreaterThan(0);
    expect(summary.normal.wins).toBeLessThanOrEqual(summary.normal.attempts);
    expect(summary.firstElite.attempts).toBeLessThanOrEqual(8);
    expect(summary.boss.attempts).toBeLessThanOrEqual(8);
    expect(summary.pressureProfileBreakdown.length).toBeGreaterThan(0);
    expect(summary.pressureProfileBreakdown.every((item) => item.fights > 0)).toBe(true);
  });

  test('suite 会返回三种 persona，且同种子结果可复现', () => {
    const first = runAct1ValidationSuite({
      seed: 7101,
      runsPerPolicy: 6,
      policies: [walkerGuardPolicy, walkerBurstPolicy, walkerMixedPolicy],
      characterId: 'walker',
    });
    const second = runAct1ValidationSuite({
      seed: 7101,
      runsPerPolicy: 6,
      policies: [walkerGuardPolicy, walkerBurstPolicy, walkerMixedPolicy],
      characterId: 'walker',
    });

    expect(first.map((item) => item.policyId)).toEqual([
      'walker-guard',
      'walker-burst',
      'walker-mixed',
    ]);
    expect(first).toEqual(second);
  });

  test('格式化表格会输出表头和每个 persona 一行', () => {
    const summaries = runAct1ValidationSuite({
      seed: 7201,
      runsPerPolicy: 4,
      policies: [walkerGuardPolicy, walkerBurstPolicy, walkerMixedPolicy],
      characterId: 'walker',
    });
    const table = formatAct1ValidationTable(summaries);

    expect(table).toContain('Bot\tnormalWin\teliteWin\tbossWin\tavgTurns\tavgHpLoss');
    expect(table).toContain('walker-guard');
    expect(table).toContain('walker-burst');
    expect(table).toContain('walker-mixed');
  });
});
