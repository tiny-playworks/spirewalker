## 2026-07-22T02:50:10Z
<USER_REQUEST>
You are a Worker subagent assigned to remediate Milestone 1 (Requirement R1: Relic Runtime Protocol & Pool Integration) after a Forensic Audit & Reviewer Veto.

Working Directory: /Users/liangshuai/mdd_work/sljt/.agents/worker_m1_fix/
(Create this directory for your metadata and handoff.md.)

AUDIT EVIDENCE & REVIEWER FEEDBACK:
Read the audit report at `/Users/liangshuai/mdd_work/sljt/.agents/auditor_m1/audit_report.md` and reviewer reports at `/Users/liangshuai/mdd_work/sljt/.agents/reviewer_m1_1/handoff.md` and `/Users/liangshuai/mdd_work/sljt/.agents/reviewer_m1_2/handoff.md`.

You must fix the following 4 critical issues:
1. **Unused Imports & Variables (Lint/Typecheck Errors)**:
   - Remove unused imports `GameEvent` and `BattleState` in `src/game/core/systems/relic/relicHooks.ts`.
   - Remove or use unused variable `key` in `tests/relics/m1RelicStress.test.ts`.

2. **Relic ID Mismatch (`momentum_well`)**:
   - In `src/game/core/definitions/generated_relics/batch2.ts` line 45, change `id: 'momentum_well_b2'` to `id: 'momentum_well'` so `def.id === relicId`. Update `relicHooks.ts` registry if needed to match `momentum_well`.

3. **`generateShop.ts` Runtime Exception**:
   - In `src/game/core/engine/generateShop.ts`, add a default value `ownedRelicIds: string[] = []` to `generateShop(seed, act, actFloor, ownedRelicIds = [])`. Fix call signatures in `tests/relics/m1RelicStress.test.ts` if needed.

4. **Test Suite Regressions**:
   - Fix hardcoded pool size assertion in `tests/relics/m1RelicStress.test.ts` (update `86` to match `COMMON_RELIC_POOL.length`).
   - Fix character `rewardRelicPool` contract in `src/game/core/definitions/characters.ts` so `tests/reward/rewardFlow.test.ts` passes without breaking expected character reward pool tests.

Run verification:
- `pnpm check` (must pass 100% cleanly with 0 lint, 0 typecheck, and 0 test errors).
- `pnpm simulate:act1` (must complete with 0 errors).

Write your changes to `/Users/liangshuai/mdd_work/sljt/.agents/worker_m1_fix/changes.md` and handoff report to `/Users/liangshuai/mdd_work/sljt/.agents/worker_m1_fix/handoff.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work.

Communicate back via `send_message` when done.
</USER_REQUEST>
