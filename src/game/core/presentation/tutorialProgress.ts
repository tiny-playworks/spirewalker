export type TutorialStep = 'map' | 'card' | 'turn' | 'momentum' | 'reward';

export interface TutorialProgress {
  version: 2;
  skipped: boolean;
  completed: Record<TutorialStep, boolean>;
}

export const TUTORIAL_STEPS: readonly TutorialStep[] = [
  'map',
  'card',
  'turn',
  'momentum',
  'reward',
];

const KEY = 'sljt_tutorial_v2';

function freshTutorialProgress(): TutorialProgress {
  return {
    version: 2,
    skipped: false,
    completed: {
      map: false,
      card: false,
      turn: false,
      momentum: false,
      reward: false,
    },
  };
}

function normalize(value: unknown): TutorialProgress {
  const fallback = freshTutorialProgress();
  if (!value || typeof value !== 'object') return fallback;
  const source = value as Partial<TutorialProgress>;
  const completed = source.completed && typeof source.completed === 'object'
    ? source.completed as Partial<Record<TutorialStep, boolean>>
    : {};
  return {
    version: 2,
    skipped: Boolean(source.skipped),
    completed: {
      map: Boolean(completed.map),
      card: Boolean(completed.card),
      turn: Boolean(completed.turn),
      momentum: Boolean(completed.momentum),
      reward: Boolean(completed.reward),
    },
  };
}

export function loadTutorialProgress(): TutorialProgress {
  if (typeof window === 'undefined') return freshTutorialProgress();
  try {
    return normalize(JSON.parse(localStorage.getItem(KEY) ?? 'null'));
  } catch {
    return freshTutorialProgress();
  }
}

export function saveTutorialProgress(progress: TutorialProgress): void {
  try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch { /* 本地设置失败不影响游戏 */ }
}

export function completeTutorialStep(
  progress: TutorialProgress,
  step: TutorialStep,
): TutorialProgress {
  if (progress.skipped || progress.completed[step]) return progress;
  const next = { ...progress, completed: { ...progress.completed, [step]: true } };
  saveTutorialProgress(next);
  return next;
}

export function skipTutorial(): TutorialProgress {
  const next = { ...freshTutorialProgress(), skipped: true };
  saveTutorialProgress(next);
  return next;
}

export function resetTutorial(): TutorialProgress {
  const next = freshTutorialProgress();
  saveTutorialProgress(next);
  return next;
}

export function activeTutorialStep(progress: TutorialProgress): TutorialStep | null {
  if (progress.skipped) return null;
  return TUTORIAL_STEPS.find((step) => !progress.completed[step]) ?? null;
}
