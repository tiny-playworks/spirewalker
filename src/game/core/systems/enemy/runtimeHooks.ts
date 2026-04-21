import { addStatusStacks, decayStatus, getStatusStacks } from '../../combat/statusCombat';
import { buildInitialMonsterRuntime, getMonsterDefinition } from '../../definitions/monsters';
import { CARD_DEFINITIONS } from '../../definitions/cards/starter';
import { STATUS_MOMENTUM, STATUS_STRENGTH } from '../../definitions/statuses';
import type { GameEvent } from '../../events/types';
import type { BattleState, CountdownEffect } from '../../model/battle';
import type { CardInstance } from '../../model/card';
import { createInstanceId } from '../../utils/id';
import { runOnBeforeDealDamage, runOnBeforeTakeDamage } from '../status/statusHooks';
import { setInitialEnemyIntent } from './enemyAi';

function buildRuntimeCardInstance(definitionId: string): CardInstance {
  const def = CARD_DEFINITIONS[definitionId] ?? CARD_DEFINITIONS.junk_sludge;
  return {
    instanceId: createInstanceId('card'),
    definitionId: def.id,
    baseCost: def.cost,
    costForTurn: def.cost,
    upgraded: false,
  };
}

function reviveEnemyIfNeeded(battle: BattleState, enemyUnitId: string): boolean {
  const unit = battle.units[enemyUnitId];
  const monster = battle.monsters[enemyUnitId];
  if (!unit || !monster) return false;
  const reviveCharges = monster.runtime.reviveCharges ?? 0;
  if (reviveCharges <= 0) return false;
  monster.runtime.reviveCharges = reviveCharges - 1;
  const percent = monster.runtime.reviveHpPercent ?? 0.5;
  unit.hp = Math.max(1, Math.floor(unit.maxHp * percent));
  unit.block = 0;
  unit.alive = true;
  return true;
}

export function spawnEnemyUnit(
  battle: BattleState,
  enemyId: string,
  hpOverride?: number,
): string | null {
  if (battle.enemyUnitIds.filter((unitId) => battle.units[unitId]?.alive).length >= 6) {
    return null;
  }
  const def = getMonsterDefinition(enemyId);
  if (!def) throw new Error(`runtimeHooks: unknown enemyId "${enemyId}"`);
  const unitId = `u_enemy_${battle.nextEnemyUnitSeq++}`;
  const maxHp = hpOverride ?? Math.round((def.hpRange[0] + def.hpRange[1]) / 2);
  battle.units[unitId] = {
    id: unitId,
    side: 'enemy',
    name: def.name,
    hp: maxHp,
    maxHp,
    block: 0,
    alive: true,
    stats: { strength: 0, dexterity: 0 },
    statuses: [],
  };
  battle.monsters[unitId] = {
    unitId,
    monsterId: enemyId,
    intent: null,
    moveHistory: [],
    runtime: buildInitialMonsterRuntime(def),
    scriptState: {},
  };
  battle.enemyUnitIds.push(unitId);
  setInitialEnemyIntent(battle, unitId);
  return unitId;
}

function resolveCountdownEffect(
  battle: BattleState,
  enemyUnitId: string,
  effect: CountdownEffect,
  events: GameEvent[],
): void {
  const player = battle.units[battle.playerUnitId];
  if (!player?.alive) return;
  if (effect.type === 'attack') {
    dealDamageToUnit(battle, enemyUnitId, battle.playerUnitId, effect.value, events);
    return;
  }
  if (effect.type === 'multi_hit') {
    for (let index = 0; index < effect.hits; index += 1) {
      dealDamageToUnit(battle, enemyUnitId, battle.playerUnitId, effect.value, events);
      if (!player.alive) return;
    }
    return;
  }
  if (effect.type === 'summon') {
    for (let index = 0; index < effect.count; index += 1) {
      spawnEnemyUnit(battle, effect.enemyId);
    }
    return;
  }
  if (effect.type === 'max_hp_down') {
    player.maxHp = Math.max(1, player.maxHp - effect.value);
    player.hp = Math.min(player.hp, player.maxHp);
  }
}

