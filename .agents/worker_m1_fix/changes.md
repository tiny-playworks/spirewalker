# Changes Log — Milestone 1 Remediation

## Summary of Remediations

### 1. Unused Imports & Variables (Lint/Typecheck Errors)
- `src/game/core/systems/relic/relicHooks.ts`:
  - Removed unused imports `GameEvent` and `BattleState`.
- `tests/relics/m1RelicStress.test.ts`:
  - Replaced `for (const [, value] of Object.entries(res))` with `for (const value of Object.values(res))` to eliminate unused `key` variable.

### 2. Relic ID Mismatch (`momentum_well`)
- `src/game/core/definitions/generated_relics/batch2.ts`:
  - Fixed line 45 definition property `id: 'momentum_well_b2'` -> `id: 'momentum_well'` to ensure key-id equality (`def.id === relicId`).

### 3. `generateShop.ts` Default Parameter & Runtime Safety
- `src/game/core/engine/generateShop.ts`:
  - Added default value `ownedRelicIds: string[] = []` to `generateShop(seed, act, actFloor, ownedRelicIds = [])`.
- `tests/relics/m1RelicStress.test.ts`:
  - Updated `generateShop` invocation to `generateShop(run.seed, run.meta.act, run.meta.actFloor, run.meta.relics)` conforming to the function signature.

### 4. Test Suite Regressions
- `tests/relics/m1RelicStress.test.ts`:
  - Updated pool size assertion `expect(COMMON_RELIC_POOL.length).toBe(90)` and `expect(RUNTIME_RELIC_IDS.length).toBe(COMMON_RELIC_POOL.length)` matching the expanded pool size (19 base + 71 generated relics).
- `src/game/core/definitions/characters.ts`:
  - Restored character `rewardRelicPool` contract array to contain the 12 curated archetype reward relics (`guard_knot`, `still_core`, `burst_emblem`, `quick_fuse`, `ward_banner`, `flare_banner`, `blaze_core`, `fractured_blade`, `iron_heart`, `counter_sigil`, `twin_core`, `harmony_emblem`).

## Verification Output
- `pnpm check`: Passed (0 lint errors, 0 typecheck errors, 100% tests passing).
- `pnpm simulate:act1`: Passed (0 runtime errors).
