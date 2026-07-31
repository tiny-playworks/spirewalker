import type { EventDefinition } from './index';

/**
 * 首局运行时事件目录。
 *
 * 完整生成事件仍保留在 index.ts 供内容审计与图鉴使用，但不再进入首屏运行链路。
 * 这里的事件必须满足：选项少而清楚、结果可预期、能服务当前 Act 1 纵切片。
 */
export const RUNTIME_EVENT_DEFINITIONS: Record<string, EventDefinition> = {
  wandering_merchant: {
    id: 'wandering_merchant',
    name: '流浪商人',
    description: '一名披着尘土的商人在岔路口拦下你，行囊里塞满来路不明的好处。',
    chapter: 1,
    type: 'merchant',
    choices: [
      { id: 'gold', text: '收下金币', outcomes: [{ type: 'gain_gold', value: 25, description: '获得 25 金币。' }] },
      { id: 'heal', text: '喝口热汤', outcomes: [{ type: 'gain_hp', value: 12, description: '回复 12 点生命。' }] },
      { id: 'relic', text: '瓦哈纳神像', outcomes: [{ type: 'gain_relic', relicId: 'vajra', description: '失去 8 点生命，获得瓦哈纳神像。' }] },
    ],
  },
  stillness_shrine: {
    id: 'stillness_shrine',
    name: '静谧神龛',
    description: '祠堂寂静无声，稳势的余韵在空气里缓缓回荡。',
    chapter: 1,
    type: 'ancient_shrine',
    choices: [
      { id: 'guard_relic', text: '割血换稳势结', outcomes: [{ type: 'gain_relic', relicId: 'guard_knot', description: '失去 6 点生命，获得稳势结。' }] },
      { id: 'guard_card', text: '学会守势', outcomes: [{ type: 'gain_card', cardId: 'tempo_guard', description: '牌组加入 1 张守势。' }] },
      { id: 'leave', text: '离开', outcomes: [{ type: 'nothing', description: '保持现状，返回地图。' }] },
    ],
  },
  burst_altar: {
    id: 'burst_altar',
    name: '裂响祭坛',
    description: '祭坛上的焦痕仍在发出低沉轰鸣，它能让你更早兑现连势。',
    chapter: 2,
    type: 'ancient_shrine',
    choices: [
      { id: 'burst_relic', text: '割血换裂响纹章', outcomes: [{ type: 'gain_relic', relicId: 'burst_emblem', description: '失去 6 点生命，获得裂响纹章。' }] },
      { id: 'burst_card', text: '学会破势击', outcomes: [{ type: 'gain_card', cardId: 'burst_strike', description: '牌组加入 1 张破势击。' }] },
      { id: 'leave', text: '离开', outcomes: [{ type: 'nothing', description: '保持现状，返回地图。' }] },
    ],
  },
  purging_pool: {
    id: 'purging_pool',
    name: '净手池',
    description: '清澈的池水映出牌组里那些拖沓的基础牌。',
    chapter: 2,
    type: 'corruption',
    choices: [
      { id: 'remove_strike', text: '删 1 张打击', outcomes: [{ type: 'nothing', description: '从牌组移除 1 张打击。' }] },
      { id: 'remove_defend', text: '删 1 张防御', outcomes: [{ type: 'nothing', description: '从牌组移除 1 张防御。' }] },
      { id: 'leave', text: '离开', outcomes: [{ type: 'nothing', description: '保持牌组不变，返回地图。' }] },
    ],
  },
  rusted_chest: {
    id: 'rusted_chest',
    name: '锈蚀宝箱',
    description: '铁锈吞噬了箱体，锁孔处渗出暗红色液体。里面传来微弱的金属碰撞声。',
    chapter: 1,
    type: 'risk_reward',
    choices: [
      { id: 'force_open', text: '强行撬开', outcomes: [{ type: 'gain_gold', value: 40, description: '获得 40 金币。' }, { type: 'lose_hp', value: 8, description: '失去 8 点生命。' }] },
      { id: 'careful_unlock', text: '小心开锁', outcomes: [{ type: 'gain_gold', value: 20, description: '获得 20 金币。' }] },
      { id: 'leave_chest', text: '离开', outcomes: [{ type: 'nothing', description: '放弃宝箱，安全离开。' }] },
    ],
  },
  fallen_adventurer: {
    id: 'fallen_adventurer',
    name: '倒下的冒险者',
    description: '破旧铠甲靠在墙角，短剑仍被尸体紧紧攥住，腰间似乎还藏着东西。',
    chapter: 1,
    type: 'risk_reward',
    choices: [
      { id: 'search_body', text: '搜刮行囊', outcomes: [{ type: 'gain_gold', value: 30, description: '获得 30 金币。' }, { type: 'lose_hp', value: 5, description: '失去 5 点生命。' }] },
      { id: 'pray_leave', text: '默哀后离开', outcomes: [{ type: 'gain_momentum', value: 1, description: '下一场战斗获得 1 点连势。' }] },
      { id: 'take_weapon', text: '取走短剑', outcomes: [{ type: 'gain_gold', value: 40, description: '获得 40 金币。' }] },
    ],
  },
  poison_well: {
    id: 'poison_well',
    name: '毒源古井',
    description: '井水泛着紫色荧光，甜腻的气味让人本能地保持警惕。',
    chapter: 1,
    type: 'risk_reward',
    choices: [
      { id: 'drink_water', text: '饮用井水', outcomes: [{ type: 'gain_hp', value: 15, description: '恢复 15 点生命。' }, { type: 'lose_max_hp', value: 3, description: '失去 3 点最大生命。' }] },
      { id: 'collect_bottles', text: '装瓶带走', outcomes: [{ type: 'gain_gold', value: 40, description: '获得 40 金币。' }] },
      { id: 'leave_well', text: '转身离开', outcomes: [{ type: 'nothing', description: '不触碰未知之物。' }] },
    ],
  },
  blood_pact: {
    id: 'blood_pact',
    name: '血契碑文',
    description: '碑文需要鲜血才能显现完整内容，裂隙里的低语催促你做出决定。',
    chapter: 1,
    type: 'curse_trade',
    choices: [
      { id: 'sign_pact', text: '以血为墨，签署契约', outcomes: [{ type: 'gain_card', cardId: 'burst_strike', description: '牌组加入 1 张破势击。' }, { type: 'lose_max_hp', value: 5, description: '失去 5 点最大生命。' }] },
      { id: 'read_only', text: '只看不碰', outcomes: [{ type: 'gain_gold', value: 10, description: '获得 10 金币。' }] },
      { id: 'smash碑文', text: '砸碎碑文', outcomes: [{ type: 'lose_hp', value: 6, description: '失去 6 点生命。' }] },
    ],
  },
  memory_mirror: {
    id: 'memory_mirror',
    name: '记忆之镜',
    description: '镜面映出你还未走过的道路，温暖和刺痛同时从倒影中传来。',
    chapter: 1,
    type: 'memory',
    choices: [
      { id: 'touch_mirror', text: '触碰镜面', outcomes: [{ type: 'gain_hp', value: 8, description: '恢复 8 点生命。' }, { type: 'gain_momentum', value: 1, description: '下一场战斗获得 1 点连势。' }] },
      { id: 'break_mirror', text: '砸碎镜子', outcomes: [{ type: 'gain_gold', value: 15, description: '获得 15 金币。' }, { type: 'lose_hp', value: 7, description: '失去 7 点生命。' }] },
      { id: 'leave_mirror', text: '不去看它', outcomes: [{ type: 'nothing', description: '带着未知继续前行。' }] },
    ],
  },
  clockwork_trap: {
    id: 'clockwork_trap',
    name: '发条陷阱',
    description: '齿轮机关正在缓慢复位，中央的暗格里透出遗物的冷光。',
    chapter: 1,
    type: 'strange_machine',
    choices: [
      { id: 'disarm', text: '拆解机关', outcomes: [{ type: 'gain_relic', relicId: 'quick_fuse', description: '获得疾燃引线。' }] },
      { id: 'rush_through', text: '趁机关松动穿过', outcomes: [{ type: 'gain_gold', value: 30, description: '获得 30 金币。' }, { type: 'lose_hp', value: 6, description: '失去 6 点生命。' }] },
      { id: 'wait', text: '等待机关停下', outcomes: [{ type: 'gain_momentum', value: 1, description: '下一场战斗获得 1 点连势。' }] },
    ],
  },
  dice_game: {
    id: 'dice_game',
    name: '骰子赌局',
    description: '蒙面人把骰盅推到你面前，规则简单得近乎危险：先付出，再看命运是否回礼。',
    chapter: 1,
    type: 'random_gamble',
    choices: [
      { id: 'bet_high', text: '支付 30 金币，换取 45 金币', requirements: 'gold >= 30', outcomes: [{ type: 'lose_gold', value: 30, description: '支付 30 金币。' }, { type: 'gain_gold', value: 45, description: '赢得 45 金币。' }] },
      { id: 'bet_low', text: '支付 10 金币，换取 18 金币', requirements: 'gold >= 10', outcomes: [{ type: 'lose_gold', value: 10, description: '支付 10 金币。' }, { type: 'gain_gold', value: 18, description: '赢得 18 金币。' }] },
      { id: 'refuse_bet', text: '拒绝赌局', outcomes: [{ type: 'nothing', description: '你收起金币，继续上路。' }] },
    ],
  },
  hidden_armory: {
    id: 'hidden_armory',
    name: '隐秘武器库',
    description: '锈蚀武器架的深处藏着一把漆黑匕首，刀刃上的红纹仍在缓慢流动。',
    chapter: 1,
    type: 'risk_reward',
    choices: [
      { id: 'choice_1', text: '握住那把匕首', outcomes: [{ type: 'gain_relic', relicId: 'vajra', description: '获得瓦哈纳神像。' }, { type: 'lose_hp', value: 5, description: '失去 5 点生命。' }] },
      { id: 'choice_2', text: '搜刮残破武器', outcomes: [{ type: 'gain_gold', value: 35, description: '获得 35 金币。' }] },
      { id: 'choice_3', text: '离开武器库', outcomes: [{ type: 'nothing', description: '放弃未知力量。' }] },
    ],
  },
  the_childs_drawing: {
    id: 'the_childs_drawing',
    name: '孩童的涂鸦',
    description: '破墙上的太阳、房屋和三个人仍保留着一点温暖，像是尖塔里不该存在的记忆。',
    chapter: 1,
    type: 'memory',
    choices: [
      { id: 'choice_1', text: '描摹那幅画', outcomes: [{ type: 'gain_hp', value: 8, description: '恢复 8 点生命。' }, { type: 'gain_gold', value: 10, description: '获得 10 金币。' }] },
      { id: 'choice_2', text: '在旁边画上微笑', outcomes: [{ type: 'gain_momentum', value: 2, description: '下一场战斗获得 2 点连势。' }] },
      { id: 'choice_3', text: '继续前行', outcomes: [{ type: 'nothing', description: '你不让回忆拖住脚步。' }] },
    ],
  },
  forgotten_workshop: {
    id: 'forgotten_workshop',
    name: '遗忘的工坊',
    description: '蓝白炉火仍在燃烧，工具摆放整齐，仿佛工匠只是暂时离开。',
    chapter: 1,
    type: 'strange_machine',
    choices: [
      { id: 'choice_1', text: '启动炉心', outcomes: [{ type: 'gain_relic', relicId: 'quick_fuse', description: '获得疾燃引线。' }, { type: 'lose_hp', value: 6, description: '失去 6 点生命。' }] },
      { id: 'choice_2', text: '搜集可用材料', outcomes: [{ type: 'gain_gold', value: 35, description: '获得 35 金币。' }] },
      { id: 'choice_3', text: '记下工坊位置后离开', outcomes: [{ type: 'gain_momentum', value: 1, description: '下一场战斗获得 1 点连势。' }] },
    ],
  },
};

