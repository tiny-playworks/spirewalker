import { getMonsterDefinition } from '../../definitions/monsters';
import type { BattleState, MonsterBattleState, MonsterIntent } from '../../model/battle';
import type { EnemyAiDefinition, EnemyAiPhase, EnemyDefinition } from '../../definitions/monsters';

export interface IntentComputation {
  intent: MonsterIntent;
  trace: string;
  bossPhase?: number;
  bossPhaseLabel?: string;
}

function pickPatternIntent(pattern: readonly MonsterIntent[], moveHistoryLength: number): MonsterIntent {
  if (pattern.length === 0) {
    throw new Error('enemyAi: empty rotation');
  }
  return pattern[moveHistoryLength % pattern.length]!;
}

function describeIntent(intent: MonsterIntent): string {
  switch (intent.type) {
    case 'attack':
      return `attack=${intent.value}`;
    case 'multi_hit':
      return `multi=${intent.value}x${intent.hits}`;
    case 'block':
      return `block=${intent.value}`;
    case 'reduce_status':
      return `reduce ${intent.statusId} by ${intent.value}`;
    case 'punish_multi_play':
      return `punish threshold=${intent.threshold} block=${intent.block}`;
    default:
      return intent.type;
  }
}

function pickPhase(phases: EnemyAiPhase[] | undefined, hpRate: number): {
  phase: EnemyAiPhase | null;
  phaseIndex: number;
} {
  if (!phases || phases.length === 0) return { phase: null, phaseIndex: 0 };
  let selectedIndex = 0;
  for (let index = 0; index < phases.length; index += 1) {
    const phase = phases[index]!;
    if (phase.threshold !== undefined && hpRate <= phase.threshold) {
      selectedIndex = index;
    }
  }
  return { phase: phases[selectedIndex] ?? null, phaseIndex: selectedIndex + 1 };
}

function computeGenericIntent(
  def: EnemyDefinition,
  ai: EnemyAiDefinition,
  moveHistoryLength: number,
  hpRate: number,
): IntentComputation {
  const { phase, phaseIndex } = pickPhase(ai.phases, hpRate);
  const pattern = phase?.rotation ?? ai.rotation ?? [];
  const intent = pickPatternIntent(pattern, moveHistoryLength);
  const phaseLabel = phase?.label;
  return {
    intent,
    trace: `${ai.archetype}[${def.id}] len=${moveHistoryLength}${phaseLabel ? ` phase=${phaseLabel}` : ''} -> ${describeIntent(intent)}`,
    bossPhase: phase ? phaseIndex : undefined,
    bossPhaseLabel: phaseLabel,
  };
}

function computeLegacyIntent(monsterId: string, moveHistoryLength: number): IntentComputation {
  const def = getMonsterDefinition(monsterId);
  if (!def) throw new Error(`enemyAi: unknown monsterId "${monsterId}"`);
  return computeGenericIntent(def, def.ai, moveHistoryLength, 1);
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
  const hpRate = unit.maxHp <= 0 ? 0 : unit.hp / unit.maxHp;
  return computeGenericIntent(def, def.ai, historyLength, hpRate);
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
