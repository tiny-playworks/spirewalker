# mimo Prompt — Phase 2：Runtime 接线 + 质量修复（当前主任务）

> 开工前读 [TODO.md §执行进度](../../TODO.md)（2026-05-28 版）。人类 @review，你只负责落盘 + build/test 绿。

---

## 总调度 Prompt（复制整段发给 mimo）

```text
你是 SpireWalker 内容工厂的续作执行者。先读 TODO.md 的「执行进度」段，再读 docs/content-factory/mimo-prompt-phase2-wiring.md 全文。人类负责 review，你只负责落盘 + build/test 绿。

## 当前状态（不要重复生成已有资产）

| 资产 | 已生成 | 已接线 | 缺口 |
|------|--------|--------|------|
| 卡牌 | 557 base，1091 runtime | ✅ 奖励/战斗/升级 | Legendary 15→20；去重；Burn 主题少 |
| Relic | 152 | ⚠️ ~19 有 battle hook | 133 generated 仅 description |
| Event | 205 | ⚠️ Act1 地图 12 id；Act2/3 各 3 legacy | 地图池、gain_card 缺 cardId、gain_relic 空实现 |
| 敌人 | 134 | ⚠️ 8 个 encounter 试点 | 多数 gen 敌人未进遭遇表；部分 encounter 引用了不存在的 id |
| 世界观/美术 | 44 lore + 1419 prompt | 纯 spec | 非本轮重点 |

**整体约 55%**：数量够了，runtime 深度不够。本轮禁止再批量加 200 张卡/100 个 relic，除非任务单明确要求。

## 工作模式

1. 按 Phase 1→4 顺序执行，每 Phase 结束跑：pnpm run build && pnpm run test
2. 失败整批修，不要聊天解释、不要问我问题、不要写总结
3. 每 Phase 输出：改了哪些文件 + 一行结果（build/test 数字）
4. **禁止** invent：新 scriptId、新 statusId、新 EventOutcome type、新 relic hook 框架
5. **允许**：在现有文件里加 relicIds.includes(...)、PILOT_EVENT_IDS、encounter 行、修 cardId、改 generated 卡数值/名字去重

开始 Phase 1。不要解释，直接改代码。
```

---

## Phase 1：Event 地图接线（最高优先级）

**目标**：玩家在 Act2/3 也能遇到 generated event，且 gain_card 有真实 cardId。

### 1A 动态事件池（推荐，不要手抄 200 个 id）

改 `src/game/core/engine/generateBranchingFloor.ts`：

- 从 `events/index.ts` 导入 `EVENTS_BY_CHAPTER` 或 `EVENT_DEFINITIONS`
- Act1 池 = 2 个 legacy merchant/shrine + `PILOT_EVENT_IDS`（已有 10 个，保持）
- Act2 池 = 2~3 个 legacy + 从 `chapter === 2` 抽 **15** 个 event id（固定列表或 seed 均可，但要可测）
- Act3 池 = 2~3 个 legacy + 从 `chapter === 3` 抽 **15** 个
- 新增 `tests/content/eventPools.test.ts`：Act2/3 池长度 ≥ 10，且每个 id ∈ `EVENT_DEFINITIONS`

**不要**把 205 个全塞进池。

### 1B 修复 gain_card 缺 cardId

grep：`type: 'gain_card'` 且没有 `cardId` 的 outcome。

规则：
- curse → 用 `curse/curse.ts` 真实 id
- 设计牌 → 用 `isRewardEligible === true` 的 id
- 「随机稀有卡」类 description → 改成 `gain_gold` 或 `nothing`

### 1C gain_relic 最小实现

改 `src/game/core/systems/event/eventRuntime.ts`：

```ts
case 'gain_relic':
  if (outcome.relicId && !run.meta.relics.includes(outcome.relicId)) {
    run.meta.relics.push(outcome.relicId);
    applyRelicPickupEffect(run, outcome.relicId);
  }
  return true;
```

扩展 `EventOutcome`（`events/index.ts`）加 `relicId?: string`。  
给 5~10 个 merchant/shrine event 补 `relicId`（只用 `RELIC_DEFINITIONS` 已有 id）。

**验收**：test 全绿；Act2 池测试通过。

---

## Phase 2：Relic Runtime（20 个试点）

读 `src/game/core/definitions/generated_relics/IMPLEMENTATION_NOTES.md`。

