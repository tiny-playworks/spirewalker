import { expect, test } from '@playwright/test';
import { chooseFirstReachableNode, openDebugPanel, startNewRun } from './helpers';

test('横屏手机在 844×390 与 667×375 下可完成核心战斗操作', async ({ page }) => {
  await startNewRun(page);
  await expect(page.getByRole('navigation', { name: '本层路线概览' })).toBeVisible();
  await expect(page.locator('[data-testid^="map-node-"][data-cursor-target="true"]').first()).toBeVisible();

  await chooseFirstReachableNode(page);
  await expect(page.getByTestId('battle-hud')).toBeVisible();
  const endTurn = page.getByRole('button', { name: '结束回合' });
  await expect(endTurn).toBeVisible();
  await expect(page.getByTestId('battle-draw-count')).toHaveCount(1);

  await openDebugPanel(page);
  await page.getByTestId('debug-add-hand-card').click();
  await page.keyboard.press('Backquote');

  const attack = page.locator('[data-testid^="battle-card-"]').filter({ hasText: '重击' }).first();
  await attack.tap();
  await expect(page.getByText('选择目标', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /取消 Esc/ }).tap();
  await expect(page.getByText('选择目标', { exact: true })).toBeHidden();

  await attack.tap();
  await page.locator('[data-testid^="battle-enemy-"]').first().tap();
  await expect(page.getByText('选择目标', { exact: true })).toBeHidden();

  await expect.poll(async () => page.evaluate(() => {
    const button = document.querySelector<HTMLButtonElement>('button[aria-label="结束回合"]');
    const card = document.querySelector<HTMLElement>('button[data-testid^="battle-card-"]');
    if (!button || !card) return false;
    const buttonBox = button.getBoundingClientRect();
    const cardBox = card.getBoundingClientRect();
    return document.documentElement.scrollWidth <= innerWidth
      && buttonBox.left >= 0 && buttonBox.right <= innerWidth && buttonBox.bottom <= innerHeight
      && cardBox.left >= 0 && cardBox.right <= innerWidth && cardBox.bottom <= innerHeight;
  })).toBe(true);

  await page.setViewportSize({ width: 667, height: 375 });
  await expect.poll(async () => page.evaluate(() => {
    const button = document.querySelector<HTMLButtonElement>('button[aria-label="结束回合"]');
    const enemy = document.querySelector<HTMLElement>('[data-testid^="battle-enemy-"]');
    if (!button || !enemy) return false;
    const buttonBox = button.getBoundingClientRect();
    const enemyBox = enemy.getBoundingClientRect();
    return document.documentElement.scrollWidth <= innerWidth
      && buttonBox.left >= 0 && buttonBox.right <= innerWidth && buttonBox.bottom <= innerHeight
      && enemyBox.left >= 0 && enemyBox.right <= innerWidth && enemyBox.bottom <= innerHeight;
  })).toBe(true);

  await expect(endTurn).toBeEnabled();
  await endTurn.tap();
});
