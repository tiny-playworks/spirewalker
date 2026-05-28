import { describe, test, expect } from '@rstest/core';
import { MONSTER_DEFINITIONS } from '../../src/game/core/definitions/monsters/definitions';
import { ENCOUNTERS } from '../../src/game/core/definitions/encounters';

describe('Encounter wiring', () => {
  test('每条 encounter 的 monsterId 必须存在于 MONSTER_DEFINITIONS', () => {
    for (const enc of ENCOUNTERS) {
      for (const slot of enc.lineup) {
        expect(MONSTER_DEFINITIONS[slot.enemyId]).toBeDefined();
      }
    }
  });
});
