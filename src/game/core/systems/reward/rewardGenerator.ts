import { isRewardArchetypeTiltEnabled } from '../../config/rewardTuning';
import { rollBossRelicReward } from '../../definitions/relics';
import type { RewardItem } from '../../model/reward';
import type { RewardEncounterTier } from '../../engine/generateRewardChoices';
import { generateCardRewardChoices } from '../../engine/generateRewardChoices';
import { rollPostBattlePotionOffer } from '../../engine/postBattleExtras';

export function generateBattleRewards(input: {
  seed: number;
  salt: number;
  tier: RewardEncounterTier;
  act: 1 | 2 | 3;
  actFloor?: number;
  ownedCardIds: string[];
  ownedRelicIds: string[];
  potionCount: number;
  characterId: string;
  meta?: { rewardArchetypeTiltEnabled?: boolean };
}): RewardItem[] {
  const { seed, salt, tier, act, actFloor, ownedCardIds, ownedRelicIds, potionCount, characterId, meta } = input;
  const cards = generateCardRewardChoices(
    seed,
    salt,
    tier,
    characterId,
    act,
    actFloor,
    ownedCardIds,
    isRewardArchetypeTiltEnabled(meta),
  );
  const items: RewardItem[] = [{ type: 'card_choice', cards }];
  const rng = ((seed ^ salt ^ 0x4455aa) >>> 0) % 100;
  if (tier === 'normal') {
    if (rng >= 35 && rng < 75) items.push({ type: 'gold', amount: 12 + act * 2 });
    else if (rng >= 75) items.push({ type: 'gold', amount: 20 + act * 4 });
  }
  if (tier === 'elite') items.push({ type: 'gold', amount: 28 + act * 5 });
  if (tier === 'boss') {
    items.push({ type: 'gold', amount: 48 + act * 8 });
    const relicId = rollBossRelicReward(seed, salt, ownedRelicIds, characterId);
    if (relicId) items.push({ type: 'relic', relicId });
  }
  const potionId = rollPostBattlePotionOffer(seed, salt, tier, potionCount);
  if (potionId) items.push({ type: 'potion', potionId });
  return items;
}
