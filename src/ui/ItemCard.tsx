import { ITEM_BY_ID, RARITY_LABELS } from '@/game/content';
import { rarityClass } from '@/game/rewards';
import type { RewardItem } from '@/game/types';

interface ItemCardProps {
  item: RewardItem;
  compact?: boolean;
  footer?: React.ReactNode;
}

export function ItemCard({ item, compact = false, footer }: ItemCardProps) {
  const definition = ITEM_BY_ID.get(item.definitionId);
  if (!definition) return null;
  return (
    <article className={`item-card ${rarityClass(item.rarity)} ${compact ? 'item-card-compact' : ''}`}>
      <div className="item-card-glow" />
      <div className="item-card-topline">
        <span className={`build-chip tag-${definition.tag}`}>{tagLabel(definition.tag)}</span>
        <span className="rarity-label">{RARITY_LABELS[item.rarity]}</span>
      </div>
      <div className={`item-glyph glyph-${definition.kind}`} aria-hidden="true">
        <span />
      </div>
      <h3>{definition.name}</h3>
      <p>{definition.description}</p>
      {item.rarity === 'legendary' ? <p className="legendary-rule">传奇：{legendaryRule(definition.tag)}</p> : null}
      {!compact ? <ItemStats item={item} /> : null}
      {footer ? <div className="item-card-actions">{footer}</div> : null}
    </article>
  );
}

function ItemStats({ item }: { item: RewardItem }) {
  const definition = ITEM_BY_ID.get(item.definitionId);
  if (!definition) return null;
  if (definition.kind === 'weapon') {
    return (
      <div className="stat-row">
        <span>伤害 {definition.damage}</span>
        <span>射速 {definition.fireRate.toFixed(1)}</span>
        <span>弹匣 {definition.magazine}</span>
      </div>
    );
  }
  if (definition.kind === 'muzzle') {
    return <div className="stat-row"><span>枪头模块</span><span>{moduleSummary(definition)}</span></div>;
  }
  if (definition.kind === 'core') {
    return <div className="stat-row"><span>核心模块</span><span>{tagLabel(definition.tag)}触发</span></div>;
  }
  return <div className="stat-row"><span>被动秘宝</span><span>最多装备 6 件</span></div>;
}

function moduleSummary(definition: { projectileCount?: number; pierce?: number; bounces?: number; explosionRadius?: number }): string {
  if (definition.projectileCount && definition.projectileCount > 1) return `${definition.projectileCount} 发`;
  if (definition.pierce) return `穿透 +${definition.pierce}`;
  if (definition.bounces) return `弹跳 +${definition.bounces}`;
  if (definition.explosionRadius) return `爆炸 ${definition.explosionRadius}`;
  return '弹道强化';
}

export function tagLabel(tag: string): string {
  if (tag === 'arc') return '电弧';
  if (tag === 'blast') return '爆破';
  if (tag === 'frost') return '霜晶';
  return '通用';
}

function legendaryRule(tag: string): string {
  if (tag === 'arc') return '连锁命中会生成第二条回路。';
  if (tag === 'blast') return '爆破击杀会让爆炸继续扩散。';
  if (tag === 'frost') return '冻结碎裂会向周围发射穿透晶片。';
  return '让当前武器路线获得对应的传奇规则。';
}
