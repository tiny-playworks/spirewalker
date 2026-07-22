import {
  COMMON_RELIC_POOL,
  RELIC_DEFINITIONS,
  rollBossRelicReward,
} from '../../src/game/core/definitions/relics';
import {
  RELIC_HOOKS,
  RUNTIME_RELIC_IDS,
  hasRelicRuntimeHook,
  activeRelicPoolHasRuntimeHooks,
} from '../../src/game/core/systems/relic/relicHooks';
import { CHARACTER_DEFINITIONS } from '../../src/game/core/definitions/characters';
import { generateShop } from '../../src/game/core/engine/generateShop';

console.log('=== VERIFICATION SCRIPT START ===');

// 1. Check COMMON_RELIC_POOL duplicates
const commonSet = new Set<string>();
const commonDuplicates: string[] = [];
for (const id of COMMON_RELIC_POOL) {
  if (commonSet.has(id)) {
    commonDuplicates.push(id);
  }
  commonSet.add(id);
}
console.log(`COMMON_RELIC_POOL count: ${COMMON_RELIC_POOL.length}, unique: ${commonSet.size}`);
if (commonDuplicates.length > 0) {
  console.error(`COMMON_RELIC_POOL has duplicates: ${commonDuplicates.join(', ')}`);
}

// 2. Check hook registration for COMMON_RELIC_POOL
const missingHooks: string[] = [];
const missingDefs: string[] = [];
for (const id of COMMON_RELIC_POOL) {
  if (!RELIC_HOOKS[id]) {
    missingHooks.push(id);
  }
  if (!RELIC_DEFINITIONS[id]) {
    missingDefs.push(id);
  }
}
console.log(`Missing hooks in RELIC_HOOKS: ${missingHooks.length}`);
if (missingHooks.length > 0) console.error(`Missing hooks: ${missingHooks.join(', ')}`);

console.log(`Missing definitions in RELIC_DEFINITIONS: ${missingDefs.length}`);
if (missingDefs.length > 0) console.error(`Missing definitions: ${missingDefs.join(', ')}`);

// 3. activeRelicPoolHasRuntimeHooks()
const activePoolOk = activeRelicPoolHasRuntimeHooks();
console.log(`activeRelicPoolHasRuntimeHooks(): ${activePoolOk}`);

// 4. RUNTIME_RELIC_IDS check
const runtimeSet = new Set(RUNTIME_RELIC_IDS);
const inCommonNotRuntime = COMMON_RELIC_POOL.filter(id => !runtimeSet.has(id));
console.log(`COMMON_RELIC_POOL relics not in RUNTIME_RELIC_IDS: ${inCommonNotRuntime.length}`);

// 5. Character rewardRelicPool check
for (const [charId, charDef] of Object.entries(CHARACTER_DEFINITIONS)) {
  const pool = charDef.rewardRelicPool;
  const charMissingHooks = pool.filter(id => !hasRelicRuntimeHook(id));
  console.log(`Character ${charId} rewardRelicPool count: ${pool.length}, missing runtime hooks: ${charMissingHooks.length}`);
}

// 6. Shop generation stress test (100 iterations)
let shopErrors = 0;
for (let i = 0; i < 100; i++) {
  try {
    const shop = generateShop(1000 + i, 1, 1 + (i % 3), ['vajra']);
    for (const r of shop.relics) {
      if (!RELIC_DEFINITIONS[r.relicId]) {
        console.error(`Shop generated relicId ${r.relicId} which is not in RELIC_DEFINITIONS!`);
        shopErrors++;
      }
      if (!RELIC_HOOKS[r.relicId]) {
        console.error(`Shop generated relicId ${r.relicId} which is not in RELIC_HOOKS!`);
        shopErrors++;
      }
    }
  } catch (e) {
    console.error(`Shop generation error at index ${i}:`, e);
    shopErrors++;
  }
}
console.log(`Shop generation 100 iterations complete, errors: ${shopErrors}`);

// 7. Boss relic reward stress test (100 iterations)
let bossErrors = 0;
for (let i = 0; i < 100; i++) {
  try {
    const relic = rollBossRelicReward(2000 + i, 1, ['anchor', 'wind_chime']);
    if (relic && !RELIC_DEFINITIONS[relic]) {
      console.error(`Boss reward relic ${relic} not in RELIC_DEFINITIONS!`);
      bossErrors++;
    }
    if (relic && !RELIC_HOOKS[relic]) {
      console.error(`Boss reward relic ${relic} not in RELIC_HOOKS!`);
      bossErrors++;
    }
  } catch (e) {
    console.error(`Boss relic reward error at index ${i}:`, e);
    bossErrors++;
  }
}
console.log(`Boss relic reward 100 iterations complete, errors: ${bossErrors}`);

console.log('=== VERIFICATION SCRIPT END ===');
