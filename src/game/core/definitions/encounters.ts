import { averageEnemyMaxHp, getMonsterDefinition, type EnemyArchetype } from '../definitions/monsters';
import type { EncounterHistoryState } from '../model/run';
import type { BattleEnemySlot } from '../model/monster';
import type { MapAct } from '../model/map';
import { mulberry32 } from '../utils/rng';

export type BattleEncounterTier = 'normal' | 'elite' | 'boss';
export type PressureProfile = 'frontload' | 'attrition' | 'snowball' | 'disruption' | 'execution_check';
export type EncounterPoolId = `act_${MapAct}_${BattleEncounterTier}`;

export interface EncounterLineupSlot {
  slot: string;
  enemyId: string;
  hpOverride?: number;
  flags?: string[];
}

export interface EncounterTemplate {
  id: string;
  chapter: MapAct;
  tier: BattleEncounterTier;
  weight: number;
  name: string;
  tags: string[];
  pressureProfile: PressureProfile;
  banTags?: string[];
  lineup: EncounterLineupSlot[];
}

interface EncounterSelectionInput {
  runSeed: number;
  nodeId: string;
  nodeDepth?: number;
  act: MapAct;
  encounterPoolId: string | null;
  runHistory: EncounterHistoryState;
}

function unitIdAt(index: number): string {
  return `u_enemy_${index}`;
}

function lineup(enemyIds: string[], hpOverrides: Array<number | undefined> = []): EncounterLineupSlot[] {
  return enemyIds.map((enemyId, index) => ({
    slot: unitIdAt(index),
    enemyId,
    hpOverride: hpOverrides[index],
  }));
}

function buildEnemySlots(template: EncounterTemplate): BattleEnemySlot[] {
  return template.lineup.map((entry, index) => {
    const def = getMonsterDefinition(entry.enemyId);
    if (!def) throw new Error(`unknown enemyId in encounter ${template.id}: ${entry.enemyId}`);
    return {
      unitId: entry.slot || unitIdAt(index),
      name: def.name,
      maxHp: entry.hpOverride ?? averageEnemyMaxHp(def),
      monsterId: entry.enemyId,
    };
  });
}

function encounterPoolIdFor(chapter: MapAct, tier: BattleEncounterTier): EncounterPoolId {
  return `act_${chapter}_${tier}`;
}

