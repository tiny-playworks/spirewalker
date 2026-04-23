import {
  formatAct1ValidationTable,
  runAct1ValidationSuite,
} from '../src/game/simulation/act1Validation';
import {
  walkerBasePolicies,
  walkerElitePriorityPolicies,
} from '../src/game/simulation/policies/walkerPersonas';

type CliOptions = {
  seed: number;
  runsPerPolicy: number;
  includeElitePriority: boolean;
  nonBattleTop: number;
  compareBattleGuards: boolean;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    seed: 1001,
    runsPerPolicy: 50,
    includeElitePriority: false,
    nonBattleTop: 3,
    compareBattleGuards: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === '--seed' && next) {
      options.seed = Number(next);
      index += 1;
      continue;
    }
    if ((arg === '--runs' || arg === '--runs-per-policy') && next) {
      options.runsPerPolicy = Number(next);
      index += 1;
      continue;
    }
    if (arg === '--non-battle-top' && next) {
      options.nonBattleTop = Number(next);
      index += 1;
      continue;
    }
    if (arg === '--compare-battle-guards') {
      options.compareBattleGuards = true;
      continue;
    }
    if (arg === '--with-elite-priority') options.includeElitePriority = true;
  }

  if (!Number.isFinite(options.seed)) {
    throw new Error('invalid --seed');
  }
  if (!Number.isFinite(options.runsPerPolicy) || options.runsPerPolicy <= 0) {
    throw new Error('invalid --runs');
  }
  if (!Number.isFinite(options.nonBattleTop) || options.nonBattleTop <= 0) {
    throw new Error('invalid --non-battle-top');
  }

  return options;
}

function formatProfileLine(item: {
  profile: string;
  fights: number;
  winRate: number;
  avgTurns: number;
  avgHpLoss: number;
}): string {
  return `  - ${item.profile}: fights=${item.fights}, winRate=${(item.winRate * 100).toFixed(1)}%, avgTurns=${item.avgTurns.toFixed(2)}, avgHpLoss=${item.avgHpLoss.toFixed(2)}`;
}

function formatNodeChoices(summary: Awaited<ReturnType<typeof runAct1ValidationSuite>>[number]): string {
  return summary.nodeChoiceBreakdown
    .map((item) => `${item.type}=${(item.rate * 100).toFixed(1)}%(${item.count})`)
    .join(', ');
}

function formatDeathStages(summary: Awaited<ReturnType<typeof runAct1ValidationSuite>>[number]): string {
  return summary.deathStageBreakdown
    .map((item) => `${item.stage}=${(item.rate * 100).toFixed(1)}%(${item.count})`)
    .join(', ');
}

function formatTrace(summary: Awaited<ReturnType<typeof runAct1ValidationSuite>>[number], seed: number): string[] {
  const trace = summary.nonBattleTraces.find((item) => item.seed === seed);
  if (!trace) return [`  - seed=${seed}: trace missing`];
  return [
    `  - seed=${trace.seed}, mode=${trace.guardrailMode}, reason=${trace.reason}, screen=${trace.screen}, actFloor=${trace.actFloor}, nodeDepth=${trace.nodeDepth ?? 'null'}`,
    `    battleTurn=${trace.battleTurn ?? 'null'}, aliveEnemyCount=${trace.aliveEnemyCount ?? 'null'}, playerHp=${trace.playerHp ?? 'null'}, enemyTotalHp=${trace.enemyTotalHp ?? 'null'}`,
    `    assertions=${trace.assertions.join(' | ') || 'none'}`,
    `    recentNodes=${trace.recentNodeHistory.map((item) => `${item.id}:${item.type}@${item.depth}`).join(' -> ') || 'none'}`,
    `    recentScreens=${trace.recentScreenTransitions.map((item) => `${item.command}:${item.from}->${item.to}@${item.actFloor}`).join(' | ') || 'none'}`,
    `    nextNodes=${trace.nextNodes.map((item) => `${item.id}:${item.type}@${item.depth}`).join(', ') || 'none'}`,
  ];
}

function formatInvariantTrace(summary: Awaited<ReturnType<typeof runAct1ValidationSuite>>[number], seed: number): string[] {
  const trace = summary.summaryInvariantTraces.find((item) => item.seed === seed);
  if (!trace) return [`  - seed=${seed}: invariant trace missing`];
  return [
    `  - seed=${trace.seed}, mode=${trace.guardrailMode}, reason=${trace.reason}`,
    `    assertions=${trace.assertions.join(' | ')}`,
    `    tiers=${trace.encounterTiersVisited.join(' -> ') || 'none'}`,
    `    firstElite=${trace.firstEliteEncounterId ?? 'null'}@${trace.firstEliteBattleIndex ?? 'null'}`,
    `    deathEncounter=${trace.deathEncounterTier ?? 'null'}:${trace.deathEncounterId ?? 'null'}`,
    `    battleTimeline=${trace.battleTimeline.map((item) => `#${item.battleIndex}:${item.tier}:${item.encounterId}:${item.won === null ? 'pending' : item.won ? 'win' : 'loss'}`).join(' | ') || 'none'}`,
  ];
}

