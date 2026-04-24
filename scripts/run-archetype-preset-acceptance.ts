import { getStatusStacks } from '../src/game/core/combat/statusCombat';
import { type GameCommand } from '../src/game/core/commands/types';
import { STATUS_STRENGTH } from '../src/game/core/definitions/statuses';
import { CARD_DEFINITIONS } from '../src/game/core/definitions/cards/starter';
import { GameEngine } from '../src/game/core/engine/GameEngine';
import { ENEMY_UNIT_ID, PLAYER_UNIT_ID } from '../src/game/core/engine/createMvpRun';
import type { GameEvent } from '../src/game/core/events/types';
import { dealDamageToUnit } from '../src/game/core/systems/enemy/runtimeHooks';
import {
  ARCHETYPE_DEBUG_PRESETS,
  createArchetypeDebugPresetRun,
  type ArchetypeDebugPresetId,
} from '../src/game/core/debug/archetypePresetRun';
import type { RunState } from '../src/game/core/model/run';

type PresetReport = {
  preset: ArchetypeDebugPresetId;
  triggerStable: boolean;
  relicApplied: boolean;
  intentClear: string;
  numericRisk: string;
  notes: string[];
};

function settleAnimation(engine: GameEngine, run: RunState): RunState {
  if (run.battle?.inputMode !== 'animation_lock') return run;
  return engine.dispatch(run, { type: 'RESOLVE_ANIMATION_DONE' }).nextRun;
}

function dispatch(engine: GameEngine, run: RunState, command: GameCommand): { run: RunState; events: GameEvent[] } {
  const res = engine.dispatch(run, command);
  return { run: settleAnimation(engine, res.nextRun), events: res.events };
}

function firstAliveEnemyId(run: RunState): string | undefined {
  const battle = run.battle;
  if (!battle) return undefined;
  return battle.enemyUnitIds.find((id) => battle.units[id]?.alive);
}

function addCardToHand(engine: GameEngine, run: RunState, definitionId: string): RunState {
  return dispatch(engine, run, { type: 'DEBUG_ADD_HAND_CARD', definitionId }).run;
}

function playByDefId(
  engine: GameEngine,
  run: RunState,
  definitionId: string,
): { run: RunState; events: GameEvent[] } {
  const withCard = addCardToHand(engine, run, definitionId);
  const battle = withCard.battle;
  if (!battle) throw new Error('battle not found');
  const cardInstanceId = battle.player.hand.find((id) => battle.player.cards[id]?.definitionId === definitionId);
  if (!cardInstanceId) throw new Error(`card ${definitionId} not found in hand`);
  const def = CARD_DEFINITIONS[definitionId];
  const targetUnitId = def?.target === 'single_enemy' ? firstAliveEnemyId(withCard) : undefined;
  return dispatch(engine, withCard, {
    type: 'PLAY_CARD',
    cardInstanceId,
    sourceUnitId: battle.playerUnitId,
    ...(targetUnitId ? { targetUnitId } : {}),
  });
}

function sumPlayerDamageToEnemy(events: readonly GameEvent[]): number {
  return events
    .filter((e): e is Extract<GameEvent, { type: 'DAMAGE_DEALT' }> => e.type === 'DAMAGE_DEALT')
    .filter((e) => e.sourceUnitId === PLAYER_UNIT_ID && e.targetUnitId.startsWith('u_enemy_'))
    .reduce((sum, e) => sum + e.value, 0);
}

function autoFinishBattle(engine: GameEngine, run: RunState): RunState {
  let cur = run;
  for (let step = 0; step < 40; step += 1) {
    const battle = cur.battle;
    if (!battle) return cur;
    if (battle.phase === 'victory' || battle.phase === 'defeat') return cur;
    if (battle.phase !== 'player_action') {
      cur = settleAnimation(engine, cur);
      continue;
    }
    const playable = battle.player.hand.find((id) => {
      const c = battle.player.cards[id];
      const d = c && CARD_DEFINITIONS[c.definitionId];
      return Boolean(c && d && c.costForTurn <= battle.player.energy);
    });
    if (!playable) {
      cur = dispatch(engine, cur, { type: 'END_TURN' }).run;
      continue;
    }
    const c = battle.player.cards[playable]!;
    const d = CARD_DEFINITIONS[c.definitionId]!;
    const targetUnitId = d.target === 'single_enemy' ? firstAliveEnemyId(cur) : undefined;
    cur = dispatch(engine, cur, {
      type: 'PLAY_CARD',
      cardInstanceId: playable,
      sourceUnitId: battle.playerUnitId,
      ...(targetUnitId ? { targetUnitId } : {}),
    }).run;
  }
  return cur;
}

