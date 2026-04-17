import { useGameStore } from '@/game/store/gameStore';

export function FastModeToggle() {
  const fastMode = useGameStore((s) => s.fastMode);
  const setFastMode = useGameStore((s) => s.setFastMode);

  return (
    <label className="fast-mode-toggle">
      <input
        type="checkbox"
        checked={fastMode}
        onChange={(e) => setFastMode(e.target.checked)}
      />
      快速表现
    </label>
  );
}
