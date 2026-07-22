# 🚀 Spirewalker (尖塔行者) - Cursor 接续开发交接文档

> **交接时间**：2026-07-22  
> **项目路径**：`/Users/liangshuai/mdd_work/sljt`  
> **分支**：`main`  
> **环境要求**：Node.js >= 20, pnpm >= 9

---

## 📌 一、 当前项目进展概览 (Progress Overview)

根据已审定的 V2 架构演进 Roadmap，目前进度如下：

| Milestone | 模块名称 | 完成状态 | 核心产出 / 说明 |
| :--- | :--- | :--- | :--- |
| **M0** | 架构勘探与设计蓝图 | **100%** | `.agents/` 下已生成完整的 R1~R4 模块分析蓝图 (`analysis.md`) |
| **M1** | 遗物协议与掉落池整合 | **100% (已落盘)** | 建立 `relicHookProtocol.ts`，成功接线 71 个遗物 Hook，并注入掉落池与商店 |
| **M2** | 208 事件分章抽样与条件解析 | **已落盘** | `eventConditionParser.ts` + 全量章节 `EVENT_POOLS` + runtime/UI 接线；详见 `.agents/worker_m2/` |
| **M3** | 独立 PWA 离线支持 | **待开始 (蓝图就绪)** | 详细方案详见 `.agents/explorer_pwa_mobile/analysis.md` |
| **M4** | 移动端 Safe-Area 与 Touch 打磨 | **待开始 (蓝图就绪)** | 详细方案详见 `.agents/explorer_pwa_mobile/analysis.md` |

---

## 🛠️ 二、 Milestone 1 已落盘代码变更 (Completed Changes)

在当前工作区中，Milestone 1 的修改已完成并落盘，改动清单如下：

1. **[NEW] 遗物 Hook 协议层**：
   - `src/game/core/relics/relicHookProtocol.ts`：定义了 71 个生成遗物的触发分类与标准 Capability Matrix。
2. **[MODIFY] 战斗引擎 Hook 逻辑**：
   - `src/game/core/systems/relic/relicHooks.ts`：实现了战始（`onBattleStart`）、回合始（`onTurnStart`）、打牌（`onCardPlayed`）及格挡/力量叠加等钩子。
3. **[MODIFY] 掉落池与商店生成器**：
   - `src/game/core/definitions/relics.ts`：将 71 个已接线遗物正式注入 `COMMON_RELIC_POOL` 与角色奖励池。
   - `src/game/core/engine/generateShop.ts`：商店机制已支持刷新与售卖新遗物。
4. **[NEW] 单元测试与压测**：
   - `tests/relics/m1RelicStress.test.ts`：新增了 71 个遗物的单元测试与随机掉落覆盖率验证。

---

## 🛠️ 二-B、 Milestone 2 已落盘代码变更

1. **[NEW] 事件条件解析器**：
   - `src/game/core/events/eventConditionParser.ts`：支持 gold/hp/maxHp/relic/card 与复合条件；fail-closed。
2. **[MODIFY] Runtime / UI**：
   - `eventRuntime.ts`、`EventPage.tsx`：统一使用 `evaluateChoiceRequirements`。
3. **[MODIFY] 地图事件池**：
   - `generateBranchingFloor.ts`：去掉 8 条截断；Act→Chapter 全量池 + seed shuffle；保留 legacy 前缀与 camp 保证。
4. **[NEW/MODIFY] 测试**：
   - `tests/events/eventConditionParser.test.ts`
   - `tests/content/eventPools.test.ts`

Agent 交接：`.agents/worker_m2/handoff.md`

---

## 📋 三、 给 Cursor / 继任 Agent 的下一步操作指引 (Next Steps)

当你把代码库交给 Cursor 或新的 Agent 时，请提示它按照以下顺序接续执行：

### Step 1: 验证当前代码基线
在终端中运行以下命令，确保 M1+M2 变更在本地干净通过：
```bash
pnpm check            # 依次运行 rslint, tsc typecheck, rstest 单元测试
pnpm simulate:act1     # 运行 Act1 数值平衡与通关仿真
pnpm build            # 运行 Rsbuild 构建生产包
```

---

### Step 2: （可选）M2 Reviewer / Auditor
* 对照 `.agents/worker_m2/handoff.md` 与 `.agents/explorer_events/analysis.md` 做正式门禁。
* 若通过，再启动 M3。

---

### Step 3: 执行 Milestone 3 —— 独立 PWA 基础设施
* **目标**：为网页版引入完整 PWA 离线安装与 Cache-First 离线运行能力，完全解耦于游戏 Core。
* **参考蓝图**：`.agents/explorer_pwa_mobile/analysis.md`
* **任务步骤**：
  1. 在 `public/manifest.webmanifest` 中配置应用图标、App 名称 `Spirewalker` 及主题色（`#8FB8AE` / `#131314`）。
  2. 在 `public/sw.js` 中实现 Service Worker 静态资源 App Shell Cache-First 策略。
  3. 在 `src/index.tsx` 中静默注册 Service Worker。

---

### Step 4: 执行 Milestone 4 —— 移动端 Safe-Area 与 Touch 体验打磨
* **目标**：适配 iOS/Android 刘海屏与底栏，优化触屏体验。
* **参考蓝图**：`.agents/explorer_pwa_mobile/analysis.md`
* **任务步骤**：
  1. 在 `src/index.css` 的 `:root` 中增加 `env(safe-area-inset-top)`，`env(safe-area-inset-bottom)` 等变量探测。
  2. 针对移动端视口（`@media (hover: none) and (pointer: coarse)`），增大卡牌与地图节点的触碰热区（Tap Targets），防止误触。

---

## 💡 关键文件路径一览 (Key File Index)

- **交接文档**：`CURSOR_HANDOVER.md`
- **遗物 Hook 协议**：`src/game/core/relics/relicHookProtocol.ts`
- **遗物逻辑入口**：`src/game/core/systems/relic/relicHooks.ts`
- **事件条件解析器**：`src/game/core/events/eventConditionParser.ts`
- **地图事件池**：`src/game/core/engine/generateBranchingFloor.ts`（`EVENT_POOLS` / `assignEventScripts`）
- **探索阶段蓝图缓存**：
  - 事件模块蓝图：`.agents/explorer_events/analysis.md`（**已落地** → `worker_m2`）
  - PWA 与移动端蓝图：`.agents/explorer_pwa_mobile/analysis.md`
  - M2 Worker 交接：`.agents/worker_m2/handoff.md`
