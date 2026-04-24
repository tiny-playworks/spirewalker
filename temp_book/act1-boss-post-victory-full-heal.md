# Act1 Boss 战后满血过渡

## 目的

玩家在**成功击败 Act1 Boss** 后，在进入战后奖励界面之前将血量恢复至当前最大生命，减轻进入 Act2（或 Act2 入口验证段）时的挫败感，并与后续压力验证的起点一致。

## 行为摘要

| 条件 | 行为 |
|------|------|
| `run.meta.act === 1` 且当前地图节点 `type === 'boss'` 且 `battle.phase === 'victory'`，且通过 `LEAVE_BATTLE_TO_REWARD` 进入战后流 | 将战斗内玩家单位 `hp` 设为 `maxHp`，并同步 `run.player.currentHp` / `run.player.maxHp` |
| 战斗失败、`phase !== 'victory'`、非 Act1、非 Boss 节点 | 不执行本逻辑 |

## 实现位置

- `applyAct1BossPostVictoryFullHealIfEligible`：`src/game/core/systems/common/runGuards.ts`（注释说明触发条件与意图）
- 调用点：`leaveBattleToRewardFlow`（`src/game/core/systems/reward/rewardFlow.ts`）在生成奖励、清空 `run.battle`、切换 `screen` 为 `reward` **之前**

## 与引擎顺序的关系

`GameEngine.dispatch` 在每条指令后仍会执行 `syncRunPlayerFromBattle`；满血在清空 `battle` 前写入 `run.player`，因此奖励界面与后续选牌回地图时，`run.player` 已反映满血状态。

## 测试

- `tests/engine.test.ts`：Act1 Boss 低血量胜利 → 奖励界面时已满血；Act1 普通战胜利 → 血量不被强刷满
- `tests/battle/victoryDefeat.test.ts`：失败路径血量行为不变