export function tickEnemyCountdown(
  battle: BattleState,
  enemyUnitId: string,
  events: GameEvent[],
): void {
  const monster = battle.monsters[enemyUnitId];
  if (!monster?.runtime.countdown) return;
  monster.runtime.countdown.remaining -= 1;
  if (monster.runtime.countdown.remaining > 0) return;
  const effect = monster.runtime.countdown.effect;
  monster.runtime.countdown = undefined;
  resolveCountdownEffect(battle, enemyUnitId, effect, events);
}

function finalizeEnemyDeath(
  battle: BattleState,
  enemyUnitId: string,
  events: GameEvent[],
): void {
  const monster = battle.monsters[enemyUnitId];
  const unit = battle.units[enemyUnitId];
  if (!monster || !unit || unit.alive) return;
  if (reviveEnemyIfNeeded(battle, enemyUnitId)) {
    return;
  }
  const split = monster.runtime.splitOnDeath;
  if (split && !monster.runtime.deathResolved) {
    monster.runtime.deathResolved = true;
    for (let index = 0; index < split.count; index += 1) {
      const spawnedId = spawnEnemyUnit(battle, split.enemyId);
      if (!spawnedId) continue;
      const spawned = battle.units[spawnedId]!;
      spawned.hp = Math.max(1, Math.floor(spawned.maxHp * split.hpPercent));
    }
  }
  events.push({ type: 'UNIT_DIED', unitId: enemyUnitId });
}

export function dealDamageToUnit(
  battle: BattleState,
  sourceId: string,
  targetUnitId: string,
  baseAmount: number,
  events: GameEvent[],
): void {
  const target = battle.units[targetUnitId];
  if (!target?.alive) return;
  const source = battle.units[sourceId];
  let remaining = source ? runOnBeforeDealDamage(source, baseAmount) : baseAmount;
  remaining = runOnBeforeTakeDamage(target, remaining);
  const blockAbsorb = Math.min(target.block, remaining);
  if (blockAbsorb > 0) {
    target.block -= blockAbsorb;
    remaining -= blockAbsorb;
  }
  const hpLoss = Math.min(target.hp, remaining);
  target.hp -= hpLoss;
  if (hpLoss > 0) {
    events.push({ type: 'DAMAGE_DEALT', sourceUnitId: sourceId, targetUnitId, value: hpLoss });
  }
  target.alive = target.hp > 0;
  if (!target.alive && target.side === 'enemy') {
    finalizeEnemyDeath(battle, targetUnitId, events);
  }
  if (!target.alive && target.side === 'player') {
    events.push({ type: 'UNIT_DIED', unitId: targetUnitId });
  }
}

export function applyEnemyReactionToPlayerCard(
  battle: BattleState,
  enemyUnitId: string,
  cardWasAttack: boolean,
  cardsPlayedThisTurn: number,
  events: GameEvent[],
): void {
  const monster = battle.monsters[enemyUnitId];
  const enemy = battle.units[enemyUnitId];
  const player = battle.units[battle.playerUnitId];
  if (!monster || !enemy?.alive || !player?.alive) return;

  if (cardWasAttack && (monster.runtime.thorns ?? 0) > 0) {
    dealDamageToUnit(battle, enemyUnitId, battle.playerUnitId, monster.runtime.thorns!, events);
  }
  if ((monster.runtime.reactiveDamage ?? 0) > 0) {
    dealDamageToUnit(battle, enemyUnitId, battle.playerUnitId, monster.runtime.reactiveDamage!, events);
  }
  if (
    (monster.runtime.counterThreshold ?? 0) > 0
    && cardsPlayedThisTurn >= (monster.runtime.counterThreshold ?? 0)
    && (monster.runtime.counterDamage ?? 0) > 0
  ) {
    dealDamageToUnit(battle, enemyUnitId, battle.playerUnitId, monster.runtime.counterDamage!, events);
  }
}

