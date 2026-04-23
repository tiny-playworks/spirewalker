import { describe, expect, test } from '@rstest/core';
import { addStatusStacks } from '@/game/core/combat/statusCombat';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { buildActNodes, buildFloor2Nodes, createMapRun } from '@/game/core/engine/createMapRun';
import {
  BURST_ALTAR_EVENT_ID,
  generateBranchingFloorMap,
  globalFloorFor,
  PURGING_POOL_EVENT_ID,
  STILLNESS_SHRINE_EVENT_ID,
} from '@/game/core/engine/generateBranchingFloor';
import { rollPostBattlePotionOffer, skipCardGoldAmount } from '@/game/core/engine/postBattleExtras';
import { buildInitialBattle, createMvpRun, ENEMY_UNIT_ID, PLAYER_UNIT_ID, lineupGuard, lineupSapper, lineupShell } from '@/game/core/engine/createMvpRun';
import {
  BRACE_RHYTHM,
  BURST_STRIKE,
  CASH_FLOW,
  CLEAVE,
  FOLLOW_THROUGH,
  PATCH_BREATH,
  PRIME_RHYTHM,
  QUICK_RELEASE,
  RECENTER,
  RELEASE_FLOW,
  SECOND_WIND,
  SNAP_STRIKE,
  SOFT_STEP,
  STEADY_STEP,
  SURVEY_FIELD,
  TEMPO_GUARD,
} from '@/game/core/definitions/cards/starter';
import { RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import { resolveEncounterTemplate } from '@/game/core/definitions/encounters';
import {
  STATUS_MOMENTUM,
  STATUS_STRENGTH,
  STATUS_VULNERABLE,
  STATUS_WEAK,
} from '@/game/core/definitions/statuses';
import type { MapNode } from '@/game/core/model/map';
import { isLegalMapStep, markVisitedFromCampTo, pickPredecessorId } from '@/game/core/model/mapGraph';
import { createEmptyEncounterHistory, type RunState } from '@/game/core/model/run';
import { RUN_SAVE_VERSION } from '@/game/core/persistence/saveVersion';

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

  test('选目标阶段可以取消，并恢复 idle 且不消耗卡牌', () => {
    const engine = new GameEngine();
    let run = createMvpRun(1010);
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

    run = engine.dispatch(run, { type: 'CANCEL_TARGET_SELECTION' }).nextRun;

    expect(run.battle!.inputMode).toBe('idle');
    expect(run.battle!.pendingAction).toBeNull();
    expect(run.battle!.player.hand.includes(strikeId)).toBe(true);
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
    const defendId = 'test_defend';
    run.battle!.player.cards[defendId] = {
      instanceId: defendId,
      definitionId: 'defend',
      baseCost: 1,
      costForTurn: 1,
      upgraded: false,
    };
    run.battle!.player.hand.unshift(defendId);
    const blockBefore = run.battle!.units[PLAYER_UNIT_ID].block;

    const { nextRun, events } = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: defendId,
      sourceUnitId: PLAYER_UNIT_ID,
    });
    run = nextRun;
    expect(events.some((e) => e.type === 'BLOCK_GAINED')).toBe(true);
    expect(run.battle!.units[PLAYER_UNIT_ID].block).toBe(blockBefore + 5);
    expect(run.battle!.player.hand.includes(defendId)).toBe(false);
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

  test('守势在主效果后再触发 momentum：先获得格挡和连势，再按新层数结算 after-play', () => {
    const engine = new GameEngine();
    let run = createMvpRun(77);
    addStatusStacks(run.battle!.units[PLAYER_UNIT_ID], STATUS_MOMENTUM, 1);

    const tempoGuardId = 'test_tempo_guard';
    run.battle!.player.cards[tempoGuardId] = {
      instanceId: tempoGuardId,
      definitionId: TEMPO_GUARD.id,
      baseCost: TEMPO_GUARD.cost,
      costForTurn: TEMPO_GUARD.cost,
      upgraded: false,
    };
    run.battle!.player.hand.unshift(tempoGuardId);

    run = engine
      .dispatch(run, {
        type: 'PLAY_CARD',
        cardInstanceId: tempoGuardId,
        sourceUnitId: PLAYER_UNIT_ID,
      })
      .nextRun;

    const player = run.battle!.units[PLAYER_UNIT_ID];
    expect(player.block).toBe(6);
    expect(player.statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0).toBe(2);
  });

  test('破势击主动消耗全部 momentum，并且 after-play 不再额外转格挡', () => {
    const engine = new GameEngine();
    let run = createMvpRun(78);
    addStatusStacks(run.battle!.units[PLAYER_UNIT_ID], STATUS_MOMENTUM, 3);

    const burstStrikeId = 'test_burst_strike';
    run.battle!.player.cards[burstStrikeId] = {
      instanceId: burstStrikeId,
      definitionId: BURST_STRIKE.id,
      baseCost: BURST_STRIKE.cost,
      costForTurn: BURST_STRIKE.cost,
      upgraded: false,
    };
    run.battle!.player.hand.unshift(burstStrikeId);

    const enemyHpBefore = run.battle!.units[ENEMY_UNIT_ID].hp;
    const { nextRun, events } = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: burstStrikeId,
      sourceUnitId: PLAYER_UNIT_ID,
      targetUnitId: ENEMY_UNIT_ID,
    });
    run = nextRun;

    expect(events.some((e) => e.type === 'DAMAGE_DEALT' && e.value === 13)).toBe(true);
    expect(run.battle!.units[PLAYER_UNIT_ID].block).toBe(0);
    expect(run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_MOMENTUM)).toBeUndefined();
    expect(run.battle!.units[ENEMY_UNIT_ID].hp).toBe(enemyHpBefore - 13);
  });

  test('同一回合连续两张牌时，第 2 张牌读取第 1 张结算后的 momentum', () => {
    const engine = new GameEngine();
    let run = createMvpRun(79);
    addStatusStacks(run.battle!.units[PLAYER_UNIT_ID], STATUS_MOMENTUM, 3);
    const firstDefendId = 'test_first_defend';
    const secondDefendId = 'test_second_defend';
    run.battle!.player.cards[firstDefendId] = {
      instanceId: firstDefendId,
      definitionId: 'defend',
      baseCost: 1,
      costForTurn: 1,
      upgraded: false,
    };
    run.battle!.player.cards[secondDefendId] = {
      instanceId: secondDefendId,
      definitionId: 'defend',
      baseCost: 1,
      costForTurn: 1,
      upgraded: false,
    };
    run.battle!.player.hand.unshift(firstDefendId, secondDefendId);

    run = engine
      .dispatch(run, {
        type: 'PLAY_CARD',
        cardInstanceId: firstDefendId,
        sourceUnitId: PLAYER_UNIT_ID,
      })
      .nextRun;

    let player = run.battle!.units[PLAYER_UNIT_ID];
    expect(player.block).toBe(8);
    expect(player.statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0).toBe(2);

    run = engine.dispatch(run, { type: 'RESOLVE_ANIMATION_DONE' }).nextRun;
    run = engine
      .dispatch(run, {
        type: 'PLAY_CARD',
        cardInstanceId: secondDefendId,
        sourceUnitId: PLAYER_UNIT_ID,
      })
      .nextRun;

    player = run.battle!.units[PLAYER_UNIT_ID];
    expect(player.block).toBe(15);
    expect(player.statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0).toBe(1);
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

  test('干扰型敌人在敌方回合会削减玩家 momentum', () => {
    const engine = new GameEngine();
    const masterDeck = ['strike', 'defend', 'defend', 'strike', 'strike'];
    const battle = buildInitialBattle(302, undefined, 'sapper_reduce', masterDeck, lineupSapper(), []);
    let run: RunState = {
      seed: 302,
      saveVersion: RUN_SAVE_VERSION,
      player: { maxHp: 50, currentHp: 50 },
      masterDeck,
      map: { nodes: {}, currentNodeId: null },
      screen: { type: 'battle' },
      battle,
      meta: {
        act: 1,
        actFloor: 1,
        floor: 1,
        gold: 0,
        characterId: 'walker',
        relics: [],
        potions: [],
        encounterHistory: createEmptyEncounterHistory(),
      },
    };

    addStatusStacks(run.battle!.units[PLAYER_UNIT_ID], STATUS_MOMENTUM, 3);

    run = engine.dispatch(run, { type: 'END_TURN' }).nextRun;
    run = engine.dispatch(run, { type: 'END_TURN' }).nextRun;

    expect(run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0).toBe(0);
    expect(run.battle!.monsters[ENEMY_UNIT_ID]?.intent).toEqual({ type: 'attack', value: 6 });
  });

  test('反连打敌人在玩家本回合出牌达到阈值时会反击', () => {
    const engine = new GameEngine();
    const masterDeck = ['strike', 'defend', 'defend', 'strike', 'strike'];
    const battle = buildInitialBattle(304, undefined, 'guard_punish', masterDeck, lineupGuard(), []);
    let run: RunState = {
      seed: 304,
      saveVersion: RUN_SAVE_VERSION,
      player: { maxHp: 50, currentHp: 50 },
      masterDeck,
      map: { nodes: {}, currentNodeId: null },
      screen: { type: 'battle' },
      battle,
      meta: {
        act: 1,
        actFloor: 1,
        floor: 1,
        gold: 0,
        characterId: 'walker',
        relics: [],
        potions: [],
        encounterHistory: createEmptyEncounterHistory(),
      },
    };

    run = engine.dispatch(run, { type: 'END_TURN' }).nextRun;

    for (let i = 0; i < 3; i++) {
      const surgeId = `test_surge_${i}`;
      run.battle!.player.cards[surgeId] = {
        instanceId: surgeId,
        definitionId: 'surge',
        baseCost: 0,
        costForTurn: 0,
        upgraded: false,
      };
      run.battle!.player.hand.unshift(surgeId);
    }

    for (let i = 0; i < 3; i++) {
      const surgeId = `test_surge_${i}`;
      run = engine
        .dispatch(run, {
          type: 'PLAY_CARD',
          cardInstanceId: surgeId,
          sourceUnitId: PLAYER_UNIT_ID,
        })
        .nextRun;
      run = engine.dispatch(run, { type: 'RESOLVE_ANIMATION_DONE' }).nextRun;
    }

    expect(run.battle!.playerCardsPlayedThisTurn).toBe(3);
    expect(run.battle!.units[PLAYER_UNIT_ID].hp).toBe(34);

    run = engine.dispatch(run, { type: 'END_TURN' }).nextRun;

    expect(run.battle!.playerCardsPlayedThisTurn).toBe(0);
    expect(run.battle!.monsters[ENEMY_UNIT_ID]?.intent).toEqual({ type: 'attack', value: 6 });
  });

  test('拖延型敌人在敌方回合会获得格挡', () => {
    const engine = new GameEngine();
    const masterDeck = ['strike', 'defend', 'defend', 'strike', 'strike'];
    const battle = buildInitialBattle(309, undefined, 'shell_block', masterDeck, lineupShell(), []);
    let run: RunState = {
      seed: 309,
      saveVersion: RUN_SAVE_VERSION,
      player: { maxHp: 50, currentHp: 50 },
      masterDeck,
      map: { nodes: {}, currentNodeId: null },
      screen: { type: 'battle' },
      battle,
      meta: {
        act: 1,
        actFloor: 1,
        floor: 1,
        gold: 0,
        characterId: 'walker',
        relics: [],
        potions: [],
        encounterHistory: createEmptyEncounterHistory(),
      },
    };

    run = engine.dispatch(run, { type: 'END_TURN' }).nextRun;
    run = engine.dispatch(run, { type: 'END_TURN' }).nextRun;

    expect(run.battle!.units[ENEMY_UNIT_ID].block).toBe(12);
    expect(run.battle!.monsters[ENEMY_UNIT_ID]?.intent).toEqual({ type: 'attack', value: 6 });
  });

  test('整步作为节奏修复牌：获得格挡并抽 1 张牌', () => {
    const engine = new GameEngine();
    let run = createMvpRun(305);
    const steadyStepId = 'test_steady_step';
    const drawCardId = 'test_draw_card';

    run.battle!.player.cards[steadyStepId] = {
      instanceId: steadyStepId,
      definitionId: STEADY_STEP.id,
      baseCost: STEADY_STEP.cost,
      costForTurn: STEADY_STEP.cost,
      upgraded: false,
    };
    run.battle!.player.cards[drawCardId] = {
      instanceId: drawCardId,
      definitionId: 'strike',
      baseCost: 1,
      costForTurn: 1,
      upgraded: false,
    };

    run.battle!.player.hand.unshift(steadyStepId);
    run.battle!.player.drawPile.unshift(drawCardId);

    const handBefore = run.battle!.player.hand.length;
    const { nextRun, events } = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: steadyStepId,
      sourceUnitId: PLAYER_UNIT_ID,
    });
    run = nextRun;

    expect(run.battle!.units[PLAYER_UNIT_ID].block).toBe(6);
    expect(events.some((e) => e.type === 'CARD_DRAWN' && e.cardInstanceId === drawCardId)).toBe(true);
    expect(run.battle!.player.hand.includes(drawCardId)).toBe(true);
    expect(run.battle!.player.hand.length).toBe(handBefore);
  });

  test('起手式与稳架补齐蓄势牌：分别验证抽牌起势和防守起势', () => {
    const engine = new GameEngine();
    let run = createMvpRun(310);
    const primeRhythmId = 'test_prime_rhythm';
    const braceRhythmId = 'test_brace_rhythm';
    const drawCardId = 'test_prime_draw';

    run.battle!.player.cards[primeRhythmId] = {
      instanceId: primeRhythmId,
      definitionId: PRIME_RHYTHM.id,
      baseCost: PRIME_RHYTHM.cost,
      costForTurn: PRIME_RHYTHM.cost,
      upgraded: false,
    };
    run.battle!.player.cards[braceRhythmId] = {
      instanceId: braceRhythmId,
      definitionId: BRACE_RHYTHM.id,
      baseCost: BRACE_RHYTHM.cost,
      costForTurn: BRACE_RHYTHM.cost,
      upgraded: false,
    };
    run.battle!.player.cards[drawCardId] = {
      instanceId: drawCardId,
      definitionId: 'strike',
      baseCost: 1,
      costForTurn: 1,
      upgraded: false,
    };

    run.battle!.player.hand.unshift(primeRhythmId, braceRhythmId);
    run.battle!.player.drawPile.unshift(drawCardId);

    run = engine
      .dispatch(run, {
        type: 'PLAY_CARD',
        cardInstanceId: primeRhythmId,
        sourceUnitId: PLAYER_UNIT_ID,
      })
      .nextRun;
    expect(run.battle!.player.hand.includes(drawCardId)).toBe(true);
    expect(run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0).toBe(1);

    run = engine.dispatch(run, { type: 'RESOLVE_ANIMATION_DONE' }).nextRun;
    run = engine
      .dispatch(run, {
        type: 'PLAY_CARD',
        cardInstanceId: braceRhythmId,
        sourceUnitId: PLAYER_UNIT_ID,
      })
      .nextRun;
    expect(run.battle!.units[PLAYER_UNIT_ID].block).toBe(10);
    expect(run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0).toBe(2);
  });

  test('断势击只消耗固定 2 层 momentum，并保留剩余层数', () => {
    const engine = new GameEngine();
    let run = createMvpRun(306);
    addStatusStacks(run.battle!.units[PLAYER_UNIT_ID], STATUS_MOMENTUM, 4);

    const snapStrikeId = 'test_snap_strike';
    run.battle!.player.cards[snapStrikeId] = {
      instanceId: snapStrikeId,
      definitionId: SNAP_STRIKE.id,
      baseCost: SNAP_STRIKE.cost,
      costForTurn: SNAP_STRIKE.cost,
      upgraded: false,
    };
    run.battle!.player.hand.unshift(snapStrikeId);

    const enemyHpBefore = run.battle!.units[ENEMY_UNIT_ID].hp;
    const { nextRun, events } = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: snapStrikeId,
      sourceUnitId: PLAYER_UNIT_ID,
      targetUnitId: ENEMY_UNIT_ID,
    });
    run = nextRun;

    expect(events.some((e) => e.type === 'DAMAGE_DEALT' && e.value === 13)).toBe(true);
    expect(run.battle!.units[ENEMY_UNIT_ID].hp).toBe(enemyHpBefore - 13);
    expect(run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0).toBe(2);
  });

  test('转势会消耗全部 momentum 并转成抽牌', () => {
    const engine = new GameEngine();
    let run = createMvpRun(307);
    addStatusStacks(run.battle!.units[PLAYER_UNIT_ID], STATUS_MOMENTUM, 3);

    const cashFlowId = 'test_cash_flow';
    const drawIds = ['draw_a', 'draw_b', 'draw_c', 'draw_d'].map((id) => `test_${id}`);
    run.battle!.player.cards[cashFlowId] = {
      instanceId: cashFlowId,
      definitionId: CASH_FLOW.id,
      baseCost: CASH_FLOW.cost,
      costForTurn: CASH_FLOW.cost,
      upgraded: false,
    };
    for (const drawId of drawIds) {
      run.battle!.player.cards[drawId] = {
        instanceId: drawId,
        definitionId: 'strike',
        baseCost: 1,
        costForTurn: 1,
        upgraded: false,
      };
    }

    run.battle!.player.hand.unshift(cashFlowId);
    run.battle!.player.drawPile = [...drawIds, ...run.battle!.player.drawPile];

    const { nextRun, events } = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: cashFlowId,
      sourceUnitId: PLAYER_UNIT_ID,
    });
    run = nextRun;

    expect(events.filter((e) => e.type === 'CARD_DRAWN').length).toBe(4);
    expect(run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_MOMENTUM)).toBeUndefined();
    for (const drawId of drawIds) {
      expect(run.battle!.player.hand.includes(drawId)).toBe(true);
    }
  });

  test('放势只消耗固定 2 层 momentum 并转成固定过牌', () => {
    const engine = new GameEngine();
    let run = createMvpRun(311);
    addStatusStacks(run.battle!.units[PLAYER_UNIT_ID], STATUS_MOMENTUM, 4);

    const releaseFlowId = 'test_release_flow';
    const drawIds = ['rf_a', 'rf_b', 'rf_c'].map((id) => `test_${id}`);
    run.battle!.player.cards[releaseFlowId] = {
      instanceId: releaseFlowId,
      definitionId: RELEASE_FLOW.id,
      baseCost: RELEASE_FLOW.cost,
      costForTurn: RELEASE_FLOW.cost,
      upgraded: false,
    };
    for (const drawId of drawIds) {
      run.battle!.player.cards[drawId] = {
        instanceId: drawId,
        definitionId: 'strike',
        baseCost: 1,
        costForTurn: 1,
        upgraded: false,
      };
    }
    run.battle!.player.hand.unshift(releaseFlowId);
    run.battle!.player.drawPile = [...drawIds, ...run.battle!.player.drawPile];

    const { nextRun, events } = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: releaseFlowId,
      sourceUnitId: PLAYER_UNIT_ID,
    });
    run = nextRun;

    expect(events.filter((e) => e.type === 'CARD_DRAWN').length).toBe(3);
    expect(run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0).toBe(2);
  });

  test('回气与调息分别补资源和补生存', () => {
    const engine = new GameEngine();
    let run = createMvpRun(308);
    run.battle!.units[PLAYER_UNIT_ID].hp = 30;

    const recenterId = 'test_recenter';
    const patchBreathId = 'test_patch_breath';
    const drawCardId = 'test_recenter_draw';
    run.battle!.player.cards[recenterId] = {
      instanceId: recenterId,
      definitionId: RECENTER.id,
      baseCost: RECENTER.cost,
      costForTurn: RECENTER.cost,
      upgraded: false,
    };
    run.battle!.player.cards[patchBreathId] = {
      instanceId: patchBreathId,
      definitionId: PATCH_BREATH.id,
      baseCost: PATCH_BREATH.cost,
      costForTurn: PATCH_BREATH.cost,
      upgraded: false,
    };
    run.battle!.player.cards[drawCardId] = {
      instanceId: drawCardId,
      definitionId: 'strike',
      baseCost: 1,
      costForTurn: 1,
      upgraded: false,
    };

    run.battle!.player.hand.unshift(recenterId, patchBreathId);
    run.battle!.player.drawPile.unshift(drawCardId);
    run.battle!.player.energy = 1;

    run = engine
      .dispatch(run, {
        type: 'PLAY_CARD',
        cardInstanceId: recenterId,
        sourceUnitId: PLAYER_UNIT_ID,
      })
      .nextRun;
    expect(run.battle!.player.energy).toBe(2);
    expect(run.battle!.player.hand.includes(drawCardId)).toBe(true);

    run = engine.dispatch(run, { type: 'RESOLVE_ANIMATION_DONE' }).nextRun;
    run = engine
      .dispatch(run, {
        type: 'PLAY_CARD',
        cardInstanceId: patchBreathId,
        sourceUnitId: PLAYER_UNIT_ID,
      })
      .nextRun;
    expect(run.battle!.units[PLAYER_UNIT_ID].hp).toBe(34);
    expect(run.battle!.units[PLAYER_UNIT_ID].block).toBe(4);
  });

  test('续拍作为第 4 张节奏修复牌：获得格挡并返还 1 点能量', () => {
    const engine = new GameEngine();
    let run = createMvpRun(312);
    const secondWindId = 'test_second_wind';
    run.battle!.player.cards[secondWindId] = {
      instanceId: secondWindId,
      definitionId: SECOND_WIND.id,
      baseCost: SECOND_WIND.cost,
      costForTurn: SECOND_WIND.cost,
      upgraded: false,
    };
    run.battle!.player.hand.unshift(secondWindId);
    run.battle!.player.energy = 1;

    run = engine
      .dispatch(run, {
        type: 'PLAY_CARD',
        cardInstanceId: secondWindId,
        sourceUnitId: PLAYER_UNIT_ID,
      })
      .nextRun;
    expect(run.battle!.units[PLAYER_UNIT_ID].block).toBe(5);
    expect(run.battle!.player.energy).toBe(1);
  });

  test('保势线补强牌能稳定保留 momentum', () => {
    const engine = new GameEngine();
    let run = createMvpRun(1401);
    addStatusStacks(run.battle!.units[PLAYER_UNIT_ID], STATUS_MOMENTUM, 1);
    run.battle!.player.cards.test_soft_step = {
      instanceId: 'test_soft_step',
      definitionId: SOFT_STEP.id,
      baseCost: SOFT_STEP.cost,
      costForTurn: SOFT_STEP.cost,
      upgraded: false,
    };
    run.battle!.player.hand.unshift('test_soft_step');

    run = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: 'test_soft_step',
      sourceUnitId: PLAYER_UNIT_ID,
    }).nextRun;

    expect(run.battle!.units[PLAYER_UNIT_ID].block).toBe(5);
    expect(run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0).toBe(1);
  });

  test('兑现线补强牌能打出高于基础攻击的爆发', () => {
    const engine = new GameEngine();
    let run = createMvpRun(1402);
    addStatusStacks(run.battle!.units[PLAYER_UNIT_ID], STATUS_MOMENTUM, 2);
    run.battle!.player.cards.test_quick_release = {
      instanceId: 'test_quick_release',
      definitionId: QUICK_RELEASE.id,
      baseCost: QUICK_RELEASE.cost,
      costForTurn: QUICK_RELEASE.cost,
      upgraded: false,
    };
    run.battle!.player.hand.unshift('test_quick_release');

    const enemyHpBefore = run.battle!.units[ENEMY_UNIT_ID].hp;
    run = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: 'test_quick_release',
      sourceUnitId: PLAYER_UNIT_ID,
      targetUnitId: ENEMY_UNIT_ID,
    }).nextRun;

    expect(enemyHpBefore - run.battle!.units[ENEMY_UNIT_ID].hp).toBe(8);
    expect(run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0).toBe(1);
  });

  test('观势会抽牌并立刻补 1 层连势', () => {
    const engine = new GameEngine();
    let run = createMvpRun(1403);
    const refillIds = ['sv_a', 'sv_b', 'sv_c'].map((id) => `test_${id}`);
    for (const drawId of refillIds) {
      run.battle!.player.cards[drawId] = {
        instanceId: drawId,
        definitionId: 'strike',
        baseCost: 1,
        costForTurn: 1,
        upgraded: false,
      };
    }
    run.battle!.player.drawPile = [...refillIds, ...run.battle!.player.drawPile];
    run.battle!.player.cards.test_survey_field = {
      instanceId: 'test_survey_field',
      definitionId: SURVEY_FIELD.id,
      baseCost: SURVEY_FIELD.cost,
      costForTurn: SURVEY_FIELD.cost,
      upgraded: false,
    };
    run.battle!.player.hand.unshift('test_survey_field');
    run = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: 'test_survey_field',
      sourceUnitId: PLAYER_UNIT_ID,
    }).nextRun;

    expect(run.battle!.player.discardPile).toContain('test_survey_field');
    expect(run.battle!.player.hand.length).toBeGreaterThanOrEqual(6);
    expect(run.battle!.units[PLAYER_UNIT_ID].block).toBe(1);
    expect(run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0).toBe(0);
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

  test('遗物风铃：开场 +2 momentum', () => {
    const engine = new GameEngine();
    let run = createMapRun(51);
    run.meta.relics.push('wind_chime');
    const battleId = firstBattleFromCamp(run);
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: battleId }).nextRun;
    const stacks =
      run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0;
    expect(stacks).toBe(3);
  });

  test('遗物定心核：开场获得 1 层金属化与 1 层稳势', () => {
    const engine = new GameEngine();
    let run = createMapRun(511);
    run.meta.relics.push('still_core');
    const battleId = firstBattleFromCamp(run);
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: battleId }).nextRun;
    const metallicize =
      run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === 'metallicize')?.stacks ?? 0;
    const steadyGuard =
      run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === 'steady_guard')?.stacks ?? 0;
    expect(metallicize).toBe(1);
    expect(steadyGuard).toBe(1);
  });

  test('遗物缓护符：开场获得 4 点格挡', () => {
    const engine = new GameEngine();
    let run = createMapRun(512);
    run.meta.relics.push('soft_guard');
    const battleId = firstBattleFromCamp(run);
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: battleId }).nextRun;
    expect(run.battle!.units[PLAYER_UNIT_ID].block).toBe(4);
  });

  test('当前角色被动：从地图进入战斗时开场 +1 momentum', () => {
    const engine = new GameEngine();
    let run = createMapRun(91);
    const battleId = firstBattleFromCamp(run);
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: battleId }).nextRun;
    const stacks =
      run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0;
    expect(run.meta.characterId).toBe('walker');
    expect(stacks).toBe(1);
  });

  test('遗物战术手套：战斗开始时额外抽 1 张牌', () => {
    const engine = new GameEngine();
    let run = createMapRun(52);
    run.meta.relics.push('tactical_gloves');
    const battleId = firstBattleFromCamp(run);
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: battleId }).nextRun;
    expect(run.battle!.player.hand.length).toBe(6);
  });

  test('遗物裂响纹章：主动消耗 momentum 的伤害牌额外 +2 伤害，且首次额外抽 1 张牌', () => {
    const engine = new GameEngine();
    let run = createMvpRun(53);
    run.meta.relics.push('burst_emblem');
    addStatusStacks(run.battle!.units[PLAYER_UNIT_ID], STATUS_MOMENTUM, 2);

    const burstStrikeId = 'test_relic_burst_strike';
    run.battle!.player.cards[burstStrikeId] = {
      instanceId: burstStrikeId,
      definitionId: BURST_STRIKE.id,
      baseCost: BURST_STRIKE.cost,
      costForTurn: BURST_STRIKE.cost,
      upgraded: false,
    };
    run.battle!.player.hand.unshift(burstStrikeId);

    const enemyHpBefore = run.battle!.units[ENEMY_UNIT_ID].hp;
    const handBefore = run.battle!.player.hand.length;
    run = engine
      .dispatch(run, {
        type: 'PLAY_CARD',
        cardInstanceId: burstStrikeId,
        sourceUnitId: PLAYER_UNIT_ID,
        targetUnitId: ENEMY_UNIT_ID,
      })
      .nextRun;
    expect(run.battle!.units[ENEMY_UNIT_ID].hp).toBe(enemyHpBefore - 12);
    expect(run.battle!.player.hand.length).toBe(handBefore);
  });

  test('遗物疾燃引线：主动消耗 momentum 的伤害牌结算后返还 1 点能量', () => {
    const engine = new GameEngine();
    let run = createMvpRun(531);
    run.meta.relics.push('quick_fuse');
    addStatusStacks(run.battle!.units[PLAYER_UNIT_ID], STATUS_MOMENTUM, 2);

    run.battle!.player.cards.test_follow_through = {
      instanceId: 'test_follow_through',
      definitionId: FOLLOW_THROUGH.id,
      baseCost: FOLLOW_THROUGH.cost,
      costForTurn: FOLLOW_THROUGH.cost,
      upgraded: false,
    };
    run.battle!.player.hand.unshift('test_follow_through');

    run = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: 'test_follow_through',
      sourceUnitId: PLAYER_UNIT_ID,
      targetUnitId: ENEMY_UNIT_ID,
    }).nextRun;
    expect(run.battle!.player.energy).toBe(4);
  });

  test('遗物识隙刃：主动消耗的每层 momentum 额外增加 1 点伤害', () => {
    const engine = new GameEngine();
    let run = createMvpRun(532);
    run.meta.relics.push('sighted_edge');
    addStatusStacks(run.battle!.units[PLAYER_UNIT_ID], STATUS_MOMENTUM, 2);

    run.battle!.player.cards.test_burst_strike_2 = {
      instanceId: 'test_burst_strike_2',
      definitionId: BURST_STRIKE.id,
      baseCost: BURST_STRIKE.cost,
      costForTurn: BURST_STRIKE.cost,
      upgraded: false,
    };
    run.battle!.player.hand.unshift('test_burst_strike_2');

    const enemyHpBefore = run.battle!.units[ENEMY_UNIT_ID].hp;
    run = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: 'test_burst_strike_2',
      sourceUnitId: PLAYER_UNIT_ID,
      targetUnitId: ENEMY_UNIT_ID,
    }).nextRun;
    expect(run.battle!.units[ENEMY_UNIT_ID].hp).toBe(enemyHpBefore - 12);
  });

  test('遗物观势镜：主动消耗 momentum 的过牌牌额外抽 1 张牌', () => {
    const engine = new GameEngine();
    let run = createMvpRun(54);
    run.meta.relics.push('insight_lens');
    addStatusStacks(run.battle!.units[PLAYER_UNIT_ID], STATUS_MOMENTUM, 2);

    const cashFlowId = 'test_relic_cash_flow';
    const drawIds = ['lens_a', 'lens_b', 'lens_c', 'lens_d'].map((id) => `test_${id}`);
    run.battle!.player.cards[cashFlowId] = {
      instanceId: cashFlowId,
      definitionId: CASH_FLOW.id,
      baseCost: CASH_FLOW.cost,
      costForTurn: CASH_FLOW.cost,
      upgraded: false,
    };
    for (const drawId of drawIds) {
      run.battle!.player.cards[drawId] = {
        instanceId: drawId,
        definitionId: 'strike',
        baseCost: 1,
        costForTurn: 1,
        upgraded: false,
      };
    }
    run.battle!.player.hand.unshift(cashFlowId);
    run.battle!.player.drawPile = [...drawIds, ...run.battle!.player.drawPile];

    const { nextRun, events } = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId: cashFlowId,
      sourceUnitId: PLAYER_UNIT_ID,
    });
    run = nextRun;
    expect(events.filter((e) => e.type === 'CARD_DRAWN').length).toBe(4);
    for (const drawId of drawIds) {
      expect(run.battle!.player.hand.includes(drawId)).toBe(true);
    }
  });

  test('遗物稳势结：敌方削减 momentum 时少失去 1 层', () => {
    const engine = new GameEngine();
    const masterDeck = ['strike', 'defend', 'defend', 'strike', 'strike'];
    const battle = buildInitialBattle(55, undefined, 'guard_knot_reduce', masterDeck, lineupSapper(), ['guard_knot']);
    let run: RunState = {
      seed: 55,
      saveVersion: RUN_SAVE_VERSION,
      player: { maxHp: 50, currentHp: 50 },
      masterDeck,
      map: { nodes: {}, currentNodeId: null },
      screen: { type: 'battle' },
      battle,
      meta: {
        act: 1,
        actFloor: 1,
        floor: 1,
        gold: 0,
        characterId: 'walker',
        relics: ['guard_knot'],
        potions: [],
        encounterHistory: createEmptyEncounterHistory(),
      },
    };
    addStatusStacks(run.battle!.units[PLAYER_UNIT_ID], STATUS_MOMENTUM, 3);
    run = engine.dispatch(run, { type: 'END_TURN' }).nextRun;
    run = engine.dispatch(run, { type: 'END_TURN' }).nextRun;
    expect(run.battle!.units[PLAYER_UNIT_ID].statuses.find((s) => s.id === STATUS_MOMENTUM)?.stacks ?? 0).toBe(2);
  });

  test('首个精英节点不会抽到 elite_open，且仍是单敌构筑检定', () => {
    const engine = new GameEngine();
    let run = createMapRun(8);
    let eliteId = '';
    for (let seed = 8; seed < 60; seed += 1) {
      const candidate = createMapRun(seed);
      const target = Object.values(candidate.map.nodes).find(
        (n) =>
          n.type === 'elite' &&
          n.floor === 1 &&
          resolveEncounterTemplate(n.act, n.encounterPoolId, n.id, candidate.seed, createEmptyEncounterHistory(), n.depth).id !== 'act1_elite_open',
      );
      if (target) {
        run = candidate;
        eliteId = target.id;
        break;
      }
    }
    if (!eliteId) throw new Error('act1 first elite not found');
    jumpToBeforeNode(run, eliteId);
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: eliteId }).nextRun;
    expect(run.map.nodes[eliteId].type).toBe('elite');
    expect(run.map.nodes[eliteId].encounterId).not.toBe('act1_elite_open');
    expect(run.battle?.enemyUnitIds.length).toBe(1);
    const encounterId = run.map.nodes[eliteId].encounterId;
    expect(['act1_elite_heavy', 'act1_elite_double', 'act1_elite_control']).toContain(encounterId);
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
    const far = Object.values(run.map.nodes).find(
      (n) => n.id !== camp && !isLegalMapStep(run.map.nodes, camp, n.id),
    );
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
    expect(run.meta.gold).toBeGreaterThanOrEqual(0);
    expect(run.meta.gold).toBeLessThanOrEqual(24);
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
    const skipGold = skipCardGoldAmount('normal');
    run = engine.dispatch(run, { type: 'TAKE_REWARD_GOLD', amount: skipGold }).nextRun;
    expect(run.masterDeck.length).toBe(deckLen);
    expect(run.meta.gold).toBeGreaterThanOrEqual(skipGold);
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
    expect(run.reward?.items.some((i) => i.type === 'gold' && i.amount === 33)).toBe(true);
    expect(
      run.reward?.items.some(
        (i) => i.type === 'potion' && ['stillwater_tonic', 'flash_powder'].includes(i.potionId),
      ),
    ).toBe(true);
    const cardChoice = run.reward!.items.find((i) => i.type === 'card_choice');
    if (!cardChoice || cardChoice.type !== 'card_choice') throw new Error('expected card_choice');
    const potionsBefore = run.meta.potions.length;
    run = engine
      .dispatch(run, { type: 'SELECT_REWARD_CARD', definitionId: cardChoice.cards[0]! })
      .nextRun;
    expect(run.meta.gold).toBe(33);
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
    expect(run.reward?.items.some((i) => i.type === 'gold' && i.amount === 56)).toBe(true);
    expect(
      run.reward?.items.some(
        (i) => i.type === 'potion' && ['stillwater_tonic', 'flash_powder'].includes(i.potionId),
      ),
    ).toBe(true);
    const relicEntry = run.reward!.items.find((i) => i.type === 'relic');
    expect(relicEntry?.type).toBe('relic');
    const relicId = relicEntry && relicEntry.type === 'relic' ? relicEntry.relicId : '';
    expect(Boolean(RELIC_DEFINITIONS[relicId])).toBe(true);
    const cardChoice = run.reward!.items.find((i) => i.type === 'card_choice');
    if (!cardChoice || cardChoice.type !== 'card_choice') throw new Error('expected card_choice');
    const bossPotionsBefore = run.meta.potions.length;
    run = engine
      .dispatch(run, { type: 'SELECT_REWARD_CARD', definitionId: cardChoice.cards[0]! })
      .nextRun;
    expect(run.meta.gold).toBe(56);
    expect(run.meta.potions.length).toBe(bossPotionsBefore + 1);
    expect(run.meta.relics).toContain(relicId);
    expect(['guard_knot', 'still_core', 'burst_emblem', 'quick_fuse']).toContain(relicId);
    expect(run.player.maxHp).toBe(50);
    expect(run.meta.act).toBe(2);
    expect(run.meta.actFloor).toBe(1);
    expect(run.meta.floor).toBe(globalFloorFor(2, 1));
    const f2Camp = Object.keys(run.map.nodes).find((id) => run.map.nodes[id]!.depth === 1);
    expect(run.map.currentNodeId).toBe(f2Camp);
    expect(Object.values(run.map.nodes).some((n) => n.type === 'battle' && n.act === 2)).toBe(
      true,
    );
    expect(run.screen.type).toBe('map');
  });

  test('第三章 Boss 战后选牌进入通关界面', () => {
    const engine = new GameEngine();
    let run = createMapRun(22);
    run.meta.act = 3;
    run.meta.actFloor = 26;
    run.meta.floor = globalFloorFor(3, 26);
    const f3Nodes = buildActNodes(3, 22);
    const f3BossId = Object.values(f3Nodes).find((n) => n.type === 'boss')!.id;
    f3Nodes[f3BossId]!.visited = true;
    run.map = { nodes: f3Nodes, currentNodeId: f3BossId };
    run.screen = { type: 'reward' };
    run.reward = {
      items: [{ type: 'card_choice', cards: ['strike', 'defend', 'bash'] }],
      claimed: false,
    };
    run = engine
      .dispatch(run, { type: 'SELECT_REWARD_CARD', definitionId: 'strike' })
      .nextRun;
    expect(run.screen.type).toBe('victory');
    expect(run.meta.gold).toBe(0);
  });

  test('Boss 遗物池已空时不重复掉落', () => {
    const engine = new GameEngine();
    let run = createMapRun(14);
    const bossId = findNodeId(run, (n) => n.type === 'boss' && n.floor === 1);
    jumpToBeforeNode(run, bossId);
    run.meta.relics = Object.keys(RELIC_DEFINITIONS);
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

  test('静守祠事件可用生命换稳势结，或拿守势回地图', () => {
    const engine = new GameEngine();
    let run = createMapRun(303);
    const eventId = findNodeId(run, (n) => n.type === 'event' && n.eventScriptId === STILLNESS_SHRINE_EVENT_ID);
    jumpToBeforeNode(run, eventId);
    const hpBefore = run.player.currentHp;

    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: eventId }).nextRun;
    expect(run.screen).toEqual({ type: 'event', eventId: STILLNESS_SHRINE_EVENT_ID });
    run = engine.dispatch(run, { type: 'RESOLVE_EVENT_OPTION', optionId: 'guard_relic' }).nextRun;
    expect(run.screen.type).toBe('map');
    expect(run.meta.relics).toContain('guard_knot');
    expect(run.player.currentHp).toBe(hpBefore - 6);

    run = createMapRun(304);
    const cardEventId = findNodeId(run, (n) => n.type === 'event' && n.eventScriptId === STILLNESS_SHRINE_EVENT_ID);
    jumpToBeforeNode(run, cardEventId);
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: cardEventId }).nextRun;
    run = engine.dispatch(run, { type: 'RESOLVE_EVENT_OPTION', optionId: 'guard_card' }).nextRun;
    expect(run.masterDeck).toContain(TEMPO_GUARD.id);
    expect(run.screen.type).toBe('map');
  });

  test('第二章事件池可出现裂响祭坛并正常结算', () => {
    const engine = new GameEngine();
    let run = createMapRun(305);
    run.meta.act = 2;
    run.meta.actFloor = 1;
    run.meta.floor = globalFloorFor(2, 1);
    run.map = { nodes: buildFloor2Nodes(305), currentNodeId: Object.values(buildFloor2Nodes(305)).find((n) => n.depth === 1)!.id };
    const eventId = findNodeId(run, (n) => n.type === 'event' && n.depth > 1 && n.eventScriptId === BURST_ALTAR_EVENT_ID);
    jumpToBeforeNode(run, eventId);
    const hpBefore = run.player.currentHp;

    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: eventId }).nextRun;
    expect(run.screen).toEqual({ type: 'event', eventId: BURST_ALTAR_EVENT_ID });
    run = engine.dispatch(run, { type: 'RESOLVE_EVENT_OPTION', optionId: 'burst_relic' }).nextRun;
    expect(run.screen.type).toBe('map');
    expect(run.meta.relics).toContain('burst_emblem');
    expect(run.player.currentHp).toBe(hpBefore - 6);

    const nodes = buildFloor2Nodes(306);
    run = createMapRun(306);
    run.meta.act = 2;
    run.meta.actFloor = 1;
    run.meta.floor = globalFloorFor(2, 1);
    run.map = { nodes, currentNodeId: Object.values(nodes).find((n) => n.depth === 1)!.id };
    const cardEventId = findNodeId(run, (n) => n.type === 'event' && n.depth > 1 && n.eventScriptId === BURST_ALTAR_EVENT_ID);
    jumpToBeforeNode(run, cardEventId);
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: cardEventId }).nextRun;
    run = engine.dispatch(run, { type: 'RESOLVE_EVENT_OPTION', optionId: 'burst_card' }).nextRun;
    expect(run.masterDeck).toContain(BURST_STRIKE.id);
    expect(run.screen.type).toBe('map');
  });

  test('第二章事件池可出现净手池并提供删基础牌入口', () => {
    const engine = new GameEngine();
    const findRunWithPurgingPool = (): [RunState, string] => {
      for (let seed = 300; seed <= 380; seed++) {
        const candidate = createMapRun(seed);
        candidate.meta.act = 2;
        candidate.meta.actFloor = 1;
        candidate.meta.floor = globalFloorFor(2, 1);
        candidate.map = { nodes: buildFloor2Nodes(seed), currentNodeId: Object.values(buildFloor2Nodes(seed)).find((n) => n.depth === 1)!.id };
        const eventNode = Object.values(candidate.map.nodes).find(
          (n) => n.type === 'event' && n.eventScriptId === PURGING_POOL_EVENT_ID,
        );
        if (eventNode) return [candidate, eventNode.id];
      }
      throw new Error('purging_pool not found in sampled seeds');
    };

    let [run, strikeEventId] = findRunWithPurgingPool();
    jumpToBeforeNode(run, strikeEventId);
    const strikeBefore = run.masterDeck.filter((id) => id === 'strike').length;

    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: strikeEventId }).nextRun;
    expect(run.screen).toEqual({ type: 'event', eventId: PURGING_POOL_EVENT_ID });
    run = engine.dispatch(run, { type: 'RESOLVE_EVENT_OPTION', optionId: 'remove_strike' }).nextRun;
    expect(run.screen.type).toBe('map');
    expect(run.masterDeck.filter((id) => id === 'strike').length).toBe(strikeBefore - 1);

    [run, strikeEventId] = findRunWithPurgingPool();
    const defendEventId = strikeEventId;
    jumpToBeforeNode(run, defendEventId);
    const defendBefore = run.masterDeck.filter((id) => id === 'defend').length;

    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: defendEventId }).nextRun;
    run = engine.dispatch(run, { type: 'RESOLVE_EVENT_OPTION', optionId: 'remove_defend' }).nextRun;
    expect(run.screen.type).toBe('map');
    expect(run.masterDeck.filter((id) => id === 'defend').length).toBe(defendBefore - 1);
  });

  test('商店购买遗物会加入持有列表，并落在双核遗物池内', () => {
    const engine = new GameEngine();
    let run = createMapRun(31);
    const shopId = findNodeId(run, (n) => n.type === 'shop' && n.floor === 1);
    jumpToBeforeNode(run, shopId);
    run.meta.gold = 500;
    run = engine.dispatch(run, { type: 'CHOOSE_MAP_NODE', nodeId: shopId }).nextRun;
    const offer = run.shop!.relics[0]!;
    run = engine.dispatch(run, { type: 'BUY_SHOP_RELIC', relicId: offer.relicId }).nextRun;
    expect(run.meta.relics).toContain(offer.relicId);
    expect(['guard_knot', 'still_core', 'burst_emblem', 'quick_fuse']).toContain(offer.relicId);
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
      if (r === 'stillwater_tonic' || r === 'flash_powder') sawPotion = true;
      if (r === null) sawNone = true;
      if (sawPotion && sawNone) break;
    }
    expect(sawPotion).toBe(true);
    expect(sawNone).toBe(true);
  });
});
