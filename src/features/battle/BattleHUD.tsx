import { useGameStore } from '@/game/store/gameStore';
import { selectBattle } from '@/game/store/selectors/battleSelectors';
import { sceneThemeClass } from '@/styles/sceneTheme.css';
import * as styles from './battleHud.css';

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

const PILE_DRAW_TITLE =
  '抽牌堆：需抽牌且抽牌堆为空时，会先将弃牌堆洗牌放入抽牌堆（回洗），再抽。';

export function BattleHUD() {
  const run = useGameStore((s) => s.run);
  const battle = selectBattle(run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);

  if (!battle) return null;

  const player = battle.units[battle.playerUnitId];
  const { drawPile, hand, discardPile, exhaustPile } = battle.player;
  const selectingTarget = battle.inputMode === 'selecting_target' && battle.pendingAction?.type === 'play_card';

  return (
    <header className={cx(sceneThemeClass, styles.root)} data-testid="battle-hud">
      <div className={styles.inner}>
        <div className={styles.primaryRow}>
          <span className={styles.brand}>SPIREWALKER</span>
          <span className={cx(styles.chip, styles.chipTone.health)}>
            ♥ <strong>{run.player.currentHp}</strong>
            <span className={styles.muted}>/{run.player.maxHp}</span>
          </span>
          <span className={cx(styles.chip, styles.chipTone.block)}>
            ◇ <strong>{player?.block ?? 0}</strong>
          </span>
          <span className={cx(styles.chip, styles.chipTone.gold)}>
            ▣ <strong>{run.meta.gold}</strong>
          </span>
          <span
            className={cx(styles.chip, styles.chipTone.energy)}
            title={`能量 ${battle.player.energy}/${battle.player.maxEnergy}`}
          >
            ◎
          </span>
          <span
            className={cx(styles.chip, styles.chipTone.accent)}
            data-testid="battle-draw-count"
            title={`${PILE_DRAW_TITLE}\n抽牌 ${drawPile.length}，手牌 ${hand.length}，弃牌 ${discardPile.length}，消耗 ${exhaustPile.length}`}
          >
            ✣
          </span>
          {battle.phase === 'victory' ? (
            <span className={cx(styles.chip, styles.chipTone.win)}>胜利</span>
          ) : null}
          {selectingTarget ? (
            <span className={cx(styles.chip, styles.chipTone.accent)}>
              选择目标中
            </span>
          ) : null}
          {battle.phase === 'victory' ? (
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              className={styles.e2eRewardBridge}
              data-testid="leave-battle-to-reward"
              onClick={() => dispatchCommand({ type: 'LEAVE_BATTLE_TO_REWARD' })}
            >
              领取奖励
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
