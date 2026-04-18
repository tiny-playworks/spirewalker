import {
  CORE_STAPLE_CARD_IDS,
  MOMENTUM_PAYOFF_CARD_IDS,
  MOMENTUM_SETUP_CARD_IDS,
  TEMPO_RECOVERY_CARD_IDS,
} from '../definitions/cards/starter';
import { mulberry32 } from '../utils/rng';

const POOL_NORMAL = [
  ...CORE_STAPLE_CARD_IDS,
  ...MOMENTUM_SETUP_CARD_IDS,
  ...MOMENTUM_PAYOFF_CARD_IDS,
  ...TEMPO_RECOVERY_CARD_IDS,
  'skim',
  'surge',
  'surge',
] as const;

/** 精英：提高起势、兑现与修复三类新卡出现率。 */
const POOL_ELITE = [
  ...MOMENTUM_SETUP_CARD_IDS,
  ...MOMENTUM_SETUP_CARD_IDS,
  ...MOMENTUM_PAYOFF_CARD_IDS,
  ...MOMENTUM_PAYOFF_CARD_IDS,
  ...TEMPO_RECOVERY_CARD_IDS,
  ...CORE_STAPLE_CARD_IDS,
  'bash',
  'cleave',
  'skim',
] as const;

/** Boss：进一步偏向可形成路线的牌。 */
const POOL_BOSS = [
  ...MOMENTUM_SETUP_CARD_IDS,
  ...MOMENTUM_PAYOFF_CARD_IDS,
  ...MOMENTUM_PAYOFF_CARD_IDS,
  ...TEMPO_RECOVERY_CARD_IDS,
  ...TEMPO_RECOVERY_CARD_IDS,
  'bash',
  'cleave',
  'skim',
  'surge',
] as const;

export type RewardEncounterTier = 'normal' | 'elite' | 'boss' | 'treasure';

function pickPool(tier: RewardEncounterTier): readonly string[] {
  if (tier === 'boss') return POOL_BOSS;
  if (tier === 'elite' || tier === 'treasure') return POOL_ELITE;
  return POOL_NORMAL;
}

function pickOne<T>(pool: readonly T[], random: () => number): T {
  return pool[Math.floor(random() * pool.length)]!;
}

/**
 * 战后三选一：从池随机（可重复，保证总有选项）。
 * 精英 / 宝箱 / Boss 使用加权池，与地图节点类型一致。
 */
export function generateCardRewardChoices(
  seed: number,
  salt: number,
  tier: RewardEncounterTier = 'normal',
): string[] {
  const rng = mulberry32((seed ^ salt ^ 0x51eed) >>> 0);
  const random = () => rng();
  if (tier === 'elite' || tier === 'boss' || tier === 'treasure') {
    return [
      pickOne(MOMENTUM_SETUP_CARD_IDS, random),
      pickOne(MOMENTUM_PAYOFF_CARD_IDS, random),
      pickOne(TEMPO_RECOVERY_CARD_IDS, random),
    ];
  }
  const pool = pickPool(tier);
  return [0, 1, 2].map(() => pickOne(pool, random));
}
