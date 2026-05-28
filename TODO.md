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
