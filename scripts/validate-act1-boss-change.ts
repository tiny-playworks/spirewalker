import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

type CliOptions = {
  bossId: string;
  before: string;
  after: string;
};

const MONSTER_FILE = 'src/game/core/definitions/monsters/definitions.ts';

function parseArgs(argv: string[]): CliOptions {
  const options: Partial<CliOptions> = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === '--boss' && next) {
      options.bossId = next;
      index += 1;
      continue;
    }
    if (arg === '--before' && next) {
      options.before = next;
      index += 1;
      continue;
    }
    if (arg === '--after' && next) {
      options.after = next;
      index += 1;
      continue;
    }
  }

  if (!options.bossId || !options.before || !options.after) {
    throw new Error('usage: tsx scripts/validate-act1-boss-change.ts --boss <id> --before <text> --after <text>');
  }

  return options as CliOptions;
}

function readHeadSource(): string {
  return execFileSync('git', ['show', `HEAD:${MONSTER_FILE}`], {
    encoding: 'utf8',
  });
}

function readCurrentSource(): string {
  return readFileSync(MONSTER_FILE, 'utf8');
}

function extractBossBlock(source: string, bossId: string): string {
  const marker = `id: "${bossId}"`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`boss not found: ${bossId}`);

  let objectStart = source.lastIndexOf('{', start);
  if (objectStart < 0) throw new Error(`boss block start not found: ${bossId}`);

  let depth = 0;
  for (let index = objectStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (depth === 0) {
      return source.slice(objectStart, index + 1);
    }
  }

  throw new Error(`boss block end not found: ${bossId}`);
}

function countOccurrences(source: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let index = 0;
  while (true) {
    const found = source.indexOf(needle, index);
    if (found < 0) return count;
    count += 1;
    index = found + needle.length;
  }
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const headSource = readHeadSource();
  const currentSource = readCurrentSource();
  const headBlock = extractBossBlock(headSource, options.bossId);
  const currentBlock = extractBossBlock(currentSource, options.bossId);

  const beforeCountInHead = countOccurrences(headBlock, options.before);
  const afterCountInCurrent = countOccurrences(currentBlock, options.after);
  if (beforeCountInHead !== 1) {
    throw new Error(`baseline boss block does not contain unique before text: ${options.before}`);
  }
  if (afterCountInCurrent !== 1) {
    throw new Error(`current boss block does not contain unique after text: ${options.after}`);
  }

  const revertedCurrentBlock = currentBlock.replace(options.after, options.before);
  if (revertedCurrentBlock !== headBlock) {
    throw new Error('boss block changed beyond declared field');
  }

  const revertedCurrentSource = currentSource.replace(currentBlock, revertedCurrentBlock);
  if (revertedCurrentSource !== headSource) {
    throw new Error('file contains extra changes outside declared boss field');
  }

  console.log(`校验通过: ${options.bossId}`);
  console.log(`- 唯一声明变更: ${options.before} -> ${options.after}`);
  console.log('- 未声明字段无改动');
}

main();
