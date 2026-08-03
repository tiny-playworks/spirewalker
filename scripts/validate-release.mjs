import { spawnSync } from 'node:child_process';

const TOTAL_BUDGET_MS = 15 * 60 * 1000;
const startedAt = Date.now();
const skipE2E = process.argv.includes('--skip-e2e');

const steps = [
  { label: '静态检查与单测', command: 'pnpm', args: ['check'], timeoutMs: 240_000 },
  { label: '生产构建', command: 'pnpm', args: ['build'], timeoutMs: 180_000 },
  { label: '首屏体积', command: 'pnpm', args: ['check:bundle-size'], timeoutMs: 60_000 },
  { label: '正式卡牌审计', command: 'pnpm', args: ['audit:cards'], timeoutMs: 60_000 },
  { label: '正式卡图审计', command: 'pnpm', args: ['audit:card-art'], timeoutMs: 60_000 },
  { label: '正式遗物审计', command: 'pnpm', args: ['audit:relics'], timeoutMs: 60_000 },
  {
    label: 'Act 2 自然选路四种子模拟',
    command: 'pnpm',
    args: ['simulate:act2-entry', '--seeds', '1001,2002,3003,4004', '--runs', '50', '--progress-every', '0', '--route-mode', 'natural'],
    timeoutMs: 240_000,
  },
];

if (!skipE2E) {
  steps.push({ label: '无头 E2E', command: 'pnpm', args: ['test:e2e:full'], timeoutMs: 300_000 });
}

for (const step of steps) {
  const elapsed = Date.now() - startedAt;
  const remaining = TOTAL_BUDGET_MS - elapsed;
  if (remaining <= 0) {
    throw new Error(`超过 ${TOTAL_BUDGET_MS / 60_000} 分钟验收时限，已停止后续步骤。`);
  }

  const timeout = Math.min(step.timeoutMs, remaining);
  console.log(`\n[release-check] ${step.label}（剩余约 ${Math.ceil(remaining / 60_000)} 分钟）`);
  const result = spawnSync(step.command, step.args, {
    stdio: 'inherit',
    timeout,
    env: { ...process.env, CI: '1' },
  });

  if (result.error) {
    throw new Error(`${step.label} 未完成：${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`${step.label}失败，退出码 ${result.status ?? 'unknown'}。`);
  }
}

console.log(`\n[release-check] 全部通过，总耗时 ${((Date.now() - startedAt) / 1000).toFixed(1)} 秒。`);
