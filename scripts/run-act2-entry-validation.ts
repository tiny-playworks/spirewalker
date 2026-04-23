import { runAct2EntryValidation } from '../src/game/simulation/act2EntryValidation';
import { walkerBasePolicies } from '../src/game/simulation/policies/walkerPersonas';

type CliOptions = {
  seed: number;
  seeds: number[] | null;
  runsPerPolicy: number;
  progressEvery: number;
};

const PERSONA_CN: Record<string, string> = {
  'walker-guard': '防守流',
  'walker-burst': '爆发流',
  'walker-mixed': '混合流',
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    seed: 1001,
    seeds: null,
    runsPerPolicy: 50,
    progressEvery: 200,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === '--seed' && next) {
      options.seed = Number(next);
      index += 1;
      continue;
    }
    if (arg === '--seeds' && next) {
      options.seeds = next
        .split(',')
        .map((part) => Number(part.trim()))
        .filter((value) => Number.isFinite(value));
      index += 1;
      continue;
    }
    if ((arg === '--runs' || arg === '--runs-per-policy') && next) {
      options.runsPerPolicy = Number(next);
      index += 1;
      continue;
    }
    if (arg === '--progress-every' && next) {
      options.progressEvery = Number(next);
      index += 1;
    }
  }

  if (!Number.isFinite(options.seed)) throw new Error('invalid --seed');
  if (options.seeds && options.seeds.length === 0) throw new Error('invalid --seeds');
  if (!Number.isFinite(options.runsPerPolicy) || options.runsPerPolicy <= 0) {
    throw new Error('invalid --runs');
  }
  if (!Number.isFinite(options.progressEvery) || options.progressEvery < 0) {
    throw new Error('invalid --progress-every');
  }
  return options;
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function personaName(policyId: string): string {
  return PERSONA_CN[policyId] ?? policyId;
}

type AggregatedEncounterMetric = {
  encounterId: string;
  attempts: number;
  survives: number;
  totalHpLoss: number;
  totalTurns: number;
};

type AggregatedPolicySummary = {
  policyId: string;
  totalRuns: number;
  act1BossReachCount: number;
  act1BossDefeatCount: number;
  act2EntrySamples: number;
  act2Floor13SurviveCount: number;
  act2Floor15SurviveCount: number;
  act2CompletedCount: number;
  act2BattleCount: number;
  act2BattleHpLossTotal: number;
  act2BattleTurnsTotal: number;
  act2EliteBranchEnterCount: number;
  act2EliteBranchSamples: number;
  act2EliteBranchSurviveCount: number;
  encounterBreakdown: AggregatedEncounterMetric[];
};

function aggregateSummaries(
  batches: Array<ReturnType<typeof runAct2EntryValidation>>,
): AggregatedPolicySummary[] {
  const byPolicy = new Map<string, AggregatedPolicySummary>();

  for (const summaries of batches) {
    for (const summary of summaries) {
      const current = byPolicy.get(summary.policyId) ?? {
        policyId: summary.policyId,
        totalRuns: 0,
        act1BossReachCount: 0,
        act1BossDefeatCount: 0,
        act2EntrySamples: 0,
        act2Floor13SurviveCount: 0,
        act2Floor15SurviveCount: 0,
        act2CompletedCount: 0,
        act2BattleCount: 0,
        act2BattleHpLossTotal: 0,
        act2BattleTurnsTotal: 0,
        act2EliteBranchEnterCount: 0,
        act2EliteBranchSamples: 0,
        act2EliteBranchSurviveCount: 0,
        encounterBreakdown: [],
      };

      current.totalRuns += summary.totalRuns;
      current.act1BossReachCount += summary.act1BossReachCount;
      current.act1BossDefeatCount += summary.act1BossDefeatCount;
      current.act2EntrySamples += summary.act2EntrySamples;
      current.act2Floor13SurviveCount += summary.act2Floor13SurviveCount;
      current.act2Floor15SurviveCount += summary.act2Floor15SurviveCount;
      current.act2CompletedCount += Math.round(summary.act2FrontWinRate * summary.act2EntrySamples);
      current.act2EliteBranchEnterCount += summary.act2EliteBranchEnterCount;
      current.act2EliteBranchSamples += summary.act2EliteBranchSamples;
      current.act2EliteBranchSurviveCount += Math.round(summary.act2EliteBranchSurviveRate * summary.act2EliteBranchSamples);

      for (const encounter of summary.encounterBreakdown) {
        const existing = current.encounterBreakdown.find((item) => item.encounterId === encounter.encounterId);
        if (existing) {
          existing.attempts += encounter.attempts;
          existing.survives += encounter.survives;
          existing.totalHpLoss += encounter.avgHpLoss * encounter.attempts;
          existing.totalTurns += encounter.avgTurns * encounter.attempts;
        } else {
          current.encounterBreakdown.push({
            encounterId: encounter.encounterId,
            attempts: encounter.attempts,
            survives: encounter.survives,
            totalHpLoss: encounter.avgHpLoss * encounter.attempts,
            totalTurns: encounter.avgTurns * encounter.attempts,
          });
        }
        current.act2BattleCount += encounter.attempts;
        current.act2BattleHpLossTotal += encounter.avgHpLoss * encounter.attempts;
        current.act2BattleTurnsTotal += encounter.avgTurns * encounter.attempts;
      }

      byPolicy.set(summary.policyId, current);
    }
  }

  return [...byPolicy.values()].sort((left, right) => left.policyId.localeCompare(right.policyId));
}