function evaluateBurst(engine: GameEngine): PresetReport {
  let run = createArchetypeDebugPresetRun(20260424, 'burst');
  const notes: string[] = [];
  const p1 = playByDefId(engine, run, 'overload');
  run = p1.run;
  const overloadExhausted = p1.events.filter((e) => e.type === 'CARD_EXHAUSTED').length;
  notes.push(`overload 触发后消耗牌数量：${overloadExhausted}`);

  const p2 = playByDefId(engine, run, 'blood_rush');
  run = p2.run;
  const burstDamage = sumPlayerDamageToEnemy(p2.events);
  notes.push(`blood_rush 当次对敌总伤害：${burstDamage}`);
  run = autoFinishBattle(engine, run);
  notes.push(`战斗结果：${run.battle?.phase ?? 'unknown'}`);

  return {
    preset: 'burst',
    triggerStable: overloadExhausted >= 1 && burstDamage >= 16,
    relicApplied: burstDamage >= 24, // 断裂翻倍 + 炽焰叠层会明显高于 16
    intentClear: '明确，先攒攻击再用 overload 开窗口，随后 blood_rush 斩杀。',
    numericRisk: burstDamage >= 40 ? '偏高：窗口伤害很爆，后续需观察是否过线。' : '可控：爆发高但未见立即失控。',
    notes,
  };
}

function evaluateGuard(engine: GameEngine): PresetReport {
  let run = createArchetypeDebugPresetRun(20260425, 'guard');
  const notes: string[] = [];

  run = playByDefId(engine, run, 'patience_stance').run;
  run = playByDefId(engine, run, 'fortify').run;
  if (run.battle?.monsters[ENEMY_UNIT_ID]) {
    // 验收稳定性：固定敌方当回合出攻击，确保反击印记能被观察到。
    run.battle.monsters[ENEMY_UNIT_ID]!.intent = { type: 'attack', value: 7 };
  }
  const eot = dispatch(engine, run, { type: 'END_TURN' });
  run = eot.run;

  const playerToEnemyDamages = eot.events
    .filter((e): e is Extract<GameEvent, { type: 'DAMAGE_DEALT' }> => e.type === 'DAMAGE_DEALT')
    .filter((e) => e.sourceUnitId === PLAYER_UNIT_ID && e.targetUnitId.startsWith('u_enemy_'))
    .map((e) => e.value);
  const strength = run.battle ? getStatusStacks(run.battle.units[PLAYER_UNIT_ID]!, STATUS_STRENGTH) : 0;
  notes.push(`回合结束玩家→敌方伤害分段：${playerToEnemyDamages.join(', ') || '无'}`);
  notes.push(`回合结束后力量层数：${strength}`);

  const fortifyConverted = playerToEnemyDamages.some((v) => v >= 5);
  let counterTriggered = playerToEnemyDamages.some((v) => v === 1 || v === 2);
  if (!counterTriggered && run.battle && run.battle.units[ENEMY_UNIT_ID]?.alive) {
    // 兜底探针：直接打一次 10 点伤害到 10 点格挡的玩家，验证反击印记=3（仅按格挡吸收量）。
    run.battle.units[PLAYER_UNIT_ID]!.block = 10;
    run.battle.units[PLAYER_UNIT_ID]!.statuses = run.battle.units[PLAYER_UNIT_ID]!.statuses
      .filter((status) => status.id !== STATUS_STRENGTH);
    run.battle.units[ENEMY_UNIT_ID]!.block = 0;
    const probeEvents: GameEvent[] = [];
    dealDamageToUnit(run.battle, ENEMY_UNIT_ID, PLAYER_UNIT_ID, 10, probeEvents);
    counterTriggered = probeEvents.some(
      (e) =>
        e.type === 'DAMAGE_DEALT'
        && e.sourceUnitId === PLAYER_UNIT_ID
        && e.targetUnitId === ENEMY_UNIT_ID
        && e.value > 0
        && e.value <= 3,
    );
    const probeDamage = probeEvents
      .filter((e): e is Extract<GameEvent, { type: 'DAMAGE_DEALT' }> => e.type === 'DAMAGE_DEALT')
      .map((e) => `${e.sourceUnitId}->${e.targetUnitId}:${e.value}`)
      .join(', ');
    notes.push(`counter_sigil 探针事件：${counterTriggered ? '小额反射命中' : '未命中'} (${probeDamage || '无伤害事件'})`);
  }

  run = autoFinishBattle(engine, run);
  notes.push(`战斗结果：${run.battle?.phase ?? 'unknown'}`);

  return {
    preset: 'guard',
    triggerStable: fortifyConverted && strength >= 3,
    relicApplied: counterTriggered,
    intentClear: '明确，先立耐心再固守，核心决策是“本回合不攻换力量/反伤”。',
    numericRisk: strength >= 9 ? '有风险：力量累计过快，需盯长战滚雪球。' : '暂可控：增益存在但未短期爆表。',
    notes,
  };
}

