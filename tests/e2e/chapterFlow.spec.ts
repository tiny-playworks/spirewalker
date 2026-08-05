import { expect, test, type Page } from '@playwright/test';
import type { RunStateV2 } from '../../src/game/types';

test('G3 完整章节：三房、商店、Boss、五类战利品与胜利结算', async ({ page }) => {
  test.setTimeout(100_000);
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto('/?e2e=1');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByTestId('enter-workshop').click();
  await expect(page.getByTestId('interaction-prompt')).toContainText('启动远征门');
  await tap(page, 'e');

  for (let room = 0; room < 3; room += 1) {
    await expect(page.locator('[data-phase="route"]')).toBeVisible();
    const restoredAtRoomEntrance = room === 1;
    if (room === 1) {
      await reloadAndContinue(page);
      await expect(page.locator('[data-phase="route"]')).toBeVisible();
    }
    await enterLeftDoor(page, restoredAtRoomEntrance);
    await expect(page.locator('[data-phase="combat"]')).toBeVisible();
    await expect(page.locator('[data-phase="chest"]')).toBeVisible({ timeout: 20_000 });

    if (room === 0) {
      await reloadAndContinue(page);
      await expect(page.locator('[data-phase="chest"]')).toBeVisible();
    }
    await expect(page.getByTestId('interaction-prompt')).toContainText('打开宝箱');
    await tap(page, 'e');
    await expect(page.locator('[data-phase="loot"]')).toBeVisible({ timeout: 6_000 });
    if (room === 0) {
      await reloadAndContinue(page);
      await expect(page.locator('[data-phase="loot"]')).toBeVisible();
    }
    await processAllDrops(page);
  }

  await expect(page.locator('[data-phase="shop"]')).toBeVisible();
  await expect(page.locator('.route-card, .shop-grid, .reward-grid')).toHaveCount(0);
  await seedShopBudgetAndDamage(page);
  await reloadAndContinue(page);
  await expect(page.locator('[data-phase="shop"]')).toBeVisible();

  const shopRun = await readRun(page);
  if (!shopRun.shop) throw new Error('shop state missing');
  const offer = shopRun.shop.offers.find((entry) => !entry.sold);
  if (!offer) throw new Error('shop offer missing');
  await moveToWorld(page, 190, 245);
  await expect(page.getByTestId('shop-inspector')).toBeVisible();
  const itemKind = offer.item.kind as string;
  if (itemKind === 'relic') await page.getByRole('button', { name: '购买并装入秘宝槽' }).click();
  else await page.getByRole('button', { name: '购买并装到主武器' }).click();
  await expect(page.getByTestId('shop-inspector')).toHaveCount(0);

  await hold(page, 'd', 1_100);
  await hold(page, 's', 900);
  await expect(page.getByTestId('interaction-prompt')).toContainText('恢复生命');
  await tap(page, 'e');
  expect((await readRun(page)).hp).toBeGreaterThan(50);

  await hold(page, 'd', 650);
  await expect(page.getByTestId('interaction-prompt')).toContainText('刷新全部货架');
  await tap(page, 'e');
  expect((await readRun(page)).shop?.rerollUsed).toBe(true);

  await hold(page, 'w', 950);
  await expect(page.getByTestId('interaction-prompt')).toContainText('挑战熔炉守卫');
  await tap(page, 'e');
  await expect(page.locator('[data-phase="boss"]')).toBeVisible();
  await expect(page.locator('.boss-hud')).toContainText('失控熔炉守卫');
  await expect(page.locator('[data-phase="chest"]')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId('interaction-prompt')).toContainText('打开宝箱');
  await tap(page, 'e');
  await expect(page.locator('[data-phase="loot"]')).toBeVisible({ timeout: 6_000 });

  const bossRun = await readRun(page);
  if (!bossRun.chest) throw new Error('boss chest missing');
  expect(bossRun.chest.tier).toBe('boss');
  expect(bossRun.chest.drops).toHaveLength(6);
  expect(bossRun.chest.drops.flatMap((drop) => drop.item ? [drop.item.kind] : []))
    .toEqual(['weapon', 'muzzle', 'core', 'relic', 'arcana']);
  await processAllDrops(page);

  await expect(page.getByRole('heading', { name: '熔炉守卫已停机' })).toBeVisible();
  await expect(page.locator('.settlement-run-summary')).toContainText('最终构筑');
  await expect(page.locator('.settlement-run-summary')).toContainText('新图鉴');
  const profile = await page.evaluate(() => JSON.parse(localStorage.getItem('sljt_v2_profile') ?? '{}'));
  expect(profile.victories).toBe(1);
  expect(profile.discoveredItemIds.length).toBeGreaterThan(2);
  expect(pageErrors).toEqual([]);
});

async function enterLeftDoor(page: Page, restoredAtRoomEntrance = false): Promise<void> {
  if (!restoredAtRoomEntrance) await hold(page, 'w', 850);
  await hold(page, 'a', 500);
  await expect(page.getByTestId('interaction-prompt')).toContainText('进入');
  await tap(page, 'e');
}

async function processAllDrops(page: Page): Promise<void> {
  while (await page.locator('[data-phase="loot"]').count()) {
    const run = await readRun(page);
    const drop = run.chest?.drops.find((entry: { resolved: boolean }) => !entry.resolved);
    if (!drop) return;
    await moveToWorld(page, drop.worldX, drop.worldY);
    await expect(page.getByTestId('loot-inspector')).toBeVisible();
    if (!drop.item) await page.getByRole('button', { name: '收取金币' }).click();
    else if (drop.item.kind === 'relic') await page.getByRole('button', { name: '装入秘宝槽' }).click();
    else if (drop.item.kind === 'arcana') await page.getByRole('button', { name: '装入秘仪槽' }).click();
    else await page.getByRole('button', { name: '装到主武器' }).click();
  }
}

async function moveToWorld(page: Page, worldX: number, worldY: number): Promise<void> {
  const box = await page.locator('canvas').boundingBox();
  if (!box) throw new Error('canvas missing');
  await page.mouse.move(box.x + worldX / 1_280 * box.width, box.y + worldY / 720 * box.height);
}

async function reloadAndContinue(page: Page): Promise<void> {
  await page.reload();
  await page.getByTestId('continue-run').click();
  await expect(page.getByTestId('game-canvas')).toBeVisible();
  await expect(page.getByTestId('game-canvas')).toHaveAttribute('data-runtime-ready', 'true');
}

async function seedShopBudgetAndDamage(page: Page): Promise<void> {
  await page.evaluate(() => {
    const run = JSON.parse(localStorage.getItem('sljt_v2_run') ?? '{}');
    run.gold = 500;
    run.hp = 50;
    localStorage.setItem('sljt_v2_run', JSON.stringify(run));
  });
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
