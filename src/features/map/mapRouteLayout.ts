/**
 * 竖向星图布局：进度（depth/x）映射到纵轴，并翻转使 Boss（最大 x）位于顶部、
 * 营地（x=0）位于底部；岔路（row/y）映射到横轴并居中。SVG 以 1 单位≈1px 渲染，
 * 高度随层数增长，由外层容器纵向滚动。
 */
export const MAP_ROUTE_SVG = {
  /** 相邻 depth 之间的纵向间距 */
  STEP_V: 90,
  /** 相邻 row 之间的横向间距 */
  LANE_H: 76,
  PAD: 54,
  NODE_R: 21,
  ELITE_NODE_R: 23,
  BOSS_NODE_R: 27,
} as const;

export function mapNodeCenter(
  node: { x: number; y: number },
  maxX: number,
): { cx: number; cy: number } {
  const { STEP_V, LANE_H, PAD } = MAP_ROUTE_SVG;
  return {
    cx: PAD + node.y * LANE_H,
    cy: PAD + (maxX - node.x) * STEP_V,
  };
}

export function mapRouteViewBox(maxLane: number, maxX: number): string {
  const { STEP_V, LANE_H, PAD, BOSS_NODE_R } = MAP_ROUTE_SVG;
  const w = PAD * 2 + Math.max(0, maxLane) * LANE_H;
  const h = PAD * 2 + Math.max(0, maxX) * STEP_V + BOSS_NODE_R;
  return `0 0 ${w} ${h}`;
}

export function mapRouteViewSize(maxLane: number, maxX: number): { w: number; h: number } {
  const { STEP_V, LANE_H, PAD, BOSS_NODE_R } = MAP_ROUTE_SVG;
  return {
    w: PAD * 2 + Math.max(0, maxLane) * LANE_H,
    h: PAD * 2 + Math.max(0, maxX) * STEP_V + BOSS_NODE_R,
  };
}
