import type { GameEvent } from './events/types';

/** 简短可读的一行战斗日志（调试用） */
export function formatBattleLogLine(e: GameEvent): string {
  switch (e.type) {
    case 'DAMAGE_DEALT':
      return `伤害 ${e.value}：${e.sourceUnitId} → ${e.targetUnitId}`;
    case 'BLOCK_GAINED':
      return `格挡 +${e.value}（${e.unitId}）`;
    case 'STATUS_APPLIED':
      return `状态 ${e.statusId} ×${e.value}（${e.unitId}）`;
    case 'CARD_PLAYED':
      return `打出卡牌 ${e.cardInstanceId}`;
    case 'CARD_DRAWN':
      return `抽牌 ${e.cardInstanceId}`;
    case 'ENERGY_CHANGED':
      return `能量 → ${e.value}`;
    case 'TURN_STARTED':
      return `── 回合 ${e.turn} ──`;
    case 'TURN_ENDED':
      return `结束回合`;
    case 'BATTLE_WON':
      return '战斗胜利';
    case 'BATTLE_LOST':
      return '战斗失败';
    case 'UNIT_DIED':
      return `单位阵亡 ${e.unitId}`;
    case 'POTION_USED':
      return `药水 ${e.potionId} +${e.value} HP`;
    default:
      return e.type;
  }
}
