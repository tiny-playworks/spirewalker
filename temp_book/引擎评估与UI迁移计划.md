# 引擎评估 + Phaser 化 / 引擎迁移计划

> 对应创始人反馈 #2 / #4 / #6 / #7 / #8 的落地与下一步计划。
> 本轮已把「可以在 React 侧速胜完成」的反馈点做掉，剩余的是需要触碰 BattleScene / Phaser 渲染层的改动，做成连续可执行计划留下。

---

## 1. 现状：职责分层一览

| 层级             | 所在位置                                              | 负责做什么                                                                                                  |
| ---------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 规则 / 数据      | `src/game/core/**`                                    | `RunState` / `BattleState` / `CardDefinition` / `GameEngine.dispatch` 等纯逻辑；所有状态只由 command 推进。 |
| Phaser 渲染      | `src/game/phaser/scenes/**`、特别是 `BattleScene`    | 战斗场景：敌我单位、出手动画、**手牌条**、**抽/弃/消三堆**、弹幕与场面布景；摄像机与分层也在此。                 |
| React HUD / 屏幕 | `src/features/**`                                     | 战斗外的所有屏幕（地图、商店、奖励、休息、总览…）以及战斗时的 `BattleHUD`（**回合、能量、敌意图、结束回合等顶栏**，不含手牌与牌堆绘制）。 |
| 桥接层           | `src/features/phaser/**`、`src/features/battle/**`    | React ↔ 指令与状态订阅；**场内地形类 UI（手牌、三堆、单位状态条）在 Phaser**，顶栏操作与聚合信息在 React。     |

关键事实：**手牌与抽/弃/消三堆、单位脚下状态条在 Phaser `BattleScene` 中绘制**；**`BattleHUD` 负责顶栏战斗信息（回合、能量、意图、按钮等）**。二者分工，而非「全部战斗 UI 在 React」。

---

## 2. 本轮已完成

### 2.1 React 侧速胜

| 反馈点 | 实现内容                                                                                                                                       | 影响文件                                                                                                           |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| #1     | Act1 地图 14 层 → 12 层（~-14%），同步更新节奏相关测试与分支补给保底逻辑。                                                                       | `generateBranchingFloor.ts`、`mapGeneration.test.ts`                                                              |
| #3     | 「总览」面板里加按类型分组的牌组查看器（attack / skill / power / exhaust / junk / other），带计数。                                             | `RunOverviewPanel.tsx`                                                                                             |
| #4 A   | `BattleHUD` 顶栏四堆数量 + `title` 回洗/各堆说明；与 Phaser `PileStack` 场边展示并存。                                                                 | `BattleHUD.tsx`、`BattleScene.ts`、`PileStack.ts`                                                                  |
| #5     | 新增 2 张消耗牌：`燃锋 burn_edge`（14 伤害，消耗）、`清念 clear_mind`（抽 2 + 2 能量，消耗），配合现有循环牌。`exhaustOnPlay` flag + 事件体系。 | `card.ts` / `starter.ts` / `playCard.ts` / `events/types.ts`                                                       |
| #8 A   | 「总览」面板追加「流派身份」板块：逐条列出角色的构筑分支，按「核心卡 / 核心遗物」命中情况打出 x/3 评分，帮助玩家识别当前构筑方向。              | `RunOverviewPanel.tsx`                                                                                            |
| 升级系统 | 33 张卡的 `+` / `++` 规则；商店有升级服务、战后奖励可放弃三选一改为升级，UI 提供 before/after 对照；单元测试覆盖数据、商店、奖励三条入口。    | `upgradeRules.ts` + 商店 / 奖励 resolver、flow、页面，`tests/cards,shop,reward/*Upgrade.test.ts`                    |

### 2.2 Phaser 侧（本轮补齐）

