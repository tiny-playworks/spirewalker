# Spirewalker Stitch Overall Implementation Plan

## 目标

把当前项目重构为符合 Stitch 设计稿的桌面 16:9 游戏体验。范围覆盖 Stitch 中已有的核心页面，首页暂不纳入，因为当前 Stitch 项目没有首页设计。

技术口径以当前项目决策为准：战斗和所有界面使用 React DOM 表现层，核心规则继续留在 `src/game/core`。不再引入 Phaser。

## Stitch 页面清单

| Stitch 页面 | 当前项目页面 | 状态 | 目标 |
| --- | --- | --- | --- |
| `Spirewalker 16:9 Strategic Redesign` | `BattlePage` / `ReactBattleStage` | 已开始 | 完整对齐战斗 HUD、单位区、手牌、能量、牌堆、意图、状态图标 |
| `Spirewalker Strategic Void Map - Tactical Redesign` | `MapPage` | 已完成 | 竖向星图、Void Veins 路径、节点符号系统、顶栏/图例/底部 dock |
| `Spirewalker Void Shop - Atmospheric Redesign` | `ShopPage` | 已完成 | 左商人立绘 + 中央禁忌知识/造物/灵药/仪式 + 右侧财富/躯壳/遗物 |
| `Spirewalker Victory & Rewards Interface` | `RewardPage` | 已完成 | 金色「胜利」标题、战利清单面板、三张 HoloCard、金币/遗物 pill、升级入口 |
| `Spirewalker Event - The Forgotten Altar` | `EventPage` | 已完成 | 数据驱动：徽章+大标题+祭坛美术 + 故事面板 + 按代价/收益着色的选项 |
| `Spirewalker New Run - The Fate Alignment` | `MainMenuPage` / 新局流程 | 缺失 | 新增三步开局：Soul Archetype、Starting Deck、Covenant Banner |
| `Spirewalker Deck Viewer - Draw Pile` | `BattleDeckPanel` | 未达标 | 改成战斗内牌堆查看器，区分 draw/discard/exhaust |
| `Spirewalker Collection - Void Hall Style` | `ArchivePage` | 初版 | 改成收藏大厅，卡牌/遗物/实体用博物馆式陈列 |
| `Spirewalker Relic Archive - Void Collection` | `ArchivePage` | 初版 | 遗物档案独立视图，右侧详情、稀有度、发现状态 |
| `Spirewalker Codex - Restored Archive Logic` | `ArchivePage` | 初版 | Codex 以实体、地区、Boss、事件为主线组织 |
| `Spirewalker Achievements - Void Legends Restyled` | `ArchivePage` | 初版 | 成就厅，重点展示称号、进度、奖励和未解锁剪影 |
| `Spirewalker Boss Defeated Summary` | `VictoryScreen` / Boss 后结算 | 缺失 | Boss 击败总结，展示 Build、伤害、奖励和继续按钮 |
| `Spirewalker Project PRD` / `Boss Design Update` / `Boss Design Protocols` | 设计依据 | 参考 | 作为视觉和 Boss 内容方向，不直接作为运行页面 |

## 统一设计系统

先统一底层视觉，再逐页实现，避免每页各写一套。

### 色彩

- 背景：Obsidian Black `#131314`，带暗紫/暗青空间渐变。
- 主强调：Void Purple `#8B5CF6`。
- 奖励/标题：Legendary Gold / Amber。
- 战术信息：Ethereal Cyan。
- 危险/伤害：珊瑚红或暗橙。

### 字体和层级

- 标题、章节、仪式化文案：`Libre Caslon Text`。
- 数字、状态、按钮、战术数据：高可读 sans-serif。
- 页面必须先保证 3 秒内读懂核心数值，再加氛围。

### 通用组件

需要沉淀为共享组件，而不是每页复制样式：

