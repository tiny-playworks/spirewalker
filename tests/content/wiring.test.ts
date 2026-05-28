import { describe, test, expect } from '@rstest/core';
import { RELIC_DEFINITIONS } from '../../src/game/core/definitions/relics';
import { GENERATED_RELICS } from '../../src/game/core/definitions/generated_relics/index';
import { MONSTER_DEFINITIONS } from '../../src/game/core/definitions/monsters/definitions';
import { ALL_GENERATED_ENEMIES } from '../../src/game/core/definitions/monsters/generated';
import { EVENT_DEFINITIONS } from '../../src/game/core/definitions/events';

describe('Generated content wiring', () => {
  test('GENERATED_RELICS 每个 id ∈ RELIC_DEFINITIONS', () => {
    for (const id of Object.keys(GENERATED_RELICS)) {
      expect(RELIC_DEFINITIONS[id]).toBeDefined();
    }
  });

  test('ALL_GENERATED_ENEMIES 每个 id ∈ MONSTER_DEFINITIONS', () => {
    for (const id of Object.keys(ALL_GENERATED_ENEMIES)) {
      expect(MONSTER_DEFINITIONS[id]).toBeDefined();
    }
  });

  test('EVENT_DEFINITIONS 数量 ≥ 195', () => {
    expect(Object.keys(EVENT_DEFINITIONS).length).toBeGreaterThanOrEqual(195);
  });

  test('随机 10 个 event 结构合法：choices≥2，outcomes 非空', () => {
    const allEvents = Object.values(EVENT_DEFINITIONS);
    // 用固定 seed 确保可重现
    const indices = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180];
    for (const idx of indices) {
      const event = allEvents[idx];
      expect(event).toBeDefined();
      expect(event.choices.length).toBeGreaterThanOrEqual(2);
      for (const choice of event.choices) {
        expect(choice.outcomes.length).toBeGreaterThan(0);
      }
    }
  });
});
