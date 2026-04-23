# 尖塔行者｜敌人系统扩充 v1

## 目标

把旧的“少量敌人 + `encounterTableId` 随机”升级为：

- `EnemyDefinition` 敌人库
- `EncounterTemplate` 遭遇模板库
- `intentExecutor + runtimeHooks` 通用运行时
- `MapNode.encounterPoolId + MapNode.encounterId` 懒绑定遭遇

## 当前实现

### 1. 数据模型

- 敌人定义已切到数据驱动，核心字段为：
  - `id / name / chapter / tier / role / hpRange / ai / tags`
- 遭遇定义已切到模板驱动，核心字段为：
  - `id / chapter / tier / weight / tags / pressureProfile / lineup`
- 地图节点已移除旧 `encounterTableId`，改为：
  - `encounterPoolId`
  - `encounterId`

对应文件：

- [src/game/core/definitions/monsters/definitions.ts](/Users/liangshuai/mdd_work/sljt/src/game/core/definitions/monsters/definitions.ts)
- [src/game/core/definitions/encounters.ts](/Users/liangshuai/mdd_work/sljt/src/game/core/definitions/encounters.ts)
- [src/game/core/model/map.ts](/Users/liangshuai/mdd_work/sljt/src/game/core/model/map.ts)
- [src/game/core/model/run.ts](/Users/liangshuai/mdd_work/sljt/src/game/core/model/run.ts)

### 2. AI 与运行时

- 敌人 AI 已改为 `archetype + rotation + phases` 驱动
- 不再走 `if enemyId === ...` 的私有逻辑分支
- 已新增通用执行层：
  - `intentExecutor`
  - `runtimeHooks`

已接入的机制：

- `attack / multi_hit / heavy_charge`
- `block / buff / scale`
- `debuff / reduce_status`
- `summon / split_on_death / revive`
- `thorns / reactive / counter`
- `pollute_draw / lock_hand / draw_pressure`
- `heal / leech`
- `countdown / double_action / phase_shift`
- `max_hp_down / mechanic_reset / copy_echo`

对应文件：

- [src/game/core/systems/enemy/enemyAi.ts](/Users/liangshuai/mdd_work/sljt/src/game/core/systems/enemy/enemyAi.ts)
- [src/game/core/systems/enemy/intentExecutor.ts](/Users/liangshuai/mdd_work/sljt/src/game/core/systems/enemy/intentExecutor.ts)
- [src/game/core/systems/enemy/runtimeHooks.ts](/Users/liangshuai/mdd_work/sljt/src/game/core/systems/enemy/runtimeHooks.ts)
- [src/game/core/systems/battle/turnFlow.ts](/Users/liangshuai/mdd_work/sljt/src/game/core/systems/battle/turnFlow.ts)
- [src/game/core/systems/battle/playCard.ts](/Users/liangshuai/mdd_work/sljt/src/game/core/systems/battle/playCard.ts)

### 3. 地图与遭遇选择

- 地图生成阶段只写 `encounterPoolId`
- 玩家进入节点时才选择最终 `encounterId`
- 选中后会写回节点，并写入 `run.meta.encounterHistory`
- 选择器会限制：
  - 不连续重复相同 encounter
  - 同标签不过量
  - `scaler` 不连续
  - archetype 不连续过多

对应文件：

- [src/game/core/engine/generateBranchingFloor.ts](/Users/liangshuai/mdd_work/sljt/src/game/core/engine/generateBranchingFloor.ts)
- [src/game/core/systems/map/mapFlow.ts](/Users/liangshuai/mdd_work/sljt/src/game/core/systems/map/mapFlow.ts)
- [src/game/core/definitions/encounters.ts](/Users/liangshuai/mdd_work/sljt/src/game/core/definitions/encounters.ts)

### 4. 存档

- 存档版本已升级到 `5`
- 旧 `encounterTableId` 不再作为有效链路保留
- 存档 key 已更新

对应文件：

- [src/game/core/persistence/saveVersion.ts](/Users/liangshuai/mdd_work/sljt/src/game/core/persistence/saveVersion.ts)
- [src/game/core/persistence/saveRun.ts](/Users/liangshuai/mdd_work/sljt/src/game/core/persistence/saveRun.ts)

## 内容规模

当前内容规模已满足本轮硬约束：

- 普通敌人：`36`
- 精英敌人：`12`
- Boss：`6`
- Encounter 模板：`36`

说明：

- 运行时额外保留了 `death_blight_spawn` 这类召唤产物定义，但它不计入主敌人池规模校验。

## 测试与验证

已补充并通过：

- 敌人池规模校验
- Encounter 数量与池子存在性校验
- selector 稳定性与去重校验
- `summon / pollute_draw / lock_hand` 运行时校验
- 旧战斗与地图主流程回归测试

对应测试：

- [tests/enemySystem.test.ts](/Users/liangshuai/mdd_work/sljt/tests/enemySystem.test.ts)
- [tests/monster/enemyAi.test.ts](/Users/liangshuai/mdd_work/sljt/tests/monster/enemyAi.test.ts)
- [tests/engine.test.ts](/Users/liangshuai/mdd_work/sljt/tests/engine.test.ts)

验证结果：

- `pnpm exec tsc --noEmit` 通过
- `pnpm test` 通过，`133` 个测试全绿

## 当前结论

这轮完成的不是“多加了很多怪”，而是把敌人、遭遇、地图绑定、运行时机制、存档这整条链路切到了可扩展系统上。

后续再继续扩内容，重点应该放在：

- 数值平衡
- UI 表达
- 遭遇节奏分层
- 奖励与敌人机制联动
