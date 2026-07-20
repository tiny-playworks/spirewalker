import { expect, test, type Page } from '@playwright/test';
import { openDebugPanel, startNewRun } from './helpers';

const FIXED_SEED = 1001;

async function chooseNode(page: Page, nodeId: string) {
  const node = page.getByTestId(`map-node-${nodeId}`);
  await expect(node).toHaveAttribute('data-cursor-target', 'true');
  await node.click();
  await node.click();
}

async function skipReward(page: Page) {
  await expect(page.getByTestId('reward-page')).toBeVisible();
  await page.getByRole('button', { name: /放弃卡牌/ }).click();
  await expect(page.getByRole('navigation', { name: '本层路线概览' })).toBeVisible();
}

async function finishBattle(page: Page) {
  await expect(page.getByTestId('battle-hud')).toBeVisible();
  await openDebugPanel(page);
  await page.getByTestId('debug-force-victory').click();
  await page.keyboard.press('Backquote');
  await page.getByTestId('leave-battle-to-reward').click();
  await skipReward(page);
}

async function resolveEvent(page: Page) {
  await expect(page.getByTestId('event-page')).toBeVisible();
  await page.getByTestId('event-page').locator('button:not([disabled])').first().click();
  await expect(page.getByRole('navigation', { name: '本层路线概览' })).toBeVisible();
}

test('固定种子可以从 Act 1 走到 Act 2', async ({ page }) => {
  await page.addInitScript((seed) => {
    Date.now = () => seed;
  }, FIXED_SEED);
  await startNewRun(page);

  // seed=1001 的路线覆盖事件、宝藏、精英、商店、营火和 Boss。
  await chooseNode(page, 'a1_d2_r2');
  await finishBattle(page);
  await chooseNode(page, 'a1_d3_r2');
  await finishBattle(page);
  await chooseNode(page, 'a1_d4_r2');
  await resolveEvent(page);
  await chooseNode(page, 'a1_d5_r1');
  await skipReward(page);
  await chooseNode(page, 'a1_d6_r0');
  await finishBattle(page);
  await chooseNode(page, 'a1_d7_r2');
  await resolveEvent(page);
  await chooseNode(page, 'a1_d8_r3');
  await finishBattle(page);
  await chooseNode(page, 'a1_d9_r3');
  await finishBattle(page);
  await chooseNode(page, 'a1_d10_r3');
  await expect(page.getByTestId('shop-page')).toBeVisible();
  await page.getByRole('button', { name: '离开商店' }).click();
  await expect(page.getByRole('navigation', { name: '本层路线概览' })).toBeVisible();
  await chooseNode(page, 'a1_d11_r3');
  await expect(page.getByRole('button', { name: '休息并返回地图' })).toBeVisible();
  await page.getByRole('button', { name: '休息并返回地图' }).click();
  await expect(page.getByRole('navigation', { name: '本层路线概览' })).toBeVisible();
  await chooseNode(page, 'a1_d12_r3');
  await finishBattle(page);

  await expect(page.getByTestId('current-act')).toHaveText('第 2 章 · 碎裂回廊');
  await expect(page.getByRole('navigation', { name: '本层路线概览' })).toBeVisible();
});
