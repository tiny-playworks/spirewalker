import { describe, expect, test } from '@rstest/core';
import { runAct2EntryValidation } from '@/game/simulation/act2EntryValidation';

describe('simulation/act2EntryValidation', () => {
  test('输出包含三条 persona 的 Act2 入口验证指标', () => {
    const summaries = runAct2EntryValidation({
      seed: 1001,
      runsPerPolicy: 6,
      routeMode: 'natural',
      includeAct1PreBossLossReport: true,
    });

    expect(summaries).toHaveLength(3);
    for (const summary of summaries) {
      expect(summary.totalRuns).toBe(6);
      expect(summary.routeMode).toBe('natural');
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
      expect(Number.isFinite(summary.act2AvgCardsPerTurn)).toBe(true);
      expect(Number.isFinite(summary.act2EliteBranchEnterCount)).toBe(true);
      expect(Number.isFinite(summary.act2EliteBranchEnterRate)).toBe(true);
      expect(Number.isFinite(summary.act2EliteBranchSurviveRate)).toBe(true);
      for (const encounter of summary.encounterBreakdown) {
        expect(['safe', 'build', 'risk']).toContain(encounter.routeId);
        expect(Number.isFinite(encounter.surviveRate)).toBe(true);
        expect(Number.isFinite(encounter.avgHpLoss)).toBe(true);
        expect(Number.isFinite(encounter.avgTurns)).toBe(true);
        expect(Number.isFinite(encounter.avgCardsPlayed)).toBe(true);
        expect(Number.isFinite(encounter.avgCardsPerTurn)).toBe(true);
      }
      expect(summary.act1PreBossLossReport).toBeDefined();
      expect(Number.isFinite(summary.act1PreBossLossReport!.mapNormalFightShape.avgNormalFights)).toBe(true);
      expect(Number.isFinite(summary.act1PreBossLossReport!.routeShapeByBias.safe.avgNormalFights)).toBe(true);
      expect(Number.isFinite(summary.act1PreBossLossReport!.routeShapeByBias.risk.avgEliteFights)).toBe(true);
      expect(Number.isFinite(summary.act1PreBossLossReport!.avgObservedAct1NormalAttempts)).toBe(true);
      expect(Number.isFinite(summary.act1PreBossLossReport!.firstEliteRegression.winRate)).toBe(true);
      expect(Number.isFinite(summary.act1PreBossLossReport!.firstEliteRegression.avgDeckSizeAtFirstElite)).toBe(true);
      expect(Number.isFinite(summary.act1PreBossLossReport!.firstEliteRegression.avgNormalFightsBeforeFirstElite)).toBe(true);
    }
  });

  test('risk 路线显式走精英分支，避免自然选路被误当成压力测试', () => {
    const summaries = runAct2EntryValidation({
      seed: 1001,
      runsPerPolicy: 24,
      routeMode: 'risk',
    });

    const withEliteBranchSamples = summaries.filter((summary) => summary.act2EliteBranchEnterCount > 0);
    for (const summary of withEliteBranchSamples) {
      expect(summary.routeMode).toBe('risk');
      expect(summary.act2EliteBranchEnterRate).toBeGreaterThan(0);
      expect(summary.encounterBreakdown.some((item) => item.encounterId === 'act2_elite_lock')).toBe(true);
      expect(summary.encounterBreakdown.every((item) => item.routeId === 'risk')).toBe(true);
    }
  });

  test('safe 与 build 路线不强制进入精英分支，并按路线记录遭遇指标', () => {
    for (const routeMode of ['safe', 'build'] as const) {
      const summaries = runAct2EntryValidation({
        seed: 1001,
        runsPerPolicy: 6,
        routeMode,
      });

      for (const summary of summaries) {
        expect(summary.routeMode).toBe(routeMode);
        expect(summary.act2EliteBranchEnterCount).toBe(0);
        expect(summary.encounterBreakdown.every((item) => item.routeId === routeMode)).toBe(true);
      }
    }
  });
});
