import { describe, test, expect } from '@rstest/core';
import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';

const HOOKED_RELIC_IDS = [
  'momentum_siphon', 'bulwark_heart', 'stone_bulwark', 'echo_plating', 'flow_anchor',
  'bulwark_sigil', 'fortify_root', 'tide_walker', 'cycle_engine', 'alternating_crest',
  'chain_bolt', 'guard_momentum_link', 'sanctuary_bell', 'void_charm', 'echo_charm',
  'memory_shard', 'meditation_stone', 'flow_resonance', 'draw_power_sigil',
  'resonance_plating',
];

function sourceHasRelicId(id: string): boolean {
  const dirs = [
    resolve('src/game/core/systems/battle'),
    resolve('src/game/core/engine'),
  ];
  for (const dir of dirs) {
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.ts')) continue;
      const content = readFileSync(resolve(dir, file), 'utf8');
      if (content.includes(`'${id}'`) || content.includes(`"${id}"`)) return true;
    }
  }
  return false;
}

describe('Generated relic runtime hooks', () => {
  test.each(HOOKED_RELIC_IDS)('%s has includes() reference in battle/engine code', (id) => {
    expect(sourceHasRelicId(id)).toBe(true);
  });
});
