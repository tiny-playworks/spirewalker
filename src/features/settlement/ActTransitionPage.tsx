import { ArrowRight, HeartPulse, Layers3 } from 'lucide-react';
import { RunSceneShell } from '@/features/run-scene/RunSceneShell';
import { useGameStore } from '@/game/store/gameStore';
import * as styles from './actTransitionPage.css';

export function ActTransitionPage() {
  const run = useGameStore((s) => s.run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);
  if (!run || !run.meta.actTransitionFrom) return null;
  return (
    <RunSceneShell tone="settlement" className={styles.page} testId="act-transition">
      <span className={styles.chapter}>ACT {run.meta.actTransitionFrom} COMPLETE</span>
      <div className={styles.sigil} aria-hidden><Layers3 /></div>
      <h1 className={styles.title}>废墟的回声落在身后</h1>
      <p className={styles.copy}>行者的伤势已恢复。前方的规则更锋利，构筑也将开始真正成形。</p>
      <div className={styles.summary}>
        <span><HeartPulse aria-hidden /> 生命已恢复至 {run.player.currentHp}/{run.player.maxHp}</span>
        <span>进入第 {run.meta.act} 章 · 碎裂回廊</span>
      </div>
      <button type="button" className={styles.continueButton} onClick={() => dispatchCommand({ type: 'CONTINUE_ACT_TRANSITION' })}>
        进入下一章 <ArrowRight aria-hidden />
      </button>
    </RunSceneShell>
  );
}
