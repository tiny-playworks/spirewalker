import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
import type { GameCommand } from '@/game/core/commands/types';
import type {
  SimulationBattleContext,
  SimulationEventContext,
  SimulationMapContext,
  SimulationPolicy,
  SimulationRewardContext,
  SimulationShopContext,
} from '../types';

function estimatedBlock(definitionId: string): number {
  const def = CARD_DEFINITIONS[definitionId];
  if (!def) return 0;
  return def.effects.reduce((sum, effect) => {
    if (effect.type === 'block' && effect.target === 'self') return sum + effect.value;
    if (effect.type === 'heal' && effect.target === 'self') return sum + effect.value;
    if (effect.type === 'apply_status' && effect.target === 'self') return sum + effect.stacks;
    return sum;
  }, 0);
}

function chooseFirst<T>(items: readonly T[]): T | null {
  return items[0] ?? null;
}

export const simplePolicy: SimulationPolicy = {
  id: 'simple',

  chooseBattleCommand(ctx: SimulationBattleContext): GameCommand {
    const attacks = ctx.playableCommands.filter((item) => item.card.type === 'attack');
    if (attacks.length > 0) return attacks[0]!.command;

    const needsDefense = ctx.projectedIncomingDamage > (ctx.run.player.currentHp / 4);
    if (needsDefense) {
      const defense = ctx.playableCommands
        .filter((item) => estimatedBlock(item.card.id) > 0)
        .sort((a, b) => estimatedBlock(b.card.id) - estimatedBlock(a.card.id))[0];
      if (defense) return defense.command;
    }

    const anyPlayable = chooseFirst(ctx.playableCommands);
    return anyPlayable?.command ?? { type: 'END_TURN' };
  },

  chooseMapNode(ctx: SimulationMapContext): string {
    return ctx.nextNodes[0]!.id;
  },

  chooseReward(ctx: SimulationRewardContext): { type: 'card'; definitionId: string } | { type: 'gold' } {
    const characterPool = new Set(getCharacterDefinition(ctx.run.meta.characterId).rewardCardPool);
    const characterCard = ctx.offeredCards.find((cardId) => characterPool.has(cardId));
    if (characterCard) return { type: 'card', definitionId: characterCard };
    return { type: 'card', definitionId: ctx.offeredCards[0]! };
  },

  chooseShopAction(ctx: SimulationShopContext): GameCommand | { type: 'leave_shop' } {
    const characterPool = new Set(getCharacterDefinition(ctx.run.meta.characterId).rewardCardPool);
    const affordable = ctx.shop.cards
      .filter((offer) => ctx.run.meta.gold >= offer.price && characterPool.has(offer.definitionId))
      .sort((a, b) => a.price - b.price)[0];
    if (!affordable) return { type: 'leave_shop' };
    return { type: 'BUY_SHOP_CARD', definitionId: affordable.definitionId };
  },

  chooseEventOption(ctx: SimulationEventContext): string {
    return ctx.availableOptionIds[0]!;
  },
};
