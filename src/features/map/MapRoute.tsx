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

type MapRouteProps = {
  map: MapState;
  currentNodeId: string | null;
  floor: number;
  selectedNodeId: string | null;
  selectableNodeIds: Set<string>;
  onSelectNode: (nodeId: string) => void;
};

export function MapRoute({
  map,
  currentNodeId,
  floor,
  selectedNodeId,
  selectableNodeIds,
  onSelectNode,
}: MapRouteProps) {
  const reachable = useMemo(
    () => getForwardReachableNodeIds(map.nodes, currentNodeId),
    [map.nodes, currentNodeId],
  );

  const floorNodes = useMemo(
    () => Object.values(map.nodes).filter((n) => n.floor === floor),
    [map.nodes, floor],
  );

  const maxX = Math.max(0, ...floorNodes.map((n) => n.x));
  const maxY = Math.max(0, ...floorNodes.map((n) => n.y));

  const edges = useMemo(() => {
    const list: { from: string; to: string }[] = [];
    const seen = new Set<string>();
    for (const n of floorNodes) {
      for (const to of n.nextNodeIds) {
        const target = map.nodes[to];
        if (!target || target.floor !== floor) continue;
        const key = `${n.id}|${to}`;
        if (seen.has(key)) continue;
        seen.add(key);
        list.push({ from: n.id, to });
      }
    }
    return list;
  }, [floorNodes, map.nodes, floor]);

  const vb = mapRouteViewBox(maxX, maxY);
  const { NODE_R } = MAP_ROUTE_SVG;

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
              )}
            />
          );
        })}
        {floorNodes.map((node) => {
          const { cx, cy } = mapNodeCenter(node);
          const isCurrent = currentNodeId === node.id;
          const isVisited = node.visited;
          const canReach = reachable.has(node.id);
          const isSelectable = selectableNodeIds.has(node.id);
          const isSelected = selectedNodeId === node.id;
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
            >
              {isSelectable ? (
                <circle className={styles.nodeHit} r={NODE_R + 10} cx={0} cy={0} />
              ) : null}
              <g className={styles.nodeCore}>
                {isCurrent ? <circle className={styles.nodeAura} r={NODE_R + 7} cx={0} cy={0} /> : null}
                {isCurrent ? <circle className={styles.nodeHeart} r={NODE_R - 8} cx={0} cy={0} /> : null}
                {isSelected ? (
                  <circle className={styles.nodeSelectionEcho} r={NODE_R + 9} cx={0} cy={0} />
                ) : null}
                {isSelected ? (
                  <circle className={styles.nodeSelection} r={NODE_R + 5} cx={0} cy={0} />
                ) : null}
                <circle
                  className={cn(
                    styles.nodeCircleBase,
                    styles.nodeCircleState[viewState],
                    viewState === 'available' ? styles.nodeCircleTone[tone] : null,
                    isSelectable && styles.nodeCircleInteractive,
                    isSelected && styles.nodeCircleSelected,
                  )}
                  r={NODE_R}
                  cx={0}
                  cy={0}
                />
                {isCurrent ? <circle className={styles.nodePlayer} r={4} cx={0} cy={-NODE_R - 8} /> : null}
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
                  <text className={styles.nodeTag} x={0} y={-NODE_R - 16} textAnchor="middle">
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
