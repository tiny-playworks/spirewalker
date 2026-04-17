import { mulberry32 } from '../utils/rng';

const POOL_NORMAL = [
  'strike',
  'defend',
  'bash',
  'flex',
  'cleave',
  'skim',
  'skim',
  'surge',
  'surge',
  'surge',
] as const;

/** 精英：提高功能牌/高费牌出现权重 */
const POOL_ELITE = [
  'bash',
  'bash',
  'cleave',
  'cleave',
  'flex',
  'flex',
  'skim',
  'skim',
  'surge',
  'strike',
  'defend',
  'strike',
  'defend',
] as const;

/** Boss：进一步偏向顺劈/重击等上限牌 */
const POOL_BOSS = [
  'cleave',
  'cleave',
  'bash',
  'bash',
  'flex',
  'flex',
  'skim',
  'surge',
  'strike',
  'defend',
] as const;

export type RewardEncounterTier = 'normal' | 'elite' | 'boss';

function pickPool(tier: RewardEncounterTier): readonly string[] {
  if (tier === 'boss') return POOL_BOSS;
  if (tier === 'elite') return POOL_ELITE;
  return POOL_NORMAL;
}

/**
 * 战后三选一：从池随机（可重复，保证总有选项）。
 * 精英/Boss 使用加权池，与地图节点类型一致。
 */
export function generateCardRewardChoices(
  seed: number,
  salt: number,
  tier: RewardEncounterTier = 'normal',
): string[] {
  const pool = pickPool(tier);
  const rng = mulberry32((seed ^ salt ^ 0x51eed) >>> 0);
  const random = () => rng();
  return [0, 1, 2].map(() => pool[Math.floor(random() * pool.length)]!);
}
