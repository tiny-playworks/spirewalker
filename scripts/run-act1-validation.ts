import {
  runAct1GuardFirstEliteDiagnosis,
  runAct1ValidationSuite,
} from '../src/game/simulation/act1Validation';
import {
  walkerBasePolicies,
  walkerElitePriorityPolicies,
} from '../src/game/simulation/policies/walkerPersonas';

type CliOptions = {
  seed: number;
  seeds: number[] | null;
  runsPerPolicy: number;
  includeElitePriority: boolean;
  nonBattleTop: number;
  compareBattleGuards: boolean;
};

const PERSONA_CN: Record<string, string> = {
  'walker-guard': '防守流',
  'walker-burst': '爆发流',
  'walker-mixed': '混合流',
};

const MONSTER_CN: Record<string, string> = {
  act1_executioner: '执行者',
  act1_twin_hunter: '双刃猎手',
  act1_debt_monk: '收债修士',
};

const NODE_TYPE_CN: Record<string, string> = {
  battle: '普通战',
  elite: '精英战',
  event: '事件',
  shop: '商店',
  rest: '营火',
  treasure: '宝箱',
  boss: 'Boss',
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    seed: 1001,
    seeds: null,
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
  if (options.seeds && options.seeds.length === 0) {
    throw new Error('invalid --seeds');
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

function formatNodeChoicesCn(summary: Awaited<ReturnType<typeof runAct1ValidationSuite>>[number]): string {
  return summary.nodeChoiceBreakdown
    .map((item) => `${NODE_TYPE_CN[item.type] ?? item.type}=${(item.rate * 100).toFixed(1)}%(${item.count})`)
    .join(', ');
}

function formatFirstEliteMonsterCounts(summary: Awaited<ReturnType<typeof runAct1ValidationSuite>>[number], field: 'attempts' | 'deaths'): string {
  const source = field === 'attempts'
    ? summary.firstEliteAttemptsByMonsterId
    : summary.firstEliteDeathsByMonsterId;
  return Object.entries(source)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([monsterId, count]) => `${monsterId}=${count}`)
    .join(', ');
}

function formatFirstEliteMonsterRates(summary: Awaited<ReturnType<typeof runAct1ValidationSuite>>[number]): string {
  return Object.entries(summary.firstEliteWinRateByMonsterId)
    .sort((left, right) => {
      if (right[1] !== left[1]) return right[1] - left[1];
      return left[0].localeCompare(right[0]);
    })
    .map(([monsterId, rate]) => `${monsterId}=${(rate * 100).toFixed(1)}%`)
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

function personaName(policyId: string): string {
  return PERSONA_CN[policyId] ?? policyId;
}

function monsterName(monsterId: string): string {
  return MONSTER_CN[monsterId] ?? monsterId;
}

function sortedFirstEliteRate(
  summaries: Awaited<ReturnType<typeof runAct1ValidationSuite>>,
): Array<{ policyId: string; label: string; rate: number; attempts: number }> {
  return summaries
    .map((summary) => ({
      policyId: summary.policyId,
      label: personaName(summary.policyId),
      rate: summary.firstElite.winRate,
      attempts: summary.firstElite.attempts,
    }))
    .sort((a, b) => b.rate - a.rate || b.attempts - a.attempts || a.policyId.localeCompare(b.policyId));
}

function primarySuppressionMonster(summary: Awaited<ReturnType<typeof runAct1ValidationSuite>>[number]): {
  monsterId: string;
  deaths: number;
  attempts: number;
  winRate: number;
} | null {
  const candidates = Object.entries(summary.firstEliteDeathsByMonsterId)
    .map(([monsterId, deaths]) => ({
      monsterId,
      deaths,
      attempts: summary.firstEliteAttemptsByMonsterId[monsterId] ?? 0,
      winRate: summary.firstEliteWinRateByMonsterId[monsterId] ?? 0,
    }))
    .filter((item) => item.attempts > 0)
    .sort((a, b) => b.deaths - a.deaths || a.winRate - b.winRate || a.monsterId.localeCompare(b.monsterId));
  return candidates[0] ?? null;
}

function printChineseQuickView(
  summaries: Awaited<ReturnType<typeof runAct1ValidationSuite>>,
  guardDiagnosis: ReturnType<typeof runAct1GuardFirstEliteDiagnosis>,
): void {
  console.log('中文速览');
  console.log('');
  console.log('首精英通过率（路线强弱）');
  for (const item of sortedFirstEliteRate(summaries)) {
    console.log(`- ${item.label}: ${(item.rate * 100).toFixed(1)}%（遭遇 ${item.attempts}）`);
  }
  console.log('');

  for (const summary of summaries) {
    const label = personaName(summary.policyId);
    console.log(`[${label}]`);
    console.log(`- 首精英遭遇次数: ${summary.firstElite.attempts}`);
    console.log(`- 首精英通过率: ${(summary.firstElite.winRate * 100).toFixed(1)}%`);
    console.log(`- 路线选择倾向: ${formatNodeChoicesCn(summary)}`);
    console.log('- 首精英按怪物拆分:');
    const breakdown = Object.entries(summary.firstEliteAttemptsByMonsterId)
      .filter(([, attempts]) => attempts > 0)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    for (const [monsterId, attempts] of breakdown) {
      const deaths = summary.firstEliteDeathsByMonsterId[monsterId] ?? 0;
      const rate = (summary.firstEliteWinRateByMonsterId[monsterId] ?? 0) * 100;
      console.log(`  - ${monsterName(monsterId)}: 遭遇=${attempts}, 死亡=${deaths}, 通过率=${rate.toFixed(1)}%`);
    }
    const primary = primarySuppressionMonster(summary);
    if (primary) {
      console.log(`- 主要压制来源: ${monsterName(primary.monsterId)}（死亡 ${primary.deaths}/${primary.attempts}）`);
    }
    console.log('');
  }

  const guardSummary = summaries.find((item) => item.policyId === 'walker-guard');
  if (guardSummary) {
    const primary = primarySuppressionMonster(guardSummary);
    if (primary) {
      console.log(`下一步优先建议: 先小幅回调 ${monsterName(primary.monsterId)}（防守流卡点最集中）`);
      console.log('');
    }
  }

  console.log('防守流首精英前成型诊断（只读）');
  console.log(`- 首精英遭遇: ${guardDiagnosis.firstEliteAttempts}/${guardDiagnosis.totalRuns}，失败: ${guardDiagnosis.firstEliteFailures}`);
  console.log(
    `- 到达首精英时平均 deck: 总牌数=${guardDiagnosis.arrivalDeckAverages.deckSize.toFixed(2)}, 保势=${guardDiagnosis.arrivalDeckAverages.setupCount.toFixed(2)}, 兑现=${guardDiagnosis.arrivalDeckAverages.payoffCount.toFixed(2)}, 桥梁=${guardDiagnosis.arrivalDeckAverages.bridgeCount.toFixed(2)}`,
  );
  console.log(
    `- 到达首精英时平均战斗资源: 关键防御牌=${guardDiagnosis.arrivalDeckAverages.defenseCoreCount.toFixed(2)}, momentum 相关牌=${guardDiagnosis.arrivalDeckAverages.momentumRelatedCount.toFixed(2)}`,
  );
  console.log(
    `- 首精英失败局（死亡前 2-3 回合）: 吃到 heavy 比例=${(guardDiagnosis.failureLastTurns.heavySeenRate * 100).toFixed(1)}%, 触发 counter 比例=${(guardDiagnosis.failureLastTurns.counterTriggeredRate * 100).toFixed(1)}%, 平均死亡拍=${guardDiagnosis.failureLastTurns.avgDeathTurn.toFixed(2)}`,
  );
  console.log(
    `- executioner 失败专项: 样本=${guardDiagnosis.executionerFailures.count}, 平均死亡拍=${guardDiagnosis.executionerFailures.avgDeathTurn.toFixed(2)}, 死亡前敌方剩余血量=${guardDiagnosis.executionerFailures.avgEnemyHpAtDeath.toFixed(2)}, 敌方有效血量(含格挡)=${guardDiagnosis.executionerFailures.avgEnemyEffectiveHpAtDeath.toFixed(2)}, 玩家死亡时 hp/block=${guardDiagnosis.executionerFailures.avgPlayerHpAtDeath.toFixed(2)}/${guardDiagnosis.executionerFailures.avgPlayerBlockAtDeath.toFixed(2)}`,
  );
  console.log('');
}

type SeedRunResult = {
  seed: number;
  summaries: Awaited<ReturnType<typeof runAct1ValidationSuite>>;
};

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function min(values: number[]): number {
  return values.length === 0 ? 0 : Math.min(...values);
}

function max(values: number[]): number {
  return values.length === 0 ? 0 : Math.max(...values);
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function printAggregateSummary(results: SeedRunResult[]): void {
  if (results.length === 0) return;
  const policyIds = ['walker-guard', 'walker-burst', 'walker-mixed'] as const;
  console.log('多 Seed 聚合汇总');
  console.log('');
  for (const policyId of policyIds) {
    const rates = results
      .map((result) => result.summaries.find((item) => item.policyId === policyId)?.firstElite.winRate ?? 0);
    console.log(
      `- ${personaName(policyId)} firstEliteWin: 平均=${formatPercent(avg(rates))}, 最低=${formatPercent(min(rates))}, 最高=${formatPercent(max(rates))}`,
    );
  }
  const mixedSummaries = results
    .map((result) => result.summaries.find((item) => item.policyId === 'walker-mixed'))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const mixedAttempts = mixedSummaries.map((item) => item.firstElite.attempts);
  const mixedNonBattleRates = mixedSummaries.map((item) =>
    item.deathStageBreakdown.find((entry) => entry.stage === 'non_battle')?.rate ?? 0,
  );
  console.log(
    `- 混合流样本: 首精英样本平均=${avg(mixedAttempts).toFixed(2)}, non-battle 平均占比=${formatPercent(avg(mixedNonBattleRates))}`,
  );
  console.log('');

  const monsterIds = ['act1_executioner', 'act1_twin_hunter', 'act1_debt_monk'] as const;
  console.log('按路线拆分的首精英怪物通过率均值');
  for (const policyId of policyIds) {
    const summaries = results
      .map((result) => result.summaries.find((item) => item.policyId === policyId))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
    const pieces = monsterIds.map((monsterId) => {
      const rates = summaries.map((summary) => summary.firstEliteWinRateByMonsterId[monsterId] ?? 0);
      return `${monsterName(monsterId)}=${formatPercent(avg(rates))}`;
    });
    console.log(`- ${personaName(policyId)}: ${pieces.join('，')}`);
  }
  console.log('');
}

function printSummaryBlock(
  summaries: Awaited<ReturnType<typeof runAct1ValidationSuite>>,
  options: CliOptions,
  label: string,
) {
  for (const summary of summaries) {
    console.log(`[${summary.policyId}] route exposure`);
    console.log(`  - guardrailMode=${summary.guardrailMode}`);
    console.log(`  - anyEliteRuns=${summary.anyEliteRuns}/${summary.totalRuns} (${(summary.anyEliteRate * 100).toFixed(1)}%)`);
    console.log(`  - eliteFights=${summary.elite.attempts}, eliteWinRate=${(summary.elite.winRate * 100).toFixed(1)}%, avgEliteHpLoss=${summary.elite.avgHpLoss.toFixed(2)}`);
    console.log(`  - avgEliteFightsPerRun=${summary.avgEliteFightsPerRun.toFixed(2)}`);
    console.log(`  - avgNormalBeforeBoss=${summary.avgNormalBeforeBoss.toFixed(2)}, avgEliteBeforeBoss=${summary.avgEliteBeforeBoss.toFixed(2)}`);
    console.log(`  - firstEliteAttemptsByMonsterId: ${formatFirstEliteMonsterCounts(summary, 'attempts')}`);
    console.log(`  - firstEliteDeathsByMonsterId: ${formatFirstEliteMonsterCounts(summary, 'deaths')}`);
    console.log(`  - firstEliteWinRateByMonsterId: ${formatFirstEliteMonsterRates(summary)}`);
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
  const seedList = options.seeds ?? [options.seed];
  const policies = options.includeElitePriority
    ? [...walkerBasePolicies, ...walkerElitePriorityPolicies]
    : [...walkerBasePolicies];
  const results: SeedRunResult[] = [];
  for (const seed of seedList) {
    const summaries = runAct1ValidationSuite({
      seed,
      runsPerPolicy: options.runsPerPolicy,
      policies,
      characterId: 'walker',
      guardrailMode: 'progress_guard',
    });
    const guardDiagnosis = runAct1GuardFirstEliteDiagnosis({
      seed,
      runs: options.runsPerPolicy,
      guardrailMode: 'progress_guard',
    });
    results.push({ seed, summaries });
    console.log(`Act1 validation | seed=${seed} | runsPerPolicy=${options.runsPerPolicy}`);
    console.log('');
    if (options.compareBattleGuards) {
      const baseline = runAct1ValidationSuite({
        seed,
        runsPerPolicy: options.runsPerPolicy,
        policies,
        characterId: 'walker',
        guardrailMode: 'baseline_200',
      });
      printCompareBlock(baseline, summaries);
    }
    printChineseQuickView(summaries, guardDiagnosis);
  }
  if (seedList.length > 1) {
    printAggregateSummary(results);
  }
}

main();
