# Spirewalker 自动测试落地方案 v0.3

## 摘要

基于当前仓库现状，这一轮不是从 0 搭测试，而是把已有 `Rstest` 规则测试扩成完整分层体系，再补上纯逻辑模拟层和最小可维护的 `Playwright` 冒烟层。

当前已确认的事实：

- `Rstest` 已接入
- `GameEngine.dispatch(run, command)` 是稳定的纯逻辑入口
- `Rsbuild` 开发地址默认是 `http://localhost:3000/`
- 首页和大部分 CTA 可直接用 role / text 定位
- 地图节点是纯 SVG 点击区，E2E 需要补稳定定位
- `DebugPanel` 已支持跳商店 / 跳事件 / 一键胜利，适合作为测试入口

本轮目标固定为三层：

1. 扩充 `Rstest` 规则层
2. 新增 `Rstest` 模拟层
3. 接入 `Playwright`，做 5 条 UI 主流程冒烟

---

## 1. 规则层

### 目标

在现有 `tests/**/*.test.ts` 基础上补齐关键规则缺口，不重写旧测试，不大规模搬迁。

### 新增测试文件

- `tests/core/runInit.test.ts`
- `tests/core/statusHooks.test.ts`
- `tests/core/rewardPool.test.ts`
- `tests/core/mapProgression.test.ts`

### 覆盖范围

- `createMapRun` / starter / character 初始化
- 状态触发时机
- 奖励池混池、角色池优先、池空回落
- 地图推进、邻接限制、不可回头

### 规则层约束

- 固定 seed
- 直接测 game core 或 `GameEngine.dispatch`
- 每个测试只断言一条核心规则
- 不引入 DOM / React / Phaser / 浏览器
- 若现有代码不利于测试，优先抽纯函数，不在测试里硬绕

---

## 2. 模拟层

### 目标

实现一个纯逻辑自动跑局器，用来验证 starter 体验、构筑成型、奖励污染和战斗长度，不依赖 UI。

### 目录

- `src/game/simulation/runSimulation.ts`
- `src/game/simulation/types.ts`
- `src/game/simulation/policies/simplePolicy.ts`
- `src/game/simulation/policies/walkerMomentumPolicy.ts`

### 关键接口

```ts
export type SimulationSummary = {
  totalRuns: number;
  winRate: number;
  avgTurnsPerCombat: number;
  momentumOpenedByTurn2Rate: number;
  defenseBranchRate: number;
  burstBranchRate: number;
  pollutedDeckRate: number;
};

export interface SimulationPolicy {
  id: string;
  chooseBattleCommand(ctx: SimulationBattleContext): GameCommand;
  chooseMapNode(ctx: SimulationMapContext): string;
  chooseReward(ctx: SimulationRewardContext): { type: "card"; definitionId: string } | { type: "gold" };
  chooseShopAction(ctx: SimulationShopContext): GameCommand | { type: "leave_shop" };
  chooseEventOption(ctx: SimulationEventContext): string;
}
```

### 实现约束

- runner 统一通过 `GameEngine.dispatch` 驱动
- 单局 seed 规则固定为 `baseSeed + runIndex`
- 第一阶段只支持 `characterId: 'walker'`
- 不接 React store / localStorage / Phaser
- 护栏：
  - `maxCommandsPerBattle = 200`
  - `maxScreensPerRun = 500`

### 策略

#### `SimplePolicy`

- 战斗中优先打可出的攻击牌
- 危险时优先防御
- 地图总是选第一个可达节点
- 奖励优先角色牌，否则拿第一张
- 商店优先最便宜可买角色牌，否则离开
- 事件优先第一个可用选项

#### `WalkerMomentumPolicy`

- 战斗优先起势牌，其次保势牌，再兑现牌
- 若已有 `momentum`，优先打能保留或兑现 `momentum` 的牌
- 奖励优先 `buildBranches` 中尚未成型分支的核心卡
- 商店优先缺失的分支核心卡 / 核心遗物
- 地图优先 `battle -> elite -> shop -> rest -> event -> treasure`
- 事件优先能直接拿分支核心收益的选项

### 指标定义

- `momentumOpenedByTurn2Rate`
  - run 中每场战斗前 2 回合内，至少接触到一次起势入口的战斗占比
- `defenseBranchRate`
  - 结算时牌组至少包含 `brace_rhythm + tempo_guard` 且拥有 `guard_knot` 的 run 占比
- `burstBranchRate`
  - 结算时牌组至少包含 `burst_strike + snap_strike` 且拥有 `burst_emblem` 的 run 占比
- `pollutedDeckRate`
  - run 结束时，新增牌中不在当前角色 `rewardCardPool` 内的牌占比大于 `0.4` 的 run 占比
- `avgTurnsPerCombat`
  - 所有战斗回合数平均值
- `winRate`
  - 达到 `victory` 的 run 占比

