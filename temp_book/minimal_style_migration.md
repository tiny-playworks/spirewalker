# Map / Main Menu 最小样式迁移方案（v0.1）

## 一、目标（Summary）

本次迁移只针对：

- `map`
- `main-menu`

将其样式从全局 `index.css` 中拆出，迁移到局部的 `vanilla-extract` 体系中。

**核心原则：**

- 仅做**结构迁移**，不做视觉重设计
- 不影响其他页面和系统
- 样式由**组件状态显式驱动**，不再依赖 class 叠加或复杂选择器

---

## 二、范围控制（Scope）

### ✅ 本次迁移包含

- `main-menu` 所有 UI 样式
- `map` 页面及其子模块（节点、路径、面板等）

### ❌ 本次不包含

以下内容全部保持在 `index.css`：

- 全局 reset
- app shell（外层布局）
- battle（战斗系统）
- cursor（自定义光标）
- debug panel
- overview / 其他页面

👉 **原则：只动当前两块，绝不扩散**

---

## 三、技术方案（Technical Approach）

### 1. 引入最小 `vanilla-extract` 基础设施

- 安装依赖：
  - `@vanilla-extract/css`
  - `@vanilla-extract/webpack-plugin`

- 修改 `rsbuild.config.ts`：
  - 注册 `VanillaExtractPlugin`
  - 排除 `*.css.ts` 的 React Refresh
  - 使用 Rsbuild 官方推荐的 dev `chunkSplit` 方案（避免 HMR 问题）

---

### 2. 局部共享 Theme（仅 map + main-menu）

新增：

```
src/styles/sceneTheme.css.ts
```

包含 token：

- 背景 / surface
- 文本颜色
- 边框
- 圆角（radii）
- 阴影 / glow
- 动画 timing / easing
- 语义色：
  - `hazard`（危险）
  - `fortune`（收益）
  - `mystery`（未知）
  - `relief`（恢复）

**特点：**

- 仅在 `MainMenuPage` 和 `MapPage` 挂载
- 不污染全局
- 不提前设计“全局主题体系”

---

### 3. Main Menu 迁移

新增：

```
mainMenu.css.ts
```

迁移内容：

- `main-menu-*` 样式
- 背景层（backdrop）
- 卡片（card）
- 按钮样式与动效
- keyframes

重构方式：

```ts
// ❌ 之前（字符串 class 拼接）
className = 'btn primary large';

// ✅ 之后（显式 variant）
actionButton({ kind: 'primary', disabled: false });
```

**注意：**

- 行为、布局保持完全一致
- 本轮不做视觉升级

---

### 4. Map 迁移

拆分为：

```
mapPage.css.ts
mapRoute.css.ts
```

---

### 关键改造：状态显式化

不再依赖 CSS 推断状态（例如 `.node.active.selected.future`）

改为：

#### 状态枚举

```ts
type MapNodeViewState = 'current' | 'passed' | 'available' | 'locked';

type MapNodeTone =
  | 'battle'
  | 'elite'
  | 'boss'
  | 'shop'
  | 'treasure'
  | 'event'
  | 'rest'
  | 'camp';

type MapEdgeEmphasis = 'active' | 'dim';
```

#### 使用方式

- 在 TS 中计算一次状态
- 传入样式函数
- 样式不再做逻辑判断

---

### Map 迁移内容

从 `index.css` 移出：

- 节点（node）
- 路径（route）
- 地图画布（board）
- HUD
- 图例（legend）
- 工具栏（toolbar）
- 决策卡片（decision card）
- CTA 按钮

统一使用 `sceneTheme` token

---

## 四、共存策略（Coexistence）

迁移后：

### `index.css` 保留：

- 全局 reset
- 未迁移页面
- cursor

### 移除：

- `main-menu-*`
- `map-*`

确保：

- 不存在重复样式
- 不存在竞争规则

---

## 五、接口与类型（Interfaces / Types）

不修改任何：

- 游戏逻辑
- store
- 指令系统

仅新增展示层类型：

- `MapNodeViewState`
- `MapNodeTone`
- `MapEdgeEmphasis`
- `MainMenuActionKind`

---

## 六、测试方案（Test Plan）

### 1. 静态检查

```bash
pnpm lint
pnpm build
pnpm test -- tests/mapRouteTone.test.ts
```

---

### 2. 手动验证

#### Main Menu

- 布局、动效一致
- 按钮层级正常

#### Map

- 所有节点状态正常：
  - current / passed / available / locked / selected

- 不再出现图标漂移 / 双动画
- 所有路径为实线
- 颜色正确表达语义
- CTA 正常

---

### 3. 清理验证

- `index.css` 不再包含：
  - `main-menu-*`
  - `map-*`

- 无重复样式

---

## 七、风险与兜底（非常重要）

> 如果 `vanilla-extract + Rsbuild` 集成或 HMR 在 **半天内不稳定**：

👉 **立即降级为 CSS Modules 实现**

优先级：

> **迁移目标 > 技术选型**

---

## 八、设计原则（Assumptions）

- 本轮是**结构迁移，不是设计升级**
- 仅对 `map` 和 `main-menu` 使用新体系
- 样式必须由组件状态显式驱动
- 不依赖 DOM 结构或 class 叠加推断状态
- token 只在局部使用，不提前做全局 theme

---