export function addPollutionCards(
  battle: BattleState,
  count: number,
  cardId: string,
  events: GameEvent[],
): void {
  for (let index = 0; index < count; index += 1) {
    const card = buildRuntimeCardInstance(cardId);
    battle.player.cards[card.instanceId] = card;
    battle.player.drawPile.unshift(card.instanceId);
    events.push({ type: 'CARD_DRAWN', unitId: battle.playerUnitId, cardInstanceId: card.instanceId });
  }
}

export function lockHandCards(
  battle: BattleState,
  count: number,
): void {
  const unlocked = battle.player.hand.filter((cardId) => !battle.player.lockedCardInstanceIds.includes(cardId));
  for (let index = 0; index < count && index < unlocked.length; index += 1) {
    battle.player.lockedCardInstanceIds.push(unlocked[index]!);
  }
}

export function applyMechanicReset(battle: BattleState, mode: 'momentum' | 'statuses' | 'all'): void {
  const player = battle.units[battle.playerUnitId];
  if (!player) return;
  if (mode === 'momentum' || mode === 'all') {
    decayStatus(player, STATUS_MOMENTUM, getStatusStacks(player, STATUS_MOMENTUM));
  }
  if (mode === 'statuses' || mode === 'all') {
    player.statuses = [];
  }
}

export function applyScaleToEnemy(battle: BattleState, enemyUnitId: string, stat: 'strength' | 'armor', value: number): void {
  const enemy = battle.units[enemyUnitId];
  if (!enemy) return;
  if (stat === 'strength') {
    addStatusStacks(enemy, STATUS_STRENGTH, value);
    return;
  }
  enemy.block += value;
}

export function healEnemyUnit(battle: BattleState, enemyUnitId: string, value: number): void {
  const enemy = battle.units[enemyUnitId];
  if (!enemy) return;
  enemy.hp = Math.min(enemy.maxHp, enemy.hp + value);
}

export function healEnemiesByMode(
  battle: BattleState,
  enemyUnitId: string,
  value: number,
  target: 'self' | 'ally_lowest' | 'all_enemies',
): void {
  if (target === 'self') {
    healEnemyUnit(battle, enemyUnitId, value);
    return;
  }
  if (target === 'all_enemies') {
    for (const id of battle.enemyUnitIds) {
      if (battle.units[id]?.alive) healEnemyUnit(battle, id, value);
    }
    return;
  }
  const living = battle.enemyUnitIds
    .filter((id) => battle.units[id]?.alive)
    .sort((a, b) => battle.units[a]!.hp - battle.units[b]!.hp);
  if (living[0]) healEnemyUnit(battle, living[0], value);
}

export function resetPlayerTurnControls(battle: BattleState): void {
  battle.player.lockedCardInstanceIds = [];
}

export function applyStartOfPlayerTurnPressure(battle: BattleState): number {
  const drawPenalty = Math.max(0, battle.player.drawPressure);
  battle.player.drawPressure = 0;
  return drawPenalty;
}

export function applyEnemyPassiveIntent(
  battle: BattleState,
  enemyUnitId: string,
  intent: Exclude<BattleState['monsters'][string]['intent'], null>,
): void {
  const monster = battle.monsters[enemyUnitId];
  if (!monster) return;
  if (intent.type === 'split_on_death') {
    monster.runtime.splitOnDeath = { enemyId: intent.enemyId, count: intent.count, hpPercent: intent.hpPercent };
  } else if (intent.type === 'revive') {
    monster.runtime.reviveCharges = intent.charges;
    monster.runtime.reviveHpPercent = intent.hpPercent;
  } else if (intent.type === 'thorns') {
    monster.runtime.thorns = intent.damage;
  } else if (intent.type === 'reactive') {
    monster.runtime.reactiveDamage = intent.damage;
  } else if (intent.type === 'counter') {
    monster.runtime.counterThreshold = intent.threshold;
    monster.runtime.counterDamage = intent.damage;
  } else if (intent.type === 'countdown') {
    monster.runtime.countdown = { remaining: intent.turns, effect: intent.effect };
  } else if (intent.type === 'double_action') {
    monster.runtime.extraActions = intent.times;
  }
}
