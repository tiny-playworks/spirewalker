import { describe, test, expect } from '@rstest/core';
import { EVENT_POOLS } from '../../src/game/core/engine/generateBranchingFloor';
import { EVENT_DEFINITIONS } from '../../src/game/core/definitions/events';

describe('Event map pools', () => {
  test('Act2 池长度 ≥ 8', () => {
    expect(EVENT_POOLS[2].length).toBeGreaterThanOrEqual(8);
  });

  test('Act3 池长度 ≥ 8', () => {
    expect(EVENT_POOLS[3].length).toBeGreaterThanOrEqual(8);
  });

  test('Act2 池每个 id ∈ EVENT_DEFINITIONS', () => {
    for (const id of EVENT_POOLS[2]) {
      expect(EVENT_DEFINITIONS[id]).toBeDefined();
    }
  });

  test('Act3 池每个 id ∈ EVENT_DEFINITIONS', () => {
    for (const id of EVENT_POOLS[3]) {
      expect(EVENT_DEFINITIONS[id]).toBeDefined();
    }
  });

  test('Act1 池保持原有 pilot + legacy', () => {
    expect(EVENT_POOLS[1].length).toBeGreaterThanOrEqual(10);
    expect(EVENT_POOLS[1]).toContain('wandering_merchant');
    expect(EVENT_POOLS[1]).toContain('stillness_shrine');
  });
});
