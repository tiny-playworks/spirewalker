import { describe, expect, test } from '@rstest/core';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { normalizeRunState, RUN_SAVE_VERSION } from '@/game/core/persistence/saveRun';
import type { RunState } from '@/game/core/model/run';

describe('normalizeRunState / 新存档版本', () => {
  test('当前版本存档可直接读取', () => {
    const fresh = createMapRun(0x11223344);
    const run = normalizeRunState(structuredClone(fresh));

    expect(run).not.toBeNull();
    expect(run!.saveVersion).toBe(RUN_SAVE_VERSION);
    expect(run!.meta.act).toBe(1);
    expect(run!.meta.actFloor).toBe(1);
    expect(run!.meta.floor).toBe(1);
    expect(run!.meta.validationCompleted).toBe(false);
    expect(run!.meta.enteredAct2EliteBranch).toBe(false);
  });

  test('旧版本存档直接判定为无效，不做迁移', () => {
    const stale = {
      ...createMapRun(0x22334455),
      saveVersion: RUN_SAVE_VERSION - 1,
    } as RunState;

    expect(normalizeRunState(stale)).toBeNull();
  });

  test('缺少 act / actFloor 的旧结构直接判定为无效', () => {
    const fresh = structuredClone(createMapRun(0x33445566));
    const raw = {
      ...fresh,
      meta: {
        floor: fresh.meta.floor,
        gold: fresh.meta.gold,
        characterId: fresh.meta.characterId,
        relics: fresh.meta.relics,
        potions: fresh.meta.potions,
      },
    } as unknown as RunState;

    expect(normalizeRunState(raw)).toBeNull();
  });
});
