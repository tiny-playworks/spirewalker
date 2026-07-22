## 2026-07-22T11:00:06Z
You are Worker_M1_Fix3 (teamwork_preview_worker). Your working directory is `/Users/liangshuai/mdd_work/sljt/.agents/worker_m1_fix3/`.

Your task is to remediate the 4 issues flagged in Milestone 1 (Requirement R1: Relic Runtime Protocol & Pool Integration):

1. **Fix unused imports & variables (Lint/Typecheck)**:
   - In `src/game/core/systems/relic/relicHooks.ts`: remove unused `import type { GameEvent } from '../../events/types';` and `import type { BattleState } from '../../model/battle';`.
   - In `tests/relics/m1RelicStress.test.ts`: remove unused variable `key` on line 98.

2. **Fix Relic Key-ID Mismatch**:
   - In `src/game/core/definitions/generated_relics/batch2.ts`: fix definition for `momentum_well` where `id: 'momentum_well_b2'` mismatch occurs. Change `id` to `'momentum_well'`.

3. **Fix `generateShop` and Stress Test Assertions**:
   - In `src/game/core/engine/generateShop.ts`: set default parameter `ownedRelicIds: string[] = []` so calls without the 4th argument do not throw TypeError.
   - In `tests/relics/m1RelicStress.test.ts`:
     - Update expected total relic count in `Pool integrity` test from `86` to `90` (19 base + 71 generated relics).
     - Fix `generateShop` test call to pass valid parameters.

4. **Fix Reward Relic Pool Regression**:
   - In `src/game/core/definitions/characters.ts`: restore/align `rewardRelicPool` contract expected by `tests/reward/rewardFlow.test.ts` so all reward flow tests pass.

5. **Verification**:
   - Run `pnpm check` (must pass lint, typecheck, and unit tests with 0 errors).
   - Run `pnpm simulate:act1` (must complete with 0 errors).

6. **Documentation & Handoff**:
   - Write `.agents/worker_m1_fix3/changes.md` and `.agents/worker_m1_fix3/handoff.md`.
   - Send completion message to parent with build/test outputs.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
