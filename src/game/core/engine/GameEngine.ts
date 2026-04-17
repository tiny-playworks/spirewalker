import {
  addStatusStacks,
  decayStatus,
  getStatusStacks,
  modifyIncomingAttackDamage,
  modifyOutgoingAttackDamage,
} from '../combat/statusCombat';
import { CARD_DEFINITIONS } from '../definitions/cards/starter';
import { applyRelicPickupEffect, RELIC_DEFINITIONS, rollBossRelicReward } from '../definitions/relics';
import { MAX_POTIONS, POTION_DEFINITIONS } from '../definitions/potions';
import { STATUS_VULNERABLE, STATUS_WEAK } from '../definitions/statuses';
import type { GameCommand } from '../commands/types';
import type { GameEvent } from '../events/types';
import type { BattleState } from '../model/battle';
import type { EffectDefinition } from '../model/card';
import type { RewardItem } from '../model/reward';
import { isLegalMapStep, pruneMapEdgesToAlive } from '../model/mapGraph';
import type { RunState } from '../model/run';
import type { CombatUnit } from '../model/unit';
import { mulberry32 } from '../utils/rng';
import { shuffleInPlace } from '../utils/shuffle';
import { buildFloor2Nodes } from './createMapRun';
import { WANDERING_MERCHANT_EVENT_ID } from './generateBranchingFloor';
import {
  buildInitialBattle,
  DEFAULT_ENEMY_LINEUP,
  lineupBoss,
  lineupElite,
} from './createMvpRun';
import { generateCardRewardChoices } from './generateRewardChoices';
import { generateShop, SHOP_MIN_MASTER_DECK_SIZE } from './generateShop';
import { rollPostBattlePotionOffer, skipCardGoldAmount } from './postBattleExtras';
import { rewardEncounterTierFromRun } from './rewardEncounter';

export interface EngineResult {
  nextRun: RunState;
  events: GameEvent[];
}

const BASE_REWARD_CARD_GOLD = 15;

function hashMapNodeId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = Math.imul(31, h) + id.charCodeAt(i);
  }
  return h | 0;
}

function syncRunPlayerFromBattle(run: RunState): void {
  const b = run.battle;
  if (!b) return;
  const u = b.units[b.playerUnitId];
  if (u) {
    run.player.currentHp = u.hp;
    run.player.maxHp = u.maxHp;
  }
}

function nextEnemyDamage(moveCount: number): number {
  return moveCount % 2 === 0 ? 6 : 9;
}

function refreshEnemyIntent(battle: BattleState, enemyUnitId: string): void {
  const m = battle.monsters[enemyUnitId];
  if (m) {
    m.intent = { type: 'attack', value: nextEnemyDamage(m.moveHistory.length) };
  }
}

function tickEndOfPlayerTurnStatuses(battle: BattleState): void {
  const p = battle.units[battle.playerUnitId];
  if (p) decayStatus(p, STATUS_WEAK, 1);
  for (const eid of battle.enemyUnitIds) {
    const u = battle.units[eid];
    if (u) decayStatus(u, STATUS_VULNERABLE, 1);
  }
}

function drawUpTo(
  battle: BattleState,
  count: number,
  events: GameEvent[],
  random: () => number,
): void {
  let need = count - battle.player.hand.length;
  while (need > 0) {
    if (battle.player.drawPile.length === 0) {
      if (battle.player.discardPile.length === 0) break;
      battle.player.drawPile = [...battle.player.discardPile];
      battle.player.discardPile = [];
      shuffleInPlace(battle.player.drawPile, random);
    }
    const id = battle.player.drawPile.shift();
    if (!id) break;
    battle.player.hand.push(id);
    events.push({
      type: 'CARD_DRAWN',
      unitId: battle.playerUnitId,
      cardInstanceId: id,
    });
    need -= 1;
  }
}

/** 出牌效果用：额外抽 n 张（与当前手牌目标张数无关） */
function drawAdditionalCards(
  battle: BattleState,
  n: number,
  events: GameEvent[],
  random: () => number,
): void {
  for (let i = 0; i < n; i++) {
    if (battle.player.drawPile.length === 0) {
      if (battle.player.discardPile.length === 0) break;
      battle.player.drawPile = [...battle.player.discardPile];
      battle.player.discardPile = [];
      shuffleInPlace(battle.player.drawPile, random);
    }
    const id = battle.player.drawPile.shift();
    if (!id) break;
    battle.player.hand.push(id);
    events.push({
      type: 'CARD_DRAWN',
      unitId: battle.playerUnitId,
      cardInstanceId: id,
    });
  }
}

