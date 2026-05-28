import { describe, expect, test } from '@rstest/core';
import { ALL_CARD_DEFINITIONS } from '@/game/core/definitions/cards';
import type { EffectDefinition } from '@/game/core/model/card';

/**
 * 卡牌去重审计（报告型阈值，不阻塞内容迭代）：
 * 1. id 必须唯一（硬约束）
 * 2. 同名 / 同指纹：console 输出 + 宽松上限
 * 3. generated 之间不得完全同指纹（硬约束，允许少量模板复用）
 * 4. description 数值与 effect 粗匹配
 */

function isGeneratedCardId(id: string): boolean {
  return /^(gd_|br_|mx_|nt_)/.test(id);
}

function fingerprintEffects(effects: EffectDefinition[]): string {
  return JSON.stringify(
    effects.map((e) => {
      if (e.type === 'repeat') {
        return { type: 'repeat', times: e.times, inner: fingerprintEffects(e.effects) };
      }
      if (e.type === 'custom') {
        return { type: 'custom', scriptId: e.scriptId, params: e.params };
      }
      return e;
    }),
  );
}

function extractNumbersFromDesc(desc: string): number[] {
  const matches = desc.match(/\d+/g);
  return matches ? matches.map(Number) : [];
}

function extractEffectValues(effects: EffectDefinition[]): number[] {
  const values: number[] = [];
  for (const e of effects) {
    if (e.type === 'repeat') {
      values.push(...extractEffectValues(e.effects));
      continue;
    }
    if (e.type === 'apply_status') {
      values.push(e.stacks);
      continue;
    }
    if ('value' in e && typeof e.value === 'number') {
      values.push(e.value);
    }
  }
  return values;
}

describe('Card Dedup Audit', () => {
  const cards = Object.values(ALL_CARD_DEFINITIONS);

  test('No duplicate card IDs', () => {
    const ids = cards.map((c) => c.id);
    const seen = new Set<string>();
    const dups: string[] = [];
    for (const id of ids) {
      if (seen.has(id)) dups.push(id);
      seen.add(id);
    }
    expect(dups).toEqual([]);
  });

  test('Duplicate names stay within report threshold', () => {
    const nameMap = new Map<string, string[]>();
    for (const c of cards) {
      const list = nameMap.get(c.name) || [];
      list.push(c.id);
      nameMap.set(c.name, list);
    }
    const dups: { name: string; ids: string[] }[] = [];
    for (const [name, ids] of nameMap) {
      if (ids.length > 5) dups.push({ name, ids });
    }
    if (dups.length > 0) {
      console.warn('Duplicate names (>5):', JSON.stringify(dups, null, 2));
    }
    // 批量生成允许模板化命名；后续用 audit:cards 脚本逐步清理
    expect(dups.length).toBeLessThanOrEqual(15);
  });

  test('Effect fingerprint duplicates stay within report threshold', () => {
    const fpMap = new Map<string, string[]>();
    for (const c of cards) {
      const fp = `${c.cost}|${fingerprintEffects(c.effects)}`;
      const list = fpMap.get(fp) || [];
      list.push(c.id);
      fpMap.set(fp, list);
    }
    const dups: { fingerprint: string; ids: string[] }[] = [];
    for (const [fp, ids] of fpMap) {
      if (ids.length > 1) dups.push({ fingerprint: fp, ids });
    }
    if (dups.length > 0) {
      console.warn('Effect fingerprint duplicates:', JSON.stringify(dups.slice(0, 15), null, 2));
    }
    expect(dups.length).toBeLessThanOrEqual(120);
  });

  test('Generated cards do not fully duplicate each other', () => {
    const fpMap = new Map<string, string[]>();
    for (const c of cards) {
      if (!isGeneratedCardId(c.id)) continue;
      const fp = `${c.cost}|${fingerprintEffects(c.effects)}`;
      const list = fpMap.get(fp) || [];
      list.push(c.id);
      fpMap.set(fp, list);
    }
    const generatedOnlyDups: { fingerprint: string; ids: string[] }[] = [];
    for (const [fp, ids] of fpMap) {
      if (ids.length > 1) generatedOnlyDups.push({ fingerprint: fp, ids });
    }
    if (generatedOnlyDups.length > 0) {
      console.warn('Generated-only fingerprint duplicates:', JSON.stringify(generatedOnlyDups.slice(0, 10), null, 2));
    }
    expect(generatedOnlyDups.length).toBeLessThanOrEqual(25);
  });

  test('Description numbers roughly match effect values', () => {
    const mismatches: { id: string; desc: string; effectValues: number[]; descNumbers: number[] }[] = [];
    for (const c of cards) {
      const descNums = extractNumbersFromDesc(c.description);
      const effectNums = extractEffectValues(c.effects);
      if (descNums.length === 0 || effectNums.length === 0) continue;
      // Check if any effect value appears in description
      const descSet = new Set(descNums);
      const effectSet = new Set(effectNums);
      const overlap = [...effectSet].filter((v) => descSet.has(v));
      // If no overlap and both have numbers, flag it
      if (overlap.length === 0 && effectNums.length > 0 && descNums.length > 0) {
        mismatches.push({ id: c.id, desc: c.description, effectValues: effectNums, descNumbers: descNums });
      }
    }
    if (mismatches.length > 0) {
      console.log('Description/effect mismatches:', JSON.stringify(mismatches.slice(0, 10), null, 2));
    }
    // Allow some mismatches for custom effects
    expect(mismatches.length).toBeLessThanOrEqual(20);
  });
});
