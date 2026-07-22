import { describe, expect, test } from '@rstest/core';
import {
  activeRelicPoolHasRuntimeHooks,
  applyRelicPickupHooks,
  hasRelicRuntimeHook,
  resolveRelicHooks,
  RUNTIME_RELIC_IDS,
  type RelicHookContext,
} from '@/game/core/systems/relic/relicHooks';
import { COMMON_RELIC_POOL, RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import { buildInitialBattle, DEFAULT_ENEMY_LINEUP } from '@/game/core/engine/createMvpRun';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { createStarterMasterDeck } from '@/game/core/engine/starterDeck';
import { getStatusStacks } from '@/game/core/combat/statusCombat';
import { STATUS_METALLICIZE, STATUS_MOMENTUM, STATUS_STEADY_GUARD, STATUS_STRENGTH } from '@/game/core/definitions/statuses';

describe('Relic hook registry', () => {
  test('common obtainable relics have definitions and runtime hooks', () => {
    expect(activeRelicPoolHasRuntimeHooks()).toBe(true);
    for (const relicId of COMMON_RELIC_POOL) {
      expect(RELIC_DEFINITIONS[relicId]).toBeDefined();
      expect(hasRelicRuntimeHook(relicId)).toBe(true);
    }
    expect(RUNTIME_RELIC_IDS.length).toBeGreaterThanOrEqual(COMMON_RELIC_POOL.length);
  });

  test('每个实际可获得遗物至少有一个可执行 Hook 分支', () => {
    const battle = buildInitialBattle(23);
    const contexts: Record<string, Omit<RelicHookContext, 'relicId'>> = {
      // Base
      vajra: { battle, trigger: 'battleStart' },
      anchor: { battle, trigger: 'pickup' },
      wind_chime: { battle, trigger: 'battleStart' },
      tactical_gloves: { battle, trigger: 'battleStart' },
      burst_emblem: { battle, trigger: 'momentumConsumed', consumedStacks: 1, momentumKind: 'damage', firstConsumeThisTurn: true },
      insight_lens: { battle, trigger: 'momentumConsumed', consumedStacks: 1, momentumKind: 'draw', firstConsumeThisTurn: true },
      guard_knot: { battle, trigger: 'statusReduced', statusId: 'momentum', amount: 1 },
      still_core: { battle, trigger: 'battleStart' },
      soft_guard: { battle, trigger: 'battleStart' },
      quick_fuse: { battle, trigger: 'momentumConsumed', consumedStacks: 1, momentumKind: 'damage', firstConsumeThisTurn: true },
      sighted_edge: { battle, trigger: 'momentumConsumed', consumedStacks: 1, momentumKind: 'damage', firstConsumeThisTurn: true },
      blaze_core: { battle, trigger: 'cardExhausted' },
      fractured_blade: { battle, trigger: 'cardPlayed', cardType: 'attack', firstAttackThisTurn: true },
      iron_heart: { battle, trigger: 'blockGained', amount: 5, firstBlockThisTurn: true },
      counter_sigil: { battle, trigger: 'damageTaken', amount: 5 },
      twin_core: { battle, trigger: 'blockGained', amount: 5, firstBlockThisTurn: true },
      harmony_emblem: { battle, trigger: 'cardPlayed', cardType: 'attack', playedSkillThisTurn: true },
      ward_banner: { battle, trigger: 'battleStart' },
      flare_banner: { battle, trigger: 'momentumConsumed', consumedStacks: 1, momentumKind: 'damage', firstConsumeThisTurn: true },
      // Batch 1
      momentum_siphon: { battle, trigger: 'momentumConsumed', consumedStacks: 2 },
      flow_anchor: { battle, trigger: 'turnStart' },
      surge_drain: { battle, trigger: 'momentumConsumed', consumedStacks: 1 },
      unbroken_flow: { battle, trigger: 'momentumConsumed', consumedStacks: 2 },
      tide_walker: { battle, trigger: 'momentumConsumed', consumedStacks: 1 },
      stone_bulwark: { battle, trigger: 'blockGained', firstBlockThisTurn: true },
      echo_plating: { battle, trigger: 'battleStart' },
      bulwark_sigil: { battle, trigger: 'cardPlayed', cardType: 'skill' },
      fortify_root: { battle, trigger: 'turnEnd' },
      shell_shard: { battle, trigger: 'damageTaken' },
      ward_of_rust: { battle, trigger: 'damageTaken' },
      volatile_core: { battle, trigger: 'momentumConsumed', consumedStacks: 2 },
      rupture_fang: { battle, trigger: 'momentumConsumed', consumedStacks: 1 },
      momentum_burst_core: { battle, trigger: 'momentumConsumed', consumedStacks: 3 },
      ignition_surge: { battle, trigger: 'momentumConsumed', consumedStacks: 1 },
      frenzy_essence: { battle, trigger: 'cardPlayed', cardType: 'attack' },
      ruins_lantern: { battle, trigger: 'battleStart' },
      ancient_tablet: { battle, trigger: 'battleStart' },
      healing_stone: { battle, trigger: 'battleEnd' },
      soul_vessel: { battle, trigger: 'pickup' },
      echo_charm: { battle, trigger: 'cardPlayed', cardType: 'power' },
      vitality_draught: { battle, trigger: 'battleStart' },
      memory_shard: { battle, trigger: 'cardPlayed', cardType: 'skill' },
      void_charm: { battle, trigger: 'cardPlayed' },
      balanced_stance: { battle, trigger: 'cardPlayed', playedAttackThisTurn: true, playedSkillThisTurn: true },
      guard_momentum_link: { battle, trigger: 'cardPlayed', cardType: 'skill' },
      burst_defense_sync: { battle, trigger: 'cardPlayed', cardType: 'skill', playedAttackThisTurn: true },
      // Batch 2
      flow_regulator: { battle, trigger: 'turnStart' },
      surge_bloom: { battle, trigger: 'momentumConsumed', consumedStacks: 1 },
      flow_resonance: { battle, trigger: 'momentumConsumed', consumedStacks: 1 },
      momentum_anchor: { battle, trigger: 'turnEnd' },
      momentum_well: { battle, trigger: 'cardPlayed', cardType: 'power' },
      surge_siphon: { battle, trigger: 'momentumConsumed', consumedStacks: 2 },
      fortification_rune: { battle, trigger: 'blockGained', firstBlockThisTurn: true },
      iron_veil: { battle, trigger: 'damageTaken' },
      living_wall: { battle, trigger: 'turnEnd' },
      resonance_plating: { battle, trigger: 'cardExhausted' },
      stalwart_core: { battle, trigger: 'battleStart' },
      thorn_ward: { battle, trigger: 'damageTaken' },
      iron_shroud: { battle, trigger: 'battleStart' },
      bulwark_heart: { battle, trigger: 'momentumConsumed', consumedStacks: 1 },
      blood_fang: { battle, trigger: 'cardPlayed', cardType: 'attack' },
      momentum_fury: { battle, trigger: 'momentumConsumed', consumedStacks: 1 },
      war_cry: { battle, trigger: 'battleStart' },
      explorer_charm: { battle, trigger: 'battleEnd' },
      mystic_lens: { battle, trigger: 'battleStart' },
      vitality_stone: { battle, trigger: 'pickup' },
      soul_echo: { battle, trigger: 'cardPlayed', cardType: 'power' },
      quickdraw_glove: { battle, trigger: 'battleStart' },
      meditation_stone: { battle, trigger: 'cardPlayed', cardType: 'skill' },
      rhythm_lock: { battle, trigger: 'cardPlayed', cardType: 'attack', playedSkillThisTurn: true },
      cycle_engine: { battle, trigger: 'cardPlayed', playedAttackThisTurn: true, playedSkillThisTurn: true },
      void_crown: { battle, trigger: 'battleStart' },
      entropy_seal: { battle, trigger: 'battleStart' },
      // Batch 3
      momentum_seed: { battle, trigger: 'turnStart' },
      cascade_gem: { battle, trigger: 'momentumConsumed', consumedStacks: 1 },
      momentum_siphon_b3: { battle, trigger: 'momentumConsumed', consumedStacks: 2 },
      tide_reshaper: { battle, trigger: 'momentumConsumed', firstConsumeThisTurn: true },
      echo_crest: { battle, trigger: 'turnEnd' },
      bulwark_plating: { battle, trigger: 'battleStart' },
      sanctuary_bell: { battle, trigger: 'blockGained' },
      rending_slash: { battle, trigger: 'momentumConsumed', consumedStacks: 5 },
      war_drums: { battle, trigger: 'battleStart' },
      relentless_tide: { battle, trigger: 'momentumConsumed', firstConsumeThisTurn: true, consumedStacks: 2 },
      rune_pouch: { battle, trigger: 'turnStart' },
      verdant_vial: { battle, trigger: 'battleEnd' },
      tome_of_depths: { battle, trigger: 'pickup' },
      quickstep_boots: { battle, trigger: 'battleStart' },
      alternating_crest: { battle, trigger: 'cardPlayed', cardType: 'attack', playedSkillThisTurn: true },
      chain_bolt: { battle, trigger: 'cardPlayed', cardType: 'attack' },
      draw_power_sigil: { battle, trigger: 'cardPlayed' },
    };

    for (const relicId of RUNTIME_RELIC_IDS) {
      const result = resolveRelicHooks([relicId], contexts[relicId]!);
      expect(Object.keys(result).length, relicId).toBeGreaterThan(0);
    }
  });

  test('battle start hooks aggregate opening state consistently', () => {
    const battle = buildInitialBattle(
      13,
      undefined,
      'relic-hook-test',
      createStarterMasterDeck(),
      DEFAULT_ENEMY_LINEUP,
      ['vajra', 'wind_chime', 'tactical_gloves', 'guard_knot', 'still_core', 'soft_guard', 'ward_banner'],
    );
    const player = battle.units[battle.playerUnitId]!;

    expect(getStatusStacks(player, STATUS_STRENGTH)).toBe(1);
    expect(getStatusStacks(player, STATUS_MOMENTUM)).toBe(2);
    expect(getStatusStacks(player, STATUS_METALLICIZE)).toBe(1);
    expect(getStatusStacks(player, STATUS_STEADY_GUARD)).toBe(2);
    expect(player.block).toBe(10);
    expect(battle.player.hand).toHaveLength(6);
  });

  test('momentum hooks separate damage and draw bonuses', () => {
    const battle = buildInitialBattle(17);
    const damageResult = resolveRelicHooks(['burst_emblem', 'sighted_edge', 'quick_fuse'], {
      battle,
      trigger: 'momentumConsumed',
      consumedStacks: 3,
      momentumKind: 'damage',
      firstConsumeThisTurn: true,
    });
    const drawResult = resolveRelicHooks(['burst_emblem', 'insight_lens', 'quick_fuse'], {
      battle,
      trigger: 'momentumConsumed',
      consumedStacks: 3,
      momentumKind: 'draw',
      firstConsumeThisTurn: true,
    });

    expect(damageResult.damageBonus).toBe(5);
    expect(damageResult.draw).toBe(1);
    expect(damageResult.energy).toBe(1);
    expect(drawResult.damageBonus ?? 0).toBe(0);
    expect(drawResult.draw).toBe(1);
    expect(drawResult.energy).toBe(1);
  });

  test('pickup and mixed-card hooks execute their actual effects', () => {
    const run = createMapRun(31);
    applyRelicPickupHooks(run, 'anchor');
    expect(run.player.maxHp).toBe(55);
    expect(run.player.currentHp).toBe(55);

    const battle = buildInitialBattle(19);
    const mixedResult = resolveRelicHooks(['harmony_emblem'], {
      battle,
      trigger: 'cardPlayed',
      cardType: 'skill',
      playedAttackThisTurn: true,
      playedSkillThisTurn: false,
      harmonyTriggeredThisTurn: false,
    });
    expect(mixedResult.draw).toBe(1);
    expect(mixedResult.energy).toBe(1);
    expect(mixedResult.harmonyTriggered).toBe(true);

    const noConsumeResult = resolveRelicHooks(['burst_emblem', 'insight_lens'], {
      battle,
      trigger: 'momentumConsumed',
      consumedStacks: 0,
      momentumKind: 'damage',
      firstConsumeThisTurn: false,
    });
    expect(noConsumeResult.damageBonus ?? 0).toBe(0);
    expect(noConsumeResult.draw ?? 0).toBe(0);
  });
});
