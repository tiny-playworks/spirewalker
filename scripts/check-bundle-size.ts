import { gzipSync } from 'node:zlib';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST_JS_DIR = join(process.cwd(), 'dist/static/js');
const INITIAL_ENTRY_GZIP_BUDGET_BYTES = 144_000;

const entryFiles = readdirSync(DIST_JS_DIR).filter((file) => /^index\..+\.js$/.test(file));
if (entryFiles.length !== 1) {
  throw new Error(`expected one initial entry, found ${entryFiles.length}`);
}

const entryFile = entryFiles[0]!;
const gzipBytes = gzipSync(readFileSync(join(DIST_JS_DIR, entryFile))).byteLength;
const gzipKb = (gzipBytes / 1000).toFixed(1);
const budgetKb = (INITIAL_ENTRY_GZIP_BUDGET_BYTES / 1000).toFixed(1);

console.log(`initial entry gzip: ${gzipKb} kB / budget ${budgetKb} kB`);
if (gzipBytes > INITIAL_ENTRY_GZIP_BUDGET_BYTES) {
  throw new Error(`initial entry exceeds gzip budget by ${gzipBytes - INITIAL_ENTRY_GZIP_BUDGET_BYTES} bytes`);
}
