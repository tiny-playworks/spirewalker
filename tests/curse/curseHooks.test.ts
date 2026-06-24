import { describe, expect, test } from '@rstest/core';
import { CURSE_CARDS } from '@/game/core/definitions/cards/curse/curse';
import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import type { BattleState } from '@/game/core/model/battle';
import {
  applyCurseBattleStart,
} from '@/game/core/systems/status/statusHooks';

/**
 * 每个 curse id 必须满足以下条件之一：
 * 1. 在 applyCurseBattleStart / applyCurseTurnStart / applyCurseTurnEnd 中有 hook
 * 2. 被标记为「unplayable-only」— 即 cost=-1 且无 hook（效果由外部系统处理）
 *
 * 本测试确保所有诅咒牌在运行时至少有一个明确的处理路径。
 */

/** 已在 statusHooks.ts 中实现 hook 的诅咒 id */
const HOOKED_CURSE_IDS = new Set([
  // battle_start hooks
  'curse_dread',
  'curse_greed',
  'curse_wrath',
  'curse_pride',
  'curse_sloth',
  'curse_burden',
  'curse_confusion',
  // turn_start hooks
  'curse_blood_mark',
  'curse_darkness',
  'curse_decay',
  'curse_weakness',
  'curse_vulnerability',
  'curse_paralysis',
  'curse_forgetfulness',
  'curse_envy',
  'curse_burden', // also turn_start: block decay
  // turn_end hooks
  'curse_doubt',
  'curse_shame',
  'curse_silence',
]);

/** 由外部系统处理的诅咒（rewardFlow 等），不在 statusHooks 中 */
const EXTERNALLY_HANDLED_CURSE_IDS = new Set([
  'curse_lust',   // 战斗结束时失去最大生命 → rewardFlow
  'curse_gluttony', // 战斗结束时失去金币 → rewardFlow
]);

