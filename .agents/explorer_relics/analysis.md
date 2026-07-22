# Spirewalker V2 Architecture Analysis: Relic Runtime Protocol & Pool Integration (Requirement R1)

## Executive Summary
This document provides a comprehensive architectural analysis for implementing **Requirement R1 (Relic Runtime Protocol & Pool Integration)** in Spirewalker V2. Currently, only 12 base relics are present in `COMMON_RELIC_POOL`, `rewardRelicPool`, and `SHOP_RELIC_POOL`. Although 133 generated relics are defined in `src/game/core/definitions/generated_relics/`, only a small fraction have runtime hooks (some implemented via `relicHooks.ts` and others hardcoded inline across `playCard.ts` and `turnFlow.ts`).

By implementing a clean `relicHookProtocol.ts` module, unifying inline hooks, wiring ~60 eligible generated relics, and updating the relic reward & shop pools, we can seamlessly expand relic gameplay, ensure 100% test compliance, and enrich Act 1 battle balance simulations.

---

## 1. Existing Relic Architecture & File Locations

### 1.1 Definitions & Generated Relics
- **Base Relic Definitions**: `src/game/core/definitions/relics.ts` defines `RELIC_DEFINITIONS: Record<string, RelicDefinition>` and base relics (`vajra`, `anchor`, `wind_chime`, `tactical_gloves`, etc.).
- **Generated Relics**: Located in `src/game/core/definitions/generated_relics/`:
  - `batch1.ts` (`GENERATED_RELICS_1`): 50 relics focusing on Momentum, Flow, and Block.
  - `batch2.ts` (`GENERATED_RELICS_2`): 50 relics focusing on Metallicize, Damage, and Utility.
  - `batch3.ts` (`GENERATED_RELICS_3`): 33 relics focusing on Synergy, Energy, and Special Triggers.
  - `index.ts`: Combines all 3 batches into `GENERATED_RELICS` (133 relics total).
  - `relics.ts`: Dynamically merges generated relics into master definitions via `Object.assign(RELIC_DEFINITIONS, GENERATED_RELICS)`.

### 1.2 Relic Pools & Reward Selectors
- **`COMMON_RELIC_POOL`** (`src/game/core/definitions/relics.ts:114`): Currently contains only 12 hardcoded base relics.
- **`BOSS_RELIC_POOL`** (`src/game/core/definitions/relics.ts:130`): Set to `[...COMMON_RELIC_POOL]`.
- **`rollBossRelicReward`** (`src/game/core/definitions/relics.ts:132`): Picks boss relics using seed/salt RNG (`mulberry32`) from character `rewardRelicPool` (or `BOSS_RELIC_POOL`).
- **Character Relic Pool** (`src/game/core/definitions/characters.ts:81`): `rewardRelicPool` for `walker` is hardcoded to the same 12 base relics.
- **Shop Relic Pool** (`src/game/core/engine/generateShop.ts:14`): `SHOP_RELIC_POOL` is hardcoded to the same 12 base relics.

---

## 2. Combat Hook Dispatch & Runtime Analysis

### 2.1 Current `RelicTrigger` Types (`src/game/core/systems/relic/relicHooks.ts`)
```ts
export type RelicTrigger =
  | 'battleStart'
  | 'turnStart'
  | 'cardPlayed'
  | 'cardExhausted'
  | 'momentumConsumed'
  | 'blockGained'
  | 'damageTaken'
  | 'turnEnd'
  | 'battleEnd'
  | 'pickup'
  | 'statusReduced';
```

### 2.2 Dispatch Locations in Combat Engine
| Trigger | Primary Invocation File & Line | Evaluated Properties |
|---|---|---|
| `battleStart` | `src/game/core/engine/createMvpRun.ts:231` | `strength`, `momentum`, `metallicize`, `steadyGuard`, `openingHandDraw`, `block` |
| `cardPlayed` | `src/game/core/systems/battle/playCard.ts:845` | `forceExhaustAttack`, `nextSkillBonus`, `harmonyTriggered`, `draw`, `energy` |
| `cardExhausted` | `src/game/core/systems/battle/playCard.ts:865` | `damageBonus` (e.g. `blaze_core`) |
| `momentumConsumed` | `src/game/core/systems/battle/playCard.ts:31, 159, 246` | `damageBonus`, `draw`, `energy` |
| `blockGained` | `src/game/core/systems/battle/playCard.ts:331` | `nextAttackBonus`, `block` |
| `damageTaken` | `src/game/core/systems/enemy/intentExecutor.ts:72` | `reflectRatio` |
| `statusReduced` | `src/game/core/systems/enemy/runtimeHooks.ts:224` | `momentumReduction` |
| `pickup` | `src/game/core/systems/relic/relicHooks.ts:201` | `maxHp`, `currentHp` |

