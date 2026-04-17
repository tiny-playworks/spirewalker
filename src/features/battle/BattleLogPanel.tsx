import { useGameStore } from '@/game/store/gameStore';

export function BattleLogPanel() {
  const battleLog = useGameStore((s) => s.battleLog);
  const screen = useGameStore((s) => s.run?.screen?.type);

  if (screen !== 'battle') return null;

  return (
    <aside className="battle-log-panel" aria-label="战斗日志">
      <div className="battle-log-title">日志</div>
      {battleLog.length === 0 ? (
        <p className="battle-log-empty">出牌或结束回合后在此显示</p>
      ) : (
        <ol className="battle-log-list">
          {battleLog.map((line, i) => (
            <li key={`${i}-${line.slice(0, 12)}`}>{line}</li>
          ))}
        </ol>
      )}
    </aside>
  );
}
