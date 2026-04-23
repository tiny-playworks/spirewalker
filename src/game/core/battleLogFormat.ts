import { CARD_DEFINITIONS } from './definitions/cards/starter';
import { getStatusMeta } from './definitions/statuses';
import { POTION_DEFINITIONS } from './definitions/potions';
import type { GameEvent } from './events/types';
import type { RunState } from './model/run';

/** 简短可读的一行战斗日志（调试用） */
function getUnitName(run: RunState, unitId: string): string {
  const battle = run.battle;
  return battle?.units[unitId]?.name ?? unitId;
}

function getCardName(run: RunState, cardInstanceId: string): string {
  const battle = run.battle;
  const definitionId = battle?.player.cards[cardInstanceId]?.definitionId;
  if (!definitionId) return cardInstanceId;
  return CARD_DEFINITIONS[definitionId]?.name ?? definitionId;
}

export function formatBattleLogLine(run: RunState, e: GameEvent): string {
  switch (e.type) {
    case 'DAMAGE_DEALT':
      return `${getUnitName(run, e.sourceUnitId)} 对 ${getUnitName(run, e.targetUnitId)} 造成 ${e.value} 点伤害`;
    case 'BLOCK_GAINED':
      return `${getUnitName(run, e.unitId)} 获得 ${e.value} 点格挡`;
    case 'STATUS_APPLIED':
      return `${getUnitName(run, e.unitId)} 的${getStatusMeta(e.statusId).name}变为 ${e.value}`;
    case 'CARD_PLAYED':
      return e.targetUnitId
        ? `${getUnitName(run, e.unitId)} 打出 ${getCardName(run, e.cardInstanceId)}，目标 ${getUnitName(run, e.targetUnitId)}`
        : `${getUnitName(run, e.unitId)} 打出 ${getCardName(run, e.cardInstanceId)}`;
    case 'CARD_DRAWN':
      return `${getUnitName(run, e.unitId)} 抽到 ${getCardName(run, e.cardInstanceId)}`;
    case 'ENERGY_CHANGED':
      return `${getUnitName(run, e.unitId)} 能量变为 ${e.value}`;
    case 'TURN_STARTED':
      return `── ${getUnitName(run, e.unitId)} 的第 ${e.turn} 回合开始 ──`;
    case 'TURN_ENDED':
      return `${getUnitName(run, e.unitId)} 回合结束`;
    case 'BATTLE_WON':
      return '战斗胜利';
    case 'BATTLE_LOST':
      return '战斗失败';
    case 'UNIT_DIED':
      return `${getUnitName(run, e.unitId)} 被击倒`;
    case 'ENTERED_BATTLE_FROM_MAP':
      return '进入战斗';
    case 'RETURNED_TO_MAP_FROM_BATTLE':
      return '返回地图';
    case 'ENTERED_REWARD_FROM_BATTLE':
      return '进入战后奖励';
    case 'ENTERED_REWARD_FROM_TREASURE':
      return '打开宝箱';
    case 'ENTERED_SHOP_FROM_MAP':
      return '进入商店';
    case 'ENTERED_REST_FROM_MAP':
      return '来到篝火';
    case 'ENTERED_GAME_OVER':
      return '本局结束';
    case 'EVENT_RESOLVED':
      return `事件已结算：${e.optionId}`;
    case 'POTION_USED':
      return e.value > 0
        ? `使用 ${POTION_DEFINITIONS[e.potionId]?.name ?? e.potionId}，回复 ${e.value} 点生命`
        : `使用 ${POTION_DEFINITIONS[e.potionId]?.name ?? e.potionId}：${POTION_DEFINITIONS[e.potionId]?.description ?? ''}`;
    default:
      return '未知事件';
  }
}
