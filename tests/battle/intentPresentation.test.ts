import { describe, expect, test } from '@rstest/core';
import { intentValueText } from '@/features/battle/combatAssets';
import { formatMonsterIntentText } from '@/game/core/battleUiText';

describe('敌人意图信息', () => {
  test('反击同时展示触发阈值和伤害', () => {
    const intent = { type: 'counter', threshold: 2, damage: 6 } as const;

    expect(intentValueText(intent)).toBe('≥2 / 6');
    expect(formatMonsterIntentText(intent)).toContain('第 2 张牌');
    expect(formatMonsterIntentText(intent)).toContain('6 点伤害');
  });

  test('锁牌意图在紧凑读数中展示数量', () => {
    expect(intentValueText({ type: 'lock_hand', count: 1 })).toBe('锁1');
  });
});
