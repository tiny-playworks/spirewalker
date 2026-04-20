import {
  COMMON_REWARD_CARD_POOL,
} from '../definitions/cards/starter';
import { DEFAULT_CHARACTER_ID, getCharacterDefinition } from '../definitions/characters';
import { mulberry32 } from '../utils/rng';

export type RewardEncounterTier = 'normal' | 'elite' | 'boss' | 'treasure';

function pickOne<T>(pool: readonly T[], random: () => number): T {
  return pool[Math.floor(random() * pool.length)]!;
}

function buildRewardPool(characterId: string): readonly string[] {
  return getCharacterDefinition(characterId).rewardCardPool;
}

function uniquePush(out: string[], picked: string, fallbackPool: readonly string[], random: () => number): void {
  if (!out.includes(picked)) {
    out.push(picked);
    return;
  }
  const remaining = fallbackPool.filter((cardId) => !out.includes(cardId));
  if (remaining.length > 0) {
    out.push(pickOne(remaining, random));
    return;
  }
  out.push(picked);
}

function pickOne<T>(pool: readonly T[], random: () => number): T {
  return pool[Math.floor(random() * pool.length)]!;
}

/**
 * 战后三选一：每个槽位独立按 75/25 从角色池 / 通用池混抽。
 */
export function generateCardRewardChoices(
  seed: number,
  salt: number,
  tier: RewardEncounterTier = 'normal',
  characterId = DEFAULT_CHARACTER_ID,
): string[] {
  const rng = mulberry32((seed ^ salt ^ 0x51eed) >>> 0);
  const random = () => rng();
  const characterPool = buildRewardPool(characterId);
  const fallbackPool =
    tier === 'elite' || tier === 'boss' || tier === 'treasure'
      ? [...characterPool, ...COMMON_REWARD_CARD_POOL]
      : [...characterPool, ...COMMON_REWARD_CARD_POOL];
  const picks: string[] = [];
  for (let i = 0; i < 3; i++) {
    const sourcePool = random() < 0.75 ? characterPool : COMMON_REWARD_CARD_POOL;
    uniquePush(picks, pickOne(sourcePool, random), fallbackPool, random);
  }
  return picks;
}
