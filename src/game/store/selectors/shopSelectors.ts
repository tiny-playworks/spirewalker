import { SHOP_MIN_MASTER_DECK_SIZE } from '@/game/core/engine/generateShop';
import type { RunState } from '@/game/core/model/run';

export function selectShopRunState(run: RunState | null) {
  if (!run || run.screen.type !== 'shop' || !run.shop) return null;
  const { shop, meta, masterDeck } = run;
  return {
    shop,
    meta,
    masterDeck,
    canRemove: masterDeck.length > SHOP_MIN_MASTER_DECK_SIZE,
  };
}
