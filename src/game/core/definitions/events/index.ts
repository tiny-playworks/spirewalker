export type EventType =
  | 'risk_reward'
  | 'curse_trade'
  | 'merchant'
  | 'memory'
  | 'corruption'
  | 'strange_machine'
  | 'ancient_shrine'
  | 'random_gamble';

export interface EventOutcome {
  type: 'gain_gold' | 'lose_gold' | 'gain_hp' | 'lose_hp' | 'gain_card' | 'lose_max_hp' | 'gain_relic' | 'gain_momentum' | 'nothing';
  value?: number;
  cardId?: string;
  relicId?: string;
  description: string;
}

export interface EventChoice {
  id: string;
  text: string;
  requirements?: string;
  outcomes: EventOutcome[];
}

export interface EventDefinition {
  id: string;
  name: string;
  description: string;
  chapter: 1 | 2 | 3;
  type: EventType;
  choices: EventChoice[];
}

import { GENERATED_EVENTS_1 } from './batch1';
import { GENERATED_EVENTS_2 } from './batch2';
import { GENERATED_EVENTS_3 } from './batch3';

export const EVENT_DEFINITIONS: Record<string, EventDefinition> = {
  ...GENERATED_EVENTS_1,
  ...GENERATED_EVENTS_2,
  ...GENERATED_EVENTS_3,
};

export const EVENT_IDS = Object.keys(EVENT_DEFINITIONS);

export const EVENTS_BY_CHAPTER: Record<number, EventDefinition[]> = {
  1: Object.values(EVENT_DEFINITIONS).filter(e => e.chapter === 1),
  2: Object.values(EVENT_DEFINITIONS).filter(e => e.chapter === 2),
  3: Object.values(EVENT_DEFINITIONS).filter(e => e.chapter === 3),
};

export const EVENTS_BY_TYPE: Record<EventType, EventDefinition[]> = {
  risk_reward: Object.values(EVENT_DEFINITIONS).filter(e => e.type === 'risk_reward'),
  curse_trade: Object.values(EVENT_DEFINITIONS).filter(e => e.type === 'curse_trade'),
  merchant: Object.values(EVENT_DEFINITIONS).filter(e => e.type === 'merchant'),
  memory: Object.values(EVENT_DEFINITIONS).filter(e => e.type === 'memory'),
  corruption: Object.values(EVENT_DEFINITIONS).filter(e => e.type === 'corruption'),
  strange_machine: Object.values(EVENT_DEFINITIONS).filter(e => e.type === 'strange_machine'),
  ancient_shrine: Object.values(EVENT_DEFINITIONS).filter(e => e.type === 'ancient_shrine'),
  random_gamble: Object.values(EVENT_DEFINITIONS).filter(e => e.type === 'random_gamble'),
};
