export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export type BuildTag = 'arc' | 'blast' | 'frost' | 'neutral';

export type ItemKind = 'weapon' | 'muzzle' | 'core' | 'relic' | 'arcana';

export type RewardCategory = ItemKind | 'gold' | 'elite';

export type GameMode = 'title' | 'workshop' | 'run' | 'settlement';

export type RunPhase = 'route' | 'combat' | 'chest' | 'loot' | 'prototype-complete';

export type WorldOverlay =
  | 'none'
  | 'pause'
  | 'character'
  | 'equipment'
  | 'stats'
  | 'codex'
  | 'settings';

export interface BaseItemDefinition {
  id: string;
  kind: ItemKind;
  name: string;
  description: string;
  tag: BuildTag;
  basePrice: number;
}

export interface WeaponDefinition extends BaseItemDefinition {
  kind: 'weapon';
  damage: number;
  fireRate: number;
  magazine: number;
  reloadMs: number;
  projectileSpeed: number;
  projectileRadius: number;
}

export interface MuzzleDefinition extends BaseItemDefinition {
  kind: 'muzzle';
  projectileCount?: number;
  spreadDeg?: number;
  pierce?: number;
  bounces?: number;
  explosionRadius?: number;
  damageMultiplier?: number;
}

export interface CoreDefinition extends BaseItemDefinition {
  kind: 'core';
  chainCount?: number;
  chainDamage?: number;
  burnDamage?: number;
  explosionRadius?: number;
  slowRatio?: number;
  freezeHits?: number;
}

export interface RelicDefinition extends BaseItemDefinition {
  kind: 'relic';
  modifiers: Partial<CombatModifiers>;
}

export interface ArcanaDefinition extends BaseItemDefinition {
  kind: 'arcana';
  rule: string;
}

export type ItemDefinition = WeaponDefinition | MuzzleDefinition | CoreDefinition | RelicDefinition | ArcanaDefinition;

export interface RewardItem {
  uid: string;
  kind: ItemKind;
  definitionId: string;
  rarity: Rarity;
}

export interface EquippedWeapon {
  weapon: RewardItem;
  muzzle: RewardItem | null;
  core: RewardItem | null;
}

export interface RouteOption {
  id: string;
  category: RewardCategory;
  elite: boolean;
}

export interface ShopOffer {
  id: string;
  item: RewardItem;
  price: number;
  sold: boolean;
}

export type ChestTier = 'normal' | 'elite' | 'boss';

export type ChestAnimationStage = 'landed' | 'unlocking' | 'opening' | 'opened';

export interface LootDrop {
  id: string;
  item: RewardItem | null;
  gold: number;
  worldX: number;
  worldY: number;
  resolved: boolean;
  resolution: 'equipped' | 'dismantled' | 'collected' | null;
}

export interface ChestState {
  id: string;
  tier: ChestTier;
  stage: ChestAnimationStage;
  drops: LootDrop[];
  rerolled: boolean;
}

export interface RunReport {
  roomsCleared: number;
  elitesDefeated: number;
  rewardsTaken: number;
  bossReached: boolean;
  bossDefeated: boolean;
  combatScore: number;
  activeCombatMs: number;
  damageTaken: number;
}

export interface RunStateV2 {
  version: 3;
  seed: number;
  phase: RunPhase;
  roomIndex: number;
  currentRoute: RouteOption | null;
  routeChoices: RouteOption[];
  chest: ChestState | null;
  selectedLootId: string | null;
  chestRerollUsed: boolean;
  fourChoiceUsed: boolean;
  hp: number;
  maxHp: number;
  shield: number;
  gold: number;
  weapons: [EquippedWeapon, EquippedWeapon];
  activeWeapon: 0 | 1;
  relics: RewardItem[];
  arcana: RewardItem[];
  temporaryEffects: Array<{ id: string; name: string; remainingMs: number }>;
  report: RunReport;
  startedAt: number;
  outcome: 'victory' | 'defeat' | null;
  accountXpEarned: number;
  characterXpEarned: number;
  settlementApplied: boolean;
  lethalGuardAvailable: boolean;
}

export interface CharacterProgress {
  xp: number;
  totalPoints: number;
  availablePoints: number;
  selections: Record<string, string>;
}

export interface ProfileV2 {
  version: 2;
  accountXp: number;
  accountTotalPoints: number;
  accountAvailablePoints: number;
  globalTalents: string[];
  characters: Record<'artificer', CharacterProgress>;
  runsStarted: number;
  victories: number;
}

export interface SettingsV2 {
  version: 2;
  masterVolume: number;
  reducedMotion: boolean;
  showDamageNumbers: boolean;
}

export interface CombatModifiers {
  damageMultiplier: number;
  fireRateMultiplier: number;
  reloadMultiplier: number;
  moveSpeedMultiplier: number;
  projectileSpeedMultiplier: number;
  critChance: number;
  critMultiplier: number;
  maxHpBonus: number;
  startingShield: number;
  dashCooldownMultiplier: number;
  roomHeal: number;
  startingGold: number;
  shopDiscount: number;
  dismantleRatio: number;
  rareWeightBonus: number;
  epicEliteBonus: number;
  legendaryWeightBonus: number;
}

