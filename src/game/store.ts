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
  generateBossDrops,
  generateChestDrops,
  generateRouteChoices,
  generateShopOffers,
  getDismantleValue,
} from './rewards';
import {
  createEliteObjective,
  createRun,
  currentBuildTags,
  equipReward,
  healAfterRoom,
  type EquipTarget,
} from './run';
import type {
  CombatResult,
  GameMode,
  ProfileV2,
  RewardItem,
  RunStateV2,
  SettingsV2,
  ShopAction,
  SettlementBreakdown,
  WorldOverlay,
} from './types';

export type MenuPanel = 'none' | 'global-tree' | 'character-tree' | 'settings';

interface GameStore {
  profile: ProfileV2;
  run: RunStateV2 | null;
  savedRunAvailable: boolean;
  settings: SettingsV2;
  gameMode: GameMode;
  overlay: WorldOverlay;
  menuPanel: MenuPanel;
  lastSettlement: SettlementBreakdown | null;
  enterWorkshop(): void;
  startRun(seed?: number): void;
  continueRun(): void;
  chooseRoute(routeId: string): void;
  finishCombat(result: CombatResult): void;
  openChest(): void;
  rerollChest(): void;
  selectLoot(dropId: string | null): void;
  setActiveWeapon(weaponIndex: 0 | 1): void;
  resolveLoot(dropId: string, resolution: 'equip' | 'dismantle', target?: EquipTarget): void;
  selectShopOffer(offerId: string | null): void;
  buyShopOffer(offerId: string, target?: EquipTarget): void;
  useShopAction(action: ShopAction): void;
  dismantleEquipped(target: { kind: 'muzzle' | 'core' | 'relic' | 'arcana'; weaponSlot?: 0 | 1; slot?: number }): void;
  abandonRun(): void;
  returnToWorkshop(): void;
  returnToTitle(): void;
  setOverlay(overlay: WorldOverlay): void;
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
  gameMode: !initialRun && initialSettings.resumeWorkshop ? 'workshop' : 'title',
  overlay: 'none',
  menuPanel: 'none',
  lastSettlement: null,

  enterWorkshop() {
    const settings = { ...get().settings, resumeWorkshop: true };
    localStorageSaveAdapter.saveSettings(settings);
    set({ settings, gameMode: 'workshop', run: null, overlay: 'none', menuPanel: 'none', lastSettlement: null });
  },

  startRun(seed = Date.now() & 0xffff_ffff) {
    const profile = { ...get().profile, runsStarted: get().profile.runsStarted + 1 };
    const run = createRun(profile, seed);
    localStorageSaveAdapter.saveProfile(profile);
    localStorageSaveAdapter.saveRun(run);
    set({ profile, run, gameMode: 'run', savedRunAvailable: true, overlay: 'none', menuPanel: 'none', lastSettlement: null });
  },

  continueRun() {
    const run = localStorageSaveAdapter.loadRun();
    if (run) set({
      run,
      gameMode: run.settlementApplied ? 'settlement' : 'run',
      savedRunAvailable: true,
      overlay: 'none',
      menuPanel: 'none',
      lastSettlement: run.settlementApplied ? calculateSettlement(run.report) : null,
    });
  },

  chooseRoute(routeId) {
    const run = get().run;
    if (!run || run.phase !== 'route') return;
    const route = run.routeChoices.find((entry) => entry.id === routeId);
    if (!route) return;
    persistRun(set, {
      ...run,
      currentRoute: route,
      phase: 'combat',
      chest: null,
      selectedLootId: null,
      selectedShopOfferId: null,
      eliteObjective: route.elite ? createEliteObjective(run.seed, run.roomIndex) : null,
    });
  },

