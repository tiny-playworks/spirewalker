# 引擎评估 + Phaser 化 / 引擎迁移计划

> 对应创始人反馈 #2 / #4 / #6 / #7 / #8 的落地与下一步计划。
> 本轮已把「可以在 React 侧速胜完成」的反馈点做掉，剩余的是需要触碰 BattleScene / Phaser 渲染层的改动，做成连续可执行计划留下。

---

## 1. 现状：职责分层一览

| 层级             | 所在位置                                              | 负责做什么                                                                                                  |
| ---------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 规则 / 数据      | `src/game/core/**`                                    | `RunState` / `BattleState` / `CardDefinition` / `GameEngine.dispatch` 等纯逻辑；所有状态只由 command 推进。 |
| Phaser 渲染      | `src/game/scenes/**`、特别是 `BattleScene`           | 战斗场景：敌我单位、出手动画、手牌条、弹幕；现在也承担摄像机与场面布景。                                  |
| React HUD / 屏幕 | `src/features/**`                                     | 战斗外的所有屏幕（地图、商店、奖励、休息、总览…）以及战斗时的 `BattleHUD`（能量、状态、按钮、卡牌 UI 等）。 |
| 桥接层           | `src/features/phaser/**`、`src/features/battle/**`    | React → Phaser 的指令下发、Phaser → React 的事件上报；`BattleHUD` 目前几乎完全替代了 Phaser 端的战斗 UI。  |

关键事实：**战斗 UI 几乎全部在 React 中实现**。Phaser 只负责场景贴图、敌我单位位置、动画效果，不直接画「卡牌 / 能量 / 抽弃消堆」等结构化信息。

---

## 2. 本轮已完成

### 2.1 React 侧速胜

| 反馈点 | 实现内容                                                                                                                                       | 影响文件                                                                                                           |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| #1     | Act1 地图 14 层 → 12 层（~-14%），同步更新节奏相关测试与分支补给保底逻辑。                                                                       | `generateBranchingFloor.ts`、`mapGeneration.test.ts`                                                              |
| #3     | 「总览」面板里加按类型分组的牌组查看器（attack / skill / power / exhaust / junk / other），带计数。                                             | `RunOverviewPanel.tsx`                                                                                             |
| #4 A   | `BattleHUD` 顶部实时显示 `抽 / 手 / 弃 / 消` 四堆数量，hover 提示回洗规则。                                                                     | `BattleHUD.tsx`                                                                                                   |
| #5     | 新增 2 张消耗牌：`燃锋 burn_edge`（14 伤害，消耗）、`清念 clear_mind`（抽 2 + 2 能量，消耗），配合现有循环牌。`exhaustOnPlay` flag + 事件体系。 | `card.ts` / `starter.ts` / `playCard.ts` / `events/types.ts`                                                       |
| #8 A   | 「总览」面板追加「流派身份」板块：逐条列出角色的构筑分支，按「核心卡 / 核心遗物」命中情况打出 x/3 评分，帮助玩家识别当前构筑方向。              | `RunOverviewPanel.tsx`                                                                                            |
| 升级系统 | 33 张卡的 `+` / `++` 规则；商店有升级服务、战后奖励可放弃三选一改为升级，UI 提供 before/after 对照；单元测试覆盖数据、商店、奖励三条入口。    | `upgradeRules.ts` + 商店 / 奖励 resolver、flow、页面，`tests/cards,shop,reward/*Upgrade.test.ts`                    |

### 2.2 Phaser 侧（本轮补齐）

