import type { GameEvent } from '../events/types';
import type { RunState } from './run';

export interface RunStats {
  battlesWon: number;
  enemiesDefeated: number;
  damageDealt: number;
  damageTaken: number;
  highestHit: number;
  blockGained: number;
  cardsPlayed: number;
  goldEarned: number;
  goldSpent: number;
  cardPlays: Record<string, number>;
  nodesVisited: string[];
}

export function createEmptyRunStats(): RunStats {
  return {
    battlesWon: 0,
    enemiesDefeated: 0,
    damageDealt: 0,
    damageTaken: 0,
    highestHit: 0,
    blockGained: 0,
    cardsPlayed: 0,
    goldEarned: 0,
    goldSpent: 0,
    cardPlays: {},
    nodesVisited: [],
  };
}

export function accumulateRunStats(before: RunState, next: RunState, events: GameEvent[]): void {
  const stats = next.stats ?? createEmptyRunStats();
  const beforeBattle = before.battle;
  const playerId = beforeBattle?.playerUnitId ?? next.battle?.playerUnitId;

  for (const event of events) {
    if (event.type === 'BATTLE_WON') stats.battlesWon += 1;
    if (event.type === 'UNIT_DIED' && event.unitId !== playerId) stats.enemiesDefeated += 1;
    if (event.type === 'DAMAGE_DEALT') {
      if (event.sourceUnitId === playerId) {
        stats.damageDealt += event.value;
        stats.highestHit = Math.max(stats.highestHit, event.value);
      }
      if (event.targetUnitId === playerId) stats.damageTaken += event.value;
    }
    if (event.type === 'BLOCK_GAINED' && event.unitId === playerId) stats.blockGained += event.value;
    if (event.type === 'CARD_PLAYED' && event.unitId === playerId) {
      stats.cardsPlayed += 1;
      const definitionId = beforeBattle?.player.cards[event.cardInstanceId]?.definitionId
        ?? next.battle?.player.cards[event.cardInstanceId]?.definitionId;
      if (definitionId) stats.cardPlays[definitionId] = (stats.cardPlays[definitionId] ?? 0) + 1;
    }
    if (event.type === 'ENTERED_BATTLE_FROM_MAP'
      || event.type === 'ENTERED_SHOP_FROM_MAP'
      || event.type === 'ENTERED_REST_FROM_MAP'
      || event.type === 'ENTERED_REWARD_FROM_TREASURE') {
      if (!stats.nodesVisited.includes(event.nodeId)) stats.nodesVisited.push(event.nodeId);
    }
  }

  const goldDelta = next.meta.gold - before.meta.gold;
  if (goldDelta > 0) stats.goldEarned += goldDelta;
  if (goldDelta < 0) stats.goldSpent += Math.abs(goldDelta);
  next.stats = stats;
}
