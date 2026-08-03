import { create } from 'zustand';
import { localStorageSaveAdapter } from './persistence';
import {
  calculateSettlement,
  getCombatModifiers,
  grantSettlementXp,
  purchaseGlobalTalent,
  resetCharacterTalents,
  resetGlobalTalents,
  selectCharacterTalent,
} from './progression';
import {
  generateRewardOffers,
  generateRouteChoices,
  generateShopOffers,
  rollEliteRewardCategory,
} from './rewards';
import { createRun, currentBuildTags, equipReward, healAfterRoom, type EquipTarget } from './run';
import type {
  CombatResult,
  ProfileV2,
  RewardItem,
  RouteOption,
  RunStateV2,
  SettingsV2,
  SettlementBreakdown,
} from './types';

type MenuPanel = 'none' | 'global-tree' | 'character-tree' | 'settings';

interface GameStore {
  profile: ProfileV2;
  run: RunStateV2 | null;
  savedRunAvailable: boolean;
  settings: SettingsV2;
  menuPanel: MenuPanel;
  lastSettlement: SettlementBreakdown | null;
  startRun(seed?: number): void;
  continueRun(): void;
  chooseRoute(route: RouteOption): void;
  finishCombat(result: CombatResult, boss: boolean): void;
  claimReward(item: RewardItem, target: EquipTarget): void;
  rerollReward(): void;
  buyShopItem(offerId: string, target: EquipTarget): void;
  rerollShop(): void;
  healAtShop(): void;
  startBoss(): void;
  returnToMenu(): void;
  setMenuPanel(panel: MenuPanel): void;
  buyGlobalTalent(talentId: string): void;
  resetGlobalTree(): void;
  chooseCharacterTalent(talentId: string): void;
  resetCharacterTree(): void;
  updateSettings(patch: Partial<SettingsV2>): void;
  grantDebugProgress(): void;
}

const initialProfile = localStorageSaveAdapter.loadProfile();
const initialRun = localStorageSaveAdapter.loadRun();
const initialSettings = localStorageSaveAdapter.loadSettings();

