import { addStatusStacks } from '../../combat/statusCombat';
import type { GameCommand } from '../../commands/types';
import { CARD_DEFINITIONS } from '../../definitions/cards/starter';
import { createInstanceId } from '../../utils/id';
import type { RunState } from '../../model/run';

export function debugSetPlayerHp(run: RunState, hp: number): void {
  const v = Math.max(1, Math.min(run.player.maxHp, Math.floor(hp)));
  run.player.currentHp = v;
  if (run.battle) {
    const p = run.battle.units[run.battle.playerUnitId];
    if (p) p.hp = v;
  }
}

export function debugAddStatus(
  run: RunState,
  input: Extract<GameCommand, { type: 'DEBUG_ADD_STATUS' }>,
): void {
  const battle = run.battle;
  if (!battle) return;
  const targetId = input.unitId ?? battle.playerUnitId;
  const unit = battle.units[targetId];
  if (!unit) return;
  addStatusStacks(unit, input.statusId, Math.max(1, input.stacks));
}

export function debugAddHandCard(run: RunState, definitionId: string): void {
  const battle = run.battle;
  if (!battle) return;
  const def = CARD_DEFINITIONS[definitionId];
  if (!def) return;
  const instanceId = createInstanceId('debug_card');
  battle.player.cards[instanceId] = {
    instanceId,
    definitionId,
    baseCost: def.cost,
    costForTurn: def.cost,
    upgraded: false,
  };
  battle.player.hand.push(instanceId);
}

export function debugForceBattleOutcome(
  run: RunState,
  outcome: Extract<GameCommand, { type: 'DEBUG_FORCE_BATTLE_OUTCOME' }>['outcome'],
): void {
  if (!run.battle) return;
  run.battle.phase = outcome;
  if (outcome === 'defeat') {
    const p = run.battle.units[run.battle.playerUnitId];
    if (p) {
      p.hp = 0;
      p.alive = false;
    }
    run.player.currentHp = 0;
  }
}

export function debugJumpScreen(
  run: RunState,
  screen: Extract<GameCommand, { type: 'DEBUG_JUMP_SCREEN' }>['screen'],
): void {
  if (screen === 'event') run.screen = { type: 'event', eventId: 'wandering_merchant' };
  else run.screen = { type: screen };
}
