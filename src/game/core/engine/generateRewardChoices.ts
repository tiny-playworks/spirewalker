import {
  DEFAULT_CHARACTER_ID,
  getCharacterDefinition,
} from '../definitions/characters';
import { mulberry32 } from '../utils/rng';

export type RewardEncounterTier = 'normal' | 'elite' | 'boss' | 'treasure';

const ACT_CARD_POOLS = {
  early: ['prime_rhythm', 'brace_rhythm', 'steady_step', 'soft_step', 'patch_breath', 'measured_rest', 'recenter'],
  core: ['momentum', 'tempo_guard', 'anchored_breath', 'quick_release', 'survey_field'],
  amplifier: ['burst_strike', 'snap_strike', 'follow_through', 'release_flow', 'second_wind'],
  finisher: ['cash_flow', 'burst_strike', 'snap_strike', 'follow_through'],
} as const;

function pickOne<T>(pool: readonly T[], random: () => number): T {
  return pool[Math.floor(random() * pool.length)]!;
}

function uniquePush(
  out: string[],
  picked: string,
  fallbackPool: readonly string[],
  random: () => number,
): void {
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

function weightedPoolsFor(act: 1 | 2 | 3, tier: RewardEncounterTier): ReadonlyArray<readonly string[]> {
  if (act === 1) {
    return tier === 'normal'
      ? [ACT_CARD_POOLS.early, ACT_CARD_POOLS.early, ACT_CARD_POOLS.core]
      : [ACT_CARD_POOLS.early, ACT_CARD_POOLS.core, ACT_CARD_POOLS.amplifier];
  }
  if (act === 2) {
    return tier === 'normal'
      ? [ACT_CARD_POOLS.core, ACT_CARD_POOLS.core, ACT_CARD_POOLS.amplifier]
      : [ACT_CARD_POOLS.core, ACT_CARD_POOLS.amplifier, ACT_CARD_POOLS.finisher];
  }
  return tier === 'normal'
    ? [ACT_CARD_POOLS.core, ACT_CARD_POOLS.amplifier, ACT_CARD_POOLS.finisher]
    : [ACT_CARD_POOLS.amplifier, ACT_CARD_POOLS.finisher, ACT_CARD_POOLS.finisher];
}

export function generateCardRewardChoices(
  seed: number,
  salt: number,
  tier: RewardEncounterTier = 'normal',
  characterId = DEFAULT_CHARACTER_ID,
  act: 1 | 2 | 3 = 1,
): string[] {
  const rng = mulberry32((seed ^ salt ^ 0x51eed) >>> 0);
  const random = () => rng();
  const characterPool = new Set(getCharacterDefinition(characterId).rewardCardPool);
  const pools = weightedPoolsFor(act, tier);
  const fallbackPool = [...characterPool];
  const picks: string[] = [];
  for (const pool of pools) {
    const filtered = pool.filter((cardId) => characterPool.has(cardId));
    uniquePush(picks, pickOne(filtered.length > 0 ? filtered : fallbackPool, random), fallbackPool, random);
  }
  return picks;
}
