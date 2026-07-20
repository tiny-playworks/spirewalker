import { expect, test } from '@playwright/test';
import { chooseFirstReachableNode, startNewRun } from './helpers';

test('核心地图和战斗控件在当前设备尺寸可操作', async ({ page }) => {
  await startNewRun(page);
  await expect(page.getByRole('navigation', { name: '本层路线概览' })).toBeVisible();
  await expect(page.locator('[data-testid^="map-node-"][data-cursor-target="true"]').first()).toBeVisible();

  await chooseFirstReachableNode(page);
  await expect(page.getByTestId('battle-hud')).toBeVisible();
  await expect(page.getByRole('button', { name: '结束回合' })).toBeVisible();
  await expect(page.getByTestId('battle-draw-count')).toBeVisible();
});
