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
import { loadFastMode, saveFastMode } from '../core/presentation/fastModeSettings';
import {
  completeTutorialStep,
  loadTutorialProgress,
  resetTutorial,
  skipTutorial,
  type TutorialProgress,
  type TutorialStep,
} from '../core/presentation/tutorialProgress';

type NodeResultSource = 'reward' | 'shop' | 'event' | 'rest';

interface NodeResultState {
  source: NodeResultSource;
  message: string;
}

function getNodeResult(
  command: GameCommand,
  before: RunState,
  after: RunState,
): NodeResultState | null {
  if (before.screen.type === 'map' || after.screen.type !== 'map') return null;

  switch (command.type) {
    case 'SELECT_REWARD_CARD':
    case 'TAKE_REWARD_GOLD':
    case 'TAKE_REWARD_UPGRADE_CARD':
      return {
        source: 'reward',
        message: after.meta.actTransitionFrom
          ? '章节奖励已结算，准备进入下一章。'
          : '奖励已结算，带着新的选择继续前进。',
      };
    case 'RESOLVE_EVENT_OPTION':
      return {
        source: 'event',
        message: '事件选择已生效，生命、金币或构筑变化已记入本局。',
      };
    case 'LEAVE_SHOP_TO_MAP':
      return {
        source: 'shop',
        message: '交易已完成，商品与牌组变化已记入本局。',
      };
    case 'RESOLVE_REST_OPTION':
    case 'LEAVE_REST_TO_MAP':
      return {
        source: 'rest',
        message: '休整已完成，生命与构筑变化已记入本局。',
      };
    default:
      return null;
  }
}

interface GameStoreState {
  run: RunState | null;
  profile: ProfileState;
  pendingEvents: GameEvent[];
  /** 当前战斗可读日志（非权威状态，仅展示） */
  battleLog: string[];
  /** 缩短战斗表现耗时 */
  fastMode: boolean;
  tutorial: TutorialProgress;
  actionNotice: string | null;
  nodeResult: NodeResultState | null;
  engine: GameEngine;
  initRun: (run: RunState) => void;
  startRun: (run: RunState) => void;
  resetProfile: () => void;
  /** 回到标题界面，不清 localStorage（可再点「继续」） */
  returnToMainMenu: () => void;
  dispatchCommand: (command: GameCommand) => void;
  consumeEvents: () => GameEvent[];
  setFastMode: (value: boolean) => void;
  markTutorialStep: (step: TutorialStep) => void;
  skipTutorial: () => void;
  resetTutorial: () => void;
  clearActionNotice: () => void;
  continueNodeResult: () => void;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  run: null,
  profile: loadProfileFromLocalStorage(),
  pendingEvents: [],
  battleLog: [],
  fastMode: loadFastMode(),
  tutorial: loadTutorialProgress(),
  actionNotice: null,
  nodeResult: null,
  engine: new GameEngine(),

  setFastMode: (value) => {
    saveFastMode(value);
    set({ fastMode: value });
  },
  markTutorialStep: (step) => {
    const next = completeTutorialStep(get().tutorial, step);
    if (next !== get().tutorial) set({ tutorial: next });
  },
  skipTutorial: () => set({ tutorial: skipTutorial() }),
  resetTutorial: () => set({ tutorial: resetTutorial() }),
  clearActionNotice: () => set({ actionNotice: null }),
  continueNodeResult: () => set({ nodeResult: null }),

  initRun: (run) => {
    const profile = observeRun(get().profile, run);
    set({ run, profile, pendingEvents: [], battleLog: [], actionNotice: null, nodeResult: null });
    saveProfileToLocalStorage(profile);
    if (run.screen.type === 'game_over') clearSavedRun();
    else saveRunToLocalStorage(run);
  },

  startRun: (run) => {
    const profile = recordRunStarted(get().profile, run);
    set({ run, profile, pendingEvents: [], battleLog: [], actionNotice: null, nodeResult: null });
    saveProfileToLocalStorage(profile);
    saveRunToLocalStorage(run);
  },

  resetProfile: () => {
    const profile = createEmptyProfile();
    set({ profile });
    clearProfileFromLocalStorage();
  },

  returnToMainMenu: () => {
    set({ run: null, pendingEvents: [], battleLog: [], actionNotice: null, nodeResult: null });
  },

  dispatchCommand: (command) => {
    const { run, engine, pendingEvents } = get();
    if (!run) return;

    const result = engine.dispatch(run, command);
    playGameCommandSounds(command, result.events);
    const actionNotice = buildCommandNotice(command, run, result.nextRun);
    const nodeResult = getNodeResult(command, run, result.nextRun);
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
      nodeResult,
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
