import {
  STATUS_METALLICIZE,
  STATUS_MOMENTUM,
  STATUS_STRENGTH,
  STATUS_VULNERABLE,
  STATUS_WEAK,
} from "../statuses";
import type {
  CountdownEffect,
  MonsterIntent,
  MonsterRuntimeState,
} from "../../model/battle";

export type EnemyId = string;
export type EnemyTier = "normal" | "elite" | "boss";
export type EnemyRole =
  | "frontliner"
  | "backliner"
  | "support"
  | "carry"
  | "disruptor"
  | "tank";
export type EnemyArchetype =
  | "attacker"
  | "multi_hit"
  | "heavy"
  | "defender"
  | "scaler"
  | "debuffer"
  | "disruptor"
  | "summoner"
  | "splitter"
  | "leech"
  | "reactive"
  | "trickster";

export interface EnemyAiPhase {
  label: string;
  threshold?: number;
  rotation: MonsterIntent[];
}

export interface EnemyAiDefinition {
  archetype: EnemyArchetype;
  params?: Record<string, unknown>;
  phases?: EnemyAiPhase[];
  rotation?: MonsterIntent[];
}

export interface EnemyDefinition {
  id: EnemyId;
  name: string;
  chapter: 1 | 2 | 3;
  tier: EnemyTier;
  role: EnemyRole;
  hpRange: [number, number];
  ai: EnemyAiDefinition;
  tags: string[];
}

type EnemySeed = {
  id: EnemyId;
  name: string;
  chapter: 1 | 2 | 3;
  tier: EnemyTier;
  role: EnemyRole;
  hpRange: [number, number];
  archetype: EnemyArchetype;
  rotation?: MonsterIntent[];
  phases?: EnemyAiPhase[];
  params?: Record<string, unknown>;
  tags: string[];
};

const atk = (value: number): MonsterIntent => ({ type: "attack", value });
const multi = (value: number, hits: number): MonsterIntent => ({
  type: "multi_hit",
  value,
  hits,
});
const heavy = (value: number, charge: number): MonsterIntent => ({
  type: "heavy_charge",
  value,
  charge,
});
const block = (value: number): MonsterIntent => ({ type: "block", value });
const buff = (statusId: string, value: number): MonsterIntent => ({
  type: "buff",
  statusId,
  value,
});
const scale = (stat: "strength" | "armor", value: number): MonsterIntent => ({
  type: "scale",
  stat,
  value,
});
const debuff = (statusId: string, value: number): MonsterIntent => ({
  type: "debuff",
  statusId,
  value,
});
const reduce = (statusId: string, value: number): MonsterIntent => ({
  type: "reduce_status",
  statusId,
  value,
});
const summon = (enemyId: string, count: number): MonsterIntent => ({
  type: "summon",
  enemyId,
  count,
});
const split = (
  enemyId: string,
  count: number,
  hpPercent: number,
): MonsterIntent => ({
  type: "split_on_death",
  enemyId,
  count,
  hpPercent,
});
const deathBurst = (damage: number): MonsterIntent => ({
  type: "death_burst",
  damage,
});
const thorns = (damage: number): MonsterIntent => ({ type: "thorns", damage });
const reactive = (damage: number): MonsterIntent => ({
  type: "reactive",
  damage,
});
const counter = (threshold: number, damage: number): MonsterIntent => ({
  type: "counter",
  threshold,
  damage,
});
const punishMulti = (threshold: number, blockValue: number): MonsterIntent => ({
  type: "punish_multi_play",
  threshold,
  block: blockValue,
});
const pollute = (count: number, cardId = "junk_sludge"): MonsterIntent => ({
  type: "pollute_draw",
  count,
  cardId,
});
const lockHand = (count: number): MonsterIntent => ({
  type: "lock_hand",
  count,
});
const drawPressure = (value: number): MonsterIntent => ({
  type: "draw_pressure",
  value,
});
const heal = (
  value: number,
  target: "self" | "ally_lowest" | "all_enemies",
): MonsterIntent => ({
  type: "heal",
  value,
  target,
});
const leech = (attack: number, healRatio: number): MonsterIntent => ({
  type: "leech",
  attack,
  healRatio,
});
const countdown = (turns: number, effect: CountdownEffect): MonsterIntent => ({
  type: "countdown",
  turns,
  effect,
});
const doubleAction = (times: number): MonsterIntent => ({
  type: "double_action",
  times,
});
const phaseShift = (label: string, phase: number): MonsterIntent => ({
  type: "phase_shift",
  label,
  phase,
});
const maxHpDown = (value: number): MonsterIntent => ({
  type: "max_hp_down",
  value,
});
const reset = (mode: "momentum" | "statuses" | "all"): MonsterIntent => ({
  type: "mechanic_reset",
  mode,
});
const echo = (enemyId?: string, count = 1): MonsterIntent => ({
  type: "copy_echo",
  enemyId,
  count,
});
const attackBuff = (
  attack: number,
  statusId: string,
  value: number,
): MonsterIntent => ({
  type: "attack_buff",
  attack,
  statusId,
  value,
});

