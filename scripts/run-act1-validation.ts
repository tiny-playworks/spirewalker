import {
  formatAct1ValidationTable,
  runAct1ValidationSuite,
} from '../src/game/simulation/act1Validation';

type CliOptions = {
  seed: number;
  runsPerPolicy: number;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    seed: 1001,
    runsPerPolicy: 50,
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
    }
  }

  if (!Number.isFinite(options.seed)) {
    throw new Error('invalid --seed');
  }
  if (!Number.isFinite(options.runsPerPolicy) || options.runsPerPolicy <= 0) {
    throw new Error('invalid --runs');
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

function main() {
  const options = parseArgs(process.argv.slice(2));
  const summaries = runAct1ValidationSuite({
    seed: options.seed,
    runsPerPolicy: options.runsPerPolicy,
    characterId: 'walker',
  });

  console.log(`Act1 validation | seed=${options.seed} | runsPerPolicy=${options.runsPerPolicy}`);
  console.log('');
  console.log(formatAct1ValidationTable(summaries));
  console.log('');

  for (const summary of summaries) {
    console.log(`[${summary.policyId}] pressureProfile breakdown`);
    for (const item of summary.pressureProfileBreakdown) {
      console.log(formatProfileLine(item));
    }
    console.log('');
  }
}

main();
