import { create } from 'zustand';
import { pressureProfileLabel } from '../core/battleUiText';
import { formatBattleLogLine } from '../core/battleLogFormat';
import { GameEngine } from '../core/engine/GameEngine';
import type { GameCommand } from '../core/commands/types';
import type { GameEvent } from '../core/events/types';
import { clearSavedRun, saveRunToLocalStorage } from '../core/persistence/saveRun';
import type { RunState } from '../core/model/run';

interface GameStoreState {
  run: RunState | null;
  pendingEvents: GameEvent[];
  /** 当前战斗可读日志（非权威状态，仅展示） */
  battleLog: string[];
  /** 缩短 Phaser 飘字等表现耗时 */
  fastMode: boolean;
  engine: GameEngine;
  initRun: (run: RunState) => void;
  /** 回到标题界面，不清 localStorage（可再点「继续」） */
  returnToMainMenu: () => void;
  dispatchCommand: (command: GameCommand) => void;
  consumeEvents: () => GameEvent[];
  setFastMode: (value: boolean) => void;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  run: null,
  pendingEvents: [],
  battleLog: [],
  fastMode: false,
  engine: new GameEngine(),

  setFastMode: (value) => set({ fastMode: value }),

  initRun: (run) => {
    set({ run, pendingEvents: [], battleLog: [] });
    if (run.screen.type === 'game_over') clearSavedRun();
    else saveRunToLocalStorage(run);
  },

  returnToMainMenu: () => {
    set({ run: null, pendingEvents: [], battleLog: [] });
  },

  dispatchCommand: (command) => {
    const { run, engine, pendingEvents } = get();
    if (!run) return;

    const result = engine.dispatch(run, command);
    const lines = result.events.flatMap((event) => {
      const nextLines = [formatBattleLogLine(run, event)];
      if (event.type === 'ENTERED_BATTLE_FROM_MAP') {
        const profile = result.nextRun.battle?.encounter.pressureProfile;
        if (profile) nextLines.push(`本战题型：${pressureProfileLabel(profile)}`);
      }
      return nextLines;
    });

    set({
      run: result.nextRun,
      pendingEvents: [...pendingEvents, ...result.events],
      battleLog: [...get().battleLog, ...lines].slice(-100),
    });

    const next = get().run;
    if (next?.screen.type === 'game_over') clearSavedRun();
    else if (next) saveRunToLocalStorage(next);
  },

  consumeEvents: () => {
    const events = get().pendingEvents;
    set({ pendingEvents: [] });
    return events;
  },
}));
