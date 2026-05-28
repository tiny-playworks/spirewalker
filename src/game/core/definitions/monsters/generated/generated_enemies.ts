import type { EnemyDefinition } from '../definitions';
import type { CountdownEffect } from '../../../model/battle';

/**
 * 80 generated enemy definitions for SpireWalker.
 *
 * Distribution:
 *   Chapter 1: 30 normal + 4 elite + 2 boss = 36
 *   Chapter 2: 20 normal + 4 elite + 2 boss = 26
 *   Chapter 3: 10 normal + 4 elite + 4 boss = 18
 */

// ─── Intent helpers ──────────────────────────────────────────────────────────
const atk = (value: number) => ({ type: 'attack' as const, value });
const multi = (value: number, hits: number) => ({ type: 'multi_hit' as const, value, hits });
const heavy = (value: number, charge: number) => ({ type: 'heavy_charge' as const, value, charge });
const block = (value: number) => ({ type: 'block' as const, value });
const buff = (statusId: string, value: number) => ({ type: 'buff' as const, statusId, value });
const scale = (stat: 'strength' | 'armor', value: number) => ({ type: 'scale' as const, stat, value });
const debuff = (statusId: string, value: number) => ({ type: 'debuff' as const, statusId, value });
const summon = (enemyId: string, count: number) => ({ type: 'summon' as const, enemyId, count });
const deathBurst = (damage: number) => ({ type: 'death_burst' as const, damage });
const thorns = (damage: number) => ({ type: 'thorns' as const, damage });
const reactive = (damage: number) => ({ type: 'reactive' as const, damage });
const counter = (threshold: number, damage: number) => ({ type: 'counter' as const, threshold, damage });
const heal = (value: number, target: 'self' | 'ally_lowest' | 'all_enemies') => ({ type: 'heal' as const, value, target });
const leech = (attack: number, healRatio: number) => ({ type: 'leech' as const, attack, healRatio });
const countdown = (turns: number, effect: CountdownEffect) => ({ type: 'countdown' as const, turns, effect });
const pollute = (count: number, cardId = 'junk_sludge') => ({ type: 'pollute_draw' as const, count, cardId });
const lockHand = (count: number) => ({ type: 'lock_hand' as const, count });
const drawPressure = (value: number) => ({ type: 'draw_pressure' as const, value });
const maxHpDown = (value: number) => ({ type: 'max_hp_down' as const, value });
const phaseShift = (label: string, phase: number) => ({ type: 'phase_shift' as const, label, phase });
const reset = (mode: 'momentum' | 'statuses' | 'all') => ({ type: 'mechanic_reset' as const, mode });
const echo = (enemyId?: string, count = 1) => ({ type: 'copy_echo' as const, enemyId, count });
const attackBuff = (attack: number, statusId: string, value: number) => ({ type: 'attack_buff' as const, attack, statusId, value });
const doubleAction = (times: number) => ({ type: 'double_action' as const, times });

