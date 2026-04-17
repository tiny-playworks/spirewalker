import { MAX_POTIONS, POTION_DEFINITIONS } from '../definitions/potions';
import type { RewardEncounterTier } from './generateRewardChoices';
import { mulberry32 } from '../utils/rng';

const DEFAULT_POST_BATTLE_POTION = 'healing_dew';

/** 放弃三选一卡牌时换取的金币（仍叠加奖励里的额外金币条目） */
export function skipCardGoldAmount(tier: RewardEncounterTier): number {
  if (tier === 'boss') return 75;
  if (tier === 'elite') return 45;
  if (tier === 'treasure') return 40;
  return 30;
}

/** 普通战后额外药水概率（与 `leaveBattleToReward` 传入的 seed/salt 绑定，可复现） */
const NORMAL_POST_BATTLE_POTION_CHANCE = 0.25;

/** 宝箱节点额外药水概率（栏位未满时） */
const TREASURE_POTION_CHANCE = 0.55;

/**
 * 战后是否额外掉落一瓶药水：
 * - 精英 / Boss：栏位未满时必掉露水滴
 * - 普通战：栏位未满时 **25%** 概率（`mulberry32(seed ^ salt ^ 0x25d00)` 首抽）
 */
export function rollPostBattlePotionOffer(
  seed: number,
  salt: number,
  tier: RewardEncounterTier,
  potionCount: number,
): string | null {
  if (potionCount >= MAX_POTIONS) return null;
  if (!POTION_DEFINITIONS[DEFAULT_POST_BATTLE_POTION]) return null;
  if (tier === 'elite' || tier === 'boss') {
    return DEFAULT_POST_BATTLE_POTION;
  }
  if (tier === 'treasure') {
    const rng = mulberry32((seed ^ salt ^ 0x25d00) >>> 0);
    return rng() < TREASURE_POTION_CHANCE ? DEFAULT_POST_BATTLE_POTION : null;
  }
  const rng = mulberry32((seed ^ salt ^ 0x25d00) >>> 0);
  return rng() < NORMAL_POST_BATTLE_POTION_CHANCE ? DEFAULT_POST_BATTLE_POTION : null;
}
