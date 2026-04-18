import { getMonsterDefinition } from '../../definitions/monsters';
import type { BattleState, MonsterBattleState, MonsterIntent } from '../../model/battle';

export interface IntentComputation {
  intent: MonsterIntent;
  /** 开发态展示：规则 + 索引说明 */
  trace: string;
}

function alternatingAttackIntent(
  defId: string,
  moveHistoryLength: number,
  low: number,
  high: number,
): IntentComputation {
  const useLow = moveHistoryLength % 2 === 0;
  const value = useLow ? low : high;
  const trace = `alternating_attack[${defId}] len=${moveHistoryLength} → ${useLow ? 'even' : 'odd'} dmg=${value}`;
  return { intent: { type: 'attack', value }, trace };
}

/** 根据怪物定义与已结算行动次数，计算下一意图（含首轮展示） */
export function computeIntentForMonster(monsterId: string, moveHistoryLength: number): IntentComputation {
  const def = getMonsterDefinition(monsterId);
  if (!def) {
    throw new Error(`enemyAi: unknown monsterId "${monsterId}"`);
  }
  const { ai } = def;
  if (ai.kind === 'alternating_attack') {
    const [low, high] = ai.damages;
    return alternatingAttackIntent(def.id, moveHistoryLength, low, high);
  }
  throw new Error(`enemyAi: unhandled ai.kind for ${monsterId}`);
}

export function applyIntentToMonster(monster: MonsterBattleState, comp: IntentComputation): void {
  monster.intent = comp.intent;
  monster.aiTrace = comp.trace;
}

/** 敌方回合结束后刷新意图（moveHistory 已含本回合行动） */
export function refreshEnemyIntent(battle: BattleState, enemyUnitId: string): void {
  const m = battle.monsters[enemyUnitId];
  if (!m) return;
  const comp = computeIntentForMonster(m.monsterId, m.moveHistory.length);
  applyIntentToMonster(m, comp);
}

export function setInitialEnemyIntent(monster: MonsterBattleState): void {
  const comp = computeIntentForMonster(monster.monsterId, 0);
  applyIntentToMonster(monster, comp);
}
