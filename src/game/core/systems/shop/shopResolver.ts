import { CARD_DEFINITIONS } from '../../definitions/cards/starter';
import { MAX_POTIONS, POTION_DEFINITIONS } from '../../definitions/potions';
import { applyRelicPickupEffect, RELIC_DEFINITIONS } from '../../definitions/relics';
import type { RunState } from '../../model/run';
import { SHOP_MIN_MASTER_DECK_SIZE } from '../../engine/generateShop';
import { canUpgradeCardId, upgradeMasterDeckAt } from '../../definitions/cards/upgradeRules';

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

/**
 * 商店升级 masterDeck 指定下标的卡：
 * - 必须在商店屏且当前节点仍提供升级（`upgradePrice` 有效）
 * - 该下标对应的卡当前可升级（存在规则、未达 ++）
 * - 扣除 `upgradePrice`，成功后该槽位价格取消（同一商店只升级 1 次）
 */
export function resolveShopUpgradeCard(run: RunState, index: number): boolean {
  if (run.screen.type !== 'shop' || !run.shop) return false;
  const price = run.shop.upgradePrice;
  if (typeof price !== 'number' || price <= 0) return false;
  if (run.meta.gold < price) return false;
  if (index < 0 || index >= run.masterDeck.length) return false;
  if (!canUpgradeCardId(run.masterDeck[index]!)) return false;
  if (!upgradeMasterDeckAt(run, index)) return false;
  run.meta.gold -= price;
  run.shop.upgradePrice = undefined;
  return true;
}
