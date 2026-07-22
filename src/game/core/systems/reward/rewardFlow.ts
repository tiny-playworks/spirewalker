import type { GameCommand } from '../../commands/types';
import { CARD_DEFINITIONS } from '../../definitions/cards';
import { canUpgradeCardId, upgradeMasterDeckAt } from '../../definitions/cards/upgradeRules';
import { STATUS_MOMENTUM } from '../../definitions/statuses';
import { getStatusStacks } from '../../combat/statusCombat';
import type { GameEvent } from '../../events/types';
import type { RunState } from '../../model/run';
import { generateBattleRewards } from './rewardGenerator';
import {
  canResolveRewardCard,
  canResolveRewardGold,
  canResolveRewardUpgrade,
  resolveRewardPick,
} from './rewardResolver';
import { skipCardGoldAmount } from '../../engine/postBattleExtras';
import { rewardEncounterTierFromRun } from '../../engine/rewardEncounter';
import { applyAct1BossPostVictoryFullHealIfEligible, hashMapNodeId, syncRunPlayerFromBattle } from '../common/runGuards';
import {
  applyRelicResourceResult,
  resolveRelicHooks,
} from '../relic/relicHooks';
import { mulberry32 } from '../../utils/rng';

export function leaveBattleToRewardFlow(run: RunState, events: GameEvent[]): void {
  const battle = run.battle;
  if (!battle || battle.phase !== 'victory') return;
  const battleEndRelics = resolveRelicHooks(run.meta.relics, {
    run,
    battle,
    trigger: 'battleEnd',
    remainingMomentum: getStatusStacks(battle.units[battle.playerUnitId]!, STATUS_MOMENTUM),
    events,
  });
  applyRelicResourceResult(battle, battleEndRelics, events);
  if (battleEndRelics.maxHpLoss) {
    const player = battle.units[battle.playerUnitId];
    if (player) {
      player.maxHp = Math.max(1, player.maxHp - battleEndRelics.maxHpLoss);
      player.hp = Math.min(player.hp, player.maxHp);
    }
  }
  const rewardRng = mulberry32((run.seed ^ run.meta.gold ^ battle.turn * 0x51ed) >>> 0);
  const randomGold = battleEndRelics.goldMin !== undefined && battleEndRelics.goldMax !== undefined
    ? battleEndRelics.goldMin + Math.floor(rewardRng() * (battleEndRelics.goldMax - battleEndRelics.goldMin + 1))
    : 0;
  run.meta.gold += (battleEndRelics.goldBonus ?? 0) + randomGold;
  if (battleEndRelics.nextBattleMomentum) {
    run.meta.pendingBattleMomentum = (run.meta.pendingBattleMomentum ?? 0) + battleEndRelics.nextBattleMomentum;
  }
  if (battleEndRelics.upgradeRandomHand) {
    const handDefinitions = battle.player.hand
      .map((cardId) => battle.player.cards[cardId]?.definitionId)
      .filter((id): id is string => Boolean(id) && canUpgradeCardId(id));
    if (handDefinitions.length > 0) {
      const targetDefinition = handDefinitions[Math.floor(rewardRng() * handDefinitions.length)]!;
      const targetIndex = run.masterDeck.findIndex((id) => id === targetDefinition && canUpgradeCardId(id));
      if (targetIndex >= 0) upgradeMasterDeckAt(run, targetIndex);
    }
  }
  syncRunPlayerFromBattle(run);
  /** Act1 Boss 仅在此处满血，早于奖励 UI 与 `run.battle` 清空，失败路径不会进入本函数 */
  applyAct1BossPostVictoryFullHealIfEligible(run);

  // 诅咒：欲望 — 每场战斗结束时失去 3 点最大生命
  if (run.masterDeck.some((id) => CARD_DEFINITIONS[id]?.id === 'curse_lust')) {
    run.player.maxHp = Math.max(1, run.player.maxHp - 3);
    run.player.currentHp = Math.min(run.player.currentHp, run.player.maxHp);
  }
  // 诅咒：暴食 — 每场战斗结束时失去 50% 金币
  if (run.masterDeck.some((id) => CARD_DEFINITIONS[id]?.id === 'curse_gluttony')) {
    run.meta.gold = Math.floor(run.meta.gold * 0.5);
  }
  const curId = run.map.currentNodeId;
  const tier = rewardEncounterTierFromRun(run);
  const salt = (run.seed ^ run.meta.gold ^ 0xdec0de ^ hashMapNodeId(curId ?? '')) >>> 0;
  const items = generateBattleRewards({
    seed: run.seed,
    salt,
    tier,
    act: run.meta.act,
    actFloor: run.meta.actFloor,
    ownedCardIds: run.masterDeck,
    ownedRelicIds: run.meta.relics,
    potionCount: run.meta.potions.length,
    characterId: run.meta.characterId,
    meta: run.meta,
  });
  run.reward = { items, claimed: false };
  run.battle = undefined;
  run.screen = { type: 'reward' };
  events.push({ type: 'ENTERED_REWARD_FROM_BATTLE' });
}

export function selectRewardCardFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'SELECT_REWARD_CARD' }>,
  events: GameEvent[],
): void {
  const { definitionId } = command;
  if (!CARD_DEFINITIONS[definitionId]) return;
  if (!canResolveRewardCard(run, definitionId)) return;
  resolveRewardPick(run, events, { kind: 'card', definitionId });
}

export function takeRewardGoldFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'TAKE_REWARD_GOLD' }>,
  events: GameEvent[],
): void {
  const tier = rewardEncounterTierFromRun(run);
  if (command.amount !== skipCardGoldAmount(tier)) return;
  if (!canResolveRewardGold(run, command.amount)) return;
  resolveRewardPick(run, events, { kind: 'skip_card' });
}

/**
 * 放弃战后三选一，转而升级 masterDeck 里某张可升级的卡。
 * 不发金币，不加牌；仍会走正常的战后 -> 地图 / 章节过渡。
 */
export function takeRewardUpgradeCardFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'TAKE_REWARD_UPGRADE_CARD' }>,
  events: GameEvent[],
): void {
  if (!canResolveRewardUpgrade(run, command.masterDeckIndex)) return;
  resolveRewardPick(run, events, { kind: 'upgrade_card', masterDeckIndex: command.masterDeckIndex });
}
