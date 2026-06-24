import { getCardArchetype } from '@/game/core/definitions/cards/archetypes';
import { ALL_CARD_DEFINITIONS } from '@/game/core/definitions/cards';
import type { MonsterIntent } from '@/game/core/model/battle';

/** 去掉升级后缀，升级版与基础卡共用同一张插画。 */
export function baseCardId(cardId: string): string {
  return cardId.replace(/\+*$/, '');
}

/** 核心卡独立插画路径（缺图时由 <CardArt> 自动回退到兜底图）。 */
export function getCardArtUrl(cardId: string): string {
  return `/assets/cards/art/${baseCardId(cardId)}.png`;
}

/** 按流派×类型的兜底插画路径，长尾卡或未出图时使用。 */
export function getCardArtFallbackUrl(cardId: string): string {
  const def = ALL_CARD_DEFINITIONS[cardId] ?? ALL_CARD_DEFINITIONS[baseCardId(cardId)];
  const archetype = getCardArchetype(cardId);
  const type = def?.type === 'attack' || def?.type === 'power' ? def.type : 'skill';
  return `/assets/cards/art_shared/${archetype}_${type}.png`;
}

export function getStatusIconUrl(statusId: string): string {
  return `/assets/combat/statuses/${statusId}.png`;
}

export type IntentCategory = 'attack' | 'defend' | 'buff' | 'debuff' | 'unknown';

export function intentCategory(intent: MonsterIntent | null | undefined): IntentCategory {
  if (!intent) return 'unknown';
  switch (intent.type) {
    case 'attack':
    case 'multi_hit':
    case 'heavy_charge':
    case 'leech':
    case 'death_burst':
    case 'thorns':
    case 'reactive':
    case 'attack_buff':
      return 'attack';
    case 'block':
    case 'punish_multi_play':
      return 'defend';
    case 'buff':
    case 'scale':
    case 'revive':
    case 'double_action':
    case 'heal':
    case 'copy_echo':
      return 'buff';
    case 'debuff':
    case 'reduce_status':
    case 'pollute_draw':
    case 'lock_hand':
    case 'draw_pressure':
    case 'max_hp_down':
    case 'summon':
    case 'split_on_death':
    case 'mechanic_reset':
      return 'debuff';
    default:
      return 'unknown';
  }
}

export function getIntentIconUrl(intent: MonsterIntent | null | undefined): string {
  return `/assets/combat/intents/${intentCategory(intent)}.png`;
}

/** 意图的紧凑数值文本，例如「12」「12 ×2」，用于图标旁的醒目读数。无明确数值则返回 null。 */
export function intentValueText(intent: MonsterIntent | null | undefined): string | null {
  if (!intent) return null;
  switch (intent.type) {
    case 'attack':
      return intent.hits && intent.hits > 1 ? `${intent.value} ×${intent.hits}` : `${intent.value}`;
    case 'multi_hit':
      return `${intent.value} ×${intent.hits}`;
    case 'heavy_charge':
      return `${intent.value}`;
    case 'block':
      return `${intent.value}`;
    case 'death_burst':
      return `${intent.damage}`;
    case 'thorns':
    case 'reactive':
      return `${intent.damage}`;
    case 'leech':
      return `${intent.attack}`;
    case 'attack_buff':
      return `${intent.attack}`;
    case 'buff':
    case 'debuff':
    case 'reduce_status':
    case 'scale':
    case 'draw_pressure':
    case 'max_hp_down':
    case 'heal':
      return `${intent.value}`;
    default:
      return null;
  }
}
