import { describe, expect, test } from '@rstest/core';
import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import {
  CARD_UPGRADE_RULES,
  canUpgradeCardId,
  cardIdFor,
  listUpgradableDeckIndices,
  nextUpgradedId,
  parseCardId,
  upgradeMasterDeckAt,
} from '@/game/core/definitions/cards/upgradeRules';

describe('cards/upgradeRules', () => {
  test('parseCardId 能拆出 base id 与升级级别', () => {
    expect(parseCardId('strike')).toEqual({ baseId: 'strike', level: 0 });
    expect(parseCardId('strike+')).toEqual({ baseId: 'strike', level: 1 });
    expect(parseCardId('strike++')).toEqual({ baseId: 'strike', level: 2 });
  });

  test('cardIdFor 与 parseCardId 是一对互逆的 helper', () => {
    expect(cardIdFor('defend', 0)).toBe('defend');
    expect(cardIdFor('defend', 1)).toBe('defend+');
    expect(cardIdFor('defend', 2)).toBe('defend++');
  });

  test('升级版 CardDefinition 已经注册到 CARD_DEFINITIONS', () => {
    expect(CARD_DEFINITIONS['strike+']).toBeDefined();
    expect(CARD_DEFINITIONS['strike++']).toBeDefined();
    expect(CARD_DEFINITIONS['strike+']!.name).toBe('打击+');
    expect(CARD_DEFINITIONS['strike++']!.name).toBe('打击++');
  });

  test('strike+ 伤害数值叠加正确', () => {
    const base = CARD_DEFINITIONS.strike!;
    const plus = CARD_DEFINITIONS['strike+']!;
    const plusplus = CARD_DEFINITIONS['strike++']!;
    const baseDamage = (base.effects[0] as { value: number }).value;
    const plusDamage = (plus.effects[0] as { value: number }).value;
    const plusplusDamage = (plusplus.effects[0] as { value: number }).value;
    expect(plusDamage).toBe(baseDamage + 3);
    expect(plusplusDamage).toBe(baseDamage + 5);
  });

  test('burst_strike+ 的 custom_param 正确叠加 baseDamage', () => {
    const baseParams = (CARD_DEFINITIONS.burst_strike!.effects[0] as { params: { baseDamage: number; damagePerStack: number } }).params;
    const plusParams = (CARD_DEFINITIONS['burst_strike+']!.effects[0] as { params: { baseDamage: number; damagePerStack: number } }).params;
    expect(plusParams.baseDamage).toBe(baseParams.baseDamage + 2);
    expect(plusParams.damagePerStack).toBe(baseParams.damagePerStack);
  });

  test('canUpgradeCardId 在可升级与已满级时返回正确结果', () => {
    expect(canUpgradeCardId('strike')).toBe(true);
    expect(canUpgradeCardId('strike+')).toBe(true);
    expect(canUpgradeCardId('strike++')).toBe(false);
    expect(canUpgradeCardId('junk_sludge')).toBe(false);
    expect(canUpgradeCardId('nonexistent_card_id')).toBe(false);
  });

  test('nextUpgradedId 串起 base -> + -> ++ 的升级链', () => {
    expect(nextUpgradedId('strike')).toBe('strike+');
    expect(nextUpgradedId('strike+')).toBe('strike++');
    expect(nextUpgradedId('strike++')).toBeNull();
  });

  test('upgradeMasterDeckAt 对合法 index 写回升级后的 id', () => {
    const run = { masterDeck: ['strike', 'defend', 'junk_sludge'] };
    expect(upgradeMasterDeckAt(run, 0)).toBe(true);
    expect(run.masterDeck[0]).toBe('strike+');
    expect(upgradeMasterDeckAt(run, 0)).toBe(true);
    expect(run.masterDeck[0]).toBe('strike++');
    expect(upgradeMasterDeckAt(run, 0)).toBe(false);
  });

  test('upgradeMasterDeckAt 拒绝越界下标与不可升级卡', () => {
    const run = { masterDeck: ['strike', 'junk_sludge'] };
    expect(upgradeMasterDeckAt(run, -1)).toBe(false);
    expect(upgradeMasterDeckAt(run, 99)).toBe(false);
    expect(upgradeMasterDeckAt(run, 1)).toBe(false);
    expect(run.masterDeck).toEqual(['strike', 'junk_sludge']);
  });

  test('listUpgradableDeckIndices 返回所有可升级的下标', () => {
    const deck = ['strike', 'strike++', 'defend', 'junk_sludge', 'bash+'];
    expect(listUpgradableDeckIndices(deck)).toEqual([0, 2, 4]);
  });

  test('每张在规则表中的卡都有对应基础卡定义', () => {
    for (const baseId of Object.keys(CARD_UPGRADE_RULES)) {
      expect(CARD_DEFINITIONS[baseId]).toBeDefined();
    }
  });

  test('cash_flow+ 使用 effectsOverride 加入额外的 gain_energy 分支', () => {
    const plus = CARD_DEFINITIONS['cash_flow+']!;
    expect(plus.effects.some((e) => e.type === 'gain_energy')).toBe(true);
  });
});
