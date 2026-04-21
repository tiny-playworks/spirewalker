import { MAX_POTIONS, POTION_DEFINITIONS } from '../definitions/potions';
import type { RewardEncounterTier } from './generateRewardChoices';
import { mulberry32 } from '../utils/rng';

const DEFAULT_POST_BATTLE_POTION = 'healing_dew';

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
  if (!POTION_DEFINITIONS[DEFAULT_POST_BATTLE_POTION]) return null;
  if (tier === 'elite' || tier === 'boss') return DEFAULT_POST_BATTLE_POTION;
  const rng = mulberry32((seed ^ salt ^ 0x25d00) >>> 0);
  if (tier === 'treasure') return rng() < TREASURE_POTION_CHANCE ? DEFAULT_POST_BATTLE_POTION : null;
  return rng() < NORMAL_POST_BATTLE_POTION_CHANCE ? DEFAULT_POST_BATTLE_POTION : null;
}