function discardHand(battle: BattleState): void {
  const { hand, discardPile } = battle.player;
  while (hand.length) {
    const id = hand.shift();
    if (id) discardPile.push(id);
  }
}

function dealDamageTo(
  battle: BattleState,
  sourceId: string,
  target: CombatUnit,
  baseAmount: number,
  events: GameEvent[],
): void {
  if (!target.alive) return;
  const source = battle.units[sourceId];
  let remaining = source ? modifyOutgoingAttackDamage(source, baseAmount) : baseAmount;
  remaining = modifyIncomingAttackDamage(target, remaining);

  const blockAbsorb = Math.min(target.block, remaining);
  if (blockAbsorb > 0) {
    target.block -= blockAbsorb;
    remaining -= blockAbsorb;
  }
  const hpLoss = Math.min(target.hp, remaining);
  target.hp -= hpLoss;
  if (hpLoss > 0) {
    events.push({
      type: 'DAMAGE_DEALT',
      sourceUnitId: sourceId,
      targetUnitId: target.id,
      value: hpLoss,
    });
  }
  target.alive = target.hp > 0;
  if (!target.alive) {
    events.push({ type: 'UNIT_DIED', unitId: target.id });
  }
}

function applyEffects(
  battle: BattleState,
  effects: EffectDefinition[],
  sourceUnitId: string,
  targetUnitId: string | undefined,
  events: GameEvent[],
  random: () => number,
): void {
  const playerUnit = battle.units[battle.playerUnitId];
  for (const e of effects) {
    if (e.type === 'damage') {
      if (e.target === 'all_enemies') {
        for (const eid of battle.enemyUnitIds) {
          const t = battle.units[eid];
          if (t?.alive) dealDamageTo(battle, sourceUnitId, t, e.value, events);
        }
      } else {
        const tid =
          e.target === 'selected'
            ? targetUnitId
            : e.target === 'self'
              ? sourceUnitId
              : battle.enemyUnitIds[0];
        if (!tid) continue;
        const t = battle.units[tid];
        if (!t) continue;
        dealDamageTo(battle, sourceUnitId, t, e.value, events);
      }
    } else if (e.type === 'block') {
      const tid = e.target === 'self' ? sourceUnitId : targetUnitId;
      if (!tid) continue;
      const t = battle.units[tid];
      if (!t) continue;
      t.block += e.value;
      events.push({ type: 'BLOCK_GAINED', unitId: tid, value: e.value });
    } else if (e.type === 'apply_status') {
      const tid = e.target === 'self' ? battle.playerUnitId : targetUnitId;
      if (!tid) continue;
      const t = battle.units[tid];
      if (!t) continue;
      addStatusStacks(t, e.statusId, e.stacks);
      events.push({
        type: 'STATUS_APPLIED',
        unitId: tid,
        statusId: e.statusId,
        value: getStatusStacks(t, e.statusId),
      });
    } else if (e.type === 'draw') {
      drawAdditionalCards(battle, e.value, events, random);
    } else if (e.type === 'gain_energy') {
      battle.player.energy += e.value;
      events.push({
        type: 'ENERGY_CHANGED',
        unitId: battle.playerUnitId,
        value: battle.player.energy,
      });
    }
  }
  if (playerUnit && !playerUnit.alive) {
    events.push({ type: 'BATTLE_LOST' });
  }
  const allDead = battle.enemyUnitIds.every((id) => !battle.units[id]?.alive);
  if (allDead) {
    events.push({ type: 'BATTLE_WON' });
  }
}

