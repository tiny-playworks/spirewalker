import type { RelicDefinition } from '../relics';
import { GENERATED_RELICS_1 } from './batch1';
import { GENERATED_RELICS_2 } from './batch2';
import { GENERATED_RELICS_3 } from './batch3';

export const GENERATED_RELICS: Record<string, RelicDefinition> = {
  ...GENERATED_RELICS_1,
  ...GENERATED_RELICS_2,
  ...GENERATED_RELICS_3,
};

export const GENERATED_RELIC_IDS = Object.keys(GENERATED_RELICS);
