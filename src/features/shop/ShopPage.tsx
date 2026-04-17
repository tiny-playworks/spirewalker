import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import { RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import { SHOP_MIN_MASTER_DECK_SIZE } from '@/game/core/engine/generateShop';
import { MAX_POTIONS, POTION_DEFINITIONS } from '@/game/core/definitions/potions';
import { useGameStore } from '@/game/store/gameStore';

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

  if (!run || run.screen.type !== 'shop' || !run.shop) return null;

  const { meta, shop, masterDeck } = run;
  const canRemove = masterDeck.length > SHOP_MIN_MASTER_DECK_SIZE;
  const deckRows = deckUniqueCounts(masterDeck);

  return (
    <div className="boot shop-page">
      <h2 className="subscreen-title">商店</h2>
      <p className="subscreen-tip">
        金币 <strong>{meta.gold}</strong> · 药水栏 {meta.potions.length}/{MAX_POTIONS} · 牌组{' '}
        <strong>{masterDeck.length}</strong> 张（删牌后不少于 {SHOP_MIN_MASTER_DECK_SIZE} 张）
      </p>
      <h3 className="shop-section-title">卡牌</h3>
      <ul className="shop-list">
        {shop.cards.map((o) => {
          const def = CARD_DEFINITIONS[o.definitionId];
          const canBuy = meta.gold >= o.price;
          return (
            <li key={o.definitionId}>
              <button
                type="button"
                className="shop-buy-btn"
                disabled={!canBuy}
                onClick={() => dispatchCommand({ type: 'BUY_SHOP_CARD', definitionId: o.definitionId })}
              >
                {def?.name ?? o.definitionId} — {o.price} 金
              </button>
            </li>
          );
        })}
      </ul>
      {(shop.relics ?? []).length > 0 ? (
        <>
          <h3 className="shop-section-title">遗物</h3>
          <ul className="shop-list">
            {(shop.relics ?? []).map((o) => {
              const def = RELIC_DEFINITIONS[o.relicId];
              const canBuy = meta.gold >= o.price;
              return (
                <li key={o.relicId}>
                  <button
                    type="button"
                    className="shop-buy-btn"
                    title={def?.description}
                    disabled={!canBuy}
                    onClick={() => dispatchCommand({ type: 'BUY_SHOP_RELIC', relicId: o.relicId })}
                  >
                    {def?.name ?? o.relicId} — {o.price} 金
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
      {(shop.potions ?? []).length > 0 ? (
        <>
          <h3 className="shop-section-title">药水</h3>
          <ul className="shop-list">
            {(shop.potions ?? []).map((o) => {
              const def = POTION_DEFINITIONS[o.potionId];
              const canBuy = meta.gold >= o.price && meta.potions.length < MAX_POTIONS;
              return (
                <li key={o.potionId}>
                  <button
                    type="button"
                    className="shop-buy-btn"
                    disabled={!canBuy}
                    onClick={() =>
                      dispatchCommand({ type: 'BUY_SHOP_POTION', potionId: o.potionId })
                    }
                  >
                    {def?.name ?? o.potionId} — {o.price} 金
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
      <h3 className="shop-section-title">删牌（每次 {shop.removeCardPrice} 金）</h3>
      <p className="shop-remove-hint">
        从牌组移除一张同名副本，便于精简循环；牌组过短无法继续删除。
      </p>
      <ul className="shop-list shop-remove-list">
        {deckRows.map((row) => {
          const def = CARD_DEFINITIONS[row.definitionId];
          const canPay = meta.gold >= shop.removeCardPrice;
          const enabled = canRemove && canPay && row.count > 0;
          return (
            <li key={row.definitionId}>
              <button
                type="button"
                className="shop-buy-btn"
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
        className="btn-end-turn subscreen-leave"
        onClick={() => dispatchCommand({ type: 'LEAVE_SHOP_TO_MAP' })}
      >
        离开商店
      </button>
    </div>
  );
}
