import type { CardDefinition } from '../../model/card';
import {
  COMMON_REWARD_CARD_POOL,
  MOMENTUM_SETUP_CARD_IDS,
  MOMENTUM_PAYOFF_CARD_IDS,
  TEMPO_RECOVERY_CARD_IDS,
} from './starter';

const ALWAYS_SKIP = new Set(['strike', 'defend']);

const NEUTRAL_WHITELIST = new Set<string>([
  ...COMMON_REWARD_CARD_POOL,
  ...MOMENTUM_SETUP_CARD_IDS,
  ...MOMENTUM_PAYOFF_CARD_IDS,
  ...TEMPO_RECOVERY_CARD_IDS,
  'burn_edge', 'clear_mind', 'recenter', 'patch_breath', 'second_wind',
  'steady_step', 'survey_field',
]);

export function isRewardEligible(id: string, def: CardDefinition): boolean {
  if (ALWAYS_SKIP.has(id)) return false;
  if (def.type === 'curse' || def.type === 'status') return false;
  if (def.cost < 0) return false;
  if (id.startsWith('junk_')) return false;
  if (id.startsWith('neutral_common_')) return false;

  const archetype = def.archetype ?? 'neutral';
  if (archetype === 'neutral' && !NEUTRAL_WHITELIST.has(id)) return false;

  return true;
}