function printGlobalSummary(
  summaries: AggregatedPolicySummary[],
): void {
  const totalRuns = summaries.reduce((sum, item) => sum + item.totalRuns, 0);
  const bossReachCount = summaries.reduce((sum, item) => sum + item.act1BossReachCount, 0);
  const bossDefeatCount = summaries.reduce((sum, item) => sum + item.act1BossDefeatCount, 0);
  const totalAct2Samples = summaries.reduce((sum, item) => sum + item.act2EntrySamples, 0);
  const floor13Wins = summaries.reduce((sum, item) => sum + item.act2Floor13SurviveCount, 0);
  const floor15Wins = summaries.reduce((sum, item) => sum + item.act2Floor15SurviveCount, 0);
  const eliteEnterCount = summaries.reduce((sum, item) => sum + item.act2EliteBranchEnterCount, 0);
  const eliteSamples = summaries.reduce((sum, item) => sum + item.act2EliteBranchSamples, 0);
  const eliteBranchWins = summaries.reduce((sum, item) => sum + item.act2EliteBranchSurviveCount, 0);

  console.log('全局');
  console.log(`- Act1 boss reach rate: ${formatPercent(totalRuns > 0 ? bossReachCount / totalRuns : 0)} (${bossReachCount}/${totalRuns})`);
  console.log(`- Act1 boss defeat rate: ${formatPercent(totalRuns > 0 ? bossDefeatCount / totalRuns : 0)} (${bossDefeatCount}/${totalRuns})`);
  console.log(`- Act2 entry sample count: ${totalAct2Samples}`);
  console.log(`- Act2 floor 1-3 survive sample count: ${floor13Wins}`);
  console.log(`- Act2 floor 1-5 survive sample count: ${floor15Wins}`);
  console.log(`- Act2 elite branch enter rate: ${formatPercent(totalAct2Samples > 0 ? eliteEnterCount / totalAct2Samples : 0)} (${eliteEnterCount}/${totalAct2Samples})`);
  console.log(`- Act2 elite branch survive rate: ${formatPercent(eliteSamples > 0 ? eliteBranchWins / eliteSamples : 0)} (${eliteBranchWins}/${eliteSamples})`);
  if (totalAct2Samples < 10) {
    console.log('- 样本判定: Act2 样本不足（< 10），当前只建议看入口漏斗，不建议解读 Act2 压力数据。');
  } else {
    console.log('- 样本判定: Act2 样本达到基础观察线（>= 10），可以开始做初步压力解读。');
  }
  console.log('');
}

