# Project Execution Plan: Spirewalker V2 Architecture Expansion

## Objectives & Scope
Expand the Spirewalker V2 architecture according to four major requirements:
1. **R1: Relic Runtime Protocol & Pool Integration**
   - Create `src/game/core/relics/relicHookProtocol.ts`.
   - Wire up top ~60 eligible generated relics from `GENERATED_RELICS` to `src/game/core/combat/` hooks (combat start, turn start, card played, block gained).
   - Update `COMMON_RELIC_POOL` and reward selectors in `relics.ts`.
2. **R2: Event Pool Expansion & Condition Parser**
   - Implement `src/game/core/events/eventConditionParser.ts` for HP/gold/relic condition checks.
   - Update `mapGenerator.ts` to draw from all 208 events in `EVENT_DEFINITIONS` partitioned by chapter (Act 1 -> Chapter 1, Act 2 -> Chapter 2, Act 3 -> Chapter 3), keeping fallback resolvers intact.
3. **R3: Standalone PWA & Offline Support**
   - Add `public/manifest.webmanifest` and Service Worker `sw.js` with Cache-First app shell caching.
   - Completely isolated from core game logic, passes PWA audit standards.
4. **R4: Mobile Safe-Area & Ergonomics**
   - Add iOS/Android `env(safe-area-inset-*)` CSS variable probes in `src/index.css`.
   - Optimize touch target sizes for mobile card interaction without altering desktop 16:9 layout.

## Acceptance Criteria
- `pnpm check` (lint, typecheck, rstest) passes with 0 errors.
- `pnpm simulate:act1` runs successfully and confirms battle balance stability with newly wired relics.
- `pnpm build` completes without bundle errors.
- `pnpm test:e2e:smoke` passes in Chromium.
- Forensic integrity audit passes with CLEAN status.

## Milestone Plan
- **Milestone 0: Ground-Truth Exploration & Base Audit**
  - Explorer agent investigates current codebase structure (`src/game/core/relics/`, `src/game/core/events/`, `mapGenerator.ts`, `src/index.css`, build scripts).
- **Milestone 1: Relic Runtime Protocol & Pool Integration (R1)** — **DONE (落盘)**
  - Implemented `relicHookProtocol.ts`; wired 71 generated + 19 base (90) hooks; pools/shop updated; stress tests added. Remediation via `worker_m1_fix2`; gate: `reviewer_m1_fix` PASS. Formal `auditor_m1_fix` waived (incomplete).
- **Milestone 2: Event Pool Expansion & Condition Parser (R2)** — **DONE (落盘)**
  - Implemented `eventConditionParser.ts`; expanded `generateBranchingFloor.ts` `EVENT_POOLS` to full chapter sets (208 defs); wired runtime/UI; tests added. Worker: `.agents/worker_m2/`. Pending formal Reviewer/Auditor.
- **Milestone 3: Standalone PWA & Offline Support (R3)**
  - Create manifest.webmanifest and sw.js, register SW appropriately without polluting core game logic. Review & Audit.
- **Milestone 4: Mobile Safe-Area & Ergonomics (R4)**
  - Add safe-area CSS variable probes, optimize touch target sizes for mobile card interaction without affecting 16:9 desktop layout. Review & Audit.
- **Milestone 5: Global E2E Verification & Final Audit**
  - Run full test suite: `pnpm check`, `pnpm simulate:act1`, `pnpm build`, `pnpm test:e2e:smoke`, plus forensic audit across all changes.
