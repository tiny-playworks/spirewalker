import { describe, expect, test } from '@rstest/core';
import { ACT2_REWARD_CARD_IDS } from '@/game/core/definitions/act2Content';
import { ACT1_REWARD_CARD_IDS } from '@/game/core/definitions/act1Content';
import { CARD_DEFINITIONS } from '@/game/core/definitions/cards';
import { generateCardRewardChoices } from '@/game/core/engine/generateRewardChoices';
import { FORMAL_RELIC_POOL } from '@/game/core/definitions/relics';

describe('Act 2 正式内容', () => {
  test('正式奖励牌固定为 6 张，三派各 2 张且定义完整', () => {
    expect(ACT2_REWARD_CARD_IDS).toHaveLength(6);
    expect(new Set(ACT2_REWARD_CARD_IDS).size).toBe(6);
    expect(ACT2_REWARD_CARD_IDS.map((id) => CARD_DEFINITIONS[id]?.chapter)).toEqual([
      2, 2, 2, 2, 2, 2,
    ]);
    expect(ACT2_REWARD_CARD_IDS.map((id) => CARD_DEFINITIONS[id]?.archetype)).toEqual([
      'guard', 'guard', 'burst', 'burst', 'mixed', 'mixed',
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
});
