# Handoff Report: Requirement R2 (Event Pool Expansion & Condition Parser)

## 1. Observation
1. **Event Definitions Location**:
   - `src/game/core/definitions/events/index.ts`: Lines 39-51 export `EVENT_DEFINITIONS` (208 events across `batch1.ts`, `batch2.ts`, `batch3.ts`), `EVENT_IDS`, and `EVENTS_BY_CHAPTER[1 | 2 | 3]`.
   - Chapter event counts: Act 1 / Chapter 1: 69 events; Act 2 / Chapter 2: 69 events; Act 3 / Chapter 3: 70 events.
2. **Current Event System & Runtime**:
   - `src/game/core/events/types.ts`: Defines `GameEvent`, including `EVENT_RESOLVED`.
   - `src/game/core/systems/event/eventFlow.ts`: Lines 6-15 process command `RESOLVE_EVENT_OPTION` via `resolveEventOption`.
   - `src/game/core/systems/event/eventResolver.ts`: Lines 27-75 define `EVENT_OPTION_RESOLVERS` for legacy events (`wandering_merchant`, `stillness_shrine`, `burst_altar`, `purging_pool`). Lines 77-86 delegate non-legacy events to `resolveGenericEvent`.
   - `src/game/core/systems/event/eventRuntime.ts`: Lines 69-72 perform primitive inline regex check `choice.requirements.match(/gold\s*>=\s*(\d+)/)`.
   - `src/features/event/EventPage.tsx`: Lines 76-79 implement `hasEnoughGold` which only supports `gold >= N`.
3. **Map Generator Logic**:
   - `src/game/core/engine/generateBranchingFloor.ts`: Lines 47-59 `buildChapterPool` truncates the event pool with `if (picked.length >= count) break;` where `count` is hardcoded to `8` in `EVENT_POOLS` (lines 61-65).
   - Lines 446-454 `assignEventScripts`: Assigns event script IDs using `index % eventPool.length`.
4. **Existing Unit Tests**:
   - `tests/content/eventPools.test.ts`: Asserts `EVENT_POOLS[1].length >= 10`, `EVENT_POOLS[2].length >= 8`, `EVENT_POOLS[3].length >= 8`, and presence of legacy events (`wandering_merchant`, `stillness_shrine`).
   - `tests/events/momentumEvent.test.ts`: Asserts `gain_momentum` outcome execution via `resolveGenericEvent`.

---

## 2. Logic Chain
1. **Observation 1 & 2 -> Condition Parser Need**:
   `EVENT_DEFINITIONS` contains 208 events with varied `choice.requirements` (e.g. `gold >= 50`, `hp >= 15`, `relic:vajra`, `!relic:vajra`). Currently, `eventRuntime.ts` and `EventPage.tsx` only check `gold >= N` via hardcoded regex.
   *Reasoning*: Creating `src/game/core/events/eventConditionParser.ts` with AST parsing and evaluation (`evaluateChoiceRequirements`) will provide unified requirement evaluation for both runtime execution (`eventRuntime.ts`) and UI rendering (`EventPage.tsx`).
2. **Observation 3 -> Map Generator Expansion**:
   `generateBranchingFloor.ts` limits `buildChapterPool` count to `8`.
   *Reasoning*: Removing the `count: 8` constraint in `buildChapterPool` allows `EVENT_POOLS[act]` to include all chapter-partitioned events (69 for Act 1, 69 for Act 2, 70 for Act 3). Updating `assignEventScripts` with deterministic seed-based shuffling/sampling will ensure maps draw dynamically from the full 208 event pool without repeating events on the same map.
3. **Observation 2 & 4 -> Preserving Legacy Fallbacks**:
   Legacy events (`wandering_merchant`, `stillness_shrine`, `burst_altar`, `purging_pool`) have custom handlers in `eventResolver.ts` and custom UI in `EventPage.tsx`.
   *Reasoning*: Retaining `EVENT_OPTION_RESOLVERS` in `eventResolver.ts` ensures legacy events execute custom logic first, while all other 204 events fall back to `resolveGenericEvent`. Preserving `legacy` arrays in `buildChapterPool` guarantees camp node and fallback tests remain valid.

---

## 3. Caveats
- **Uninvestigated Areas**: Audio triggers for specific custom event choices (currently non-critical; events produce standard audio signals).
- **Assumptions**: Requirement strings follow patterns: `gold <op> N`, `hp <op> N`, `maxHp <op> N`, `relic:<id>`, `!relic:<id>`, `card:<id>`, `!card:<id>`, separated by `;`, `,`, `&&`, or `AND`. Any unrecognized requirement string defaults to returning `false` for safety.

---

## 4. Conclusion
The architecture for Requirement R2 is fully mapped out:
1. **`src/game/core/events/eventConditionParser.ts`**: Create parser & evaluator supporting HP, Max HP, Gold, Relic, and Card conditions with multi-condition syntax.
2. **`src/game/core/engine/generateBranchingFloor.ts`**: Expand `buildChapterPool` to include all chapter events (208 total) and update `assignEventScripts` to sample dynamically using the run/act seed.
3. **`src/game/core/systems/event/eventRuntime.ts` & `src/features/event/EventPage.tsx`**: Replace primitive regex checks with `evaluateChoiceRequirements`.
4. **Fallback Safety**: Preserve legacy resolvers in `eventResolver.ts` and custom views in `EventPage.tsx`.

---

## 5. Verification Method
1. **Unit Tests**:
   - Run `pnpm exec rstest run tests/content/eventPools.test.ts` to verify event pools contain all chapter events and legacy events.
   - Run `pnpm exec rstest run tests/events/momentumEvent.test.ts` to verify event outcome execution.
   - Run `pnpm exec rstest run tests/events/eventConditionParser.test.ts` for parser grammar coverage.
2. **Files to Inspect**:
   - `src/game/core/events/eventConditionParser.ts`
   - `src/game/core/engine/generateBranchingFloor.ts`
   - `src/game/core/systems/event/eventRuntime.ts`
   - `src/features/event/EventPage.tsx`
3. **Invalidation Conditions**:
   - Any test failure in `tests/content/eventPools.test.ts` or `tests/events/`.
   - Legacy event options failing to trigger custom logic.
   - Event choices with unmet requirements being selectable in `EventPage.tsx`.

---

## 6. Implementation Status (2026-07-22)

**蓝图已落地（M2）** — Worker 产出：`.agents/worker_m2/`

| 蓝图项 | 状态 |
|--------|------|
| `eventConditionParser.ts` | ✅ 已实现 |
| `generateBranchingFloor` 全量章节池 + seed 抽样 | ✅ 已实现 |
| `eventRuntime` / `EventPage` 接线 | ✅ 已实现 |
| Legacy fallback 保留 | ✅ 未破坏 |
| `tests/events/eventConditionParser.test.ts` | ✅ 已新增 |
| `tests/content/eventPools.test.ts` | ✅ 已更新 |

章节计数快照（落地后）：Ch1=70 / Ch2=66 / Ch3=72（合计 208）。`pnpm check` PASS。
