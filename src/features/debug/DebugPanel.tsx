import { useEffect, useState } from 'react';
import { useGameStore } from '@/game/store/gameStore';

type EnemyDebugRow = { label: string; defId: string; intentText: string; aiTrace: string };

function isDev(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
}

export function DebugPanel() {
  const run = useGameStore((s) => s.run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isDev()) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '`' || event.key === '~') {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isDev() || !run || !open) return null;
  const battle = run.battle;
  const enemyDebugLines: EnemyDebugRow[] = battle
    ? battle.enemyUnitIds.reduce<EnemyDebugRow[]>((acc, id) => {
        const m = battle.monsters[id];
        const u = battle.units[id];
        const intent = m?.intent;
        if (!u || !m) return acc;
        const intentText =
          !intent
            ? '-'
            : intent.type === 'attack'
              ? `atk ${intent.value}`
              : intent.type === 'block'
                ? `blk ${intent.value}`
                : intent.type === 'buff'
                  ? `buff ${intent.statusId}:${intent.value}`
                  : intent.type === 'debuff'
                    ? `debuff ${intent.statusId}:${intent.value}`
                    : intent.type === 'reduce_status'
                      ? `reduce ${intent.statusId}:${intent.value}`
                      : intent.type === 'punish_multi_play'
                        ? `punish play>=${intent.threshold} blk ${intent.block}`
                        : `atk+ ${intent.attack} ${intent.statusId}:${intent.value}`;
        const defId = m.monsterId;
        const aiTrace = m.aiTrace ?? '-';
        acc.push({ label: u.name, defId, intentText, aiTrace });
        return acc;
      }, [])
    : [];

  return (
    <aside className="debug-panel">
      <h3>Debug</h3>
      <p>
        screen: <strong>{run.screen.type}</strong> · floor: <strong>{run.meta.floor}</strong> · seed:{' '}
        <strong>{run.seed}</strong> · gold:{' '}
        <strong>{run.meta.gold}</strong>
      </p>
      {battle ? (
        <>
          <p>
            phase: <strong>{battle.phase}</strong> · input: <strong>{battle.inputMode}</strong> · pending:{' '}
            <strong>{battle.pendingAction ? 'yes' : 'no'}</strong>
          </p>
          {enemyDebugLines.length > 0 ? (
            <ul className="debug-enemy-list">
              {enemyDebugLines.map((row) => (
                <li key={row.label}>
                  <strong>{row.label}</strong> · def <code>{row.defId}</code> · {row.intentText}
                  <br />
                  <span className="debug-ai-trace">AI: {row.aiTrace}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              enemies: <strong>-</strong>
            </p>
          )}
          <p>
            last events: <strong>{battle.lastResolvedEvents.map((e) => e.type).join(', ') || '-'}</strong>
          </p>
        </>
      ) : null}
      <div className="debug-panel-actions">
        <button type="button" onClick={() => dispatchCommand({ type: 'END_TURN' })}>
          下一回合
        </button>
        <button type="button" onClick={() => dispatchCommand({ type: 'DEBUG_SET_PLAYER_HP', hp: 5 })}>
          残血(5)
        </button>
        <button
          type="button"
          onClick={() =>
            dispatchCommand({ type: 'DEBUG_ADD_STATUS', statusId: 'strength', stacks: 2 })
          }
        >
          +2力量
        </button>
        <button type="button" onClick={() => dispatchCommand({ type: 'DEBUG_ADD_HAND_CARD', definitionId: 'bash' })}>
          加测试牌
        </button>
        <button
          type="button"
          onClick={() => dispatchCommand({ type: 'DEBUG_FORCE_BATTLE_OUTCOME', outcome: 'victory' })}
        >
          一键胜利
        </button>
        <button type="button" onClick={() => dispatchCommand({ type: 'DEBUG_JUMP_SCREEN', screen: 'shop' })}>
          跳商店
        </button>
        <button type="button" onClick={() => dispatchCommand({ type: 'DEBUG_JUMP_SCREEN', screen: 'event' })}>
          跳事件
        </button>
        <button type="button" onClick={() => dispatchCommand({ type: 'DEBUG_JUMP_SCREEN', screen: 'reward' })}>
          跳奖励
        </button>
      </div>
    </aside>
  );
}
