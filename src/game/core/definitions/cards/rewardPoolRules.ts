import type { CardDefinition } from '../../model/card';
import {
  COMMON_REWARD_CARD_POOL,
  MOMENTUM_SETUP_CARD_IDS,
  MOMENTUM_PAYOFF_CARD_IDS,
  TEMPO_RECOVERY_CARD_IDS,
} from './starter';

const ALWAYS_SKIP = new Set(['strike', 'defend']);

const NEUTRAL_WHITELIST = new Set<string>([
  ...COMMON_REWARD_CARD_POOL,
  ...MOMENTUM_SETUP_CARD_IDS,
  ...MOMENTUM_PAYOFF_CARD_IDS,
  ...TEMPO_RECOVERY_CARD_IDS,
  'burn_edge', 'clear_mind', 'recenter', 'patch_breath', 'second_wind',
  'steady_step', 'survey_field',
]);

export function isRewardEligible(id: string, def: CardDefinition): boolean {
  if (ALWAYS_SKIP.has(id)) return false;
  if (def.type === 'curse' || def.type === 'status') return false;
  if (def.cost < 0) return false;
  if (id.startsWith('junk_')) return false;
  if (id.startsWith('neutral_common_')) return false;

  // Phase B: common 卡在 chapter 2+ 不进池（legendary 除外）
  if (def.rarity === 'common' && (def.chapter ?? 1) >= 2 && def.rarity !== 'legendary') return false;

  const archetype = def.archetype ?? 'neutral';
  if (archetype === 'neutral' && !NEUTRAL_WHITELIST.has(id)) return false;

  return true;
}

export interface CardPoolGroup {
  early: string[];
  core: string[];
  amplifier: string[];
  finisher: string[];
}

/**
 * 按阶段分池：
 * - early: chapter===1 的 common/uncommon（教学友好，不含未标记 chapter 的旧卡）
 * - core: chapter<=2 的所有 eligible 卡（含未标记 chapter 的旧卡）
 * - amplifier: rare+legendary（build 成型后强化）
 * - finisher: legendary（终极兑现）
 *
 * 只统计 base 卡（不含 +, ++ 升级版），避免重复计数。
 */
export function buildCardPools(allDefs: Record<string, CardDefinition>): CardPoolGroup {
  const early: string[] = [];
  const core: string[] = [];
  const amplifier: string[] = [];
  const finisher: string[] = [];

  for (const [id, def] of Object.entries(allDefs)) {
    if (!isRewardEligible(id, def)) continue;
    // 跳过升级版卡（+ 或 ++），只统计 base 卡
    if (id.endsWith('+') || id.endsWith('++')) continue;

    const chapter = def.chapter;
    const isRarePlus = def.rarity === 'rare' || def.rarity === 'legendary';
    const isLegendary = def.rarity === 'legendary';

    // early: 显式 chapter===1 且 common/uncommon（未标记 chapter 的旧卡不进 early）
    if (chapter === 1 && !isRarePlus) {
      early.push(id);
    }

    // core: chapter<=2 或未标记 chapter 的所有 eligible 卡
    if (chapter === undefined || chapter <= 2) {
      core.push(id);
    }

    // amplifier: rare+legendary
    if (isRarePlus) {
      amplifier.push(id);
    }

    // finisher: legendary only
    if (isLegendary) {
      finisher.push(id);
    }
  }

  return { early, core, amplifier, finisher };
}
