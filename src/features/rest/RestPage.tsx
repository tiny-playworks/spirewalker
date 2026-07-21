import { ArrowRight, Flame, HeartPulse, Sparkles } from 'lucide-react';
import { RunSceneHeader, RunSceneShell } from '@/features/run-scene/RunSceneShell';
import { useGameStore } from '@/game/store/gameStore';
import * as styles from './restPage.css';

export function RestPage() {
  const run = useGameStore((state) => state.run);
  const dispatchCommand = useGameStore((state) => state.dispatchCommand);

  if (!run || run.screen.type !== 'rest') return null;

  const { player } = run;
  const heal = Math.floor(player.maxHp * 0.3);
  const restoredHp = Math.min(player.maxHp, player.currentHp + heal);
  const currentRatio = (player.currentHp / player.maxHp) * 100;
  const restoredRatio = (restoredHp / player.maxHp) * 100;

  return (
    <RunSceneShell tone="rest" className={styles.page} testId="rest-page">
      <RunSceneHeader title="裂隙营火" eyebrow="休整节点" />
      <div className={styles.body}>
        <section className={styles.scene} aria-label="裂隙中的营火">
          <div
            className={styles.sceneImage}
            style={{ backgroundImage: "url('/assets/scenes/rest-camp.webp')" }}
            aria-hidden
          />
          <div className={styles.sceneShade} aria-hidden />
          <span className={styles.fireSigil} aria-hidden><Flame /></span>
          <div className={styles.sceneCopy}>
            <p>短暂的安全地带</p>
            <h1>让回响慢下来</h1>
            <span>火光穿过铠甲的裂纹，下一段路线仍在雾中等待。</span>
          </div>
        </section>

        <section className={styles.decision}>
          <p className={styles.kicker}><Sparkles aria-hidden /> 本次休整</p>
          <h2>恢复生命</h2>
          <p className={styles.description}>回复最大生命的 30%，但不会超过生命上限。</p>

          <div className={styles.healthPreview}>
            <div className={styles.healthNumbers}>
              <span><HeartPulse aria-hidden /> 当前 {player.currentHp}</span>
              <strong>休整后 {restoredHp}/{player.maxHp}</strong>
            </div>
            <div className={styles.healthTrack} aria-label={`生命将从 ${player.currentHp} 恢复至 ${restoredHp}`}>
              <span className={styles.healthCurrent} style={{ width: `${currentRatio}%` }} />
              <span className={styles.healthRestored} style={{ width: `${restoredRatio}%` }} />
            </div>
            <small>本次可恢复 {restoredHp - player.currentHp} 点生命</small>
          </div>

          <button
            type="button"
            className={styles.restButton}
            onClick={() => dispatchCommand({ type: 'LEAVE_REST_TO_MAP' })}
          >
            在营火旁休息 <ArrowRight aria-hidden />
          </button>
        </section>
      </div>
    </RunSceneShell>
  );
}
