import {
  effectiveStrength,
} from '../../combat/statusCombat';
import { addStatusStacks } from '../../combat/statusCombat';
import type { BattleState } from '../../model/battle';
import type { CombatUnit } from '../../model/unit';
import type { AfterPlayCardPayload } from './statusRegistry';
import { behaviorOf } from './statusRegistry';
import { CARD_DEFINITIONS } from '../../definitions/cards/starter';

type BeforeDealDamageHook = (source: CombatUnit, amount: number) => number;
type BeforeTakeDamageHook = (target: CombatUnit, amount: number) => number;
type TurnStartHook = (battle: BattleState) => void;
type TurnEndHook = (battle: BattleState) => void;

/** 处理诅咒牌效果 */
function applyCurseEffects(battle: BattleState): void {
  const player = battle.units[battle.playerUnitId];
  if (!player) return;

  // 遍历玩家卡组中的诅咒牌
  const allCards = [
    ...battle.player.drawPile,
    ...battle.player.hand,
    ...battle.player.discardPile,
  ];

  for (const cardId of allCards) {
    const card = battle.player.cards[cardId];
    if (!card) continue;
    const def = CARD_DEFINITIONS[card.definitionId];
    if (!def || def.type !== 'curse') continue;

    // 根据诅咒牌 ID 应用效果
    switch (def.id) {
      case 'curse_blood_mark':
      case 'curse_darkness':
      case 'curse_decay':
      case 'curse_decay_2':
        player.hp = Math.max(1, player.hp - 2);
        break;
      case 'curse_wrath':
        // 愤怒：攻击伤害+50%，受到伤害+50%（已在战斗系统中处理）
        break;
      case 'curse_envy':
        // 嫉妒：敌人每回合获得1层力量（在敌人回合处理）
        break;
      case 'curse_sloth':
        // 懒惰：每回合少抽1张牌（在抽牌逻辑中处理）
        break;
      case 'curse_lust':
        // 欲望：每场战斗结束时失去3点最大生命（在战斗结束时处理）
        break;
      case 'curse_gluttony':
        // 暴食：每场战斗结束时失去50%金币（在战斗结束时处理）
        break;
      case 'curse_pride':
        // 傲慢：卡牌费用+1（在费用计算中处理）
        break;
      case 'curse_silence':
      case 'curse_forgetfulness':
        // 沉默/遗忘：回合结束时消耗1张牌（在回合结束时处理）
        break;
      case 'curse_burden':
        // 重担：格挡值-25%（在格挡计算中处理）
        break;
      case 'curse_dread':
        // 恐惧：战斗开始时获得2层虚弱和2层易伤
        addStatusStacks(player, 'weak', 2);
        addStatusStacks(player, 'vulnerable', 2);
        break;
    }
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
    const def = CARD_DEFINITIONS[card.definitionId];
    if (!def || def.type !== 'status') continue;

    // 根据状态牌 ID 应用效果
    switch (def.id) {
      case 'status_wound':
      case 'status_dazed':
      case 'status_slimed':
        // 这些状态牌在回合结束时消耗（已由战斗系统处理）
        break;
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
        // 中毒：失去等同于层数的生命
        player.hp = Math.max(1, player.hp - 1);
        break;
      case 'status_bleed':
        // 流血：每打出一张攻击牌失去2点生命（在出牌时处理）
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
    // 预留入口：后续接开局抽牌前、回合开始型状态效果。
    applyCurseEffects(battle);
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
