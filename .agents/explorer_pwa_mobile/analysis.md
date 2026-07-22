# Spirewalker V2 Architecture Expansion: Requirements R3 & R4 Detailed Analysis

## Executive Summary
This analysis covers **Requirements R3 (Standalone PWA & Offline Support)** and **Requirements R4 (Mobile Safe-Area & Ergonomics)** for the Spirewalker V2 project.
- **R3 Key Finding**: The build environment uses `@rsbuild/core` v2.0.0 (Rspack-backed build system). HTML generation and asset bundling are handled via `rsbuild.config.ts`. To achieve standalone PWA compliance and offline support without impacting gameplay performance, we design a native Service Worker (`public/sw.js`), a Web App Manifest (`public/manifest.webmanifest`), and an isolated loader (`src/registerServiceWorker.ts`) registered on `window.load` in `src/index.tsx`.
- **R4 Key Finding**: `src/index.css` lacks standardized CSS custom property probes for iOS/Android viewport insets. Furthermore, top-bar controls (`logToggle`, `actionButton`, `chip`) have min-dimensions of `1.7rem - 1.95rem` (~27.2px - 31.2px), falling below the Apple HIG (44px) and Google Material Design (48px) touch target standards on mobile touch devices. Hand card buttons on mobile landscape measure 104px × 148px (exceeding 48px), but require hit-area optimization. We design CSS probe injection and touch-target scaling while strictly preserving desktop 16:9 layout.

---

## 1. Requirements R3: Standalone PWA & Offline Shell Caching

### 1.1 Infrastructure & Build System Inspection
- **Build System**: `@rsbuild/core` 2.0.0 with `@rsbuild/plugin-react` 2.0.0.
- **Config File**: `rsbuild.config.ts`.
- **HTML Ingestion**: Rsbuild constructs `dist/index.html` at build time. HTML meta and links can be configured either directly via `html.meta` and `html.tags` in `rsbuild.config.ts` or via a custom template `./public/index.html`.
- **Asset Processing**: Files placed in `public/` (e.g., `favicon.svg`, `manifest.webmanifest`, `sw.js`) are served at root (`/`) and copied verbatim to `dist/`. Assets in `src/` are bundled into hash-versioned chunks under `dist/static/js/` and `dist/static/css/`.

### 1.2 Web App Manifest Design (`public/manifest.webmanifest`)
To pass Chrome Lighthouse PWA Audits and support iOS/Android standalone installation, `public/manifest.webmanifest` must be created with the following specification:

