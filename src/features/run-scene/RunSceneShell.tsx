import type { ReactNode } from 'react';
import { Coins, Heart, Layers3 } from 'lucide-react';
import { useGameStore } from '@/game/store/gameStore';
import { sceneThemeClass } from '@/styles/sceneTheme.css';
import * as styles from './runSceneShell.css';

export type RunSceneTone =
  | 'map'
  | 'reward'
  | 'shop'
  | 'event'
  | 'rest'
  | 'settlement';

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function RunSceneShell({
  tone,
  testId,
  className,
  children,
}: {
  tone: RunSceneTone;
  testId?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <main
      className={cx(sceneThemeClass, styles.root, styles.tone[tone], className)}
      data-testid={testId}
      data-scene-ready="true"
      data-scene-tone={tone}
    >
      <div className={styles.atmosphere} aria-hidden>
        <span className={styles.rift} />
        <span className={styles.vignette} />
        <span className={styles.texture} />
      </div>
      {children}
    </main>
  );
}

export function RunSceneHeader({
  title,
  eyebrow,
  actions,
  compact = false,
}: {
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
  compact?: boolean;
}) {
  const run = useGameStore((state) => state.run);
  if (!run) return null;
  return (
    <header className={cx(styles.header, compact && styles.headerCompact)}>
      <div className={styles.identity}>
        <strong className={styles.brand}>SPIREWALKER</strong>
        <span className={styles.divider} aria-hidden />
        <span className={styles.sceneCopy}>
          {eyebrow ? <small>{eyebrow}</small> : null}
          <b>{title}</b>
        </span>
      </div>
      <div className={styles.runMeta} aria-label="当前旅程状态">
        <span className={styles.metaChip}>
          <Layers3 aria-hidden />
          第 {run.meta.act} 章 · {run.meta.actFloor} 层
        </span>
        <span className={cx(styles.metaChip, styles.healthChip)}>
          <Heart aria-hidden />
          {run.player.currentHp}/{run.player.maxHp}
        </span>
        <span className={cx(styles.metaChip, styles.goldChip)}>
          <Coins aria-hidden />
          {run.meta.gold}
        </span>
      </div>
      {actions ? <div className={styles.headerActions}>{actions}</div> : null}
    </header>
  );
}
