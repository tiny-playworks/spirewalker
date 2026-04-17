import { WANDERING_MERCHANT_EVENT_ID } from '@/game/core/engine/generateBranchingFloor';
import { useGameStore } from '@/game/store/gameStore';

export function EventPage() {
  const run = useGameStore((s) => s.run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);

  if (!run || run.screen.type !== 'event') return null;

  if (run.screen.eventId === WANDERING_MERCHANT_EVENT_ID) {
    const hasVajra = run.meta.relics.includes('vajra');
    return (
      <div className="boot event-page">
        <h2 className="subscreen-title">游荡商人</h2>
        <p className="subscreen-tip">选一个奖励后返回地图。</p>
        <div className="event-options">
          <button
            type="button"
            className="reward-card-btn"
            onClick={() => dispatchCommand({ type: 'RESOLVE_EVENT_OPTION', optionId: 'gold' })}
          >
            <strong>收下金币</strong>
            <span className="reward-card-desc">获得 25 金币</span>
          </button>
          <button
            type="button"
            className="reward-card-btn"
            onClick={() => dispatchCommand({ type: 'RESOLVE_EVENT_OPTION', optionId: 'heal' })}
          >
            <strong>喝口热汤</strong>
            <span className="reward-card-desc">回复 12 生命</span>
          </button>
          <button
            type="button"
            className="reward-card-btn"
            disabled={hasVajra}
            onClick={() => dispatchCommand({ type: 'RESOLVE_EVENT_OPTION', optionId: 'relic' })}
          >
            <strong>瓦哈纳神像</strong>
            <span className="reward-card-desc">
              {hasVajra ? '已拥有' : '每场战斗开始 +1 力量'}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="boot">
      <p>未知事件：{run.screen.eventId}</p>
    </div>
  );
}