const ENEMY_SEEDS: EnemySeed[] = [
  {
    id: "slime",
    name: "黏液",
    chapter: 1,
    tier: "normal",
    role: "frontliner",
    hpRange: [34, 40],
    archetype: "attacker",
    rotation: [atk(8), atk(11)],
    tags: ["basic", "frontload"],
  },
  {
    id: "slime_splitter",
    name: "分裂黏液",
    chapter: 1,
    tier: "normal",
    role: "frontliner",
    hpRange: [30, 36],
    archetype: "splitter",
    rotation: [split("slime", 2, 0.45), atk(5)],
    tags: ["split", "snowball"],
  },
  {
    id: "fang_rat",
    name: "獠牙鼠",
    chapter: 1,
    tier: "normal",
    role: "carry",
    hpRange: [26, 32],
    archetype: "multi_hit",
    rotation: [multi(2, 3), atk(9)],
    tags: ["multi_hit", "frontload"],
  },
  {
    id: "slime_sapper",
    name: "盗火小鬼",
    chapter: 1,
    tier: "normal",
    role: "disruptor",
    hpRange: [28, 34],
    archetype: "disruptor",
    rotation: [atk(6), reduce(STATUS_MOMENTUM, 3)],
    tags: ["pollution", "disruption"],
  },
  {
    id: "slime_guard",
    name: "拾荒者",
    chapter: 1,
    tier: "normal",
    role: "disruptor",
    hpRange: [34, 38],
    archetype: "disruptor",
    rotation: [atk(6), counter(2, 3)],
    tags: ["resource_tax", "counter"],
  },
  {
    id: "slime_shell",
    name: "破盾步兵",
    chapter: 1,
    tier: "normal",
    role: "tank",
    hpRange: [38, 42],
    archetype: "defender",
    rotation: [atk(6), block(2), atk(8), atk(8)],
    tags: ["armor", "reactive"],
  },
  {
    id: "zealot_recruit",
    name: "狂信新兵",
    chapter: 1,
    tier: "normal",
    role: "carry",
    hpRange: [28, 34],
    archetype: "scaler",
    rotation: [scale("strength", 2), atk(8), atk(10)],
    tags: ["scaler", "snowball"],
  },
  {
    id: "mire_toad",
    name: "病沼蛙",
    chapter: 1,
    tier: "normal",
    role: "backliner",
    hpRange: [30, 34],
    archetype: "debuffer",
    rotation: [debuff(STATUS_WEAK, 2), atk(7), debuff(STATUS_VULNERABLE, 2)],
    tags: ["debuff", "attrition"],
  },
  {
    id: "bone_crow",
    name: "碎骨鸦",
    chapter: 1,
    tier: "normal",
    role: "backliner",
    hpRange: [24, 30],
    archetype: "reactive",
    rotation: [reactive(3), multi(4, 2), atk(8)],
    tags: ["evasive", "reactive"],
  },
  {
    id: "parasite",
    name: "寄生体",
    chapter: 1,
    tier: "normal",
    role: "disruptor",
    hpRange: [28, 32],
    archetype: "disruptor",
    rotation: [pollute(3, "junk_burn"), drawPressure(2), atk(8)],
    tags: ["pollution", "draw_pressure"],
  },
  {
    id: "axe_raider",
    name: "斧兵",
    chapter: 1,
    tier: "normal",
    role: "frontliner",
    hpRange: [32, 38],
    archetype: "heavy",
    rotation: [block(8), heavy(16, 1)],
    tags: ["heavy", "execution_check"],
  },
  {
    id: "buff_beetle",
    name: "甲虫",
    chapter: 1,
    tier: "normal",
    role: "support",
    hpRange: [30, 36],
    archetype: "trickster",
    rotation: [buff(STATUS_METALLICIZE, 1), atk(6), deathBurst(6)],
    tags: ["death_trigger", "support"],
  },

  {
    id: "slime_elite",
    name: "黏核母体",
    chapter: 1,
    tier: "elite",
    role: "tank",
    hpRange: [56, 60],
    archetype: "splitter",
    rotation: [atk(8), reduce(STATUS_MOMENTUM, 3)],
    tags: ["split", "elite", "snowball"],
  },
  {
    id: "act1_executioner",
    name: "执行者",
    chapter: 1,
    tier: "elite",
    role: "frontliner",
    hpRange: [58, 64],
    archetype: "heavy",
    rotation: [
      counter(4, 7),
      attackBuff(12, STATUS_VULNERABLE, 0),
      heavy(20, 1),
    ],
    tags: ["heavy", "elite", "execution_check"],
  },
  {
    id: "act1_twin_hunter",
    name: "双刃猎手",
    chapter: 1,
    tier: "elite",
    role: "carry",
    hpRange: [56, 62],
    archetype: "multi_hit",
    rotation: [counter(2, 7), multi(5, 2), punishMulti(5, 12)],
    tags: ["double_action", "elite", "frontload"],
  },
  {
    id: "act1_debt_monk",
    name: "收债修士",
    chapter: 1,
    tier: "elite",
    role: "disruptor",
    hpRange: [60, 66],
    archetype: "trickster",
    rotation: [lockHand(1), heavy(22, 1), drawPressure(2)],
    tags: ["resource_tax", "elite", "attrition"],
  },

  {
    id: "slime_boss",
    name: "巢母",
    chapter: 1,
    tier: "boss",
    role: "support",
    hpRange: [78, 86],
    archetype: "summoner",
    phases: [
      { label: "孵化", rotation: [atk(6), atk(7), buff(STATUS_STRENGTH, 1)] },
      {
        label: "溢巢",
        threshold: 0.4,
        rotation: [
          phaseShift("溢巢", 2),
          summon("slime_splitter", 1),
          multi(2, 2),
          atk(8),
        ],
      },
    ],
    tags: ["boss", "summoner", "phase"],
  },
  {
    id: "act1_boss_gate",
    name: "巨兵",
    chapter: 1,
    tier: "boss",
    role: "tank",
    hpRange: [80, 88],
    archetype: "heavy",
    phases: [
      {
        label: "稳压",
        rotation: [
          phaseShift("稳压", 1),
          block(4),
          heavy(12, 1),
          atk(8),
          counter(2, 5),
        ],
      },
      {
        label: "碾压",
        threshold: 0.4,
        rotation: [
          phaseShift("碾压", 2),
          heavy(12, 1),
          thorns(2),
          maxHpDown(1),
        ],
      },
    ],
    tags: ["boss", "heavy", "phase"],
  },

  {
    id: "combo_assassin",
    name: "连击刺客",
    chapter: 2,
    tier: "normal",
    role: "carry",
    hpRange: [34, 40],
    archetype: "multi_hit",
    rotation: [multi(3, 3), atk(10)],
    tags: ["multi_hit", "frontload"],
  },
  {
    id: "reflect_automaton",
    name: "反伤机械兵",
    chapter: 2,
    tier: "normal",
    role: "tank",
    hpRange: [42, 48],
    archetype: "reactive",
    rotation: [thorns(3), reactive(3), atk(8)],
    tags: ["reactive", "attrition"],
  },
  {
    id: "curse_priest",
    name: "咒纹祭司",
    chapter: 2,
    tier: "normal",
    role: "support",
    hpRange: [34, 40],
    archetype: "debuffer",
    rotation: [debuff(STATUS_WEAK, 2), debuff(STATUS_VULNERABLE, 2), atk(8)],
    tags: ["debuff", "support"],
  },
  {
    id: "blast_mite",
    name: "爆炸小怪",
    chapter: 2,
    tier: "normal",
    role: "frontliner",
    hpRange: [24, 28],
    archetype: "trickster",
    rotation: [countdown(2, { type: "attack", value: 14 }), atk(5)],
    tags: ["countdown", "death_trigger"],
  },
  {
    id: "mark_hound",
    name: "标记猎犬",
    chapter: 2,
    tier: "normal",
    role: "carry",
    hpRange: [32, 38],
    archetype: "debuffer",
    rotation: [debuff(STATUS_VULNERABLE, 2), atk(9), multi(3, 2)],
    tags: ["execution_check", "debuff"],
  },
  {
    id: "mirror_mage",
    name: "镜像术士",
    chapter: 2,
    tier: "normal",
    role: "support",
    hpRange: [32, 38],
    archetype: "trickster",
    rotation: [echo("mirror_mage", 1), atk(7), block(6)],
    tags: ["copy", "support"],
  },
  {
    id: "morph_guard",
    name: "变形守卫",
    chapter: 2,
    tier: "normal",
    role: "tank",
    hpRange: [40, 46],
    archetype: "defender",
    rotation: [block(12), counter(2, 4), atk(8)],
    tags: ["counter", "armor"],
  },
  {
    id: "war_drummer",
    name: "鼓手",
    chapter: 2,
    tier: "normal",
    role: "support",
    hpRange: [34, 40],
    archetype: "scaler",
    rotation: [buff(STATUS_STRENGTH, 1), scale("armor", 4), atk(6)],
    tags: ["support", "snowball"],
  },
  {
    id: "discard_eater",
    name: "吃弃牌怪",
    chapter: 2,
    tier: "normal",
    role: "disruptor",
    hpRange: [38, 44],
    archetype: "disruptor",
    rotation: [pollute(1, "junk_static"), lockHand(1), atk(9)],
    tags: ["discard_pressure", "disruption"],
  },
  {
    id: "card_bailiff",
    name: "锁牌敌人",
    chapter: 2,
    tier: "normal",
    role: "disruptor",
    hpRange: [36, 42],
    archetype: "disruptor",
    rotation: [lockHand(2), drawPressure(2), atk(7)],
    tags: ["lock", "draw_pressure"],
  },
  {
    id: "field_medic",
    name: "治疗怪",
    chapter: 2,
    tier: "normal",
    role: "support",
    hpRange: [34, 40],
    archetype: "summoner",
    rotation: [heal(8, "ally_lowest"), block(8), atk(6)],
    tags: ["heal", "support"],
  },
  {
    id: "thorn_shell",
    name: "反刺壳兽",
    chapter: 2,
    tier: "normal",
    role: "tank",
    hpRange: [42, 48],
    archetype: "reactive",
    rotation: [thorns(4), block(10), atk(8)],
    tags: ["reactive", "attrition"],
  },

  {
    id: "slime_taxer",
    name: "三人组首脑",
    chapter: 2,
    tier: "elite",
    role: "support",
    hpRange: [66, 74],
    archetype: "summoner",
    rotation: [
      summon("card_bailiff", 1),
      summon("combo_assassin", 1),
      heal(10, "all_enemies"),
    ],
    tags: ["elite", "summon", "support"],
  },
  {
    id: "slime_counter_judge",
    name: "姿态审判官",
    chapter: 2,
    tier: "elite",
    role: "disruptor",
    hpRange: [68, 76],
    archetype: "reactive",
    rotation: [counter(2, 6), reactive(4), atk(10)],
    tags: ["elite", "counter", "execution_check"],
  },
  {
    id: "act2_forge_elite",
    name: "灼烧铸机",
    chapter: 2,
    tier: "elite",
    role: "tank",
    hpRange: [74, 82],
    archetype: "heavy",
    rotation: [pollute(2, "junk_burn"), heavy(18, 1), thorns(4)],
    tags: ["elite", "heavy", "pollution"],
  },
  {
    id: "act2_lock_bailiff",
    name: "锁牌执达者",
    chapter: 2,
    tier: "elite",
    role: "disruptor",
    hpRange: [70, 78],
    archetype: "disruptor",
    rotation: [lockHand(2), maxHpDown(3), atk(11)],
    tags: ["elite", "lock", "attrition"],
  },

  {
    id: "act2_boss_silence",
    name: "主教",
    chapter: 2,
    tier: "boss",
    role: "support",
    hpRange: [126, 136],
    archetype: "trickster",
    phases: [
      {
        label: "布道",
        rotation: [
          phaseShift("布道", 1),
          debuff(STATUS_WEAK, 2),
          summon("curse_priest", 1),
          atk(10),
        ],
      },
      {
        label: "审判",
        threshold: 0.66,
        rotation: [
          phaseShift("审判", 2),
          lockHand(2),
          maxHpDown(3),
          multi(4, 3),
        ],
      },
      {
        label: "圣罚",
        threshold: 0.33,
        rotation: [
          phaseShift("圣罚", 3),
          reset("statuses"),
          heavy(24, 1),
          attackBuff(12, STATUS_STRENGTH, 1),
        ],
      },
    ],
    tags: ["boss", "phase", "control"],
  },
  {
    id: "act2_dual_core",
    name: "双核怪",
    chapter: 2,
    tier: "boss",
    role: "tank",
    hpRange: [132, 144],
    archetype: "summoner",
    phases: [
      {
        label: "分核",
        rotation: [
          phaseShift("分核", 1),
          echo("reflect_automaton", 1),
          summon("mirror_mage", 1),
          atk(11),
        ],
      },
      {
        label: "同调",
        threshold: 0.5,
        rotation: [
          phaseShift("同调", 2),
          doubleAction(1),
          multi(5, 2),
          reactive(5),
        ],
      },
    ],
    tags: ["boss", "echo", "phase"],
  },

  {
    id: "telegraph_drone",
    name: "预告机制怪",
    chapter: 3,
    tier: "normal",
    role: "backliner",
    hpRange: [40, 46],
    archetype: "heavy",
    rotation: [countdown(2, { type: "attack", value: 18 }), atk(8)],
    tags: ["telegraph", "execution_check"],
  },
  {
    id: "hidden_assassin",
    name: "隐匿刺客",
    chapter: 3,
    tier: "normal",
    role: "carry",
    hpRange: [34, 40],
    archetype: "multi_hit",
    rotation: [reactive(3), multi(4, 3), atk(12)],
    tags: ["frontload", "reactive"],
  },
  {
    id: "shield_nullifier",
    name: "护盾免伤怪",
    chapter: 3,
    tier: "normal",
    role: "tank",
    hpRange: [44, 52],
    archetype: "defender",
    rotation: [block(14), thorns(4), atk(9)],
    tags: ["shield_gate", "attrition"],
  },
  {
    id: "low_hp_punisher",
    name: "低血惩罚怪",
    chapter: 3,
    tier: "normal",
    role: "carry",
    hpRange: [38, 44],
    archetype: "heavy",
    rotation: [maxHpDown(2), heavy(20, 1), atk(10)],
    tags: ["execution_check", "attrition"],
  },
  {
    id: "echo_mimic",
    name: "回声复制怪",
    chapter: 3,
    tier: "normal",
    role: "support",
    hpRange: [38, 44],
    archetype: "trickster",
    rotation: [echo(undefined, 1), atk(8), block(8)],
    tags: ["copy", "snowball"],
  },
  {
    id: "rear_repairer",
    name: "后排修复者",
    chapter: 3,
    tier: "normal",
    role: "support",
    hpRange: [36, 42],
    archetype: "summoner",
    rotation: [heal(10, "ally_lowest"), buff(STATUS_METALLICIZE, 1), atk(7)],
    tags: ["heal", "support"],
  },
  {
    id: "cap_shearer",
    name: "削上限怪",
    chapter: 3,
    tier: "normal",
    role: "disruptor",
    hpRange: [38, 44],
    archetype: "disruptor",
    rotation: [maxHpDown(4), atk(9), lockHand(1)],
    tags: ["max_hp_down", "attrition"],
  },
  {
    id: "draw_crusher",
    name: "抽牌压制怪",
    chapter: 3,
    tier: "normal",
    role: "disruptor",
    hpRange: [38, 44],
    archetype: "disruptor",
    rotation: [drawPressure(2), pollute(2), atk(8)],
    tags: ["draw_pressure", "pollution"],
  },
  {
    id: "death_blight",
    name: "死亡爆 debuff",
    chapter: 3,
    tier: "normal",
    role: "backliner",
    hpRange: [34, 40],
    archetype: "splitter",
    rotation: [
      split("death_blight_spawn", 1, 0.4),
      debuff(STATUS_WEAK, 2),
      atk(7),
    ],
    tags: ["death_trigger", "debuff"],
  },
  {
    id: "reset_construct",
    name: "重置机制怪",
    chapter: 3,
    tier: "normal",
    role: "disruptor",
    hpRange: [40, 46],
    archetype: "trickster",
    rotation: [reset("all"), block(8), atk(10)],
    tags: ["mechanic_reset", "control"],
  },
  {
    id: "rapid_striker",
    name: "高速多段怪",
    chapter: 3,
    tier: "normal",
    role: "carry",
    hpRange: [34, 40],
    archetype: "multi_hit",
    rotation: [doubleAction(1), multi(3, 4), atk(11)],
    tags: ["multi_hit", "frontload"],
  },
  {
    id: "corpse_feeder",
    name: "吞尸成长怪",
    chapter: 3,
    tier: "normal",
    role: "carry",
    hpRange: [42, 48],
    archetype: "scaler",
    rotation: [scale("strength", 2), leech(9, 0.5), atk(12)],
    tags: ["scaler", "leech"],
  },

  {
    id: "slime_raider_elite",
    name: "双子",
    chapter: 3,
    tier: "elite",
    role: "carry",
    hpRange: [78, 86],
    archetype: "multi_hit",
    rotation: [echo("hidden_assassin", 1), doubleAction(1), multi(5, 3)],
    tags: ["elite", "copy", "frontload"],
  },
  {
    id: "slime_counter_final",
    name: "卡组污染者",
    chapter: 3,
    tier: "elite",
    role: "disruptor",
    hpRange: [80, 88],
    archetype: "disruptor",
    rotation: [pollute(3), lockHand(2), drawPressure(2)],
    tags: ["elite", "pollution", "lock"],
  },
  {
    id: "countdown_abbot",
    name: "倒计时怪",
    chapter: 3,
    tier: "elite",
    role: "support",
    hpRange: [84, 92],
    archetype: "heavy",
    rotation: [countdown(2, { type: "attack", value: 24 }), atk(10), thorns(4)],
    tags: ["elite", "countdown", "execution_check"],
  },
  {
    id: "protocol_ai",
    name: "多协议 AI 怪",
    chapter: 3,
    tier: "elite",
    role: "tank",
    hpRange: [86, 94],
    archetype: "trickster",
    rotation: [reactive(4), reset("statuses"), counter(2, 7)],
    tags: ["elite", "reactive", "control"],
  },

  {
    id: "act3_boss_crown",
    name: "守门人",
    chapter: 3,
    tier: "boss",
    role: "tank",
    hpRange: [150, 162],
    archetype: "defender",
    phases: [
      {
        label: "门阈",
        rotation: [phaseShift("门阈", 1), thorns(5), block(18), heavy(18, 1)],
      },
      {
        label: "过载",
        threshold: 0.5,
        rotation: [
          phaseShift("过载", 2),
          counter(2, 8),
          maxHpDown(4),
          heavy(24, 1),
        ],
      },
    ],
    tags: ["boss", "gate", "phase"],
  },
  {
    id: "act3_echo_body",
    name: "回声体",
    chapter: 3,
    tier: "boss",
    role: "disruptor",
    hpRange: [146, 158],
    archetype: "trickster",
    phases: [
      {
        label: "采样",
        rotation: [
          phaseShift("采样", 1),
          echo(undefined, 1),
          pollute(2),
          atk(11),
        ],
      },
      {
        label: "覆写",
        threshold: 0.55,
        rotation: [
          phaseShift("覆写", 2),
          reset("all"),
          copyIntent("junk_static"),
          maxHpDown(3),
        ],
      },
      {
        label: "放大",
        threshold: 0.25,
        rotation: [
          phaseShift("放大", 3),
          doubleAction(1),
          multi(5, 3),
          reactive(6),
        ],
      },
    ],
    tags: ["boss", "copy", "phase"],
  },
];

