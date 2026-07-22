import { expect, test } from '@playwright/test';

test('PWA 清单与离线脚本可从应用入口访问', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', /manifest\.webmanifest/);

  const manifestResponse = await request.get('/manifest.webmanifest');
  expect(manifestResponse.ok()).toBe(true);
  const manifest = await manifestResponse.json() as { display?: string; start_url?: string };
  expect(manifest.display).toBe('standalone');
  expect(manifest.start_url).toBe('./');

  const serviceWorkerResponse = await request.get('/sw.js');
  expect(serviceWorkerResponse.ok()).toBe(true);
  expect(await serviceWorkerResponse.text()).toContain("request.mode === 'navigate'");
});
