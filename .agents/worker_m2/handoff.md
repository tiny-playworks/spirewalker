# Handoff Report — Milestone 2 (Requirement R2: Event Pool Expansion & Condition Parser)

## 1. Observation

- **Condition Parser**:
  - `src/game/core/events/eventConditionParser.ts`：统一解析/求值 `choice.requirements`（gold/hp/maxHp/relic/card + 复合分隔符）。
  - 空条件放行；无法识别片段 fail-closed。
- **Runtime / UI 接线**:
  - `eventRuntime.ts`：`resolveGenericEvent` 用 `evaluateChoiceRequirements` 替代仅 `gold >= N` 的 regex。
  - `EventPage.tsx`：通用选项禁用逻辑同步改用同一求值器；legacy 自定义 UI 未改。
- **地图事件池扩展**:
  - `generateBranchingFloor.ts`：去掉 `count: 8`；`EVENT_POOLS` 按 Act→Chapter 全量 + legacy 前缀；`assignEventScripts` 基于 seed shuffle，并保留 camp / primary-legacy 注入。
- **测试**:
  - 新增 `tests/events/eventConditionParser.test.ts`。
  - 更新 `tests/content/eventPools.test.ts`（全量池 + legacy 不变量）。
- **验证**: `pnpm check` PASS（rslint 0 / tsc / rstest **271/271**）。首次全量跑曾偶现 Act3 池断言失败，隔离与复跑均通过——文档记为偶发，未见稳定复现。

## 2. Logic Chain

1. Explorer 蓝图要求统一条件求值 → 新建 parser，runtime/UI 共用。
2. 地图池从 8 扩到章节全量（208 defs：Ch1=70 / Ch2=66 / Ch3=72）→ 去掉截断 + seed 抽样。
3. Legacy resolver 链（`EVENT_OPTION_RESOLVERS` → `resolveGenericEvent`）保持不变，避免破坏既有引擎/UI 测试。

## 3. Caveats / 遗留风险

- 未识别 requirement 语法一律 `false`：若内容定义出现新方言，选项会被静默禁用，需扩展 parser 或修内容。
- Act 池长度含跨章 legacy（如 Act3 含 `burst_altar`），略大于纯 chapter 计数属预期。
- 未跑 `pnpm simulate:act1` / `pnpm build` / e2e（建议 M5 或 Reviewer 门禁补跑）。
- M2 尚未经独立 Reviewer / Auditor 审计。

## 4. Conclusion

R2 核心实现已落盘并通过 `pnpm check`。蓝图中的 parser、全量章节池、runtime/UI 接线与测试均已到位。可进入 Reviewer/Auditor，或并行启动 M3（PWA）。

## 5. Verification Method

```bash
pnpm check
# 或聚焦：
pnpm exec rstest run tests/events/eventConditionParser.test.ts tests/content/eventPools.test.ts
```

Inspect:
- `src/game/core/events/eventConditionParser.ts`
- `src/game/core/systems/event/eventRuntime.ts`
- `src/features/event/EventPage.tsx`
- `src/game/core/engine/generateBranchingFloor.ts`
- `tests/events/eventConditionParser.test.ts`
- `tests/content/eventPools.test.ts`

## 6. Next Steps (M3)

1. 参考 `.agents/explorer_pwa_mobile/analysis.md`。
2. 落地 `public/manifest.webmanifest` + `public/sw.js`（Cache-First App Shell）。
3. 在 `src/index.tsx` 静默注册 SW；与游戏 Core 解耦。
4. 新建 `worker_m3/` 并更新 orchestrator progress。
