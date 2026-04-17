import { describe, expect, test } from '@rstest/core';
import { addStatusStacks } from '@/game/core/combat/statusCombat';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { buildFloor2Nodes, createMapRun } from '@/game/core/engine/createMapRun';
import { generateBranchingFloorMap } from '@/game/core/engine/generateBranchingFloor';
import { rollPostBattlePotionOffer } from '@/game/core/engine/postBattleExtras';
import { createMvpRun, ENEMY_UNIT_ID, PLAYER_UNIT_ID } from '@/game/core/engine/createMvpRun';
import { CLEAVE } from '@/game/core/definitions/cards/starter';
import {
  STATUS_MOMENTUM,
  STATUS_STRENGTH,
  STATUS_VULNERABLE,
  STATUS_WEAK,
} from '@/game/core/definitions/statuses';
import type { MapNode } from '@/game/core/model/map';
import { isLegalMapStep, markVisitedFromCampTo, pickPredecessorId } from '@/game/core/model/mapGraph';
import type { RunState } from '@/game/core/model/run';

function jumpToBeforeNode(run: RunState, targetId: string): void {
  const p = pickPredecessorId(run.map, targetId);
  if (!p) throw new Error(`no predecessor for ${targetId}`);
  markVisitedFromCampTo(run.map, p);
  run.map.currentNodeId = p;
}

function firstBattleFromCamp(run: RunState): string {
  const cur = run.map.currentNodeId!;
  const b = run.map.nodes[cur]!.nextNodeIds.find((id) => run.map.nodes[id]!.type === 'battle');
  if (!b) throw new Error('no battle from camp');
  return b;
}

function findNodeId(run: RunState, pred: (n: MapNode) => boolean): string {
  const n = Object.values(run.map.nodes).find(pred);
  if (!n) throw new Error('map node not found');
  return n.id;
}