- `GameTopBar`：品牌、资源、章节标题、工具按钮。
- `VoidPanel`：暗色玻璃面板，低圆角，轻边框。
- `HoloButton`：金色主按钮、紫/青色次按钮。
- `HoloCard`：卡牌/遗物/事件奖励统一容器。
- `StatusGlyph`：状态、小资源、节点、稀有度图标。
- `ArchiveShell`：档案/收藏/成就左侧导航 + 中央陈列 + 右侧详情。
- `DeckViewer`：draw/discard/exhaust/card library 通用查看器。

## 分阶段计划

### Phase 0 - 设计系统和资产基础

目标：减少后续页面返工。

- 建立共享 token：颜色、边框、阴影、标题字体、面板透明度、按钮状态。
- 把已下载战斗角色/敌人/背景资产纳入资源命名规范。
- 增补店主、祭坛、奖励、遗物、卡牌插画的资产位；没有最终图时先用 Stitch 可用资产和可替换占位。
- 清理旧技术口径：文档和代码中不再出现 Phaser 作为当前实现路径。

验收：

- `pnpm build`
- `pnpm lint`
- 全仓搜不到运行路径中的 Phaser 引用。

### Phase 1 - 战斗页最终贴近 Stitch

目标：先把最核心的第一可玩界面做到像 Stitch。

- 顶部 HUD：对齐完整战斗图的品牌、生命、护甲、金币、资源圆钮、关卡标题、Turn、右侧工具按钮。
- 单位区：玩家/敌人插画尺寸、血条、护甲、状态 icon、敌人意图卡片统一。
- 手牌区：加大卡牌、强化插画区域、稀有度/升级态、悬浮高亮、选中态。
- 能量和牌堆：左下大能量球、抽牌堆计数气泡、右侧 discard/exhaust 卡背。
- 交互：点击单体牌再点敌人、拖拽目标、结束回合、胜利领奖保持可用。

验收：

- 16:9 桌面截图与完整 Stitch 战斗图逐项对比。
- Playwright：新局进入战斗、出单体牌、敌人扣血、弃牌更新。
- `pnpm build && pnpm lint && pnpm test`。

### Phase 2 - 地图、奖励、商店、事件四个主流程

目标：完成一次 Run 中最常见的核心循环。

#### Map

- 改成古代星图投影，不再像普通流程图。
- 节点使用 Combat / Elite / Event / Shop / Rest / Boss 的符号系统。
- 可走路径用高亮 Void Veins，未来路径保持暗线。
- 节点 hover/选择展示下一步风险和奖励预期。

#### Reward

- 胜利标题、战斗日志摘要、三张奖励卡、金币、遗物/药水奖励。
- 奖励卡使用战斗卡牌同一套 HoloCard 视觉。
- 选择后有明确状态，继续按钮不隐藏。

#### Shop

- 商人或商店主视觉在左侧。
- 中央商品区分卡牌、遗物、药水、移除服务。
- 右侧钱包、当前牌组摘要、购买反馈。
- 禁止普通电商卡片风格。

#### Event

- 事件大图和标题成为主视觉。
- 选择项必须展示代价、收益、不可选原因。
- 结果反馈要有仪式感，而不是普通提示文本。

验收：

- 从地图进入普通战、胜利、领奖、回地图路径通过。
- 商店购买/离开、事件选择/离开路径通过。
- 所有主流程页面都有 16:9 截图对比。

### Phase 3 - Archive Suite

目标：把收藏、Codex、遗物、成就统一成 Forbidden Archive 体系。

- `ArchivePage` 拆成 shell + 子视图，而不是一个页面塞所有逻辑。
- Collection：博物馆陈列，已解锁卡/遗物有发光框，未解锁为剪影。
- Relic Archive：左侧分类、中间网格、右侧详情。
- Codex：实体、Boss、地区、事件、派系分组。
- Achievements：成就大厅，大成就横幅 + 小成就网格。
- 资料页入口从主菜单和战斗外全局入口都可达。

验收：

- 资料页所有 tab 可切换，无空白或伪按钮。
- 解锁/未解锁状态视觉不同。
- 没有 Excel 列表式页面。

### Phase 4 - New Run 和 Boss 总结

目标：补齐 Stitch 里最明显的缺失页面。

#### Fate Alignment

