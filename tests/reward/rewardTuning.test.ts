import { describe, expect, test } from '@rstest/core';
import { isRewardArchetypeTiltEnabled } from '@/game/core/config/rewardTuning';

describe('reward/rewardTuning', () => {
  test('meta.rewardArchetypeTiltEnabled === false 时关闭', () => {
    expect(isRewardArchetypeTiltEnabled({ rewardArchetypeTiltEnabled: false })).toBe(false);
  });

  test('未传 meta 时与全局开关一致', () => {
    const v = isRewardArchetypeTiltEnabled();
    expect(typeof v).toBe('boolean');
  });

  test('显式 true 不强制关', () => {
    expect(isRewardArchetypeTiltEnabled({ rewardArchetypeTiltEnabled: true })).toBe(
      isRewardArchetypeTiltEnabled(),
    );
  });
});
