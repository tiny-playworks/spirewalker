import { useGameStore } from '@/game/store/gameStore';
import { sceneThemeClass } from '@/styles/sceneTheme.css';
import * as subscreenStyles from '@/styles/subscreen.css';

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export function RestPage() {
  const run = useGameStore((s) => s.run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);

  if (!run || run.screen.type !== 'rest') return null;

  const { player } = run;
  const heal = Math.floor(player.maxHp * 0.3);

  return (
    <div className={cx('boot', sceneThemeClass, subscreenStyles.screenRoot)}>
      <h2 className={subscreenStyles.title}>篝火休息</h2>
      <p className={subscreenStyles.tip}>
        当前生命 {player.currentHp} / {player.maxHp}
        <br />
        休息可回复约 <strong>{heal}</strong> 点生命（不超过上限）。
      </p>
      <button
        type="button"
        className={cx(
          subscreenStyles.actionButton,
          subscreenStyles.actionButtonTone.primary,
          subscreenStyles.leaveButton,
        )}
        onClick={() => dispatchCommand({ type: 'LEAVE_REST_TO_MAP' })}
      >
        休息并返回地图
      </button>
    </div>
  );
}
