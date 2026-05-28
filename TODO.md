# SpireWalker 内容资产工厂计划（48 小时冲刺版）

来源：`SpireWalker_Claude_Task_Template.md`

## 项目背景

SpireWalker 是一个受《杀戮尖塔》启发的 Roguelike Deckbuilder 项目。

### 技术架构

- React + TypeScript
- Phaser.js（战斗/地图表现）
- 纯 TypeScript Core（游戏规则）
- 数据驱动设计
- 卡牌 / Relic / 事件 / 敌人全部结构化配置

### 当前目标

在 48 小时内利用 Claude 批量生成可运行、可扩展、可迭代的游戏内容资产。

### 你现在扮演

- 游戏内容设计师
- 卡牌设计师
- 数值策划
- 世界观编写者
- Roguelike 系统设计师

### 输出内容必须

- 数据驱动、可结构化
- 可程序消费
- 避免纯文学废话
- 优先考虑玩法组合与系统性

---

## 输出规范

- 优先输出 JSON 或 TypeScript 对象
- 字段固定，全部必须填写
- 避免模糊描述
- 数值明确，文本简洁可读

---

## 阶段 1：卡牌系统生成

### 目标

生成 300~500 张卡牌。

### 约束

- 分类：`Attack / Skill / Power / Curse / Status`
- 稀有度：`Common / Uncommon / Rare / Legendary`

### 输出示例

```ts
{
  id: "strike_flame_001",
  name: "炎斩",
  type: "Attack",
  rarity: "Common",
  cost: 1,
  target: "Enemy",
  tags: ["burn", "starter"],
  description: "造成8点伤害。施加2层燃烧。",
  effects: [
    { type: "damage", value: 8 },
    { type: "apply_status", status: "burn", value: 2 }
  ],
  upgrade: { damage: 3, burn: 1 }
}
```

### 设计要求

- 不重复，强调 Build 联动、状态机制、Combo
- 包含高风险高收益设计，且一部分带副作用
- 支持流派：`Burn / Poison / Bleed / Momentum / Exhaust / Self Damage / Block Counter / Energy Ramp / Draw Combo / Summon / Risk Gamble`

---

## 阶段 2：Relic 系统生成

### 目标

生成 150 个 Relic。

### 输出示例

```ts
{
  id: "relic_blood_clock",
  name: "猩红时钟",
  rarity: "Rare",
  trigger: "battle_start",
  description: "战斗开始时失去5生命，获得2力量。",
  effects: [
    { type: "lose_hp", value: 5 },
    { type: "gain_strength", value: 2 }
  ]
}
```

### 设计要求

- 能改变规则、抽牌逻辑或地图逻辑
- 包含部分诅咒型或高风险 Relic

---

## 阶段 3：敌人与 Boss

### 目标

- 100 个普通敌人
- 20 个 Elite
- 12 个 Boss

### 输出示例

```ts
{
  id: "enemy_ash_knight",
  name: "灰烬骑士",
  hp: 120,
  intents: [
    { turn: 1, action: "attack", value: 14 },
    { turn: 2, action: "apply_burn", value: 3 }
  ],
  traits: ["burn", "armor"],
  description: "被火焰侵蚀的旧王国骑士。"
}
```

### 设计要求

- Boss 必须有阶段切换、机制变化、Build Check、明显主题

---

## 阶段 4：事件系统

### 目标

生成 200 个事件。

### 类型

`Risk Reward / Curse Trade / Merchant / Memory / Corruption / Strange Machine / Ancient Shrine / Random Gamble`

### 输出示例

```ts
{
  id: "event_blood_pool",
  title: "血池",
  description: "漆黑洞穴中，一座翻涌的血池正在低语。",
  choices: [
    {
      text: "浸入血池",
      result: [
        { type: "gain_max_hp", value: 8 },
        { type: "gain_curse", curse: "blood_mark" }
      ]
    },
    { text: "离开", result: [] }
  ]
}
```

### 设计要求

- 强调长期代价、Build 选择、世界观氛围
- 部分事件永久改变规则

---

## 阶段 5：地图与路线机制

### 目标

- 地图节点类型
- 特殊路线机制
- Act 特性
- 地图 Modifier

### 设计要求

不同路线形成不同 Build 倾向（高风险高收益、偏资源、偏事件），并在 Boss 前形成路线压力。

---

## 阶段 6：世界观与文本资产

### 目标

- 势力
- 地区
- Boss 背景
- 卡牌关键词来源
- 地图区域描述

### 风格约束

黑暗奇幻、废墟文明、低魔 + 超自然、简洁、神秘、留白、避免网文味。

---

## 阶段 7：美术 Prompt 工厂

### 目标

生成 AI 绘图 Prompt：卡牌、Boss、敌人、地图、UI、Relic。

### 输出示例

```json
{
  "subject": "Ash Knight",
  "prompt": "dark fantasy ruined knight, ember armor, glowing cracks, cinematic lighting, roguelike card art, detailed illustration"
}
```

### 设计要求

- 统一风格，偏暗黑幻想，避免二次元手游感

---

## 最终目标

- 可直接导入项目的数据资产
- 可快速迭代内容库
- 支撑 20~50 小时游玩内容
- 为平衡与 UI 演出提供素材基础
- 每阶段输出完整结构，直接进入内容生成，不要解释、不要总结

---

## 执行进度

### 总览

