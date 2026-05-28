import {
  effectiveStrength,
} from '../../combat/statusCombat';
import { addStatusStacks } from '../../combat/statusCombat';
import type { BattleState } from '../../model/battle';
import type { CombatUnit } from '../../model/unit';
import type { AfterPlayCardPayload } from './statusRegistry';
import { behaviorOf } from './statusRegistry';

type BeforeDealDamageHook = (source: CombatUnit, amount: number) => number;
type BeforeTakeDamageHook = (target: CombatUnit, amount: number) => number;
type TurnStartHook = (battle: BattleState) => void;
type TurnEndHook = (battle: BattleState) => void;

/**
 * 战斗开始时一次性应用的诅咒效果。
 * 调用时机：buildInitialBattle 之后、第一回合开始之前。
 */
export function applyCurseBattleStart(battle: BattleState): void {
  const player = battle.units[battle.playerUnitId];
  if (!player) return;
  const curses = battle.activeCurseIds;

  if (curses.has('curse_dread')) {
    // 恐惧：战斗开始时获得 2 层虚弱和 2 层易伤（仅一次）
    addStatusStacks(player, 'weak', 2);
    addStatusStacks(player, 'vulnerable', 2);
  }
  if (curses.has('curse_greed')) {
    // 贪婪：战斗开始时失去 5 点生命
    player.hp = Math.max(1, player.hp - 5);
  }
  if (curses.has('curse_wrath')) {
    // 愤怒：获得 2 层力量（攻击 +50% 近似），同时获得 2 层易伤（受伤 +50% 近似）
    addStatusStacks(player, 'strength', 2);
    addStatusStacks(player, 'vulnerable', 2);
  }
  if (curses.has('curse_pride')) {
    // 傲慢：所有卡牌费用 +1（记录到 battle 状态，由费用计算读取）
    battle.cursePrideCostPressure = 1;
  }
  if (curses.has('curse_sloth')) {
    // 懒惰：每回合少抽 1 张牌
    battle.curseSlothDrawPressure = 1;
  }
  if (curses.has('curse_burden')) {
    // 重担：格挡值 -25%
    battle.curseBurdenBlockDecay = 0.25;
  }
  if (curses.has('curse_confusion')) {
    // 混乱：所有卡牌费用随机增加 0-2（战斗开始时确定一个固定偏移）
    battle.curseConfusionCostDelta = Math.floor(Math.random() * 3);
  }
}

/** 回合开始时触发的诅咒效果 */
function applyCurseTurnStart(battle: BattleState): void {
  const player = battle.units[battle.playerUnitId];
  if (!player) return;
  const curses = battle.activeCurseIds;

  // 血印 / 黑暗 / 腐朽：每回合失去 2 点生命
  if (curses.has('curse_blood_mark') || curses.has('curse_darkness') || curses.has('curse_decay')) {
    player.hp = Math.max(1, player.hp - 2);
  }

  // 虚弱诅咒：每回合获得 1 层虚弱
  if (curses.has('curse_weakness')) {
    addStatusStacks(player, 'weak', 1);
  }

  // 易伤诅咒：每回合获得 1 层易伤
  if (curses.has('curse_vulnerability')) {
    addStatusStacks(player, 'vulnerable', 1);
  }

  // 麻痹：每回合随机弃 1 张牌
  if (curses.has('curse_paralysis') && battle.player.hand.length > 0) {
    const index = Math.floor(Math.random() * battle.player.hand.length);
    const discarded = battle.player.hand.splice(index, 1)[0];
    if (discarded) battle.player.discardPile.push(discarded);
  }

  // 遗忘：每回合开始时消耗 1 张随机抽牌堆中的牌
  if (curses.has('curse_forgetfulness') && battle.player.drawPile.length > 0) {
    const index = Math.floor(Math.random() * battle.player.drawPile.length);
    const exhausted = battle.player.drawPile.splice(index, 1)[0];
    if (exhausted) battle.player.exhaustPile.push(exhausted);
  }

  // 嫉妒：敌人每回合获得 1 层力量
  if (curses.has('curse_envy')) {
    for (const enemyId of battle.enemyUnitIds) {
      const enemy = battle.units[enemyId];
      if (enemy?.alive) {
        addStatusStacks(enemy, 'strength', 1);
      }
    }
  }

  // 重担：回合开始时格挡值 -25%
  if (curses.has('curse_burden') && player.block > 0) {
    player.block = Math.floor(player.block * 0.75);
  }
}

