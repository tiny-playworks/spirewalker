# Act1 难度曲线重定标计划

## Summary

本轮应继续调整 Act1，而且不是微调，是把第一章从“高压筛选”重定标到“第一章合理通过区间”。

目标锁定：

- 全局 Boss reach >= 50%
- 全局 Act2 entry >= 30%
- burst entry >= 40%
- guard entry >= 20%
- mixed entry >= 15%
- Boss 通过率 >= 55%

不改 Act2 encounter、不改卡牌、不改 reward 核心逻辑、不重做 mixed、不继续大砍 `reactive/shell`。

## Implementation Changes

- 地图生成：在 [generateBranchingFloor.ts](/Users/liangshuai/mdd_work/sljt/src/game/core/engine/generateBranchingFloor.ts) 给 Act1 增加路线形态修复。
  - 每张 Act1 图强制存在一条 `0 elite` safe route。
  - 每张 Act1 图强制存在一条 `1 elite` balance route。
  - 每张 Act1 图保留一条 `2+ elite` risk route。
  - safe route 普通战固定控制在 `4~5`，至少 `2` 个非战斗缓冲节点，不允许连续 `3` 个 battle。
  - 不减少分支数量，不移除 cross-link，不把地图改成一本道。
- 地图测试：更新 [mapGeneration.test.ts](/Users/liangshuai/mdd_work/sljt/tests/core/mapGeneration.test.ts)。
  - 新增 Act1 全路径枚举断言：存在 `0 elite`、`1 elite`、`2+ elite` 可达 Boss 路线。
  - 新增 safe route 断言：normal fights 为 `4~5`，buffer >= `2`，max battle streak <= `2`。
  - 保留“risk 路有风险波峰”的测试，但不要要求 safe/balance 承担后段精英保底。
- `debt_monk`：在 [definitions.ts](/Users/liangshuai/mdd_work/sljt/src/game/core/definitions/monsters/definitions.ts) 只改一个主要压制点。
  - 采用 `lockHand(2) -> lockHand(1)`。
  - 不同时改 `drawPressure` 和 `heavy`，避免一次性失去归因。
  - 目标：guard vs debt_monk >= 20%，mixed vs debt_monk >= 10%。
- Act1 Boss：做中等幅度下修，保留机制身份。
  - `slime_boss`：phase 2 threshold `0.65 -> 0.55`，延后召唤压力窗口。
  - `act1_boss_gate`：`block(16) -> block(10)`，`heavy(22, 1) -> heavy(18, 1)`。
  - 同步更新 [enemyAi.test.ts](/Users/liangshuai/mdd_work/sljt/tests/monster/enemyAi.test.ts) 的 Boss/精英定义断言。
- Simulation 诊断：补强 [act2EntryValidation.ts](/Users/liangshuai/mdd_work/sljt/src/game/simulation/act2EntryValidation.ts) 与 [run-act2-entry-validation.ts](/Users/liangshuai/mdd_work/sljt/scripts/run-act2-entry-validation.ts) 输出。
  - 增加 safe/balance/risk 路线结构汇总：elite count、normal count、buffer count、max battle streak。
  - 增加 debt_monk 按 persona 拆分。
  - 保持现有 death tier、Boss reach、Act2 entry、firstEliteWin 输出。
  - 不改 Act2 encounter，只观察 Act2 entry state。

## Phasing

- Phase 1 同轮完成：safe path 强安全化、`debt_monk lockHand(1)`、Boss 中等下修、路线结构诊断。
- Phase 2 只做验证和判断，不继续顺手砍普通战。
- 如果 Act2 entry 仍低于 30%，下一轮再看是否是 simulation route policy 过度撞精英，还是 Act1 Boss/精英仍超标。
- 如果 Boss win rate 超过 70%，下一轮优先回调 Boss，而不是回头加强普通战。

## Verification

必须运行：

```bash
pnpm test tests/core/mapGeneration.test.ts tests/enemySystem.test.ts tests/monster/enemyAi.test.ts tests/simulation/act2EntryValidation.test.ts
```

必须运行：

```bash
pnpm exec tsx scripts/run-act2-entry-validation.ts --seeds 1001,1002,1003,1004,1005 --runs 100 --progress-every 0 --report-act1-pre-boss-loss
```

最终报告按这些前后对比输出：

- Boss reach：基线 `15.8%` -> 新结果
- Act2 entry：基线 `5.47%` -> 新结果
- burst/guard/mixed entry：基线 `13.0% / 1.4% / 2.0%` -> 新结果
- Boss win rate：基线约 `34.6%` -> 新结果
- firstEliteWin：全局与 persona 拆分
- debt_monk：guard/mixed/burst 拆分
- safe/balance/risk 路线结构
- death tier：normal / elite / boss 前后对比

## Acceptance Criteria

- 全局 Boss reach >= 50%。
- 全局 Act2 entry >= 30%。
- burst Act2 entry >= 40%。
- guard Act2 entry >= 20%。
- mixed Act2 entry >= 15%。
- Boss win rate >= 55%，理想区间 `55%~65%`。
- guard vs debt_monk >= 20%。
- mixed vs debt_monk >= 10%。
- Act1 safe route 每 seed 都满足：`0 elite`、`4~5 normal`、`>=2 buffer`、无连续 `3 battle`。
- risk route 仍有 `2+ elite`，高风险路线身份保留。
- `nonBattleEnd` 继续为 `0`，`simAbort` 不显著上升。

## Assumptions

- v1.0 前不考虑旧存档兼容。
- 本轮不创建文档文件。
- 当前目标优先服务 Act1 合理通过率；Act2 只观察，不正式平衡。
