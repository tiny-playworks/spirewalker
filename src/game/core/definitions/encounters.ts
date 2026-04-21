import type { BattleEnemySlot } from '../model/monster';
import type { MapAct } from '../model/map';

export type BattleEncounterTier = 'normal' | 'elite' | 'boss';

export interface EncounterTemplate {
  id: string;
  act: MapAct;
  tier: BattleEncounterTier;
  tableId: string;
  name: string;
  tags: string[];
  enemySlots: BattleEnemySlot[];
}

function slot(unitId: string, name: string, maxHp: number, monsterId: string): BattleEnemySlot {
  return { unitId, name, maxHp, monsterId };
}

const ENCOUNTERS: EncounterTemplate[] = [
  { id: 'act1_normal_press', act: 1, tier: 'normal', tableId: 'act_1_normal', name: '前压巡猎', tags: ['压血型'], enemySlots: [slot('u_enemy_0', '巡猎黏液', 34, 'slime')] },
  { id: 'act1_normal_drain', act: 1, tier: 'normal', tableId: 'act_1_normal', name: '渗蚀软泥', tags: ['消耗型'], enemySlots: [slot('u_enemy_0', '渗蚀黏液', 34, 'slime_sapper')] },
  { id: 'act1_normal_shell', act: 1, tier: 'normal', tableId: 'act_1_normal', name: '壳甲防线', tags: ['叠防型'], enemySlots: [slot('u_enemy_0', '壳甲黏液', 40, 'slime_shell')] },
  { id: 'act1_normal_guard', act: 1, tier: 'normal', tableId: 'act_1_normal', name: '节奏拦截', tags: ['干扰型'], enemySlots: [slot('u_enemy_0', '戒备黏液', 38, 'slime_guard')] },
  { id: 'act1_normal_pair', act: 1, tier: 'normal', tableId: 'act_1_normal', name: '双头围压', tags: ['压血型', '联动型'], enemySlots: [slot('u_enemy_0', '黏液怪 A', 24, 'slime'), slot('u_enemy_1', '黏液怪 B', 24, 'slime')] },
  { id: 'act1_normal_mix', act: 1, tier: 'normal', tableId: 'act_1_normal', name: '干扰外壳', tags: ['干扰型', '叠防型'], enemySlots: [slot('u_enemy_0', '戒备黏液', 26, 'slime_guard'), slot('u_enemy_1', '壳甲黏液', 28, 'slime_shell')] },

  { id: 'act1_elite_open', act: 1, tier: 'elite', tableId: 'act_1_elite', name: '先手税官', tags: ['启动惩罚'], enemySlots: [slot('u_enemy_0', '先手税官', 56, 'slime_elite')] },
  { id: 'act1_elite_layers', act: 1, tier: 'elite', tableId: 'act_1_elite', name: '甲壳督军', tags: ['叠层强化'], enemySlots: [slot('u_enemy_0', '甲壳督军', 60, 'slime_shell')] },
  { id: 'act1_elite_counter', act: 1, tier: 'elite', tableId: 'act_1_elite', name: '构筑猎手', tags: ['反构筑'], enemySlots: [slot('u_enemy_0', '构筑猎手', 58, 'slime_guard')] },
  { id: 'act1_boss_gate', act: 1, tier: 'boss', tableId: 'act_1_boss', name: '沼门领主', tags: ['压血型', '两阶段'], enemySlots: [slot('u_enemy_0', '沼门领主', 108, 'act1_boss_gate')] },

  { id: 'act2_normal_press', act: 2, tier: 'normal', tableId: 'act_2_normal', name: '割压巡猎', tags: ['压血型'], enemySlots: [slot('u_enemy_0', '割压巡猎', 40, 'slime_brute')] },
  { id: 'act2_normal_drain', act: 2, tier: 'normal', tableId: 'act_2_normal', name: '蚀律督工', tags: ['消耗型'], enemySlots: [slot('u_enemy_0', '蚀律督工', 42, 'slime_hexer')] },
  { id: 'act2_normal_shell', act: 2, tier: 'normal', tableId: 'act_2_normal', name: '壁壳看守', tags: ['叠防型'], enemySlots: [slot('u_enemy_0', '壁壳看守', 48, 'slime_bulwark')] },
  { id: 'act2_normal_guard', act: 2, tier: 'normal', tableId: 'act_2_normal', name: '连势断路器', tags: ['干扰型'], enemySlots: [slot('u_enemy_0', '连势断路器', 40, 'slime_breaker')] },
  { id: 'act2_normal_pair', act: 2, tier: 'normal', tableId: 'act_2_normal', name: '夹击巡队', tags: ['压血型', '联动型'], enemySlots: [slot('u_enemy_0', '巡队前锋', 26, 'slime_brute'), slot('u_enemy_1', '巡队后卫', 32, 'slime_bulwark')] },
  { id: 'act2_normal_mix', act: 2, tier: 'normal', tableId: 'act_2_normal', name: '乱拍审讯', tags: ['干扰型', '消耗型'], enemySlots: [slot('u_enemy_0', '审讯黏液', 28, 'slime_hexer'), slot('u_enemy_1', '断拍黏液', 28, 'slime_breaker')] },

  { id: 'act2_elite_open', act: 2, tier: 'elite', tableId: 'act_2_elite', name: '开局征收者', tags: ['启动惩罚'], enemySlots: [slot('u_enemy_0', '开局征收者', 68, 'slime_taxer')] },
  { id: 'act2_elite_layers', act: 2, tier: 'elite', tableId: 'act_2_elite', name: '层壳监工', tags: ['叠层强化'], enemySlots: [slot('u_enemy_0', '层壳监工', 72, 'slime_bulwark')] },
  { id: 'act2_elite_counter', act: 2, tier: 'elite', tableId: 'act_2_elite', name: '连段法官', tags: ['反构筑'], enemySlots: [slot('u_enemy_0', '连段法官', 70, 'slime_counter_judge')] },
  { id: 'act2_boss_silence', act: 2, tier: 'boss', tableId: 'act_2_boss', name: '寂律审判官', tags: ['干扰型', '两阶段'], enemySlots: [slot('u_enemy_0', '寂律审判官', 128, 'act2_boss_silence')] },

  { id: 'act3_normal_press', act: 3, tier: 'normal', tableId: 'act_3_normal', name: '裂压兽', tags: ['压血型'], enemySlots: [slot('u_enemy_0', '裂压兽', 48, 'slime_reaver')] },
  { id: 'act3_normal_drain', act: 3, tier: 'normal', tableId: 'act_3_normal', name: '灰烬蛭', tags: ['消耗型'], enemySlots: [slot('u_enemy_0', '灰烬蛭', 46, 'slime_exhauster')] },
  { id: 'act3_normal_shell', act: 3, tier: 'normal', tableId: 'act_3_normal', name: '堡垒之口', tags: ['叠防型'], enemySlots: [slot('u_enemy_0', '堡垒之口', 54, 'slime_fortress')] },
  { id: 'act3_normal_guard', act: 3, tier: 'normal', tableId: 'act_3_normal', name: '相位干扰器', tags: ['干扰型'], enemySlots: [slot('u_enemy_0', '相位干扰器', 45, 'slime_jammer')] },
  { id: 'act3_normal_pair', act: 3, tier: 'normal', tableId: 'act_3_normal', name: '终结围猎', tags: ['压血型', '联动型'], enemySlots: [slot('u_enemy_0', '终结者', 34, 'slime_reaver'), slot('u_enemy_1', '干扰器', 30, 'slime_jammer')] },
  { id: 'act3_normal_mix', act: 3, tier: 'normal', tableId: 'act_3_normal', name: '复合高压', tags: ['叠防型', '消耗型'], enemySlots: [slot('u_enemy_0', '堡垒之口', 34, 'slime_fortress'), slot('u_enemy_1', '灰烬蛭', 30, 'slime_exhauster')] },

  { id: 'act3_elite_open', act: 3, tier: 'elite', tableId: 'act_3_elite', name: '起手掠夺者', tags: ['启动惩罚'], enemySlots: [slot('u_enemy_0', '起手掠夺者', 82, 'slime_raider_elite')] },
  { id: 'act3_elite_layers', act: 3, tier: 'elite', tableId: 'act_3_elite', name: '壁垒总管', tags: ['叠层强化'], enemySlots: [slot('u_enemy_0', '壁垒总管', 88, 'slime_fortress')] },
  { id: 'act3_elite_counter', act: 3, tier: 'elite', tableId: 'act_3_elite', name: '构筑终审者', tags: ['反构筑'], enemySlots: [slot('u_enemy_0', '构筑终审者', 84, 'slime_counter_final')] },
  { id: 'act3_boss_crown', act: 3, tier: 'boss', tableId: 'act_3_boss', name: '冠冕吞噬者', tags: ['高爆发', '两阶段'], enemySlots: [slot('u_enemy_0', '冠冕吞噬者', 152, 'act3_boss_crown')] },
];

const ENCOUNTER_BY_ID = Object.fromEntries(ENCOUNTERS.map((encounter) => [encounter.id, encounter])) as Record<string, EncounterTemplate>;

export function getEncounterById(id: string): EncounterTemplate | undefined {
  return ENCOUNTER_BY_ID[id];
}

export function listEncountersByActAndTier(act: MapAct, tier: BattleEncounterTier): EncounterTemplate[] {
  return ENCOUNTERS.filter((encounter) => encounter.act === act && encounter.tier === tier);
}

export function resolveEncounterTemplate(act: MapAct, tableId: string | null, nodeId: string, seed: number): EncounterTemplate {
  const tier = tableId?.includes('boss') ? 'boss' : tableId?.includes('elite') ? 'elite' : 'normal';
  const pool = listEncountersByActAndTier(act, tier);
  if (pool.length === 0) {
    throw new Error(`No encounter templates for act=${act}, table=${tableId}`);
  }
  const hash = [...nodeId].reduce((sum, ch) => Math.imul(sum, 33) + ch.charCodeAt(0), seed >>> 0) >>> 0;
  return pool[hash % pool.length]!;
}
