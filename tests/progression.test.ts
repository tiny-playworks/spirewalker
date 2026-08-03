import { describe, expect, test } from '@rstest/core';
import {
  calculateSettlement,
  createDefaultProfile,
  grantSettlementXp,
  purchaseGlobalTalent,
  resetCharacterTalents,
  resetGlobalTalents,
  selectCharacterTalent,
} from '@/game/progression';

describe('V2 双经验与技能树', () => {
  test('完整通关按规则同时结算账号经验与 125% 角色经验', () => {
    const breakdown = calculateSettlement({
      roomsCleared: 3,
      elitesDefeated: 1,
      rewardsTaken: 3,
      bossReached: true,
      bossDefeated: true,
      combatScore: 45,
      activeCombatMs: 600_000,
      damageTaken: 20,
    });
    expect(breakdown).toEqual({
      roomXp: 120,
      eliteXp: 30,
      bossReachXp: 50,
      bossVictoryXp: 120,
      rewardXp: 15,
      combatXp: 45,
      efficiencyXp: 27,
      total: 407,
      characterTotal: 508,
    });

    const profile = grantSettlementXp(createDefaultProfile(), breakdown);
    expect(profile.accountTotalPoints).toBe(3);
    expect(profile.accountAvailablePoints).toBe(3);
    expect(profile.accountXp).toBe(32);
    expect(profile.characters.artificer.totalPoints).toBe(4);
    expect(profile.characters.artificer.availablePoints).toBe(4);
    expect(profile.characters.artificer.xp).toBe(68);
  });

  test('失败保留已经获得的房间经验', () => {
    const breakdown = calculateSettlement({
      roomsCleared: 2,
      elitesDefeated: 0,
      rewardsTaken: 2,
      bossReached: false,
      bossDefeated: false,
      combatScore: 18,
      activeCombatMs: 190_000,
      damageTaken: 100,
    });
    expect(breakdown.total).toBeGreaterThan(0);
    expect(breakdown.characterTotal).toBe(Math.floor(breakdown.total * 1.25));
  });

  test('全局树要求前置节点且免费重置返还全部点数', () => {
    const profile = createDefaultProfile();
    profile.accountAvailablePoints = 6;
    expect(purchaseGlobalTalent(profile, 'survival-shield')).toBe(profile);
    const tierOne = purchaseGlobalTalent(profile, 'survival-hp');
    const tierTwo = purchaseGlobalTalent(tierOne, 'survival-shield');
    expect(tierTwo.globalTalents).toEqual(['survival-hp', 'survival-shield']);
    const reset = resetGlobalTalents(tierTwo);
    expect(reset.globalTalents).toEqual([]);
    expect(reset.accountAvailablePoints).toBe(6);
  });

  test('角色树同层互斥，切换时自动退还旧节点', () => {
    const profile = createDefaultProfile();
    profile.characters.artificer.availablePoints = 3;
    const fire = selectCharacterTalent(profile, 't1-fire');
    const move = selectCharacterTalent(fire, 't1-move');
    expect(move.characters.artificer.selections['1']).toBe('t1-move');
    expect(move.characters.artificer.availablePoints).toBe(2);
    expect(selectCharacterTalent(move, 't3-duration')).toBe(move);
    expect(resetCharacterTalents(move).characters.artificer.availablePoints).toBe(3);
  });
});
