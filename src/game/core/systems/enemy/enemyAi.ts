import { getMonsterDefinition } from '../../definitions/monsters';
import type {
  MonsterAiDefinition,
  MonsterDefinition,
} from '../../definitions/monsters';
import type { BattleState, MonsterBattleState, MonsterIntent } from '../../model/battle';

export interface IntentComputation {
  intent: MonsterIntent;
  trace: string;
  bossPhase?: 1 | 2;
  bossPhaseLabel?: string;
}

function pickPatternIntent(pattern: readonly MonsterIntent[], moveHistoryLength: number): MonsterIntent {
  return pattern[moveHistoryLength % pattern.length]!;
}

function computeCycleAttackIntent(
  def: MonsterDefinition,
  ai: Extract<MonsterAiDefinition, { scriptId: 'cycle_attack' }>,
  moveHistoryLength: number,
): IntentComputation {
  return {
    intent: pickPatternIntent(ai.params.attacks, moveHistoryLength),
    trace: `cycle_attack[${def.id}] len=${moveHistoryLength}`,
  };
}

function computeCycleAttackBlockIntent(
  def: MonsterDefinition,
  ai: Extract<MonsterAiDefinition, { scriptId: 'cycle_attack_block' }>,
  moveHistoryLength: number,
): IntentComputation {
  if (moveHistoryLength % 2 === 0) {
    return {
      intent: pickPatternIntent(ai.params.attacks, moveHistoryLength / 2),
      trace: `cycle_attack_block[${def.id}] len=${moveHistoryLength} -> attack`,
    };
  }
  return {
    intent: { type: 'block', value: ai.params.block },
    trace: `cycle_attack_block[${def.id}] len=${moveHistoryLength} -> block=${ai.params.block}`,
  };
}

function computeCycleAttackDebuffIntent(
  def: MonsterDefinition,
  ai: Extract<MonsterAiDefinition, { scriptId: 'cycle_attack_debuff' }>,
  moveHistoryLength: number,
): IntentComputation {
  if (moveHistoryLength % 2 === 0) {
    return {
      intent: pickPatternIntent(ai.params.attacks, moveHistoryLength / 2),
      trace: `cycle_attack_debuff[${def.id}] len=${moveHistoryLength} -> attack`,
    };
  }
  return {
    intent:
      ai.params.mode === 'buff'
        ? { type: 'buff', statusId: ai.params.statusId, value: ai.params.value }
        : { type: 'debuff', statusId: ai.params.statusId, value: ai.params.value },
    trace: `cycle_attack_debuff[${def.id}] len=${moveHistoryLength} -> ${ai.params.mode} ${ai.params.statusId} ${ai.params.value}`,
  };
}

function computeMomentumBreakIntent(
  def: MonsterDefinition,
  ai: Extract<MonsterAiDefinition, { scriptId: 'momentum_break' }>,
  moveHistoryLength: number,
): IntentComputation {
  if (moveHistoryLength % 2 === 0) {
    return {
      intent: { type: 'attack', value: ai.params.attack },
      trace: `momentum_break[${def.id}] len=${moveHistoryLength} -> attack=${ai.params.attack}`,
    };
  }
  return {
    intent: { type: 'reduce_status', statusId: 'momentum', value: ai.params.reduceValue },
    trace: `momentum_break[${def.id}] len=${moveHistoryLength} -> reduce momentum by ${ai.params.reduceValue}`,
  };
}

function computeMultiPlayPunishIntent(
  def: MonsterDefinition,
  ai: Extract<MonsterAiDefinition, { scriptId: 'multi_play_punish' }>,
  moveHistoryLength: number,
): IntentComputation {
  if (moveHistoryLength % 2 === 0) {
    return {
      intent: { type: 'attack', value: ai.params.attack },
      trace: `multi_play_punish[${def.id}] len=${moveHistoryLength} -> attack=${ai.params.attack}`,
    };
  }
  return {
    intent: {
      type: 'punish_multi_play',
      threshold: ai.params.threshold,
      block: ai.params.block,
    },
    trace: `multi_play_punish[${def.id}] len=${moveHistoryLength} -> punish threshold=${ai.params.threshold} block=${ai.params.block}`,
  };
}