function copyIntent(enemyId: string): MonsterIntent {
  return echo(enemyId, 1);
}

function buildEnemyDefinition(seed: EnemySeed): EnemyDefinition {
  return {
    id: seed.id,
    name: seed.name,
    chapter: seed.chapter,
    tier: seed.tier,
    role: seed.role,
    hpRange: seed.hpRange,
    ai: {
      archetype: seed.archetype,
      params: seed.params,
      phases: seed.phases,
      rotation: seed.rotation,
    },
    tags: seed.tags,
  };
}

export const MONSTER_DEFINITIONS: Record<string, EnemyDefinition> =
  Object.fromEntries(
    ENEMY_SEEDS.map((seed) => [seed.id, buildEnemyDefinition(seed)]),
  ) as Record<string, EnemyDefinition>;

// ─── Generated enemies ─────────────────────────────────────────
import { ALL_GENERATED_ENEMIES } from './generated';
Object.assign(MONSTER_DEFINITIONS, ALL_GENERATED_ENEMIES);

const RUNTIME_ONLY_MONSTER_DEFINITIONS: Record<string, EnemyDefinition> = {
  death_blight_spawn: buildEnemyDefinition({
    id: "death_blight_spawn",
    name: "秽裂孢体",
    chapter: 3,
    tier: "normal",
    role: "backliner",
    hpRange: [12, 16],
    archetype: "debuffer",
    rotation: [debuff(STATUS_WEAK, 1), atk(4)],
    tags: ["spawn", "debuff", "runtime_only"],
  }),
};

