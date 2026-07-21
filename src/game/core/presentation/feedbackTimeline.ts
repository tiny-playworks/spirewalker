import { getStatusMeta } from '../definitions/statuses';
import type { GameEvent } from '../events/types';

export type FeedbackCueTone = 'damage' | 'block' | 'status' | 'momentum' | 'defeat';

export interface FeedbackCue {
  id: string;
  unitId: string;
  text: string;
  tone: FeedbackCueTone;
  delayMs: number;
}

export function buildFeedbackTimeline(events: readonly GameEvent[]): FeedbackCue[] {
  const cues: FeedbackCue[] = [];
  events.forEach((event, index) => {
    const common = { id: `${index}-${event.type}`, delayMs: index * 55 };
    if (event.type === 'DAMAGE_DEALT') {
      cues.push({ ...common, unitId: event.targetUnitId, text: `−${event.value}`, tone: 'damage' });
    } else if (event.type === 'BLOCK_GAINED') {
      cues.push({ ...common, unitId: event.unitId, text: `+${event.value} 格挡`, tone: 'block' });
    } else if (event.type === 'BLOCK_ABSORBED') {
      cues.push({
        ...common,
        unitId: event.unitId,
        text: event.remainingBlock === 0 ? '格挡破碎' : `−${event.value} 格挡`,
        tone: 'block',
      });
    } else if (event.type === 'STATUS_APPLIED') {
      cues.push({ ...common, unitId: event.unitId, text: `${getStatusMeta(event.statusId).shortLabel} +${event.value}`, tone: 'status' });
    } else if (event.type === 'MOMENTUM_CONSUMED') {
      cues.push({ ...common, unitId: event.unitId, text: `连势兑现 −${event.value}`, tone: 'momentum' });
    } else if (event.type === 'UNIT_DIED') {
      cues.push({ ...common, unitId: event.unitId, text: '击破', tone: 'defeat' });
    }
  });
  return cues;
}

export function feedbackDurationMs(events: readonly GameEvent[], fastMode: boolean): number {
  if (fastMode) return 100;
  return Math.min(720, 260 + buildFeedbackTimeline(events).length * 70);
}
