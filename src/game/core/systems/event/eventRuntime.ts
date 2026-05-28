import type { RunState } from '../../model/run';
import type { GameEvent } from '../../events/types';
import { EVENT_DEFINITIONS, type EventOutcome } from '../../definitions/events';

/**
 * 通用 EventOutcome → RunState 执行器。
 * 仅支持已有 EventOutcome type，不 invent 新类型。
 */
function applyOutcome(run: RunState, outcome: EventOutcome): boolean {
  switch (outcome.type) {
    case 'gain_gold':
      run.meta.gold += outcome.value ?? 0;
      return true;
    case 'lose_gold':
      if (run.meta.gold < (outcome.value ?? 0)) return false;
      run.meta.gold -= outcome.value ?? 0;
      return true;
    case 'gain_hp':
      run.player.currentHp = Math.min(run.player.maxHp, run.player.currentHp + (outcome.value ?? 0));
      return true;
    case 'lose_hp':
      run.player.currentHp = Math.max(1, run.player.currentHp - (outcome.value ?? 0));
      return true;
    case 'lose_max_hp':
      run.player.maxHp = Math.max(1, run.player.maxHp - (outcome.value ?? 0));
      run.player.currentHp = Math.min(run.player.currentHp, run.player.maxHp);
      return true;
    case 'gain_card':
      if (outcome.cardId) {
        run.masterDeck.push(outcome.cardId);
      }
      return true;
    case 'gain_relic':
      // gain_relic 由 reward flow 处理，此处仅标记
      return true;
    case 'gain_momentum':
      // gain_momentum 由战斗状态处理，事件中暂不处理
      return true;
    case 'nothing':
      return true;
    default:
      return false;
  }
}

/**
 * 通用事件解析器：从 EVENT_DEFINITIONS 查找事件，
 * 将 choice 对应的 outcomes 逐个执行。
 */
export function resolveGenericEvent(
  run: RunState,
  eventId: string,
  optionId: string,
  events: GameEvent[],
): boolean {
  const def = EVENT_DEFINITIONS[eventId];
  if (!def) return false;

  const choice = def.choices.find(c => c.id === optionId);
  if (!choice) return false;

  // 检查 requirements
  if (choice.requirements) {
    const match = choice.requirements.match(/gold\s*>=\s*(\d+)/);
    if (match && run.meta.gold < Number(match[1])) return false;
  }

  for (const outcome of choice.outcomes) {
    if (!applyOutcome(run, outcome)) return false;
  }

  run.screen = { type: 'map' };
  events.push({ type: 'EVENT_RESOLVED', eventId, optionId });
  return true;
}

/** 10 个试点 event ID，后续可扩展 */
export const PILOT_EVENT_IDS: readonly string[] = [
  'ruins_whisper',
  'abandoned_camp',
  'mysterious_merchant',
  'glowing_runes',
  'rusted_chest',
  'cursed_spring',
  'ancient_mural',
  'broken_golem',
  'shadow_bazaar',
  'gambling_den',
] as const;
