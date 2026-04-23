import {
  BURST_LINE_CARD_IDS,
  CARD_DEFINITIONS,
  DEFENSE_LINE_CARD_IDS,
  MOMENTUM_PAYOFF_CARD_IDS,
  MOMENTUM_SETUP_CARD_IDS,
  SURVEY_FIELD,
  MEASURED_REST,
  BREAK_OPENING,
  FULL_RELEASE,
  FOLLOW_THROUGH,
  QUICK_RELEASE,
  PATIENT_CUT,
  HELD_BREATH,
  ANCHORED_BREATH,
  PRIME_RHYTHM,
  BRACE_RHYTHM,
  SOFT_STEP,
} from '@/game/core/definitions/cards/starter';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
import { FLASH_POWDER, STILLWATER_TONIC } from '@/game/core/definitions/potions';
import { MOMENTUM_BURST_RELIC_IDS, MOMENTUM_STABILITY_RELIC_IDS } from '@/game/core/definitions/relics';
import { STATUS_MOMENTUM, STATUS_PRIMED_BREAK } from '@/game/core/definitions/statuses';
import { getStatusStacks } from '@/game/core/combat/statusCombat';
import type { GameCommand } from '@/game/core/commands/types';
import type { MomentumBurstDrawParams, MomentumGuardByStacksParams } from '@/game/core/model/card';
import type {
  SimulationBattleContext,
  SimulationMapContext,
  SimulationPlayableCommand,
  SimulationPolicy,
  SimulationRewardContext,
  SimulationShopContext,
} from '../types';

const guardCards = new Set<string>([
  ...DEFENSE_LINE_CARD_IDS,
  SURVEY_FIELD.id,
  MEASURED_REST.id,
]);
const burstCards = new Set<string>(BURST_LINE_CARD_IDS);
const setupCards = new Set<string>(MOMENTUM_SETUP_CARD_IDS);
const payoffCards = new Set<string>(MOMENTUM_PAYOFF_CARD_IDS);
const guardRelics = new Set<string>(MOMENTUM_STABILITY_RELIC_IDS);
const burstRelics = new Set<string>(MOMENTUM_BURST_RELIC_IDS);

type PersonaId = 'guard' | 'burst' | 'mixed';
type PersonaMode = 'default' | 'elite_priority';
type PersonaStyle = 'guard' | 'burst' | 'mixed';

type ScoredBattleOption = {
  option: SimulationPlayableCommand;
  damage: number;
  progressDamage: number;
  killWindowGain: number;
  block: number;
  safetyGain: number;
  setupGain: number;
  score: number;
  lethal: boolean;
  lowImpact: boolean;
};

function chooseFirst<T>(items: readonly T[]): T | null {
  return items[0] ?? null;
}

function asMomentumGuardParams(params: unknown): MomentumGuardByStacksParams | null {
  if (!params || typeof params !== 'object') return null;
  const candidate = params as Partial<MomentumGuardByStacksParams>;
  return typeof candidate.baseBlock === 'number' && typeof candidate.blockPerStack === 'number'
    ? candidate as MomentumGuardByStacksParams
    : null;
}

function asMomentumBurstDrawParams(params: unknown): MomentumBurstDrawParams | null {
  if (!params || typeof params !== 'object') return null;
  const candidate = params as Partial<MomentumBurstDrawParams>;
  const consumeModeOk = candidate.consumeMode === 'all' || candidate.consumeMode === 'fixed';
  return consumeModeOk
    && typeof candidate.baseDraw === 'number'
    && typeof candidate.drawPerStack === 'number'
    ? candidate as MomentumBurstDrawParams
    : null;
}

function playerMomentum(ctx: SimulationBattleContext): number {
  return getStatusStacks(ctx.battle.units[ctx.battle.playerUnitId], STATUS_MOMENTUM);
}

function playerPrimedBreak(ctx: SimulationBattleContext): number {
  return getStatusStacks(ctx.battle.units[ctx.battle.playerUnitId], STATUS_PRIMED_BREAK);
}

function playerHp(ctx: SimulationBattleContext): number {
  return ctx.battle.units[ctx.battle.playerUnitId]?.hp ?? ctx.run.player.currentHp;
}

function dangerLevel(ctx: SimulationBattleContext): number {
  const player = ctx.battle.units[ctx.battle.playerUnitId];
  if (!player) return 0;
  return Math.max(0, ctx.projectedIncomingDamage - player.block);
}

