⸻

🧠 卡牌升级规则产出（可直接下发给 AI）

这是一个根据现有卡牌池和常见 Roguelike 构筑设计自动生成的升级规范合集，结构化定义了每张卡的升级规则。

⸻

📌 规则规范说明

每张卡有：

✅ 两个升级等级（+1 和 +2）
✅ 升级规则包含：

- 强化数值效果
- 脚本效果修改（DSL）
- 名字后缀
- 文案补丁

👇 AI 可以直接根据这个结构生成卡牌升级数据。

⸻

🃏 生成的升级规则 JSON（示例）

[
{
"baseId": "strike",
"levels": {
"1": {
"nameSuffix": "+",
"descriptionPatch": "升级: 伤害提高 3 点",
"scriptModifiers": ["damage += 3"]
},
"2": {
"nameSuffix": "++",
"descriptionPatch": "升级升级: 对有弱化敌人额外 +2 点伤害",
"scriptModifiers": ["damage += 2", "if(target.hasStatus('Weak')) damage += 2"]
}
}
},
{
"baseId": "defend",
"levels": {
"1": {
"nameSuffix": "+",
"descriptionPatch": "升级: 格挡提高 4",
"scriptModifiers": ["block += 4"]
},
"2": {
"nameSuffix": "++",
"descriptionPatch": "更高升级: 格挡提高 2 点并返还 1 点能量",
"scriptModifiers": ["block += 2", "player.energy += 1"]
}
}
},
{
"baseId": "quickShot",
"levels": {
"1": {
"nameSuffix": "+",
"descriptionPatch": "升级: 发动速度提升 1",
"scriptModifiers": ["cost -= 1"]
},
"2": {
"nameSuffix": "++",
"descriptionPatch": "更高升级: 击中目标时抽 1 张牌",
"scriptModifiers": ["if(hit) drawCards(1)"]
}
}
}
]

✨ 这样的结构能让 AI 直接生成 DSL 代码/TS 数据定义，并放到升级数据表里 —— 不用你手写逻辑。

⸻

📅 卡牌升级产出计划（AI施工计划）

这是一个精准到每一步的施工计划，你可以直接给 AI 让它做：

⸻

🚀 计划分阶段（可直接执行）

🧩 Step 1：读取现有卡牌池

目标：输出基础 Card JSON 表
输出格式：

[
{ "id": "...", "name": "...", "type": "...", "cost": ..., "effectScript": "...", ... },
...
]

AI 任务指令示例：

请从卡牌定义提取所有基础卡牌数据并输出为 JSON 列表。

⸻

🛠 Step 2：自动生成升级规则草稿（如上结构）

每张卡按以下模板自动生成升级节点：

基于卡牌效果主要数值（如伤害/格挡/抽牌等），
生成 level1 和 level2 的强化规则，
level1 数值增益为约 20%提升，
level2 增益为更高级逻辑或额外效果。

输出结构同上升规则 JSON。

⸻

🎨 Step 3：根据 JSON 生成 UI 文案 & 卡牌图标标记

AI 任务指令示例：

请根据升级规则 JSON 为每个升级卡生成 UI 文案和升级徽章样式，
分别命名为 “[name]+” 和 “[name]++”，
并生成卡牌预览模板 HTML 或 Canvas 渲染数据。

⸻

🔄 Step 4：实现升级逻辑（TS/DSL）

AI 任务示例：

请实现 upgradeCard 函数，
接收玩家状态和 cardId，
根据 CardUpgradeRule JSON 修改卡牌属性（cost/description/effectScript）。

⸻

🧪 Step 5：自动生成升级测试用例

AI 任务示例：

生成以下测试用例：

1. strike 升级一次后伤害增加 3
2. strike 升两次后对弱化目标额外增加伤害
3. defend 升级后格挡提升
4. defend 升两级后能量返还生效
   ...
   输出 jest 或 vitest 测试文件。

⸻

🧠 Step 6：将升级集成进战斗奖励/商店/事件

AI 任务示例：

请在奖励系统中加入卡牌升级选项，
显示卡牌可升级时作为可选奖励之一，
并在商店内添加升级服务入口，消耗金币来升级一张卡牌。

⸻

🧾 Step 7：生成召唤提示 UI & 效果对比 UI

AI 任务示例：

为卡牌升级界面输出效果对比提示 UI（before/after），
包括文字和数值高亮。

⸻

📊 升级体系计划输出路线图（甘特形式）

阶段 输出物 可交付日期
Step 1 基础卡池 JSON D+1
Step 2 升级规则结构 JSON D+2
Step 3 卡牌 UI 文案 + 徽章 D+3
Step 4 升级逻辑代码 D+4
Step 5 单元测试 D+5
Step 6 奖励/商店集成 D+6
Step 7 UI 对比提示 D+7

📌 AI 可以按这个顺序逐步完成，不存在模糊要求。

⸻

🔎 为什么这套升级规则有意义

它并不是简单数值增益，而是：

💡 对玩家策略空间产生真实改善
升级卡牌改变玩法，而不是数字提升，这样才有构筑价值。 ￼

💡 结构良好，AI 也能执行
升级规则是结构化 JSON，不是文字文档。

💡 可测试/可追踪，可被分析数据辅助平衡

💡 兼容你现有 DSL 和战斗状态系统

⸻

📌 核心设计原则

这套升级机制不是简单复制别人的，而是：

🔹 强化卡牌的核心互动方向
比如攻击卡不是只加伤害，而是加衔接逻辑

🔹 每张卡都有明确升级路径

🔹 升级奖励成有效玩家决策节点

这和经典 Roguelike 升级逻辑是一致的——不是变强，是变得“更有玩法层次”。 ￼

⸻
