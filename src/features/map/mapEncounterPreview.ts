import {
  getEncounterById,
  selectEncounterForNode,
  type PressureProfile,
} from '@/game/core/definitions/encounters';
import { getMonsterDefinition } from '@/game/core/definitions/monsters';
import type { MapNode } from '@/game/core/model/map';
import type { RunState } from '@/game/core/model/run';
import { getEnemyVisual } from '@/features/battle/enemyVisuals';

const PRESSURE_COPY: Record<PressureProfile, { label: string; hint: string }> = {
  frontload: { label: '前压', hint: '优先保住前两回合，别急着透支防御。' },
  attrition: { label: '消耗', hint: '准备稳定格挡与续航，避免被慢慢磨空。' },
  snowball: { label: '成长', hint: '优先处理会分裂、召唤或持续成长的单位。' },
  disruption: { label: '干扰', hint: '保留低费牌与过牌，避免关键回合断档。' },
  execution_check: { label: '斩杀检定', hint: '尽快建立连势，在重击前兑现爆发。' },
};

const TAG_LABELS: Record<string, string> = {
  split: '分裂增殖',
  heavy: '蓄力重击',
  double_action: '双重行动',
  lock: '锁牌干扰',
  summoner: '持续召唤',
};

export interface MapEncounterLineupPreview {
  monsterId: string;
  name: string;
  portraitUrl: string;
}

export type MapEncounterPreview =
  | { visibility: 'hidden' }
  | {
      visibility: 'pressure';
      pressureProfile: PressureProfile;
      pressureLabel: string;
      hint: string;
    }
  | {
      visibility: 'exact';
      encounterId: string;
      name: string;
      pressureProfile: PressureProfile;
      pressureLabel: string;
      hint: string;
      tags: string[];
      lineup: MapEncounterLineupPreview[];
    };

function isCombatNode(node: MapNode): boolean {
  return node.type === 'battle' || node.type === 'elite' || node.type === 'boss';
}

/** 只读预览。复用入场选择器，但不写 encounterId 或遭遇历史。 */
export function getMapEncounterPreview(
  run: RunState,
  node: MapNode,
  isReachable: boolean,
): MapEncounterPreview {
  if (!isReachable || !isCombatNode(node)) return { visibility: 'hidden' };

  const encounter = node.encounterId
    ? getEncounterById(node.encounterId)
    : selectEncounterForNode({
        runSeed: run.seed,
        nodeId: node.id,
        nodeDepth: node.depth,
        act: node.act,
        encounterPoolId: node.encounterPoolId,
        runHistory: run.meta.encounterHistory,
      });

  if (!encounter) return { visibility: 'hidden' };
  const pressure = PRESSURE_COPY[encounter.pressureProfile];

  if (node.type === 'battle') {
    return {
      visibility: 'pressure',
      pressureProfile: encounter.pressureProfile,
      pressureLabel: pressure.label,
      hint: pressure.hint,
    };
  }

  return {
    visibility: 'exact',
    encounterId: encounter.id,
    name: encounter.name,
    pressureProfile: encounter.pressureProfile,
    pressureLabel: pressure.label,
    hint: pressure.hint,
    tags: encounter.tags
      .filter((tag) => tag !== 'elite' && tag !== 'boss')
      .map((tag) => TAG_LABELS[tag] ?? tag)
      .slice(0, 2),
    lineup: encounter.lineup.map(({ enemyId }) => ({
      monsterId: enemyId,
      name: getMonsterDefinition(enemyId)?.name ?? enemyId,
      portraitUrl: getEnemyVisual(enemyId).portraitUrl,
    })),
  };
}
