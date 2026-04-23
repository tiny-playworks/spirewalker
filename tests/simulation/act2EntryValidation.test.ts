import { describe, expect, test } from '@rstest/core';
import { runAct2EntryValidation } from '@/game/simulation/act2EntryValidation';

describe('simulation/act2EntryValidation', () => {
  test('输出包含三条 persona 的 Act2 入口验证指标', () => {
    const summaries = runAct2EntryValidation({
      seed: 1001,
      runsPerPolicy: 6,
    });

    expect(summaries).toHaveLength(3);
    for (const summary of summaries) {
      expect(summary.totalRuns).toBe(6);
      expect(Number.isFinite(summary.act1BossReachCount)).toBe(true);
      expect(Number.isFinite(summary.act1BossReachRate)).toBe(true);
      expect(Number.isFinite(summary.act1BossDefeatCount)).toBe(true);
      expect(Number.isFinite(summary.act1BossDefeatRate)).toBe(true);
      expect(Number.isFinite(summary.act2EntrySamples)).toBe(true);
      expect(Number.isFinite(summary.act2Floor13SurviveCount)).toBe(true);
      expect(Number.isFinite(summary.act2Floor13SurviveRate)).toBe(true);
      expect(Number.isFinite(summary.act2Floor15SurviveCount)).toBe(true);
      expect(Number.isFinite(summary.act2Floor15SurviveRate)).toBe(true);
      expect(Number.isFinite(summary.act2FrontWinRate)).toBe(true);
      expect(Number.isFinite(summary.act2AvgHpLoss)).toBe(true);
      expect(Number.isFinite(summary.act2AvgTurns)).toBe(true);
      expect(Number.isFinite(summary.act2EliteBranchEnterCount)).toBe(true);
      expect(Number.isFinite(summary.act2EliteBranchEnterRate)).toBe(true);
      expect(Number.isFinite(summary.act2EliteBranchSurviveRate)).toBe(true);
      for (const encounter of summary.encounterBreakdown) {
        expect(Number.isFinite(encounter.surviveRate)).toBe(true);
        expect(Number.isFinite(encounter.avgHpLoss)).toBe(true);
        expect(Number.isFinite(encounter.avgTurns)).toBe(true);
      }
    }
  });

  test('进入 Act2 的样本在 simulation 中强制走 risk 分支', () => {
    const summaries = runAct2EntryValidation({
      seed: 1001,
      runsPerPolicy: 24,
    });

    const withAct2Samples = summaries.filter((summary) => summary.act2EntrySamples > 0);
    for (const summary of withAct2Samples) {
      expect(summary.act2EliteBranchEnterRate).toBe(1);
      expect(summary.encounterBreakdown.some((item) => item.encounterId === 'act2_elite_lock')).toBe(true);
    }
  });
});
