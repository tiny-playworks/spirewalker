import type { RelicDefinition } from '../relics';

export const GENERATED_RELICS_1: Record<string, RelicDefinition> = {
  momentum_siphon: {
    id: 'momentum_siphon',
    name: '汲势晶',
    description: '每当你消耗连势后，获得等同于消耗层数的格挡。',
  },
  momentum_echo: {
    id: 'momentum_echo',
    name: '连势回响',
    description: '若你在同一回合内消耗连势两次以上，回合结束时获得 2 层连势。',
  },
  tide_mirror: {
    id: 'tide_mirror',
    name: '潮汐之镜',
    description: '每当你失去连势时，获得等同于失去层数一半（向上取整）的格挡。',
  },
  momentum_catalyst: {
    id: 'momentum_catalyst',
    name: '连势催化器',
    description: '每当你获得连势时，若当前连势层数不低于 5，额外获得 1 层连势。',
  },
  flow_anchor: {
    id: 'flow_anchor',
    name: '定流锚',
    description: '每回合开始时，若连势层数不低于 3，获得 3 点格挡。',
  },
  surge_drain: {
    id: 'surge_drain',
    name: '涌势虹吸',
    description: '每当你主动消耗连势时，治疗自身 1 点生命值。',
  },
  momentum_lens: {
    id: 'momentum_lens',
    name: '势态望远镜',
    description: '连势层数每达到 5 的倍数时，抽 1 张牌（每场战斗至多触发 3 次）。',
  },
  residual_flame: {
    id: 'residual_flame',
    name: '残焰余烬',
    description: '战斗结束时，若连势不低于 3，下场战斗开始时获得 3 层连势。',
  },
  unbroken_flow: {
    id: 'unbroken_flow',
    name: '不竭之流',
    description: '每当你消耗连势时，若本次消耗后连势仍不低于 2，抽 1 张牌。',
  },
  tide_walker: {
    id: 'tide_walker',
    name: '踏浪者',
    description: '每回合第一次消耗连势时，连势消耗量减少 1（最低为 0）。',
  },
  stone_bulwark: {
    id: 'stone_bulwark',
    name: '岩壁壁垒',
    description: '每当你获得格挡时，若当前格挡为 0，额外获得 3 点格挡。',
  },
  echo_plating: {
    id: 'echo_plating',
    name: '回响甲片',
    description: '每场战斗开始时获得 2 层金属化。',
  },
  thorn_root: {
    id: 'thorn_root',
    name: '荆棘之根',
    description: '每当你受到敌人攻击时，获得 1 层金属化（本场战斗内生效）。',
  },
  iron_resolve: {
    id: 'iron_resolve',
    name: '铁意决心',
    description: '若你当前格挡不低于 10，受到的伤害减少 2。',
  },
  bulwark_sigil: {
    id: 'bulwark_sigil',
    name: '壁垒印记',
    description: '每当你施加格挡的牌打出时，额外获得 1 点格挡。',
  },
  fortify_root: {
    id: 'fortify_root',
    name: '固本之根',
    description: '每回合结束时，若当前格挡不低于 5，保留一半格挡至下一回合（向下取整）。',
  },
  shell_shard: {
    id: 'shell_shard',
    name: '硬壳碎片',
    description: '每场战斗中你第一次失去生命值时，获得 8 点格挡。',
  },
  ward_of_rust: {
    id: 'ward_of_rust',
    name: '锈蚀之盾',
    description: '每当你受到攻击且格挡未被击穿时，对攻击者造成 2 点伤害。',
  },
  enduring_wall: {
    id: 'enduring_wall',
    name: '不朽之墙',
    description: '每场战斗开始时获得 1 层稳势。',
  },
  barrier_echo: {
    id: 'barrier_echo',
    name: '屏障回音',
    description: '每当你消耗格挡牌时，获得 2 点格挡。',
  },
  volatile_core: {
    id: 'volatile_core',
    name: '不稳定核心',
    description: '主动消耗连势时，额外造成消耗层数的 50% 伤害（向上取整）。',
  },
  overcharge: {
    id: 'overcharge',
    name: '过载充能',
    description: '每回合第一次打出攻击牌时，若当前连势不低于 3，该牌伤害 +4。',
  },
  rupture_fang: {
    id: 'rupture_fang',
    name: '破裂之牙',
    description: '每当你主动消耗连势打出攻击牌时，施加 1 层易伤。',
  },
  chain_detonation: {
    id: 'chain_detonation',
    name: '链式爆裂',
    description: '每回合中每连续打出第二张及之后的攻击牌时，伤害 +2。',
  },
  ember_blade: {
    id: 'ember_blade',
    name: '余烬之刃',
    description: '若你本回合已消耗过连势，你的攻击牌造成额外 2 点伤害。',
  },
  momentum_burst_core: {
    id: 'momentum_burst_core',
    name: '势爆核心',
    description: '每次消耗 3 层及以上连势时，对所有敌人造成 3 点伤害。',
  },
  ignition_surge: {
    id: 'ignition_surge',
    name: '引燃涌流',
    description: '每当你消耗连势后，本回合内你的下一张攻击牌伤害 +3。',
  },
  rend_shard: {
    id: 'rend_shard',
    name: '撕裂碎片',
    description: '你的攻击牌每造成 10 点及以上的单次伤害时，额外造成 2 点伤害。',
  },
  frenzy_essence: {
    id: 'frenzy_essence',
    name: '狂乱精粹',
    description: '每当你在同一回合内打出三张攻击牌时，抽 1 张牌。',
  },
  devastation_seal: {
    id: 'devastation_seal',
    name: '毁灭之印',
    description: '每场战斗中击杀第一个敌人时，对所有敌人造成 5 点伤害。',
  },
  ruins_lantern: {
    id: 'ruins_lantern',
    name: '遗迹灯笼',
    description: '每场战斗开始时获得 1 点能量。',
  },
  ancient_tablet: {
    id: 'ancient_tablet',
    name: '远古石板',
    description: '每场战斗开始时额外抽 2 张牌。',
  },
  healing_stone: {
    id: 'healing_stone',
    name: '疗愈之石',
    description: '每场战斗结束时，治疗 3 点生命值。',
  },
  soul_vessel: {
    id: 'soul_vessel',
    name: '灵魂容器',
    description: '拾取时最大生命与当前生命 +8。',
  },
  time_hourglass: {
    id: 'time_hourglass',
    name: '时间沙漏',
    description: '每回合结束时，若手牌数不足 3 张，抽牌至 3 张。',
  },
  echo_charm: {
    id: 'echo_charm',
    name: '回音护符',
    description: '每当你打出能力牌时，抽 1 张牌（每回合至多触发 2 次）。',
  },
  vitality_draught: {
    id: 'vitality_draught',
    name: '活力药剂',
    description: '每场战斗开始时治疗 3 点生命值。',
  },
  memory_shard: {
    id: 'memory_shard',
    name: '记忆碎片',
    description: '每当你打出技能牌后，你的下一张牌费用减少 1（最低为 0），每回合至多触发 2 次。',
  },
  void_charm: {
    id: 'void_charm',
    name: '虚空护符',
    description: '每当你弃牌时，获得 1 点格挡。',
  },
  waystone: {
    id: 'waystone',
    name: '引路石',
    description: '每场战斗中，你打出的第一张牌费用为 0。',
  },
  balanced_stance: {
    id: 'balanced_stance',
    name: '均衡姿态',
    description: '若你在同一回合内打出的攻击牌与技能牌数量相同，抽 1 张牌并获得 1 点格挡。',
  },
  guard_momentum_link: {
    id: 'guard_momentum_link',
    name: '守势联动',
    description: '每当你通过格挡牌获得格挡时，获得 1 层连势（每回合至多触发 2 次）。',
  },
  burst_defense_sync: {
    id: 'burst_defense_sync',
    name: '攻守同步',
    description: '每当你在回合内先打出攻击牌再打出技能牌时，该技能牌的格挡值 +3。',
  },
  cascade_relay: {
    id: 'cascade_relay',
    name: '级联中继',
    description: '每当你在同一回合内连续打出三张不同类型的牌，获得 1 点能量。',
  },
  echo_of_ancients: {
    id: 'echo_of_ancients',
    name: '远古回响',
    description: '每当你打出能力牌时，获得 1 层连势与 2 点格挡。',
  },
  momentum_guardian: {
    id: 'momentum_guardian',
    name: '连势守护者',
    description: '若你在回合结束时连势不低于 5，获得等同于连势层数的格挡，保留至下一回合。',
  },
  dual_resonance: {
    id: 'dual_resonance',
    name: '双频共振',
    description: '每当你在回合内先消耗连势再获得格挡时，该次格挡 +3。',
  },
  blood_rite: {
    id: 'blood_rite',
    name: '血祭仪式',
    description: '每当你消耗生命值作为费用时，获得 2 层连势。',
  },
  sentinel_oath: {
    id: 'sentinel_oath',
    name: '哨兵誓言',
    description: '每场战斗中你首次受到致命伤害时，保留 1 点生命并获得 10 点格挡（每场战斗一次）。',
  },
  convergence: {
    id: 'convergence',
    name: '汇聚之力',
    description: '若你在同一回合内同时拥有连势、格挡和金属化状态，所有攻击牌伤害 +3。',
  },
};
