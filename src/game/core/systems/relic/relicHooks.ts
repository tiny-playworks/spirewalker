import { addStatusStacks, getStatusStacks } from '../../combat/statusCombat';
import {
  STATUS_METALLICIZE,
  STATUS_MOMENTUM,
  STATUS_PRIMED_BREAK,
  STATUS_STEADY_GUARD,
  STATUS_STRENGTH,
  STATUS_VULNERABLE,
} from '../../definitions/statuses';
import type { GameEvent } from '../../events/types';
import type { BattleState, RelicRuntimeState } from '../../model/battle';
import type { RunState } from '../../model/run';
import {
  COMMON_RELIC_POOL,
  RELIC_DEFINITIONS,
} from '../../definitions/relics';
import { CARD_DEFINITIONS } from '../../definitions/cards';
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

function playerOf(context: RelicHookContext) {
  const battle = context.battle;
  return battle?.units[battle.playerUnitId];
}

function momentumOf(context: RelicHookContext): number {
  const player = playerOf(context);
  return player ? getStatusStacks(player, STATUS_MOMENTUM) : context.remainingMomentum ?? 0;
}

function isAfter(context: RelicHookContext): boolean {
  return context.damagePhase === undefined || context.damagePhase === 'after';
}

function isBefore(context: RelicHookContext): boolean {
  return context.damagePhase === undefined || context.damagePhase === 'before';
}

function currentBlock(context: RelicHookContext): number {
  return context.currentBlock ?? playerOf(context)?.block ?? 0;
}

function runtimeNumber(context: RelicHookContext, key: string): number {
  const value = context.battle?.relicRuntime?.[key];
  return typeof value === 'number' ? value : 0;
}

function hasMomentumAndGuard(context: RelicHookContext): boolean {
  const player = playerOf(context);
  return Boolean(
    player
    && getStatusStacks(player, STATUS_MOMENTUM) > 0
    && getStatusStacks(player, STATUS_STEADY_GUARD) > 0,
  );
}

function hasConvergenceState(context: RelicHookContext): boolean {
  const player = playerOf(context);
  return Boolean(
    player
    && getStatusStacks(player, STATUS_MOMENTUM) > 0
    && player.block > 0
    && getStatusStacks(player, STATUS_METALLICIZE) > 0,
  );
}

