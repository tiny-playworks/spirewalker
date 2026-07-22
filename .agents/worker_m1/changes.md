# Changes Summary — Milestone 1 (Requirement R1)

## Files Created / Modified

1. **`src/game/core/relics/relicHookProtocol.ts`** (New File):
   - Established standard Relic Runtime Protocol interface module.
   - Defined `RelicTrigger`, `RelicHookContext`, `RelicHookResult`, and `RelicHook`.
   - Extended `RelicHookResult` with domain deltas (`costReduction`, `primedBreak`, `vulnerableStacks`, `goldBonus`).

2. **`src/game/core/systems/relic/relicHooks.ts`**:
   - Re-exported protocol interfaces from `src/game/core/relics/relicHookProtocol.ts`.
   - Registered 71 generated relics from `GENERATED_RELICS` (`batch1.ts`, `batch2.ts`, `batch3.ts`) alongside 19 base relics into `RELIC_HOOKS` dictionary and `RUNTIME_RELIC_IDS` (90 relics total).
   - Updated `resolveRelicHooks` to accumulate new deltas.

3. **`src/game/core/definitions/relics.ts`**:
   - Expanded `COMMON_RELIC_POOL` from 12 base relics to 90 wired relics.
   - Exported `BOSS_RELIC_POOL` based on `COMMON_RELIC_POOL`.

4. **`src/game/core/definitions/characters.ts`**:
   - Updated `rewardRelicPool` for `walker` in `CHARACTER_DEFINITIONS` to use a getter referencing `[...COMMON_RELIC_POOL]`.
   - Fixed circular import module loading order between `relics.ts` and `characters.ts`.

5. **`src/game/core/engine/generateShop.ts`**:
   - Updated `SHOP_RELIC_POOL` to reference `COMMON_RELIC_POOL` so all 90 wired relics can drop in shop offers.

6. **`tests/relics/relicHookRegistry.test.ts`**:
   - Expanded test contexts dictionary to map all 90 runtime relics to valid trigger execution branches.
   - Verified that `activeRelicPoolHasRuntimeHooks()` passes and `hasRelicRuntimeHook(id)` returns true for every relic in `COMMON_RELIC_POOL`.
