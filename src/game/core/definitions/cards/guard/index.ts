import type { CardDefinition } from '../../../model/card';
import { GUARD_COMMON_CARDS } from './common';
import { GUARD_UNCOMMON_CARDS } from './uncommon';
import { GUARD_RARE_CARDS } from './rare';

// 合并所有守势流派卡牌
export const GUARD_CARDS: Record<string, CardDefinition> = {
  ...GUARD_COMMON_CARDS,
  ...GUARD_UNCOMMON_CARDS,
  ...GUARD_RARE_CARDS,
};

// 导出各稀有度卡牌
export { GUARD_COMMON_CARDS } from './common';
export { GUARD_UNCOMMON_CARDS } from './uncommon';
export { GUARD_RARE_CARDS } from './rare';
