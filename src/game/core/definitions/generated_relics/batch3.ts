import type { RelicDefinition } from '../relics';

export const GENERATED_RELICS_3: Record<string, RelicDefinition> = {
  momentum_seed: {
    id: 'momentum_seed',
    name: '连势之种',
    description: '每回合开始时获得 1 层连势。',
  },
  surge_tide: {
    id: 'surge_tide',
    name: '涌势潮',
    description: '每当你抽到一张牌时，获得 1 层连势（每回合至多 3 层）。',
  },
  cascade_gem: {
    id: 'cascade_gem',
    name: '层叠宝石',
    description: '每次主动消耗连势后，下一次消耗的连势层数视为翻倍。',
  },
  momentum_siphon_b3: {
    id: 'momentum_siphon_b3',
    name: '连势虹吸',
    description: '每当你主动消耗连势时，回复等同于消耗层数的生命值。',
  },
  momentum_well_b3: {
    id: 'momentum_well_b3',
    name: '连势深井',
    description: '回合结束时连势层数不低于战斗开始时的层数。',
  },
  endurance_surge: {
    id: 'endurance_surge',
    name: '韧性涌动',
    description: '每回合内每主动消耗 3 次连势后，本回合攻击伤害 +3。',
  },
  tide_reshaper: {
    id: 'tide_reshaper',
    name: '势流重塑',
    description: '每回合第一次消耗连势时，获得 1 层破势预热。',
  },
  echo_crest: {
    id: 'echo_crest',
    name: '回响纹章',
    description: '每回合结束时，若本回合主动消耗过连势，获得等同于消耗总层数一半的格挡。',
  },
  stone_aegis: {
    id: 'stone_aegis',
    name: '石盾圣印',
    description: '金属化层数每达到 3 的倍数时，额外获得 2 点格挡。',
  },
  bulwark_plating: {
    id: 'bulwark_plating',
    name: '壁垒覆板',
    description: '每场战斗开始时获得 1 层金属化。',
  },
  sanctuary_bell: {
    id: 'sanctuary_bell',
    name: '庇护钟',
    description: '每当你累积获得 15 点格挡后，回复 1 点生命值（每回合至多触发 2 次）。',
  },
  ironward_rune: {
    id: 'ironward_rune',
    name: '铁卫符文',
    description: '稳势每回合提供的格挡从 4 点提高到 6 点。',
  },
  fortress_ward: {
    id: 'fortress_ward',
    name: '要塞之守',
    description: '敌人数量不少于 2 时，每回合获得 3 点额外格挡。',
  },
  stalwart_mantle: {
    id: 'stalwart_mantle',
    name: '刚毅斗篷',
    description: '受到敌人攻击后，若格挡仍大于 0，则下一次攻击伤害 +3。',
  },
  rending_slash: {
    id: 'rending_slash',
    name: '裂斩之牙',
    description: '主动消耗 5 层及以上连势时，额外造成 6 点伤害。',
  },
  war_drums: {
    id: 'war_drums',
    name: '战鼓',
    description: '每场战斗开始时获得 1 层力量。',
  },
  bloodlust_fang: {
    id: 'bloodlust_fang',
    name: '嗜血之牙',
    description: '击杀敌人时恢复 5 点生命值。',
  },
  crushing_blow: {
    id: 'crushing_blow',
    name: '碎击重锤',
    description: '对易伤敌人造成的伤害额外提高 50%。',
  },
  relentless_tide: {
    id: 'relentless_tide',
    name: '不屈潮涌',
    description: '每回合第一次主动消耗连势时，本次消耗的连势层数视为翻倍。',
  },
  inferno_core: {
    id: 'inferno_core',
    name: '炼狱核心',
    description: '本场战斗中你每累计消耗过 10 层连势，攻击伤害 +1（永久叠加）。',
  },
  momentum_duelist: {
    id: 'momentum_duelist',
    name: '势斗士',
    description: '主动消耗连势的伤害牌若连势层数不低于 3，该牌必定暴击。',
  },
  rune_pouch: {
    id: 'rune_pouch',
    name: '符文袋',
    description: '每回合开始时额外抽 1 张牌。',
  },
  verdant_vial: {
    id: 'verdant_vial',
    name: '翠绿药瓶',
    description: '每场战斗结束时回复 3 点生命值。',
  },
  tome_of_depths: {
    id: 'tome_of_depths',
    name: '深渊典籍',
    description: '拾取时最大生命 +8，当前生命 +8。',
  },
  luck_charm: {
    id: 'luck_charm',
    name: '幸运护符',
    description: '每场战斗结束时，随机将一张手牌升级。',
  },
  quickstep_boots: {
    id: 'quickstep_boots',
    name: '疾步靴',
    description: '每场战斗开始时获得 2 点能量。',
  },
  alternating_crest: {
    id: 'alternating_crest',
    name: '交替纹章',
    description: '每当你在同一回合内连续打出攻击-技能-攻击牌，抽 1 张牌。',
  },
  chain_bolt: {
    id: 'chain_bolt',
    name: '链锁之扣',
    description: '每当你在同一回合内打出 3 张以上攻击牌后，下一张攻击牌伤害 +8。',
  },
  draw_power_sigil: {
    id: 'draw_power_sigil',
    name: '抽力印记',
    description: '每当你抽牌时，获得等同于已拥有力量层数的格挡（每回合至多触发 5 次）。',
  },
  abyssal_crown: {
    id: 'abyssal_crown',
    name: '深渊冠冕',
    description: '每回合结束时，若你本回合未消耗过连势，下回合抽牌数 +2 且获得 1 层破势预热。',
  },
  phoenix_heart: {
    id: 'phoenix_heart',
    name: '凤凰之心',
    description: '每场战斗首次受到致命伤害时，以 1 点生命值存活并获得 5 层力量和 3 层连势（每场战斗一次）。',
  },
  epoch_shard: {
    id: 'epoch_shard',
    name: '纪元碎片',
    description: '每场战斗开始时，从所有已拥有的遗物中随机选一个触发其战斗开始效果。',
  },
  void_engine: {
    id: 'void_engine',
    name: '虚空引擎',
    description: '每当你消耗一张牌，本回合所有牌费用 -1，但回合结束时失去 1 点最大生命值。',
  },
};
