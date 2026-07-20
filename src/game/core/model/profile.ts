import type { RunState } from './run';

export interface ProfileState {
  version: 1;
  unlockedCards: string[];
  unlockedRelics: string[];
  achievements: string[];
  lifetimeStats: {
    runs: number;
    wins: number;
    highestAct: number;
  };
}

export const PROFILE_ACHIEVEMENT_IDS = {
  firstStep: 'first_step',
  cardCollection: 'card_collection',
  relicEcho: 'relic_echo',
  deepSpire: 'deep_spire',
  actTwo: 'act_two',
} as const;

export function createEmptyProfile(): ProfileState {
  return {
    version: 1,
    unlockedCards: [],
    unlockedRelics: [],
    achievements: [],
    lifetimeStats: { runs: 0, wins: 0, highestAct: 0 },
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter((value) => typeof value === 'string' && value.length > 0))];
}

function withRunAchievements(achievements: string[], run: RunState, relics: string[]): string[] {
  const next = new Set(achievements);
  next.add(PROFILE_ACHIEVEMENT_IDS.firstStep);
  if (run.masterDeck.length >= 12) next.add(PROFILE_ACHIEVEMENT_IDS.cardCollection);
  if (relics.length > 0) next.add(PROFILE_ACHIEVEMENT_IDS.relicEcho);
  if (run.meta.floor >= 5) next.add(PROFILE_ACHIEVEMENT_IDS.deepSpire);
  if (run.meta.act >= 2) next.add(PROFILE_ACHIEVEMENT_IDS.actTwo);
  return [...next];
}

export function observeRun(profile: ProfileState, run: RunState): ProfileState {
  const unlockedCards = unique([...profile.unlockedCards, ...run.masterDeck]);
  const unlockedRelics = unique([...profile.unlockedRelics, ...run.meta.relics]);
  return {
    ...profile,
    unlockedCards,
    unlockedRelics,
    achievements: withRunAchievements(profile.achievements, run, unlockedRelics),
    lifetimeStats: {
      ...profile.lifetimeStats,
      highestAct: Math.max(profile.lifetimeStats.highestAct, run.meta.act),
    },
  };
}

export function recordRunStarted(profile: ProfileState, run: RunState): ProfileState {
  return observeRun(
    {
      ...profile,
      lifetimeStats: {
        ...profile.lifetimeStats,
        runs: profile.lifetimeStats.runs + 1,
      },
    },
    run,
  );
}

export function recordRunWin(profile: ProfileState, run: RunState): ProfileState {
  return {
    ...observeRun(profile, run),
    lifetimeStats: {
      ...profile.lifetimeStats,
      wins: profile.lifetimeStats.wins + 1,
      highestAct: Math.max(profile.lifetimeStats.highestAct, run.meta.act),
    },
  };
}