export class GameEngine {
  dispatch(run: RunState, command: GameCommand): EngineResult {
    const nextRun = structuredClone(run);
    const events: GameEvent[] = [];

    switch (command.type) {
      case 'PLAY_CARD':
        this.playCard(nextRun, command, events);
        break;
      case 'END_TURN':
        this.endTurn(nextRun, events);
        break;
      case 'CHOOSE_MAP_NODE':
        this.chooseMapNode(nextRun, command, events);
        break;
      case 'LEAVE_BATTLE_TO_REWARD':
        this.leaveBattleToReward(nextRun, events);
        break;
      case 'SELECT_REWARD_CARD':
        this.selectRewardCard(nextRun, command, events);
        break;
      case 'TAKE_REWARD_GOLD':
        this.takeRewardGold(nextRun, command, events);
        break;
      case 'BUY_SHOP_CARD':
        this.buyShopCard(nextRun, command, events);
        break;
      case 'BUY_SHOP_RELIC':
        this.buyShopRelic(nextRun, command, events);
        break;
      case 'BUY_SHOP_REMOVE_CARD':
        this.buyShopRemoveCard(nextRun, command, events);
        break;
      case 'LEAVE_SHOP_TO_MAP':
        this.leaveShopToMap(nextRun);
        break;
      case 'LEAVE_REST_TO_MAP':
        this.leaveRestToMap(nextRun);
        break;
      case 'RESOLVE_EVENT_OPTION':
        this.resolveEventOption(nextRun, command, events);
        break;
      case 'USE_POTION':
        this.usePotion(nextRun, command, events);
        break;
      case 'BUY_SHOP_POTION':
        this.buyShopPotion(nextRun, command, events);
        break;
      default:
        break;
    }

    syncRunPlayerFromBattle(nextRun);
    this.applyGameOverIfDefeat(nextRun, events);
    return { nextRun, events };
  }

  /** 同步 HP 后：失败则切到全局结算屏并卸下战斗状态（供 App 显示 game_over）。 */
  private applyGameOverIfDefeat(run: RunState, events: GameEvent[]): void {
    if (run.battle?.phase !== 'defeat') return;
    run.battle = undefined;
    run.screen = { type: 'game_over' };
    events.push({ type: 'ENTERED_GAME_OVER' });
  }

  private playCard(
    run: RunState,
    command: Extract<GameCommand, { type: 'PLAY_CARD' }>,
    events: GameEvent[],
  ): void {
    const battle = run.battle;
    if (!battle || battle.phase !== 'player_action') return;

    const { cardInstanceId, sourceUnitId, targetUnitId } = command;
    if (sourceUnitId !== battle.playerUnitId) return;
    if (!battle.player.hand.includes(cardInstanceId)) return;

    const card = battle.player.cards[cardInstanceId];
    if (!card) return;

    const def = CARD_DEFINITIONS[card.definitionId];
    if (!def) return;

    if (battle.player.energy < card.costForTurn) return;

    if (def.target === 'single_enemy') {
      if (!targetUnitId) return;
      const t = battle.units[targetUnitId];
      if (!t || t.side !== 'enemy' || !t.alive) return;
      if (!battle.enemyUnitIds.includes(targetUnitId)) return;
    }
    if (def.target === 'all_enemies' && targetUnitId) return;

    battle.player.energy -= card.costForTurn;
    events.push({
      type: 'ENERGY_CHANGED',
      unitId: battle.playerUnitId,
      value: battle.player.energy,
    });

    battle.player.hand = battle.player.hand.filter((id) => id !== cardInstanceId);
    battle.player.discardPile.push(cardInstanceId);

    events.push({
      type: 'CARD_PLAYED',
      unitId: sourceUnitId,
      cardInstanceId,
      targetUnitId,
    });

    const effectRng = mulberry32((run.seed ^ battle.turn * 0xc001d ^ cardInstanceId.length * 0x9e37) >>> 0);
    applyEffects(battle, def.effects, sourceUnitId, targetUnitId, events, () => effectRng());

    if (events.some((e) => e.type === 'BATTLE_WON')) {
      battle.phase = 'victory';
    }
    if (events.some((e) => e.type === 'BATTLE_LOST')) {
      battle.phase = 'defeat';
    }
  }

