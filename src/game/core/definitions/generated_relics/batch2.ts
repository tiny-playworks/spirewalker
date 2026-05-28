import type { RelicDefinition } from '../relics';

export const GENERATED_RELICS_2: Record<string, RelicDefinition> = {
  flow_regulator: {
    id: 'flow_regulator',
    name: '流势调节器',
    description: '每回合开始时获得 2 层连势。',
  },
  momentum_overflow: {
    id: 'momentum_overflow',
    name: '连势溢流',
    description: '连势层数达到上限时，溢出的层数转化为等量格挡。',
  },
  tide_conductor: {
    id: 'tide_conductor',
    name: '潮汐导体',
    description: '每当你消耗连势时，本回合你的技能牌格挡值 +2。',
  },
  momentum_crest: {
    id: 'momentum_crest',
    name: '连势纹章',
    description: '连势层数不低于 4 时，你的攻击牌伤害 +2。',
  },
  surge_bloom: {
    id: 'surge_bloom',
    name: '涌势绽放',
    description: '每当你主动消耗连势后，获得 1 层破势预热。',
  },
  flow_resonance: {
    id: 'flow_resonance',
    name: '流势共振',
    description: '每当你获得连势时，若手牌中有攻击牌，抽 1 张牌（每回合至多 2 次）。',
  },
  momentum_anchor: {
    id: 'momentum_anchor',
    name: '连势锚',
    description: '回合结束时，若连势为 0，获得 2 层连势。',
  },
  tide_preserver: {
    id: 'tide_preserver',
    name: '潮汐守护者',
    description: '受到敌人攻击时，连势衰减暂停一回合。',
  },
  momentum_well: {
    id: 'momentum_well_b2',
    name: '连势深泉',
    description: '每当你打出能力牌时，获得 1 层连势。',
  },
  surge_siphon: {
    id: 'surge_siphon',
    name: '涌势虹吸器',
    description: '每当你主动消耗连势时，获得等同于消耗层数的格挡。',
  },
  fortification_rune: {
    id: 'fortification_rune',
    name: '加固符文',
    description: '每当你获得格挡时，若当前格挡值为 0，额外获得 4 点格挡。',
  },
  iron_veil: {
    id: 'iron_veil',
    name: '铁幕',
    description: '每场战斗中你第一次受到攻击时，获得 10 点格挡。',
  },
  living_wall: {
    id: 'living_wall',
    name: '活体壁障',
    description: '每回合结束时，若你本回合未受到攻击，获得 3 点格挡保留至下一回合。',
  },
  guardian_seal: {
    id: 'guardian_seal',
    name: '守护封印',
    description: '你拥有金属化时，受到的伤害减少 1。',
  },
  resonance_plating: {
    id: 'resonance_plating',
    name: '共振甲片',
    description: '每当你消耗一张牌时，获得 1 点格挡。',
  },
  stalwart_core: {
    id: 'stalwart_core',
    name: '坚毅核心',
    description: '每场战斗开始时获得 1 层金属化与 3 点格挡。',
  },
  fortress_seal: {
    id: 'fortress_seal',
    name: '要塞封印',
    description: '格挡不低于 15 时，你的攻击牌伤害 +3。',
  },
  thorn_ward: {
    id: 'thorn_ward',
    name: '荆棘结界',
    description: '每当你受到攻击时，对攻击者造成 3 点伤害。',
  },
  iron_shroud: {
    id: 'iron_shroud',
    name: '铁衣',
    description: '每场战斗开始时获得 5 点格挡并获得 1 层金属化。',
  },
  bulwark_heart: {
    id: 'bulwark_heart',
    name: '壁垒之心',
    description: '每当你消耗连势时，获得 2 点格挡。',
  },
  eruption_core: {
    id: 'eruption_core',
    name: '爆发核心',
    description: '消耗全部连势时，额外造成等同于消耗层数的伤害。',
  },
  blood_fang: {
    id: 'blood_fang',
    name: '血牙',
    description: '每当你造成 15 点及以上伤害时，治疗 2 点生命值。',
  },
  momentum_fury: {
    id: 'momentum_fury',
    name: '连势狂怒',
    description: '主动消耗连势后，你的下一张攻击牌伤害 +5。',
  },
  rage_engine: {
    id: 'rage_engine',
    name: '怒焰引擎',
    description: '每当你受到伤害后，本回合攻击牌伤害 +2。',
  },
  executioner_blade: {
    id: 'executioner_blade',
    name: '行刑之刃',
    description: '对生命值低于 30% 的敌人造成的伤害 +50%。',
  },
  war_cry: {
    id: 'war_cry',
    name: '战吼',
    description: '每场战斗开始时对所有敌人造成 3 点伤害。',
  },
  critical_eye: {
    id: 'critical_eye',
    name: '锐眼',
    description: '你的攻击牌每造成 8 点及以上伤害时，额外造成 3 点伤害。',
  },
  surge_blade: {
    id: 'surge_blade',
    name: '涌刃',
    description: '消耗连势的攻击牌连势消耗量减少 1（最低为 1）。',
  },
  devastation_core: {
    id: 'devastation_core',
    name: '毁灭核心',
    description: '每场战斗中你每击杀一个敌人，攻击牌伤害 +2（永久叠加）。',
  },
  chain_lightning: {
    id: 'chain_lightning',
    name: '连锁闪电',
    description: '每当你对一名敌人造成 10 点及以上伤害时，对随机另一名敌人造成 3 点伤害。',
  },
  explorer_charm: {
    id: 'explorer_charm',
    name: '探索者护符',
    description: '战斗结束后，额外获得 15 金币。',
  },
  mystic_lens: {
    id: 'mystic_lens',
    name: '秘法之镜',
    description: '每场战斗开始时额外抽 1 张牌。',
  },
  vitality_stone: {
    id: 'vitality_stone',
    name: '生命之石',
    description: '拾取时最大生命与当前生命 +10。',
  },
  fortune_coin: {
    id: 'fortune_coin',
    name: '幸运金币',
    description: '战斗结束后，随机获得 10-30 金币。',
  },
  soul_echo: {
    id: 'soul_echo',
    name: '灵魂回响',
    description: '每当你打出能力牌时，获得 1 点能量（每回合至多 1 次）。',
  },
  quickdraw_glove: {
    id: 'quickdraw_glove',
    name: '快手手套',
    description: '每场战斗开始时额外抽 1 张牌。',
  },
  meditation_stone: {
    id: 'meditation_stone',
    name: '冥想石',
    description: '每当你打出技能牌后，获得 1 点格挡。',
  },
  rhythm_lock: {
    id: 'rhythm_lock',
    name: '节奏锁',
    description: '每当你在同一回合内先打出技能牌再打出攻击牌时，该攻击牌伤害 +3。',
  },
  duality_crest: {
    id: 'duality_crest',
    name: '双重纹章',
    description: '若你同时拥有连势与稳势，所有牌费用减少 1（最低为 0，每回合一次）。',
  },
  cycle_engine: {
    id: 'cycle_engine',
    name: '循环引擎',
    description: '每当你在同一回合内打出攻击牌与技能牌后，抽 1 张牌（每回合至多 2 次）。',
  },
  chain_bond: {
    id: 'chain_bond',
    name: '连锁纽带',
    description: '每当你连续打出三张同类型牌时，抽 1 张牌。',
  },
  synergy_core: {
    id: 'synergy_core',
    name: '协同核心',
    description: '每当你在回合内同时消耗过连势且获得过格挡时，抽 1 张牌。',
  },
  balanced_force: {
    id: 'balanced_force',
    name: '均衡之力',
    description: '若你本回合打出的攻击牌与技能牌数量相等，所有牌伤害与格挡 +2。',
  },
  dual_momentum: {
    id: 'dual_momentum',
    name: '双势合一',
    description: '连势与稳势层数之和不低于 5 时，你的攻击牌与技能牌效果 +50%。',
  },
  echo_synergy: {
    id: 'echo_synergy',
    name: '回响协同',
    description: '每当你在同一回合内先消耗连势再获得格挡时，额外获得 2 点格挡。',
  },
  void_crown: {
    id: 'void_crown',
    name: '虚空冠冕',
    description: '每场战斗开始时获得 2 层力量。',
  },
  oblivion_core: {
    id: 'oblivion_core',
    name: '湮灭核心',
    description: '每当你击杀敌人时，对所有敌人造成 4 点伤害。',
  },
  entropy_seal: {
    id: 'entropy_seal',
    name: '熵之封印',
    description: '每场战斗开始时获得 1 层力量与 1 层连势。',
  },
  abyssal_heart: {
    id: 'abyssal_heart',
    name: '深渊之心',
    description: '每当你消耗生命值后，本回合攻击牌伤害 +4。',
  },
  time_fracture: {
    id: 'time_fracture',
    name: '时间裂隙',
    description: '每场战斗中你打出的第一张牌费用为 0 且抽 1 张牌。',
  },
};
