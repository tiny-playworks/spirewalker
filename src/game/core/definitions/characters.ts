import { STATUS_MOMENTUM } from './statuses';
import {
  DEFEND,
  STRIKE,
  FORTIFY,
  PATIENCE_STANCE,
  OVERLOAD,
  BLOOD_RUSH,
  FLOW_SHIFT,
  BALANCE_EDGE,
  PRIME_RHYTHM,
  BRACE_RHYTHM,
  MEASURED_REST,
  CARD_DEFINITIONS,
} from './cards/starter';

function buildRewardCardPool(): string[] {
  const SKIP = new Set(['strike', 'defend']);
  return Object.entries(CARD_DEFINITIONS)
    .filter(([id, def]) => !SKIP.has(id) && def.type !== 'curse' && def.type !== 'status')
    .map(([id]) => id);
}

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
    rewardCardPool: buildRewardCardPool(),
    rewardRelicPool: [
      'guard_knot',
      'still_core',
      'burst_emblem',
      'quick_fuse',
      'ward_banner',
      'flare_banner',
      'blaze_core',
      'fractured_blade',
      'iron_heart',
      'counter_sigil',
      'twin_core',
      'harmony_emblem',
    ],
    buildBranches: [
      {
        id: 'guard_line',
        name: '延迟防守线',
        coreCardIds: [FORTIFY.id, PATIENCE_STANCE.id],
        coreRelicId: 'counter_sigil',
      },
      {
        id: 'burst_line',
        name: '窗口爆发线',
        coreCardIds: [OVERLOAD.id, BLOOD_RUSH.id],
        coreRelicId: 'fractured_blade',
      },
      {
        id: 'mixed_line',
        name: '攻防切换线',
        coreCardIds: [FLOW_SHIFT.id, BALANCE_EDGE.id],
        coreRelicId: 'harmony_emblem',
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
