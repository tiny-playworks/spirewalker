import type { GameEvent } from '../../events/types';
import type { RunState } from '../../model/run';

export function hashMapNodeId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = Math.imul(31, h) + id.charCodeAt(i);
  }
  return h | 0;
}

export function syncRunPlayerFromBattle(run: RunState): void {
  const b = run.battle;
  if (!b) return;
  const u = b.units[b.playerUnitId];
  if (u) {
    run.player.currentHp = u.hp;
    run.player.maxHp = u.maxHp;
  }
}

/**
 * Act1 Boss 战胜利后、进入战后奖励界面前的满血过渡。
 *
 * 仅在「当前章节为 Act1」且「当前地图节点为 Boss」且「战斗已处于胜利结算态」时生效；
 * 将战斗内玩家单位与 Run 层 `player` 同步为满血，便于进入 Act2（或验证段）时状态一致。
 * 不在失败、中止或非 Boss 节点调用；调用方应保证 `run.battle?.phase === 'victory'`。
 */
export function applyAct1BossPostVictoryFullHealIfEligible(run: RunState): void {
  if (run.meta.act !== 1) return;
  const curId = run.map.currentNodeId;
  const mapNode = curId ? run.map.nodes[curId] : undefined;
  if (mapNode?.type !== 'boss') return;
  const battle = run.battle;
  if (!battle || battle.phase !== 'victory') return;
  const unit = battle.units[battle.playerUnitId];
  if (!unit) return;
  unit.hp = unit.maxHp;
  run.player.maxHp = unit.maxHp;
  run.player.currentHp = unit.maxHp;
}

export function applyGameOverIfDefeat(run: RunState, events: GameEvent[]): void {
  if (run.battle?.phase !== 'defeat') return;
  run.battle = undefined;
  run.screen = { type: 'game_over' };
  events.push({ type: 'ENTERED_GAME_OVER' });
}
