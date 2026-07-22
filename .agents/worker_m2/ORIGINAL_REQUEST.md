## 2026-07-22T03:20:00Z
You are a Worker subagent assigned to Milestone 2 (Requirement R2: Event Pool Expansion & Condition Parser) for the Spirewalker V2 Architecture Expansion project.

Working Directory: /Users/liangshuai/mdd_work/sljt/.agents/worker_m2/
(Create this directory for your metadata, handoff.md, progress.md. Do NOT put source code in .agents/.)

Task Instructions:
1. Read the Explorer Handoff report at `/Users/liangshuai/mdd_work/sljt/.agents/explorer_events/handoff.md` and analysis at `/Users/liangshuai/mdd_work/sljt/.agents/explorer_events/analysis.md`.
2. Implement `src/game/core/events/eventConditionParser.ts` to parse and evaluate event choice `requirements` (HP, maxHp, gold, relic, card; composite via `;` / `,` / `&&` / `AND`). Unrecognized fragments fail closed.
3. Wire the parser into:
   - `src/game/core/systems/event/eventRuntime.ts` (`resolveGenericEvent` requirement gate)
   - `src/features/event/EventPage.tsx` (replace gold-only `hasEnoughGold` with `evaluateChoiceRequirements`)
4. Expand map event pools in `src/game/core/engine/generateBranchingFloor.ts`:
   - Remove `count: 8` truncation in `buildChapterPool`
   - Act 1 → Chapter 1, Act 2 → Chapter 2, Act 3 → Chapter 3 (full chapter pools + legacy prefix)
   - Use seed-based shuffle sampling in `assignEventScripts`; keep camp / legacy guarantees
5. Preserve legacy fallbacks: `EVENT_OPTION_RESOLVERS` → `resolveGenericEvent` chain stays intact.
6. Update / add tests:
   - `tests/events/eventConditionParser.test.ts`
   - `tests/content/eventPools.test.ts` (full-chapter pool invariants)
7. Run `pnpm check` and write `changes.md` + `handoff.md`.
