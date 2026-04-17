import { CARD_DEFINITIONS } from '../../definitions/cards/starter';
import { MAX_POTIONS, POTION_DEFINITIONS } from '../../definitions/potions';
import { applyRelicPickupEffect, RELIC_DEFINITIONS } from '../../definitions/relics';
import type { RunState } from '../../model/run';
import { SHOP_MIN_MASTER_DECK_SIZE } from '../../engine/generateShop';

export function resolveShopCardPurchase(run: RunState, definitionId: string): boolean {
  if (run.screen.type !== 'shop' || !run.shop) return false;
  if (!CARD_DEFINITIONS[definitionId]) return false;
  const idx = run.shop.cards.findIndex((c) => c.definitionId === definitionId);
  if (idx < 0) return false;
  const offer = run.shop.cards[idx]!;
  if (run.meta.gold < offer.price) return false;
  run.meta.gold -= offer.price;
  run.masterDeck.push(definitionId);
  run.shop.cards.splice(idx, 1);
  return true;
}

export function resolveShopRelicPurchase(run: RunState, relicId: string): boolean {
  if (run.screen.type !== 'shop' || !run.shop) return false;
  if (!RELIC_DEFINITIONS[relicId] || run.meta.relics.includes(relicId)) return false;
  const idx = run.shop.relics.findIndex((r) => r.relicId === relicId);
  if (idx < 0) return false;
  const offer = run.shop.relics[idx]!;
  if (run.meta.gold < offer.price) return false;
  run.meta.gold -= offer.price;
  run.meta.relics.push(relicId);
  applyRelicPickupEffect(run, relicId);
  run.shop.relics.splice(idx, 1);
  return true;
}

export function resolveShopRemoveCard(run: RunState, definitionId: string): boolean {
  if (run.screen.type !== 'shop' || !run.shop) return false;
  if (!CARD_DEFINITIONS[definitionId] || run.masterDeck.length <= SHOP_MIN_MASTER_DECK_SIZE) return false;
  const price = run.shop.removeCardPrice;
  if (run.meta.gold < price) return false;
  const idx = run.masterDeck.indexOf(definitionId);
  if (idx < 0) return false;
  run.meta.gold -= price;
  run.masterDeck.splice(idx, 1);
  return true;
}

export function resolveShopPotionPurchase(run: RunState, potionId: string): boolean {
  if (run.screen.type !== 'shop' || !run.shop) return false;
  if (!POTION_DEFINITIONS[potionId] || run.meta.potions.length >= MAX_POTIONS) return false;
  const idx = run.shop.potions.findIndex((p) => p.potionId === potionId);
  if (idx < 0) return false;
  const offer = run.shop.potions[idx]!;
  if (run.meta.gold < offer.price) return false;
  run.meta.gold -= offer.price;
  run.meta.potions.push(potionId);
  run.shop.potions.splice(idx, 1);
  return true;
}
