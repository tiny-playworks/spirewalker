# Spirewalker

一个基于 React + Phaser 的卡牌爬塔原型项目，当前重点在核心规则拆分、状态机闭环和可扩展架构。

![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-149ECA?logo=react&logoColor=white)
![Phaser](https://img.shields.io/badge/Phaser-4.x-5A2D82)
![Tests](https://img.shields.io/badge/tests-rstest%20pass-2EA043)
![License](https://img.shields.io/badge/license-PolyForm%20Noncommercial%201.0.0-orange)

## 技术栈

- React 19
- Phaser 4
- Zustand
- Rsbuild
- TypeScript
- Rstest

## 本地开发

```bash
pnpm install
pnpm dev
```

默认开发地址：`http://localhost:3000/`

## 常用命令

```bash
pnpm dev        # 启动开发环境
pnpm build      # 构建生产包
pnpm preview    # 预览构建结果
pnpm test       # 运行测试
pnpm lint       # 运行 lint
```

## 项目结构（简版）

- `src/app`：应用入口和页面装配
- `src/features`：功能页面/UI
- `src/game/core`：核心模型、命令、事件、规则系统
- `src/game/phaser`：Phaser 画面和输入桥接
- `src/game/store`：全局状态与 selectors
- `tests`：核心规则测试

## 许可协议（禁止商用）

本项目采用 **PolyForm Noncommercial License 1.0.0**。

- 允许：个人学习、研究、非商用修改与分发
- 禁止：任何商业用途（含直接或间接盈利、商业服务集成、付费分发等）

详细条款见 `LICENSE` 文件。

---

如需商用授权，请联系项目维护者另行获取书面许可。

## 贡献指南（简版）

欢迎提交 Issue / PR，一起完善玩法与工程结构。

- 提交前请先执行：`pnpm test`、`pnpm lint`
- 规则层改动优先补 `tests/*`，尽量不把业务判断塞进 Phaser 场景
- 新增命令/状态时，优先沿用 `core model + systems + selectors` 分层
- 本仓库默认仅接受非商用方向贡献；涉及商用诉求请先沟通授权