| 资产 | 目标 | 实际 | 状态 |
|------|------|------|------|
| Relic | 130 | 133 | ✅ |
| Event | 200 | 200 | ✅ |
| 卡牌 | 500 | 542 | ✅ |
| 敌人 | 80 | 80 | ✅ |
| 美术 prompt | 800 | 805 (+ 520 extra) | ✅ |
| 世界观 | 10+20+12 | 10+20+14 | ✅ |
| Upgrade 规则 | ~218 | 218 | ✅ |
| Critique+Revise | 全量 | 通过 | ✅ |

---

### 1. 卡牌 (542 张)

**新增 218 张**，原有 324 张。

| 流派 | Common | Uncommon | Rare | 小计 | 文件 |
|------|--------|----------|------|------|------|
| guard | 35+15 | 22+7 | 15+8 | 72+30=102 | `guard/common.ts` + `generated_c.ts` |
| burst | 27+15 | 18+5 | 15+15 | 60+35=95 | `burst/common.ts` + `generated_b.ts` |
| mixed | 23+15 | 14+5 | 10+10 | 47+30=77 | `mixed/common.ts` + `generated_a.ts` |
| neutral | 35+15 | 16+5 | 12+10 | 63+30=93 | `neutral/common.ts` + `generated_d.ts` |
| curse | 20 | — | — | 20 | `curse/curse.ts` |
| status | 15 | — | — | 15 | `status/status.ts` |
| starter | 45 | — | — | 45 | `starter.ts` |

- 所有新卡已分配 `chapter: 1|2|3`
- 所有新卡已分配 `archetype` 字段
- Upgrade 规则：218 条，全部有 level 1 (+) 和 level 2 (++)

**接入方式：** 各 `index.ts` barrel 自动 merge，`ALL_CARD_DEFINITIONS` 包含全部 542 张。

---

### 2. 遗物 (133 个)

**新增 115 个**，原有 18 个。

| 批次 | 数量 | 文件 |
|------|------|------|
| batch1 | 50 | `generated_relics/batch1.ts` |
| batch2 | 50 | `generated_relics/batch2.ts` |
| batch3 | 33 | `generated_relics/batch3.ts` |

主题分布：连势(20+) / 格挡(20+) / 爆发(20+) / 通用(15+) / 联动(15+) / Boss(4)

**接入方式：** `generated_relics/index.ts` 导出 `GENERATED_RELICS`，需手动 merge 到 `relics.ts` 的 `RELIC_DEFINITIONS` 或运行时注册。

---

### 3. 事件 (200 个)

**全部新增**，原有 0 个。

| 批次 | 数量 | 文件 |
|------|------|------|
| batch1 | 70 | `events/batch1.ts` |
| batch2 | 70 | `events/batch2.ts` |
| batch3 | 60 | `events/batch3.ts` |

类型分布：risk_reward(26) / curse_trade(27) / merchant(24) / memory(26) / corruption(25) / strange_machine(23) / ancient_shrine(25) / random_gamble(24)

章节分布：Ch1(69) / Ch2(64) / Ch3(67)

**接入方式：** `events/index.ts` 定义类型并导出 `EVENT_DEFINITIONS`，按章节/类型分组。

---

### 4. 敌人 (80 个)

**新增 44 个**（原 36 个 → 80 个）。

| 章节 | Normal | Elite | Boss | 小计 |
|------|--------|-------|------|------|
| Ch1 | 30 | 4 | 2 | 36 |
| Ch2 | 20 | 4 | 2 | 26 |
| Ch3 | 10 | 4 | 4 | 18 |

Boss 全部使用 `phases` 阶段切换 AI，HP 阈值触发。

**接入方式：** `monsters/generated/index.ts` 导出 `ALL_GENERATED_ENEMIES`，需 merge 到 `definitions.ts`。

---

### 5. 世界观 (44 条)

| 类型 | 数量 | 文件 |
|------|------|------|
| 势力 | 10 | `lore/factions.ts` |
| 地区 | 20 | `lore/regions.ts` |
| Boss 背景 | 14 | `lore/boss_lore.ts` |

势力：远古守卫 / 织影者 / 铁誓盟约 / 翠环教团 / 深渊行者 / 节奏行者 / 灰烬宫廷 / 潮唤者 / 余烬盟约 / 默声圣咏

地区分布：Ch1(7) / Ch2(7) / Ch3(6)

---

### 6. 美术 Prompt (805 + 520)

| 文件 | 数量 | 类别 |
|------|------|------|
| `art_prompts.ts` | 805 | card(100) / enemy(100) / relic(80) / map(60) / event(100) / ui(80) / world(100) / boss_splash(80) / character(50) / misc(55) |
| `art_prompts_extra.ts` | 520 | map(60) / event(100) / ui(80) / world(100) / boss_splash(80) / character(50) / misc(50) |

格式：`{ id, category, subcategory, prompt, style, aspect_ratio }`

---

### 7. Upgrade 规则 (218 条)

**文件：** `cards/generated_upgrade_rules.ts`

覆盖全部 218 张新卡，每张有 level 1 (+) 和 level 2 (++)。已 merge 到 `upgradeRules.ts` 的 `CARD_UPGRADE_RULES`。

---

## 验证结果

- `npx tsc --noEmit` — **零错误**
- `pnpm run build` — **构建成功** (2017 kB)
- `pnpm run test` — **全部通过**
- `rewardCardPool.length` — 383 张（测试已更新期望范围）
