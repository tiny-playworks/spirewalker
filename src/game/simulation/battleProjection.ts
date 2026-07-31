import type { MonsterIntent } from '@/game/core/model/battle';
import type { RunState } from '@/game/core/model/run';

/** 只估算下一次敌方行动的直接伤害；蓄力、多段和吸血都按正式意图结构计算。 */
export function intentDamage(intent: MonsterIntent | null | undefined): number {
  if (!intent) return 0;
  switch (intent.type) {
    case 'attack':
      return intent.value * (intent.hits ?? 1);
    case 'multi_hit':
      return intent.value * intent.hits;
    case 'heavy_charge':
      return intent.value;
    case 'attack_buff':
      return intent.attack;
    case 'leech':
      return intent.attack;
    default:
      return 0;
  }
}

export function projectedIncomingDamage(run: RunState): number {
  const battle = run.battle;
  if (!battle) return 0;
  return battle.enemyUnitIds.reduce((sum, enemyUnitId) => {
    const unit = battle.units[enemyUnitId];
    if (!unit?.alive) return sum;
    return sum + intentDamage(battle.monsters[enemyUnitId]?.intent);
  }, 0);
}