export interface CharacterCombatTalents {
  overclockFireRateBonus: number;
  overclockMoveBonus: number;
  overclockReloadBonus: number;
  overclockDurationMs: number;
  overclockCooldownMs: number;
  overclockInstantReload: boolean;
  overclockSwitchDamageBonus: number;
  overclockSwitchDamageMs: number;
  overclockRedline: boolean;
  deflectionCooldownMs: number;
  deflectionShield: number;
  deflectionHeal: number;
  deflectionCharges: number;
  deflectionReducesOverclockMs: number;
  overclockReducesDeflectionMs: number;
  deflectionTriggersOverclockMs: number;
}

export interface EncounterConfig {
  id: string;
  seed: number;
  roomIndex: number;
  elite: boolean;
  boss: boolean;
  hp: number;
  maxHp: number;
  shield: number;
  weapons: [EquippedWeapon, EquippedWeapon];
  activeWeapon: 0 | 1;
  relics: RewardItem[];
  combatModifiers: CombatModifiers;
  characterTalents: CharacterCombatTalents;
  lethalGuardAvailable: boolean;
  debugFast?: boolean;
  stressTest?: boolean;
}

export interface WeaponHudState {
  name: string;
  ammo: number;
  magazine: number;
  reloading: boolean;
  reloadProgress: number;
  rarity: Rarity;
  tag: BuildTag;
}

export interface CombatHudSnapshot {
  hp: number;
  maxHp: number;
  shield: number;
  activeWeapon: 0 | 1;
  weapons: [WeaponHudState, WeaponHudState];
  overclockRemainingMs: number;
  overclockCooldownMs: number;
  deflectionCharges: number;
  deflectionCooldownMs: number;
  dashCooldownMs: number;
  enemiesRemaining: number;
  projectilesActive: number;
  elapsedMs: number;
  bossHp: number | null;
  bossMaxHp: number | null;
  paused: boolean;
  fps: number;
}

export interface CombatResult {
  won: boolean;
  hp: number;
  shield: number;
  durationMs: number;
  damageTaken: number;
  combatScore: number;
  lethalGuardAvailable: boolean;
  activeWeapon: 0 | 1;
}

export interface CombatBridge {
  onHud(snapshot: CombatHudSnapshot): void;
  onEvent(event: CombatEvent): void;
  onResult(result: CombatResult): void;
}

export interface WorldBridge {
  onInteraction(prompt: WorldInteraction | null): void;
  onRouteSelected(routeId: string): void;
  onStartRun(): void;
  onReturnToWorkshop(): void;
  onChestOpened(): void;
  onLootSelected(dropId: string): void;
  onWeaponSwapped(weaponIndex: 0 | 1): void;
  onOverlayRequested(overlay: Exclude<WorldOverlay, 'none'>): void;
  onMetaPanelRequested(panel: 'global-tree' | 'character-tree'): void;
}

export interface WorldInteraction {
  kind: 'station' | 'route' | 'chest' | 'loot' | 'exit';
  id: string;
  label: string;
  hint: string;
}

export interface DerivedWeaponStats {
  name: string;
  tag: BuildTag;
  damage: number;
  fireRate: number;
  magazine: number;
  reloadMs: number;
  sustainedDps: number;
  projectileSpeed: number;
  projectileCount: number;
  pierce: number;
  bounces: number;
  explosionRadius: number;
  element: BuildTag;
}

export interface DerivedStats {
  maxHp: number;
  startingShield: number;
  moveSpeed: number;
  dashCooldownMs: number;
  critChance: number;
  critMultiplier: number;
  overclockCooldownMs: number;
  deflectionCooldownMs: number;
  dismantleRatio: number;
  weapons: [DerivedWeaponStats, DerivedWeaponStats];
}

export type CombatEvent =
  | { type: 'shot-fired'; weaponIndex: 0 | 1 }
  | { type: 'weapon-swapped'; weaponIndex: 0 | 1 }
  | { type: 'reload-started'; weaponIndex: 0 | 1 }
  | { type: 'hit'; damage: number; critical: boolean }
  | { type: 'enemy-defeated'; enemyType: string }
  | { type: 'damage-prevented' }
  | { type: 'overclock-started' };

export interface GlobalTalentDefinition {
  id: string;
  branch: 'survival' | 'workshop' | 'fortune';
  tier: 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
  cost: number;
}

export interface CharacterTalentDefinition {
  id: string;
  tier: 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
  cost: number;
}

export interface SettlementBreakdown {
  roomXp: number;
  eliteXp: number;
  bossReachXp: number;
  bossVictoryXp: number;
  rewardXp: number;
  combatXp: number;
  efficiencyXp: number;
  total: number;
  characterTotal: number;
}
