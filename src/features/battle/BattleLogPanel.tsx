import { useGameStore } from '@/game/store/gameStore';
import * as styles from './battlePage.css';

export function BattleLogPanel() {
  const battleLog = useGameStore((s) => s.battleLog);
  const screen = useGameStore((s) => s.run?.screen?.type);

  if (screen !== 'battle') return null;

  return (
    <aside className={styles.logPanel} aria-label="战斗日志">
      <div className={styles.logTitle}>日志</div>
      {battleLog.length === 0 ? (
        <p className={styles.logEmpty}>出牌或结束回合后在此显示</p>
      ) : (
        <ol className={styles.logList}>
          {battleLog.map((line, i) => (
            <li key={`${i}-${line.slice(0, 12)}`}>{line}</li>
          ))}
        </ol>
      )}
    </aside>
  );
}
