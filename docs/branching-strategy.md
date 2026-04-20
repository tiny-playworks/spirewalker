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
3. 功能分支合入 `dev` 后，统一删除该功能分支，避免后续重复合并。
4. 周期性将 `dev` 通过 PR 合并到 `main`（发布节奏）。
5. `main` 有新提交后，尽快执行一次 `main -> dev` 同步 PR（小步快跑，避免集中冲突）。

## Conflict Prevention Rules

- `main` 与 `dev` 之间禁止 cherry-pick 同一功能提交。
- `main` 与 `dev` 之间统一使用 **Merge commit**，不混用 squash/rebase。
- 尽量缩短 `dev` 与 `main` 的分叉时间：建议每周至少同步一次 `main -> dev`。
- 大改动优先拆成多个小 PR，减少同文件的长期并行修改。

## Protection Rules

### main

- Require pull request before merge
- Required status checks: `lint`, `test`
- Require branches to be up to date before merging
- Disallow force pushes / branch deletions
- Do not require linear history（允许 Merge commit）

### dev

- Require pull request before merge
- Required status checks: `lint`, `test`
- Disallow force pushes / branch deletions
- Do not require linear history（允许 Merge commit）
- 允许 0 审批（单人维护优化）

## Naming Examples

- `feature/map-legend-refine`
- `fix/ci-pnpm-version-conflict`
- `chore/update-rsbuild-config`
