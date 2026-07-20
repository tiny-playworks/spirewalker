import { createEmptyProfile, type ProfileState } from '../model/profile';

const KEY = 'sljt_profile_v1';
const LEGACY_KEYS = ['sljt_profile', 'sljt_profile_v0'] as const;

function asNonNegativeInt(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
}

function uniqueStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === 'string' && item.length > 0))];
}

export function normalizeProfile(raw: unknown): ProfileState | null {
  if (!raw || typeof raw !== 'object') return null;
  const input = raw as Partial<ProfileState>;
  if (input.version !== 1) return null;
  const stats = input.lifetimeStats;
  return {
    version: 1,
    unlockedCards: uniqueStrings(input.unlockedCards),
    unlockedRelics: uniqueStrings(input.unlockedRelics),
    achievements: uniqueStrings(input.achievements),
    lifetimeStats: {
      runs: asNonNegativeInt(stats?.runs),
      wins: asNonNegativeInt(stats?.wins),
      highestAct: Math.max(0, Math.min(3, asNonNegativeInt(stats?.highestAct))),
    },
  };
}

/** 将早期未分版本的长期档案迁移到当前结构。 */
export function migrateProfile(raw: unknown): ProfileState | null {
  const normalized = normalizeProfile(raw);
  if (normalized) return normalized;
  if (!raw || typeof raw !== 'object') return null;

  const input = raw as {
    version?: unknown;
    unlockedCards?: unknown;
    unlockedRelics?: unknown;
    achievements?: unknown;
    lifetimeStats?: { runs?: unknown; wins?: unknown; highestAct?: unknown };
    stats?: { runs?: unknown; wins?: unknown; highestAct?: unknown };
  };
  if (input.version !== undefined && input.version !== 0) return null;
  const stats = input.lifetimeStats ?? input.stats;
  return {
    version: 1,
    unlockedCards: uniqueStrings(input.unlockedCards),
    unlockedRelics: uniqueStrings(input.unlockedRelics),
    achievements: uniqueStrings(input.achievements),
    lifetimeStats: {
      runs: asNonNegativeInt(stats?.runs),
      wins: asNonNegativeInt(stats?.wins),
      highestAct: Math.max(0, Math.min(3, asNonNegativeInt(stats?.highestAct))),
    },
  };
}

export function saveProfileToLocalStorage(profile: ProfileState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    /* ignore quota / private mode */
  }
}

export function loadProfileFromLocalStorage(): ProfileState {
  try {
    const currentRaw = localStorage.getItem(KEY);
    const current = currentRaw ? migrateProfile(JSON.parse(currentRaw)) : null;
    if (current) {
      if (currentRaw && JSON.stringify(current) !== currentRaw) {
        saveProfileToLocalStorage(current);
      }
      return current;
    }
    for (const legacyKey of LEGACY_KEYS) {
      const legacyRaw = localStorage.getItem(legacyKey);
      if (!legacyRaw) continue;
      const migrated = migrateProfile(JSON.parse(legacyRaw));
      if (!migrated) continue;
      saveProfileToLocalStorage(migrated);
      localStorage.removeItem(legacyKey);
      return migrated;
    }
    return createEmptyProfile();
  } catch {
    return createEmptyProfile();
  }
}

export function clearProfileFromLocalStorage(): void {
  try {
    localStorage.removeItem(KEY);
    for (const legacyKey of LEGACY_KEYS) localStorage.removeItem(legacyKey);
  } catch {
    /* ignore private mode */
  }
}
