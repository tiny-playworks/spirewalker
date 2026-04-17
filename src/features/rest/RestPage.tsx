import { useGameStore } from '@/game/store/gameStore';

export function RestPage() {
  const run = useGameStore((s) => s.run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);

  if (!run || run.screen.type !== 'rest') return null;

  const { player } = run;
  const heal = Math.floor(player.maxHp * 0.3);

  return (
    <div className="boot rest-page">
      <h2 className="subscreen-title">篝火休息</h2>
      <p className="subscreen-tip">
        当前生命 {player.currentHp} / {player.maxHp}
        <br />
        休息可回复约 <strong>{heal}</strong> 点生命（不超过上限）。
      </p>
      <button
        type="button"
        className="btn-end-turn subscreen-leave"
        onClick={() => dispatchCommand({ type: 'LEAVE_REST_TO_MAP' })}
      >
        休息并返回地图
      </button>
    </div>
  );
}
