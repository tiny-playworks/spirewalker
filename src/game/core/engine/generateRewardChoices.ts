import {
  DEFAULT_CHARACTER_ID,
  getCharacterDefinition,
} from '../definitions/characters';
import { mulberry32 } from '../utils/rng';

export type RewardEncounterTier = 'normal' | 'elite' | 'boss' | 'treasure';
const ANCHOR_SLASH_ID = 'anchor_slash';

const ACT_CARD_POOLS = {
  early: ['prime_rhythm', 'brace_rhythm', 'soft_step', 'held_breath', 'survey_field', 'measured_rest'],
  core: ['momentum', 'tempo_guard', 'anchored_breath', 'patient_cut', 'guard_strike', 'anchor_slash', 'stable_mind', 'break_opening', 'quick_release'],
  amplifier: ['burst_strike', 'snap_strike', 'follow_through', 'cash_flow', 'release_flow'],
  finisher: ['patient_cut', 'burst_strike', 'follow_through', 'full_release', 'cash_flow'],
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
  _actFloor?: number,
  ownedCardIds: readonly string[] = [],
): string[] {
  const rng = mulberry32((seed ^ salt ^ 0x51eed) >>> 0);
  const random = () => rng();
  const alreadyOwnedAnchorSlash = ownedCardIds.includes(ANCHOR_SLASH_ID);
  const characterPool = new Set(
    getCharacterDefinition(characterId).rewardCardPool
      .filter((cardId) => !(alreadyOwnedAnchorSlash && cardId === ANCHOR_SLASH_ID)),
  );
  const pools = weightedPoolsFor(act, tier);
  const fallbackPool = [...characterPool];
  const picks: string[] = [];
  for (const pool of pools) {
    const filtered = pool.filter((cardId) => characterPool.has(cardId));
    uniquePush(picks, pickOne(filtered.length > 0 ? filtered : fallbackPool, random), fallbackPool, random);
  }
  return picks;
}
