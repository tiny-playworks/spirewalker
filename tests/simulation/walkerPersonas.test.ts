import { describe, expect, test } from '@rstest/core';
import { CARD_DEFINITIONS, BRACE_RHYTHM, BREAK_OPENING, STRIKE, SURVEY_FIELD } from '@/game/core/definitions/cards/starter';
import { walkerBurstPolicy, walkerGuardPolicy, walkerMixedPolicy } from '@/game/simulation/policies/walkerPersonas';
import type { SimulationBattleContext, SimulationPlayableCommand } from '@/game/simulation/types';

function playable(cardId: string, targetUnitId?: string): SimulationPlayableCommand {
  return {
    command: {
      type: 'PLAY_CARD',
      cardInstanceId: `${cardId}-1`,
      sourceUnitId: 'player',
      ...(targetUnitId ? { targetUnitId } : {}),
    },
    card: CARD_DEFINITIONS[cardId]!,
    targetIntent: null,
  };
}

function buildBattleContext(
  playableCommands: SimulationPlayableCommand[],
  overrides?: Partial<SimulationBattleContext>,
): SimulationBattleContext {
  const ctx: SimulationBattleContext = {
    run: {
      player: { currentHp: 50 },
      meta: { potions: [] },
    } as unknown as SimulationBattleContext['run'],
    battle: {
      id: 'battle-1',
      turn: 1,
      playerCardsPlayedThisTurn: 0,
      playerConsumedMomentumThisTurn: false,
      phase: 'player_action',
      inputMode: 'idle',
      playerUnitId: 'player',
      enemyUnitIds: ['enemy'],
      units: {
        player: { hp: 50, block: 0, alive: true, statuses: [] },
        enemy: { hp: 20, block: 0, alive: true, statuses: [] },
      },
      player: {
        unitId: 'player',
        energy: 3,
        maxEnergy: 3,
        drawPile: [],
        hand: playableCommands.map((item) => item.command.cardInstanceId),
        discardPile: [],
        exhaustPile: [],
        cards: Object.fromEntries(
          playableCommands.map((item) => [
            item.command.cardInstanceId,
            {
              instanceId: item.command.cardInstanceId,
              definitionId: item.card.id,
              baseCost: item.card.cost,
              costForTurn: item.card.cost,
              upgraded: false,
            },
          ]),
        ),
        lockedCardInstanceIds: [],
        pendingHandLocks: 0,
        drawPressure: 0,
      },
      monsters: {
        enemy: {
          unitId: 'enemy',
          monsterId: 'enemy',
          intent: null,
          moveHistory: [],
          runtime: {},
        },
      },
      nextEnemyUnitSeq: 0,
      pendingAction: null,
      lastResolvedEvents: [],
      encounter: {
        id: 'encounter',
        poolId: 'pool',
        tier: 'normal',
        name: '测试战斗',
        tags: [],
        pressureProfile: 'frontload',
      },
    } as unknown as SimulationBattleContext['battle'],
    playableCommands,
    projectedIncomingDamage: 0,
    stagnantBattleStateSteps: 0,
    stagnantCombatSteps: 0,
  };

  return {
    ...ctx,
    ...overrides,
    battle: {
      ...ctx.battle,
      ...(overrides?.battle ?? {}),
    },
    run: {
      ...ctx.run,
      ...(overrides?.run ?? {}),
    },
  };
}

describe('simulation/walkerPersonas battle policy', () => {
  test('mixed 在明显空转时会优先 END_TURN', () => {
    const ctx = buildBattleContext(
      [
        playable(SURVEY_FIELD.id),
        playable(BREAK_OPENING.id),
      ],
      {
        stagnantBattleStateSteps: 3,
        stagnantCombatSteps: 6,
        battle: {
          playerCardsPlayedThisTurn: 2,
        } as unknown as SimulationBattleContext['battle'],
      },
    );

    expect(walkerMixedPolicy.chooseBattleCommand(ctx)).toEqual({ type: 'END_TURN' });
  });

  test('guard 在有明确承压时仍会选择保命动作', () => {
    const ctx = buildBattleContext(
      [
        playable(BRACE_RHYTHM.id),
        playable(SURVEY_FIELD.id),
      ],
      {
        projectedIncomingDamage: 8,
      },
    );

    expect(walkerGuardPolicy.chooseBattleCommand(ctx).type).toBe('PLAY_CARD');
  });

  test('burst 在有斩杀时仍会直接出击杀牌', () => {
    const ctx = buildBattleContext(
      [playable(STRIKE.id, 'enemy')],
      {
        battle: {
          units: {
            player: { hp: 50, block: 0, alive: true, statuses: [] },
            enemy: { hp: 6, block: 0, alive: true, statuses: [] },
          },
        } as unknown as SimulationBattleContext['battle'],
      },
    );

    expect(walkerBurstPolicy.chooseBattleCommand(ctx)).toEqual({
      type: 'PLAY_CARD',
      cardInstanceId: 'strike-1',
      sourceUnitId: 'player',
      targetUnitId: 'enemy',
    });
  });
});
