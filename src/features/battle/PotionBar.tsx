import { POTION_DEFINITIONS } from '@/game/core/definitions/potions';
import { useGameStore } from '@/game/store/gameStore';

export function PotionBar() {
  const run = useGameStore((s) => s.run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);

  if (!run?.battle || run.screen.type !== 'battle') return null;
  const { potions } = run.meta;
  if (potions.length === 0) return null;

  return (
    <div className="potion-bar">
      <span className="potion-bar-label">药水</span>
      <ul className="potion-list">
        {potions.map((potionId, slotIndex) => {
          const def = POTION_DEFINITIONS[potionId];
          return (
            <li key={`${potionId}-${slotIndex}`}>
              <button
                type="button"
                className="potion-btn"
                title={def?.description ?? potionId}
                onClick={() => dispatchCommand({ type: 'USE_POTION', slotIndex })}
              >
                {def?.name ?? potionId}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
