import { buildCardTooltipText } from '@/game/core/battleUiText';
import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import { POTION_DEFINITIONS } from '@/game/core/definitions/potions';
import { RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import { skipCardGoldAmount } from '@/game/core/engine/postBattleExtras';
import { rewardEncounterTierFromRun } from '@/game/core/engine/rewardEncounter';
import { useGameStore } from '@/game/store/gameStore';
import { sceneThemeClass } from '@/styles/sceneTheme.css';
import * as subscreenStyles from '@/styles/subscreen.css';

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function rewardTierLabel(t: ReturnType<typeof rewardEncounterTierFromRun>): string {
  if (t === 'boss') return 'Boss';
  if (t === 'elite') return '精英';
  if (t === 'treasure') return '宝箱';
  return '普通';
}

export function RewardPage() {
  const run = useGameStore((s) => s.run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);

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

  const relicItems = run.reward.items.filter((i): i is { type: 'relic'; relicId: string } => {
    return i.type === 'relic';
  });
  const potionItems = run.reward.items.filter((i): i is { type: 'potion'; potionId: string } => {
    return i.type === 'potion';
  });

  return (
    <div className={cx('boot', sceneThemeClass, subscreenStyles.screenRoot)} data-testid="reward-page">
      <h2 className={subscreenStyles.title}>
        {encounterTier === 'treasure' ? '宝箱' : '战后奖励'}
      </h2>
      <p className={subscreenStyles.tip}>
        Act <strong>{run.meta.act}</strong> · 本章第 <strong>{run.meta.actFloor}</strong> 层 · 全局第{' '}
        <strong>{run.meta.floor}</strong> 层
      </p>
      {relicItems.length > 0 ? (
        <div className={cx(subscreenStyles.banner, subscreenStyles.bannerTone.reward)}>
          {relicItems.map((r) => {
            const def = RELIC_DEFINITIONS[r.relicId];
            if (!def) return null;
            return (
              <p key={r.relicId} className={subscreenStyles.bannerLine}>
                <span className={cx(subscreenStyles.bannerTag, subscreenStyles.bannerTagTone.reward)}>遗物</span>
                <strong>{def.name}</strong> — {def.description}
              </p>
            );
          })}
        </div>
      ) : null}
      {potionItems.length > 0 ? (
        <div className={cx(subscreenStyles.banner, subscreenStyles.bannerTone.potion)}>
          {potionItems.map((p) => {
            const def = POTION_DEFINITIONS[p.potionId];
            if (!def) return null;
            return (
              <p key={p.potionId} className={subscreenStyles.bannerLine}>
                <span className={cx(subscreenStyles.bannerTag, subscreenStyles.bannerTagTone.potion)}>药水</span>
                <strong>{def.name}</strong> — {def.description}
                <span className={subscreenStyles.bannerNote}>（选牌或换金币后一并入包）</span>
              </p>
            );
          })}
        </div>
      ) : null}
      <p className={subscreenStyles.tip}>
        当前节点：
        <strong>
          {encounterTier === 'treasure'
            ? '宝箱'
            : `${rewardTierLabel(encounterTier)}战`}
        </strong>
        。选一张加入牌组，领取时金币 <strong>+{totalGoldOnPick}</strong>
        {bonusGold > 0 ? (
          <>
            {' '}
            （本次奖励额外 +{bonusGold}）
          </>
        ) : (
          <>（这次没有额外金币条目）</>
        )}
        。
        {potionItems.length > 0 ? (
          <> 若有药水，会与卡牌奖励同时结算。</>
        ) : encounterTier === 'normal' ? (
          <> 普通战药水掉率已压低，本次未触发额外掉落。</>
        ) : encounterTier === 'treasure' ? (
          <> 宝箱仍有机会额外掉药，但不会像旧版那样过于稳定。</>
        ) : null}
      </p>
      <ul className={subscreenStyles.choiceList}>
        {cards.map((defId, index) => {
          const def = CARD_DEFINITIONS[defId];
          if (!def) return null;
          return (
            <li key={`${index}-${defId}`}>
              <button
                type="button"
                className={subscreenStyles.choiceButton}
                title={buildCardTooltipText(def)}
                onClick={() => dispatchCommand({ type: 'SELECT_REWARD_CARD', definitionId: defId })}
              >
                <strong>{def.name}</strong>
                <span className={subscreenStyles.choiceDesc}>
                  {def.type === 'attack' ? '攻击' : def.type === 'skill' ? '技能' : '能力'} · {def.cost} 费
                </span>
                <span className={subscreenStyles.choiceDesc}>{def.description}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className={subscreenStyles.skipSection}>
        <p className={subscreenStyles.skipLabel}>不加入牌组</p>
        <button
          type="button"
          className={subscreenStyles.skipButton}
          onClick={() =>
            dispatchCommand({ type: 'TAKE_REWARD_GOLD', amount: skipGoldBase })
          }
        >
          换成金币 <strong>+{totalGoldOnSkip}</strong>
          {bonusGold > 0 ? (
            <span className={subscreenStyles.choiceDesc}>
              （放弃卡牌 {skipGoldBase}，另含节点额外 +{bonusGold}）
            </span>
          ) : (
            <span className={subscreenStyles.choiceDesc}>（放弃卡牌，换取 {skipGoldBase} 金）</span>
          )}
        </button>
      </div>
    </div>
  );
}
