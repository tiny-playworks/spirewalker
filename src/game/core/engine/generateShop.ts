import type { ShopState } from '../model/shop';
import { mulberry32 } from '../utils/rng';

/** 删牌后牌组下限（与引擎一致） */
export const SHOP_MIN_MASTER_DECK_SIZE = 5;

/** 商店可刷出的遗物（未持有才会上架） */
const SHOP_RELIC_POOL = ['vajra', 'anchor'] as const;

/** 进入商店节点时生成（价格随层数略涨；遗物依已持有过滤） */
export function generateShop(
  seed: number,
  floor: number,
  ownedRelicIds: string[],
): ShopState {
  const f = Math.max(1, floor);
  const jitter = (seed ^ f * 0x9e37) & 7;
  const rng = mulberry32((seed ^ f * 0x5c0ffee) >>> 0);

  const available = SHOP_RELIC_POOL.filter((id) => !ownedRelicIds.includes(id));
  const relics: ShopState['relics'] = [];
  if (available.length > 0) {
    const pick = available[Math.floor(rng() * available.length)]!;
    relics.push({ relicId: pick, price: 135 + f * 12 + jitter });
  }

  return {
    cards: [
      { definitionId: 'strike', price: 40 + f * 8 + jitter },
      { definitionId: 'defend', price: 35 + f * 8 + jitter },
      { definitionId: 'skim', price: 52 + f * 10 + jitter },
      { definitionId: 'surge', price: 28 + f * 6 + jitter },
    ],
    relics,
    potions: [{ potionId: 'healing_dew', price: 48 + f * 6 + jitter }],
    removeCardPrice: 70 + f * 10,
  };
}
