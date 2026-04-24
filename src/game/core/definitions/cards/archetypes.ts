import { parseCardId } from './upgradeRules';

/**
 * 流派身份标签（对应创始人反馈 #8）：
 *
 * - `guard`：以格挡 / 稳势 / 金属化 / 缓收节奏为主的防守线。
 * - `burst`：以消耗连势或大额单体爆发为主的兑现线。
 * - `mixed`：同时带「起势」与「小额兑现」，兼做承上启下。
 * - `neutral`：基础牌、通用修复、消耗牌、污染牌；不参与分流统计。
 *
 * 该映射只用来做 UI 展示（牌面小圆点、总览面板的流派分布）和将来可选的奖励权重倾斜；
 * 不参与任何战斗规则计算，因此也不需要走 `CardDefinition` 字段——放独立模块即可。
 */
export type CardArchetype = 'guard' | 'burst' | 'mixed' | 'neutral';

export interface ArchetypeDisplayMeta {
  id: CardArchetype;
  name: string;
  shortLabel: string;
  color: string;
  hexColor: number;
}

export const ARCHETYPE_DISPLAY: Record<CardArchetype, ArchetypeDisplayMeta> = {
  guard: { id: 'guard', name: '守势', shortLabel: '守', color: '#6a9dd4', hexColor: 0x6a9dd4 },
  burst: { id: 'burst', name: '爆发', shortLabel: '爆', color: '#d4846a', hexColor: 0xd4846a },
  mixed: { id: 'mixed', name: '混合', shortLabel: '混', color: '#b38ad4', hexColor: 0xb38ad4 },
  neutral: { id: 'neutral', name: '通用', shortLabel: '通', color: '#8a8a8a', hexColor: 0x8a8a8a },
};

/**
 * 按基础卡 id（未带 +/++）登记流派。升级版继承基础卡的流派，见 `getCardArchetype`。
 *
 * 分类依据（2026-04 对齐）：
 * - `guard`：高格挡 / 稳势 / 金属化 / 不消耗连势也能吃 momentum 收益的卡。
 * - `burst`：主动消耗 momentum 的攻击 / 能量兑现 / 破势预热。
 * - `mixed`：同时起势+兑现、或以消耗 momentum 换过牌、与两派都能搭的桥梁牌。
 * - 基础牌 / 污染牌 / 消耗牌 / 通用修复：默认 `neutral`，不列进下表。
 */
const ARCHETYPE_BY_BASE_ID: Record<string, CardArchetype> = {
  // ————————— 守势线 —————————
  brace_rhythm: 'guard',
  soft_step: 'guard',
  held_breath: 'guard',
  anchored_breath: 'guard',
  stable_mind: 'guard',
  patient_cut: 'guard',
  anchor_slash: 'guard',
  guard_strike: 'guard',

  // ————————— 爆发线 —————————
  burst_strike: 'burst',
  snap_strike: 'burst',
  quick_release: 'burst',
  follow_through: 'burst',
  break_opening: 'burst',
  full_release: 'burst',

  // ————————— 混合桥梁 —————————
  momentum: 'mixed',
  tempo_guard: 'mixed',
  prime_rhythm: 'mixed',
  cash_flow: 'mixed',
  release_flow: 'mixed',
};

export function getCardArchetype(cardId: string): CardArchetype {
  const { baseId } = parseCardId(cardId);
  return ARCHETYPE_BY_BASE_ID[baseId] ?? 'neutral';
}

export function getArchetypeDisplay(cardId: string): ArchetypeDisplayMeta {
  return ARCHETYPE_DISPLAY[getCardArchetype(cardId)];
}

/**
 * 统计给定牌组里每个流派的牌数（含 +/++ 升级版），用于 UI 展示流派分布。
 * `neutral` 会单列，上层可自行决定要不要显示。
 */
export function summarizeDeckArchetypes(cardIds: readonly string[]): Record<CardArchetype, number> {
  const counts: Record<CardArchetype, number> = { guard: 0, burst: 0, mixed: 0, neutral: 0 };
  for (const id of cardIds) counts[getCardArchetype(id)] += 1;
  return counts;
}
