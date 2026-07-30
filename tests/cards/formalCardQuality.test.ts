import { describe, expect, test } from '@rstest/core';
import {
  BRACE_RHYTHM,
  BURST_STRIKE,
  CARD_DEFINITIONS,
  PRIME_RHYTHM,
  TEMPO_GUARD,
} from '@/game/core/definitions/cards';
import { getCharacterDefinition } from '@/game/core/definitions/characters';

function formalCardIds(): string[] {
  const character = getCharacterDefinition('walker');
  return [...new Set([...character.starterDeck, ...character.rewardCardPool])];
}

describe('cards/formal player pool quality', () => {
  test('正式池卡名唯一，避免玩家看到同名不同效果', () => {
    const names = formalCardIds().map((id) => CARD_DEFINITIONS[id]!.name);
    expect(new Set(names).size).toBe(names.length);
  });

  test('正式池不存在费用与效果完全相同的重复牌', () => {
    const fingerprints = formalCardIds().map((id) => {
      const card = CARD_DEFINITIONS[id]!;
      return JSON.stringify({
        type: card.type,
        cost: card.cost,
        target: card.target,
        effects: card.effects,
      });
    });
    expect(new Set(fingerprints).size).toBe(fingerprints.length);
  });

  test('守势以过牌换取较低格挡，不再被稳架严格替代', () => {
    expect(TEMPO_GUARD.cost).toBe(BRACE_RHYTHM.cost);
    expect(TEMPO_GUARD.effects).toContainEqual({ type: 'draw', value: 1 });
    expect(BRACE_RHYTHM.effects).not.toContainEqual({ type: 'draw', value: 1 });
  });

  test('初始牌组同时包含起势和兑现牌', () => {
    const starter = getCharacterDefinition('walker').starterDeck;
    expect(starter).toContain(PRIME_RHYTHM.id);
    expect(starter).toContain(BRACE_RHYTHM.id);
    expect(starter).toContain(BURST_STRIKE.id);
  });
});
