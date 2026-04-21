import { describe, expect, test } from '@rstest/core';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
import { COMMON_REWARD_CARD_POOL } from '@/game/core/definitions/cards/starter';
import { rollBossRelicReward } from '@/game/core/definitions/relics';
import { generateCardRewardChoices } from '@/game/core/engine/generateRewardChoices';

describe('core/rewardPool', () => {
  test('战后卡牌奖励只会来自角色池或通用池', () => {
    const walker = getCharacterDefinition('walker');
    const allowed = new Set([...walker.rewardCardPool, ...COMMON_REWARD_CARD_POOL]);

    for (let salt = 0; salt < 50; salt += 1) {
      const choices = generateCardRewardChoices(77, salt, 'normal', 'walker');
      expect(choices).toHaveLength(3);
      expect(choices.every((cardId) => allowed.has(cardId))).toBe(true);
    }
  });

  test('Boss 遗物奖励优先使用角色遗物池', () => {
    const walker = getCharacterDefinition('walker');

    for (let salt = 0; salt < 30; salt += 1) {
      const relicId = rollBossRelicReward(42, salt, [], 'walker');
      expect(relicId).not.toBeNull();
      expect(walker.rewardRelicPool).toContain(relicId!);
    }
  });

  test('角色遗物池拿空后回落到公共 Boss 遗物池', () => {
    const walker = getCharacterDefinition('walker');
    const relicId = rollBossRelicReward(42, 99, [...walker.rewardRelicPool], 'walker');

    expect(relicId).not.toBeNull();
    expect(walker.rewardRelicPool).not.toContain(relicId!);
  });
});
