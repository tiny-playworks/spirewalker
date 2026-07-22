# Changes Summary — Milestone 2 (Requirement R2)

## Files Created / Modified

1. **`src/game/core/events/eventConditionParser.ts`** (New):
   - `parseConditionString` / `evaluateConditionAST` / `evaluateRequirementString` / `evaluateChoiceRequirements`.
   - Supports `gold` / `hp` / `maxHp` comparisons (`>= > <= < == =`), `relic:` / `!relic:` / `has_relic` / `no_relic`, `card:` / `!card:`.
   - Composites split on `;` / `,` / `&&` / `AND`. Unrecognized fragment → fail closed (`false`). Empty requirements → `true`.

2. **`src/game/core/systems/event/eventRuntime.ts`**:
   - Replaced inline `gold >= N` regex gate with `evaluateChoiceRequirements(choice, run)`.
   - `resolveGenericEvent` fallback path unchanged otherwise.

3. **`src/features/event/EventPage.tsx`**:
   - Removed local `hasEnoughGold`.
   - Generic option `disabled` now uses `evaluateChoiceRequirements` + existing outcome availability checks.
   - Legacy custom event UIs untouched.

4. **`src/game/core/engine/generateBranchingFloor.ts`**:
   - `buildChapterPool(chapter, legacy)` no longer truncates to 8.
   - `LEGACY_EVENT_IDS` + full-chapter `EVENT_POOLS` (Act1≈70, Act2≈67, Act3≈75 including legacy prefixes; definitions total 208).
   - `assignEventScripts(act, nodes, rnd)`: seed shuffle of chapter events, legacy prefix, primary-legacy injection for depth>1.

5. **`tests/events/eventConditionParser.test.ts`** (New):
   - Grammar coverage (gold/hp/maxHp/relic/card/composites), fail-closed, empty requirements, integration with `resolveGenericEvent`.

6. **`tests/content/eventPools.test.ts`**:
   - Asserts each Act pool ≥ corresponding `EVENTS_BY_CHAPTER` size, legacy membership / ordering, every pool id ∈ `EVENT_DEFINITIONS`.

## Pool Size Snapshot (post-M2)
| Act | Chapter defs | EVENT_POOLS (legacy + chapter) |
|-----|--------------|--------------------------------|
| 1   | 70           | 70                             |
| 2   | 66           | 67                             |
| 3   | 72           | 75                             |
| **Σ** | **208**    | —                              |