describe('GameEngine MVP', () => {
  test('单体牌无目标先进入 selecting_target，再命中目标后结算并进入动画锁', () => {
    const engine = new GameEngine();
    let run = createMvpRun(10);
    const strikeId = run.battle!.player.hand.find(
      (id) => run.battle!.player.cards[id].definitionId === 'strike',
    )!;

    run = engine
      .dispatch(run, {
        type: 'PLAY_CARD',
        cardInstanceId: strikeId,
        sourceUnitId: PLAYER_UNIT_ID,
      })
      .nextRun;

    expect(run.battle!.inputMode).toBe('selecting_target');
    expect(run.battle!.pendingAction?.cardInstanceId).toBe(strikeId);
    expect(run.battle!.player.hand.includes(strikeId)).toBe(true);

    const { nextRun, events } = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: strikeId,
      sourceUnitId: PLAYER_UNIT_ID,
      targetUnitId: ENEMY_UNIT_ID,
    });
    run = nextRun;
    expect(events.some((e) => e.type === 'DAMAGE_DEALT')).toBe(true);
    expect(run.battle!.inputMode).toBe('animation_lock');
    expect(run.battle!.pendingAction).toBeNull();
    expect(run.battle!.lastResolvedEvents.length).toBeGreaterThan(0);
    expect(
      run.battle!.lastResolvedEvents.some(
        (e) => e.type === 'CARD_PLAYED' && e.cardInstanceId === strikeId,
      ),
    ).toBe(true);
  });

  test('RESOLVE_ANIMATION_DONE 会清空事件缓存并恢复 idle', () => {
    const engine = new GameEngine();
    let run = createMvpRun(11);
    const strikeId = run.battle!.player.hand.find(
      (id) => run.battle!.player.cards[id].definitionId === 'strike',
    )!;
    run = engine
      .dispatch(run, {
        type: 'PLAY_CARD',
        cardInstanceId: strikeId,
        sourceUnitId: PLAYER_UNIT_ID,
        targetUnitId: ENEMY_UNIT_ID,
      })
      .nextRun;
    expect(run.battle!.inputMode).toBe('animation_lock');
    expect(run.battle!.lastResolvedEvents.length).toBeGreaterThan(0);

    run = engine.dispatch(run, { type: 'RESOLVE_ANIMATION_DONE' }).nextRun;
    expect(run.battle!.inputMode).toBe('idle');
    expect(run.battle!.lastResolvedEvents).toEqual([]);
  });

  test('打击对敌人造成伤害', () => {
    const engine = new GameEngine();
    let run = createMvpRun(1);
    const strikeId = run.battle!.player.hand.find(
      (id) => run.battle!.player.cards[id].definitionId === 'strike',
    );
    expect(strikeId).toBeDefined();

    const { nextRun, events } = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: strikeId!,
      sourceUnitId: PLAYER_UNIT_ID,
      targetUnitId: ENEMY_UNIT_ID,
    });
    run = nextRun;
    expect(events.some((e) => e.type === 'DAMAGE_DEALT')).toBe(true);
    const enemyHp = run.battle!.units[ENEMY_UNIT_ID].hp;
    expect(enemyHp).toBeLessThan(40);
  });

  test('防御不加目标也可打出并获得格挡', () => {
    const engine = new GameEngine();
    let run = createMvpRun(3);
    const defendId = run.battle!.player.hand.find(
      (id) => run.battle!.player.cards[id].definitionId === 'defend',
    );
    expect(defendId).toBeDefined();
    const blockBefore = run.battle!.units[PLAYER_UNIT_ID].block;

    const { nextRun, events } = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: defendId!,
      sourceUnitId: PLAYER_UNIT_ID,
    });
    run = nextRun;
    expect(events.some((e) => e.type === 'BLOCK_GAINED')).toBe(true);
    expect(run.battle!.units[PLAYER_UNIT_ID].block).toBe(blockBefore + 5);
    expect(run.battle!.player.hand.includes(defendId!)).toBe(false);
  });

  test('连势（momentum）在出牌后触发：加格挡并衰减 1 层', () => {
    const engine = new GameEngine();
    let run = createMvpRun(4);
    addStatusStacks(run.battle!.units[PLAYER_UNIT_ID], STATUS_MOMENTUM, 2);
    const defendId = run.battle!.player.hand.find(
      (id) => run.battle!.player.cards[id].definitionId === 'defend',
    )!;
    run = engine
      .dispatch(run, {
        type: 'PLAY_CARD',
        cardInstanceId: defendId,
        sourceUnitId: PLAYER_UNIT_ID,
      })
      .nextRun;
    const p = run.battle!.units[PLAYER_UNIT_ID];
    const momentum = p.statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0;
    expect(p.block).toBe(7);
    expect(momentum).toBe(1);
  });

  test('蓄势牌可赋予连势，随后下一张牌触发额外格挡', () => {
    const engine = new GameEngine();
    let run = createMvpRun(42);
    const momentumCardId = 'test_momentum';
    run.battle!.player.cards[momentumCardId] = {
      instanceId: momentumCardId,
      definitionId: 'momentum',
      baseCost: 1,
      costForTurn: 1,
      upgraded: false,
    };
    run.battle!.player.hand.unshift(momentumCardId);
    run.battle!.player.energy = 3;

    run = engine
      .dispatch(run, {
        type: 'PLAY_CARD',
        cardInstanceId: momentumCardId,
        sourceUnitId: PLAYER_UNIT_ID,
      })
      .nextRun;
    run = engine.dispatch(run, { type: 'RESOLVE_ANIMATION_DONE' }).nextRun;
    const p = run.battle!.units[PLAYER_UNIT_ID];
    expect(p.statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0).toBe(2);

    const defendId = run.battle!.player.hand.find(
      (id) => run.battle!.player.cards[id].definitionId === 'defend',
    )!;
    run = engine
      .dispatch(run, {
        type: 'PLAY_CARD',
        cardInstanceId: defendId,
        sourceUnitId: PLAYER_UNIT_ID,
      })
      .nextRun;
    const p2 = run.battle!.units[PLAYER_UNIT_ID];
    expect(p2.block).toBe(7);
    expect(p2.statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0).toBe(1);
  });

  test('结束回合后敌人攻击并进入下一玩家回合', () => {
    const engine = new GameEngine();
    let run = createMvpRun(2);
    const t1 = run.battle!.turn;
    const { nextRun, events } = engine.dispatch(run, { type: 'END_TURN' });
    run = nextRun;
    expect(events.some((e) => e.type === 'DAMAGE_DEALT' && e.sourceUnitId === ENEMY_UNIT_ID)).toBe(
      true,
    );
    expect(run.battle!.turn).toBe(t1 + 1);
    expect(run.battle!.phase).toBe('player_action');
    expect(run.battle!.player.hand.length).toBe(5);
  });

  test('结束回合触发状态钩子：玩家虚弱与敌人易伤衰减', () => {
    const engine = new GameEngine();
    let run = createMvpRun(12);
    addStatusStacks(run.battle!.units[PLAYER_UNIT_ID], STATUS_WEAK, 2);
    addStatusStacks(run.battle!.units[ENEMY_UNIT_ID], STATUS_VULNERABLE, 1);
    run = engine.dispatch(run, { type: 'END_TURN' }).nextRun;
    const pWeak =
      run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_WEAK)?.stacks ?? 0;
    const eVul =
      run.battle!.units[ENEMY_UNIT_ID].statuses.find((s) => s.id === STATUS_VULNERABLE)?.stacks ?? 0;
    expect(pWeak).toBe(1);
    expect(eVul).toBe(0);
  });
});

