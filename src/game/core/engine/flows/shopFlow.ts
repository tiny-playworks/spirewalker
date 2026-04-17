import type { GameCommand } from '../../commands/types';
import { CARD_DEFINITIONS } from '../../definitions/cards/starter';
import { MAX_POTIONS, POTION_DEFINITIONS } from '../../definitions/potions';
import { applyRelicPickupEffect, RELIC_DEFINITIONS } from '../../definitions/relics';
import type { GameEvent } from '../../events/types';
import type { RunState } from '../../model/run';
import { SHOP_MIN_MASTER_DECK_SIZE } from '../generateShop';

export function buyShopCardFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'BUY_SHOP_CARD' }>,
  events: GameEvent[],
): void {
  void events;
  if (run.screen.type !== 'shop' || !run.shop) return;
  if (!CARD_DEFINITIONS[command.definitionId]) return;

  const idx = run.shop.cards.findIndex((c) => c.definitionId === command.definitionId);
  if (idx < 0) return;
  const offer = run.shop.cards[idx]!;
  if (run.meta.gold < offer.price) return;

  run.meta.gold -= offer.price;
  run.masterDeck.push(command.definitionId);
  run.shop.cards.splice(idx, 1);
}

export function buyShopRelicFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'BUY_SHOP_RELIC' }>,
  events: GameEvent[],
): void {
  void events;
  if (run.screen.type !== 'shop' || !run.shop) return;
  if (!RELIC_DEFINITIONS[command.relicId]) return;
  if (run.meta.relics.includes(command.relicId)) return;

  const idx = run.shop.relics.findIndex((r) => r.relicId === command.relicId);
  if (idx < 0) return;
  const offer = run.shop.relics[idx]!;
  if (run.meta.gold < offer.price) return;

  run.meta.gold -= offer.price;
  run.meta.relics.push(command.relicId);
  applyRelicPickupEffect(run, command.relicId);
  run.shop.relics.splice(idx, 1);
}

export function buyShopRemoveCardFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'BUY_SHOP_REMOVE_CARD' }>,
  events: GameEvent[],
): void {
  void events;
  if (run.screen.type !== 'shop' || !run.shop) return;
  if (!CARD_DEFINITIONS[command.definitionId]) return;
  if (run.masterDeck.length <= SHOP_MIN_MASTER_DECK_SIZE) return;

  const price = run.shop.removeCardPrice;
  if (run.meta.gold < price) return;

  const idx = run.masterDeck.indexOf(command.definitionId);
  if (idx < 0) return;

  run.meta.gold -= price;
  run.masterDeck.splice(idx, 1);
}

export function leaveShopToMapFlow(run: RunState): void {
  if (run.screen.type !== 'shop') return;
  run.screen = { type: 'map' };
  run.shop = undefined;
}

export function buyShopPotionFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'BUY_SHOP_POTION' }>,
  events: GameEvent[],
): void {
  void events;
  if (run.screen.type !== 'shop' || !run.shop) return;
  if (!POTION_DEFINITIONS[command.potionId]) return;
  if (run.meta.potions.length >= MAX_POTIONS) return;

  const idx = run.shop.potions.findIndex((p) => p.potionId === command.potionId);
  if (idx < 0) return;
  const offer = run.shop.potions[idx]!;
  if (run.meta.gold < offer.price) return;

  run.meta.gold -= offer.price;
  run.meta.potions.push(command.potionId);
  run.shop.potions.splice(idx, 1);
}