function computeBossPhaseShiftIntent(
  def: MonsterDefinition,
  ai: Extract<MonsterAiDefinition, { scriptId: 'boss_phase_shift' }>,
  moveHistoryLength: number,
  hpRate: number,
): IntentComputation {
  const bossPhase = hpRate <= ai.params.threshold ? 2 : 1;
  const pattern = bossPhase === 1 ? ai.params.phase1 : ai.params.phase2;
  return {
    intent: pickPatternIntent(pattern, moveHistoryLength),
    trace: `boss_phase_shift[${def.id}] len=${moveHistoryLength} -> phase=${bossPhase}`,
    bossPhase,
    bossPhaseLabel: ai.params.phaseLabels[bossPhase - 1],
  };
}

function computeLegacyIntent(monsterId: string, moveHistoryLength: number): IntentComputation {
  const def = getMonsterDefinition(monsterId);
  if (!def) throw new Error(`enemyAi: unknown monsterId "${monsterId}"`);
  if (monsterId === 'slime_boss') {
    return {
      intent: moveHistoryLength % 2 === 0 ? { type: 'attack', value: 6 } : { type: 'attack', value: 9 },
      trace: `cycle_attack[slime_boss] len=${moveHistoryLength}`,
    };
  }

  switch (def.ai.scriptId) {
    case 'cycle_attack':
      return computeCycleAttackIntent(def, def.ai, moveHistoryLength);
    case 'cycle_attack_block':
      return computeCycleAttackBlockIntent(def, def.ai, moveHistoryLength);
    case 'cycle_attack_debuff':
      return computeCycleAttackDebuffIntent(def, def.ai, moveHistoryLength);
    case 'momentum_break':
      return computeMomentumBreakIntent(def, def.ai, moveHistoryLength);
    case 'multi_play_punish':
      return computeMultiPlayPunishIntent(def, def.ai, moveHistoryLength);
    case 'boss_phase_shift':
      return computeBossPhaseShiftIntent(def, def.ai, moveHistoryLength, 1);
  }
}

export function computeIntentForMonster(
  battleOrMonsterId: BattleState | string,
  enemyUnitIdOrMoveHistoryLength: string | number,
  moveHistoryLength?: number,
): IntentComputation {
  if (typeof battleOrMonsterId === 'string') {
    return computeLegacyIntent(battleOrMonsterId, enemyUnitIdOrMoveHistoryLength as number);
  }

  const battle = battleOrMonsterId;
  const enemyUnitId = enemyUnitIdOrMoveHistoryLength as string;
  const historyLength = moveHistoryLength ?? 0;
  const monster = battle.monsters[enemyUnitId];
  const unit = battle.units[enemyUnitId];
  if (!monster || !unit) throw new Error(`enemyAi: unknown enemy unit "${enemyUnitId}"`);
  const def = getMonsterDefinition(monster.monsterId);
  if (!def) throw new Error(`enemyAi: unknown monsterId "${monster.monsterId}"`);

  switch (def.ai.scriptId) {
    case 'cycle_attack':
      return computeCycleAttackIntent(def, def.ai, historyLength);
    case 'cycle_attack_block':
      return computeCycleAttackBlockIntent(def, def.ai, historyLength);
    case 'cycle_attack_debuff':
      return computeCycleAttackDebuffIntent(def, def.ai, historyLength);
    case 'momentum_break':
      return computeMomentumBreakIntent(def, def.ai, historyLength);
    case 'multi_play_punish':
      return computeMultiPlayPunishIntent(def, def.ai, historyLength);
    case 'boss_phase_shift': {
      const hpRate = unit.maxHp <= 0 ? 0 : unit.hp / unit.maxHp;
      return computeBossPhaseShiftIntent(def, def.ai, historyLength, hpRate);
    }
  }
}

export function applyIntentToMonster(monster: MonsterBattleState, comp: IntentComputation): void {
  monster.intent = comp.intent;
  monster.aiTrace = comp.trace;
  monster.bossPhase = comp.bossPhase;
  monster.bossPhaseLabel = comp.bossPhaseLabel;
}

export function refreshEnemyIntent(battle: BattleState, enemyUnitId: string): void {
  const monster = battle.monsters[enemyUnitId];
  if (!monster) return;
  applyIntentToMonster(monster, computeIntentForMonster(battle, enemyUnitId, monster.moveHistory.length));
}

export function setInitialEnemyIntent(battle: BattleState, enemyUnitId: string): void {
  const monster = battle.monsters[enemyUnitId];
  if (!monster) return;
  applyIntentToMonster(monster, computeIntentForMonster(battle, enemyUnitId, 0));
}
