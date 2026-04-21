import { useMemo } from 'react';
import type { MapState } from '@/game/core/model/map';
import { getForwardReachableNodeIds } from '@/game/core/model/mapGraph';
import { MAP_ROUTE_SVG, mapNodeCenter, mapRouteViewBox } from './mapRouteLayout';
import * as styles from './mapRoute.css';
import { mapNodeToneForNode, mapNodeViewState } from './mapViewState';
import { MapNodeIcon, nodeVisualKind } from './mapNodeIcons';
import { routePresentationForNodeType } from './mapRouteTone';

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

const HOVER_PREVIEW_STEPS = 3;

function getPreviewReachableNodeIds(
  map: MapState,
  fromId: string | null,
  steps: number,
): Set<string> {
  const out = new Set<string>();
  if (!fromId || !map.nodes[fromId]) return out;
  const queue: Array<{ id: string; stepsLeft: number }> = [{ id: fromId, stepsLeft: steps }];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (out.has(current.id)) continue;
    out.add(current.id);
    if (current.stepsLeft <= 0) continue;
    for (const nextId of map.nodes[current.id]!.nextNodeIds) {
      queue.push({ id: nextId, stepsLeft: current.stepsLeft - 1 });
    }
  }
  return out;
}

function nodeRadiusFor(node: { type: string }) {
  if (node.type === 'boss') return MAP_ROUTE_SVG.BOSS_NODE_R;
  if (node.type === 'elite') return MAP_ROUTE_SVG.ELITE_NODE_R;
  return MAP_ROUTE_SVG.NODE_R;
}

type MapRouteProps = {
  map: MapState;
  currentNodeId: string | null;
  act: number;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  selectableNodeIds: Set<string>;
  onSelectNode: (nodeId: string) => void;
  onHoverNode: (nodeId: string | null) => void;
};

