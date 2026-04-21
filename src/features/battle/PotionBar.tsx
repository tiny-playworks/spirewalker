import { POTION_DEFINITIONS } from '@/game/core/definitions/potions';
import { useGameStore } from '@/game/store/gameStore';
import * as styles from './battleHud.css';

export function PotionBar() {
  const run = useGameStore((s) => s.run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);

  if (!run?.battle || run.screen.type !== 'battle') return null;
  const { potions } = run.meta;
  if (potions.length === 0) return null;

  return (
    <div className={styles.potionBar}>
      <span className={styles.potionBarLabel}>药水</span>
      <ul className={styles.potionList}>
        {potions.map((potionId, slotIndex) => {
          const def = POTION_DEFINITIONS[potionId];
          return (
            <li key={`${potionId}-${slotIndex}`}>
              <button
                type="button"
                className={styles.potionButton}
                title={def ? `${def.name}\n${def.description}\n点击后会立即在当前战斗中使用。` : potionId}
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