function aliveEnemies(ctx: SimulationBattleContext) {
  return ctx.battle.enemyUnitIds
    .map((unitId) => ctx.battle.units[unitId])
    .filter((unit): unit is NonNullable<typeof unit> => Boolean(unit?.alive));
}

function lowestEnemyEffectiveHp(ctx: SimulationBattleContext): number {
  const enemies = aliveEnemies(ctx);
  if (enemies.length === 0) return 0;
  return Math.min(...enemies.map((unit) => unit.hp + unit.block));
}

function estimateImmediateBlock(cardId: string): number {
  const def = CARD_DEFINITIONS[cardId];
  if (!def) return 0;
  const directBlock = def.effects.reduce((sum, effect) => {
    if (effect.type === 'block' && effect.target === 'self') return sum + effect.value;
    if (effect.type === 'heal' && effect.target === 'self') return sum + effect.value;
    if (effect.type === 'apply_status' && effect.target === 'self') {
      if (effect.statusId === 'steady_guard') return sum + effect.stacks * 4;
      if (effect.statusId === 'metallicize') return sum + effect.stacks * 2;
    }
    if (effect.type === 'custom' && effect.scriptId === 'momentum_guard_by_stacks') {
      const params = asMomentumGuardParams(effect.params);
      return sum + (params?.baseBlock ?? 0);
    }
    return sum;
  }, 0);
  const momentumBlock = def.cost === 0 ? 0 : 0;
  return directBlock + momentumBlock;
}

function scoreDefinitionId(definitionId: string): number {
  const def = CARD_DEFINITIONS[definitionId];
  if (!def) return 0;
  const block = estimateImmediateBlock(definitionId);
  const draw = def.effects.reduce((sum, effect) => effect.type === 'draw' ? sum + effect.value : sum, 0);
  const energy = def.effects.reduce((sum, effect) => effect.type === 'gain_energy' ? sum + effect.value : sum, 0);
  const momentumGain = def.effects.reduce((sum, effect) => {
    if (effect.type === 'apply_status' && effect.statusId === STATUS_MOMENTUM) return sum + effect.stacks;
    return sum;
  }, 0);
  const routeBonus = guardCards.has(definitionId) || burstCards.has(definitionId) || setupCards.has(definitionId) || payoffCards.has(definitionId) ? 3 : 0;
  const typeBonus = def.type === 'attack' ? 2 : def.type === 'skill' ? 1 : 0;
  return block + draw * 2 + energy * 2.5 + momentumGain * 1.5 + routeBonus + typeBonus;
}

function estimateImmediateDamage(ctx: SimulationBattleContext, option: SimulationPlayableCommand): number {
  const momentum = playerMomentum(ctx);
  const primedBreak = playerPrimedBreak(ctx) > 0 ? 4 : 0;
  const targetUnit = option.command.targetUnitId
    ? ctx.battle.units[option.command.targetUnitId]
    : null;
  const targetHp = targetUnit?.hp ?? 999;
  const targetBlock = targetUnit?.block ?? 0;
  const effectiveSingle = (rawDamage: number) => Math.max(0, rawDamage - targetBlock);
  const effectiveAll = (rawDamage: number) => aliveEnemies(ctx)
    .reduce((sum, enemy) => sum + Math.max(0, rawDamage - enemy.block), 0);
  switch (option.card.id) {
    case QUICK_RELEASE.id:
      return effectiveSingle(3 + Math.min(momentum, 1) * 5 + (momentum > 0 ? primedBreak : 0));
    case FOLLOW_THROUGH.id:
      return effectiveSingle(4 + Math.min(momentum, 2) * 3 + (momentum > 0 ? primedBreak : 0));
    case FULL_RELEASE.id:
      return effectiveSingle(6 + momentum * 3 + (momentum > 0 ? primedBreak : 0));
    case 'burst_strike':
      return effectiveSingle(4 + momentum * 3 + (momentum > 0 ? primedBreak : 0));
    case 'snap_strike':
      return effectiveSingle(5 + Math.min(momentum, 2) * 4 + (momentum > 0 ? primedBreak : 0));
    case PATIENT_CUT.id:
      return effectiveSingle(6);
    case 'strike':
      return effectiveSingle(6);
    case 'bash':
      return effectiveSingle(7);
    case 'cleave':
      return effectiveAll(8);
    default:
      return targetHp + targetBlock <= 6 && option.card.type === 'attack' ? effectiveSingle(6) : 0;
  }
}