export const useGameStore = create<GameStore>((set, get) => ({
  profile: initialProfile,
  run: null,
  savedRunAvailable: Boolean(initialRun),
  settings: initialSettings,
  menuPanel: 'none',
  lastSettlement: null,

  startRun(seed = Date.now() & 0xffff_ffff) {
    const profile = { ...get().profile, runsStarted: get().profile.runsStarted + 1 };
    const run = createRun(profile, seed);
    localStorageSaveAdapter.saveProfile(profile);
    localStorageSaveAdapter.saveRun(run);
    set({ profile, run, savedRunAvailable: true, menuPanel: 'none', lastSettlement: null });
  },

  continueRun() {
    const run = localStorageSaveAdapter.loadRun();
    if (run) set({ run, savedRunAvailable: true, menuPanel: 'none' });
  },

  chooseRoute(route) {
    const run = get().run;
    if (!run || run.screen !== 'route') return;
    persistRun(set, { ...run, currentRoute: route, screen: 'combat' });
  },

  finishCombat(result, boss) {
    const { run, profile } = get();
    if (!run || run.screen !== 'combat') return;
    const modifiers = getCombatModifiers(profile, run.relics);
    const next = structuredClone(run);
    next.hp = Math.max(0, result.hp);
    next.shield = Math.max(0, result.shield);
    next.lethalGuardAvailable = result.lethalGuardAvailable;
    next.report.activeCombatMs += result.durationMs;
    next.report.damageTaken += result.damageTaken;
    next.report.combatScore += result.combatScore;

    if (!result.won) {
      settle(set, get, { ...next, screen: 'settlement', outcome: 'defeat' });
      return;
    }

    if (boss) {
      next.report.bossReached = true;
      next.report.bossDefeated = true;
      next.outcome = 'victory';
      settle(set, get, { ...next, screen: 'settlement' });
      return;
    }

    next.report.roomsCleared += 1;
    if (next.currentRoute?.elite) next.report.elitesDefeated += 1;
    const healed = healAfterRoom(next, modifiers);

    if (healed.currentRoute?.category === 'gold') {
      healed.gold += 60 + healed.roomIndex * 10;
      healed.report.rewardsTaken += 1;
      persistRun(set, advanceAfterReward(healed, profile));
      return;
    }

    const category = healed.currentRoute?.elite
      ? rollEliteRewardCategory(healed.seed, healed.roomIndex)
      : healed.currentRoute?.category;
    if (!category || category === 'elite') return;
    const useFourChoices = profile.globalTalents.includes('fortune-four') && !healed.fourChoiceUsed;
    healed.rewardCategory = category;
    healed.rewardOffers = generateRewardOffers({
      seed: healed.seed,
      roomIndex: healed.roomIndex,
      category,
      elite: healed.currentRoute?.elite ?? false,
      count: useFourChoices ? 4 : 3,
      currentTags: currentBuildTags(healed),
      modifiers,
    });
    healed.fourChoiceUsed ||= useFourChoices;
    healed.screen = 'reward';
    persistRun(set, healed);
  },

  claimReward(item, target) {
    const { run, profile } = get();
    if (!run || run.screen !== 'reward') return;
    const modifiers = getCombatModifiers(profile, run.relics);
    const equipped = equipReward(run, item, target, modifiers);
    persistRun(set, advanceAfterReward(equipped, profile));
  },

  rerollReward() {
    const { run, profile } = get();
    if (!run || run.screen !== 'reward' || !run.rewardCategory) return;
    if (!profile.globalTalents.includes('fortune-reroll') || run.chestRerollUsed) return;
    const modifiers = getCombatModifiers(profile, run.relics);
    const next = {
      ...run,
      chestRerollUsed: true,
      rewardOffers: generateRewardOffers({
        seed: run.seed,
        roomIndex: run.roomIndex,
        category: run.rewardCategory,
        elite: run.currentRoute?.elite ?? false,
        count: run.rewardOffers.length,
        currentTags: currentBuildTags(run),
        modifiers,
        reroll: 1,
      }),
    };
    persistRun(set, next);
  },

  buyShopItem(offerId, target) {
    const { run, profile } = get();
    if (!run || run.screen !== 'shop') return;
    const offer = run.shopOffers.find((entry) => entry.id === offerId);
    if (!offer || offer.sold || run.gold < offer.price) return;
    const modifiers = getCombatModifiers(profile, run.relics);
    const equipped = equipReward(run, offer.item, target, modifiers);
    equipped.gold -= offer.price;
    equipped.shopOffers = equipped.shopOffers.map((entry) => (
      entry.id === offerId ? { ...entry, sold: true } : entry
    ));
    persistRun(set, equipped);
  },

  rerollShop() {
    const { run, profile } = get();
    if (!run || run.screen !== 'shop') return;
    const free = profile.globalTalents.includes('workshop-reroll') && !run.shopFreeRerollUsed;
    const price = free ? 0 : 20 + run.shopRerollCount * 5;
    if (run.gold < price) return;
    const modifiers = getCombatModifiers(profile, run.relics);
    const reroll = run.shopRerollCount + 1;
    const next = {
      ...run,
      gold: run.gold - price,
      shopRerollCount: reroll,
      shopFreeRerollUsed: run.shopFreeRerollUsed || free,
      shopOffers: generateShopOffers({
        seed: run.seed,
        reroll,
        extraSlot: profile.globalTalents.includes('workshop-slot'),
        modifiers,
      }),
    };
    persistRun(set, next);
  },

  healAtShop() {
    const { run, profile } = get();
    if (!run || run.screen !== 'shop' || run.hp >= run.maxHp) return;
    const modifiers = getCombatModifiers(profile, run.relics);
    const price = Math.max(1, Math.round(25 * (1 - modifiers.shopDiscount)));
    if (run.gold < price) return;
    persistRun(set, { ...run, gold: run.gold - price, hp: Math.min(run.maxHp, run.hp + 30) });
  },

  startBoss() {
    const run = get().run;
    if (!run || run.screen !== 'shop') return;
    persistRun(set, { ...run, screen: 'combat', currentRoute: null, report: { ...run.report, bossReached: true } });
  },

  returnToMenu() {
    localStorageSaveAdapter.saveRun(null);
    set({ run: null, savedRunAvailable: false, lastSettlement: null, menuPanel: 'none' });
  },

  setMenuPanel(menuPanel) {
    set({ menuPanel });
  },

  buyGlobalTalent(talentId) {
    const profile = purchaseGlobalTalent(get().profile, talentId);
    localStorageSaveAdapter.saveProfile(profile);
    set({ profile });
  },

  resetGlobalTree() {
    const profile = resetGlobalTalents(get().profile);
    localStorageSaveAdapter.saveProfile(profile);
    set({ profile });
  },

  chooseCharacterTalent(talentId) {
    const profile = selectCharacterTalent(get().profile, talentId);
    localStorageSaveAdapter.saveProfile(profile);
    set({ profile });
  },

  resetCharacterTree() {
    const profile = resetCharacterTalents(get().profile);
    localStorageSaveAdapter.saveProfile(profile);
    set({ profile });
  },

  updateSettings(patch) {
    const settings = { ...get().settings, ...patch };
    localStorageSaveAdapter.saveSettings(settings);
    set({ settings });
  },

  grantDebugProgress() {
    if (!new URLSearchParams(window.location.search).has('debug')) return;
    const profile = structuredClone(get().profile);
    profile.accountAvailablePoints += 15;
    profile.accountTotalPoints += 15;
    profile.characters.artificer.availablePoints += 15;
    profile.characters.artificer.totalPoints += 15;
    localStorageSaveAdapter.saveProfile(profile);
    set({ profile });
  },
}));

function advanceAfterReward(run: RunStateV2, profile: ProfileV2): RunStateV2 {
  const next = structuredClone(run);
  next.roomIndex += 1;
  next.currentRoute = null;
  next.rewardCategory = null;
  next.rewardOffers = [];
  if (next.roomIndex >= 3) {
    const modifiers = getCombatModifiers(profile, next.relics);
    next.screen = 'shop';
    next.shopOffers = generateShopOffers({
      seed: next.seed,
      reroll: next.shopRerollCount,
      extraSlot: profile.globalTalents.includes('workshop-slot'),
      modifiers,
    });
  } else {
    next.screen = 'route';
    next.routeChoices = generateRouteChoices(next.seed, next.roomIndex, next.report.elitesDefeated === 0);
  }
  return next;
}

function settle(
  set: (partial: Partial<GameStore>) => void,
  get: () => GameStore,
  run: RunStateV2,
): void {
  const breakdown = calculateSettlement(run.report);
  const profileBefore = get().profile;
  const profile = grantSettlementXp(profileBefore, breakdown);
  if (run.outcome === 'victory') profile.victories += 1;
  const settledRun = {
    ...run,
    accountXpEarned: breakdown.total,
    characterXpEarned: breakdown.characterTotal,
    settlementApplied: true,
  };
  localStorageSaveAdapter.saveProfile(profile);
  localStorageSaveAdapter.saveRun(settledRun);
  set({ profile, run: settledRun, lastSettlement: breakdown });
}

function persistRun(set: (partial: Partial<GameStore>) => void, run: RunStateV2): void {
  localStorageSaveAdapter.saveRun(run);
  set({ run, savedRunAvailable: true });
}
