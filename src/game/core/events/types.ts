export type GameEvent =
  | { type: 'TURN_STARTED'; turn: number; unitId: string }
  | { type: 'CARD_DRAWN'; unitId: string; cardInstanceId: string }
  | { type: 'CARD_PLAYED'; unitId: string; cardInstanceId: string; targetUnitId?: string }
  | { type: 'ENERGY_CHANGED'; unitId: string; value: number }
  | { type: 'DAMAGE_DEALT'; sourceUnitId: string; targetUnitId: string; value: number }
  | { type: 'BLOCK_GAINED'; unitId: string; value: number }
  | { type: 'STATUS_APPLIED'; unitId: string; statusId: string; value: number }
  | { type: 'UNIT_DIED'; unitId: string }
  | { type: 'TURN_ENDED'; unitId: string }
  | { type: 'CARD_EXHAUSTED'; unitId: string; cardInstanceId: string }
  | { type: 'BATTLE_WON' }
  | { type: 'BATTLE_LOST' }
  | { type: 'ENTERED_BATTLE_FROM_MAP'; nodeId: string }
  | { type: 'RETURNED_TO_MAP_FROM_BATTLE' }
  | { type: 'ENTERED_GAME_OVER' }
  | { type: 'ENTERED_REWARD_FROM_BATTLE' }
  | { type: 'ENTERED_REWARD_FROM_TREASURE'; nodeId: string }
  | { type: 'ENTERED_SHOP_FROM_MAP'; nodeId: string }
  | { type: 'ENTERED_REST_FROM_MAP'; nodeId: string }
  | { type: 'EVENT_RESOLVED'; eventId: string; optionId: string }
  | { type: 'POTION_USED'; potionId: string; value: number };