function estimateProgressDamage(ctx: SimulationBattleContext, option: SimulationPlayableCommand): number {
  const momentum = playerMomentum(ctx);
  const primedBreak = playerPrimedBreak(ctx) > 0 ? 4 : 0;
  const targetUnit = option.command.targetUnitId
    ? ctx.battle.units[option.command.targetUnitId]
    : null;
  const targetEffectiveHp = targetUnit ? targetUnit.hp + targetUnit.block : 999;
  const progressSingle = (rawDamage: number) => Math.max(0, Math.min(rawDamage, targetEffectiveHp));
  const progressAll = (rawDamage: number) => aliveEnemies(ctx)
    .reduce((sum, enemy) => sum + Math.max(0, Math.min(rawDamage, enemy.hp + enemy.block)), 0);

  switch (option.card.id) {
    case QUICK_RELEASE.id:
      return progressSingle(3 + Math.min(momentum, 1) * 5 + (momentum > 0 ? primedBreak : 0));
    case FOLLOW_THROUGH.id:
      return progressSingle(4 + Math.min(momentum, 2) * 3 + (momentum > 0 ? primedBreak : 0));
    case FULL_RELEASE.id:
      return progressSingle(6 + momentum * 3 + (momentum > 0 ? primedBreak : 0));
    case 'burst_strike':
      return progressSingle(4 + momentum * 3 + (momentum > 0 ? primedBreak : 0));
    case 'snap_strike':
      return progressSingle(5 + Math.min(momentum, 2) * 4 + (momentum > 0 ? primedBreak : 0));
    case PATIENT_CUT.id:
      return progressSingle(6);
    case 'strike':
      return progressSingle(6);
    case 'bash':
      return progressSingle(7);
    case 'cleave':
      return progressAll(8);
    default:
      return option.card.type === 'attack' ? progressSingle(6) : 0;
  }
}

function estimateSetupValue(ctx: SimulationBattleContext, option: SimulationPlayableCommand): number {
  const momentum = playerMomentum(ctx);
  const hasBurstPayoff = ctx.playableCommands.some((item) => burstCards.has(item.card.id));
  return option.card.effects.reduce((sum, effect) => {
    if (effect.type === 'draw') return sum + effect.value * 1.6;
    if (effect.type === 'gain_energy') return sum + effect.value * 2.5;
    if (effect.type === 'apply_status') {
      if (effect.statusId === STATUS_MOMENTUM) {
        return sum + effect.stacks * (momentum <= 1 ? 2.4 : 0.8);
      }
      if (effect.statusId === 'steady_guard') {
        return sum + effect.stacks * (ctx.battle.playerConsumedMomentumThisTurn ? 1.5 : 4.2);
      }
      if (effect.statusId === 'metallicize') return sum + effect.stacks * 3;
      if (effect.statusId === STATUS_PRIMED_BREAK) {
        return sum + effect.stacks * (hasBurstPayoff ? 4.5 : 1.5);
      }
      if (effect.statusId === 'strength' || effect.statusId === 'vulnerable') {
        return sum + effect.stacks * 2;
      }
    }
    if (effect.type === 'custom' && effect.scriptId === 'momentum_burst_draw') {
      const params = asMomentumBurstDrawParams(effect.params);
      if (!params) return sum;
      const consumed = params.consumeMode === 'all'
        ? momentum
        : Math.min(momentum, params.consumeValue ?? 0);
      return sum + params.baseDraw * 1.5 + consumed * params.drawPerStack * 1.8;
    }
    return sum;
  }, 0);
}

