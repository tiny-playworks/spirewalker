⸻

卡牌升级系统 — Cursor 可执行任务文档

目录

1. Task 1 — 提取现有卡牌 JSON
2. Task 2 — 自动生成升级规则
3. Task 3 — UI 升级标签 & 文案
4. Task 4 — 实现升级逻辑函数
5. Task 5 — 生成升级测试用例
6. Task 6 — 奖励/商店 升级集成
7. Task 7 — 升级 UI 对比提示

⸻

说明

输入： 现有卡牌定义
输出： 升级规则 JSON、升级逻辑代码、测试代码、UI 文案与组件模板
要求规范： 严格使用 JSON/TS/JS/DSL 可执行格式

⸻

⸻

Task 1 — 提取现有卡牌 JSON

目标： 从现有卡牌 TypeScript 定义中提取完整卡牌列表

输出格式（JSON）：

[
{
"id": "string",
"name": "string",
"type": "Attack | Skill | Power",
"cost": number,
"effectScript": "string",
"description": "string",
"tags": ["string"]
},
...
]

指令：

请提取项目中所有卡牌的基础定义并输出 JSON 数组格式。

⸻

Task 2 — 自动生成升级规则

目标： 根据 Task 1 输出自动生成升级规则

输出格式（JSON）：

[
{
"baseId": "string",
"levels": {
"1": {
"nameSuffix": "string",
"descriptionPatch": "string",
"scriptModifiers": ["string"]
},
"2": {
"nameSuffix": "string",
"descriptionPatch": "string",
"scriptModifiers": ["string"]
}
}
},
...
]

规则逻辑：

- level1 用基础数值 +20% 或类似增强
- level2 加更高效果或策略性额外逻辑

指令：

根据卡牌 JSON 生成升级规则 JSON，必须符合升级规则结构。

⸻

Task 3 — UI 升级标签 & 文案

目标： 生成每张卡牌升级后的 UI 文案和徽章显示数据

输出字段：

[
{
"cardId": "string",
"uiNameL1": "string",
"uiNameL2": "string",
"descriptionL1": "string",
"descriptionL2": "string",
"badgeL1": "string",
"badgeL2": "string"
},
...
]

示例：

{
"cardId": "strike",
"uiNameL1": "Strike+",
"uiNameL2": "Strike++",
"descriptionL1": "升级: 伤害提高 3 点",
"descriptionL2": "升级升级: 对弱化目标额外 +2 点伤害",
"badgeL1": "+",
"badgeL2": "++"
}

指令：

请生成卡牌升级 UI 文案和徽章。

⸻

Task 4 — 实现升级逻辑函数

目标： 编写 upgradeCard 函数

TS 签名：

function upgradeCard(player: PlayerState, cardId: string): PlayerState

功能要求：

- 查找 deck 内指定卡牌
- 检查升级规则
- 修改 cost/name/description/effectScript
- 返回更新后的 playerState

指令：

请实现 upgradeCard 函数并提供可编译 TypeScript 版本。

⸻

Task 5 — 生成升级测试用例

目标： 自动生成升级逻辑单元测试

测试框架： Jest / Vitest

示例测试项：

- 升级一次：伤害增加
- 升级两次：策略效果改变
- 升级后 cost 变化有效
- 不可升级卡不改变

指令：

请输出升级逻辑 test 文件。

⸻

Task 6 — 奖励/商店 升级集成

目标： 修改奖励逻辑以支持升级选项

要求：

- 在战斗奖励中加入可升级卡牌选项
- 在商店内支持消耗资源升级卡
- 界面显示可升级标记

指令：

请实现奖励系统升级集成逻辑与 Shop UI 入口。

⸻

Task 7 — 升级 UI 对比提示

目标： 实现升级前后效果对比 UI

要求：

- 显示 before/after 面板
- 数值高亮差异
- 支持 hover 显示 tooltip

指令：

请为卡牌升级界面生成升级前后对比 UI 组件模板。

⸻

输出里必须包含的内容

⚠️ 每份输出都必须包含：

内容 格式
规则 JSON JSON 文件
逻辑代码 TS
UI 文案 JSON
测试用例 TS
UI 组件 React/Phaser 代码

⸻

示例输出结构根路径

/src/game/cards/cardData.json
/src/game/cards/upgradeRules.json
/src/game/ui/cardUpgradeUI.tsx
/src/game/battle/upgradeLogic.ts
/src/game/**tests**/upgrade.test.ts

⸻

额外要求（重要）

✅ 所有 JSON 都必须可被 import 到代码中
✅ 所有 TS 逻辑必须可编译，无语法错误
✅ UI 组件具有最基本交互效果
✅ 测试覆盖单卡升级路径和组合升级场景

⸻