export const RELIC_HOOKS: Record<string, RelicHook> = {
  // ─── Base Relics ────────────────────────────────────────────────
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
    if (trigger === 'statusReduced' && statusId === STATUS_MOMENTUM) return { momentumReduction: 1 };
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
  counter_sigil: ({ trigger, blockAbsorbed }) =>
    trigger === 'damageTaken' && (blockAbsorbed ?? 0) > 0 ? { reflectRatio: 0.3 } : undefined,
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
      trigger !== 'cardPlayed'
      || harmonyTriggeredThisTurn
      || !cardType
      || !((cardType === 'attack' && playedSkillThisTurn)
        || ((cardType === 'skill' || cardType === 'power') && playedAttackThisTurn))
    ) return undefined;
    return { draw: 1, energy: 1, harmonyTriggered: true };
  },
  ward_banner: ({ trigger }) => (trigger === 'battleStart' ? { block: 6 } : undefined),
  flare_banner: ({ trigger, firstConsumeThisTurn }) =>
    trigger === 'momentumConsumed' && firstConsumeThisTurn ? { energy: 1 } : undefined,

  // ─── Generated Relics Batch 1 ──────────────────────────────────
  momentum_siphon: ({ trigger, consumedStacks }) =>
    trigger === 'momentumConsumed' && (consumedStacks ?? 0) > 0 ? { block: consumedStacks } : undefined,
  momentum_echo: (context) =>
    context.trigger === 'turnEnd' && runtimeNumber(context, 'momentumConsumeCountThisTurn') >= 2
      ? { momentum: 2 }
      : undefined,
  tide_mirror: ({ trigger, consumedStacks }) =>
    trigger === 'momentumConsumed' && (consumedStacks ?? 0) > 0
      ? { block: Math.ceil((consumedStacks ?? 0) / 2) }
      : undefined,
  momentum_catalyst: ({ trigger, remainingMomentum }) =>
    trigger === 'momentumGained' && (remainingMomentum ?? 0) >= 5 ? { momentum: 1 } : undefined,
  flow_anchor: ({ trigger, remainingMomentum, battle }) =>
    trigger === 'turnStart'
    && (remainingMomentum ?? momentumOf({ battle, trigger, relicId: 'flow_anchor' })) >= 3
      ? { block: 3 }
      : undefined,
  surge_drain: ({ trigger }) => (trigger === 'momentumConsumed' ? { currentHp: 1 } : undefined),
  momentum_lens: (context) =>
    context.trigger === 'momentumGained'
    && runtimeNumber(context, 'momentumLensTriggers') < 3
    &&
    (context.remainingMomentum ?? 0) > 0
    && (context.remainingMomentum ?? 0) % 5 === 0
      ? { draw: 1 }
      : undefined,
  residual_flame: ({ trigger, remainingMomentum }) =>
    trigger === 'battleEnd' && (remainingMomentum ?? 0) >= 3 ? { nextBattleMomentum: 3 } : undefined,
  unbroken_flow: ({ trigger, consumedStacks, remainingMomentum }) =>
    trigger === 'momentumConsumed'
    && (consumedStacks ?? 0) > 0
    && (remainingMomentum ?? 0) >= 2
      ? { draw: 1 }
      : undefined,
  tide_walker: ({ trigger, firstConsumeThisTurn }) =>
    trigger === 'momentumCost' && firstConsumeThisTurn ? { momentumCostReduction: 1 } : undefined,
  stone_bulwark: ({ trigger, currentBlock }) =>
    trigger === 'blockGained' && (currentBlock ?? 0) === 0 ? { block: 3 } : undefined,
  echo_plating: ({ trigger }) => (trigger === 'battleStart' ? { metallicize: 2 } : undefined),
  thorn_root: ({ trigger, damagePhase }) => (trigger === 'damageTaken' && isAfter({ trigger, relicId: 'thorn_root', damagePhase })) ? { metallicize: 1 } : undefined,
  iron_resolve: ({ trigger, battle }) => {
    const player = battle?.units[battle.playerUnitId];
    return trigger === 'damageTaken' && player && player.block >= 10 ? { damageReduction: 2 } : undefined;
  },
  bulwark_sigil: ({ trigger, cardHasBlock, cardType }) =>
    trigger === 'cardPlayed' && cardHasBlock && (cardType === 'skill' || cardType === 'power')
      ? { block: 1 }
      : undefined,
  fortify_root: ({ trigger, battle }) => {
    const player = battle?.units[battle.playerUnitId];
    return trigger === 'turnEnd' && player && player.block >= 5
      ? { retainBlockRatio: 0.5 }
      : undefined;
  },
  shell_shard: ({ trigger, damagePhase, hpLoss, battle }) =>
    trigger === 'damageTaken'
    && isAfter({ trigger, relicId: 'shell_shard', damagePhase })
    && (hpLoss ?? 0) > 0
    && !(battle?.relicRuntime?.shellShardUsed)
      ? { block: 8 }
      : undefined,
  ward_of_rust: ({ trigger, damagePhase, hpLoss, blockAbsorbed, sourceUnitId }) =>
    trigger === 'damageTaken'
    && isAfter({ trigger, relicId: 'ward_of_rust', damagePhase })
    && (blockAbsorbed ?? 0) > 0
    && (hpLoss ?? 0) === 0
    && sourceUnitId
      ? { extraDamage: 2 }
      : undefined,
  enduring_wall: ({ trigger, blockAbsorbed }) =>
    trigger === 'damageTaken' && (blockAbsorbed ?? 0) >= 5 ? { steadyGuard: 1 } : undefined,
  barrier_echo: ({ trigger, cardHasBlock }) =>
    trigger === 'cardPlayed' && cardHasBlock ? { block: 2 } : undefined,
  volatile_core: ({ trigger, consumedStacks }) =>
    trigger === 'momentumConsumed'
      ? { damageBonus: Math.ceil((consumedStacks ?? 0) * 0.5) }
      : undefined,
  overcharge: ({ trigger, damagePhase, isPlayerAttack, firstAttackThisTurn, battle }) =>
    trigger === 'damageDealt'
    && isBefore({ trigger, relicId: 'overcharge', damagePhase })
    && isPlayerAttack
    && firstAttackThisTurn
    && momentumOf({ battle, trigger, relicId: 'overcharge' }) >= 3
      ? { damageBonus: 4 }
      : undefined,
  rupture_fang: ({ trigger, isMomentumAttack }) =>
    trigger === 'momentumConsumed' && isMomentumAttack ? { vulnerableStacks: 1 } : undefined,
  chain_detonation: ({ trigger, isPlayerAttack, attackCountAfterPlay }) =>
    trigger === 'damageDealt' && isPlayerAttack && (attackCountAfterPlay ?? 0) >= 2
      ? { damageBonus: 2 }
      : undefined,
  ember_blade: (context) =>
    context.trigger === 'damageDealt'
    && context.isPlayerAttack
    && runtimeNumber(context, 'momentumConsumedThisTurn') > 0
      ? { damageBonus: 2 }
      : undefined,
  momentum_burst_core: ({ trigger, consumedStacks }) =>
    trigger === 'momentumConsumed' && (consumedStacks ?? 0) >= 3 ? { damageAllEnemies: 3 } : undefined,
  ignition_surge: ({ trigger }) =>
    trigger === 'momentumConsumed' ? { nextAttackBonus: 3 } : undefined,
  rend_shard: ({ trigger, damagePhase, amount, isSecondaryDamage, isPlayerAttack }) =>
    trigger === 'damageDealt'
    && isAfter({ trigger, relicId: 'rend_shard', damagePhase })
    && isPlayerAttack
    && !isSecondaryDamage
    && (amount ?? 0) >= 10
      ? { extraDamage: 2 }
      : undefined,
  frenzy_essence: ({ trigger, attackCountAfterPlay }) =>
    trigger === 'cardPlayed' && attackCountAfterPlay === 3 ? { draw: 1 } : undefined,
  devastation_seal: ({ trigger, damagePhase, targetAlive, battle }) =>
    trigger === 'damageDealt'
    && isAfter({ trigger, relicId: 'devastation_seal', damagePhase })
    && targetAlive === false
    && !(battle?.relicRuntime?.devastationSealUsed)
      ? { damageAllEnemies: 5 }
      : undefined,
  ruins_lantern: ({ trigger }) => (trigger === 'battleStart' ? { energy: 1 } : undefined),
  ancient_tablet: ({ trigger }) => (trigger === 'battleStart' ? { openingHandDraw: 2 } : undefined),
  healing_stone: ({ trigger }) => (trigger === 'battleEnd' ? { currentHp: 3 } : undefined),
  soul_vessel: ({ trigger }) => (trigger === 'pickup' ? { maxHp: 8, currentHp: 8 } : undefined),
  time_hourglass: ({ trigger, battle }) =>
    trigger === 'turnEnd' && (battle?.player.hand.length ?? 3) < 3
      ? { nextTurnDraw: 3 - (battle?.player.hand.length ?? 3) }
      : undefined,
  echo_charm: ({ trigger, cardType }) =>
    trigger === 'cardPlayed' && cardType === 'power' ? { draw: 1 } : undefined,
  vitality_draught: ({ trigger }) => (trigger === 'battleStart' ? { currentHp: 3 } : undefined),
  memory_shard: (context) =>
    context.trigger === 'cardPlayed'
    && context.cardType === 'skill'
    && runtimeNumber(context, 'memoryShardTriggersThisTurn') < 2
      ? { nextCardCostReduction: 1 }
      : undefined,
  void_charm: ({ trigger }) =>
    trigger === 'cardDiscarded' ? { block: 1 } : undefined,
  waystone: ({ trigger, firstCardThisBattle }) =>
    trigger === 'cardPlayed' && firstCardThisBattle ? { forceZeroCost: true } : undefined,
  balanced_stance: ({ trigger, attackCountAfterPlay, skillCountAfterPlay }) =>
    trigger === 'cardPlayed'
    && attackCountAfterPlay !== undefined
    && attackCountAfterPlay === skillCountAfterPlay
      ? { draw: 1, block: 1 }
      : undefined,
  guard_momentum_link: (context) =>
    context.trigger === 'cardPlayed'
    && context.cardHasBlock
    && (context.cardType === 'skill' || context.cardType === 'power')
    && runtimeNumber(context, 'guardMomentumLinkCountThisTurn') < 2
      ? { momentum: 1 }
      : undefined,
  burst_defense_sync: ({ trigger, cardType, cardHasBlock, playedAttackThisTurn }) =>
    trigger === 'cardPlayed'
    && cardHasBlock
    && (cardType === 'skill' || cardType === 'power')
    && playedAttackThisTurn
      ? { cardBlockBonus: 3 }
      : undefined,
  cascade_relay: ({ trigger, cardTypeSequence }) => {
    const sequence = cardTypeSequence ?? [];
    const last = sequence.slice(-3);
    return trigger === 'cardPlayed' && last.length === 3 && new Set(last).size === 3
      ? { energy: 1 }
      : undefined;
  },
  echo_of_ancients: ({ trigger, cardType }) =>
    trigger === 'cardPlayed' && cardType === 'power' ? { momentum: 1, block: 2 } : undefined,
  momentum_guardian: ({ trigger, battle }) => {
    const player = battle?.units[battle.playerUnitId];
    const momentum = player ? getStatusStacks(player, STATUS_MOMENTUM) : 0;
    return trigger === 'turnEnd' && momentum >= 5 ? { block: momentum, retainBlock: 1 } : undefined;
  },
  dual_resonance: (context) =>
    context.trigger === 'blockGained' && runtimeNumber(context, 'momentumConsumedThisTurn') > 0
      ? { block: 3 }
      : undefined,
  blood_rite: ({ trigger }) => (trigger === 'lifeSpent' ? { momentum: 2 } : undefined),
  sentinel_oath: ({ trigger, damagePhase, wasFatal }) =>
    trigger === 'damageTaken' && isAfter({ trigger, relicId: 'sentinel_oath', damagePhase }) && wasFatal
      ? { preventDeath: true, block: 10 }
      : undefined,
  convergence: ({ trigger, battle, isPlayerAttack }) =>
    trigger === 'damageDealt'
    && isPlayerAttack
    && hasConvergenceState({ battle, trigger, relicId: 'convergence' })
      ? { damageBonus: 3 }
      : undefined,

  // ─── Generated Relics Batch 2 ──────────────────────────────────
  flow_regulator: ({ trigger }) => (trigger === 'turnStart' ? { momentum: 2 } : undefined),
  momentum_overflow: ({ trigger, remainingMomentum }) =>
    trigger === 'momentumGained' && (remainingMomentum ?? 0) > 10
      ? { momentumOverflow: (remainingMomentum ?? 0) - 10, block: (remainingMomentum ?? 0) - 10 }
      : undefined,
  tide_conductor: ({ trigger }) =>
    trigger === 'momentumConsumed' ? { skillBlockBonus: 2 } : undefined,
  momentum_crest: ({ trigger, isPlayerAttack, battle }) =>
    trigger === 'damageDealt'
    && isPlayerAttack
    && momentumOf({ battle, trigger, relicId: 'momentum_crest' }) >= 4
      ? { damageBonus: 2 }
      : undefined,
  surge_bloom: ({ trigger }) => (trigger === 'momentumConsumed' ? { primedBreak: 1 } : undefined),
  flow_resonance: (context) =>
    context.trigger === 'momentumGained'
    && runtimeNumber(context, 'flowResonanceTriggersThisTurn') < 2
    && (context.battle?.player.hand.some((id) => {
      const definitionId = context.battle?.player.cards[id]?.definitionId;
      return definitionId ? CARD_DEFINITIONS[definitionId]?.type === 'attack' : false;
    }) ?? false)
      ? { draw: 1 }
      : undefined,
  momentum_anchor: ({ trigger, battle }) =>
    trigger === 'turnEnd' && momentumOf({ battle, trigger, relicId: 'momentum_anchor' }) === 0
      ? { momentum: 2 }
      : undefined,
  tide_preserver: ({ trigger, statusId, amount }) =>
    trigger === 'statusReduced' && statusId === STATUS_MOMENTUM ? { momentumReduction: amount ?? 0 } : undefined,
  momentum_well: ({ trigger, cardType }) =>
    trigger === 'cardPlayed' && cardType === 'power' ? { momentum: 1 } : undefined,
  surge_siphon: ({ trigger, consumedStacks }) =>
    trigger === 'momentumConsumed' && (consumedStacks ?? 0) > 0 ? { block: consumedStacks } : undefined,
  fortification_rune: ({ trigger, currentBlock }) =>
    trigger === 'blockGained' && (currentBlock ?? 0) === 0 ? { block: 4 } : undefined,
  iron_veil: ({ trigger, damagePhase, battle }) =>
    trigger === 'damageTaken'
    && isAfter({ trigger, relicId: 'iron_veil', damagePhase })
    && !(battle?.relicRuntime?.ironVeilUsed)
      ? { block: 10 }
      : undefined,
  living_wall: ({ trigger, battle }) =>
    trigger === 'turnEnd'
    && !(battle?.relicRuntime?.playerWasAttackedThisTurn)
      ? { block: 3, retainBlock: 1 }
      : undefined,
  guardian_seal: (context) => {
    const player = playerOf(context);
    if (context.trigger !== 'damageTaken' || !player) return undefined;
    return getStatusStacks(player, STATUS_METALLICIZE) > 0
      ? { damageReduction: 1 }
      : undefined;
  },
  resonance_plating: ({ trigger }) => (trigger === 'cardExhausted' ? { block: 1 } : undefined),
  stalwart_core: ({ trigger }) =>
    trigger === 'battleStart' ? { metallicize: 1, block: 3 } : undefined,
  fortress_seal: ({ trigger, battle, isPlayerAttack }) =>
    trigger === 'damageDealt'
    && isPlayerAttack
    && currentBlock({ battle, trigger, relicId: 'fortress_seal' }) >= 15
      ? { damageBonus: 3 }
      : undefined,
  thorn_ward: ({ trigger, damagePhase, sourceUnitId, hpLoss }) =>
    trigger === 'damageTaken'
    && isAfter({ trigger, relicId: 'thorn_ward', damagePhase })
    && Boolean(sourceUnitId)
    && (hpLoss ?? 0) >= 0
      ? { extraDamage: 3 }
      : undefined,
  iron_shroud: ({ trigger }) =>
    trigger === 'battleStart' ? { block: 5, metallicize: 1 } : undefined,
  bulwark_heart: ({ trigger, consumedStacks }) =>
    trigger === 'momentumConsumed' && (consumedStacks ?? 0) > 0 ? { block: 2 } : undefined,
  eruption_core: ({ trigger, consumedStacks, consumedAll, momentumKind }) =>
    trigger === 'momentumConsumed' && consumedAll && momentumKind === 'damage'
      ? { damageBonus: consumedStacks ?? 0 }
      : undefined,
  blood_fang: ({ trigger, damagePhase, amount, isPlayerAttack }) =>
    trigger === 'damageDealt'
    && isAfter({ trigger, relicId: 'blood_fang', damagePhase })
    && isPlayerAttack
    && (amount ?? 0) >= 15
      ? { currentHp: 2 }
      : undefined,
  momentum_fury: ({ trigger }) =>
    trigger === 'momentumConsumed' ? { nextAttackBonus: 5 } : undefined,
  rage_engine: ({ trigger, damagePhase, hpLoss }) =>
    trigger === 'damageTaken' && isAfter({ trigger, relicId: 'rage_engine', damagePhase }) && (hpLoss ?? 0) > 0
      ? { turnAttackBonus: 2 }
      : undefined,
  executioner_blade: ({ trigger, damagePhase, targetUnitId, battle, isPlayerAttack }) => {
    const target = targetUnitId ? battle?.units[targetUnitId] : undefined;
    return trigger === 'damageDealt'
      && isBefore({ trigger, relicId: 'executioner_blade', damagePhase })
      && isPlayerAttack
      && target
      && target.hp < target.maxHp * 0.3
      ? { damageMultiplier: 1.5 }
      : undefined;
  },
  war_cry: ({ trigger }) => (trigger === 'battleStart' ? { damageAllEnemies: 3 } : undefined),
  critical_eye: ({ trigger, damagePhase, amount, isPlayerAttack }) =>
    trigger === 'damageDealt'
    && isAfter({ trigger, relicId: 'critical_eye', damagePhase })
    && isPlayerAttack
    && (amount ?? 0) >= 8
      ? { extraDamage: 3 }
      : undefined,
  surge_blade: ({ trigger, isMomentumAttack }) =>
    trigger === 'momentumCost' && isMomentumAttack ? { momentumCostReduction: 1 } : undefined,
  devastation_core: ({ trigger, damagePhase, targetAlive }) =>
    trigger === 'damageDealt'
    && isAfter({ trigger, relicId: 'devastation_core', damagePhase })
    && targetAlive === false
      ? { battleAttackBonus: 2 }
      : undefined,
  chain_lightning: ({ trigger, damagePhase, amount, isPlayerAttack, isSecondaryDamage }) =>
    trigger === 'damageDealt'
    && isAfter({ trigger, relicId: 'chain_lightning', damagePhase })
    && isPlayerAttack
    && !isSecondaryDamage
    && (amount ?? 0) >= 10
      ? { secondaryDamage: 3 }
      : undefined,
  explorer_charm: ({ trigger }) => (trigger === 'battleEnd' ? { goldBonus: 15 } : undefined),
  mystic_lens: ({ trigger }) => (trigger === 'battleStart' ? { openingHandDraw: 1 } : undefined),
  vitality_stone: ({ trigger }) => (trigger === 'pickup' ? { maxHp: 10, currentHp: 10 } : undefined),
  fortune_coin: ({ trigger }) =>
    trigger === 'battleEnd' ? { goldMin: 10, goldMax: 30 } : undefined,
  soul_echo: ({ trigger, cardType }) =>
    trigger === 'cardPlayed' && cardType === 'power' ? { energy: 1 } : undefined,
  quickdraw_glove: ({ trigger }) => (trigger === 'battleStart' ? { openingHandDraw: 1 } : undefined),
  meditation_stone: ({ trigger, cardType }) =>
    trigger === 'cardPlayed' && cardType === 'skill' ? { block: 1 } : undefined,
  rhythm_lock: ({ trigger, cardType, playedSkillThisTurn }) =>
    trigger === 'cardPlayed' && cardType === 'attack' && playedSkillThisTurn
      ? { cardDamageBonus: 3 }
      : undefined,
  duality_crest: ({ trigger, battle }) =>
    trigger === 'cardPlayed'
    && hasMomentumAndGuard({ battle, trigger, relicId: 'duality_crest' })
    && !(battle?.relicRuntime?.dualityCrestUsedThisTurn)
      ? { costReduction: 1 }
      : undefined,
  cycle_engine: (context) =>
    context.trigger === 'cardPlayed'
    && context.playedAttackThisTurn
    && context.playedSkillThisTurn
    && runtimeNumber(context, 'cycleEngineDrawsThisTurn') < 2
      ? { draw: 1 }
      : undefined,
  chain_bond: ({ trigger, cardTypeSequence }) => {
    const sequence = cardTypeSequence ?? [];
    const last = sequence.slice(-3);
    return trigger === 'cardPlayed'
      && last.length === 3
      && last[0] === last[1]
      && last[1] === last[2]
      ? { draw: 1 }
      : undefined;
  },
  synergy_core: ({ trigger, battle }) =>
    trigger === 'cardPlayed'
    && Boolean(battle?.playerGainedBlockThisTurn)
    && runtimeNumber({ battle, trigger, relicId: 'synergy_core' }, 'momentumConsumedThisTurn') > 0
      ? { draw: 1 }
      : undefined,
  balanced_force: ({ trigger, attackCountAfterPlay, skillCountAfterPlay }) =>
    trigger === 'cardPlayed'
    && attackCountAfterPlay !== undefined
    && attackCountAfterPlay === skillCountAfterPlay
      ? { cardDamageBonus: 2, cardBlockBonus: 2 }
      : undefined,
  dual_momentum: ({ trigger, battle, isPlayerAttack }) => {
    const player = battle?.units[battle.playerUnitId];
    const active = Boolean(
      player
      && getStatusStacks(player, STATUS_MOMENTUM) + getStatusStacks(player, STATUS_STEADY_GUARD) >= 5,
    );
    if (!active) return undefined;
    if (trigger === 'damageDealt' && isPlayerAttack) return { damageMultiplier: 1.5 };
    if (trigger === 'blockGained') return { blockMultiplier: 1.5 };
    return undefined;
  },
  echo_synergy: ({ trigger, battle }) =>
    trigger === 'blockGained'
    && runtimeNumber({ battle, trigger, relicId: 'echo_synergy' }, 'momentumConsumedThisTurn') > 0
      ? { block: 2 }
      : undefined,
  void_crown: ({ trigger }) => (trigger === 'battleStart' ? { strength: 2 } : undefined),
  entropy_seal: ({ trigger }) =>
    trigger === 'battleStart' ? { strength: 1, momentum: 1 } : undefined,
  oblivion_core: ({ trigger, targetAlive }) =>
    trigger === 'damageDealt' && targetAlive === false ? { damageAllEnemies: 4 } : undefined,
  abyssal_heart: ({ trigger }) =>
    trigger === 'lifeSpent' ? { turnAttackBonus: 4 } : undefined,
  time_fracture: ({ trigger, firstCardThisBattle }) =>
    trigger === 'cardPlayed' && firstCardThisBattle ? { forceZeroCost: true, draw: 1 } : undefined,

  // ─── Generated Relics Batch 3 ──────────────────────────────────
  momentum_seed: ({ trigger }) => (trigger === 'turnStart' ? { momentum: 1 } : undefined),
  surge_tide: (context) =>
    context.trigger === 'cardDrawn' && runtimeNumber(context, 'surgeTideDrawsThisTurn') < 3
      ? { momentum: 1 }
      : undefined,
  cascade_gem: ({ trigger, battle }) =>
    trigger === 'momentumCost' && Boolean(battle?.relicRuntime?.cascadeGemArmed)
      ? { momentumCostMultiplier: 2 }
      : undefined,
  momentum_siphon_b3: ({ trigger, consumedStacks }) =>
    trigger === 'momentumConsumed' && (consumedStacks ?? 0) > 0
      ? { currentHp: consumedStacks }
      : undefined,
  momentum_well_b3: (context) => {
    const player = playerOf(context);
    const start = runtimeNumber(context, 'battleStartMomentum');
    const current = player ? getStatusStacks(player, STATUS_MOMENTUM) : 0;
    return context.trigger === 'turnEnd' && start > 0 && current < start
      ? { momentum: start - current }
      : undefined;
  },
  endurance_surge: (context) =>
    context.trigger === 'momentumConsumed'
    && runtimeNumber(context, 'momentumConsumeCountThisTurn') > 0
    && runtimeNumber(context, 'momentumConsumeCountThisTurn') % 3 === 0
      ? { turnAttackBonus: 3 }
      : undefined,
  tide_reshaper: ({ trigger, firstConsumeThisTurn }) =>
    trigger === 'momentumConsumed' && firstConsumeThisTurn ? { primedBreak: 1 } : undefined,
  echo_crest: (context) =>
    context.trigger === 'turnEnd' && runtimeNumber(context, 'momentumConsumedThisTurn') > 0
      ? { block: Math.floor(runtimeNumber(context, 'momentumConsumedThisTurn') / 2) }
      : undefined,
  // 由 addRelicAwareStatusStacks 监听金属化阈值，避免把连势增长误当成金属化增长。
  stone_aegis: () => undefined,
  bulwark_plating: ({ trigger }) => (trigger === 'battleStart' ? { metallicize: 1 } : undefined),
  sanctuary_bell: (context) =>
    context.trigger === 'blockGained'
    && context.amount === 0
    && (context.battle?.playerTurnBlockGained ?? 0) >= 15
    && runtimeNumber(context, 'sanctuaryBellTriggersThisTurn') < 2
      ? { currentHp: 1 }
      : undefined,
  ironward_rune: ({ trigger }) => (trigger === 'turnEnd' ? undefined : undefined),
  fortress_ward: ({ trigger, battle }) =>
    trigger === 'turnStart' && (battle?.enemyUnitIds.length ?? 0) >= 2
      ? { block: 3 }
      : undefined,
  stalwart_mantle: ({ trigger, damagePhase, blockAbsorbed, hpLoss }) =>
    trigger === 'damageTaken'
    && isAfter({ trigger, relicId: 'stalwart_mantle', damagePhase })
    && (blockAbsorbed ?? 0) + (hpLoss ?? 0) > 0
      ? { nextAttackBonus: (blockAbsorbed ?? 0) > (hpLoss ?? 0) ? 3 : 0 }
      : undefined,
  rending_slash: ({ trigger, consumedStacks, momentumKind }) =>
    trigger === 'momentumConsumed'
    && momentumKind === 'damage'
    && (consumedStacks ?? 0) >= 5
      ? { damageBonus: 6 }
      : undefined,
  war_drums: ({ trigger }) => (trigger === 'battleStart' ? { strength: 1 } : undefined),
  bloodlust_fang: ({ trigger, damagePhase, targetAlive }) =>
    trigger === 'damageDealt'
    && isAfter({ trigger, relicId: 'bloodlust_fang', damagePhase })
    && targetAlive === false
      ? { currentHp: 5 }
      : undefined,
  crushing_blow: ({ trigger, damagePhase, targetUnitId, battle, isPlayerAttack }) => {
    const target = targetUnitId ? battle?.units[targetUnitId] : undefined;
    return trigger === 'damageDealt'
      && isBefore({ trigger, relicId: 'crushing_blow', damagePhase })
      && isPlayerAttack
      && target
      && getStatusStacks(target, STATUS_VULNERABLE) > 0
      ? { damageMultiplier: 1.5 }
      : undefined;
  },
  relentless_tide: ({ trigger, firstConsumeThisTurn }) =>
    trigger === 'momentumCost' && firstConsumeThisTurn ? { momentumCostMultiplier: 2 } : undefined,
  inferno_core: (context) =>
    context.trigger === 'damageDealt'
    && isBefore(context)
    && context.isPlayerAttack
      ? { damageBonus: Math.floor(runtimeNumber(context, 'momentumConsumedTotal') / 10) }
      : undefined,
  momentum_duelist: ({ trigger, damagePhase, isMomentumAttack, consumedStacks }) =>
    trigger === 'damageDealt'
    && isBefore({ trigger, relicId: 'momentum_duelist', damagePhase })
    && isMomentumAttack
    && (consumedStacks ?? 0) >= 3
      ? { damageMultiplier: 1.5 }
      : undefined,
  rune_pouch: ({ trigger }) => (trigger === 'turnStart' ? { draw: 1 } : undefined),
  verdant_vial: ({ trigger }) => (trigger === 'battleEnd' ? { currentHp: 3 } : undefined),
  tome_of_depths: ({ trigger }) => (trigger === 'pickup' ? { maxHp: 8, currentHp: 8 } : undefined),
  luck_charm: ({ trigger }) => (trigger === 'battleEnd' ? { upgradeRandomHand: true } : undefined),
  quickstep_boots: ({ trigger }) => (trigger === 'battleStart' ? { energy: 2 } : undefined),
  alternating_crest: ({ trigger, cardType, cardTypeSequence }) => {
    const last = (cardTypeSequence ?? []).slice(-3);
    return trigger === 'cardPlayed'
    && cardType === 'attack'
    && last.join(',') === 'attack,skill,attack'
      ? { draw: 1 }
      : undefined;
  },
  chain_bolt: ({ trigger, cardType, attackCountAfterPlay }) =>
    trigger === 'cardPlayed' && cardType === 'attack' && (attackCountAfterPlay ?? 0) === 4
      ? { cardDamageBonus: 8 }
      : undefined,
  draw_power_sigil: (context) =>
    context.trigger === 'cardDrawn'
    && runtimeNumber(context, 'drawPowerSigilTriggersThisTurn') < 5
      ? { block: getStatusStacks(playerOf(context)!, 'strength') }
      : undefined,
  abyssal_crown: ({ trigger, battle }) =>
    trigger === 'turnEnd'
    && (battle?.relicRuntime?.momentumConsumeCountThisTurn ?? 0) === 0
      ? { nextTurnDraw: 2, nextTurnPrimedBreak: 1 }
      : undefined,
  phoenix_heart: ({ trigger, damagePhase, wasFatal }) =>
    trigger === 'damageTaken' && isAfter({ trigger, relicId: 'phoenix_heart', damagePhase }) && wasFatal
      ? { preventDeath: true, strength: 5, momentum: 3 }
      : undefined,
  epoch_shard: () => undefined,
  void_engine: ({ trigger }) => {
    if (trigger === 'cardExhausted') return { nextCardCostReduction: 1 };
    if (trigger === 'turnEnd') return { maxHpLoss: 1 };
    return undefined;
  },
};