| 反馈点 | 实现内容                                                                                                                                                 | 影响文件                                                                                             |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| #2     | `UnitStatusBar` 挂在玩家 / 每个敌人模型正下方，按状态 id 上色，展示短标签 + 层数。`BattleScene.battleVisualKey` 把 `statuses` 纳入差量，状态变化即时重绘。 | `src/game/phaser/scenes/battle/UnitStatusBar.ts`、`BattleScene.ts`                                 |
| #4 B   | `PileStack` 组件在战场底角画抽 / 弃 / 消三堆卡背 + 计数（数量为 0 时半透明）。引擎层新增 `DRAWPILE_RESHUFFLED` 事件，scene 捕获后播放弃 → 抽的飞行动画。 | `src/game/phaser/scenes/battle/PileStack.ts`、`BattleScene.ts`、`events/types.ts`、`playCard.ts`、`turnFlow.ts` |
| #6 B   | 单位状态条 / 三堆可视化都迁到 Phaser（见上），React `BattleHUD` 保留为聚合数字视图；未来若要再把手牌搬到 Phaser，骨架已铺好。                                 | 同上                                                                                                |
| #8 B   | 每张基础卡（含升级版）自动打 `guard / burst / mixed / neutral` 流派标签；Phaser 手牌右下画彩色圆点；React 商店 / 奖励 / 总览 / 升级对照面板统一复用 `ArchetypeDot`；总览面板新增「牌组流派分布」chip 组。 | `archetypes.ts`、`ArchetypeDot.tsx`、`BattleScene.ts`、`RunOverviewPanel.tsx`、`ShopPage.tsx`、`RewardPage.tsx`、`CardUpgradeList.tsx`、`tests/cards/archetypes.test.ts` |

> 测试总览：本轮 rstest → 184 passed / 2 pre-existing failed（`engine.test.ts` 两条 AI 行为旧红线，和本轮无关）。

---

## 3. 下一轮：继续加深 Phaser 化 & 内容层

> #2 单位状态条、#4 三堆 + 回洗动画已经在 2.2 落地；下面是继续推进的内容层与视觉升级。

### 3.1 已落地说明

- **#2 单位状态条**：`UnitStatusBar` 用色块 + 短标签（出自 `STATUS_DEFINITIONS.shortLabel`）搭配层数；色码见 `UnitStatusBar.colorForStatus()`。接入位置在 `refreshStatusBars()`，与 `rebuildPlayerDisplay` / `rebuildEnemyDisplay` 使用同一 visualKey，状态增减实时重绘。美术进场时只需把色块替换成 `scene.add.image(statusId)` 就好。
- **#4 A 三堆可视化**：`PileStack` 画 3 层叠放卡背 + 数字 + 类型标签；抽 / 弃堆并列在左下，消耗堆在右下。战斗开始 / 重入时在 `create()` 里新建，shutdown 时通过 `resetBattleUi()` 清零引用，避免场景重入后访问已销毁对象。
- **#4 B 回洗动画**：`drawAdditionalCards` / `drawUpTo` 在触发 `drawPile = [...discardPile]` 那一刻 push `DRAWPILE_RESHUFFLED`（带 `fromDiscardCount`），`BattleScene.update()` 捕获后播 1~5 张卡背从弃牌堆飞向抽牌堆的 tween，并顶出一行「弃牌堆回洗」提示文字。快进模式下 tween 压缩到 140ms，避免拖慢自动跑步。

### 3.2 反馈 #6 — 更多 UI 搬进 Phaser

**现状**：几乎全部战斗 UI 在 React；手牌卡片、能量球、结束回合按钮、状态、伤害飘字都在 `BattleHUD` / React DOM。

**讨论**：把所有 UI 搬进 Phaser 有成本（需要自己实现按钮、文本排版、阴影、主题色、长文本换行等），收益是：

- 便于统一做「一张大 canvas」的视觉风格、抗锯齿、粒子特效叠加；
- 避免 React/DOM 重排在战斗高频动画下的帧抖（目前没观察到，但潜在风险）；
- 方便把整张战斗截图做相机摇晃、动态模糊。

**建议分级迁移**（不一次性切）：

