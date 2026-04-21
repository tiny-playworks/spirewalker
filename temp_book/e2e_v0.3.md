# Spirewalker E2E / 自动测试落地记录 v0.3

## 范围

这一轮测试体系按三层落地：

1. `Rstest` 规则层
2. `Rstest` 模拟层
3. `Playwright` UI 冒烟层

目标不是做大而全，而是先把下面三件事锁住：

- 规则正确
- 构筑和机制可批量验证
- 主流程 UI 不崩

---

## 当前落地结果

### 1. 规则层

新增测试文件：

- `tests/core/runInit.test.ts`
- `tests/core/statusHooks.test.ts`
- `tests/core/rewardPool.test.ts`
- `tests/core/mapProgression.test.ts`

覆盖内容：

- `createMapRun` / 角色初始化 / starter
- 状态触发时机
- 奖励池混池与回落
- 地图邻接推进与不可回头

规则层约束：

- 固定 seed
- 不依赖 DOM / React / 浏览器
- 直接测试 game core / `GameEngine.dispatch`

### 2. 模拟层

新增目录：

- `src/game/simulation/runSimulation.ts`
- `src/game/simulation/types.ts`
- `src/game/simulation/policies/simplePolicy.ts`
- `src/game/simulation/policies/walkerMomentumPolicy.ts`

能力：

- 支持 `runs`
- 支持固定 `seed`
- 支持 `policy` 注入
- 第一阶段只支持 `walker`
- 输出聚合统计：
  - `totalRuns`
  - `winRate`
  - `avgTurnsPerCombat`
  - `momentumOpenedByTurn2Rate`
  - `defenseBranchRate`
  - `burstBranchRate`
  - `pollutedDeckRate`

新增模拟测试：

- `tests/simulation/walkerStarterOpening.test.ts`
- `tests/simulation/walkerBranchFormation.test.ts`
- `tests/simulation/rewardPollution.test.ts`
- `tests/simulation/combatLength.test.ts`

当前门槛：

- `momentumOpenedByTurn2Rate === 1`
- `avgTurnsPerCombat` 落在 `[2, 12]`
- `pollutedDeckRate <= 0.5`
- `WalkerMomentumPolicy` 的分支成型率不低于 `SimplePolicy`

本轮修正点：

- runner 改为按“页面推进”计数，不再把每次战斗指令都算作 `screen transition`
- 失败战斗也计入回合统计
- `WalkerMomentumPolicy` 调整为优先兑现/攻击，再补起势，避免战斗内自我拖循环

### 3. Playwright 冒烟层

新增配置：

- `playwright.config.ts`

新增脚本：

- `pnpm test:e2e`
- `pnpm test:e2e:ui`

新增用例：

- `tests/e2e/mainMenu.spec.ts`
- `tests/e2e/mapToBattle.spec.ts`
- `tests/e2e/battleRewardFlow.spec.ts`
- `tests/e2e/shopFlow.spec.ts`
- `tests/e2e/eventFlow.spec.ts`

测试目标：

- 首页进入地图
- 地图选点进入战斗
- 战斗内通过调试入口直达奖励
- 跳转商店并离开继续流程
- 跳转事件并完成一次最小选择

约束：

- 只跑 Chromium
- 使用 locator + web-first assertions
- 不使用 `waitForTimeout`
- `battleRewardFlow` 使用稳定定位，不绑易变文案

---

## 为 E2E 补的稳定定位

本轮新增 / 使用的关键 `data-testid`：

- `new-game-button`
- `decision-cta`
- `map-node-<id>`
- `battle-hud`
- `leave-battle-to-reward`
- `reward-page`
- `shop-page`
- `event-page`
- `debug-panel`
- `debug-force-victory`
- `debug-jump-shop`
- `debug-jump-event`
- `debug-jump-reward`

对应页面：

- `src/features/main-menu/MainMenuPage.tsx`
- `src/features/map/MapPage.tsx`
- `src/features/map/MapRoute.tsx`
- `src/features/battle/BattleHUD.tsx`
- `src/features/reward/RewardPage.tsx`
- `src/features/shop/ShopPage.tsx`
- `src/features/event/EventPage.tsx`
- `src/features/debug/DebugPanel.tsx`

---

## Debug 跳屏补丁

`src/game/core/systems/debug/debugFlow.ts` 本轮额外修正：

- 跳 `shop` 时同步生成 `run.shop`
- 跳 `reward` 时同步生成 `run.reward`
- 跳屏前清掉旧的 `battle / shop / reward` 残留

原因很直接：

- 只改 `screen` 不够
- 子页面依赖对应运行态
- 不补状态，E2E 会进入空页面

---

## 验证结果

已验证通过：

- `pnpm test`
- `pnpm build`
- `pnpm test:e2e`

结果：

- `119` 个 Rstest 测试通过
- `5` 个 Playwright 冒烟用例通过

---

## 结论

这一轮不是只把测试“接上”，而是把三层体系都跑通了：

- 规则层能锁规则
- 模拟层能批量看机制
- E2E 能兜主流程

后面如果继续扩，只需要在这套结构上增量补案例，不需要再推翻重来。