const ENCOUNTERS: EncounterTemplate[] = [
  { id: 'act1_normal_press', chapter: 1, tier: 'normal', weight: 7, name: '前压巡猎', tags: ['frontload'], pressureProfile: 'frontload', lineup: lineup(['slime']) },
  { id: 'act1_normal_split', chapter: 1, tier: 'normal', weight: 6, name: '分裂巢穴', tags: ['split', 'snowball'], pressureProfile: 'snowball', lineup: lineup(['slime_splitter', 'slime']) },
  { id: 'act1_normal_multi', chapter: 1, tier: 'normal', weight: 4, name: '鼠群突脸', tags: ['multi_hit'], pressureProfile: 'frontload', lineup: lineup(['fang_rat', 'fang_rat'], [28, 28]) },
  { id: 'act1_normal_drain', chapter: 1, tier: 'normal', weight: 8, name: '污染渗蚀', tags: ['pollution', 'disruption'], pressureProfile: 'disruption', lineup: lineup(['slime_sapper', 'parasite']) },
  { id: 'act1_normal_shell', chapter: 1, tier: 'normal', weight: 5, name: '壳甲防线', tags: ['armor', 'reactive'], pressureProfile: 'attrition', lineup: lineup(['slime_shell', 'buff_beetle']) },
  { id: 'act1_normal_scale', chapter: 1, tier: 'normal', weight: 6, name: '狂热围压', tags: ['scaler'], pressureProfile: 'snowball', lineup: lineup(['zealot_recruit', 'mire_toad']) },
  { id: 'act1_normal_tax', chapter: 1, tier: 'normal', weight: 5, name: '拾荒抽税', tags: ['resource_tax', 'disruption'], pressureProfile: 'disruption', lineup: lineup(['slime_guard', 'slime']) },
  { id: 'act1_normal_heavy', chapter: 1, tier: 'normal', weight: 6, name: '重压前哨', tags: ['heavy', 'execution_check'], pressureProfile: 'execution_check', lineup: lineup(['axe_raider', 'buff_beetle']) },
  { id: 'act1_normal_reactive', chapter: 1, tier: 'normal', weight: 4, name: '反制泥沼', tags: ['reactive', 'attrition'], pressureProfile: 'attrition', lineup: lineup(['bone_crow', 'mire_toad']) },

  { id: 'act1_elite_open', chapter: 1, tier: 'elite', weight: 8, name: '黏核母体', tags: ['elite', 'split'], pressureProfile: 'snowball', lineup: lineup(['slime_elite'], [56]) },
  { id: 'act1_elite_heavy', chapter: 1, tier: 'elite', weight: 7, name: '执行者', tags: ['elite', 'heavy'], pressureProfile: 'execution_check', lineup: lineup(['act1_executioner']) },
  { id: 'act1_elite_double', chapter: 1, tier: 'elite', weight: 6, name: '双刃猎手', tags: ['elite', 'double_action'], pressureProfile: 'frontload', lineup: lineup(['act1_twin_hunter']) },
  { id: 'act1_elite_control', chapter: 1, tier: 'elite', weight: 6, name: '收债修士', tags: ['elite', 'lock'], pressureProfile: 'disruption', lineup: lineup(['act1_debt_monk']) },
  { id: 'act1_boss_hive', chapter: 1, tier: 'boss', weight: 8, name: '巢母', tags: ['boss', 'summoner'], pressureProfile: 'snowball', lineup: lineup(['slime_boss']) },
  { id: 'act1_boss_gate', chapter: 1, tier: 'boss', weight: 8, name: '巨兵', tags: ['boss', 'heavy'], pressureProfile: 'execution_check', lineup: lineup(['act1_boss_gate']) },

  { id: 'act2_normal_combo', chapter: 2, tier: 'normal', weight: 7, name: '连击围剿', tags: ['multi_hit'], pressureProfile: 'frontload', lineup: lineup(['combo_assassin', 'mark_hound']) },
  { id: 'act2_normal_reflect', chapter: 2, tier: 'normal', weight: 6, name: '反刺列阵', tags: ['reactive'], pressureProfile: 'attrition', lineup: lineup(['reflect_automaton', 'thorn_shell']) },
  { id: 'act2_normal_curse', chapter: 2, tier: 'normal', weight: 6, name: '咒纹审讯', tags: ['debuff', 'disruption'], pressureProfile: 'disruption', lineup: lineup(['curse_priest', 'card_bailiff']) },
  { id: 'act2_normal_support', chapter: 2, tier: 'normal', weight: 6, name: '鼓点修复', tags: ['support', 'scaler'], pressureProfile: 'snowball', lineup: lineup(['war_drummer', 'field_medic']) },
  { id: 'act2_normal_blast', chapter: 2, tier: 'normal', weight: 5, name: '倒计时爆裂', tags: ['countdown'], pressureProfile: 'execution_check', lineup: lineup(['blast_mite', 'mirror_mage']) },
  { id: 'act2_normal_disrupt', chapter: 2, tier: 'normal', weight: 6, name: '弃牌查封', tags: ['lock', 'pollution'], pressureProfile: 'disruption', lineup: lineup(['discard_eater', 'card_bailiff']) },

  { id: 'act2_elite_open', chapter: 2, tier: 'elite', weight: 8, name: '三人组', tags: ['elite', 'summon'], pressureProfile: 'snowball', lineup: lineup(['slime_taxer']) },
  { id: 'act2_elite_counter', chapter: 2, tier: 'elite', weight: 7, name: '姿态审判官', tags: ['elite', 'counter'], pressureProfile: 'execution_check', lineup: lineup(['slime_counter_judge']) },
  { id: 'act2_elite_forge', chapter: 2, tier: 'elite', weight: 6, name: '灼烧铸机', tags: ['elite', 'pollution'], pressureProfile: 'attrition', lineup: lineup(['act2_forge_elite']) },
  { id: 'act2_elite_lock', chapter: 2, tier: 'elite', weight: 6, name: '锁牌执达者', tags: ['elite', 'lock'], pressureProfile: 'disruption', lineup: lineup(['act2_lock_bailiff']) },
  { id: 'act2_boss_bishop', chapter: 2, tier: 'boss', weight: 8, name: '主教', tags: ['boss', 'control'], pressureProfile: 'disruption', lineup: lineup(['act2_boss_silence']) },
  { id: 'act2_boss_dual', chapter: 2, tier: 'boss', weight: 8, name: '双核怪', tags: ['boss', 'echo'], pressureProfile: 'snowball', lineup: lineup(['act2_dual_core']) },

  { id: 'act3_normal_telegraph', chapter: 3, tier: 'normal', weight: 7, name: '预告处刑', tags: ['countdown'], pressureProfile: 'execution_check', lineup: lineup(['telegraph_drone', 'hidden_assassin']) },
  { id: 'act3_normal_gate', chapter: 3, tier: 'normal', weight: 6, name: '护盾阈值', tags: ['shield_gate'], pressureProfile: 'attrition', lineup: lineup(['shield_nullifier', 'rear_repairer']) },
  { id: 'act3_normal_echo', chapter: 3, tier: 'normal', weight: 6, name: '回声覆写', tags: ['copy', 'control'], pressureProfile: 'disruption', lineup: lineup(['echo_mimic', 'reset_construct']) },
  { id: 'act3_normal_attrition', chapter: 3, tier: 'normal', weight: 6, name: '压榨收割', tags: ['max_hp_down'], pressureProfile: 'attrition', lineup: lineup(['cap_shearer', 'draw_crusher']) },
  { id: 'act3_normal_swarm', chapter: 3, tier: 'normal', weight: 5, name: '秽裂簇群', tags: ['death_trigger'], pressureProfile: 'snowball', lineup: lineup(['death_blight', 'corpse_feeder']) },
  { id: 'act3_normal_speed', chapter: 3, tier: 'normal', weight: 6, name: '高速追猎', tags: ['multi_hit'], pressureProfile: 'frontload', lineup: lineup(['rapid_striker', 'low_hp_punisher']) },

  { id: 'act3_elite_twins', chapter: 3, tier: 'elite', weight: 8, name: '双子', tags: ['elite', 'frontload'], pressureProfile: 'frontload', lineup: lineup(['slime_raider_elite']) },
  { id: 'act3_elite_pollute', chapter: 3, tier: 'elite', weight: 7, name: '卡组污染者', tags: ['elite', 'pollution'], pressureProfile: 'disruption', lineup: lineup(['slime_counter_final']) },
  { id: 'act3_elite_countdown', chapter: 3, tier: 'elite', weight: 6, name: '倒计时怪', tags: ['elite', 'countdown'], pressureProfile: 'execution_check', lineup: lineup(['countdown_abbot']) },
  { id: 'act3_elite_protocol', chapter: 3, tier: 'elite', weight: 6, name: '多协议 AI 怪', tags: ['elite', 'control'], pressureProfile: 'attrition', lineup: lineup(['protocol_ai']) },
  { id: 'act3_boss_gate', chapter: 3, tier: 'boss', weight: 8, name: '守门人', tags: ['boss', 'gate'], pressureProfile: 'execution_check', lineup: lineup(['act3_boss_crown']) },
  { id: 'act3_boss_echo', chapter: 3, tier: 'boss', weight: 8, name: '回声体', tags: ['boss', 'copy'], pressureProfile: 'disruption', lineup: lineup(['act3_echo_body']) },
];