/** 当前可从普通池、Boss fallback 或事件结果进入的所有遗物。 */
export const RUNTIME_RELIC_IDS = Object.keys(RELIC_DEFINITIONS) as readonly string[];

const NUMERIC_RESULT_KEYS = [
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
  'cardDamageBonus',
  'cardBlockBonus',
  'damageAllEnemies',
  'extraDamage',
  'secondaryDamage',
  'damageReduction',
  'momentumCostReduction',
  'nextCardCostReduction',
  'maxHpLoss',
  'nextTurnDraw',
  'nextTurnPrimedBreak',
  'retainBlock',
  'momentumOverflow',
  'skillBlockBonus',
  'turnAttackBonus',
  'battleAttackBonus',
  'goldMin',
  'goldMax',
  'nextBattleMomentum',
] as const;

const MULTIPLICATIVE_RESULT_KEYS = ['damageMultiplier', 'blockMultiplier', 'momentumCostMultiplier'] as const;

export function ensureRelicRuntime(battle: BattleState): RelicRuntimeState {
  battle.relicRuntime ??= {};
  return battle.relicRuntime;
}

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
    for (const key of NUMERIC_RESULT_KEYS) {
      const value = next[key];
      if (typeof value === 'number') result[key] = (result[key] ?? 0) + value;
    }
    for (const key of MULTIPLICATIVE_RESULT_KEYS) {
      const value = next[key];
      if (typeof value === 'number') result[key] = (result[key] ?? 1) * value;
    }
    if (typeof next.reflectRatio === 'number') {
      result.reflectRatio = Math.max(result.reflectRatio ?? 0, next.reflectRatio);
    }
    if (typeof next.retainBlockRatio === 'number') {
      result.retainBlockRatio = Math.max(result.retainBlockRatio ?? 0, next.retainBlockRatio);
    }
    if (next.forceExhaustAttack) result.forceExhaustAttack = true;
    if (next.forceZeroCost) result.forceZeroCost = true;
    if (next.preventDeath) result.preventDeath = true;
    if (next.upgradeRandomHand) result.upgradeRandomHand = true;
    if (next.harmonyTriggered) result.harmonyTriggered = true;
  }
  return result;
}

