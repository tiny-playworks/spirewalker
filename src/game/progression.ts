import { CHARACTER_TALENTS, GLOBAL_TALENTS, RARITY_MULTIPLIER, RELICS } from './content';
import type {
  CharacterCombatTalents,
  CombatModifiers,
  ProfileV2,
  RewardItem,
  RunReport,
  SettlementBreakdown,
} from './types';

const DEFAULT_MODIFIERS: CombatModifiers = {
  damageMultiplier: 1,
  fireRateMultiplier: 1,
  reloadMultiplier: 1,
  moveSpeedMultiplier: 1,
  projectileSpeedMultiplier: 1,
  critChance: 0.05,
  critMultiplier: 1.6,
  maxHpBonus: 0,
  startingShield: 0,
  dashCooldownMultiplier: 1,
  roomHeal: 0,
  startingGold: 0,
  shopDiscount: 0,
  dismantleRatio: 0.25,
  rareWeightBonus: 0,
  epicEliteBonus: 0,
  legendaryWeightBonus: 0,
};

const DEFAULT_CHARACTER_TALENTS: CharacterCombatTalents = {
  overclockFireRateBonus: 0,
  overclockMoveBonus: 0,
  overclockReloadBonus: 0,
  overclockDurationMs: 6_000,
  overclockCooldownMs: 28_000,
  overclockInstantReload: false,
  overclockSwitchDamageBonus: 0,
  overclockSwitchDamageMs: 0,
  overclockRedline: false,
  deflectionCooldownMs: 60_000,
  deflectionShield: 0,
  deflectionHeal: 0,
  deflectionCharges: 1,
  deflectionReducesOverclockMs: 0,
  overclockReducesDeflectionMs: 0,
  deflectionTriggersOverclockMs: 0,
};

export function createDefaultProfile(): ProfileV2 {
  return {
    version: 2,
    accountXp: 0,
    accountTotalPoints: 0,
    accountAvailablePoints: 0,
    globalTalents: [],
    characters: {
      artificer: {
        xp: 0,
        totalPoints: 0,
        availablePoints: 0,
        selections: {},
      },
    },
    runsStarted: 0,
    victories: 0,
  };
}

export function getCombatModifiers(profile: ProfileV2, relicItems: RewardItem[] = []): CombatModifiers {
  const result = { ...DEFAULT_MODIFIERS };
  const talents = new Set(profile.globalTalents);

  if (talents.has('survival-hp')) result.maxHpBonus += 5;
  if (talents.has('survival-shield')) result.startingShield += 8;
  if (talents.has('survival-dash')) result.dashCooldownMultiplier -= 0.05;
  if (talents.has('survival-heal')) result.roomHeal += 3;
  if (talents.has('workshop-gold')) result.startingGold += 10;
  if (talents.has('workshop-discount')) result.shopDiscount += 0.05;
  if (talents.has('workshop-salvage')) result.dismantleRatio = 0.35;
  if (talents.has('fortune-rare')) result.rareWeightBonus += 0.02;
  if (talents.has('fortune-elite')) result.epicEliteBonus += 0.05;
  if (talents.has('fortune-legendary')) result.legendaryWeightBonus += 0.01;

  for (const item of relicItems) {
    const definition = RELICS.find((entry) => entry.id === item.definitionId);
    if (!definition) continue;
    const rarityScale = 1 + (RARITY_MULTIPLIER[item.rarity] - 1) * 0.7;
    for (const [key, delta] of Object.entries(definition.modifiers)) {
      if (delta === undefined) continue;
      const typedKey = key as keyof CombatModifiers;
      result[typedKey] += delta * rarityScale;
    }
  }

  return result;
}

export function getCharacterCombatTalents(profile: ProfileV2): CharacterCombatTalents {
  const result = { ...DEFAULT_CHARACTER_TALENTS };
  const selected = new Set(Object.values(profile.characters.artificer.selections));

  if (selected.has('t1-fire')) result.overclockFireRateBonus += 0.15;
  if (selected.has('t1-move')) result.overclockMoveBonus += 0.1;
  if (selected.has('t1-reload')) result.overclockReloadBonus += 0.25;
  if (selected.has('t2-cooldown')) result.deflectionCooldownMs = 50_000;
  if (selected.has('t2-shield')) result.deflectionShield = 15;
  if (selected.has('t2-heal')) result.deflectionHeal = 5;
  if (selected.has('t3-duration')) result.overclockDurationMs += 2_000;
  if (selected.has('t3-reload')) result.overclockInstantReload = true;
  if (selected.has('t3-cooldown')) result.overclockCooldownMs -= 5_000;
  if (selected.has('t4-reactive')) result.deflectionReducesOverclockMs = 8_000;
  if (selected.has('t4-deflect')) result.overclockReducesDeflectionMs = 10_000;
  if (selected.has('t4-swap')) {
    result.overclockSwitchDamageBonus = 0.2;
    result.overclockSwitchDamageMs = 2_000;
  }
  if (selected.has('t5-redline')) result.overclockRedline = true;
  if (selected.has('t5-double')) result.deflectionCharges = 2;
  if (selected.has('t5-adaptive')) result.deflectionTriggersOverclockMs = 3_000;

  return result;
}

