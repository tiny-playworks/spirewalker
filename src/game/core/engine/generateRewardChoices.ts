import {
  getCardArchetype,
  getDominantArchetype,
} from '../definitions/cards/archetypes';
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

/**
 * 流派权重倾斜（对应创始人反馈 #8）：
 * - 牌组已经明显偏向一派时（`getDominantArchetype` 返回非 null），
 *   同派 / 混合派的卡在奖励池里加权 2，对立派降权到 0.5，中性派保持 1。
 * - 未形成主导流派时直接等权抽。
 *
 * 这个倾斜只改变奖励出现概率，不改变任何规则结算；`REWARD_ARCHETYPE_TILT` 可作为后续
 * 配置开关（目前恒为 true，未来可由角色数据或调参面板关闭）。
 */
const REWARD_ARCHETYPE_TILT = true;

function pickWeightedCardId(
  pool: readonly string[],
  random: () => number,
  dominant: 'guard' | 'burst' | null,
): string {
  if (!REWARD_ARCHETYPE_TILT || dominant === null || pool.length === 0) {
    return pickOne(pool, random);
  }
  const opposite: 'guard' | 'burst' = dominant === 'guard' ? 'burst' : 'guard';
  const weights = pool.map((cardId) => {
    const a = getCardArchetype(cardId);
    if (a === dominant || a === 'mixed') return 2;
    if (a === opposite) return 0.5;
    return 1;
  });
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (total <= 0) return pickOne(pool, random);
  let roll = random() * total;
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i]!;
    if (roll <= 0) return pool[i]!;
  }
  return pool[pool.length - 1]!;
}

function uniquePush(
  out: string[],
  picked: string,
  fallbackPool: readonly string[],
  random: () => number,
  dominant: 'guard' | 'burst' | null,
): void {
  if (!out.includes(picked)) {
    out.push(picked);
    return;
  }
  const remaining = fallbackPool.filter((cardId) => !out.includes(cardId));
  if (remaining.length > 0) {
    out.push(pickWeightedCardId(remaining, random, dominant));
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
  const dominant = getDominantArchetype(ownedCardIds);
  const picks: string[] = [];
  for (const pool of pools) {
    const filtered = pool.filter((cardId) => characterPool.has(cardId));
    const source = filtered.length > 0 ? filtered : fallbackPool;
    uniquePush(picks, pickWeightedCardId(source, random, dominant), fallbackPool, random, dominant);
  }
  return picks;
}
