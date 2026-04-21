import { STATUS_MOMENTUM } from './statuses';
import {
  BRACE_RHYTHM,
  BURST_STRIKE,
  CASH_FLOW,
  DEFEND,
  MOMENTUM,
  MEASURED_REST,
  PRIME_RHYTHM,
  RELEASE_FLOW,
  SECOND_WIND,
  SNAP_STRIKE,
  STRIKE,
  STEADY_STEP,
  TEMPO_GUARD,
} from './cards/starter';

export type CharacterPassive =
  | {
      type: 'battle_start_status';
      statusId: string;
      stacks: number;
    };

export interface CharacterDefinition {
  id: string;
  name: string;
  title: string;
  description: string;
  baseMaxHp: number;
  starterDeck: string[];
  startingRelics: string[];
  startingPotions: string[];
  rewardCardPool: string[];
  rewardRelicPool: string[];
  buildBranches: CharacterBuildBranch[];
  passiveName: string;
  passiveDescription: string;
  passive: CharacterPassive;
}

export interface CharacterBuildBranch {
  id: string;
  name: string;
  coreCardIds: [string, string];
  coreRelicId: string;
}

export const DEFAULT_CHARACTER_ID = 'walker';

export const CHARACTER_DEFINITIONS: Record<string, CharacterDefinition> = {
  [DEFAULT_CHARACTER_ID]: {
    id: DEFAULT_CHARACTER_ID,
    name: '行者',
    title: '节奏行者',
    description: '围绕连势构筑节奏，通过蓄势与兑现建立回合优势。',
    baseMaxHp: 50,
    starterDeck: [
      STRIKE.id,
      STRIKE.id,
      STRIKE.id,
      DEFEND.id,
      DEFEND.id,
      DEFEND.id,
      DEFEND.id,
      PRIME_RHYTHM.id,
      BRACE_RHYTHM.id,
      MEASURED_REST.id,
    ],
    startingRelics: [],
    startingPotions: ['healing_dew'],
    rewardCardPool: [
      MOMENTUM.id,
      TEMPO_GUARD.id,
      PRIME_RHYTHM.id,
      BRACE_RHYTHM.id,
      BURST_STRIKE.id,
      SNAP_STRIKE.id,
      CASH_FLOW.id,
      RELEASE_FLOW.id,
      STEADY_STEP.id,
      SECOND_WIND.id,
      'soft_step',
      'anchored_breath',
      'quick_release',
      'follow_through',
      'survey_field',
      'measured_rest',
    ],
    rewardRelicPool: [
      'guard_knot',
      'still_core',
      'soft_guard',
      'burst_emblem',
      'quick_fuse',
      'sighted_edge',
    ],
    buildBranches: [
      {
        id: 'guard_line',
        name: '保势防守线',
        coreCardIds: [BRACE_RHYTHM.id, TEMPO_GUARD.id],
        coreRelicId: 'guard_knot',
      },
      {
        id: 'burst_line',
        name: '快速兑现线',
        coreCardIds: [BURST_STRIKE.id, SNAP_STRIKE.id],
        coreRelicId: 'burst_emblem',
      },
    ],
    passiveName: '先手起势',
    passiveDescription: '每场战斗开始时获得 1 层连势。',
    passive: {
      type: 'battle_start_status',
      statusId: STATUS_MOMENTUM,
      stacks: 1,
    },
  },
};

export function getCharacterDefinition(characterId: string): CharacterDefinition {
  return CHARACTER_DEFINITIONS[characterId] ?? CHARACTER_DEFINITIONS[DEFAULT_CHARACTER_ID];
}
