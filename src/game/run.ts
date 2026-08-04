import { ITEM_BY_ID } from './content';
import { getCharacterCombatTalents, getCombatModifiers } from './progression';
import { generateRouteChoices, getDismantleValue, getItemDefinition } from './rewards';
import type {
  BuildTag,
  CombatModifiers,
  EncounterConfig,
  EquippedWeapon,
  ProfileV2,
  RewardItem,
  RunStateV2,
} from './types';

export interface EquipTarget {
  weaponSlot?: 0 | 1;
  relicSlot?: number;
  arcanaSlot?: number;
}

export function createRun(profile: ProfileV2, seed: number): RunStateV2 {
  const modifiers = getCombatModifiers(profile);
  const maxHp = 100 + modifiers.maxHpBonus;
  const starterPrimary = createItem('weapon', 'starter-repeater', 'common', `starter-primary-${seed}`);
  const starterSecondary = createItem('weapon', 'starter-handcannon', 'common', `starter-secondary-${seed}`);

  return {
    version: 3,
    seed,
    phase: 'route',
    roomIndex: 0,
    currentRoute: null,
    routeChoices: generateRouteChoices(seed, 0),
    chest: null,
    selectedLootId: null,
    chestRerollUsed: false,
    fourChoiceUsed: false,
    hp: maxHp,
    maxHp,
    shield: modifiers.startingShield,
    gold: 65 + modifiers.startingGold,
    weapons: [emptyWeapon(starterPrimary), emptyWeapon(starterSecondary)],
    activeWeapon: 0,
    relics: [],
    arcana: [],
    temporaryEffects: [],
    report: {
      roomsCleared: 0,
      elitesDefeated: 0,
      rewardsTaken: 0,
      bossReached: false,
      bossDefeated: false,
      combatScore: 0,
      activeCombatMs: 0,
      damageTaken: 0,
    },
    startedAt: Date.now(),
    outcome: null,
    accountXpEarned: 0,
    characterXpEarned: 0,
    settlementApplied: false,
    lethalGuardAvailable: profile.globalTalents.includes('survival-lethal'),
  };
}

export function createEncounterConfig(
  run: RunStateV2,
  profile: ProfileV2,
  options: { boss?: boolean; debugFast?: boolean; stressTest?: boolean } = {},
): EncounterConfig {
  const modifiers = getCombatModifiers(profile, run.relics);
  const boss = options.boss ?? false;
  return {
    id: boss ? `boss-${run.seed}` : `room-${run.roomIndex}-${run.currentRoute?.id ?? 'unknown'}`,
    seed: run.seed,
    roomIndex: run.roomIndex,
    elite: run.currentRoute?.elite ?? false,
    boss,
    hp: run.hp,
    maxHp: run.maxHp,
    shield: run.shield + relicStartingShield(run.relics),
    weapons: structuredClone(run.weapons),
    activeWeapon: run.activeWeapon,
    relics: structuredClone(run.relics),
    combatModifiers: modifiers,
    characterTalents: getCharacterCombatTalents(profile),
    lethalGuardAvailable: run.lethalGuardAvailable,
    debugFast: options.debugFast,
    stressTest: options.stressTest,
  };
}

export function equipReward(
  run: RunStateV2,
  item: RewardItem,
  target: EquipTarget,
  modifiers: CombatModifiers,
): RunStateV2 {
  const next = structuredClone(run);
  const weaponSlot = target.weaponSlot ?? 0;
  let replaced: RewardItem | null = null;

  if (item.kind === 'weapon') {
    replaced = next.weapons[weaponSlot].weapon;
    next.weapons[weaponSlot].weapon = item;
  } else if (item.kind === 'muzzle') {
    replaced = next.weapons[weaponSlot].muzzle;
    next.weapons[weaponSlot].muzzle = item;
  } else if (item.kind === 'core') {
    replaced = next.weapons[weaponSlot].core;
    next.weapons[weaponSlot].core = item;
  } else if (item.kind === 'relic') {
    if (next.relics.length < 8) next.relics.push(item);
    else {
      const relicSlot = target.relicSlot ?? 0;
      replaced = next.relics[relicSlot] ?? null;
      next.relics[relicSlot] = item;
    }
  } else if (item.kind === 'arcana') {
    if (next.arcana.length < 5) next.arcana.push(item);
    else {
      const arcanaSlot = target.arcanaSlot ?? 0;
      replaced = next.arcana[arcanaSlot] ?? null;
      next.arcana[arcanaSlot] = item;
    }
  }

  if (replaced && !replaced.uid.startsWith('starter-')) {
    next.gold += getDismantleValue(replaced, modifiers.dismantleRatio);
  }
  next.report.rewardsTaken += 1;
  return next;
}

export function currentBuildTags(run: RunStateV2): BuildTag[] {
  const items = [
    ...run.weapons.flatMap((slot) => [slot.weapon, slot.muzzle, slot.core]),
    ...run.relics,
    ...run.arcana,
  ].filter((item): item is RewardItem => Boolean(item));
  return items.map((item) => getItemDefinition(item).tag);
}

export function healAfterRoom(run: RunStateV2, modifiers: CombatModifiers): RunStateV2 {
  if (modifiers.roomHeal <= 0) return run;
  return { ...run, hp: Math.min(run.maxHp, run.hp + modifiers.roomHeal) };
}

export function getEquippedDefinition(slot: EquippedWeapon) {
  const weapon = ITEM_BY_ID.get(slot.weapon.definitionId);
  if (!weapon || weapon.kind !== 'weapon') throw new Error(`Invalid weapon: ${slot.weapon.definitionId}`);
  return weapon;
}

function emptyWeapon(weapon: RewardItem): EquippedWeapon {
  return { weapon, muzzle: null, core: null };
}

function createItem(
  kind: RewardItem['kind'],
  definitionId: string,
  rarity: RewardItem['rarity'],
  uid: string,
): RewardItem {
  return { kind, definitionId, rarity, uid };
}

function relicStartingShield(relics: RewardItem[]): number {
  return relics.reduce((sum, item) => {
    const definition = ITEM_BY_ID.get(item.definitionId);
    return definition?.kind === 'relic' ? sum + (definition.modifiers.startingShield ?? 0) : sum;
  }, 0);
}
