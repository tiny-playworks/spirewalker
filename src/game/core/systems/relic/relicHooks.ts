import type { RunState } from '../../model/run';
import {
  COMMON_RELIC_POOL,
  RELIC_DEFINITIONS,
} from '../../definitions/relics';
import type {
  RelicHook,
  RelicHookContext,
  RelicHookResult,
  RelicTrigger,
} from '../../relics/relicHookProtocol';

export type {
  RelicHook,
  RelicHookContext,
  RelicHookResult,
  RelicTrigger,
};

export const RELIC_HOOKS: Record<string, RelicHook> = {
  // ─── Base Relics (19) ──────────────────────────────────────────
  vajra: ({ trigger }) => (trigger === 'battleStart' ? { strength: 1 } : undefined),
  anchor: ({ trigger }) => (trigger === 'pickup' ? { maxHp: 5, currentHp: 5 } : undefined),
  wind_chime: ({ trigger }) => (trigger === 'battleStart' ? { momentum: 2 } : undefined),
  tactical_gloves: ({ trigger }) => (trigger === 'battleStart' ? { openingHandDraw: 1 } : undefined),
  burst_emblem: ({ trigger, momentumKind, consumedStacks, firstConsumeThisTurn }) => {
    if (trigger !== 'momentumConsumed' || (consumedStacks ?? 0) <= 0) return undefined;
    return {
      damageBonus: momentumKind === 'damage' ? 2 : 0,
      draw: momentumKind === 'damage' && firstConsumeThisTurn ? 1 : 0,
    };
  },
  insight_lens: ({ trigger, momentumKind, consumedStacks }) =>
    trigger === 'momentumConsumed' && momentumKind === 'draw' && (consumedStacks ?? 0) > 0
      ? { draw: 1 }
      : undefined,
  guard_knot: ({ trigger, statusId }) => {
    if (trigger === 'battleStart') return { steadyGuard: 1 };
    if (trigger === 'statusReduced' && statusId === 'momentum') return { momentumReduction: 1 };
    return undefined;
  },
  still_core: ({ trigger }) =>
    trigger === 'battleStart' ? { metallicize: 1, steadyGuard: 1 } : undefined,
  soft_guard: ({ trigger }) => (trigger === 'battleStart' ? { block: 4 } : undefined),
  quick_fuse: ({ trigger, firstConsumeThisTurn }) =>
    trigger === 'momentumConsumed' && firstConsumeThisTurn ? { energy: 1 } : undefined,
  sighted_edge: ({ trigger, consumedStacks }) =>
    trigger === 'momentumConsumed' ? { damageBonus: consumedStacks ?? 0 } : undefined,
  blaze_core: ({ trigger }) => (trigger === 'cardExhausted' ? { damageBonus: 2 } : undefined),
  fractured_blade: ({ trigger, cardType, firstAttackThisTurn }) =>
    trigger === 'cardPlayed' && cardType === 'attack' && firstAttackThisTurn
      ? { forceExhaustAttack: true }
      : undefined,
  iron_heart: ({ trigger }) => (trigger === 'blockGained' ? { block: 2 } : undefined),
  counter_sigil: ({ trigger }) => (trigger === 'damageTaken' ? { reflectRatio: 0.3 } : undefined),
  twin_core: ({ trigger, firstBlockThisTurn, firstAttackThisTurn, cardType }) => {
    if (trigger === 'blockGained' && firstBlockThisTurn) return { nextAttackBonus: 5 };
    if (trigger === 'cardPlayed' && cardType === 'attack' && firstAttackThisTurn) {
      return { nextSkillBonus: 5 };
    }
    return undefined;
  },
  harmony_emblem: ({
    trigger,
    cardType,
    playedAttackThisTurn,
    playedSkillThisTurn,
    harmonyTriggeredThisTurn,
  }) => {
    if (
      trigger !== 'cardPlayed' ||
      harmonyTriggeredThisTurn ||
      !cardType ||
      !((cardType === 'attack' && playedSkillThisTurn) ||
        ((cardType === 'skill' || cardType === 'power') && playedAttackThisTurn))
    ) {
      return undefined;
    }
    return { draw: 1, energy: 1, harmonyTriggered: true };
  },
  ward_banner: ({ trigger }) => (trigger === 'battleStart' ? { block: 6 } : undefined),
  flare_banner: ({ trigger, firstConsumeThisTurn }) =>
    trigger === 'momentumConsumed' && firstConsumeThisTurn ? { energy: 1 } : undefined,

  // ─── Generated Relics Batch 1 (27) ──────────────────────────────
  momentum_siphon: ({ trigger, consumedStacks }) =>
    trigger === 'momentumConsumed' ? { block: Math.max(1, consumedStacks ?? 1) } : undefined,
  flow_anchor: ({ trigger }) => (trigger === 'turnStart' ? { block: 3 } : undefined),
  surge_drain: ({ trigger }) => (trigger === 'momentumConsumed' ? { currentHp: 1 } : undefined),
  unbroken_flow: ({ trigger, consumedStacks }) =>
    trigger === 'momentumConsumed' && (consumedStacks ?? 0) > 0 ? { draw: 1 } : undefined,
  tide_walker: ({ trigger, consumedStacks }) =>
    trigger === 'momentumConsumed' ? { block: Math.max(1, consumedStacks ?? 1) } : undefined,
  stone_bulwark: ({ trigger, firstBlockThisTurn }) =>
    trigger === 'blockGained' && firstBlockThisTurn ? { block: 3 } : undefined,
  echo_plating: ({ trigger }) => (trigger === 'battleStart' ? { metallicize: 2 } : undefined),
  bulwark_sigil: ({ trigger, cardType }) =>
    trigger === 'cardPlayed' && cardType === 'skill' ? { block: 1 } : undefined,
  fortify_root: ({ trigger }) => (trigger === 'turnEnd' ? { block: 2 } : undefined),
  shell_shard: ({ trigger }) => (trigger === 'damageTaken' ? { block: 8 } : undefined),
  ward_of_rust: ({ trigger }) => (trigger === 'damageTaken' ? { reflectRatio: 0.3 } : undefined),
  volatile_core: ({ trigger, consumedStacks }) =>
    trigger === 'momentumConsumed'
      ? { damageBonus: Math.max(1, Math.ceil((consumedStacks ?? 1) * 0.5)) }
      : undefined,
  rupture_fang: ({ trigger }) =>
    trigger === 'momentumConsumed' ? { damageBonus: 2, vulnerableStacks: 1 } : undefined,
  momentum_burst_core: ({ trigger, consumedStacks }) =>
    trigger === 'momentumConsumed' && (consumedStacks ?? 0) >= 3 ? { damageBonus: 3 } : undefined,
  ignition_surge: ({ trigger }) =>
    trigger === 'momentumConsumed' ? { nextAttackBonus: 3 } : undefined,
  frenzy_essence: ({ trigger, cardType }) =>
    trigger === 'cardPlayed' && cardType === 'attack' ? { draw: 1 } : undefined,
  ruins_lantern: ({ trigger }) => (trigger === 'battleStart' ? { energy: 1 } : undefined),
  ancient_tablet: ({ trigger }) => (trigger === 'battleStart' ? { openingHandDraw: 2 } : undefined),
  healing_stone: ({ trigger }) => (trigger === 'battleEnd' ? { currentHp: 3 } : undefined),
  soul_vessel: ({ trigger }) => (trigger === 'pickup' ? { maxHp: 8, currentHp: 8 } : undefined),
  echo_charm: ({ trigger, cardType }) =>
    trigger === 'cardPlayed' && cardType === 'power' ? { draw: 1 } : undefined,
  vitality_draught: ({ trigger }) => (trigger === 'battleStart' ? { currentHp: 3 } : undefined),
  memory_shard: ({ trigger, cardType }) =>
    trigger === 'cardPlayed' && cardType === 'skill' ? { costReduction: 1 } : undefined,
  void_charm: ({ trigger }) => (trigger === 'cardPlayed' ? { block: 1 } : undefined),
  balanced_stance: ({ trigger, playedAttackThisTurn, playedSkillThisTurn }) =>
    trigger === 'cardPlayed' && playedAttackThisTurn && playedSkillThisTurn
      ? { draw: 1, block: 1 }
      : undefined,
  guard_momentum_link: ({ trigger, cardType }) =>
    trigger === 'cardPlayed' && cardType === 'skill' ? { momentum: 1 } : undefined,
  burst_defense_sync: ({ trigger, cardType, playedAttackThisTurn }) =>
    trigger === 'cardPlayed' && cardType === 'skill' && playedAttackThisTurn
      ? { block: 3 }
      : undefined,

  // ─── Generated Relics Batch 2 (27) ──────────────────────────────
  flow_regulator: ({ trigger }) => (trigger === 'turnStart' ? { momentum: 2 } : undefined),
  surge_bloom: ({ trigger }) => (trigger === 'momentumConsumed' ? { primedBreak: 1 } : undefined),
  flow_resonance: ({ trigger }) => (trigger === 'momentumConsumed' ? { draw: 1 } : undefined),
  momentum_anchor: ({ trigger }) => (trigger === 'turnEnd' ? { momentum: 2 } : undefined),
  momentum_well: ({ trigger, cardType }) =>
    trigger === 'cardPlayed' && cardType === 'power' ? { momentum: 1 } : undefined,
  surge_siphon: ({ trigger, consumedStacks }) =>
    trigger === 'momentumConsumed' ? { block: Math.max(1, consumedStacks ?? 1) } : undefined,
  fortification_rune: ({ trigger, firstBlockThisTurn }) =>
    trigger === 'blockGained' && firstBlockThisTurn ? { block: 4 } : undefined,
  iron_veil: ({ trigger }) => (trigger === 'damageTaken' ? { block: 10 } : undefined),
  living_wall: ({ trigger }) => (trigger === 'turnEnd' ? { block: 3 } : undefined),
  resonance_plating: ({ trigger }) => (trigger === 'cardExhausted' ? { block: 1 } : undefined),
  stalwart_core: ({ trigger }) =>
    trigger === 'battleStart' ? { metallicize: 1, block: 3 } : undefined,
  thorn_ward: ({ trigger }) => (trigger === 'damageTaken' ? { reflectRatio: 0.5 } : undefined),
  iron_shroud: ({ trigger }) =>
    trigger === 'battleStart' ? { block: 5, metallicize: 1 } : undefined,
  bulwark_heart: ({ trigger }) => (trigger === 'momentumConsumed' ? { block: 2 } : undefined),
  blood_fang: ({ trigger, cardType }) =>
    trigger === 'cardPlayed' && cardType === 'attack' ? { currentHp: 2 } : undefined,
  momentum_fury: ({ trigger }) =>
    trigger === 'momentumConsumed' ? { nextAttackBonus: 5 } : undefined,
  war_cry: ({ trigger }) => (trigger === 'battleStart' ? { damageBonus: 3 } : undefined),
  explorer_charm: ({ trigger }) => (trigger === 'battleEnd' ? { goldBonus: 15 } : undefined),
  mystic_lens: ({ trigger }) => (trigger === 'battleStart' ? { openingHandDraw: 1 } : undefined),
  vitality_stone: ({ trigger }) => (trigger === 'pickup' ? { maxHp: 10, currentHp: 10 } : undefined),
  soul_echo: ({ trigger, cardType }) =>
    trigger === 'cardPlayed' && cardType === 'power' ? { energy: 1 } : undefined,
  quickdraw_glove: ({ trigger }) => (trigger === 'battleStart' ? { openingHandDraw: 1 } : undefined),
  meditation_stone: ({ trigger, cardType }) =>
    trigger === 'cardPlayed' && cardType === 'skill' ? { block: 1 } : undefined,
  rhythm_lock: ({ trigger, cardType, playedSkillThisTurn }) =>
    trigger === 'cardPlayed' && cardType === 'attack' && playedSkillThisTurn
      ? { damageBonus: 3 }
      : undefined,
  cycle_engine: ({ trigger, playedAttackThisTurn, playedSkillThisTurn }) =>
    trigger === 'cardPlayed' && playedAttackThisTurn && playedSkillThisTurn
      ? { draw: 1 }
      : undefined,
  void_crown: ({ trigger }) => (trigger === 'battleStart' ? { strength: 2 } : undefined),
  entropy_seal: ({ trigger }) =>
    trigger === 'battleStart' ? { strength: 1, momentum: 1 } : undefined,

  // ─── Generated Relics Batch 3 (17) ──────────────────────────────
  momentum_seed: ({ trigger }) => (trigger === 'turnStart' ? { momentum: 1 } : undefined),
  cascade_gem: ({ trigger, consumedStacks }) =>
    trigger === 'momentumConsumed' ? { damageBonus: Math.max(1, consumedStacks ?? 1) } : undefined,
  momentum_siphon_b3: ({ trigger, consumedStacks }) =>
    trigger === 'momentumConsumed' ? { currentHp: Math.max(1, consumedStacks ?? 1) } : undefined,
  tide_reshaper: ({ trigger, firstConsumeThisTurn }) =>
    trigger === 'momentumConsumed' && firstConsumeThisTurn ? { primedBreak: 1 } : undefined,
  echo_crest: ({ trigger }) => (trigger === 'turnEnd' ? { block: 2 } : undefined),
  bulwark_plating: ({ trigger }) => (trigger === 'battleStart' ? { metallicize: 1 } : undefined),
  sanctuary_bell: ({ trigger }) => (trigger === 'blockGained' ? { currentHp: 1 } : undefined),
  rending_slash: ({ trigger, consumedStacks }) =>
    trigger === 'momentumConsumed' && (consumedStacks ?? 0) >= 5 ? { damageBonus: 6 } : undefined,
  war_drums: ({ trigger }) => (trigger === 'battleStart' ? { strength: 1 } : undefined),
  relentless_tide: ({ trigger, firstConsumeThisTurn, consumedStacks }) =>
    trigger === 'momentumConsumed' && firstConsumeThisTurn
      ? { damageBonus: Math.max(1, consumedStacks ?? 1) }
      : undefined,
  rune_pouch: ({ trigger }) => (trigger === 'turnStart' ? { draw: 1 } : undefined),
  verdant_vial: ({ trigger }) => (trigger === 'battleEnd' ? { currentHp: 3 } : undefined),
  tome_of_depths: ({ trigger }) => (trigger === 'pickup' ? { maxHp: 8, currentHp: 8 } : undefined),
  quickstep_boots: ({ trigger }) => (trigger === 'battleStart' ? { energy: 2 } : undefined),
  alternating_crest: ({ trigger, cardType, playedSkillThisTurn }) =>
    trigger === 'cardPlayed' && cardType === 'attack' && playedSkillThisTurn
      ? { draw: 1 }
      : undefined,
  chain_bolt: ({ trigger, cardType }) =>
    trigger === 'cardPlayed' && cardType === 'attack' ? { nextAttackBonus: 8 } : undefined,
  draw_power_sigil: ({ trigger }) => (trigger === 'cardPlayed' ? { block: 1 } : undefined),
};

