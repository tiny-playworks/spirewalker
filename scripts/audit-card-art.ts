import { existsSync, statSync } from 'node:fs';
import { ACT1_REWARD_CARD_IDS } from '../src/game/core/definitions/act1Content';
import { ACT2_REWARD_CARD_IDS } from '../src/game/core/definitions/act2Content';

const maxBytes = 130 * 1024;
const formalCardIds = [...ACT1_REWARD_CARD_IDS, ...ACT2_REWARD_CARD_IDS];
const rows = formalCardIds.map((id) => {
  const path = `public/assets/cards/art/${id}.webp`;
  return { id, path, exists: existsSync(path), bytes: existsSync(path) ? statSync(path).size : 0 };
});
const missing = rows.filter((row) => !row.exists);
const oversized = rows.filter((row) => row.exists && row.bytes > maxBytes);

console.log(`正式卡图：${rows.length - missing.length}/${rows.length}`);
if (missing.length > 0) console.log(`缺失：${missing.map((row) => row.id).join(', ')}`);
if (oversized.length > 0) console.log(`超出 130KB：${oversized.map((row) => `${row.id} (${Math.ceil(row.bytes / 1024)}KB)`).join(', ')}`);

if (missing.length > 0 || oversized.length > 0) process.exitCode = 1;
