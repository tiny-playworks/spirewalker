import { getStatusMeta, STATUS_MOMENTUM } from './definitions/statuses';
import type { PressureProfile } from './definitions/encounters';
import type { MonsterIntent } from './model/battle';
import type { CardDefinition } from './model/card';

export function formatMonsterIntentText(intent: MonsterIntent | null | undefined): string {
  if (!intent) return '暂无意图';
  switch (intent.type) {
    case 'attack':
      return `攻击 ${intent.value}`;
    case 'multi_hit':
      return `连击 ${intent.value} x${intent.hits}`;
    case 'heavy_charge':
      return `重击 ${intent.value}`;
    case 'block':
      return `防御 ${intent.value}`;
    case 'buff':
      return `获得 ${getStatusMeta(intent.statusId).name} ${intent.value}`;
    case 'scale':
      return `成长 ${intent.stat} ${intent.value}`;
    case 'debuff':
      return `施加 ${getStatusMeta(intent.statusId).name} ${intent.value}`;
    case 'reduce_status':
      return `削减 ${getStatusMeta(intent.statusId).name} ${intent.value}`;
    case 'summon':
      return `召唤 ${intent.count} 个援军`;
    case 'split_on_death':
      return `死亡后分裂`;
    case 'death_burst':
      return `死亡时爆炸 ${intent.damage}`;
    case 'revive':
      return `复活 ${intent.charges} 次`;
    case 'thorns':
      return `反刺 ${intent.damage}`;
    case 'reactive':
      return `反制 ${intent.damage}`;
    case 'counter':
      return `反击阈值 ${intent.threshold}`;
    case 'pollute_draw':
      return `污染 ${intent.count} 张`;
    case 'lock_hand':
      return `锁定 ${intent.count} 张手牌`;
    case 'draw_pressure':
      return `压制抽牌 ${intent.value}`;
    case 'heal':
      return `治疗 ${intent.value}`;
    case 'leech':
      return `吸取 ${intent.attack}`;
    case 'countdown':
      return `倒计时 ${intent.turns}`;
    case 'double_action':
      return `额外行动 ${intent.times}`;
    case 'phase_shift':
      return `切换阶段 ${intent.label}`;
    case 'max_hp_down':
      return `压低上限 ${intent.value}`;
    case 'mechanic_reset':
      return `重置 ${intent.mode}`;
    case 'copy_echo':
      return '复制场面';
    case 'punish_multi_play':
      return `连打惩罚：你本回合出牌 >= ${intent.threshold} 时，获得 ${intent.block} 格挡`;
    case 'attack_buff':
      return `攻击 ${intent.attack}，并获得 ${getStatusMeta(intent.statusId).name} ${intent.value}`;
    default:
      return '暂无意图';
  }
}

export function pressureProfileLabel(profile: PressureProfile): string {
  switch (profile) {
    case 'frontload':
      return '前压';
    case 'attrition':
      return '消耗';
    case 'snowball':
      return '滚雪球';
    case 'disruption':
      return '干扰';
    case 'execution_check':
      return '爆发检定';
    default:
      return profile;
  }
}

export function pressureProfileHint(profile: PressureProfile): string {
  switch (profile) {
    case 'frontload':
      return '开场就会给压力，前两回合别太贪。';
    case 'attrition':
      return '拖回合会越来越亏，注意持续损耗。';
    case 'snowball':
      return '若不尽快处理，敌方会越打越强。';
    case 'disruption':
      return '会打断你的连势或手牌节奏。';
    case 'execution_check':
      return '会给出明确危险窗口，需要及时解题。';
    default:
      return '';
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
    if (effect.type === 'custom' && effect.scriptId === 'momentum_guard_by_stacks') {
      lines.push('借势成防：按当前连势层数获得格挡，不消耗连势。');
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

export function buildCardTooltipText(def: CardDefinition): string {
  const parts = [
    `${def.name}`,
    `${cardTypeLabel(def.type)} · ${cardTargetLabel(def.target)} · ${def.cost} 费`,
    def.description,
  ];
  const hints = buildCardKeywordHints(def);
  if (hints.length > 0) {
    parts.push(hints.join('\n'));
  }
  return parts.join('\n');
}
