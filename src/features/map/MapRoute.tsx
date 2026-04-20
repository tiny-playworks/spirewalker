import { useMemo } from 'react';
import type { MapState } from '@/game/core/model/map';
import { getForwardReachableNodeIds } from '@/game/core/model/mapGraph';
import { MAP_ROUTE_SVG, mapNodeCenter, mapRouteViewBox } from './mapRouteLayout';
import { MapNodeIcon, nodeVisualKind } from './mapNodeIcons';
import { routePresentationForNodeType } from './mapRouteTone';

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
    <nav className="map-route" aria-label="本层路线概览">
      <svg
        className="map-route-svg"
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
          const bright =
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
              className={
                bright
                  ? `map-route-edge map-route-edge--bright map-route-edge--tone-${routePresentation.tone} map-route-edge--glow-${routePresentation.glow} map-route-edge--line-${routePresentation.lineStyle}`
                  : 'map-route-edge map-route-edge--dim'
              }
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
          let state: 'current' | 'past' | 'future' | 'skipped' = 'future';
          if (isCurrent) state = 'current';
          else if (isVisited) state = 'past';
          else if (!canReach) state = 'skipped';

          return (
            <g
              key={node.id}
              className={`map-route-node map-route-node--${state} map-route-node--type-${node.type} ${isSelectable ? 'map-route-node--selectable' : ''} ${isSelected ? 'map-route-node--selected' : ''}`}
              transform={`translate(${cx},${cy})`}
              aria-current={isCurrent ? 'step' : undefined}
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
                <circle className="map-route-node-hit" r={NODE_R + 10} cx={0} cy={0} />
              ) : null}
              <g className="map-route-node-core">
                {isCurrent ? <circle className="map-route-node-aura" r={NODE_R + 7} cx={0} cy={0} /> : null}
                {isCurrent ? <circle className="map-route-node-heart" r={NODE_R - 8} cx={0} cy={0} /> : null}
                {isSelected ? (
                  <circle className="map-route-node-selection-echo" r={NODE_R + 9} cx={0} cy={0} />
                ) : null}
                {isSelected ? (
                  <circle className="map-route-node-selection" r={NODE_R + 5} cx={0} cy={0} />
                ) : null}
                <circle className="map-route-node-circle" r={NODE_R} cx={0} cy={0} />
                {isCurrent ? <circle className="map-route-node-player" r={4} cx={0} cy={-NODE_R - 8} /> : null}
                <MapNodeIcon
                  kind={nodeVisualKind(node)}
                  className="map-route-node-icon"
                  x={-9}
                  y={-9}
                  width={18}
                  height={18}
                  aria-hidden="true"
                />
                {isCurrent ? (
                  <text className="map-route-node-tag" x={0} y={-NODE_R - 16} textAnchor="middle">
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
