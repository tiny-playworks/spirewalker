import { createStarterMasterDeck } from '../engine/starterDeck';
import type { RunState } from '../model/run';
import { isLegacyLinearMap, migrateLegacyLinearMapInPlace } from './migrateLegacyMap';
import { RUN_SAVE_VERSION } from './saveVersion';

const KEY = 'sljt_run_v1';

export { RUN_SAVE_VERSION } from './saveVersion';

export function saveRunToLocalStorage(run: RunState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(run));
  } catch {
    /* ignore quota / private mode */
  }
}

/** 兼容旧存档缺少 masterDeck 等字段 */
export function normalizeRunState(raw: unknown): RunState | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<RunState>;
  if (typeof r.seed !== 'number' || !r.player || !r.map || !r.screen || !r.meta) return null;
  if (!Array.isArray(r.masterDeck) || r.masterDeck.length === 0) {
    r.masterDeck = createStarterMasterDeck();
  }
  if (typeof r.saveVersion !== 'number' || r.saveVersion < 1) {
    r.saveVersion = 1;
  }
  if (!Array.isArray(r.meta.potions)) {
    r.meta.potions = [];
  }

  const run = r as RunState;
  if (isLegacyLinearMap(run.map.nodes)) {
    migrateLegacyLinearMapInPlace(run);
  } else if ((run.saveVersion ?? 1) < RUN_SAVE_VERSION) {
    run.saveVersion = RUN_SAVE_VERSION;
  }

  return run;
}

export function loadRunFromLocalStorage(): RunState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return normalizeRunState(JSON.parse(raw));
  } catch {
    return null;
  }
}

/** 是否存在可恢复的存档（用于主菜单「继续」） */
export function hasSavedRun(): boolean {
  return loadRunFromLocalStorage() !== null;
}

export function clearSavedRun(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
