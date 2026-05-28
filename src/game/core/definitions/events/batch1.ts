import type { EventDefinition } from './index';

// ============================================================
// 70 事件定义
// Chapter 1: 24 | Chapter 2: 23 | Chapter 3: 23
// risk_reward: 9 | curse_trade: 9 | merchant: 9 | memory: 9
// corruption: 9 | strange_machine: 8 | ancient_shrine: 9 | random_gamble: 8
// ============================================================

export const GENERATED_EVENTS_1: Record<string, EventDefinition> = {

  // ----------------------------------------------------------
  // CHAPTER 1 (24 events)
  // ----------------------------------------------------------

  // -- risk_reward --
  rusted_chest: {
    id: 'rusted_chest',
    name: '锈蚀宝箱',
    description: '走廊尽头立着一只被铁锈吞噬的箱子，锁孔处渗出暗红色的液体。你听见里面有微弱的金属碰撞声。',
    chapter: 1,
    type: 'risk_reward',
    choices: [
      {
        id: 'force_open',
        text: '强行撬开',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得 40 金币' },
          { type: 'lose_hp', value: 8, description: '铁锈碎片划伤手掌，失去 8 生命' },
        ],
      },
      {
        id: 'careful_unlock',
        text: '小心开锁',
        outcomes: [
          { type: 'gain_gold', value: 20, description: '获得 20 金币' },
          { type: 'nothing', description: '安全地取得了箱中财物' },
        ],
      },
      {
        id: 'leave_chest',
        text: '离开',
        outcomes: [
          { type: 'nothing', description: '你转身离开了' },
        ],
      },
    ],
  },

  fallen_adventurer: {
    id: 'fallen_adventurer',
    name: '倒下的冒险者',
    description: '一具穿着破旧铠甲的尸体倚靠在墙角，手中的短剑还攥得很紧。他的腰间鼓鼓囊囊。',
    chapter: 1,
    type: 'risk_reward',
    choices: [
      {
        id: 'search_body',
        text: '搜刮遗物',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '获得 30 金币' },
          { type: 'lose_hp', value: 5, description: '尸体突然抽搐，你被惊吓后退摔倒，失去 5 生命' },
        ],
      },
      {
        id: 'pray_leave',
        text: '默哀后离开',
        outcomes: [
          { type: 'gain_momentum', value: 1, description: '内心获得片刻安宁，获得 1 点动量' },
        ],
      },
      {
        id: 'take_weapon',
        text: '取走短剑',
        outcomes: [
          { type: 'gain_card', description: '获得一张攻击卡牌' },
          { type: 'nothing', description: '你将短剑收入行囊' },
        ],
      },
    ],
  },

  crumbling_bridge: {
    id: 'crumbling_bridge',
    name: '崩裂石桥',
    description: '深不见底的裂谷上方，横跨着一座半坍塌的石桥。桥面上散落着一些发光的碎片。',
    chapter: 1,
    type: 'risk_reward',
    choices: [
      {
        id: 'rush_across',
        text: '快速冲过',
        outcomes: [
          { type: 'gain_gold', value: 35, description: '拾取桥面碎片，获得 35 金币' },
          { type: 'lose_hp', value: 10, description: '脚下的石块碎裂，险些坠落，失去 10 生命' },
        ],
      },
      {
        id: 'careful_cross',
        text: '谨慎通过',
        outcomes: [
          { type: 'gain_gold', value: 15, description: '只拾取了近处的碎片，获得 15 金币' },
          { type: 'nothing', description: '安全通过' },
        ],
      },
      {
        id: 'find_detour',
        text: '绕路而行',
        outcomes: [
          { type: 'nothing', description: '你放弃了桥上的财物，寻找安全的路' },
        ],
      },
    ],
  },

  poison_well: {
    id: 'poison_well',
    name: '毒源古井',
    description: '庭院中央有一口石井，井水泛着不祥的紫色荧光。一股甜蜜到令人不安的气味飘散开来。',
    chapter: 1,
    type: 'risk_reward',
    choices: [
      {
        id: 'drink_water',
        text: '饮用井水',
        outcomes: [
          { type: 'gain_hp', value: 15, description: '井水带来奇异的治愈，恢复 15 生命' },
          { type: 'lose_max_hp', value: 3, description: '但毒液侵蚀了你的身体上限，失去 3 最大生命' },
        ],
      },
      {
        id: 'collect_bottles',
        text: '装瓶带走',
        outcomes: [
          { type: 'gain_card', description: '获得一张诅咒卡牌' },
          { type: 'nothing', description: '你将可疑的液体装入瓶中' },
        ],
      },
      {
        id: 'leave_well',
        text: '转身离开',
        outcomes: [
          { type: 'nothing', description: '你不愿冒险' },
        ],
      },
    ],
  },

  // -- curse_trade --
  shadow_merchant: {
    id: 'shadow_merchant',
    name: '暗影商人',
    description: '一个戴着鸟喙面具的身影从阴影中走出，他的手中托着一个精致的木盒。"旅人，要交易吗？"',
    chapter: 1,
    type: 'curse_trade',
    choices: [
      {
        id: 'accept_trade',
        text: '接受交易',
        outcomes: [
          { type: 'gain_gold', value: 50, description: '获得 50 金币' },
          { type: 'lose_max_hp', value: 4, description: '面具下传来低语，你的生命力被窃取，失去 4 最大生命' },
        ],
      },
      {
        id: 'decline_trade',
        text: '拒绝',
        outcomes: [
          { type: 'nothing', description: '"无趣……"暗影商人消失在黑暗中' },
        ],
      },
    ],
  },

  cursed_relic: {
    id: 'cursed_relic',
    name: '诅咒遗物',
    description: '石台上放置着一枚泛着幽光的戒指，戒指内侧刻着你看不懂的文字。手指不自觉地伸了过去。',
    chapter: 1,
    type: 'curse_trade',
    choices: [
      {
        id: 'wear_ring',
        text: '戴上戒指',
        outcomes: [
          { type: 'gain_relic', description: '获得神秘遗物' },
          { type: 'lose_hp', value: 12, description: '戒指灼伤手指，失去 12 生命' },
        ],
      },
      {
        id: 'take_carefully',
        text: '谨慎收起',
        outcomes: [
          { type: 'gain_gold', value: 25, description: '将戒指卖出，获得 25 金币' },
          { type: 'nothing', description: '你没有将其戴在身上' },
        ],
      },
      {
        id: 'leave_ring',
        text: '放回原处',
        outcomes: [
          { type: 'nothing', description: '你不敢碰它' },
        ],
      },
    ],
  },

  blood_pact: {
    id: 'blood_pact',
    name: '血契碑文',
    description: '墙上的浮雕中，一双手正捧着一本书。当你靠近时，那些浮雕似乎在呼吸。指尖触碰的瞬间，你听到了声音。',
    chapter: 1,
    type: 'curse_trade',
    choices: [
      {
        id: 'sign_pact',
        text: '以血为墨，签署契约',
        outcomes: [
          { type: 'gain_card', cardId: 'curse_wrath', description: '获得一张强力卡牌' },
          { type: 'lose_max_hp', value: 5, description: '你的血液被碑文吸取，失去 5 最大生命' },
        ],
      },
      {
        id: 'read_only',
        text: '只看不碰',
        outcomes: [
          { type: 'nothing', description: '你记住了碑文上的部分信息' },
          { type: 'gain_gold', value: 10, description: '在角落发现遗落的金币，获得 10 金币' },
        ],
      },
      {
        id: 'smash碑文',
        text: '砸碎浮雕',
        outcomes: [
          { type: 'lose_hp', value: 6, description: '碎石反弹割伤了你，失去 6 生命' },
          { type: 'nothing', description: '诅咒被物理性地破坏了' },
        ],
      },
    ],
  },

  whispering_idol: {
    id: 'whispering_idol',
    name: '低语石像',
    description: '一尊矮小的石像立在路中央，它的嘴巴一张一合，发出含糊的低语。你隐约听到了"力量"和"代价"两个词。',
    chapter: 1,
    type: 'curse_trade',
    choices: [
      {
        id: 'offer_gold',
        text: '献上金币',
        outcomes: [
          { type: 'lose_gold', value: 30, description: '献上 30 金币' },
          { type: 'gain_hp', value: 10, description: '石像散发温暖光芒，恢复 10 生命' },
        ],
      },
      {
        id: 'offer_blood',
        text: '献上鲜血',
        outcomes: [
          { type: 'lose_hp', value: 8, description: '割破手指，失去 8 生命' },
          { type: 'gain_momentum', value: 2, description: '获得 2 点动量' },
        ],
      },
      {
        id: 'ignore_idol',
        text: '无视它继续前进',
        outcomes: [
          { type: 'nothing', description: '低语声在你身后渐弱' },
        ],
      },
    ],
  },

  // -- merchant --
  traveling_merchant: {
    id: 'traveling_merchant',
    name: '行商旅人',
    description: '一个背着巨大行囊的老人出现在路口，他的行囊上挂满了各种奇怪的物件。"不买也看看嘛。"',
    chapter: 1,
    type: 'merchant',
    choices: [
      {
        id: 'buy_healing',
        text: '购买治疗药剂 (20金)',
        requirements: 'gold >= 20',
        outcomes: [
          { type: 'lose_gold', value: 20, description: '花费 20 金币' },
          { type: 'gain_hp', value: 12, description: '恢复 12 生命' },
        ],
      },
      {
        id: 'buy_card',
        text: '购买随机卡牌 (30金)',
        requirements: 'gold >= 30',
        outcomes: [
          { type: 'lose_gold', value: 30, description: '花费 30 金币' },
          { type: 'gain_card', description: '获得一张随机卡牌' },
        ],
      },
      {
        id: 'just_look',
        text: '只是看看',
        outcomes: [
          { type: 'nothing', description: '"下次再来啊！"老人挥了挥手' },
        ],
      },
    ],
  },

  broken_shopkeeper: {
    id: 'broken_shopkeeper',
    name: '落魄店主',
    description: '一间坍塌了一半的店铺里，一个衣衫褴褛的中年人坐在柜台后面。货架上只剩寥寥几件商品。',
    chapter: 1,
    type: 'merchant',
    choices: [
      {
        id: 'buy_old_sword',
        text: '购买旧剑 (15金)',
        requirements: 'gold >= 15',
        outcomes: [
          { type: 'lose_gold', value: 15, description: '花费 15 金币' },
          { type: 'gain_card', description: '获得一张攻击卡牌' },
        ],
      },
      {
        id: 'give_charity',
        text: '施舍一些金币',
        outcomes: [
          { type: 'lose_gold', value: 10, description: '花费 10 金币' },
          { type: 'gain_momentum', value: 1, description: '店主感激涕零，你获得 1 点动量' },
        ],
      },
      {
        id: 'leave_shop',
        text: '离开',
        outcomes: [
          { type: 'nothing', description: '你默默离开了店铺' },
        ],
      },
    ],
  },

  black_market: {
    id: 'black_market',
    name: '地下黑市',
    description: '穿过一条隐秘的隧道，你来到了一个灯火通明的地下市场。空气中弥漫着药水和金属的气味。',
    chapter: 1,
    type: 'merchant',
    choices: [
      {
        id: 'buy_potion',
        text: '购买神秘药水 (25金)',
        requirements: 'gold >= 25',
        outcomes: [
          { type: 'lose_gold', value: 25, description: '花费 25 金币' },
          { type: 'gain_hp', value: 15, description: '药水带来强效治愈，恢复 15 生命' },
        ],
      },
      {
        id: 'buy_relic',
        text: '购买未知遗物 (50金)',
        requirements: 'gold >= 50',
        outcomes: [
          { type: 'lose_gold', value: 50, description: '花费 50 金币' },
          { type: 'gain_relic', description: '获得一件遗物' },
        ],
      },
      {
        id: 'rob_merchant',
        text: '趁乱偷取',
        outcomes: [
          { type: 'gain_gold', value: 20, description: '成功偷得 20 金币' },
          { type: 'lose_hp', value: 10, description: '被守卫发现并殴打，失去 10 生命' },
        ],
      },
      {
        id: 'leave_market',
        text: '离开',
        outcomes: [
          { type: 'nothing', description: '你选择不参与' },
        ],
      },
    ],
  },

  // -- memory --
  ghostly_child: {
    id: 'ghostly_child',
    name: '幽灵孩童',
    description: '一个半透明的孩子坐在台阶上，用手指在地面画着什么。当你靠近时，他抬起头，用空洞的眼睛看着你。',
    chapter: 1,
    type: 'memory',
    choices: [
      {
        id: 'sit_with_child',
        text: '在他身旁坐下',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '你回忆起失去的时光，获得 2 点动量' },
          { type: 'nothing', description: '孩子微笑着消散了' },
        ],
      },
      {
        id: 'ask_question',
        text: '询问他为何在此',
        outcomes: [
          { type: 'gain_card', description: '孩子留下了一张卡牌便消失了' },
          { type: 'nothing', description: '"我忘了回去的路……"' },
        ],
      },
      {
        id: 'walk_away',
        text: '默默走开',
        outcomes: [
          { type: 'nothing', description: '你无法面对这些记忆' },
        ],
      },
    ],
  },

  echoing_hall: {
    id: 'echoing_hall',
    name: '回声大厅',
    description: '空旷的大厅中回荡着你自己的脚步声，但仔细听，那些回声似乎在说一些不同的话——是你曾经说过的话。',
    chapter: 1,
    type: 'memory',
    choices: [
      {
        id: 'listen_carefully',
        text: '仔细倾听',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '过去的回声让你有所领悟，获得 2 点动量' },
          { type: 'nothing', description: '回声渐渐消散' },
        ],
      },
      {
        id: 'shout_back',
        text: '大声喊叫打断',
        outcomes: [
          { type: 'lose_hp', value: 5, description: '声波反噬，失去 5 生命' },
          { type: 'nothing', description: '回声被你的喊声压过' },
        ],
      },
      {
        id: 'pass_through',
        text: '快速通过',
        outcomes: [
          { type: 'nothing', description: '你低着头快步走过' },
        ],
      },
    ],
  },

  memory_mirror: {
    id: 'memory_mirror',
    name: '记忆之镜',
    description: '一面碎裂的镜子挂在墙上，镜中映出的不是你的倒影，而是一个你已经忘记的面孔。它在对你微笑。',
    chapter: 1,
    type: 'memory',
    choices: [
      {
        id: 'touch_mirror',
        text: '伸手触碰镜面',
        outcomes: [
          { type: 'gain_hp', value: 8, description: '一股温暖流过全身，恢复 8 生命' },
          { type: 'gain_momentum', value: 1, description: '获得 1 点动量' },
        ],
      },
      {
        id: 'break_mirror',
        text: '砸碎镜子',
        outcomes: [
          { type: 'gain_gold', value: 15, description: '碎片中藏有金币，获得 15 金币' },
          { type: 'lose_hp', value: 7, description: '碎片割伤了你，失去 7 生命' },
        ],
      },
      {
        id: 'leave_mirror',
        text: '不去看它',
        outcomes: [
          { type: 'nothing', description: '有些记忆还是忘记比较好' },
        ],
      },
    ],
  },

  // -- corruption --
  creeping_mold: {
    id: 'creeping_mold',
    name: '蔓延霉菌',
    description: '墙壁上覆盖着一层暗绿色的菌毯，它的边缘正在缓慢地向外扩张。空气中有一股甜腻的腐败气息。',
    chapter: 1,
    type: 'corruption',
    choices: [
      {
        id: 'burn_mold',
        text: '用火焚烧',
        outcomes: [
          { type: 'gain_gold', value: 20, description: '菌毯下藏着被包裹的金币，获得 20 金币' },
          { type: 'lose_hp', value: 8, description: '有毒烟雾灼伤了你，失去 8 生命' },
        ],
      },
      {
        id: 'collect_sample',
        text: '采集样本',
        outcomes: [
          { type: 'gain_card', description: '获得一张与腐化相关的卡牌' },
          { type: 'lose_hp', value: 4, description: '菌丝刺入皮肤，失去 4 生命' },
        ],
      },
      {
        id: 'avoid_mold',
        text: '绕开它',
        outcomes: [
          { type: 'nothing', description: '你小心翼翼地避开了菌毯' },
        ],
      },
    ],
  },

  tainted_spring: {
    id: 'tainted_spring',
    name: '污染水源',
    description: '曾经清澈的泉水现在泛着暗红色的泡沫。泉眼周围的石头上长满了畸形的苔藓。',
    chapter: 1,
    type: 'corruption',
    choices: [
      {
        id: 'wash_wounds',
        text: '用泉水清洗伤口',
        outcomes: [
          { type: 'gain_hp', value: 10, description: '泉水带来暂时的舒适，恢复 10 生命' },
          { type: 'lose_max_hp', value: 2, description: '但污染渗入了血液，失去 2 最大生命' },
        ],
      },
      {
        id: 'bottle_water',
        text: '装一些泉水',
        outcomes: [
          { type: 'gain_card', description: '获得一瓶污染药剂' },
          { type: 'nothing', description: '你将泉水装入空瓶' },
        ],
      },
      {
        id: 'leave_spring',
        text: '不碰泉水',
        outcomes: [
          { type: 'nothing', description: '你明智地远离了它' },
        ],
      },
    ],
  },

  corrupted_altar: {
    id: 'corrupted_altar',
    name: '腐化祭台',
    description: '一张石台上摆满了枯萎的花朵和发黑的蜡烛。台面上刻着一个已经无法辨认的符号。',
    chapter: 1,
    type: 'corruption',
    choices: [
      {
        id: 'pray_anyway',
        text: '跪下祈祷',
        outcomes: [
          { type: 'gain_hp', value: 8, description: '某种力量回应了你，恢复 8 生命' },
          { type: 'lose_max_hp', value: 2, description: '但你感到身体里多了一些不该有的东西，失去 2 最大生命' },
        ],
      },
      {
        id: 'clean_altar',
        text: '清理祭台',
        outcomes: [
          { type: 'gain_gold', value: 15, description: '祭台下方有暗格，获得 15 金币' },
          { type: 'nothing', description: '你清除了腐化的痕迹' },
        ],
      },
      {
        id: 'flee',
        text: '迅速离开',
        outcomes: [
          { type: 'nothing', description: '你不愿在此停留' },
        ],
      },
    ],
  },

  // -- strange_machine --
  gear_room: {
    id: 'gear_room',
    name: '齿轮密室',
    description: '一间布满齿轮和铜管的密室，所有机械都已停止运转。中央有一个巨大的操纵杆，上面落满了灰尘。',
    chapter: 1,
    type: 'strange_machine',
    choices: [
      {
        id: 'pull_lever',
        text: '拉动操纵杆',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '暗格弹出，获得 30 金币' },
          { type: 'lose_hp', value: 6, description: '齿轮突然启动割伤了你，失去 6 生命' },
        ],
      },
      {
        id: 'examine_gears',
        text: '检查齿轮构造',
        outcomes: [
          { type: 'gain_momentum', value: 1, description: '你学到了一些机械知识，获得 1 点动量' },
          { type: 'nothing', description: '但机器没有反应' },
        ],
      },
      {
        id: 'leave_machine',
        text: '离开密室',
        outcomes: [
          { type: 'nothing', description: '你不愿冒险启动未知机关' },
        ],
      },
    ],
  },

  clockwork_trap: {
    id: 'clockwork_trap',
    name: '发条陷阱',
    description: '地板上有一个微小的凸起，周围散落着齿轮碎片。这是一个已经损坏的机关陷阱，但核心部件似乎还在。',
    chapter: 1,
    type: 'strange_machine',
    choices: [
      {
        id: 'dismantle',
        text: '拆解机关',
        outcomes: [
          { type: 'gain_gold', value: 25, description: '取出金属零件，获得 25 金币' },
          { type: 'nothing', description: '你小心地拆除了陷阱' },
        ],
      },
      {
        id: 'trigger_carefully',
        text: '触发陷阱取其核心',
        outcomes: [
          { type: 'gain_relic', description: '获得机关核心遗物' },
          { type: 'lose_hp', value: 8, description: '触发时碎片飞溅，失去 8 生命' },
        ],
      },
      {
        id: 'leave_it',
        text: '绕过去',
        outcomes: [
          { type: 'nothing', description: '你跨过了陷阱' },
        ],
      },
    ],
  },

  // -- ancient_shrine --
  small_shrine: {
    id: 'small_shrine',
    name: '路旁小祠',
    description: '路边一座破旧的小祠堂，里面供着一尊面目模糊的石像。石像前的香炉里还残留着灰烬。',
    chapter: 1,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'offer_coins',
        text: '供奉金币',
        outcomes: [
          { type: 'lose_gold', value: 15, description: '献上 15 金币' },
          { type: 'gain_hp', value: 10, description: '祠堂散发柔光，恢复 10 生命' },
        ],
      },
      {
        id: 'bow_respect',
        text: '鞠躬致敬',
        outcomes: [
          { type: 'gain_momentum', value: 1, description: '获得 1 点动量' },
          { type: 'nothing', description: '你表达了敬意' },
        ],
      },
      {
        id: 'ignore_shrine',
        text: '无视走过',
        outcomes: [
          { type: 'nothing', description: '你继续前行' },
        ],
      },
    ],
  },

  stone_monument: {
    id: 'stone_monument',
    name: '石碑遗迹',
    description: '一块半埋在土中的石碑，上面刻着古老的文字。碑顶的石雕已经风化，但仍能辨认出一个举起双手的人形。',
    chapter: 1,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'study_inscription',
        text: '研究碑文',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '你理解了古老的知识，获得 2 点动量' },
          { type: 'nothing', description: '但石碑的含义并不完整' },
        ],
      },
      {
        id: 'dig_around',
        text: '挖掘碑底',
        outcomes: [
          { type: 'gain_gold', value: 20, description: '挖到埋藏的供品，获得 20 金币' },
          { type: 'nothing', description: '泥土中有零碎的古代钱币' },
        ],
      },
      {
        id: 'leave_monument',
        text: '离开',
        outcomes: [
          { type: 'nothing', description: '你记住了石碑的位置' },
        ],
      },
    ],
  },

  spirit_well: {
    id: 'spirit_well',
    name: '灵泉枯井',
    description: '一口枯竭的古井，井壁上刻满了符文。当你靠近时，符文开始微微发光，空气中弥漫着冰冷的气息。',
    chapter: 1,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'channel_energy',
        text: '引导符文之力',
        outcomes: [
          { type: 'gain_hp', value: 12, description: '符文能量注入体内，恢复 12 生命' },
          { type: 'nothing', description: '井壁的光芒渐渐熄灭' },
        ],
      },
      {
        id: 'collect_charcoal',
        text: '刮取符文灰烬',
        outcomes: [
          { type: 'gain_card', description: '获得一张符文相关的卡牌' },
          { type: 'nothing', description: '你收集了一些有用的材料' },
        ],
      },
      {
        id: 'leave_well',
        text: '不去打扰',
        outcomes: [
          { type: 'nothing', description: '你绕过了枯井' },
        ],
      },
    ],
  },

  // -- random_gamble --
  dice_game: {
    id: 'dice_game',
    name: '骰子赌局',
    description: '角落里一个蒙面人向你招手，他面前摆着三颗骨骰和一堆金币。"赌一把？"',
    chapter: 1,
    type: 'random_gamble',
    choices: [
      {
        id: 'bet_high',
        text: '下注 30 金币',
        requirements: 'gold >= 30',
        outcomes: [
          { type: 'gain_gold', value: 60, description: '你赢了！获得 60 金币' },
          { type: 'lose_gold', value: 30, description: '你输了，失去 30 金币' },
        ],
      },
      {
        id: 'bet_low',
        text: '下注 10 金币',
        requirements: 'gold >= 10',
        outcomes: [
          { type: 'gain_gold', value: 20, description: '你赢了！获得 20 金币' },
          { type: 'lose_gold', value: 10, description: '你输了，失去 10 金币' },
        ],
      },
      {
        id: 'refuse_bet',
        text: '拒绝赌博',
        outcomes: [
          { type: 'nothing', description: '"胆小鬼。"蒙面人不再理你' },
        ],
      },
    ],
  },

  coin_flip: {
    id: 'coin_flip',
    name: '命运硬币',
    description: '地上有一枚巨大的古铜币，一面刻着太阳，另一面刻着月亮。微风吹过，铜币在原地旋转。',
    chapter: 1,
    type: 'random_gamble',
    choices: [
      {
        id: 'bet_sun',
        text: '押正面（太阳）',
        outcomes: [
          { type: 'gain_gold', value: 25, description: '铜币停在正面！获得 25 金币' },
          { type: 'nothing', description: '铜币停在反面，什么也没发生' },
        ],
      },
      {
        id: 'bet_moon',
        text: '押反面（月亮）',
        outcomes: [
          { type: 'gain_gold', value: 25, description: '铜币停在反面！获得 25 金币' },
          { type: 'nothing', description: '铜币停在正面，什么也没发生' },
        ],
      },
      {
        id: 'pick_coin',
        text: '直接捡走',
        outcomes: [
          { type: 'gain_gold', value: 10, description: '你拿走了铜币，获得 10 金币' },
        ],
      },
    ],
  },

  // ----------------------------------------------------------
  // CHAPTER 2 (23 events)
  // ----------------------------------------------------------

  // -- risk_reward --
  abyssal_canyon: {
    id: 'abyssal_canyon',
    name: '深渊裂谷',
    description: '脚下是深不见底的黑色裂谷，风从深渊中呼啸而上，带着腐烂和金属混合的气味。对面的崖壁上似乎有闪光。',
    chapter: 2,
    type: 'risk_reward',
    choices: [
      {
        id: 'climb_across',
        text: '攀爬岩壁过去',
        outcomes: [
          { type: 'gain_gold', value: 50, description: '对面有古代宝藏，获得 50 金币' },
          { type: 'lose_hp', value: 15, description: '攀爬时跌落受伤，失去 15 生命' },
        ],
      },
      {
        id: 'use_rope',
        text: '用绳索横渡',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '安全到达对面，获得 30 金币' },
          { type: 'nothing', description: '绳索有些老化但撑住了' },
        ],
      },
      {
        id: 'stay_put',
        text: '不过去了',
        outcomes: [
          { type: 'nothing', description: '深渊的风声令人不安' },
        ],
      },
    ],
  },

  bone_collector: {
    id: 'bone_collector',
    name: '骸骨收藏家',
    description: '一个佝偻的身影在收集散落的骨骸，他的推车上堆满了各种形状的骨头。他注意到了你。',
    chapter: 2,
    type: 'risk_reward',
    choices: [
      {
        id: 'help_collect',
        text: '帮他收集骨骸',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '他支付了报酬，获得 40 金币' },
          { type: 'nothing', description: '你花了不少时间搬运骨头' },
        ],
      },
      {
        id: 'trade_bones',
        text: '用骨骸交换物品',
        outcomes: [
          { type: 'gain_card', description: '获得一张骨骸制成的卡牌' },
          { type: 'nothing', description: '收藏家满意地点了点头' },
        ],
      },
      {
        id: 'rob_collector',
        text: '抢劫他的推车',
        outcomes: [
          { type: 'gain_gold', value: 60, description: '推车里有金币，获得 60 金币' },
          { type: 'lose_hp', value: 20, description: '收藏家发出可怕的尖叫，黑暗力量反噬，失去 20 生命' },
        ],
      },
      {
        id: 'avoid_collector',
        text: '假装没看到',
        outcomes: [
          { type: 'nothing', description: '你低头走过' },
        ],
      },
    ],
  },

  // -- curse_trade --
  deal_with_fiend: {
    id: 'deal_with_fiend',
    name: '与魔交易',
    description: '空气中突然多了一个声音，无形的魔物在你耳边低语："我能给你力量，只要你给我一些……小小的东西。"',
    chapter: 2,
    type: 'curse_trade',
    choices: [
      {
        id: 'accept_power',
        text: '接受力量',
        outcomes: [
          { type: 'gain_card', cardId: 'curse_dread', description: '获得一张强力诅咒卡牌' },
          { type: 'lose_max_hp', value: 6, description: '你的生命力被窃取，失去 6 最大生命' },
        ],
      },
      {
        id: 'offer_gold',
        text: '用金币代替',
        outcomes: [
          { type: 'lose_gold', value: 40, description: '花费 40 金币' },
          { type: 'gain_momentum', value: 2, description: '魔物满意地给予你 2 点动量' },
        ],
      },
      {
        id: 'resist',
        text: '坚决抵抗',
        outcomes: [
          { type: 'nothing', description: '魔物发出嘲笑声后消失了' },
        ],
      },
    ],
  },

  cursed_merchant: {
    id: 'cursed_merchant',
    name: '诅咒商人',
    description: '一个全身缠满绷带的商人坐在路边，他面前摆着各种发光的物件。"每件宝物都有代价，这是规矩。"',
    chapter: 2,
    type: 'curse_trade',
    choices: [
      {
        id: 'buy_blade',
        text: '购买诅咒之刃 (40金)',
        requirements: 'gold >= 40',
        outcomes: [
          { type: 'lose_gold', value: 40, description: '花费 40 金币' },
          { type: 'gain_card', cardId: 'curse_wrath', description: '获得一张强力攻击卡牌' },
          { type: 'lose_max_hp', value: 3, description: '刀刃灼伤手掌，失去 3 最大生命' },
        ],
      },
      {
        id: 'buy_shield',
        text: '购买诅咒之盾 (40金)',
        requirements: 'gold >= 40',
        outcomes: [
          { type: 'lose_gold', value: 40, description: '花费 40 金币' },
          { type: 'gain_card', cardId: 'curse_burden', description: '获得一张强力防御卡牌' },
          { type: 'lose_hp', value: 5, description: '盾牌上的诅咒灼伤了你，失去 5 生命' },
        ],
      },
      {
        id: 'just_chat',
        text: '只是路过',
        outcomes: [
          { type: 'nothing', description: '"下次再来，我一直在。"' },
        ],
      },
    ],
  },

  // -- merchant --
  wandering_trader: {
    id: 'wandering_trader',
    name: '流浪商人',
    description: '一个推着改装手推车的商人出现在你面前，车上摆满了瓶瓶罐罐和包裹。他看起来比一般人更警惕。',
    chapter: 2,
    type: 'merchant',
    choices: [
      {
        id: 'buy_heal_potion',
        text: '购买强效药水 (35金)',
        requirements: 'gold >= 35',
        outcomes: [
          { type: 'lose_gold', value: 35, description: '花费 35 金币' },
          { type: 'gain_hp', value: 20, description: '恢复 20 生命' },
        ],
      },
      {
        id: 'buy_mystery_box',
        text: '购买盲盒 (45金)',
        requirements: 'gold >= 45',
        outcomes: [
          { type: 'lose_gold', value: 45, description: '花费 45 金币' },
          { type: 'gain_card', description: '获得一张随机稀有卡牌' },
        ],
      },
      {
        id: 'sell_cards',
        text: '出售一张卡牌',
        outcomes: [
          { type: 'gain_gold', value: 20, description: '获得 20 金币' },
          { type: 'nothing', description: '商人挑走了一张卡牌' },
        ],
      },
      {
        id: 'pass_trader',
        text: '继续赶路',
        outcomes: [
          { type: 'nothing', description: '"下次再来！"商人喊道' },
        ],
      },
    ],
  },

  arms_dealer: {
    id: 'arms_dealer',
    name: '武器贩子',
    description: '一个满脸伤疤的男人守着一个简陋的武器架，上面插着几把锈迹斑斑但明显锋利的武器。"都是好货。"',
    chapter: 2,
    type: 'merchant',
    choices: [
      {
        id: 'buy_sword',
        text: '购买精钢短剑 (50金)',
        requirements: 'gold >= 50',
        outcomes: [
          { type: 'lose_gold', value: 50, description: '花费 50 金币' },
          { type: 'gain_card', description: '获得一张攻击卡牌' },
        ],
      },
      {
        id: 'buy_armor',
        text: '购买皮甲 (45金)',
        requirements: 'gold >= 45',
        outcomes: [
          { type: 'lose_gold', value: 45, description: '花费 45 金币' },
          { type: 'gain_card', description: '获得一张防御卡牌' },
        ],
      },
      {
        id: 'haggle',
        text: '讨价还价',
        outcomes: [
          { type: 'lose_gold', value: 25, description: '花费 25 金币' },
          { type: 'gain_card', description: '获得一张普通卡牌' },
          { type: 'nothing', description: '你用低价买了一把旧货' },
        ],
      },
      {
        id: 'leave_arms',
        text: '不买',
        outcomes: [
          { type: 'nothing', description: '"下次来啊。"' },
        ],
      },
    ],
  },

  // -- memory --
  fallen_city: {
    id: 'fallen_city',
    name: '陨落之城',
    description: '你走入了一座废弃的城市遗迹，建筑的残骸之间，你隐约看到了过去繁华的影子。耳边传来了模糊的喧嚣声。',
    chapter: 2,
    type: 'memory',
    choices: [
      {
        id: 'explore_ruins',
        text: '深入探索',
        outcomes: [
          { type: 'gain_gold', value: 35, description: '在废墟中找到遗落的财宝，获得 35 金币' },
          { type: 'nothing', description: '记忆的幻象渐渐消散' },
        ],
      },
      {
        id: 'meditate',
        text: '在废墟中冥想',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '你感受到了城市曾经的力量，获得 3 点动量' },
          { type: 'nothing', description: '你闭上了眼睛' },
        ],
      },
      {
        id: 'leave_city',
        text: '尽快离开',
        outcomes: [
          { type: 'nothing', description: '你不属于这里' },
        ],
      },
    ],
  },

  mirror_hallway: {
    id: 'mirror_hallway',
    name: '镜廊幻象',
    description: '一条两侧挂满镜子的走廊，每一面镜子里都映出你不同时期的模样——过去的、现在的、以及可能的未来。',
    chapter: 2,
    type: 'memory',
    choices: [
      {
        id: 'touch_young_reflection',
        text: '触碰年轻时的倒影',
        outcomes: [
          { type: 'gain_hp', value: 15, description: '青春的力量涌入体内，恢复 15 生命' },
          { type: 'nothing', description: '镜面冰冷如水' },
        ],
      },
      {
        id: 'look_future',
        text: '凝视未来的倒影',
        outcomes: [
          { type: 'gain_card', description: '未来的你留下了一张卡牌' },
          { type: 'lose_hp', value: 10, description: '未来充满苦难的景象令你心痛，失去 10 生命' },
        ],
      },
      {
        id: 'smash镜子',
        text: '砸碎所有镜子',
        outcomes: [
          { type: 'lose_hp', value: 8, description: '碎片四溅，失去 8 生命' },
          { type: 'gain_momentum', value: 2, description: '你斩断了过去，获得 2 点动量' },
        ],
      },
    ],
  },

  voice_from_pit: {
    id: 'voice_from_pit',
    name: '深渊之声',
    description: '一个漆黑的深坑中传来一个苍老的声音，它在讲述一个关于失落文明的故事。声音中蕴含着古老的力量。',
    chapter: 2,
    type: 'memory',
    choices: [
      {
        id: 'listen_full_story',
        text: '听完全部故事',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '古老智慧传递给你，获得 2 点动量' },
          { type: 'gain_hp', value: 8, description: '声音的力量治愈了你，恢复 8 生命' },
        ],
      },
      {
        id: 'throw_coin_in',
        text: '投入一枚金币',
        outcomes: [
          { type: 'lose_gold', value: 15, description: '花费 15 金币' },
          { type: 'gain_card', description: '声音赐予你一张卡牌' },
        ],
      },
      {
        id: 'ignore_voice',
        text: '不理会',
        outcomes: [
          { type: 'nothing', description: '声音叹了口气，归于沉寂' },
        ],
      },
    ],
  },

  // -- corruption --
  void_pool: {
    id: 'void_pool',
    name: '虚空之池',
    description: '地面上有一个漆黑的圆形水池，池水不是液体，而是某种流动的黑暗。它的表面偶尔泛起涟漪，仿佛有什么东西在下面呼吸。',
    chapter: 2,
    type: 'corruption',
    choices: [
      {
        id: 'submerge_hand',
        text: '将手伸入池中',
        outcomes: [
          { type: 'gain_relic', description: '从池底取出一件遗物' },
          { type: 'lose_max_hp', value: 5, description: '虚空侵蚀了你的身体，失去 5 最大生命' },
        ],
      },
      {
        id: 'drink_pool',
        text: '饮用池水',
        outcomes: [
          { type: 'gain_hp', value: 20, description: '黑暗能量涌入体内，恢复 20 生命' },
          { type: 'lose_max_hp', value: 7, description: '但代价是你的生命力上限，失去 7 最大生命' },
        ],
      },
      {
        id: 'avoid_pool',
        text: '远离虚空',
        outcomes: [
          { type: 'nothing', description: '你感到池中的东西在注视着你' },
        ],
      },
    ],
  },

  corrupted_tree: {
    id: 'corrupted_tree',
    name: '腐化古树',
    description: '一棵巨大的枯树矗立在你面前，树干上布满了黑色的脉络，仿佛血管一般在缓缓跳动。空气中弥漫着腐朽的甜味。',
    chapter: 2,
    type: 'corruption',
    choices: [
      {
        id: 'cut_branch',
        text: '砍下一根树枝',
        outcomes: [
          { type: 'gain_card', description: '获得一张与腐化相关的卡牌' },
          { type: 'lose_hp', value: 10, description: '树干喷出黑色液体灼伤了你，失去 10 生命' },
        ],
      },
      {
        id: 'collect_sap',
        text: '收集树液',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '树液可以卖钱，获得 30 金币' },
          { type: 'lose_hp', value: 5, description: '树液有微弱的腐蚀性，失去 5 生命' },
        ],
      },
      {
        id: 'burn_tree',
        text: '放火烧树',
        outcomes: [
          { type: 'nothing', description: '大树在火焰中化为灰烬' },
          { type: 'gain_momentum', value: 2, description: '你净化了腐化之源，获得 2 点动量' },
        ],
      },
      {
        id: 'leave_tree',
        text: '绕开古树',
        outcomes: [
          { type: 'nothing', description: '你不愿与腐化接触' },
        ],
      },
    ],
  },

  tainted_heart: {
    id: 'tainted_heart',
    name: '被污染的心脏',
    description: '一具巨大的尸体胸腔洞开，里面的心脏还在缓慢跳动，但已被黑色的脉络完全覆盖。它似乎在向你召唤。',
    chapter: 2,
    type: 'corruption',
    choices: [
      {
        id: 'take_heart',
        text: '取出心脏',
        outcomes: [
          { type: 'gain_relic', description: '获得被污染的心脏遗物' },
          { type: 'lose_max_hp', value: 4, description: '黑暗能量渗入你体内，失去 4 最大生命' },
        ],
      },
      {
        id: 'destroy_heart',
        text: '摧毁心脏',
        outcomes: [
          { type: 'gain_gold', value: 25, description: '心脏碎裂后留下结晶，获得 25 金币' },
          { type: 'lose_hp', value: 12, description: '心脏爆炸的冲击波伤害了你，失去 12 生命' },
        ],
      },
      {
        id: 'leave_heart',
        text: '不去碰它',
        outcomes: [
          { type: 'nothing', description: '你绕过了那具尸体' },
        ],
      },
    ],
  },

  // -- strange_machine --
  arcane_engine: {
    id: 'arcane_engine',
    name: '奥术引擎',
    description: '一台巨大的机械装置占据了整个房间，铜管和水晶交错排列，中心是一个旋转的球体。它似乎还有一丝残余的能量。',
    chapter: 2,
    type: 'strange_machine',
    choices: [
      {
        id: 'activate_engine',
        text: '启动引擎',
        outcomes: [
          { type: 'gain_gold', value: 45, description: '引擎产出了一枚纯金齿轮，获得 45 金币' },
          { type: 'lose_hp', value: 10, description: '能量过载灼伤了你，失去 10 生命' },
        ],
      },
      {
        id: 'extract_crystal',
        text: '拆卸水晶',
        outcomes: [
          { type: 'gain_relic', description: '获得一颗奥术水晶遗物' },
          { type: 'nothing', description: '你小心地取出了水晶' },
        ],
      },
      {
        id: 'study_engine',
        text: '研究引擎构造',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '你理解了部分原理，获得 2 点动量' },
          { type: 'nothing', description: '引擎太复杂了，你只理解了一部分' },
        ],
      },
    ],
  },

  // -- ancient_shrine --
  altar_of_flames: {
    id: 'altar_of_flames',
    name: '烈焰祭坛',
    description: '一座由黑石砌成的祭坛上燃烧着永不熄灭的火焰。火焰是深蓝色的，温度却异常冰冷。祭坛前的地面上有跪拜的痕迹。',
    chapter: 2,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'offer_blood_fire',
        text: '以血祭火',
        outcomes: [
          { type: 'lose_hp', value: 10, description: '割破手掌，失去 10 生命' },
          { type: 'gain_card', description: '火焰中凝聚出一张卡牌' },
        ],
      },
      {
        id: 'warm_hands',
        text: '在火焰旁取暖',
        outcomes: [
          { type: 'gain_hp', value: 8, description: '冰冷的火焰带来奇异的治愈，恢复 8 生命' },
          { type: 'nothing', description: '你的双手温暖了起来' },
        ],
      },
      {
        id: 'extinguish_flame',
        text: '熄灭火焰',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '灰烬中找到古代供品，获得 30 金币' },
          { type: 'lose_hp', value: 8, description: '熄灭的瞬间爆发出冲击波，失去 8 生命' },
        ],
      },
      {
        id: 'pass_altar',
        text: '绕行离开',
        outcomes: [
          { type: 'nothing', description: '你不想打扰这古老的火焰' },
        ],
      },
    ],
  },

  ancestor_statue: {
    id: 'ancestor_statue',
    name: '先祖雕像',
    description: '一尊高大的石雕矗立在广场中央，雕刻的是一位手持天平的审判者。雕像的眼睛似乎在追踪你的移动。',
    chapter: 2,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'place_offerings',
        text: '在天平上放置供品',
        outcomes: [
          { type: 'lose_gold', value: 25, description: '献上 25 金币' },
          { type: 'gain_hp', value: 15, description: '雕像发出光芒，恢复 15 生命' },
          { type: 'gain_momentum', value: 1, description: '获得 1 点动量' },
        ],
      },
      {
        id: 'pray_for_guidance',
        text: '祈求指引',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '你感到内心有了方向，获得 2 点动量' },
          { type: 'nothing', description: '雕像沉默地注视着你' },
        ],
      },
      {
        id: 'climb_statue',
        text: '爬上雕像寻找宝物',
        outcomes: [
          { type: 'gain_gold', value: 20, description: '在雕像头部发现金币，获得 20 金币' },
          { type: 'lose_hp', value: 8, description: '跌落受伤，失去 8 生命' },
        ],
      },
    ],
  },

  // -- curse_trade --
  shadow_vow: {
    id: 'shadow_vow',
    name: '暗影之誓',
    description: '一道黑影从地面升起，化为一个人形。它向你伸出手掌，掌心刻着一个发光的符文。"与我立誓，你将获得远超凡人的力量。"',
    chapter: 2,
    type: 'curse_trade',
    choices: [
      {
        id: 'accept_vow',
        text: '立下暗影之誓',
        outcomes: [
          { type: 'gain_momentum', value: 4, description: '暗影之力注入体内，获得 4 点动量' },
          { type: 'lose_max_hp', value: 8, description: '誓约的代价是你的生命力上限，失去 8 最大生命' },
        ],
      },
      {
        id: 'counter_offer',
        text: '以金币替代',
        outcomes: [
          { type: 'lose_gold', value: 50, description: '花费 50 金币' },
          { type: 'gain_momentum', value: 2, description: '暗影接受了交易，获得 2 点动量' },
        ],
      },
      {
        id: 'refuse_vow',
        text: '拒绝立誓',
        outcomes: [
          { type: 'nothing', description: '暗影发出低沉的笑声后消散了' },
        ],
      },
    ],
  },

  // -- merchant --
  traveling_alchemist: {
    id: 'traveling_alchemist',
    name: '行脚炼金师',
    description: '一个背着巨大蒸馏器的炼金师在路边搭起了简易摊位，各种颜色的药水在瓶中翻涌。"科学与魔法的结晶，要看看吗？"',
    chapter: 2,
    type: 'merchant',
    choices: [
      {
        id: 'buy_regen_potion',
        text: '购买再生药剂 (40金)',
        requirements: 'gold >= 40',
        outcomes: [
          { type: 'lose_gold', value: 40, description: '花费 40 金币' },
          { type: 'gain_hp', value: 18, description: '再生药剂恢复了 18 生命' },
        ],
      },
      {
        id: 'buy_power_elixir',
        text: '购买力量灵药 (55金)',
        requirements: 'gold >= 55',
        outcomes: [
          { type: 'lose_gold', value: 55, description: '花费 55 金币' },
          { type: 'gain_momentum', value: 3, description: '力量灵药给予你 3 点动量' },
        ],
      },
      {
        id: 'sell_alchemist',
        text: '出售材料',
        outcomes: [
          { type: 'gain_gold', value: 15, description: '获得 15 金币' },
          { type: 'nothing', description: '炼金师对你的材料不太满意' },
        ],
      },
      {
        id: 'pass_alchemist',
        text: '路过不买',
        outcomes: [
          { type: 'nothing', description: '"下次一定来啊！"' },
        ],
      },
    ],
  },

  // -- strange_machine --
  resonance_pillar: {
    id: 'resonance_pillar',
    name: '共鸣石柱',
    description: '一根刻满螺旋纹路的石柱矗立在空地上，当风吹过时，它会发出低沉的嗡鸣声。柱顶嵌着一颗闪烁的宝石。',
    chapter: 2,
    type: 'strange_machine',
    choices: [
      {
        id: 'touch_pillar',
        text: '触摸石柱',
        outcomes: [
          { type: 'gain_hp', value: 12, description: '共鸣能量治愈了你，恢复 12 生命' },
          { type: 'nothing', description: '石柱的嗡鸣变得更加响亮' },
        ],
      },
      {
        id: 'extract_gem',
        text: '取下宝石',
        outcomes: [
          { type: 'gain_gold', value: 35, description: '宝石非常珍贵，获得 35 金币' },
          { type: 'lose_hp', value: 10, description: '石柱释放出冲击波，失去 10 生命' },
        ],
      },
      {
        id: 'listen_resonance',
        text: '倾听共鸣',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '共鸣中蕴含着古老的旋律，获得 2 点动量' },
          { type: 'nothing', description: '你闭上眼睛感受声波' },
        ],
      },
    ],
  },

  mechanical_oracle: {
    id: 'mechanical_oracle',
    name: '机械先知',
    description: '一个由铜管和齿轮组装而成的半身像被固定在墙上，它的嘴部有一个投币口。旁边刻着："投入金币，获取预言。"',
    chapter: 2,
    type: 'strange_machine',
    choices: [
      {
        id: 'pay_prophecy',
        text: '投币求预言 (20金)',
        requirements: 'gold >= 20',
        outcomes: [
          { type: 'lose_gold', value: 20, description: '花费 20 金币' },
          { type: 'gain_card', description: '先知吐出了一张卡牌作为启示' },
        ],
      },
      {
        id: 'pay_fate',
        text: '投币求命运 (35金)',
        requirements: 'gold >= 35',
        outcomes: [
          { type: 'lose_gold', value: 35, description: '花费 35 金币' },
          { type: 'gain_hp', value: 15, description: '"你的命运是治愈。"一股暖流涌入体内' },
          { type: 'gain_momentum', value: 1, description: '获得 1 点动量' },
        ],
      },
      {
        id: 'dismantle_oracle',
        text: '拆解机械先知',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '零件值不少钱，获得 30 金币' },
          { type: 'nothing', description: '你拆解了它' },
        ],
      },
      {
        id: 'leave_oracle',
        text: '不理会',
        outcomes: [
          { type: 'nothing', description: '机械先知空洞的眼睛注视着你离去' },
        ],
      },
    ],
  },

  // -- ancient_shrine --
  prayer_garden: {
    id: 'prayer_garden',
    name: '祈祷花园',
    description: '一座被藤蔓覆盖的花园，中央有一座低矮的石台，上面放着一个铜制香炉。空气中弥漫着古老花卉的芬芳。',
    chapter: 2,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'burn_incense',
        text: '点燃香炉',
        outcomes: [
          { type: 'gain_hp', value: 12, description: '香气带来治愈，恢复 12 生命' },
          { type: 'gain_momentum', value: 1, description: '获得 1 点动量' },
        ],
      },
      {
        id: 'pick_flowers',
        text: '采集花朵',
        outcomes: [
          { type: 'gain_card', description: '花朵可以制成药剂，获得一张卡牌' },
          { type: 'nothing', description: '你小心翼翼地摘取了花朵' },
        ],
      },
      {
        id: 'meditate_garden',
        text: '在花园中冥想',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '花园的宁静让你有所感悟，获得 2 点动量' },
          { type: 'nothing', description: '你在花丛间闭目沉思' },
        ],
      },
    ],
  },

  // -- random_gamble --
  mystery_door: {
    id: 'mystery_door',
    name: '神秘之门',
    description: '一扇孤零零的门框立在走廊中间，门上没有门板，取而代之的是流动的光幕。门框上刻着三行字：左边"勇气"，中间"贪婪"，右边"智慧"。',
    chapter: 2,
    type: 'random_gamble',
    choices: [
      {
        id: 'enter_courage',
        text: '走向"勇气"之门',
        outcomes: [
          { type: 'gain_relic', description: '勇气试炼通过，获得一件遗物' },
          { type: 'lose_hp', value: 15, description: '试炼消耗了你的体力，失去 15 生命' },
        ],
      },
      {
        id: 'enter_greed',
        text: '走向"贪婪"之门',
        outcomes: [
          { type: 'gain_gold', value: 70, description: '满地的金币！获得 70 金币' },
          { type: 'lose_hp', value: 10, description: '但你被困在了陷阱中，失去 10 生命' },
        ],
      },
      {
        id: 'enter_wisdom',
        text: '走向"智慧"之门',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '古代的智慧传递给你，获得 3 点动量' },
          { type: 'nothing', description: '门后是一间安静的书房' },
        ],
      },
    ],
  },

  // -- random_gamble --
  card_duel: {
    id: 'card_duel',
    name: '卡牌对决',
    description: '一个神秘的蒙面人坐在桌前，桌上摊着几张卡牌。"用你的命运来赌我的收藏吧。"',
    chapter: 2,
    type: 'random_gamble',
    choices: [
      {
        id: 'accept_duel',
        text: '接受挑战',
        outcomes: [
          { type: 'gain_card', description: '你赢了，获得一张稀有卡牌' },
          { type: 'lose_gold', value: 30, description: '你输了，失去 30 金币' },
        ],
      },
      {
        id: 'double_or_nothing',
        text: '加注——赌双倍',
        outcomes: [
          { type: 'gain_card', description: '你赢了，获得两张稀有卡牌' },
          { type: 'lose_gold', value: 60, description: '你输了，失去 60 金币' },
        ],
      },
      {
        id: 'decline_duel',
        text: '不赌了',
        outcomes: [
          { type: 'nothing', description: '"真扫兴。"蒙面人收起了牌' },
        ],
      },
    ],
  },

  slot_machine: {
    id: 'slot_machine',
    name: '古代老虎机',
    description: '一台布满铜锈的机械装置，上面有三个转轮和一个巨大的拉杆。旁边贴着褪色的使用说明。',
    chapter: 2,
    type: 'random_gamble',
    choices: [
      {
        id: 'play_once',
        text: '投币一次 (15金)',
        requirements: 'gold >= 15',
        outcomes: [
          { type: 'gain_gold', value: 45, description: '三个图案相同！获得 45 金币' },
          { type: 'gain_gold', value: 20, description: '两个图案相同，获得 20 金币' },
          { type: 'lose_gold', value: 15, description: '什么都没中，失去 15 金币' },
        ],
      },
      {
        id: 'play_three',
        text: '投币三次 (30金)',
        requirements: 'gold >= 30',
        outcomes: [
          { type: 'gain_gold', value: 80, description: '连续中奖！获得 80 金币' },
          { type: 'gain_gold', value: 30, description: '运气一般，获得 30 金币' },
          { type: 'lose_gold', value: 30, description: '全部落空，失去 30 金币' },
        ],
      },
      {
        id: 'walk_away_machine',
        text: '不玩',
        outcomes: [
          { type: 'nothing', description: '你决定不浪费钱' },
        ],
      },
    ],
  },

  // ----------------------------------------------------------
  // CHAPTER 3 (23 events)
  // ----------------------------------------------------------

  // -- risk_reward --
  dragon_nest: {
    id: 'dragon_nest',
    name: '龙巢遗迹',
    description: '焦黑的岩壁围成了一个巨大的洞穴，地面上散落着被烧焦的金属碎片和融化的金币。空气中还有硫磺的余味。',
    chapter: 3,
    type: 'risk_reward',
    choices: [
      {
        id: 'scavenge_gold',
        text: '搜刮融化金币',
        outcomes: [
          { type: 'gain_gold', value: 80, description: '收集到大量融化金币，获得 80 金币' },
          { type: 'lose_hp', value: 15, description: '余烬灼伤了你，失去 15 生命' },
        ],
      },
      {
        id: 'search_deep',
        text: '深入巢穴深处',
        outcomes: [
          { type: 'gain_relic', description: '在巢穴深处发现龙族遗物' },
          { type: 'lose_hp', value: 20, description: '洞穴坍塌险些将你掩埋，失去 20 生命' },
        ],
      },
      {
        id: 'take_only_shiny',
        text: '只拿表面的碎片',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '安全地拾取了一些碎片，获得 30 金币' },
          { type: 'nothing', description: '你没有深入危险区域' },
        ],
      },
    ],
  },

  time_rift: {
    id: 'time_rift',
    name: '时间裂隙',
    description: '空气中有一道肉眼可见的扭曲，裂隙的一侧是废墟，另一侧却映射出完好无损的古代城市。你可以伸手进去。',
    chapter: 3,
    type: 'risk_reward',
    choices: [
      {
        id: 'reach_through',
        text: '伸手穿过裂隙',
        outcomes: [
          { type: 'gain_gold', value: 60, description: '从古代城市中抓取了一把金币，获得 60 金币' },
          { type: 'lose_hp', value: 12, description: '时间的力量撕扯着你的手臂，失去 12 生命' },
        ],
      },
      {
        id: 'step_through',
        text: '整个人穿过裂隙',
        outcomes: [
          { type: 'gain_relic', description: '在古代城市中找到一件遗物' },
          { type: 'lose_max_hp', value: 5, description: '时间裂缝在你身后关闭，你的一部分留在了那里，失去 5 最大生命' },
        ],
      },
      {
        id: 'observe_rift',
        text: '远距离观察',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '你理解了时间的本质，获得 2 点动量' },
          { type: 'nothing', description: '裂隙缓缓消散' },
        ],
      },
      {
        id: 'ignore_rift',
        text: '不去管它',
        outcomes: [
          { type: 'nothing', description: '你绕过了裂隙' },
        ],
      },
    ],
  },

  // -- curse_trade --
  death_bargain: {
    id: 'death_bargain',
    name: '死神之约',
    description: '一个穿着黑色斗篷的身影出现在你面前，兜帽下是一张没有五官的脸。它伸出一只手，掌心放着一枚金币。',
    chapter: 3,
    type: 'curse_trade',
    choices: [
      {
        id: 'take_gold',
        text: '接受金币',
        outcomes: [
          { type: 'gain_gold', value: 100, description: '获得 100 金币' },
          { type: 'lose_max_hp', value: 10, description: '你的寿命被削减了，失去 10 最大生命' },
        ],
      },
      {
        id: 'refuse',
        text: '拒绝',
        outcomes: [
          { type: 'nothing', description: '死神沉默地收回了手，消失在黑暗中' },
        ],
      },
      {
        id: 'negotiate',
        text: '讨价还价',
        outcomes: [
          { type: 'gain_gold', value: 50, description: '获得 50 金币' },
          { type: 'lose_max_hp', value: 5, description: '失去 5 最大生命' },
          { type: 'nothing', description: '死神似乎觉得有趣，给出了一个折中方案' },
        ],
      },
    ],
  },

  cursed_crown: {
    id: 'cursed_crown',
    name: '诅咒王冠',
    description: '一顶锈迹斑斑的王冠躺在碎石之间，宝石已经脱落，但金属骨架上仍残留着某种压迫性的力量。你感到心跳加速。',
    chapter: 3,
    type: 'curse_trade',
    choices: [
      {
        id: 'wear_crown',
        text: '戴上王冠',
        outcomes: [
          { type: 'gain_card', cardId: 'curse_pride', description: '获得一张王者之力的卡牌' },
          { type: 'lose_max_hp', value: 8, description: '王冠的重量压碎了你的一部分，失去 8 最大生命' },
          { type: 'gain_momentum', value: 2, description: '获得 2 点动量' },
        ],
      },
      {
        id: 'sell_crown',
        text: '带走卖掉',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得 40 金币' },
          { type: 'nothing', description: '王冠的价值在于金属而非力量' },
        ],
      },
      {
        id: 'destroy_crown',
        text: '摧毁王冠',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '你粉碎了压迫的象征，获得 3 点动量' },
          { type: 'nothing', description: '诅咒的力量在碎裂中消散' },
        ],
      },
    ],
  },

  // -- merchant --
  ghost_merchant: {
    id: 'ghost_merchant',
    name: '幽灵商人',
    description: '一个半透明的身影坐在空荡荡的店铺中，柜台上摆着几件发着幽光的商品。"活人很少来这里了。"',
    chapter: 3,
    type: 'merchant',
    choices: [
      {
        id: 'buy_ghost_blade',
        text: '购买幽灵之刃 (60金)',
        requirements: 'gold >= 60',
        outcomes: [
          { type: 'lose_gold', value: 60, description: '花费 60 金币' },
          { type: 'gain_card', description: '获得一张穿透防御的攻击卡牌' },
        ],
      },
      {
        id: 'buy_soul_potion',
        text: '购买灵魂药剂 (50金)',
        requirements: 'gold >= 50',
        outcomes: [
          { type: 'lose_gold', value: 50, description: '花费 50 金币' },
          { type: 'gain_hp', value: 25, description: '灵魂药剂恢复了 25 生命' },
        ],
      },
      {
        id: 'trade_memories',
        text: '用记忆交换',
        outcomes: [
          { type: 'gain_card', description: '获得一张珍贵的卡牌' },
          { type: 'lose_max_hp', value: 3, description: '你遗忘了一些重要的东西，失去 3 最大生命' },
        ],
      },
      {
        id: 'leave_ghost',
        text: '离开',
        outcomes: [
          { type: 'nothing', description: '"这里的东西永远都在……"' },
        ],
      },
    ],
  },

  rare_collector: {
    id: 'rare_collector',
    name: '稀有收藏家',
    description: '一个穿着华丽但褪色的长袍的人站在展柜前，柜中陈列着各种奇异的物品。"我对普通的东西不感兴趣。"',
    chapter: 3,
    type: 'merchant',
    choices: [
      {
        id: 'buy_relic',
        text: '购买古代遗物 (80金)',
        requirements: 'gold >= 80',
        outcomes: [
          { type: 'lose_gold', value: 80, description: '花费 80 金币' },
          { type: 'gain_relic', description: '获得一件强力遗物' },
        ],
      },
      {
        id: 'trade_relic',
        text: '用你的遗物交换',
        outcomes: [
          { type: 'gain_card', description: '获得一张稀有卡牌' },
          { type: 'nothing', description: '你交出了一件遗物' },
        ],
      },
      {
        id: 'admire_collection',
        text: '只是欣赏收藏',
        outcomes: [
          { type: 'gain_momentum', value: 1, description: '收藏品给你带来了灵感，获得 1 点动量' },
          { type: 'nothing', description: '"不买就别碰。"' },
        ],
      },
    ],
  },

  // -- memory --
  final_city: {
    id: 'final_city',
    name: '终末之城',
    description: '你来到了文明最后的遗迹，城市的废墟在夕阳下投射出长长的影子。你听到了一个熟悉的声音在呼唤你的名字。',
    chapter: 3,
    type: 'memory',
    choices: [
      {
        id: 'follow_voice',
        text: '追随声音',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '你找到了过去的自己留下的信息，获得 3 点动量' },
          { type: 'nothing', description: '"继续前进……不要回头……"' },
        ],
      },
      {
        id: 'search_buildings',
        text: '搜索建筑物',
        outcomes: [
          { type: 'gain_gold', value: 45, description: '在废墟中发现宝藏，获得 45 金币' },
          { type: 'nothing', description: '城市的记忆已经模糊' },
        ],
      },
      {
        id: 'sit_and_remember',
        text: '坐下来回忆',
        outcomes: [
          { type: 'gain_hp', value: 15, description: '内心的平静治愈了创伤，恢复 15 生命' },
          { type: 'gain_momentum', value: 1, description: '获得 1 点动量' },
        ],
      },
    ],
  },

  ghostly_reunion: {
    id: 'ghostly_reunion',
    name: '幽灵重逢',
    description: '一群半透明的身影围坐在篝火旁，他们正在举行某种仪式。当他们看到你时，其中一个站了起来——它的面孔你似乎认识。',
    chapter: 3,
    type: 'memory',
    choices: [
      {
        id: 'join_circle',
        text: '加入他们',
        outcomes: [
          { type: 'gain_hp', value: 12, description: '仪式带来温暖和治愈，恢复 12 生命' },
          { type: 'gain_momentum', value: 2, description: '获得 2 点动量' },
        ],
      },
      {
        id: 'speak_to_ghost',
        text: '与那个身影对话',
        outcomes: [
          { type: 'gain_card', description: '它留下了一张卡牌作为纪念' },
          { type: 'nothing', description: '"我们已经不在了，但记忆还在……"' },
        ],
      },
      {
        id: 'avoid_reunion',
        text: '不打扰他们',
        outcomes: [
          { type: 'nothing', description: '你默默走过了篝火' },
        ],
      },
    ],
  },

  lost_archive: {
    id: 'lost_archive',
    name: '失落档案馆',
    description: '一座被遗忘的图书馆，书架歪斜但书籍保存完好。书页上的文字在你翻阅时微微发光。你感到知识在涌入脑海。',
    chapter: 3,
    type: 'memory',
    choices: [
      {
        id: 'read_everything',
        text: '尽可能多地阅读',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '获得了大量知识，获得 3 点动量' },
          { type: 'lose_hp', value: 5, description: '知识的重压令你头痛，失去 5 生命' },
        ],
      },
      {
        id: 'find_one_book',
        text: '只找一本有用的书',
        outcomes: [
          { type: 'gain_card', description: '获得一张知识相关的卡牌' },
          { type: 'nothing', description: '你找到了一本实用的指南' },
        ],
      },
      {
        id: 'take_valuable_tomes',
        text: '拿走珍贵的典籍',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '这些书很值钱，获得 40 金币' },
          { type: 'nothing', description: '你将书籍打包带走' },
        ],
      },
      {
        id: 'leave_archive',
        text: '离开档案馆',
        outcomes: [
          { type: 'nothing', description: '你小心地将书放回原处' },
        ],
      },
    ],
  },

  // -- corruption --
  void_titan: {
    id: 'void_titan',
    name: '虚空巨人',
    description: '一个巨大的黑色轮廓矗立在远方，它的身体由流动的黑暗组成，每走一步都会在地面留下腐蚀的痕迹。它似乎在沉睡。',
    chapter: 3,
    type: 'corruption',
    choices: [
      {
        id: 'sneak_past',
        text: '悄悄绕过',
        outcomes: [
          { type: 'nothing', description: '你屏住呼吸，安全地绕过了巨人' },
        ],
      },
      {
        id: 'steal_shard',
        text: '偷取它身上的碎片',
        outcomes: [
          { type: 'gain_relic', description: '获得虚空巨人的碎片遗物' },
          { type: 'lose_max_hp', value: 6, description: '巨人惊醒时的冲击波伤害了你，失去 6 最大生命' },
        ],
      },
      {
        id: 'attack_sleeping',
        text: '趁它沉睡发动攻击',
        outcomes: [
          { type: 'gain_gold', value: 50, description: '击败巨人后掉落了宝藏，获得 50 金币' },
          { type: 'lose_hp', value: 25, description: '巨人的反击令你重伤，失去 25 生命' },
        ],
      },
    ],
  },

  corruption_spring: {
    id: 'corruption_spring',
    name: '腐化之泉',
    description: '曾经清澈的泉水现在流淌着漆黑的液体，泉眼周围的岩石已经被完全腐蚀。黑色液体中偶尔冒出气泡。',
    chapter: 3,
    type: 'corruption',
    choices: [
      {
        id: 'purify_spring',
        text: '净化泉水',
        outcomes: [
          { type: 'gain_hp', value: 20, description: '净化后的泉水治愈了你，恢复 20 生命' },
          { type: 'lose_max_hp', value: 3, description: '净化消耗了你的生命力，失去 3 最大生命' },
        ],
      },
      {
        id: 'drink_dark',
        text: '饮用腐化之水',
        outcomes: [
          { type: 'gain_card', description: '获得一张黑暗力量的卡牌' },
          { type: 'lose_max_hp', value: 8, description: '黑暗侵蚀了你的身体，失去 8 最大生命' },
        ],
      },
      {
        id: 'ignore_spring',
        text: '不去碰它',
        outcomes: [
          { type: 'nothing', description: '你远远地绕过了泉水' },
        ],
      },
    ],
  },

  flesh_wall: {
    id: 'flesh_wall',
    name: '血肉之墙',
    description: '一面由血肉构成的墙壁堵住了去路，它在缓慢地脉动着，表面布满了眼睛和嘴巴。它们都在低语。',
    chapter: 3,
    type: 'corruption',
    choices: [
      {
        id: 'cut_through',
        text: '强行切开通过',
        outcomes: [
          { type: 'nothing', description: '你劈开血肉之墙冲了过去' },
          { type: 'lose_hp', value: 15, description: '血肉墙壁的反击伤害了你，失去 15 生命' },
        ],
      },
      {
        id: 'negotiate',
        text: '与墙壁沟通',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '墙壁让开了路，并给予了你力量，获得 3 点动量' },
          { type: 'nothing', description: '你听懂了它们的低语' },
        ],
      },
      {
        id: 'find_detour2',
        text: '寻找绕行路线',
        outcomes: [
          { type: 'gain_gold', value: 25, description: '绕路时发现了一些遗落的财宝，获得 25 金币' },
          { type: 'nothing', description: '你找到了另一条路' },
        ],
      },
    ],
  },

  // -- strange_machine --
  dimensional_gate: {
    id: 'dimensional_gate',
    name: '次元之门',
    description: '一扇巨大的金属门框悬浮在空中，门框内是旋转的星云。门框两侧有控制杆，上面刻着警告文字。',
    chapter: 3,
    type: 'strange_machine',
    choices: [
      {
        id: 'open_gate',
        text: '启动次元之门',
        outcomes: [
          { type: 'gain_card', description: '从门中飘出一张来自其他维度的卡牌' },
          { type: 'lose_hp', value: 12, description: '维度能量的溢出灼伤了你，失去 12 生命' },
        ],
      },
      {
        id: 'harvest_energy',
        text: '收集溢出的能量',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '能量结晶可以卖钱，获得 40 金币' },
          { type: 'nothing', description: '你小心地收集了溢出的碎片' },
        ],
      },
      {
        id: 'seal_gate',
        text: '封印次元之门',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '你防止了灾难发生，获得 2 点动量' },
          { type: 'nothing', description: '门框在封印后缓缓消失' },
        ],
      },
      {
        id: 'ignore_gate',
        text: '不去碰它',
        outcomes: [
          { type: 'nothing', description: '你绕过了次元之门' },
        ],
      },
    ],
  },

  clockwork_god: {
    id: 'clockwork_god',
    name: '发条神像',
    description: '一尊由齿轮和铜管构成的巨型神像，它的眼睛是旋转的透镜，胸腔里有一个永不停歇的发条核心。它在等待激活。',
    chapter: 3,
    type: 'strange_machine',
    choices: [
      {
        id: 'activate_god',
        text: '激活发条神像',
        outcomes: [
          { type: 'gain_relic', description: '神像赐予你一件机械遗物' },
          { type: 'lose_hp', value: 15, description: '激活时的能量冲击伤害了你，失去 15 生命' },
        ],
      },
      {
        id: 'steal_core',
        text: '偷取发条核心',
        outcomes: [
          { type: 'gain_gold', value: 60, description: '发条核心非常值钱，获得 60 金币' },
          { type: 'lose_hp', value: 20, description: '神像的防御机制启动，失去 20 生命' },
        ],
      },
      {
        id: 'worship_god',
        text: '在神像前祈祷',
        outcomes: [
          { type: 'gain_hp', value: 10, description: '机械之力治愈了你，恢复 10 生命' },
          { type: 'gain_momentum', value: 2, description: '获得 2 点动量' },
        ],
      },
    ],
  },

  // -- ancient_shrine --
  void_altar: {
    id: 'void_altar',
    name: '虚空祭坛',
    description: '一座由纯黑色大理石建造的祭坛，表面光滑如镜。祭坛中央有一个凹槽，形状恰好可以放入一颗心脏。',
    chapter: 3,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'place_heart',
        text: '放置一颗心脏',
        outcomes: [
          { type: 'gain_relic', description: '虚空祭坛赐予你一件强大的遗物' },
          { type: 'lose_max_hp', value: 8, description: '放置心脏的代价是你的生命力，失去 8 最大生命' },
        ],
      },
      {
        id: 'touch_altar',
        text: '触摸祭坛表面',
        outcomes: [
          { type: 'gain_hp', value: 15, description: '虚空的力量治愈了你，恢复 15 生命' },
          { type: 'nothing', description: '祭坛的表面冰冷刺骨' },
        ],
      },
      {
        id: 'leave_void_altar',
        text: '离开',
        outcomes: [
          { type: 'nothing', description: '你不愿支付代价' },
        ],
      },
    ],
  },

  world_tree: {
    id: 'world_tree',
    name: '世界树残根',
    description: '一棵巨大到令人窒息的枯树残根，它曾经连接天地，如今只剩断裂的躯干。但根部深处似乎还有微弱的生命力在流动。',
    chapter: 3,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'channel_root',
        text: '连接根部的力量',
        outcomes: [
          { type: 'gain_hp', value: 20, description: '古老的生命力涌入体内，恢复 20 生命' },
          { type: 'gain_momentum', value: 2, description: '获得 2 点动量' },
        ],
      },
      {
        id: 'harvest_bark',
        text: '剥取树皮',
        outcomes: [
          { type: 'gain_card', description: '获得一张与生命相关的卡牌' },
          { type: 'nothing', description: '你小心地取下了树皮' },
        ],
      },
      {
        id: 'plant_seed',
        text: '在根部种下种子',
        outcomes: [
          { type: 'gain_hp', value: 10, description: '新芽萌发治愈了你，恢复 10 生命' },
          { type: 'gain_momentum', value: 1, description: '获得 1 点动量' },
          { type: 'nothing', description: '生命在废墟中延续' },
        ],
      },
    ],
  },

  // -- risk_reward --
  collapsing_tower: {
    id: 'collapsing_tower',
    name: '倾颓高塔',
    description: '一座半截没入地面的高塔正在缓慢倾斜，碎石不断从顶部滑落。但透过裂缝，你能看到塔内闪烁的金色光芒。',
    chapter: 3,
    type: 'risk_reward',
    choices: [
      {
        id: 'rush_in',
        text: '冲入塔内',
        outcomes: [
          { type: 'gain_gold', value: 70, description: '找到了塔内的宝库，获得 70 金币' },
          { type: 'lose_hp', value: 18, description: '碎石砸中了你，失去 18 生命' },
        ],
      },
      {
        id: 'climb_exterior',
        text: '从外侧攀爬',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '在窗台上找到了金币，获得 40 金币' },
          { type: 'lose_hp', value: 10, description: '攀爬时差点摔落，失去 10 生命' },
        ],
      },
      {
        id: 'wait_for_collapse',
        text: '等它塌完再搜',
        outcomes: [
          { type: 'gain_gold', value: 25, description: '从废墟中捡到一些碎片，获得 25 金币' },
          { type: 'nothing', description: '你等塔完全坍塌后才靠近' },
        ],
      },
    ],
  },

  // -- merchant --
  void_broker: {
    id: 'void_broker',
    name: '虚空掮客',
    description: '一个没有面孔的身影坐在由暗物质构成的柜台后，柜台上漂浮着各种被黑暗包裹的商品。"一切皆可交易，只要你付得起价。"',
    chapter: 3,
    type: 'merchant',
    choices: [
      {
        id: 'buy_void_blade',
        text: '购买虚空之刃 (70金)',
        requirements: 'gold >= 70',
        outcomes: [
          { type: 'lose_gold', value: 70, description: '花费 70 金币' },
          { type: 'gain_card', description: '获得一张虚空卡牌' },
        ],
      },
      {
        id: 'buy_dark_shield',
        text: '购买暗影护盾 (65金)',
        requirements: 'gold >= 65',
        outcomes: [
          { type: 'lose_gold', value: 65, description: '花费 65 金币' },
          { type: 'gain_card', description: '获得一张暗影防御卡牌' },
        ],
      },
      {
        id: 'trade_hp',
        text: '用生命换取物品',
        outcomes: [
          { type: 'lose_max_hp', value: 5, description: '失去 5 最大生命' },
          { type: 'gain_relic', description: '获得一件虚空遗物' },
        ],
      },
      {
        id: 'leave_broker',
        text: '离开',
        outcomes: [
          { type: 'nothing', description: '"虚空永远在这里等你。"' },
        ],
      },
    ],
  },

  // -- strange_machine --
  reality_forge: {
    id: 'reality_forge',
    name: '现实熔炉',
    description: '一间巨大的锻造室中，一座由不属于这个世界的金属制成的熔炉正在燃烧。火焰的颜色不断变化，空气中弥漫着金属和硫磺的气味。',
    chapter: 3,
    type: 'strange_machine',
    choices: [
      {
        id: 'forge_item',
        text: '锻造一件物品',
        outcomes: [
          { type: 'gain_relic', description: '你锻造出了一件独特的遗物' },
          { type: 'lose_hp', value: 12, description: '锻造时的热量灼伤了你，失去 12 生命' },
        ],
      },
      {
        id: 'quench_in_flame',
        text: '将手伸入火焰',
        outcomes: [
          { type: 'gain_momentum', value: 4, description: '火焰淬炼了你的意志，获得 4 点动量' },
          { type: 'lose_max_hp', value: 4, description: '你的肉体被灼烧，失去 4 最大生命' },
        ],
      },
      {
        id: 'study_forge',
        text: '研究熔炉构造',
        outcomes: [
          { type: 'gain_gold', value: 35, description: '你发现了一些值钱的材料，获得 35 金币' },
          { type: 'nothing', description: '你拆卸了一些金属碎片' },
        ],
      },
    ],
  },

  // -- ancient_shrine --
  divine_mirror: {
    id: 'divine_mirror',
    name: '神谕之镜',
    description: '一面巨大的圆形铜镜竖立在神殿中央，镜框上刻着十二个星座的图案。镜面中映出的不是你的倒影，而是一片星空。',
    chapter: 3,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'touch_mirror',
        text: '触摸镜面',
        outcomes: [
          { type: 'gain_card', description: '镜面中浮现出一张卡牌' },
          { type: 'gain_momentum', value: 2, description: '星光的力量注入你体内，获得 2 点动量' },
        ],
      },
      {
        id: 'speak_to_stars',
        text: '对着镜子说话',
        outcomes: [
          { type: 'gain_hp', value: 18, description: '星空回应了你，恢复 18 生命' },
          { type: 'nothing', description: '镜面上的星光渐渐暗淡' },
        ],
      },
      {
        id: 'offer_relic',
        text: '供奉一件遗物',
        outcomes: [
          { type: 'gain_gold', value: 50, description: '镜子将你的遗物转化成了金币，获得 50 金币' },
          { type: 'gain_momentum', value: 2, description: '获得 2 点动量' },
        ],
      },
      {
        id: 'ignore_mirror',
        text: '不去看镜子',
        outcomes: [
          { type: 'nothing', description: '你低着头从镜子旁走过' },
        ],
      },
    ],
  },

  // -- random_gamble --
  chaos_wheel: {
    id: 'chaos_wheel',
    name: '混沌之轮',
    description: '一辆被锁链缠绕的战车停在路中央，车上放着一个巨大的转盘，转盘被分为八个扇区，每个扇区上画着不同的图案。锁链已经松动。',
    chapter: 3,
    type: 'random_gamble',
    choices: [
      {
        id: 'spin_once',
        text: '转动一次',
        outcomes: [
          { type: 'gain_gold', value: 60, description: '指针停在"宝藏"，获得 60 金币' },
          { type: 'gain_hp', value: 20, description: '指针停在"生命之泉"，恢复 20 生命' },
          { type: 'gain_card', description: '指针停在"命运之牌"，获得一张卡牌' },
          { type: 'lose_hp', value: 20, description: '指针停在"混沌吞噬"，失去 20 生命' },
          { type: 'lose_gold', value: 40, description: '指针停在"财富窃取"，失去 40 金币' },
        ],
      },
      {
        id: 'break_chain',
        text: '砸开锁链搜刮战车',
        outcomes: [
          { type: 'gain_gold', value: 50, description: '战车中有藏品，获得 50 金币' },
          { type: 'gain_relic', description: '找到一件战车上的遗物' },
          { type: 'lose_hp', value: 15, description: '锁链的反弹伤害了你，失去 15 生命' },
        ],
      },
      {
        id: 'leave_chaos',
        text: '绕开战车',
        outcomes: [
          { type: 'nothing', description: '你选择不招惹混沌' },
        ],
      },
    ],
  },

  // -- random_gamble --
  fate_wheel: {
    id: 'fate_wheel',
    name: '命运转轮',
    description: '一个巨大的木质转轮立在空地上，上面画着各种符号和数字。转轮旁边坐着一个蒙眼的老人。"转动它，看看命运如何安排。"',
    chapter: 3,
    type: 'random_gamble',
    choices: [
      {
        id: 'spin_wheel',
        text: '转动转轮',
        outcomes: [
          { type: 'gain_gold', value: 100, description: '指针停在了"财富"！获得 100 金币' },
          { type: 'gain_hp', value: 25, description: '指针停在了"生命"！恢复 25 生命' },
          { type: 'gain_card', description: '指针停在了"命运"！获得一张卡牌' },
          { type: 'lose_hp', value: 15, description: '指针停在了"代价"！失去 15 生命' },
        ],
      },
      {
        id: 'spin_two',
        text: '转动两次',
        outcomes: [
          { type: 'gain_gold', value: 80, description: '两次都不错，获得 80 金币' },
          { type: 'gain_relic', description: '命运眷顾你，获得一件遗物' },
          { type: 'lose_gold', value: 40, description: '运气不佳，失去 40 金币' },
          { type: 'lose_hp', value: 20, description: '命运的惩罚，失去 20 生命' },
        ],
      },
      {
        id: 'refuse_wheel',
        text: '不转动',
        outcomes: [
          { type: 'nothing', description: '"命运不会等人。"老人说道' },
        ],
      },
    ],
  },

  soul_auction: {
    id: 'soul_auction',
    name: '灵魂拍卖',
    description: '一群戴着面具的身影围坐在一张长桌前，桌上放着一个发光的球体。他们正在进行某种拍卖，而拍卖品——似乎是灵魂。',
    chapter: 3,
    type: 'random_gamble',
    choices: [
      {
        id: 'bid_high',
        text: '出高价竞拍 (80金)',
        requirements: 'gold >= 80',
        outcomes: [
          { type: 'lose_gold', value: 80, description: '花费 80 金币' },
          { type: 'gain_relic', description: '你赢得了拍卖，获得一件强力遗物' },
        ],
      },
      {
        id: 'bid_low',
        text: '低价试水 (30金)',
        requirements: 'gold >= 30',
        outcomes: [
          { type: 'gain_card', description: '你拍下了一个小物件，获得一张卡牌' },
          { type: 'lose_gold', value: 30, description: '花费 30 金币' },
        ],
      },
      {
        id: 'sell_soul',
        text: '卖掉自己的灵魂碎片',
        outcomes: [
          { type: 'gain_gold', value: 70, description: '获得 70 金币' },
          { type: 'lose_max_hp', value: 7, description: '灵魂碎片的缺失令你虚弱，失去 7 最大生命' },
        ],
      },
      {
        id: 'leave_auction',
        text: '离开拍卖会',
        outcomes: [
          { type: 'nothing', description: '面具人们不再看你' },
        ],
      },
    ],
  },
};
