import { CARD_DEFINITIONS } from '../definitions/cards';
import { POTION_DEFINITIONS } from '../definitions/potions';
import { RELIC_DEFINITIONS } from '../definitions/relics';
import type { GameCommand } from '../commands/types';
import type { RunState } from '../model/run';

export function buildCommandNotice(command: GameCommand, before: RunState, after: RunState): string | null {
  const goldDelta = after.meta.gold - before.meta.gold;
  const hpDelta = after.player.currentHp - before.player.currentHp;
  if (command.type === 'BUY_SHOP_CARD' && after.masterDeck.length > before.masterDeck.length) {
    return `已购入「${CARD_DEFINITIONS[command.definitionId]?.name ?? command.definitionId}」 · ${Math.abs(goldDelta)} 金`;
  }
  if (command.type === 'BUY_SHOP_RELIC' && after.meta.relics.length > before.meta.relics.length) {
    return `已获得遗物「${RELIC_DEFINITIONS[command.relicId]?.name ?? command.relicId}」 · 效果立即生效`;
  }
  if (command.type === 'BUY_SHOP_POTION' && after.meta.potions.length > before.meta.potions.length) {
    return `已购入「${POTION_DEFINITIONS[command.potionId]?.name ?? command.potionId}」`;
  }
  if (command.type === 'BUY_SHOP_REMOVE_CARD' && after.masterDeck.length < before.masterDeck.length) {
    return `已移除「${CARD_DEFINITIONS[command.definitionId]?.name ?? command.definitionId}」`;
  }
  if (command.type === 'BUY_SHOP_UPGRADE_CARD' && goldDelta < 0) return '卡牌升级完成 · 新效果已写入牌组';
  if (command.type === 'LEAVE_SHOP_TO_MAP' && after.screen.type === 'map') {
    return `交易结束 · 带着 ${after.meta.gold} 金继续攀登`;
  }
  if (
    (command.type === 'LEAVE_REST_TO_MAP' || command.type === 'RESOLVE_REST_OPTION')
    && after.screen.type === 'map'
  ) {
    if (command.type === 'RESOLVE_REST_OPTION' && command.option === 'meditate') {
      return '静心完成 · 下一战 +2 连势';
    }
    if (command.type === 'RESOLVE_REST_OPTION' && command.option === 'upgrade') {
      return '锻造完成 · 卡牌效果已提升';
    }
    return hpDelta > 0 ? `休整完成 · 回复 ${hpDelta} 点生命` : '休整完成 · 当前生命已满';
  }
  if (command.type === 'RESOLVE_EVENT_OPTION' && after.screen.type === 'map') {
    const parts: string[] = [];
    if (hpDelta) parts.push(`${hpDelta > 0 ? '回复' : '失去'} ${Math.abs(hpDelta)} 生命`);
    if (goldDelta) parts.push(`${goldDelta > 0 ? '获得' : '失去'} ${Math.abs(goldDelta)} 金`);
    const momentumDelta = (after.meta.pendingBattleMomentum ?? 0) - (before.meta.pendingBattleMomentum ?? 0);
    if (momentumDelta > 0) parts.push(`下一战 +${momentumDelta} 连势`);
    if (after.masterDeck.length !== before.masterDeck.length) parts.push('牌组已改变');
    if (after.meta.relics.length !== before.meta.relics.length) parts.push('遗物已生效');
    return parts.length > 0 ? parts.join(' · ') : '你选择保持现状，继续前进';
  }
  if ((command.type === 'SELECT_REWARD_CARD' || command.type === 'TAKE_REWARD_GOLD' || command.type === 'TAKE_REWARD_UPGRADE_CARD')
    && after.screen.type === 'map') {
    return command.type === 'SELECT_REWARD_CARD'
      ? `已将「${CARD_DEFINITIONS[command.definitionId]?.name ?? command.definitionId}」加入牌组`
      : command.type === 'TAKE_REWARD_GOLD' ? `奖励结算 · 当前 ${after.meta.gold} 金` : '奖励结算 · 卡牌升级完成';
  }
  return null;
}