export const GENERATED_ENEMIES: Record<string, EnemyDefinition> = {

  // ═══════════════════════════════════════════════════════════════════════════
  //  CHAPTER 1 — 荒原 (30 normal + 4 elite + 2 boss = 36)
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Ch1 Normal (30) ──────────────────────────────────────────────────────

  gen_en_rusty_skeleton: {
    id: 'gen_en_rusty_skeleton',
    name: '锈骨骷髅',
    chapter: 1,
    tier: 'normal',
    role: 'frontliner',
    hpRange: [22, 30],
    ai: {
      archetype: 'attacker',
      rotation: [atk(7), atk(10), atk(7)],
    },
    tags: ['undead', 'physical', 'basic'],
  },

  gen_en_burrowing_worm: {
    id: 'gen_en_burrowing_worm',
    name: '掘地虫',
    chapter: 1,
    tier: 'normal',
    role: 'frontliner',
    hpRange: [28, 38],
    ai: {
      archetype: 'attacker',
      rotation: [atk(9), atk(13)],
    },
    tags: ['beast', 'physical', 'frontload'],
  },

  gen_en_plague_rat: {
    id: 'gen_en_plague_rat',
    name: '瘟疫鼠',
    chapter: 1,
    tier: 'normal',
    role: 'carry',
    hpRange: [20, 26],
    ai: {
      archetype: 'multi_hit',
      rotation: [multi(2, 3), atk(6)],
    },
    tags: ['beast', 'poison', 'multi_hit'],
  },

  gen_en_ash_crawler: {
    id: 'gen_en_ash_crawler',
    name: '灰烬爬行者',
    chapter: 1,
    tier: 'normal',
    role: 'backliner',
    hpRange: [24, 32],
    ai: {
      archetype: 'debuffer',
      rotation: [debuff('weak', 2), atk(8), debuff('weak', 2)],
    },
    tags: ['undead', 'debuff', 'attrition'],
  },

  gen_en_bone_thrower: {
    id: 'gen_en_bone_thrower',
    name: '掷骨者',
    chapter: 1,
    tier: 'normal',
    role: 'backliner',
    hpRange: [22, 28],
    ai: {
      archetype: 'attacker',
      rotation: [atk(11), atk(6), atk(11)],
    },
    tags: ['undead', 'ranged', 'frontload'],
  },

  gen_en_fang_weaver: {
    id: 'gen_en_fang_weaver',
    name: '织牙者',
    chapter: 1,
    tier: 'normal',
    role: 'support',
    hpRange: [26, 34],
    ai: {
      archetype: 'scaler',
      rotation: [buff('strength', 1), atk(8), buff('strength', 1)],
    },
    tags: ['cultist', 'scaler', 'snowball'],
  },

  gen_en_thorn_vine: {
    id: 'gen_en_thorn_vine',
    name: '荆棘藤蔓',
    chapter: 1,
    tier: 'normal',
    role: 'tank',
    hpRange: [30, 40],
    ai: {
      archetype: 'reactive',
      rotation: [thorns(3), block(6), thorns(3), atk(7)],
    },
    tags: ['plant', 'reactive', 'attrition'],
  },

  gen_en_blighted_sapling: {
    id: 'gen_en_blighted_sapling',
    name: '腐化树苗',
    chapter: 1,
    tier: 'normal',
    role: 'support',
    hpRange: [28, 36],
    ai: {
      archetype: 'debuffer',
      rotation: [debuff('vulnerable', 2), atk(6)],
    },
    tags: ['plant', 'debuff', 'support'],
  },

  gen_en_iron_goblet: {
    id: 'gen_en_iron_goblet',
    name: '铁盏卫士',
    chapter: 1,
    tier: 'normal',
    role: 'tank',
    hpRange: [34, 42],
    ai: {
      archetype: 'defender',
      rotation: [block(10), atk(6), block(10)],
    },
    tags: ['construct', 'armor', 'defensive'],
  },

  gen_en_cinder_imp: {
    id: 'gen_en_cinder_imp',
    name: '余烬小鬼',
    chapter: 1,
    tier: 'normal',
    role: 'frontliner',
    hpRange: [22, 28],
    ai: {
      archetype: 'attacker',
      rotation: [atk(8), deathBurst(5), atk(8)],
    },
    tags: ['demon', 'death_trigger', 'aggressive'],
  },

  gen_en_moss_golem: {
    id: 'gen_en_moss_golem',
    name: '苔石魔像',
    chapter: 1,
    tier: 'normal',
    role: 'tank',
    hpRange: [38, 45],
    ai: {
      archetype: 'defender',
      rotation: [block(12), atk(7), block(12)],
    },
    tags: ['construct', 'heavy', 'armor'],
  },

  gen_en_scavenger_beetle: {
    id: 'gen_en_scavenger_beetle',
    name: '食腐甲虫',
    chapter: 1,
    tier: 'normal',
    role: 'frontliner',
    hpRange: [24, 32],
    ai: {
      archetype: 'attacker',
      rotation: [atk(6), atk(6), atk(10)],
    },
    tags: ['insect', 'physical', 'multi_attack'],
  },

  gen_en_wailing_spirit: {
    id: 'gen_en_wailing_spirit',
    name: '哀嚎之灵',
    chapter: 1,
    tier: 'normal',
    role: 'backliner',
    hpRange: [20, 26],
    ai: {
      archetype: 'debuffer',
      rotation: [debuff('weak', 2), debuff('vulnerable', 2), atk(6)],
    },
    tags: ['undead', 'spirit', 'debuff'],
  },

  gen_en_crumbling_knight: {
    id: 'gen_en_crumbling_knight',
    name: '崩甲骑士',
    chapter: 1,
    tier: 'normal',
    role: 'frontliner',
    hpRange: [30, 40],
    ai: {
      archetype: 'heavy',
      rotation: [block(6), heavy(14, 1)],
    },
    tags: ['undead', 'heavy', 'execution_check'],
  },

  gen_en_spore_drifter: {
    id: 'gen_en_spore_drifter',
    name: '孢子漂浮体',
    chapter: 1,
    tier: 'normal',
    role: 'support',
    hpRange: [24, 30],
    ai: {
      archetype: 'summoner',
      rotation: [buff('metallicize', 1), heal(4, 'self'), atk(5)],
    },
    tags: ['plant', 'support', 'heal'],
  },

  gen_en_mud_elemental: {
    id: 'gen_en_mud_elemental',
    name: '泥沼元素',
    chapter: 1,
    tier: 'normal',
    role: 'frontliner',
    hpRange: [28, 38],
    ai: {
      archetype: 'attacker',
      rotation: [atk(9), debuff('vulnerable', 1), atk(12)],
    },
    tags: ['elemental', 'physical', 'aggressive'],
  },

  gen_en_ragged_cultist: {
    id: 'gen_en_ragged_cultist',
    name: '褴褛教徒',
    chapter: 1,
    tier: 'normal',
    role: 'carry',
    hpRange: [22, 30],
    ai: {
      archetype: 'scaler',
      rotation: [scale('strength', 2), atk(8), atk(8)],
    },
    tags: ['cultist', 'scaler', 'snowball'],
  },

  gen_en_stone_watchman: {
    id: 'gen_en_stone_watchman',
    name: '石哨兵',
    chapter: 1,
    tier: 'normal',
    role: 'tank',
    hpRange: [32, 42],
    ai: {
      archetype: 'defender',
      rotation: [block(8), atk(6), block(8), atk(8)],
    },
    tags: ['construct', 'defensive', 'attrition'],
  },

  gen_en_whispering_wraith: {
    id: 'gen_en_whispering_wraith',
    name: '低语怨灵',
    chapter: 1,
    tier: 'normal',
    role: 'disruptor',
    hpRange: [22, 28],
    ai: {
      archetype: 'debuffer',
      rotation: [debuff('weak', 2), atk(7), drawPressure(1)],
    },
    tags: ['undead', 'spirit', 'disruption'],
  },

  gen_en_feral_hound: {
    id: 'gen_en_feral_hound',
    name: '狂猎犬',
    chapter: 1,
    tier: 'normal',
    role: 'carry',
    hpRange: [26, 34],
    ai: {
      archetype: 'multi_hit',
      rotation: [multi(3, 2), atk(10)],
    },
    tags: ['beast', 'multi_hit', 'frontload'],
  },

  gen_en_ember_sprite: {
    id: 'gen_en_ember_sprite',
    name: '灰烬精灵',
    chapter: 1,
    tier: 'normal',
    role: 'backliner',
    hpRange: [20, 24],
    ai: {
      archetype: 'attacker',
      rotation: [atk(12), atk(5), atk(12)],
    },
    tags: ['elemental', 'ranged', 'glass_cannon'],
  },

  gen_en_rusted_sentinel: {
    id: 'gen_en_rusted_sentinel',
    name: '锈蚀哨卫',
    chapter: 1,
    tier: 'normal',
    role: 'tank',
    hpRange: [36, 44],
    ai: {
      archetype: 'reactive',
      rotation: [thorns(2), block(8), atk(7)],
    },
    tags: ['construct', 'reactive', 'armor'],
  },

  gen_en_blight_spreader: {
    id: 'gen_en_blight_spreader',
    name: '疫散者',
    chapter: 1,
    tier: 'normal',
    role: 'disruptor',
    hpRange: [24, 32],
    ai: {
      archetype: 'disruptor',
      rotation: [pollute(2), atk(6), drawPressure(1)],
    },
    tags: ['undead', 'pollution', 'disruption'],
  },

  gen_en_cave_bat: {
    id: 'gen_en_cave_bat',
    name: '洞穴蝠',
    chapter: 1,
    tier: 'normal',
    role: 'backliner',
    hpRange: [20, 26],
    ai: {
      archetype: 'multi_hit',
      rotation: [multi(2, 3), atk(7)],
    },
    tags: ['beast', 'multi_hit', 'evasive'],
  },

  gen_en_rotted_scholar: {
    id: 'gen_en_rotted_scholar',
    name: '腐朽学者',
    chapter: 1,
    tier: 'normal',
    role: 'disruptor',
    hpRange: [22, 28],
    ai: {
      archetype: 'trickster',
      rotation: [debuff('vulnerable', 2), lockHand(1), atk(7)],
    },
    tags: ['undead', 'lock', 'attrition'],
  },

  gen_en_ironbound_zombie: {
    id: 'gen_en_ironbound_zombie',
    name: '缚铁僵尸',
    chapter: 1,
    tier: 'normal',
    role: 'frontliner',
    hpRange: [30, 40],
    ai: {
      archetype: 'attacker',
      rotation: [atk(7), atk(7), atk(14)],
    },
    tags: ['undead', 'physical', 'frontload'],
  },

  gen_en_glade_watcher: {
    id: 'gen_en_glade_watcher',
    name: '林间监视者',
    chapter: 1,
    tier: 'normal',
    role: 'support',
    hpRange: [28, 36],
    ai: {
      archetype: 'debuffer',
      rotation: [debuff('weak', 2), buff('metallicize', 1), atk(6)],
    },
    tags: ['plant', 'debuff', 'support'],
  },

  gen_en_broken_puppet: {
    id: 'gen_en_broken_puppet',
    name: '破损傀儡',
    chapter: 1,
    tier: 'normal',
    role: 'frontliner',
    hpRange: [26, 34],
    ai: {
      archetype: 'heavy',
      rotation: [atk(8), block(4), heavy(15, 1)],
    },
    tags: ['construct', 'heavy', 'execution_check'],
  },

  gen_en_swamp_lurker: {
    id: 'gen_en_swamp_lurker',
    name: '沼泽潜伏者',
    chapter: 1,
    tier: 'normal',
    role: 'carry',
    hpRange: [24, 32],
    ai: {
      archetype: 'attacker',
      rotation: [debuff('vulnerable', 1), atk(13)],
    },
    tags: ['beast', 'ambush', 'frontload'],
  },

  gen_en_fallen_soldier: {
    id: 'gen_en_fallen_soldier',
    name: '阵亡士兵',
    chapter: 1,
    tier: 'normal',
    role: 'frontliner',
    hpRange: [28, 38],
    ai: {
      archetype: 'attacker',
      rotation: [atk(8), block(4), atk(11)],
    },
    tags: ['undead', 'physical', 'balanced'],
  },

  // ─── Ch1 Elite (4) ────────────────────────────────────────────────────────

  gen_en_bone_revenant: {
    id: 'gen_en_bone_revenant',
    name: '白骨亡灵',
    chapter: 1,
    tier: 'elite',
    role: 'carry',
    hpRange: [52, 62],
    ai: {
      archetype: 'scaler',
      rotation: [scale('strength', 2), atk(10), atk(14), scale('strength', 2)],
    },
    tags: ['undead', 'elite', 'scaler'],
  },

  gen_en_iron_overseer: {
    id: 'gen_en_iron_overseer',
    name: '铁制监工',
    chapter: 1,
    tier: 'elite',
    role: 'tank',
    hpRange: [58, 68],
    ai: {
      archetype: 'defender',
      rotation: [block(14), thorns(4), heavy(14, 1), block(14)],
    },
    tags: ['construct', 'elite', 'defensive'],
  },

  gen_en_crimson_berserker: {
    id: 'gen_en_crimson_berserker',
    name: '赤红狂战士',
    chapter: 1,
    tier: 'elite',
    role: 'carry',
    hpRange: [50, 58],
    ai: {
      archetype: 'multi_hit',
      rotation: [multi(5, 2), atk(12), multi(5, 3)],
    },
    tags: ['humanoid', 'elite', 'multi_hit'],
  },

  gen_en_cult_high_priest: {
    id: 'gen_en_cult_high_priest',
    name: '教团高阶祭司',
    chapter: 1,
    tier: 'elite',
    role: 'support',
    hpRange: [54, 64],
    ai: {
      archetype: 'summoner',
      rotation: [buff('strength', 2), summon('gen_en_ragged_cultist', 1), heal(10, 'self')],
    },
    tags: ['cultist', 'elite', 'summoner'],
  },

  // ─── Ch1 Boss (2) ─────────────────────────────────────────────────────────

  gen_en_lord_of_rot: {
    id: 'gen_en_lord_of_rot',
    name: '腐朽之主',
    chapter: 1,
    tier: 'boss',
    role: 'carry',
    hpRange: [75, 88],
    ai: {
      archetype: 'scaler',
      phases: [
        {
          label: '腐蚀',
          rotation: [
            phaseShift('腐蚀', 1),
            scale('strength', 2),
            atk(10),
            atk(12),
            debuff('vulnerable', 2),
          ],
        },
        {
          label: '溃烂',
          threshold: 0.45,
          rotation: [
            phaseShift('溃烂', 2),
            multi(6, 2),
            scale('strength', 3),
            maxHpDown(2),
            leech(14, 0.4),
          ],
        },
      ],
    },
    tags: ['boss', 'undead', 'scaler', 'phase'],
  },

  gen_en_ancient_golem: {
    id: 'gen_en_ancient_golem',
    name: '远古石像',
    chapter: 1,
    tier: 'boss',
    role: 'tank',
    hpRange: [82, 100],
    ai: {
      archetype: 'defender',
      phases: [
        {
          label: '石壳',
          rotation: [
            phaseShift('石壳', 1),
            block(16),
            heavy(16, 1),
            thorns(4),
            atk(10),
          ],
        },
        {
          label: '崩裂',
          threshold: 0.5,
          rotation: [
            phaseShift('崩裂', 2),
            counter(3, 8),
            heavy(22, 1),
            thorns(6),
          ],
        },
      ],
    },
    tags: ['boss', 'construct', 'defensive', 'phase'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  CHAPTER 2 — 锻造 (20 normal + 4 elite + 2 boss = 26)
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Ch2 Normal (20) ──────────────────────────────────────────────────────

  gen_en_flame_automaton: {
    id: 'gen_en_flame_automaton',
    name: '焰火机械兵',
    chapter: 2,
    tier: 'normal',
    role: 'frontliner',
    hpRange: [38, 48],
    ai: {
      archetype: 'attacker',
      rotation: [atk(10), atk(14)],
    },
    tags: ['construct', 'fire', 'aggressive'],
  },

  gen_en_spark_drone: {
    id: 'gen_en_spark_drone',
    name: '电火花无人机',
    chapter: 2,
    tier: 'normal',
    role: 'carry',
    hpRange: [35, 42],
    ai: {
      archetype: 'multi_hit',
      rotation: [multi(3, 3), atk(10)],
    },
    tags: ['construct', 'multi_hit', 'frontload'],
  },

  gen_en_cog_shieldbearer: {
    id: 'gen_en_cog_shieldbearer',
    name: '齿轮盾卫',
    chapter: 2,
    tier: 'normal',
    role: 'tank',
    hpRange: [44, 54],
    ai: {
      archetype: 'defender',
      rotation: [block(14), atk(8), block(14)],
    },
    tags: ['construct', 'armor', 'defensive'],
  },

  gen_en_smoke_wraith: {
    id: 'gen_en_smoke_wraith',
    name: '烟雾怨灵',
    chapter: 2,
    tier: 'normal',
    role: 'backliner',
    hpRange: [36, 44],
    ai: {
      archetype: 'debuffer',
      rotation: [debuff('weak', 2), atk(9), debuff('vulnerable', 2)],
    },
    tags: ['undead', 'debuff', 'attrition'],
  },

  gen_en_blast_golem: {
    id: 'gen_en_blast_golem',
    name: '爆破石像',
    chapter: 2,
    tier: 'normal',
    role: 'frontliner',
    hpRange: [35, 42],
    ai: {
      archetype: 'heavy',
      rotation: [countdown(2, { type: 'attack', value: 20 }), atk(8)],
    },
    tags: ['construct', 'heavy', 'execution_check'],
  },

  gen_en_chained_captive: {
    id: 'gen_en_chained_captive',
    name: '锁链囚徒',
    chapter: 2,
    tier: 'normal',
    role: 'disruptor',
    hpRange: [38, 48],
    ai: {
      archetype: 'disruptor',
      rotation: [lockHand(1), atk(10), lockHand(1)],
    },
    tags: ['humanoid', 'lock', 'disruption'],
  },

  gen_en_furnace_elemental: {
    id: 'gen_en_furnace_elemental',
    name: '熔炉元素',
    chapter: 2,
    tier: 'normal',
    role: 'carry',
    hpRange: [40, 50],
    ai: {
      archetype: 'scaler',
      rotation: [scale('strength', 2), atk(11), atk(11)],
    },
    tags: ['elemental', 'fire', 'scaler'],
  },

  gen_en_clockwork_spider: {
    id: 'gen_en_clockwork_spider',
    name: '发条蜘蛛',
    chapter: 2,
    tier: 'normal',
    role: 'carry',
    hpRange: [36, 44],
    ai: {
      archetype: 'multi_hit',
      rotation: [multi(2, 4), atk(8)],
    },
    tags: ['construct', 'multi_hit', 'frontload'],
  },

  gen_en_pollution_slime: {
    id: 'gen_en_pollution_slime',
    name: '污染黏液',
    chapter: 2,
    tier: 'normal',
    role: 'disruptor',
    hpRange: [40, 50],
    ai: {
      archetype: 'disruptor',
      rotation: [pollute(2), atk(9), drawPressure(2)],
    },
    tags: ['slime', 'pollution', 'disruption'],
  },

  gen_en_forge_specter: {
    id: 'gen_en_forge_specter',
    name: '锻炉幽魂',
    chapter: 2,
    tier: 'normal',
    role: 'backliner',
    hpRange: [36, 44],
    ai: {
      archetype: 'debuffer',
      rotation: [debuff('vulnerable', 2), atk(10)],
    },
    tags: ['undead', 'spirit', 'debuff'],
  },

  gen_en_steel_sentinel: {
    id: 'gen_en_steel_sentinel',
    name: '钢铁哨兵',
    chapter: 2,
    tier: 'normal',
    role: 'tank',
    hpRange: [46, 56],
    ai: {
      archetype: 'reactive',
      rotation: [thorns(3), reactive(3), atk(9), block(8)],
    },
    tags: ['construct', 'reactive', 'attrition'],
  },

  gen_en_smelting_hound: {
    id: 'gen_en_smelting_hound',
    name: '熔炼猎犬',
    chapter: 2,
    tier: 'normal',
    role: 'carry',
    hpRange: [38, 46],
    ai: {
      archetype: 'multi_hit',
      rotation: [multi(3, 2), atk(12)],
    },
    tags: ['beast', 'fire', 'multi_hit'],
  },

  gen_en_rust_mage: {
    id: 'gen_en_rust_mage',
    name: '锈蚀法师',
    chapter: 2,
    tier: 'normal',
    role: 'disruptor',
    hpRange: [36, 44],
    ai: {
      archetype: 'trickster',
      rotation: [lockHand(2), atk(8), pollute(1)],
    },
    tags: ['humanoid', 'lock', 'attrition'],
  },

  gen_en_ash_knight: {
    id: 'gen_en_ash_knight',
    name: '灰烬骑士',
    chapter: 2,
    tier: 'normal',
    role: 'frontliner',
    hpRange: [40, 50],
    ai: {
      archetype: 'heavy',
      rotation: [block(8), heavy(18, 1)],
    },
    tags: ['humanoid', 'heavy', 'execution_check'],
  },

  gen_en_piston_giant: {
    id: 'gen_en_piston_giant',
    name: '活塞巨人',
    chapter: 2,
    tier: 'normal',
    role: 'frontliner',
    hpRange: [42, 52],
    ai: {
      archetype: 'attacker',
      rotation: [atk(12), atk(12), atk(8)],
    },
    tags: ['construct', 'physical', 'frontload'],
  },

  gen_en_cinder_sprite: {
    id: 'gen_en_cinder_sprite',
    name: '火星精灵',
    chapter: 2,
    tier: 'normal',
    role: 'support',
    hpRange: [35, 42],
    ai: {
      archetype: 'summoner',
      rotation: [heal(6, 'ally_lowest'), buff('strength', 1), atk(7)],
    },
    tags: ['elemental', 'support', 'heal'],
  },

  gen_en_grinding_wheel: {
    id: 'gen_en_grinding_wheel',
    name: '研磨轮',
    chapter: 2,
    tier: 'normal',
    role: 'carry',
    hpRange: [38, 46],
    ai: {
      archetype: 'multi_hit',
      rotation: [multi(4, 3), atk(10)],
    },
    tags: ['construct', 'multi_hit', 'frontload'],
  },

  gen_en_bolt_wraith: {
    id: 'gen_en_bolt_wraith',
    name: '螺栓怨灵',
    chapter: 2,
    tier: 'normal',
    role: 'backliner',
    hpRange: [36, 44],
    ai: {
      archetype: 'attacker',
      rotation: [atk(13), atk(7), atk(13)],
    },
    tags: ['undead', 'spirit', 'glass_cannon'],
  },

  gen_en_dread_captain: {
    id: 'gen_en_dread_captain',
    name: '恐惧队长',
    chapter: 2,
    tier: 'normal',
    role: 'support',
    hpRange: [38, 48],
    ai: {
      archetype: 'scaler',
      rotation: [buff('strength', 2), atk(10), block(6)],
    },
    tags: ['humanoid', 'buff', 'support'],
  },

  gen_en_volcanic_core: {
    id: 'gen_en_volcanic_core',
    name: '火山核心',
    chapter: 2,
    tier: 'normal',
    role: 'frontliner',
    hpRange: [40, 50],
    ai: {
      archetype: 'attacker',
      rotation: [deathBurst(10), atk(11), atk(11)],
    },
    tags: ['elemental', 'fire', 'death_trigger'],
  },

  // ─── Ch2 Elite (4) ────────────────────────────────────────────────────────

  gen_en_crucible_guardian: {
    id: 'gen_en_crucible_guardian',
    name: '坩埚守护者',
    chapter: 2,
    tier: 'elite',
    role: 'tank',
    hpRange: [72, 84],
    ai: {
      archetype: 'defender',
      rotation: [block(18), thorns(5), heavy(18, 1), block(18)],
    },
    tags: ['construct', 'elite', 'defensive'],
  },

  gen_en_inferno_marshal: {
    id: 'gen_en_inferno_marshal',
    name: '炼狱元帅',
    chapter: 2,
    tier: 'elite',
    role: 'carry',
    hpRange: [68, 80],
    ai: {
      archetype: 'multi_hit',
      rotation: [multi(5, 3), atk(14), attackBuff(10, 'strength', 1)],
    },
    tags: ['humanoid', 'elite', 'fire'],
  },

  gen_en_ward_breaker: {
    id: 'gen_en_ward_breaker',
    name: '破咒者',
    chapter: 2,
    tier: 'elite',
    role: 'disruptor',
    hpRange: [65, 78],
    ai: {
      archetype: 'disruptor',
      rotation: [lockHand(2), maxHpDown(3), atk(12), pollute(2)],
    },
    tags: ['humanoid', 'elite', 'attrition'],
  },

  gen_en_forge_overlord: {
    id: 'gen_en_forge_overlord',
    name: '锻造霸主',
    chapter: 2,
    tier: 'elite',
    role: 'support',
    hpRange: [70, 86],
    ai: {
      archetype: 'summoner',
      rotation: [summon('gen_en_flame_automaton', 1), buff('strength', 2), heal(10, 'all_enemies')],
    },
    tags: ['construct', 'elite', 'summoner'],
  },

  // ─── Ch2 Boss (2) ─────────────────────────────────────────────────────────

  gen_en_core_nexus: {
    id: 'gen_en_core_nexus',
    name: '核心枢纽',
    chapter: 2,
    tier: 'boss',
    role: 'carry',
    hpRange: [95, 118],
    ai: {
      archetype: 'scaler',
      phases: [
        {
          label: '运转',
          rotation: [
            phaseShift('运转', 1),
            atk(11),
            scale('strength', 2),
            atk(14),
            block(10),
          ],
        },
        {
          label: '超载',
          threshold: 0.55,
          rotation: [
            phaseShift('超载', 2),
            multi(6, 2),
            scale('strength', 3),
            heavy(20, 1),
          ],
        },
        {
          label: '崩坏',
          threshold: 0.25,
          rotation: [
            phaseShift('崩坏', 3),
            doubleAction(1),
            multi(8, 2),
            heavy(24, 1),
          ],
        },
      ],
    },
    tags: ['boss', 'construct', 'scaler', 'phase'],
  },

  gen_en_bellows_tyrant: {
    id: 'gen_en_bellows_tyrant',
    name: '风箱暴君',
    chapter: 2,
    tier: 'boss',
    role: 'support',
    hpRange: [90, 110],
    ai: {
      archetype: 'summoner',
      phases: [
        {
          label: '鼓风',
          rotation: [
            phaseShift('鼓风', 1),
            buff('strength', 2),
            summon('gen_en_flame_automaton', 1),
            atk(10),
          ],
        },
        {
          label: '烈焰',
          threshold: 0.45,
          rotation: [
            phaseShift('烈焰', 2),
            multi(4, 3),
            reset('momentum'),
            heavy(22, 1),
          ],
        },
      ],
    },
    tags: ['boss', 'construct', 'summoner', 'phase'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  CHAPTER 3 — 虚空 (10 normal + 4 elite + 4 boss = 18)
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Ch3 Normal (10) ──────────────────────────────────────────────────────

  gen_en_void_tendril: {
    id: 'gen_en_void_tendril',
    name: '虚空触手',
    chapter: 3,
    tier: 'normal',
    role: 'frontliner',
    hpRange: [52, 65],
    ai: {
      archetype: 'attacker',
      rotation: [multi(4, 2), atk(14)],
    },
    tags: ['eldritch', 'multi_hit', 'aggressive'],
  },

  gen_en_entropy_weaver: {
    id: 'gen_en_entropy_weaver',
    name: '熵织者',
    chapter: 3,
    tier: 'normal',
    role: 'disruptor',
    hpRange: [50, 62],
    ai: {
      archetype: 'disruptor',
      rotation: [reset('statuses'), pollute(3), atk(12)],
    },
    tags: ['eldritch', 'disruption', 'control'],
  },

  gen_en_abyssal_stalker: {
    id: 'gen_en_abyssal_stalker',
    name: '深渊潜行者',
    chapter: 3,
    tier: 'normal',
    role: 'carry',
    hpRange: [50, 60],
    ai: {
      archetype: 'multi_hit',
      rotation: [reactive(4), multi(4, 3), atk(14)],
    },
    tags: ['eldritch', 'multi_hit', 'reactive'],
  },

  gen_en_null_horror: {
    id: 'gen_en_null_horror',
    name: '虚无之恐',
    chapter: 3,
    tier: 'normal',
    role: 'backliner',
    hpRange: [55, 68],
    ai: {
      archetype: 'heavy',
      rotation: [countdown(2, { type: 'attack', value: 28 }), atk(10)],
    },
    tags: ['eldritch', 'heavy', 'execution_check'],
  },

  gen_en_reality_rift: {
    id: 'gen_en_reality_rift',
    name: '裂隙行者',
    chapter: 3,
    tier: 'normal',
    role: 'disruptor',
    hpRange: [52, 64],
    ai: {
      archetype: 'trickster',
      rotation: [echo(undefined, 1), lockHand(2), atk(12)],
    },
    tags: ['eldritch', 'copy', 'disruption'],
  },

  gen_en_void_titan_spawn: {
    id: 'gen_en_void_titan_spawn',
    name: '虚空幼体',
    chapter: 3,
    tier: 'normal',
    role: 'tank',
    hpRange: [60, 76],
    ai: {
      archetype: 'defender',
      rotation: [block(20), thorns(5), atk(12)],
    },
    tags: ['eldritch', 'defensive', 'attrition'],
  },

  gen_en_dimensional_shard: {
    id: 'gen_en_dimensional_shard',
    name: '次元碎片',
    chapter: 3,
    tier: 'normal',
    role: 'carry',
    hpRange: [50, 62],
    ai: {
      archetype: 'scaler',
      rotation: [scale('strength', 3), atk(12), leech(10, 0.4)],
    },
    tags: ['eldritch', 'scaler', 'leech'],
  },

  gen_en_corruptor_moth: {
    id: 'gen_en_corruptor_moth',
    name: '腐化飞蛾',
    chapter: 3,
    tier: 'normal',
    role: 'backliner',
    hpRange: [50, 60],
    ai: {
      archetype: 'debuffer',
      rotation: [debuff('weak', 3), debuff('vulnerable', 3), atk(10)],
    },
    tags: ['eldritch', 'debuff', 'attrition'],
  },

  gen_en_gravity_well: {
    id: 'gen_en_gravity_well',
    name: '重力深渊',
    chapter: 3,
    tier: 'normal',
    role: 'tank',
    hpRange: [58, 74],
    ai: {
      archetype: 'reactive',
      rotation: [thorns(5), reactive(4), block(12), atk(11)],
    },
    tags: ['eldritch', 'reactive', 'attrition'],
  },

  gen_en_mind_flayer: {
    id: 'gen_en_mind_flayer',
    name: '噬脑怪',
    chapter: 3,
    tier: 'normal',
    role: 'disruptor',
    hpRange: [52, 64],
    ai: {
      archetype: 'disruptor',
      rotation: [drawPressure(3), pollute(2), maxHpDown(3)],
    },
    tags: ['eldritch', 'disruption', 'attrition'],
  },

  // ─── Ch3 Elite (4) ────────────────────────────────────────────────────────

  gen_en_void_knight: {
    id: 'gen_en_void_knight',
    name: '虚空骑士',
    chapter: 3,
    tier: 'elite',
    role: 'carry',
    hpRange: [85, 105],
    ai: {
      archetype: 'multi_hit',
      rotation: [multi(6, 3), atk(16), attackBuff(12, 'strength', 2)],
    },
    tags: ['eldritch', 'elite', 'multi_hit'],
  },

  gen_en_entropy_colossus: {
    id: 'gen_en_entropy_colossus',
    name: '熵之巨像',
    chapter: 3,
    tier: 'elite',
    role: 'tank',
    hpRange: [90, 115],
    ai: {
      archetype: 'defender',
      rotation: [block(24), thorns(6), heavy(22, 1), counter(3, 10)],
    },
    tags: ['eldritch', 'elite', 'defensive'],
  },

  gen_en_abyssal_whisper: {
    id: 'gen_en_abyssal_whisper',
    name: '深渊低语',
    chapter: 3,
    tier: 'elite',
    role: 'disruptor',
    hpRange: [82, 100],
    ai: {
      archetype: 'trickster',
      rotation: [reset('all'), lockHand(2), maxHpDown(4), atk(14)],
    },
    tags: ['eldritch', 'elite', 'disruption'],
  },

  gen_en_chaos_oracle: {
    id: 'gen_en_chaos_oracle',
    name: '混沌先知',
    chapter: 3,
    tier: 'elite',
    role: 'support',
    hpRange: [84, 108],
    ai: {
      archetype: 'scaler',
      rotation: [heal(12, 'all_enemies'), buff('strength', 3), atk(14)],
    },
    tags: ['eldritch', 'elite', 'support'],
  },

  // ─── Ch3 Boss (4) ─────────────────────────────────────────────────────────

  gen_en_the_devourer: {
    id: 'gen_en_the_devourer',
    name: '吞噬者',
    chapter: 3,
    tier: 'boss',
    role: 'carry',
    hpRange: [130, 155],
    ai: {
      archetype: 'leech',
      phases: [
        {
          label: '饥渴',
          rotation: [
            phaseShift('饥渴', 1),
            leech(12, 0.5),
            atk(14),
            scale('strength', 2),
          ],
        },
        {
          label: '暴食',
          threshold: 0.5,
          rotation: [
            phaseShift('暴食', 2),
            leech(18, 0.6),
            multi(6, 2),
            scale('strength', 3),
          ],
        },
        {
          label: '反刍',
          threshold: 0.2,
          rotation: [
            phaseShift('反刍', 3),
            doubleAction(1),
            leech(20, 0.7),
            heavy(30, 1),
          ],
        },
      ],
    },
    tags: ['boss', 'eldritch', 'leech', 'phase'],
  },

  gen_en_the_architect: {
    id: 'gen_en_the_architect',
    name: '造物主',
    chapter: 3,
    tier: 'boss',
    role: 'support',
    hpRange: [125, 150],
    ai: {
      archetype: 'summoner',
      phases: [
        {
          label: '构想',
          rotation: [
            phaseShift('构想', 1),
            summon('gen_en_void_titan_spawn', 1),
            buff('strength', 2),
            atk(12),
          ],
        },
        {
          label: '扭曲',
          threshold: 0.6,
          rotation: [
            phaseShift('扭曲', 2),
            echo('gen_en_void_knight', 1),
            reset('momentum'),
            multi(8, 2),
          ],
        },
        {
          label: '坍缩',
          threshold: 0.25,
          rotation: [
            phaseShift('坍缩', 3),
            summon('gen_en_entropy_colossus', 1),
            heavy(28, 1),
            maxHpDown(4),
          ],
        },
      ],
    },
    tags: ['boss', 'eldritch', 'summoner', 'phase'],
  },

  gen_en_the_mirror_lord: {
    id: 'gen_en_the_mirror_lord',
    name: '镜界之主',
    chapter: 3,
    tier: 'boss',
    role: 'disruptor',
    hpRange: [120, 148],
    ai: {
      archetype: 'trickster',
      phases: [
        {
          label: '映像',
          rotation: [
            phaseShift('映像', 1),
            echo(undefined, 1),
            pollute(2),
            atk(14),
          ],
        },
        {
          label: '扭曲',
          threshold: 0.5,
          rotation: [
            phaseShift('扭曲', 2),
            reset('all'),
            lockHand(2),
            maxHpDown(3),
          ],
        },
        {
          label: '崩碎',
          threshold: 0.2,
          rotation: [
            phaseShift('崩碎', 3),
            doubleAction(1),
            multi(8, 3),
            reactive(8),
          ],
        },
      ],
    },
    tags: ['boss', 'eldritch', 'copy', 'phase'],
  },

  gen_en_the_eternal_flame: {
    id: 'gen_en_the_eternal_flame',
    name: '永恒之焰',
    chapter: 3,
    tier: 'boss',
    role: 'carry',
    hpRange: [135, 180],
    ai: {
      archetype: 'scaler',
      phases: [
        {
          label: '灼烧',
          rotation: [
            phaseShift('灼烧', 1),
            atk(14),
            scale('strength', 3),
            thorns(5),
          ],
        },
        {
          label: '焚天',
          threshold: 0.6,
          rotation: [
            phaseShift('焚天', 2),
            heavy(26, 1),
            scale('strength', 4),
            atk(18),
          ],
        },
        {
          label: '寂灭',
          threshold: 0.3,
          rotation: [
            phaseShift('寂灭', 3),
            reset('momentum'),
            heavy(32, 1),
            multi(10, 2),
            scale('strength', 5),
          ],
        },
      ],
    },
    tags: ['boss', 'eldritch', 'scaler', 'fire', 'phase'],
  },
};
