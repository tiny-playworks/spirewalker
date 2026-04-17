import { describe, expect, test } from '@rstest/core';
import { createMvpRun, ENEMY_UNIT_ID } from '@/game/core/engine/createMvpRun';
import { decidePlayCardCommand } from '@/game/phaser/controllers/DragController';

const ENEMY_HIT_RECTS = [{ unitId: ENEMY_UNIT_ID, rect: { x: 700, y: 120, width: 160, height: 220 } }];
const AOE_RECT = { x: 380, y: 72, width: 520, height: 320 };

function cardIdByDef(run: ReturnType<typeof createMvpRun>, defId: string): string {
  const id = run.battle!.player.hand.find((x) => run.battle!.player.cards[x]!.definitionId === defId);
  if (!id) throw new Error(`missing ${defId} in hand`);
  return id;
}

describe('DragController / decidePlayCardCommand', () => {
  test('battle 不可行动时返回 null', () => {
    const run = createMvpRun(1);
    run.battle!.phase = 'enemy_turn';
    const strike = cardIdByDef(run, 'strike');
    const cmd = decidePlayCardCommand(
      run.battle ?? null,
      strike,
      { x: 710, y: 130, width: 40, height: 40 },
      ENEMY_HIT_RECTS,
      AOE_RECT,
    );
    expect(cmd).toBeNull();
  });

  test('single_enemy 牌命中敌人时返回带 target 的 PLAY_CARD', () => {
    const run = createMvpRun(2);
    const strike = cardIdByDef(run, 'strike');
    const cmd = decidePlayCardCommand(
      run.battle ?? null,
      strike,
      { x: 710, y: 130, width: 40, height: 40 },
      ENEMY_HIT_RECTS,
      AOE_RECT,
    );
    expect(cmd).toEqual({
      type: 'PLAY_CARD',
      cardInstanceId: strike,
      sourceUnitId: 'u_player',
      targetUnitId: 'u_enemy_0',
    });
  });

  test('single_enemy 牌未命中敌人时返回 null', () => {
    const run = createMvpRun(3);
    const strike = cardIdByDef(run, 'strike');
    const cmd = decidePlayCardCommand(
      run.battle ?? null,
      strike,
      { x: 100, y: 460, width: 40, height: 40 },
      ENEMY_HIT_RECTS,
      AOE_RECT,
    );
    expect(cmd).toBeNull();
  });

  test('none 目标牌（防御）不依赖命中区域', () => {
    const run = createMvpRun(4);
    const defend = cardIdByDef(run, 'defend');
    const cmd = decidePlayCardCommand(
      run.battle ?? null,
      defend,
      { x: 100, y: 460, width: 40, height: 40 },
      ENEMY_HIT_RECTS,
      AOE_RECT,
    );
    expect(cmd).toEqual({
      type: 'PLAY_CARD',
      cardInstanceId: defend,
      sourceUnitId: 'u_player',
    });
  });

  test('all_enemies 牌仅在 AOE 区域或命中敌人时触发', () => {
    const run = createMvpRun(5);
    const cleaveId = 'test_cleave';
    run.battle!.player.cards[cleaveId] = {
      instanceId: cleaveId,
      definitionId: 'cleave',
      baseCost: 2,
      costForTurn: 2,
      upgraded: false,
    };
    run.battle!.player.hand.push(cleaveId);

    const missCmd = decidePlayCardCommand(
      run.battle ?? null,
      cleaveId,
      { x: 100, y: 460, width: 40, height: 40 },
      ENEMY_HIT_RECTS,
      AOE_RECT,
    );
    expect(missCmd).toBeNull();

    const aoeCmd = decidePlayCardCommand(
      run.battle ?? null,
      cleaveId,
      { x: 500, y: 200, width: 40, height: 40 },
      ENEMY_HIT_RECTS,
      AOE_RECT,
    );
    expect(aoeCmd).toEqual({
      type: 'PLAY_CARD',
      cardInstanceId: cleaveId,
      sourceUnitId: 'u_player',
    });
  });
});
