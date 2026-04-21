# 三章制战斗与关卡重构方案 v2

## 简述

- 本轮一次做完 `Phase 1-4`，但 run 长度收敛为：
  - Act 1：20 层
  - Act 2：24 层
  - Act 3：26 层
  - 总计：70 层
- 旧存档直接断开：升级 `RUN_SAVE_VERSION`，更换 localStorage key，不做迁移。
- 保持单角色 `walker`，不新增美术资源；新增内容以规则、文本和轻量 UI 呈现。
- starter 不写死“前 2 回合必接触 momentum”，改为“高概率接触”，并用 simulation 护栏锁定。

## 核心改动

### 1. Run 结构与地图生成

- `RunState.meta` 扩展为：
  - `act: 1 | 2 | 3`
  - `actFloor: number`
  - `floor: number`，保留为全局层数，范围 `1..70`
- 每章地图按固定深度生成：
  - Act 1：`depth 1..20`
  - Act 2：`depth 1..24`
  - Act 3：`depth 1..26`
- 每章固定规则写死在生成器里：
  - `倒数第 1 层 = boss`
  - `倒数第 2 层 = rest`
  - 不参与随机
  - 即：
    - Act 1：`19=rest, 20=boss`
    - Act 2：`23=rest, 24=boss`
    - Act 3：`25=rest, 26=boss`
- 路线形状固定：
  - 前段多分支：起点至少 2 条合法路径
  - 中段收敛：分支明显减少
  - 后段再开小分叉：允许在 `elite / rest / reward` 之间赌博
- `MapNode` 新增：
  - `act`
  - `depth`
  - `encounterTier`
  - `encounterTableId`
- 节点分布不追求每章完全同一张表，但必须满足：
  - 普通战为主体
  - 精英稀缺但稳定出现
  - 商店和休息点偏少
  - 宝箱极少
- Boss 后流程固定：
  - Act 1 Boss -> Act 2 地图
  - Act 2 Boss -> Act 3 地图
  - Act 3 Boss -> `victory`

### 2. 战斗系统与怪物题型

- 从当前“节点直连 slime 编队”改为“节点 -> encounter template -> lineup”。
- 每章最少配置：
  - 普通怪 6
  - 精英 3
  - Boss 1
- 每章普通怪必须覆盖至少 4 种不同战斗题型，不能只做数值差异。本轮固定题型池：
  - `压血型`：稳定攻击，逼迫早防守
  - `消耗型`：削状态、削资源、拖长战斗
  - `叠防型`：通过格挡或减伤惩罚低质量输出
  - `干扰型`：针对 momentum、多打、手牌节奏
  - 允许第 5 类 `联动型` 作为补充，但不是硬要求
- 精英题型固定为“放大普通怪逻辑，不做纯加血版”：
  - `启动惩罚`
  - `叠层强化`
  - `反构筑`
- Boss 统一做两阶段，不做更复杂多阶段：
  - 阶段切换由生命阈值触发
  - 切阶段时更换意图表与题型重点
- 敌人 AI 定义改为 `scriptId + params`，本轮只保留 6 类脚本：
  - `cycle_attack`
  - `cycle_attack_block`
  - `cycle_attack_debuff`
  - `momentum_break`
  - `multi_play_punish`
  - `boss_phase_shift`
- 三章出题方向固定：
  - Act 1：资源压力筛人
  - Act 2：拆舒适区、打断 build
  - Act 3：高爆发与复合压力，验证 build 是否真的成立

### 3. Starter、奖励、经济、事件

- starter 改为“能理解机制，但不能稳定滚雪球”的 10 张固定表：
  - `3x strike`
  - `4x defend`
  - `1x prime_rhythm`
  - `1x brace_rhythm`
  - `1x measured_rest`
- momentum 开局规则明确为：
  - 不保证前 2 回合必摸到
  - 目标做成“高概率接触”
  - 不加保底抽牌，不做定向检索
  - 通过 starter 配比控制体验
- simulation 护栏写死：
  - `momentumOpenedByTurn2Rate` 目标区间 `0.75 ~ 0.90`
  - 低于 `0.75` 说明 starter 断档过重
  - 高于 `0.90` 说明又回到近似写死保底
- reward 卡池分层：
  - `early`
  - `core`
  - `amplifier`
  - `finisher`
- 投放规则固定：
  - Act 1 普通战：以 `early` 为主，少量 `core`
  - Act 2：提高 `core/amplifier`
  - Act 3：开放 `finisher`
  - Elite/Boss 比普通战更偏后期层级