| 反馈点 | 实现内容                                                                                                                                                 | 影响文件                                                                                             |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| #2     | `UnitStatusBar` 挂在玩家 / 每个敌人模型正下方，按状态 id 上色，展示短标签 + 层数。`BattleScene.battleVisualKey` 把 `statuses` 纳入差量，状态变化即时重绘。 | `src/game/phaser/scenes/battle/UnitStatusBar.ts`、`BattleScene.ts`                                 |
| #4 B   | `PileStack` 组件在战场底角画抽 / 弃 / 消三堆卡背 + 计数（数量为 0 时半透明）。引擎层新增 `DRAWPILE_RESHUFFLED` 事件，scene 捕获后播放弃 → 抽的飞行动画。 | `src/game/phaser/scenes/battle/PileStack.ts`、`BattleScene.ts`、`events/types.ts`、`playCard.ts`、`turnFlow.ts` |
| #6 B   | 单位状态条 / 三堆 / **手牌渲染**均在 Phaser；React `BattleHUD` 保留顶栏（回合、能量、意图、按钮等）。                                                                  | 同上 + `BattleScene.renderHand`                                                                      |
| #8 B   | 每张基础卡（含升级版）自动打 `guard / burst / mixed / neutral` 流派标签；Phaser 手牌右下画彩色圆点；React 商店 / 奖励 / 总览 / 升级对照面板统一复用 `ArchetypeDot`；总览面板新增「牌组流派分布」chip 组。 | `archetypes.ts`、`ArchetypeDot.tsx`、`BattleScene.ts`、`RunOverviewPanel.tsx`、`ShopPage.tsx`、`RewardPage.tsx`、`CardUpgradeList.tsx`、`tests/cards/archetypes.test.ts` |
| #8 C   | 遗物同步打流派标签；商店遗物行 / 奖励遗物条 / 战斗 HUD 遗物 pill / 总览「核心遗物」与「已持有遗物」都挂 `ArchetypeDot`；奖励三选一在牌组已明显偏向一派时做权重倾斜（同派/混合 ×2、对立派 ×0.5），用 `getDominantArchetype`（守/爆 >=4 且领先 2×）作为触发门槛。覆盖 100 个 seed 的分布测试保证倾斜可复现。 | `archetypes.ts`、`generateRewardChoices.ts`、`BattleHUD.tsx`、`ShopPage.tsx`、`RewardPage.tsx`、`RunOverviewPanel.tsx`、`tests/cards/archetypes.test.ts`、`tests/reward/rewardArchetypeTilt.test.ts` |

> 测试总览：本轮 rstest → 190 passed / 0 failed（此前 `engine.test.ts` 两条 AI 红线本次同样复跑通过，可能是上轮模块加载顺序引起的偶发，需要继续观察；若后续再红再定位）。

---

## 3. 下一轮：继续加深 Phaser 化 & 内容层

> #2 单位状态条、#4 三堆 + 回洗动画已经在 2.2 落地；下面是继续推进的内容层与视觉升级。

### 3.1 已落地说明

- **#2 单位状态条**：`UnitStatusBar` 用色块 + 短标签（出自 `STATUS_DEFINITIONS.shortLabel`）搭配层数；色码见 `UnitStatusBar.colorForStatus()`。接入位置在 `refreshStatusBars()`，与 `rebuildPlayerDisplay` / `rebuildEnemyDisplay` 使用同一 visualKey，状态增减实时重绘。美术进场时只需把色块替换成 `scene.add.image(statusId)` 就好。
- **三堆可视化（Phaser，对应反馈 #4）**：`PileStack` 画 3 层叠放卡背 + 数字 + 类型标签；抽 / 弃堆并列在左下，消耗堆在右下。战斗开始 / 重入时在 `create()` 里新建，shutdown 时通过 `resetBattleUi()` 清零引用，避免场景重入后访问已销毁对象。
- **#4 B 回洗动画**：`drawAdditionalCards` / `drawUpTo` 在触发 `drawPile = [...discardPile]` 那一刻 push `DRAWPILE_RESHUFFLED`（带 `fromDiscardCount`），`BattleScene.update()` 捕获后播 1~5 张卡背从弃牌堆飞向抽牌堆的 tween，并顶出一行「弃牌堆回洗」提示文字。快进模式下 tween 压缩到 140ms，避免拖慢自动跑步。

### 3.2 反馈 #6 — 更多 UI 搬进 Phaser

**现状（2026-04 勘误）**：**手牌**与**抽/弃/消三堆**、**单位状态条**、场上飘字等均在 **Phaser `BattleScene`**；**`BattleHUD`** 承载 **顶栏**（回合、能量、敌意图、结束回合 / 选目标等）——与「全部在 React」的旧假设不同。

**讨论**：把所有 UI 搬进 Phaser 有成本（需要自己实现按钮、文本排版、阴影、主题色、长文本换行等），收益是：