  finishCombat(result) {
    const { run, profile } = get();
    if (!run || (run.phase !== 'combat' && run.phase !== 'boss')) return;
    const next = structuredClone(run);
    next.hp = Math.max(0, result.hp);
    next.shield = Math.max(0, result.shield);
    next.lethalGuardAvailable = result.lethalGuardAvailable;
    next.activeWeapon = result.activeWeapon;
    next.report.activeCombatMs += result.durationMs;
    next.report.damageTaken += result.damageTaken;
    next.report.combatScore += result.combatScore;
    next.eliteObjective = result.eliteObjective ? structuredClone(result.eliteObjective) : next.eliteObjective;

    if (!result.won) {
      settle(set, get, { ...next, outcome: 'defeat' });
      return;
    }

    if (run.phase === 'boss') {
      next.report.bossDefeated = true;
      const modifiers = getCombatModifiers(profile, next.relics);
      next.chest = {
        id: `boss-chest-${next.seed}`,
        tier: 'boss',
        stage: 'landed',
        rerolled: false,
        extraDrop: false,
        drops: generateBossDrops({
          seed: next.seed,
          modifiers,
          excludedArcanaIds: next.arcana.map((item) => item.definitionId),
        }),
      };
      next.phase = 'chest';
      next.currentRoute = null;
      next.eliteObjective = null;
      next.selectedLootId = null;
      persistRun(set, next);
      return;
    }

    next.report.roomsCleared += 1;
    if (next.currentRoute?.elite) next.report.elitesDefeated += 1;
    const modifiers = getCombatModifiers(profile, next.relics);
    const healed = healAfterRoom(next, modifiers);
    const category = healed.currentRoute?.category ?? 'gold';
    const extraDrop = profile.globalTalents.includes('fortune-four') && !healed.extraDropUsed;
    const objectiveBonus = Boolean(healed.currentRoute?.elite && healed.eliteObjective?.completed && !healed.eliteObjective.failed);
    healed.chest = {
      id: `chest-${healed.seed}-${healed.roomIndex}`,
      tier: healed.currentRoute?.elite ? 'elite' : 'normal',
      stage: 'landed',
      rerolled: false,
      extraDrop,
      drops: generateChestDrops({
        seed: healed.seed,
        roomIndex: healed.roomIndex,
        category,
        elite: healed.currentRoute?.elite ?? false,
        currentTags: currentBuildTags(healed),
        modifiers,
        extraDrop,
        objectiveBonus,
        excludedDefinitionIds: healed.arcana.map((item) => item.definitionId),
      }),
    };
    healed.extraDropUsed ||= extraDrop;
    healed.phase = 'chest';
    healed.selectedLootId = null;
    persistRun(set, healed);
  },

  openChest() {
    const { run, profile } = get();
    if (!run || run.phase !== 'chest' || !run.chest) return;
    const nextRun = {
      ...run,
      phase: 'loot',
      chest: { ...run.chest, stage: 'opened' },
    } as RunStateV2;
    const revealedIds = run.chest.drops.flatMap((drop) => drop.item ? [drop.item.definitionId] : []);
    nextRun.newlyDiscoveredItemIds = mergeNewDiscoveries(nextRun.newlyDiscoveredItemIds, profile, revealedIds);
    const nextProfile = discoverItems(profile, revealedIds);
    persistProfileAndRun(set, nextProfile, nextRun);
  },

  rerollChest() {
    const { run, profile } = get();
    if (!run || run.phase !== 'loot' || !run.chest || run.chestRerollUsed) return;
    if (!profile.globalTalents.includes('fortune-reroll') || run.chest.drops.some((drop) => drop.resolved)) return;
    const modifiers = getCombatModifiers(profile, run.relics);
    const category = run.currentRoute?.category ?? 'gold';
    persistRun(set, {
      ...run,
      phase: 'chest',
      chestRerollUsed: true,
      selectedLootId: null,
      chest: {
        ...run.chest,
        id: `${run.chest.id}-reroll`,
        stage: 'landed',
        rerolled: true,
        drops: generateChestDrops({
          seed: run.seed,
          roomIndex: run.roomIndex,
          category,
          elite: run.currentRoute?.elite ?? false,
          currentTags: currentBuildTags(run),
          modifiers,
          extraDrop: run.chest.extraDrop,
          objectiveBonus: Boolean(run.currentRoute?.elite && run.eliteObjective?.completed && !run.eliteObjective.failed),
          reroll: 1,
          excludedDefinitionIds: run.arcana.map((item) => item.definitionId),
        }),
      },
    });
  },

  selectLoot(dropId) {
    const run = get().run;
    if (!run || run.phase !== 'loot') return;
    if (dropId && !run.chest?.drops.some((drop) => drop.id === dropId && !drop.resolved)) return;
    persistRun(set, { ...run, selectedLootId: dropId });
  },

  setActiveWeapon(activeWeapon) {
    const run = get().run;
    if (!run || run.phase === 'combat' || run.activeWeapon === activeWeapon) return;
    persistRun(set, { ...run, activeWeapon });
  },

