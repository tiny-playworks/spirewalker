import type { MapNodeType } from '@/game/core/model/map';

export type RouteTone = 'hazard' | 'fortune' | 'mystery' | 'relief';
export type GlowLevel = 'soft' | 'medium' | 'strong' | 'intense';

export type RoutePresentation = {
  tone: RouteTone;
  glow: GlowLevel;
  lineStyle: 'solid';
};

export function routePresentationForNodeType(type: MapNodeType): RoutePresentation {
  switch (type) {
    case 'battle':
      return { tone: 'hazard', glow: 'strong', lineStyle: 'solid' };
    case 'elite':
    case 'boss':
      return { tone: 'hazard', glow: 'intense', lineStyle: 'solid' };
    case 'shop':
    case 'treasure':
      return { tone: 'fortune', glow: 'medium', lineStyle: 'solid' };
    case 'event':
      return { tone: 'mystery', glow: 'medium', lineStyle: 'solid' };
    case 'rest':
      return { tone: 'relief', glow: 'soft', lineStyle: 'solid' };
  }
}
