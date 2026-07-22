# Original User Request

## Initial Request — 2026-07-22T02:21:01Z

# Teamwork Project Prompt V2 — Spirewalker Architecture Expansion

Working directory: /Users/liangshuai/mdd_work/sljt
Integrity mode: development

## Objective
Execute the Spirewalker V2 architectural expansion based on ground-truth code auditing. You must systematically upgrade the Relic Runtime, Event System, and PWA capabilities in low-risk, isolated Sprints.

## Requirements

### R1. Relic Runtime Protocol & Pool Integration
- Establish `relicHookProtocol.ts` in `src/game/core/relics/`.
- Wire up the top ~60 eligible generated relics from `GENERATED_RELICS` to `src/game/core/combat/` hooks (combat start, turn start, card played, block gained).
- Update `COMMON_RELIC_POOL` and reward selectors in `relics.ts` so that newly wired relics can actually drop in combat rewards and shop stock.

### R2. Event Pool Expansion & Condition Parser
- Implement `eventConditionParser.ts` for `src/game/core/events/` capable of evaluating player HP, gold, and relic requirements.
- Expand `mapGenerator.ts` to dynamically draw from all 208 events in `EVENT_DEFINITIONS` partitioned by chapter (Act 1 -> Chapter 1, Act 2 -> Chapter 2, Act 3 -> Chapter 3), keeping existing fallback resolvers intact.

### R3. Standalone PWA & Offline Support
- Add `public/manifest.webmanifest` and Service Worker (`sw.js`) supporting Cache-First app shell caching.
- Ensure the PWA setup is completely isolated from game core logic and passes browser PWA audits.

### R4. Mobile Safe-Area & Ergonomics
- Add iOS/Android `env(safe-area-inset-*)` CSS variable probes in `src/index.css`.
- Optimize touch target sizes for card interaction on mobile screens without altering desktop 16:9 layouts.

## Acceptance Criteria

### Verification & Testing
- [ ] `pnpm check` (lint, typecheck, rstest) passes with ZERO errors.
- [ ] `pnpm simulate:act1` runs successfully and confirms battle balance stability with newly wired relics.
- [ ] `pnpm build` completes without bundle errors.
- [ ] `pnpm test:e2e:smoke` passes in Chromium.
