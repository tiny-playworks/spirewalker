import { describe, test, expect } from '@rstest/core';
import { RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import { RELIC_HOOKS, RUNTIME_RELIC_IDS } from '@/game/core/systems/relic/relicHooks';

const HOOKED_RELIC_IDS = [
  'momentum_siphon', 'bulwark_heart', 'stone_bulwark', 'echo_plating', 'flow_anchor',
  'bulwark_sigil', 'fortify_root', 'tide_walker', 'cycle_engine', 'alternating_crest',
  'chain_bolt', 'guard_momentum_link', 'sanctuary_bell', 'void_charm', 'echo_charm',
  'memory_shard', 'meditation_stone', 'flow_resonance', 'draw_power_sigil',
  'resonance_plating',
];

describe('Generated relic runtime hooks', () => {
  test.each(HOOKED_RELIC_IDS)('%s has a registered runtime hook', (id) => {
    expect(RELIC_DEFINITIONS[id]).toBeDefined();
    expect(typeof RELIC_HOOKS[id]).toBe('function');
    expect(RUNTIME_RELIC_IDS).toContain(id);
  });
});
