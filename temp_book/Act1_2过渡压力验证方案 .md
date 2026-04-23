# Act1 -> Act2 过渡压力验证方案（修订版 3）

## 摘要

- 本轮只做一个受控的 `Act2 入口验证段`，目标仍然只有一个：验证 `Act1` 已成型构筑进入 `Act2` 前段后，`guard / burst / mixed` 是否进入合理新压力区间。
- 不启用完整 `Act2` 章节，不扩整章内容，不改 `Act1` 基线，不重写系统。
- 直接复用现有多 Act 骨架、战斗、奖励、商店、休息流程，只新增：
  - 一个 `固定模板 + 小范围随机` 的 Act2 验证地图
  - 一个人工确认过的最小 encounter 白名单
  - 一个验证段完成标记
  - 一个独立 simulation 模式与指标输出

## 目标与范围

- 本轮只验证：
  - Act1 Boss 后是否能稳定切入最小 Act2 前段
  - 前段 3-5 场战斗是否对 `guard / burst / mixed` 形成新压力
  - 新题型是否在拆舒适区，而不是单纯更高数值
- 明确不做：
  - 完整 Act2 地图生成与章节推进
  - 完整 Act2 敌池 / 事件 / 经济
  - Act2 Boss
  - 多角色
  - 大重构
  - Act1 首精英与 guard 支持牌平衡调整
  - 默认整批启用现有 Act2 草稿 encounter

## 最小 Act2 前段方案

### 地图

- 不改通用 `generateActMap(2)`，单独新增一个验证段地图构造器，例如 `buildAct2EntryValidationMap(seed)`。
- Act1 Boss 奖励结算后，进入这个验证地图，而不是完整 `buildActNodes(2)`。
- 进入验证段时，必须完整继承 Act1 Boss 战后玩家状态：
  - 继承当前 `hp`
  - 继承牌组 `deck`
  - 继承遗物、药水、金币、奖励后的增量结果
  - 不允许任何 `hp / buff / deck` 重置
  - 不允许任何额外补偿或保护性修正
- 地图采用“固定模板 + 小范围随机”：
  - 总长度固定
  - `shop/rest` 补给位固定
  - elite 风险位固定
  - 普通战节点只在白名单中小范围换位
- 建议模板：
  - `起点`
  - `普通战槽 A`
  - `普通战槽 B`
  - `补给分叉: shop / rest`
  - `普通战槽 C`
  - `风险位分叉: safe 普通战 / risk elite`
  - `普通战槽 D`
- 随机规则只允许发生在 `A/B/C/D` 四个普通战槽内：
  - 从已确认白名单普通战中抽取并按约束排列
  - 不改变补给位和 elite 位
  - 不允许随机出白名单外 encounter
- 以下约束为必须满足的约束，布局生成器必须严格执行；任何不满足者都视为非法布局，不允许落地：
  - 前两战不能重复同一 encounter
  - `act2_normal_blast` 只允许出现在后两场普通战 `C / D`，不允许进入前两场 `A / B`
  - `countdown` 类题型不允许出现在第一战
  - `support/scale` 类题型不允许连续出现两次
- 如果随机结果无法满足上述约束：
  - 必须重抽或回退到合法排列
  - 不允许“先生成再放行”

### encounter 白名单

- 本轮不允许“默认整批复用现有 Act2 草稿内容”。
- 只有设计意图清晰、并且本轮人工确认纳入验证段的 encounter 才允许进入白名单。
- 当前计划中先只纳入以下最小集合：
  - 普通 1：`act2_normal_reflect`
  - 普通 2：`act2_normal_curse`
  - 普通 3：`act2_normal_support`
  - 普通 4：`act2_normal_blast`
  - 精英：`act2_elite_lock`
- 计划上明确限制：
  - 其他现有 `act2_*` encounter 虽然代码里存在，但本轮一律不自动启用
  - 地图模板、随机换位、simulation 统计都只能使用上述白名单
- 实现层优先用节点显式 `encounterId` 或专用白名单选择器绑定，不走全量池随机。