```json
{
  "name": "Spirewalker: Void Ascent",
  "short_name": "Spirewalker",
  "description": "A Cyber-Gothic Roguelike Deckbuilder set in the Ethereal Void.",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "orientation": "landscape",
  "background_color": "#0a0a0b",
  "theme_color": "#131314",
  "categories": ["games", "entertainment"],
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

#### Head Injection Strategy in `rsbuild.config.ts`:
Add meta and manifest tags to `rsbuild.config.ts`:
```ts
html: {
  title: '肉鸽卡牌 · MVP 战斗',
  favicon: './public/favicon.svg',
  meta: {
    viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
    'theme-color': '#131314',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Spirewalker',
  },
  tags: [
    { tag: 'link', attrs: { rel: 'manifest', href: '/manifest.webmanifest' } },
    { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/favicon.svg' } },
  ],
}
```

### 1.3 Service Worker Architecture & Caching Strategy (`public/sw.js`)
- **Strategy**: Cache-First for static app shell assets (HTML, JS, CSS, SVG, WebP), Network-First fallback.
- **Isolation Principle**:
  - Core game state logic runs entirely in the main thread (Zustand `useGameStore`).
  - Service Worker must **never** intercept dynamic game API endpoints or write/read Zustand memory state.
  - SW only caches static GET requests. Non-GET methods (POST, PUT, DELETE) and browser extension schemes (`chrome-extension://`) bypass the SW immediately.

#### Service Worker Implementation Spec (`public/sw.js`):
```js
const CACHE_NAME = 'spirewalker-shell-v1';
const PRECACHE_URLS = [
  './',
  './index.html',
  './favicon.svg',
  './manifest.webmanifest',
];

// Install: Pre-cache core shell resources and activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Purge obsolete cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Cache-First strategy with Network Fallback & Offline SPA Navigation
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-GET requests and unsupported protocols
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  // SPA navigation fallback handler
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('./index.html') || caches.match('/');
      })
    );
    return;
  }

  // Cache-First for static assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
```

### 1.4 Isolated Registration Architecture (`src/registerServiceWorker.ts`)
To isolate registration from the game loop:
Create `src/registerServiceWorker.ts`:
```ts
export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    // Only register in production or when explicitly enabled
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_DEV_SW === 'true') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.warn('[PWA] Service Worker registration failed:', error);
        });
    }
  });
}
```

Invoke in `src/index.tsx`:
```ts
import { registerServiceWorker } from './registerServiceWorker';
// ...
registerServiceWorker();
```

---

## 2. Requirements R4: Mobile Safe-Area & Ergonomics

### 2.1 CSS Safe-Area Inset Probes (`src/index.css`)
Apple iOS (iPhone with notch / Dynamic Island) and Android gesture-bar devices inject `env(safe-area-inset-*)`. Standard CSS probe variables should be declared at `:root` in `src/index.css`:

```css
:root {
  /* Safe Area Inset Probes */
  --sat: env(safe-area-inset-top, 0px);
  --sar: env(safe-area-inset-right, 0px);
  --sab: env(safe-area-inset-bottom, 0px);
  --sal: env(safe-area-inset-left, 0px);
}
```

#### Application across layout containers:
1. **Root HTML/Body**: Requires `<meta name="viewport" content="..., viewport-fit=cover">` in HTML header.
2. **Top Bar Header (`src/features/battle/battlePage.css.ts`)**:
   Update `headerArea` padding to use safe-area probes:
   `padding: max(0.42rem, var(--sat)) max(1.25rem, var(--sar)) 0.42rem max(1.25rem, var(--sal))`
3. **Bottom Dock (`src/features/battle/reactBattleStage.css.ts`)**:
   `bottomDock` line 453:
   `padding: 0 max(0.2rem, var(--sar)) max(0.15rem, var(--sab)) max(0.2rem, var(--sal))`
4. **Mobile Orientation Gate (`src/app/mobileLandscapeGate.css.ts`)**:
   Uses `env(safe-area-inset-*)` directly; can be updated to reference `var(--sat)`, `var(--sar)`, `var(--sab)`, `var(--sal)`.

### 2.2 Mobile Touch Target Sizes & Ergonomics Analysis

#### 2.2.1 Guidelines Audit Standard
- **Apple iOS HIG**: Minimum 44pt × 44pt (~44px × 44px) touch target.
- **Google Material Design**: Minimum 48dp × 48dp (~48px × 48px) touch target.

#### 2.2.2 Touch Target Audit & Remediation Matrix

| UI Component | Current Desktop Dimensions | Current Mobile Dimensions | HIG/Material Audit Result | Required Remediation |
|---|---|---|---|---|
| **Hand Cards** (`card` in `reactBattleStage.css.ts`) | 8.6rem × 13rem (~137.6px × 208px) | 6.5rem × 9.25rem (~104px × 148px) | **PASS** (104px × 148px > 48px) | Ensure `touch-action: manipulation` and prevent drag collision during tap. |
| **TopBar Log/Audio/Fast Toggle** (`logToggle` in `battlePage.css.ts`) | 1.95rem × 1.95rem (~31.2px × 31.2px) | 1.95rem × 1.95rem (~31.2px × 31.2px) | **FAIL** (31.2px < 44px/48px) | On `@media (pointer: coarse)` or mobile landscape, expand hit area to `minHeight: 2.75rem` (44px) / `minWidth: 2.75rem` (44px) via transparent pseudo-element or container padding while preserving 16:9 visual icon alignment. |
| **HUD Status Chips** (`chip` in `battleHud.css.ts`) | 2rem min-height (~32px) | 1.7rem min-height (~27.2px) | **FAIL** (27.2px < 44px) for interactive chips | For chips with tooltips/clicks, add `@media (pointer: coarse)` `min-height: 2.75rem` (44px). |
| **End Turn / Reward Button** (`commandButton` in `reactBattleStage.css.ts`) | 4.1rem × 12rem (~65.6px × 192px) | 3.1rem × 100% (~49.6px × width) | **PASS** (49.6px > 48px) | No size change needed; add active touch feedback (`:active { transform: scale(0.97); }`). |
| **Map Nodes** (`mapNode` in `mapRoute.css.ts`) | 3.2rem × 3.2rem (~51.2px × 51.2px) | 3.2rem × 3.2rem (~51.2px × 51.2px) | **PASS** (51.2px > 48px) | Retain current size, add `:active` highlight. |

### 2.3 Preserving Desktop 16:9 Layout Integrity
All mobile ergonomic changes must strictly use conditional media queries:
```css
@media (pointer: coarse) and (max-width: 900px), (max-width: 900px) and (orientation: landscape) {
  /* Mobile ergonomic overrides */
}
```
This ensures zero visual or sizing impact on desktop browsers operating at 16:9 ratio.

---

## 3. Summary of Proposed Artifact Modifications

1. `public/manifest.webmanifest`: New PWA Web Manifest file.
2. `public/sw.js`: New Service Worker supporting Cache-First offline shell caching.
3. `src/registerServiceWorker.ts`: New SW registration helper.
4. `src/index.tsx`: Register SW on window load.
5. `rsbuild.config.ts`: Update `html` configuration with meta tags (`viewport-fit=cover`, `theme-color`, `apple-mobile-web-app-*`) and manifest link tag.
6. `src/index.css`: Add `:root` safe-area probe variables (`--sat`, `--sar`, `--sab`, `--sal`).
7. `src/features/battle/battlePage.css.ts`, `battleHud.css.ts`, `reactBattleStage.css.ts`: Update touch targets (`@media (pointer: coarse)`) and apply safe-area probes.