- 便于统一做「一张大 canvas」的视觉风格、抗锯齿、粒子特效叠加；
- 避免 React/DOM 重排在战斗高频动画下的帧抖（目前没观察到，但潜在风险）；
- 方便把整张战斗截图做相机摇晃、动态模糊。

**建议分级迁移**（不一次性切）：

| 阶段 | 内容 | 原因 / 状态 |
| ---- | ---- | ----------- |
| A（已完成）| 顶栏 **回合 / 能量 / 意图 / 按钮** 等在 React `BattleHUD` | DOM 迭代快；与 Phaser 场地区分工清晰。 |
| B（**已完成**）| 单位状态条（#2）、四堆（#4）在 Phaser | 强绑定世界坐标；见 §2.2、§3.1。 |
| C（**渲染已达成，余量 polish**）| 手牌已在 `BattleScene.renderHand`；React 仍保留顶栏与操作 | 手牌拖拽 / hover 已在 Phaser；**余量**：粒子与演出、可选是否将「结束回合」迁入 Phaser。 |
| D（长期）| 整个战斗 HUD 都在 Phaser，React 只剩战斗外屏幕 | 与换引擎评估挂钩；未排期。 |

### 3.3 反馈 #7 — 换引擎评估（Phaser vs Pixi / 3D）

| 维度         | Phaser 3（现状）                                                 | Pixi 7/8                                                                                        | 3D（three.js / babylon.js）                                                |
| ------------ | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 绑定         | 已经深度用了 scene / tween / arcade physics，改代价大。         | 仅渲染 + 简单交互，需要自己搭 scene graph / tween / 音效。                                       | 渲染能力最强，但几乎所有玩法逻辑要重写。                                   |
| 2D 表现上限 | 内置文本 / 粒子 / tween / spritesheet 够用，极致表现偏弱。        | 更接近"裸 WebGL"，手写粒子 / shader 更灵活，最终表现可以显著更漂亮。                              | 3D 镜头 / 光照 / 景深是量级的视觉升级，但本项目卡牌战斗受益一般。         |
| 包体         | ~1.3 MB（gzipped）。                                             | ~450 KB（gzipped），显著更小。                                                                  | 500 KB ~ 1.5 MB+（看用不用 postprocessing）。                               |
| 开发速度     | 现成 API 成熟，直接产出。                                       | 需要自己造很多轮子，初期显著慢于 Phaser。                                                       | 3D 资源与编排开销大，会严重拖慢内容迭代节奏。                              |
| 团队熟悉度   | 已有积累（BattleScene、事件驱动桥接已成型）。                   | 社区 API 与 Phaser 差异大，有一定学习成本。                                                      | 从 2D 切到 3D 相当于换项目。                                               |

**结论（推荐）**：

1. **短期保留 Phaser**：本项目所有玩法逻辑已经写在纯 TS core 里，渲染层本就是「可替换」的；Phaser 不是瓶颈。
2. **B 已完成**；后续以 **C 的余量（粒子 / 相机 / polish）** 与 **§3.4 内容层** 为主，让 Phaser 把「单位 / 堆 / 手牌交互」侧继续打磨到位。
3. **如果某一版美术升级，目标是 Hades / Slay the Spire 级别的 2D 氛围**，再考虑切 Pixi + 自研 ECS；**不是因为 Phaser 不够用才换，而是因为我们开始追求更高的视觉门槛**。
4. **不建议转 3D**：卡牌 Roguelike 的镜头与战斗编排上，3D 更多的是负担而非收益。

> 这条结论可以直接作为本轮对创始人反馈的答复：**当前不换引擎，但把 Phaser 用得更深；等美术升级那天再评估 Pixi。**

### 3.4 反馈 #8 — 流派身份

**现状（本轮已做）**：

1. 每张基础卡（含升级版）都自动打了 `guard / burst / mixed / neutral` 流派标签，见 `src/game/core/definitions/cards/archetypes.ts`。`getCardArchetype` 会把 `+` / `++` 版本映射回基础 id，保证升级不破标签。
2. Phaser `BattleScene` 在手牌右下画一颗 14px 彩色圆点（守=蓝 / 爆=红 / 混=紫），neutral 不画以免噪音；React 侧商店、奖励、升级对照、总览牌组列表统一用 `ArchetypeDot` 组件。
3. `RunOverviewPanel` 在「流派身份」板块顶部加了一组「牌组流派分布」chip（`守 N / 爆 N / 混 N / 通用 N`），方便玩家一眼看出自己的牌组现在偏哪派。

