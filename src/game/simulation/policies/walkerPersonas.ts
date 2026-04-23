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

function chooseFirst<T>(items: readonly T[]): T | null {
  return items[0] ?? null;
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

function estimateImmediateBlock(cardId: string): number {
  const def = CARD_DEFINITIONS[cardId];
  if (!def) return 0;
  return def.effects.reduce((sum, effect) => {
    if (effect.type === 'block' && effect.target === 'self') return sum + effect.value;
    if (effect.type === 'heal' && effect.target === 'self') return sum + effect.value;
    if (effect.type === 'apply_status' && effect.target === 'self') {
      if (effect.statusId === 'steady_guard') return sum + effect.stacks * 4;
      if (effect.statusId === 'metallicize') return sum + effect.stacks * 2;
    }
    return sum;
  }, 0);
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
  const targetHp = option.command.targetUnitId
    ? (ctx.battle.units[option.command.targetUnitId]?.hp ?? 999)
    : 999;
  switch (option.card.id) {
    case QUICK_RELEASE.id:
      return 3 + Math.min(momentum, 1) * 5 + (momentum > 0 ? primedBreak : 0);
    case FOLLOW_THROUGH.id:
      return 4 + Math.min(momentum, 2) * 3 + (momentum > 0 ? primedBreak : 0);
    case FULL_RELEASE.id:
      return 6 + momentum * 3 + (momentum > 0 ? primedBreak : 0);
    case 'burst_strike':
      return 4 + momentum * 3 + (momentum > 0 ? primedBreak : 0);
    case 'snap_strike':
      return 5 + Math.min(momentum, 2) * 4 + (momentum > 0 ? primedBreak : 0);
    case PATIENT_CUT.id:
      return 6;
    case 'strike':
      return 6;
    case 'bash':
      return 7;
    case 'cleave':
      return 8;
    default:
      return targetHp <= 6 && option.card.type === 'attack' ? 6 : 0;
  }
}

function estimateCardValue(ctx: SimulationBattleContext, option: SimulationPlayableCommand): number {
  const momentum = playerMomentum(ctx);
  const block = estimateImmediateBlock(option.card.id);
  const damage = estimateImmediateDamage(ctx, option);
  const draw = option.card.effects.reduce((sum, effect) => effect.type === 'draw' ? sum + effect.value : sum, 0);
  const energy = option.card.effects.reduce((sum, effect) => effect.type === 'gain_energy' ? sum + effect.value : sum, 0);
  const momentumGain = option.card.effects.reduce((sum, effect) => {
    if (effect.type === 'apply_status' && effect.statusId === STATUS_MOMENTUM) return sum + effect.stacks;
    return sum;
  }, 0);
  const setupBonus = option.card.id === BREAK_OPENING.id ? 3 : 0;
  const keepMomentumBonus = option.card.id === PATIENT_CUT.id ? momentum : 0;
  const lethalBonus = option.command.targetUnitId && damage >= (ctx.battle.units[option.command.targetUnitId]?.hp ?? 999) ? 12 : 0;
  return damage * 1.3 + block + draw * 2 + energy * 2.5 + momentumGain * 1.2 + setupBonus + keepMomentumBonus + lethalBonus;
}

function bestOption(
  ctx: SimulationBattleContext,
  predicate: (option: SimulationPlayableCommand) => boolean,
  scorer: (option: SimulationPlayableCommand) => number,
): SimulationPlayableCommand | null {
  const candidates = ctx.playableCommands.filter(predicate);
  if (candidates.length === 0) return null;
  return [...candidates].sort((a, b) => scorer(b) - scorer(a))[0] ?? null;
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
  const guardPotionSlot = findPotionSlot(ctx, STILLWATER_TONIC.id);
  if (guardPotionSlot >= 0 && momentum <= 1 && danger > 0) {
    return { type: 'USE_POTION', slotIndex: guardPotionSlot };
  }

  const lethal = bestOption(
    ctx,
    (option) => option.card.type === 'attack' && Boolean(option.command.targetUnitId),
    (option) => {
      const targetHp = option.command.targetUnitId
        ? (ctx.battle.units[option.command.targetUnitId]?.hp ?? 999)
        : 999;
      return estimateImmediateDamage(ctx, option) >= targetHp ? 1000 + targetHp : -1;
    },
  );
  if (lethal && estimateImmediateDamage(ctx, lethal) >= (lethal.command.targetUnitId ? (ctx.battle.units[lethal.command.targetUnitId]?.hp ?? 999) : 999)) {
    return lethal.command;
  }

  if (danger > 0) {
    const defense = bestOption(
      ctx,
      (option) => guardCards.has(option.card.id) || estimateImmediateBlock(option.card.id) > 0,
      (option) => estimateImmediateBlock(option.card.id) * 2 + estimateCardValue(ctx, option),
    );
    if (defense) return defense.command;
  }

  if (momentum <= 1) {
    const setup = bestOption(
      ctx,
      (option) => setupCards.has(option.card.id) || option.card.id === SURVEY_FIELD.id,
      (option) => estimateCardValue(ctx, option) + (guardCards.has(option.card.id) ? 2 : 0),
    );
    if (setup) return setup.command;
  }

  const keepMomentum = bestOption(
    ctx,
    (option) => option.card.id === PATIENT_CUT.id || option.card.id === SURVEY_FIELD.id || option.card.id === HELD_BREATH.id || option.card.id === ANCHORED_BREATH.id,
    (option) => estimateCardValue(ctx, option) + momentum,
  );
  if (keepMomentum) return keepMomentum.command;

  const anyPlayable = bestOption(ctx, () => true, (option) => estimateCardValue(ctx, option) - (burstCards.has(option.card.id) ? 4 : 0));
  return anyPlayable?.command ?? { type: 'END_TURN' };
}

function chooseBurstBattleCommand(ctx: SimulationBattleContext): GameCommand {
  const momentum = playerMomentum(ctx);
  const danger = dangerLevel(ctx);
  const burstPotionSlot = findPotionSlot(ctx, FLASH_POWDER.id);
  const hasPayoff = ctx.playableCommands.some((option) => burstCards.has(option.card.id));
  if (burstPotionSlot >= 0 && hasPayoff && momentum <= 1) {
    return { type: 'USE_POTION', slotIndex: burstPotionSlot };
  }

  const lethal = bestOption(
    ctx,
    (option) => option.card.type === 'attack' && Boolean(option.command.targetUnitId),
    (option) => {
      const targetHp = option.command.targetUnitId
        ? (ctx.battle.units[option.command.targetUnitId]?.hp ?? 999)
        : 999;
      const damage = estimateImmediateDamage(ctx, option);
      return damage >= targetHp ? 1000 + damage : damage;
    },
  );
  if (lethal && estimateImmediateDamage(ctx, lethal) >= (lethal.command.targetUnitId ? (ctx.battle.units[lethal.command.targetUnitId]?.hp ?? 999) : 999)) {
    return lethal.command;
  }

  if (momentum <= 1) {
    const setup = bestOption(
      ctx,
      (option) => option.card.id === BREAK_OPENING.id || option.card.id === PRIME_RHYTHM.id || option.card.id === SOFT_STEP.id || option.card.id === BRACE_RHYTHM.id,
      (option) => estimateCardValue(ctx, option) + (option.card.id === BREAK_OPENING.id ? 4 : 0),
    );
    if (setup) return setup.command;
  }

  if (momentum > 0) {
    const payoff = bestOption(
      ctx,
      (option) => burstCards.has(option.card.id),
      (option) => {
        const base = estimateImmediateDamage(ctx, option) + estimateCardValue(ctx, option);
        const isAllIn = option.card.id === FULL_RELEASE.id || option.card.id === 'burst_strike';
        return base + (danger > 0 && isAllIn ? 6 : 0);
      },
    );
    if (payoff) return payoff.command;
  }

  const anyPlayable = bestOption(ctx, () => true, (option) => estimateCardValue(ctx, option) + (burstCards.has(option.card.id) ? 2 : 0));
  return anyPlayable?.command ?? { type: 'END_TURN' };
}

function chooseMixedBattleCommand(ctx: SimulationBattleContext): GameCommand {
  const healingPotionSlot = findPotionSlot(ctx, 'healing_dew');
  if (healingPotionSlot >= 0 && playerHp(ctx) <= 14 && dangerLevel(ctx) > 0) {
    return { type: 'USE_POTION', slotIndex: healingPotionSlot };
  }
  const anyPlayable = bestOption(ctx, () => true, (option) => estimateCardValue(ctx, option));
  return anyPlayable?.command ?? { type: 'END_TURN' };
}

function createWalkerPersonaPolicy(id: PersonaId): SimulationPolicy {
  if (id === 'guard') {
    return {
      id: 'walker-guard',
      chooseBattleCommand: chooseGuardBattleCommand,
      chooseMapNode(ctx) {
        return chooseNodeByPriority(ctx, {
          boss: 0,
          battle: 1,
          shop: 2,
          rest: 3,
          elite: 4,
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
      id: 'walker-burst',
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
    id: 'walker-mixed',
    chooseBattleCommand: chooseMixedBattleCommand,
    chooseMapNode(ctx) {
      return chooseNodeByPriority(ctx, {
        boss: 0,
        battle: 1,
        elite: 2,
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
