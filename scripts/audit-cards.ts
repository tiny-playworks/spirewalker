import { ALL_CARD_DEFINITIONS } from '../src/game/core/definitions/cards';
import { getCharacterDefinition } from '../src/game/core/definitions/characters';
import type { EffectDefinition } from '../src/game/core/model/card';

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

const cards = Object.values(ALL_CARD_DEFINITIONS);

// 1. Duplicate names (>2)
const nameMap = new Map<string, string[]>();
for (const c of cards) {
  const list = nameMap.get(c.name) || [];
  list.push(c.id);
  nameMap.set(c.name, list);
}
console.log('=== Duplicate Names (>2) ===');
for (const [name, ids] of nameMap) {
  if (ids.length > 2) {
    console.log(`  "${name}" (${ids.length}x): ${ids.join(', ')}`);
  }
}

// 2. Effect fingerprint duplicates
const fpMap = new Map<string, string[]>();
for (const c of cards) {
  const fp = `${c.cost}|${fingerprintEffects(c.effects)}`;
  const list = fpMap.get(fp) || [];
  list.push(c.id);
  fpMap.set(fp, list);
}
console.log('\n=== Effect Fingerprint Duplicates ===');
const dupList: { fp: string; ids: string[] }[] = [];
for (const [fp, ids] of fpMap) {
  if (ids.length > 1) dupList.push({ fp, ids });
}
dupList.sort((a, b) => b.ids.length - a.ids.length);
for (const { fp, ids } of dupList.slice(0, 30)) {
  console.log(`  [${ids.length}x] ${ids.join(', ')}`);
  console.log(`    fp: ${fp.substring(0, 120)}`);
}

// 3. Description vs effect mismatches
console.log('\n=== Description/Effect Mismatches ===');
for (const c of cards) {
  const descNums = (c.description.match(/\d+/g) || []).map(Number);
  const effectNums: number[] = [];
  for (const e of c.effects) {
    if ('value' in e && typeof e.value === 'number') effectNums.push(e.value);
    if (e.type === 'repeat' && e.effects) {
      for (const ie of e.effects) {
        if ('value' in ie && typeof ie.value === 'number') effectNums.push(ie.value);
      }
    }
    if (e.type === 'apply_status' && typeof e.stacks === 'number') effectNums.push(e.stacks);
  }
  if (descNums.length > 0 && effectNums.length > 0) {
    const descSet = new Set(descNums);
    const effectSet = new Set(effectNums);
    const overlap = [...effectSet].filter(v => descSet.has(v));
    if (overlap.length === 0) {
      console.log(`  ${c.id}: desc=${c.description.substring(0, 60)} effects=${JSON.stringify(effectNums)}`);
    }
  }
}

// 4. Player-facing pool hard gate
console.log('\n=== Player-facing Pool Gate ===');
const character = getCharacterDefinition('walker');
const playerFacingIds = [
  ...new Set([...character.starterDeck, ...character.rewardCardPool]),
];
const missingPlayerFacingIds = playerFacingIds.filter(
  (id) => !ALL_CARD_DEFINITIONS[id],
);
const playerFacingCards = playerFacingIds
  .map((id) => ALL_CARD_DEFINITIONS[id])
  .filter((card) => Boolean(card));
const playerFacingNameMap = new Map<string, string[]>();
const playerFacingFingerprintMap = new Map<string, string[]>();

for (const card of playerFacingCards) {
  const sameName = playerFacingNameMap.get(card.name) ?? [];
  sameName.push(card.id);
  playerFacingNameMap.set(card.name, sameName);

  const fingerprint = JSON.stringify({
    type: card.type,
    cost: card.cost,
    target: card.target,
    effects: fingerprintEffects(card.effects),
  });
  const sameEffect = playerFacingFingerprintMap.get(fingerprint) ?? [];
  sameEffect.push(card.id);
  playerFacingFingerprintMap.set(fingerprint, sameEffect);
}

const duplicatePlayerFacingNames = [...playerFacingNameMap.entries()]
  .filter(([, ids]) => ids.length > 1);
const duplicatePlayerFacingEffects = [...playerFacingFingerprintMap.values()]
  .filter((ids) => ids.length > 1);

console.log(`  cards=${playerFacingCards.length}`);
console.log(`  missing=${JSON.stringify(missingPlayerFacingIds)}`);
console.log(`  duplicateNames=${JSON.stringify(duplicatePlayerFacingNames)}`);
console.log(`  duplicateEffects=${JSON.stringify(duplicatePlayerFacingEffects)}`);

if (
  missingPlayerFacingIds.length > 0
  || duplicatePlayerFacingNames.length > 0
  || duplicatePlayerFacingEffects.length > 0
) {
  process.exitCode = 1;
}

console.log('\nTotal cards:', cards.length);
