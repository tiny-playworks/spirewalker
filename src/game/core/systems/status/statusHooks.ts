import {
  effectiveStrength,
} from '../../combat/statusCombat';
import type { BattleState } from '../../model/battle';
import type { CombatUnit } from '../../model/unit';
import type { AfterPlayCardPayload } from './statusRegistry';
import { behaviorOf } from './statusRegistry';

type BeforeDealDamageHook = (source: CombatUnit, amount: number) => number;
type BeforeTakeDamageHook = (target: CombatUnit, amount: number) => number;
type TurnStartHook = (battle: BattleState) => void;
type TurnEndHook = (battle: BattleState) => void;
const TURN_START_HOOKS: TurnStartHook[] = [
  (_battle) => {
    // 预留入口：后续接开局抽牌前、回合开始型状态效果。
  },
];


const BEFORE_DEAL_DAMAGE_HOOKS: BeforeDealDamageHook[] = [
  (source, amount) => {
    let next = Math.max(0, amount + effectiveStrength(source));
    for (const status of source.statuses) {
      const hook = behaviorOf(status.id)?.onBeforeDealDamage;
      if (hook) next = hook(source, next);
    }
    return Math.max(0, next);
  },
];

const BEFORE_TAKE_DAMAGE_HOOKS: BeforeTakeDamageHook[] = [
  (target, amount) => {
    let next = amount;
    for (const status of target.statuses) {
      const hook = behaviorOf(status.id)?.onBeforeTakeDamage;
      if (hook) next = hook(target, next);
    }
    return next;
  },
];

const TURN_END_HOOKS: TurnEndHook[] = [
  (battle) => {
    const allUnitIds = [battle.playerUnitId, ...battle.enemyUnitIds];
    for (const uid of allUnitIds) {
      const unit = battle.units[uid];
      if (!unit) continue;
      // 使用快照避免边遍历边 decay 导致索引抖动。
      const activeStatusIds = unit.statuses.map((s) => s.id);
      for (const statusId of activeStatusIds) {
        const hook = behaviorOf(statusId)?.onTurnEnd;
        if (hook) hook(battle, unit, statusId);
      }
    }
  },
];

/** 攻击发出前（力量/虚弱等）。 */
export function runOnBeforeDealDamage(source: CombatUnit, baseAmount: number): number {
  let amount = baseAmount;
  for (const hook of BEFORE_DEAL_DAMAGE_HOOKS) amount = hook(source, amount);
  return amount;
}

/** 攻击命中前（易伤等）。 */
export function runOnBeforeTakeDamage(target: CombatUnit, amount: number): number {
  let next = amount;
  for (const hook of BEFORE_TAKE_DAMAGE_HOOKS) next = hook(target, next);
  return next;
}

/** 玩家回合结束时状态衰减（虚弱/敌方易伤）。 */
export function runOnTurnStart(battle: BattleState): void {
  for (const hook of TURN_START_HOOKS) hook(battle);
}

/** 玩家回合结束时状态衰减（虚弱/敌方易伤）。 */
export function runOnTurnEnd(battle: BattleState): void {
  for (const hook of TURN_END_HOOKS) hook(battle);
}

/** 出牌结算后触发。 */
export function runOnAfterPlayCard(
  battle: BattleState,
  payload: AfterPlayCardPayload,
): void {
  const source = battle.units[payload.sourceUnitId];
  if (!source) return;
  for (const status of source.statuses) {
    const hook = behaviorOf(status.id)?.onAfterPlayCard;
    if (hook) hook(battle, payload);
  }
}