| 阶段 | 内容 | 原因 |
| ---- | ---- | ---- |
| A（本轮已完成基础）| 能量 / 抽弃消堆计数 / buff 仍在 React，但通过 `BattleHUD` 可读 | 保持迭代速度，DOM 改起来快。 |
| B（下一轮）| 单位身上状态图标（#2）、四堆可视化（#4）走 Phaser | 这些强绑定「单位位置 / 堆位置」，React 难以精准对齐世界坐标。 |
| C（中期）| 手牌渲染层迁到 Phaser；React 仅保留「结束回合 / 能量 / Tooltip 字」 | 手牌交互（hover 放大、拖拽打出）Phaser 更自然，且能叠加粒子。 |
| D（长期）| 整个战斗 HUD 都在 Phaser，React 只剩战斗外屏幕 | 可以和「换引擎」一起评估。 |

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
2. **继续做 B、C 阶段的 Phaser 化**（上一条），让 Phaser 把它"最擅长的事"（单位 / 堆 / 粒子 / 相机）做到位。
3. **如果某一版美术升级，目标是 Hades / Slay the Spire 级别的 2D 氛围**，再考虑切 Pixi + 自研 ECS；**不是因为 Phaser 不够用才换，而是因为我们开始追求更高的视觉门槛**。
4. **不建议转 3D**：卡牌 Roguelike 的镜头与战斗编排上，3D 更多的是负担而非收益。

> 这条结论可以直接作为本轮对创始人反馈的答复：**当前不换引擎，但把 Phaser 用得更深；等美术升级那天再评估 Pixi。**

### 3.4 反馈 #8 — 流派身份

**现状（本轮已做）**：

1. 每张基础卡（含升级版）都自动打了 `guard / burst / mixed / neutral` 流派标签，见 `src/game/core/definitions/cards/archetypes.ts`。`getCardArchetype` 会把 `+` / `++` 版本映射回基础 id，保证升级不破标签。
2. Phaser `BattleScene` 在手牌右下画一颗 14px 彩色圆点（守=蓝 / 爆=红 / 混=紫），neutral 不画以免噪音；React 侧商店、奖励、升级对照、总览牌组列表统一用 `ArchetypeDot` 组件。
3. `RunOverviewPanel` 在「流派身份」板块顶部加了一组「牌组流派分布」chip（`守 N / 爆 N / 混 N / 通用 N`），方便玩家一眼看出自己的牌组现在偏哪派。

**下一轮要补的**（需要内容 / 平衡改动）：

1. 给遗物也打 `archetype` 标签，商店 / 总览的遗物条同样挂上颜色标识。本轮暂未做，主要因为遗物流派归属比卡牌更模糊，需要先和策划对齐归类。
2. 每个流派补 1~2 件"流派专属遗物"与 2 张"流派旗帜牌"（命名 / 描述明显带风格），让新玩家第一眼就能通过卡牌区分方向。
3. `rewardResolver` 在「奖励三选一」返回前，给本局已选择流派的牌做 +10% 出现概率加权（参数可配置）。

---

## 4. 时间估算（人日）

| 任务                         | 估时         | 备注                                                 |
| ---------------------------- | ------------ | ---------------------------------------------------- |
| 3.1 / 3.2 已完成（#2 / #4）  | —            | 本轮已落地，见 2.2。                                  |
| 3.4 数据层 + UI 标记         | —            | 本轮已落地，见 2.2 #8 B。                             |
| 3.2 手牌 → Phaser（#6 C）   | 2            | 现阶段 React 已够用，等手牌要加粒子时再切。           |
| 3.4 遗物流派标签 + 权重倾斜  | 1            | 数据层改动小，主要是归类需和策划对齐。               |
| 3.4 流派专属内容             | 1~2          | 需要策划定内容（遗物名/数值/剧情旗帜）。           |

剩余预估：一个人日口径下 **3~4 天**能把剩余创始人反馈（#6 C / #8 遗物 + 专属内容）收完，不含美术交付。

---

## 5. 风险与收尾建议

- **不要在这一轮同时换引擎 + 做内容**。任何一条都能把进度卡死，而当前玩法本身（Act2 通关率）更值得继续投人。
- **Phaser 化的每个子任务都要带回归测试**。`BattleScene` 目前没有单元测试，新增的 `UnitStatusBar` / `PileStack` 尽量写成纯函数 + 数据驱动，方便在 node 侧做 DOM-free 单测。
- **状态条和堆的 UI 都是数据驱动的**：只要 core 发事件 / 更新 `BattleState`，Phaser 下一帧就会拉新数据重绘。新增消耗牌、新状态时不需要额外改 Phaser。
