/** 对齐 naobao.md「RewardState / RewardItem」 */
export type RewardItem =
  | { type: 'gold'; amount: number }
  | { type: 'card_choice'; cards: string[] }
  | { type: 'relic'; relicId: string }
  | { type: 'potion'; potionId: string };

export interface RewardState {
  items: RewardItem[];
  claimed: boolean;
}