function evaluateBattleOption(
  ctx: SimulationBattleContext,
  option: SimulationPlayableCommand,
  persona: PersonaStyle,
): ScoredBattleOption {
  const danger = dangerLevel(ctx);
  const damage = estimateImmediateDamage(ctx, option);
  const progressDamage = estimateProgressDamage(ctx, option);
  const block = estimateImmediateBlock(option.card.id);
  const hasFollowupBurstPayoff = ctx.playableCommands.some(
    (item) => burstCards.has(item.card.id) && item.card.id !== option.card.id,
  );
  const targetUnit = option.command.targetUnitId
    ? ctx.battle.units[option.command.targetUnitId]
    : null;
  const targetHp = targetUnit?.hp ?? 999;
  const targetEffectiveHp = targetUnit ? targetUnit.hp + targetUnit.block : 999;
  const lethal = Boolean(option.command.targetUnitId) && damage >= targetHp;
  const safetyGain = danger > 0 ? Math.min(danger, block) : 0;
  const setupGain = estimateSetupValue(ctx, option);
  const killWindowGain = progressDamage > 0
    ? Math.max(0, Math.min(6, (lowestEnemyEffectiveHp(ctx) - Math.max(0, lowestEnemyEffectiveHp(ctx) - progressDamage)) / 2))
    : 0;
  let score = progressDamage * 1.6 + killWindowGain * 2 + safetyGain * 1.8 + setupGain + (lethal ? 14 : 0);

  if (persona === 'guard') {
    score += guardCards.has(option.card.id) ? 2 : 0;
    score += option.card.id === PATIENT_CUT.id ? playerMomentum(ctx) : 0;
    if (ctx.stagnantCombatSteps >= 2 && progressDamage > 0) score += progressDamage * 0.8 + killWindowGain;
    if (ctx.stagnantCombatSteps >= 2 && damage === 0 && safetyGain === 0 && setupGain < 5) score -= 8;
  }
  if (persona === 'burst') {
    score += burstCards.has(option.card.id) ? 2.5 : 0;
    score += option.card.id === BREAK_OPENING.id ? 2 : 0;
  }
  if (persona === 'mixed') {
    score += option.card.type === 'attack' ? 1.5 : 0;
    if (ctx.stagnantCombatSteps >= 2 && progressDamage > 0) score += progressDamage + killWindowGain * 1.5;
    if (damage === 0 && safetyGain === 0 && setupGain < 8) score -= 6;
  }

  if (danger === 0 && damage === 0 && block > 0 && setupGain < 2.5) score -= 6;
  if (damage === 0 && safetyGain === 0 && setupGain < 2.5) score -= 8;
  if (setupCards.has(option.card.id) && playerMomentum(ctx) >= 3 && damage === 0) score -= 5;
  if (option.card.id === BREAK_OPENING.id && !hasFollowupBurstPayoff) score -= 5;
  if (option.command.targetUnitId && targetEffectiveHp > 0 && progressDamage > 0 && progressDamage < Math.ceil(targetEffectiveHp / 3) && ctx.stagnantCombatSteps >= 2) score -= 3;
  if (ctx.stagnantCombatSteps >= 4 && damage === 0 && safetyGain < 3 && setupGain < 3.5) score -= 8;
  if (ctx.stagnantCombatSteps >= 4 && option.card.id === BREAK_OPENING.id && !hasFollowupBurstPayoff) score -= 8;
  if (ctx.stagnantBattleStateSteps >= 2 && damage < 4 && safetyGain < 3 && setupGain < 3.5) score -= 4;
  if (persona === 'mixed' && damage === 0 && safetyGain === 0 && setupGain < 7) score -= 3;

  return {
    option,
    damage,
    progressDamage,
    killWindowGain,
    block,
    safetyGain,
    setupGain,
    score,
    lethal,
    lowImpact: !lethal && progressDamage < 5 && safetyGain < 4 && setupGain < 3.5,
  };
}

function evaluateBattleOptions(
  ctx: SimulationBattleContext,
  persona: PersonaStyle,
): ScoredBattleOption[] {
  return ctx.playableCommands
    .map((option) => evaluateBattleOption(ctx, option, persona))
    .sort((a, b) => b.score - a.score);
}

function bestEvaluatedOption(
  options: ScoredBattleOption[],
  predicate: (option: ScoredBattleOption) => boolean,
  scorer?: (option: ScoredBattleOption) => number,
): ScoredBattleOption | null {
  const candidates = options.filter(predicate);
  if (candidates.length === 0) return null;
  if (!scorer) return candidates[0] ?? null;
  return [...candidates].sort((a, b) => scorer(b) - scorer(a))[0] ?? null;
}

