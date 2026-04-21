import {
  DEFENSE_LINE_CARD_IDS,
  MOMENTUM_PAYOFF_CARD_IDS,
  MOMENTUM_SETUP_CARD_IDS,
} from "@/game/core/definitions/cards/starter";
import {
  BURST_ALTAR_EVENT_ID,
  PURGING_POOL_EVENT_ID,
  STILLNESS_SHRINE_EVENT_ID,
  WANDERING_MERCHANT_EVENT_ID,
} from "@/game/core/engine/generateBranchingFloor";
import { getStatusStacks } from "@/game/core/combat/statusCombat";
import { getCharacterDefinition } from "@/game/core/definitions/characters";
import { STATUS_MOMENTUM } from "@/game/core/definitions/statuses";
import type { GameCommand } from "@/game/core/commands/types";
import type {
  SimulationBattleContext,
  SimulationEventContext,
  SimulationMapContext,
  SimulationPolicy,
  SimulationRewardContext,
  SimulationShopContext,
} from "../types";

const setupCards = new Set<string>(MOMENTUM_SETUP_CARD_IDS);
const payoffCards = new Set<string>(MOMENTUM_PAYOFF_CARD_IDS);
const defenseCards = new Set<string>(DEFENSE_LINE_CARD_IDS);

function firstOrNull<T>(items: readonly T[]): T | null {
  return items[0] ?? null;
}

function branchMissingCoreCards(deck: string[], characterId: string): string[] {
  const character = getCharacterDefinition(characterId);
  const missing: string[] = [];
  for (const branch of character.buildBranches) {
    for (const cardId of branch.coreCardIds) {
      if (!deck.includes(cardId)) missing.push(cardId);
    }
  }
  return missing;
}

export const walkerMomentumPolicy: SimulationPolicy = {
  id: "walker-momentum",

  chooseBattleCommand(ctx: SimulationBattleContext): GameCommand {
    const player = ctx.battle.units[ctx.battle.playerUnitId];
    const momentumStacks = player
      ? getStatusStacks(player, STATUS_MOMENTUM)
      : 0;
    const danger = ctx.projectedIncomingDamage > player.block;
    const attack = ctx.playableCommands.find(
      (item) => item.card.type === "attack",
    );

    if (momentumStacks <= 0) {
      const setup = ctx.playableCommands.find((item) =>
        setupCards.has(item.card.id),
      );
      if (setup) return setup.command;
    }

    if (momentumStacks > 0 && danger) {
      const keepMomentum = ctx.playableCommands.find((item) =>
        defenseCards.has(item.card.id),
      );
      if (keepMomentum) return keepMomentum.command;
    }

    if (momentumStacks > 0) {
      const payoff = ctx.playableCommands.find((item) =>
        payoffCards.has(item.card.id),
      );
      if (payoff) return payoff.command;
    }

    if (attack) return attack.command;

    const setup = ctx.playableCommands.find((item) =>
      setupCards.has(item.card.id),
    );
    if (setup) return setup.command;

    const anyPlayable = firstOrNull(ctx.playableCommands);
    return anyPlayable?.command ?? { type: "END_TURN" };
  },

  chooseMapNode(ctx: SimulationMapContext): string {
    const priority: Record<string, number> = {
      boss: 0,
      battle: 1,
      elite: 2,
      shop: 3,
      rest: 4,
      event: 5,
      treasure: 6,
    };

    return [...ctx.nextNodes].sort((a, b) => {
      const diff = (priority[a.type] ?? 99) - (priority[b.type] ?? 99);
      if (diff !== 0) return diff;
      return a.y - b.y;
    })[0]!.id;
  },

  chooseReward(
    ctx: SimulationRewardContext,
  ): { type: "card"; definitionId: string } | { type: "gold" } {
    const missingCore = new Set(
      branchMissingCoreCards(ctx.run.masterDeck, ctx.run.meta.characterId),
    );
    const corePick = ctx.offeredCards.find((cardId) => missingCore.has(cardId));
    if (corePick) return { type: "card", definitionId: corePick };

    const setupPick = ctx.offeredCards.find((cardId) => setupCards.has(cardId));
    if (setupPick) return { type: "card", definitionId: setupPick };

    const payoffPick = ctx.offeredCards.find((cardId) =>
      payoffCards.has(cardId),
    );
    if (payoffPick) return { type: "card", definitionId: payoffPick };

    return { type: "card", definitionId: ctx.offeredCards[0]! };
  },

  chooseShopAction(
    ctx: SimulationShopContext,
  ): GameCommand | { type: "leave_shop" } {
    const character = getCharacterDefinition(ctx.run.meta.characterId);
    const missingRelic = character.buildBranches
      .map((branch) => branch.coreRelicId)
      .find((relicId) => !ctx.run.meta.relics.includes(relicId));

    if (missingRelic) {
      const relicOffer = ctx.shop.relics.find(
        (offer) =>
          offer.relicId === missingRelic && ctx.run.meta.gold >= offer.price,
      );
      if (relicOffer)
        return { type: "BUY_SHOP_RELIC", relicId: relicOffer.relicId };
    }

    const missingCore = new Set(
      branchMissingCoreCards(ctx.run.masterDeck, ctx.run.meta.characterId),
    );
    const coreCard = ctx.shop.cards.find(
      (offer) =>
        missingCore.has(offer.definitionId) && ctx.run.meta.gold >= offer.price,
    );
    if (coreCard)
      return { type: "BUY_SHOP_CARD", definitionId: coreCard.definitionId };

    const setupCard = ctx.shop.cards.find(
      (offer) =>
        setupCards.has(offer.definitionId) && ctx.run.meta.gold >= offer.price,
    );
    if (setupCard)
      return { type: "BUY_SHOP_CARD", definitionId: setupCard.definitionId };

    return { type: "leave_shop" };
  },

  chooseEventOption(ctx: SimulationEventContext): string {
    switch (ctx.eventId) {
      case WANDERING_MERCHANT_EVENT_ID:
        return ctx.availableOptionIds.includes("relic")
          ? "relic"
          : ctx.availableOptionIds.includes("gold")
            ? "gold"
            : ctx.availableOptionIds[0]!;
      case STILLNESS_SHRINE_EVENT_ID:
        return ctx.availableOptionIds.includes("guard_relic")
          ? "guard_relic"
          : ctx.availableOptionIds.includes("guard_card")
            ? "guard_card"
            : ctx.availableOptionIds[0]!;
      case BURST_ALTAR_EVENT_ID:
        return ctx.availableOptionIds.includes("burst_relic")
          ? "burst_relic"
          : ctx.availableOptionIds.includes("burst_card")
            ? "burst_card"
            : ctx.availableOptionIds[0]!;
      case PURGING_POOL_EVENT_ID:
        return ctx.availableOptionIds.includes("remove_strike")
          ? "remove_strike"
          : ctx.availableOptionIds.includes("remove_defend")
            ? "remove_defend"
            : ctx.availableOptionIds[0]!;
      default:
        return ctx.availableOptionIds[0]!;
    }
  },
};
