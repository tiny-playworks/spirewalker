import type { GameCommand } from '../../commands/types';
import {
  listUpgradableDeckIndices,
  upgradeMasterDeckAt,
} from '../../definitions/cards/upgradeRules';
import type { RunState } from '../../model/run';

export const REST_HEAL_RATIO = 0.3;
export const REST_MOMENTUM_GAIN = 2;

function healAtRest(run: RunState): boolean {
  if (run.player.currentHp >= run.player.maxHp) return false;
  const heal = Math.floor(run.player.maxHp * REST_HEAL_RATIO);
  run.player.currentHp = Math.min(run.player.maxHp, run.player.currentHp + heal);
  return true;
}

function meditateAtRest(run: RunState): void {
  run.meta.pendingBattleMomentum =
    (run.meta.pendingBattleMomentum ?? 0) + REST_MOMENTUM_GAIN;
}

export function resolveRestOptionFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'RESOLVE_REST_OPTION' }>,
): void {
  if (run.screen.type !== 'rest') return;

  if (command.option === 'heal') {
    if (!healAtRest(run)) return;
  } else if (command.option === 'meditate') {
    meditateAtRest(run);
  } else {
    const index = command.masterDeckIndex;
    if (
      index === undefined
      || !listUpgradableDeckIndices(run.masterDeck).includes(index)
      || !upgradeMasterDeckAt(run, index)
    ) {
      return;
    }
  }

  run.screen = { type: 'map' };
}

export function leaveRestToMapFlow(run: RunState): void {
  if (run.screen.type !== 'rest') return;
  if (!healAtRest(run)) meditateAtRest(run);
  run.screen = { type: 'map' };
}
