export interface Faction {
  id: string;
  name: string;
  description: string;
  philosophy: string;
  color: string;
  symbol: string;
}

export const FACTIONS: Record<string, Faction> = {
  ancient_guardians: {
    id: "ancient_guardians",
    name: "远古守卫",
    description: "遗迹文明最后的守护者，世代驻守在崩塌的神殿与残破的城墙上。他们的身上刻满了失传的符文，每一笔都在低声诉说着文明覆灭前的警告。",
    philosophy: "守护是最后的信仰，遗忘才是真正的死亡。",
    color: "#8B7355",
    symbol: "盾",
  },
  shadow_weavers: {
    id: "shadow_weavers",
    name: "织影者",
    description: "行走于黑暗裂隙中的操纵者，他们以阴影为丝线编织命运的网。没有人知道他们的真实面目，只知道被他们注视的人，最终都会成为暗影的一部分。",
    philosophy: "光明终将熄灭，唯有影子永恒。",
    color: "#2C0E37",
    symbol: "影",
  },
  iron_pact: {
    id: "iron_pact",
    name: "铁誓盟约",
    description: "在文明崩塌后依然坚持用机械与钢铁改造世界的工匠组织。他们相信，只有将血肉之躯替换为齿轮与活塞，才能抵御即将到来的第二次毁灭。",
    philosophy: "血肉苦弱，钢铁永存。",
    color: "#4A4A4A",
    symbol: "齿轮",
  },
  verdant_circle: {
    id: "verdant_circle",
    name: "翠环教团",
    description: "在废墟的裂缝中培育变异植物的神秘教团。他们目睹了自然在毁灭中的重生，相信唯有回归大地的怀抱，才能治愈这个破碎的世界。",
    philosophy: "万物终将归于尘土，尘土终将孕育新生。",
    color: "#2D5A27",
    symbol: "藤蔓",
  },
  void_seekers: {
    id: "void_seekers",
    name: "深渊行者",
    description: "自愿踏入虚空裂隙的疯狂探索者，他们渴望窥见世界毁灭的真相。有些人从深渊归来后变得强大，有些人则永远成为了深渊的一部分。",
    philosophy: "真理藏于毁灭之后，唯有直面虚无方能超越。",
    color: "#0D0D2B",
    symbol: "深渊之眼",
  },
  rhythm_walkers: {
    id: "rhythm_walkers",
    name: "节奏行者",
    description: "以心跳为节拍、以呼吸为律动的特殊行者。他们相信世界的运转遵循着某种古老的节奏，而掌握这节奏的人，便能改写现实的走向。",
    philosophy: "万物皆有节律，掌控节奏者掌控命运。",
    color: "#6B3FA0",
    symbol: "脉搏",
  },
  ashen_court: {
    id: "ashen_court",
    name: "灰烬宫廷",
    description: "文明覆灭前最后一批贵族的后裔，他们在灰烬中重建了一座虚幻的王国。华丽的礼服下是腐朽的躯壳，但他们依然固执地维持着早已崩塌的秩序。",
    philosophy: "即便世界化为灰烬，礼节与秩序不可废。",
    color: "#8B0000",
    symbol: "王冠",
  },
  tide_callers: {
    id: "tide_callers",
    name: "潮唤者",
    description: "掌控水与潮汐之力的神秘族群，他们居住在被洪水淹没的古城废墟中。他们相信水流中蕴含着最原始的力量，而潮汐的涨落便是世界脉搏的回响。",
    philosophy: "潮起潮落，万物轮回。顺势而为，方能长久。",
    color: "#1B4F72",
    symbol: "海浪",
  },
  ember_covenant: {
    id: "ember_covenant",
    name: "余烬盟约",
    description: "在毁灭之火中幸存的狂热信徒，他们将那场焚尽世界的火焰视为神圣的净化。他们在火山口与燃烧的废墟中建立圣殿，以烈火为信仰的图腾。",
    philosophy: "唯有经过烈焰的考验，灵魂才能得到真正的升华。",
    color: "#CC4400",
    symbol: "火焰",
  },
  silent_choir: {
    id: "silent_choir",
    name: "默声圣咏",
    description: "从不言语的神秘僧侣团体，他们通过冥想与共鸣与这个世界残留的意志交流。他们的修道院建在最危险的遗迹深处，沉默是他们最强大的武器。",
    philosophy: "言语是软弱者的拐杖，沉默中蕴含着最强大的力量。",
    color: "#4A0E4E",
    symbol: "静默之钟",
  },
};
