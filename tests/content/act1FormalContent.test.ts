import { describe, expect, test } from '@rstest/core';
import { ACT1_ENCOUNTER_IDS, ACT1_REWARD_CARD_IDS } from '@/game/core/definitions/act1Content';
import { listEncountersByActAndTier } from '@/game/core/definitions/encounters';

describe('Act 1 正式内容切片', () => {
  test('正式卡池数量固定且 ID 唯一', () => {
    expect(ACT1_REWARD_CARD_IDS).toHaveLength(36);
    expect(new Set(ACT1_REWARD_CARD_IDS).size).toBe(36);
  });

  test('正式遭遇只包含 9 普通、4 精英、2 Boss', () => {
    expect(listEncountersByActAndTier(1, 'normal').map((item) => item.id)).toEqual(ACT1_ENCOUNTER_IDS.normal);
    expect(listEncountersByActAndTier(1, 'elite').map((item) => item.id)).toEqual(ACT1_ENCOUNTER_IDS.elite);
    expect(listEncountersByActAndTier(1, 'boss').map((item) => item.id)).toEqual(ACT1_ENCOUNTER_IDS.boss);
  });
});
