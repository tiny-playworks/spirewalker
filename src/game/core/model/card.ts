export type CardType = 'attack' | 'skill' | 'power' | 'curse' | 'status';
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'legendary';
export type CardTarget = 'none' | 'self' | 'single_enemy' | 'all_enemies';

export type MomentumConsumeMode = 'fixed' | 'all';

export interface MomentumBurstDamageParams {
  consumeMode: MomentumConsumeMode;
  consumeValue?: number;
  baseDamage: number;
  damagePerStack: number;
  gainEnergyIfConsumed?: number;
}

export interface MomentumBurstDrawParams {
  consumeMode: MomentumConsumeMode;
  consumeValue?: number;
  baseDraw: number;
  drawPerStack: number;
}

export interface MomentumGuardByStacksParams {
  baseBlock: number;
  blockPerStack: number;
}

export interface MomentumConditionalDrawParams {
  drawIfNoMomentumConsume: number;
  momentumIfNoMomentumConsume?: number;
}

export type CustomEffectDefinition =
  | {
      type: 'custom';
      scriptId: 'momentum_burst_damage';
      params: MomentumBurstDamageParams;
    }
  | {
      type: 'custom';
      scriptId: 'momentum_burst_draw';
      params: MomentumBurstDrawParams;
    }
  | {
      type: 'custom';
      scriptId: 'momentum_guard_by_stacks';
      params: MomentumGuardByStacksParams;
    }
  | {
      type: 'custom';
      scriptId: 'momentum_conditional_draw';
      params: MomentumConditionalDrawParams;
    }
  | { type: 'custom'; scriptId: string; params?: Record<string, unknown> };

export type EffectDefinition =
  | { type: 'damage'; value: number; target: 'selected' | 'all_enemies' | 'self' }
  | { type: 'block'; value: number; target: 'self' | 'selected' }
  | { type: 'draw'; value: number }
  | { type: 'gain_energy'; value: number }
  | { type: 'discard'; value: number }
  | { type: 'heal'; value: number; target: 'self' | 'selected' }
  | {
      type: 'apply_status';
      statusId: string;
      stacks: number;
      target: 'self' | 'selected' | 'all_enemies';
    }
  | { type: 'repeat'; times: number; effects: EffectDefinition[] }
  | CustomEffectDefinition;

export interface CardModifier {
  id: string;
  source?: string;
  value?: number;
  /** 修正器生命周期：本回合 / 本场战斗 / 常驻 */
  expiresAt?: 'turn_end' | 'battle_end' | 'permanent';
  meta?: Record<string, unknown>;
}

export type CardArchetype = 'guard' | 'burst' | 'mixed' | 'neutral';

export interface CardDefinition {
  id: string;
  name: string;
  description: string;
  type: CardType;
  rarity: CardRarity;
  cost: number;
  target: CardTarget;
  effects: EffectDefinition[];
  /** 出牌后进入消耗堆而非弃牌堆（对应反馈里「消耗牌」概念）。 */
  exhaustOnPlay?: boolean;
  /** 流派标签，用于 UI 展示和奖励权重 */
  archetype?: CardArchetype;
  /** 所属章节，控制出现时机 */
  chapter?: 1 | 2 | 3;
  /** 关键词标签，用于 Build 联动 */
  tags?: string[];
}

export interface CardInstance {
  instanceId: string;
  definitionId: string;
  baseCost: number;
  costForTurn: number;
  upgraded: boolean;
  modifiers?: CardModifier[];
}
