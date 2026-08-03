import { describe, expect, test } from '@rstest/core';
import {
  ACT2_FORMAL_BOSS_ENCOUNTER_IDS,
  ACT2_FORMAL_ELITE_ENCOUNTER_IDS,
  ACT2_FORMAL_NORMAL_ENCOUNTER_IDS,
  ACT2_REWARD_CARD_IDS,
} from '@/game/core/definitions/act2Content';
import { ACT1_REWARD_CARD_IDS } from '@/game/core/definitions/act1Content';
import { CARD_DEFINITIONS } from '@/game/core/definitions/cards';
import { generateCardRewardChoices } from '@/game/core/engine/generateRewardChoices';
import { FORMAL_RELIC_POOL } from '@/game/core/definitions/relics';
import { getEncounterById } from '@/game/core/definitions/encounters';

describe('Act 2 正式内容', () => {
  test('正式奖励牌固定为 12 张，三派各 4 张且定义完整', () => {
    expect(ACT2_REWARD_CARD_IDS).toHaveLength(12);
    expect(new Set(ACT2_REWARD_CARD_IDS).size).toBe(12);
    expect(ACT2_REWARD_CARD_IDS.map((id) => CARD_DEFINITIONS[id]?.chapter)).toEqual([
      2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    ]);
    expect(ACT2_REWARD_CARD_IDS.map((id) => CARD_DEFINITIONS[id]?.archetype)).toEqual([
      'guard', 'guard', 'guard', 'guard',
      'burst', 'burst', 'burst', 'burst',
      'mixed', 'mixed', 'mixed', 'mixed',
    ]);
  });

  test('Act 2 奖励实际只来自正式牌池', () => {
    const formalIds = new Set<string>([...ACT1_REWARD_CARD_IDS, ...ACT2_REWARD_CARD_IDS]);
    for (let seed = 1; seed <= 200; seed += 1) {
      for (const tier of ['normal', 'elite', 'boss'] as const) {
        for (const cardId of generateCardRewardChoices(seed, seed * 13, tier, 'walker', 2, 1, [])) {
          expect(formalIds.has(cardId)).toBe(true);
        }
      }
    }
  });

  test('正式运行遗物池收敛为 18 件', () => {
    expect(FORMAL_RELIC_POOL).toHaveLength(18);
    expect(new Set(FORMAL_RELIC_POOL).size).toBe(18);
  });

  test('Act 2 遭遇池收敛为 6 普通、3 精英、2 首领', () => {
    expect(ACT2_FORMAL_NORMAL_ENCOUNTER_IDS).toHaveLength(6);
    expect(ACT2_FORMAL_ELITE_ENCOUNTER_IDS).toHaveLength(3);
    expect(ACT2_FORMAL_BOSS_ENCOUNTER_IDS).toHaveLength(2);
    for (const [tier, ids] of [
      ['normal', ACT2_FORMAL_NORMAL_ENCOUNTER_IDS],
      ['elite', ACT2_FORMAL_ELITE_ENCOUNTER_IDS],
      ['boss', ACT2_FORMAL_BOSS_ENCOUNTER_IDS],
    ] as const) {
      for (const id of ids) {
        const encounter = getEncounterById(id);
        expect(encounter?.chapter).toBe(2);
        expect(encounter?.tier).toBe(tier);
      }
    }
  });
});
