import { Coins, Heart, Shield } from 'lucide-react';
import { useGameStore } from '@/game/store/gameStore';
import { selectBattle } from '@/game/store/selectors/battleSelectors';
import { sceneThemeClass } from '@/styles/sceneTheme.css';
import * as styles from './battleHud.css';

const ICON_SIZE = 15;

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export function BattleHUD() {
  const run = useGameStore((s) => s.run);
  const battle = selectBattle(run);

  if (!run || !battle) return null;

  const player = battle.units[battle.playerUnitId];
  const momentum = player?.statuses.find((status) => status.id === 'momentum')?.stacks ?? 0;
  const selectingTarget = battle.inputMode === 'selecting_target' && battle.pendingAction?.type === 'play_card';
  const nextMomentum = Math.max(0, momentum - 1);
  const momentumHint = momentum > 0
    ? `下一张牌结算后获得 ${momentum} 点格挡，连势降至 ${nextMomentum} 层`
    : '打出起势牌来积累连势';

  return (
    <header className={cx(sceneThemeClass, styles.root)} data-testid="battle-hud">
      <div className={styles.inner}>
        <div className={styles.primaryRow}>
          <span className={styles.brand}>SPIREWALKER</span>
          <span className={cx(styles.chip, styles.chipTone.health)}>
            <Heart size={ICON_SIZE} aria-hidden />
            <strong>{run.player.currentHp}</strong>
            <span className={styles.muted}>/{run.player.maxHp}</span>
          </span>
          <span className={cx(styles.chip, styles.chipTone.block)}>
            <Shield size={ICON_SIZE} aria-hidden />
            <strong>{player?.block ?? 0}</strong>
          </span>
          <span className={cx(styles.chip, styles.chipTone.gold)}>
            <Coins size={ICON_SIZE} aria-hidden />
            <strong>{run.meta.gold}</strong>
          </span>
          <span
            className={cx(styles.chip, styles.chipTone.accent)}
            title={`连势 ${momentum} 层：${momentumHint}`}
            aria-label={`连势 ${momentum} 层，${momentumHint}`}
          >
            <span className={styles.momentumGlyph} aria-hidden>◈</span>
            <strong>{momentum}</strong>
            <span className={styles.momentumHint}>{momentum > 0 ? `下一牌 +${momentum} 盾` : '等待起势'}</span>
          </span>
          {battle.phase === 'victory' ? (
            <span className={cx(styles.chip, styles.chipTone.win)}>胜利</span>
          ) : null}
          {selectingTarget ? (
            <span className={cx(styles.chip, styles.chipTone.accent)}>
              选择目标中
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
}