describe('GameEngine 战斗修正', () => {
  test('力量增加攻击伤害', () => {
    const engine = new GameEngine();
    let run = createMvpRun(1);
    addStatusStacks(run.battle!.units[PLAYER_UNIT_ID], STATUS_STRENGTH, 2);
    const strikeId = run.battle!.player.hand.find(
      (id) => run.battle!.player.cards[id].definitionId === 'strike',
    )!;
    run = engine
      .dispatch(run, {
        type: 'PLAY_CARD',
        cardInstanceId: strikeId,
        sourceUnitId: PLAYER_UNIT_ID,
        targetUnitId: ENEMY_UNIT_ID,
      })
      .nextRun;
    expect(run.battle!.units[ENEMY_UNIT_ID].hp).toBe(32);
  });

  test('遗物瓦哈纳：开场 +1 力量', () => {
    const engine = new GameEngine();
    let run = createMapRun(5);
    run.meta.relics.push('vajra');
    const battleId = firstBattleFromCamp(run);
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: battleId }).nextRun;
    const stacks =
      run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_STRENGTH)?.stacks ?? 0;
    expect(stacks).toBe(1);
  });

  test('精英节点为精英单敌', () => {
    const engine = new GameEngine();
    let run = createMapRun(8);
    const eliteId = findNodeId(run, (n) => n.type === 'elite' && n.floor === 1);
    jumpToBeforeNode(run, eliteId);
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: eliteId }).nextRun;
    expect(run.map.nodes[eliteId].type).toBe('elite');
    expect(run.battle?.enemyUnitIds.length).toBe(1);
    expect(run.battle?.units[ENEMY_UNIT_ID].maxHp).toBe(48);
  });

  test('商店金币不足无法购买', () => {
    const engine = new GameEngine();
    let run = createMapRun(2);
    const shopId = findNodeId(run, (n) => n.type === 'shop' && n.floor === 1);
    jumpToBeforeNode(run, shopId);
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: shopId }).nextRun;
    run.meta.gold = 0;
    const before = run.masterDeck.length;
    run = engine.dispatch(run, { type: 'BUY_SHOP_CARD', definitionId: 'strike' }).nextRun;
    expect(run.masterDeck.length).toBe(before);
  });
});

describe('药水与全体攻击牌', () => {
  test('战斗内使用药水回复生命', () => {
    const engine = new GameEngine();
    let run = createMapRun(21);
    expect(run.meta.potions.length).toBeGreaterThan(0);
    const battleId = firstBattleFromCamp(run);
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: battleId }).nextRun;
    run.battle!.units[PLAYER_UNIT_ID].hp = 25;
    run.player.currentHp = 25;
    run = engine.dispatch(run, { type: 'USE_POTION', slotIndex: 0 }).nextRun;
    expect(run.meta.potions.length).toBe(0);
    expect(run.battle!.units[PLAYER_UNIT_ID].hp).toBe(35);
  });

  test('商店购买药水', () => {
    const engine = new GameEngine();
    let run = createMapRun(22);
    const shopId = findNodeId(run, (n) => n.type === 'shop' && n.floor === 1);
    jumpToBeforeNode(run, shopId);
    run.meta.gold = 200;
    run.meta.potions = [];
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: shopId }).nextRun;
    expect((run.shop?.potions ?? []).length).toBeGreaterThan(0);
    const pid = run.shop!.potions![0]!.potionId;
    run = engine.dispatch(run, { type: 'BUY_SHOP_POTION', potionId: pid }).nextRun;
    expect(run.meta.potions).toContain(pid);
  });

  test('顺劈牌为全体目标', () => {
    expect(CLEAVE.target).toBe('all_enemies');
    const fx = CLEAVE.effects[0];
    expect(fx?.type).toBe('damage');
    if (fx?.type === 'damage') expect(fx.target).toBe('all_enemies');
  });
});