export function applyRelicPickupHooks(run: RunState, relicId: string): void {
  const result = resolveRelicHooks([relicId], { run, trigger: 'pickup' });
  if (result.maxHp) run.player.maxHp += result.maxHp;
  if (result.currentHp) {
    run.player.currentHp = Math.max(1, Math.min(run.player.maxHp, run.player.currentHp + result.currentHp));
  }
}

/** 添加状态并处理依赖状态阈值的遗物效果。 */
export function addRelicAwareStatusStacks(
  battle: BattleState,
  targetUnitId: string,
  statusId: string,
  amount: number,
  events?: GameEvent[],
  relicIds: readonly string[] = battle.relicIds,
): void {
  const target = battle.units[targetUnitId];
  if (!target || amount <= 0) return;
  const previous = getStatusStacks(target, statusId);
  addStatusStacks(target, statusId, amount);
  const current = getStatusStacks(target, statusId);
  if (targetUnitId !== battle.playerUnitId || statusId !== STATUS_METALLICIZE || !relicIds.includes('stone_aegis')) return;
  const thresholdCrossings = Math.floor(current / 3) - Math.floor(previous / 3);
  if (thresholdCrossings <= 0) return;
  const block = thresholdCrossings * 2;
  target.block += block;
  battle.playerGainedBlockThisTurn = true;
  battle.playerTurnBlockGained += block;
  events?.push({ type: 'BLOCK_GAINED', unitId: battle.playerUnitId, value: block });
}