function shouldEndTurn(
  ctx: SimulationBattleContext,
  options: ScoredBattleOption[],
  persona: PersonaStyle,
): boolean {
  const best = options[0];
  if (!best) return true;
  if (best.lethal) return false;

  const danger = dangerLevel(ctx);
  const usefulCount = options.filter((option) => !option.lowImpact).length;
  const damagingChoices = options.filter((option) => option.progressDamage > 0);
  const bestImprovesSafety = best.safetyGain >= Math.min(4, Math.max(1, danger));
  const bestImprovesSetup = best.setupGain >= 4;
  const bestImprovesKillWindow = best.killWindowGain >= 2 || best.progressDamage >= Math.max(4, Math.ceil(lowestEnemyEffectiveHp(ctx) / 2));

  if (persona === 'burst') {
    if (ctx.stagnantCombatSteps >= 8 && damagingChoices.length === 0 && best.setupGain < 5) return true;
    return false;
  }

  if (ctx.stagnantCombatSteps >= 6 && best.lowImpact) return true;
  if (ctx.stagnantBattleStateSteps >= 3 && best.score < 7) return true;
  if (danger <= 0 && usefulCount === 0) return true;
  if (danger <= 0 && ctx.stagnantCombatSteps >= 4 && best.progressDamage === 0 && best.setupGain < 7) return true;
  if (danger <= 0 && ctx.battle.playerCardsPlayedThisTurn >= 2 && best.score < 6) return true;
  if (danger > 0 && !bestImprovesSafety && best.progressDamage < 5 && !bestImprovesSetup && usefulCount <= 1) return true;
  if (ctx.stagnantCombatSteps >= 2 && damagingChoices.length === 0 && best.setupGain < 6 && best.safetyGain < 4) return true;
  if (persona === 'guard' && ctx.stagnantCombatSteps >= 2 && !bestImprovesSafety && !bestImprovesKillWindow && best.setupGain < 6) return true;
  if (persona === 'mixed' && danger <= 0 && !bestImprovesKillWindow && best.setupGain < 8) return true;

  return false;
}

function findPotionSlot(ctx: SimulationBattleContext, potionId: string): number {
  return ctx.run.meta.potions.findIndex((id) => id === potionId);
}

function chooseNodeByPriority(ctx: SimulationMapContext, priority: Record<string, number>): string {
  return [...ctx.nextNodes]
    .sort((a, b) => {
      const diff = (priority[a.type] ?? 99) - (priority[b.type] ?? 99);
      if (diff !== 0) return diff;
      return a.y - b.y;
    })[0]!.id;
}

function chooseRouteReward(
  ctx: SimulationRewardContext,
  favoredCards: Set<string>,
  secondaryCards: Set<string>,
): { type: 'card'; definitionId: string } | { type: 'gold' } {
  const character = getCharacterDefinition(ctx.run.meta.characterId);
  const branch = character.buildBranches.find((item) =>
    item.coreCardIds.every((cardId) => favoredCards.has(cardId) || secondaryCards.has(cardId)),
  );
  const missingCore = branch?.coreCardIds.find((cardId) => !ctx.run.masterDeck.includes(cardId));
  if (missingCore && ctx.offeredCards.includes(missingCore)) {
    return { type: 'card', definitionId: missingCore };
  }

  const favored = ctx.offeredCards.find((cardId) => favoredCards.has(cardId));
  if (favored) return { type: 'card', definitionId: favored };

  const secondary = ctx.offeredCards.find((cardId) => secondaryCards.has(cardId));
  if (secondary) return { type: 'card', definitionId: secondary };

  return { type: 'gold' };
}

function chooseRouteShopAction(
  ctx: SimulationShopContext,
  favoredCards: Set<string>,
  secondaryCards: Set<string>,
  favoredRelics: Set<string>,
  favoredPotionId: string,
): GameCommand | { type: 'leave_shop' } {
  const character = getCharacterDefinition(ctx.run.meta.characterId);
  const favoredBranch = character.buildBranches.find((branch) => favoredRelics.has(branch.coreRelicId));
  if (favoredBranch && !ctx.run.meta.relics.includes(favoredBranch.coreRelicId)) {
    const relic = ctx.shop.relics.find(
      (offer) => offer.relicId === favoredBranch.coreRelicId && offer.price <= ctx.run.meta.gold,
    );
    if (relic) return { type: 'BUY_SHOP_RELIC', relicId: relic.relicId };
  }

  const missingCore = favoredBranch?.coreCardIds.find((cardId) => !ctx.run.masterDeck.includes(cardId));
  if (missingCore) {
    const card = ctx.shop.cards.find(
      (offer) => offer.definitionId === missingCore && offer.price <= ctx.run.meta.gold,
    );
    if (card) return { type: 'BUY_SHOP_CARD', definitionId: card.definitionId };
  }

  const favored = ctx.shop.cards.find(
    (offer) => favoredCards.has(offer.definitionId) && offer.price <= ctx.run.meta.gold,
  );
  if (favored) return { type: 'BUY_SHOP_CARD', definitionId: favored.definitionId };

  const secondary = ctx.shop.cards.find(
    (offer) => secondaryCards.has(offer.definitionId) && offer.price <= ctx.run.meta.gold,
  );
  if (secondary) return { type: 'BUY_SHOP_CARD', definitionId: secondary.definitionId };

  const potion = ctx.shop.potions.find(
    (offer) => offer.potionId === favoredPotionId && offer.price <= ctx.run.meta.gold,
  );
  if (potion) return { type: 'BUY_SHOP_POTION', potionId: potion.potionId };

  return { type: 'leave_shop' };
}

