import { buildInitialBattle, createMvpRun } from '../engine/createMvpRun';
import type { RunState } from '../model/run';

export type ArchetypeDebugPresetId = 'burst' | 'guard' | 'mixed';

export interface ArchetypeDebugPreset {
  id: ArchetypeDebugPresetId;
  cards: [string, string];
  relics: [string, string];
}

export const ARCHETYPE_DEBUG_PRESETS: Record<ArchetypeDebugPresetId, ArchetypeDebugPreset> = {
  burst: {
    id: 'burst',
    cards: ['overload', 'blood_rush'],
    relics: ['blaze_core', 'fractured_blade'],
  },
  guard: {
    id: 'guard',
    cards: ['fortify', 'patience_stance'],
    relics: ['iron_heart', 'counter_sigil'],
  },
  mixed: {
    id: 'mixed',
    cards: ['flow_shift', 'balance_edge'],
    relics: ['twin_core', 'harmony_emblem'],
  },
};

function buildPresetDeck(flagCards: readonly [string, string]): string[] {
  return [
    ...flagCards,
    'strike',
    'strike',
    'strike',
    'defend',
    'defend',
    'defend',
    'momentum',
    'brace_rhythm',
  ];
}

/**
 * 仅用于本地机制验收的 debug 入口：
 * - 不改 rewardCardPool / rewardRelicPool；
 * - 不新增任何正式节点或 UI 入口；
 * - 只构建「可稳定复现目标流派机制」的一场普通战斗初始 Run。
 */
export function createArchetypeDebugPresetRun(
  seed: number,
  presetId: ArchetypeDebugPresetId,
): RunState {
  const run = createMvpRun(seed);
  const preset = ARCHETYPE_DEBUG_PRESETS[presetId];
  const masterDeck = buildPresetDeck(preset.cards);
  const battle = buildInitialBattle(
    seed,
    { currentHp: run.player.currentHp, maxHp: run.player.maxHp },
    `debug_${presetId}_battle`,
    masterDeck,
    undefined,
    [...preset.relics],
    run.meta.characterId,
  );
  return {
    ...run,
    masterDeck,
    battle,
    screen: { type: 'battle' },
    meta: {
      ...run.meta,
      relics: [...preset.relics],
    },
  };
}
