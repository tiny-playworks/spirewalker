/** 与引擎结算一致的状态 id（可逐步对齐杀戮尖塔式数值） */
export const STATUS_STRENGTH = 'strength';
export const STATUS_WEAK = 'weak';
export const STATUS_VULNERABLE = 'vulnerable';
/** 连势：每次出牌后获得等同层数的格挡，并衰减 1 层。 */
export const STATUS_MOMENTUM = 'momentum';
/** 金属化：回合结束时获得等同层数的格挡。 */
export const STATUS_METALLICIZE = 'metallicize';
/** 稳势：本回合未主动消耗连势时，回合结束获得格挡并回 1 层连势。 */
export const STATUS_STEADY_GUARD = 'steady_guard';
/** 破势预热：下一次主动消耗连势时额外强化收益。 */
export const STATUS_PRIMED_BREAK = 'primed_break';

export interface StatusDefinitionMeta {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  battleHint: string;
}

export const STATUS_DEFINITIONS: Record<string, StatusDefinitionMeta> = {
  [STATUS_STRENGTH]: {
    id: STATUS_STRENGTH,
    name: '力量',
    shortLabel: '力',
    description: '提高攻击造成的伤害。',
    battleHint: '通常由卡牌或遗物获得；会直接提高攻击收益。',
  },
  [STATUS_WEAK]: {
    id: STATUS_WEAK,
    name: '虚弱',
    shortLabel: '弱',
    description: '降低攻击造成的伤害。',
    battleHint: '通常由敌人或卡牌施加；会在回合结束后逐步衰减。',
  },
  [STATUS_VULNERABLE]: {
    id: STATUS_VULNERABLE,
    name: '易伤',
    shortLabel: '易',
    description: '受到的攻击伤害提高。',
    battleHint: '通常由攻击牌或敌人施加；会在回合结束后逐步衰减。',
  },
  [STATUS_MOMENTUM]: {
    id: STATUS_MOMENTUM,
    name: '连势',
    shortLabel: '势',
    description: '每次出牌后获得等同当前层数的格挡，并自动衰减 1 层。',
    battleHint: '通常由蓄势牌和部分遗物获得；会被爆发牌主动消耗，也可能被敌人打断。',
  },
  [STATUS_METALLICIZE]: {
    id: STATUS_METALLICIZE,
    name: '金属化',
    shortLabel: '钢',
    description: '回合结束时获得等同层数的格挡。',
    battleHint: '通常通过持续类效果获得；会稳定提升防守。',
  },
  [STATUS_STEADY_GUARD]: {
    id: STATUS_STEADY_GUARD,
    name: '稳势',
    shortLabel: '稳',
    description: '回合结束时，若本回合未主动消耗连势，则获得 4 点格挡并回 1 层连势。',
    battleHint: '偏向保势路线；适合把连势留到下一回合继续滚动。',
  },
  [STATUS_PRIMED_BREAK]: {
    id: STATUS_PRIMED_BREAK,
    name: '破势预热',
    shortLabel: '破',
    description: '本回合下次主动消耗连势时额外强化收益，随后移除。',
    battleHint: '偏向兑现路线；适合把下一张消耗连势的牌做成爆发回合。',
  },
};

export function getStatusMeta(statusId: string): StatusDefinitionMeta {
  return (
    STATUS_DEFINITIONS[statusId] ?? {
      id: statusId,
      name: statusId,
      shortLabel: statusId.slice(0, 1).toUpperCase(),
      description: '未知状态。',
      battleHint: '当前版本还没有补充该状态的说明。',
    }
  );
}
