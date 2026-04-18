import { getMonsterDefinition } from '../definitions/monsters';

/** 地图 / 战斗入口的敌人生成槽位（静态编队） */
export interface BattleEnemySlot {
  unitId: string;
  name: string;
  maxHp: number;
  /** 对应 MONSTER_DEFINITIONS 的键 */
  monsterId: string;
}

/** 校验编队引用的怪物定义存在（最小边界，避免静默错怪） */
export function assertMonsterSlotsResolved(slots: BattleEnemySlot[]): void {
  for (const s of slots) {
    if (!getMonsterDefinition(s.monsterId)) {
      throw new Error(`Unknown monster definition id: ${s.monsterId}`);
    }
  }
}