function nonBattleRate(summary: Awaited<ReturnType<typeof runAct1ValidationSuite>>[number]): number {
  return summary.deathStageBreakdown.find((item) => item.stage === 'non_battle')?.rate ?? 0;
}

function topNonBattleReason(summary: Awaited<ReturnType<typeof runAct1ValidationSuite>>[number]): string {
  return summary.nonBattleBreakdown[0]?.reason ?? 'none';
}

function printSummaryBlock(
  summaries: Awaited<ReturnType<typeof runAct1ValidationSuite>>,
  options: CliOptions,
  label: string,
) {
  console.log(label);
  console.log('');
  console.log(formatAct1ValidationTable(summaries));
  console.log('');

  for (const summary of summaries) {
    console.log(`[${summary.policyId}] route exposure`);
    console.log(`  - guardrailMode=${summary.guardrailMode}`);
    console.log(`  - anyEliteRuns=${summary.anyEliteRuns}/${summary.totalRuns} (${(summary.anyEliteRate * 100).toFixed(1)}%)`);
    console.log(`  - eliteFights=${summary.elite.attempts}, eliteWinRate=${(summary.elite.winRate * 100).toFixed(1)}%, avgEliteHpLoss=${summary.elite.avgHpLoss.toFixed(2)}`);
    console.log(`  - avgEliteFightsPerRun=${summary.avgEliteFightsPerRun.toFixed(2)}`);
    console.log(`  - avgNormalBeforeBoss=${summary.avgNormalBeforeBoss.toFixed(2)}, avgEliteBeforeBoss=${summary.avgEliteBeforeBoss.toFixed(2)}`);
    console.log(`  - nodeChoices: ${formatNodeChoices(summary)}`);
    console.log(`  - endStages: ${formatDeathStages(summary)}`);
    if (summary.nonBattleBreakdown.length > 0) {
      console.log(`  - nonBattleTop${options.nonBattleTop}:`);
      for (const item of summary.nonBattleBreakdown.slice(0, options.nonBattleTop)) {
        console.log(
          `    * ${item.reason}: ${(item.rate * 100).toFixed(1)}%(${item.count}), exampleSeeds=${item.exampleSeeds.join(', ')}`,
        );
        for (const line of item.exampleSeeds.flatMap((seed) => formatTrace(summary, seed))) {
          console.log(line);
        }
      }
    }
    if (summary.summaryInvariantBreakdown.length > 0) {
      console.log(`  - eliteSummaryMismatchTop${options.nonBattleTop}:`);
      for (const item of summary.summaryInvariantBreakdown.slice(0, options.nonBattleTop)) {
        console.log(
          `    * ${item.reason}: ${(item.rate * 100).toFixed(1)}%(${item.count}), exampleSeeds=${item.exampleSeeds.join(', ')}`,
        );
        for (const line of item.exampleSeeds.flatMap((seed) => formatInvariantTrace(summary, seed))) {
          console.log(line);
        }
      }
    }
    console.log('');
    console.log(`[${summary.policyId}] pressureProfile breakdown`);
    for (const item of summary.pressureProfileBreakdown) {
      console.log(formatProfileLine(item));
    }
    console.log('');
  }
}

function printCompareBlock(
  baseline: Awaited<ReturnType<typeof runAct1ValidationSuite>>,
  improved: Awaited<ReturnType<typeof runAct1ValidationSuite>>,
) {
  console.log('A/B compare');
  console.log('');
  console.log('Bot\tnonBattleA\tnonBattleB\tfirstEliteA\tfirstEliteB\tbossA\tbossB\ttopReasonA\ttopReasonB');
  for (const improvedSummary of improved) {
    const baselineSummary = baseline.find((item) => item.policyId === improvedSummary.policyId);
    if (!baselineSummary) continue;
    console.log([
      improvedSummary.policyId,
      `${(nonBattleRate(baselineSummary) * 100).toFixed(1)}%`,
      `${(nonBattleRate(improvedSummary) * 100).toFixed(1)}%`,
      baselineSummary.firstElite.attempts,
      improvedSummary.firstElite.attempts,
      baselineSummary.boss.attempts,
      improvedSummary.boss.attempts,
      topNonBattleReason(baselineSummary),
      topNonBattleReason(improvedSummary),
    ].join('\t'));
  }
  console.log('');
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const policies = options.includeElitePriority
    ? [...walkerBasePolicies, ...walkerElitePriorityPolicies]
    : [...walkerBasePolicies];
  const summaries = runAct1ValidationSuite({
    seed: options.seed,
    runsPerPolicy: options.runsPerPolicy,
    policies,
    characterId: 'walker',
    guardrailMode: 'progress_guard',
  });

  console.log(`Act1 validation | seed=${options.seed} | runsPerPolicy=${options.runsPerPolicy}`);
  console.log('');
  if (options.compareBattleGuards) {
    const baseline = runAct1ValidationSuite({
      seed: options.seed,
      runsPerPolicy: options.runsPerPolicy,
      policies,
      characterId: 'walker',
      guardrailMode: 'baseline_200',
    });
    printCompareBlock(baseline, summaries);
    printSummaryBlock(baseline, options, 'Baseline | command limit 200');
  }
  printSummaryBlock(summaries, options, 'Improved | high command limit + no-progress guard');
}

main();