### 2.3 Existing Technical Debt & Inline Checks
Investigation revealed that several generated relics were implemented directly as inline code inside combat system files instead of routing through `relicHooks.ts`:
- `playCard.ts`: Inline `if (relicIds.includes(...))` checks for `momentum_siphon`, `bulwark_heart`, `flow_resonance`, `tide_walker`, `stone_bulwark`, `bulwark_sigil`, `guard_momentum_link`, `sanctuary_bell`, `draw_power_sigil`, `void_charm`, `chain_bolt`, `memory_shard`, `cycle_engine`, `alternating_crest`, `meditation_stone`, `echo_charm`.
- `turnFlow.ts`: Line 109 inline check for `fortify_root`.

---

## 3. Proposal for `relicHookProtocol.ts` (~60 Eligible Relics)

### 3.1 Design Goals & Location
Create `src/game/core/relics/relicHookProtocol.ts` (or align `src/game/core/systems/relic/relicHooks.ts` to export this protocol) to establish a clean, pure, functional hook architecture.

### 3.2 Extended `RelicHookResult` Interface
To accommodate ~60 generated relics without executing arbitrary strings or UI side-effects, extend `RelicHookResult` with domain deltas:
```ts
export interface RelicHookResult {
  // Base stats & status stacks
  strength?: number;
  momentum?: number;
  metallicize?: number;
  steadyGuard?: number;
  block?: number;
  openingHandDraw?: number;
  energy?: number;
  draw?: number;
  maxHp?: number;
  currentHp?: number;
  
  // Battle mechanics & damage
  damageBonus?: number;
  reflectRatio?: number;
  nextAttackBonus?: number;
  nextSkillBonus?: number;
  forceExhaustAttack?: boolean;
  harmonyTriggered?: boolean;
  vulnerableStacks?: number;
  healAmount?: number;
  goldBonus?: number;
  primedBreak?: number;
  costReduction?: number;
}
```

### 3.3 Categorization of ~60 Eligible Relics
Out of 133 generated relics, 60 relics map cleanly to our core triggers and domain deltas:

1. **Battle Start (12 relics)**:
   - `echo_plating`: +2 metallicize
   - `stalwart_core`: +1 metallicize, +3 block
   - `iron_shroud`: +5 block, +1 metallicize
   - `war_cry`: 3 AoE damage
   - `void_crown`: +2 strength
   - `entropy_seal`: +1 strength, +1 momentum
   - `war_drums`: +1 strength
   - `bulwark_plating`: +1 metallicize
   - `quickstep_boots`: +2 energy
   - `ancient_tablet`: +2 opening hand draw
   - `ruins_lantern`: +1 energy
   - `vitality_draught`: heal 3 HP

2. **Momentum Consumed (14 relics)**:
   - `momentum_siphon`: block = consumed stacks
   - `bulwark_heart`: +2 block
   - `surge_drain`: heal 1 HP
   - `unbroken_flow`: draw 1 if remaining momentum >= 2
   - `volatile_core`: +50% consumed stacks damage
   - `rupture_fang`: apply 1 vulnerable stack
   - `momentum_burst_core`: deal 3 AoE damage if consumed >= 3
   - `ignition_surge`: next attack +3 damage
   - `surge_bloom`: +1 primed break
   - `rending_slash`: consume >= 5 momentum -> +6 damage
   - `relentless_tide`: first consume: double layer
   - `cascade_gem`: next consume layer doubled
   - `momentum_siphon_b3`: heal HP = consumed stacks
   - `tide_reshaper`: first consume: +1 primed break

