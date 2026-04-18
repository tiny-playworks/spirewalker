import {
  MOMENTUM_PAYOFF_CARD_IDS,
  MOMENTUM_SETUP_CARD_IDS,
  TEMPO_RECOVERY_CARD_IDS,
} from '../definitions/cards/starter';
import type { ShopState } from '../model/shop';
import { mulberry32 } from '../utils/rng';

/** 删牌后牌组下限（与引擎一致） */
export const SHOP_MIN_MASTER_DECK_SIZE = 5;

/** 商店可刷出的遗物（未持有才会上架） */
const SHOP_RELIC_POOL = [
  'vajra',
  'anchor',
  'wind_chime',
  'tactical_gloves',
  'burst_emblem',
  'insight_lens',
  'guard_knot',
] as const;

function pickOne<T>(pool: readonly T[], random: () => number): T {
  return pool[Math.floor(random() * pool.length)]!;
}

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

  const random = () => rng();
  const setupOffer = pickOne(MOMENTUM_SETUP_CARD_IDS, random);
  const payoffOffer = pickOne(MOMENTUM_PAYOFF_CARD_IDS, random);
  const recoveryOffer = pickOne(TEMPO_RECOVERY_CARD_IDS, random);

  return {
    cards: [
      { definitionId: 'strike', price: 40 + f * 8 + jitter },
      { definitionId: setupOffer, price: 44 + f * 8 + jitter },
      { definitionId: payoffOffer, price: 58 + f * 10 + jitter },
      { definitionId: recoveryOffer, price: 42 + f * 8 + jitter },
    ],
    relics,
    potions: [{ potionId: 'healing_dew', price: 48 + f * 6 + jitter }],
    removeCardPrice: 70 + f * 10,
  };
}
