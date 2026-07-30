import { BookOpen, Medal, ScrollText, Sparkles, Trophy } from 'lucide-react';
import { useState } from 'react';
import { ALL_CARD_DEFINITIONS } from '@/game/core/definitions/cards';
import {
  ARCHETYPE_DISPLAY,
  getCardArchetype,
  type CardArchetype,
} from '@/game/core/definitions/cards/archetypes';
import { parseCardId } from '@/game/core/definitions/cards/upgradeRules';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
import { RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import { CardArtwork } from '@/features/cards/CardArtwork';
import { sceneThemeClass } from '@/styles/sceneTheme.css';
import type { ProfileState } from '@/game/core/model/profile';
import type { RunState } from '@/game/core/model/run';
import {
  getPlayerCodexCardIds,
  getPlayerCodexRelicIds,
} from './archiveContent';
import * as styles from './archivePage.css';

export type ArchiveView = 'fate' | 'codex' | 'relics' | 'collection' | 'achievements';

interface ArchivePageProps {
  view: ArchiveView;
  run: RunState | null;
  profile: ProfileState;
  onChangeView: (view: ArchiveView) => void;
  onClose: () => void;
  onStartRun: () => void;
  onResetProfile: () => void;
}

const NAV_ITEMS: Array<{ view: ArchiveView; label: string; icon: typeof Sparkles }> = [
  { view: 'fate', label: '命运', icon: Sparkles },
  { view: 'codex', label: '图鉴', icon: BookOpen },
  { view: 'relics', label: '遗物', icon: ScrollText },
  { view: 'collection', label: '收藏', icon: Medal },
  { view: 'achievements', label: '成就', icon: Trophy },
];

const CODEX_FILTERS: Array<{
  id: 'all' | CardArchetype;
  label: string;
}> = [
  { id: 'all', label: '全部' },
  { id: 'guard', label: ARCHETYPE_DISPLAY.guard.name },
  { id: 'burst', label: ARCHETYPE_DISPLAY.burst.name },
  { id: 'mixed', label: ARCHETYPE_DISPLAY.mixed.name },
  { id: 'neutral', label: ARCHETYPE_DISPLAY.neutral.name },
];

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export function ArchivePage({ view, run, profile, onChangeView, onClose, onStartRun, onResetProfile }: ArchivePageProps) {
  return (
    <main className={cx(sceneThemeClass, styles.page)} data-scene-ready="true" data-scene-tone="archive">
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
        <button
          type="button"
          className={styles.resetButton}
          onClick={() => {
            if (window.confirm('确定清空本机长期档案吗？当前对局存档不会被删除。')) onResetProfile();
          }}
        >
          清空长期档案
        </button>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          返回
        </button>
      </aside>
      <section className={styles.content}>{renderView(view, run, profile, onStartRun)}</section>
    </main>
  );
}

function renderView(view: ArchiveView, run: RunState | null, profile: ProfileState, onStartRun: () => void) {
  switch (view) {
    case 'fate':
      return <FateView run={run} onStartRun={onStartRun} />;
    case 'codex':
      return <CodexView profile={profile} />;
    case 'relics':
      return <RelicsView run={run} profile={profile} />;
    case 'collection':
      return <CollectionView run={run} />;
    case 'achievements':
      return <AchievementsView profile={profile} />;
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
              <strong>
                {branch.coreCardIds
                  .map((cardId) => ALL_CARD_DEFINITIONS[cardId]?.name ?? cardId)
                  .join(' / ')}
              </strong>
              <small>核心遗物：{RELIC_DEFINITIONS[branch.coreRelicId]?.name ?? branch.coreRelicId}</small>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function CodexView({ profile }: { profile: ProfileState }) {
  const [filter, setFilter] = useState<'all' | CardArchetype>('all');
  const starterCardIds = getCharacterDefinition('walker').starterDeck.map(
    (cardId) => parseCardId(cardId).baseId,
  );
  const cardIds = getPlayerCodexCardIds(profile);
  const cards = cardIds
    .map((cardId) => ALL_CARD_DEFINITIONS[cardId])
    .filter((card) => Boolean(card));
  const knownCards = new Set(
    [
      ...starterCardIds,
      ...profile.unlockedCards.map((cardId) => parseCardId(cardId).baseId),
    ],
  );
  const visibleCards = filter === 'all'
    ? cards
    : cards.filter((card) => getCardArchetype(card.id) === filter);
  const knownCount = cards.filter((card) => knownCards.has(card.id)).length;

  return (
    <div className={styles.panel}>
      <p className={styles.kicker}>Walker Card Archive</p>
      <h2 className={styles.sectionTitle}>卡牌图鉴</h2>
      <div className={styles.metricRow}>
        <Metric label="卡牌" value={cards.length} />
        <Metric label="攻击" value={cards.filter((card) => card.type === 'attack').length} />
        <Metric label="技能" value={cards.filter((card) => card.type === 'skill').length} />
        <Metric label="能力" value={cards.filter((card) => card.type === 'power').length} />
        <Metric label="已发现" value={knownCount} />
      </div>
      <div className={styles.filterBar} aria-label="按流派筛选卡牌">
        {CODEX_FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cx(styles.filterButton, filter === item.id && styles.filterButtonActive)}
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.cardGrid}>
        {visibleCards.map((card) => {
          const known = knownCards.has(card.id);
          return (
            <article
              key={card.id}
              className={cx(
                styles.codexCard,
                styles.archetypeTone[getCardArchetype(card.id)],
                known ? styles.codexKnown : styles.codexUnknown,
              )}
              data-known={known ? 'true' : 'false'}
            >
              <span className={styles.codexArt} aria-hidden>
                {known ? (
                  <CardArtwork
                    cardId={card.id}
                    className={styles.codexArtImage}
                    fallback={<span className={styles.codexArtFallback} />}
                  />
                ) : (
                  <span className={styles.codexArtUnknown}>◇</span>
                )}
                <span className={styles.codexArtShade} />
              </span>
              <span className={styles.codexBody}>
                <span className={styles.codexHeader}>
                  <strong>{known ? card.name : '尚未发现'}</strong>
                  <span>{known ? `${card.rarity} · ${card.cost} 费` : '未知卡牌'}</span>
                </span>
                <p>{known ? card.description : '在攀登中取得此卡后，档案会记录完整效果。'}</p>
              </span>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function RelicsView({ run, profile }: { run: RunState | null; profile: ProfileState }) {
  const owned = new Set(run?.meta.relics ?? []);
  const known = new Set(profile.unlockedRelics);
  const relics = getPlayerCodexRelicIds(
    profile,
    run,
    run?.meta.characterId ?? 'walker',
  ).map((relicId) => RELIC_DEFINITIONS[relicId]!);
  return (
    <div className={styles.panel}>
      <p className={styles.kicker}>Void Collection</p>
      <h2 className={styles.sectionTitle}>遗物档案</h2>
      <div className={styles.metricRow}>
        <Metric label="遗物总数" value={relics.length} />
        <Metric label="已发现" value={known.size} />
        <Metric label="本局持有" value={owned.size} />
      </div>
      <div className={styles.relicGrid}>
        {relics.map((relic) => {
          const discovered = known.has(relic.id) || owned.has(relic.id);
          return (
            <article
              key={relic.id}
              className={cx(
                styles.relicCard,
                discovered ? styles.relicKnown : styles.relicUnknown,
                owned.has(relic.id) && styles.relicOwned,
              )}
            >
              <span className={styles.relicGlyph}>{owned.has(relic.id) ? '✦' : discovered ? '◆' : '◇'}</span>
              <strong>{discovered ? relic.name : '未识别遗物'}</strong>
              <p>{discovered ? relic.description : '在攀登中获得后解锁详情。'}</p>
            </article>
          );
        })}
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

function AchievementsView({ profile }: { profile: ProfileState }) {
  const achievements = [
    { label: '第一步', done: profile.achievements.includes('first_step'), text: '创建一局尖塔行者探索。' },
    { label: '卡组雏形', done: profile.achievements.includes('card_collection'), text: '让牌组达到 12 张以上。' },
    { label: '遗物回响', done: profile.achievements.includes('relic_echo'), text: '携带至少 1 件遗物。' },
    { label: '深入尖塔', done: profile.achievements.includes('deep_spire'), text: '抵达全局第 5 层。' },
    { label: 'Act II', done: profile.achievements.includes('act_two'), text: '进入第二幕。' },
  ];
  return (
    <div className={styles.panel}>
      <p className={styles.kicker}>Void Legends</p>
      <h2 className={styles.sectionTitle}>成就</h2>
      <div className={styles.metricRow}>
        <Metric label="探索次数" value={profile.lifetimeStats.runs} />
        <Metric label="胜利次数" value={profile.lifetimeStats.wins} />
        <Metric label="最高幕数" value={profile.lifetimeStats.highestAct} />
      </div>
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
