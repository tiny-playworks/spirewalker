export type MapNodeType =
  | 'battle'
  | 'elite'
  | 'event'
  | 'shop'
  | 'rest'
  | 'treasure'
  | 'boss';

export type MapAct = 1 | 2 | 3;
export type MapRouteBias = 'risk' | 'balance' | 'safe';

export type EncounterTier =
  | 'none'
  | 'normal'
  | 'elite'
  | 'boss'
  | 'treasure';

export interface MapNode {
  id: string;
  act: MapAct;
  depth: number;
  floor: number;
  x: number;
  y: number;
  type: MapNodeType;
  encounterTier: EncounterTier;
  encounterPoolId: string | null;
  encounterId: string | null;
  routeBias?: MapRouteBias;
  /** 仅 `type === 'event'` 时可选；用于进哪个事件屏（与节点 id 解耦）。 */
  eventScriptId?: string;
  nextNodeIds: string[];
  visited: boolean;
}

export interface MapState {
  nodes: Record<string, MapNode>;
  currentNodeId: string | null;
}
