import { getArchetypeDisplay } from '@/game/core/definitions/cards/archetypes';

interface Props {
  cardId: string;
  /** 当牌的流派为 `neutral` 时是否仍渲染灰色小点。默认 false，视觉上更干净。 */
  showNeutral?: boolean;
}

/**
 * 牌名左侧的小流派圆点：守=蓝、爆=红、混=紫、通用=灰。
 *
 * 对应创始人反馈 #8 的 UI 侧落地：玩家一眼就能看出这张牌偏哪个流派，
 * 商店 / 奖励 / 总览 / 升级对照列表都用同一个组件，避免散落多套样式。
 */
export function ArchetypeDot({ cardId, showNeutral = false }: Props) {
  const meta = getArchetypeDisplay(cardId);
  if (meta.id === 'neutral' && !showNeutral) return null;
  return (
    <span
      aria-label={`${meta.name}流派`}
      title={`${meta.name}流派`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 14,
        height: 14,
        marginRight: 6,
        borderRadius: '50%',
        background: meta.color,
        color: '#1a1814',
        fontSize: 9,
        fontWeight: 700,
        lineHeight: '14px',
        verticalAlign: 'middle',
      }}
    >
      {meta.shortLabel}
    </span>
  );
}