export const RUNTIME_EVENTS_BY_CHAPTER: Record<number, EventDefinition[]> = {
  1: [
    RUNTIME_EVENT_DEFINITIONS.wandering_merchant!,
    RUNTIME_EVENT_DEFINITIONS.stillness_shrine!,
    RUNTIME_EVENT_DEFINITIONS.rusted_chest!,
    RUNTIME_EVENT_DEFINITIONS.fallen_adventurer!,
    RUNTIME_EVENT_DEFINITIONS.poison_well!,
    RUNTIME_EVENT_DEFINITIONS.blood_pact!,
    RUNTIME_EVENT_DEFINITIONS.memory_mirror!,
    RUNTIME_EVENT_DEFINITIONS.clockwork_trap!,
    RUNTIME_EVENT_DEFINITIONS.dice_game!,
    RUNTIME_EVENT_DEFINITIONS.hidden_armory!,
    RUNTIME_EVENT_DEFINITIONS.the_childs_drawing!,
    RUNTIME_EVENT_DEFINITIONS.forgotten_workshop!,
  ],
  2: [
    RUNTIME_EVENT_DEFINITIONS.burst_altar!,
    RUNTIME_EVENT_DEFINITIONS.purging_pool!,
    RUNTIME_EVENT_DEFINITIONS.stillness_shrine!,
  ],
  3: [
    RUNTIME_EVENT_DEFINITIONS.burst_altar!,
    RUNTIME_EVENT_DEFINITIONS.purging_pool!,
    RUNTIME_EVENT_DEFINITIONS.wandering_merchant!,
  ],
};

export const RUNTIME_EVENT_IDS = Object.keys(RUNTIME_EVENT_DEFINITIONS);
