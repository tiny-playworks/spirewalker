import type { EventDefinition } from './index';

export const GENERATED_EVENTS_2: Record<string, EventDefinition> = {
  // ─── Chapter 1 Events ───────────────────────────────────────────────

  // risk_reward (Ch1: events 1-3, Ch2: 4-5, Ch3: 6-9)
  crumbling_treasure_room: {
    id: 'crumbling_treasure_room',
    name: '坍塌的宝库',
    description: '石阶尽头，一道半掩的石门后透出微弱的金光。门框上刻满了警告的符文，但宝物的气息依然诱人。你注意到天花板上的裂痕正在缓慢扩大。',
    chapter: 1,
    type: 'risk_reward',
    choices: [
      {
        id: 'choice_1',
        text: '小心翼翼地进入，只取最近的宝物',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得 40 金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '冲进去搜刮所有能拿的东西',
        outcomes: [
          { type: 'gain_gold', value: 80, description: '获得 80 金币' },
          { type: 'lose_hp', value: 10, description: '碎石砸中，受到 10 点伤害' },
        ],
      },
      {
        id: 'choice_3',
        text: '不值得冒险，转身离开',
        outcomes: [
          { type: 'nothing', description: '你安全地离开了' },
        ],
      },
    ],
  },

  poisoned_well: {
    id: 'poisoned_well',
    name: '毒化的古井',
    description: '废墟中央有一口古井，水面泛着诡异的翠绿色荧光。你感到口干舌燥，但井水似乎散发着不祥的气息。井壁上刻着已经模糊不清的古老文字。',
    chapter: 1,
    type: 'risk_reward',
    choices: [
      {
        id: 'choice_1',
        text: '大胆饮用井水',
        outcomes: [
          { type: 'lose_hp', value: 8, description: '毒水侵蚀身体，受到 8 点伤害' },
          { type: 'gain_relic', description: '水底似乎有什么东西在闪光' },
        ],
      },
      {
        id: 'choice_2',
        text: '用容器收集少量井水带走',
        outcomes: [
          { type: 'gain_gold', value: 25, description: '瓶装毒液可以卖给炼金师' },
        ],
      },
      {
        id: 'choice_3',
        text: '绕过古井继续前行',
        outcomes: [
          { type: 'nothing', description: '你选择不去触碰未知的事物' },
        ],
      },
    ],
  },

  hidden_armory: {
    id: 'hidden_armory',
    name: '隐秘的武器库',
    description: '墙壁上嵌满了锈蚀的武器架，大多数武器已经腐朽不堪。角落里有一把漆黑如墨的匕首，刀刃上流动着暗红色的纹路，仿佛还残留着某种意志。',
    chapter: 1,
    type: 'risk_reward',
    choices: [
      {
        id: 'choice_1',
        text: '握住那把匕首',
        outcomes: [
          { type: 'gain_relic', description: '匕首似乎与你产生了共鸣' },
          { type: 'lose_hp', value: 5, description: '刀刃割伤了手掌' },
        ],
      },
      {
        id: 'choice_2',
        text: '搜刮周围的残破武器换取金币',
        outcomes: [
          { type: 'gain_gold', value: 35, description: '收集残片换取了 35 金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '这里的东西感觉不对，还是离开吧',
        outcomes: [
          { type: 'nothing', description: '你明智地选择了离开' },
        ],
      },
    ],
  },

  the_price_of_speed: {
    id: 'the_price_of_speed',
    name: '速度的代价',
    description: '前方出现两条岔路。左边是一条平坦但漫长的走廊，右边是一条陡峭的捷径，岩壁上布满了尖锐的碎石。',
    chapter: 2,
    type: 'risk_reward',
    choices: [
      {
        id: 'choice_1',
        text: '走捷径，翻越岩壁',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '节省了时间，途中发现一些金币' },
          { type: 'lose_hp', value: 7, description: '碎石划伤了身体' },
        ],
      },
      {
        id: 'choice_2',
        text: '走平坦的长廊',
        outcomes: [
          { type: 'nothing', description: '安全但无聊的旅程' },
        ],
      },
      {
        id: 'choice_3',
        text: '仔细搜索岩壁上的缝隙',
        outcomes: [
          { type: 'gain_gold', value: 50, description: '发现了前人藏匿的金币' },
          { type: 'lose_hp', value: 12, description: '岩壁突然松动，你摔了一跤' },
        ],
      },
    ],
  },

  the_gambler_altar: {
    id: 'the_gambler_altar',
    name: '赌徒的祭坛',
    description: '一座古老的祭坛上摆放着两颗骰子，一颗漆黑，一颗洁白。祭坛周围的地面上刻着赌博的图案，空气中弥漫着硫磺的气息。你感到一种催促你下注的冲动。',
    chapter: 2,
    type: 'risk_reward',
    choices: [
      {
        id: 'choice_1',
        text: '用黑骰子赌一把',
        outcomes: [
          { type: 'gain_gold', value: 70, description: '运气眷顾，赢得了 70 金币' },
          { type: 'lose_hp', value: 15, description: '黑骰子反噬，受到 15 点伤害' },
        ],
      },
      {
        id: 'choice_2',
        text: '用白骰子赌一把',
        outcomes: [
          { type: 'gain_gold', value: 50, description: '温和地赢了一些金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '两颗骰子都不碰',
        outcomes: [
          { type: 'nothing', description: '你抵制住了诱惑' },
        ],
      },
    ],
  },

  the_flame_offer: {
    id: 'the_flame_offer',
    name: '火焰的献礼',
    description: '黑暗中，一簇幽蓝色的火焰在空中悬浮。它似乎在等待你靠近，火焰中隐约可见一枚金币在旋转。空气中充满了灼热和灰烬的味道。',
    chapter: 3,
    type: 'risk_reward',
    choices: [
      {
        id: 'choice_1',
        text: '伸手去抓那枚金币',
        outcomes: [
          { type: 'gain_gold', value: 60, description: '你抓住了金币' },
          { type: 'lose_hp', value: 18, description: '火焰灼烧了你的手臂' },
        ],
      },
      {
        id: 'choice_2',
        text: '吹灭火苗，看看下面有什么',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '灰烬下埋着一些金币' },
          { type: 'lose_hp', value: 5, description: '吸入了有害的烟雾' },
        ],
      },
      {
        id: 'choice_3',
        text: '远离这诡异的火焰',
        outcomes: [
          { type: 'nothing', description: '你转身离开了' },
        ],
      },
    ],
  },

  the_last_guardian: {
    id: 'the_last_guardian',
    name: '最后的守卫',
    description: '一座倒塌的雕像手中紧握着一个密封的箱子。雕像的眼睛似乎在注视着你，虽然它已经碎裂了一半。箱子上刻着"唯有勇者可取"的字样。',
    chapter: 3,
    type: 'risk_reward',
    choices: [
      {
        id: 'choice_1',
        text: '强行掰开雕像的手取走箱子',
        outcomes: [
          { type: 'gain_gold', value: 90, description: '箱子里装满了金币' },
          { type: 'lose_max_hp', value: 3, description: '雕像碎片刺入身体，永久失去 3 点最大生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '向雕像鞠躬致敬后轻轻取走',
        outcomes: [
          { type: 'gain_gold', value: 55, description: '雕像似乎默许了，你获得了金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '尊重这位守卫，不触碰任何东西',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '你的敬畏之心让你获得了 2 层连势' },
        ],
      },
    ],
  },

  the_rift_walkers_toll: {
    id: 'the_rift_walkers_toll',
    name: '裂隙行者的过路费',
    description: '一个身穿破烂斗篷的身影挡住了去路。他的脸被阴影遮蔽，但你看到他手中把玩着一枚古老的金币。"交过路费，或者……"他没有说完。',
    chapter: 3,
    type: 'risk_reward',
    choices: [
      {
        id: 'choice_1',
        text: '交出 30 金币通过',
        outcomes: [
          { type: 'lose_gold', value: 30, description: '支付了 30 金币的过路费' },
        ],
      },
      {
        id: 'choice_2',
        text: '拒绝并强行通过',
        outcomes: [
          { type: 'lose_hp', value: 20, description: '影子掠过你的身体，留下了深深的伤痕' },
          { type: 'gain_gold', value: 40, description: '他在混乱中掉落了一些金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '提议用物品交换通行权',
        outcomes: [
          { type: 'lose_gold', value: 15, description: '协商后只需支付 15 金币' },
        ],
      },
    ],
  },

  // curse_trade (Ch1: 10-12, Ch2: 13-14, Ch3: 15-18)
  the_blind_oracle: {
    id: 'the_blind_oracle',
    name: '盲眼先知',
    description: '一个蒙着双眼的老妇人坐在废墟角落，她的手指在虚空中划动，仿佛在读取看不见的文字。"我知道你想要什么……代价是你会忘记一件事。"',
    chapter: 1,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '让她告诉你前方的陷阱',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '你避开了陷阱，捡到了一些金币' },
          { type: 'lose_max_hp', value: 2, description: '你忘记了一段重要的战斗记忆' },
        ],
      },
      {
        id: 'choice_2',
        text: '让她治愈你的伤势',
        outcomes: [
          { type: 'gain_hp', value: 15, description: '伤口愈合了' },
          { type: 'lose_max_hp', value: 2, description: '你忘记了自己来自哪里' },
        ],
      },
      {
        id: 'choice_3',
        text: '拒绝她的提议',
        outcomes: [
          { type: 'nothing', description: '你不想付出那样的代价' },
        ],
      },
    ],
  },

  the_cursed_mirror: {
    id: 'the_cursed_mirror',
    name: '诅咒之镜',
    description: '一面裂开的镜子立在走廊尽头，镜中映出的不是你的倒影，而是一个扭曲的影子。它似乎在向你招手，镜面泛着不祥的紫光。',
    chapter: 1,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '触摸镜面',
        outcomes: [
          { type: 'gain_relic', description: '影子递出了一件古老的遗物' },
          { type: 'lose_max_hp', value: 3, description: '你的双眼暂时失明了，最大生命永久下降' },
        ],
      },
      {
        id: 'choice_2',
        text: '用布包裹镜子带走',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '镜框是纯金的' },
          { type: 'lose_hp', value: 8, description: '镜子在挣扎中划伤了你' },
        ],
      },
      {
        id: 'choice_3',
        text: '打碎镜子',
        outcomes: [
          { type: 'nothing', description: '碎片散落一地，影子尖叫着消散' },
        ],
      },
    ],
  },

  the_memory_seller: {
    id: 'the_memory_seller',
    name: '记忆贩子',
    description: '一个驼背的商人坐在装满玻璃瓶的摊位前，每个瓶子里都漂浮着一团发光的雾气。"这些都是珍贵的记忆……买一瓶，你就能看到过去。"',
    chapter: 1,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '买一瓶"战争的记忆"',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '你学到了古老的战斗技巧，获得 3 层连势' },
          { type: 'lose_gold', value: 45, description: '支付了 45 金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '买一瓶"宝藏的记忆"',
        outcomes: [
          { type: 'gain_gold', value: 60, description: '记忆中显示了隐藏宝藏的位置' },
          { type: 'lose_gold', value: 35, description: '支付了 35 金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '不买，直接离开',
        outcomes: [
          { type: 'nothing', description: '你不需要别人的记忆' },
        ],
      },
    ],
  },

  the_tithe_of_flesh: {
    id: 'the_tithe_of_flesh',
    name: '血肉的什一税',
    description: '一座祭坛前，黑血从裂缝中涌出。空气中的低语声告诉你：只要献上一些血肉，就能获得古老的恩赐。祭坛上的符文正在等待回应。',
    chapter: 2,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '献上鲜血',
        outcomes: [
          { type: 'gain_hp', value: 20, description: '伤口以超自然的速度愈合' },
          { type: 'lose_max_hp', value: 4, description: '你的生命力被永久削弱' },
        ],
      },
      {
        id: 'choice_2',
        text: '只献上一滴血作为象征',
        outcomes: [
          { type: 'gain_hp', value: 8, description: '轻微的恢复' },
        ],
      },
      {
        id: 'choice_3',
        text: '拒绝献祭',
        outcomes: [
          { type: 'nothing', description: '低语声愤怒地消散了' },
        ],
      },
    ],
  },

  the_debt_collector: {
    id: 'the_debt_collector',
    name: '讨债人',
    description: '一个戴着铁面具的身影出现在你面前，手中拿着一本泛黄的账簿。"你的血脉中有一笔未偿还的债务……现在是时候了。"',
    chapter: 2,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '用金币偿还债务',
        outcomes: [
          { type: 'lose_gold', value: 60, description: '你支付了 60 金币' },
          { type: 'gain_relic', description: '讨债人留下了一件古老的遗物作为凭证' },
        ],
      },
      {
        id: 'choice_2',
        text: '用生命力偿还',
        outcomes: [
          { type: 'lose_max_hp', value: 5, description: '你的生命力被抽走了一部分' },
        ],
      },
      {
        id: 'choice_3',
        text: '拒绝承认这笔债务',
        outcomes: [
          { type: 'lose_hp', value: 15, description: '讨债人惩罚了你的忤逆' },
          { type: 'gain_gold', value: 20, description: '他在愤怒中掉落了一些金币' },
        ],
      },
    ],
  },

  the_broken_vow: {
    id: 'the_broken_vow',
    name: '破碎的誓言',
    description: '地面上刻着一个古老的誓约符文，散发着微弱的蓝光。你可以感受到曾经有人在这里许下誓言，但誓言已经破碎，留下了力量的残渣。',
    chapter: 3,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '吸收誓言的残渣',
        outcomes: [
          { type: 'gain_momentum', value: 4, description: '誓言的力量融入了你，获得 4 层连势' },
          { type: 'lose_max_hp', value: 3, description: '誓言的代价也转移到了你身上' },
        ],
      },
      {
        id: 'choice_2',
        text: '修复这个誓言',
        outcomes: [
          { type: 'gain_hp', value: 25, description: '誓言修复后，你感受到了祝福' },
          { type: 'lose_gold', value: 40, description: '修复需要消耗金币作为材料' },
        ],
      },
      {
        id: 'choice_3',
        text: '绕过这个符文',
        outcomes: [
          { type: 'nothing', description: '你不想与破碎的誓言扯上关系' },
        ],
      },
    ],
  },

  the_price_of_sight: {
    id: 'the_price_of_sight',
    name: '洞察的代价',
    description: '一个水晶球悬浮在空中，内部闪烁着无数的画面。你可以通过它看到未来的片段，但每次观看都会消耗你的一部分生命力。',
    chapter: 3,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '凝视水晶球',
        outcomes: [
          { type: 'gain_gold', value: 70, description: '你看到了宝藏的位置' },
          { type: 'lose_max_hp', value: 4, description: '过度使用让你付出了代价' },
        ],
      },
      {
        id: 'choice_2',
        text: '只看一眼',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '你短暂地看到了一些线索' },
          { type: 'lose_hp', value: 5, description: '轻微的生命力消耗' },
        ],
      },
      {
        id: 'choice_3',
        text: '不看',
        outcomes: [
          { type: 'nothing', description: '你选择不窥探命运' },
        ],
      },
    ],
  },

  the_echo_of_sin: {
    id: 'the_echo_of_sin',
    name: '罪孽的回响',
    description: '墙壁上浮现出你过去的罪孽画面——那些你未能拯救的人，那些你造成的伤害。画面中有一个声音低语："接受惩罚，或者……让别人替你承受。"',
    chapter: 3,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '接受惩罚',
        outcomes: [
          { type: 'lose_max_hp', value: 3, description: '你的生命力被永久削弱' },
          { type: 'gain_gold', value: 50, description: '但你在惩罚中发现了前人留下的金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '让别人替你承受',
        outcomes: [
          { type: 'lose_hp', value: 12, description: '你感到一阵短暂的痛苦' },
          { type: 'gain_gold', value: 40, description: '画面消失了，留下了一些金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '无视这些幻象',
        outcomes: [
          { type: 'nothing', description: '你转身离去，不再回头' },
        ],
      },
    ],
  },

  // merchant (Ch1: 19-20, Ch2: 21-22, Ch3: 23-27)
  the_shadow_merchant: {
    id: 'the_shadow_merchant',
    name: '阴影商人',
    description: '一个身影从墙壁的阴影中浮现，他的面容隐没在兜帽之下。他的摊位上摆满了散发着微光的物品，但所有东西都笼罩在一层薄薄的黑暗之中。',
    chapter: 1,
    type: 'merchant',
    choices: [
      {
        id: 'choice_1',
        text: '购买一把附魔匕首',
        outcomes: [
          { type: 'lose_gold', value: 50, description: '支付了 50 金币' },
          { type: 'gain_relic', description: '获得了一把附魔匕首' },
        ],
      },
      {
        id: 'choice_2',
        text: '购买一瓶治愈药水',
        outcomes: [
          { type: 'lose_gold', value: 30, description: '支付了 30 金币' },
          { type: 'gain_hp', value: 20, description: '药水恢复了你的生命力' },
        ],
      },
      {
        id: 'choice_3',
        text: '什么都不买',
        outcomes: [
          { type: 'nothing', description: '你保持着警惕' },
        ],
      },
    ],
  },

  the_ghost_pedlar: {
    id: 'the_ghost_pedlar',
    name: '幽灵小贩',
    description: '一个半透明的身影在废墟中徘徊，他推着一辆装满杂物的手推车。他的声音像是从很远的地方传来："新鲜的……不，古老的货物……来看看吧……"',
    chapter: 1,
    type: 'merchant',
    choices: [
      {
        id: 'choice_1',
        text: '购买一张古老的卡牌',
        outcomes: [
          { type: 'lose_gold', value: 60, description: '支付了 60 金币' },
          { type: 'gain_card', description: '获得了一张稀有卡牌' },
        ],
      },
      {
        id: 'choice_2',
        text: '询问关于这个地方的信息',
        outcomes: [
          { type: 'lose_gold', value: 20, description: '支付了 20 金币的信息费' },
          { type: 'gain_gold', value: 15, description: '小贩告诉你一个藏钱的位置' },
        ],
      },
      {
        id: 'choice_3',
        text: '快速离开',
        outcomes: [
          { type: 'nothing', description: '你不想和幽灵做交易' },
        ],
      },
    ],
  },

  the_alchemist_bargain: {
    id: 'the_alchemist_bargain',
    name: '炼金师的交易',
    description: '一个戴着鸟嘴面具的炼金师在角落里摆弄着他的瓶瓶罐罐。他注意到你的存在，"哦，一个活人……我有些好东西，只要你付得起代价。"',
    chapter: 2,
    type: 'merchant',
    choices: [
      {
        id: 'choice_1',
        text: '购买一瓶强化药剂',
        outcomes: [
          { type: 'lose_gold', value: 55, description: '支付了 55 金币' },
          { type: 'gain_momentum', value: 3, description: '药剂增强了你的战斗能力' },
        ],
      },
      {
        id: 'choice_2',
        text: '购买一瓶解毒剂',
        outcomes: [
          { type: 'lose_gold', value: 40, description: '支付了 40 金币' },
          { type: 'gain_hp', value: 15, description: '解毒剂清除了你体内的毒素' },
        ],
      },
      {
        id: 'choice_3',
        text: '交易自己的血液换取物品',
        outcomes: [
          { type: 'lose_hp', value: 10, description: '炼金师抽走了一些血液' },
          { type: 'gain_relic', description: '他给了你一件炼金制品' },
        ],
      },
      {
        id: 'choice_4',
        text: '转身离开',
        outcomes: [
          { type: 'nothing', description: '你不想和炼金师做交易' },
        ],
      },
    ],
  },

  the_bone_merchant: {
    id: 'the_bone_merchant',
    name: '骸骨商人',
    description: '一个由骸骨拼凑而成的人形生物坐在一堆骨头堆成的椅子上。它的嘴巴一张一合，发出骨头碰撞的声音。它的摊位上摆满了骨制的饰品和工具。',
    chapter: 2,
    type: 'merchant',
    choices: [
      {
        id: 'choice_1',
        text: '购买一枚骨制护符',
        outcomes: [
          { type: 'lose_gold', value: 45, description: '支付了 45 金币' },
          { type: 'gain_relic', description: '获得了一枚骨制护符' },
        ],
      },
      {
        id: 'choice_2',
        text: '用你的一根骨头交换',
        outcomes: [
          { type: 'lose_hp', value: 8, description: '它从你身上取走了一根骨头' },
          { type: 'gain_gold', value: 30, description: '它给了你一些金币作为交换' },
        ],
      },
      {
        id: 'choice_3',
        text: '询问关于亡者的信息',
        outcomes: [
          { type: 'lose_gold', value: 25, description: '支付了 25 金币' },
          { type: 'gain_card', description: '它给了你一张亡灵卡牌' },
        ],
      },
    ],
  },

  the_wandering_trader: {
    id: 'the_wandering_trader',
    name: '流浪商人',
    description: '一个风尘仆仆的旅行者在废墟中搭起了简易的帐篷。他的货物看起来比其他商人更加实用，但价格也更高。"好货不便宜，便宜没好货。"',
    chapter: 3,
    type: 'merchant',
    choices: [
      {
        id: 'choice_1',
        text: '购买一套精良的护甲',
        outcomes: [
          { type: 'lose_gold', value: 70, description: '支付了 70 金币' },
          { type: 'gain_hp', value: 10, description: '护甲增强了你的防御力' },
          { type: 'gain_relic', description: '获得了一套精良护甲' },
        ],
      },
      {
        id: 'choice_2',
        text: '购买一瓶高级治疗药水',
        outcomes: [
          { type: 'lose_gold', value: 50, description: '支付了 50 金币' },
          { type: 'gain_hp', value: 25, description: '高级治疗药水恢复了大量生命力' },
        ],
      },
      {
        id: 'choice_3',
        text: '只看看，不买',
        outcomes: [
          { type: 'nothing', description: '你保持着谨慎' },
        ],
      },
    ],
  },

  the_mad_alchemist: {
    id: 'the_mad_alchemist',
    name: '疯狂的炼金师',
    description: '一个头发蓬乱的炼金师在一间摇摇欲坠的实验室里忙碌着。他突然转向你，眼睛里闪烁着疯狂的光芒："来得正好！帮我试一下这个新配方！"',
    chapter: 1,
    type: 'merchant',
    choices: [
      {
        id: 'choice_1',
        text: '帮他试药',
        outcomes: [
          { type: 'gain_relic', description: '他兴奋地给了你一件炼金制品' },
          { type: 'lose_hp', value: 12, description: '药剂让你感到不适' },
        ],
      },
      {
        id: 'choice_2',
        text: '花钱买他已完成的作品',
        outcomes: [
          { type: 'lose_gold', value: 50, description: '支付了 50 金币' },
          { type: 'gain_card', description: '获得了一张炼金卡牌' },
        ],
      },
      {
        id: 'choice_3',
        text: '悄悄离开',
        outcomes: [
          { type: 'nothing', description: '你不想成为实验品' },
        ],
      },
    ],
  },

  // memory (Ch1: 28-29, Ch2: 30-31, Ch3: 32-36)
  the_fallen_warrior: {
    id: 'the_fallen_warrior',
    name: '倒下的战士',
    description: '一具身穿破旧铠甲的尸体靠坐在墙边，手中紧握着一封未寄出的信。你弯腰捡起信件，上面写着对家人的告别。你的手指触碰到铠甲时，感受到了一阵温暖。',
    chapter: 1,
    type: 'memory',
    choices: [
      {
        id: 'choice_1',
        text: '阅读他的信件',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '你感受到了战士的意志，获得 2 层连势' },
          { type: 'gain_gold', value: 15, description: '你在铠甲中发现了一些金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '取走他的武器',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '武器可以卖个好价钱' },
        ],
      },
      {
        id: 'choice_3',
        text: '合上他的眼睛，默默离开',
        outcomes: [
          { type: 'gain_hp', value: 5, description: '你的心灵得到了平静' },
        ],
      },
    ],
  },

  the_ancient_library: {
    id: 'the_ancient_library',
    name: '古老的藏书室',
    description: '灰尘覆盖的书架排列在昏暗的房间中，大多数书籍已经腐朽不堪。角落里有一本保存完好的书，封面用未知的文字书写。翻开书页时，文字开始发光。',
    chapter: 1,
    type: 'memory',
    choices: [
      {
        id: 'choice_1',
        text: '仔细研读这本书',
        outcomes: [
          { type: 'gain_card', description: '你学会了一种古老的技艺' },
          { type: 'lose_hp', value: 5, description: '书中的文字灼伤了你的眼睛' },
        ],
      },
      {
        id: 'choice_2',
        text: '快速翻阅，记下要点',
        outcomes: [
          { type: 'gain_gold', value: 20, description: '书中提到了一个隐藏宝藏的位置' },
        ],
      },
      {
        id: 'choice_3',
        text: '把书带走以后再看',
        outcomes: [
          { type: 'gain_card', description: '你获得了一本珍贵的书籍' },
        ],
      },
    ],
  },

  the_childs_drawing: {
    id: 'the_childs_drawing',
    name: '孩童的涂鸦',
    description: '在一面破碎的墙壁上，你发现了一幅孩童的涂鸦。画中是一个太阳、一座房子和三个小人。颜料已经褪色，但你似乎能感受到画中蕴含的温暖。你的胸口涌起一阵莫名的酸楚。',
    chapter: 1,
    type: 'memory',
    choices: [
      {
        id: 'choice_1',
        text: '用手指轻轻描摹那幅画',
        outcomes: [
          { type: 'gain_hp', value: 8, description: '你的心灵得到了治愈' },
          { type: 'gain_gold', value: 10, description: '画框后面藏着一些硬币' },
        ],
      },
      {
        id: 'choice_2',
        text: '在旁边画上一个微笑',
        outcomes: [
          { type: 'gain_hp', value: 5, description: '你感到了片刻的安宁' },
        ],
      },
      {
        id: 'choice_3',
        text: '继续前行，不让回忆拖住脚步',
        outcomes: [
          { type: 'gain_momentum', value: 1, description: '你的决心更加坚定' },
        ],
      },
    ],
  },

  the_shattered_journal: {
    id: 'the_shattered_journal',
    name: '破碎的日记',
    description: '一本残破的日记散落在地上，你能辨认出最后几页的字迹："……第七层的封印已经松动了……如果有人看到这本日记，千万不要打开那扇门……"字迹到这里就中断了。',
    chapter: 2,
    type: 'memory',
    choices: [
      {
        id: 'choice_1',
        text: '按日记的指引寻找那扇门',
        outcomes: [
          { type: 'gain_gold', value: 50, description: '你在门后发现了宝藏' },
          { type: 'lose_hp', value: 12, description: '门后的陷阱伤害了你' },
        ],
      },
      {
        id: 'choice_2',
        text: '收集日记中提到的有用信息',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '日记中的知识增强了你' },
          { type: 'gain_gold', value: 20, description: '日记提到了一些藏钱的位置' },
        ],
      },
      {
        id: 'choice_3',
        text: '无视警告，继续正常探索',
        outcomes: [
          { type: 'nothing', description: '你没有找到什么特别的东西' },
        ],
      },
    ],
  },

  the_old_song: {
    id: 'the_old_song',
    name: '古老的歌谣',
    description: '废墟中回荡着一阵若有若无的歌声，那是一首古老的歌谣。你跟着歌声走去，发现了一个音乐盒，它正在播放一首你似乎很熟悉的旋律。你的心跳开始加速。',
    chapter: 2,
    type: 'memory',
    choices: [
      {
        id: 'choice_1',
        text: '跟着旋律哼唱',
        outcomes: [
          { type: 'gain_hp', value: 10, description: '歌声治愈了你' },
          { type: 'gain_gold', value: 15, description: '音乐盒下面藏着一些金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '试图找到音乐的来源',
        outcomes: [
          { type: 'gain_card', description: '你发现了一张以音乐为主题的卡牌' },
        ],
      },
      {
        id: 'choice_3',
        text: '关闭音乐盒',
        outcomes: [
          { type: 'nothing', description: '你不想被歌声迷惑' },
        ],
      },
    ],
  },

  the_forgotten_city: {
    id: 'the_forgotten_city',
    name: '被遗忘的城市',
    description: '你走进了一个完整的地下城市遗址，建筑保存完好，仿佛时间在这里停止了流动。街道上散落着日常生活用品，但没有任何生命的迹象。你感到一种深深的孤独。',
    chapter: 2,
    type: 'memory',
    choices: [
      {
        id: 'choice_1',
        text: '探索城市的中心广场',
        outcomes: [
          { type: 'gain_gold', value: 45, description: '广场上的喷泉中沉积了大量金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '进入民居寻找有用的物品',
        outcomes: [
          { type: 'gain_card', description: '你在一户人家中找到了一件珍品' },
          { type: 'gain_gold', value: 20, description: '抽屉里还有一些零散的金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '在城中冥想',
        outcomes: [
          { type: 'gain_hp', value: 12, description: '你的心灵得到了休息' },
        ],
      },
    ],
  },

  the_mirror_of_self: {
    id: 'the_mirror_of_self',
    name: '自我之镜',
    description: '一面巨大的镜子立在废墟中央，镜面完美无瑕。当你走近时，镜中的你似乎在微笑，而你的脸上并没有笑容。它开口说话了："你想知道真正的自己吗？"',
    chapter: 3,
    type: 'memory',
    choices: [
      {
        id: 'choice_1',
        text: '与镜中的自己对话',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '你了解了自己的力量，获得 3 层连势' },
          { type: 'lose_hp', value: 8, description: '真相有时会伤人' },
        ],
      },
      {
        id: 'choice_2',
        text: '打碎镜子',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '镜子后面藏着一个保险箱' },
        ],
      },
      {
        id: 'choice_3',
        text: '转身离开，不想面对',
        outcomes: [
          { type: 'nothing', description: '你还没有准备好面对真相' },
        ],
      },
    ],
  },

  the_last_meal: {
    id: 'the_last_meal',
    name: '最后的晚餐',
    description: '一张石桌上摆放着看似新鲜的食物和一壶酒。餐具已经准备好了，仿佛有人刚刚离开。食物散发着诱人的香气，但你注意到空气中有微弱的苦杏仁味。',
    chapter: 3,
    type: 'memory',
    choices: [
      {
        id: 'choice_1',
        text: '享用这顿美餐',
        outcomes: [
          { type: 'gain_hp', value: 15, description: '食物恢复了你的体力' },
          { type: 'lose_hp', value: 10, description: '食物中似乎掺了毒' },
        ],
      },
      {
        id: 'choice_2',
        text: '只喝酒，不吃食物',
        outcomes: [
          { type: 'gain_hp', value: 8, description: '酒是安全的，恢复了一些体力' },
        ],
      },
      {
        id: 'choice_3',
        text: '搜查桌子和周围',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '你发现了前人藏匿的金币' },
          { type: 'gain_card', description: '桌下有一张古老的卡牌' },
        ],
      },
      {
        id: 'choice_4',
        text: '不动任何东西',
        outcomes: [
          { type: 'nothing', description: '你保持着谨慎' },
        ],
      },
    ],
  },

  the_eternal_flame: {
    id: 'the_eternal_flame',
    name: '永恒之火',
    description: '一盏油灯在废墟中燃烧着，火焰是诡异的蓝色。它不应该还在燃烧，但灯里的油似乎永远不会耗尽。火焰中似乎困着什么东西，它在向你求助。',
    chapter: 3,
    type: 'memory',
    choices: [
      {
        id: 'choice_1',
        text: '吹灭火焰',
        outcomes: [
          { type: 'gain_hp', value: 15, description: '被困的灵魂得到了解放，作为感谢它治愈了你' },
        ],
      },
      {
        id: 'choice_2',
        text: '将灯带走',
        outcomes: [
          { type: 'gain_relic', description: '你获得了一盏永恒之灯' },
          { type: 'lose_hp', value: 8, description: '火焰灼伤了你的手' },
        ],
      },
      {
        id: 'choice_3',
        text: '无视这盏灯',
        outcomes: [
          { type: 'nothing', description: '你继续前行' },
        ],
      },
    ],
  },

  // corruption (Ch1: 37-38, Ch2: 39-40, Ch3: 41-45)
  the_corrupted_healing: {
    id: 'the_corrupted_healing',
    name: '腐化的治疗',
    description: '地面上有一个散发着绿色荧光的水洼，水面上漂浮着腐败的落叶。你可以感受到水中的治愈力量，但同时也能感受到一种深沉的腐化气息。',
    chapter: 1,
    type: 'corruption',
    choices: [
      {
        id: 'choice_1',
        text: '将伤口浸入水中',
        outcomes: [
          { type: 'gain_hp', value: 18, description: '伤口迅速愈合了' },
          { type: 'lose_max_hp', value: 2, description: '但腐化也渗入了你的身体' },
        ],
      },
      {
        id: 'choice_2',
        text: '只用手指沾一点水',
        outcomes: [
          { type: 'gain_hp', value: 8, description: '轻微的恢复' },
        ],
      },
      {
        id: 'choice_3',
        text: '远离这个水洼',
        outcomes: [
          { type: 'nothing', description: '你不想被腐化' },
        ],
      },
    ],
  },

  the_cursed_blade: {
    id: 'the_cursed_blade',
    name: '诅咒之刃',
    description: '一把漆黑的剑插在石板地上，剑身上流动着暗红色的纹路。你靠近时，能感受到剑在呼唤你的名字。它散发着强大的力量，但也伴随着不祥的气息。',
    chapter: 1,
    type: 'corruption',
    choices: [
      {
        id: 'choice_1',
        text: '握住剑柄',
        outcomes: [
          { type: 'gain_relic', description: '你获得了诅咒之刃' },
          { type: 'lose_max_hp', value: 3, description: '剑的诅咒渗入了你的身体' },
        ],
      },
      {
        id: 'choice_2',
        text: '用石头砸碎剑',
        outcomes: [
          { type: 'gain_gold', value: 35, description: '剑身碎裂后露出了藏在其中的金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '绕过这把剑',
        outcomes: [
          { type: 'nothing', description: '你不想触碰诅咒之物' },
        ],
      },
    ],
  },

  the_blighted_blessing: {
    id: 'the_blighted_blessing',
    name: '枯萎的祝福',
    description: '一座古老的神像前，枯萎的藤蔓缠绕着祭坛。你感到一种神圣但扭曲的力量。藤蔓中夹杂着一些发光的果实，看起来既诱人又危险。',
    chapter: 1,
    type: 'corruption',
    choices: [
      {
        id: 'choice_1',
        text: '摘下一颗果实',
        outcomes: [
          { type: 'gain_hp', value: 12, description: '果实恢复了你的生命力' },
          { type: 'lose_max_hp', value: 2, description: '果实中混杂着毒素' },
        ],
      },
      {
        id: 'choice_2',
        text: '向神像祈祷',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '你感受到了一丝神圣的力量' },
          { type: 'lose_gold', value: 15, description: '你献上了一些金币作为供品' },
        ],
      },
      {
        id: 'choice_3',
        text: '不碰任何东西',
        outcomes: [
          { type: 'nothing', description: '你保持着距离' },
        ],
      },
    ],
  },

  the_corrupted_altar: {
    id: 'the_corrupted_altar',
    name: '腐化的祭坛',
    description: '祭坛上的符文散发着不祥的黑光，空气中弥漫着硫磺的味道。你可以感受到强大的力量从祭坛中涌出，但这种力量已经被什么东西污染了。',
    chapter: 2,
    type: 'corruption',
    choices: [
      {
        id: 'choice_1',
        text: '将你的力量注入祭坛',
        outcomes: [
          { type: 'gain_momentum', value: 4, description: '腐化的力量涌入了你的身体' },
          { type: 'lose_max_hp', value: 4, description: '但你的生命力被永久削弱' },
        ],
      },
      {
        id: 'choice_2',
        text: '从祭坛中汲取少量力量',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '你获得了部分力量' },
          { type: 'lose_max_hp', value: 2, description: '代价是少量最大生命力' },
        ],
      },
      {
        id: 'choice_3',
        text: '摧毁这个祭坛',
        outcomes: [
          { type: 'lose_hp', value: 15, description: '祭坛爆炸时伤到了你' },
          { type: 'gain_gold', value: 40, description: '废墟中露出了隐藏的金币' },
        ],
      },
    ],
  },

  the_shadow_mark: {
    id: 'the_shadow_mark',
    name: '阴影的印记',
    description: '你的手臂上突然出现了一个黑色的印记，它在缓慢地扩散。你可以感受到印记中蕴含着强大的阴影力量，但它也在慢慢侵蚀你的生命力。',
    chapter: 2,
    type: 'corruption',
    choices: [
      {
        id: 'choice_1',
        text: '主动吸收印记的力量',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '阴影力量为你所用' },
          { type: 'lose_max_hp', value: 3, description: '印记吞噬了一部分生命力' },
        ],
      },
      {
        id: 'choice_2',
        text: '用火焰烧掉印记',
        outcomes: [
          { type: 'lose_hp', value: 12, description: '烧掉印记时非常痛苦' },
        ],
      },
      {
        id: 'choice_3',
        text: '无视印记，继续前行',
        outcomes: [
          { type: 'nothing', description: '印记暂时没有造成伤害' },
        ],
      },
    ],
  },

  the_whispering_stone: {
    id: 'the_whispering_stone',
    name: '低语之石',
    description: '一块黑色的石头在你手中低语，它告诉你一个秘密：附近有一个隐藏的宝藏，但你需要用生命力来交换获取的方法。',
    chapter: 2,
    type: 'corruption',
    choices: [
      {
        id: 'choice_1',
        text: '告诉石头你的生命力',
        outcomes: [
          { type: 'lose_max_hp', value: 3, description: '石头吸走了一部分生命力' },
          { type: 'gain_gold', value: 65, description: '你找到了隐藏的宝藏' },
        ],
      },
      {
        id: 'choice_2',
        text: '拒绝石头的提议',
        outcomes: [
          { type: 'nothing', description: '低语声停止了' },
        ],
      },
      {
        id: 'choice_3',
        text: '砸碎石头',
        outcomes: [
          { type: 'gain_gold', value: 25, description: '石头碎片中有一些金币' },
          { type: 'lose_hp', value: 5, description: '碎片划伤了你' },
        ],
      },
    ],
  },

  the_rotten_offering: {
    id: 'the_rotten_offering',
    name: '腐朽的供品',
    description: '祭坛上摆放着已经腐烂的供品——水果、花朵和动物骨骼。但腐朽之中，你看到一朵不知名的花还在顽强地绽放。它散发着微弱但纯净的光芒。',
    chapter: 3,
    type: 'corruption',
    choices: [
      {
        id: 'choice_1',
        text: '摘下那朵花',
        outcomes: [
          { type: 'gain_hp', value: 15, description: '花朵治愈了你' },
          { type: 'lose_hp', value: 5, description: '但腐朽的气息也伤害了你' },
        ],
      },
      {
        id: 'choice_2',
        text: '将花移植到你的背包中',
        outcomes: [
          { type: 'gain_relic', description: '你获得了一朵奇迹之花' },
        ],
      },
      {
        id: 'choice_3',
        text: '不碰供品',
        outcomes: [
          { type: 'nothing', description: '你尊重这些供品' },
        ],
      },
    ],
  },

  the_veil_of_darkness: {
    id: 'the_veil_of_darkness',
    name: '黑暗的面纱',
    description: '一层薄薄的黑暗笼罩在你面前，你可以隐约看到另一边有什么东西。空气中充满了诱人的声音，承诺着力量和知识。你感到一种强烈的冲动想要穿过它。',
    chapter: 3,
    type: 'corruption',
    choices: [
      {
        id: 'choice_1',
        text: '穿过黑暗',
        outcomes: [
          { type: 'gain_momentum', value: 4, description: '你获得了黑暗中的力量' },
          { type: 'lose_max_hp', value: 3, description: '黑暗侵蚀了你的一部分' },
        ],
      },
      {
        id: 'choice_2',
        text: '撕开黑暗',
        outcomes: [
          { type: 'lose_hp', value: 10, description: '黑暗在消散时伤害了你' },
          { type: 'gain_gold', value: 30, description: '黑暗后面藏着一些金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '绕过黑暗',
        outcomes: [
          { type: 'nothing', description: '你选择安全的路线' },
        ],
      },
    ],
  },

  the_tainted_well: {
    id: 'the_tainted_well',
    name: '被污染的水井',
    description: '一口水井散发着不祥的气息，水面上漂浮着黑色的絮状物。但井水深处似乎有什么东西在发光。你可以感受到水中的力量，但也感受到其中的腐化。',
    chapter: 3,
    type: 'corruption',
    choices: [
      {
        id: 'choice_1',
        text: '潜入水中寻找发光的东西',
        outcomes: [
          { type: 'gain_relic', description: '你从井底找到了一件古老遗物' },
          { type: 'lose_max_hp', value: 3, description: '井水的腐化渗入了你' },
        ],
      },
      {
        id: 'choice_2',
        text: '用绳子打捞',
        outcomes: [
          { type: 'gain_gold', value: 35, description: '你捞到了一些金币' },
          { type: 'lose_hp', value: 5, description: '黑色絮状物灼伤了你的手' },
        ],
      },
      {
        id: 'choice_3',
        text: '不碰这口井',
        outcomes: [
          { type: 'nothing', description: '你绕过了水井' },
        ],
      },
    ],
  },

  // strange_machine (Ch1: 46-47, Ch2: 48-49, Ch3: 50-54)
  the_gear_box: {
    id: 'the_gear_box',
    name: '齿轮箱',
    description: '一个锈迹斑斑的齿轮箱嵌在墙壁中，里面的齿轮还在缓慢转动。你可以看到箱子内部有一些闪光的东西，但要取出来需要打开箱盖。',
    chapter: 1,
    type: 'strange_machine',
    choices: [
      {
        id: 'choice_1',
        text: '强行打开箱盖',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '箱子里有一些金币' },
          { type: 'lose_hp', value: 8, description: '齿轮割伤了你的手' },
        ],
      },
      {
        id: 'choice_2',
        text: '小心地拆解齿轮',
        outcomes: [
          { type: 'gain_gold', value: 25, description: '你安全地取出了金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '不碰这个机器',
        outcomes: [
          { type: 'nothing', description: '你不想冒险' },
        ],
      },
    ],
  },

  the_crystal_orb: {
    id: 'the_crystal_orb',
    name: '水晶球体',
    description: '一个巨大的水晶球体悬浮在房间中央，内部闪烁着各种颜色的光芒。它的表面光滑如镜，你可以看到自己的倒影，但倒影似乎在做不同的动作。',
    chapter: 1,
    type: 'strange_machine',
    choices: [
      {
        id: 'choice_1',
        text: '触摸水晶球体',
        outcomes: [
          { type: 'gain_card', description: '球体传递了一种技艺给你' },
          { type: 'lose_hp', value: 6, description: '球体释放了能量冲击' },
        ],
      },
      {
        id: 'choice_2',
        text: '用武器攻击球体',
        outcomes: [
          { type: 'gain_gold', value: 45, description: '球体破碎后露出了金币' },
          { type: 'lose_hp', value: 10, description: '碎片飞溅，伤到了你' },
        ],
      },
      {
        id: 'choice_3',
        text: '仔细观察球体',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '你在球体中学会了新的战斗技巧' },
        ],
      },
    ],
  },

  the_time_device: {
    id: 'the_time_device',
    name: '时间装置',
    description: '一个精密的机械装置立在你面前，指针在表盘上不规则地跳动。当你靠近时，你感到时间在你周围变得不稳定。装置上有一个明显的按钮。',
    chapter: 2,
    type: 'merchant',
    choices: [
      {
        id: 'choice_1',
        text: '按下按钮',
        outcomes: [
          { type: 'gain_gold', value: 55, description: '时间倒流，你发现自己站在一堆金币上' },
          { type: 'lose_hp', value: 12, description: '时间跳跃的副作用伤害了你' },
        ],
      },
      {
        id: 'choice_2',
        text: '拆解装置获取零件',
        outcomes: [
          { type: 'gain_gold', value: 35, description: '精密零件可以卖个好价钱' },
        ],
      },
      {
        id: 'choice_3',
        text: '记录装置的样子后离开',
        outcomes: [
          { type: 'gain_momentum', value: 1, description: '你对这个装置有了更深的理解' },
        ],
      },
    ],
  },

  the_teleporter: {
    id: 'the_teleporter',
    name: '传送门',
    description: '一个由能量构成的漩涡在墙壁上缓慢旋转，它似乎连接着某个遥远的地方。你可以隐约看到漩涡另一边的景象，但画面模糊不清。',
    chapter: 2,
    type: 'strange_machine',
    choices: [
      {
        id: 'choice_1',
        text: '穿过传送门',
        outcomes: [
          { type: 'gain_gold', value: 60, description: '你被传送到了一个充满金币的房间' },
          { type: 'lose_hp', value: 10, description: '传送过程中的能量伤害了你' },
        ],
      },
      {
        id: 'choice_2',
        text: '从漩涡中汲取能量',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '你吸收了传送门的能量' },
          { type: 'lose_hp', value: 8, description: '能量不稳定，伤害了你' },
        ],
      },
      {
        id: 'choice_3',
        text: '不碰传送门',
        outcomes: [
          { type: 'nothing', description: '你不想被传送到未知的地方' },
        ],
      },
    ],
  },

  the_energy_core: {
    id: 'the_energy_core',
    name: '能量核心',
    description: '一颗散发着蓝色光芒的能量核心嵌在墙壁中，它的表面跳动着电弧。你可以感受到核心中蕴含的巨大能量，但它的稳定性似乎不太好。',
    chapter: 2,
    type: 'strange_machine',
    choices: [
      {
        id: 'choice_1',
        text: '尝试取出核心',
        outcomes: [
          { type: 'gain_relic', description: '你成功取出了能量核心' },
          { type: 'lose_hp', value: 15, description: '电弧在你取出核心时击中了你' },
        ],
      },
      {
        id: 'choice_2',
        text: '从核心中汲取能量',
        outcomes: [
          { type: 'gain_momentum', value: 4, description: '你吸收了核心的能量' },
          { type: 'lose_max_hp', value: 2, description: '能量过载伤害了你的身体' },
        ],
      },
      {
        id: 'choice_3',
        text: '用核心发电照亮周围',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '光照亮了隐藏在暗处的金币' },
        ],
      },
      {
        id: 'choice_4',
        text: '离开',
        outcomes: [
          { type: 'nothing', description: '你不想冒险触碰这个不稳定的装置' },
        ],
      },
    ],
  },

  the_memory_bank: {
    id: 'the_memory_bank',
    name: '记忆存储器',
    description: '一个古老的机械装置中存储着大量的记忆晶体。当你触碰其中一颗时，你看到了过去的景象——一群人围绕着这个装置，然后一切都消失了。',
    chapter: 3,
    type: 'strange_machine',
    choices: [
      {
        id: 'choice_1',
        text: '播放所有记忆晶体',
        outcomes: [
          { type: 'gain_card', description: '你在记忆中学会了一种古老的技艺' },
          { type: 'lose_hp', value: 10, description: '大量的记忆冲击了你的精神' },
        ],
      },
      {
        id: 'choice_2',
        text: '只查看一颗记忆晶体',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '记忆中显示了一个宝藏的位置' },
        ],
      },
      {
        id: 'choice_3',
        text: '砸碎装置',
        outcomes: [
          { type: 'gain_gold', value: 50, description: '记忆晶体碎裂后变成了金币' },
        ],
      },
    ],
  },

  the_resonance_chamber: {
    id: 'the_resonance_chamber',
    name: '共鸣室',
    description: '一个空旷的房间中，四面墙壁上安装着巨大的声学装置。当你踏入房间时，装置开始共鸣，发出刺耳但有节奏的声音。你感到自己的心跳也在跟着共鸣。',
    chapter: 3,
    type: 'strange_machine',
    choices: [
      {
        id: 'choice_1',
        text: '加入共鸣',
        outcomes: [
          { type: 'gain_momentum', value: 5, description: '共鸣增强了你的力量' },
          { type: 'lose_hp', value: 12, description: '但共鸣也伤害了你的身体' },
        ],
      },
      {
        id: 'choice_2',
        text: '调整共鸣频率',
        outcomes: [
          { type: 'gain_hp', value: 15, description: '合适的频率治愈了你' },
        ],
      },
      {
        id: 'choice_3',
        text: '破坏声学装置',
        outcomes: [
          { type: 'lose_hp', value: 8, description: '爆炸的冲击波伤害了你' },
          { type: 'gain_gold', value: 30, description: '装置中的零件可以卖钱' },
        ],
      },
    ],
  },

  the_clockwork_heart: {
    id: 'the_clockwork_heart',
    name: '发条心脏',
    description: '一颗精密的发条心脏在你手中跳动，它似乎在模仿真正的心脏。你可以感受到它发出的微弱能量，仿佛它在试图与你融合。',
    chapter: 3,
    type: 'strange_machine',
    choices: [
      {
        id: 'choice_1',
        text: '将发条心脏融入你的身体',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '发条心脏增强了你的能力' },
          { type: 'lose_max_hp', value: 3, description: '融合过程伤害了你的身体' },
        ],
      },
      {
        id: 'choice_2',
        text: '拆解发条心脏',
        outcomes: [
          { type: 'gain_gold', value: 55, description: '精密的零件可以卖个好价钱' },
        ],
      },
      {
        id: 'choice_3',
        text: '不碰这个发条心脏',
        outcomes: [
          { type: 'nothing', description: '你将它放回了原处' },
        ],
      },
    ],
  },

  the_forge_mechanism: {
    id: 'the_forge_mechanism',
    name: '锻造机关',
    description: '一个古老的锻造机关还在运转，炉火微微跳动。机关上有一个放置金属的位置和一个拉动的把手。墙壁上挂着一些已经生锈的工具。',
    chapter: 1,
    type: 'strange_machine',
    choices: [
      {
        id: 'choice_1',
        text: '投入自己的武器进行锻造',
        outcomes: [
          { type: 'gain_relic', description: '你的武器被强化了' },
          { type: 'lose_gold', value: 30, description: '锻造消耗了一些金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '搜刮机关周围的零件',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '你收集了一些可以卖钱的零件' },
        ],
      },
      {
        id: 'choice_3',
        text: '拉动把手看看会发生什么',
        outcomes: [
          { type: 'gain_gold', value: 20, description: '机关吐出了一些金币' },
          { type: 'lose_hp', value: 6, description: '炉火突然窜高，烧伤了你' },
        ],
      },
    ],
  },

  the_probability_engine: {
    id: 'the_probability_engine',
    name: '概率引擎',
    description: '一个巨大的机械装置在房间中缓慢运转，它的齿轮上刻满了数字和符号。装置的中心有一个投币口，旁边写着："投入一枚硬币，命运将给出答案。"',
    chapter: 1,
    type: 'merchant',
    choices: [
      {
        id: 'choice_1',
        text: '投入一枚金币',
        outcomes: [
          { type: 'gain_gold', value: 50, description: '引擎吐出了五枚金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '投入十枚金币',
        outcomes: [
          { type: 'gain_gold', value: 120, description: '引擎吐出了十二枚金币' },
          { type: 'lose_hp', value: 10, description: '引擎过载，能量冲击伤害了你' },
        ],
      },
      {
        id: 'choice_3',
        text: '不投入金币，只观察',
        outcomes: [
          { type: 'gain_momentum', value: 1, description: '你从引擎的运转中领悟了一些东西' },
        ],
      },
    ],
  },

  // ancient_shrine (Ch1: 55-56, Ch2: 57-58, Ch3: 59-63)
  the_shrine_of_strength: {
    id: 'the_shrine_of_strength',
    name: '力量神龛',
    description: '一座古老的神龛矗立在废墟中，神龛上的雕像是一位手持巨剑的战士。你可以感受到神龛中涌动的力量，空气中弥漫着铁锈和血液的味道。',
    chapter: 1,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'choice_1',
        text: '向神龛祈祷',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '战士之力融入了你' },
        ],
      },
      {
        id: 'choice_2',
        text: '献上金币作为供品',
        outcomes: [
          { type: 'lose_gold', value: 40, description: '你献上了 40 金币' },
          { type: 'gain_momentum', value: 4, description: '神龛回应了你的虔诚' },
        ],
      },
      {
        id: 'choice_3',
        text: '不碰神龛',
        outcomes: [
          { type: 'nothing', description: '你绕过了神龛' },
        ],
      },
    ],
  },

  the_healing_spring: {
    id: 'the_healing_spring',
    name: '治愈之泉',
    description: '一汪清澈的泉水从石缝中涌出，泉水散发着淡淡的金色光芒。你可以感受到泉水中的治愈力量，它似乎在呼唤你靠近。',
    chapter: 1,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'choice_1',
        text: '饮用泉水',
        outcomes: [
          { type: 'gain_hp', value: 20, description: '泉水治愈了你' },
        ],
      },
      {
        id: 'choice_2',
        text: '用泉水清洗武器',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '武器被泉水净化了' },
        ],
      },
      {
        id: 'choice_3',
        text: '收集泉水带走',
        outcomes: [
          { type: 'gain_gold', value: 25, description: '你可以把泉水卖给需要的人' },
        ],
      },
    ],
  },

  the_altar_of_sacrifice: {
    id: 'the_altar_of_sacrifice',
    name: '献祭祭坛',
    description: '一座黑色的祭坛矗立在房间中央，祭坛上的符文散发着暗红色的光芒。你可以感受到祭坛在等待着献祭，空气中充满了血腥的味道。',
    chapter: 2,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'choice_1',
        text: '献上鲜血',
        outcomes: [
          { type: 'lose_hp', value: 12, description: '你的血液流向了祭坛' },
          { type: 'gain_momentum', value: 4, description: '祭坛回应了你的献祭' },
        ],
      },
      {
        id: 'choice_2',
        text: '献上金币',
        outcomes: [
          { type: 'lose_gold', value: 50, description: '你献上了 50 金币' },
          { type: 'gain_card', description: '祭坛给予了一张卡牌作为回报' },
        ],
      },
      {
        id: 'choice_3',
        text: '不献祭任何东西',
        outcomes: [
          { type: 'nothing', description: '你不想与黑暗力量做交易' },
        ],
      },
    ],
  },

  the_temple_of_echoes: {
    id: 'the_temple_of_echoes',
    name: '回声神殿',
    description: '一个空旷的大殿中，你的每一步都产生无数的回声。大殿中央有一座祭坛，祭坛上的火焰在无风中摇曳。回声中似乎包含了古老的低语。',
    chapter: 2,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'choice_1',
        text: '回应低语',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '低语传递了远古的知识' },
          { type: 'lose_gold', value: 20, description: '你将一些金币投入了火焰' },
        ],
      },
      {
        id: 'choice_2',
        text: '收集大殿中的回声',
        outcomes: [
          { type: 'gain_hp', value: 10, description: '回声治愈了你的伤势' },
        ],
      },
      {
        id: 'choice_3',
        text: '快速通过大殿',
        outcomes: [
          { type: 'gain_gold', value: 15, description: '你在匆忙中捡到了一些金币' },
        ],
      },
    ],
  },

  the_grave_of_gods: {
    id: 'the_grave_of_gods',
    name: '神之墓',
    description: '你发现了一座被遗忘的神之墓，墓碑上的文字已经模糊不清。墓前的供品早已腐烂，但你可以感受到墓中涌动的力量。空气中弥漫着一种庄严而悲伤的气息。',
    chapter: 2,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'choice_1',
        text: '在墓前祈祷',
        outcomes: [
          { type: 'gain_hp', value: 12, description: '神灵的残余力量治愈了你' },
        ],
      },
      {
        id: 'choice_2',
        text: '挖掘神墓',
        outcomes: [
          { type: 'gain_gold', value: 70, description: '你在墓中发现了宝藏' },
          { type: 'lose_hp', value: 15, description: '亵渎神灵的惩罚伤害了你' },
        ],
      },
      {
        id: 'choice_3',
        text: '在墓前献上供品',
        outcomes: [
          { type: 'lose_gold', value: 30, description: '你献上了 30 金币' },
          { type: 'gain_momentum', value: 3, description: '神灵的残余力量回应了你' },
        ],
      },
    ],
  },

  the_shrine_of_echoes: {
    id: 'the_shrine_of_echoes',
    name: '回音神龛',
    description: '一座古老的神龛中传出一阵阵回音，仿佛有人在低语。神龛上的符文闪烁着微弱的光芒，你可以感受到其中蕴含的力量。',
    chapter: 3,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'choice_1',
        text: '倾听回音',
        outcomes: [
          { type: 'gain_card', description: '回音传递了一种古老的技艺' },
          { type: 'lose_hp', value: 5, description: '回音冲击了你的精神' },
        ],
      },
      {
        id: 'choice_2',
        text: '回应回音',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '你与神龛产生了共鸣' },
        ],
      },
      {
        id: 'choice_3',
        text: '破坏神龛',
        outcomes: [
          { type: 'gain_gold', value: 45, description: '神龛中藏有金币' },
          { type: 'lose_hp', value: 12, description: '破坏神龛的冲击伤害了你' },
        ],
      },
    ],
  },

  the_eternal_guardian: {
    id: 'the_eternal_guardian',
    name: '永恒守卫',
    description: '一个石像守卫矗立在门前，它的眼窝中燃烧着蓝色的火焰。当你靠近时，它开口说话："只有通过考验的人才能进入。你准备好接受考验了吗？"',
    chapter: 3,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'choice_1',
        text: '接受考验',
        outcomes: [
          { type: 'lose_hp', value: 15, description: '守卫攻击了你' },
          { type: 'gain_gold', value: 80, description: '通过考验后，门后有大量金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '用金币贿赂守卫',
        outcomes: [
          { type: 'lose_gold', value: 50, description: '你支付了 50 金币' },
          { type: 'gain_gold', value: 60, description: '守卫放你进入，你获得了宝藏' },
        ],
      },
      {
        id: 'choice_3',
        text: '转身离开',
        outcomes: [
          { type: 'nothing', description: '你不想面对守卫的考验' },
        ],
      },
    ],
  },

  the_dying_flame: {
    id: 'the_dying_flame',
    name: '熄灭之焰',
    description: '一盏古老的灯盏中，火焰正在缓慢熄灭。你可以感受到火焰中蕴含的古老力量，它似乎在寻求帮助来维持自己的存在。',
    chapter: 3,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'choice_1',
        text: '用自己的生命力维持火焰',
        outcomes: [
          { type: 'lose_hp', value: 10, description: '火焰吸取了你的一部分生命力' },
          { type: 'gain_momentum', value: 4, description: '作为回报，火焰赐予了你力量' },
        ],
      },
      {
        id: 'choice_2',
        text: '吹灭火焰',
        outcomes: [
          { type: 'gain_gold', value: 35, description: '火焰熄灭后露出了灯盏中的金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '用油脂帮助火焰燃烧',
        outcomes: [
          { type: 'lose_gold', value: 20, description: '你用了一些油脂' },
          { type: 'gain_hp', value: 15, description: '火焰恢复了，治愈了你' },
        ],
      },
    ],
  },

  the_shrine_of_illusions: {
    id: 'shrine_of_illusions',
    name: '幻象神龛',
    description: '一座神龛周围弥漫着彩色的雾气，你看到无数的幻象在雾中浮现——金银财宝、美丽的风景、逝去的亲人。你知道这些都不是真的，但它们是如此诱人。',
    chapter: 3,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'choice_1',
        text: '沉浸在幻象中',
        outcomes: [
          { type: 'gain_hp', value: 12, description: '幻象暂时治愈了你的心灵' },
          { type: 'lose_gold', value: 25, description: '但幻象也偷走了一些金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '打破幻象',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '幻象破碎后露出了真正的宝藏' },
        ],
      },
      {
        id: 'choice_3',
        text: '不看任何幻象',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '你的意志力增强了' },
        ],
      },
    ],
  },

  // random_gamble (Ch1: 64-65, Ch2: 66-67, Ch3: 68-70)
  the_coin_flip: {
    id: 'the_coin_flip',
    name: '命运之币',
    description: '一枚古老的金币在空中旋转，它似乎在等待你做出选择。金币的一面刻着太阳，另一面刻着月亮。你可以感受到这枚硬币中蕴含着命运的力量。',
    chapter: 1,
    type: 'random_gamble',
    choices: [
      {
        id: 'choice_1',
        text: '赌正面（太阳）',
        outcomes: [
          { type: 'gain_gold', value: 50, description: '正面！你赢了 50 金币' },
          { type: 'lose_gold', value: 30, description: '反面，你输了 30 金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '赌反面（月亮）',
        outcomes: [
          { type: 'gain_gold', value: 50, description: '反面！你赢了 50 金币' },
          { type: 'lose_gold', value: 30, description: '正面，你输了 30 金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '不赌',
        outcomes: [
          { type: 'nothing', description: '你收起了硬币' },
        ],
      },
    ],
  },

  the_golden_rain: {
    id: 'the_golden_rain',
    name: '金币雨',
    description: '突然间，天花板上开始掉落金币。金币像雨点一样落下，你可以听到它们撞击地面的清脆声音。但金币中似乎混杂着一些其他东西。',
    chapter: 1,
    type: 'random_gamble',
    choices: [
      {
        id: 'choice_1',
        text: '尽可能多地捡金币',
        outcomes: [
          { type: 'gain_gold', value: 60, description: '你捡到了很多金币' },
          { type: 'lose_hp', value: 8, description: '有些金币是陷阱，伤到了你' },
        ],
      },
      {
        id: 'choice_2',
        text: '只捡安全的金币',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '你安全地捡了一些金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '躲避金币雨',
        outcomes: [
          { type: 'nothing', description: '你躲到了安全的地方' },
        ],
      },
    ],
  },

  the_mysterious_gambler: {
    id: 'the_mysterious_gambler',
    name: '神秘赌徒',
    description: '一个戴着面具的身影坐在桌前，桌上摆着一副牌。他向你招手："来赌一把？赢了你拿走双倍，输了你只需要付出一点小小的代价。"',
    chapter: 2,
    type: 'random_gamble',
    choices: [
      {
        id: 'choice_1',
        text: '赌 30 金币',
        outcomes: [
          { type: 'gain_gold', value: 60, description: '你赢了！获得 60 金币' },
          { type: 'lose_gold', value: 30, description: '你输了 30 金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '赌 60 金币',
        outcomes: [
          { type: 'gain_gold', value: 120, description: '你赢了！获得 120 金币' },
          { type: 'lose_hp', value: 15, description: '你输了，赌徒惩罚了你' },
        ],
      },
      {
        id: 'choice_3',
        text: '不赌',
        outcomes: [
          { type: 'nothing', description: '你拒绝了他的邀请' },
        ],
      },
    ],
  },

  the_wheel_of_fortune: {
    id: 'the_wheel_of_fortune',
    name: '命运转盘',
    description: '一个巨大的转盘立在你面前，上面分成了不同的区域，每个区域都标着不同的奖励或惩罚。转盘的指针在缓慢转动，等待你的选择。',
    chapter: 2,
    type: 'random_gamble',
    choices: [
      {
        id: 'choice_1',
        text: '转动转盘',
        outcomes: [
          { type: 'gain_gold', value: 80, description: '你停在了大奖区域！' },
          { type: 'lose_hp', value: 12, description: '你停在了陷阱区域' },
        ],
      },
      {
        id: 'choice_2',
        text: '强行停在指定区域',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '你成功停在了中奖区域' },
          { type: 'lose_hp', value: 8, description: '转盘反抗了你的控制' },
        ],
      },
      {
        id: 'choice_3',
        text: '不转动转盘',
        outcomes: [
          { type: 'nothing', description: '你绕过了转盘' },
        ],
      },
    ],
  },

  the_card_trick: {
    id: 'the_card_trick',
    name: '纸牌戏法',
    description: '一个衣衫褴褛的魔术师坐在角落里，手中玩弄着一副纸牌。他向你展示了一个精妙的戏法："选一张牌，如果你猜中了，我给你好东西。"',
    chapter: 2,
    type: 'random_gamble',
    choices: [
      {
        id: 'choice_1',
        text: '参与戏法',
        outcomes: [
          { type: 'gain_card', description: '你猜中了，魔术师给了你一张卡牌' },
        ],
      },
      {
        id: 'choice_2',
        text: '用金币赌更大的',
        outcomes: [
          { type: 'gain_gold', value: 70, description: '你赢了，获得了 70 金币' },
          { type: 'lose_gold', value: 40, description: '你输了 40 金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '不参与',
        outcomes: [
          { type: 'nothing', description: '你不想玩纸牌游戏' },
        ],
      },
    ],
  },

  the_fate_cards: {
    id: 'the_fate_cards',
    name: '命运之牌',
    description: '三张古老的纸牌悬浮在空中，每张牌都散发着不同的光芒。你可以感受到牌中蕴含的力量，但你不知道选哪张会带来什么结果。',
    chapter: 3,
    type: 'random_gamble',
    choices: [
      {
        id: 'choice_1',
        text: '选择左边的牌',
        outcomes: [
          { type: 'gain_gold', value: 60, description: '牌中蕴含着财富' },
          { type: 'lose_hp', value: 10, description: '牌的反噬伤害了你' },
        ],
      },
      {
        id: 'choice_2',
        text: '选择中间的牌',
        outcomes: [
          { type: 'gain_momentum', value: 4, description: '牌中蕴含着力量' },
        ],
      },
      {
        id: 'choice_3',
        text: '选择右边的牌',
        outcomes: [
          { type: 'gain_hp', value: 20, description: '牌中蕴含着治愈' },
          { type: 'lose_gold', value: 20, description: '但牌也拿走了一些金币' },
        ],
      },
    ],
  },

  the_mirror_lottery: {
    id: 'the_mirror_lottery',
    name: '镜中彩票',
    description: '一面镜子中浮现出一张彩票的影像，它似乎在邀请你参与一场命运的赌局。你可以感受到彩票中蕴含的未知力量，但你不知道结果会是什么。',
    chapter: 3,
    type: 'random_gamble',
    choices: [
      {
        id: 'choice_1',
        text: '刮开彩票',
        outcomes: [
          { type: 'gain_gold', value: 100, description: '你中了大奖！' },
          { type: 'nothing', description: '什么都没有，只是一张废纸' },
        ],
      },
      {
        id: 'choice_2',
        text: '用彩票交换其他东西',
        outcomes: [
          { type: 'gain_card', description: '你用彩票换了一张卡牌' },
        ],
      },
      {
        id: 'choice_3',
        text: '不参与',
        outcomes: [
          { type: 'nothing', description: '你不想赌运气' },
        ],
      },
    ],
  },

  the_death_bargain: {
    id: 'the_death_bargain',
    name: '死亡交易',
    description: '一个穿着黑袍的身影出现在你面前，他的面容隐藏在兜帽之下。"我给你一个选择：要么用你的生命力换取力量，要么用力量换取生命力。"',
    chapter: 3,
    type: 'random_gamble',
    choices: [
      {
        id: 'choice_1',
        text: '用生命力换取力量',
        outcomes: [
          { type: 'lose_max_hp', value: 5, description: '你失去了 5 点最大生命力' },
          { type: 'gain_momentum', value: 5, description: '你获得了 5 层连势' },
        ],
      },
      {
        id: 'choice_2',
        text: '用力量换取生命力',
        outcomes: [
          { type: 'gain_hp', value: 25, description: '你恢复了 25 点生命力' },
          { type: 'lose_hp', value: 3, description: '你失去了 3 层连势' },
        ],
      },
      {
        id: 'choice_3',
        text: '拒绝交易',
        outcomes: [
          { type: 'nothing', description: '黑袍身影消散了' },
        ],
      },
    ],
  },

  the_dream_merchant: {
    id: 'the_dream_merchant',
    name: '梦境商人',
    description: '一个身影在梦境与现实的边界中若隐若现，他的摊位上摆满了各种奇异的物品。"这些都是梦境中的宝物……你可以用现实的东西来交换。"',
    chapter: 3,
    type: 'random_gamble',
    choices: [
      {
        id: 'choice_1',
        text: '用记忆交换一件宝物',
        outcomes: [
          { type: 'gain_relic', description: '你获得了一件梦境宝物' },
          { type: 'lose_max_hp', value: 2, description: '你失去了一段珍贵的记忆' },
        ],
      },
      {
        id: 'choice_2',
        text: '用金币交换',
        outcomes: [
          { type: 'lose_gold', value: 60, description: '你支付了 60 金币' },
          { type: 'gain_card', description: '你获得了一张梦境卡牌' },
        ],
      },
      {
        id: 'choice_3',
        text: '不交换',
        outcomes: [
          { type: 'nothing', description: '你不想与梦境商人做交易' },
        ],
      },
    ],
  },

  the_blood_pact: {
    id: 'the_blood_pact',
    name: '血契',
    description: '地面上浮现出一个血红色的符文，它散发着古老的气息。当你靠近时，符文开始发光，空气中弥漫着铁锈的味道。一个低沉的声音响起："签订契约，你将获得力量……但代价是你的血。"',
    chapter: 1,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '签订血契',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '血契的力量融入了你' },
          { type: 'lose_max_hp', value: 2, description: '你的生命力被永久削弱' },
        ],
      },
      {
        id: 'choice_2',
        text: '只献上一滴血作为试探',
        outcomes: [
          { type: 'gain_gold', value: 20, description: '符文闪烁后吐出了一些金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '用匕首划破符文',
        outcomes: [
          { type: 'lose_hp', value: 8, description: '符文的反噬伤害了你' },
          { type: 'gain_gold', value: 25, description: '但符文碎裂后露出了金币' },
        ],
      },
    ],
  },

  the_sunken_vault: {
    id: 'the_sunken_vault',
    name: '沉没的金库',
    description: '浑浊的水面下，你隐约看到一个金属结构。那是一个沉入水中的金库，门半开着，里面似乎有闪光的东西。但水中有什么东西在游动，你看不清它的形状。',
    chapter: 1,
    type: 'risk_reward',
    choices: [
      {
        id: 'choice_1',
        text: '潜入水中打开金库',
        outcomes: [
          { type: 'gain_gold', value: 65, description: '你从金库中捞出了大量金币' },
          { type: 'lose_hp', value: 12, description: '水中的生物攻击了你' },
        ],
      },
      {
        id: 'choice_2',
        text: '用工具打捞金库外的东西',
        outcomes: [
          { type: 'gain_gold', value: 25, description: '你捞到了一些散落的金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '不碰水中的东西',
        outcomes: [
          { type: 'nothing', description: '你不想惊动水中的生物' },
        ],
      },
    ],
  },
};
