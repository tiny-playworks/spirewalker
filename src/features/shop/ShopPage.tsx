import { buildCardTooltipText } from '@/game/core/battleUiText';
import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import { RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import { SHOP_MIN_MASTER_DECK_SIZE } from '@/game/core/engine/generateShop';
import { MAX_POTIONS, POTION_DEFINITIONS } from '@/game/core/definitions/potions';
import { useGameStore } from '@/game/store/gameStore';
import { selectShopRunState } from '@/game/store/selectors/shopSelectors';
import { sceneThemeClass } from '@/styles/sceneTheme.css';
import * as subscreenStyles from '@/styles/subscreen.css';

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
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
  if (!shopState) return null;
  const { meta, shop, masterDeck, canRemove } = shopState;
  const deckRows = deckUniqueCounts(masterDeck);

  return (
    <div
      className={cx('boot', sceneThemeClass, subscreenStyles.screenRoot, subscreenStyles.screenWidth.wide)}
      data-testid="shop-page"
    >
      <h2 className={subscreenStyles.title}>商店</h2>
      <p className={subscreenStyles.tip}>
        金币 <strong>{meta.gold}</strong> · 药水栏 {meta.potions.length}/{MAX_POTIONS} · 牌组{' '}
        <strong>{masterDeck.length}</strong> 张（删牌后不少于 {SHOP_MIN_MASTER_DECK_SIZE} 张）
      </p>
      <h3 className={subscreenStyles.sectionTitle}>卡牌</h3>
      <ul className={subscreenStyles.sectionList}>
        {shop.cards.map((o) => {
          const def = CARD_DEFINITIONS[o.definitionId];
          const canBuy = meta.gold >= o.price;
          return (
            <li key={o.definitionId}>
              <button
                type="button"
                className={subscreenStyles.compactChoiceButton}
                title={def ? buildCardTooltipText(def) : o.definitionId}
                disabled={!canBuy}
                onClick={() => dispatchCommand({ type: 'BUY_SHOP_CARD', definitionId: o.definitionId })}
              >
                {def?.name ?? o.definitionId} — {o.price} 金
                <span className={subscreenStyles.choiceDesc}>
                  {def ? `${def.type === 'attack' ? '攻击' : def.type === 'skill' ? '技能' : '能力'} · ${def.cost} 费` : ''}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {(shop.relics ?? []).length > 0 ? (
        <>
          <h3 className={subscreenStyles.sectionTitle}>遗物</h3>
          <ul className={subscreenStyles.sectionList}>
            {(shop.relics ?? []).map((o) => {
              const def = RELIC_DEFINITIONS[o.relicId];
              const canBuy = meta.gold >= o.price;
              return (
                <li key={o.relicId}>
                  <button
                    type="button"
                    className={subscreenStyles.compactChoiceButton}
                    title={def ? `${def.name}\n${def.description}` : o.relicId}
                    disabled={!canBuy}
                    onClick={() => dispatchCommand({ type: 'BUY_SHOP_RELIC', relicId: o.relicId })}
                  >
                    {def?.name ?? o.relicId} — {o.price} 金
                    <span className={subscreenStyles.choiceDesc}>{def?.description ?? ''}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
      {(shop.potions ?? []).length > 0 ? (
        <>
          <h3 className={subscreenStyles.sectionTitle}>药水</h3>
          <ul className={subscreenStyles.sectionList}>
            {(shop.potions ?? []).map((o) => {
              const def = POTION_DEFINITIONS[o.potionId];
              const canBuy = meta.gold >= o.price && meta.potions.length < MAX_POTIONS;
              return (
                <li key={o.potionId}>
                  <button
                    type="button"
                    className={subscreenStyles.compactChoiceButton}
                    title={def ? `${def.name}\n${def.description}` : o.potionId}
                    disabled={!canBuy}
                    onClick={() =>
                      dispatchCommand({ type: 'BUY_SHOP_POTION', potionId: o.potionId })
                    }
                  >
                    {def?.name ?? o.potionId} — {o.price} 金
                    <span className={subscreenStyles.choiceDesc}>{def?.description ?? ''}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
      <h3 className={subscreenStyles.sectionTitle}>删牌（每次 {shop.removeCardPrice} 金）</h3>
      <p className={subscreenStyles.removeHint}>
        从牌组移除一张同名副本，便于精简循环；牌组过短无法继续删除。
      </p>
      <ul className={cx(subscreenStyles.sectionList, subscreenStyles.removeList)}>
        {deckRows.map((row) => {
          const def = CARD_DEFINITIONS[row.definitionId];
          const canPay = meta.gold >= shop.removeCardPrice;
          const enabled = canRemove && canPay && row.count > 0;
          return (
            <li key={row.definitionId}>
              <button
                type="button"
                className={subscreenStyles.compactChoiceButton}
                title={def ? buildCardTooltipText(def) : row.definitionId}
                disabled={!enabled}
                onClick={() =>
                  dispatchCommand({
                    type: 'BUY_SHOP_REMOVE_CARD',
                    definitionId: row.definitionId,
                  })
                }
              >
                移除 1 张 {def?.name ?? row.definitionId}（牌组中共 {row.count} 张）—{' '}
                {shop.removeCardPrice} 金
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className={cx(
          subscreenStyles.actionButton,
          subscreenStyles.actionButtonTone.primary,
          subscreenStyles.leaveButton,
        )}
        onClick={() => dispatchCommand({ type: 'LEAVE_SHOP_TO_MAP' })}
      >
        离开商店
      </button>
    </div>
  );
}
