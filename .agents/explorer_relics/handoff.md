# Handoff Report — Requirement R1: Relic Runtime Protocol & Pool Integration

## 1. Observation

- **Relic Definitions & Generated Files**:
  - Base relics defined in `src/game/core/definitions/relics.ts:10`.
  - Generated relics defined in `src/game/core/definitions/generated_relics/` (`batch1.ts`, `batch2.ts`, `batch3.ts`, `index.ts`), totaling 133 generated relic definitions.
  - `Object.assign(RELIC_DEFINITIONS, GENERATED_RELICS)` executed in `relics.ts:151`.
- **Relic Pools**:
  - `COMMON_RELIC_POOL` in `src/game/core/definitions/relics.ts:114`: Contains only 12 hardcoded base relics.
  - `rewardRelicPool` in `src/game/core/definitions/characters.ts:81`: Contains only 12 hardcoded base relics for `walker`.
  - `SHOP_RELIC_POOL` in `src/game/core/engine/generateShop.ts:14`: Contains only 12 hardcoded base relics for shop offers.
  - `BOSS_RELIC_POOL` in `src/game/core/definitions/relics.ts:130`: Aliases `[...COMMON_RELIC_POOL]`.
- **Combat Hook Triggers & Locations**:
  - `RelicTrigger` enum in `src/game/core/systems/relic/relicHooks.ts:10`.
  - Hooks invoked at: `createMvpRun.ts:231` (`battleStart`), `playCard.ts:31,159,246,845` (`momentumConsumed`, `cardPlayed`), `intentExecutor.ts:72` (`damageTaken`), `runtimeHooks.ts:224` (`statusReduced`), `relicHooks.ts:201` (`pickup`).
  - Inline checks found for ~16 generated relics in `playCard.ts` (lines 178-203, 405-478, 877-951) and `turnFlow.ts` (line 109).
- **Test Invariant**:
  - `tests/relics/relicHookRegistry.test.ts:18` enforces `COMMON_RELIC_POOL.every((id) => hasRelicRuntimeHook(id))`.

## 2. Logic Chain

1. **Problem Statement**:
   Spirewalker V2 has 133 generated relics defined, but only 12 base relics are in reward/shop pools. Some generated relics were implemented ad-hoc inside `playCard.ts` and `turnFlow.ts`, causing technical debt and preventing new relics from dropping in combat or shop stock.

2. **Protocol Standardisation**:
   Creating `src/game/core/relics/relicHookProtocol.ts` (or updating `relicHooks.ts`) provides a unified, declarative interface for all relic triggers (`battleStart`, `turnStart`, `cardPlayed`, `momentumConsumed`, `blockGained`, `turnEnd`, `damageTaken`, `pickup`, etc.).

3. **Wiring ~60 Eligible Relics**:
   Selecting ~60 well-scoped, non-conflicting relics from `batch1.ts`, `batch2.ts`, and `batch3.ts` and registering their handlers in `RELIC_HOOKS` eliminates inline code duplication in `playCard.ts` and `turnFlow.ts`.

4. **Pool Expansion**:
   Updating `COMMON_RELIC_POOL`, `rewardRelicPool`, and `SHOP_RELIC_POOL` to include all ~60 wired relic IDs allows combat rewards and shop stock to dynamically offer these relics.

5. **Test Invariant Compliance**:
   Because every relic in `COMMON_RELIC_POOL` has a registered handler in `RELIC_HOOKS`, `hasRelicRuntimeHook(id)` returns true for all pool relics, satisfying `relicHookRegistry.test.ts`.

6. **Simulation Impact**:
   Running `pnpm simulate:act1` validates AI persona battle balance with the expanded relic pool deterministically.

## 3. Caveats

- **Excluded Relics**: ~73 generated relics (complex card transformation, non-standard UI triggers, duplicate names across batches) were omitted from the initial ~60 wired set for stability and clean scope.
- **Read-Only Scope**: This report provides the complete architectural design and analysis. Implementation should be carried out by an implementer agent.

## 4. Conclusion

Requirement R1 is fully investigated. The codebase is well-structured for establishing `relicHookProtocol.ts`, unifying inline relic logic into `RELIC_HOOKS`, expanding `COMMON_RELIC_POOL` / `rewardRelicPool` / `SHOP_RELIC_POOL` with ~60 newly wired relics, and validating balance via `pnpm simulate:act1`.

## 5. Verification Method

To verify the investigation and future implementation:
1. Inspect files:
   - `/Users/liangshuai/mdd_work/sljt/.agents/explorer_relics/analysis.md`
   - `src/game/core/definitions/relics.ts`
   - `src/game/core/systems/relic/relicHooks.ts`
   - `src/game/core/definitions/generated_relics/`
   - `src/game/core/engine/generateShop.ts`
   - `tests/relics/relicHookRegistry.test.ts`
2. Run test suite: `pnpm test` (or `rstest run tests/relics/relicHookRegistry.test.ts`)
3. Run Act 1 simulation: `pnpm simulate:act1`
