# 第二批样式迁移计划（v0.2）

## 目标

在已完成 main-menu 与 map 最小迁移的基础上，继续验证局部样式体系是否适合项目扩展。

本轮目标不是扩大技术覆盖面，而是继续迁移一批**同时具备以下条件**的界面模块：

- 仍然属于 DOM UI
- 状态清晰
- 与现有视觉体系连续
- 不会引发 Phaser 交互重构

---

## 迁移原则

### 1. 继续局部推进，不做全仓切换

- 不做全局 theme 提升
- 不清空 `index.css`
- 不顺手重构 battle 核心区

### 2. 继续保持「状态显式驱动」

样式必须由组件显式状态驱动，不依赖：

- class 叠加猜状态
- DOM 祖先关系
- 复杂组合选择器

### 3. 本轮仍然是结构迁移，不做视觉重设计

重点是：

- 样式边界收口
- token 复用
- 组件状态到样式映射更清晰

不是重新设计 UI。

---

## 本轮迁移范围

### ✅优先迁移

#### A. 顶部 HUD / 状态条

包括但不限于：

- 层数
- 金币
- 药水
- HP
- 牌组数
- 角色信息
- 当前位置摘要

迁移目标：

- 从全局样式中拆出 HUD 相关规则
- 与 map / main-menu 共享局部 scene token
- 明确状态与视觉层级

---

#### B. 轻量信息面板

包括：

- 决策卡片
- 普通说明面板
- 图例
- 状态提示区
- 路径说明区

迁移目标：

- 统一 panel / section / title / description 的写法
- 减少重复 panel 样式
- 提升可复用性

---

#### C. 通用视觉原语（仅限当前已重复出现的）

本轮只允许提炼「已经存在多次重复」的视觉原语，例如：

- `panelSurface`
- `sectionTitle`
- `actionButton`
- `toneBadge`
- `divider`
- `glowRing`

注意：

这里不是做组件库，也不是做通用 UI 系统。只是把已经反复出现的样式模式收成局部原语。

---

## 本轮明确不做

### ❌不迁移 battle 核心交互区

包括：

- 手牌区
- 卡牌 hover / drag / targeting
- 出牌态
- 目标选择态
- 伤害飘字
- 核心战斗反馈层

原因：

- 与 Phaser / JS 动画 / DOM 表现层边界更复杂
- 一旦迁移，很容易升级成「交互重构」
- 当前不符合「小范围验证」原则

---

### ❌不迁移 debug panel

原因：

- 当前可用即可
- 不值得投入体系化成本

---

### ❌不迁移 cursor 系统

原因：

- 当前已可用
- 非本轮核心收益点

---

### 不做全局 theme 提升

原因：

- 当前只验证局部样式体系
- 全局 token 体系尚未稳定
- 过早提升会增加后续回退成本

---

## 建议目录与组织方式

在现有基础上继续扩展：

```text
src/
  styles/
    sceneTheme.css.ts
    uiPrimitives.css.ts   # 本轮可新增，仅收录当前已复用原语
  features/
    main-menu/
      mainMenu.css.ts
    map/
      mapPage.css.ts
      mapRoute.css.ts
    hud/
      hud.css.ts          # 本轮新增
    panels/
      infoPanel.css.ts    # 如有必要
```

说明：

- `sceneTheme.css.ts` 继续作为局部共享 token
- `uiPrimitives.css.ts` 只放已经重复出现的样式原语
- feature 仍保留自己的局部样式文件
- 不要求把所有样式都抽进 primitives

---

## 状态表达方式

本轮继续沿用显式状态驱动。

例如：

**HUD**

```ts
type HudItemTone = "normal" | "highlight" | "warning";
```

**面板**

```ts
type PanelTone = "default" | "fortune" | "hazard" | "mystery" | "relief";
```

**按钮**

```ts
type ActionButtonKind = "primary" | "secondary";
type ActionButtonState = "normal" | "disabled";
```

要求：

- 状态在 TS 中计算
- 样式通过 variant / helper 显式映射
- 避免继续回到 class 组合模式

---

## 执行顺序

### 第一步：HUD 迁移

目标：

- 先验证第二批迁移是否仍然顺手
- 继续复用 sceneTheme token
- 验证「状态条类 UI」在新体系下是否更清晰

验收点：

- HUD 样式脱离 `index.css`
- 不影响 map / main-menu
- 视觉保持一致

---

### 第二步：轻量面板迁移

目标：

- 收拢图例、决策卡片、说明区等 panel 样式
- 明确 panel 原语是否值得抽取

验收点：

- 面板类样式不再重复散落
- 标题 / 描述 / 分隔线 / 边框风格统一

---

### 第三步：提炼少量视觉原语

目标：

- 只提炼高重复项
- 控制抽象程度
- 不把项目推向「组件库化」

验收点：

- `uiPrimitives.css.ts` 规模可控
- 没有为抽象而抽象
- feature 代码仍然易读

---

## 测试与验证

### 静态检查

```bash
pnpm lint
pnpm build
pnpm test -- tests/mapRouteTone.test.ts
```

如后续有 HUD / panel 相关测试，再追加。

---

### 手动验证

重点检查：

**HUD**

- 信息层级是否清晰
- 视觉风格是否和 map / main-menu 连续
- 响应式下是否稳定

**面板**

- 不同 tone 下是否仍可读
- 标题 / 描述 / CTA 是否层级明确
- 是否存在 hover / focus / active 回退

**共存**

- `index.css` 与局部样式无冲突
- 没有重复竞争规则
- 未迁移区域表现不受影响

---

## 风险与兜底

### 风险 1：局部样式体系开始膨胀

表现：

- `globalStyle` 数量快速增加
- variant 组合越来越复杂
- 比原来更难改

处理：

- 暂停扩大迁移范围
- 先复盘写法是否需要收敛成 recipe / helper

---

### 风险 2：抽象过早

表现：

- 为了复用提前设计很多原语
- feature 可读性下降
- 样式代码开始「像框架」

处理：

- 原语只保留高频复用项
- 不为未来假想场景设计 API

---

### 风险 3：迁移影响推进节奏

表现：

- 样式体系投入过多
- 游戏功能推进明显放缓

处理：

迁移目标始终服从游戏开发目标。如果迁移影响版本推进，应立即收缩范围。

---

## 本轮完成标准

满足以下条件即可视为第二批迁移完成：

1. HUD 样式完成局部迁移
2. 至少一类轻量信息面板完成局部迁移
3. 提炼出少量稳定可复用原语
4. `index.css` 不再继续吸收新 HUD / panel 样式
5. 项目推进速度未明显下降

---

## 一句话总结

第二批迁移的目标，不是扩大技术使用范围，而是验证这套局部样式体系能不能稳定承接「更靠近游戏主循环」的 DOM UI。
