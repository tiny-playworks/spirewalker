import { expect, test } from '@playwright/test';
import { openDebugPanel, startNewRun } from './helpers';

test('可跳转事件并完成一次最小事件选择', async ({ page }) => {
  await startNewRun(page);
  await openDebugPanel(page);

  await page.getByTestId('debug-jump-event').click();
  await expect(page.getByTestId('event-page')).toBeVisible();

  await page.getByTestId('event-page').getByRole('button').first().click();
  await expect(page.getByText('本层路线')).toBeVisible();
});
