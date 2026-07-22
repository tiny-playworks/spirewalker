# Review Handoff Report — Requirement R1 (Relic Runtime Protocol & Pool Integration)

## 1. Observation

Direct observations from inspection and execution:

1. **`pnpm check` Output**:
   Command: `pnpm check` (outside sandbox environment)
   Result: **FAILED** (exit code 1)
   Verbatim output:
   ```
   > spirewalker@ lint /Users/liangshuai/mdd_work/sljt
   > rslint

   @typescript-eslint/no-unused-vars — [error] 'GameEvent' is defined but never used.
   ╭─┴──────────( src/game/core/systems/relic/relicHooks.ts:1:15 )─────
   │ 1 │ import type { GameEvent } from '../../events/types';
   │ 2 │ import type { BattleState } from '../../model/battle';
   ╰────────────────────────────────

   @typescript-eslint/no-unused-vars — [error] 'BattleState' is defined but never used.
   ╭─┴──────────( src/game/core/systems/relic/relicHooks.ts:2:15 )─────
   │ 1 │ import type { GameEvent } from '../../events/types';
   │ 2 │ import type { BattleState } from '../../model/battle';
   │ 3 │ import type { RunState } from '../../model/run';
   ╰────────────────────────────────

   @typescript-eslint/no-unused-vars — [error] 'key' is assigned a value but never used.
   ╭─┴──────────( tests/relics/m1RelicStress.test.ts:98:25 )─────
   │ 97 │ // Inspect result keys for NaN or invalid numbers
   │ 98 │ for (const [key, value] of Object.entries(res)) {
   │ 99 │ if (typeof value === 'number') {
   ╰────────────────────────────────

   Found 3 errors and 0 warnings (linted 268 files in 1.255s using 14 threads)
   ```

2. **`pnpm typecheck` Output**:
   Command: `pnpm typecheck`
   Result: **FAILED** (exit code 2)
   Verbatim output:
   ```
   src/game/core/systems/relic/relicHooks.ts(1,1): error TS6133: 'GameEvent' is declared but its value is never read.
   src/game/core/systems/relic/relicHooks.ts(2,1): error TS6133: 'BattleState' is declared but its value is never read.
   tests/relics/m1RelicStress.test.ts(98,25): error TS6133: 'key' is declared but its value is never read.
   tests/relics/m1RelicStress.test.ts(152,20): error TS2554: Expected 4 arguments, but got 3.
   ```

3. **`pnpm test` Output**:
   Command: `pnpm test`
   Result: **FAILED** (2 test files, 4 tests failed)
   Verbatim output:
   ```
   FAIL tests/relics/m1RelicStress.test.ts > Milestone 1 Relic & Pool Integration Stress Harness > Pool integrity: no duplicate IDs in COMMON_RELIC_POOL or RUNTIME_RELIC_IDS
   AssertionError: expected 90 to be 86 // Object.is equality
     28 | expect(COMMON_RELIC_POOL.length).toBe(86);
     29 | expect(RUNTIME_RELIC_IDS.length).toBe(86);

   FAIL tests/relics/m1RelicStress.test.ts > Milestone 1 Relic & Pool Integration Stress Harness > Definition coverage: every relic has non-empty id, name, and description
   AssertionError: expected 'momentum_well_b2' to be 'momentum_well' // Object.is equality
     34 | const def = RELIC_DEFINITIONS[relicId];
     35 | expect(def).toBeDefined();
   > 36 | expect(def.id).toBe(relicId);

   FAIL tests/relics/m1RelicStress.test.ts > Milestone 1 Relic & Pool Integration Stress Harness > Shop Relic Pool Generation across 100 seeds
   TypeError: Cannot read properties of undefined (reading 'includes')
     34 | const available = SHOP_RELIC_POOL.filter((id) => !ownedRelicIds.includes(id));
        at generateShop (src/game/core/engine/generateShop.ts:34:67)
        at tests/relics/m1RelicStress.test.ts:152:32

   FAIL tests/reward/rewardFlow.test.ts > reward/rewardFlow > 三条流派构筑都满足 2 张核心牌 + 1 个核心遗物
   AssertionError: expected [ 'vajra', 'anchor', …(88) ] to deeply equal [ 'guard_knot', 'still_core', …(10) ]
     34 | expect(walker.rewardRelicPool).toEqual([
     35 | 'guard_knot',
     36 | 'still_core',
   ```

