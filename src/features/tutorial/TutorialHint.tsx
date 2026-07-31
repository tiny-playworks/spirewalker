import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useGameStore } from '@/game/store/gameStore';
import { activeTutorialStep, type TutorialStep } from '@/game/core/presentation/tutorialProgress';
import * as styles from './tutorialHint.css';

export function TutorialHint({
  step,
  title,
  children,
  placement = 'top-left',
}: {
  step: TutorialStep;
  title: string;
  children: ReactNode;
  placement?: 'top-left' | 'bottom-left' | 'bottom-right';
}) {
  const tutorial = useGameStore((state) => state.tutorial);
  const skipTutorial = useGameStore((state) => state.skipTutorial);
  if (activeTutorialStep(tutorial) !== step) return null;

  return (
    <aside className={`${styles.root} ${styles.placement[placement]}`} role="note" data-testid={`tutorial-hint-${step}`}>
      <span className={styles.kicker}>入门提示</span>
      <strong className={styles.title}>{title}</strong>
      <p className={styles.copy}>{children}</p>
      <button type="button" className={styles.dismiss} onClick={skipTutorial}>
        <X aria-hidden />
        跳过引导
      </button>
    </aside>
  );
}
