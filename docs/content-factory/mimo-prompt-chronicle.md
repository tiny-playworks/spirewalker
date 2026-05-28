# mimo Prompt — 编年史（Chronicle）

> 复制下方「总调度 Prompt」整段发给 mimo。人类 review，mimo 只落盘 + `pnpm run build && pnpm run test`。

---

## 总调度 Prompt（复制从这里开始）

```text
你是 SpireWalker 世界观编剧。只写结构化编年史，不要写小说、不要聊天、不要问我问题。

## 任务

新建文件：`src/game/core/definitions/lore/chronicle.ts`

导出：
1. `ChronicleEntry` 接口（见下方 schema）
2. `CHRONICLE_ENTRIES: ChronicleEntry[]` — 恰好 **40 条**，按 `order` 从 1 到 40 排序
3. `ACT_CHRONICLE_SUMMARIES: Record<1|2|3, string>` — Act1/2/3 各一段 **120–180 字**中文，说明 Walker 在该幕 climbing 时在历史上对应什么阶段
4. `WALKER_ORIGIN: string` — **80–120 字**，解释 Walker（节奏行者）为何开始爬塔/穿遗迹

最后在 `src/game/core/definitions/lore/index.ts` 新建 barrel 导出（若不存在则创建）：
```ts
export * from './factions';
export * from './regions';
export * from './boss_lore';
export * from './chronicle';
```

完成后跑：`pnpm run build && pnpm run test`
失败则修 TS 类型错误，不要解释。

---

## 世界观前提（必须遵守，禁止改设定）

- 游戏名：SpireWalker。Roguelike 爬遗迹/塔，玩家角色 **Walker（行者）**，核心战斗机制是 **连势（momentum）/节奏**，对应势力 **rhythm_walkers（节奏行者）**。
- 世界曾经有一个 **高度文明**，已 **覆灭**（称为「第一次毁灭」或「大崩落」）。现在到处是废墟、变异、幽灵、机械还在执行过期指令。
- **不要 invent 新势力、新地区、新 Boss 名字**。只能使用下方白名单 id。
- 文风：黑暗奇幻、废墟文明、低魔超自然；**禁止网文腔、禁止「少年」「逆袭」「系统」**。
- 每条 `summary`：**80–150 汉字**，写「发生了什么」，不写抒情散文。

---

## Schema（必须完全一致）

```ts
export type ChronicleEra =
  | 'pre_collapse'      // 文明存续期（order 1–8）
  | 'the_collapse'      // 大崩落本身（order 9–14）
  | 'aftermath'         // 崩落后数百年（order 15–22）
  | 'act1_echo'         // 与 Act1 地图相关的近代余波（order 23–28）
  | 'act2_echo'         // 与 Act2 地图相关（order 29–34）
  | 'act3_echo';        // 与 Act3 地图相关（order 35–40）

export type EventTheme =
  | 'risk_reward'
  | 'curse_trade'
  | 'merchant'
  | 'memory'
  | 'corruption'
  | 'strange_machine'
  | 'ancient_shrine'
  | 'random_gamble';

