import type { EventDefinition } from './index';

export const GENERATED_EVENTS_3: Record<string, EventDefinition> = {
  // ==================== Legacy map events (used by generateBranchingFloor) ====================
  burst_altar: {
    id: 'burst_altar',
    name: '裂响祭坛',
    description: '一座散发着炽热光芒的祭坛，火焰在顶端跳动。你可以感受到其中蕴含的强大能量。',
    chapter: 2,
    type: 'ancient_shrine',
    choices: [
      { id: 'burst_relic', text: '以生命换取力量', outcomes: [
        { type: 'lose_hp', value: 6, description: '火焰灼伤了你' },
        { type: 'gain_relic', relicId: 'burst_emblem', description: '你获得了爆裂纹章' },
      ]},
      { id: 'burst_card', text: '学习祭坛的技艺', outcomes: [
        { type: 'gain_card', cardId: 'burst_strike', description: '你学会了裂响斩' },
      ]},
      { id: 'choice_3', text: '离开', outcomes: [
        { type: 'nothing', description: '你绕过了祭坛' },
      ]},
    ],
  },
  purging_pool: {
    id: 'purging_pool',
    name: '净手池',
    description: '一池碧绿的水面泛着微光，水中似乎蕴含着某种净化的力量。你可以感受到它能洗去你手中的负担。',
    chapter: 2,
    type: 'ancient_shrine',
    choices: [
      { id: 'remove_strike', text: '洗去基础斩击', outcomes: [
        { type: 'gain_card', cardId: 'strike', description: '你将一张斩击投入池中净化' },
      ]},
      { id: 'remove_defend', text: '洗去基础防御', outcomes: [
        { type: 'gain_card', cardId: 'defend', description: '你将一张防御投入池中净化' },
      ]},
      { id: 'choice_3', text: '离开', outcomes: [
        { type: 'nothing', description: '你没有碰池水' },
      ]},
    ],
  },
  stillness_shrine: {
    id: 'stillness_shrine',
    name: '静谧神龛',
    description: '一座隐藏在林间的古老神龛，周围的一切都异常安静。神龛上刻着一行字："静者得之。"',
    chapter: 1,
    type: 'ancient_shrine',
    choices: [
      { id: 'choice_1', text: '静坐冥想', outcomes: [
        { type: 'gain_hp', value: 12, description: '宁静治愈了你' },
      ]},
      { id: 'choice_2', text: '献上金币', outcomes: [
        { type: 'lose_gold', value: 25, description: '你献上了 25 金币' },
        { type: 'gain_relic', relicId: 'wind_chime', description: '神龛赐予了你一件遗物' },
      ]},
      { id: 'choice_3', text: '离开', outcomes: [
        { type: 'nothing', description: '你安静地离开了' },
      ]},
    ],
  },
  // ==================== Chapter 1: risk_reward (4), curse_trade (3), merchant (3), memory (3), corruption (2), strange_machine (2), ancient_shrine (1), random_gamble (2) = 20 ====================

  abandoned_well: {
    id: 'abandoned_well',
    name: '废弃的深井',
    description: '一口古老的石井矗立在废墟中央，井沿刻满了已经模糊不清的符文。井底深处传来微弱的光芒，仿佛有什么东西在召唤你。空气中弥漫着潮湿的泥土气息。',
    chapter: 1,
    type: 'risk_reward',
    choices: [
      {
        id: 'choice_1',
        text: '将绳索系在腰间，缓缓下探',
        outcomes: [
          { type: 'gain_relic', relicId: 'twin_core', description: '在井底发现一枚古老的铜质护符' },
          { type: 'lose_hp', value: 8, description: '攀爬时不慎跌落，损失 8 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '将水桶垂入井中打水',
        outcomes: [
          { type: 'gain_hp', value: 10, description: '井水甘甜清冽，恢复 10 点生命' },
          { type: 'nothing', description: '只有普通的井水，别无他物' },
        ],
      },
      {
        id: 'choice_3',
        text: '在井口静坐冥想，感受井中的气息',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '内心平静，获得 2 点势能' },
          { type: 'nothing', description: '周围一片寂静，没有回应' },
        ],
      },
    ],
  },

  rusted_armory: {
    id: 'rusted_armory',
    name: '锈蚀的兵器库',
    description: '残破的铁门半掩着，里面排列着早已锈迹斑斑的刀剑。这些曾经锋利的武器如今只是废铁，但角落里似乎有一件被布包裹的物品，上面覆着厚厚的灰尘。',
    chapter: 1,
    type: 'risk_reward',
    choices: [
      {
        id: 'choice_1',
        text: '仔细翻找每一件武器',
        outcomes: [
          { type: 'gain_gold', value: 15, description: '在刀柄中发现藏匿的金币，获得 15 金币' },
          { type: 'lose_hp', value: 5, description: '被锈蚀的刀刃割伤，损失 5 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '直接去拿那个被布包裹的物品',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_max_hp', value: 3, description: '包裹中暗藏毒咒，最大生命值降低 3' },
        ],
      },
      {
        id: 'choice_3',
        text: '不碰任何东西，记下位置后离开',
        outcomes: [
          { type: 'gain_gold', value: 5, description: '随手捡起地上散落的几枚铜币，获得 5 金币' },
        ],
      },
    ],
  },

  crumbling_bridge_b3: {
    id: 'crumbling_bridge_b3',
    name: '崩塌的石桥',
    description: '一座横跨深渊的石桥已经断裂大半，剩余的部分也布满裂缝。桥对面隐约可见一座被迷雾笼罩的建筑。深渊中传来阵阵寒风，带着低沉的呜咽声。',
    chapter: 1,
    type: 'risk_reward',
    choices: [
      {
        id: 'choice_1',
        text: '小心翼翼地走过断桥',
        outcomes: [
          { type: 'gain_gold', value: 20, description: '到达对岸后发现一堆被遗忘的财宝，获得 20 金币' },
          { type: 'lose_hp', value: 15, description: '桥面崩塌，你跌入深渊，损失 15 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '在桥边搜寻其他通路',
        outcomes: [
          { type: 'gain_gold', value: 5, description: '在崖壁上找到几枚嵌入岩石的金币，获得 5 金币' },
          { type: 'nothing', description: '没有找到其他路，只能原路返回' },
        ],
      },
      {
        id: 'choice_3',
        text: '向深渊投掷物品试探',
        outcomes: [
          { type: 'gain_momentum', value: 1, description: '深渊的回声似乎蕴含某种规律，获得 1 点势能' },
          { type: 'nothing', description: '物品消失在无尽的黑暗中' },
        ],
      },
    ],
  },

  collapsing_watchtower: {
    id: 'collapsing_watchtower',
    name: '即将坍塌的瞭望塔',
    description: '一座倾斜的石塔在风中摇摇欲坠，塔顶的火盆早已熄灭。透过碎裂的窗口可以看到远处绵延的废墟。塔身的石块不时掉落，地面散落着碎石和枯骨。',
    chapter: 1,
    type: 'risk_reward',
    choices: [
      {
        id: 'choice_1',
        text: '冒险登上塔顶搜寻',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_hp', value: 10, description: '塔身摇晃导致你从楼梯摔落，损失 10 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '在塔底的废墟中翻找',
        outcomes: [
          { type: 'gain_gold', value: 12, description: '找到守塔人遗落的钱袋，获得 12 金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '观察塔身结构，判断是否有价值',
        outcomes: [
          { type: 'gain_momentum', value: 1, description: '从建筑结构中获得灵感，获得 1 点势能' },
          { type: 'nothing', description: '这不过是一座即将倒塌的废塔' },
        ],
      },
    ],
  },

  cursed_merchant_stall: {
    id: 'cursed_merchant_stall',
    name: '被诅咒的货摊',
    description: '一个佝偻的身影守在破旧的货摊后，兜帽下只露出苍白的下巴。摊位上摆满了诡异的物品，每一件都散发着令人不安的气息。那身影用沙哑的声音招呼着你。',
    chapter: 1,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '购买那个发出微光的瓶子',
        outcomes: [
          { type: 'gain_hp', value: 15, description: '瓶中液体恢复 15 点生命' },
          { type: 'lose_max_hp', value: 3, description: '液体带有腐蚀性，最大生命值降低 3' },
        ],
      },
      {
        id: 'choice_2',
        text: '询问那把刻有符文的匕首',
        outcomes: [
          { type: 'lose_gold', value: 20, description: '花费 20 金币购买匕首' },
          { type: 'gain_card', cardId: 'curse_decay', description: '获得一张诅咒匕首卡牌' },
        ],
      },
      {
        id: 'choice_3',
        text: '转身离开，不理会他的招揽',
        outcomes: [
          { type: 'nothing', description: '你头也不回地走了' },
          { type: 'lose_hp', value: 3, description: '身后传来低沉的诅咒声，损失 3 点生命' },
        ],
      },
    ],
  },

  whispering_totem: {
    id: 'whispering_totem',
    name: '低语图腾',
    description: '一根用不明木材雕刻的图腾柱插在路旁的泥土中，图腾上的面孔不断变换着表情。你靠近时，图腾发出细碎的低语声，似乎在诉说着什么秘密。',
    chapter: 1,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '将耳朵贴近图腾聆听',
        outcomes: [
          { type: 'gain_card', cardId: 'curse_blood_mark', description: '低语中蕴含的古老知识化作一张卡牌' },
          { type: 'lose_hp', value: 6, description: '低语声刺痛了你的神经，损失 6 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '用匕首在图腾上刻下自己的记号',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '图腾的力量暂时依附于你，获得 2 点势能' },
          { type: 'lose_max_hp', value: 2, description: '图腾的诅咒反噬，最大生命值降低 2' },
        ],
      },
      {
        id: 'choice_3',
        text: '向图腾供奉金币',
        outcomes: [
          { type: 'gain_hp', value: 10, description: '图腾发出温暖的光芒，恢复 10 点生命' },
          { type: 'lose_gold', value: 8, description: '花费 8 金币作为供品' },
        ],
      },
    ],
  },

  shadow_bargain: {
    id: 'shadow_bargain',
    name: '暗影交易',
    description: '你的影子突然脱离了地面，化作一个独立的存在。它用你自己的声音说话，提议用你的某些东西来换取力量。影子的眼睛闪烁着血红色的光芒。',
    chapter: 1,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '用你的一部分听力换取力量',
        outcomes: [
          { type: 'gain_card', cardId: 'curse_darkness', description: '影子赐予你一张强大的暗影卡牌' },
          { type: 'lose_max_hp', value: 3, description: '听觉变得模糊，最大生命值降低 3' },
        ],
      },
      {
        id: 'choice_2',
        text: '用你的记忆碎片换取金币',
        outcomes: [
          { type: 'gain_gold', value: 25, description: '影子留下一堆金币后消散，获得 25 金币' },
          { type: 'lose_hp', value: 8, description: '失去记忆的痛苦令你损失 8 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '拒绝交易，重新凝聚你的影子',
        outcomes: [
          { type: 'gain_hp', value: 5, description: '影子回归后反而增强了你的生命力，恢复 5 点生命' },
          { type: 'nothing', description: '影子不甘地融入了你的脚下' },
        ],
      },
    ],
  },

  wandering_merchant: {
    id: 'wandering_merchant',
    name: '流浪商人',
    description: '一个衣衫褴褛的商人推着破旧的独轮车缓缓走来。车上堆满了各种杂物，从残破的书籍到生锈的器具应有尽有。他的眼中闪烁着精明的光芒。',
    chapter: 1,
    type: 'merchant',
    choices: [
      {
        id: 'choice_1',
        text: '查看他的药材',
        outcomes: [
          { type: 'gain_hp', value: 8, description: '购买草药恢复 8 点生命' },
          { type: 'lose_gold', value: 10, description: '花费 10 金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '询问他是否有好货',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_gold', value: 25, description: '花费 25 金币购入' },
        ],
      },
      {
        id: 'choice_3',
        text: '和他讨价还价',
        outcomes: [
          { type: 'lose_gold', value: 5, description: '花费 5 金币买下一个小物件' },
          { type: 'gain_gold', value: 8, description: '小物件竟值 8 金币，转手获利' },
        ],
      },
    ],
  },

  black_market_peddler: {
    id: 'black_market_peddler',
    name: '黑市小贩',
    description: '一个戴着面具的小贩从暗巷中走出，他的背包里散发着各种奇异的气味。他低声说自己的货物都是从废墟深处挖出来的，每一件都来之不易。',
    chapter: 1,
    type: 'merchant',
    choices: [
      {
        id: 'choice_1',
        text: '购买一瓶神秘药剂',
        outcomes: [
          { type: 'gain_hp', value: 12, description: '药剂入口即化，恢复 12 点生命' },
          { type: 'lose_gold', value: 15, description: '花费 15 金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '购买一张封印的卷轴',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_gold', value: 20, description: '花费 20 金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '什么都不买，直接离开',
        outcomes: [
          { type: 'nothing', description: '小贩耸了耸肩，消失在暗巷中' },
        ],
      },
    ],
  },

  relic_broker: {
    id: 'relic_broker',
    name: '遗物掮客',
    description: '一个衣着考究的老者坐在路边的石块上，面前摆放着几件看似普通的物品。但当你走近时，能感受到每件物品都散发着微弱的能量波动。',
    chapter: 1,
    type: 'merchant',
    choices: [
      {
        id: 'choice_1',
        text: '用金币购买他的遗物',
        outcomes: [
          { type: 'gain_relic', relicId: 'harmony_emblem', description: '获得一件古老的遗物' },
          { type: 'lose_gold', value: 30, description: '花费 30 金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '询问他关于这些物品的来历',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '他的故事令你获得 2 点势能' },
          { type: 'gain_gold', value: 3, description: '他随手给了你几枚小费，获得 3 金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '提议用你的知识交换他的物品',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'nothing', description: '他仔细听完后不置可否' },
        ],
      },
    ],
  },

  echoing_hall_b3: {
    id: 'echoing_hall_b3',
    name: '回声大厅',
    description: '巨大的石柱支撑着残破的穹顶，你的脚步声在空旷的大厅中不断回荡。墙壁上的壁画描绘着一个已经消亡的文明，画中人物的眼神仿佛在追随你的身影。',
    chapter: 1,
    type: 'memory',
    choices: [
      {
        id: 'choice_1',
        text: '仔细观察壁画的内容',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '壁画中蕴含的智慧令你获得 2 点势能' },
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '在大厅中央闭目聆听回声',
        outcomes: [
          { type: 'gain_hp', value: 6, description: '回声中夹杂着治愈之力，恢复 6 点生命' },
          { type: 'lose_hp', value: 4, description: '回声变得刺耳，损失 4 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '不做停留，快速穿过大厅',
        outcomes: [
          { type: 'gain_gold', value: 3, description: '在地面上发现几枚散落的硬币，获得 3 金币' },
        ],
      },
    ],
  },

  ruined_inscription: {
    id: 'ruined_inscription',
    name: '残破的碑文',
    description: '一块巨大的石碑倒在路旁，碑面上刻满了古老的文字。文字虽然已经模糊，但仍能辨认出部分内容。碑文似乎记载着某个失落文明的历史。',
    chapter: 1,
    type: 'memory',
    choices: [
      {
        id: 'choice_1',
        text: '逐字逐句地辨认碑文',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '理解了碑文的含义，获得 2 点势能' },
          { type: 'gain_hp', value: 5, description: '碑文中蕴含的古老力量恢复了 5 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '用工具将碑文拓印下来',
        outcomes: [
          { type: 'gain_gold', value: 10, description: '拓印品在未来可能卖出好价钱，获得 10 金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '尝试移动石碑',
        outcomes: [
          { type: 'gain_gold', value: 8, description: '石碑下藏着几枚金币，获得 8 金币' },
          { type: 'lose_hp', value: 5, description: '石碑太重砸伤了你的脚，损失 5 点生命' },
        ],
      },
    ],
  },

  ancestral_portrait: {
    id: 'ancestral_portrait',
    name: '先祖画像',
    description: '一幅被遗忘的画像挂在残破的墙壁上，画中的人物身着华服，面容威严。画像的眼珠似乎会随着你的移动而转动，画框下方刻着一行小字。',
    chapter: 1,
    type: 'memory',
    choices: [
      {
        id: 'choice_1',
        text: '仔细研究画像下方的文字',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'gain_momentum', value: 1, description: '获得 1 点势能' },
        ],
      },
      {
        id: 'choice_2',
        text: '尝试与画中人物对话',
        outcomes: [
          { type: 'gain_hp', value: 8, description: '画中人物的祝福恢复了 8 点生命' },
          { type: 'lose_hp', value: 3, description: '画像中的诅咒令你损失 3 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '将画像摘下来带走',
        outcomes: [
          { type: 'gain_gold', value: 15, description: '画像在收藏家眼中价值不菲，获得 15 金币' },
        ],
      },
    ],
  },

  strange_wellspring: {
    id: 'strange_wellspring',
    name: '奇异的泉眼',
    description: '岩壁间涌出一股清泉，但水的颜色时而清澈时而浑浊。泉眼周围的石壁上生长着发光的苔藓，空气中弥漫着一种说不清的甜腻气味。',
    chapter: 1,
    type: 'corruption',
    choices: [
      {
        id: 'choice_1',
        text: '饮用清澈的泉水',
        outcomes: [
          { type: 'gain_hp', value: 10, description: '甘甜的泉水恢复了 10 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '触碰发光的苔藓',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_max_hp', value: 2, description: '苔藓的毒素侵入体内，最大生命值降低 2' },
        ],
      },
      {
        id: 'choice_3',
        text: '收集泉水带走',
        outcomes: [
          { type: 'gain_gold', value: 8, description: '将泉水卖给路过的旅人，获得 8 金币' },
          { type: 'lose_hp', value: 5, description: '容器泄漏，被腐蚀性液体灼伤，损失 5 点生命' },
        ],
      },
    ],
  },

  blighted_tree: {
    id: 'blighted_tree',
    name: '枯萎的巨树',
    description: '一棵巨大的枯树矗立在荒原上，树干上布满了诡异的黑色纹路。虽然已经枯死，但树根深处似乎仍有某种力量在涌动。树下散落着一些奇怪的果实。',
    chapter: 1,
    type: 'corruption',
    choices: [
      {
        id: 'choice_1',
        text: '食用树下的果实',
        outcomes: [
          { type: 'gain_hp', value: 12, description: '果实虽然怪异但味道甜美，恢复 12 点生命' },
          { type: 'lose_max_hp', value: 2, description: '果实中混杂着腐化之力，最大生命值降低 2' },
        ],
      },
      {
        id: 'choice_2',
        text: '用匕首割开树干',
        outcomes: [
          { type: 'gain_gold', value: 10, description: '树干中流出的树脂价值不菲，获得 10 金币' },
          { type: 'lose_hp', value: 5, description: '树液溅到皮肤上造成灼伤，损失 5 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '靠着树干休息片刻',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '感受到大地的脉动，获得 2 点势能' },
        ],
      },
    ],
  },

  forgotten_workshop: {
    id: 'forgotten_workshop',
    name: '遗忘的工坊',
    description: '一间半坍塌的石室内摆满了各种奇怪的机关和工具。一台巨大的机械装置占据了房间的大半空间，虽然已经停止运转，但齿轮上仍残留着微弱的能量波动。',
    chapter: 1,
    type: 'strange_machine',
    choices: [
      {
        id: 'choice_1',
        text: '尝试启动那台机械装置',
        outcomes: [
          { type: 'gain_relic', relicId: 'ward_banner', description: '装置运转后吐出一件古代遗物' },
          { type: 'lose_hp', value: 10, description: '装置失控，齿轮碎片飞溅，损失 10 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '在工坊中搜寻可用的零件',
        outcomes: [
          { type: 'gain_gold', value: 12, description: '找到一些可以出售的精密零件，获得 12 金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '研究机械装置的构造',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '从装置的设计中领悟到新的知识，获得 2 点势能' },
        ],
      },
    ],
  },

  clockwork_oracle: {
    id: 'clockwork_oracle',
    name: '发条预言机',
    description: '一台精巧的发条装置被放置在石台上，它的齿轮仍在缓慢转动。装置的中央有一只玻璃眼球，似乎在注视着什么。旁边的铭牌上写着"投入金币，获取命运"。',
    chapter: 1,
    type: 'strange_machine',
    choices: [
      {
        id: 'choice_1',
        text: '投入一枚金币',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_gold', value: 5, description: '花费 5 金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '投入五枚金币',
        outcomes: [
          { type: 'gain_hp', value: 15, description: '装置释放出治愈之光，恢复 15 点生命' },
          { type: 'lose_gold', value: 10, description: '花费 10 金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '不投入金币，直接研究装置',
        outcomes: [
          { type: 'gain_momentum', value: 1, description: '理解了发条装置的运作原理，获得 1 点势能' },
          { type: 'nothing', description: '装置没有任何反应' },
        ],
      },
    ],
  },

  forgotten_altar: {
    id: 'forgotten_altar',
    name: '被遗忘的祭坛',
    description: '一座石质祭坛被藤蔓和苔藓覆盖，坛面上残留着暗红色的痕迹。祭坛前的石阶已经碎裂，但你仍能感受到一股古老的意志从石缝中渗出。',
    chapter: 1,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'choice_1',
        text: '将仅有的口粮摆上祭坛',
        outcomes: [
          { type: 'gain_hp', value: 12, description: '一道温暖的光芒笼罩全身，恢复 12 点生命' },
          { type: 'lose_gold', value: 5, description: '身上的金币莫名消失了 5 枚' },
        ],
      },
      {
        id: 'choice_2',
        text: '在祭坛前低声祈祷',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '获得 3 点势能，意志更加坚定' },
          { type: 'nothing', description: '祭坛没有任何回应' },
        ],
      },
      {
        id: 'choice_3',
        text: '无视祭坛，继续赶路',
        outcomes: [
          { type: 'nothing', description: '你选择不去打扰这沉睡的意志' },
        ],
      },
    ],
  },

  shadowy_crossroad: {
    id: 'shadowy_crossroad',
    name: '暗影十字路口',
    description: '三条道路在你面前交汇，每条路都被浓重的阴影笼罩。路口中央立着一块刻有古老文字的石碑，似乎在指引着什么。空气中弥漫着腐败的气味。',
    chapter: 1,
    type: 'random_gamble',
    choices: [
      {
        id: 'choice_1',
        text: '选择左边的路',
        outcomes: [
          { type: 'gain_gold', value: 15, description: '路上发现一个被遗弃的钱袋，获得 15 金币' },
          { type: 'lose_hp', value: 8, description: '路边的陷阱触发，损失 8 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '选择右边的路',
        outcomes: [
          { type: 'gain_hp', value: 10, description: '路边有一处隐蔽的温泉，恢复 10 点生命' },
          { type: 'nothing', description: '一路上平安无事' },
        ],
      },
      {
        id: 'choice_3',
        text: '选择前方的路',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_hp', value: 5, description: '被潜伏的怪物偷袭，损失 5 点生命' },
        ],
      },
      {
        id: 'choice_4',
        text: '解读石碑上的文字后再决定',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '石碑的智慧令你获得 2 点势能' },
          { type: 'gain_gold', value: 5, description: '石碑下藏着几枚金币，获得 5 金币' },
        ],
      },
    ],
  },

  coin_toss_gate: {
    id: 'coin_toss_gate',
    name: '硬币之门',
    description: '一扇巨大的石门挡住了去路，门上嵌着一枚巨大的铜质硬币。石门两侧各有一个凹槽，分别刻着"正"和"反"的古文。门缝中透出微弱的光芒。',
    chapter: 1,
    type: 'random_gamble',
    choices: [
      {
        id: 'choice_1',
        text: '将硬币投入"正"的凹槽',
        outcomes: [
          { type: 'gain_gold', value: 18, description: '石门开启，门后是一间满是金币的密室，获得 18 金币' },
          { type: 'lose_hp', value: 10, description: '石门开启时触发了防御机关，损失 10 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '将硬币投入"反"的凹槽',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'nothing', description: '石门纹丝不动，什么也没有发生' },
        ],
      },
      {
        id: 'choice_3',
        text: '尝试强行推开石门',
        outcomes: [
          { type: 'gain_gold', value: 8, description: '石门被推开一条缝，你看到了散落的金币，获得 8 金币' },
          { type: 'lose_hp', value: 8, description: '石门的力量反震，损失 8 点生命' },
        ],
      },
    ],
  },

  // ==================== Chapter 2: risk_reward (3), curse_trade (3), merchant (2), memory (3), corruption (3), strange_machine (3), ancient_shrine (2), random_gamble (1) = 20 ====================

  abyssal_chasm: {
    id: 'abyssal_chasm',
    name: '深渊裂隙',
    description: '大地在你脚下裂开一道巨大的缝隙，深不见底的黑暗中偶尔闪烁着诡异的蓝光。裂隙边缘刻满了古老的封印符文，大部分已经黯淡无光。',
    chapter: 2,
    type: 'corruption',
    choices: [
      {
        id: 'choice_1',
        text: '沿着裂隙边缘小心探索',
        outcomes: [
          { type: 'gain_relic', relicId: 'flare_banner', description: '在裂隙边缘发现一件被封印的古代遗物' },
          { type: 'lose_hp', value: 12, description: '脚下的岩石碎裂，险些坠入深渊，损失 12 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '试图修复那些封印符文',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '修复符文的过程让你获得 3 点势能' },
          { type: 'lose_max_hp', value: 4, description: '封印的反噬力伤害了你的身体，最大生命值降低 4' },
        ],
      },
      {
        id: 'choice_3',
        text: '从裂隙中汲取黑暗之力',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_hp', value: 8, description: '黑暗侵蚀了你的身体，损失 8 点生命' },
          { type: 'lose_max_hp', value: 2, description: '最大生命值降低 2' },
        ],
      },
    ],
  },

  corruption_well: {
    id: 'corruption_well',
    name: '腐蚀之泉',
    description: '一座喷涌着黑色液体的泉眼从地底涌出，液体散发出刺鼻的硫磺气味。泉眼周围的土地已经完全腐化，长满了扭曲的黑色植物。但液体中隐约闪烁着金色的光芒。',
    chapter: 2,
    type: 'corruption',
    choices: [
      {
        id: 'choice_1',
        text: '尝试从液体中捞取那些金色物质',
        outcomes: [
          { type: 'gain_gold', value: 35, description: '捞到了不少含金的物质，获得 35 金币' },
          { type: 'lose_hp', value: 15, description: '黑色液体灼伤了手臂，损失 15 点生命' },
          { type: 'lose_max_hp', value: 3, description: '腐蚀性液体侵蚀了身体，最大生命值降低 3' },
        ],
      },
      {
        id: 'choice_2',
        text: '将黑色液体收集在容器中',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_hp', value: 8, description: '收集过程中液体溅到身上，损失 8 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '保持距离，观察液体的流向',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '理解了腐蚀的本质，获得 2 点势能' },
        ],
      },
    ],
  },

  withered_garden: {
    id: 'withered_garden',
    name: '枯萎的花园',
    description: '一片曾经繁茂的花园如今只剩下枯萎的枝干和凋零的花朵。但花园中央有一株散发着幽光的植物仍在顽强生长，它的根系深入地面，汲取着某种看不见的养分。',
    chapter: 2,
    type: 'corruption',
    choices: [
      {
        id: 'choice_1',
        text: '采摘那株发光植物的叶片',
        outcomes: [
          { type: 'gain_hp', value: 18, description: '叶片入药后恢复了 18 点生命' },
          { type: 'lose_max_hp', value: 2, description: '植物的根系扎入了你的手指，最大生命值降低 2' },
        ],
      },
      {
        id: 'choice_2',
        text: '挖掘植物的根系',
        outcomes: [
          { type: 'gain_gold', value: 25, description: '根系中包裹着古老的金币，获得 25 金币' },
          { type: 'lose_hp', value: 10, description: '根系释放出毒素，损失 10 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '坐在花园中感受生命力的流动',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '感受到生命的顽强，获得 3 点势能' },
        ],
      },
    ],
  },

  cursed_library: {
    id: 'cursed_library',
    name: '被诅咒的藏书室',
    description: '无数书架在黑暗中延伸，书脊上的文字散发着幽绿的微光。空气中弥漫着陈旧纸张的气味，偶尔有书页自动翻动的沙沙声。一个声音在你脑海中低语，邀请你翻开那些禁忌之书。',
    chapter: 2,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '翻开那本发出最强光芒的书',
        outcomes: [
          { type: 'gain_card', cardId: 'curse_blood_mark', description: '书中记载的古老咒语化作一张强大的卡牌' },
          { type: 'lose_hp', value: 10, description: '知识的诅咒侵袭你的意识，损失 10 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '只翻阅那些没有发光的书',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '平静的知识令你获得 2 点势能' },
          { type: 'gain_gold', value: 8, description: '书中夹着几枚古老的金币，获得 8 金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '尝试与脑海中的声音对话',
        outcomes: [
          { type: 'gain_hp', value: 15, description: '声音赐予你治愈之力，恢复 15 点生命' },
          { type: 'lose_max_hp', value: 5, description: '对话的代价是你的生命力，最大生命值降低 5' },
        ],
      },
    ],
  },

  blood_merchant: {
    id: 'blood_merchant',
    name: '血之商人',
    description: '一个面色苍白的商人坐在血红色的帐篷前，他的眼睛是纯黑色的，没有一丝白色。摊位上摆放着各种用血液浸泡过的物品，每一件都散发着令人作呕的气息。',
    chapter: 2,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '购买那瓶暗红色的药剂',
        outcomes: [
          { type: 'gain_hp', value: 25, description: '药剂蕴含强大的治愈力，恢复 25 点生命' },
          { type: 'lose_max_hp', value: 3, description: '药剂的副作用，最大生命值降低 3' },
        ],
      },
      {
        id: 'choice_2',
        text: '用你的血液交换他的知识',
        outcomes: [
          { type: 'gain_card', cardId: 'curse_blood_mark', description: '获得了失传的禁忌知识，化作一张卡牌' },
          { type: 'lose_max_hp', value: 6, description: '大量失血，最大生命值降低 6' },
        ],
      },
      {
        id: 'choice_3',
        text: '拒绝交易，转身就走',
        outcomes: [
          { type: 'nothing', description: '商人发出低沉的笑声，没有阻拦你' },
        ],
      },
    ],
  },

  soul_price_tag: {
    id: 'soul_price_tag',
    name: '灵魂价签',
    description: '一件看似普通的斗篷漂浮在空中，斗篷的领口处别着一张价签，上面写着"一个灵魂"。斗篷散发着柔和的光芒，仿佛在等待某人穿上它。',
    chapter: 2,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '穿上这件斗篷',
        outcomes: [
          { type: 'gain_relic', relicId: 'vajra', description: '斗篷化作一件强大的灵魂遗物' },
          { type: 'lose_max_hp', value: 8, description: '灵魂被斗篷吞噬了一部分，最大生命值降低 8' },
        ],
      },
      {
        id: 'choice_2',
        text: '撕下价签',
        outcomes: [
          { type: 'gain_gold', value: 20, description: '价签化作金币，获得 20 金币' },
          { type: 'lose_hp', value: 12, description: '斗篷发出尖锐的哀鸣，损失 12 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '用其他物品替代灵魂支付',
        outcomes: [
          { type: 'gain_card', cardId: 'curse_blood_mark', description: '斗篷接受替代品，化作一张卡牌' },
          { type: 'lose_gold', value: 15, description: '花费 15 金币作为替代品' },
        ],
      },
    ],
  },

  phantom_market: {
    id: 'phantom_market',
    name: '幻影市集',
    description: '虚幻的摊位在薄雾中若隐若现，半透明的商人们吆喝着各种匪夷所思的商品。这里的一切都像是旧日的残影，却又真实得令人不安。你感到口袋里的金币在微微震动。',
    chapter: 2,
    type: 'merchant',
    choices: [
      {
        id: 'choice_1',
        text: '购买那个半透明的护甲',
        outcomes: [
          { type: 'gain_hp', value: 20, description: '护甲的力量保护了你，相当于恢复 20 点生命' },
          { type: 'lose_gold', value: 30, description: '花费 30 金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '向幻影商人出售你的血液',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '商人用金币换取了你的血液，获得 40 金币' },
          { type: 'lose_max_hp', value: 5, description: '失血过多，最大生命值降低 5' },
        ],
      },
      {
        id: 'choice_3',
        text: '只在市集中闲逛',
        outcomes: [
          { type: 'gain_gold', value: 5, description: '在地面上捡到几枚被遗落的硬币，获得 5 金币' },
          { type: 'nothing', description: '商人们对你视若无睹' },
        ],
      },
    ],
  },

  relic_appraiser: {
    id: 'relic_appraiser',
    name: '遗物鉴定师',
    description: '一个戴着单片眼镜的老妇人坐在堆满古物的桌子后。她的手指轻轻抚过每一件物品，低声念叨着它们的价值。她的桌角放着一盏永不熄灭的油灯。',
    chapter: 2,
    type: 'merchant',
    choices: [
      {
        id: 'choice_1',
        text: '请她鉴定你身上的物品',
        outcomes: [
          { type: 'gain_gold', value: 20, description: '她指出你的物品中有值钱的部分，获得 20 金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '向她购买一瓶鉴定药水',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_gold', value: 18, description: '花费 18 金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '请求她修复一件损坏的遗物',
        outcomes: [
          { type: 'gain_relic', relicId: 'anchor', description: '她成功修复了你的遗物' },
          { type: 'lose_gold', value: 25, description: '花费 25 金币作为报酬' },
        ],
      },
    ],
  },

  shattered_throne: {
    id: 'shattered_throne',
    name: '碎裂的王座',
    description: '一座用黑色大理石雕琢的王座已经碎成数块，但残骸中仍散发着威严的气息。王座背后的墙壁上刻着一幅巨大的壁画，描绘着一位帝王的加冕典礼。',
    chapter: 2,
    type: 'memory',
    choices: [
      {
        id: 'choice_1',
        text: '坐上碎裂的王座',
        outcomes: [
          { type: 'gain_momentum', value: 4, description: '帝王的残余意志灌注全身，获得 4 点势能' },
          { type: 'lose_hp', value: 8, description: '碎石割伤了身体，损失 8 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '研究壁画中的加冕仪式',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'gain_momentum', value: 2, description: '获得 2 点势能' },
        ],
      },
      {
        id: 'choice_3',
        text: '在王座残骸中搜寻珠宝',
        outcomes: [
          { type: 'gain_gold', value: 25, description: '找到镶嵌在王座中的宝石，获得 25 金币' },
          { type: 'lose_hp', value: 5, description: '被碎石中的符文灼伤，损失 5 点生命' },
        ],
      },
    ],
  },

  mirror_lake: {
    id: 'mirror_lake',
    name: '镜湖幻影',
    description: '一片死寂的湖泊如镜子般平滑，湖面倒映着的不是天空，而是另一个世界的景象。湖边散落着一些奇怪的石雕，每一座都呈现出扭曲的姿态。',
    chapter: 2,
    type: 'memory',
    choices: [
      {
        id: 'choice_1',
        text: '凝视湖面的倒影',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_hp', value: 10, description: '精神受到冲击，损失 10 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '触摸那些扭曲的石雕',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '石雕中蕴含的远古记忆令你获得 3 点势能' },
          { type: 'lose_max_hp', value: 2, description: '石雕的诅咒侵蚀了你的身体，最大生命值降低 2' },
        ],
      },
      {
        id: 'choice_3',
        text: '向湖中投入一枚金币',
        outcomes: [
          { type: 'gain_hp', value: 12, description: '湖水泛起涟漪，治愈之力涌上岸来，恢复 12 点生命' },
          { type: 'lose_gold', value: 5, description: '花费 5 金币' },
        ],
      },
      {
        id: 'choice_4',
        text: '安静地坐在湖边',
        outcomes: [
          { type: 'gain_hp', value: 8, description: '湖边的宁静治愈了你的身心，恢复 8 点生命' },
          { type: 'gain_momentum', value: 1, description: '获得 1 点势能' },
        ],
      },
    ],
  },

  ancient_memory_stone: {
    id: 'ancient_memory_stone',
    name: '远古记忆石',
    description: '一块散发着柔和蓝光的石头嵌在墙壁中，石头表面不断浮现着各种画面——战争、和平、欢笑、泪水。这些都是已经消逝的文明留下的记忆碎片。',
    chapter: 2,
    type: 'memory',
    choices: [
      {
        id: 'choice_1',
        text: '将手按在石头上接收记忆',
        outcomes: [
          { type: 'gain_momentum', value: 4, description: '远古的记忆令你获得了深刻的领悟，获得 4 点势能' },
          { type: 'lose_hp', value: 8, description: '记忆的冲击令你头痛欲裂，损失 8 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '将石头从墙壁中取出',
        outcomes: [
          { type: 'gain_relic', relicId: 'wind_chime', description: '石头化作一件记忆遗物' },
          { type: 'lose_hp', value: 12, description: '取出石头时遭到记忆反噬，损失 12 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '只观察画面，不触碰石头',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'gain_momentum', value: 1, description: '获得 1 点势能' },
        ],
      },
    ],
  },

  soul_forge: {
    id: 'soul_forge',
    name: '灵魂熔炉',
    description: '一座巨大的铁炉矗立在洞穴深处，炉中的火焰呈现出不自然的蓝色。铁炉周围散落着各种锻造工具和金属碎片，空气中弥漫着灼热的气息和某种难以名状的悲伤。',
    chapter: 2,
    type: 'strange_machine',
    choices: [
      {
        id: 'choice_1',
        text: '将自己的血液滴入熔炉',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_max_hp', value: 4, description: '生命力被熔炉吞噬，最大生命值降低 4' },
        ],
      },
      {
        id: 'choice_2',
        text: '投入一枚金币作为祭品',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '熔炉吐出更多的金币，获得 30 金币' },
          { type: 'lose_gold', value: 10, description: '花费 10 金币作为祭品' },
        ],
      },
      {
        id: 'choice_3',
        text: '用熔炉锻造一件护甲',
        outcomes: [
          { type: 'gain_hp', value: 15, description: '锻造出的护甲保护了你，相当于恢复 15 点生命' },
          { type: 'lose_gold', value: 15, description: '花费 15 金币购买锻造材料' },
        ],
      },
      {
        id: 'choice_4',
        text: '只是观察熔炉的运作',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '从锻造过程中获得灵感，获得 2 点势能' },
        ],
      },
    ],
  },

  time_broken_clock: {
    id: 'time_broken_clock',
    name: '时间碎裂的钟塔',
    description: '一座倾斜的钟塔矗立在废墟之上，塔顶的大钟已经碎裂，但碎片悬浮在空中，仿佛时间在这里已经停止。每一块碎片都映射着不同时刻的景象。',
    chapter: 2,
    type: 'strange_machine',
    choices: [
      {
        id: 'choice_1',
        text: '触碰一块悬浮的钟表碎片',
        outcomes: [
          { type: 'gain_hp', value: 15, description: '碎片中的时间之力治愈了你的伤痛，恢复 15 点生命' },
          { type: 'lose_hp', value: 10, description: '时间的冲击令你衰老了几分，损失 10 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '试图将碎片重新拼合',
        outcomes: [
          { type: 'gain_relic', relicId: 'tactical_gloves', description: '碎片拼合后化作一件时间遗物' },
          { type: 'lose_max_hp', value: 4, description: '拼合过程消耗了你的生命力，最大生命值降低 4' },
        ],
      },
      {
        id: 'choice_3',
        text: '在碎片间寻找有用的映像',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'gain_momentum', value: 2, description: '获得了 2 点势能' },
        ],
      },
    ],
  },

  resonance_engine: {
    id: 'resonance_engine',
    name: '共鸣引擎',
    description: '一台由水晶和金属构成的装置悬浮在半空中，它发出持续的低频嗡鸣声。每当周围有声响时，装置就会发出更强烈的光芒，仿佛在与声音产生共鸣。',
    chapter: 2,
    type: 'strange_machine',
    choices: [
      {
        id: 'choice_1',
        text: '对装置发出声音',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_hp', value: 6, description: '共鸣的冲击波伤害了你的耳朵，损失 6 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '尝试关闭装置',
        outcomes: [
          { type: 'gain_gold', value: 15, description: '关闭装置后发现内部藏有金币，获得 15 金币' },
          { type: 'nothing', description: '装置无法被关闭' },
        ],
      },
      {
        id: 'choice_3',
        text: '将一件物品放在装置上',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '物品与装置产生共鸣，你获得了 3 点势能' },
          { type: 'lose_gold', value: 5, description: '物品被装置吞噬，价值 5 金币' },
        ],
      },
    ],
  },

  ancient_gateway: {
    id: 'ancient_gateway',
    name: '古老传送门',
    description: '一座由巨大石块搭建的拱门矗立在废墟中央，拱门内闪烁着不稳定的光芒。门框上刻满了已经失传的文字，似乎在警告着什么。空气中充斥着静电般的刺痛感。',
    chapter: 2,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'choice_1',
        text: '毫不犹豫地穿过传送门',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '被传送到一个满是金币的密室，获得 30 金币' },
          { type: 'lose_hp', value: 12, description: '传送过程不稳定，损失 12 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '在传送门前献上供品',
        outcomes: [
          { type: 'gain_relic', relicId: 'burst_emblem', description: '传送门接受了供品，吐出一件古代遗物' },
          { type: 'lose_gold', value: 15, description: '供品价值 15 金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '研究门框上的文字',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '理解了古代文字的含义，获得 3 点势能' },
          { type: 'gain_hp', value: 5, description: '文字中的治愈符文恢复了 5 点生命' },
        ],
      },
    ],
  },

  spirit_offering: {
    id: 'spirit_offering',
    name: '灵魂供坛',
    description: '一座由白骨搭建的供坛出现在你面前，坛上燃烧着幽蓝色的火焰。供坛周围的空气异常寒冷，你能感受到无数灵魂在低语，它们似乎在等待着某种祭品。',
    chapter: 2,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'choice_1',
        text: '将你的血液洒在供坛上',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_hp', value: 12, description: '失血过多，损失 12 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '向供坛投入金币',
        outcomes: [
          { type: 'gain_hp', value: 20, description: '灵魂的治愈之力恢复了 20 点生命' },
          { type: 'lose_gold', value: 20, description: '花费 20 金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '在供坛前默哀',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '灵魂们的悲伤令你获得了深刻的感悟，获得 3 点势能' },
          { type: 'nothing', description: '供坛上的火焰微微摇曳' },
        ],
      },
    ],
  },

  cursed_casino: {
    id: 'cursed_casino',
    name: '诅咒赌场',
    description: '一间隐藏在废墟深处的赌场，赌桌上摆满了用骨头制成的骰子和用血液书写的纸牌。赌客们都是半透明的幽灵，他们用不属于这个世界的东西下注。',
    chapter: 2,
    type: 'random_gamble',
    choices: [
      {
        id: 'choice_1',
        text: '加入赌局，用金币下注',
        outcomes: [
          { type: 'gain_gold', value: 50, description: '你赢了！获得 50 金币' },
          { type: 'lose_gold', value: 25, description: '你输了，失去 25 金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '用你的生命下注',
        outcomes: [
          { type: 'gain_hp', value: 30, description: '你赢了！幽灵们的力量治愈了你，恢复 30 点生命' },
          { type: 'lose_hp', value: 20, description: '你输了，生命力被抽走，损失 20 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '在一旁观战，不下注',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '观察幽灵的赌博技巧令你获得 2 点势能' },
          { type: 'nothing', description: '幽灵们对你视若无睹' },
        ],
      },
    ],
  },

  bone_chessboard: {
    id: 'bone_chessboard',
    name: '白骨棋局',
    description: '一张由人骨拼成的巨大棋盘铺在地面上，棋子是各种动物和人类的头骨。棋盘对面坐着一个没有身体的骨手，它向你做出邀请的手势。空气中弥漫着死亡的气息。',
    chapter: 2,
    type: 'random_gamble',
    choices: [
      {
        id: 'choice_1',
        text: '接受挑战，坐下对弈',
        outcomes: [
          { type: 'gain_relic', relicId: 'insight_lens', description: '你赢了棋局，骨手留下一件遗物后消散' },
          { type: 'lose_hp', value: 15, description: '你输了，骨手夺走了一部分生命力，损失 15 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '掀翻棋盘',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '打破规则的勇气令你获得 3 点势能' },
          { type: 'lose_hp', value: 10, description: '骨手愤怒地反击，损失 10 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '仔细观察棋局的走势',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'gain_momentum', value: 1, description: '获得 1 点势能' },
        ],
      },
    ],
  },

  whispering_pillar: {
    id: 'whispering_pillar',
    name: '低语石柱',
    description: '一根刻满符文的石柱孤零零地立在荒野中，石柱表面不断有微弱的光芒闪烁。当你靠近时，石柱发出细碎的低语声，似乎在诉说着什么秘密。空气中弥漫着一种古老的气息。',
    chapter: 2,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'choice_1',
        text: '将手掌贴在石柱上',
        outcomes: [
          { type: 'gain_momentum', value: 4, description: '石柱中的知识灌入你的脑海，获得 4 点势能' },
          { type: 'lose_hp', value: 8, description: '知识的冲击令你头痛欲裂，损失 8 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '在石柱前献上金币',
        outcomes: [
          { type: 'gain_hp', value: 18, description: '石柱发出温暖的光芒，恢复 18 点生命' },
          { type: 'lose_gold', value: 12, description: '花费 12 金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '用工具在石柱上刻下自己的印记',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_max_hp', value: 3, description: '石柱的反噬令你受伤，最大生命值降低 3' },
        ],
      },
    ],
  },

  cursed_painting: {
    id: 'cursed_painting',
    name: '诅咒画像',
    description: '一幅被遗弃的画像靠在废墟的墙角，画中描绘着一个面容模糊的人物。当你注视画像时，画中人物的嘴角似乎在微微上扬。画框上刻着一行小字："凝视深渊者，深渊亦凝视你。"',
    chapter: 2,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '长时间凝视画像',
        outcomes: [
          { type: 'gain_card', cardId: 'curse_blood_mark', description: '从画像中获取了一张强大的诅咒卡牌' },
          { type: 'lose_max_hp', value: 4, description: '画像中的诅咒侵蚀了你的身体，最大生命值降低 4' },
        ],
      },
      {
        id: 'choice_2',
        text: '用布将画像遮住',
        outcomes: [
          { type: 'gain_hp', value: 10, description: '遮住画像后感到一阵轻松，恢复 10 点生命' },
          { type: 'nothing', description: '画像被遮住后不再有任何反应' },
        ],
      },
      {
        id: 'choice_3',
        text: '将画像带走',
        outcomes: [
          { type: 'gain_gold', value: 20, description: '画像在收藏家眼中价值不菲，获得 20 金币' },
          { type: 'lose_hp', value: 8, description: '画像中的诅咒持续侵蚀你，损失 8 点生命' },
        ],
      },
    ],
  },

  // ==================== Chapter 3 ====================

  crumbling_colosseum: {
    id: 'crumbling_colosseum',
    name: '崩塌的竞技场',
    description: '一座巨大的圆形竞技场已经大半坍塌，但残存的看台上仍能感受到昔日的欢呼声回荡。竞技场中央的地面上刻着古老的阵法，阵法的光芒若隐若现。',
    chapter: 3,
    type: 'risk_reward',
    choices: [
      {
        id: 'choice_1',
        text: '站在阵法中央激活古老的仪式',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_hp', value: 20, description: '仪式的反噬力极大，损失 20 点生命' },
          { type: 'lose_max_hp', value: 5, description: '最大生命值降低 5' },
        ],
      },
      {
        id: 'choice_2',
        text: '在废墟中搜寻战利品',
        outcomes: [
          { type: 'gain_gold', value: 35, description: '找到了昔日战士遗落的财宝，获得 35 金币' },
          { type: 'lose_hp', value: 8, description: '废墟中潜伏的怪物袭击了你，损失 8 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '坐在看台上感受昔日的荣耀',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '竞技场的残魂激励了你，获得 3 点势能' },
          { type: 'gain_hp', value: 5, description: '残魂的治愈之力恢复了 5 点生命' },
        ],
      },
    ],
  },

  abyssal_gambit: {
    id: 'abyssal_gambit',
    name: '深渊赌局',
    description: '你站在一座悬空的平台上，下方是无尽的深渊。平台中央有一张石桌，桌上放着三枚不同颜色的水晶。一个声音告诉你：选择一枚水晶，命运将由此改变。',
    chapter: 3,
    type: 'risk_reward',
    choices: [
      {
        id: 'choice_1',
        text: '选择红色水晶',
        outcomes: [
          { type: 'gain_hp', value: 30, description: '水晶中蕴含的火焰之力治愈了你，恢复 30 点生命' },
          { type: 'lose_hp', value: 15, description: '水晶的反噬灼伤了你，损失 15 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '选择蓝色水晶',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_max_hp', value: 5, description: '水晶的力量侵蚀了你的身体，最大生命值降低 5' },
        ],
      },
      {
        id: 'choice_3',
        text: '选择金色水晶',
        outcomes: [
          { type: 'gain_gold', value: 50, description: '水晶化作一堆金币，获得 50 金币' },
          { type: 'lose_hp', value: 10, description: '选择的代价，损失 10 点生命' },
        ],
      },
    ],
  },

  final_gambit: {
    id: 'final_gambit',
    name: '最后的赌注',
    description: '在废墟的尽头，你遇到了一个身穿华丽长袍的老者。他自称是这个世界的最后一位赌师，提出要用你最珍贵的东西来赌一把。他的眼中闪烁着疯狂的光芒。',
    chapter: 3,
    type: 'risk_reward',
    choices: [
      {
        id: 'choice_1',
        text: '赌上你的全部金币',
        outcomes: [
          { type: 'gain_gold', value: 80, description: '你赢了！获得 80 金币' },
          { type: 'lose_gold', value: 40, description: '你输了，失去所有金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '赌上你的生命力',
        outcomes: [
          { type: 'gain_hp', value: 40, description: '你赢了！恢复了 40 点生命' },
          { type: 'lose_hp', value: 25, description: '你输了，损失 25 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '拒绝赌局',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '你的自制力令你获得 2 点势能' },
          { type: 'nothing', description: '老者失望地摇了摇头' },
        ],
      },
    ],
  },

  cursed_crown_b3: {
    id: 'cursed_crown_b3',
    name: '诅咒王冠',
    description: '一顶锈迹斑斑的铁制王冠躺在碎石之中，王冠上镶嵌的宝石已经暗淡无光。当你靠近时，王冠微微颤动，仿佛在召唤你戴上它。空气中弥漫着铁锈和腐败的气味。',
    chapter: 3,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '戴上诅咒王冠',
        outcomes: [
          { type: 'gain_momentum', value: 6, description: '王冠的力量令你获得 6 点势能' },
          { type: 'lose_max_hp', value: 8, description: '王冠的诅咒侵蚀了你的生命力，最大生命值降低 8' },
        ],
      },
      {
        id: 'choice_2',
        text: '将王冠上的宝石撬下来',
        outcomes: [
          { type: 'gain_gold', value: 50, description: '宝石虽已暗淡但仍价值不菲，获得 50 金币' },
          { type: 'lose_hp', value: 15, description: '王冠的诅咒反击，损失 15 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '用石头砸碎王冠',
        outcomes: [
          { type: 'gain_hp', value: 20, description: '王冠碎裂时释放的纯净之力恢复了 20 点生命' },
          { type: 'gain_momentum', value: 2, description: '粉碎诅咒令你获得 2 点势能' },
        ],
      },
      {
        id: 'choice_4',
        text: '无视王冠，绕道而行',
        outcomes: [
          { type: 'nothing', description: '你明智地选择了不碰这不祥之物' },
        ],
      },
    ],
  },

  void_pact: {
    id: 'void_pact',
    name: '虚空契约',
    description: '一张由黑暗凝聚而成的契约漂浮在空中，契约上的文字散发着诡异的光芒。契约提供了一份交易：用你的某些东西换取强大的力量。落款处是一个你无法辨认的签名。',
    chapter: 3,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '签署契约，用你的感官换取力量',
        outcomes: [
          { type: 'gain_card', cardId: 'curse_forgetfulness', description: '契约赋予你一张虚空卡牌' },
          { type: 'lose_max_hp', value: 6, description: '感官的丧失令你的生命力减弱，最大生命值降低 6' },
        ],
      },
      {
        id: 'choice_2',
        text: '撕毁契约',
        outcomes: [
          { type: 'gain_hp', value: 15, description: '契约碎裂时释放的纯净之力恢复了 15 点生命' },
          { type: 'gain_momentum', value: 3, description: '对抗虚空的勇气令你获得 3 点势能' },
        ],
      },
      {
        id: 'choice_3',
        text: '用金币贿赂契约',
        outcomes: [
          { type: 'gain_relic', relicId: 'guard_knot', description: '契约接受了金币，化作一件虚空遗物' },
          { type: 'lose_gold', value: 30, description: '花费 30 金币' },
        ],
      },
    ],
  },

  death_merchant: {
    id: 'death_merchant',
    name: '死亡商人',
    description: '一个身穿黑色长袍的身影站在白骨堆砌的摊位前，兜帽下是一张没有五官的脸。摊位上摆放着用灵魂铸就的物品，每一件都散发着令人胆寒的气息。他用你听不懂的语言开口说话。',
    chapter: 3,
    type: 'merchant',
    choices: [
      {
        id: 'choice_1',
        text: '用你的记忆换取一件遗物',
        outcomes: [
          { type: 'gain_relic', relicId: 'still_core', description: '获得一件来自死亡领域的强大遗物' },
          { type: 'lose_hp', value: 10, description: '失去记忆的痛苦令你损失 10 点生命' },
          { type: 'lose_max_hp', value: 5, description: '灵魂受损，最大生命值降低 5' },
        ],
      },
      {
        id: 'choice_2',
        text: '购买一瓶灵魂之水',
        outcomes: [
          { type: 'gain_hp', value: 30, description: '灵魂之水恢复了 30 点生命' },
          { type: 'lose_gold', value: 40, description: '花费 40 金币' },
          { type: 'lose_max_hp', value: 3, description: '灵魂之水的代价，最大生命值降低 3' },
        ],
      },
      {
        id: 'choice_3',
        text: '拒绝交易，尽快离开',
        outcomes: [
          { type: 'nothing', description: '死亡商人发出诡异的笑声，没有阻拦你' },
          { type: 'lose_hp', value: 5, description: '离开时感到一阵寒意，损失 5 点生命' },
        ],
      },
    ],
  },

  abyssal_merchant: {
    id: 'abyssal_merchant',
    name: '深渊商人',
    description: '一个从深渊裂隙中爬出的商人，他的身体由黑色的烟雾构成，眼睛燃烧着幽蓝的火焰。他推着一辆由骸骨制成的手推车，车上堆满了从深渊中打捞的物品。',
    chapter: 3,
    type: 'merchant',
    choices: [
      {
        id: 'choice_1',
        text: '购买深渊精华',
        outcomes: [
          { type: 'gain_hp', value: 35, description: '深渊精华蕴含强大的恢复力，恢复 35 点生命' },
          { type: 'lose_gold', value: 35, description: '花费 35 金币' },
          { type: 'lose_max_hp', value: 4, description: '深渊精华的副作用，最大生命值降低 4' },
        ],
      },
      {
        id: 'choice_2',
        text: '用你的血液购买一件遗物',
        outcomes: [
          { type: 'gain_relic', relicId: 'soft_guard', description: '用血液换取了一件深渊遗物' },
          { type: 'lose_max_hp', value: 7, description: '大量失血，最大生命值降低 7' },
        ],
      },
      {
        id: 'choice_3',
        text: '询问他关于深渊的秘密',
        outcomes: [
          { type: 'gain_momentum', value: 4, description: '深渊的知识令你获得 4 点势能' },
          { type: 'lose_hp', value: 10, description: '知识的代价，损失 10 点生命' },
        ],
      },
    ],
  },

  eternal_staircase: {
    id: 'eternal_staircase',
    name: '永恒之阶',
    description: '一座无尽的螺旋阶梯在你面前延伸向上，阶梯的两侧墙壁上刻满了不同时代的壁画。每登上一层，周围的景象就会发生微妙的变化，仿佛在穿越不同的时间。',
    chapter: 3,
    type: 'memory',
    choices: [
      {
        id: 'choice_1',
        text: '一口气攀登到最高处',
        outcomes: [
          { type: 'gain_relic', relicId: 'quick_fuse', description: '在阶梯顶端发现一件时间遗物' },
          { type: 'lose_hp', value: 20, description: '攀登过程极度消耗体力，损失 20 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '逐层研究墙壁上的壁画',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'gain_momentum', value: 4, description: '获得 4 点势能' },
          { type: 'lose_hp', value: 10, description: '时间错乱感令你头痛欲裂，损失 10 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '在某一层停下，坐下来冥想',
        outcomes: [
          { type: 'gain_hp', value: 15, description: '冥想中获得治愈，恢复 15 点生命' },
          { type: 'gain_momentum', value: 2, description: '获得 2 点势能' },
        ],
      },
    ],
  },

  lost_chronicle: {
    id: 'lost_chronicle',
    name: '失落的编年史',
    description: '一本巨大的书籍悬浮在半空中，书页自动翻动，每一页都记载着一段已经消逝的历史。书中的文字散发着金色的光芒，你能感受到其中蕴含的深沉智慧。',
    chapter: 3,
    type: 'memory',
    choices: [
      {
        id: 'choice_1',
        text: '读取书中关于力量的章节',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_hp', value: 12, description: '力量的代价令你损失 12 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '读取书中关于治愈的章节',
        outcomes: [
          { type: 'gain_hp', value: 25, description: '治愈的知识恢复了 25 点生命' },
          { type: 'gain_momentum', value: 2, description: '获得 2 点势能' },
        ],
      },
      {
        id: 'choice_3',
        text: '读取书中关于命运的章节',
        outcomes: [
          { type: 'gain_momentum', value: 5, description: '对命运的理解令你获得 5 点势能' },
          { type: 'lose_max_hp', value: 3, description: '窥探命运的代价，最大生命值降低 3' },
        ],
      },
      {
        id: 'choice_4',
        text: '合上书本，不去窥探过去',
        outcomes: [
          { type: 'gain_gold', value: 10, description: '书本合上时掉出了几枚金币，获得 10 金币' },
          { type: 'nothing', description: '你选择不去打扰历史的安宁' },
        ],
      },
    ],
  },

  void_nexus: {
    id: 'void_nexus',
    name: '虚空核心',
    description: '一个巨大的黑色球体悬浮在空间的中央，球体表面不断有裂纹闪现又消失。整个区域的重力似乎已经扭曲，碎片和尘埃围绕球体缓慢旋转。你能感受到来自球体的吸力。',
    chapter: 3,
    type: 'corruption',
    choices: [
      {
        id: 'choice_1',
        text: '将手伸入球体表面的裂纹',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_max_hp', value: 8, description: '虚空之力侵蚀了你的本质，最大生命值降低 8' },
        ],
      },
      {
        id: 'choice_2',
        text: '围绕球体收集漂浮的碎片',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '碎片中包含珍贵的虚空结晶，获得 40 金币' },
          { type: 'lose_hp', value: 15, description: '碎片的锋利边缘割伤了你，损失 15 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '利用球体的吸力加速离开',
        outcomes: [
          { type: 'gain_momentum', value: 4, description: '借助虚空之力获得 4 点势能' },
          { type: 'lose_hp', value: 8, description: '被吸力拉扯导致身体受损，损失 8 点生命' },
        ],
      },
    ],
  },

  world_eater_vine: {
    id: 'world_eater_vine',
    name: '噬界之藤',
    description: '一根粗壮的黑色藤蔓从地面钻出，它的表面布满了倒刺和诡异的纹路。藤蔓似乎有意识地蠕动着，它的根系已经穿透了多层岩石，汲取着大地深处的力量。',
    chapter: 3,
    type: 'corruption',
    choices: [
      {
        id: 'choice_1',
        text: '用匕首割断藤蔓',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '藤蔓断裂后流出的汁液价值不菲，获得 30 金币' },
          { type: 'lose_hp', value: 15, description: '藤蔓的倒刺刺入了你的身体，损失 15 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '攀爬藤蔓进入地下',
        outcomes: [
          { type: 'gain_relic', relicId: 'sighted_edge', description: '在藤蔓的根部发现一件被保护的遗物' },
          { type: 'lose_max_hp', value: 5, description: '藤蔓的毒素侵入了你的身体，最大生命值降低 5' },
        ],
      },
      {
        id: 'choice_3',
        text: '与藤蔓建立联系',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '感受到大地的力量，获得 3 点势能' },
          { type: 'lose_hp', value: 8, description: '藤蔓的意识冲击了你的精神，损失 8 点生命' },
        ],
      },
    ],
  },

  corrupted_engine: {
    id: 'corrupted_engine',
    name: '腐化引擎',
    description: '一台巨大的机械引擎已经停止运转，但它的齿轮仍在缓慢转动，发出令人牙酸的吱嘎声。引擎的核心散发着不稳定的能量波动，周围的空气都被扭曲了。',
    chapter: 3,
    type: 'strange_machine',
    choices: [
      {
        id: 'choice_1',
        text: '尝试重启引擎',
        outcomes: [
          { type: 'gain_gold', value: 45, description: '引擎启动后吐出了大量金属碎片，获得 45 金币' },
          { type: 'lose_hp', value: 18, description: '引擎失控爆炸，损失 18 点生命' },
          { type: 'lose_max_hp', value: 3, description: '爆炸的冲击波造成永久伤害，最大生命值降低 3' },
        ],
      },
      {
        id: 'choice_2',
        text: '拆卸引擎获取零件',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '精密零件价值不菲，获得 30 金币' },
          { type: 'lose_hp', value: 12, description: '拆卸过程中零件飞溅，损失 12 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '引导引擎的能量为自己所用',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_max_hp', value: 6, description: '能量的反噬伤害了身体，最大生命值降低 6' },
        ],
      },
      {
        id: 'choice_4',
        text: '记录引擎的构造后离开',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '对引擎的研究令你获得 3 点势能' },
        ],
      },
    ],
  },

  reality_forge_b3: {
    id: 'reality_forge_b3',
    name: '现实熔炉',
    description: '一个由扭曲空间构成的熔炉悬浮在虚空中，炉中燃烧着不属于任何元素的火焰。熔炉周围的空间不断扭曲变形，你能看到过去和未来的碎片在其中闪烁。',
    chapter: 3,
    type: 'strange_machine',
    choices: [
      {
        id: 'choice_1',
        text: '将你的武器投入熔炉',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_gold', value: 15, description: '武器的价值约 15 金币' },
        ],
      },
      {
        id: 'choice_2',
        text: '投入你的血液',
        outcomes: [
          { type: 'gain_hp', value: 25, description: '熔炉的火焰净化了你体内的毒素，恢复 25 点生命' },
          { type: 'lose_max_hp', value: 4, description: '血液的损失令你虚弱，最大生命值降低 4' },
        ],
      },
      {
        id: 'choice_3',
        text: '投入一枚金币',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '熔炉将金币复制了数倍，获得 40 金币' },
          { type: 'lose_gold', value: 10, description: '花费 10 金币作为启动燃料' },
        ],
      },
    ],
  },

  forgotten_god_shrine: {
    id: 'forgotten_god_shrine',
    name: '遗忘之神的神殿',
    description: '一座宏伟但已残破不堪的神殿出现在你面前，殿内的神像已经碎成数块，但残存的部分仍散发着微弱的神圣光辉。香炉中的余烬还在冒着青烟，仿佛昨天还有人在此祈祷。',
    chapter: 3,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'choice_1',
        text: '跪在碎裂的神像前祈祷',
        outcomes: [
          { type: 'gain_hp', value: 25, description: '遗忘之神回应了你的祈祷，恢复 25 点生命' },
          { type: 'gain_momentum', value: 3, description: '获得 3 点势能' },
        ],
      },
      {
        id: 'choice_2',
        text: '在神像残骸中寻找遗物',
        outcomes: [
          { type: 'gain_relic', relicId: 'blaze_core', description: '在神像内部发现一件被封印的神圣遗物' },
          { type: 'lose_hp', value: 15, description: '触碰圣物时遭到神罚，损失 15 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '清扫神殿，重新点燃香炉',
        outcomes: [
          { type: 'gain_gold', value: 20, description: '清理神殿后发现被灰尘覆盖的供品金币，获得 20 金币' },
          { type: 'gain_hp', value: 10, description: '香炉的烟雾有治愈效果，恢复 10 点生命' },
        ],
      },
      {
        id: 'choice_4',
        text: '将神像碎片带走作为材料',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '神像碎片在黑市上价值不菲，获得 30 金币' },
          { type: 'lose_max_hp', value: 5, description: '亵渎神灵的代价，最大生命值降低 5' },
        ],
      },
    ],
  },

  graveyard_of_gods: {
    id: 'graveyard_of_gods',
    name: '众神墓地',
    description: '无数巨大的神像散落在广袤的平原上，每一座都呈现出不同的死亡姿态。空气中弥漫着神圣与死亡交织的气息，地面上生长着发出白色光芒的花朵。你感到自己的灵魂在这里变得格外沉重。',
    chapter: 3,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'choice_1',
        text: '在最大的神像前跪拜',
        outcomes: [
          { type: 'gain_hp', value: 30, description: '残存的神性回应了你的虔诚，恢复 30 点生命' },
          { type: 'gain_momentum', value: 4, description: '获得 4 点势能' },
        ],
      },
      {
        id: 'choice_2',
        text: '收集地面上的白色花朵',
        outcomes: [
          { type: 'gain_hp', value: 20, description: '花朵的治愈之力恢复了 20 点生命' },
          { type: 'lose_gold', value: 10, description: '花朵在收集过程中凋零，损失 10 金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '尝试唤醒一座神像',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_hp', value: 25, description: '神像的愤怒令你损失 25 点生命' },
          { type: 'lose_max_hp', value: 5, description: '最大生命值降低 5' },
        ],
      },
      {
        id: 'choice_4',
        text: '默默走过众神的墓地',
        outcomes: [
          { type: 'gain_momentum', value: 2, description: '敬畏之心令你获得 2 点势能' },
          { type: 'gain_gold', value: 10, description: '在花丛中发现几枚古老的金币，获得 10 金币' },
        ],
      },
    ],
  },

  dimension_shrine: {
    id: 'dimension_shrine',
    name: '维度神殿',
    description: '一座由透明水晶构成的神殿漂浮在半空中，神殿的每一面墙壁都映射着不同维度的景象。殿内供奉着一尊由星光凝聚的神像，神像的双眼注视着无穷的虚空。',
    chapter: 3,
    type: 'ancient_shrine',
    choices: [
      {
        id: 'choice_1',
        text: '将你的血液洒在神像脚下',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_max_hp', value: 4, description: '血液的代价，最大生命值降低 4' },
        ],
      },
      {
        id: 'choice_2',
        text: '用金币装饰神像',
        outcomes: [
          { type: 'gain_relic', relicId: 'fractured_blade', description: '神像接受了你的供品，赐予一件维度遗物' },
          { type: 'lose_gold', value: 25, description: '花费 25 金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '在神殿中冥想',
        outcomes: [
          { type: 'gain_hp', value: 20, description: '神殿的治愈之力恢复了 20 点生命' },
          { type: 'gain_momentum', value: 3, description: '获得 3 点势能' },
        ],
      },
    ],
  },

  dimensional_rift: {
    id: 'dimensional_rift',
    name: '维度裂缝',
    description: '空间在你面前撕裂开一道不规则的裂口，裂缝中可以看到另一个世界的景象——一个更加荒芜、更加绝望的世界。裂缝边缘不断有能量溢出，空气中充斥着不属于这个维度的气息。',
    chapter: 3,
    type: 'random_gamble',
    choices: [
      {
        id: 'choice_1',
        text: '伸手触碰裂缝的边缘',
        outcomes: [
          { type: 'gain_relic', relicId: 'iron_heart', description: '从另一个维度获取了一件强大的遗物' },
          { type: 'lose_max_hp', value: 6, description: '维度能量侵蚀了你的身体，最大生命值降低 6' },
        ],
      },
      {
        id: 'choice_2',
        text: '尝试穿过裂缝',
        outcomes: [
          { type: 'gain_gold', value: 60, description: '另一个世界遍地是财宝，获得 60 金币' },
          { type: 'lose_hp', value: 25, description: '穿越过程极度危险，损失 25 点生命' },
          { type: 'lose_max_hp', value: 4, description: '维度穿越对身体造成永久伤害，最大生命值降低 4' },
        ],
      },
      {
        id: 'choice_3',
        text: '收集溢出的能量',
        outcomes: [
          { type: 'gain_momentum', value: 5, description: '维度能量令你获得 5 点势能' },
          { type: 'lose_hp', value: 10, description: '能量难以控制，损失 10 点生命' },
        ],
      },
    ],
  },

  void_gamble: {
    id: 'void_gamble',
    name: '虚空赌局',
    description: '一张由纯粹黑暗构成的赌桌出现在你面前，赌桌对面坐着一个由星光凝聚而成的身影。它用没有温度的声音邀请你参与赌局，赌注是你的生命力。',
    chapter: 3,
    type: 'random_gamble',
    choices: [
      {
        id: 'choice_1',
        text: '以一半的生命力为赌注',
        outcomes: [
          { type: 'gain_hp', value: 40, description: '你赢了！星光身影赐予你大量生命力，恢复 40 点生命' },
          { type: 'lose_hp', value: 20, description: '你输了，失去 20 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '以你的最大生命值为赌注',
        outcomes: [
          { type: 'gain_hp', value: 50, description: '你赢了！获得了极大的生命力恢复，恢复 50 点生命' },
          { type: 'lose_max_hp', value: 10, description: '你输了，最大生命值降低 10' },
        ],
      },
      {
        id: 'choice_3',
        text: '以你的记忆为赌注',
        outcomes: [
          { type: 'gain_relic', relicId: 'counter_sigil', description: '你赢了！获得一件来自虚空的遗物' },
          { type: 'lose_max_hp', value: 5, description: '部分记忆永久丢失，最大生命值降低 5' },
        ],
      },
      {
        id: 'choice_4',
        text: '拒绝赌局',
        outcomes: [
          { type: 'nothing', description: '星光身影化作碎片消散在黑暗中' },
        ],
      },
    ],
  },

  fate_wheel_b3: {
    id: 'fate_wheel_b3',
    name: '命运之轮',
    description: '一个巨大的石质转盘矗立在废墟中央，转盘上刻满了各种符号——金币、骷髅、卡牌、心脏。转盘似乎在等待有人来转动它，空气中弥漫着命运的气息。',
    chapter: 3,
    type: 'random_gamble',
    choices: [
      {
        id: 'choice_1',
        text: '用力转动命运之轮',
        outcomes: [
          { type: 'gain_gold', value: 50, description: '转盘停在金币符号上，获得 50 金币' },
          { type: 'lose_hp', value: 20, description: '转盘停在骷髅符号上，损失 20 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '轻轻拨动命运之轮',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_max_hp', value: 3, description: '转盘停在心脏符号上，最大生命值降低 3' },
        ],
      },
      {
        id: 'choice_3',
        text: '用金币支付转盘的启动费用',
        outcomes: [
          { type: 'gain_hp', value: 25, description: '转盘赐予你治愈之力，恢复 25 点生命' },
          { type: 'lose_gold', value: 15, description: '花费 15 金币' },
        ],
      },
      {
        id: 'choice_4',
        text: '破坏命运之轮',
        outcomes: [
          { type: 'gain_momentum', value: 4, description: '打破命运束缚的勇气令你获得 4 点势能' },
          { type: 'lose_hp', value: 10, description: '转盘碎裂时的冲击伤害了你，损失 10 点生命' },
        ],
      },
    ],
  },

  abyss_entrance: {
    id: 'abyss_entrance',
    name: '深渊入口',
    description: '大地在你面前裂开一道巨大的深渊，深渊中传来阵阵低沉的咆哮声。深渊的边缘布满了扭曲的岩石和枯萎的植被，空气中弥漫着硫磺和腐肉的气味。你能感受到深渊中蕴含的恐怖力量。',
    chapter: 3,
    type: 'risk_reward',
    choices: [
      {
        id: 'choice_1',
        text: '攀爬深渊的边缘探索',
        outcomes: [
          { type: 'gain_relic', relicId: 'twin_core', description: '在深渊边缘发现一件被黑暗保护的遗物' },
          { type: 'lose_hp', value: 18, description: '攀爬时不慎滑落，险些坠入深渊，损失 18 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '向深渊中投掷物品试探',
        outcomes: [
          { type: 'gain_gold', value: 25, description: '深渊中传出回声，一些金币从裂缝中弹出，获得 25 金币' },
          { type: 'lose_hp', value: 8, description: '深渊的咆哮声震伤了你的耳朵，损失 8 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '在深渊边缘冥想',
        outcomes: [
          { type: 'gain_momentum', value: 5, description: '深渊的力量令你获得了深刻的领悟，获得 5 点势能' },
          { type: 'lose_max_hp', value: 3, description: '深渊的侵蚀伤害了你的灵魂，最大生命值降低 3' },
        ],
      },
    ],
  },

  // ==================== 5 additional events (chapter 3 heavy) ====================

  forgotten_forge: {
    id: 'forgotten_forge',
    name: '被遗忘的锻造炉',
    description: '在废墟深处，你发现了一座仍在微弱燃烧的锻造炉。炉火呈现不自然的蓝白色，锻造台上的工具摆放整齐，仿佛工匠只是暂时离开。炉边的墙壁上刻着模糊的铭文，记录着某种古老的锻造技艺。',
    chapter: 3,
    type: 'strange_machine',
    choices: [
      {
        id: 'choice_1',
        text: '尝试使用锻造炉打造武器',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'lose_hp', value: 12, description: '锻造炉的火焰灼伤了你的双手，损失 12 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '研究墙上的铭文',
        outcomes: [
          { type: 'gain_momentum', value: 4, description: '铭文中蕴含的古老智慧令你获得 4 点势能' },
          { type: 'nothing', description: '铭文太过模糊，你只解读出零星片段' },
        ],
      },
      {
        id: 'choice_3',
        text: '取走锻造炉中的余烬',
        outcomes: [
          { type: 'gain_gold', value: 30, description: '余烬中蕴含着稀有金属，获得 30 金币' },
          { type: 'lose_max_hp', value: 2, description: '余烬的余温灼伤了你的灵魂，最大生命值降低 2' },
        ],
      },
    ],
  },

  ancient_library_b3: {
    id: 'ancient_library_b3',
    name: '远古图书馆',
    description: '一座被藤蔓和苔藓覆盖的建筑矗立在你面前，推开沉重的石门，里面是一间巨大的图书馆。书架高耸入云，书卷散发着微弱的光芒。空气中弥漫着古老纸张和墨水的气息，偶尔有书页自行翻动。',
    chapter: 3,
    type: 'memory',
    choices: [
      {
        id: 'choice_1',
        text: '寻找关于连势的典籍',
        outcomes: [
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
          { type: 'nothing', description: '古籍中的文字太过晦涩，你未能理解其中奥义' },
        ],
      },
      {
        id: 'choice_2',
        text: '翻阅历史卷轴',
        outcomes: [
          { type: 'gain_momentum', value: 3, description: '历史的智慧令你获得 3 点势能' },
          { type: 'gain_gold', value: 15, description: '在书架间发现散落的金币，获得 15 金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '触碰发光的书籍',
        outcomes: [
          { type: 'gain_hp', value: 15, description: '书籍中蕴含的治愈之力恢复了 15 点生命' },
          { type: 'lose_hp', value: 10, description: '书籍中的诅咒反噬，损失 10 点生命' },
        ],
      },
    ],
  },

  shadow_auction: {
    id: 'shadow_auction',
    name: '暗影拍卖会',
    description: '你误入了一场隐秘的拍卖会。昏暗的灯光下，各种奇珍异宝被陈列在展示台上。拍卖师是一个戴着面具的身影，他的声音沙哑而诱惑："欢迎，新来的客人。这里的一切都可以用你最珍贵的东西来交换。"',
    chapter: 3,
    type: 'merchant',
    choices: [
      {
        id: 'choice_1',
        text: '用生命竞拍神秘宝箱',
        requirements: 'hp >= 15',
        outcomes: [
          { type: 'lose_hp', value: 15, description: '献出 15 点生命作为竞拍代价' },
          { type: 'gain_relic', relicId: 'harmony_emblem', description: '赢得了装满珍宝的神秘宝箱' },
        ],
      },
      {
        id: 'choice_2',
        text: '用金币购买情报',
        requirements: 'gold >= 40',
        outcomes: [
          { type: 'lose_gold', value: 40, description: '支付 40 金币购买情报' },
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '只是参观，不参与竞拍',
        outcomes: [
          { type: 'gain_gold', value: 10, description: '在角落捡到一些被遗忘的金币，获得 10 金币' },
          { type: 'nothing', description: '拍卖师对你失去了兴趣' },
        ],
      },
    ],
  },

  cursed_merchant_b3: {
    id: 'cursed_merchant_b3',
    name: '被诅咒的商人',
    description: '一个面容扭曲的商人坐在路旁，他的眼睛闪烁着不自然的光芒。"我有你需要的一切，"他低声说道，"但每件商品都有代价……你愿意付出什么？"',
    chapter: 3,
    type: 'curse_trade',
    choices: [
      {
        id: 'choice_1',
        text: '购买力量药剂',
        requirements: 'gold >= 50',
        outcomes: [
          { type: 'lose_gold', value: 50, description: '支付 50 金币购买药剂' },
          { type: 'gain_momentum', value: 6, description: '药剂令你获得了 6 点势能' },
          { type: 'lose_max_hp', value: 4, description: '药剂的副作用侵蚀了你的生命力，最大生命值降低 4' },
        ],
      },
      {
        id: 'choice_2',
        text: '购买治愈药水',
        requirements: 'gold >= 35',
        outcomes: [
          { type: 'lose_gold', value: 35, description: '支付 35 金币购买药水' },
          { type: 'gain_hp', value: 25, description: '药水恢复了 25 点生命' },
        ],
      },
      {
        id: 'choice_3',
        text: '拒绝交易',
        outcomes: [
          { type: 'nothing', description: '商人发出不满的哼声，消失在阴影中' },
        ],
      },
    ],
  },

  rift_guardian: {
    id: 'rift_guardian',
    name: '裂隙守卫',
    description: '一道巨大的裂隙横亘在你面前，裂隙中散发着诡异的紫光。裂隙的边缘站着一个由岩石和能量构成的守卫，它的眼睛空洞地注视着你。守卫的声音如同雷鸣："此路不通，除非你能证明你的价值。"',
    chapter: 3,
    type: 'risk_reward',
    choices: [
      {
        id: 'choice_1',
        text: '与守卫战斗',
        outcomes: [
          { type: 'gain_relic', relicId: 'ward_banner', description: '击败守卫后获得了它守护的古老遗物' },
          { type: 'lose_hp', value: 20, description: '守卫的攻击极为凶猛，损失 20 点生命' },
        ],
      },
      {
        id: 'choice_2',
        text: '献上金币作为通行费',
        requirements: 'gold >= 60',
        outcomes: [
          { type: 'lose_gold', value: 60, description: '支付 60 金币作为通行费' },
          { type: 'gain_gold', value: 40, description: '获得了一些金币' },
        ],
      },
      {
        id: 'choice_3',
        text: '尝试绕过裂隙',
        outcomes: [
          { type: 'lose_hp', value: 10, description: '绕行时被裂隙的能量灼伤，损失 10 点生命' },
          { type: 'gain_gold', value: 20, description: '在绕行途中发现了一些被遗弃的物资，获得 20 金币' },
        ],
      },
    ],
  },
};
