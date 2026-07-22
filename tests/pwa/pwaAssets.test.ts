import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from '@rstest/core';

describe('PWA assets', () => {
  test('manifest exposes an installable standalone app', () => {
    const manifest = JSON.parse(
      readFileSync(resolve(process.cwd(), 'public/manifest.webmanifest'), 'utf8'),
    ) as Record<string, unknown>;

    expect(manifest.name).toBe('Spirewalker');
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('./');
    expect(manifest.scope).toBe('./');
    expect(Array.isArray(manifest.icons)).toBe(true);
  });

  test('service worker contains offline shell and navigation fallback', () => {
    const serviceWorker = readFileSync(resolve(process.cwd(), 'public/sw.js'), 'utf8');

    expect(serviceWorker).toContain("caches.open(CACHE_NAME)");
    expect(serviceWorker).toContain("request.mode === 'navigate'");
    expect(serviceWorker).toContain("caches.match('./')");
  });
});
