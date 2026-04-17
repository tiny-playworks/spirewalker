export type MapNodeType =
  | 'battle'
  | 'elite'
  | 'event'
  | 'shop'
  | 'rest'
  | 'treasure'
  | 'boss';

export interface MapNode {
  id: string;
  floor: number;
  x: number;
  y: number;
  type: MapNodeType;
  /** 仅 `type === 'event'` 时可选；用于进哪个事件屏（与节点 id 解耦）。 */
  eventScriptId?: string;
  nextNodeIds: string[];
  visited: boolean;
}

export interface MapState {
  nodes: Record<string, MapNode>;
  currentNodeId: string | null;
}
