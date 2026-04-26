import { formatMonsterIntentText } from '@/game/core/battleUiText';
import { useGameStore } from '@/game/store/gameStore';
import { selectBattle, selectCurrentEnemyIntents, selectPlayerBattleStats } from '@/game/store/selectors/battleSelectors';
import { sceneThemeClass } from '@/styles/sceneTheme.css';
import * as styles from './battleHud.css';

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

const PILE_DRAW_TITLE =
  '抽牌堆：需抽牌且抽牌堆为空时，会先将弃牌堆洗牌放入抽牌堆（回洗），再抽。';
const PILE_HAND_TITLE = '手牌：当前持有的张数。';
const PILE_DISCARD_TITLE = '弃牌堆：本局已打出或弃置的牌；回洗时会整体进入抽牌堆。';
const PILE_EXHAUST_TITLE = '消耗堆：已消耗、本局不再进入循环的牌。';

export function BattleHUD() {
  const run = useGameStore((s) => s.run);
  const battle = selectBattle(run);
  const playerStats = selectPlayerBattleStats(run);
  const enemyIntents = selectCurrentEnemyIntents(run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);

  if (!battle) return null;

  const player = battle.units[battle.playerUnitId];
  const canAct = battle.phase === 'player_action';
  const { drawPile, hand, discardPile, exhaustPile } = battle.player;
  const handCount = hand.length;
  const outOfEnergy = canAct && battle.player.energy === 0 && handCount > 0;
  const selectingTarget = battle.inputMode === 'selecting_target' && battle.pendingAction?.type === 'play_card';
  const currentEnemy = enemyIntents.find((enemy) => battle.units[enemy.unitId]?.alive) ?? enemyIntents[0] ?? null;

  return (
    <header className={cx(sceneThemeClass, styles.root)} data-testid="battle-hud">
      <div className={styles.inner}>
        <div className={styles.primaryRow}>
          <span className={cx(styles.chip, styles.chipTone.default)}>
            回合 <strong>{playerStats?.turn ?? battle.turn}</strong>
          </span>
          <span className={cx(styles.chip, styles.chipTone.energy)}>
            能量 <strong>{playerStats?.energy ?? battle.player.energy}</strong>
            <span className={styles.muted}>/{playerStats?.maxEnergy ?? battle.player.maxEnergy}</span>
            {outOfEnergy ? (
              <span className={styles.energyHint}>已空</span>
            ) : null}
          </span>
          {player ? (
            <span className={cx(styles.chip, styles.chipTone.default)}>
              玩家 <strong>{player.hp}</strong>
              <span className={styles.muted}>/{player.maxHp}</span>
              {player.block > 0 ? <span className={styles.blockText}>盾 {player.block}</span> : null}
            </span>
          ) : null}
          {currentEnemy ? (
            <span
              className={cx(styles.chip, styles.chipTone.accent)}
              title={formatMonsterIntentText(currentEnemy.intent)}
            >
              敌方 <strong>{currentEnemy.hp}</strong>
              <span className={styles.muted}>/{currentEnemy.maxHp}</span>
              <span className={styles.intentText}>意图 </span>
              <strong>{formatMonsterIntentText(currentEnemy.intent)}</strong>
            </span>
          ) : null}
          <span
            className={cx(styles.chip, styles.chipTone.default)}
            data-testid="battle-draw-count"
            title={PILE_DRAW_TITLE}
          >
            抽 <strong>{drawPile.length}</strong>
          </span>
          <span className={cx(styles.chip, styles.chipTone.default)} data-testid="battle-hand-count" title={PILE_HAND_TITLE}>
            手 <strong>{hand.length}</strong>
          </span>
          <span
            className={cx(styles.chip, styles.chipTone.default)}
            data-testid="battle-discard-count"
            title={PILE_DISCARD_TITLE}
          >
            弃 <strong>{discardPile.length}</strong>
          </span>
          <span
            className={cx(styles.chip, styles.chipTone.default)}
            data-testid="battle-exhaust-count"
            title={PILE_EXHAUST_TITLE}
          >
            消 <strong>{exhaustPile.length}</strong>
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
              className={styles.e2ePhaserBridge}
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
