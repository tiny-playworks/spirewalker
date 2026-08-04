import { expect, test, type Page } from '@playwright/test';

test('采集 G1/G2 实机关键状态', async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto('/?e2e=1');
  await expect(page.getByRole('heading', { name: '辉芯工坊' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('01-title.png'), fullPage: true });

  await page.getByTestId('enter-workshop').click();
  await expect(page.getByTestId('interaction-prompt')).toContainText('启动远征门');
  await page.screenshot({ path: testInfo.outputPath('02-workshop.png'), fullPage: true });
  await focusGame(page);
  await tap(page, 'e');
  await expect(page.locator('[data-phase="route"]')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('03-physical-route-doors.png'), fullPage: true });

  await hold(page, 'w', 850);
  await hold(page, 'a', 500);
  await expect(page.getByTestId('interaction-prompt')).toContainText('进入');
  await tap(page, 'e');
  await expect(page.locator('.combat-meta')).toContainText('FPS', { timeout: 15_000 });
  await page.screenshot({ path: testInfo.outputPath('04-combat.png'), fullPage: true });
  await page.keyboard.press('i');
  await expect(page.locator('.equipment-panel')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('05-equipment-overlay.png'), fullPage: true });
  await page.keyboard.press('Tab');
  await expect(page.locator('.stats-panel')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('06-stats-overlay.png'), fullPage: true });
  await page.keyboard.press('Escape');

  await expect(page.locator('[data-phase="chest"]')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId('interaction-prompt')).toContainText('打开宝箱');
  await page.screenshot({ path: testInfo.outputPath('07-chest-landed.png'), fullPage: true });
  await focusGame(page);
  await tap(page, 'e');
  await expect(page.locator('[data-phase="loot"]')).toBeVisible({ timeout: 5_000 });
  await page.screenshot({ path: testInfo.outputPath('08-physical-loot.png'), fullPage: true });
  await hold(page, 's', 300);
  await hold(page, 'a', 220);
  await expect(page.getByTestId('interaction-prompt')).toContainText('检查');
  await tap(page, 'e');
  await expect(page.getByTestId('loot-inspector')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('09-single-loot-inspector.png'), fullPage: true });
});

async function hold(page: Page, key: string, durationMs: number): Promise<void> {
  await page.keyboard.down(key);
  await page.waitForTimeout(durationMs);
  await page.keyboard.up(key);
}

async function tap(page: Page, key: string): Promise<void> {
  await page.keyboard.down(key);
  await page.waitForTimeout(80);
  await page.keyboard.up(key);
}

async function focusGame(page: Page): Promise<void> {
  await page.locator('canvas').click({ position: { x: 20, y: 20 } });
}
