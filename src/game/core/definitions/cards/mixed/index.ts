import type { CardDefinition } from '../../../model/card';
import { MIXED_COMMON_CARDS } from './common';
import { MIXED_UNCOMMON_CARDS } from './uncommon';
import { MIXED_RARE_CARDS } from './rare';
import { MIXED_GENERATED_A } from './generated_a';
import { MIXED_LEGENDARY_CARDS } from './generated_legendary';

// 合并所有混合流派卡牌
export const MIXED_CARDS: Record<string, CardDefinition> = {
  ...MIXED_COMMON_CARDS,
  ...MIXED_UNCOMMON_CARDS,
  ...MIXED_RARE_CARDS,
  ...MIXED_GENERATED_A,
  ...MIXED_LEGENDARY_CARDS,
};

// 导出各稀有度卡牌
export { MIXED_COMMON_CARDS } from './common';
export { MIXED_UNCOMMON_CARDS } from './uncommon';
export { MIXED_RARE_CARDS } from './rare';
