import { useGameStore } from '@/game/store/gameStore';

function isDev(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
}

export function DebugPanel() {
  const run = useGameStore((s) => s.run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);
  if (!isDev() || !run) return null;
  const battle = run.battle;
  const enemyIntentSummary = battle
    ? battle.enemyUnitIds
        .map((id) => {
          const m = battle.monsters[id];
          const u = battle.units[id];
          const intent = m?.intent;
          if (!u) return null;
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
                      : `atk+ ${intent.attack} ${intent.statusId}:${intent.value}`;
          return `${u.name}:${intentText}`;
        })
        .filter(Boolean)
        .join(' | ')
    : '';

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
          <p>
            enemy intents: <strong>{enemyIntentSummary || '-'}</strong>
          </p>
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
