# Spirewalker V2 Architecture Expansion (R2: Event Pool Expansion & Condition Parser) Analysis Report

## Executive Summary
This report analyzes the event architecture, condition evaluation requirements, map generation mechanics, and fallback resolution mechanisms for Spirewalker V2 (Requirement R2). It details how to expand the event pool to dynamically draw from all 208 events across 3 chapters and how to introduce a structured `eventConditionParser.ts` without breaking existing legacy fallback resolvers.

---

## 1. Task 1: Current Event Definitions & Event Handling Logic

### 1.1 Codebase Structure
- **Directory**: `src/game/core/events/` currently contains `types.ts`.
- **Definitions**: Located in `src/game/core/definitions/events/`:
  - `index.ts`: Defines `EVENT_DEFINITIONS` by combining `GENERATED_EVENTS_1` (`batch1.ts`), `GENERATED_EVENTS_2` (`batch2.ts`), and `GENERATED_EVENTS_3` (`batch3.ts`).
  - Contains **208 total event definitions** categorized into 8 event types: `risk_reward`, `curse_trade`, `merchant`, `memory`, `corruption`, `strange_machine`, `ancient_shrine`, `random_gamble`.
  - Event definitions are partitioned by chapter via `EVENTS_BY_CHAPTER[1 | 2 | 3]`:
    - Chapter 1: 69 events
    - Chapter 2: 69 events
    - Chapter 3: 70 events
- **Event Systems**:
  - `src/game/core/systems/event/eventFlow.ts`: Handles command `RESOLVE_EVENT_OPTION` and invokes `resolveEventOption(...)`.
  - `src/game/core/systems/event/eventResolver.ts`: Main entry point for option resolution. It checks `EVENT_OPTION_RESOLVERS` for custom resolvers before delegating to `resolveGenericEvent`.
  - `src/game/core/systems/event/eventRuntime.ts`: Executes generic event choices and outcomes (`applyOutcome`). Currently performs primitive inline requirement parsing: `choice.requirements.match(/gold\s*>=\s*(\d+)/)`.
  - `src/features/event/EventPage.tsx`: Renders event UI. For non-custom events, uses generic rendering and checks option requirements via `hasEnoughGold(run, choice.requirements)` (which also only supports `gold >= N`).

### 1.2 Event Data Interfaces (`src/game/core/definitions/events/index.ts`)
```typescript
export interface EventOutcome {
  type: 'gain_gold' | 'lose_gold' | 'gain_hp' | 'lose_hp' | 'gain_card' | 'lose_max_hp' | 'gain_relic' | 'gain_momentum' | 'nothing';
  value?: number;
  cardId?: string;
  relicId?: string;
  description: string;
}

export interface EventChoice {
  id: string;
  text: string;
  requirements?: string;
  outcomes: EventOutcome[];
}

export interface EventDefinition {
  id: string;
  name: string;
  description: string;
  chapter: 1 | 2 | 3;
  type: EventType;
  choices: EventChoice[];
}
```

---

## 2. Task 2: Architecture for `eventConditionParser.ts`

### 2.1 File Location
Target file: `src/game/core/events/eventConditionParser.ts`

### 2.2 Objective & Grammar Specification
The condition parser must evaluate `choice.requirements` string against current `RunState` (HP, max HP, gold, relics, cards).

#### Supported Grammar Patterns in `EventChoice.requirements`:
1. **Gold Requirements**:
   - Syntax: `gold >= N`, `gold > N`, `gold <= N`, `gold < N`, `gold == N`, `gold = N`
   - Target field: `run.meta.gold`
2. **HP & Max HP Requirements**:
   - Syntax: `hp >= N`, `hp > N`, `hp <= N`, `hp < N`, `hp == N`, `hp = N` (refers to `run.player.currentHp`)
   - Syntax: `maxHp >= N`, `maxHp > N`, `maxHp <= N`, `maxHp < N`, `maxHp == N` (refers to `run.player.maxHp`)
3. **Relic Requirements**:
   - Syntax: `relic:relic_id`, `has_relic:relic_id`, `relic == relic_id`, `relic = relic_id` -> checks `run.meta.relics.includes(relic_id)`
   - Syntax: `!relic:relic_id`, `no_relic:relic_id`, `relic != relic_id` -> checks `!run.meta.relics.includes(relic_id)`
4. **Card / Deck Requirements** (for future/extra flexibility):
   - Syntax: `card:card_id`, `has_card:card_id` -> checks `run.masterDeck.includes(card_id)`
   - Syntax: `!card:card_id`, `no_card:card_id` -> checks `!run.masterDeck.includes(card_id)`
5. **Multiple Conditions**:
   - Delimiters: `;`, `,`, `&&`, `AND`
   - Example: `gold >= 50; hp >= 15` or `hp > 20 && relic:vajra`

### 2.3 AST & Evaluator Architecture
```typescript
export type ComparisonOperator = '>=' | '>' | '<=' | '<' | '==' | '=';

export type ConditionAST =
  | { type: 'gold'; operator: ComparisonOperator; value: number }
  | { type: 'hp'; operator: ComparisonOperator; value: number }
  | { type: 'maxHp'; operator: ComparisonOperator; value: number }
  | { type: 'relic'; relicId: string; negated: boolean }
  | { type: 'card'; cardId: string; negated: boolean };

export function parseConditionString(requirements: string): ConditionAST[];
export function evaluateConditionAST(ast: ConditionAST, run: RunState): boolean;
export function evaluateRequirementString(requirements: string | undefined, run: RunState): boolean;
export function evaluateChoiceRequirements(choice: { requirements?: string }, run: RunState): boolean;
```

