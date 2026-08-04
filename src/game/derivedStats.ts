import { ITEM_BY_ID, RARITY_MULTIPLIER } from './content';
import { getCharacterCombatTalents, getCombatModifiers } from './progression';
import type {
  CombatModifiers,
  DerivedStats,
  DerivedWeaponStats,
  EquippedWeapon,
  ProfileV2,
  RunStateV2,
} from './types';

export function deriveWeaponStats(slot: EquippedWeapon, modifiers: CombatModifiers): DerivedWeaponStats {
  const weapon = ITEM_BY_ID.get(slot.weapon.definitionId);
  if (!weapon || weapon.kind !== 'weapon') throw new Error(`Invalid weapon: ${slot.weapon.definitionId}`);
  const muzzle = slot.muzzle ? ITEM_BY_ID.get(slot.muzzle.definitionId) : null;
  const core = slot.core ? ITEM_BY_ID.get(slot.core.definitionId) : null;
  const validMuzzle = muzzle?.kind === 'muzzle' ? muzzle : null;
  const validCore = core?.kind === 'core' ? core : null;
  const rarityPower = RARITY_MULTIPLIER[slot.weapon.rarity]
    * (slot.muzzle ? 1 + (RARITY_MULTIPLIER[slot.muzzle.rarity] - 1) * 0.35 : 1)
    * (slot.core ? 1 + (RARITY_MULTIPLIER[slot.core.rarity] - 1) * 0.35 : 1);
  const damage = weapon.damage * (validMuzzle?.damageMultiplier ?? 1) * modifiers.damageMultiplier * rarityPower;
  const fireRate = weapon.fireRate * modifiers.fireRateMultiplier;
  const projectileCount = validMuzzle?.projectileCount ?? 1;
  const reloadMs = weapon.reloadMs / Math.max(0.2, modifiers.reloadMultiplier);
  const firingMs = weapon.magazine / Math.max(0.1, fireRate) * 1_000;
  const sustainedDps = damage * projectileCount * weapon.magazine / ((firingMs + reloadMs) / 1_000);

  return {
    name: weapon.name,
    tag: weapon.tag,
    damage,
    fireRate,
    magazine: weapon.magazine,
    reloadMs,
    sustainedDps,
    projectileSpeed: weapon.projectileSpeed * modifiers.projectileSpeedMultiplier
      * (validMuzzle?.id === 'muzzle-heavy' ? 0.78 : 1),
    projectileCount,
    pierce: validMuzzle?.pierce ?? 0,
    bounces: validMuzzle?.bounces ?? 0,
    explosionRadius: Math.max(validMuzzle?.explosionRadius ?? 0, validCore?.explosionRadius ?? 0),
    element: weapon.tag === 'neutral' ? validCore?.tag ?? 'neutral' : weapon.tag,
  };
}

export function deriveStats(profile: ProfileV2, run: RunStateV2): DerivedStats {
  const modifiers = getCombatModifiers(profile, run.relics);
  const talents = getCharacterCombatTalents(profile);
  return {
    maxHp: run.maxHp,
    startingShield: modifiers.startingShield,
    moveSpeed: 270 * modifiers.moveSpeedMultiplier,
    dashCooldownMs: 1_200 * modifiers.dashCooldownMultiplier,
    critChance: modifiers.critChance,
    critMultiplier: modifiers.critMultiplier,
    overclockCooldownMs: talents.overclockCooldownMs,
    deflectionCooldownMs: talents.deflectionCooldownMs,
    dismantleRatio: modifiers.dismantleRatio,
    weapons: [
      deriveWeaponStats(run.weapons[0], modifiers),
      deriveWeaponStats(run.weapons[1], modifiers),
    ],
  };
}