/** 将遗物返回的资源 / 状态增量应用到玩家；格挡、抽牌、伤害由各自系统结算。 */
export function applyRelicResourceResult(
  battle: BattleState,
  result: RelicHookResult,
  events?: GameEvent[],
): void {
  const player = battle.units[battle.playerUnitId];
  if (!player) return;

  const statusDeltas: Array<[string, number | undefined]> = [
    [STATUS_STRENGTH, result.strength],
    [STATUS_MOMENTUM, result.momentum],
    [STATUS_METALLICIZE, result.metallicize],
    [STATUS_STEADY_GUARD, result.steadyGuard],
    [STATUS_PRIMED_BREAK, result.primedBreak],
  ];
  for (const [statusId, delta] of statusDeltas) {
    if (delta && delta > 0) {
      addRelicAwareStatusStacks(battle, battle.playerUnitId, statusId, delta, events);
    }
  }
  if (result.currentHp) {
    player.hp = Math.max(1, Math.min(player.maxHp, player.hp + result.currentHp));
  }
  if (result.energy) {
    battle.player.energy = Math.max(0, battle.player.energy + result.energy);
    events?.push({
      type: 'ENERGY_CHANGED',
      unitId: battle.playerUnitId,
      value: battle.player.energy,
    });
  }
}