---

## 3. 模拟层测试

### 新增文件

- `tests/simulation/walkerStarterOpening.test.ts`
- `tests/simulation/walkerBranchFormation.test.ts`
- `tests/simulation/rewardPollution.test.ts`
- `tests/simulation/combatLength.test.ts`

### 硬门槛

#### `SimplePolicy`

- `totalRuns === 100`
- `momentumOpenedByTurn2Rate === 1`
- `avgTurnsPerCombat` 落在 `[2, 12]`
- `pollutedDeckRate <= 0.5`

#### `WalkerMomentumPolicy`

- `totalRuns === 100`
- `momentumOpenedByTurn2Rate === 1`
- `avgTurnsPerCombat` 落在 `[2, 12]`
- `pollutedDeckRate <= 0.5`

#### 策略对比

- `WalkerMomentumPolicy.pollutedDeckRate <= SimplePolicy.pollutedDeckRate`
- `WalkerMomentumPolicy.defenseBranchRate + WalkerMomentumPolicy.burstBranchRate >= SimplePolicy.defenseBranchRate + SimplePolicy.burstBranchRate`

### 当前约束说明

- `momentumOpenedByTurn2Rate === 1` 视为当前 `v0.5` 强约束
- `avgTurnsPerCombat` 的 `[2, 12]` 目前只是护栏，不是精细平衡目标
- 这轮不引入更细的分布断言

---

## 4. Playwright 冒烟层

### 接入内容

- 安装 `@playwright/test`
- 新增 `playwright.config.ts`
- 新增脚本：
  - `test:e2e`
  - `test:e2e:ui`

### 配置

- 只跑 Chromium
- `testDir = 'tests/e2e'`
- `baseURL = 'http://127.0.0.1:3000'`
- `webServer.command = 'pnpm dev --host 127.0.0.1 --port 3000'`
- `webServer.reuseExistingServer = !process.env.CI`
- `trace = 'on-first-retry'`
- `timeout = 45000`

### 第一批用例

1. `mainMenu.spec.ts`
   - 打开首页
   - 点击“新游戏”
   - 断言进入地图页并看到“本层路线”

2. `mapToBattle.spec.ts`
   - 新游戏进入地图
   - 选择一个可达节点
   - 点击决策 CTA
   - 断言进入战斗页

3. `battleRewardFlow.spec.ts`
   - 从地图进入战斗
   - 打开 `DebugPanel`
   - 点“一键胜利”
   - 点“领取奖励”
   - 断言奖励页可见

4. `shopFlow.spec.ts`
   - 打开 `DebugPanel`
   - 跳转商店
   - 断言商店页可见
   - 点击“离开商店”
   - 断言流程继续

5. `eventFlow.spec.ts`
   - 打开 `DebugPanel`
   - 跳转事件
   - 选择第一个可用选项
   - 断言回到地图或进入后续主线页

### E2E 约束

- 使用 locator + web-first assertions
- 不使用 `waitForTimeout`
- 不做复杂数值断言
- `battleRewardFlow` 优先使用稳定定位，不绑定易变文案

---

## 5. 稳定定位补充

只补关键节点，不做全站 `data-testid` 泛滥。

最少补这些：

- `new-game-button`
- `decision-cta`
- `map-node-<id>`
- `debug-force-victory`
- `debug-jump-shop`
- `debug-jump-event`
- `debug-jump-reward`
- `leave-battle-to-reward`

原因：

- 首页入口高频，稳定 id 更省维护
- 地图节点是 SVG，需要显式测试定位
- `DebugPanel` 文案容易变
- `battleRewardFlow` 不能依赖“领取奖励”这类文案

---

## 测试计划

### Rstest

顺序：

1. 现有 `pnpm test` 持续全绿
2. 新增规则层测试，不改旧断言语义
3. 新增模拟层测试后，`100` 局模拟必须稳定、可复现、不 flaky

验收：

- 规则层至少新增 `8-12` 个核心规则测试
- 模拟层能稳定输出 `SimulationSummary`
- 两种策略都能稳定跑 `100` 局

### Playwright

运行方式：

- 本地：`pnpm test:e2e`
- 调试：`pnpm test:e2e:ui`

验收：

- 5 条主流程用例全部通过
- 失败时可回放 trace
- 不依赖 sleep

---

## 假设与默认值

- 不重构现有测试体系，只增量扩展
- 模拟层第一阶段只支持 `walker`
- runner 统一使用 `GameEngine.dispatch`
- 分支成型标准固定为“2 张核心卡 + 1 个核心遗物”
- 污染定义固定为“新增牌中非角色 `rewardCardPool` 牌占比 > 0.4”
- E2E 中的商店 / 事件 / 奖励流程允许借助 `DebugPanel` 跳转
- Playwright 仅测 Chromium
- 本轮不引入视觉回归、截图基线、性能基准、覆盖率门槛
