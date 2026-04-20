/** 与 `generateBranchingFloor` 中 `MapNode.y` 的刻度一致：列间距 + 行间距 + 节点半径。 */
export const MAP_ROUTE_SVG = {
  COL_GAP: 68,
  ROW_GAP: 46,
  PAD: 40,
  NODE_R: 17,
} as const;

export function mapNodeCenter(node: { x: number; y: number }): { cx: number; cy: number } {
  const { COL_GAP, ROW_GAP, PAD } = MAP_ROUTE_SVG;
  return {
    cx: PAD + node.x * COL_GAP,
    cy: PAD + node.y * ROW_GAP,
  };
}

export function mapRouteViewBox(maxX: number, maxY: number): string {
  const { COL_GAP, ROW_GAP, PAD, NODE_R } = MAP_ROUTE_SVG;
  const w = PAD * 2 + Math.max(0, maxX) * COL_GAP + NODE_R * 2;
  const h = PAD * 2 + Math.max(0, maxY) * ROW_GAP + NODE_R * 2;
  return `0 0 ${w} ${h}`;
}
