import { afterEach, describe, expect, test } from '@rstest/core';
import { localStorageSaveAdapter } from '@/game/persistence';
import { createDefaultProfile } from '@/game/progression';
import { createRun } from '@/game/run';

class MemoryStorage {
  private readonly values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
  clear() { this.values.clear(); }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  get length() { return this.values.size; }
}

const originalStorage = globalThis.localStorage;

afterEach(() => {
  Object.defineProperty(globalThis, 'localStorage', { value: originalStorage, configurable: true });
});

describe('V2 存档隔离', () => {
  test('只读取 sljt_v2_*，忽略旧存档与错误版本', () => {
    const storage = new MemoryStorage();
    Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });
    storage.setItem('sljt_profile', JSON.stringify({ version: 1, accountXp: 99_999 }));
    storage.setItem('sljt_v2_profile', JSON.stringify({ version: 1, accountXp: 99_999 }));
    expect(localStorageSaveAdapter.loadProfile()).toEqual(createDefaultProfile());

    const profile = createDefaultProfile();
    profile.accountXp = 73;
    localStorageSaveAdapter.saveProfile(profile);
    expect(storage.getItem('sljt_v2_profile')).toContain('"accountXp":73');
    expect(localStorageSaveAdapter.loadProfile().accountXp).toBe(73);
  });

  test('保留账号与设置键，但旧卡片单局不会恢复到实体房间流程', () => {
    const storage = new MemoryStorage();
    Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });
    storage.setItem('sljt_v2_run', JSON.stringify({ version: 2, screen: 'reward' }));
    expect(localStorageSaveAdapter.loadRun()).toBeNull();

    const run = createRun(createDefaultProfile(), 42);
    localStorageSaveAdapter.saveRun(run);
    expect(localStorageSaveAdapter.loadRun()?.version).toBe(3);
    expect(localStorageSaveAdapter.loadRun()?.phase).toBe('route');
  });
});
