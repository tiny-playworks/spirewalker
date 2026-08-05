import { expect, test, type Page } from '@playwright/test';
import type { RunStateV2 } from '../../src/game/types';

test('G2 游戏化核心体验：工坊、实体门、战斗、宝箱、逐件处理与暂停界面', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto('/?e2e=1');
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('sljt_profile', JSON.stringify({ version: 1, legacy: true }));
  });
  await page.reload();

  await expect(page.getByRole('heading', { name: '辉芯工坊' })).toBeVisible();
  await page.getByTestId('enter-workshop').click();
  await expect(page.getByTestId('game-canvas')).toBeVisible();
  await page.reload();
  await expect(page.getByTestId('game-canvas')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.locator('canvas').evaluate((canvas) => { canvas.dataset.runtime = 'persistent'; });
  await expect(page.getByTestId('interaction-prompt')).toContainText('启动远征门');

  await tap(page, 'e');
  await expect(page.locator('[data-phase="route"]')).toBeVisible();
  await expect(page.locator('.route-card, .reward-grid, .shop-grid')).toHaveCount(0);
  await enterLeftDoor(page);

  await expect(page.locator('[data-phase="combat"]')).toBeVisible();
  await expect(page.locator('.combat-meta')).toContainText('FPS', { timeout: 15_000 });
  const primaryBefore = await page.locator('.weapon-slot.active strong').textContent();
  await page.keyboard.press('q');
  await expect.poll(async () => page.locator('.weapon-slot.active strong').textContent()).not.toBe(primaryBefore);

  await page.keyboard.press('Escape');
  await expect(page.locator('.pause-rail')).toBeVisible();
  const elapsedBefore = await page.locator('.combat-hud').getAttribute('data-elapsed-ms');
  await page.waitForTimeout(900);
  expect(await page.locator('.combat-hud').getAttribute('data-elapsed-ms')).toBe(elapsedBefore);
  await page.getByRole('button', { name: /装备/ }).click();
  await expect(page.locator('.weapon-system')).toHaveCount(2);
  await expect(page.locator('.slot-section').nth(0).locator('.equipment-slot')).toHaveCount(8);
  await expect(page.locator('.slot-section').nth(1).locator('.equipment-slot')).toHaveCount(5);
  await expect(page.locator('.equipment-lock')).toContainText('战斗中仅可查看');
  await page.keyboard.press('Tab');
  await expect(page.locator('.stats-panel')).toBeVisible();
  await expect(page.locator('.stats-panel')).toContainText('持续 DPS');
  await page.keyboard.press('Escape');

  await expect(page.locator('[data-phase="chest"]')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId('interaction-prompt')).toContainText('打开宝箱');
  await tap(page, 'e');
  await expect(page.locator('[data-phase="loot"]')).toBeVisible({ timeout: 5_000 });
  const firstDrop = (await readRun(page)).chest?.drops.find((drop) => !drop.resolved);
  if (!firstDrop) throw new Error('first loot missing');
  await moveToWorld(page, firstDrop.worldX, firstDrop.worldY);
  await expect(page.getByTestId('loot-inspector')).toBeVisible();
  await expect(page.getByTestId('loot-inspector')).toContainText(/伤害|弹丸|元素回路|生效方式/);
  await page.getByRole('button', { name: '装到主武器' }).click();

  await expect(page.locator('[data-phase="loot"]')).toBeVisible();
  const secondDrop = (await readRun(page)).chest?.drops.find((drop) => !drop.resolved);
  if (!secondDrop) throw new Error('second loot missing');
  await moveToWorld(page, secondDrop.worldX, secondDrop.worldY);
  await expect(page.getByTestId('loot-inspector')).toBeVisible();
  await page.getByRole('button', { name: /分解/ }).click();

  await expect(page.locator('[data-phase="route"]')).toBeVisible();
  await expect(page.locator('canvas[data-runtime="persistent"]')).toHaveCount(1);
  const storage = await page.evaluate(() => ({
    profile: localStorage.getItem('sljt_v2_profile'),
    run: localStorage.getItem('sljt_v2_run'),
    legacy: localStorage.getItem('sljt_profile'),
  }));
  expect(storage.profile).toContain('"version":2');
  expect(storage.run).toContain('"version":3');
  expect(storage.run).toContain('"roomIndex":1');
  expect(storage.legacy).toContain('"legacy":true');
  expect(pageErrors).toEqual([]);
});

async function enterLeftDoor(page: Page): Promise<void> {
  await hold(page, 'w', 850);
  await hold(page, 'a', 500);
  await expect(page.getByTestId('interaction-prompt')).toContainText('进入');
  await tap(page, 'e');
}

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

async function moveToWorld(page: Page, worldX: number, worldY: number): Promise<void> {
  const box = await page.locator('canvas').boundingBox();
  if (!box) throw new Error('canvas missing');
  await page.mouse.move(box.x + worldX / 1_280 * box.width, box.y + worldY / 720 * box.height);
}

async function readRun(page: Page): Promise<RunStateV2> {
  return page.evaluate(() => JSON.parse(localStorage.getItem('sljt_v2_run') ?? '{}'));
}
