import { expect, type Page } from '@playwright/test';

export async function startNewRun(page: Page) {
  await page.goto('/');
  await page.getByTestId('new-game-button').click();
  await expect(page.getByText('本层路线')).toBeVisible();
}

export async function chooseFirstReachableNode(page: Page) {
  await page.locator('[data-testid^="map-node-"][data-cursor-target="true"]').first().click();
  await page.getByTestId('decision-cta').click();
}

export async function openDebugPanel(page: Page) {
  await page.locator('body').click();
  await page.keyboard.press('Backquote');
  await expect(page.getByTestId('debug-panel')).toBeVisible();
}
