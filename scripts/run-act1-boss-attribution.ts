import {
  runAct1BossAttributionSuite,
  type Act1BossAttributionLine,
  type Act1BossAttributionSummary,
} from '../src/game/simulation/act1Validation';
import { walkerBasePolicies } from '../src/game/simulation/policies/walkerPersonas';

type CliOptions = {
  seed: number;
  seeds: number[] | null;
  runsPerPolicy: number;
};

type AggregatedBossLine = {
  bossMonsterId: string;
  bossEncounterId: string;
  deaths: number;
  phaseCounts: Map<string, number>;
  playerHpTotal: number;
  playerBlockTotal: number;
  enemyHpTotal: number;
  enemyEffectiveHpTotal: number;
};

type AggregatedPolicySummary = {
  policyId: string;
  totalRuns: number;
  bossReachCount: number;
  bossDefeatCount: number;
  killShareByBoss: AggregatedBossLine[];
};

const PERSONA_CN: Record<string, string> = {
  'walker-guard': '防守流',
  'walker-burst': '爆发流',
  'walker-mixed': '混合流',
};

const BOSS_CN: Record<string, string> = {
  slime_boss: 'slime_boss',
  act1_boss_gate: 'act1_boss_gate',
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    seed: 1001,
    seeds: null,
    runsPerPolicy: 100,
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
  }

  if (!Number.isFinite(options.seed)) throw new Error('invalid --seed');
  if (options.seeds && options.seeds.length === 0) throw new Error('invalid --seeds');
  if (!Number.isFinite(options.runsPerPolicy) || options.runsPerPolicy <= 0) {
    throw new Error('invalid --runs');
  }

  return options;
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function personaName(policyId: string): string {
  return PERSONA_CN[policyId] ?? policyId;
}

function aggregateSuites(
  suites: Act1BossAttributionSummary[][],
): AggregatedPolicySummary[] {
  const byPolicy = new Map<string, AggregatedPolicySummary>();

  for (const summaries of suites) {
    for (const summary of summaries) {
      const current = byPolicy.get(summary.policyId) ?? {
        policyId: summary.policyId,
        totalRuns: 0,
        bossReachCount: 0,
        bossDefeatCount: 0,
        killShareByBoss: [],
      };
      current.totalRuns += summary.totalRuns;
      current.bossReachCount += summary.bossReachCount;
      current.bossDefeatCount += summary.bossDefeatCount;

      for (const line of summary.killShareByBoss) {
        const existing = current.killShareByBoss.find((item) => item.bossMonsterId === line.bossMonsterId);
        if (existing) {
          existing.deaths += line.deaths;
          existing.playerHpTotal += line.avgPlayerHpAtDeath * line.deaths;
          existing.playerBlockTotal += line.avgPlayerBlockAtDeath * line.deaths;
          existing.enemyHpTotal += line.avgEnemyHpAtDeath * line.deaths;
          existing.enemyEffectiveHpTotal += line.avgEnemyEffectiveHpAtDeath * line.deaths;
          for (const phase of line.phaseBreakdown) {
            existing.phaseCounts.set(phase.phase, (existing.phaseCounts.get(phase.phase) ?? 0) + phase.count);
          }
        } else {
          current.killShareByBoss.push({
            bossMonsterId: line.bossMonsterId,
            bossEncounterId: line.bossEncounterId,
            deaths: line.deaths,
            phaseCounts: new Map(line.phaseBreakdown.map((item) => [item.phase, item.count])),
            playerHpTotal: line.avgPlayerHpAtDeath * line.deaths,
            playerBlockTotal: line.avgPlayerBlockAtDeath * line.deaths,
            enemyHpTotal: line.avgEnemyHpAtDeath * line.deaths,
            enemyEffectiveHpTotal: line.avgEnemyEffectiveHpAtDeath * line.deaths,
          });
        }
      }

      byPolicy.set(summary.policyId, current);
    }
  }

  return [...byPolicy.values()].sort((left, right) => left.policyId.localeCompare(right.policyId));
}

function toDisplayLine(
  line: AggregatedBossLine,
  bossDefeatCount: number,
): Act1BossAttributionLine {
  return {
    bossMonsterId: line.bossMonsterId,
    bossEncounterId: line.bossEncounterId,
    deaths: line.deaths,
    killShare: bossDefeatCount > 0 ? line.deaths / bossDefeatCount : 0,
    phaseBreakdown: [...line.phaseCounts.entries()]
      .map(([phase, count]) => ({
        phase,
        count,
        rate: line.deaths > 0 ? count / line.deaths : 0,
      }))
      .sort((left, right) => right.count - left.count || left.phase.localeCompare(right.phase)),
    avgPlayerHpAtDeath: line.deaths > 0 ? line.playerHpTotal / line.deaths : 0,
    avgPlayerBlockAtDeath: line.deaths > 0 ? line.playerBlockTotal / line.deaths : 0,
    avgEnemyHpAtDeath: line.deaths > 0 ? line.enemyHpTotal / line.deaths : 0,
    avgEnemyEffectiveHpAtDeath: line.deaths > 0 ? line.enemyEffectiveHpTotal / line.deaths : 0,
  };
}

