import { describe, expect, test } from '@rstest/core';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
import { rollBossRelicReward } from '@/game/core/definitions/relics';
import { generateCardRewardChoices } from '@/game/core/engine/generateRewardChoices';
import { generateShop } from '@/game/core/engine/generateShop';

const FLAG_CARDS = [
  'overload',
  'blood_rush',
  'fortify',
  'patience_stance',
  'flow_shift',
  'balance_edge',
] as const;

const ARCHETYPE_RELICS = [
  'blaze_core',
  'fractured_blade',
  'iron_heart',
  'counter_sigil',
  'twin_core',
  'harmony_emblem',
] as const;

describe('正式流派内容入口', () => {
  test('行者正式卡池和构筑分支覆盖三派旗帜牌', () => {
    const character = getCharacterDefinition('walker');
    for (const cardId of FLAG_CARDS) {
      expect(character.rewardCardPool).toContain(cardId);
    }
    expect(character.buildBranches.map((branch) => branch.id)).toEqual([
      'guard_line',
      'burst_line',
      'mixed_line',
    ]);
    expect(character.buildBranches.flatMap((branch) => branch.coreCardIds)).toEqual([
      'fortify',
      'patience_stance',
      'overload',
      'blood_rush',
      'flow_shift',
      'balance_edge',
    ]);
  });

  test('正式奖励生成能实际刷出三派旗帜牌', () => {
    const seen = new Set<string>();
    for (let seed = 1; seed <= 3000 && seen.size < FLAG_CARDS.length; seed += 1) {
      for (const act of [1, 2, 3] as const) {
        for (const tier of ['normal', 'elite'] as const) {
          for (const cardId of generateCardRewardChoices(seed, seed * 17, tier, 'walker', act, 1, [])) {
            if ((FLAG_CARDS as readonly string[]).includes(cardId)) seen.add(cardId);
          }
        }
      }
    }
    expect([...seen].sort()).toEqual([...FLAG_CARDS].sort());
  });

  test('正式遗物池、Boss 遗物和商店遗物覆盖三派专属遗物', () => {
    const character = getCharacterDefinition('walker');
    for (const relicId of ARCHETYPE_RELICS) {
      expect(character.rewardRelicPool).toContain(relicId);
    }

    const bossSeen = new Set<string>();
    const shopSeen = new Set<string>();
    for (let seed = 1; seed <= 3000 && (bossSeen.size < ARCHETYPE_RELICS.length || shopSeen.size < ARCHETYPE_RELICS.length); seed += 1) {
      const bossRelic = rollBossRelicReward(seed, seed * 31, [], 'walker');
      if (bossRelic && (ARCHETYPE_RELICS as readonly string[]).includes(bossRelic)) bossSeen.add(bossRelic);

      const shopRelic = generateShop(seed, 1, 1, []).relics[0]?.relicId;
      if (shopRelic && (ARCHETYPE_RELICS as readonly string[]).includes(shopRelic)) shopSeen.add(shopRelic);
    }

    expect([...bossSeen].sort()).toEqual([...ARCHETYPE_RELICS].sort());
    expect([...shopSeen].sort()).toEqual([...ARCHETYPE_RELICS].sort());
  });
});
