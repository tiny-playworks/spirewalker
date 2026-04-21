import { createStarterMasterDeck } from '../engine/starterDeck';
import { DEFAULT_CHARACTER_ID } from '../definitions/characters';
import { createEmptyEncounterHistory, type RunState } from '../model/run';
import { RUN_SAVE_VERSION } from './saveVersion';

const KEY = 'sljt_run_v3';

export { RUN_SAVE_VERSION } from './saveVersion';

export function saveRunToLocalStorage(run: RunState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(run));
  } catch {
    /* ignore quota / private mode */
  }
}

export function normalizeRunState(raw: unknown): RunState | null {
  if (!raw || typeof raw !== 'object') return null;
  const run = raw as Partial<RunState>;
  if (run.saveVersion !== RUN_SAVE_VERSION) return null;
  if (typeof run.seed !== 'number' || !run.player || !run.map || !run.screen || !run.meta) return null;
  if (!Array.isArray(run.masterDeck) || run.masterDeck.length === 0) {
    run.masterDeck = createStarterMasterDeck(DEFAULT_CHARACTER_ID);
  }
  if (!Array.isArray(run.meta.relics)) run.meta.relics = [];
  if (!Array.isArray(run.meta.potions)) run.meta.potions = [];
  if (!run.meta.encounterHistory || typeof run.meta.encounterHistory !== 'object') {
    run.meta.encounterHistory = createEmptyEncounterHistory();
  }
  if (!Array.isArray(run.meta.encounterHistory.ids)) run.meta.encounterHistory.ids = [];
  if (!Array.isArray(run.meta.encounterHistory.tags)) run.meta.encounterHistory.tags = [];
  if (!Array.isArray(run.meta.encounterHistory.archetypes)) run.meta.encounterHistory.archetypes = [];
  if (typeof run.meta.characterId !== 'string' || run.meta.characterId.length === 0) {
    run.meta.characterId = DEFAULT_CHARACTER_ID;
  }
  if (typeof run.meta.act !== 'number' || typeof run.meta.actFloor !== 'number') return null;
  return run as RunState;
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
