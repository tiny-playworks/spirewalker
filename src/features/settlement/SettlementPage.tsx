import { BarChart3, BookOpen, Footprints, LibraryBig, RotateCcw, Trophy } from 'lucide-react';
import { CARD_DEFINITIONS } from '@/game/core/definitions/cards';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { createEmptyRunStats } from '@/game/core/model/runStats';
import { useGameStore } from '@/game/store/gameStore';
import { RunSceneShell } from '@/features/run-scene/RunSceneShell';
import * as styles from './settlementPage.css';

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

function summarizeDeck(deck: string[]) {
  const counts = new Map<string, number>();
  for (const definitionId of deck) {
    counts.set(definitionId, (counts.get(definitionId) ?? 0) + 1);
  }
  return [...counts.entries()].sort(([left], [right]) => {
    const leftName = CARD_DEFINITIONS[left]?.name ?? left;
    const rightName = CARD_DEFINITIONS[right]?.name ?? right;
    return leftName.localeCompare(rightName, 'zh-CN');
  });
}

export function SettlementPage({
  outcome,
  onOpenArchive,
}: {
  outcome: 'defeat' | 'victory';
  onOpenArchive?: () => void;
}) {
  const run = useGameStore((s) => s.run);
  const startRun = useGameStore((s) => s.startRun);
  const returnToMainMenu = useGameStore((s) => s.returnToMainMenu);
  if (!run) return null;
  const stats = run.stats ?? createEmptyRunStats();
  const topCards = Object.entries(stats.cardPlays)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const finalDeck = summarizeDeck(run.masterDeck);

  return (
    <RunSceneShell tone="settlement" className={styles.page} testId={`${outcome}-settlement`}>
      <section className={styles.hero}>
        <span className={cx(styles.emblem, outcome === 'victory' && styles.emblemVictory)} aria-hidden>
          {outcome === 'victory' ? <Trophy /> : <Footprints />}
        </span>
        <p className={styles.eyebrow}>{outcome === 'victory' ? '远征记录封存' : '行者的回声留在塔中'}</p>
        <h1 className={styles.title}>{outcome === 'victory' ? '尖塔暂时沉寂' : '本次攀登止步于此'}</h1>
        <p className={styles.subtitle}>
          抵达第 {run.meta.act} 章 · 第 {run.meta.actFloor} 层　种子 {run.seed}
        </p>
      </section>

      <section className={styles.statsGrid} aria-label="本局统计">
        <Stat label="战斗胜利" value={stats.battlesWon} />
        <Stat label="击破敌人" value={stats.enemiesDefeated} />
        <Stat label="造成伤害" value={stats.damageDealt} />
        <Stat label="最高一击" value={stats.highestHit} />
        <Stat label="获得格挡" value={stats.blockGained} />
        <Stat label="打出卡牌" value={stats.cardsPlayed} />
      </section>

      <section className={styles.detailGrid}>
        <article className={styles.panel}>
          <h2><BookOpen aria-hidden /> 最常使用</h2>
          {topCards.length > 0 ? (
            <ol className={styles.cardList}>
              {topCards.map(([id, count]) => (
                <li key={id}><span>{CARD_DEFINITIONS[id]?.name ?? id}</span><strong>×{count}</strong></li>
              ))}
            </ol>
          ) : <p className={styles.empty}>尚无出牌记录。</p>}
        </article>
        <article className={styles.panel}>
          <h2><BarChart3 aria-hidden /> 路线摘要</h2>
          <div className={styles.routeStats}>
            <span>经过节点 <strong>{stats.nodesVisited.length}</strong></span>
            <span>获得金币 <strong>{stats.goldEarned}</strong></span>
            <span>花费金币 <strong>{stats.goldSpent}</strong></span>
            <span>最终牌组 <strong>{run.masterDeck.length}</strong></span>
          </div>
        </article>
        <article className={styles.panel}>
          <h2><LibraryBig aria-hidden /> 最终牌组</h2>
          <ul className={styles.deckList}>
            {finalDeck.map(([id, count]) => (
              <li key={id}>
                <span>{CARD_DEFINITIONS[id]?.name ?? id}</span>
                <strong>×{count}</strong>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <footer className={styles.actions}>
        <button type="button" className={styles.primary} onClick={() => startRun(createMapRun(Date.now() & 0xffff_ffff))}>
          <RotateCcw aria-hidden /> 再来一局
        </button>
        {onOpenArchive ? (
          <button type="button" className={styles.secondary} onClick={onOpenArchive}>查看档案</button>
        ) : null}
        <button type="button" className={styles.secondary} onClick={returnToMainMenu}>返回主菜单</button>
      </footer>
    </RunSceneShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <span className={styles.stat}><strong>{value}</strong><small>{label}</small></span>;
}