4. **Source Code Mismatch Inspection**:
   - `src/game/core/definitions/generated_relics/batch2.ts` lines 44–48:
     ```ts
     momentum_well: {
       id: 'momentum_well_b2',
       name: '连势深泉',
       description: '每当你打出能力牌时，获得 1 层连势。',
     },
     ```
     The key in `GENERATED_RELICS_2` dictionary is `momentum_well`, but the inner `id` property is set to `'momentum_well_b2'`.
   - `src/game/core/engine/generateShop.ts` line 34:
     ```ts
     export function generateShop(
       seed: number,
       act: MapAct,
       actFloor: number,
       ownedRelicIds: string[],
     )
     ```
     `ownedRelicIds` has no default value (`ownedRelicIds = []`), so calling `generateShop(seed, act, actFloor)` without the 4th argument causes a runtime crash when evaluating `ownedRelicIds.includes(id)`.

## 2. Logic Chain

1. **Lint & Type Safety**: Observations 1 and 2 show that `pnpm check` and `pnpm typecheck` fail due to unused imports/variables in `relicHooks.ts` and `m1RelicStress.test.ts`, as well as a TypeScript argument count mismatch TS2554 in `m1RelicStress.test.ts`.
2. **Relic Definition Inconsistency**: Observation 3 and 4 show that `RELIC_DEFINITIONS['momentum_well'].id` evaluates to `'momentum_well_b2'`, breaking definition property contracts where `def.id` must equal the dictionary key `relicId`.
3. **Engine Robustness**: Observation 3 and 4 show `generateShop` lacks default fallback for `ownedRelicIds`, throwing `TypeError` if `ownedRelicIds` is not provided.
4. **Regression in Existing Tests**: Observation 3 shows that Worker M1's changes broke existing tests (`rewardFlow.test.ts` and `m1RelicStress.test.ts`). Specifically, modifying `walker.rewardRelicPool` to return all 90 relics broke `rewardFlow.test.ts`, and expanding `COMMON_RELIC_POOL` to 90 without updating `m1RelicStress.test.ts` expectations broke `m1RelicStress.test.ts`.

## 3. Caveats

No caveats. All failures were reproduced and confirmed by executing `pnpm check`, `pnpm typecheck`, and `pnpm test`.

## 4. Conclusion

**Verdict: VETO (REQUEST_CHANGES)**

Worker M1's implementation of Requirement R1 CANNOT be approved in its current state. The work product contains build, lint, TypeScript compilation, runtime TypeError, relic ID mismatch, and test regression failures.

### Findings Summary to Fix:
1. **Critical Finding 1**: Fix lint and TypeScript compilation errors in `relicHooks.ts` (remove unused `GameEvent` and `BattleState` imports) and `m1RelicStress.test.ts` (remove unused `key`, fix argument count in `generateShop` call).
2. **Critical Finding 2**: Fix `id` field in `src/game/core/definitions/generated_relics/batch2.ts` for key `momentum_well` so that `id: 'momentum_well'` matches its dictionary key instead of `'momentum_well_b2'`.
3. **Critical Finding 3**: Add default parameter `ownedRelicIds: string[] = []` in `src/game/core/engine/generateShop.ts` to prevent runtime `TypeError` when called with 3 arguments.
4. **Critical Finding 4**: Fix broken tests in `tests/reward/rewardFlow.test.ts` and `tests/relics/m1RelicStress.test.ts` so `pnpm check` and `pnpm test` pass cleanly.

## 5. Verification Method

To verify the fixes:

1. Run full typecheck and linting:
   `pnpm check`
2. Run test suite:
   `pnpm test`
3. Run simulation benchmark:
   `pnpm simulate:act1`