  private endTurn(run: RunState, events: GameEvent[]): void {
    const battle = run.battle;
    if (!battle || battle.phase !== 'player_action') return;

    discardHand(battle);
    events.push({ type: 'TURN_ENDED', unitId: battle.playerUnitId });
    tickEndOfPlayerTurnStatuses(battle);

    battle.phase = 'enemy_turn';
    const player = battle.units[battle.playerUnitId];
    if (!player) return;

    for (const eid of battle.enemyUnitIds) {
      const enemy = battle.units[eid];
      const monster = battle.monsters[eid];
      if (!enemy?.alive || !monster?.intent || monster.intent.type !== 'attack') continue;
      const dmg = monster.intent.value;
      dealDamageTo(battle, eid, player, dmg, events);
      monster.moveHistory.push('attack');
      refreshEnemyIntent(battle, eid);
      if (!player.alive) break;
    }

    if (!player.alive) {
      events.push({ type: 'BATTLE_LOST' });
      battle.phase = 'defeat';
      syncRunPlayerFromBattle(run);
      return;
    }

    battle.turn += 1;
    events.push({
      type: 'TURN_STARTED',
      turn: battle.turn,
      unitId: battle.playerUnitId,
    });

    player.block = 0;
    battle.player.energy = battle.player.maxEnergy;
    events.push({
      type: 'ENERGY_CHANGED',
      unitId: battle.playerUnitId,
      value: battle.player.energy,
    });

    const rng = mulberry32(run.seed ^ battle.turn * 0x1bf58);
    const random = () => rng();
    drawUpTo(battle, 5, events, random);

    battle.phase = 'player_action';
  }

  private chooseMapNode(
    run: RunState,
    command: Extract<GameCommand, { type: 'CHOOSE_MAP_NODE' }>,
    events: GameEvent[],
  ): void {
    if (run.screen.type !== 'map') return;

    const { nodeId } = command;
    const { map } = run;
    const node = map.nodes[nodeId];
    if (!node) return;

    const curId = map.currentNodeId;
    if (!curId) return;
    const cur = map.nodes[curId];
    if (!cur || !isLegalMapStep(map.nodes, curId, nodeId)) return;

    node.visited = true;
    map.currentNodeId = nodeId;
    pruneMapEdgesToAlive(map);

    if (node.type === 'battle' || node.type === 'elite' || node.type === 'boss') {
      const key = `map_${nodeId}`;
      let enemySlots = DEFAULT_ENEMY_LINEUP;
      if (node.type === 'boss') enemySlots = lineupBoss();
      else if (node.type === 'elite') enemySlots = lineupElite();
      run.battle = buildInitialBattle(
        run.seed,
        { currentHp: run.player.currentHp, maxHp: run.player.maxHp },
        key,
        run.masterDeck,
        enemySlots,
        run.meta.relics,
      );
      run.screen = { type: 'battle' };
      events.push({ type: 'ENTERED_BATTLE_FROM_MAP', nodeId });
      return;
    }
    if (node.type === 'event' && node.eventScriptId === WANDERING_MERCHANT_EVENT_ID) {
      run.screen = { type: 'event', eventId: WANDERING_MERCHANT_EVENT_ID };
      return;
    }
    /** 其它 event 节点（含层首营地）：仅占点，不进入子屏 */
    if (node.type === 'event') {
      return;
    }
    if (node.type === 'shop') {
      run.shop = generateShop(run.seed, run.meta.floor, run.meta.relics);
      run.screen = { type: 'shop' };
      events.push({ type: 'ENTERED_SHOP_FROM_MAP', nodeId });
      return;
    }
    if (node.type === 'rest') {
      run.screen = { type: 'rest' };
      events.push({ type: 'ENTERED_REST_FROM_MAP', nodeId });
    }
  }

  /** naobao：战斗胜利 → RewardState → screen reward */
  private leaveBattleToReward(run: RunState, events: GameEvent[]): void {
    const battle = run.battle;
    if (!battle || battle.phase !== 'victory') return;

    const curId = run.map.currentNodeId;
    const tier = rewardEncounterTierFromRun(run);
    const salt =
      (run.seed ^ run.meta.gold ^ 0xdec0de ^ hashMapNodeId(curId ?? '')) >>> 0;
    const cards = generateCardRewardChoices(run.seed, salt, tier);

    const items: RewardItem[] = [{ type: 'card_choice', cards }];
    if (tier === 'elite') items.push({ type: 'gold', amount: 25 });
    if (tier === 'boss') {
      items.push({ type: 'gold', amount: 45 });
      const relicId = rollBossRelicReward(run.seed, salt, run.meta.relics);
      if (relicId) items.push({ type: 'relic', relicId });
    }
    const potionId = rollPostBattlePotionOffer(
      run.seed,
      salt,
      tier,
      run.meta.potions.length,
    );
    if (potionId) items.push({ type: 'potion', potionId });

    run.reward = {
      items,
      claimed: false,
    };
    run.battle = undefined;
    run.screen = { type: 'reward' };
    events.push({ type: 'ENTERED_REWARD_FROM_BATTLE' });
  }

