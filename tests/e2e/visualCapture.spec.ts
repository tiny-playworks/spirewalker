import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';

test('@visual 记录桌面关键界面截图', async ({ page }, testInfo) => {
  const outputDir = join(process.cwd(), 'output/playwright/spirewalker');
  mkdirSync(outputDir, { recursive: true });
  const suffix = testInfo.project.name;

  await page.goto('/');
  await page.getByTestId('new-game-button').click();
  await expect(page.getByTestId('confirm-new-game')).toBeVisible();
  await page.screenshot({ path: join(outputDir, `walker-intro-${suffix}.png`) });

  await page.getByTestId('confirm-new-game').click();
  await expect(page.getByRole('navigation', { name: '本层路线概览' })).toBeVisible();
  const node = page.locator('[data-testid^="map-node-"][data-cursor-target="true"]').first();
  await node.click();
  await expect(page.getByTestId('enter-selected-map-node')).toBeVisible();
  await expect(page.locator('[data-testid="map-page"][data-scene-ready="true"]')).toBeVisible();
  await page.screenshot({ path: join(outputDir, `map-choice-${suffix}.png`) });

  await page.getByTestId('enter-selected-map-node').click();
  await expect(page.getByTestId('battle-hud')).toBeVisible();
  await expect(page.locator('button[data-testid^="battle-card-"]').first()).toBeVisible();
  await page.screenshot({ path: join(outputDir, `battle-${suffix}.png`) });
});