/** 当前可进入奖励、商店或事件结果的遗物必须在这里有运行时 Hook。 */
export const RUNTIME_RELIC_IDS = [
  // Base
  'vajra',
  'anchor',
  'wind_chime',
  'tactical_gloves',
  'burst_emblem',
  'insight_lens',
  'guard_knot',
  'still_core',
  'soft_guard',
  'quick_fuse',
  'sighted_edge',
  'blaze_core',
  'fractured_blade',
  'iron_heart',
  'counter_sigil',
  'twin_core',
  'harmony_emblem',
  'ward_banner',
  'flare_banner',
  // Batch 1
  'momentum_siphon',
  'flow_anchor',
  'surge_drain',
  'unbroken_flow',
  'tide_walker',
  'stone_bulwark',
  'echo_plating',
  'bulwark_sigil',
  'fortify_root',
  'shell_shard',
  'ward_of_rust',
  'volatile_core',
  'rupture_fang',
  'momentum_burst_core',
  'ignition_surge',
  'frenzy_essence',
  'ruins_lantern',
  'ancient_tablet',
  'healing_stone',
  'soul_vessel',
  'echo_charm',
  'vitality_draught',
  'memory_shard',
  'void_charm',
  'balanced_stance',
  'guard_momentum_link',
  'burst_defense_sync',
  // Batch 2
  'flow_regulator',
  'surge_bloom',
  'flow_resonance',
  'momentum_anchor',
  'momentum_well',
  'surge_siphon',
  'fortification_rune',
  'iron_veil',
  'living_wall',
  'resonance_plating',
  'stalwart_core',
  'thorn_ward',
  'iron_shroud',
  'bulwark_heart',
  'blood_fang',
  'momentum_fury',
  'war_cry',
  'explorer_charm',
  'mystic_lens',
  'vitality_stone',
  'soul_echo',
  'quickdraw_glove',
  'meditation_stone',
  'rhythm_lock',
  'cycle_engine',
  'void_crown',
  'entropy_seal',
  // Batch 3
  'momentum_seed',
  'cascade_gem',
  'momentum_siphon_b3',
  'tide_reshaper',
  'echo_crest',
  'bulwark_plating',
  'sanctuary_bell',
  'rending_slash',
  'war_drums',
  'relentless_tide',
  'rune_pouch',
  'verdant_vial',
  'tome_of_depths',
  'quickstep_boots',
  'alternating_crest',
  'chain_bolt',
  'draw_power_sigil',
] as const;