  private settlePostBattleReward(
    run: RunState,
    events: GameEvent[],
    pick: { kind: 'card'; definitionId: string } | { kind: 'skip_card' },
  ): void {
    if (run.screen.type !== 'reward' || !run.reward || run.reward.claimed) return;

    const tier = rewardEncounterTierFromRun(run);

    if (pick.kind === 'card') {
      run.masterDeck.push(pick.definitionId);
    }

    let goldGain = pick.kind === 'card' ? BASE_REWARD_CARD_GOLD : skipCardGoldAmount(tier);
    for (const it of run.reward.items) {
      if (it.type === 'gold') goldGain += it.amount;
    }
    for (const it of run.reward.items) {
      if (it.type === 'relic' && RELIC_DEFINITIONS[it.relicId]) {
        if (!run.meta.relics.includes(it.relicId)) {
          run.meta.relics.push(it.relicId);
          applyRelicPickupEffect(run, it.relicId);
        }
      }
    }
    for (const it of run.reward.items) {
      if (it.type === 'potion' && POTION_DEFINITIONS[it.potionId]) {
        if (run.meta.potions.length < MAX_POTIONS) {
          run.meta.potions.push(it.potionId);
        }
      }
    }

    run.reward = undefined;
    run.meta.gold += goldGain;

    const mapNodeId = run.map.currentNodeId;
    const mapNode = mapNodeId ? run.map.nodes[mapNodeId] : undefined;
    const beatBoss = mapNode?.type === 'boss';

    if (beatBoss && run.meta.floor === 1) {
      run.meta.floor = 2;
      const f2 = buildFloor2Nodes((run.seed ^ 0xaced) >>> 0);
      const f2Start = Object.keys(f2).find((id) => f2[id]!.x === 0) ?? Object.keys(f2)[0]!;
      run.map = {
        nodes: f2,
        currentNodeId: f2Start,
      };
      run.screen = { type: 'map' };
    } else if (beatBoss && run.meta.floor === 2) {
      run.screen = { type: 'victory' };
    } else {
      run.screen = { type: 'map' };
    }

    events.push({ type: 'RETURNED_TO_MAP_FROM_BATTLE' });
  }

  private selectRewardCard(
    run: RunState,
    command: Extract<GameCommand, { type: 'SELECT_REWARD_CARD' }>,
    events: GameEvent[],
  ): void {
    if (run.screen.type !== 'reward' || !run.reward || run.reward.claimed) return;
    const { definitionId } = command;
    if (!CARD_DEFINITIONS[definitionId]) return;

    const choice = run.reward.items.find((i) => i.type === 'card_choice');
    if (!choice || choice.type !== 'card_choice') return;
    if (!choice.cards.includes(definitionId)) return;

    this.settlePostBattleReward(run, events, { kind: 'card', definitionId });
  }

  private takeRewardGold(
    run: RunState,
    command: Extract<GameCommand, { type: 'TAKE_REWARD_GOLD' }>,
    events: GameEvent[],
  ): void {
    if (run.screen.type !== 'reward' || !run.reward || run.reward.claimed) return;
    const tier = rewardEncounterTierFromRun(run);
    if (command.amount !== skipCardGoldAmount(tier)) return;
    const choice = run.reward.items.find((i) => i.type === 'card_choice');
    if (!choice || choice.type !== 'card_choice') return;
    this.settlePostBattleReward(run, events, { kind: 'skip_card' });
  }

  private buyShopCard(
    run: RunState,
    command: Extract<GameCommand, { type: 'BUY_SHOP_CARD' }>,
    events: GameEvent[],
  ): void {
    void events;
    if (run.screen.type !== 'shop' || !run.shop) return;
    if (!CARD_DEFINITIONS[command.definitionId]) return;

    const idx = run.shop.cards.findIndex((c) => c.definitionId === command.definitionId);
    if (idx < 0) return;
    const offer = run.shop.cards[idx]!;
    if (run.meta.gold < offer.price) return;

    run.meta.gold -= offer.price;
    run.masterDeck.push(command.definitionId);
    run.shop.cards.splice(idx, 1);
  }

