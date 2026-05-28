import type { CardDefinition } from '../../../model/card';
import { NEUTRAL_COMMON_CARDS } from './common';
import { NEUTRAL_UNCOMMON_CARDS } from './uncommon';
import { NEUTRAL_RARE_CARDS } from './rare';

// 合并所有通用流派卡牌
export const NEUTRAL_CARDS: Record<string, CardDefinition> = {
  ...NEUTRAL_COMMON_CARDS,
  ...NEUTRAL_UNCOMMON_CARDS,
  ...NEUTRAL_RARE_CARDS,
};

// 导出各稀有度卡牌
export { NEUTRAL_COMMON_CARDS } from './common';
export { NEUTRAL_UNCOMMON_CARDS } from './uncommon';
export { NEUTRAL_RARE_CARDS } from './rare';