function chooseGuardBattleCommand(ctx: SimulationBattleContext): GameCommand {
  const momentum = playerMomentum(ctx);
  const danger = dangerLevel(ctx);
  const options = evaluateBattleOptions(ctx, 'guard');
  const pressureTurn = ctx.battle.turn >= 8 || ctx.stagnantCombatSteps >= 2;
  const guardPotionSlot = findPotionSlot(ctx, STILLWATER_TONIC.id);
  if (guardPotionSlot >= 0 && momentum <= 1 && danger > 0) {
    return { type: 'USE_POTION', slotIndex: guardPotionSlot };
  }

  const lethal = bestEvaluatedOption(
    options,
    (option) => option.option.card.type === 'attack' && option.lethal,
    (option) => option.score,
  );
  if (lethal) return lethal.option.command;

  const pressureOption = bestEvaluatedOption(
    options,
    (option) => option.progressDamage > 0 || option.killWindowGain > 0,
    (option) => option.progressDamage * 2.4 + option.killWindowGain * 3 + option.score,
  );
  if (
    pressureTurn
    && pressureOption
    && (
      danger <= pressureOption.safetyGain + 4
      || playerHp(ctx) >= Math.max(18, danger * 2)
      || pressureOption.progressDamage >= Math.ceil(lowestEnemyEffectiveHp(ctx) / 3)
    )
  ) {
    return pressureOption.option.command;
  }

  if (danger > 0) {
    const defense = bestEvaluatedOption(
      options,
      (option) => guardCards.has(option.option.card.id) || option.block > 0,
      (option) => option.safetyGain * 3 + option.setupGain + option.score,
    );
    if (
      defense
      && defense.score >= 5
      && (
        !pressureTurn
        || !pressureOption
        || defense.safetyGain >= Math.max(4, danger - 2)
        || defense.score >= pressureOption.score + 4
      )
    ) {
      return defense.option.command;
    }
  }

  if (momentum <= 1) {
    const setup = bestEvaluatedOption(
      options,
      (option) => setupCards.has(option.option.card.id) || option.option.card.id === SURVEY_FIELD.id,
      (option) => option.setupGain * 2 + option.score,
    );
    if (setup && setup.score >= 5) return setup.option.command;
  }

  const keepMomentum = bestEvaluatedOption(
    options,
    (option) => option.option.card.id === PATIENT_CUT.id || option.option.card.id === SURVEY_FIELD.id || option.option.card.id === HELD_BREATH.id || option.option.card.id === ANCHORED_BREATH.id,
    (option) => option.setupGain + option.safetyGain + option.score + momentum,
  );
  if (
    keepMomentum
    && keepMomentum.score >= 4.5
    && (!pressureTurn || !pressureOption || keepMomentum.score >= pressureOption.score + 2)
  ) {
    return keepMomentum.option.command;
  }

  if (shouldEndTurn(ctx, options, 'guard')) return { type: 'END_TURN' };

  const anyPlayable = bestEvaluatedOption(
    options,
    () => true,
    (option) => option.score - (burstCards.has(option.option.card.id) ? 4 : 0),
  );
  return anyPlayable?.option.command ?? { type: 'END_TURN' };
}

