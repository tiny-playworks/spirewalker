import type { MapNode } from '@/game/core/model/map';
import { nodeVisualKind } from './mapNodeIcons';

export type MapNodeViewState = 'current' | 'passed' | 'available' | 'locked';
export type MapNodeTone =
  | 'battle'
  | 'elite'
  | 'boss'
  | 'shop'
  | 'treasure'
  | 'event'
  | 'rest'
  | 'camp';
export type MapEdgeEmphasis = 'active' | 'dim';

export function mapNodeViewState(options: {
  isCurrent: boolean;
  isVisited: boolean;
  canReach: boolean;
}): MapNodeViewState {
  if (options.isCurrent) return 'current';
  if (options.isVisited) return 'passed';
  if (options.canReach) return 'available';
  return 'locked';
}

export function mapNodeToneForNode(node: MapNode): MapNodeTone {
  return nodeVisualKind(node);
}
