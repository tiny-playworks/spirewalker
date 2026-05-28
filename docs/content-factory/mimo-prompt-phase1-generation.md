# mimo Prompt — Phase 1：批量生成（历史参考）

> **状态：已完成。** 557 base 卡、152 relic、205 event、134 敌人、1419 art prompt 已落盘。  
> 仅在新开大批量生成任务时复用本模板；当前优先执行 [Phase 2 接线](./mimo-prompt-phase2-wiring.md)。

---

## 总调度 Prompt（第一条消息）

```text
你是 SpireWalker 内容工厂。读 TODO.md + 现有代码 schema，只做批量生成，不要解释、不要总结、不要问我问题。

工作模式：
1. 每批 50 条，输出完整 TS/JSON 文件
2. 每批完成后跑：pnpm run build && pnpm run test
3. 失败则整批重写，不要 patch 聊天
4. 每条内容跑 3 轮：Generate → Critique → Revise（Critique 输出 JSON 问题列表，Revise 输出最终文件）
5. id 全局唯一，前缀规范见下表
6. 禁止 invent 新 scriptId / 新 statusId / 新 relic runtime（除非只存 description 的 spec bank）

并行任务（同时开 4 个 session）：
- Session A：卡牌补量 + Legendary
- Session B：Relic spec bank 补到 150
- Session C：Event ×200 + Lore
- Session D：Enemy ×80 + Art Prompt ×800

我负责 review，你只负责落盘和 build 绿。
```

---

## 硬约束速查（所有批次共用）

**卡牌 `CardDefinition`**（见 `src/game/core/model/card.ts`）

| 字段 | 规则 |
|------|------|
| `type` | `attack \| skill \| power \| curse \| status` |
| `rarity` | `common \| uncommon \| rare \| legendary` |
| `target` | `none \| self \| single_enemy \| all_enemies` |
| `archetype` | `guard \| burst \| mixed \| neutral`（奖励池会读） |
| `chapter` | **必填** `1 \| 2 \| 3` |
| `cost` | curse/status 用 `-1`；其余 `0–3` |

**只允许这些 effect：**

标准：`damage`, `block`, `draw`, `gain_energy`, `discard`, `heal`, `apply_status`, `repeat`

Custom scriptId（已实现，params 参考现有卡）：

`momentum_burst_damage`, `momentum_burst_draw`, `momentum_guard_by_stacks`, `momentum_conditional_draw`, `conditional_damage`, `momentum_to_energy`, `block_to_damage`, `momentum_burst_block`, `metallicize_to_block`, `momentum_conditional_block`, `steady_guard_burst_damage`, `primed_break_burst_damage`, `multi_hit_with_block`, `energy_to_damage`, `consume_block_for_damage`, `conditional_block`, `overload_exhaust_attacks`, `blood_rush_strike`, `fortify_convert_flag`, `flow_shift`, `balance_edge`

**statusId 只用：** `strength`, `weak`, `vulnerable`, `momentum`, `metallicize`, `steady_guard`, `primed_break`, `patience_power`

**id 前缀：**

| 流派 | 前缀 | 文件 |
|------|------|------|
| guard | `gd_` | `cards/guard/generated_*.ts` |
| burst | `bt_` | `cards/burst/generated_*.ts` |
| mixed | `mx_` | `cards/mixed/generated_*.ts` |
| neutral | `nt_` | `cards/neutral/generated_*.ts` |
| curse | `curse_` | `cards/curse/` |
| relic | snake_case | `generated_relics/batchN.ts` |
| event | snake_case | `events/batchN.ts` |
| enemy | `gen_en_` | `monsters/generated/` |

**奖励池规则**（`rewardPoolRules.ts`）：不要 `junk_*`、`neutral_common_*`；neutral 必须在白名单或有非 neutral archetype。

---

## Session A：卡牌 Generate Prompt

```text
批次：{BATCH_ID}，生成 {COUNT} 张 CardDefinition。
主题：{THEME}，流派：{ARCHETYPE}，chapter 分布：common→1, uncommon→2, rare/legendary→3。
输出文件：src/game/core/definitions/cards/{archetype}/generated_{batch}.ts
格式：export const GUARD_GENERATED_E: Record<string, CardDefinition> = { ... };
参考：src/game/core/definitions/cards/guard/generated_c.ts

约束：
- 只用已实现的 effect / scriptId（列表见上）
- 每张必填：id, name, description, type, rarity, cost, target, effects, archetype, chapter, tags
- id 不得与 CARD_DEFINITIONS 现有 id 重复（grep 自检）
- 数值：common 伤害 4–12，block 4–10；uncommon 12–18；rare 18–35；legendary 25–50
- 不要 neutral_common_* 命名
- 输出纯 TS，零注释说明文字

生成后 merge 进各流派 index.ts + starter.ts Object.assign。
```

