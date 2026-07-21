export interface EnemyVisualDefinition {
  portraitUrl: string;
  family: 'slime' | 'beast' | 'elite' | 'boss';
}

const SLIMES = new Set(['slime', 'slime_splitter', 'slime_sapper', 'slime_guard', 'slime_shell']);
const ELITES = new Set(['slime_elite', 'act1_executioner', 'act1_twin_hunter', 'act1_debt_monk']);
const BOSSES = new Set(['slime_boss', 'act1_boss_gate']);

export function getEnemyVisual(monsterId: string): EnemyVisualDefinition {
  if (BOSSES.has(monsterId)) return { portraitUrl: '/assets/combat/enemies/hive-mother.webp', family: 'boss' };
  if (ELITES.has(monsterId)) return { portraitUrl: '/assets/combat/enemies/debt-monk.webp', family: 'elite' };
  if (SLIMES.has(monsterId)) return { portraitUrl: '/assets/combat/enemies/mineral-slime.webp', family: 'slime' };
  return { portraitUrl: '/assets/combat/enemies/mire-beast.webp', family: 'beast' };
}
