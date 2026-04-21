import { expect, test } from '@playwright/test';
import { chooseFirstReachableNode, startNewRun } from './helpers';

test('地图选择节点后能进入战斗', async ({ page }) => {
  await startNewRun(page);
  await chooseFirstReachableNode(page);

  await expect(page.getByTestId('battle-hud')).toBeVisible();
});
