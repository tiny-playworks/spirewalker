import type { MapNodeType } from '@/game/core/model/map';

export type RouteTone = 'neutral' | 'hazard' | 'fortune' | 'mystery' | 'relief';
export type GlowLevel = 'soft' | 'medium' | 'strong' | 'intense';

export type RoutePresentation = {
  tone: RouteTone;
  glow: GlowLevel;
  lineStyle: 'solid';
};

export function routePresentationForNodeType(type: MapNodeType): RoutePresentation {
  switch (type) {
    case 'elite':
    case 'boss':
      return { tone: 'hazard', glow: 'medium', lineStyle: 'solid' };
    case 'shop':
    case 'treasure':
      return { tone: 'fortune', glow: 'soft', lineStyle: 'solid' };
    case 'event':
      return { tone: 'mystery', glow: 'soft', lineStyle: 'solid' };
    case 'rest':
      return { tone: 'relief', glow: 'soft', lineStyle: 'solid' };
    case 'battle':
      return { tone: 'neutral', glow: 'soft', lineStyle: 'solid' };
  }
}