- 经济系统加入“不稳定收入”：
  - 普通战不再稳定给金币
  - 改为 `battle reward` 中按概率掉落金币条目
  - 普通战收益拆成三档：
    - `0 金`
    - `低额金币`
    - `中额金币`
  - Elite/Boss 保持稳定金币
  - 宝箱/事件提供波动更大的高收益
- 商店与删牌规则固定：
  - 商店价格整体上调
  - 删牌价格提高
  - 删牌来源仅保留：商店、少量事件、极少数遗物效果
- 药水与回血收紧：
  - 普通战药水掉率下调
  - Elite/Boss 保留高概率或必掉
  - 休息点操作固定二选一：
    - `heal`
    - `upgrade`
- 事件改为章节池：
  - Act 1：低风险小收益/教学事件
  - Act 2：明确 trade-off
  - Act 3：高风险高收益
- 旧事件能复用规则的就复用，但全部挂到章节池，不再全局随机混用。

### 4. 失败路径与体验目标

- 本轮明确 3 种失败路径，并让系统分别对应：
  - `资源耗尽`
    - 血量、药水、休息点、金币都不够
    - 主要由 Act 1 和长流程消耗制造
  - `构筑失败`
    - 牌组拿了很多牌但没有核心闭环
    - 主要由奖励分层、污染、删牌稀缺、商店收紧制造
  - `被敌人克制`
    - build 已成型，但被反连势、反多打、叠防拖回合等题型针对
    - 主要由 Act 2/3 敌人池制造
- 章节体验目标固定：
  - Act 1：乱玩大概率到不了 Boss；正常玩可勉强过
  - Act 2：半成型构筑开始崩；成型构筑也不能乱按
  - Act 3：能到已不容易，到了也不保证赢
- simulation 验收护栏固定：
  - `simplePolicy`：`winRate < 0.05`
  - `walkerMomentumPolicy`：`winRate 0.10 ~ 0.20`
  - `simplePolicy` 的 `Act1 boss reach rate < 0.40`
  - `avgTurnsPerCombat` 保持在合理区间，不能因叠防/拖回合失控

### 5. 表现层与存档

- 地图页补充：
  - `Act`
  - `本章层数`
  - `全局层数`
  - `Boss 前休息提示`
- 战斗页补充：
  - 普通/精英/Boss 标识
  - 敌人题型标签
  - Boss 阶段显示
- 奖励、商店、事件页补充章节上下文，让玩家知道当前处于哪章压力环境。
- 存档固定处理：
  - 升 `RUN_SAVE_VERSION`
  - 更换存档 key
  - 删掉旧迁移逻辑，不再兼容旧 run

## 重要接口变化

- `RunState.meta`
  - 新增 `act`
  - 新增 `actFloor`
  - 保留 `floor`
- `MapNode`
  - 新增 `act`
  - 新增 `depth`
  - 新增 `encounterTier`
  - 新增 `encounterTableId`
- 战斗入口
  - 从 mapFlow 中直接选 `lineup*` 改为读取 `EncounterTemplate`
- `MonsterDefinition.ai`
  - 从当前几种 `alternating_*` 专用 union 改为 `scriptId + params`
- reward/shop/event 生成接口
  - 统一接收 `act` 与 `encounterTier`
  - 不再只依赖旧 `floor`

## 测试与验收

- 更新 engine/map 测试，使其匹配 `20/24/26` 三章结构与 Boss 前固定休息点。
- 新增地图生成测试：
  - 每章深度正确
  - `倒数第二层=rest`
  - `倒数第一层=boss`
  - 前宽中窄后小分叉成立
- 新增敌人池测试：
  - 每章普通怪至少 4 种题型
  - 每章 3 精英 1 Boss 可正确生成
  - Boss 两阶段生效
- 新增经济测试：
  - 普通战金币为不稳定产出，不是稳定发钱
  - Elite/Boss 金币稳定
  - 商店与删牌价格按新规则生效
- 新增 simulation 测试：
  - `winRate`
  - `Act1 boss reach rate`
  - `momentumOpenedByTurn2Rate`
  - `avgTurnsPerCombat`
  - 三种失败路径分别至少能在样本 run 中观察到
- e2e 只修主链路：
  - 开局 -> 地图 -> 战斗 -> 奖励 -> 下一章 -> 死亡/通关

## 默认假设

- 不扩展角色系统。
- 不新增美术素材。
- 不做复杂动画与新交互，只做必要信息展示。
- 本轮优先把“长跑结构 + 失败路径 + 章节题型”做成立，再做后续微调平衡。
