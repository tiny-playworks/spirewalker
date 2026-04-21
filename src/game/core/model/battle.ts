import type { CardInstance } from './card';
import type { EncounterTier } from './map';
import type { CombatUnit } from './unit';
import type { GameEvent } from '../events/types';

export type BattlePhase =
  | 'battle_init'
  | 'turn_start'
  | 'draw_phase'
  | 'player_action'
  | 'resolving'
  | 'turn_end'
  | 'enemy_turn'
  | 'victory'
  | 'defeat';

export type InputMode =
  | 'idle'
  | 'dragging_card'
  | 'selecting_target'
  | 'animation_lock';

export type MonsterIntent =
  | { type: 'attack'; value: number; hits?: number }
  | { type: 'block'; value: number }
  | { type: 'buff'; statusId: string; value: number }
  | { type: 'debuff'; statusId: string; value: number }
  | { type: 'reduce_status'; statusId: string; value: number }
  | { type: 'punish_multi_play'; threshold: number; block: number }
  | {
      type: 'attack_buff';
      attack: number;
      statusId: string;
      value: number;
    };

export interface PlayerBattleState {
  unitId: string;
  energy: number;
  maxEnergy: number;
  drawPile: string[];
  hand: string[];
  discardPile: string[];
  exhaustPile: string[];
  cards: Record<string, CardInstance>;
}

export interface MonsterBattleState {
  unitId: string;
  monsterId: string;
  intent: MonsterIntent | null;
  moveHistory: string[];
  bossPhase?: 1 | 2;
  bossPhaseLabel?: string;
  /** 开发态：最近一次意图计算说明（由 enemyAi 写入） */
  aiTrace?: string;
}

export interface BattleEncounterMeta {
  id: string;
  tableId: string;
  tier: Exclude<EncounterTier, 'none' | 'treasure'>;
  name: string;
  tags: string[];
}

export interface BattleState {
  id: string;
  encounter: BattleEncounterMeta;
  turn: number;
  playerCardsPlayedThisTurn: number;
  phase: BattlePhase;
  inputMode: InputMode;
  playerUnitId: string;
  enemyUnitIds: string[];
  units: Record<string, CombatUnit>;
  player: PlayerBattleState;
  monsters: Record<string, MonsterBattleState>;
  pendingAction: null | {
    type: 'play_card';
    cardInstanceId: string;
    sourceUnitId: string;
  };
  lastResolvedEvents: GameEvent[];
}
