# SpireWalker 内容工厂 — Agent Prompt 库

给 **mimo**（或其他批量生成 agent）用的可复制 prompt。人类负责 review；agent 只负责落盘 + `pnpm run build && pnpm run test` 全绿。

## 用哪一份？

| 阶段 | 文档 | 状态 | 何时使用 |
|------|------|------|----------|
| Phase 1 | [mimo-prompt-phase1-generation.md](./mimo-prompt-phase1-generation.md) | **已完成**（557 卡 / 152 relic / 205 event 等已落盘） | 需要再批量加内容时参考 schema 与批次模板 |
| Phase 2 | [mimo-prompt-phase2-wiring.md](./mimo-prompt-phase2-wiring.md) | **当前主任务** | Event 地图池、Relic hook、Encounter、Legendary、去重 |
| Phase 2b | [mimo-prompt-chronicle.md](./mimo-prompt-chronicle.md) | **推荐并行** | 40 条结构化编年史，低风险、对齐现有 lore id |
| 进度真相 | [../../TODO.md](../../TODO.md) §执行进度 | 持续更新 | 开工前必读，区分「已生成」vs「已接线」 |

## 工作约定

1. 少聊天：Generate → 改文件 → build/test，不要解释、不要总结、不要问人类问题
2. 每批结束：`pnpm run build && pnpm run test`（baseline **225** tests，只能增不能减）
3. 禁止 invent：新 `scriptId`、新 `statusId`、新 `EventOutcome` type、新 relic 事件总线
4. 硬约束速查见 Phase 2 文档末尾（与 `playCard.ts` / `rewardPoolRules.ts` 对齐）

## 文件布局（生成物落点）

```
src/game/core/definitions/
  cards/{guard,burst,mixed,neutral}/generated_*.ts
  cards/generated_upgrade_rules.ts
  generated_relics/batch{1,2,3}.ts
  events/batch{1,2,3}.ts
  monsters/generated/generated_enemies.ts
  lore/{factions,regions,boss_lore}.ts
assets/prompts/art_prompts*.ts
```

## Review 分工

- **mimo**：按 prompt 改代码、跑 build/test
- **人类 + Cursor**：对照 `TODO.md` 执行进度 review diff，重点查 id 重复、phantom 引用、测试回归
