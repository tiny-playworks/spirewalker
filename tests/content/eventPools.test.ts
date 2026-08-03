import { describe, test, expect } from '@rstest/core';
import { EVENT_POOLS } from '../../src/game/core/engine/generateBranchingFloor';
import { EVENTS_BY_CHAPTER } from '../../src/game/core/definitions/events';
import { RUNTIME_EVENT_DEFINITIONS, RUNTIME_EVENTS_BY_CHAPTER } from '../../src/game/core/definitions/events/runtime';

describe('Event map pools', () => {
  test('Act1 运行池固定为 12 个正式事件，完整生成库仍保留供审计', () => {
    expect(EVENTS_BY_CHAPTER[1].length).toBeGreaterThanOrEqual(70);
    expect(EVENT_POOLS[1]).toEqual(RUNTIME_EVENTS_BY_CHAPTER[1].map(event => event.id));
    expect(EVENT_POOLS[1]).toHaveLength(12);
    for (const id of EVENT_POOLS[1]) {
      expect(RUNTIME_EVENT_DEFINITIONS[id]).toBeDefined();
    }
  });

  test('Act2 运行池收敛为 4 个正式事件', () => {
    expect(EVENTS_BY_CHAPTER[2].length).toBeGreaterThanOrEqual(3);
    expect(EVENT_POOLS[2]).toEqual(RUNTIME_EVENTS_BY_CHAPTER[2].map(event => event.id));
    expect(EVENT_POOLS[2]).toHaveLength(4);
    for (const id of EVENT_POOLS[2]) {
      expect(RUNTIME_EVENT_DEFINITIONS[id]).toBeDefined();
    }
  });

  test('Act3 运行池暂只保留 legacy 事件', () => {
    expect(EVENTS_BY_CHAPTER[3].length).toBeGreaterThanOrEqual(3);
    expect(EVENT_POOLS[3]).toEqual(RUNTIME_EVENTS_BY_CHAPTER[3].map(event => event.id));
    expect(EVENT_POOLS[3]).toHaveLength(3);
    for (const id of EVENT_POOLS[3]) {
      expect(RUNTIME_EVENT_DEFINITIONS[id]).toBeDefined();
    }
  });

  test('正式事件选项都有可执行结果', () => {
    for (const definition of Object.values(RUNTIME_EVENT_DEFINITIONS)) {
      expect(definition.choices.length).toBeGreaterThan(0);
      for (const choice of definition.choices) {
        expect(choice.text.length).toBeGreaterThan(0);
        expect(choice.outcomes.length).toBeGreaterThan(0);
        for (const outcome of choice.outcomes) {
          expect(outcome.description.length).toBeGreaterThan(0);
          if (outcome.type === 'gain_card') expect(outcome.cardId).toBeDefined();
          if (outcome.type === 'gain_relic') expect(outcome.relicId).toBeDefined();
        }
      }
    }
  });
});
