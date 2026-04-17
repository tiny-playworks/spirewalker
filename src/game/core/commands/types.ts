export type GameCommand =
  | { type: 'START_RUN'; seed?: number }
  | { type: 'ENTER_BATTLE'; battleId: string }
  | {
      type: 'PLAY_CARD';
      cardInstanceId: string;
      sourceUnitId: string;
      targetUnitId?: string;
    }
  | { type: 'END_TURN' }
  | { type: 'SELECT_REWARD_CARD'; definitionId: string }
  | { type: 'TAKE_REWARD_GOLD'; amount: number }
  | { type: 'CHOOSE_MAP_NODE'; nodeId: string }
  /** 战斗胜利后进入奖励三选一（naobao 战后流程） */
  | { type: 'LEAVE_BATTLE_TO_REWARD' }
  | { type: 'LEAVE_SHOP_TO_MAP' }
  | { type: 'LEAVE_REST_TO_MAP' }
  /** 事件节点选项（naobao 事件屏） */
  | { type: 'RESOLVE_EVENT_OPTION'; optionId: string }
  | { type: 'BUY_SHOP_CARD'; definitionId: string }
  | { type: 'BUY_SHOP_RELIC'; relicId: string }
  /** 支付删牌价，从 masterDeck 移除一张指定 definitionId（至少保留 SHOP_MIN_MASTER_DECK_SIZE 张） */
  | { type: 'BUY_SHOP_REMOVE_CARD'; definitionId: string }
  | { type: 'BUY_SHOP_POTION'; potionId: string }
  /** 战斗内使用背包中药水（按栏位下标） */
  | { type: 'USE_POTION'; slotIndex: number }
  /** 进入手牌拖拽态（仅输入状态，不做业务结算） */
  | { type: 'BEGIN_DRAG_CARD'; cardInstanceId: string; sourceUnitId: string }
  /** 取消拖拽并回到 idle（仅输入状态，不做业务结算） */
  | { type: 'CANCEL_DRAG_CARD' }
  | { type: 'DEBUG_SET_PLAYER_HP'; hp: number }
  | { type: 'DEBUG_ADD_STATUS'; statusId: string; stacks: number; unitId?: string }
  | { type: 'DEBUG_ADD_HAND_CARD'; definitionId: string }
  | { type: 'DEBUG_FORCE_BATTLE_OUTCOME'; outcome: 'victory' | 'defeat' }
  | { type: 'DEBUG_JUMP_SCREEN'; screen: 'map' | 'shop' | 'event' | 'reward' }
  | { type: 'RESOLVE_ANIMATION_DONE' };
