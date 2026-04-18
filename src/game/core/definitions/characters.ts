import { STATUS_MOMENTUM } from './statuses';

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
  passiveName: string;
  passiveDescription: string;
  passive: CharacterPassive;
}

export const DEFAULT_CHARACTER_ID = 'walker';

export const CHARACTER_DEFINITIONS: Record<string, CharacterDefinition> = {
  [DEFAULT_CHARACTER_ID]: {
    id: DEFAULT_CHARACTER_ID,
    name: '行者',
    title: '试作角色',
    description: '围绕连势构筑节奏，通过蓄势与兑现建立回合优势。',
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