  resolveLoot(dropId, resolution, target = {}) {
    const { run, profile } = get();
    if (!run || run.phase !== 'loot' || !run.chest) return;
    const drop = run.chest.drops.find((entry) => entry.id === dropId);
    if (!drop || drop.resolved) return;
    const modifiers = getCombatModifiers(profile, run.relics);
    let next = structuredClone(run);

    if (drop.item) {
      if (resolution === 'equip' && drop.item.kind === 'arcana'
        && next.arcana.some((item) => item.definitionId === drop.item?.definitionId)) return;
      if (resolution === 'equip') next = equipReward(next, drop.item, target, modifiers);
      else {
        next.gold += getDismantleValue(drop.item, modifiers.dismantleRatio);
        next.report.rewardsTaken += 1;
      }
    } else {
      next.gold += drop.gold;
      next.report.rewardsTaken += 1;
    }

    const resolvedDrop = next.chest?.drops.find((entry) => entry.id === dropId);
    if (!resolvedDrop || !next.chest) return;
    resolvedDrop.resolved = true;
    resolvedDrop.resolution = drop.item ? (resolution === 'equip' ? 'equipped' : 'dismantled') : 'collected';
    next.lootHistory.push(structuredClone(resolvedDrop));
    next.selectedLootId = null;

    if (next.chest.drops.every((entry) => entry.resolved)) {
      if (next.chest.tier === 'boss') {
        settle(set, get, { ...next, outcome: 'victory' });
        return;
      }
      next = advanceAfterLoot(next, profile);
      const offerIds = next.shop?.offers.map((offer) => offer.item.definitionId) ?? [];
      next.newlyDiscoveredItemIds = mergeNewDiscoveries(next.newlyDiscoveredItemIds, profile, offerIds);
      const discovered = discoverItems(profile, offerIds);
      persistProfileAndRun(set, discovered, next);
      return;
    }
    persistRun(set, next);
  },

  selectShopOffer(offerId) {
    const run = get().run;
    if (!run || run.phase !== 'shop' || !run.shop) return;
    if (offerId && !run.shop.offers.some((offer) => offer.id === offerId && !offer.sold)) return;
    persistRun(set, { ...run, selectedShopOfferId: offerId });
  },

  buyShopOffer(offerId, target = {}) {
    const { run, profile } = get();
    if (!run || run.phase !== 'shop' || !run.shop) return;
    const offer = run.shop.offers.find((entry) => entry.id === offerId);
    if (!offer || offer.sold || run.gold < offer.price) return;
    if (offer.item.kind === 'arcana' && run.arcana.some((item) => item.definitionId === offer.item.definitionId)) return;
    const modifiers = getCombatModifiers(profile, run.relics);
    const next = equipReward({ ...structuredClone(run), gold: run.gold - offer.price }, offer.item, target, modifiers, false);
    const purchased = next.shop?.offers.find((entry) => entry.id === offerId);
    if (!purchased || !next.shop) return;
    purchased.sold = true;
    next.selectedShopOfferId = null;
    const discovered = discoverItems(profile, [offer.item.definitionId]);
    persistProfileAndRun(set, discovered, next);
  },

  useShopAction(action) {
    const { run, profile } = get();
    if (!run || run.phase !== 'shop' || !run.shop) return;
    if (action === 'start-boss') {
      persistRun(set, {
        ...run,
        phase: 'boss',
        currentRoute: null,
        eliteObjective: null,
        selectedShopOfferId: null,
        report: { ...run.report, bossReached: true },
      });
      return;
    }
    if (action === 'heal') {
      const cost = 30;
      if (run.shop.healPurchased || run.gold < cost || run.hp >= run.maxHp) return;
      persistRun(set, {
        ...run,
        gold: run.gold - cost,
        hp: Math.min(run.maxHp, run.hp + Math.max(35, Math.ceil(run.maxHp * 0.35))),
        shop: { ...run.shop, healPurchased: true },
      });
      return;
    }
    const cost = run.shop.freeReroll ? 0 : 30;
    if (run.shop.rerollUsed || run.gold < cost) return;
    const modifiers = getCombatModifiers(profile, run.relics);
    const offers = generateShopOffers({
      seed: run.seed,
      reroll: run.shop.rerollCount + 1,
      extraSlot: profile.globalTalents.includes('workshop-slot'),
      modifiers,
    });
    const next = {
      ...run,
      gold: run.gold - cost,
      selectedShopOfferId: null,
      shop: {
        ...run.shop,
        offers,
        rerollCount: run.shop.rerollCount + 1,
        rerollUsed: true,
        freeReroll: false,
      },
    };
    next.newlyDiscoveredItemIds = mergeNewDiscoveries(next.newlyDiscoveredItemIds, profile, offers.map((offer) => offer.item.definitionId));
    const discovered = discoverItems(profile, offers.map((offer) => offer.item.definitionId));
    persistProfileAndRun(set, discovered, next);
  },

