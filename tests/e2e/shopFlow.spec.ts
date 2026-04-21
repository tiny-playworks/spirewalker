import { expect, test } from '@playwright/test';
import { openDebugPanel, startNewRun } from './helpers';

test('可跳转商店并离开继续流程', async ({ page }) => {
  await startNewRun(page);
  await openDebugPanel(page);

  await page.getByTestId('debug-jump-shop').click();
  await expect(page.getByTestId('shop-page')).toBeVisible();

  await page.getByRole('button', { name: '离开商店' }).click();
  await expect(page.getByText('本层路线')).toBeVisible();
});
