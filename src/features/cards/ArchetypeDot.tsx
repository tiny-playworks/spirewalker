import {
  ARCHETYPE_DISPLAY,
  getArchetypeDisplay,
  getRelicArchetypeDisplay,
  type ArchetypeDisplayMeta,
  type CardArchetype,
} from '@/game/core/definitions/cards/archetypes';

interface Props {
  cardId?: string;
  relicId?: string;
  archetype?: CardArchetype;
  /** 当流派为 `neutral` 时是否仍渲染灰色小点。默认 false，视觉更干净。 */
  showNeutral?: boolean;
}

function resolveMeta(props: Props): ArchetypeDisplayMeta | null {
  if (props.cardId !== undefined) return getArchetypeDisplay(props.cardId);
  if (props.relicId !== undefined) return getRelicArchetypeDisplay(props.relicId);
  if (props.archetype !== undefined) return ARCHETYPE_DISPLAY[props.archetype];
  return null;
}

/**
 * 牌名 / 遗物名左侧的小流派圆点：守=蓝、爆=红、混=紫、通用=灰。
 *
 * 对应创始人反馈 #8 的 UI 侧落地：玩家一眼就能看出当前条目偏哪派。
 * 商店 / 奖励 / 总览 / 升级对照列表共用同一组件，见 `cardId` / `relicId` 重载。
 */
export function ArchetypeDot(props: Props) {
  const meta = resolveMeta(props);
  if (!meta) return null;
  if (meta.id === 'neutral' && !props.showNeutral) return null;
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