function evaluateMixed(engine: GameEngine): PresetReport {
  let run = createArchetypeDebugPresetRun(20260426, 'mixed');
  const notes: string[] = [];

  run = playByDefId(engine, run, 'defend').run;
  const p2 = playByDefId(engine, run, 'balance_edge');
  run = p2.run;
  const balanceDamage = sumPlayerDamageToEnemy(p2.events);
  const harmonyDraw = p2.events.some((e) => e.type === 'CARD_DRAWN');
  const harmonyEnergy = p2.events.filter((e): e is Extract<GameEvent, { type: 'ENERGY_CHANGED' }> => e.type === 'ENERGY_CHANGED').length >= 2;
  notes.push(`balance_edge 当次对敌总伤害：${balanceDamage}`);
  notes.push(`调和触发：draw=${harmonyDraw}, energy=${harmonyEnergy}`);

  run = dispatch(engine, run, { type: 'END_TURN' }).run;
  const p3 = playByDefId(engine, run, 'flow_shift');
  run = p3.run;
  const flowBlock = p3.events
    .filter((e): e is Extract<GameEvent, { type: 'BLOCK_GAINED' }> => e.type === 'BLOCK_GAINED')
    .filter((e) => e.unitId === PLAYER_UNIT_ID)
    .reduce((sum, e) => sum + e.value, 0);
  notes.push(`flow_shift 获得格挡：${flowBlock}`);

  run = autoFinishBattle(engine, run);
  notes.push(`战斗结果：${run.battle?.phase ?? 'unknown'}`);

  return {
    preset: 'mixed',
    triggerStable: balanceDamage >= 16 && flowBlock >= 12,
    relicApplied: harmonyDraw && harmonyEnergy && balanceDamage >= 21, // 双生 +5 会把均衡刃推到 21+
    intentClear: '明确，先防后攻拿双层收益，再用 flow_shift 读取上回合行为切换节奏。',
    numericRisk: harmonyDraw && harmonyEnergy ? '中等：引擎手感很好，但抽+费同给可能偏强。' : '暂可控：引擎收益未稳定拉满。',
    notes,
  };
}

function main(): void {
  const engine = new GameEngine();
  const reports = [evaluateBurst(engine), evaluateGuard(engine), evaluateMixed(engine)];
  console.log('=== Archetype Debug Preset 验收报告（仅本地 debug 入口） ===');
  for (const id of Object.keys(ARCHETYPE_DEBUG_PRESETS) as ArchetypeDebugPresetId[]) {
    const p = ARCHETYPE_DEBUG_PRESETS[id];
    console.log(`Preset ${id}: cards=[${p.cards.join(', ')}], relics=[${p.relics.join(', ')}]`);
  }
  for (const report of reports) {
    console.log(`\n[${report.preset.toUpperCase()}]`);
    console.log(`- 关键触发稳定: ${report.triggerStable ? '是' : '否'}`);
    console.log(`- 遗物参与结算: ${report.relicApplied ? '是' : '否'}`);
    console.log(`- 决策意图: ${report.intentClear}`);
    console.log(`- 数值风险: ${report.numericRisk}`);
    for (const note of report.notes) {
      console.log(`  - ${note}`);
    }
  }
}

main();
