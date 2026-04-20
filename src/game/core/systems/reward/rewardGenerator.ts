import { rollBossRelicReward } from '../../definitions/relics';
import type { RewardItem } from '../../model/reward';
import type { RewardEncounterTier } from '../../engine/generateRewardChoices';
import { generateCardRewardChoices } from '../../engine/generateRewardChoices';
import { rollPostBattlePotionOffer } from '../../engine/postBattleExtras';

export function generateBattleRewards(input: {
  seed: number;
  salt: number;
  tier: RewardEncounterTier;
  ownedRelicIds: string[];
  potionCount: number;
  characterId: string;
}): RewardItem[] {
  const { seed, salt, tier, ownedRelicIds, potionCount, characterId } = input;
  const cards = generateCardRewardChoices(seed, salt, tier, characterId);
  const items: RewardItem[] = [{ type: 'card_choice', cards }];
  if (tier === 'elite') items.push({ type: 'gold', amount: 25 });
  if (tier === 'boss') {
    items.push({ type: 'gold', amount: 45 });
    const relicId = rollBossRelicReward(seed, salt, ownedRelicIds, characterId);
    if (relicId) items.push({ type: 'relic', relicId });
  }
  const potionId = rollPostBattlePotionOffer(seed, salt, tier, potionCount);
  if (potionId) items.push({ type: 'potion', potionId });
  return items;
}
