import { describe, test, expect } from '@rstest/core';
import { EVENT_POOLS } from '../../src/game/core/engine/generateBranchingFloor';
import { EVENT_DEFINITIONS, EVENTS_BY_CHAPTER } from '../../src/game/core/definitions/events';

describe('Event map pools', () => {
  test('Act1 池接近 Chapter1 全量并含 legacy', () => {
    expect(EVENT_POOLS[1].length).toBeGreaterThanOrEqual(69);
    expect(EVENT_POOLS[1].length).toBeGreaterThanOrEqual(EVENTS_BY_CHAPTER[1].length);
    expect(EVENT_POOLS[1]).toContain('wandering_merchant');
    expect(EVENT_POOLS[1]).toContain('stillness_shrine');
    expect(EVENT_POOLS[1][0]).toBe('wandering_merchant');
    for (const id of EVENT_POOLS[1]) {
      expect(EVENT_DEFINITIONS[id]).toBeDefined();
    }
  });

  test('Act2 池接近 Chapter2 全量并含 legacy', () => {
    expect(EVENT_POOLS[2].length).toBeGreaterThanOrEqual(EVENTS_BY_CHAPTER[2].length);
    expect(EVENT_POOLS[2]).toContain('burst_altar');
    expect(EVENT_POOLS[2]).toContain('purging_pool');
    expect(EVENT_POOLS[2]).toContain('stillness_shrine');
    expect(EVENT_POOLS[2][0]).toBe('burst_altar');
    for (const id of EVENT_POOLS[2]) {
      expect(EVENT_DEFINITIONS[id]).toBeDefined();
    }
  });

  test('Act3 池接近 Chapter3 全量并含 legacy', () => {
    expect(EVENT_POOLS[3].length).toBeGreaterThanOrEqual(EVENTS_BY_CHAPTER[3].length);
    expect(EVENT_POOLS[3]).toContain('burst_altar');
    expect(EVENT_POOLS[3]).toContain('purging_pool');
    expect(EVENT_POOLS[3]).toContain('wandering_merchant');
    expect(EVENT_POOLS[3][0]).toBe('burst_altar');
    for (const id of EVENT_POOLS[3]) {
      expect(EVENT_DEFINITIONS[id]).toBeDefined();
    }
  });
});
