import {
  MOMENTUM_PAYOFF_CARD_IDS,
  MOMENTUM_SETUP_CARD_IDS,
  TEMPO_RECOVERY_CARD_IDS,
} from '../definitions/cards/starter';
import type { MapAct } from '../model/map';
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
  'still_core',
  'soft_guard',
  'quick_fuse',
  'sighted_edge',
] as const;

function pickOne<T>(pool: readonly T[], random: () => number): T {
  return pool[Math.floor(random() * pool.length)]!;
}

/** 进入商店节点时生成（价格随层数略涨；遗物依已持有过滤） */
export function generateShop(
  seed: number,
  act: MapAct,
  actFloor: number,
  ownedRelicIds: string[],
): ShopState {
  const f = Math.max(1, actFloor + act * 4);
  const jitter = (seed ^ f * 0x9e37) & 7;
  const rng = mulberry32((seed ^ f * 0x5c0ffee) >>> 0);

  const available = SHOP_RELIC_POOL.filter((id) => !ownedRelicIds.includes(id));
  const relics: ShopState['relics'] = [];
  if (available.length > 0) {
    const pick = available[Math.floor(rng() * available.length)]!;
    relics.push({ relicId: pick, price: 152 + f * 12 + jitter });
  }

  const random = () => rng();
  const setupOffer = pickOne(MOMENTUM_SETUP_CARD_IDS, random);
  const payoffOffer = pickOne(MOMENTUM_PAYOFF_CARD_IDS, random);
  const recoveryOffer = pickOne(TEMPO_RECOVERY_CARD_IDS, random);

  return {
    cards: [
      { definitionId: 'strike', price: 52 + f * 7 + jitter },
      { definitionId: setupOffer, price: 58 + f * 7 + jitter },
      { definitionId: payoffOffer, price: 72 + f * 8 + jitter },
      { definitionId: recoveryOffer, price: 60 + f * 7 + jitter },
    ],
    relics,
    potions: [{ potionId: 'healing_dew', price: 60 + f * 5 + jitter }],
    removeCardPrice: 96 + f * 9,
  };
}
