import { describe, expect, it } from '@rstest/core';
import { routePresentationForNodeType, type GlowLevel } from '../src/features/map/mapRouteTone';

describe('routePresentationForNodeType', () => {
  it('普通路线保持中性，强威胁节点才保留更明显的危险提示', () => {
    expect(routePresentationForNodeType('battle').tone).toBe('neutral');
    expect(routePresentationForNodeType('elite').tone).toBe('hazard');
    expect(routePresentationForNodeType('boss').tone).toBe('hazard');
    expect(routePresentationForNodeType('shop').tone).toBe('fortune');
    expect(routePresentationForNodeType('treasure').tone).toBe('fortune');
    expect(routePresentationForNodeType('event').tone).toBe('mystery');
    expect(routePresentationForNodeType('rest').tone).toBe('relief');
  });

  it('仅保留有限的强弱差异，避免整张图都在抢戏', () => {
    const order: GlowLevel[] = [
      routePresentationForNodeType('rest').glow,
      routePresentationForNodeType('event').glow,
      routePresentationForNodeType('shop').glow,
      routePresentationForNodeType('battle').glow,
      routePresentationForNodeType('elite').glow,
      routePresentationForNodeType('boss').glow,
    ];

    expect(order).toEqual(['soft', 'soft', 'soft', 'soft', 'medium', 'medium']);
  });

  it('keeps map route lines solid across all node types', () => {
    expect(routePresentationForNodeType('battle').lineStyle).toBe('solid');
    expect(routePresentationForNodeType('elite').lineStyle).toBe('solid');
    expect(routePresentationForNodeType('boss').lineStyle).toBe('solid');
    expect(routePresentationForNodeType('shop').lineStyle).toBe('solid');
    expect(routePresentationForNodeType('treasure').lineStyle).toBe('solid');
    expect(routePresentationForNodeType('event').lineStyle).toBe('solid');
    expect(routePresentationForNodeType('rest').lineStyle).toBe('solid');
  });
});
