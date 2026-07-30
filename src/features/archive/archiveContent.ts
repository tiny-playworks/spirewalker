import { CARD_DEFINITIONS } from '@/game/core/definitions/cards';
import { parseCardId } from '@/game/core/definitions/cards/upgradeRules';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
import { RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import type { ProfileState } from '@/game/core/model/profile';
import type { RunState } from '@/game/core/model/run';

function uniqueExistingIds(
  ids: readonly string[],
  definitions: Record<string, unknown>,
): string[] {
  return [...new Set(ids)].filter((id) => Boolean(definitions[id]));
}

export function getPlayerCodexCardIds(
  profile: ProfileState,
  characterId = 'walker',
): string[] {
  const character = getCharacterDefinition(characterId);
  const discoveredBaseIds = profile.unlockedCards.map(
    (cardId) => parseCardId(cardId).baseId,
  );

  return uniqueExistingIds(
    [
      ...character.starterDeck,
      ...character.rewardCardPool,
      ...discoveredBaseIds,
    ],
    CARD_DEFINITIONS,
  );
}

export function getPlayerCodexRelicIds(
  profile: ProfileState,
  run: RunState | null,
  characterId = 'walker',
): string[] {
  const character = getCharacterDefinition(characterId);

  return uniqueExistingIds(
    [
      ...character.startingRelics,
      ...character.rewardRelicPool,
      ...profile.unlockedRelics,
      ...(run?.meta.relics ?? []),
    ],
    RELIC_DEFINITIONS,
  );
}
