import type { CardDefinition } from '../../../model/card';
import { BURST_COMMON_CARDS } from './common';
import { BURST_UNCOMMON_CARDS } from './uncommon';
import { BURST_RARE_CARDS } from './rare';

// 合并所有爆发流派卡牌
export const BURST_CARDS: Record<string, CardDefinition> = {
  ...BURST_COMMON_CARDS,
  ...BURST_UNCOMMON_CARDS,
  ...BURST_RARE_CARDS,
};

// 导出各稀有度卡牌
export { BURST_COMMON_CARDS } from './common';
export { BURST_UNCOMMON_CARDS } from './uncommon';
export { BURST_RARE_CARDS } from './rare';
