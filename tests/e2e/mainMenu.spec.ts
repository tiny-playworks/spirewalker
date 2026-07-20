import { expect, test } from '@playwright/test';
import { startNewRun } from './helpers';

test('首页能进入地图页', async ({ page }) => {
  await startNewRun(page);

  await expect(page.getByRole('navigation', { name: '本层路线概览' })).toBeVisible();
});