describe('GameEngine 地图', () => {
  test('每层生成至少一个宝箱节点', () => {
    for (const seed of [0, 1, 2, 99, 12_345]) {
      const n1 = generateBranchingFloorMap(1, seed >>> 0);
      expect(Object.values(n1).some((n) => n.type === 'treasure')).toBe(true);
      const n2 = generateBranchingFloorMap(2, seed >>> 0);
      expect(Object.values(n2).some((n) => n.type === 'treasure')).toBe(true);
    }
  });

  test('宝箱节点进入奖励屏（卡牌+金币，无战斗）', () => {
    const engine = new GameEngine();
    let run = createMapRun(3);
    const treasureId = findNodeId(run, (n) => n.type === 'treasure' && n.floor === 1);
    jumpToBeforeNode(run, treasureId);
    const { nextRun, events } = engine.dispatch(run, {
      type: 'CHOOSE_MAP_NODE',
      nodeId: treasureId,
    });
    run = nextRun;
    expect(
      events.some((e) => e.type === 'ENTERED_REWARD_FROM_TREASURE' && e.nodeId === treasureId),
    ).toBe(true);
    expect(run.screen.type).toBe('reward');
    expect(run.battle).toBeUndefined();
    expect(run.reward?.items.some((i) => i.type === 'card_choice')).toBe(true);
    expect(run.reward?.items.some((i) => i.type === 'gold' && i.amount >= 20 && i.amount <= 30)).toBe(
      true,
    );
    const choice = run.reward!.items.find((i) => i.type === 'card_choice');
    expect(choice && choice.type === 'card_choice' ? choice.cards.length : 0).toBe(3);
  });

  test('走过岔路后剪枝：营地只保留已选首步，未选首层节点出边清空', () => {
    const engine = new GameEngine();
    let run = createMapRun(88);
    const camp = run.map.currentNodeId!;
    const nxt = [...run.map.nodes[camp]!.nextNodeIds];
    expect(nxt.length).toBeGreaterThanOrEqual(1);
    const pick = nxt[0]!;
    const unpicked = nxt.find((id) => id !== pick);
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: pick }).nextRun;
    expect(run.map.nodes[camp]!.nextNodeIds).toEqual([pick]);
    if (unpicked) {
      expect(run.map.nodes[unpicked]!.nextNodeIds.length).toBe(0);
    }
  });

  test('不能一步跳到非邻接节点（岔路未连边则拒绝）', () => {
    const engine = new GameEngine();
    let run = createMapRun(77);
    const camp = run.map.currentNodeId!;
    const far = Object.values(run.map.nodes).find((n) => n.x >= 3 && n.type === 'battle');
    expect(far).toBeDefined();
    expect(isLegalMapStep(run.map.nodes, camp, far!.id)).toBe(false);
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: far!.id }).nextRun;
    expect(run.map.currentNodeId).toBe(camp);
    expect(run.screen.type).toBe('map');
  });

  test('从地图选战斗节点进入战斗并发出 ENTERED_BATTLE_FROM_MAP', () => {
    const engine = new GameEngine();
    let run = createMapRun(99);
    expect(run.screen.type).toBe('map');
    const campId = run.map.currentNodeId!;
    expect(run.map.nodes[campId]!.x).toBe(0);

    const battleId = firstBattleFromCamp(run);
    const { nextRun, events } = engine.dispatch(run, {
      type: 'CHOOSE_MAP_NODE',
      nodeId: battleId,
    });
    run = nextRun;
    expect(run.screen.type).toBe('battle');
    expect(run.battle?.id).toBe(`map_${battleId}`);
    expect(run.map.nodes[battleId]!.visited).toBe(true);
    expect(run.map.currentNodeId).toBe(battleId);
    expect(events.some((e) => e.type === 'ENTERED_BATTLE_FROM_MAP' && e.nodeId === battleId)).toBe(
      true,
    );
  });

  test('胜利后 LEAVE_BATTLE_TO_REWARD → 选牌回地图并加金币', () => {
    const engine = new GameEngine();
    let run = createMapRun(7);
    run = engine
      .dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: firstBattleFromCamp(run) })
      .nextRun;
    expect(run.battle).toBeDefined();
    run.battle!.phase = 'victory';

    run = engine.dispatch(run, { type: 'LEAVE_BATTLE_TO_REWARD' }).nextRun;
    expect(run.screen.type).toBe('reward');
    expect(run.reward?.items.some((i) => i.type === 'card_choice')).toBe(true);
    const choice = run.reward!.items.find((i) => i.type === 'card_choice');
    if (!choice || choice.type !== 'card_choice') throw new Error('expected card_choice');
    const pick = choice.cards[0]!;

    const { nextRun, events } = engine.dispatch(run, {
      type: 'SELECT_REWARD_CARD',
      definitionId: pick,
    });
    run = nextRun;
    expect(run.screen.type).toBe('map');
    expect(run.battle).toBeUndefined();
    expect(run.meta.gold).toBe(15);
    expect(run.masterDeck.length).toBe(11);
    expect(events.some((e) => e.type === 'RETURNED_TO_MAP_FROM_BATTLE')).toBe(true);
  });

  test('TAKE_REWARD_GOLD 放弃卡牌按普通战档位换金', () => {
    const engine = new GameEngine();
    let run = createMapRun(44);
    run = engine
      .dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: firstBattleFromCamp(run) })
      .nextRun;
    run.battle!.phase = 'victory';
    run = engine.dispatch(run, { type: 'LEAVE_BATTLE_TO_REWARD' }).nextRun;
    const deckLen = run.masterDeck.length;
    run = engine.dispatch(run, { type: 'TAKE_REWARD_GOLD', amount: 30 }).nextRun;
    expect(run.masterDeck.length).toBe(deckLen);
    expect(run.meta.gold).toBe(30);
    expect(run.screen.type).toBe('map');
  });

  test('TAKE_REWARD_GOLD 金额不符则不结算', () => {
    const engine = new GameEngine();
    let run = createMapRun(45);
    run = engine
      .dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: firstBattleFromCamp(run) })
      .nextRun;
    run.battle!.phase = 'victory';
    run = engine.dispatch(run, { type: 'LEAVE_BATTLE_TO_REWARD' }).nextRun;
    const deckLen = run.masterDeck.length;
    const goldBefore = run.meta.gold;
    run = engine.dispatch(run, { type: 'TAKE_REWARD_GOLD', amount: 99 }).nextRun;
    expect(run.screen.type).toBe('reward');
    expect(run.masterDeck.length).toBe(deckLen);
    expect(run.meta.gold).toBe(goldBefore);
  });

  test('精英战后 LEAVE_BATTLE_TO_REWARD 含额外金币', () => {
    const engine = new GameEngine();
    let run = createMapRun(12);
    const eliteId = findNodeId(run, (n) => n.type === 'elite' && n.floor === 1);
    jumpToBeforeNode(run, eliteId);
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: eliteId }).nextRun;
    expect(run.map.currentNodeId).toBe(eliteId);
    run.battle!.phase = 'victory';
    run = engine.dispatch(run, { type: 'LEAVE_BATTLE_TO_REWARD' }).nextRun;
    expect(run.reward?.items.some((i) => i.type === 'gold' && i.amount === 25)).toBe(true);
    expect(run.reward?.items.some((i) => i.type === 'potion' && i.potionId === 'healing_dew')).toBe(
      true,
    );
    const cardChoice = run.reward!.items.find((i) => i.type === 'card_choice');
    if (!cardChoice || cardChoice.type !== 'card_choice') throw new Error('expected card_choice');
    const potionsBefore = run.meta.potions.length;
    run = engine
      .dispatch(run, { type: 'SELECT_REWARD_CARD', definitionId: cardChoice.cards[0]! })
      .nextRun;
    expect(run.meta.gold).toBe(40);
    expect(run.meta.potions.length).toBe(potionsBefore + 1);
  });

  test('Boss 战后额外金币高于精英并可能掉落遗物', () => {
    const engine = new GameEngine();
    let run = createMapRun(13);
    const bossId = findNodeId(run, (n) => n.type === 'boss' && n.floor === 1);
    jumpToBeforeNode(run, bossId);
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: bossId }).nextRun;
    run.battle!.phase = 'victory';
    run = engine.dispatch(run, { type: 'LEAVE_BATTLE_TO_REWARD' }).nextRun;
    expect(run.reward?.items.some((i) => i.type === 'gold' && i.amount === 45)).toBe(true);
    expect(run.reward?.items.some((i) => i.type === 'potion' && i.potionId === 'healing_dew')).toBe(
      true,
    );
    const relicEntry = run.reward!.items.find((i) => i.type === 'relic');
    expect(relicEntry?.type).toBe('relic');
    const relicId = relicEntry && relicEntry.type === 'relic' ? relicEntry.relicId : '';
    expect(relicId === 'vajra' || relicId === 'anchor').toBe(true);
    const cardChoice = run.reward!.items.find((i) => i.type === 'card_choice');
    if (!cardChoice || cardChoice.type !== 'card_choice') throw new Error('expected card_choice');
    const bossPotionsBefore = run.meta.potions.length;
    run = engine
      .dispatch(run, { type: 'SELECT_REWARD_CARD', definitionId: cardChoice.cards[0]! })
      .nextRun;
    expect(run.meta.gold).toBe(60);
    expect(run.meta.potions.length).toBe(bossPotionsBefore + 1);
    expect(run.meta.relics).toContain(relicId);
    if (relicId === 'anchor') {
      expect(run.player.maxHp).toBe(55);
    } else {
      expect(run.player.maxHp).toBe(50);
    }
    expect(run.meta.floor).toBe(2);
    const f2Camp = Object.keys(run.map.nodes).find((id) => run.map.nodes[id]!.x === 0);
    expect(run.map.currentNodeId).toBe(f2Camp);
    expect(Object.values(run.map.nodes).some((n) => n.type === 'battle' && n.floor === 2)).toBe(
      true,
    );
    expect(run.screen.type).toBe('map');
  });

  test('第二层 Boss 战后选牌进入通关界面', () => {
    const engine = new GameEngine();
    let run = createMapRun(22);
    run.meta.floor = 2;
    const f2Nodes = buildFloor2Nodes(22);
    const f2BossId = Object.values(f2Nodes).find((n) => n.type === 'boss')!.id;
    f2Nodes[f2BossId]!.visited = true;
    run.map = { nodes: f2Nodes, currentNodeId: f2BossId };
    run.screen = { type: 'reward' };
    run.reward = {
      items: [{ type: 'card_choice', cards: ['strike', 'defend', 'bash'] }],
      claimed: false,
    };
    run = engine
      .dispatch(run, { type: 'SELECT_REWARD_CARD', definitionId: 'strike' })
      .nextRun;
    expect(run.screen.type).toBe('victory');
    expect(run.meta.gold).toBe(15);
  });

  test('Boss 遗物池已空时不重复掉落', () => {
    const engine = new GameEngine();
    let run = createMapRun(14);
    const bossId = findNodeId(run, (n) => n.type === 'boss' && n.floor === 1);
    jumpToBeforeNode(run, bossId);
    run.meta.relics = ['vajra', 'anchor'];
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: bossId }).nextRun;
    run.battle!.phase = 'victory';
    run = engine.dispatch(run, { type: 'LEAVE_BATTLE_TO_REWARD' }).nextRun;
    expect(run.reward?.items.some((i) => i.type === 'relic')).toBe(false);
  });

  test('从地图进入商店节点', () => {
    const engine = new GameEngine();
    let run = createMapRun(3);
    const shopId = findNodeId(run, (n) => n.type === 'shop' && n.floor === 1);
    jumpToBeforeNode(run, shopId);
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: shopId }).nextRun;
    expect(run.screen.type).toBe('shop');
    expect(run.shop?.cards.length).toBe(4);
    expect(run.shop?.relics?.length).toBeGreaterThan(0);
  });

  test('商店购买遗物（船锚加生命）', () => {
    const engine = new GameEngine();
    let run = createMapRun(31);
    const shopId = findNodeId(run, (n) => n.type === 'shop' && n.floor === 1);
    jumpToBeforeNode(run, shopId);
    run.meta.gold = 500;
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: shopId }).nextRun;
    const offer = run.shop!.relics[0]!;
    const hpBefore = run.player.maxHp;
    run = engine.dispatch(run, { type: 'BUY_SHOP_RELIC', relicId: offer.relicId }).nextRun;
    expect(run.meta.relics).toContain(offer.relicId);
    if (offer.relicId === 'anchor') {
      expect(run.player.maxHp).toBe(hpBefore + 5);
    } else {
      expect(run.player.maxHp).toBe(hpBefore);
    }
  });

  test('商店删牌扣费且遵守牌组下限', () => {
    const engine = new GameEngine();
    let run = createMapRun(32);
    const shopId = findNodeId(run, (n) => n.type === 'shop' && n.floor === 1);
    jumpToBeforeNode(run, shopId);
    run.meta.gold = 500;
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: shopId }).nextRun;
    const price = run.shop!.removeCardPrice;
    const beforeLen = run.masterDeck.length;
    const beforeStrike = run.masterDeck.filter((id) => id === 'strike').length;
    run = engine.dispatch(run, { type: 'BUY_SHOP_REMOVE_CARD', definitionId: 'strike' }).nextRun;
    expect(run.masterDeck.length).toBe(beforeLen - 1);
    expect(run.masterDeck.filter((id) => id === 'strike').length).toBe(beforeStrike - 1);
    expect(run.meta.gold).toBe(500 - price);
  });

  test('涌能打出后增加能量', () => {
    const engine = new GameEngine();
    let run = createMapRun(101);
    run = engine
      .dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: firstBattleFromCamp(run) })
      .nextRun;
    const b = run.battle!;
    b.player.cards['t_surge'] = {
      instanceId: 't_surge',
      definitionId: 'surge',
      baseCost: 0,
      costForTurn: 0,
      upgraded: false,
    };
    b.player.hand.push('t_surge');
    const eBefore = b.player.energy;
    run = engine
      .dispatch(run, {
        type: 'PLAY_CARD',
        cardInstanceId: 't_surge',
        sourceUnitId: PLAYER_UNIT_ID,
      })
      .nextRun;
    expect(run.battle!.player.energy).toBe(eBefore + 1);
  });

  test('扫视打出后抽两张牌', () => {
    const engine = new GameEngine();
    let run = createMapRun(102);
    run = engine
      .dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: firstBattleFromCamp(run) })
      .nextRun;
    const b = run.battle!;
    b.player.cards['t_skim'] = {
      instanceId: 't_skim',
      definitionId: 'skim',
      baseCost: 1,
      costForTurn: 1,
      upgraded: false,
    };
    b.player.hand.push('t_skim');
    const handBeforePlay = b.player.hand.length;
    run = engine
      .dispatch(run, {
        type: 'PLAY_CARD',
        cardInstanceId: 't_skim',
        sourceUnitId: PLAYER_UNIT_ID,
      })
      .nextRun;
    expect(run.battle!.player.hand.length).toBe(handBeforePlay + 1);
    expect(run.battle!.player.energy).toBe(2);
  });

  test('玩家阵亡后进入 game_over 并卸下战斗', () => {
    const engine = new GameEngine();
    let run = createMapRun(11);
    run = engine
      .dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: firstBattleFromCamp(run) })
      .nextRun;
    const player = run.battle!.units[PLAYER_UNIT_ID];
    player.hp = 1;
    player.alive = true;
    run.player.currentHp = 1;

    const { nextRun, events } = engine.dispatch(run, { type: 'END_TURN' });
    expect(events.some((e) => e.type === 'BATTLE_LOST')).toBe(true);
    expect(events.some((e) => e.type === 'ENTERED_GAME_OVER')).toBe(true);
    expect(nextRun.screen.type).toBe('game_over');
    expect(nextRun.battle).toBeUndefined();
    expect(nextRun.player.currentHp).toBe(0);
  });
});

describe('postBattleExtras', () => {
  test('普通战后药水 25%：多样本既有掉落也有空', () => {
    let sawPotion = false;
    let sawNone = false;
    for (let i = 0; i < 256; i++) {
      const salt = (i * 0x9e3779b9) >>> 0;
      const r = rollPostBattlePotionOffer(i, salt, 'normal', 0);
      if (r === 'healing_dew') sawPotion = true;
      if (r === null) sawNone = true;
      if (sawPotion && sawNone) break;
    }
    expect(sawPotion).toBe(true);
    expect(sawNone).toBe(true);
  });
});
