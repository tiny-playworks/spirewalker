# Explorer Subagent Handoff Report: PWA & Mobile Ergonomics (Requirements R3 & R4)

## 1. Observation

### 1.1 Project & Build Setup
- **Build System**: `@rsbuild/core` v2.0.0 (`rsbuild.config.ts`), `@rsbuild/plugin-react` v2.0.0.
- **Entry Point**: `src/index.tsx` (lines 1-17), loading `src/index.css` (lines 1-305).
- **Current HTML Meta Configuration in `rsbuild.config.ts`** (lines 30-33):
  ```ts
  html: {
    title: '肉鸽卡牌 · MVP 战斗',
    favicon: './public/favicon.svg',
  }
  ```
  *(Missing `viewport-fit=cover`, PWA theme-color, manifest link, apple-mobile-web-app tags).*
- **Public Directory Content**: `public/` currently contains `assets/`, `favicon.svg`, `image.png`. It lacks `manifest.webmanifest` and `sw.js`.

### 1.2 CSS & Mobile Ergonomics Measurements
- **Current `src/index.css` `:root`** (lines 1-15):
  ```css
  :root {
    color-scheme: dark;
    font-family: 'Hanken Grotesk', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
    color: #e5e2e3;
    background: #0a0a0b;
    font-synthesis: none;
    text-rendering: geometricPrecision;
  }
  ```
  *(Missing iOS/Android CSS variable probes `--sat`, `--sar`, `--sab`, `--sal`).*
- **Top Bar Control Dimensions in `src/features/battle/battlePage.css.ts`** (lines 154-155):
  `logToggle`: `minHeight: '1.95rem'`, `minWidth: '1.95rem'` (~31.2px × 31.2px).
- **HUD Chips in `src/features/battle/battleHud.css.ts`** (lines 8, 116):
  `battleBarControlMinHeight = '2rem'` (32px), mobile chip `minHeight: '1.7rem'` (27.2px).
- **End Turn Button in `src/features/battle/reactBattleStage.css.ts`** (line 614):
  Mobile `commandButton`: `minHeight: '3.1rem'` (49.6px) — passes 48px target requirement.
- **Hand Cards in `src/features/battle/reactBattleStage.css.ts`** (lines 701-702):
  Mobile card: `flexBasis: '6.5rem'` (~104px), `height: '9.25rem'` (~148px) — passes 48px target requirement.

---

## 2. Logic Chain

1. **Premise 1**: Requirements R3 requires standalone PWA installation and offline app shell caching.
2. **Observation Reference 1.1**: The project uses Rsbuild, which copies `public/` files verbatim to `dist/` and compiles JS/CSS into hash-named bundles. `rsbuild.config.ts` controls injected HTML head tags.
3. **Deduction 1**: Placing `manifest.webmanifest` and `sw.js` in `public/` will ensure they are served at root (`/manifest.webmanifest` and `/sw.js`). Injecting `<link rel="manifest">` and standard meta tags via `rsbuild.config.ts` satisfies Lighthouse PWA audit prerequisites.
4. **Observation Reference 1.1**: Core gameplay state and combat engine reside in `src/game/core` and `useGameStore` (client main thread).
5. **Deduction 2**: Service Worker must use a static Cache-First strategy targeting asset URLs (`.html`, `.js`, `.css`, `.svg`, `.webp`, `.png`) while strictly ignoring non-GET HTTP requests and main-thread Zustand state. Decoupling SW registration into `src/registerServiceWorker.ts` triggered on `window.load` ensures game startup FPS is unaffected.
6. **Premise 2**: Requirements R4 requires iOS/Android safe-area handling and minimum 44px/48px touch targets on mobile touch devices without breaking desktop 16:9 layout.
7. **Observation Reference 1.2**: `src/index.css` lacks global `:root` CSS safe-area inset probes, and top bar buttons measure 27.2px - 31.2px, violating Apple HIG (44px) and Material Design (48px) standards.
8. **Deduction 3**:
   - Standardizing `--sat`, `--sar`, `--sab`, `--sal` in `src/index.css` `:root` enables all UI containers to adopt uniform safe-area padding.
   - Target sizing for interactive elements (`logToggle`, interactive chips) must be upgraded using `@media (pointer: coarse)` to expand touch hitboxes to min 44px/48px while maintaining identical 16:9 desktop geometry.

