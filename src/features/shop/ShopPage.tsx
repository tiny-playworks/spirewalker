import { useState } from 'react';
import {
  ArrowUpCircle,
  BookOpen,
  Coins,
  FlaskConical,
  Gem,
  Info,
  LogOut,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { buildCardTooltipText } from '@/game/core/battleUiText';
import { CARD_DEFINITIONS } from '@/game/core/definitions/cards';
import { getCardArchetype } from '@/game/core/definitions/cards/archetypes';
import { MAX_POTIONS, POTION_DEFINITIONS } from '@/game/core/definitions/potions';
import { RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import { SHOP_MIN_MASTER_DECK_SIZE } from '@/game/core/engine/generateShop';
import type { CardType } from '@/game/core/model/card';
import { useGameStore } from '@/game/store/gameStore';
import { selectShopRunState } from '@/game/store/selectors/shopSelectors';
import { RunSceneHeader, RunSceneShell } from '@/features/run-scene/RunSceneShell';
import { CardArtwork } from '@/features/cards/CardArtwork';
import { baseCardId } from '@/features/battle/combatAssets';
import { ArchetypeDot } from '../cards/ArchetypeDot';
import { CardUpgradeList } from '../cards/CardUpgradeList';
import * as styles from './shopPage.css';

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

type TypeTone = 'attack' | 'skill' | 'power' | 'neutral';

function typeTone(type: CardType): TypeTone {
  return type === 'attack' ? 'attack' : type === 'skill' ? 'skill' : type === 'power' ? 'power' : 'neutral';
}

function typeLabel(type: CardType): string {
  return type === 'attack' ? '攻击' : type === 'skill' ? '技能' : type === 'power' ? '能力' : '特殊';
}

function deckUniqueCounts(deck: string[]): { definitionId: string; count: number }[] {
  const m = new Map<string, number>();
  for (const id of deck) m.set(id, (m.get(id) ?? 0) + 1);
  return Array.from(m.entries())
    .map(([definitionId, count]) => ({ definitionId, count }))
    .sort((a, b) => a.definitionId.localeCompare(b.definitionId));
}

export function ShopPage() {
  const run = useGameStore((s) => s.run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);
  const shopState = selectShopRunState(run);
  const [ritual, setRitual] = useState<'upgrade' | 'remove' | null>(null);

  if (!run || !shopState) return null;
  const { meta, shop, masterDeck, canRemove } = shopState;
  const deckRows = deckUniqueCounts(masterDeck);
  const relics = shop.relics ?? [];
  const potions = shop.potions ?? [];
  const canUpgrade = typeof shop.upgradePrice === 'number' && shop.upgradePrice > 0;
  const hpPct = Math.max(0, Math.min(100, (run.player.currentHp / run.player.maxHp) * 100));

  return (
    <RunSceneShell tone="shop" className={styles.page} testId="shop-page">
      <RunSceneHeader title="虚空收藏者" eyebrow="行商节点" />

      <div className={styles.body}>
        {/* 商人立绘 */}
        <aside
          className={styles.merchant}
          style={{
            background: "linear-gradient(to top, rgba(6,6,9,.98) 4%, rgba(6,6,9,.08) 62%), url('/assets/scenes/shop-collector.webp') center 24% / cover no-repeat, #0b0b0e",
          }}
        >
          <span className={styles.merchantRune} aria-hidden>
            ◈
          </span>
          <span className={styles.merchantFade} aria-hidden />
          <div className={styles.merchantInfo}>
            <h2 className={styles.merchantName}>虚空收藏者</h2>
            <p className={styles.merchantQuote}>“来自深渊的零碎……力量自有其代价。今天你愿意拿什么来换，旅人？”</p>
            <span className={styles.merchantNote}>
              <Info className={styles.noteIcon} aria-hidden />
              第 {meta.act} 章 · 第 {meta.actFloor} 层
            </span>
          </div>
        </aside>

        {/* 商品区 */}
        <section className={styles.goods}>
          <h3 className={styles.sectionHead}>
            <BookOpen className={styles.sectionIcon} aria-hidden />
            禁忌知识
          </h3>
          <div className={styles.cardGrid}>
            {shop.cards.map((o) => {
              const def = CARD_DEFINITIONS[o.definitionId];
              const canBuy = meta.gold >= o.price;
              const ownedCount = masterDeck.filter(
                (cardId) => baseCardId(cardId) === baseCardId(o.definitionId),
              ).length;
              const archetype = getCardArchetype(o.definitionId);
              const sameArchetypeCount = masterDeck.filter(
                (cardId) => getCardArchetype(cardId) === archetype,
              ).length;
              return (
                <button
                  key={o.definitionId}
                  type="button"
                  className={cx(styles.cardTile, styles.cardOffer)}
                  title={def ? buildCardTooltipText(def) : o.definitionId}
                  disabled={!canBuy}
                  onClick={() => dispatchCommand({ type: 'BUY_SHOP_CARD', definitionId: o.definitionId })}
                >
                  <span className={styles.tileArt} aria-hidden>
                    <CardArtwork
                      cardId={o.definitionId}
                      className={styles.tileArtImage}
                      fallback={<span className={styles.tileArtFallback} />}
                    />
                    <span className={styles.tileArtShade} />
                  </span>
                  <span className={styles.tileBody}>
                    <span className={styles.tileName}>
                      <ArchetypeDot cardId={o.definitionId} />
                      {def?.name ?? o.definitionId}
                    </span>
                    {def ? (
                      <span className={cx(styles.tileType, styles.tileTypeTone[typeTone(def.type)])}>
                        {typeLabel(def.type)} · {def.cost} 费
                      </span>
                    ) : null}
                    <span className={styles.tileDesc}>{def?.description ?? ''}</span>
                    <span className={styles.tileSignals}>
                      <small>同名 {ownedCount}</small>
                      <small>同流派 {sameArchetypeCount}</small>
                    </span>
                    <span className={cx(styles.tilePrice, !canBuy && styles.tilePriceTooHigh)}>
                      <Coins className={styles.priceIcon} aria-hidden />
                      {o.price}
                      {!canBuy ? <small className={styles.priceReason}>还差 {o.price - meta.gold} 金</small> : null}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {relics.length > 0 ? (
            <>
              <h3 className={styles.sectionHead}>
                <Gem className={styles.sectionIcon} aria-hidden />
                古代造物
              </h3>
              <div className={styles.relicGrid}>
                {relics.map((o) => {
                  const def = RELIC_DEFINITIONS[o.relicId];
                  const canBuy = meta.gold >= o.price;
                  return (
                    <button
                      key={o.relicId}
                      type="button"
                      className={styles.cardTile}
                      title={def ? `${def.name}\n${def.description}` : o.relicId}
                      disabled={!canBuy}
                      onClick={() => dispatchCommand({ type: 'BUY_SHOP_RELIC', relicId: o.relicId })}
                    >
                      <span className={styles.tileName}>
                        <ArchetypeDot relicId={o.relicId} />
                        {def?.name ?? o.relicId}
                      </span>
                      <span className={styles.tileDesc}>{def?.description ?? ''}</span>
                      <span className={cx(styles.tilePrice, !canBuy && styles.tilePriceTooHigh)}>
                        <Coins className={styles.priceIcon} aria-hidden />
                        {o.price}
                        {!canBuy ? <small className={styles.priceReason}>还差 {o.price - meta.gold} 金</small> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}

          {potions.length > 0 ? (
            <>
              <h3 className={styles.sectionHead}>
                <FlaskConical className={styles.sectionIcon} aria-hidden />
                灵药
              </h3>
              <div className={styles.relicGrid}>
                {potions.map((o) => {
                  const def = POTION_DEFINITIONS[o.potionId];
                  const hasSpace = meta.potions.length < MAX_POTIONS;
                  const canBuy = meta.gold >= o.price && hasSpace;
                  return (
                    <button
                      key={o.potionId}
                      type="button"
                      className={styles.cardTile}
                      title={def ? `${def.name}\n${def.description}` : o.potionId}
                      disabled={!canBuy}
                      onClick={() => dispatchCommand({ type: 'BUY_SHOP_POTION', potionId: o.potionId })}
                    >
                      <span className={styles.tileName}>{def?.name ?? o.potionId}</span>
                      <span className={styles.tileDesc}>{def?.description ?? ''}</span>
                      <span className={cx(styles.tilePrice, !canBuy && styles.tilePriceTooHigh)}>
                        <Coins className={styles.priceIcon} aria-hidden />
                        {o.price}
                        {!canBuy ? (
                          <small className={styles.priceReason}>
                            {hasSpace ? `还差 ${o.price - meta.gold} 金` : '药水栏已满'}
                          </small>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}

          {/* 禁忌仪式：升级 / 删牌 */}
          <h3 className={styles.sectionHead}>
            <Sparkles className={styles.sectionIcon} aria-hidden />
            禁忌仪式
          </h3>
          <div className={styles.ritualRow}>
            {canUpgrade ? (
              <button
                type="button"
                className={cx(styles.ritualButton, ritual === 'upgrade' && styles.ritualButtonActive)}
                aria-expanded={ritual === 'upgrade'}
                onClick={() => setRitual((r) => (r === 'upgrade' ? null : 'upgrade'))}
              >
                <span className={cx(styles.ritualIconWrap, styles.ritualIconEnhance)}>
                  <ArrowUpCircle className={styles.ritualIcon} aria-hidden />
                </span>
                <span className={styles.ritualLabel}>升级一张卡</span>
                <span className={styles.ritualPrice}>{shop.upgradePrice} 金 · 限一次</span>
              </button>
            ) : null}
            <button
              type="button"
              className={cx(styles.ritualButton, ritual === 'remove' && styles.ritualButtonActive)}
              aria-expanded={ritual === 'remove'}
              onClick={() => setRitual((r) => (r === 'remove' ? null : 'remove'))}
            >
              <span className={cx(styles.ritualIconWrap, styles.ritualIconPurge)}>
                <Trash2 className={styles.ritualIcon} aria-hidden />
              </span>
              <span className={styles.ritualLabel}>移除一张卡</span>
              <span className={styles.ritualPrice}>{shop.removeCardPrice} 金 / 张</span>
            </button>
          </div>

          {ritual === 'upgrade' && canUpgrade ? (
            <div className={styles.ritualPanel}>
              <p className={styles.ritualHint}>
                同一家商店只能升级 1 次；升级后的卡名会追加 <strong>+</strong> 或 <strong>++</strong> 徽章。
              </p>
              <CardUpgradeList
                masterDeck={masterDeck}
                disabled={meta.gold < (shop.upgradePrice ?? 0)}
                onUpgrade={(index) =>
                  dispatchCommand({ type: 'BUY_SHOP_UPGRADE_CARD', masterDeckIndex: index })
                }
                emptyText="没有卡可升级。"
              />
            </div>
          ) : null}

          {ritual === 'remove' ? (
            <div className={styles.ritualPanel}>
              <p className={styles.ritualHint}>
                删牌偏贵，只在真想收紧构筑时使用；牌组不少于 {SHOP_MIN_MASTER_DECK_SIZE} 张才能继续移除。
              </p>
              <ul className={styles.removeList}>
                {deckRows.map((row) => {
                  const def = CARD_DEFINITIONS[row.definitionId];
                  const canPay = meta.gold >= shop.removeCardPrice;
                  const enabled = canRemove && canPay && row.count > 0;
                  return (
                    <li key={row.definitionId}>
                      <button
                        type="button"
                        className={styles.removeItem}
                        title={def ? buildCardTooltipText(def) : row.definitionId}
                        disabled={!enabled}
                        onClick={() =>
                          dispatchCommand({
                            type: 'BUY_SHOP_REMOVE_CARD',
                            definitionId: row.definitionId,
                          })
                        }
                      >
                        <ArchetypeDot cardId={row.definitionId} />
                        {def?.name ?? row.definitionId} ×{row.count}
                        <span className={styles.removePrice}>{shop.removeCardPrice} 金</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </section>

        {/* 右栏：财富 / 状态 / 遗物 / 离开 */}
        <aside className={styles.rail}>
          <div className={cx(styles.railPanel, styles.railPanelWealth)}>
            <p className={styles.railLabel}>当前财富</p>
            <span className={styles.wealthValue}>
              <Coins className={styles.wealthIcon} aria-hidden />
              {meta.gold}
            </span>
          </div>

          <div className={styles.railPanel}>
            <p className={styles.railLabel}>躯壳状态</p>
            <div className={styles.railRow}>
              <span>生命</span>
              <span>
                {run.player.currentHp}/{run.player.maxHp}
              </span>
            </div>
            <div className={styles.hpBar}>
              <span className={styles.hpFill} style={{ width: `${hpPct}%` }} />
            </div>
            <div className={styles.railRow} style={{ marginTop: '0.5rem' }}>
              <span>药水栏</span>
              <span>
                {meta.potions.length}/{MAX_POTIONS}
              </span>
            </div>
          </div>

          <div className={styles.railPanel}>
            <p className={styles.railLabel}>持有遗物 · {meta.relics.length}</p>
            {meta.relics.length > 0 ? (
              <div className={styles.relicChips}>
                {meta.relics.map((id) => {
                  const def = RELIC_DEFINITIONS[id];
                  return (
                    <span key={id} className={styles.relicChip} title={def ? `${def.name}\n${def.description}` : id}>
                      {(def?.name ?? id).slice(0, 1)}
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className={styles.railEmpty}>尚无遗物。</p>
            )}
          </div>

          <button
            type="button"
            className={styles.leaveButton}
            onClick={() => dispatchCommand({ type: 'LEAVE_SHOP_TO_MAP' })}
          >
            <LogOut className={styles.leaveIcon} aria-hidden />
            离开商店
          </button>
        </aside>
      </div>
    </RunSceneShell>
  );
}
