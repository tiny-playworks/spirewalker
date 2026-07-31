import type { GameEvent } from '../events/types';
import type { RunState } from '../model/run';
import { GameEngine } from '../engine/GameEngine';

export interface BattlePreview {
  playable: boolean;
  energyAfter: number;
  damage: number;
  /** 将敌方格挡吸收也计入推进值，供模拟决策使用；UI 仍展示实际生命伤害。 */
  effectiveDamage: number;
  block: number;
  cardsDrawn: number;
  statuses: Array<{ statusId: string; value: number }>;
  targetUnitId?: string;
}

/** 直接在克隆状态上调用正式引擎，展示值与真实结算始终使用同一套规则。 */
export function previewCardPlay(
  run: RunState,
  cardInstanceId: string,
  targetUnitId?: string,
): BattlePreview {
  const battle = run.battle;
  if (!battle) return emptyPreview(0);
  const fallbackTarget = battle.enemyUnitIds.find((id) => battle.units[id]?.alive);
  const resolvedTarget = targetUnitId ?? fallbackTarget;
  const result = new GameEngine().dispatch(run, {
    type: 'PLAY_CARD',
    cardInstanceId,
    sourceUnitId: battle.playerUnitId,
    targetUnitId: resolvedTarget,
  });
  const played = result.events.some(
    (event) => event.type === 'CARD_PLAYED' && event.cardInstanceId === cardInstanceId,
  );
  if (!played) return emptyPreview(battle.player.energy);
  return summarizePreview(result.events, result.nextRun, resolvedTarget);
}

function summarizePreview(events: GameEvent[], nextRun: RunState, targetUnitId?: string): BattlePreview {
  const playerId = nextRun.battle?.playerUnitId;
  let damage = 0;
  let effectiveDamage = 0;
  let block = 0;
  let cardsDrawn = 0;
  const statuses: BattlePreview['statuses'] = [];
  for (const event of events) {
    if (event.type === 'DAMAGE_DEALT' && event.sourceUnitId === playerId) {
      damage += event.value;
      effectiveDamage += event.value;
    }
    if (event.type === 'BLOCK_ABSORBED' && nextRun.battle?.enemyUnitIds.includes(event.unitId)) {
      effectiveDamage += event.value;
    }
    if (event.type === 'BLOCK_GAINED' && event.unitId === playerId) block += event.value;
    if (event.type === 'CARD_DRAWN' && event.unitId === playerId) cardsDrawn += 1;
    if (event.type === 'STATUS_APPLIED') statuses.push({ statusId: event.statusId, value: event.value });
  }
  return {
    playable: true,
    energyAfter: nextRun.battle?.player.energy ?? 0,
    damage,
    effectiveDamage,
    block,
    cardsDrawn,
    statuses,
    targetUnitId,
  };
}

function emptyPreview(energyAfter: number): BattlePreview {
  return { playable: false, energyAfter, damage: 0, effectiveDamage: 0, block: 0, cardsDrawn: 0, statuses: [] };
}
