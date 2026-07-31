const KEY = 'sljt_fast_mode_v1';

export function loadFastMode(): boolean {
  try { return localStorage.getItem(KEY) === 'true'; } catch { return false; }
}

export function saveFastMode(value: boolean): void {
  try { localStorage.setItem(KEY, String(value)); } catch { /* 本地设置失败不影响游戏 */ }
}