const ENCOUNTER_BY_ID = Object.fromEntries(ENCOUNTERS.map((encounter) => [encounter.id, encounter])) as Record<string, EncounterTemplate>;

function hashString(seed: number, value: string): number {
  let hash = seed >>> 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 16777619) >>> 0;
  }
  return hash >>> 0;
}

function archetypesForEncounter(template: EncounterTemplate): EnemyArchetype[] {
  return template.lineup
    .map((entry) => getMonsterDefinition(entry.enemyId)?.ai.archetype)
    .filter(Boolean) as EnemyArchetype[];
}

function historyEncounters(history: EncounterHistoryState): EncounterTemplate[] {
  return history.ids
    .map((id) => ENCOUNTER_BY_ID[id])
    .filter(Boolean) as EncounterTemplate[];
}

function historyForActTier(
  history: EncounterHistoryState,
  act: MapAct,
  tier: BattleEncounterTier,
): EncounterTemplate[] {
  return historyEncounters(history).filter((encounter) => encounter.chapter === act && encounter.tier === tier);
}

function act1AllowedNormalProfiles(nextBattleIndex: number): PressureProfile[] {
  if (nextBattleIndex <= 3) return ['frontload', 'attrition'];
  if (nextBattleIndex <= 5) return ['frontload', 'attrition', 'disruption'];
  return ['frontload', 'attrition', 'disruption', 'snowball', 'execution_check'];
}

function applyAct1NormalConstraints(
  pool: EncounterTemplate[],
  history: EncounterHistoryState,
  nodeDepth?: number,
): EncounterTemplate[] {
  const normalHistory = historyForActTier(history, 1, 'normal');
  const nextBattleIndex = normalHistory.length + 1;
  const allowedProfiles = act1AllowedNormalProfiles(nextBattleIndex);
  const stagePool = pool.filter((encounter) => allowedProfiles.includes(encounter.pressureProfile));
  const disruptionCount = normalHistory.filter((encounter) => encounter.pressureProfile === 'disruption').length;
  const executionCount = normalHistory.filter((encounter) => encounter.pressureProfile === 'execution_check').length;
  const lastProfile = normalHistory.at(-1)?.pressureProfile;
  const earlyDepth = nodeDepth !== undefined && nodeDepth <= 5;

  const constrained = stagePool.filter((encounter) => {
    if (encounter.pressureProfile === 'disruption' && earlyDepth) {
      if (disruptionCount >= 2) return false;
      if (lastProfile === 'disruption') return false;
    }
    if (encounter.pressureProfile === 'execution_check' && executionCount >= 2) {
      return false;
    }
    return true;
  });

  return constrained.length > 0 ? constrained : stagePool;
}

