import type { CardDefinition } from '../../../model/card';
import { BURST_COMMON_CARDS } from './common';
import { BURST_UNCOMMON_CARDS } from './uncommon';
import { BURST_RARE_CARDS } from './rare';
import { BURST_GENERATED_B } from './generated_b';

// 合并所有爆发流派卡牌
export const BURST_CARDS: Record<string, CardDefinition> = {
  ...BURST_COMMON_CARDS,
  ...BURST_UNCOMMON_CARDS,
  ...BURST_RARE_CARDS,
  ...BURST_GENERATED_B,
};

// 导出各稀有度卡牌
export { BURST_COMMON_CARDS } from './common';
export { BURST_UNCOMMON_CARDS } from './uncommon';
export { BURST_RARE_CARDS } from './rare';
