import { expect, test } from '@playwright/test';

test('竖屏首页可用，进入对局后必须旋转且状态保持', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('sljt_walker_intro_v1', 'seen');
  });
  await page.goto('/');

  await expect(page.getByTestId('mobile-landscape-gate')).toHaveCount(0);
  await page.getByTestId('new-game-button').tap();

  const gate = page.getByTestId('mobile-landscape-gate');
  await expect(gate).toBeVisible();
  await expect(gate).toContainText('旋转设备以继续攀登');
  await expect(page.locator('[data-scene-tone="map"]')).toHaveAttribute('data-scene-ready', 'true');

  await page.setViewportSize({ width: 844, height: 390 });
  await expect(gate).toBeHidden();
  await expect(page.getByRole('navigation', { name: '本层路线概览' })).toBeVisible();
  await expect(page.getByTestId('current-act')).toHaveText('第 1 章 · 镀金废墟');
});
