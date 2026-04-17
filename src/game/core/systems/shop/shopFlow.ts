import type { GameCommand } from '../../commands/types';
import type { GameEvent } from '../../events/types';
import type { RunState } from '../../model/run';
import {
  resolveShopCardPurchase,
  resolveShopPotionPurchase,
  resolveShopRelicPurchase,
  resolveShopRemoveCard,
} from './shopResolver';

export function buyShopCardFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'BUY_SHOP_CARD' }>,
  events: GameEvent[],
): void {
  void events;
  resolveShopCardPurchase(run, command.definitionId);
}

export function buyShopRelicFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'BUY_SHOP_RELIC' }>,
  events: GameEvent[],
): void {
  void events;
  resolveShopRelicPurchase(run, command.relicId);
}

export function buyShopRemoveCardFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'BUY_SHOP_REMOVE_CARD' }>,
  events: GameEvent[],
): void {
  void events;
  resolveShopRemoveCard(run, command.definitionId);
}

export function leaveShopToMapFlow(run: RunState): void {
  if (run.screen.type !== 'shop') return;
  run.screen = { type: 'map' };
  run.shop = undefined;
}

export function buyShopPotionFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'BUY_SHOP_POTION' }>,
  events: GameEvent[],
): void {
  void events;
  resolveShopPotionPurchase(run, command.potionId);
}
