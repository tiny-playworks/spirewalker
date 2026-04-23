import { MAX_POTIONS, POTION_DEFINITIONS } from '../definitions/potions';
import type { RewardEncounterTier } from './generateRewardChoices';
import { mulberry32 } from '../utils/rng';

const POST_BATTLE_POTION_POOL = ['stillwater_tonic', 'flash_powder'] as const;

export function skipCardGoldAmount(tier: RewardEncounterTier): number {
  if (tier === 'boss') return 70;
  if (tier === 'elite') return 40;
  if (tier === 'treasure') return 35;
  return 22;
}

const NORMAL_POST_BATTLE_POTION_CHANCE = 0.12;
const TREASURE_POTION_CHANCE = 0.4;

export function rollPostBattlePotionOffer(
  seed: number,
  salt: number,
  tier: RewardEncounterTier,
  potionCount: number,
): string | null {
  if (potionCount >= MAX_POTIONS) return null;
  const rng = mulberry32((seed ^ salt ^ 0x25d00) >>> 0);
  const pick = () => {
    const pool = POST_BATTLE_POTION_POOL.filter((id) => POTION_DEFINITIONS[id]);
    if (pool.length === 0) return null;
    return pool[Math.floor(rng() * pool.length)]!;
  };
  if (tier === 'elite' || tier === 'boss') return pick();
  if (tier === 'treasure') return rng() < TREASURE_POTION_CHANCE ? pick() : null;
  return rng() < NORMAL_POST_BATTLE_POTION_CHANCE ? pick() : null;
}