function chooseBurstBattleCommand(ctx: SimulationBattleContext): GameCommand {
  const momentum = playerMomentum(ctx);
  const danger = dangerLevel(ctx);
  const options = evaluateBattleOptions(ctx, 'burst');
  const burstPotionSlot = findPotionSlot(ctx, FLASH_POWDER.id);
  const hasPayoff = ctx.playableCommands.some((option) => burstCards.has(option.card.id));
  if (burstPotionSlot >= 0 && hasPayoff && momentum <= 1) {
    return { type: 'USE_POTION', slotIndex: burstPotionSlot };
  }

  const lethal = bestEvaluatedOption(
    options,
    (option) => option.option.card.type === 'attack' && option.lethal,
    (option) => option.score,
  );
  if (lethal) return lethal.option.command;

  if (momentum <= 1) {
    const setup = bestEvaluatedOption(
      options,
      (option) => option.option.card.id === BREAK_OPENING.id || option.option.card.id === PRIME_RHYTHM.id || option.option.card.id === SOFT_STEP.id || option.option.card.id === BRACE_RHYTHM.id,
      (option) => option.setupGain * 2 + option.score + (option.option.card.id === BREAK_OPENING.id ? 2 : 0),
    );
    if (setup && setup.score >= 4.5) return setup.option.command;
  }

  if (momentum > 0) {
    const payoff = bestEvaluatedOption(
      options,
      (option) => burstCards.has(option.option.card.id),
      (option) => {
        const base = option.damage * 2 + option.score;
        const isAllIn = option.option.card.id === FULL_RELEASE.id || option.option.card.id === 'burst_strike';
        return base + (danger > 0 && isAllIn ? 6 : 0);
      },
    );
    if (payoff && payoff.score >= 4) return payoff.option.command;
  }

  if (shouldEndTurn(ctx, options, 'burst')) return { type: 'END_TURN' };

  const anyPlayable = bestEvaluatedOption(
    options,
    () => true,
    (option) => option.score + (burstCards.has(option.option.card.id) ? 2 : 0),
  );
  return anyPlayable?.option.command ?? { type: 'END_TURN' };
}

function chooseMixedBattleCommand(ctx: SimulationBattleContext): GameCommand {
  const options = evaluateBattleOptions(ctx, 'mixed');
  const healingPotionSlot = findPotionSlot(ctx, 'healing_dew');
  if (healingPotionSlot >= 0 && playerHp(ctx) <= 14 && dangerLevel(ctx) > 0) {
    return { type: 'USE_POTION', slotIndex: healingPotionSlot };
  }
  if (shouldEndTurn(ctx, options, 'mixed')) return { type: 'END_TURN' };
  const anyPlayable = bestEvaluatedOption(options, () => true, (option) => option.score);
  return anyPlayable?.option.command ?? { type: 'END_TURN' };
}