---

## 3. Caveats

1. **Read-Only Scope**: This report is produced under read-only exploration mode. Source code modifications are deferred to the Implementation phase (M3 & M4).
2. **Local HTTP vs HTTPS**: Service Worker registration requires HTTPS in production, but browsers permit `http://localhost` and `http://127.0.0.1` for local testing.
3. **PWA Assets**: Pre-caching in `sw.js` relies on local assets in `public/` and built chunks. External third-party CDN resources (if added in the future) should handle CORS headers properly.
4. **iOS Audio Context Restriction**: On iOS Safari, Web Audio API requires a user gesture (`touchstart` / `click`) to unlock sound playback, which is handled in `gameAudio.ts` and independent of PWA/SW caching.

---

## 4. Conclusion

### 4.1 Standalone PWA Blueprint (M3)
1. **Manifest File**: Create `public/manifest.webmanifest` with standalone display, landscape orientation, background `#0a0a0b`, theme `#131314`, and SVG/PNG icons.
2. **Service Worker**: Create `public/sw.js` with Cache-First app shell caching, versioned cache cleanup (`spirewalker-shell-v1`), and SPA offline navigation fallback (`/index.html`).
3. **Registration Unit**: Create `src/registerServiceWorker.ts` and call it in `src/index.tsx` inside `window.load`.
4. **HTML Configuration**: Update `rsbuild.config.ts` to include `viewport-fit=cover`, `theme-color`, manifest link, and Apple PWA status bar meta tags.

### 4.2 Mobile Ergonomics Blueprint (M4)
1. **Safe-Area Inset Probes**: Declare `--sat`, `--sar`, `--sab`, `--sal` in `:root` inside `src/index.css`.
2. **Touch Targets**: Apply `@media (pointer: coarse)` overrides to `battlePage.css.ts` (`logToggle`) and `battleHud.css.ts` (`chip` / `actionButton`) to achieve min 44px/48px hitboxes.
3. **Layout Isolation**: Wrap all mobile-specific dimensions inside `@media (pointer: coarse)` or mobile landscape media queries to preserve 100% desktop 16:9 aspect ratio fidelity.

---

## 5. Verification Method

### 5.1 Automated Type & Code Check
Execute in terminal:
```bash
pnpm check
pnpm build
```
- Verify TypeScript compilation passes with zero errors (`tsc --noEmit`).
- Verify Rsbuild outputs `dist/manifest.webmanifest`, `dist/sw.js`, and `dist/index.html`.

### 5.2 Local PWA & Service Worker Audit
Execute:
```bash
pnpm preview
```
- Open Chrome DevTools -> **Application** tab -> **Manifest**: Verify manifest loads cleanly with display `standalone` and valid icons.
- Open Chrome DevTools -> **Application** tab -> **Service Workers**: Verify `sw.js` status is `Activated and is running`. Check **Offline** mode checkbox and refresh page — verify app shell renders offline.
- Open Chrome DevTools -> **Lighthouse** -> Run PWA audit: Verify PWA criteria pass.

### 5.3 Mobile Safe-Area & Touch Target Inspection
- In Chrome DevTools, toggle Device Toolbar (`Cmd+Shift+M`), select **iPhone 14 Pro / Pixel 7**, set orientation to **Landscape**.
- Inspect `:root` elements to verify `--sat`, `--sar`, `--sab`, `--sal` resolve properly.
- Inspect `logToggle` and `AudioToggle` buttons with element inspector — confirm hit target area is at least 44px × 44px.
- Select desktop viewport (1920x1080) — confirm layout and sizing remain identical to baseline 16:9 desktop layout.
