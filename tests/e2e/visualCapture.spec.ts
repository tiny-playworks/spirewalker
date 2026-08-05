import { expect, test, type Page } from '@playwright/test';
import type { LootDrop, RunStateV2 } from '../../src/game/types';

test('采集 G1/G2/G3 实机关键状态', async ({ page }, testInfo) => {
  test.setTimeout(120_000);
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
  await page.keyboard.press('Escape');
  await expect(page.locator('.pause-rail')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('05-pause-overlay.png'), fullPage: true });
  await page.getByRole('button', { name: /装备/ }).click();
  await expect(page.locator('.equipment-panel')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('06-equipment-overlay.png'), fullPage: true });
  await page.keyboard.press('Tab');
  await expect(page.locator('.stats-panel')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('07-stats-overlay.png'), fullPage: true });
  await page.keyboard.press('Escape');

  await expect(page.locator('[data-phase="chest"]')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId('interaction-prompt')).toContainText('打开宝箱');
  await page.screenshot({ path: testInfo.outputPath('08-chest-landed.png'), fullPage: true });
  await focusGame(page);
  await tap(page, 'e');
  await expect(page.locator('[data-phase="loot"]')).toBeVisible({ timeout: 5_000 });
  await page.screenshot({ path: testInfo.outputPath('09-physical-loot.png'), fullPage: true });
  const firstRun = await readRun(page);
  const firstDrop = firstRun.chest?.drops.find((drop) => !drop.resolved);
  if (!firstDrop) throw new Error('first room loot missing');
  await moveToWorld(page, firstDrop.worldX, firstDrop.worldY);
  await expect(page.getByTestId('loot-inspector')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('10-single-loot-inspector.png'), fullPage: true });
  await resolveSelectedDrop(page);
  await processAllDrops(page);

  for (let room = 1; room < 3; room += 1) {
    await expect(page.locator('[data-phase="route"]')).toBeVisible();
    await enterLeftDoor(page);
    await expect(page.locator('[data-phase="chest"]')).toBeVisible({ timeout: 20_000 });
    await tap(page, 'e');
    await expect(page.locator('[data-phase="loot"]')).toBeVisible({ timeout: 5_000 });
    await processAllDrops(page);
  }

  await expect(page.locator('[data-phase="shop"]')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('11-walkable-shop.png'), fullPage: true });
  await moveToWorld(page, 190, 245);
  await expect(page.getByTestId('shop-inspector')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('12-shop-inspector.png'), fullPage: true });
  await hold(page, 'd', 1_100);
  await hold(page, 'w', 950);
  await expect(page.getByTestId('interaction-prompt')).toContainText('挑战熔炉守卫');
  await tap(page, 'e');

  await expect(page.locator('[data-phase="boss"]')).toBeVisible();
  await expect(page.locator('.boss-hud')).toContainText('失控熔炉守卫');
  await page.screenshot({ path: testInfo.outputPath('13-boss-combat.png'), fullPage: true });
  await expect(page.locator('[data-phase="chest"]')).toBeVisible({ timeout: 20_000 });
  await page.screenshot({ path: testInfo.outputPath('14-boss-chest.png'), fullPage: true });
  await tap(page, 'e');
  await expect(page.locator('[data-phase="loot"]')).toBeVisible({ timeout: 6_000 });
  await page.waitForTimeout(1_300);
  await page.screenshot({ path: testInfo.outputPath('15-boss-loot.png'), fullPage: true });

  const bossRun = await readRun(page);
  const arcana = bossRun.chest?.drops.find((drop) => drop.item?.kind === 'arcana' && !drop.resolved);
  if (!arcana) throw new Error('boss arcana drop missing');
  await moveToWorld(page, arcana.worldX, arcana.worldY);
  await expect(page.getByTestId('loot-inspector')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('16-boss-arcana-inspector.png'), fullPage: true });
  await processAllDrops(page);

  await expect(page.getByRole('heading', { name: '熔炉守卫已停机' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('17-victory-settlement.png'), fullPage: true });
});

async function enterLeftDoor(page: Page): Promise<void> {
  await hold(page, 'w', 850);
  await hold(page, 'a', 500);
  await expect(page.getByTestId('interaction-prompt')).toContainText('进入');
  await tap(page, 'e');
}

async function processAllDrops(page: Page): Promise<void> {
  while (await page.locator('[data-phase="loot"]').count()) {
    const run = await readRun(page);
    const drop = run.chest?.drops.find((entry) => !entry.resolved);
    if (!drop) return;
    await moveToWorld(page, drop.worldX, drop.worldY);
    await expect(page.getByTestId('loot-inspector')).toBeVisible();
    await resolveDrop(page, drop);
  }
}

async function resolveSelectedDrop(page: Page): Promise<void> {
  const run = await readRun(page);
  const drop = run.chest?.drops.find((entry) => entry.id === run.selectedLootId && !entry.resolved);
  if (!drop) throw new Error('selected loot missing');
  await resolveDrop(page, drop);
}

async function resolveDrop(page: Page, drop: LootDrop): Promise<void> {
  if (!drop.item) await page.getByRole('button', { name: '收取金币' }).click();
  else if (drop.item.kind === 'relic') await page.getByRole('button', { name: '装入秘宝槽' }).click();
  else if (drop.item.kind === 'arcana') await page.getByRole('button', { name: '装入秘仪槽' }).click();
  else await page.getByRole('button', { name: '装到主武器' }).click();
}

async function moveToWorld(page: Page, worldX: number, worldY: number): Promise<void> {
  const box = await page.locator('canvas').boundingBox();
  if (!box) throw new Error('canvas missing');
  await page.mouse.move(box.x + worldX / 1_280 * box.width, box.y + worldY / 720 * box.height);
}

async function readRun(page: Page): Promise<RunStateV2> {
  return page.evaluate(() => JSON.parse(localStorage.getItem('sljt_v2_run') ?? '{}'));
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

async function focusGame(page: Page): Promise<void> {
  await page.locator('canvas').click({ position: { x: 20, y: 20 } });
}
