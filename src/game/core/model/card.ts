export type CardType = 'attack' | 'skill' | 'power';
export type CardRarity = 'common' | 'uncommon' | 'rare';
export type CardTarget = 'none' | 'self' | 'single_enemy' | 'all_enemies';

export type EffectDefinition =
  | { type: 'damage'; value: number; target: 'selected' | 'all_enemies' | 'self' }
  | { type: 'block'; value: number; target: 'self' | 'selected' }
  | { type: 'draw'; value: number }
  | { type: 'gain_energy'; value: number }
  | {
      type: 'apply_status';
      statusId: string;
      stacks: number;
      target: 'self' | 'selected';
    };

export interface CardDefinition {
  id: string;
  name: string;
  description: string;
  type: CardType;
  rarity: CardRarity;
  cost: number;
  target: CardTarget;
  effects: EffectDefinition[];
}

export interface CardInstance {
  instanceId: string;
  definitionId: string;
  baseCost: number;
  costForTurn: number;
  upgraded: boolean;
}