function createWalkerPersonaPolicy(id: PersonaId, mode: PersonaMode = 'default'): SimulationPolicy {
  const preferElite = mode === 'elite_priority';
  const policyId = preferElite ? `walker-${id}-elite` : `walker-${id}`;
  if (id === 'guard') {
    return {
      id: policyId,
      chooseBattleCommand: chooseGuardBattleCommand,
      chooseMapNode(ctx) {
        return chooseNodeByPriority(ctx, {
          boss: 0,
          ...(preferElite
            ? { elite: 1, battle: 2, shop: 3, rest: 4 }
            : { battle: 1, shop: 2, rest: 3, elite: 4 }),
          event: 5,
          treasure: 6,
        });
      },
      chooseReward(ctx) {
        return chooseRouteReward(ctx, guardCards, setupCards);
      },
      chooseShopAction(ctx) {
        return chooseRouteShopAction(
          ctx,
          guardCards,
          setupCards,
          guardRelics,
          STILLWATER_TONIC.id,
        );
      },
      chooseEventOption(ctx) {
        if (ctx.eventId === 'stillness_shrine') {
          if (ctx.availableOptionIds.includes('guard_relic')) return 'guard_relic';
          if (ctx.availableOptionIds.includes('guard_card')) return 'guard_card';
        }
        if (ctx.availableOptionIds.includes('gold')) return 'gold';
        return ctx.availableOptionIds[0]!;
      },
    };
  }

  if (id === 'burst') {
    return {
      id: policyId,
      chooseBattleCommand: chooseBurstBattleCommand,
      chooseMapNode(ctx) {
        return chooseNodeByPriority(ctx, {
          boss: 0,
          elite: 1,
          battle: 2,
          shop: 3,
          event: 4,
          rest: 5,
          treasure: 6,
        });
      },
      chooseReward(ctx) {
        return chooseRouteReward(ctx, burstCards, setupCards);
      },
      chooseShopAction(ctx) {
        return chooseRouteShopAction(
          ctx,
          burstCards,
          setupCards,
          burstRelics,
          FLASH_POWDER.id,
        );
      },
      chooseEventOption(ctx) {
        if (ctx.eventId === 'burst_altar') {
          if (ctx.availableOptionIds.includes('burst_relic')) return 'burst_relic';
          if (ctx.availableOptionIds.includes('burst_card')) return 'burst_card';
        }
        if (ctx.availableOptionIds.includes('relic')) return 'relic';
        return ctx.availableOptionIds[0]!;
      },
    };
  }

  return {
    id: policyId,
    chooseBattleCommand: chooseMixedBattleCommand,
    chooseMapNode(ctx) {
      return chooseNodeByPriority(ctx, {
        boss: 0,
        ...(preferElite
          ? { elite: 1, battle: 2 }
          : { battle: 1, elite: 2 }),
        shop: 3,
        event: 4,
        rest: 5,
        treasure: 6,
      });
    },
    chooseReward(ctx) {
      const scored = ctx.offeredCards
        .map((cardId) => ({ cardId, score: scoreDefinitionId(cardId) }))
        .sort((a, b) => b.score - a.score);
      const pick = scored[0];
      if (!pick || pick.score < 3) return { type: 'gold' };
      return { type: 'card', definitionId: pick.cardId };
    },
    chooseShopAction(ctx) {
      const bestRelic = [...ctx.shop.relics]
        .filter((offer) => offer.price <= ctx.run.meta.gold)
        .sort((a, b) => Number(burstRelics.has(b.relicId) || guardRelics.has(b.relicId)) - Number(burstRelics.has(a.relicId) || guardRelics.has(a.relicId)))[0];
      if (bestRelic && (burstRelics.has(bestRelic.relicId) || guardRelics.has(bestRelic.relicId))) {
        return { type: 'BUY_SHOP_RELIC', relicId: bestRelic.relicId };
      }

      const bestCard = [...ctx.shop.cards]
        .filter((offer) => offer.price <= ctx.run.meta.gold)
        .sort((a, b) => {
          const scoreA = (guardCards.has(a.definitionId) || burstCards.has(a.definitionId) || setupCards.has(a.definitionId) || payoffCards.has(a.definitionId)) ? 1 : 0;
          const scoreB = (guardCards.has(b.definitionId) || burstCards.has(b.definitionId) || setupCards.has(b.definitionId) || payoffCards.has(b.definitionId)) ? 1 : 0;
          return scoreB - scoreA || a.price - b.price;
        })[0];
      if (bestCard && (guardCards.has(bestCard.definitionId) || burstCards.has(bestCard.definitionId) || setupCards.has(bestCard.definitionId) || payoffCards.has(bestCard.definitionId))) {
        return { type: 'BUY_SHOP_CARD', definitionId: bestCard.definitionId };
      }

      const potion = ctx.shop.potions.find((offer) => offer.price <= ctx.run.meta.gold && offer.potionId !== 'healing_dew');
      if (potion) return { type: 'BUY_SHOP_POTION', potionId: potion.potionId };

      return { type: 'leave_shop' };
    },
    chooseEventOption(ctx) {
      if (ctx.availableOptionIds.includes('relic')) return 'relic';
      if (ctx.availableOptionIds.includes('gold')) return 'gold';
      return chooseFirst(ctx.availableOptionIds) ?? 'leave';
    },
  };
}

export const walkerGuardPolicy = createWalkerPersonaPolicy('guard');
export const walkerBurstPolicy = createWalkerPersonaPolicy('burst');
export const walkerMixedPolicy = createWalkerPersonaPolicy('mixed');
export const walkerGuardElitePolicy = createWalkerPersonaPolicy('guard', 'elite_priority');
export const walkerBurstElitePolicy = createWalkerPersonaPolicy('burst', 'elite_priority');
export const walkerMixedElitePolicy = createWalkerPersonaPolicy('mixed', 'elite_priority');

export const walkerBasePolicies = [walkerGuardPolicy, walkerBurstPolicy, walkerMixedPolicy] as const;
export const walkerElitePriorityPolicies = [
  walkerGuardElitePolicy,
  walkerBurstElitePolicy,
  walkerMixedElitePolicy,
] as const;
