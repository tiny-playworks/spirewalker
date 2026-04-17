import type { BattleState } from '@/game/core/model/battle';
import type { GameCommand } from '@/game/core/commands/types';
import { useGameStore } from '@/game/store/gameStore';

export function getBattleSnapshot(): BattleState | null {
  return useGameStore.getState().run?.battle ?? null;
}

export function dispatchGameCommand(command: GameCommand): void {
  useGameStore.getState().dispatchCommand(command);
}

export function consumePendingEvents() {
  return useGameStore.getState().consumeEvents();
}

export function isFastModeEnabled(): boolean {
  return useGameStore.getState().fastMode;
}
