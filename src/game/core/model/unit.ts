export interface StatusInstance {
  id: string;
  stacks: number;
  sourceUnitId?: string;
}

export interface CombatUnit {
  id: string;
  side: 'player' | 'enemy';
  name: string;
  hp: number;
  maxHp: number;
  block: number;
  alive: boolean;
  stats: {
    strength: number;
    dexterity: number;
  };
  statuses: StatusInstance[];
}
