import { describe, expect, test } from '@rstest/core';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { markVisitedFromCampTo, pickPredecessorId } from '@/game/core/model/mapGraph';
import { getMapEncounterPreview } from '@/features/map/mapEncounterPreview';

describe('map encounter preview', () => {
  test('可达精英预览与实际入场一致，且预览不修改运行状态', () => {
    const run = createMapRun(27);
    const elite = Object.values(run.map.nodes).find((node) => node.type === 'elite');
    expect(elite).toBeDefined();

    const predecessorId = pickPredecessorId(run.map, elite!.id);
    expect(predecessorId).toBeDefined();
    markVisitedFromCampTo(run.map, predecessorId!);
    run.map.currentNodeId = predecessorId!;

    const historyBefore = structuredClone(run.meta.encounterHistory);
    const encounterIdBefore = elite!.encounterId;
    const preview = getMapEncounterPreview(run, elite!, true);

    expect(preview.visibility).toBe('exact');
    expect(run.meta.encounterHistory).toEqual(historyBefore);
    expect(elite!.encounterId).toBe(encounterIdBefore);

    const { nextRun } = new GameEngine().dispatch(run, {
      type: 'CHOOSE_MAP_NODE',
      nodeId: elite!.id,
    });
    expect(nextRun.battle?.encounter.id).toBe(
      preview.visibility === 'exact' ? preview.encounterId : '',
    );
  });

  test('普通战斗只显示压力，远处节点不泄露遭遇', () => {
    const run = createMapRun(33);
    const battle = Object.values(run.map.nodes).find((node) => node.type === 'battle');
    const elite = Object.values(run.map.nodes).find((node) => node.type === 'elite');

    expect(getMapEncounterPreview(run, battle!, true).visibility).toBe('pressure');
    expect(getMapEncounterPreview(run, elite!, false)).toEqual({ visibility: 'hidden' });
  });
});