export function resolveRelicHooks(
  relicIds: readonly string[],
  context: Omit<RelicHookContext, 'relicId'>,
): RelicHookResult {
  const result: RelicHookResult = {};
  for (const relicId of relicIds) {
    const hook = RELIC_HOOKS[relicId];
    if (!hook) continue;
    const next = hook({ ...context, relicId });
    if (!next) continue;
    for (const key of [
      'strength',
      'momentum',
      'metallicize',
      'steadyGuard',
      'block',
      'openingHandDraw',
      'damageBonus',
      'draw',
      'energy',
      'maxHp',
      'currentHp',
      'momentumReduction',
      'nextAttackBonus',
      'nextSkillBonus',
      'vulnerableStacks',
      'goldBonus',
      'primedBreak',
      'costReduction',
    ] as const) {
      const value = next[key];
      if (typeof value === 'number') result[key] = (result[key] ?? 0) + value;
    }
    if (typeof next.reflectRatio === 'number') {
      result.reflectRatio = Math.max(result.reflectRatio ?? 0, next.reflectRatio);
    }
    if (next.forceExhaustAttack) result.forceExhaustAttack = true;
    if (next.harmonyTriggered) result.harmonyTriggered = true;
  }
  return result;
}

export function applyRelicPickupHooks(run: RunState, relicId: string): void {
  const result = resolveRelicHooks([relicId], { run, trigger: 'pickup' });
  if (result.maxHp) run.player.maxHp += result.maxHp;
  if (result.currentHp) run.player.currentHp += result.currentHp;
}

export function hasRelicRuntimeHook(relicId: string): boolean {
  return typeof RELIC_HOOKS[relicId] === 'function' && Boolean(RELIC_DEFINITIONS[relicId]);
}

export function activeRelicPoolHasRuntimeHooks(): boolean {
  return COMMON_RELIC_POOL.every((relicId) => hasRelicRuntimeHook(relicId));
}
