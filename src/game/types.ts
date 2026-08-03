export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export type BuildTag = 'arc' | 'blast' | 'frost' | 'neutral';

export type ItemKind = 'weapon' | 'muzzle' | 'core' | 'relic';

export type RewardCategory = ItemKind | 'gold' | 'elite';

export type RunScreen = 'route' | 'combat' | 'reward' | 'shop' | 'settlement';

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

export type ItemDefinition = WeaponDefinition | MuzzleDefinition | CoreDefinition | RelicDefinition;

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
  version: 2;
  seed: number;
  screen: RunScreen;
  roomIndex: number;
  currentRoute: RouteOption | null;
  routeChoices: RouteOption[];
  rewardCategory: ItemKind | null;
  rewardOffers: RewardItem[];
  shopOffers: ShopOffer[];
  shopRerollCount: number;
  shopFreeRerollUsed: boolean;
  chestRerollUsed: boolean;
  fourChoiceUsed: boolean;
  hp: number;
  maxHp: number;
  shield: number;
  gold: number;
  weapons: [EquippedWeapon, EquippedWeapon];
  relics: RewardItem[];
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
}

export interface CombatBridge {
  onHud(snapshot: CombatHudSnapshot): void;
  onEvent(event: CombatEvent): void;
  onResult(result: CombatResult): void;
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
