import { describe, expect, test } from '@rstest/core';
import { getStatusStacks } from '@/game/core/combat/statusCombat';
import { STATUS_MOMENTUM } from '@/game/core/definitions/statuses';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { resolveGenericEvent } from '@/game/core/systems/event/eventRuntime';
import { chooseMapNodeFlow } from '@/game/core/systems/map/mapFlow';
import { isLegalMapStep } from '@/game/core/model/mapGraph';

describe('event momentum runtime', () => {
  test('gain_momentum is consumed by the next battle only', () => {
    let run = createMapRun(1);
    let nextBattleId: string | undefined;

    for (let seed = 1; seed <= 100 && !nextBattleId; seed += 1) {
      run = createMapRun(seed);
      const currentId = run.map.currentNodeId!;
      nextBattleId = Object.values(run.map.nodes).find(
        (node) => node.type === 'battle' && isLegalMapStep(run.map.nodes, currentId, node.id),
      )?.id;
    }

    expect(nextBattleId).toBeDefined();
    run.screen = { type: 'event', eventId: 'fallen_adventurer' };
    const eventEvents: never[] = [];
    expect(resolveGenericEvent(run, 'fallen_adventurer', 'pray_leave', eventEvents)).toBe(true);
    expect(run.meta.pendingBattleMomentum).toBe(1);

    const battleEvents: never[] = [];
    chooseMapNodeFlow(run, { type: 'CHOOSE_MAP_NODE', nodeId: nextBattleId! }, battleEvents);

    expect(run.screen.type).toBe('battle');
    expect(run.meta.pendingBattleMomentum).toBe(0);
    // 行者本身战斗开始有 1 层连势，事件奖励再叠加 1 层。
    expect(getStatusStacks(run.battle!.units[run.battle!.playerUnitId]!, STATUS_MOMENTUM)).toBe(2);
  });
});
