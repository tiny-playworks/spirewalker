import { expect, test } from '@playwright/test';

test('桌面端完整纵切片：路线、战斗、宝箱、商店、Boss、双经验与续局', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.addInitScript(() => {
    if (sessionStorage.getItem('sljt_e2e_initialized')) return;
    localStorage.clear();
    localStorage.setItem('sljt_profile', JSON.stringify({ version: 1, legacy: true }));
    sessionStorage.setItem('sljt_e2e_initialized', '1');
  });
  await page.goto('/?e2e=1');

  await expect(page.getByRole('heading', { name: '辉芯工坊' })).toBeVisible();
  await page.getByTestId('new-run').click();

  for (let room = 0; room < 3; room += 1) {
    await expect(page.locator('.route-screen')).toBeVisible();
    await expect(page.locator('.route-card')).toHaveCount(2);
    await page.locator('.route-card:not(.route-gold)').first().click();
    await expect(page.getByTestId('combat-canvas')).toBeVisible();
    await expect(page.locator('.combat-meta')).toContainText('FPS', { timeout: 15_000 });

    if (room === 0) {
      await page.reload();
      await expect(page.getByRole('button', { name: '继续上次试炼' })).toBeVisible();
      await page.getByRole('button', { name: '继续上次试炼' }).click();
      await expect(page.getByTestId('combat-canvas')).toBeVisible();
    }

    await expect(page.locator('.reward-screen')).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('.reward-grid .item-card')).toHaveCount(3);
    await page.locator('.reward-grid .item-card .card-button').first().click();
  }

  await expect(page.locator('.shop-screen')).toBeVisible();
  await expect(page.locator('.shop-offer')).toHaveCount(5);
  await page.getByTestId('start-boss').click();
  await expect(page.locator('.boss-hud')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('.settlement-screen.victory')).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('.xp-columns')).toContainText('账号经验');
  await expect(page.locator('.xp-columns')).toContainText('角色经验');

  const storage = await page.evaluate(() => ({
    profile: localStorage.getItem('sljt_v2_profile'),
    run: localStorage.getItem('sljt_v2_run'),
    legacy: localStorage.getItem('sljt_profile'),
  }));
  expect(storage.profile).toContain('"version":2');
  expect(storage.run).toContain('"settlementApplied":true');
  expect(storage.legacy).toContain('"legacy":true');

  await page.getByTestId('retry-run').click();
  await expect(page.locator('.route-screen')).toBeVisible();
  expect(pageErrors).toEqual([]);
});