3. **Card Played / Exhausted / Discarded (15 relics)**:
   - `meditation_stone`: skill played -> +1 block
   - `echo_charm`: power played -> draw 1 (max 2/turn)
   - `memory_shard`: skill played -> next card cost -1
   - `void_charm`: card discarded -> +1 block
   - `blaze_core`: card exhausted -> attack damage +2
   - `resonance_plating`: card exhausted -> +1 block
   - `soul_echo`: power played -> +1 energy
   - `alternating_crest`: attack-skill-attack -> draw 1
   - `chain_bolt`: 3+ attacks played -> next attack +8 damage
   - `draw_power_sigil`: card drawn -> gain block = strength
   - `cycle_engine`: attack + skill played -> draw 1
   - `frenzy_essence`: 3 attacks played -> draw 1
   - `balanced_stance`: attack count == skill count -> draw 1 & +1 block
   - `guard_momentum_link`: block card played -> +1 momentum
   - `burst_defense_sync`: attack then skill -> skill block +3

4. **Block Gained / Loss / Turn End (10 relics)**:
   - `stone_bulwark`: on block gain, if block == 0 -> +3 block
   - `bulwark_sigil`: block card played -> +1 block
   - `fortification_rune`: on block gain, if block == 0 -> +4 block
   - `fortify_root`: turn end: retain half block if block >= 5
   - `flow_anchor`: turn start: if momentum >= 3 -> +3 block
   - `momentum_anchor`: turn end: if momentum == 0 -> +2 momentum
   - `living_wall`: turn end: if unhit -> +3 retained block
   - `sanctuary_bell`: accumulate 15 block -> heal 1 HP
   - `echo_crest`: turn end: block = 50% consumed momentum

5. **Damage Taken / Lethal / Battle End / Pickup (9 relics)**:
   - `iron_veil`: first hit in battle -> +10 block
   - `shell_shard`: first HP loss -> +8 block
   - `thorn_ward`: hit by enemy -> deal 3 damage to attacker
   - `ward_of_rust`: hit and block intact -> deal 2 damage to attacker
   - `blood_fang`: deal 15+ damage -> heal 2 HP
   - `healing_stone`: battle end -> heal 3 HP
   - `verdant_vial`: battle end -> heal 3 HP
   - `explorer_charm`: battle end -> +15 gold
   - `soul_vessel`: pickup -> +8 maxHp/currentHp
   - `vitality_stone`: pickup -> +10 maxHp/currentHp
   - `tome_of_depths`: pickup -> +8 maxHp/currentHp

---

## 4. Pool & Selector Integration Plan

To make newly wired relics drop in combat rewards and shop offers:

1. **`COMMON_RELIC_POOL` (`relics.ts`)**:
   Expand `COMMON_RELIC_POOL` to include all ~60 wired relic IDs.
2. **`rewardRelicPool` (`characters.ts`)**:
   Update `walker` character definition's `rewardRelicPool` to reference the expanded `COMMON_RELIC_POOL`.
3. **`SHOP_RELIC_POOL` (`generateShop.ts`)**:
   Replace the hardcoded 12-item list in `generateShop.ts` with `COMMON_RELIC_POOL`, ensuring shop offers select from all wired relics.
4. **`BOSS_RELIC_POOL` & `rollBossRelicReward` (`relics.ts`)**:
   `BOSS_RELIC_POOL` automatically inherits all common relics since `BOSS_RELIC_POOL = [...COMMON_RELIC_POOL]`.
5. **Invariant Check (`relicHookRegistry.test.ts`)**:
   Enforce the invariant `COMMON_RELIC_POOL.every((id) => hasRelicRuntimeHook(id))` to guarantee zero unhandled relics in drop pools.

---

## 5. Battle Simulation Impact (`pnpm simulate:act1`)

1. **Deterministic Execution**:
   All relic effects modify explicit state or use `mulberry32` PRNG tied to run seed and turn index.
2. **Persona Synergies**:
   - `walker-guard` benefits from block retention (`fortify_root`), extra metallicize (`echo_plating`), and block conversion (`stone_bulwark`).
   - `walker-burst` benefits from extra momentum damage (`volatile_core`), cost reduction (`memory_shard`), and strength boosters (`void_crown`, `war_drums`).
   - `walker-mixed` benefits from dual triggers (`cycle_engine`, `alternating_crest`, `harmony_emblem`).
3. **Validation Suite (`run-act1-validation.ts`)**:
   Running `pnpm simulate:act1` verifies overall win rates, route exposure, and battle turn distributions without throwing invariant mismatches or runtime errors.
