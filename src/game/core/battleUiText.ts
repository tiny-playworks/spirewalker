import { getStatusMeta, STATUS_MOMENTUM } from './definitions/statuses';
import type { MonsterIntent } from './model/battle';
import type { CardDefinition } from './model/card';

export function formatMonsterIntentText(intent: MonsterIntent | null | undefined): string {
  if (!intent) return '暂无意图';
  switch (intent.type) {
    case 'attack':
      return `攻击 ${intent.value}`;
    case 'block':
      return `防御 ${intent.value}`;
    case 'buff':
      return `获得 ${getStatusMeta(intent.statusId).name} ${intent.value}`;
    case 'debuff':
      return `施加 ${getStatusMeta(intent.statusId).name} ${intent.value}`;
    case 'reduce_status':
      return `削减 ${getStatusMeta(intent.statusId).name} ${intent.value}`;
    case 'punish_multi_play':
      return `连打惩罚：你本回合出牌 >= ${intent.threshold} 时，获得 ${intent.block} 格挡`;
    case 'attack_buff':
      return `攻击 ${intent.attack}，并获得 ${getStatusMeta(intent.statusId).name} ${intent.value}`;
    default:
      return '暂无意图';
  }
}

export function cardTypeLabel(type: CardDefinition['type']): string {
  switch (type) {
    case 'attack':
      return '攻击';
    case 'skill':
      return '技能';
    case 'power':
      return '能力';
    default:
      return type;
  }
}

export function cardTargetLabel(target: CardDefinition['target']): string {
  switch (target) {
    case 'single_enemy':
      return '单体敌人';
    case 'all_enemies':
      return '全体敌人';
    case 'self':
      return '自身';
    case 'none':
      return '无需目标';
    default:
      return target;
  }
}

export function buildCardKeywordHints(def: CardDefinition): string[] {
  const lines: string[] = [];
  for (const effect of def.effects) {
    if (effect.type === 'apply_status') {
      const meta = getStatusMeta(effect.statusId);
      lines.push(`${meta.name}：${meta.description}`);
    }
    if (effect.type === 'custom' && effect.scriptId === 'momentum_burst_damage') {
      lines.push('连势转伤害：主动消耗连势层数，换取更高伤害。');
    }
    if (effect.type === 'custom' && effect.scriptId === 'momentum_burst_draw') {
      lines.push('连势转过牌：主动消耗连势层数，换取更多抽牌。');
    }
    if (effect.type === 'gain_energy') {
      lines.push('能量：本回合可继续打出更多卡牌。');
    }
  }
  if (def.effects.some((effect) => effect.type === 'apply_status' && effect.statusId === STATUS_MOMENTUM)) {
    lines.push(`${getStatusMeta(STATUS_MOMENTUM).name}：${getStatusMeta(STATUS_MOMENTUM).description}`);
  }
  return [...new Set(lines)];
}