- Step 1：选择 Soul Archetype。
- Step 2：选择 Starting Deck。
- Step 3：选择 Covenant Banner / Run modifier。
- 每一步有预览、确认态、返回态。
- 最终进入 Map。

#### Boss Defeated Summary

- Boss 击败标题和章节总结。
- 展示本局 Build 摘要、关键牌、遗物、伤害/防御统计。
- 给出奖励或进入下一幕按钮。

验收：

- 新局不再直接跳过选择流程。
- Boss 战后进入总结页，而不是普通通关文本。

### Phase 5 - 全局一致性和收口

目标：让所有页面看起来来自同一个游戏，而不是各自局部好看。

- 所有页面统一顶部品牌/资源栏策略。
- 统一按钮、面板、卡牌、状态 icon、空状态。
- 检查 16:9 桌面下文字不溢出、不遮挡。
- 删除临时截图和调试占位。
- 更新 README 中技术栈、页面结构和运行命令。

验收：

- `pnpm build`
- `pnpm lint`
- `pnpm test`
- Playwright 主路径：
  - 新局三步选择 -> 地图 -> 战斗 -> 胜利奖励 -> 地图
  - 地图 -> 商店 -> 购买/离开
  - 地图 -> 事件 -> 选择/离开
  - 资料页 tab 全切换
- 每个 Stitch 对应页面保留最新桌面对比截图，仅用于 QA，最终不提交临时截图。

## 优先级

1. Combat final polish。
2. Map / Reward / Shop / Event 主流程。
3. Archive Suite。
4. New Run Fate Alignment。
5. Boss Summary。

理由：战斗和地图决定第一体验；奖励、商店、事件决定一次 Run 的循环是否完整；Archive 和 New Run 是长期体验；Boss Summary 在 Boss 流程稳定后再做。

## 进度记录

### 2026-06-24

- 设计依据：使用导出的 `stitch_spirewalker_cyber_gothic_combat_ui/`（每页 `screen.png` + `code.html` + `spirewalker/DESIGN.md` 设计令牌），不再依赖 MCP 取图。
- Phase 2 主流程四页全部完成并通过 `lint` / `build` / 单测（241）：
  - Map：`MapPage.tsx`、`MapRoute.tsx`、`mapNodeIcons.tsx`、`mapRouteLayout.ts`、`mapPage.css.ts`、`mapRoute.css.ts`。
  - Reward：`RewardPage.tsx` + `rewardPage.css.ts`。
  - Shop：`ShopPage.tsx` + `shopPage.css.ts`。
  - Event：`EventPage.tsx` + `eventPage.css.ts`（四个事件统一为数据驱动配置）。
  - 抽出共享 `src/features/cards/FallbackImg.tsx`（战斗页与奖励页共用卡图回退）。
- 已逐页 16:9 截图与 Stitch 设计对照，视觉基本还原（卡图复用 `combatAssets` 图源，缺图走 CSS 回退）。

### 待办 / 已知问题

- e2e `battleRewardFlow.spec.ts` 失败为**既有问题**（与本次重构无关）：`leave-battle-to-reward` 这个 testid 在 `BattleHUD`(隐藏桥接) 与 `ReactBattleStage`(真实按钮) 上重复，触发 Playwright strict-mode。已在干净 HEAD 复现。修法：给桥接换 testid，或让测试只点可见按钮。
- 剩余页面（按优先级）：Archive Suite（Collection / Relic / Codex / Achievements）、New Run「Fate Alignment」三步开局、Boss Defeated Summary、Deck Viewer。
- 收口项：抽公共组件（`GameTopBar` / `VoidPanel` / `HoloButton` / `HoloCard` / `StatusGlyph`），目前各页顶栏/面板样式仍有重复，后续统一。

## 明确不做

- 不实现首页，因为 Stitch 当前没有首页设计。
- 不回退 Phaser。
- 不为了视觉重构改核心战斗数值。
- 不把调试面板作为正式 UI 的一部分。
- 不做移动端优先适配，本轮以桌面 16:9 为准。

