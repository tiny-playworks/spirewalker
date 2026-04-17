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
}
