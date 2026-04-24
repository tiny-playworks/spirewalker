import { describe, expect, test } from '@rstest/core';
import '@/game/core/definitions/cards/upgradeRules';
import {
  getCardArchetype,
  getDominantArchetype,
  getRelicArchetype,
  summarizeDeckArchetypes,
} from '@/game/core/definitions/cards/archetypes';

describe('card archetypes', () => {
  test('守势线卡（含升级版）都标记为 guard', () => {
    const guardCards = [
      'brace_rhythm',
      'soft_step',
      'held_breath',
      'anchored_breath',
      'stable_mind',
      'patient_cut',
      'anchor_slash',
      'guard_strike',
    ];
    for (const id of guardCards) {
      expect(getCardArchetype(id)).toBe('guard');
      expect(getCardArchetype(id + '+')).toBe('guard');
      expect(getCardArchetype(id + '++')).toBe('guard');
    }
  });

  test('爆发线卡（含升级版）都标记为 burst', () => {
    const burstCards = [
      'burst_strike',
      'snap_strike',
      'quick_release',
      'follow_through',
      'break_opening',
      'full_release',
    ];
    for (const id of burstCards) {
      expect(getCardArchetype(id)).toBe('burst');
      expect(getCardArchetype(id + '+')).toBe('burst');
    }
  });

  test('混合桥梁卡标记为 mixed', () => {
    expect(getCardArchetype('momentum')).toBe('mixed');
    expect(getCardArchetype('tempo_guard')).toBe('mixed');
    expect(getCardArchetype('prime_rhythm')).toBe('mixed');
    expect(getCardArchetype('cash_flow')).toBe('mixed');
    expect(getCardArchetype('release_flow')).toBe('mixed');
  });

  test('基础牌 / 消耗牌 / 污染牌回落为 neutral', () => {
    expect(getCardArchetype('strike')).toBe('neutral');
    expect(getCardArchetype('defend')).toBe('neutral');
    expect(getCardArchetype('skim')).toBe('neutral');
    expect(getCardArchetype('burn_edge')).toBe('neutral');
    expect(getCardArchetype('clear_mind')).toBe('neutral');
    expect(getCardArchetype('junk_sludge')).toBe('neutral');
  });

  test('遗物流派映射覆盖所有已登记遗物', () => {
    expect(getRelicArchetype('burst_emblem')).toBe('burst');
    expect(getRelicArchetype('insight_lens')).toBe('burst');
    expect(getRelicArchetype('quick_fuse')).toBe('burst');
    expect(getRelicArchetype('sighted_edge')).toBe('burst');
    expect(getRelicArchetype('guard_knot')).toBe('guard');
    expect(getRelicArchetype('still_core')).toBe('guard');
    expect(getRelicArchetype('soft_guard')).toBe('guard');
    expect(getRelicArchetype('wind_chime')).toBe('mixed');
    expect(getRelicArchetype('vajra')).toBe('neutral');
    expect(getRelicArchetype('unknown_relic')).toBe('neutral');
  });

  test('getDominantArchetype：守势牌 >= 4 张且领先 2 倍以上才算形成主导', () => {
    expect(getDominantArchetype([])).toBeNull();
    expect(getDominantArchetype(['held_breath', 'held_breath', 'held_breath'])).toBeNull();
    expect(
      getDominantArchetype([
        'held_breath', 'held_breath', 'held_breath', 'held_breath',
      ]),
    ).toBe('guard');
    // 守势 4 / 爆发 3：比例不到 2 倍，不算主导
    expect(
      getDominantArchetype([
        'held_breath', 'held_breath', 'held_breath', 'held_breath',
        'burst_strike', 'burst_strike', 'burst_strike',
      ]),
    ).toBeNull();
    expect(
      getDominantArchetype([
        'burst_strike', 'burst_strike', 'burst_strike', 'burst_strike',
      ]),
    ).toBe('burst');
  });

  test('summarizeDeckArchetypes 能正确统计牌组分布', () => {
    const deck = [
      'strike',
      'strike',
      'defend',
      'held_breath', // guard
      'held_breath+', // guard (升级版)
      'burst_strike', // burst
      'momentum', // mixed
      'junk_sludge', // neutral
    ];
    const result = summarizeDeckArchetypes(deck);
    expect(result.guard).toBe(2);
    expect(result.burst).toBe(1);
    expect(result.mixed).toBe(1);
    expect(result.neutral).toBe(4);
  });
});