function choosePrimaryIntercept(lines: Act1BossAttributionLine[]): {
  bossMonsterId: string;
  reason: string;
} | null {
  if (lines.length === 0) return null;
  const sorted = [...lines].sort((left, right) =>
    right.killShare - left.killShare
    || left.avgEnemyHpAtDeath - right.avgEnemyHpAtDeath
    || left.bossMonsterId.localeCompare(right.bossMonsterId),
  );
  const primary = sorted[0]!;
  const secondary = sorted[1];
  const diff = primary.killShare - (secondary?.killShare ?? 0);
  if (!secondary || diff >= 0.1) {
    return {
      bossMonsterId: primary.bossMonsterId,
      reason: `击杀占比差距达到阈值 (${formatPercent(diff)})`,
    };
  }
  const primaryTopPhase = primary.phaseBreakdown[0];
  const secondaryTopPhase = secondary.phaseBreakdown[0];
  const primaryPhaseRate = primaryTopPhase?.rate ?? 0;
  const secondaryPhaseRate = secondaryTopPhase?.rate ?? 0;
  if (primaryPhaseRate !== secondaryPhaseRate) {
    return {
      bossMonsterId: primaryPhaseRate > secondaryPhaseRate ? primary.bossMonsterId : secondary.bossMonsterId,
      reason: '击杀占比差距低于阈值，改用 phase 集中度判定',
    };
  }
  return {
    bossMonsterId: primary.avgEnemyHpAtDeath <= secondary.avgEnemyHpAtDeath ? primary.bossMonsterId : secondary.bossMonsterId,
    reason: '击杀占比与 phase 集中度接近，改用死亡时敌方剩余血量判定',
  };
}

function printSection(title: string, summary: AggregatedPolicySummary): void {
  const reachRate = summary.totalRuns > 0 ? summary.bossReachCount / summary.totalRuns : 0;
  const defeatRate = summary.totalRuns > 0 ? summary.bossDefeatCount / summary.totalRuns : 0;
  const lines = summary.killShareByBoss.map((line) => toDisplayLine(line, summary.bossDefeatCount));

  console.log(title);
  console.log(`- boss reach rate: ${formatPercent(reachRate)} (${summary.bossReachCount}/${summary.totalRuns})`);
  console.log(`- boss defeat rate: ${formatPercent(defeatRate)} (${summary.bossDefeatCount}/${summary.totalRuns})`);
  for (const line of lines) {
    console.log(`- ${BOSS_CN[line.bossMonsterId] ?? line.bossMonsterId}: 击杀占比=${formatPercent(line.killShare)} (${line.deaths}/${summary.bossDefeatCount})`);
    console.log(`  phase 分布=${line.phaseBreakdown.map((item) => `${item.phase}=${formatPercent(item.rate)}(${item.count})`).join(', ') || 'none'}`);
    console.log(`  平均死亡前玩家 hp/block=${line.avgPlayerHpAtDeath.toFixed(2)}/${line.avgPlayerBlockAtDeath.toFixed(2)}`);
    console.log(`  平均敌方剩余血量=${line.avgEnemyHpAtDeath.toFixed(2)} (有效血量=${line.avgEnemyEffectiveHpAtDeath.toFixed(2)})`);
  }
  const primary = choosePrimaryIntercept(lines);
  console.log(`- 当前主拦截 Boss = ${primary?.bossMonsterId ?? 'none'}`);
  if (primary) console.log(`- 判定依据: ${primary.reason}`);
  console.log('');
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const seeds = options.seeds ?? [options.seed];
  const suites = seeds.map((seed) =>
    runAct1BossAttributionSuite({
      seed,
      runsPerPolicy: options.runsPerPolicy,
      policies: walkerBasePolicies,
    }),
  );
  const summaries = aggregateSuites(suites);
  const global: AggregatedPolicySummary = summaries.reduce((acc, item) => {
    acc.totalRuns += item.totalRuns;
    acc.bossReachCount += item.bossReachCount;
    acc.bossDefeatCount += item.bossDefeatCount;
    for (const line of item.killShareByBoss) {
      const existing = acc.killShareByBoss.find((current) => current.bossMonsterId === line.bossMonsterId);
      if (existing) {
        existing.deaths += line.deaths;
        existing.playerHpTotal += line.playerHpTotal;
        existing.playerBlockTotal += line.playerBlockTotal;
        existing.enemyHpTotal += line.enemyHpTotal;
        existing.enemyEffectiveHpTotal += line.enemyEffectiveHpTotal;
        for (const [phase, count] of line.phaseCounts.entries()) {
          existing.phaseCounts.set(phase, (existing.phaseCounts.get(phase) ?? 0) + count);
        }
      } else {
        acc.killShareByBoss.push({
          bossMonsterId: line.bossMonsterId,
          bossEncounterId: line.bossEncounterId,
          deaths: line.deaths,
          phaseCounts: new Map(line.phaseCounts),
          playerHpTotal: line.playerHpTotal,
          playerBlockTotal: line.playerBlockTotal,
          enemyHpTotal: line.enemyHpTotal,
          enemyEffectiveHpTotal: line.enemyEffectiveHpTotal,
        });
      }
    }
    return acc;
  }, {
    policyId: 'global',
    totalRuns: 0,
    bossReachCount: 0,
    bossDefeatCount: 0,
    killShareByBoss: [],
  });

  console.log(`Act1 boss attribution | seeds=${seeds.join(',')} | runsPerPolicy=${options.runsPerPolicy}`);
  console.log('');
  printSection('全局', global);
  for (const summary of summaries) {
    printSection(`${personaName(summary.policyId)} (${summary.policyId})`, summary);
  }
}

main();
