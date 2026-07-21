import { expect, test } from '@playwright/test';
import { confirmNodeResult, openDebugPanel, startNewRun } from './helpers';

test('可跳转商店并离开继续流程', async ({ page }) => {
  await startNewRun(page);
  await openDebugPanel(page);

  await page.getByTestId('debug-jump-shop').click();
  await page.keyboard.press('Backquote');
  await expect(page.getByTestId('shop-page')).toBeVisible();

  await page.getByRole('button', { name: '离开商店' }).click();
  await confirmNodeResult(page);
  await expect(page.getByRole('navigation', { name: '本层路线概览' })).toBeVisible();
});
