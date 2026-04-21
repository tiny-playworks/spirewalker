import { expect, test } from '@playwright/test';
import { chooseFirstReachableNode, openDebugPanel, startNewRun } from './helpers';

test('战斗中可用调试入口直达奖励页', async ({ page }) => {
  await startNewRun(page);
  await chooseFirstReachableNode(page);
  await openDebugPanel(page);

  await page.getByTestId('debug-force-victory').click();
  await page.getByTestId('leave-battle-to-reward').click();

  await expect(page.getByTestId('reward-page')).toBeVisible();
});
