import { expect, test } from '@playwright/test';

test('采集桌面视觉闸门样张', async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto('/?e2e=1');
  await expect(page.getByRole('heading', { name: '辉芯工坊' })).toBeVisible();
  await page.waitForTimeout(1_000);
  await page.screenshot({ path: testInfo.outputPath('01-main-menu.png'), fullPage: true });

  await page.getByRole('button', { name: /共享回路/ }).click();
  await expect(page.getByRole('heading', { name: '全局技能树' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('02-global-tree.png'), fullPage: true });
  await page.getByRole('button', { name: '关闭' }).click();

  await page.getByTestId('new-run').click();
  await expect(page.locator('.route-screen')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('03-route.png'), fullPage: true });

  await page.locator('.route-card:not(.route-gold)').first().click();
  await expect(page.locator('.combat-meta')).toContainText('FPS', { timeout: 15_000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: testInfo.outputPath('04-combat.png'), fullPage: true });

  await expect(page.locator('.reward-screen')).toBeVisible({ timeout: 20_000 });
  await page.waitForTimeout(650);
  await page.screenshot({ path: testInfo.outputPath('05-reward.png'), fullPage: true });
});
