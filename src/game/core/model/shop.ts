/** 对齐 naobao.md「ShopState」 */
export interface ShopOfferCard {
  definitionId: string;
  price: number;
}

export interface ShopOfferRelic {
  relicId: string;
  price: number;
}

export interface ShopOfferPotion {
  potionId: string;
  price: number;
}

export interface ShopState {
  cards: ShopOfferCard[];
  relics: ShopOfferRelic[];
  potions: ShopOfferPotion[];
  removeCardPrice: number;
  /** 升级服务价格；若为 undefined 代表本店暂不提供升级（兼容旧存档）。 */
  upgradePrice?: number;
}