### 奖励 / 流程支持

- 战后奖励直接复用现有 reward 流程。
- Shop / Rest 直接复用现有流程，不补新经济系统。
- 卡牌奖励继续走当前 `act=2` 的奖励倾向，不单独扩卡池。
- 验证段结束后需要有一个“验证段完成标记”：
  - 语义上表示“本次 Act2 入口验证跑完”
  - 不表示“正式通关整局”
- 如果实现层为了少改动继续复用 `victory` 屏或 `victory` 状态：
  - 文档与指标命名里必须明确注明这是“验证段完成复用”
  - 不能将其表述成“正式通关整局”

### 公开接口/状态改动

- 在 `run.meta` 增加轻量标记，例如：
  - `validationSegment?: 'act2_entry'`
  - `validationCompleted?: boolean`
  - `enteredAct2EliteBranch?: boolean`
- 只用于：
  - Boss 后切到验证地图
  - 限制只使用白名单 encounter
  - 标记是否进入 elite 分支
  - 验证段终点结算
  - simulation 统计
- 不改战斗状态结构，不改通用地图节点类型。

## 出题设计意图

### Act2 与 Act1 的核心区别

- Act1 更偏“前期是否起步、能否活过首轮成型压力”。
- 这个 Act2 入口段要问的是：
  - 构筑带着 Act1 收获进入中段后，面对打断与拆舒适区，是否还能成立。
- 核心不是单纯血量更厚、伤害更高，而是四类中段压力：
  - `reactive/thorns`：限制爆发流无脑倾倒
  - `lock/debuff`：打断关键牌准时性
  - `heal/scale`：要求中段输出持续性与目标优先级
  - `countdown`：要求有明确收尾能力，不能只拖

### 每只怪在验证什么

- `act2_normal_reflect`
  - 验证 burst 是否仍可无脑前压。
  - 验证 guard 是否能把防守资源转化为稳定过题能力。
- `act2_normal_curse`
  - 验证锁牌、弱化、脆弱下的回合质量。
  - mixed 在这里会暴露“结构不够深”的自然下限。
- `act2_normal_support`
  - 验证中段持续输出和目标选择。
  - 这是 guard 构筑开始体现成长空间的关键题。
- `act2_elite_lock`
  - 作为固定风险位。
  - 验证成型构筑在关键组件被打断时还能否运转，不是 Act1 式首轮暴打。
- `act2_normal_blast`
  - 验证是否具备有限时间内收尾能力。
  - 只允许放在后两场普通战，作为中后段收尾检定，不前置成开场抽查题。
  - 防止“只会拖”的构筑在 Act2 继续白吃。

## simulation 验证方案

### 新增模式

- 新增独立 `Act2 入口验证` simulation，不污染现有 `act1Validation`。
- 推荐新增：
  - `src/game/simulation/act2EntryValidation.ts`
  - `scripts/run-act2-entry-validation.ts`
- 流程：
  1. 用现有 `walker-guard / walker-burst / walker-mixed` 跑完整 Act1
  2. 统计是否到达并击败 Act1 Boss
  3. 若击败 Boss，则以 Boss 战后真实状态进入 `act2_entry` 验证段
  4. 继续跑到验证段完成或死亡
  5. 输出全局、分路线、分 encounter、elite 分支指标

### elite 风险位统计规则

- elite 风险位在 simulation 中采用固定策略处理，默认统一强制进入 `risk` 分支。
- 这样可以避免不同 persona 因分支选择差异造成样本偏斜。
- 同时必须单独记录是否进入 elite 分支，并输出 elite 分支独立表现。
- 不允许把 elite 分叉当作可忽略路径，也不允许让策略差异决定是否统计这部分样本。

### 必出指标

- 全局：
  - `Act1 boss reach rate`
  - `Act2 floor 1-3 survive rate`
  - `Act2 floor 1-5 survive rate`
  - `Act2 elite branch enter rate`
  - `Act2 elite branch survive rate`
- 分路线：
  - 进入 Act2 的样本数
  - Act2 前段胜率
  - 平均掉血
  - 平均战斗回合数
  - elite 分支进入样本数
  - elite 分支独立存活率
