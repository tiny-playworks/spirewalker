import { create } from 'zustand';
import { pressureProfileLabel } from '../core/battleUiText';
import { formatBattleLogLine } from '../core/battleLogFormat';
import { GameEngine } from '../core/engine/GameEngine';
import type { GameCommand } from '../core/commands/types';
import type { GameEvent } from '../core/events/types';
import {
  clearProfileFromLocalStorage,
  loadProfileFromLocalStorage,
  saveProfileToLocalStorage,
} from '../core/persistence/saveProfile';
import { clearSavedRun, saveRunToLocalStorage } from '../core/persistence/saveRun';
import {
  createEmptyProfile,
  observeRun,
  recordRunStarted,
  recordRunWin,
  type ProfileState,
} from '../core/model/profile';
import type { RunState } from '../core/model/run';
import { buildCommandNotice } from '../core/presentation/commandNotice';
import { playGameCommandSounds } from '../core/audio/gameAudio';

interface GameStoreState {
  run: RunState | null;
  profile: ProfileState;
  pendingEvents: GameEvent[];
  /** 当前战斗可读日志（非权威状态，仅展示） */
  battleLog: string[];
  /** 缩短战斗表现耗时 */
  fastMode: boolean;
  actionNotice: string | null;
  engine: GameEngine;
  initRun: (run: RunState) => void;
  startRun: (run: RunState) => void;
  resetProfile: () => void;
  /** 回到标题界面，不清 localStorage（可再点「继续」） */
  returnToMainMenu: () => void;
  dispatchCommand: (command: GameCommand) => void;
  consumeEvents: () => GameEvent[];
  setFastMode: (value: boolean) => void;
  clearActionNotice: () => void;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  run: null,
  profile: loadProfileFromLocalStorage(),
  pendingEvents: [],
  battleLog: [],
  fastMode: false,
  actionNotice: null,
  engine: new GameEngine(),

  setFastMode: (value) => set({ fastMode: value }),
  clearActionNotice: () => set({ actionNotice: null }),

  initRun: (run) => {
    const profile = observeRun(get().profile, run);
    set({ run, profile, pendingEvents: [], battleLog: [], actionNotice: null });
    saveProfileToLocalStorage(profile);
    if (run.screen.type === 'game_over') clearSavedRun();
    else saveRunToLocalStorage(run);
  },

  startRun: (run) => {
    const profile = recordRunStarted(get().profile, run);
    set({ run, profile, pendingEvents: [], battleLog: [], actionNotice: null });
    saveProfileToLocalStorage(profile);
    saveRunToLocalStorage(run);
  },

  resetProfile: () => {
    const profile = createEmptyProfile();
    set({ profile });
    clearProfileFromLocalStorage();
  },

  returnToMainMenu: () => {
    set({ run: null, pendingEvents: [], battleLog: [], actionNotice: null });
  },

  dispatchCommand: (command) => {
    const { run, engine, pendingEvents } = get();
    if (!run) return;

    const result = engine.dispatch(run, command);
    playGameCommandSounds(command, result.events);
    const actionNotice = buildCommandNotice(command, run, result.nextRun);
    let profile = observeRun(get().profile, result.nextRun);
    if (run.screen.type !== 'victory' && result.nextRun.screen.type === 'victory') {
      profile = recordRunWin(profile, result.nextRun);
    }
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
      profile,
      pendingEvents: [...pendingEvents, ...result.events],
      battleLog: [...get().battleLog, ...lines].slice(-100),
      actionNotice: actionNotice ?? get().actionNotice,
    });

    const next = get().run;
    saveProfileToLocalStorage(profile);
    if (next?.screen.type === 'game_over') clearSavedRun();
    else if (next) saveRunToLocalStorage(next);
  },

  consumeEvents: () => {
    const events = get().pendingEvents;
    set({ pendingEvents: [] });
    return events;
  },
}));