**下一轮要补的**（需要内容 / 平衡改动）：

1. 每个流派补 1~2 件"流派专属遗物"与 2 张"流派旗帜牌"（命名 / 描述明显带风格），让新玩家第一眼就能通过卡牌区分方向。
2. 奖励权重倾斜倍率仍为同派 / 混合 ×2、对立派 ×0.5；开关已抽到 `src/game/core/config/rewardTuning.ts`（`REWARD_ARCHETYPE_TILT_ENABLED`），后续可接配置面板 / 角色差异。
3. 遗物流派归类本轮按保守口径（攻伤/消耗相关=burst，格挡/稳势相关=guard，两派都补续航=mixed）；需要和策划最终对一遍，可能有微调。

---

## 4. 时间估算（人日）

| 任务                         | 估时         | 备注                                                 |
| ---------------------------- | ------------ | ---------------------------------------------------- |
| 3.1 / 3.2 已完成（#2 / #4）  | —            | 本轮已落地，见 2.2。                                  |
| 3.4 卡面 + 总览流派标记      | —            | 本轮已落地，见 2.2 #8 B。                             |
| 3.4 遗物流派标签 + 权重倾斜  | —            | 本轮已落地，见 2.2 #8 C；测试覆盖分布可复现。          |
| 3.2 手牌 → Phaser（#6 C）   | ~~2~~        | **2026-04**：手牌渲染已在 Phaser；本行历史估时见 §6.2 / §6.5，不再作为收口口径。 |
| 3.4 流派专属内容             | 1~2          | 需要策划定内容（遗物名/数值/剧情旗帜）；估时见 **§6.5**。           |

> **2026-04 更新**：经 **§6** 对账，#6 C 的「手牌迁 Phaser」目标已**基本达成**；**剩余收口以 §6.5 的 P0/P1/P2 与 §6.5 估时为准**，不再使用「2～3 天含 #6 C」的旧合订口径。

---

## 5. 风险与收尾建议

- **不要在这一轮同时换引擎 + 做内容**。任何一条都能把进度卡死，而当前玩法本身（Act2 通关率）更值得继续投人。
- **Phaser 化的每个子任务都要带回归测试**。`BattleScene` 目前没有单元测试，新增的 `UnitStatusBar` / `PileStack` 尽量写成纯函数 + 数据驱动，方便在 node 侧做 DOM-free 单测。
- **状态条和堆的 UI 都是数据驱动的**：只要 core 发事件 / 更新 `BattleState`，Phaser 下一帧就会拉新数据重绘。新增消耗牌、新状态时不需要额外改 Phaser。

---

## 6. 代码对账与剩余规划（2026-04）

> 本节将当时文档撰写假设与**当前仓库**对齐，并作为 **§4 历史估时** 的更新依据；新人可优先阅读 **§6.3**、**§6.5**。

### 6.1 §2 完成项对账（文档 vs 仓库）

| 反馈点 | 文档原述 | 仓库现状 | 结论 |
| ------ | -------- | -------- | ---- |
| #1 | Act1 12 层、测试与保底 | `generateBranchingFloor.ts`、`tests/core/mapGeneration.test.ts` 等 | 已对齐 |
| #3 | 总览牌组按类型分组 | `RunOverviewPanel.tsx` | 已对齐 |
| #4 A | `BattleHUD` 顶栏四堆 + hover | **`BattleHUD` 含抽/手/弃/消 chip + `title`**；Phaser `PileStack` 仍为场边主视觉 | **已对齐**（双显） |
| #5 | `burn_edge` / `clear_mind` 等 | `starter.ts`、`playCard.ts`、事件类型等 | 已对齐 |
| #8 A | 总览「流派身份」 | `RunOverviewPanel.tsx` | 已对齐 |
| 升级系统 | +/++ 与商店/奖励/测试 | `upgradeRules.ts`、`tests/cards,shop,reward/*Upgrade*.test.ts` | 已对齐 |
| #2 | `UnitStatusBar` | `src/game/phaser/scenes/battle/UnitStatusBar.ts`、`BattleScene.ts` | 已对齐 |
| #4 B | 三堆 + 回洗动画 | `PileStack.ts`、`BattleScene.ts`、`DRAWPILE_RESHUFFLED` 链路 | 已对齐 |
| #6 B | 状态条 / 堆 / 与 HUD 分工 | Phaser 场边 `PileStack` + 条；`BattleHUD` 含四堆数字 chip | 已对齐 |
| #8 B | 流派标签、`ArchetypeDot`、手牌圆点 | `archetypes.ts`、`ArchetypeDot.tsx`、`BattleScene.ts` 等 | 已对齐 |
| #8 C | 遗物标签与奖励倾斜 | `generateRewardChoices.ts`、`tests/reward/rewardArchetypeTilt.test.ts` 等 | 已对齐 |

