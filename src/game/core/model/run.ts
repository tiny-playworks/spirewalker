import type { BattleState } from './battle';
import type { MapState } from './map';
import type { RewardState } from './reward';
import type { ShopState } from './shop';

export type ScreenState =
  | { type: 'main_menu' }
  | { type: 'map' }
  | { type: 'battle' }
  | { type: 'reward' }
  | { type: 'shop' }
  | { type: 'event'; eventId: string }
  | { type: 'rest' }
  | { type: 'game_over' }
  | { type: 'victory' };

export interface PlayerRunState {
  maxHp: number;
  currentHp: number;
}

export interface EncounterHistoryState {
  ids: string[];
  tags: string[];
  archetypes: string[];
}

export function createEmptyEncounterHistory(): EncounterHistoryState {
  return { ids: [], tags: [], archetypes: [] };
}

export interface RunState {
  /** 存档结构版本，便于迁移（见 persistence/saveRun） */
  saveVersion?: number;
  seed: number;
  player: PlayerRunState;
  /** 本场 Run 的牌组（卡牌 definitionId 列表），战斗开局由此洗牌成战斗内牌堆。 */
  masterDeck: string[];
  map: MapState;
  screen: ScreenState;
  battle?: BattleState;
  /** 战后奖励（naobao：战斗胜利 → RewardState → 选完回地图） */
  reward?: RewardState;
  /** 商店库存（进入商店节点时生成） */
  shop?: ShopState;
  meta: {
    act: 1 | 2 | 3;
    actFloor: number;
    floor: number;
    gold: number;
    characterId: string;
    relics: string[];
    potions: string[];
    encounterHistory: EncounterHistoryState;
  };
}