  private buyShopRelic(
    run: RunState,
    command: Extract<GameCommand, { type: 'BUY_SHOP_RELIC' }>,
    events: GameEvent[],
  ): void {
    void events;
    if (run.screen.type !== 'shop' || !run.shop) return;
    if (!RELIC_DEFINITIONS[command.relicId]) return;
    if (run.meta.relics.includes(command.relicId)) return;

    const idx = run.shop.relics.findIndex((r) => r.relicId === command.relicId);
    if (idx < 0) return;
    const offer = run.shop.relics[idx]!;
    if (run.meta.gold < offer.price) return;

    run.meta.gold -= offer.price;
    run.meta.relics.push(command.relicId);
    applyRelicPickupEffect(run, command.relicId);
    run.shop.relics.splice(idx, 1);
  }

  private buyShopRemoveCard(
    run: RunState,
    command: Extract<GameCommand, { type: 'BUY_SHOP_REMOVE_CARD' }>,
    events: GameEvent[],
  ): void {
    void events;
    if (run.screen.type !== 'shop' || !run.shop) return;
    if (!CARD_DEFINITIONS[command.definitionId]) return;
    if (run.masterDeck.length <= SHOP_MIN_MASTER_DECK_SIZE) return;

    const price = run.shop.removeCardPrice;
    if (run.meta.gold < price) return;

    const idx = run.masterDeck.indexOf(command.definitionId);
    if (idx < 0) return;

    run.meta.gold -= price;
    run.masterDeck.splice(idx, 1);
  }

  private leaveShopToMap(run: RunState): void {
    if (run.screen.type !== 'shop') return;
    run.screen = { type: 'map' };
    run.shop = undefined;
  }

  private leaveRestToMap(run: RunState): void {
    if (run.screen.type !== 'rest') return;
    const heal = Math.floor(run.player.maxHp * 0.3);
    run.player.currentHp = Math.min(run.player.maxHp, run.player.currentHp + heal);
    run.screen = { type: 'map' };
  }

  private usePotion(
    run: RunState,
    command: Extract<GameCommand, { type: 'USE_POTION' }>,
    events: GameEvent[],
  ): void {
    const battle = run.battle;
    if (!battle || battle.phase !== 'player_action') return;

    const { slotIndex } = command;
    if (slotIndex < 0 || slotIndex >= run.meta.potions.length) return;
    const potionId = run.meta.potions[slotIndex];
    const def = POTION_DEFINITIONS[potionId];
    if (!def) return;

    const playerUnit = battle.units[battle.playerUnitId];
    if (!playerUnit) return;

    const heal = def.healAmount;
    playerUnit.hp = Math.min(playerUnit.maxHp, playerUnit.hp + heal);
    run.player.currentHp = playerUnit.hp;
    run.meta.potions.splice(slotIndex, 1);
    events.push({ type: 'POTION_USED', potionId, value: heal });
  }

  private buyShopPotion(
    run: RunState,
    command: Extract<GameCommand, { type: 'BUY_SHOP_POTION' }>,
    events: GameEvent[],
  ): void {
    void events;
    if (run.screen.type !== 'shop' || !run.shop) return;
    if (!POTION_DEFINITIONS[command.potionId]) return;
    if (run.meta.potions.length >= MAX_POTIONS) return;

    const idx = run.shop.potions.findIndex((p) => p.potionId === command.potionId);
    if (idx < 0) return;
    const offer = run.shop.potions[idx]!;
    if (run.meta.gold < offer.price) return;

    run.meta.gold -= offer.price;
    run.meta.potions.push(command.potionId);
    run.shop.potions.splice(idx, 1);
  }

  private resolveEventOption(
    run: RunState,
    command: Extract<GameCommand, { type: 'RESOLVE_EVENT_OPTION' }>,
    events: GameEvent[],
  ): void {
    if (run.screen.type !== 'event') return;
    const { eventId } = run.screen;
    const { optionId } = command;
    if (eventId === WANDERING_MERCHANT_EVENT_ID) {
      if (optionId === 'gold') run.meta.gold += 25;
      else if (optionId === 'heal') {
        run.player.currentHp = Math.min(run.player.maxHp, run.player.currentHp + 12);
      } else if (optionId === 'relic') {
        if (!run.meta.relics.includes('vajra')) run.meta.relics.push('vajra');
      } else return;
      run.screen = { type: 'map' };
      events.push({ type: 'EVENT_RESOLVED', eventId, optionId });
    }
  }
}
