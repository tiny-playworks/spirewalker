import { DEFAULT_CHARACTER_ID, getCharacterDefinition } from './characters';
import type { RunState } from '../model/run';
import { mulberry32 } from '../utils/rng';

export interface RelicDefinition {
  id: string;
  name: string;
  description: string;
}

export const RELIC_DEFINITIONS: Record<string, RelicDefinition> = {
  vajra: {
    id: 'vajra',
    name: '瓦哈纳',
    description: '每场战斗开始时获得 1 层力量。',
  },
  anchor: {
    id: 'anchor',
    name: '船锚',
    description: '拾取时最大生命与当前生命 +5。',
  },
  wind_chime: {
    id: 'wind_chime',
    name: '风铃',
    description: '每场战斗开始时获得 2 层连势。',
  },
  tactical_gloves: {
    id: 'tactical_gloves',
    name: '战术手套',
    description: '每场战斗开始时额外抽 1 张牌。',
  },
  burst_emblem: {
    id: 'burst_emblem',
    name: '裂响纹章',
    description: '主动消耗连势的伤害牌额外造成 2 点伤害。',
  },
  insight_lens: {
    id: 'insight_lens',
    name: '观势镜',
    description: '主动消耗连势的过牌牌额外抽 1 张牌。',
  },
  guard_knot: {
    id: 'guard_knot',
    name: '稳势结',
    description: '你的连势被削减时，少失去 1 层。',
  },
  still_core: {
    id: 'still_core',
    name: '定心核',
    description: '每场战斗开始时获得 1 层金属化。',
  },
  soft_guard: {
    id: 'soft_guard',
    name: '缓护符',
    description: '每场战斗开始时获得 4 点格挡。',
  },
  quick_fuse: {
    id: 'quick_fuse',
    name: '疾燃引线',
    description: '主动消耗连势的伤害牌结算后获得 1 点能量。',
  },
  sighted_edge: {
    id: 'sighted_edge',
    name: '识隙刃',
    description: '主动消耗连势的伤害牌每消耗 1 层连势，额外造成 1 点伤害。',
  },
};

export const MOMENTUM_BURST_RELIC_IDS = ['wind_chime', 'burst_emblem', 'quick_fuse', 'sighted_edge'] as const;
export const MOMENTUM_FLOW_RELIC_IDS = ['tactical_gloves', 'insight_lens'] as const;
export const MOMENTUM_STABILITY_RELIC_IDS = ['guard_knot', 'anchor', 'still_core', 'soft_guard'] as const;
export const COMMON_RELIC_POOL = ['vajra', 'anchor', 'wind_chime', 'tactical_gloves', 'insight_lens'] as const;

/** Boss 战后随机其一（已拥有的不再出现） */
const BOSS_RELIC_POOL = [...COMMON_RELIC_POOL, 'burst_emblem', 'guard_knot', 'still_core', 'soft_guard', 'quick_fuse', 'sighted_edge'] as const;

export function rollBossRelicReward(
  seed: number,
  salt: number,
  ownedRelicIds: string[],
  characterId = DEFAULT_CHARACTER_ID,
): string | null {
  const characterPool = getCharacterDefinition(characterId).rewardRelicPool;
  const preferred = characterPool.filter((id) => !ownedRelicIds.includes(id));
  const available =
    preferred.length > 0
      ? preferred
      : BOSS_RELIC_POOL.filter((id) => !ownedRelicIds.includes(id));
  if (available.length === 0) return null;
  const rng = mulberry32((seed ^ salt ^ 0xb055) >>> 0);
  return available[Math.floor(rng() * available.length)]!;
}

/** 获得遗物时的即时效果（非战斗开局类） */
export function applyRelicPickupEffect(run: RunState, relicId: string): void {
  if (relicId === 'anchor') {
    run.player.maxHp += 5;
    run.player.currentHp += 5;
  }
}
