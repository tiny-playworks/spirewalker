/**
 * 升级卡选择面板：显示 masterDeck 中所有可升级的卡（before -> after 对比）。
 *
 * 用于商店升级服务与战后奖励「改为升级一张卡」入口。
 */
import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import {
  canUpgradeCardId,
  nextUpgradedId,
  parseCardId,
} from '@/game/core/definitions/cards/upgradeRules';
import { ArchetypeDot } from '@/features/cards/ArchetypeDot';
import * as subscreenStyles from '@/styles/subscreen.css';

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export interface CardUpgradeListProps {
  masterDeck: string[];
  /** 提交升级时接收 masterDeck 下标 */
  onUpgrade: (masterDeckIndex: number) => void;
  disabled?: boolean;
  /** 外层标题；未传则不渲染标题 */
  title?: string;
  /** 空态提示文案 */
  emptyText?: string;
}

export function CardUpgradeList({ masterDeck, onUpgrade, disabled, title, emptyText }: CardUpgradeListProps) {
  const entries = masterDeck
    .map((id, index) => ({ id, index }))
    .filter((entry) => canUpgradeCardId(entry.id));

  return (
    <div>
      {title ? <h3 className={subscreenStyles.sectionTitle}>{title}</h3> : null}
      {entries.length === 0 ? (
        <p className={subscreenStyles.tip}>{emptyText ?? '当前牌组里没有可升级的卡。'}</p>
      ) : (
        <ul className={subscreenStyles.sectionList}>
          {entries.map(({ id, index }) => {
            const currentDef = CARD_DEFINITIONS[id];
            const nextId = nextUpgradedId(id);
            const nextDef = nextId ? CARD_DEFINITIONS[nextId] : undefined;
            if (!currentDef || !nextDef) return null;
            const { level } = parseCardId(id);
            const badge = level === 0 ? '+' : '++';
            return (
              <li key={`${index}-${id}`}>
                <button
                  type="button"
                  className={subscreenStyles.compactChoiceButton}
                  disabled={disabled}
                  onClick={() => onUpgrade(index)}
                >
                  <strong>
                    <ArchetypeDot cardId={id} />
                    {currentDef.name} → {nextDef.name}
                    <span className={subscreenStyles.choiceDesc}> 升级徽章：{badge}</span>
                  </strong>
                  <span className={subscreenStyles.choiceDesc}>
                    之前：{currentDef.description}
                  </span>
                  <span className={cx(subscreenStyles.choiceDesc)}>
                    之后：{nextDef.description}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
