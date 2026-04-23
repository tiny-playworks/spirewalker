import { expect, test } from '@playwright/test';
import { startNewRun } from './helpers';

test('首页能进入地图页', async ({ page }) => {
  await startNewRun(page);

  await expect(page.getByText('本层路线')).toBeVisible();
  await expect(page.getByText('先点亮一个前方节点，再点一次同一节点直接进入。')).toBeVisible();
});