- 分 encounter，按 `guard / burst / mixed` 分别输出：
  - 样本数
  - `survive rate`
  - `avgHpLoss`
  - `avgTurns`
- 这里的 `Act2 floor 1-3 / 1-5` 统一定义为：
  - 进入 Act2 后前 `3` 场 / 前 `5` 场战斗存活率
  - 不把 `shop/rest` 计入 survive 口径

### 判定标准

- `直接暴毙`
  - 某路线 `Act2 floor 1-3 survive rate < 35%`
  - 或整体 `< 50%`
  - 或死亡过度集中在第一、第二战
- `完全碾压`
  - 某路线 `Act2 floor 1-5 survive rate > 80%`
  - 且平均掉血很低、平均回合很短
  - 且在 `reflect / lock / countdown` 三类题上指标几乎不受影响
- `合理过渡`
  - burst 仍高于 mixed，但会被新题型有效施压
  - guard 在 `support / lock / blast` 段开始体现中段价值
  - mixed 仍是合理下限，但不是因为系统异常或非战斗因素暴毙
  - elite 分支对三路线产生可观察差异，不能被统计口径抹平
  - encounter 维度能看出题型差异，而不是所有战斗都像 Act1 放大版

## 风险与边界

- 最可能失衡点：
  - `reflect` 过强，导致 burst 在第一、二战直接失真
  - `lock` 过强，导致 guard 被误判为没有成长空间
  - `blast` 过强，导致慢构筑被统一判死
  - 小范围随机若约束不足，会把验证结果重新拉回“脚本化运气题”
  - 状态继承若被偷偷重置，会直接污染整个验证结论
  - elite 分支若由 persona 自选，会让 risk 样本不可比
- 控 scope 的方法：
  - 不改完整 Act2 生成逻辑
  - 不默认启用全部现有 Act2 草稿 encounter
  - 只使用人工确认过的白名单
  - 地图只做固定模板上的有限换位
  - 合法布局约束严格执行，不放宽
  - simulation 中对 elite 分叉采用固定口径
  - 不碰商店/奖励系统结构
  - 验证段完成只作为实验结束标记，不扩写为正式章节终局

## 测试方案

- 引擎测试：
  - Act1 Boss 奖励后进入 `act2_entry` 验证地图
  - 进入验证段时玩家状态与 Boss 战后状态完全一致
  - 普通战只会从白名单中抽取
  - `shop/rest` 补给位固定
  - elite 风险位固定
  - `blast` 只会出现在 `C / D`
  - 前两战不重复
  - `countdown` 不出现在第一战
  - `support/scale` 不连续
  - 任一不满足约束的布局都被判为非法，不允许进入运行
  - elite 分支进入会被记录
  - 验证段结束后设置完成标记
- 语义测试：
  - 若实现复用 `victory` 状态，测试需明确这是“验证段完成复用”，不是整局正式通关
- simulation 测试：
  - 三条 persona 都能跑完整流程
  - elite 风险位统一按固定策略进入 `risk`
  - 输出包含全局、分路线、分 encounter、elite 分支必出字段
  - 不出现 `map_no_legal_nodes`、`screen_limit`、`no_progress_loop` 等非设计性失败
- 回归约束：
  - 现有 Act1 validation 和 Act1 平衡相关测试预期不变

## 假设与默认

- 默认本轮只以 `walker` 单角色验证。
- 默认当前列出的 4 个普通 encounter + 1 个 elite 是本轮唯一启用白名单。
- 默认验证段长度固定，补给位与 elite 位固定，普通战只做有限换位。
- 默认所有布局约束都是强约束，不满足即非法。
- 默认进入验证段时完整继承 Act1 Boss 战后真实状态，不做任何重置或补偿。
- 默认 elite 风险位在 simulation 中统一强制进入 `risk`，避免样本偏斜。
- 默认“验证段完成”是独立语义；若实现上借用 `victory`，仅为最小复用，不代表正式通关整局。
