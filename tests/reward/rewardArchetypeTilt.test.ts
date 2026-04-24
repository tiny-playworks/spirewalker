import { describe, expect, test } from '@rstest/core';
import { generateCardRewardChoices } from '@/game/core/engine/generateRewardChoices';
import { getCardArchetype } from '@/game/core/definitions/cards/archetypes';

/**
 * 创始人反馈 #8：奖励三选一对玩家当前主导流派做一点权重倾斜。
 *
 * 验证思路（纯经验分布，不依赖具体 RNG 实现）：跑 100 个不同 seed，对比「牌组已形成
 * 守势主导」 vs 「牌组空」 两种情况下，奖励里的爆发牌总数应该明显更少。
 */

const STRONG_GUARD_DECK = [
  'held_breath',
  'held_breath',
  'held_breath',
  'held_breath',
  'patient_cut',
  'anchored_breath',
];

const STRONG_BURST_DECK = [
  'burst_strike',
  'burst_strike',
  'burst_strike',
  'burst_strike',
  'quick_release',
  'follow_through',
];

function countByArchetype(picks: readonly string[]): Record<string, number> {
  const out: Record<string, number> = { guard: 0, burst: 0, mixed: 0, neutral: 0 };
  for (const id of picks) out[getCardArchetype(id)] += 1;
  return out;
}

describe('奖励流派权重倾斜', () => {
  test('守势牌组主导 → 奖励池里爆发牌出现次数显著少于中性对照', () => {
    const guardRun = { guard: 0, burst: 0, mixed: 0, neutral: 0 };
    const neutralRun = { guard: 0, burst: 0, mixed: 0, neutral: 0 };
    for (let seed = 1; seed <= 100; seed++) {
      const guardPicks = generateCardRewardChoices(seed, 1, 'elite', 'walker', 2, 3, STRONG_GUARD_DECK);
      const neutralPicks = generateCardRewardChoices(seed, 1, 'elite', 'walker', 2, 3, []);
      const gc = countByArchetype(guardPicks);
      const nc = countByArchetype(neutralPicks);
      for (const k of ['guard', 'burst', 'mixed', 'neutral'] as const) {
        guardRun[k] += gc[k]!;
        neutralRun[k] += nc[k]!;
      }
    }
    // 爆发派：守势牌组下应显著低于对照组；给一个宽松的 0.7x 阈值，避免偶发波动。
    expect(guardRun.burst).toBeLessThan(neutralRun.burst * 0.7);
    // 守势派：不应比对照组更少（行者奖励池本就偏守，权重倾斜只需"不回落"即可）。
    expect(guardRun.guard).toBeGreaterThanOrEqual(neutralRun.guard);
  });

  test('爆发牌组主导 → 奖励池里守势牌出现次数明显减少', () => {
    let burstGuardCount = 0;
    let neutralGuardCount = 0;
    for (let seed = 1; seed <= 100; seed++) {
      const burstPicks = generateCardRewardChoices(seed, 2, 'elite', 'walker', 2, 3, STRONG_BURST_DECK);
      const neutralPicks = generateCardRewardChoices(seed, 2, 'elite', 'walker', 2, 3, []);
      burstGuardCount += countByArchetype(burstPicks).guard!;
      neutralGuardCount += countByArchetype(neutralPicks).guard!;
    }
    expect(burstGuardCount).toBeLessThan(neutralGuardCount * 0.75);
  });
});
