import {
  BURST_ALTAR_EVENT_ID,
  PURGING_POOL_EVENT_ID,
  STILLNESS_SHRINE_EVENT_ID,
  WANDERING_MERCHANT_EVENT_ID,
} from '@/game/core/engine/generateBranchingFloor';
import { useGameStore } from '@/game/store/gameStore';
import { sceneThemeClass } from '@/styles/sceneTheme.css';
import * as subscreenStyles from '@/styles/subscreen.css';

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export function EventPage() {
  const run = useGameStore((s) => s.run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);

  if (!run || run.screen.type !== 'event') return null;

  if (run.screen.eventId === WANDERING_MERCHANT_EVENT_ID) {
    const hasVajra = run.meta.relics.includes('vajra');
    return (
      <div className={cx('boot', sceneThemeClass, subscreenStyles.screenRoot)} data-testid="event-page">
        <h2 className={subscreenStyles.title}>游荡商人</h2>
        <p className={subscreenStyles.tip}>选一个奖励后返回地图。</p>
        <div className={subscreenStyles.eventOptions}>
          <button
            type="button"
            className={subscreenStyles.choiceButton}
            onClick={() => dispatchCommand({ type: 'RESOLVE_EVENT_OPTION', optionId: 'gold' })}
          >
            <strong>收下金币</strong>
            <span className={subscreenStyles.choiceDesc}>获得 25 金币</span>
          </button>
          <button
            type="button"
            className={subscreenStyles.choiceButton}
            onClick={() => dispatchCommand({ type: 'RESOLVE_EVENT_OPTION', optionId: 'heal' })}
          >
            <strong>喝口热汤</strong>
            <span className={subscreenStyles.choiceDesc}>回复 12 生命</span>
          </button>
          <button
            type="button"
            className={subscreenStyles.choiceButton}
            disabled={hasVajra}
            onClick={() => dispatchCommand({ type: 'RESOLVE_EVENT_OPTION', optionId: 'relic' })}
          >
            <strong>瓦哈纳神像</strong>
            <span className={subscreenStyles.choiceDesc}>
              {hasVajra ? '已拥有' : '每场战斗开始 +1 力量'}
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (run.screen.eventId === STILLNESS_SHRINE_EVENT_ID) {
    const hasGuardKnot = run.meta.relics.includes('guard_knot');
    return (
      <div className={cx('boot', sceneThemeClass, subscreenStyles.screenRoot)} data-testid="event-page">
        <h2 className={subscreenStyles.title}>静守祠</h2>
        <p className={subscreenStyles.tip}>在稳住连势与立刻补强之间选一条路。</p>
        <div className={subscreenStyles.eventOptions}>
          <button
            type="button"
            className={subscreenStyles.choiceButton}
            disabled={hasGuardKnot}
            onClick={() => dispatchCommand({ type: 'RESOLVE_EVENT_OPTION', optionId: 'guard_relic' })}
          >
            <strong>割血换稳势结</strong>
            <span className={subscreenStyles.choiceDesc}>
              {hasGuardKnot ? '已拥有' : '失去 6 生命，获得稳势结'}
            </span>
          </button>
          <button
            type="button"
            className={subscreenStyles.choiceButton}
            onClick={() => dispatchCommand({ type: 'RESOLVE_EVENT_OPTION', optionId: 'guard_card' })}
          >
            <strong>学会守势</strong>
            <span className={subscreenStyles.choiceDesc}>牌组加入 1 张守势</span>
          </button>
          <button
            type="button"
            className={subscreenStyles.choiceButton}
            onClick={() => dispatchCommand({ type: 'RESOLVE_EVENT_OPTION', optionId: 'leave' })}
          >
            <strong>离开</strong>
            <span className={subscreenStyles.choiceDesc}>什么也不拿，返回地图</span>
          </button>
        </div>
      </div>
    );
  }

  if (run.screen.eventId === BURST_ALTAR_EVENT_ID) {
    const hasBurstEmblem = run.meta.relics.includes('burst_emblem');
    return (
      <div className={cx('boot', sceneThemeClass, subscreenStyles.screenRoot)} data-testid="event-page">
        <h2 className={subscreenStyles.title}>裂响祭坛</h2>
        <p className={subscreenStyles.tip}>更早兑现连势，但要先付出一点代价。</p>
        <div className={subscreenStyles.eventOptions}>
          <button
            type="button"
            className={subscreenStyles.choiceButton}
            disabled={hasBurstEmblem}
            onClick={() => dispatchCommand({ type: 'RESOLVE_EVENT_OPTION', optionId: 'burst_relic' })}
          >
            <strong>割血换裂响纹章</strong>
            <span className={subscreenStyles.choiceDesc}>
              {hasBurstEmblem ? '已拥有' : '失去 6 生命，获得裂响纹章'}
            </span>
          </button>
          <button
            type="button"
            className={subscreenStyles.choiceButton}
            onClick={() => dispatchCommand({ type: 'RESOLVE_EVENT_OPTION', optionId: 'burst_card' })}
          >
            <strong>学会破势击</strong>
            <span className={subscreenStyles.choiceDesc}>牌组加入 1 张破势击</span>
          </button>
          <button
            type="button"
            className={subscreenStyles.choiceButton}
            onClick={() => dispatchCommand({ type: 'RESOLVE_EVENT_OPTION', optionId: 'leave' })}
          >
            <strong>离开</strong>
            <span className={subscreenStyles.choiceDesc}>保持现状，返回地图</span>
          </button>
        </div>
      </div>
    );
  }

  if (run.screen.eventId === PURGING_POOL_EVENT_ID) {
    const hasStrike = run.masterDeck.includes('strike');
    const hasDefend = run.masterDeck.includes('defend');
    return (
      <div className={cx('boot', sceneThemeClass, subscreenStyles.screenRoot)} data-testid="event-page">
        <h2 className={subscreenStyles.title}>净手池</h2>
        <p className={subscreenStyles.tip}>把一张基础牌沉进池水，换更干净的牌组。</p>
        <div className={subscreenStyles.eventOptions}>
          <button
            type="button"
            className={subscreenStyles.choiceButton}
            disabled={!hasStrike}
            onClick={() => dispatchCommand({ type: 'RESOLVE_EVENT_OPTION', optionId: 'remove_strike' })}
          >
            <strong>删 1 张打击</strong>
            <span className={subscreenStyles.choiceDesc}>
              {hasStrike ? '移除 1 张打击' : '牌组里没有打击'}
            </span>
          </button>
          <button
            type="button"
            className={subscreenStyles.choiceButton}
            disabled={!hasDefend}
            onClick={() => dispatchCommand({ type: 'RESOLVE_EVENT_OPTION', optionId: 'remove_defend' })}
          >
            <strong>删 1 张防御</strong>
            <span className={subscreenStyles.choiceDesc}>
              {hasDefend ? '移除 1 张防御' : '牌组里没有防御'}
            </span>
          </button>
          <button
            type="button"
            className={subscreenStyles.choiceButton}
            onClick={() => dispatchCommand({ type: 'RESOLVE_EVENT_OPTION', optionId: 'leave' })}
          >
            <strong>离开</strong>
            <span className={subscreenStyles.choiceDesc}>保持牌组不变，返回地图</span>
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