describe('curse cards', () => {
  test('所有 CURSE_CARDS 中的诅咒都存在于 CARD_DEFINITIONS', () => {
    for (const id of Object.keys(CURSE_CARDS)) {
      expect(CARD_DEFINITIONS[id]).toBeDefined();
      expect(CARD_DEFINITIONS[id]!.type).toBe('curse');
      expect(CARD_DEFINITIONS[id]!.cost).toBe(-1);
    }
  });

  test('每张诅咒牌要么有 hook 要么被外部系统处理', () => {
    for (const [id, def] of Object.entries(CURSE_CARDS)) {
      const hasHook = HOOKED_CURSE_IDS.has(id);
      const isExternal = EXTERNALLY_HANDLED_CURSE_IDS.has(id);
      const isUnplayableOnly = def.cost === -1;

      // 所有诅咒牌都必须 cost=-1（无法打出）
      expect(isUnplayableOnly).toBe(true);

      // 必须有 hook 或被外部处理
      expect(hasHook || isExternal).toBe(true);
    }
  });

  test('applyCurseBattleStart 不会崩溃', () => {
    // 模拟一个最小的 BattleState
    const battle = {
      id: 'curse-test',
      encounter: {
        id: 'curse-test',
        poolId: 'test',
        tier: 'normal',
        name: 'Curse Test',
        tags: [],
      },
      turn: 1,
      playerCardsPlayedThisTurn: 0,
      playerConsumedMomentumThisTurn: false,
      relicIds: [],
      playerPlayedAttackThisTurn: false,
      playerPlayedSkillThisTurn: false,
      playerExhaustedCardThisTurn: false,
      playerAttacksPlayedThisTurn: 0,
      prevTurnPlayerPlayedAttack: false,
      blazeCoreAttackBonus: 0,
      pendingFortifyConvert: false,
      twinCoreNextAttackBonus: 0,
      twinCoreFirstBlockUsed: false,
      twinCoreNextSkillBonus: 0,
      twinCoreFirstAttackUsed: false,
      harmonyEmblemTriggeredThisTurn: false,
      playerGainedBlockThisTurn: false,
      playerMomentumConsumedAmountThisTurn: 0,
      playerTurnBlockGained: 0,
      cycleEngineDrawsThisTurn: 0,
      chainBoltActive: false,
      memoryShardActive: false,
      activeCurseIds: new Set(['curse_dread', 'curse_greed', 'curse_pride']),
      playerUnitId: 'player',
      units: {
        player: {
          id: 'player',
          hp: 50,
          maxHp: 50,
          block: 0,
          alive: true,
          statuses: [],
          stats: { strength: 0, dexterity: 0 },
          side: 'player' as const,
          name: 'Test',
        },
      },
      enemyUnitIds: [],
      phase: 'battle_init',
      inputMode: 'idle',
      player: {
        unitId: 'player',
        energy: 3,
        maxEnergy: 3,
        drawPile: [],
        hand: [],
        discardPile: [],
        exhaustPile: [],
        cards: {},
        lockedCardInstanceIds: [],
        pendingHandLocks: 0,
        drawPressure: 0,
      },
      monsters: {},
      nextEnemyUnitSeq: 0,
      pendingAction: null,
      lastResolvedEvents: [],
      cursePrideCostPressure: 0,
      curseSlothDrawPressure: 0,
      curseConfusionCostDelta: 0,
      curseBurdenBlockDecay: 0,
    } satisfies BattleState;

    applyCurseBattleStart(battle);

    // dread: +2 weak, +2 vulnerable
    const weak = battle.units.player.statuses.find((s) => s.id === 'weak');
    expect(weak?.stacks).toBe(2);

    // greed: -5 hp
    expect(battle.units.player.hp).toBe(45);

    // pride: cost pressure = 1
    expect(battle.cursePrideCostPressure).toBe(1);
  });

  test('applyCurseBattleStart 无诅咒时不改变状态', () => {
    const battle = {
      id: 'curse-test-empty',
      encounter: {
        id: 'curse-test-empty',
        poolId: 'test',
        tier: 'normal',
        name: 'Curse Test',
        tags: [],
      },
      turn: 1,
      playerCardsPlayedThisTurn: 0,
      playerConsumedMomentumThisTurn: false,
      relicIds: [],
      playerPlayedAttackThisTurn: false,
      playerPlayedSkillThisTurn: false,
      playerExhaustedCardThisTurn: false,
      playerAttacksPlayedThisTurn: 0,
      prevTurnPlayerPlayedAttack: false,
      blazeCoreAttackBonus: 0,
      pendingFortifyConvert: false,
      twinCoreNextAttackBonus: 0,
      twinCoreFirstBlockUsed: false,
      twinCoreNextSkillBonus: 0,
      twinCoreFirstAttackUsed: false,
      harmonyEmblemTriggeredThisTurn: false,
      playerGainedBlockThisTurn: false,
      playerMomentumConsumedAmountThisTurn: 0,
      playerTurnBlockGained: 0,
      cycleEngineDrawsThisTurn: 0,
      chainBoltActive: false,
      memoryShardActive: false,
      activeCurseIds: new Set(),
      playerUnitId: 'player',
      units: {
        player: {
          id: 'player',
          hp: 50,
          maxHp: 50,
          block: 0,
          alive: true,
          statuses: [],
          stats: { strength: 0, dexterity: 0 },
          side: 'player' as const,
          name: 'Test',
        },
      },
      enemyUnitIds: [],
      phase: 'battle_init',
      inputMode: 'idle',
      player: {
        unitId: 'player',
        energy: 3,
        maxEnergy: 3,
        drawPile: [],
        hand: [],
        discardPile: [],
        exhaustPile: [],
        cards: {},
        lockedCardInstanceIds: [],
        pendingHandLocks: 0,
        drawPressure: 0,
      },
      monsters: {},
      nextEnemyUnitSeq: 0,
      pendingAction: null,
      lastResolvedEvents: [],
      cursePrideCostPressure: 0,
      curseSlothDrawPressure: 0,
      curseConfusionCostDelta: 0,
      curseBurdenBlockDecay: 0,
    } satisfies BattleState;

    applyCurseBattleStart(battle);

    expect(battle.units.player.hp).toBe(50);
    expect(battle.units.player.statuses).toHaveLength(0);
    expect(battle.cursePrideCostPressure).toBe(0);
  });

  test('curse_decay_2 不再存在于诅咒系统中（已删除）', () => {
    // 确认没有名为 curse_decay_2 的诅咒牌
    expect(CARD_DEFINITIONS['curse_decay_2']).toBeUndefined();
    expect(CURSE_CARDS['curse_decay_2']).toBeUndefined();
  });
});
