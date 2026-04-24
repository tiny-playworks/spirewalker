# 流派旗帜牌 + 专属遗物机制验收结论

> 范围：仅验证本地 debug preset 机制闭环，不涉及数值重调，不涉及 UI/Phaser 改动。  
> 验收脚本：`scripts/run-archetype-preset-acceptance.ts`

---

## 1) 三套 preset 验收结果

| Preset | 指定牌/遗物 | 关键牌是否稳定触发 | 遗物是否参与正确结算 | 战斗可完成性 | 备注 |
| --- | --- | --- | --- | --- | --- |
| burst | cards: `overload`, `blood_rush`；relics: `blaze_core`, `fractured_blade` | 是 | 是 | 可稳定完成一场普通战（victory） | `overload` 可稳定触发批量消耗，`blood_rush` 在消耗后进入高伤分支。 |
| guard | cards: `fortify`, `patience_stance`；relics: `iron_heart`, `counter_sigil` | 是 | 是 | 可稳定完成一场普通战（victory） | `fortify` 可触发回合末格挡转伤；`counter_sigil` 反伤按“格挡吸收量 * 30%”生效。 |
| mixed | cards: `flow_shift`, `balance_edge`；relics: `twin_core`, `harmony_emblem` | 是 | 是 | 可稳定完成一场普通战（victory） | 攻防切换奖励成立，`harmony_emblem` 同回合攻+技触发抽牌+回能。 |

---

## 2) 每派当前已成立的决策意图

- **burst（窗口爆发）**：先囤攻击牌与资源，在同一回合用 `overload` 打开爆发窗口，再用 `blood_rush`/后续攻击兑现高额伤害。
- **guard（延迟转化）**：优先确保生存与格挡积累，通过 `fortify` 的回合末转伤 + `patience_stance` 的“不攻击换永久成长”建立后手优势。
- **mixed（攻防切换）**：围绕“先攻还是先防”的顺序选择做收益最大化；`balance_edge`、`flow_shift`、`twin_core`、`harmony_emblem` 共同强化切换行为本身。

---

## 3) 当前观察到的风险点

- `patience_stance` 的永久力量成长具备滚雪球潜力，需继续观察长战中是否出现增长过快的问题。
- `harmony_emblem` 的“抽 1 + 1 能量（同回合攻+技触发）”有成为 mixed 强引擎的风险，存在强度偏高可能。
- 存在“玩家不按流派设计玩法也能稳定获胜”的风险，需要通过人工试玩确认是否出现跨流派最优解。

---

## 4) 后续建议（当前阶段）

- 先进行三局人工试玩（burst / guard / mixed 各一局）验证主观手感与决策意图是否清晰。
- 暂不继续调数值，先收集主观体验与少量对局观察样本。
- 暂不推进 Phaser/UI 迁移，先锁定玩法机制稳定性。

---

## 5) 本轮质量校验结果

- `tsc`：通过
- `npm test`：191 passed

