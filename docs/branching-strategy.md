# Branching Strategy (Single Maintainer)

本仓库采用轻量化 Git Flow，适合单人维护但保留团队化扩展空间。

## Branch Roles

- `main`: 稳定分支，随时可发布。
- `dev`: 日常集成分支，功能先合入这里。
- `feature/*`: 功能开发分支。
- `fix/*`: 缺陷修复分支。
- `chore/*`: 工程维护分支（CI、脚本、依赖等）。

## Merge Flow

1. 从 `dev` 拉出功能分支：`feature/xxx`、`fix/xxx`、`chore/xxx`。
2. 功能分支通过 PR 合并到 `dev`。
3. 周期性将 `dev` 通过 PR 合并到 `main`。

## Protection Rules

### main

- Require pull request before merge
- Required status checks: `lint`, `test`
- Require branches to be up to date before merging
- Disallow force pushes / branch deletions
- Require linear history

### dev

- Require pull request before merge
- Required status checks: `lint`, `test`
- Disallow force pushes / branch deletions
- Require linear history
- 允许 0 审批（单人维护优化）

## Naming Examples

- `feature/map-legend-refine`
- `fix/ci-pnpm-version-conflict`
- `chore/update-rsbuild-config`
