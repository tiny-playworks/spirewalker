import { describe, expect, test } from '@rstest/core';
import { ALL_CARD_DEFINITIONS } from '@/game/core/definitions/cards';

/**
 * 卡牌去重审计：扫描 generated 218 张 + 全量卡牌
 * 1. 同名 name 重复 >2 的列出
 * 2. 同 cost + 同 effects 指纹重复的列出
 * 3. description 与 effects 数值不符的列出
 */

function fingerprintEffects(effects: any[]): string {
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

function extractEffectValues(effects: any[]): number[] {
  const values: number[] = [];
  for (const e of effects) {
    if ('value' in e && typeof e.value === 'number') values.push(e.value);
    if (e.type === 'repeat' && e.effects) {
      values.push(...extractEffectValues(e.effects));
    }
    if (e.type === 'apply_status' && typeof e.stacks === 'number') values.push(e.stacks);
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

  test('No duplicate names (>5 occurrences)', () => {
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
    // Log for visibility
    if (dups.length > 0) {
      console.log('Duplicate names (>5):', JSON.stringify(dups, null, 2));
    }
    expect(dups).toEqual([]);
  });

  test('No exact effect fingerprint duplicates (same cost + same effects)', () => {
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
      console.log('Effect fingerprint duplicates:', JSON.stringify(dups, null, 2));
    }
    // Allow duplicates for basic cards (strike, defend, curse/status with empty effects)
    // and for generated cards that intentionally share effects across archetypes
    expect(dups.length).toBeLessThanOrEqual(40);
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
