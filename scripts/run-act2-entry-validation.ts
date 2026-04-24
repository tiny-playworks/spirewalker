import {
  mergeAct1PreBossLossReports,
  runAct2EntryValidation,
} from '../src/game/simulation/act2EntryValidation';
import type { Act1FloorSegmentId, Act1PreBossLossPolicyReport, Act1TerminationPolicyBreakdown } from '../src/game/simulation/types';
import { walkerBasePolicies } from '../src/game/simulation/policies/walkerPersonas';

type CliOptions = {
  seed: number;
  seeds: number[] | null;
  runsPerPolicy: number;
  progressEvery: number;
  bypassAct1Boss: boolean;
  bypassAct1Midgame: boolean;
  bypassAct1Elite: boolean;
  bypassAct1ToBoss: boolean;
  reportAct1PreBossLoss: boolean;
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
    bypassAct1Boss: false,
    bypassAct1Midgame: false,
    bypassAct1Elite: false,
    bypassAct1ToBoss: false,
    reportAct1PreBossLoss: false,
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
      continue;
    }
    if (arg === '--bypass-act1-boss') {
      options.bypassAct1Boss = true;
      continue;
    }
    if (arg === '--bypass-act1-midgame') {
      options.bypassAct1Midgame = true;
      continue;
    }
    if (arg === '--bypass-act1-elite') {
      options.bypassAct1Elite = true;
      continue;
    }
    if (arg === '--bypass-act1-to-boss') {
      options.bypassAct1ToBoss = true;
      continue;
    }
    if (arg === '--report-act1-pre-boss-loss') {
      options.reportAct1PreBossLoss = true;
      continue;
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

function formatRange(min: number, max: number): string {
  return `${min.toFixed(0)}-${max.toFixed(0)}`;
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

const FLOOR_SEGMENTS: Act1FloorSegmentId[] = ['1-5', '6-9', '10+'];

const FLOOR_SEG_LABEL: Record<Act1FloorSegmentId, string> = {
  '1-5': '1-5',
  '6-9': '6-9',
  '10+': '10-Boss 前',
};

const TERM_FLOOR_LABEL: Record<string, string> = {
  '1-5': '1-5',
  '6-9': '6-9',
  '10+': '10-Boss 前',
  boss: 'Boss',
  act2_plus: 'Act2+',
};

function sortedRecordEntries(record: Record<string, number>): Array<[string, number]> {
  return Object.entries(record).sort((a, b) => b[1] - a[1]);
}

function printTerminationBreakdownSection(title: string, breakdown: Act1TerminationPolicyBreakdown): void {
  if (breakdown.samples === 0) {
    console.log(`${title}: 无样本`);
    console.log('');
    return;
  }
  console.log(title);
  console.log(`- samples=${breakdown.samples}`);
  console.log(`- 终止 screen: ${sortedRecordEntries(breakdown.byScreenBucket as Record<string, number>).map(([k, v]) => `${k}=${v}`).join(', ') || '(empty)'}`);
  console.log(`- 终止 floor 桶: ${sortedRecordEntries(breakdown.byFloorBucket as Record<string, number>).map(([k, v]) => `${TERM_FLOOR_LABEL[k] ?? k}=${v}`).join(', ') || '(empty)'}`);
  console.log(`- 最近节点类型: ${sortedRecordEntries(breakdown.byRecentNodeType as Record<string, number>).map(([k, v]) => `${k}=${v}`).join(', ') || '(empty)'}`);
  console.log(`- reason: ${sortedRecordEntries(breakdown.byReason).map(([k, v]) => `${k}=${v}`).join(', ')}`);
  const tailTop = sortedRecordEntries(breakdown.transitionTailHistogram).slice(0, 8);
  if (tailTop.length > 0) {
    console.log('- 常见 transition 尾链（前 8）:');
    for (const [chain, count] of tailTop) {
      console.log(`  - [${count}] ${chain}`);
    }
  }
  const bs = breakdown.battleSub;
  if (bs.samples > 0) {
    console.log(
      `- 终止于 battle 子集: samples=${bs.samples}; avgTurn=${(bs.sumBattleTurn / bs.samples).toFixed(1)}; avgAliveEnemy=${(bs.sumAliveEnemy / bs.samples).toFixed(2)}; avgEnemyHp=${(bs.sumEnemyHp / bs.samples).toFixed(1)}; avgPlayerHp=${(bs.sumPlayerHp / bs.samples).toFixed(1)}; avgBlock=${(bs.sumPlayerBlock / bs.samples).toFixed(1)}`,
    );
    console.log(`  - battle 内 reason: ${sortedRecordEntries(bs.byAbortReason).map(([k, v]) => `${k}=${v}`).join(', ')}`);
  }
  const ms = breakdown.mapSub;
  if (ms.samples > 0) {
    const avgNext = ms.samples > 0 ? ms.sumNextNodesCount / ms.samples : 0;
    console.log(`- 终止于 map 子集: samples=${ms.samples}; noLegalNext=${ms.zeroNextNodes}; avgNextNodesWhenOnMap=${avgNext.toFixed(2)}`);
  }
  console.log('');
}

function printAct1EndgameDiagnosticsConclusion(report: Act1PreBossLossPolicyReport): void {
  const sim = report.simAbortBreakdown;
  const nb = report.nonBattleEndBreakdown;
  const simTotal = report.simAbortCount;
  const nbTotal = report.nonBattleEndCount;
  const early = simTotal + nbTotal;
  const combatGo = report.act1CombatGameOverCount;
  const denomNoAct2 = report.totalRuns - report.enteredAct2Count;
  const topSimReason = sortedRecordEntries(sim.byReason)[0];
  const topNbReason = sortedRecordEntries(nb.byReason)[0];
  const topSimScreen = sortedRecordEntries(sim.byScreenBucket as Record<string, number>)[0];
  const topNbScreen = sortedRecordEntries(nb.byScreenBucket as Record<string, number>)[0];
  const battleGuard =
    (sim.byReason.battle_no_progress_state ?? 0)
    + (sim.byReason.battle_no_progress_combat ?? 0)
    + (sim.byReason.battle_no_progress_both ?? 0)
    + (sim.byReason.battle_command_limit ?? 0);
  const screenCap = sim.byReason.screen_limit ?? 0;
  const mapStuck = nb.byReason.map_no_legal_next_nodes ?? 0;
  const goOther = nb.byReason.game_over_non_act1_combat_death ?? 0;

  console.log('=== nonBattleEnd / simAbort 归因结论（脚本推断，非平衡改动建议）===');
  if (early === 0 && combatGo === 0) {
    console.log('- 无 simAbort / nonBattleEnd / Act1 战斗致死 样本，跳过。');
    console.log('');
    return;
  }
  if (early === 0 && combatGo > 0) {
    const share = denomNoAct2 > 0 ? combatGo / denomNoAct2 : 0;
    console.log(
      `- 未进 Act2 的 run 中，Act1 战斗 game_over（已正确归因）占 ${formatPercent(share)}（${combatGo}/${denomNoAct2}）；simAbort/nonBattleEnd 为 0：主漏斗为真实战斗失败/耗死，而非地图卡死或本脚本非战斗终局口径。`,
    );
    console.log('');
    return;
  }
  console.log(
    `- 提前终局总量: simAbort=${simTotal}, nonBattleEnd=${nbTotal}（合计 ${early}，占未进 Act2 ${formatPercent(denomNoAct2 > 0 ? early / denomNoAct2 : 0)}）`,
  );
  console.log(`- simAbort 主因（按 reason）: ${topSimReason ? `${topSimReason[0]}（${topSimReason[1]}）` : 'n/a'}；主 screen: ${topSimScreen ? `${topSimScreen[0]}（${topSimScreen[1]}）` : 'n/a'}`);
  console.log(`- nonBattleEnd 主因: ${topNbReason ? `${topNbReason[0]}（${topNbReason[1]}）` : 'n/a'}；主 screen: ${topNbScreen ? `${topNbScreen[0]}（${topNbScreen[1]}）` : 'n/a'}`);
  const guardShare = simTotal > 0 ? battleGuard / simTotal : 0;
  const capShare = simTotal > 0 ? screenCap / simTotal : 0;
  const mapShare = nbTotal > 0 ? mapStuck / nbTotal : 0;
  const earlyShare = denomNoAct2 > 0 ? early / denomNoAct2 : 0;
  const combatShare = denomNoAct2 > 0 ? combatGo / denomNoAct2 : 0;
  if (combatShare >= 0.5 && earlyShare < 0.25) {
    console.log(
      `- 主漏斗提示: Act1 战斗致死 ${combatGo}/${denomNoAct2}（${formatPercent(combatShare)}）仍占大头；simAbort+nonBattleEnd 合计 ${early}（${formatPercent(earlyShare)}）多为少数 instrumentation/副通路。`,
    );
  }
  console.log(
    `- 提前终局（sim+非战斗）内部更像: ${guardShare >= 0.4 ? 'simulation 战斗侧卡死/指令上限（guardrail）' : capShare >= 0.4 ? 'screen 步数上限耗尽' : mapShare >= 0.4 ? '地图无可走步（pathing）' : '混合：请对照上表 reason/screen 细分'}`,
  );
  console.log(`- nonBattleEnd 主因归纳: map 无路=${mapStuck}；game_over 但未记 Act1 战斗死=${goOther}；其余=${nbTotal - mapStuck - goOther}`);
  const proxyOk = combatShare >= 0.4 && earlyShare < 0.2;
  console.log(
    `- 是否还能单靠 normal totalHpLoss proxy 调平衡: ${proxyOk ? '可以更有把握——真实战斗致死已占主导，但 proxy 仍不等于胜率/阈值，应并行看 encounter 与 simAbort 子表' : battleGuard + screenCap > simTotal * 0.5 && simTotal > 0 ? '否——simAbort 内 guardrail 占比过高，应先收敛 simulation 口径再解读耗血 proxy' : '谨慎——请结合上表 combat vs 提前终局占比自行判断'}`,
  );
  console.log('');
}

function printAct1PreBossLossBlock(title: string, report: Act1PreBossLossPolicyReport): void {
  const segs = FLOOR_SEGMENTS;
  console.log(title);
  console.log(`- totalRuns=${report.totalRuns}, enteredAct2=${report.enteredAct2Count}, act1CombatGameOver=${report.act1CombatGameOverCount}, simAbort=${report.simAbortCount}, nonBattleEnd=${report.nonBattleEndCount}`);
  console.log(
    `- Act1 地图普通战路径形态: pathSamples=${report.mapNormalFightShape.samples}, avgNormalFights=${report.mapNormalFightShape.avgNormalFights.toFixed(2)}, range=${report.mapNormalFightShape.minNormalFights}-${report.mapNormalFightShape.maxNormalFights}`,
  );
  console.log('- Act1 safe/balance/risk 路线结构:');
  for (const key of ['safe', 'balance', 'risk', 'mixed'] as const) {
    const row = report.routeShapeByBias[key];
    if (row.samples === 0) continue;
    console.log(
      `  - ${key}: routes=${row.samples}, eliteAvg=${row.avgEliteFights.toFixed(2)} (${formatRange(row.minEliteFights, row.maxEliteFights)}), normalAvg=${row.avgNormalFights.toFixed(2)} (${formatRange(row.minNormalFights, row.maxNormalFights)}), bufferAvg=${row.avgBufferNodes.toFixed(2)} (${formatRange(row.minBufferNodes, row.maxBufferNodes)}), maxBattleStreak=${row.maxBattleStreak}, 0/1/2+elite=${row.zeroEliteRoutes}/${row.oneEliteRoutes}/${row.twoPlusEliteRoutes}`,
    );
  }
  console.log(`- Act1 实际 normal attempts/run: avg=${report.avgObservedAct1NormalAttempts.toFixed(2)}`);
  console.log(
    `- 首精英回归: firstEliteAttempts=${report.firstEliteRegression.attempts}, firstEliteWin=${formatPercent(report.firstEliteRegression.winRate)} (${report.firstEliteRegression.wins}/${report.firstEliteRegression.attempts}), avgDeckSize=${report.firstEliteRegression.avgDeckSizeAtFirstElite.toFixed(2)}, avgNormalBefore=${report.firstEliteRegression.avgNormalFightsBeforeFirstElite.toFixed(2)}`,
  );
  const firstEliteMonsterRows = Object.entries(report.firstEliteRegression.byMonsterId);
  if (firstEliteMonsterRows.length > 0) {
    console.log('- 首精英按 monsterId 拆分:');
    for (const [monsterId, row] of firstEliteMonsterRows) {
      console.log(`  - ${monsterId}: attempts=${row.attempts}, wins=${row.wins}, winRate=${formatPercent(row.winRate)}`);
    }
  }
  console.log(`- death tier (act1 combat): normal=${report.deathTierCounts.normal}, elite=${report.deathTierCounts.elite}, boss=${report.deathTierCounts.boss}`);
  const combatDeaths = report.deathTierCounts.normal + report.deathTierCounts.elite + report.deathTierCounts.boss;
  const directNormalElite = report.deathTierCounts.normal + report.deathTierCounts.elite;
  const bossDeaths = report.deathTierCounts.boss;
  console.log(
    `- 损耗形态: 直接死于普通战+精英=${directNormalElite}（占 Act1 战斗致死 ${combatDeaths > 0 ? formatPercent(directNormalElite / combatDeaths) : '0.0%'}）`
    + ` | 死于 Boss=${bossDeaths}（其中进 Boss 时已耗残<40% hp=${report.bossDeathWornDownCount}，相对满血=${report.bossDeathFreshCount}）`,
  );
  console.log(`- death floor segment (all act1 combat): ${segs.map((s) => `${FLOOR_SEG_LABEL[s]}=${report.deathFloorSegmentCounts[s]}`).join(', ')}`);
  console.log(`- death floor segment (normal only): ${segs.map((s) => `${FLOOR_SEG_LABEL[s]}=${report.deathNormalFloorSegmentCounts[s]}`).join(', ')}`);
  console.log(`- boss death hp@engage: wornDown(<40%)=${report.bossDeathWornDownCount}, fresh(>=40%)=${report.bossDeathFreshCount}`);
  console.log('- Boss 前 normal 按 floor 段（battles / wins / avgHpLoss / avgTurns）:');
  for (const s of segs) {
    const row = report.normalFloorSegmentAgg[s];
    const avgHp = row.battles > 0 ? row.totalHpLoss / row.battles : 0;
    const avgTurn = row.battles > 0 ? row.totalTurns / row.battles : 0;
    console.log(`  - ${FLOOR_SEG_LABEL[s]}: battles=${row.battles}, wins=${row.wins}, avgHpLoss=${avgHp.toFixed(2)}, avgTurns=${avgTurn.toFixed(2)}`);
  }
  const profiles = Object.entries(report.normalProfileAgg)
    .map(([profile, row]) => ({
      profile,
      totalHpLoss: row.totalHpLoss,
      attempts: row.attempts,
      wins: row.wins,
      avgHpLoss: row.attempts > 0 ? row.totalHpLoss / row.attempts : 0,
    }))
    .sort((a, b) => b.totalHpLoss - a.totalHpLoss);
  console.log('- Boss 前 normal 按 pressureProfile（按 totalHpLoss 降序）:');
  for (const row of profiles) {
    console.log(`  - ${row.profile}: attempts=${row.attempts}, wins=${row.wins}, totalHpLoss=${row.totalHpLoss.toFixed(0)}, avgHpLoss=${row.avgHpLoss.toFixed(2)}`);
  }
  console.log('- Boss 前 normal 按 encounter（按 totalHpLoss 降序，前 12 条）:');
  for (const row of report.normalEncounterAgg.slice(0, 12)) {
    console.log(
      `  - ${row.encounterId} [${row.pressureProfile}]: attempts=${row.attempts}, winRate=${formatPercent(row.winRate)}, totalHpLoss=${row.totalHpLoss.toFixed(0)}, avgHpLoss=${row.avgHpLoss.toFixed(2)}, avgTurns=${row.avgTurns.toFixed(2)}`,
    );
  }
  if (report.nodeChoiceDeathSamples > 0) {
    const entries = Object.entries(report.nodeChoiceSumAtAct1CombatDeath).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
    console.log(`- Act1 战斗致死 run 的 map 节点选择累计（样本=${report.nodeChoiceDeathSamples}）:`);
    for (const [kind, count] of entries) {
      console.log(`  - ${kind}: ${count}`);
    }
  } else {
    console.log('- Act1 战斗致死 run 的 map 节点选择累计: 无样本');
  }

  const combatDeathTotal = segs.reduce((sum, seg) => sum + report.deathFloorSegmentCounts[seg], 0);
  const topSeg = [...segs].sort((a, b) => report.deathFloorSegmentCounts[b] - report.deathFloorSegmentCounts[a])[0]!;
  const topSegCount = report.deathFloorSegmentCounts[topSeg];
  const topEncounter = report.normalEncounterAgg[0];
  const topProfile = profiles[0];
  console.log('- 观测结论（脚本推断）:');
  if (combatDeathTotal === 0) {
    console.log('  - 本聚合内无 Act1 战斗致死样本：floor 段死亡分布跳过；以下 normal 漏斗仅按 totalHpLoss（压力 proxy）排序。');
  } else {
    console.log(`  - Boss 前 Act1 战斗致死主要集中在 floor 段: ${FLOOR_SEG_LABEL[topSeg]}（${topSegCount} 次）`);
  }
  if (topEncounter) {
    console.log(`  - Boss 前 normal 总血量压力最高的 encounter: ${topEncounter.encounterId}（totalHpLoss=${topEncounter.totalHpLoss.toFixed(0)}）`);
  }
  if (topProfile) {
    console.log(`  - Boss 前 normal 总血量压力最高的题型（pressureProfile）: ${topProfile.profile}（totalHpLoss=${topProfile.totalHpLoss.toFixed(0)}）`);
  }
  if (combatDeathTotal === 0) {
    console.log(
      `  - Boss 前最该先修的段位 / 题型 = （无致死样本，仅压力 proxy）normal 题型 ${topProfile?.profile ?? 'n/a'} / encounter ${topEncounter?.encounterId ?? 'n/a'}（请加大 runs 或 seeds 后再看死亡段位）`,
    );
  } else {
    console.log(
      `  - Boss 前最该先修的段位 / 题型 = ${FLOOR_SEG_LABEL[topSeg]} / ${topProfile?.profile ?? 'n/a'}（优先 encounter: ${topEncounter?.encounterId ?? 'n/a'}）`,
    );
  }
  printTerminationBreakdownSection(`sim_abort 归因（${title}）`, report.simAbortBreakdown);
  printTerminationBreakdownSection(`non_battle_end 归因（${title}）`, report.nonBattleEndBreakdown);
  if (report.nonBattleEndCount > report.nonBattleEndBreakdown.samples) {
    console.log(
      `- 说明: nonBattleEndCount（${report.nonBattleEndCount}）含 ${report.nonBattleEndCount - report.nonBattleEndBreakdown.samples} 条无归因快照（多为 act1Death=null 的终局口径），与上表 samples 不同属正常。`,
    );
    console.log('');
  }
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
      bypassAct1Boss: options.bypassAct1Boss,
      bypassAct1Midgame: options.bypassAct1Midgame,
      bypassAct1Elite: options.bypassAct1Elite,
      bypassAct1ToBoss: options.bypassAct1ToBoss,
      includeAct1PreBossLossReport: options.reportAct1PreBossLoss,
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

  console.log(
    `Act2 entry validation | seeds=${seedList.join(',')} | runsPerPolicy=${options.runsPerPolicy}`
    + ` | bypassAct1Boss=${options.bypassAct1Boss}`
    + ` | bypassAct1Midgame=${options.bypassAct1Midgame}`
    + ` | bypassAct1Elite=${options.bypassAct1Elite}`
    + ` | bypassAct1ToBoss=${options.bypassAct1ToBoss}`
    + ` | reportAct1PreBossLoss=${options.reportAct1PreBossLoss}`,
  );
  console.log('');
  printGlobalSummary(summaries);

  for (const summary of summaries) {
    printPolicySummary(summary, printEncounterBreakdown);
  }

  if (options.reportAct1PreBossLoss) {
    console.log('=== Act1 Boss 前普通战损耗分解（跨 seed 汇总） ===\n');
    const perPolicyReports = new Map<string, Act1PreBossLossPolicyReport[]>();
    for (const batch of batches) {
      for (const row of batch) {
        if (!row.act1PreBossLossReport) continue;
        const list = perPolicyReports.get(row.policyId) ?? [];
        list.push(row.act1PreBossLossReport);
        perPolicyReports.set(row.policyId, list);
      }
    }
    const mergedPersonas = [...perPolicyReports.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    const globalParts: Act1PreBossLossPolicyReport[] = [];
    const personaRows: Array<{ policyId: string; merged: Act1PreBossLossPolicyReport }> = [];
    for (const [policyId, list] of mergedPersonas) {
      const merged = mergeAct1PreBossLossReports(list);
      globalParts.push(merged);
      personaRows.push({ policyId, merged });
      printAct1PreBossLossBlock(`${personaName(policyId)} (${policyId})`, merged);
    }
    if (personaRows.length > 0) {
      const byAct1DeathRate = [...personaRows].sort((a, b) => {
        const ra = a.merged.totalRuns > 0 ? a.merged.act1CombatGameOverCount / a.merged.totalRuns : 0;
        const rb = b.merged.totalRuns > 0 ? b.merged.act1CombatGameOverCount / b.merged.totalRuns : 0;
        return rb - ra;
      });
      const byAct2Entry = [...personaRows].sort((a, b) => {
        const ra = a.merged.totalRuns > 0 ? a.merged.enteredAct2Count / a.merged.totalRuns : 0;
        const rb = b.merged.totalRuns > 0 ? b.merged.enteredAct2Count / b.merged.totalRuns : 0;
        return ra - rb;
      });
      console.log('=== Persona 掉队（跨 seed，按 Act1 战斗致死率降序）===');
      for (const { policyId, merged } of byAct1DeathRate) {
        const rate = merged.totalRuns > 0 ? merged.act1CombatGameOverCount / merged.totalRuns : 0;
        console.log(`- ${personaName(policyId)} (${policyId}): act1CombatDeathRate=${formatPercent(rate)} (${merged.act1CombatGameOverCount}/${merged.totalRuns})`);
      }
      console.log('');
      console.log('=== Persona 掉队（Act2 进入率升序 = 最先掉队）===');
      for (const { policyId, merged } of byAct2Entry) {
        const rate = merged.totalRuns > 0 ? merged.enteredAct2Count / merged.totalRuns : 0;
        console.log(`- ${personaName(policyId)} (${policyId}): act2EntryRate=${formatPercent(rate)} (${merged.enteredAct2Count}/${merged.totalRuns})`);
      }
      console.log('');
      console.log('=== debt_monk 首精英按 persona 拆分 ===');
      for (const { policyId, merged } of personaRows) {
        const row = merged.firstEliteRegression.byMonsterId.act1_debt_monk;
        if (!row) {
          console.log(`- ${personaName(policyId)} (${policyId}): attempts=0`);
          continue;
        }
        console.log(`- ${personaName(policyId)} (${policyId}): attempts=${row.attempts}, wins=${row.wins}, winRate=${formatPercent(row.winRate)}`);
      }
      console.log('');
    }
    if (globalParts.length > 0) {
      const globalMerged = mergeAct1PreBossLossReports(globalParts);
      printAct1PreBossLossBlock('全局（三 persona 合并）', globalMerged);
      printAct1EndgameDiagnosticsConclusion(globalMerged);
    }
  }
}

printSummary();
