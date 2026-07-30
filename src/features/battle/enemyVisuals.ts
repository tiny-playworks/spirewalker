export interface EnemyVisualDefinition {
  portraitUrl: string;
  family: 'slime' | 'beast' | 'humanoid' | 'construct' | 'elite' | 'boss';
}

export const ACT1_ENEMY_VISUAL_IDS = [
  'slime',
  'slime_splitter',
  'fang_rat',
  'slime_sapper',
  'parasite',
  'slime_shell',
  'buff_beetle',
  'zealot_recruit',
  'mire_toad',
  'slime_guard',
  'axe_raider',
  'bone_crow',
  'slime_elite',
  'act1_executioner',
  'act1_twin_hunter',
  'act1_debt_monk',
  'slime_boss',
  'act1_boss_gate',
] as const;

const ENEMY_VISUALS: Record<(typeof ACT1_ENEMY_VISUAL_IDS)[number], EnemyVisualDefinition> = {
  slime: visual('slime', 'slime'),
  slime_splitter: visual('slime_splitter', 'slime'),
  fang_rat: visual('fang_rat', 'beast'),
  slime_sapper: visual('slime_sapper', 'humanoid'),
  parasite: visual('parasite', 'beast'),
  slime_shell: visual('slime_shell', 'humanoid'),
  buff_beetle: visual('buff_beetle', 'beast'),
  zealot_recruit: visual('zealot_recruit', 'humanoid'),
  mire_toad: visual('mire_toad', 'beast'),
  slime_guard: visual('slime_guard', 'humanoid'),
  axe_raider: visual('axe_raider', 'humanoid'),
  bone_crow: visual('bone_crow', 'beast'),
  slime_elite: visual('slime_elite', 'elite'),
  act1_executioner: visual('act1_executioner', 'elite'),
  act1_twin_hunter: visual('act1_twin_hunter', 'elite'),
  act1_debt_monk: { portraitUrl: '/assets/combat/enemies/debt-monk.webp', family: 'elite' },
  slime_boss: { portraitUrl: '/assets/combat/enemies/hive-mother.webp', family: 'boss' },
  act1_boss_gate: visual('act1_boss_gate', 'boss'),
};

function visual(
  id: (typeof ACT1_ENEMY_VISUAL_IDS)[number],
  family: EnemyVisualDefinition['family'],
): EnemyVisualDefinition {
  return { portraitUrl: `/assets/combat/enemies/${id}.webp`, family };
}

export function getEnemyVisual(monsterId: string): EnemyVisualDefinition {
  const visualDefinition = ENEMY_VISUALS[monsterId as keyof typeof ENEMY_VISUALS];
  if (visualDefinition) return visualDefinition;
  return { portraitUrl: '/assets/combat/enemies/mire-beast.webp', family: 'beast' };
}
