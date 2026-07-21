import { expect, type Page } from '@playwright/test';

export async function startNewRun(page: Page) {
  await page.goto('/');
  await page.getByTestId('new-game-button').click();
  const confirm = page.getByTestId('confirm-new-game');
  if (await confirm.isVisible()) await confirm.click();
  await expect(page.getByRole('navigation', { name: '本层路线概览' })).toBeVisible();
}

export async function chooseFirstReachableNode(page: Page) {
  const node = page.locator('[data-testid^="map-node-"][data-cursor-target="true"]').first();
  await node.click();
  await page.getByTestId('enter-selected-map-node').click();
}

export async function openDebugPanel(page: Page) {
  await page.locator('body').click();
  await page.keyboard.press('Backquote');
  await expect(page.getByTestId('debug-panel')).toBeVisible();
}

export async function confirmNodeResult(page: Page) {
  const result = page.getByTestId('node-result-overlay');
  await expect(result).toBeVisible();
  await result.getByRole('button', { name: /确认，继续攀登/ }).click();
  await expect(result).toBeHidden();
}
