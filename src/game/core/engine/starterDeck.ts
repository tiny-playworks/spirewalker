import { DEFAULT_CHARACTER_ID, getCharacterDefinition } from '../definitions/characters';

/** 默认返回当前唯一正式角色行者的 starter。 */
export function createStarterMasterDeck(characterId = DEFAULT_CHARACTER_ID): string[] {
  return [...getCharacterDefinition(characterId).starterDeck];
}
