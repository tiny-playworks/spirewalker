import { STATUS_MOMENTUM } from './statuses';
import {
  ANCHORED_BREATH,
  BRACE_RHYTHM,
  BREAK_OPENING,
  BURST_STRIKE,
  CASH_FLOW,
  DEFEND,
  FULL_RELEASE,
  HELD_BREATH,
  MOMENTUM,
  MEASURED_REST,
  PATIENT_CUT,
  PRIME_RHYTHM,
  RELEASE_FLOW,
  SNAP_STRIKE,
  STRIKE,
  SOFT_STEP,
  SURVEY_FIELD,
  TEMPO_GUARD,
  QUICK_RELEASE,
  FOLLOW_THROUGH,
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
      SOFT_STEP.id,
      HELD_BREATH.id,
      ANCHORED_BREATH.id,
      PATIENT_CUT.id,
      QUICK_RELEASE.id,
      FOLLOW_THROUGH.id,
      BREAK_OPENING.id,
      FULL_RELEASE.id,
      SURVEY_FIELD.id,
      MEASURED_REST.id,
    ],
    rewardRelicPool: [
      'guard_knot',
      'still_core',
      'burst_emblem',
      'quick_fuse',
    ],
    buildBranches: [
      {
        id: 'guard_line',
        name: '保势防守线',
        coreCardIds: [HELD_BREATH.id, PATIENT_CUT.id],
        coreRelicId: 'guard_knot',
      },
      {
        id: 'burst_line',
        name: '快速兑现线',
        coreCardIds: [BREAK_OPENING.id, FULL_RELEASE.id],
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
