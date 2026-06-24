import type { SVGProps } from 'react';
import {
  Eye,
  Flame,
  Gem,
  HelpCircle,
  ShoppingBag,
  Skull,
  Swords,
  Tent,
} from 'lucide-react';
import type { MapNode } from '@/game/core/model/map';

export type MapNodeVisualKind = MapNode['type'] | 'camp';

type MapNodeIconProps = SVGProps<SVGSVGElement> & {
  kind: MapNodeVisualKind;
  title?: string;
};

export function nodeVisualKind(node: Pick<MapNode, 'type' | 'x'>): MapNodeVisualKind {
  return node.x === 0 ? 'camp' : node.type;
}

export function MapNodeIcon({ kind, title, ...svgProps }: MapNodeIconProps) {
  const Icon = iconComponent(kind);
  return (
    <Icon
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      strokeWidth={1.85}
      {...svgProps}
    >
      {title ? <title>{title}</title> : null}
    </Icon>
  );
}

function iconComponent(kind: MapNodeVisualKind) {
  switch (kind) {
    case 'camp':
      return Tent;
    case 'battle':
      return Swords;
    case 'elite':
      return Skull;
    case 'boss':
      return Eye;
    case 'shop':
      return ShoppingBag;
    case 'rest':
      return Flame;
    case 'event':
      return HelpCircle;
    case 'treasure':
      return Gem;
  }
}