  dismantleEquipped(target) {
    const { run, profile } = get();
    if (!run || run.phase === 'combat' || run.phase === 'boss') return;
    const next = structuredClone(run);
    let item: RewardItem | null = null;
    if (target.kind === 'muzzle' || target.kind === 'core') {
      const weaponSlot = target.weaponSlot ?? 0;
      item = next.weapons[weaponSlot][target.kind];
      next.weapons[weaponSlot][target.kind] = null;
    } else if (target.kind === 'relic') item = next.relics.splice(target.slot ?? 0, 1)[0] ?? null;
    else item = next.arcana.splice(target.slot ?? 0, 1)[0] ?? null;
    if (!item) return;
    const modifiers = getCombatModifiers(profile, run.relics);
    next.gold += getDismantleValue(item, modifiers.dismantleRatio);
    persistRun(set, next);
  },

  abandonRun() {
    const run = get().run;
    if (!run) return;
    settle(set, get, { ...run, outcome: 'defeat' });
  },

  returnToWorkshop() {
    const settings = { ...get().settings, resumeWorkshop: true };
    localStorageSaveAdapter.saveRun(null);
    localStorageSaveAdapter.saveSettings(settings);
    set({ settings, run: null, gameMode: 'workshop', savedRunAvailable: false, overlay: 'none', lastSettlement: null });
  },

  returnToTitle() {
    const settings = { ...get().settings, resumeWorkshop: false };
    localStorageSaveAdapter.saveSettings(settings);
    set({ settings, gameMode: 'title', run: null, overlay: 'none', menuPanel: 'none', lastSettlement: null });
  },

  setOverlay(overlay) {
    set({ overlay });
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

function advanceAfterLoot(run: RunStateV2, profile: ProfileV2): RunStateV2 {
  const next = structuredClone(run);
  next.roomIndex += 1;
  next.currentRoute = null;
  next.chest = null;
  next.selectedLootId = null;
  next.eliteObjective = null;
  if (next.roomIndex >= 3) {
    const modifiers = getCombatModifiers(profile, next.relics);
    next.phase = 'shop';
    next.routeChoices = [];
    next.shop = {
      offers: generateShopOffers({
        seed: next.seed,
        reroll: 0,
        extraSlot: profile.globalTalents.includes('workshop-slot'),
        modifiers,
      }),
      rerollCount: 0,
      rerollUsed: false,
      freeReroll: profile.globalTalents.includes('workshop-reroll'),
      healPurchased: false,
    };
  } else {
    next.phase = 'route';
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
  const sourceProfile = run.outcome === 'victory'
    ? { ...get().profile, victories: get().profile.victories + 1 }
    : get().profile;
  const profile = grantSettlementXp(sourceProfile, breakdown);
  const settledRun = {
    ...run,
    accountXpEarned: breakdown.total,
    characterXpEarned: breakdown.characterTotal,
    settlementApplied: true,
  };
  localStorageSaveAdapter.saveProfile(profile);
  localStorageSaveAdapter.saveRun(settledRun);
  set({ profile, run: settledRun, gameMode: 'settlement', overlay: 'none', lastSettlement: breakdown });
}

function persistRun(set: (partial: Partial<GameStore>) => void, run: RunStateV2): void {
  localStorageSaveAdapter.saveRun(run);
  set({ run, gameMode: 'run', savedRunAvailable: true });
}

function persistProfileAndRun(
  set: (partial: Partial<GameStore>) => void,
  profile: ProfileV2,
  run: RunStateV2,
): void {
  localStorageSaveAdapter.saveProfile(profile);
  localStorageSaveAdapter.saveRun(run);
  set({ profile, run, gameMode: 'run', savedRunAvailable: true });
}

function discoverItems(profile: ProfileV2, definitionIds: string[]): ProfileV2 {
  const discovered = new Set(profile.discoveredItemIds);
  for (const definitionId of definitionIds) discovered.add(definitionId);
  if (discovered.size === profile.discoveredItemIds.length) return profile;
  return { ...profile, discoveredItemIds: [...discovered] };
}

function mergeNewDiscoveries(current: string[], profile: ProfileV2, definitionIds: string[]): string[] {
  const knownBeforeRun = new Set(profile.discoveredItemIds);
  const next = new Set(current);
  for (const definitionId of definitionIds) {
    if (!knownBeforeRun.has(definitionId)) next.add(definitionId);
  }
  return [...next];
}