export function MapRoute({
  map,
  currentNodeId,
  act,
  selectedNodeId,
  hoveredNodeId,
  selectableNodeIds,
  onSelectNode,
  onHoverNode,
}: MapRouteProps) {
  const reachable = useMemo(
    () => getForwardReachableNodeIds(map.nodes, currentNodeId),
    [map.nodes, currentNodeId],
  );
  const hoveredReachable = useMemo(
    () => getPreviewReachableNodeIds(map, hoveredNodeId, HOVER_PREVIEW_STEPS),
    [map, hoveredNodeId],
  );

  const floorNodes = useMemo(
    () => Object.values(map.nodes).filter((n) => n.act === act),
    [map.nodes, act],
  );

  const maxX = Math.max(0, ...floorNodes.map((n) => n.x));
  const maxY = Math.max(0, ...floorNodes.map((n) => n.y));

  const edges = useMemo(() => {
    const list: { from: string; to: string }[] = [];
    const seen = new Set<string>();
    for (const n of floorNodes) {
      for (const to of n.nextNodeIds) {
        const target = map.nodes[to];
        if (!target || target.act !== act) continue;
        const key = `${n.id}|${to}`;
        if (seen.has(key)) continue;
        seen.add(key);
        list.push({ from: n.id, to });
      }
    }
    return list;
  }, [floorNodes, map.nodes, act]);

  const vb = mapRouteViewBox(maxX, maxY);
  return (
    <nav className={styles.route} aria-label="本层路线概览">
      <svg
        className={styles.routeSvg}
        viewBox={vb}
        preserveAspectRatio="xMidYMid meet"
        role="img"
      >
        <title>本层岔路与连接</title>
        {edges.map(({ from, to }) => {
          const a = mapNodeCenter(map.nodes[from]!);
          const b = mapNodeCenter(map.nodes[to]!);
          const targetNode = map.nodes[to]!;
          const routePresentation = routePresentationForNodeType(targetNode.type);
          const emphasis =
            from === currentNodeId ||
            to === currentNodeId ||
            (reachable.has(from) && reachable.has(to));
          const isPreviewed =
            hoveredNodeId !== null &&
            hoveredReachable.has(from) &&
            hoveredReachable.has(to);

          return (
            <line
              key={`${from}-${to}`}
              x1={a.cx}
              y1={a.cy}
              x2={b.cx}
              y2={b.cy}
              className={cn(
                styles.routeEdgeBase,
                styles.routeEdgeEmphasis[emphasis ? 'active' : 'dim'],
                emphasis ? styles.routeEdgeTone[routePresentation.tone] : null,
                emphasis ? styles.routeEdgeGlow[routePresentation.glow] : null,
                isPreviewed && styles.routeEdgePreview,
              )}
            />
          );
        })}
        {floorNodes.map((node) => {
          const { cx, cy } = mapNodeCenter(node);
          const nodeRadius = nodeRadiusFor(node);
          const isCurrent = currentNodeId === node.id;
          const isVisited = node.visited;
          const canReach = reachable.has(node.id);
          const isSelectable = selectableNodeIds.has(node.id);
          const isSelected = selectedNodeId === node.id;
          const isHovered = hoveredNodeId === node.id;
          const isThreatNode = node.type === 'elite' || node.type === 'boss';
          const viewState = mapNodeViewState({ isCurrent, isVisited, canReach });
          const tone = mapNodeToneForNode(node);

          return (
            <g
              key={node.id}
              className={cn(styles.nodeRoot, isSelectable && styles.nodeRootSelectable)}
              transform={`translate(${cx},${cy})`}
              aria-current={isCurrent ? 'step' : undefined}
              data-testid={`map-node-${node.id}`}
              data-cursor-target={isSelectable ? 'true' : undefined}
              focusable="false"
              onPointerDown={
                isSelectable
                  ? (event) => {
                      event.preventDefault();
                    }
                  : undefined
              }
              onClick={isSelectable ? () => onSelectNode(node.id) : undefined}
              onPointerEnter={isSelectable ? () => onHoverNode(node.id) : undefined}
              onPointerLeave={isSelectable ? () => onHoverNode(null) : undefined}
            >
              {isSelectable ? (
                <circle className={styles.nodeHit} r={nodeRadius + 10} cx={0} cy={0} />
              ) : null}
              <g className={styles.nodeCore}>
                {isCurrent ? <circle className={styles.nodeAura} r={nodeRadius + 7} cx={0} cy={0} /> : null}
                {isCurrent ? <circle className={styles.nodeHeart} r={nodeRadius - 8} cx={0} cy={0} /> : null}
                {isSelected ? (
                  <circle className={styles.nodeSelectionEcho} r={nodeRadius + 9} cx={0} cy={0} />
                ) : null}
                {isSelected ? (
                  <circle className={styles.nodeSelection} r={nodeRadius + 5} cx={0} cy={0} />
                ) : null}
                {isHovered && !isSelected ? (
                  <circle className={styles.nodeHoverRing} r={nodeRadius + 5} cx={0} cy={0} />
                ) : null}
                {isThreatNode ? (
                  <circle
                    className={cn(
                      styles.nodeThreatHalo,
                      styles.nodeThreatRing,
                      styles.nodeThreatTone[node.type === 'boss' ? 'boss' : 'elite'],
                    )}
                    r={nodeRadius + 4}
                    cx={0}
                    cy={0}
                  />
                ) : null}
                {isThreatNode ? (
                  <circle
                    className={cn(
                      styles.nodeThreatRing,
                      styles.nodeThreatTone[node.type === 'boss' ? 'boss' : 'elite'],
                    )}
                    r={nodeRadius + 2.5}
                    cx={0}
                    cy={0}
                  />
                ) : null}
                <circle
                  className={cn(
                    styles.nodeCircleBase,
                    styles.nodeCircleState[viewState],
                    viewState === 'available' ? styles.nodeCircleTone[tone] : null,
                    isSelectable && styles.nodeCircleInteractive,
                    isSelected && styles.nodeCircleSelected,
                  )}
                  r={nodeRadius}
                  cx={0}
                  cy={0}
                />
                {isCurrent ? <circle className={styles.nodePlayer} r={4} cx={0} cy={-nodeRadius - 8} /> : null}
                <MapNodeIcon
                  kind={nodeVisualKind(node)}
                  className={cn(styles.nodeIconBase, styles.nodeIconState[viewState])}
                  x={-9}
                  y={-9}
                  width={18}
                  height={18}
                  aria-hidden="true"
                />
                {isCurrent ? (
                  <text className={styles.nodeTag} x={0} y={-nodeRadius - 16} textAnchor="middle">
                    你在这里
                  </text>
                ) : null}
              </g>
            </g>
          );
        })}
      </svg>
    </nav>
  );
}
