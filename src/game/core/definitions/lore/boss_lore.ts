export interface BossLore {
  id: string;
  name: string;
  title: string;
  chapter: 1 | 2 | 3;
  backstory: string;
  motivation: string;
  weakness: string;
}

export const BOSS_LORE: Record<string, BossLore> = {
  // Chapter 1 Bosses
  rusted_sentinel: {
    id: "rusted_sentinel",
    name: "锈蚀哨兵",
    title: "铁誓盟约的看门人",
    chapter: 1,
    backstory:
      "曾经是铁誓盟约最引以为傲的守卫机械，在文明覆灭的那一天接到了最后一个指令——守卫锈蚀之门，直到命令被解除。数百年过去了，它的核心早已锈蚀，但齿轮依然在不知疲倦地转动。",
    motivation: "完成最后的命令，等待永远不会到来的解除指令。",
    weakness: "对命令的绝对服从让它无法判断命令本身是否已经失去意义。",
  },
  phantom_merchant_king: {
    id: "phantom_merchant_king",
    name: "幻影商王",
    title: "灰商巷的无冕之王",
    chapter: 1,
    backstory:
      "灰商巷曾经最成功的商人，在世界毁灭的那一刻依然在计算着利润。他的执念如此强烈，以至于死后依然在废墟中经营着自己的店铺，用幻象维持着早已不存在的商业帝国。",
    motivation: "让灰商巷恢复往日的繁华，成为这座废墟之都的经济中心。",
    weakness: "他贩卖的一切都是幻象，包括他自己的存在。",
  },
  canal_siren: {
    id: "canal_siren",
    name: "运河塞壬",
    title: "静水的诱惑者",
    chapter: 1,
    backstory:
      "静水运河中最古老的存在，没有人知道她是什么时候出现的。她用水面的倒影引诱路人，将他们拖入水下的另一个世界。有人说她是潮唤者的叛徒，有人说她根本不是人类。",
    motivation: "让更多的人沉入水下世界，填补她永远无法填满的孤独。",
    weakness: "她所创造的水下世界是孤独的倒影，其中的一切都是对现实的拙劣模仿。",
  },
  thorn_mother: {
    id: "thorn_mother",
    name: "荆棘之母",
    title: "变异植物的起源",
    chapter: 1,
    backstory:
      "翠环教团曾经的领袖，在一次实验中与变异植物融为一体。她现在既是人也是植物，既是母亲也是囚徒。她的根系延伸到广场的每一个角落，但她的心智正在缓慢地被植物的本能吞噬。",
    motivation: "让整个世界回归自然的怀抱，消除一切人类文明的痕迹。",
    weakness: "她的意识正在被植物的生存本能取代，她已经分不清自己是在保护还是在吞噬。",
  },

  // Chapter 2 Bosses
  shadow_regent: {
    id: "shadow_regent",
    name: "暗影摄政",
    title: "织影者的无面之王",
    chapter: 2,
    backstory:
      "没有人见过他的真面目，甚至连织影者内部也流传着关于他的无数传说。据说他曾是远古守卫的一员，在某次任务中目睹了不该目睹的真相，从此背叛了守护者的身份，投身于暗影之中。",
    motivation: "用暗影编织一张笼罩整个遗迹的网，让所有人都活在他编织的恐惧之中。",
    weakness: "他越是编织暗影，自己的真面目就越是模糊，最终连自己都不记得自己是谁。",
  },
  drowned_scholar: {
    id: "drowned_scholar",
    name: "沉没学者",
    title: "永恒的求知者",
    chapter: 2,
    backstory:
      "沉没学院最后的院长，在学院沉入湖中的那一刻选择留在水下继续研究。他的身体早已死亡，但他的求知欲如此强烈，以至于灵魂依然困在水下的图书馆中，翻阅着永远不会读完的书籍。",
    motivation: "找到阻止世界毁灭的方法，即使世界已经毁灭了。",
    weakness: "他的知识来自已经毁灭的世界，而那个世界的经验无法解决眼前的问题。",
  },
  clockwork_overseer: {
    id: "clockwork_overseer",
    name: "发条监工",
    title: "机械意志的化身",
    chapter: 2,
    backstory:
      "发条深渊的最高管理者，一个将自己完全改造成机械的人类。他早已失去了所有人类的情感，只剩下对效率的追求和对指令的执行。他将工厂中的每一个机械都视为自己的延伸。",
    motivation: "让发条深渊达到完美的运转效率，即使这毫无意义。",
    weakness: "他的逻辑无法理解没有目的的行为，因此无法应对节奏行者看似混乱的行动。",
  },
  throne_wraith: {
    id: "throne_wraith",
    name: "王座亡灵",
    title: "灰烬宫廷的最后国王",
    chapter: 2,
    backstory:
      "灰烬宫廷最后一位真正的国王，在宫廷还是真正的宫殿时就已经死去。他的亡灵拒绝离开王座，用幻象维持着一个早已不存在的王国。他的臣民都是幽灵，他的命令都指向虚空。",
    motivation: "让灰烬宫廷重新成为真正的王国，即使这意味着要将所有人变成幽灵。",
    weakness: "他的王国是建立在对过去的执念之上，而过去已经永远无法挽回。",
  },

  // Chapter 3 Bosses
  void_emperor: {
    id: "void_emperor",
    name: "虚空帝皇",
    title: "深渊的主宰",
    chapter: 3,
    backstory:
      "深渊行者的领袖，自愿走入虚无之口并从中带回了可怕力量的存在。他曾经是一个充满好奇心的探索者，但在虚空中停留太久后，他的心智已经被虚无同化，成为了虚无意志的代言人。",
    motivation: "让整个世界回归虚无，因为存在的本身就是一种痛苦。",
    weakness: "虚无给予他的力量正在缓慢地吞噬他的存在本身，他也在成为虚无的一部分。",
  },
  flame_pope: {
    id: "flame_pope",
    name: "炎之教皇",
    title: "余烬盟约的至高祭司",
    chapter: 3,
    backstory:
      "余烬盟约的宗教领袖，坚信毁灭世界的火焰是神的净化。他在炎座之城中建立了最后的圣殿，用信徒的血肉作为燃料维持圣火的燃烧。他的身体早已被火焰侵蚀，但他认为这是荣耀的伤疤。",
    motivation: "点燃第二次净化之火，让这个世界完成第一次净化未竟的使命。",
    weakness: "他的信仰建立在对毁灭的美化之上，而真正的毁灭没有任何美感可言。",
  },
  rhythm_sovereign: {
    id: "rhythm_sovereign",
    name: "节奏之主",
    title: "脉搏核心的守护者",
    chapter: 3,
    backstory:
      "节奏行者中最强大的存在，曾经与脉搏核心融为一体。她能够感知整个遗迹的节奏，并用这力量影响现实。但核心的力量太过强大，她的意识正在被世界的节奏同化，逐渐失去自我。",
    motivation: "让整个世界与脉搏核心同步，达到完美的和谐。",
    weakness: "她正在失去作为个体的节奏，而没有个体的节奏，就没有真正的和谐。",
  },
  silent_oracle: {
    id: "silent_oracle",
    name: "默声神谕",
    title: "寂静之巅的最后僧侣",
    chapter: 3,
    backstory:
      "默声圣咏中唯一能够与世界残留意志直接交流的存在。她自愿献出了自己的声音，换来了倾听世界低语的能力。但世界低语中的信息太过沉重，她的沉默正在变成一种永恒的诅咒。",
    motivation: "传达世界最后的遗言，即使这遗言足以毁灭听到的人。",
    weakness: "她的力量来自沉默，而沉默最终会吞噬一切，包括她自己。",
  },
  gear_titan: {
    id: "gear_titan",
    name: "齿轮泰坦",
    title: "终末齿轮工厂的心脏",
    chapter: 3,
    backstory:
      "终末齿轮工厂的核心动力源，一个由无数齿轮组成的巨人。它没有意识，没有目的，只是按照最初的设定运转。但数百年来，它的运转已经扭曲了周围的空间，使工厂成为了一个没有出口的迷宫。",
    motivation: "继续运转，完成它从未被告知的目的。",
    weakness: "它只是在执行指令，而指令本身可能早已没有意义。",
  },
  world_bloom: {
    id: "world_bloom",
    name: "世界之花",
    title: "终末绽放的化身",
    chapter: 3,
    backstory:
      "终末绽放的核心意志，一朵即将绽放的变异巨花。它不是翠环教团创造的，而是这个世界本身在毁灭后的应激反应。它的绽放要么带来重生，要么带来终结，而这个决定取决于它吸收了多少生命的记忆。",
    motivation: "绽放，完成这个世界最后的选择。",
    weakness: "它的选择取决于吸收的记忆，而记忆可以被改变——如果能让它看到足够的希望，它或许会选择重生。",
  },
};