### 2.4 Integration Points
- **`src/game/core/systems/event/eventRuntime.ts`**:
  Replace line 69-72:
  ```typescript
  if (!evaluateChoiceRequirements(choice, run)) return false;
  ```
- **`src/features/event/EventPage.tsx`**:
  Replace `hasEnoughGold(run, choice.requirements)` on line 197 with `evaluateChoiceRequirements(choice, run)`.

---

## 3. Task 3: Map Generator Integration & Event Selection (208 Events)

### 3.1 Current Implementation (`src/game/core/engine/generateBranchingFloor.ts`)
- `buildChapterPool` (lines 47-59):
  ```typescript
  function buildChapterPool(chapter: 1 | 2 | 3, count: number, legacy: string[]): string[] {
    const events = EVENTS_BY_CHAPTER[chapter] ?? [];
    const seen = new Set(legacy);
    const picked: string[] = [];
    for (const e of events) {
      if (picked.length >= count) break;
      if (!seen.has(e.id)) {
        picked.push(e.id);
        seen.add(e.id);
      }
    }
    return [...legacy, ...picked];
  }
  ```
- Currently, `count` is hardcoded to `8`, restricting each Act's event pool to only 8 events + legacy events.
- `EVENT_POOLS` (lines 61-65):
  ```typescript
  export const EVENT_POOLS: Record<MapAct, string[]> = {
    1: buildChapterPool(1, 8, [WANDERING_MERCHANT_EVENT_ID, STILLNESS_SHRINE_EVENT_ID]),
    2: buildChapterPool(2, 8, [BURST_ALTAR_EVENT_ID, PURGING_POOL_EVENT_ID, STILLNESS_SHRINE_EVENT_ID]),
    3: buildChapterPool(3, 8, [BURST_ALTAR_EVENT_ID, PURGING_POOL_EVENT_ID, WANDERING_MERCHANT_EVENT_ID]),
  };
  ```
- `assignEventScripts` (lines 446-454): Assigns `eventScriptId` sequentially via `index % eventPool.length`.

### 3.2 Dynamic Pool Expansion Plan
1. **Remove Hardcoded Count Ceiling**:
   Modify `buildChapterPool` so it includes ALL chapter events from `EVENTS_BY_CHAPTER[chapter]`.
   - Act 1 -> Chapter 1 events (69 events)
   - Act 2 -> Chapter 2 events (69 events)
   - Act 3 -> Chapter 3 events (70 events)
2. **Preserve Legacy Event Guarantees**:
   Keep `WANDERING_MERCHANT_EVENT_ID` and `STILLNESS_SHRINE_EVENT_ID` in `EVENT_POOLS[1]`, etc., so that camp node (`camp.eventScriptId = EVENT_POOLS[act][0]!`) and legacy fallback tests continue to function.
3. **Dynamic Seeded Selection**:
   In `assignEventScripts(act: MapAct, nodes: MapNode[], seed?: number)` (or using act seed `mulberry32`), shuffle or sample non-repeating events from `EVENT_POOLS[act]` so each map layout dynamically draws unique events from the chapter pool without repetition on the same map.

---

## 4. Task 4: Fallback Resolvers Verification & Safety

### 4.1 Existing Legacy Resolvers
Located in `src/game/core/systems/event/eventResolver.ts`:
- Custom handlers exist for 4 legacy events:
  - `wandering_merchant` (Wandering Merchant)
  - `stillness_shrine` (Stillness Shrine)
  - `burst_altar` (Burst Altar)
  - `purging_pool` (Purging Pool)
- Custom UI rendering exists in `src/features/event/EventPage.tsx` for these 4 events.

### 4.2 Fallback Resolution Chain
```
User selects Option
  └─► resolveEventOption(run, eventId, optionId, events)
        ├─► Is eventId in EVENT_OPTION_RESOLVERS?
        │     └─► YES: Execute custom resolver logic -> set screen to 'map', push EVENT_RESOLVED, return true.
        └─► NO: Call resolveGenericEvent(run, eventId, optionId, events)
              ├─► Lookup EVENT_DEFINITIONS[eventId]
              ├─► Evaluate choice.requirements via eventConditionParser.ts
              ├─► Execute choice.outcomes via applyOutcome(...)
              └─► On success: set screen to 'map', push EVENT_RESOLVED, return true.
```

### 4.3 Preserving Intactness
- **DO NOT** remove or alter `EVENT_OPTION_RESOLVERS` in `eventResolver.ts`.
- **DO NOT** remove legacy switch cases in `EventPage.tsx`.
- Generic execution gracefully handles all 204 non-legacy events while delegating to legacy handlers first.
- If an outcome fails or requirements are unmet, `resolveGenericEvent` safely returns `false` without state mutation or crash.

---

## 5. Summary of Recommended Code Structure
- **New File**: `src/game/core/events/eventConditionParser.ts`
- **Updated File**: `src/game/core/engine/generateBranchingFloor.ts` (expand `buildChapterPool` & dynamic event selection)
- **Updated File**: `src/game/core/systems/event/eventRuntime.ts` (wire up condition parser)
- **Updated File**: `src/features/event/EventPage.tsx` (wire up condition parser for UI option disabled states)
