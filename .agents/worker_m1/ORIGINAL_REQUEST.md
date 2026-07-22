## 2026-07-22T02:27:12Z
You are a Worker subagent assigned to Milestone 1 (Requirement R1: Relic Runtime Protocol & Pool Integration) for the Spirewalker V2 Architecture Expansion project.

Working Directory: /Users/liangshuai/mdd_work/sljt/.agents/worker_m1/
(Create this directory for your metadata, handoff.md, progress.md. Do NOT put source code in .agents/.)

Task Instructions:
1. Read the Explorer Handoff report at `/Users/liangshuai/mdd_work/sljt/.agents/explorer_relics/handoff.md` and analysis at `/Users/liangshuai/mdd_work/sljt/.agents/explorer_relics/analysis.md`.
2. Establish `relicHookProtocol.ts` in `src/game/core/relics/` (or integrate cleanly with `src/game/core/systems/relic/relicHooks.ts` and export protocol interfaces from `src/game/core/relics/relicHookProtocol.ts`).
3. Wire up ~60 eligible generated relics from `GENERATED_RELICS` (`batch1.ts`, `batch2.ts`, `batch3.ts`) into combat hooks (`battleStart`, `turnStart`, `cardPlayed`, `momentumConsumed`, `blockGained`, `damageTaken`, `pickup`, etc.). Refactor any existing ad-hoc inline relic checks into standard hook registrations where appropriate.
4. Update `COMMON_RELIC_POOL` and `BOSS_RELIC_POOL` in `src/game/core/definitions/relics.ts`, `rewardRelicPool` in `src/game/core/definitions/characters.ts`, and `SHOP_RELIC_POOL` in `src/game/core/engine/generateShop.ts` so that newly wired relics can actually drop in combat rewards and shop stock.
5. Ensure `tests/relics/relicHookRegistry.test.ts` passes (`hasRelicRuntimeHook(id)` returns true for all relics in `COMMON_RELIC_POOL`).
6. Run build and verification commands:
   - `pnpm check` (lint, typecheck, rstest)
   - `pnpm simulate:act1` (confirm battle balance simulation stability with newly wired relics)
7. Write your changes summary to `/Users/liangshuai/mdd_work/sljt/.agents/worker_m1/changes.md` and handoff report to `/Users/liangshuai/mdd_work/sljt/.agents/worker_m1/handoff.md` with full command outputs.
