import { useMemo } from 'react';
import type { MapNode, MapState } from '@/game/core/model/map';
import { getForwardReachableNodeIds } from '@/game/core/model/mapGraph';
import { MAP_ROUTE_SVG, mapNodeCenter, mapRouteViewBox } from './mapRouteLayout';

function shortLabelForNode(n: MapNode): string {
  if (n.x === 0) return '营';
  switch (n.type) {
    case 'shop':
      return '店';
    case 'event':
      return '事';
    case 'battle':
      return '战';
    case 'rest':
      return '息';
    case 'elite':
      return '精';
    case 'boss':
      return '王';
    case 'treasure':
      return '箱';
  }
}

type MapRouteProps = {
  map: MapState;
  currentNodeId: string | null;
  floor: number;
};

export function MapRoute({ map, currentNodeId, floor }: MapRouteProps) {
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
        const t = map.nodes[to];
        if (!t || t.floor !== floor) continue;
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
        <title>本层岔路与连线</title>
        {edges.map(({ from, to }) => {
          const a = mapNodeCenter(map.nodes[from]!);
          const b = mapNodeCenter(map.nodes[to]!);
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
                bright ? 'map-route-edge map-route-edge--bright' : 'map-route-edge map-route-edge--dim'
              }
            />
          );
        })}
        {floorNodes.map((node) => {
          const { cx, cy } = mapNodeCenter(node);
          const isCurrent = currentNodeId === node.id;
          const isVisited = node.visited;
          const canReach = reachable.has(node.id);
          let state: 'current' | 'past' | 'future' | 'skipped' = 'future';
          if (isCurrent) state = 'current';
          else if (isVisited) state = 'past';
          else if (!canReach) state = 'skipped';

          return (
            <g key={node.id} className={`map-route-node map-route-node--${state}`} transform={`translate(${cx},${cy})`}>
              <circle className="map-route-node-circle" r={NODE_R} cx={0} cy={0} />
              <text
                className="map-route-node-text"
                x={0}
                y={0}
                dy="0.35em"
                textAnchor="middle"
              >
                {shortLabelForNode(node)}
              </text>
            </g>
          );
        })}
      </svg>
    </nav>
  );
}
