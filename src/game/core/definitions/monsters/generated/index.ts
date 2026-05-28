import type { EnemyDefinition } from '../definitions';
import { GENERATED_ENEMIES } from './generated_enemies';

export const ALL_GENERATED_ENEMIES: Record<string, EnemyDefinition> = {
  ...GENERATED_ENEMIES,
};

export const GENERATED_ENEMY_IDS = Object.keys(ALL_GENERATED_ENEMIES);

export const GENERATED_ENEMIES_BY_CHAPTER: Record<number, EnemyDefinition[]> = {
  1: Object.values(ALL_GENERATED_ENEMIES).filter(e => e.chapter === 1),
  2: Object.values(ALL_GENERATED_ENEMIES).filter(e => e.chapter === 2),
  3: Object.values(ALL_GENERATED_ENEMIES).filter(e => e.chapter === 3),
};

export const GENERATED_ENEMIES_BY_TIER: Record<string, EnemyDefinition[]> = {
  normal: Object.values(ALL_GENERATED_ENEMIES).filter(e => e.tier === 'normal'),
  elite: Object.values(ALL_GENERATED_ENEMIES).filter(e => e.tier === 'elite'),
  boss: Object.values(ALL_GENERATED_ENEMIES).filter(e => e.tier === 'boss'),
};
