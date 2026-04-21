import { addStatusStacks, decayStatus, getStatusStacks } from '../../combat/statusCombat';
import { STATUS_MOMENTUM } from '../../definitions/statuses';
import type { GameEvent } from '../../events/types';
import type { BattleState, MonsterIntent } from '../../model/battle';
import {
  addPollutionCards,
  applyEnemyPassiveIntent,
  applyEnemyReactionToPlayerCard,
  applyMechanicReset,
  applyScaleToEnemy,
  dealDamageToUnit,
  healEnemiesByMode,
  spawnEnemyUnit,
} from './runtimeHooks';

function executeDirectAttack(
  battle: BattleState,
  enemyUnitId: string,
  value: number,
  hits: number,
  events: GameEvent[],
): void {
  for (let index = 0; index < hits; index += 1) {
    dealDamageToUnit(battle, enemyUnitId, battle.playerUnitId, value, events);
    if (!battle.units[battle.playerUnitId]?.alive) return;
  }
}

export function executeMonsterIntent(
  relicIds: string[],
  battle: BattleState,
  enemyUnitId: string,
  intent: MonsterIntent,
  events: GameEvent[],
): void {
  const enemy = battle.units[enemyUnitId];
  const player = battle.units[battle.playerUnitId];
  if (!enemy?.alive || !player) return;

  if (intent.type === 'attack') {
    executeDirectAttack(battle, enemyUnitId, intent.value, intent.hits ?? 1, events);
    return;
  }
  if (intent.type === 'multi_hit') {
    executeDirectAttack(battle, enemyUnitId, intent.value, intent.hits, events);
    return;
  }
  if (intent.type === 'heavy_charge') {
    executeDirectAttack(battle, enemyUnitId, intent.value, 1, events);
    return;
  }
  if (intent.type === 'block') {
    enemy.block += intent.value;
    events.push({ type: 'BLOCK_GAINED', unitId: enemyUnitId, value: intent.value });
    return;
  }
  if (intent.type === 'buff') {
    addStatusStacks(enemy, intent.statusId, intent.value);
    events.push({ type: 'STATUS_APPLIED', unitId: enemyUnitId, statusId: intent.statusId, value: getStatusStacks(enemy, intent.statusId) });
    return;
  }
  if (intent.type === 'scale') {
    applyScaleToEnemy(battle, enemyUnitId, intent.stat, intent.value);
    return;
  }
  if (intent.type === 'debuff') {
    addStatusStacks(player, intent.statusId, intent.value);
    events.push({ type: 'STATUS_APPLIED', unitId: battle.playerUnitId, statusId: intent.statusId, value: getStatusStacks(player, intent.statusId) });
    return;
  }
  if (intent.type === 'reduce_status') {
    const reduction = intent.statusId === STATUS_MOMENTUM && relicIds.includes('guard_knot')
      ? Math.max(0, intent.value - 1)
      : intent.value;
    decayStatus(player, intent.statusId, reduction);
    events.push({ type: 'STATUS_APPLIED', unitId: battle.playerUnitId, statusId: intent.statusId, value: getStatusStacks(player, intent.statusId) });
    return;
  }
  if (intent.type === 'summon') {
    for (let index = 0; index < intent.count; index += 1) {
      spawnEnemyUnit(battle, intent.enemyId);
    }
    return;
  }
  if (intent.type === 'split_on_death' || intent.type === 'revive' || intent.type === 'thorns' || intent.type === 'reactive' || intent.type === 'counter' || intent.type === 'countdown' || intent.type === 'double_action') {
    applyEnemyPassiveIntent(battle, enemyUnitId, intent);
    return;
  }
  if (intent.type === 'pollute_draw') {
    addPollutionCards(battle, intent.count, intent.cardId ?? 'junk_sludge', events);
    return;
  }
  if (intent.type === 'lock_hand') {
    battle.player.pendingHandLocks += intent.count;
    return;
  }
  if (intent.type === 'draw_pressure') {
    battle.player.drawPressure += intent.value;
    return;
  }
  if (intent.type === 'heal') {
    healEnemiesByMode(battle, enemyUnitId, intent.value, intent.target);
    return;
  }
  if (intent.type === 'leech') {
    const hpBefore = player.hp;
    dealDamageToUnit(battle, enemyUnitId, battle.playerUnitId, intent.attack, events);
    const dealt = hpBefore - battle.units[battle.playerUnitId]!.hp;
    healEnemiesByMode(battle, enemyUnitId, Math.floor(dealt * intent.healRatio), 'self');
    return;
  }
  if (intent.type === 'phase_shift') {
    return;
  }
  if (intent.type === 'max_hp_down') {
    player.maxHp = Math.max(1, player.maxHp - intent.value);
    player.hp = Math.min(player.hp, player.maxHp);
    return;
  }
  if (intent.type === 'mechanic_reset') {
    applyMechanicReset(battle, intent.mode);
    return;
  }
  if (intent.type === 'copy_echo') {
    const copyId = intent.enemyId ?? battle.monsters[enemyUnitId]?.monsterId;
    if (!copyId) return;
    for (let index = 0; index < (intent.count ?? 1); index += 1) {
      spawnEnemyUnit(battle, copyId);
    }
    return;
  }
  if (intent.type === 'punish_multi_play') {
    if (battle.playerCardsPlayedThisTurn >= intent.threshold) {
      enemy.block += intent.block;
      events.push({ type: 'BLOCK_GAINED', unitId: enemyUnitId, value: intent.block });
    }
    return;
  }
  if (intent.type === 'attack_buff') {
    dealDamageToUnit(battle, enemyUnitId, battle.playerUnitId, intent.attack, events);
    addStatusStacks(enemy, intent.statusId, intent.value);
    return;
  }
}

export { applyEnemyReactionToPlayerCard };
