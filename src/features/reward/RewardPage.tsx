import { useState } from 'react';
import { Coins, FlaskConical, Gem } from 'lucide-react';
import { buildCardTooltipText, cardTypeLabel } from '@/game/core/battleUiText';
import { ALL_CARD_DEFINITIONS } from '@/game/core/definitions/cards';
import { getCardArchetype } from '@/game/core/definitions/cards/archetypes';
import '@/game/core/definitions/cards/upgradeRules';
import { listUpgradableDeckIndices } from '@/game/core/definitions/cards/upgradeRules';
import { POTION_DEFINITIONS } from '@/game/core/definitions/potions';
import { RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import { skipCardGoldAmount } from '@/game/core/engine/postBattleExtras';
import { rewardEncounterTierFromRun } from '@/game/core/engine/rewardEncounter';
import type { CardRarity, CardType } from '@/game/core/model/card';
import { useGameStore } from '@/game/store/gameStore';
import { sceneThemeClass } from '@/styles/sceneTheme.css';
import { FallbackImg } from '@/features/cards/FallbackImg';
import { getCardArtSources } from '@/features/battle/combatAssets';
import { ArchetypeDot } from '../cards/ArchetypeDot';
import { CardUpgradeList } from '../cards/CardUpgradeList';
import * as styles from './rewardPage.css';

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

type TypeKey = 'attack' | 'skill' | 'power';

function typeKey(type: CardType): TypeKey {
  return type === 'attack' ? 'attack' : type === 'power' ? 'power' : 'skill';
}

const RARITY_LABEL: Partial<Record<CardRarity, string>> = {
  rare: '稀有',
  legendary: '传说',
};

export function RewardPage() {
  const run = useGameStore((s) => s.run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (!run || run.screen.type !== 'reward' || !run.reward) return null;

  const choice = run.reward.items.find((i) => i.type === 'card_choice');
  const cards = choice?.type === 'card_choice' ? choice.cards : [];
  const bonusGold = run.reward.items.reduce(
    (sum, i) => (i.type === 'gold' ? sum + i.amount : sum),
    0,
  );
  const totalGoldOnPick = 15 + bonusGold;
  const encounterTier = rewardEncounterTierFromRun(run);
  const skipGoldBase = skipCardGoldAmount(encounterTier);
  const totalGoldOnSkip = skipGoldBase + bonusGold;

  const relicItems = run.reward.items.filter(
    (i): i is { type: 'relic'; relicId: string } => i.type === 'relic',
  );
  const potionItems = run.reward.items.filter(
    (i): i is { type: 'potion'; potionId: string } => i.type === 'potion',
  );

  const isTreasure = encounterTier === 'treasure';
  const upgradable = listUpgradableDeckIndices(run.masterDeck);

  return (
    <div className={cx(sceneThemeClass, styles.page)} data-testid="reward-page">
      <header className={styles.topBar}>
        <p className={styles.brandMark}>Spirewalker</p>
        <span className={styles.topMeta}>
          第 {run.meta.act} 章 · 第 {run.meta.actFloor} 层 · 全局第 {run.meta.floor} 层
        </span>
        <span className={styles.topGold}>
          <Coins className={styles.topGoldIcon} aria-hidden />
          {run.meta.gold}
        </span>
      </header>

      <div className={styles.header}>
        <span className={styles.headerHalo} aria-hidden />
        <h1 className={styles.title}>{isTreasure ? '宝藏' : '胜利'}</h1>
        <p className={styles.subtitle}>
          {isTreasure ? '开启宝藏' : `第 ${run.meta.actFloor} 层已清剿`} · 选择你的奖励
        </p>
      </div>

      <div className={styles.main}>
        <aside className={styles.logPanel}>
          <h2 className={styles.logTitle}>战利清单</h2>
          <div className={styles.logRow}>
            <span className={styles.logKey}>节点</span>
            <span className={cx(styles.logVal, styles.logValTone.plain)}>
              {isTreasure ? '宝箱' : encounterTier === 'boss' ? 'Boss' : encounterTier === 'elite' ? '精英' : '普通'}
            </span>
          </div>
          <div className={styles.logRow}>
            <span className={styles.logKey}>选牌得金</span>
            <span className={cx(styles.logVal, styles.logValTone.gold)}>+{totalGoldOnPick}</span>
          </div>
          <div className={styles.logRow}>
            <span className={styles.logKey}>遗物</span>
            <span className={cx(styles.logVal, styles.logValTone.purple)}>{relicItems.length}</span>
          </div>
          <div className={styles.logRow}>
            <span className={styles.logKey}>药水</span>
            <span className={cx(styles.logVal, styles.logValTone.teal)}>{potionItems.length}</span>
          </div>
          <div className={styles.logRow}>
            <span className={styles.logKey}>牌组</span>
            <span className={cx(styles.logVal, styles.logValTone.plain)}>{run.masterDeck.length}</span>
          </div>
        </aside>

        <section className={styles.center}>
          <div className={styles.cardRow}>
            {cards.map((defId, index) => {
              const def = ALL_CARD_DEFINITIONS[defId];
              if (!def) return null;
              const archetype = getCardArchetype(defId);
              const tk = typeKey(def.type);
              const rarityLabel = RARITY_LABEL[def.rarity];
              const isLegendary = def.rarity === 'legendary';
              return (
                <button
                  key={`${index}-${defId}`}
                  type="button"
                  className={cx(styles.card, styles.cardRarity[def.rarity])}
                  style={{ animationDelay: `${index * 70}ms` }}
                  title={buildCardTooltipText(def)}
                  onClick={() =>
                    dispatchCommand({ type: 'SELECT_REWARD_CARD', definitionId: defId })
                  }
                >
                  <span className={styles.cardArt}>
                    <FallbackImg
                      className={styles.cardArtImg}
                      alt=""
                      sources={getCardArtSources(defId)}
                      fallback={<span className={cx(styles.cardArtImg, styles.cardArtFallback[archetype])} />}
                    />
                    <span className={styles.cardArtFade} aria-hidden />
                    {rarityLabel ? (
                      <span className={cx(styles.rarityBadge, !isLegendary && styles.rarityBadgeRare)}>
                        {rarityLabel}
                      </span>
                    ) : null}
                  </span>
                  <span className={styles.cardBody}>
                    <span className={styles.cardName}>
                      <ArchetypeDot cardId={defId} />
                      {def.name}
                    </span>
                    <span className={cx(styles.cardMeta, styles.cardMetaTone[tk])}>
                      {cardTypeLabel(def.type)} · {def.cost} 费
                    </span>
                    <span className={styles.cardDesc}>{def.description}</span>
                    <span
                      className={cx(
                        styles.cardAccent,
                        isLegendary ? styles.cardAccentTone.legendary : styles.cardAccentTone[tk],
                      )}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <div className={styles.pills}>
            <span className={styles.pill}>
              <Coins className={cx(styles.pillIcon)} style={{ color: '#ffc640' }} aria-hidden />
              <span className={styles.pillGoldText}>+{totalGoldOnPick} 金</span>
            </span>
            {relicItems.map((r) => {
              const def = RELIC_DEFINITIONS[r.relicId];
              return (
                <span key={r.relicId} className={styles.pill}>
                  <span className={styles.pillDivider} aria-hidden />
                  <Gem className={styles.pillIcon} style={{ color: '#d0bcff' }} aria-hidden />
                  <span>
                    <span className={styles.pillRelicKey}>获得遗物</span>
                    <br />
                    <span className={styles.pillRelicVal}>{def?.name ?? r.relicId}</span>
                  </span>
                </span>
              );
            })}
            {potionItems.map((p) => {
              const def = POTION_DEFINITIONS[p.potionId];
              return (
                <span key={p.potionId} className={styles.pill}>
                  <span className={styles.pillDivider} aria-hidden />
                  <FlaskConical className={styles.pillIcon} style={{ color: '#3cddc7' }} aria-hidden />
                  <span>
                    <span className={styles.pillRelicKey}>获得药水</span>
                    <br />
                    <span className={styles.pillRelicVal} style={{ color: '#3cddc7' }}>
                      {def?.name ?? p.potionId}
                    </span>
                  </span>
                </span>
              );
            })}
          </div>
        </section>

        <div className={styles.logPanel} style={{ visibility: 'hidden' }} aria-hidden />
      </div>

      <footer className={styles.footer}>
        <button
          type="button"
          className={styles.skipButton}
          onClick={() => dispatchCommand({ type: 'TAKE_REWARD_GOLD', amount: skipGoldBase })}
        >
          放弃卡牌 · 换 {totalGoldOnSkip} 金
        </button>
        {upgradable.length > 0 ? (
          <button
            type="button"
            className={styles.ghostButton}
            aria-expanded={showUpgrade}
            onClick={() => setShowUpgrade((v) => !v)}
          >
            {showUpgrade ? '收起升级选项' : '改为升级一张已有卡'}
          </button>
        ) : null}
        {showUpgrade && upgradable.length > 0 ? (
          <div className={styles.upgradePanel}>
            <p className={styles.upgradeHint}>
              放弃本次卡牌奖励与金币，改为给已有的一张卡升级（+ 或 ++）。
            </p>
            <CardUpgradeList
              masterDeck={run.masterDeck}
              onUpgrade={(index) =>
                dispatchCommand({ type: 'TAKE_REWARD_UPGRADE_CARD', masterDeckIndex: index })
              }
              emptyText="当前牌组里没有可升级的卡。"
            />
          </div>
        ) : null}
      </footer>
    </div>
  );
}