### 卡牌 Critique Prompt

```text
你是数值策划审查员。读刚生成的 {FILE}，对比 CARD_DEFINITIONS 全库。
输出 JSON 数组，每条卡一个问题：
[
  { "id", "severity": "high|med|low", "issue", "fix" }
]
检查项：id 重复、名称重复、description 与 effects 不符、数值越界、非法 scriptId、缺 chapter、
同费同效果重复、legendary 不够独特、curse 有正 effects 可打出
不要输出 TS，只输出 JSON。
```

### 卡牌 Revise Prompt

```text
读 {FILE} + 上一条 Critique JSON。修复所有 high/med 问题，输出完整修订版 TS 文件。
不要解释。
```

---

## Session B：Relic Generate Prompt

```text
批次 batch{N}，生成 50 个 RelicDefinition。
文件：src/game/core/definitions/generated_relics/batch{N}.ts

分类比例：guard 30% / burst 30% / mixed 20% / neutral 15% / curse-risk 5%
描述必须可程序实现（写清触发条件和数值），不要模糊「有时」「可能」
id snake_case，不得与 RELIC_DEFINITIONS 重复
dark fantasy 短句，20–40 字
纯 TS，无解释

Relic 可以只写 description（spec bank），runtime hook 后续 Phase 2 再接。
```

---

## Session C：Event Generate Prompt

实际落盘 schema 见 `src/game/core/definitions/events/index.ts`：

```text
文件：src/game/core/definitions/events/batch{N}.ts

export interface EventOutcome {
  type: 'gain_gold' | 'lose_gold' | 'gain_hp' | 'lose_hp' | 'gain_card' | 'lose_max_hp' | 'gain_relic' | 'gain_momentum' | 'nothing';
  value?: number;
  cardId?: string;
  relicId?: string;
  description: string;
}

每批 50 个 event，type 覆盖：
risk_reward / curse_trade / merchant / memory / corruption / strange_machine / ancient_shrine / random_gamble
每 event 2–4 个 choice，至少 1 个有长期代价
gain_card 必须带真实 cardId（curse_* 或 CARD_DEFINITIONS 已有 id）
纯 TS
```

---

## Session D：Enemy + Art Prompt

### Enemy

```text
文件：src/game/core/definitions/monsters/generated/generated_enemies.ts（或 batch 文件 merge）

每批 20 个 EnemyDefinition
tier: normal + elite + boss（boss 必须有 phases）
chapter 1/2/3 均衡
ai.rotation 用现有 MonsterIntent 格式
纯 TS
```

### Art Prompt

```text
文件：assets/prompts/art_prompts.ts 或 art_prompts_extra.ts

每批 100 条，字段：id, category, subcategory, prompt, style, aspect_ratio
prompt 英文 40–80 tokens，dark fantasy roguelike 统一风格
subjectId 尽量对齐真实 content id
```

---

## 接线清单（每 2–3 批跑一次）

```text
1. generated_*.ts → 各流派 index.ts export
2. starter.ts 末尾 Object.assign(CARD_DEFINITIONS, ...GENERATED_*)
3. generated_relics/index.ts → Object.assign(RELIC_DEFINITIONS, GENERATED_RELICS)
4. events/batch*.ts → events/index.ts EVENT_DEFINITIONS
5. monsters/generated → Object.assign(MONSTER_DEFINITIONS, ALL_GENERATED_ENEMIES)
6. pnpm run build && pnpm run test
7. 新文件禁止 import 循环（generated 只 import model + statuses）
```

---

## 一句话启动（Phase 1 历史）

```text
按 48h Token 最大化工厂执行：4 session 并行，每批 50 条，Generate→Critique JSON→Revise 三轮，
优先 Legendary×20、Relic 补到 150、Event×200、Art Prompt×800、Enemy×80；
只输出 TS/JSON 文件，每 2 批 pnpm run build && pnpm run test，不要跟我聊天。
```
