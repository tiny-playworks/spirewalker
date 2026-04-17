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
};

/** Boss 战后随机其一（已拥有的不再出现） */
const BOSS_RELIC_POOL = ['vajra', 'anchor'] as const;

export function rollBossRelicReward(
  seed: number,
  salt: number,
  ownedRelicIds: string[],
): string | null {
  const available = BOSS_RELIC_POOL.filter((id) => !ownedRelicIds.includes(id));
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
