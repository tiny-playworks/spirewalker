import { expect, test } from '@playwright/test';
import { chooseFirstReachableNode, startNewRun } from './helpers';

test('不使用强制胜利也能完整打完第一场战斗', async ({ page }) => {
  await page.addInitScript(() => { Date.now = () => 1001; });
  await startNewRun(page);
  await chooseFirstReachableNode(page);
  await expect(page.getByTestId('battle-hud')).toBeVisible();
  await expect.poll(async () => page.evaluate(() => {
    const button = document.querySelector<HTMLButtonElement>('button[aria-label="结束回合"]');
    if (!button) return false;
    const box = button.getBoundingClientRect();
    return document.documentElement.scrollWidth <= innerWidth
      && box.left >= 0
      && box.right <= innerWidth
      && box.top >= 0
      && box.bottom <= innerHeight;
  })).toBe(true);
  await page.getByRole('checkbox', { name: '快速' }).check();

  for (let turn = 0; turn < 14; turn += 1) {
    if (await page.getByTestId('leave-battle-to-reward').isVisible()) break;

    for (let play = 0; play < 8; play += 1) {
      const playable = page.locator('button[data-testid^="battle-card-"]:not(:disabled)').first();
      if (await playable.count() === 0) break;
      await playable.click();
      const targetGuide = page.getByRole('status').filter({ hasText: '选择目标' });
      if (await targetGuide.isVisible()) {
        await page.locator('button[data-testid^="battle-enemy-"]:not(:disabled)').first().click();
      }
      await page.waitForTimeout(210);
      if (await page.getByTestId('leave-battle-to-reward').isVisible()) break;
    }

    if (await page.getByTestId('leave-battle-to-reward').isVisible()) break;
    await page.getByRole('button', { name: '结束回合' }).click();
    await page.waitForTimeout(360);
  }

  await expect(page.getByTestId('leave-battle-to-reward')).toBeVisible();
  await page.getByTestId('leave-battle-to-reward').click();
  await expect(page.getByTestId('reward-page')).toBeVisible();
});