### 6.2 §3.2 分级路线图对账（A–D）

| 阶段 | 文档目标 | 当前仓库 | 备注 |
| ---- | -------- | -------- | ---- |
| A | React `BattleHUD` 可读能量等 | `BattleHUD`：回合、能量、敌意图、结束回合 / 选目标等 | 已完成 |
| B | 单位状态条、四堆 Phaser | `UnitStatusBar` + `PileStack` 于 `BattleScene` | **已完成** |
| C | 手牌迁 Phaser；React 少留 | **`BattleScene.renderHand` 画手牌** | **渲染目标已基本达成**；余量：粒子 / 演出 polish、可选迁移「结束回合」 |
| D | 全战斗 HUD Phaser | 未做 | 长期；与 §3.3 换引擎评估挂钩 |

### 6.3 文档勘误清单（速览）

1. **§1 表格**：Phaser 路径为 `src/game/phaser/scenes/**`（非 `src/game/scenes/**`）。  
2. **§1「关键事实」**：已改为手牌/三堆/状态条在 Phaser、顶栏在 React；勿再引用「几乎全部战斗 UI 在 React」。  
3. **§2 #4 A**：顶栏 chip 与 Phaser 三堆双显；若要去重只留一侧见 §6.5 P1（可选）。  
4. **§3.2 旧「现状」与阶段 B「下一轮」**：已过时；以 §6.2 为准。  
5. **§3.3 结论第 2 条**：「继续做 B、C」在历史语境成立；**B 已完成后**以 C 的余量与 §3.4 为主。

### 6.4 计划外已做（未写入原 §2～§5）

- **战斗顶栏**：`BattlePage` 头区分栏；HUD 与快捷条 flex、控件等高（`battlePage.css.ts`、`battleHud.css.ts`）。  
- **总览入口**：右侧悬浮探出式按钮（`runOverview.css.ts`、`RunOverviewPanel.tsx`）。  
- **战斗纵版**：`LOGICAL_HEIGHT` 加高及 `BattleScene` 单位/手牌/背景分层重排（`gameFactory.ts`、`BattleScene.ts`）。

### 6.5 剩余工作规划（可执行）

| 优先级 | 项 | 说明 | 依赖 |
| ------ | --- | ---- | ---- |
| **P0** | §3.4① 流派专属内容 | 每流派专属遗物 / 旗帜牌：命名、数值、是否进奖励池；对齐 `archetypes.ts`、`starter.ts`、遗物定义 | 策划定稿 |
| **P1** | §3.4② `REWARD_ARCHETYPE_TILT` 配置化 | 开关已抽到 `src/game/core/config/rewardTuning.ts`（`REWARD_ARCHETYPE_TILT_ENABLED`）；后续可接设置/meta | 无 |
| **P1** | §3.4③ 遗物流派口径评审 | 与策划过 `ARCHETYPE_BY_RELIC_ID` 等映射 | 策划 |
| **P1（可选）** | #4 A 顶栏与场边展示取舍 | 已实现双显；若要去重只保留一侧，再删 HUD 或弱化 `PileStack` | 产品 |
| **P2** | §3.2 阶段 D 全 HUD Phaser | 结束回合等迁入 Phaser | 路线图决策 |
| **P2** | §5 Phaser 可测性 | 从 `BattleScene` 抽纯数据函数（布局 / hit rect）+ `rstest` | 无 |

**估时（取代 §4「2～3 天」单一口径）**

- **P0**（策划已定稿后程序落地）：约 **1～2 人日**。  
- **P1**（配置 + 可选 #4 A）：约 **0.5～1 人日**。  
- **P2 阶段 D**：多 Sprint，不单列人日。  
- **P2 单测**：按抽出粒度约 **0.5～1 人日**起。