/** 增加连势并触发一次 momentumGained；Hook 返回的额外连势不会递归触发。 */
export function gainMomentumWithRelics(
  battle: BattleState,
  relicIds: readonly string[],
  amount: number,
  events?: GameEvent[],
): RelicHookResult {
  if (amount <= 0) return {};
  const player = battle.units[battle.playerUnitId];
  if (!player) return {};
  const previousMomentum = getStatusStacks(player, STATUS_MOMENTUM);
  addStatusStacks(player, STATUS_MOMENTUM, amount);
  const result = resolveRelicHooks(relicIds, {
    battle,
    trigger: 'momentumGained',
    amount,
    previousMomentum,
    remainingMomentum: getStatusStacks(player, STATUS_MOMENTUM),
    events,
  });
  if (result.momentum) addStatusStacks(player, STATUS_MOMENTUM, result.momentum);
  const runtime = ensureRelicRuntime(battle);
  if (result.draw && relicIds.includes('flow_resonance')) {
    runtime.flowResonanceTriggersThisTurn = runtimeNumber({ battle, trigger: 'momentumGained', relicId: 'flow_resonance' }, 'flowResonanceTriggersThisTurn') + 1;
  }
  if (result.draw && relicIds.includes('momentum_lens')) {
    runtime.momentumLensTriggers = runtimeNumber({ battle, trigger: 'momentumGained', relicId: 'momentum_lens' }, 'momentumLensTriggers') + 1;
  }
  return result;
}

export function hasRelicRuntimeHook(relicId: string): boolean {
  return typeof RELIC_HOOKS[relicId] === 'function' && Boolean(RELIC_DEFINITIONS[relicId]);
}

export function activeRelicPoolHasRuntimeHooks(): boolean {
  return COMMON_RELIC_POOL.every((relicId) => hasRelicRuntimeHook(relicId));
}