export function getMonsterDefinition(id: string): EnemyDefinition | undefined {
  return MONSTER_DEFINITIONS[id] ?? RUNTIME_ONLY_MONSTER_DEFINITIONS[id];
}

export function listMonsterDefinitions(): EnemyDefinition[] {
  return Object.values(MONSTER_DEFINITIONS);
}

export function averageEnemyMaxHp(def: EnemyDefinition): number {
  return Math.round((def.hpRange[0] + def.hpRange[1]) / 2);
}

export function buildInitialMonsterRuntime(
  def: EnemyDefinition,
): MonsterRuntimeState {
  const runtime: MonsterRuntimeState = {};
  const intents = [
    ...(def.ai.rotation ?? []),
    ...(def.ai.phases?.flatMap((phase) => phase.rotation) ?? []),
  ];
  for (const intent of intents) {
    if (intent.type === "split_on_death")
      runtime.splitOnDeath = {
        enemyId: intent.enemyId,
        count: intent.count,
        hpPercent: intent.hpPercent,
      };
    if (intent.type === "death_burst")
      runtime.deathBurst = { damage: intent.damage };
    if (intent.type === "revive") {
      runtime.reviveCharges = intent.charges;
      runtime.reviveHpPercent = intent.hpPercent;
    }
    if (intent.type === "thorns")
      runtime.thorns = Math.max(runtime.thorns ?? 0, intent.damage);
    if (intent.type === "reactive")
      runtime.reactiveDamage = Math.max(
        runtime.reactiveDamage ?? 0,
        intent.damage,
      );
    if (intent.type === "counter") {
      runtime.counterThreshold = intent.threshold;
      runtime.counterDamage = Math.max(
        runtime.counterDamage ?? 0,
        intent.damage,
      );
    }
  }
  return runtime;
}
