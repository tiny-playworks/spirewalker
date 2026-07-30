import { describe, expect, test } from '@rstest/core';
import {
  getPlayerCodexCardIds,
  getPlayerCodexRelicIds,
} from '@/features/archive/archiveContent';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
import { createEmptyProfile } from '@/game/core/model/profile';

describe('archive/player-facing content', () => {
  test('卡牌图鉴只包含角色正式内容，不直接展开全量生成库', () => {
    const profile = createEmptyProfile();
    const character = getCharacterDefinition('walker');
    const ids = getPlayerCodexCardIds(profile);

    expect(ids).toHaveLength(38);
    expect(ids).toEqual([
      ...new Set([...character.starterDeck, ...character.rewardCardPool]),
    ]);
    expect(ids.every((id) => !id.endsWith('+') && !id.endsWith('++'))).toBe(true);
  });

  test('实际发现的额外内容会进入图鉴，升级卡归并到基础卡', () => {
    const profile = createEmptyProfile();
    profile.unlockedCards = ['burn_edge+', 'guard_strike_2'];

    const ids = getPlayerCodexCardIds(profile);

    expect(ids).toContain('burn_edge');
    expect(ids).toContain('guard_strike_2');
    expect(ids).not.toContain('burn_edge+');
  });

  test('遗物档案以角色正式池为基础，并补入实际发现内容', () => {
    const profile = createEmptyProfile();
    const formalIds = getPlayerCodexRelicIds(profile, null);

    expect(formalIds).toEqual(getCharacterDefinition('walker').rewardRelicPool);

    profile.unlockedRelics = ['vajra'];
    expect(getPlayerCodexRelicIds(profile, null)).toContain('vajra');
  });
});