function printPolicySummary(summary: AggregatedPolicySummary, printEncounterBreakdown: boolean): void {
  const bossReachRate = summary.totalRuns > 0 ? summary.act1BossReachCount / summary.totalRuns : 0;
  const bossDefeatRate = summary.totalRuns > 0 ? summary.act1BossDefeatCount / summary.totalRuns : 0;
  const floor13Rate = summary.act2EntrySamples > 0 ? summary.act2Floor13SurviveCount / summary.act2EntrySamples : 0;
  const floor15Rate = summary.act2EntrySamples > 0 ? summary.act2Floor15SurviveCount / summary.act2EntrySamples : 0;
  const completedRate = summary.act2EntrySamples > 0 ? summary.act2CompletedCount / summary.act2EntrySamples : 0;
  const eliteEnterRate = summary.act2EntrySamples > 0 ? summary.act2EliteBranchEnterCount / summary.act2EntrySamples : 0;
  const eliteSurviveRate = summary.act2EliteBranchSamples > 0 ? summary.act2EliteBranchSurviveCount / summary.act2EliteBranchSamples : 0;
  const avgHpLoss = summary.act2BattleCount > 0 ? summary.act2BattleHpLossTotal / summary.act2BattleCount : 0;
  const avgTurns = summary.act2BattleCount > 0 ? summary.act2BattleTurnsTotal / summary.act2BattleCount : 0;

  console.log(`${personaName(summary.policyId)} (${summary.policyId})`);
  console.log(`- Act1 boss reach rate: ${formatPercent(bossReachRate)} (${summary.act1BossReachCount}/${summary.totalRuns})`);
  console.log(`- Act1 boss defeat rate: ${formatPercent(bossDefeatRate)} (${summary.act1BossDefeatCount}/${summary.totalRuns})`);
  console.log(`- Act2 entry sample count: ${summary.act2EntrySamples}`);
  console.log(`- Act2 floor 1-3 survive rate: ${formatPercent(floor13Rate)} (${summary.act2Floor13SurviveCount}/${summary.act2EntrySamples})`);
  console.log(`- Act2 floor 1-5 survive rate: ${formatPercent(floor15Rate)} (${summary.act2Floor15SurviveCount}/${summary.act2EntrySamples})`);
  console.log(`- Act2 前段完成率: ${formatPercent(completedRate)} (${summary.act2CompletedCount}/${summary.act2EntrySamples})`);
  console.log(`- Act2 平均掉血: ${avgHpLoss.toFixed(2)}`);
  console.log(`- Act2 平均战斗回合数: ${avgTurns.toFixed(2)}`);
  console.log(`- Act2 elite branch enter rate: ${formatPercent(eliteEnterRate)} (${summary.act2EliteBranchEnterCount}/${summary.act2EntrySamples})`);
  console.log(`- Act2 elite branch survive rate: ${formatPercent(eliteSurviveRate)} (${summary.act2EliteBranchSurviveCount}/${summary.act2EliteBranchSamples})`);
  if (printEncounterBreakdown) {
    console.log('- encounter breakdown:');
    for (const item of summary.encounterBreakdown.sort((left, right) => left.encounterId.localeCompare(right.encounterId))) {
      const surviveRate = item.attempts > 0 ? item.survives / item.attempts : 0;
      const avgHpLoss = item.attempts > 0 ? item.totalHpLoss / item.attempts : 0;
      const avgTurns = item.attempts > 0 ? item.totalTurns / item.attempts : 0;
      console.log(
        `  - ${item.encounterId}: attempts=${item.attempts}, survive rate=${formatPercent(surviveRate)}, avgHpLoss=${avgHpLoss.toFixed(2)}, avgTurns=${avgTurns.toFixed(2)}`,
      );
    }
  } else {
    console.log('- encounter breakdown: 已省略（Act2 样本不足，避免过度解释）');
  }
  console.log('');
}

function printSummary(): void {
  const options = parseArgs(process.argv.slice(2));
  const seedList = options.seeds ?? [options.seed];
  const batches = seedList.map((seed, seedIndex) => {
    console.log(`[进度] seed ${seed} 开始（${seedIndex + 1}/${seedList.length}）`);
    const summaries = runAct2EntryValidation({
      seed,
      runsPerPolicy: options.runsPerPolicy,
      policies: walkerBasePolicies,
      onProgress: options.progressEvery > 0
        ? ({ policyId, completedRuns, totalRuns }) => {
            const shouldPrint = completedRuns % options.progressEvery === 0 || completedRuns === totalRuns;
            if (!shouldPrint) return;
            console.log(`[进度] seed=${seed} | ${personaName(policyId)} ${completedRuns}/${totalRuns}`);
          }
        : undefined,
    });
    console.log(`[进度] seed ${seed} 完成`);
    return summaries;
  });
  const summaries = aggregateSummaries(batches);
  const totalAct2Samples = summaries.reduce((sum, item) => sum + item.act2EntrySamples, 0);
  const printEncounterBreakdown = totalAct2Samples >= 10;

  console.log(`Act2 entry validation | seeds=${seedList.join(',')} | runsPerPolicy=${options.runsPerPolicy}`);
  console.log('');
  printGlobalSummary(summaries);

  for (const summary of summaries) {
    printPolicySummary(summary, printEncounterBreakdown);
  }
}

printSummary();
