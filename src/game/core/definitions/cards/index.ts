import type { CardDefinition } from '../../model/card';
import { CARD_DEFINITIONS as STARTER_CARDS } from './starter';

// 导入各流派卡牌
import { GUARD_CARDS } from './guard/index';
import { BURST_CARDS } from './burst/index';
import { MIXED_CARDS } from './mixed/index';
import { NEUTRAL_CARDS } from './neutral/index';
import { CURSE_CARDS } from './curse/index';
import { STATUS_CARDS } from './status/index';

// 合并所有卡牌
export const ALL_CARD_DEFINITIONS: Record<string, CardDefinition> = {
  ...STARTER_CARDS,
  ...GUARD_CARDS,
  ...BURST_CARDS,
  ...MIXED_CARDS,
  ...NEUTRAL_CARDS,
  ...CURSE_CARDS,
  ...STATUS_CARDS,
};

// 导出所有卡牌 ID
export const ALL_CARD_IDS = Object.keys(ALL_CARD_DEFINITIONS);

// 按流派分组
export const GUARD_CARD_IDS = Object.keys(GUARD_CARDS);
export const BURST_CARD_IDS = Object.keys(BURST_CARDS);
export const MIXED_CARD_IDS = Object.keys(MIXED_CARDS);
export const NEUTRAL_CARD_IDS = Object.keys(NEUTRAL_CARDS);
export const CURSE_CARD_IDS = Object.keys(CURSE_CARDS);
export const STATUS_CARD_IDS = Object.keys(STATUS_CARDS);

// 按稀有度分组
export const COMMON_CARDS = Object.values(ALL_CARD_DEFINITIONS).filter(c => c.rarity === 'common');
export const UNCOMMON_CARDS = Object.values(ALL_CARD_DEFINITIONS).filter(c => c.rarity === 'uncommon');
export const RARE_CARDS = Object.values(ALL_CARD_DEFINITIONS).filter(c => c.rarity === 'rare');
export const LEGENDARY_CARDS = Object.values(ALL_CARD_DEFINITIONS).filter(c => c.rarity === 'legendary');

// 重新导出 starter.ts 的原始导出，保持兼容性
export {
  CARD_DEFINITIONS,
  STRIKE,
  DEFEND,
  BASH,
  FLEX,
  CLEAVE,
  SURGE,
  SKIM,
  MOMENTUM,
  TEMPO_GUARD,
  PRIME_RHYTHM,
  BRACE_RHYTHM,
  BURST_STRIKE,
  SNAP_STRIKE,
  CASH_FLOW,
  RELEASE_FLOW,
  STEADY_STEP,
  RECENTER,
  PATCH_BREATH,
  SECOND_WIND,
  SOFT_STEP,
  ANCHORED_BREATH,
  HELD_BREATH,
  PATIENT_CUT,
  ANCHOR_SLASH,
  STABLE_MIND,
  GUARD_STRIKE,
  QUICK_RELEASE,
  FOLLOW_THROUGH,
  BREAK_OPENING,
  FULL_RELEASE,
  SURVEY_FIELD,
  MEASURED_REST,
  BURN_EDGE,
  CLEAR_MIND,
  OVERLOAD,
  BLOOD_RUSH,
  FORTIFY,
  PATIENCE_STANCE,
  FLOW_SHIFT,
  BALANCE_EDGE,
  GUARD_VIGIL_BANNER,
  BURST_SIGNAL_BANNER,
  JUNK_SLUDGE,
  JUNK_BURN,
  JUNK_STATIC,
  CORE_STAPLE_CARD_IDS,
  COMMON_REWARD_CARD_POOL,
  DEFENSE_LINE_CARD_IDS,
  BURST_LINE_CARD_IDS,
  MOMENTUM_SETUP_CARD_IDS,
  MOMENTUM_PAYOFF_CARD_IDS,
  TEMPO_RECOVERY_CARD_IDS,
} from './starter';
