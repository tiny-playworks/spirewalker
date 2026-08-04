import { createDefaultProfile } from './progression';
import type { ProfileV2, RunStateV2, SettingsV2 } from './types';

const PROFILE_KEY = 'sljt_v2_profile';
const RUN_KEY = 'sljt_v2_run';
const SETTINGS_KEY = 'sljt_v2_settings';

export const DEFAULT_SETTINGS: SettingsV2 = {
  version: 2,
  masterVolume: 0.65,
  reducedMotion: false,
  showDamageNumbers: true,
};

export interface SaveAdapter {
  loadProfile(): ProfileV2;
  saveProfile(profile: ProfileV2): void;
  loadRun(): RunStateV2 | null;
  saveRun(run: RunStateV2 | null): void;
  loadSettings(): SettingsV2;
  saveSettings(settings: SettingsV2): void;
}

export const localStorageSaveAdapter: SaveAdapter = {
  loadProfile() {
    const value = readJson<ProfileV2>(PROFILE_KEY);
    return value?.version === 2 ? value : createDefaultProfile();
  },
  saveProfile(profile) {
    writeJson(PROFILE_KEY, profile);
  },
  loadRun() {
    const value = readJson<RunStateV2>(RUN_KEY);
    // G1 的房间、宝箱与地面掉落状态无法由旧的卡片流程安全恢复。
    return value?.version === 3 ? { ...value, activeWeapon: value.activeWeapon ?? 0 } : null;
  },
  saveRun(run) {
    try {
      if (run) localStorage.setItem(RUN_KEY, JSON.stringify(run));
      else localStorage.removeItem(RUN_KEY);
    } catch {
      // 存档失败不打断正在进行的战斗。
    }
  },
  loadSettings() {
    const value = readJson<SettingsV2>(SETTINGS_KEY);
    return value?.version === 2 ? { ...DEFAULT_SETTINGS, ...value } : DEFAULT_SETTINGS;
  },
  saveSettings(settings) {
    writeJson(SETTINGS_KEY, settings);
  },
};

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 浏览器禁用存储时仍允许本次会话继续。
  }
}