从 Batch1~3 挑 **20** 个，在现有 hook 点接线（仿 `playCard.ts` / `createMvpRun.ts` 里 `relicIds.includes('iron_heart')`）：

| 推荐首批 | Hook 文件 |
|----------|-----------|
| momentum_siphon, bulwark_heart, stone_bulwark | playCard.ts block/damage |
| echo_plating, flow_anchor | createMvpRun.ts battle start |
| bulwark_sigil, fortify_root | playCard block gain |
| tide_walker | momentum consume |
| cycle_engine, alternating_crest | turn/play sequence |

**不要**新建 `onMomentumConsumed` 事件总线。

新增 `tests/relics/generatedRelicHooks.test.ts`：20 个 id 在代码库中有 `includes('id')` 引用。

---

## Phase 3：Encounter 表扩展 + 修 broken id

读 `encounters.ts` + `monsters/generated/generated_enemies.ts`。

**已知 bug（必须修）** — lineup id 不存在于 `MONSTER_DEFINITIONS`：
- `gen_en_combo_assassin`
- `gen_en_iron_golem`
- `gen_en_support_drone`

替换为同 chapter 真实 id，或补定义（优先替换）。

**扩展**：再增 **12** 条 encounter（Act1/2/3 各 4）：
- tier: normal 8 / elite 3 / boss 1
- weight: 2~4
- lineup 全部 id ∈ `MONSTER_DEFINITIONS`

新增 `tests/content/encounterWiring.test.ts`：每条 encounter 的 monsterId 必须存在。

---

## Phase 4：卡牌补量 + 去重（小批）

### 4A Legendary +5（必须含 1 张 neutral）

新建 `cards/neutral/generated_legendary.ts` + 各流派 1~2 张。

- effects 只用已实现 scriptId 或标准 effect
- status 只用现有 8 种（**无 burn/poison/bleed 引擎**）
- 每张加 upgrade 规则 → `generated_upgrade_rules.ts`

### 4B Generated 去重

```bash
pnpm audit:cards
```

只修 `gd_/br_/mx_/nt_` 前缀：同名 >2、generated 间同 fingerprint。

**禁止**手改 starter / common.ts 等设计牌。

**验收**：`cardAudit.test.ts` 通过。

---

## Phase 5（可选）

- `art_prompts_linked.ts` 94 → 200（subjectId ∈ 真实 content id）
- 10 张 generated 卡 `tags` 加 faction 名（`lore/factions.ts`）

---

## 硬约束速查

**已实现 custom scriptId**

`momentum_burst_damage`, `momentum_burst_draw`, `momentum_guard_by_stacks`, `overload_exhaust_attacks`, `blood_rush_strike`, `fortify_convert_flag`, `flow_shift`, `balance_edge`, `momentum_conditional_draw`, `conditional_damage`, `momentum_to_energy`, `block_to_damage`, `momentum_burst_block`, `metallicize_to_block`, `momentum_conditional_block`, `steady_guard_burst_damage`, `primed_break_burst_damage`, `multi_hit_with_block`, `energy_to_damage`, `consume_block_for_damage`, `conditional_block`

**statusId**

`strength`, `weak`, `vulnerable`, `momentum`, `metallicize`, `steady_guard`, `primed_break`, `patience_power`

**EventOutcome type**

`gain_gold` | `lose_gold` | `gain_hp` | `lose_hp` | `gain_card` | `lose_max_hp` | `gain_relic` | `gain_momentum` | `nothing`

**奖励池（不要破坏）**

- walker pool ~337，early ~27（`rewardPoolRules.ts`）
- junk_* / neutral_common_* / curse / status 不进池

**验收门槛（每 Phase）**

- `pnpm run build` ✅
- `pnpm run test` ✅（baseline **225** tests，只能增不能减）

---

## 分 Phase 单发（mimo 做不完时拆开）

| 消息 | 内容 |
|------|------|
| 第 1 条 | 总调度 + 只做 Phase 1（Event） |
| 第 2 条 | Phase 2（Relic 20 hook） |
| 第 3 条 | Phase 3（Encounter） |
| 第 4 条 | Phase 4（Legendary + 去重） |

## Review 重点（给人类）

- encounter 怪物 id 是否存在于 `MONSTER_DEFINITIONS`
- event 池是否过大导致 engine 测试失败
- relic 是否 invent 了新 hook 框架而非 `relicIds.includes`
