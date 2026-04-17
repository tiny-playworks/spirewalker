import { STATUS_STRENGTH, STATUS_VULNERABLE, STATUS_WEAK } from '../definitions/statuses';
import type { CombatUnit } from '../model/unit';

export function getStatusStacks(unit: CombatUnit, statusId: string): number {
  return unit.statuses.find((s) => s.id === statusId)?.stacks ?? 0;
}

export function addStatusStacks(unit: CombatUnit, statusId: string, stacks: number): void {
  if (stacks <= 0) return;
  const existing = unit.statuses.find((s) => s.id === statusId);
  if (existing) existing.stacks += stacks;
  else unit.statuses.push({ id: statusId, stacks });
}

export function decayStatus(unit: CombatUnit, statusId: string, amount: number): void {
  const existing = unit.statuses.find((s) => s.id === statusId);
  if (!existing) return;
  existing.stacks -= amount;
  if (existing.stacks <= 0) {
    unit.statuses = unit.statuses.filter((s) => s.id !== statusId);
  }
}

export function effectiveStrength(unit: CombatUnit): number {
  return unit.stats.strength + getStatusStacks(unit, STATUS_STRENGTH);
}

/** 攻击牌基础伤害（卡牌数值）→ 计入力量、虚弱后的命中前伤害 */
export function modifyOutgoingAttackDamage(source: CombatUnit, cardBaseDamage: number): number {
  let amount = cardBaseDamage + effectiveStrength(source);
  if (getStatusStacks(source, STATUS_WEAK) > 0) {
    amount = Math.floor(amount * 0.75);
  }
  return Math.max(0, amount);
}

/** 易伤：对目标造成的攻击伤害放大 */
export function modifyIncomingAttackDamage(target: CombatUnit, amount: number): number {
  if (getStatusStacks(target, STATUS_VULNERABLE) > 0) {
    return Math.floor(amount * 1.5);
  }
  return amount;
}
