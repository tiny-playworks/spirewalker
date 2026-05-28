import { describe, expect, test } from '@rstest/core';
import { isRewardEligible } from '@/game/core/definitions/cards/rewardPoolRules';
import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
import { generateCardRewardChoices } from '@/game/core/engine/generateRewardChoices';

describe('reward/rewardPoolRules', () => {
  test('junk_* 污染牌不进池', () => {
    for (const [id, def] of Object.entries(CARD_DEFINITIONS)) {
      if (id.startsWith('junk_')) {
        expect(isRewardEligible(id, def)).toBe(false);
      }
    }
  });

  test('neutral_common_* 填充牌不进池', () => {
    for (const [id, def] of Object.entries(CARD_DEFINITIONS)) {
      if (id.startsWith('neutral_common_')) {
        expect(isRewardEligible(id, def)).toBe(false);
      }
    }
  });

  test('curse/status 不进池', () => {
    for (const [id, def] of Object.entries(CARD_DEFINITIONS)) {
      if (def.type === 'curse' || def.type === 'status') {
        expect(isRewardEligible(id, def)).toBe(false);
      }
    }
  });

  test('strike/defend 不进池', () => {
    expect(isRewardEligible('strike', CARD_DEFINITIONS['strike']!)).toBe(false);
    expect(isRewardEligible('defend', CARD_DEFINITIONS['defend']!)).toBe(false);
  });

  test('负费用牌不进池', () => {
    for (const [id, def] of Object.entries(CARD_DEFINITIONS)) {
      if (def.cost < 0) {
        expect(isRewardEligible(id, def)).toBe(false);
      }
    }
  });

  test('设计牌仍在池中', () => {
    const mustExist = [
      'fortify', 'guard_strike', 'burst_strike', 'momentum',
      'tempo_guard', 'anchor_slash', 'patient_cut', 'flow_shift',
      'balance_edge', 'overload', 'blood_rush',
    ];
    for (const id of mustExist) {
      const def = CARD_DEFINITIONS[id];
      expect(def).toBeDefined();
      expect(isRewardEligible(id, def!)).toBe(true);
    }
  });

  test('角色池规模合理（~180–230，含 uncommon/rare）', () => {
    const pool = getCharacterDefinition('walker').rewardCardPool;
    expect(pool.length).toBeGreaterThanOrEqual(180);
    expect(pool.length).toBeLessThanOrEqual(230);
  });

  test('generateCardRewardChoices 返回 3 张不重复卡牌', () => {
    for (let salt = 0; salt < 50; salt++) {
      const choices = generateCardRewardChoices(1000, salt, 'normal', 'walker', 1);
      expect(choices.length).toBeGreaterThan(0);
      expect(choices.length).toBeLessThanOrEqual(3);
      expect(new Set(choices).size).toBe(choices.length);
    }
  });

  test('50 salt 下 generateCardRewardChoices 无重复崩溃', () => {
    for (let salt = 0; salt < 50; salt++) {
      const choices = generateCardRewardChoices(42, salt, 'normal', 'walker', 1);
      expect(choices.length).toBeGreaterThan(0);
      expect(new Set(choices).size).toBe(choices.length);
    }
  });
});