export interface ChronicleEntry {
  id: string;              // snake_case，全局唯一，如 chron_01_golden_era
  order: number;           // 1–40，严格递增，无重复
  era: ChronicleEra;
  title: string;           // 4–12 字中文标题
  summary: string;         // 80–150 字
  factionIds: string[];    // 1–3 个，必须来自势力白名单
  regionIds: string[];     // 0–3 个，必须来自地区白名单；没有则 []
  bossLoreIds: string[];   // 0–2 个，必须来自 Boss 白名单；没有则 []
  eventThemes: EventTheme[]; // 1–2 个，用于后续 event 文案主题
  act?: 1 | 2 | 3;         // 仅 era 为 act*_echo 时必填
}
```

---

## 势力白名单（factionIds 只能用这些）

| id | 中文名 |
|----|--------|
| ancient_guardians | 远古守卫 |
| shadow_weavers | 织影者 |
| iron_pact | 铁誓盟约 |
| verdant_circle | 翠环教团 |
| void_seekers | 深渊行者 |
| rhythm_walkers | 节奏行者 |
| ashen_court | 灰烬宫廷 |
| tide_callers | 潮唤者 |
| ember_covenant | 余烬盟约 |
| silent_choir | 默声圣咏 |

---

## 地区白名单（regionIds 只能用这些）

**Act1（chapter 1）**
crumbling_outskirts, vine_choked_plaza, rusted_gateway, ash_merchants_lane, stillwater_canal, echo_library, first_ember_shrine

**Act2（chapter 2）**
shadow_meridian, shattered_cathedral, clockwork_depths, drowned_academy, thornwood_citadel, hollow_throne, whispering_rift

**Act3（chapter 3）**
pulse_nexus, void_maw, flame_throne_city, silent_apex, last_gearworks, final_bloom

---

## Boss 背景白名单（bossLoreIds 只能用这些）

**Chapter 1：** rusted_sentinel, phantom_merchant_king, canal_siren, thorn_mother

**Chapter 2：** shadow_regent, drowned_scholar, clockwork_overseer, throne_wraith

**Chapter 3：** void_emperor, flame_pope, rhythm_sovereign, silent_oracle, gear_titan, world_bloom

---

## 40 条槽位（按 order 逐条填写，id 建议用右侧建议 id）

### era = pre_collapse（order 1–8）文明存续期

| order | 建议 id | 必须涉及 | 写什么（一句话指引） |
|-------|---------|----------|----------------------|
| 1 | chron_01_golden_era | ancient_guardians, rhythm_walkers | 遗迹文明鼎盛，「脉搏核心」被发现，节奏行者开始守护世界节律 |
| 2 | chron_02_iron_pact_rise | iron_pact | 铁誓盟约成立，用机械延长文明寿命 |
| 3 | chron_03_verdant_experiment | verdant_circle | 翠环教团在广场培育共生植物，意图修复生态 |
| 4 | chron_04_shadow_mission | shadow_weavers, ancient_guardians | 织影者本是守卫者的暗影分支，负责处理「不可见威胁」 |
| 5 | chron_05_ash_court_peak | ashen_court | 灰烬宫廷全盛，灰商巷是最大贸易枢纽 |
| 6 | chron_06_tide_pact | tide_callers | 潮唤者控制运河网络，静水运河连接各城 |
| 7 | chron_07_ember_dogma | ember_covenant | 余烬盟约预言「净化之火」终将降临 |
| 8 | chron_08_silent_vow | silent_choir | 默声圣咏在寂静之巅立约：以沉默换取倾听世界意志 |

### era = the_collapse（order 9–14）大崩落

| order | 建议 id | 必须涉及 | 写什么 |
|-------|---------|----------|--------|
| 9 | chron_09_first_crack | void_seekers, pulse_nexus | 深渊行者打开第一道裂隙，虚空开始渗漏 |
| 10 | chron_10_gear_overload | iron_pact, last_gearworks | 铁誓工厂过载，齿轮泰坦的雏形开始无目的运转 |
| 11 | chron_11_flame_ignition | ember_covenant, first_ember_shrine | 第一次净化之火失控，余烬圣殿被点燃 |
| 12 | chron_12_world_scream | silent_choir, silent_apex | 世界意志发出最后尖啸，默声圣咏全员失语 |
| 13 | chron_13_collapse_day | （至少 4 个势力） | **核心条目**：大崩落当日，各势力同时崩溃的连锁反应 |
| 14 | chron_14_bloom_seed | verdant_circle, final_bloom | 世界之花种子在终末绽放深处埋下，作为应激反应 |

### era = aftermath（order 15–22）崩落后数百年

| order | 建议 id | 必须涉及 | 写什么 |
|-------|---------|----------|--------|
| 15 | chron_15_rusted_gate | iron_pact, rusted_sentinel, rusted_gateway | 锈蚀哨兵接到永不解除的守卫命令 |
| 16 | chron_16_phantom_market | ashen_court, phantom_merchant_king, ash_merchants_lane | 灰商巷变成幽灵集市 |
| 17 | chron_17_canal_drowning | tide_callers, canal_siren, stillwater_canal | 运河塞壬诞生，沉没学院开始下沉 |
| 18 | chron_18_thorn_fusion | verdant_circle, thorn_mother, vine_choked_plaza | 荆棘之母与广场藤蔓融合 |
| 19 | chron_19_shadow_betrayal | shadow_weavers, shadow_regent, shadow_meridian | 暗影摄政背叛远古守卫 |
| 20 | chron_20_clockwork_depth | iron_pact, clockwork_overseer, clockwork_depths | 发条监工接管发条深渊 |
| 21 | chron_21_throne_ghost | ashen_court, throne_wraith, hollow_throne | 王座亡灵占据空王座 |
| 22 | chron_22_walker_order | rhythm_walkers | 幸存的节奏行者订立新约：以连势为尺，丈量遗迹 |

### era = act1_echo（order 23–28）Act1 近代余波，每条 act: 1

| order | 建议 id | regionIds 至少含 | bossLoreIds 建议 | 写什么 |
|-------|---------|------------------|------------------|--------|
| 23 | chron_23_outskirts_lanterns | crumbling_outskirts | — | 外缘路灯仍自动点亮，守卫者残响 |
| 24 | chron_24_echo_library_seal | echo_library | — | 回声图书馆封存崩落前最后记录 |
| 25 | chron_25_merchant_king_deal | ash_merchants_lane | phantom_merchant_king | 商王与 Walker 的「交易」传说开端 |
| 26 | chron_26_siren_call | stillwater_canal | canal_siren | 塞壬歌声变强，拖走更多行者 |
| 27 | chron_27_sentinel_last_shift | rusted_gateway | rusted_sentinel | 哨兵最后一次「换岗」其实是空转 |
| 28 | chron_28_act1_boss_week | vine_choked_plaza | thorn_mother | Act1 末尾：巢母/荆棘势力在广场集结（对接 slime_boss 遭遇氛围，不要 invent 新 boss 名） |

### era = act2_echo（order 29–34）Act2，每条 act: 2

| order | 建议 id | regionIds 至少含 | bossLoreIds 建议 | 写什么 |
|-------|---------|------------------|------------------|--------|
| 29 | chron_29_cathedral_schism | shattered_cathedral | — | 大教堂分裂，静默与暗影争夺祭坛 |
| 30 | chron_30_drowned_dean | drowned_academy | drowned_scholar | 沉没学者仍在水下查「如何阻止已发生的事」 |
| 31 | chron_31_whispering_rift | whispering_rift | shadow_regent | 低语裂隙扩大，织影者之网覆盖 Act2 |
| 32 | chron_32_thornwood_siege | thornwood_citadel | — | 荆棘要塞与机械前线对峙 |
| 33 | chron_33_dual_core_whisper | clockwork_depths | clockwork_overseer | 双核/机械异象，主教（act2_boss_silence）相关的静默处刑传说 |
| 34 | chron_34_act2_court_decay | hollow_throne | throne_wraith | Act2 末尾：灰烬宫廷全面幽灵化 |

### era = act3_echo（order 35–40）Act3，每条 act: 3

| order | 建议 id | regionIds 至少含 | bossLoreIds 建议 | 写什么 |
|-------|---------|------------------|------------------|--------|
| 35 | chron_35_pulse_awakening | pulse_nexus | rhythm_sovereign | 脉搏核心苏醒，节奏之主开始同化 |
| 36 | chron_36_void_maw_open | void_maw | void_emperor | 虚无之口张开，虚空帝皇代言深渊 |
| 37 | chron_37_flame_second_purge | flame_throne_city | flame_pope | 余烬盟约筹备「第二次净化」 |
| 38 | chron_38_silent_oracle | silent_apex | silent_oracle | 默声神谕准备传达「世界遗言」 |
| 39 | chron_39_gearworks_maze | last_gearworks | gear_titan | 终末齿轮工厂变成无出口迷宫 |
| 40 | chron_40_final_bloom_choice | final_bloom | world_bloom | **终局条目**：世界之花即将绽放，重生或终结取决于 Walker 带入的记忆 |

---

## ACT_CHRONICLE_SUMMARIES 写什么

```ts
export const ACT_CHRONICLE_SUMMARIES: Record<1 | 2 | 3, string> = {
  1: '...', // Act1：Walker 进入遗迹外缘，面对「大崩落余波」——幽灵商业、锈蚀命令、变异植物初潮
  2: '...', // Act2：深入暗影/机械/沉没知识，各势力 middle-game 博弈
  3: '...', // Act3：抵达核心带，虚空/火焰/节奏/默声/齿轮/世界之花汇聚终局
};
```

## WALKER_ORIGIN 写什么

- Walker 是 **rhythm_walkers** 后裔或末裔传人
- 开始旅程的原因：**脉搏核心/世界之花/锈蚀之门的某道召唤**（三选一写清楚，不要全写）
- 与 **连势（momentum）** 的关系：一行说明
- **不要**写 Walker 是「天选之子」或「唯一救世主」

---

## 完整示例（模仿此格式，不要照抄原文）

```ts
{
  id: 'chron_15_rusted_gate',
  order: 15,
  era: 'aftermath',
  title: '锈蚀之门的永役',
  summary: '大崩落后的第三Winter，铁誓盟约将最后一道城门封死。指令写入齿轮核心：守卫锈蚀之门，直至解除。下达指令的监工早已化为灰烬，但锈蚀哨兵仍在门后换岗。它不知道城市早已不存在，只知道少转一圈便是背叛盟约。',
  factionIds: ['iron_pact'],
  regionIds: ['rusted_gateway'],
  bossLoreIds: ['rusted_sentinel'],
  eventThemes: ['memory', 'ancient_shrine'],
},
```

---

## 禁止事项

1. 禁止 invent 白名单外的 id
2. 禁止 order 重复或跳过（必须 1–40 连续）
3. 禁止单条 summary 超过 150 字或少于 80 字
4. 禁止输出 markdown 说明，只输出 TS 文件
5. 禁止修改 factions.ts / regions.ts / boss_lore.ts
6. 禁止使用 Lich King、Fire Lord 等 art_prompts 里的泛用 fantasy 名

---

## 自检清单（完成后逐项 grep）

- [ ] `CHRONICLE_ENTRIES.length === 40`
- [ ] 每条 factionIds 非空
- [ ] act1_echo 的 6 条都有 `act: 1`；act2_echo 有 `act: 2`；act3_echo 有 `act: 3`
- [ ] 14 个 bossLoreIds 至少各出现 1 次（在 40 条里覆盖全部 Boss lore）
- [ ] 20 个 regionIds 至少各出现 1 次
- [ ] `pnpm run build` 通过

开始写文件。不要解释。
```

---

## 人类 review 重点

| 检查 | 说明 |
|------|------|
| id 白名单 | grep 有无 invent 势力/地区 |
| Boss 覆盖 | 14 个 boss lore 是否都被引用 |
| order 连续 | 1–40 无洞 |
| 与 Boss lore 矛盾 | 例如 rusted_sentinel 必须守 rusted_gateway，不要写成守别的门 |
| Walker 设定 | 别太中二，贴合 rhythm_walkers + momentum 机制 |

## 后续（可选 Phase）

编年史 merge 后，再让 mimo 用 `CHRONICLE_ENTRIES` 反写 10 条 `art_prompts_linked` Boss prompt（id 改为 `linked_rusted_sentinel` 等，对齐 boss_lore.ts）。
