import { useGameStore } from '@/game/store/gameStore';
import * as styles from './battlePage.css';

export function FastModeToggle() {
  const fastMode = useGameStore((s) => s.fastMode);
  const setFastMode = useGameStore((s) => s.setFastMode);

  return (
    <label className={styles.fastModeToggle} title="快速表现">
      <input
        type="checkbox"
        checked={fastMode}
        onChange={(e) => setFastMode(e.target.checked)}
      />
      FAST
    </label>
  );
}