export function calculateSettlement(report: RunReport): SettlementBreakdown {
  const roomXp = report.roomsCleared * 40;
  const eliteXp = report.elitesDefeated * 30;
  const bossReachXp = report.bossReached ? 50 : 0;
  const bossVictoryXp = report.bossDefeated ? 120 : 0;
  const rewardXp = Math.min(25, report.rewardsTaken * 5);
  const combatXp = Math.min(60, Math.max(0, Math.round(report.combatScore)));
  const targetMs = report.bossDefeated ? 12 * 60_000 : Math.max(90_000, report.roomsCleared * 95_000);
  const ratio = report.activeCombatMs > 0 ? targetMs / report.activeCombatMs : 0;
  const efficiencyXp = Math.round(Math.min(40, Math.max(0, (ratio - 0.65) * 50)));
  const total = roomXp + eliteXp + bossReachXp + bossVictoryXp + rewardXp + combatXp + efficiencyXp;
  return {
    roomXp,
    eliteXp,
    bossReachXp,
    bossVictoryXp,
    rewardXp,
    combatXp,
    efficiencyXp,
    total,
    characterTotal: Math.floor(total * 1.25),
  };
}

export function grantSettlementXp(profile: ProfileV2, breakdown: SettlementBreakdown): ProfileV2 {
  const next = structuredClone(profile);
  next.accountXp += breakdown.total;
  const character = next.characters.artificer;
  character.xp += breakdown.characterTotal;

  while (next.accountXp >= accountPointCost(next.accountTotalPoints)) {
    next.accountXp -= accountPointCost(next.accountTotalPoints);
    next.accountTotalPoints += 1;
    next.accountAvailablePoints += 1;
  }

  while (character.xp >= characterPointCost(character.totalPoints)) {
    character.xp -= characterPointCost(character.totalPoints);
    character.totalPoints += 1;
    character.availablePoints += 1;
  }

  return next;
}

export function accountPointCost(points: number): number {
  return 100 + points * 25;
}

export function characterPointCost(points: number): number {
  return 80 + points * 20;
}

export function purchaseGlobalTalent(profile: ProfileV2, talentId: string): ProfileV2 {
  const definition = GLOBAL_TALENTS.find((talent) => talent.id === talentId);
  if (!definition || profile.globalTalents.includes(talentId)) return profile;
  if (profile.accountAvailablePoints < definition.cost) return profile;
  if (definition.tier > 1) {
    const previous = GLOBAL_TALENTS.find(
      (talent) => talent.branch === definition.branch && talent.tier === definition.tier - 1,
    );
    if (!previous || !profile.globalTalents.includes(previous.id)) return profile;
  }
  return {
    ...profile,
    accountAvailablePoints: profile.accountAvailablePoints - definition.cost,
    globalTalents: [...profile.globalTalents, talentId],
  };
}

export function resetGlobalTalents(profile: ProfileV2): ProfileV2 {
  const refund = profile.globalTalents.reduce((sum, id) => {
    return sum + (GLOBAL_TALENTS.find((talent) => talent.id === id)?.cost ?? 0);
  }, 0);
  return { ...profile, accountAvailablePoints: profile.accountAvailablePoints + refund, globalTalents: [] };
}

export function selectCharacterTalent(profile: ProfileV2, talentId: string): ProfileV2 {
  const definition = CHARACTER_TALENTS.find((talent) => talent.id === talentId);
  if (!definition) return profile;
  const character = profile.characters.artificer;
  const tierKey = String(definition.tier);
  const currentId = character.selections[tierKey];
  if (currentId === talentId) return profile;
  const currentCost = currentId
    ? CHARACTER_TALENTS.find((talent) => talent.id === currentId)?.cost ?? 0
    : 0;
  const availableAfterRefund = character.availablePoints + currentCost;
  if (availableAfterRefund < definition.cost) return profile;
  if (definition.tier > 1 && !character.selections[String(definition.tier - 1)]) return profile;

  return {
    ...profile,
    characters: {
      ...profile.characters,
      artificer: {
        ...character,
        availablePoints: availableAfterRefund - definition.cost,
        selections: { ...character.selections, [tierKey]: talentId },
      },
    },
  };
}

export function resetCharacterTalents(profile: ProfileV2): ProfileV2 {
  const character = profile.characters.artificer;
  const refund = Object.values(character.selections).reduce((sum, id) => {
    return sum + (CHARACTER_TALENTS.find((talent) => talent.id === id)?.cost ?? 0);
  }, 0);
  return {
    ...profile,
    characters: {
      ...profile.characters,
      artificer: {
        ...character,
        availablePoints: character.availablePoints + refund,
        selections: {},
      },
    },
  };
}
