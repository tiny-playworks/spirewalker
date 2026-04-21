import { expect, test } from '@playwright/test';
import { startNewRun } from './helpers';

test('首页能进入地图页', async ({ page }) => {
  await startNewRun(page);

  await expect(page.getByText('本层路线')).toBeVisible();
  await expect(page.getByTestId('decision-cta')).toBeVisible();
});