function applyAct1EliteConstraints(
  pool: EncounterTemplate[],
  history: EncounterHistoryState,
): EncounterTemplate[] {
  const eliteHistory = historyForActTier(history, 1, 'elite');
  if (eliteHistory.length > 0) return pool;
  const firstElitePool = pool.filter((encounter) => encounter.id !== 'act1_elite_open');
  return firstElitePool.length > 0 ? firstElitePool : pool;
}

function scoreEncounter(template: EncounterTemplate, history: EncounterHistoryState): number {
  const lastId = history.ids.at(-1);
  if (lastId === template.id) return 0;
  if (template.banTags?.some((tag) => history.tags.includes(tag))) return 0;

  let score = template.weight;
  const lastTags = history.tags.slice(-4);
  const lastArchetypes = history.archetypes.slice(-4);
  const currentArchetypes = archetypesForEncounter(template);

  if (template.tags.some((tag) => lastTags.filter((item) => item === tag).length >= 2)) score -= 3;
  if (template.tags.includes('scaler') && lastArchetypes.at(-1) === 'scaler') score = 0;
  if (currentArchetypes.some((item) => lastArchetypes.filter((tag) => tag === item).length >= 2)) score -= 2;
  return Math.max(0, score);
}

export function getEncounterById(id: string): EncounterTemplate | undefined {
  return ENCOUNTER_BY_ID[id];
}

export function listEncountersByPool(encounterPoolId: string | null): EncounterTemplate[] {
  if (!encounterPoolId) return [];
  return ENCOUNTERS.filter((encounter) => encounterPoolIdFor(encounter.chapter, encounter.tier) === encounterPoolId);
}

export function listEncountersByActAndTier(act: MapAct, tier: BattleEncounterTier): EncounterTemplate[] {
  return ENCOUNTERS.filter((encounter) => encounter.chapter === act && encounter.tier === tier);
}

export function hydrateEncounterEnemySlots(encounter: EncounterTemplate): BattleEnemySlot[] {
  return buildEnemySlots(encounter);
}

export function selectEncounterForNode({
  runSeed,
  nodeId,
  nodeDepth,
  act,
  encounterPoolId,
  runHistory,
}: EncounterSelectionInput): EncounterTemplate {
  if (runHistory.ids.length === 0 && encounterPoolId === 'act_1_normal') {
    return ENCOUNTER_BY_ID.act1_normal_press!;
  }
  let pool = listEncountersByPool(encounterPoolId).filter((encounter) => encounter.chapter === act);
  if (act === 1 && encounterPoolId === 'act_1_normal') {
    pool = applyAct1NormalConstraints(pool, runHistory, nodeDepth);
  } else if (act === 1 && encounterPoolId === 'act_1_elite') {
    pool = applyAct1EliteConstraints(pool, runHistory);
  }
  if (pool.length === 0) {
    throw new Error(`No encounter templates for act=${act}, pool=${encounterPoolId}`);
  }

  const scored = pool
    .map((encounter) => ({ encounter, score: scoreEncounter(encounter, runHistory) }))
    .filter((entry) => entry.score > 0);
  const candidates = scored.length > 0 ? scored : pool.map((encounter) => ({ encounter, score: encounter.weight }));
  const totalWeight = candidates.reduce((sum, entry) => sum + entry.score, 0);
  const rng = mulberry32(hashString(runSeed ^ act, `${encounterPoolId ?? 'none'}:${nodeId}`));
  let roll = rng() * totalWeight;

  for (const entry of candidates) {
    roll -= entry.score;
    if (roll <= 0) return entry.encounter;
  }
  return candidates[candidates.length - 1]!.encounter;
}

export function resolveEncounterTemplate(
  act: MapAct,
  encounterPoolId: string | null,
  nodeId: string,
  seed: number,
  runHistory: EncounterHistoryState = { ids: [], tags: [], archetypes: [] },
  nodeDepth?: number,
): EncounterTemplate {
  return selectEncounterForNode({
    runSeed: seed,
    nodeId,
    nodeDepth,
    act,
    encounterPoolId,
    runHistory,
  });
}
