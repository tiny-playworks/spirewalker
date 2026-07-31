import { FORMAL_RELIC_POOL } from '../definitions/relics';
import { ACT2_REWARD_CARD_IDS } from '../definitions/act2Content';
import {
  MOMENTUM_PAYOFF_CARD_IDS,
  MOMENTUM_SETUP_CARD_IDS,
  TEMPO_RECOVERY_CARD_IDS,
} from '../definitions/cards';
import type { MapAct } from '../model/map';
import type { ShopState } from '../model/shop';
import { mulberry32 } from '../utils/rng';

/** 删牌后牌组下限（与引擎一致） */
export const SHOP_MIN_MASTER_DECK_SIZE = 5;

/** 商店可刷出的遗物（未持有才会上架） */
const SHOP_RELIC_POOL = FORMAL_RELIC_POOL;

const SHOP_POTION_POOL = ['stillwater_tonic', 'flash_powder'] as const;

function pickOne<T>(pool: readonly T[], random: () => number): T {
  return pool[Math.floor(random() * pool.length)]!;
}

/** 进入商店节点时生成（价格随层数略涨；遗物依已持有过滤） */
export function generateShop(
  seed: number,
  act: MapAct,
  actFloor: number,
  ownedRelicIds: string[] = [],
  _currentGold = 0,
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
  // 起势牌保持固定定价；Act 1 首个商店至少能买到一个基础入口。
  const setupListPrice = 32 + f * 2 + jitter;
  const setupPrice = setupListPrice;
  const chapterOffer = act >= 2
    ? pickOne(ACT2_REWARD_CARD_IDS, random)
    : pickOne(['anchor_slash', 'measured_rest'] as const, random);

  return {
    cards: [
      { definitionId: setupOffer, price: setupPrice },
      { definitionId: payoffOffer, price: 58 + f * 3 + jitter },
      { definitionId: recoveryOffer, price: 48 + f * 2 + jitter },
      { definitionId: chapterOffer, price: 44 + f * 2 + jitter },
    ],
    relics,
    potions: [{ potionId: pickOne(SHOP_POTION_POOL, random), price: 42 + f * 2 + jitter }],
    removeCardPrice: 82 + f * 5,
    upgradePrice: 68 + f * 4,
  };
}