/** 回合结束时触发的诅咒效果 */
function applyCurseTurnEnd(battle: BattleState): void {
  const player = battle.units[battle.playerUnitId];
  if (!player) return;
  const curses = battle.activeCurseIds;

  // 疑虑：每回合结束时获得 1 层易伤
  if (curses.has('curse_doubt')) {
    addStatusStacks(player, 'vulnerable', 1);
  }

  // 耻辱：每回合结束时获得 1 层虚弱
  if (curses.has('curse_shame')) {
    addStatusStacks(player, 'weak', 1);
  }

  // 沉默：回合结束时消耗 1 张随机手牌
  if (curses.has('curse_silence') && battle.player.hand.length > 0) {
    const index = Math.floor(Math.random() * battle.player.hand.length);
    const exhausted = battle.player.hand.splice(index, 1)[0];
    if (exhausted) battle.player.exhaustPile.push(exhausted);
  }
}

/** 处理状态牌效果 */
function applyStatusCardEffects(battle: BattleState): void {
  const player = battle.units[battle.playerUnitId];
  if (!player) return;

  // 遍历玩家手牌中的状态牌
  const handCards = [...battle.player.hand];
  for (const cardId of handCards) {
    const card = battle.player.cards[cardId];
    if (!card) continue;

    // 根据状态牌 ID 应用效果
    switch (card.definitionId) {
      case 'status_burn':
        player.hp = Math.max(1, player.hp - 2);
        break;
      case 'status_shock':
        // 电击：对所有敌人造成2点伤害
        for (const enemyUnitId of battle.enemyUnitIds) {
          const target = battle.units[enemyUnitId];
          if (target?.alive) {
            target.hp = Math.max(0, target.hp - 2);
          }
        }
        break;
      case 'status_frozen':
        // 冰冻：获得3点格挡
        player.block += 3;
        break;
      case 'status_poison':
        // 中毒：失去1点生命
        player.hp = Math.max(1, player.hp - 1);
        break;
      case 'status_curse':
        // 诅咒：获得1层易伤
        addStatusStacks(player, 'vulnerable', 1);
        break;
      case 'status_regret':
        // 悔恨：失去等同于手牌数的生命
        player.hp = Math.max(1, player.hp - battle.player.hand.length);
        break;
      case 'status_shame_2':
        // 耻辱：获得1层虚弱
        addStatusStacks(player, 'weak', 1);
        break;
      case 'status_doubt_2':
        // 疑虑：获得1层易伤
        addStatusStacks(player, 'vulnerable', 1);
        break;
      case 'status_paralysis_2':
        // 麻痹：随机弃1张牌
        if (battle.player.hand.length > 0) {
          const index = Math.floor(Math.random() * battle.player.hand.length);
          const discarded = battle.player.hand.splice(index, 1)[0];
          if (discarded) battle.player.discardPile.push(discarded);
        }
        break;
      case 'status_confusion_2':
        // 混乱：所有卡牌费用随机增加0-1点（在费用计算中处理）
        break;
      case 'status_decay_2':
        // 腐朽：失去2点生命
        player.hp = Math.max(1, player.hp - 2);
        break;
    }
  }
}

const TURN_START_HOOKS: TurnStartHook[] = [
  (battle) => {
    applyCurseTurnStart(battle);
    applyStatusCardEffects(battle);
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
    applyCurseTurnEnd(battle);
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

/** 玩家回合开始时触发。 */
export function runOnTurnStart(battle: BattleState): void {
  for (const hook of TURN_START_HOOKS) hook(battle);
}

/** 玩家回合结束时触发。 */
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
