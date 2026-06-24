import { BookOpen, Medal, ScrollText, Sparkles, Trophy } from 'lucide-react';
import { ALL_CARD_DEFINITIONS } from '@/game/core/definitions/cards';
import { getCardArchetype } from '@/game/core/definitions/cards/archetypes';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
import { RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import type { RunState } from '@/game/core/model/run';
import * as styles from './archivePage.css';

export type ArchiveView = 'fate' | 'codex' | 'relics' | 'collection' | 'achievements';

interface ArchivePageProps {
  view: ArchiveView;
  run: RunState | null;
  onChangeView: (view: ArchiveView) => void;
  onClose: () => void;
  onStartRun: () => void;
}

const NAV_ITEMS: Array<{ view: ArchiveView; label: string; icon: typeof Sparkles }> = [
  { view: 'fate', label: '命运', icon: Sparkles },
  { view: 'codex', label: '图鉴', icon: BookOpen },
  { view: 'relics', label: '遗物', icon: ScrollText },
  { view: 'collection', label: '收藏', icon: Medal },
  { view: 'achievements', label: '成就', icon: Trophy },
];

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export function ArchivePage({ view, run, onChangeView, onClose, onStartRun }: ArchivePageProps) {
  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <div>
          <p className={styles.kicker}>Spirewalker Archive</p>
          <h1 className={styles.title}>虚空档案</h1>
        </div>
        <nav className={styles.nav} aria-label="档案导航">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.view}
                type="button"
                className={cx(styles.navButton, view === item.view && styles.navButtonActive)}
                onClick={() => onChangeView(item.view)}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          返回
        </button>
      </aside>
      <section className={styles.content}>{renderView(view, run, onStartRun)}</section>
    </main>
  );
}

function renderView(view: ArchiveView, run: RunState | null, onStartRun: () => void) {
  switch (view) {
    case 'fate':
      return <FateView run={run} onStartRun={onStartRun} />;
    case 'codex':
      return <CodexView />;
    case 'relics':
      return <RelicsView run={run} />;
    case 'collection':
      return <CollectionView run={run} />;
    case 'achievements':
      return <AchievementsView run={run} />;
    default:
      return null;
  }
}

function FateView({ run, onStartRun }: { run: RunState | null; onStartRun: () => void }) {
  const character = getCharacterDefinition(run?.meta.characterId ?? 'walker');
  return (
    <div className={styles.panel}>
      <p className={styles.kicker}>Fate Alignment</p>
      <h2 className={styles.sectionTitle}>命运校准</h2>
      <div className={styles.heroGrid}>
        <article className={styles.fateCard}>
          <span className={styles.orb}>↟</span>
          <h3>{character.name} · {character.title}</h3>
          <p>{character.description}</p>
          <p><strong>{character.passiveName}</strong>：{character.passiveDescription}</p>
          <button type="button" className={styles.primaryButton} onClick={onStartRun}>
            开始新命运
          </button>
        </article>
        <div className={styles.branchGrid}>
          {character.buildBranches.map((branch) => (
            <article key={branch.id} className={styles.smallCard}>
              <span>{branch.name}</span>
              <strong>{branch.coreCardIds.join(' / ')}</strong>
              <small>核心遗物：{RELIC_DEFINITIONS[branch.coreRelicId]?.name ?? branch.coreRelicId}</small>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function CodexView() {
  const cards = Object.values(ALL_CARD_DEFINITIONS);
  return (
    <div className={styles.panel}>
      <p className={styles.kicker}>Restored Archive Logic</p>
      <h2 className={styles.sectionTitle}>卡牌图鉴</h2>
      <div className={styles.metricRow}>
        <Metric label="卡牌" value={cards.length} />
        <Metric label="攻击" value={cards.filter((card) => card.type === 'attack').length} />
        <Metric label="技能" value={cards.filter((card) => card.type === 'skill').length} />
        <Metric label="能力" value={cards.filter((card) => card.type === 'power').length} />
      </div>
      <div className={styles.cardGrid}>
        {cards.slice(0, 48).map((card) => (
          <article key={card.id} className={cx(styles.codexCard, styles.archetypeTone[getCardArchetype(card.id)])}>
            <div>
              <strong>{card.name}</strong>
              <span>{card.rarity} · {card.cost} 费</span>
            </div>
            <p>{card.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function RelicsView({ run }: { run: RunState | null }) {
  const owned = new Set(run?.meta.relics ?? []);
  const relics = Object.values(RELIC_DEFINITIONS);
  return (
    <div className={styles.panel}>
      <p className={styles.kicker}>Void Collection</p>
      <h2 className={styles.sectionTitle}>遗物档案</h2>
      <div className={styles.metricRow}>
        <Metric label="已识别" value={relics.length} />
        <Metric label="本局持有" value={owned.size} />
      </div>
      <div className={styles.relicGrid}>
        {relics.slice(0, 60).map((relic) => (
          <article key={relic.id} className={cx(styles.relicCard, owned.has(relic.id) && styles.relicOwned)}>
            <span className={styles.relicGlyph}>{owned.has(relic.id) ? '✦' : '◇'}</span>
            <strong>{relic.name}</strong>
            <p>{relic.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function CollectionView({ run }: { run: RunState | null }) {
  const character = getCharacterDefinition(run?.meta.characterId ?? 'walker');
  const masterDeck = run?.masterDeck ?? character.starterDeck;
  return (
    <div className={styles.panel}>
      <p className={styles.kicker}>Void Hall Style</p>
      <h2 className={styles.sectionTitle}>收藏馆</h2>
      <div className={styles.metricRow}>
        <Metric label="牌组" value={masterDeck.length} />
        <Metric label="金币" value={run?.meta.gold ?? 0} />
        <Metric label="药水" value={run?.meta.potions.length ?? character.startingPotions.length} />
        <Metric label="遗物" value={run?.meta.relics.length ?? character.startingRelics.length} />
      </div>
      <div className={styles.timeline}>
        {masterDeck.slice(0, 20).map((cardId, index) => {
          const card = ALL_CARD_DEFINITIONS[cardId];
          return (
            <span key={`${cardId}-${index}`}>
              <small>{String(index + 1).padStart(2, '0')}</small>
              {card?.name ?? cardId}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function AchievementsView({ run }: { run: RunState | null }) {
  const achievements = [
    { label: '第一步', done: Boolean(run), text: '创建一局尖塔行者探索。' },
    { label: '卡组雏形', done: (run?.masterDeck.length ?? 0) >= 12, text: '让牌组达到 12 张以上。' },
    { label: '遗物回响', done: (run?.meta.relics.length ?? 0) > 0, text: '携带至少 1 件遗物。' },
    { label: '深入尖塔', done: (run?.meta.floor ?? 0) >= 5, text: '抵达全局第 5 层。' },
    { label: 'Act II', done: (run?.meta.act ?? 1) >= 2, text: '进入第二幕。' },
  ];
  return (
    <div className={styles.panel}>
      <p className={styles.kicker}>Void Legends</p>
      <h2 className={styles.sectionTitle}>成就</h2>
      <div className={styles.achievementList}>
        {achievements.map((achievement) => (
          <article key={achievement.label} className={cx(styles.achievement, achievement.done && styles.achievementDone)}>
            <span>{achievement.done ? '已解锁' : '未解锁'}</span>
            <strong>{achievement.label}</strong>
            <p>{achievement.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <span className={styles.metric}>
      <small>{label}</small>
      <strong>{value}</strong>
    </span>
  );
}
