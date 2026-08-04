import { expect, test } from '@playwright/test';

test('压力房保持 50 敌人、500 弹丸并记录稳定帧率', async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto('/?e2e=1&stress=1');
  await page.getByTestId('enter-workshop').click();
  await page.keyboard.press('e');
  await page.keyboard.down('w');
  await page.waitForTimeout(850);
  await page.keyboard.up('w');
  await page.keyboard.down('a');
  await page.waitForTimeout(500);
  await page.keyboard.up('a');
  await page.keyboard.press('e');
  await expect(page.locator('.combat-meta')).toContainText('敌人 50', { timeout: 15_000 });
  await expect(page.locator('.combat-hud')).toHaveAttribute('data-projectiles', '500');

  // 排除 WebGL 首次纹理上传和 Phaser 帧率平滑器的启动窗口，只统计稳态。
  await page.waitForTimeout(3_000);
  const renderer = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const gl = canvas?.getContext('webgl2') ?? canvas?.getContext('webgl');
    const extension = gl?.getExtension('WEBGL_debug_renderer_info');
    return extension && gl ? gl.getParameter(extension.UNMASKED_RENDERER_WEBGL) as string : 'unknown';
  });
  const rafAverage = await page.evaluate(() => new Promise<number>((resolve) => {
    let frames = 0;
    let startedAt = 0;
    const sample = (now: number) => {
      if (startedAt === 0) startedAt = now;
      frames += 1;
      const elapsed = now - startedAt;
      if (elapsed >= 3_000) resolve((frames - 1) * 1_000 / elapsed);
      else requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  }));
  const samples: number[] = [];
  for (let index = 0; index < 20; index += 1) {
    const text = await page.locator('.combat-meta span').last().textContent();
    const fps = Number(text?.match(/[\d.]+/)?.[0] ?? 0);
    if (fps > 0) samples.push(fps);
    await page.waitForTimeout(160);
  }
  const average = samples.reduce((sum, value) => sum + value, 0) / Math.max(1, samples.length);
  await test.info().attach('fps-samples', {
    body: Buffer.from(JSON.stringify({ renderer, hudSamples: samples, hudAverage: average, rafAverage })),
    contentType: 'application/json',
  });
  expect(samples.length).toBeGreaterThanOrEqual(10);
  expect(rafAverage, `WebGL renderer: ${renderer}`).toBeGreaterThanOrEqual(58);
});
