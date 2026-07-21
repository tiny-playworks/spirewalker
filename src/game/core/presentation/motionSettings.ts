const KEY = 'sljt_reduce_motion_v1';

export function loadReducedMotion(): boolean {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'true') return true;
    if (saved === 'false') return false;
  } catch { /* 本地设置失败时跟随系统 */ }
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function applyReducedMotion(reduced: boolean, persist = true): void {
  document.documentElement.dataset.reduceMotion = String(reduced);
  if (!persist) return;
  try { localStorage.setItem(KEY, String(reduced)); } catch { /* 不影响游戏 */ }
}
