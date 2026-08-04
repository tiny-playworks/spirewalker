import { describe, expect, test } from '@rstest/core';
import { ITEM_BY_ID, RELICS } from '@/game/content';
import { createDefaultProfile, getCombatModifiers } from '@/game/progression';
import { getDismantleValue } from '@/game/rewards';
import { createRun, equipReward } from '@/game/run';
import type { RewardItem } from '@/game/types';

function reward(kind: RewardItem['kind'], definitionId: string, uid: string, rarity: RewardItem['rarity'] = 'common'): RewardItem {
  return { kind, definitionId, uid, rarity };
}

describe('V2 双武器与装备替换', () => {
  test('开局使用不绑定构筑路线的中性主副武器', () => {
    const run = createRun(createDefaultProfile(), 42);
    expect(run.weapons.map((slot) => ITEM_BY_ID.get(slot.weapon.definitionId)?.tag)).toEqual(['neutral', 'neutral']);
    expect(run.weapons[0].weapon.definitionId).not.toBe(run.weapons[1].weapon.definitionId);
  });

  test('枪头与核心分别安装到指定武器槽', () => {
    const profile = createDefaultProfile();
    const modifiers = getCombatModifiers(profile);
    let run = createRun(profile, 42);
    run = equipReward(run, reward('muzzle', 'muzzle-pierce', 'muzzle-1'), { weaponSlot: 1 }, modifiers);
    run = equipReward(run, reward('core', 'core-chill', 'core-1'), { weaponSlot: 1 }, modifiers);
    expect(run.weapons[0].muzzle).toBeNull();
    expect(run.weapons[1].muzzle?.definitionId).toBe('muzzle-pierce');
    expect(run.weapons[1].core?.definitionId).toBe('core-chill');
  });

  test('秘宝上限为八件，第九件必须替换并自动拆解旧件', () => {
    const profile = createDefaultProfile();
    const modifiers = getCombatModifiers(profile);
    let run = createRun(profile, 9);
    for (let index = 0; index < 8; index += 1) {
      run = equipReward(run, reward('relic', RELICS[index]!.id, `relic-${index}`), {}, modifiers);
    }
    expect(run.relics).toHaveLength(8);
    const replaced = run.relics[2]!;
    const goldBefore = run.gold;
    const incoming = reward('relic', RELICS[8]!.id, 'relic-8', 'rare');
    run = equipReward(run, incoming, { relicSlot: 2 }, modifiers);
    expect(run.relics).toHaveLength(8);
    expect(run.relics[2]).toEqual(incoming);
    expect(run.gold).toBe(goldBefore + getDismantleValue(replaced, 0.25));
  });
});
