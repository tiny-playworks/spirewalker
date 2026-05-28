import { REWARD_ARCHETYPE_TILT_ENABLED } from '../config/rewardTuning';
import {
  getCardArchetype,
  getDominantArchetype,
} from '../definitions/cards/archetypes';
import { CARD_DEFINITIONS } from '../definitions/cards/starter';
import {
  DEFAULT_CHARACTER_ID,
  getCharacterDefinition,
} from '../definitions/characters';
import { mulberry32 } from '../utils/rng';

export type RewardEncounterTier = 'normal' | 'elite' | 'boss' | 'treasure';
const ANCHOR_SLASH_ID = 'anchor_slash';

/**
 * 动态构建奖励卡池：按 rarity 分层，排除 curse/status。
 * common → early，uncommon → core，rare → amplifier / finisher。
 */
function buildCardPools(): {
  early: string[];
  core: string[];
  amplifier: string[];
  finisher: string[];
} {
  const early: string[] = [];
  const core: string[] = [];
  const amplifier: string[] = [];
  const finisher: string[] = [];
  for (const [id, def] of Object.entries(CARD_DEFINITIONS)) {
    if (def.type === 'curse' || def.type === 'status') continue;
    if (def.rarity === 'common') early.push(id);
    else if (def.rarity === 'uncommon') core.push(id);
    else if (def.rarity === 'rare') {
      amplifier.push(id);
      finisher.push(id);
    }
  }
  return { early, core, amplifier, finisher };
}

const ACT_CARD_POOLS = buildCardPools();

function pickOne<T>(pool: readonly T[], random: () => number): T {
  return pool[Math.floor(random() * pool.length)]!;
}

/**
 * 流派权重倾斜（对应创始人反馈 #8）：
 * - 牌组已经明显偏向一派时（`getDominantArchetype` 返回非 null），
 *   同派 / 混合派的卡在奖励池里加权 2，对立派降权到 0.5，中性派保持 1。
 * - 未形成主导流派时直接等权抽。
 *
 * 这个倾斜只改变奖励出现概率，不改变任何规则结算；开关见 `rewardTuning.ts`。
 */
function pickWeightedCardId(
  pool: readonly string[],
  random: () => number,
  dominant: 'guard' | 'burst' | null,
  tiltEnabled: boolean,
): string {
  if (!tiltEnabled || dominant === null || pool.length === 0) {
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
  tiltEnabled: boolean,
): void {
  if (!out.includes(picked)) {
    out.push(picked);
    return;
  }
  const remaining = fallbackPool.filter((cardId) => !out.includes(cardId));
  if (remaining.length > 0) {
    out.push(pickWeightedCardId(remaining, random, dominant, tiltEnabled));
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
  archetypeTiltEnabled: boolean = REWARD_ARCHETYPE_TILT_ENABLED,
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
    uniquePush(
      picks,
      pickWeightedCardId(source, random, dominant, archetypeTiltEnabled),
      fallbackPool,
      random,
      dominant,
      archetypeTiltEnabled,
    );
  }
  return picks;
}
