import type { GameCommand } from '../commands/types';
import type { GameEvent } from '../events/types';
import type { RunState } from '../model/run';
import {
  debugAddHandCard,
  debugAddStatus,
  debugForceBattleOutcome,
  debugJumpScreen,
  debugSetPlayerHp,
} from '../systems/debug/debugFlow';
import { resolveEventOptionFlow } from '../systems/event/eventFlow';
import { chooseMapNodeFlow } from '../systems/map/mapFlow';
import { leaveBattleToRewardFlow, selectRewardCardFlow, takeRewardGoldFlow } from '../systems/reward/rewardFlow';
import { usePotionFlow } from '../systems/potion/potionFlow';
import { leaveRestToMapFlow } from '../systems/rest/restFlow';
import {
  buyShopCardFlow,
  buyShopPotionFlow,
  buyShopRelicFlow,
  buyShopRemoveCardFlow,
  leaveShopToMapFlow,
} from '../systems/shop/shopFlow';
import { applyGameOverIfDefeat, syncRunPlayerFromBattle } from '../systems/common/runGuards';
import { playCardFlow } from '../systems/battle/playCard';
import { endTurnFlow, resolveAnimationDoneFlow } from '../systems/battle/turnFlow';

export interface EngineResult {
  nextRun: RunState;
  events: GameEvent[];
}

export class GameEngine {
  dispatch(run: RunState, command: GameCommand): EngineResult {
    const nextRun = structuredClone(run);
    const events: GameEvent[] = [];

    switch (command.type) {
      case 'PLAY_CARD':
        playCardFlow(nextRun, command, events);
        break;
      case 'RESOLVE_ANIMATION_DONE':
        resolveAnimationDoneFlow(nextRun);
        break;
      case 'END_TURN':
        endTurnFlow(nextRun, events);
        break;
      case 'CHOOSE_MAP_NODE':
        chooseMapNodeFlow(nextRun, command, events);
        break;
      case 'LEAVE_BATTLE_TO_REWARD':
        leaveBattleToRewardFlow(nextRun, events);
        break;
      case 'SELECT_REWARD_CARD':
        selectRewardCardFlow(nextRun, command, events);
        break;
      case 'TAKE_REWARD_GOLD':
        takeRewardGoldFlow(nextRun, command, events);
        break;
      case 'BUY_SHOP_CARD':
        buyShopCardFlow(nextRun, command, events);
        break;
      case 'BUY_SHOP_RELIC':
        buyShopRelicFlow(nextRun, command, events);
        break;
      case 'BUY_SHOP_REMOVE_CARD':
        buyShopRemoveCardFlow(nextRun, command, events);
        break;
      case 'LEAVE_SHOP_TO_MAP':
        leaveShopToMapFlow(nextRun);
        break;
      case 'LEAVE_REST_TO_MAP':
        leaveRestToMapFlow(nextRun);
        break;
      case 'RESOLVE_EVENT_OPTION':
        resolveEventOptionFlow(nextRun, command, events);
        break;
      case 'USE_POTION':
        usePotionFlow(nextRun, command, events);
        break;
      case 'BUY_SHOP_POTION':
        buyShopPotionFlow(nextRun, command, events);
        break;
      case 'DEBUG_SET_PLAYER_HP':
        debugSetPlayerHp(nextRun, command.hp);
        break;
      case 'DEBUG_ADD_STATUS':
        debugAddStatus(nextRun, command);
        break;
      case 'DEBUG_ADD_HAND_CARD':
        debugAddHandCard(nextRun, command.definitionId);
        break;
      case 'DEBUG_FORCE_BATTLE_OUTCOME':
        debugForceBattleOutcome(nextRun, command.outcome);
        break;
      case 'DEBUG_JUMP_SCREEN':
        debugJumpScreen(nextRun, command.screen);
        break;
      default:
        break;
    }

    syncRunPlayerFromBattle(nextRun);
    applyGameOverIfDefeat(nextRun, events);
    return { nextRun, events };
  }
}
