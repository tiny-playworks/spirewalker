import { describe, expect, test } from '@rstest/core';
import { GameEngine } from '@/game/core/engine/GameEngine';
import { createMvpRun } from '@/game/core/engine/createMvpRun';
import { previewCardPlay } from '@/game/core/presentation/battlePreview';
import { buildFeedbackTimeline, feedbackDurationMs } from '@/game/core/presentation/feedbackTimeline';

function runWithStrikeInHand() {
  const engine = new GameEngine();
  const run = engine.dispatch(createMvpRun(17), { type: 'DEBUG_ADD_HAND_CARD', definitionId: 'strike' }).nextRun;
  const battle = run.battle!;
  const cardInstanceId = battle.player.hand.at(-1)!;
  return { engine, run, battle, cardInstanceId };
}

describe('战斗展示层', () => {
  test('预览复用正式引擎且不修改输入状态', () => {
    const { run, battle, cardInstanceId } = runWithStrikeInHand();
    const snapshot = structuredClone(run);
    const preview = previewCardPlay(run, cardInstanceId, battle.enemyUnitIds[0]);
    expect(preview.playable).toBe(true);
    expect(preview.damage).toBeGreaterThan(0);
    expect(preview.energyAfter).toBe(battle.player.energy - 1);
    expect(run).toEqual(snapshot);
  });

  test('预览覆盖流转与均衡刃的混合流分支', () => {
    const engine = new GameEngine();
    const flowRun = engine.dispatch(createMvpRun(23), { type: 'DEBUG_ADD_HAND_CARD', definitionId: 'flow_shift' }).nextRun;
    const flowCardId = flowRun.battle!.player.hand.at(-1)!;
    flowRun.battle!.prevTurnPlayerPlayedAttack = true;
    const flowPreview = previewCardPlay(flowRun, flowCardId);
    expect(flowPreview.playable).toBe(true);
    expect(flowPreview.block).toBe(12);
    expect(flowPreview.damage).toBe(0);

    const balanceRun = engine.dispatch(createMvpRun(24), { type: 'DEBUG_ADD_HAND_CARD', definitionId: 'balance_edge' }).nextRun;
    const balanceCardId = balanceRun.battle!.player.hand.at(-1)!;
    balanceRun.battle!.playerGainedBlockThisTurn = true;
    const targetId = balanceRun.battle!.enemyUnitIds[0];
    const balancePreview = previewCardPlay(balanceRun, balanceCardId, targetId);
    expect(balancePreview.playable).toBe(true);
    expect(balancePreview.damage).toBe(16);
  });

  test('真实出牌会同步本局统计', () => {
    const { engine, run, battle, cardInstanceId } = runWithStrikeInHand();
    const result = engine.dispatch(run, {
      type: 'PLAY_CARD',
      cardInstanceId,
      sourceUnitId: battle.playerUnitId,
      targetUnitId: battle.enemyUnitIds[0],
    });
    expect(result.nextRun.stats?.cardsPlayed).toBe(1);
    expect(result.nextRun.stats?.damageDealt).toBeGreaterThan(0);
    expect(result.nextRun.stats?.cardPlays.strike).toBe(1);
  });

  test('反馈时间线覆盖伤害、格挡、状态和击破', () => {
    const cues = buildFeedbackTimeline([
      { type: 'DAMAGE_DEALT', sourceUnitId: 'p', targetUnitId: 'e', value: 9 },
      { type: 'BLOCK_GAINED', unitId: 'p', value: 6 },
      { type: 'STATUS_APPLIED', unitId: 'p', statusId: 'momentum', value: 2 },
      { type: 'UNIT_DIED', unitId: 'e' },
    ]);
    expect(cues.map((cue) => cue.tone)).toEqual(['damage', 'block', 'status', 'defeat']);
    expect(feedbackDurationMs([], false)).toBeGreaterThan(feedbackDurationMs([], true));
    expect(feedbackDurationMs([{ type: 'DAMAGE_DEALT', sourceUnitId: 'p', targetUnitId: 'e', value: 9 }], true)).toBeGreaterThanOrEqual(240);
  });
});
