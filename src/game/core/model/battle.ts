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

export type CountdownEffect =
  | { type: 'attack'; value: number }
  | { type: 'multi_hit'; value: number; hits: number }
  | { type: 'summon'; enemyId: string; count: number }
  | { type: 'max_hp_down'; value: number };

export type MonsterIntent =
  | { type: 'attack'; value: number; hits?: number }
  | { type: 'multi_hit'; value: number; hits: number }
  | { type: 'heavy_charge'; value: number; charge: number }
  | { type: 'block'; value: number }
  | { type: 'buff'; statusId: string; value: number }
  | { type: 'scale'; stat: 'strength' | 'armor'; value: number }
  | { type: 'debuff'; statusId: string; value: number }
  | { type: 'reduce_status'; statusId: string; value: number }
  | { type: 'summon'; enemyId: string; count: number }
  | { type: 'split_on_death'; enemyId: string; count: number; hpPercent: number }
  | { type: 'death_burst'; damage: number }
  | { type: 'revive'; charges: number; hpPercent: number }
  | { type: 'thorns'; damage: number }
  | { type: 'reactive'; damage: number }
  | { type: 'counter'; threshold: number; damage: number }
  | { type: 'pollute_draw'; count: number; cardId?: string }
  | { type: 'lock_hand'; count: number }
  | { type: 'draw_pressure'; value: number }
  | { type: 'heal'; value: number; target: 'self' | 'ally_lowest' | 'all_enemies' }
  | { type: 'leech'; attack: number; healRatio: number }
  | { type: 'countdown'; turns: number; effect: CountdownEffect }
  | { type: 'double_action'; times: number }
  | { type: 'phase_shift'; label: string; phase: number }
  | { type: 'max_hp_down'; value: number }
  | { type: 'mechanic_reset'; mode: 'momentum' | 'statuses' | 'all' }
  | { type: 'copy_echo'; enemyId?: string; count?: number }
  | { type: 'punish_multi_play'; threshold: number; block: number }
  | {
      type: 'attack_buff';
      attack: number;
      statusId: string;
      value: number;
    };

export interface MonsterRuntimeState {
  reviveCharges?: number;
  reviveHpPercent?: number;
  splitOnDeath?: { enemyId: string; count: number; hpPercent: number };
  deathBurst?: { damage: number };
  reactiveDamage?: number;
  thorns?: number;
  counterThreshold?: number;
  counterDamage?: number;
  countdown?: { remaining: number; effect: CountdownEffect };
  extraActions?: number;
  deathResolved?: boolean;
}

export interface PlayerBattleState {
  unitId: string;
  energy: number;
  maxEnergy: number;
  drawPile: string[];
  hand: string[];
  discardPile: string[];
  exhaustPile: string[];
  cards: Record<string, CardInstance>;
  lockedCardInstanceIds: string[];
  pendingHandLocks: number;
  drawPressure: number;
}

export interface MonsterBattleState {
  unitId: string;
  monsterId: string;
  intent: MonsterIntent | null;
  moveHistory: string[];
  bossPhase?: number;
  bossPhaseLabel?: string;
  runtime: MonsterRuntimeState;
  scriptState?: Record<string, number | string | boolean>;
  /** 开发态：最近一次意图计算说明（由 enemyAi 写入） */
  aiTrace?: string;
}

export interface BattleEncounterMeta {
  id: string;
  poolId: string;
  tier: Exclude<EncounterTier, 'none' | 'treasure'>;
  name: string;
  tags: string[];
  pressureProfile?: 'frontload' | 'attrition' | 'snowball' | 'disruption' | 'execution_check';
}

export interface BattleState {
  id: string;
  encounter: BattleEncounterMeta;
  turn: number;
  playerCardsPlayedThisTurn: number;
  playerConsumedMomentumThisTurn: boolean;
  /** 本场战斗持有的遗物 id（与 `RunState.meta.relics` 同步，便于 `dealDamageToUnit` 等纯 battle 钩子读取）。 */
  relicIds: string[];
  /** 流派旗帜牌 / 遗物用：本玩家回合是否打出过攻击 / 技能（含 Power）。 */
  playerPlayedAttackThisTurn: boolean;
  playerPlayedSkillThisTurn: boolean;
  /** 本回合是否将任意牌置入消耗堆（含过载批量消耗）。 */
  playerExhaustedCardThisTurn: boolean;
  /** 本玩家回合已打出的攻击牌次数（用于断裂之刃「第一次攻击」）。 */
  playerAttacksPlayedThisTurn: number;
  /** 上一完整玩家回合是否打出过攻击（流转）。在回合结束、进入敌方行动前写入。 */
  prevTurnPlayerPlayedAttack: boolean;
  /** 炽焰核心：本玩家回合内每消耗一张牌 +2，结算到本回合每一段攻击伤害上；玩家回合结束时清零。 */
  blazeCoreAttackBonus: number;
  /** 固守：本回合获得格挡后，在玩家回合结束时将半数剩余格挡转为伤害。 */
  pendingFortifyConvert: boolean;
  /** 双生核心：本回合第一次获得格挡后，下一次攻击伤害 +5。 */
  twinCoreNextAttackBonus: number;
  twinCoreFirstBlockUsed: boolean;
  /** 双生核心：本回合第一次攻击后，下一张技能 / Power 的第一段格挡或伤害 +5。 */
  twinCoreNextSkillBonus: number;
  twinCoreFirstAttackUsed: boolean;
  /** 调和徽记：本回合是否已触发过「攻+技」奖励。 */
  harmonyEmblemTriggeredThisTurn: boolean;
  /** 本回合是否获得过格挡（均衡刃）。 */
  playerGainedBlockThisTurn: boolean;
  phase: BattlePhase;
  inputMode: InputMode;
  playerUnitId: string;
  enemyUnitIds: string[];
  units: Record<string, CombatUnit>;
  player: PlayerBattleState;
  monsters: Record<string, MonsterBattleState>;
  nextEnemyUnitSeq: number;
  pendingAction: null | {
    type: 'play_card';
    cardInstanceId: string;
    sourceUnitId: string;
  };
  lastResolvedEvents: GameEvent[];
}
