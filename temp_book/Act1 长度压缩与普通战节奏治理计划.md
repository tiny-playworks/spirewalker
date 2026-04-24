# Act1 地图缩短与普通战节奏分阶段计划

**Summary**

- 分两阶段执行，严格隔离变量：阶段 1 只做 Act1 地图长度/层数依赖修正与统计输出；阶段 2 才改 Act1 normal encounter 权重和普通怪节奏。
- 当前基线：Act1 `20` 层，Boss 前固定休息在 `19` 层；完整路线普通战均值 `9.31` 场；指定脚本全局 `Act2 entry=6/900`，`act1CombatGameOver=819/900`，`act1_normal_reactive totalHpLoss/avgHpLoss=14168/21.86`。
- 目标：阶段 1 把 Act1 压到 `14` 层并保留路线选择；阶段 2 把大多数普通战压到 `6-8` 回合，`act1_normal_reactive avgHpLoss` 降到 `10-14` 且不低于 `8`。

**阶段 1：地图长度与层数依赖**

- 修改 [generateBranchingFloor.ts](/Users/liangshuai/mdd_work/sljt/src/game/core/engine/generateBranchingFloor.ts:9)：Act1 `20 -> 14`，保持 4 条路径、交叉边、risk/balance/safe 路线语义；Boss 前固定休息随 `restDepth = totalDepth - 1` 自动变为 `13` 层，Boss 为 `14` 层。
- 检查并更新层数依赖：
  - early/mid/late 已按 `depth / totalDepth` 计算，保留比例逻辑。
  - `lateRiskStartDepth(totalDepth)`、宝箱深度、补给软保底随 `totalDepth` 自动变化；补测试确认短 Act1 仍有补给与风险波峰。
  - [encounters.ts](/Users/liangshuai/mdd_work/sljt/src/game/core/definitions/encounters.ts:145) 的普通战 profile 解锁先不改权重/数值；只把 `earlyDepth <= 7` 改为短 Act1 对应的 `<= 5`，避免 14 层后 disruption 限制覆盖过长。
  - [types.ts](/Users/liangshuai/mdd_work/sljt/src/game/simulation/types.ts:54)、[act2EntryValidation.ts](/Users/liangshuai/mdd_work/sljt/src/game/simulation/act2EntryValidation.ts:40)、[run-act2-entry-validation.ts](/Users/liangshuai/mdd_work/sljt/scripts/run-act2-entry-validation.ts:263) 的 floor bucket 改为短 Act1 三段：`1-5 / 6-9 / 10-Boss 前`。
  - [MapPage.tsx](/Users/liangshuai/mdd_work/sljt/src/features/map/MapPage.tsx:142) 去掉 `19/23/25` 写死，改为根据当前节点是否为 Boss 前固定休息判断。
  - 全仓搜索 `19/20/1-7/8-13/14+`，只处理真实 Act1 层数依赖，不碰表现层无关尺寸数字。
- 新增阶段 1 统计输出到现有 Act2 entry 验证报告：
  - 普通战次数：完整路线 map shape 均值/范围，以及实际 run 的 Act1 normal attempts 均值。
  - `Act2 entry`、`act1CombatGameOver`。
  - 首精英回归：`firstEliteAttempts / firstEliteWin`、按 monsterId attempts/wins/winRate、到达首精英前平均 deck size、到达首精英前平均 normal fights。
- 阶段 1 验证命令：
  - `pnpm test tests/core/mapGeneration.test.ts tests/enemySystem.test.ts tests/simulation/act2EntryValidation.test.ts`
  - `pnpm exec tsx scripts/run-act2-entry-validation.ts --seeds 1001,1002,1003 --runs 100 --progress-every 0 --report-act1-pre-boss-loss`
- 阶段 1 输出必须单独标注为“地图缩短变化”，不与阶段 2 数值调整混在一起。

**阶段 2：Normal Encounter 权重与节奏**

- 只在阶段 1 验证后进行，不改首精英、Boss、Act2、卡牌、reward、Phaser、存档、多角色体系。
- 权重调整优先降低高压普通战出现率：
  - `act1_normal_reactive: 7 -> 4`
  - `act1_normal_tax: 8 -> 5`
  - `act1_normal_multi: 5 -> 4`
  - `act1_normal_shell: 7 -> 5`
  - `act1_normal_press: 6 -> 7`
- `act1_normal_reactive` 保留 attrition 身份但明显降耗血：
  - `bone_crow reactive(4) -> reactive(2)`，`multi(4,2) -> multi(3,2)`。
  - `mire_toad atk(8) -> atk(6)`，保留 Weak/Vulnerable 循环。
  - 验证目标：`avgHpLoss 10-14`，不得低于 `8`。
- `act1_normal_shell` 不再靠反复微调 HP 解决；若阶段 2 后仍 `avgTurns > 20`，直接处理防御循环：
  - `slime_shell block(12) -> block(6)`，并避免连续防御形成常态拖回合。
  - 目标：普通战不出现 20+ 回合常态，shell `avgTurns <= 12`。
- `act1_normal_tax / multi` 只做轻量降压：tax 降 counter 耗血，multi 优先降单次前压伤害或局部 HP，不改变题型身份。
- 阶段 2 验证使用同一组命令，并输出“normal encounter 调整变化”：对比阶段 1 后结果，而不是只对比原始基线。

**测试与验收**

- 测试更新：
  - [mapGeneration.test.ts](/Users/liangshuai/mdd_work/sljt/tests/core/mapGeneration.test.ts:1)：Act1 层数为 `14`、Boss 前休息为 `13`、首步仍至少三路、短 Act1 仍有补给/事件/风险路线。
  - [enemySystem.test.ts](/Users/liangshuai/mdd_work/sljt/tests/enemySystem.test.ts:50)：短 Act1 的 early disruption 限制与 profile 解锁仍符合预期。
  - [act2EntryValidation.test.ts](/Users/liangshuai/mdd_work/sljt/tests/simulation/act2EntryValidation.test.ts:1)：新增首精英回归字段与短 Act1 bucket 输出。
- 最终报告必须分三列：原始基线、阶段 1 后、阶段 2 后。
- 必须输出：
  - 普通战次数
  - avgTurns
  - act1CombatGameOver
  - Act2 entry
  - `act1_normal_reactive totalHpLoss / avgHpLoss`
  - `firstEliteAttempts / firstEliteWin`
  - firstElite 按 monsterId 拆分
  - 首精英前平均 deck size
  - 首精英前平均 normal fights

**Explicit Non-Changes**

- 不改首精英定义与首精英池。
- 不改 Boss。
- 不改 Act2。
- 不改卡牌与 guard 专项牌。
- 不改 reward 核心逻辑。
- 不改 BattleScene / Phaser 表现层。
- 不改存档系统。
- 不改多角色 / mixed 新体系。
- 不创建文档。
