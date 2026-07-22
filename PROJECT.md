# Project: Spirewalker V2 Architecture Expansion

## Architecture Overview
Spirewalker V2 is a web-based roguelike deckbuilder (TypeScript/Vite/React/Tailwind/CSS).
The architecture expansion involves four key subsystems:
1. **Relic Runtime System**: Dynamic hook protocol for combat triggers (`combatStart`, `turnStart`, `cardPlayed`, `blockGained`), pool integration for generated relics, drop/shop distribution.
2. **Event Engine**: Condition evaluation for event choices (HP, Gold, Relic requirements), chapter-based partitioning across 208 defined events, map generation logic integration.
3. **PWA Infrastructure**: Manifest definition and standalone Service Worker for Cache-First offline shell caching, isolated from core gameplay loop.
4. **Mobile Ergonomics**: CSS safe-area inset handling (`env(safe-area-inset-*)`), responsive touch target scaling for card interaction while preserving 16:9 desktop layout.

## Milestones Table
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0 | Exploration & Blueprinting | Codebase inspection & architecture mapping | None | DONE |
| M1 | Relic Runtime Protocol & Pool Integration | `relicHookProtocol.ts`, ~60 relic hooks, `relics.ts` pool | M0 | DONE (落盘) |
| M2 | Event Pool Expansion & Condition Parser | `eventConditionParser.ts`, `generateBranchingFloor.ts` act partitioning | M0 | DONE (落盘；待 Reviewer/Auditor) |
| M3 | Standalone PWA & Offline Support | `manifest.webmanifest`, `sw.js`, registration | M0 | PLANNED |
| M4 | Mobile Safe-Area & Ergonomics | `src/index.css` safe-area variables, touch targets | M0 | PLANNED |
| M5 | Global Verification & Audit | `pnpm check`, `pnpm simulate:act1`, `pnpm build`, `pnpm test:e2e:smoke` | M1, M2, M3, M4 | PLANNED |

## Interface Contracts

### Relic Hook Protocol (`src/game/core/relics/relicHookProtocol.ts`)
- Interface defining hook callbacks: `onCombatStart`, `onTurnStart`, `onCardPlayed`, `onBlockGained`.
- Dispatcher function to evaluate active player relics against combat state triggers.

### Event Condition Parser (`src/game/core/events/eventConditionParser.ts`)
- Evaluator function `evaluateEventCondition(condition, gameState): boolean`.
- Supports condition types for minimum HP, minimum Gold, specific Relic ownership.

### Service Worker & PWA (`public/manifest.webmanifest`, `sw.js`)
- Standard web manifest for PWA installation.
- Cache-First strategy for static app shell assets without intercepting dynamic state or API calls.

## Code Layout
- `src/game/core/relics/`: Relic definitions, pools, and hook runtime protocol.
- `src/game/core/events/`: Event definitions, condition parser, choices.
- `src/game/core/map/` or `mapGenerator.ts`: Map generation logic and event node assignment.
- `src/game/core/combat/`: Combat loop and hook trigger invocation.
- `public/`: Web manifest and service worker script.
- `src/index.css`: Global styles, CSS safe-area probes, touch ergonomics.
