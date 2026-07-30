import type { ReactNode } from 'react';
import { getCardArtSources } from '@/features/battle/combatAssets';
import { FallbackImg } from './FallbackImg';

/** 卡图唯一入口：升级卡复用基础卡插画，缺图时继续走流派兜底。 */
export function CardArtwork({
  cardId,
  alt = '',
  className,
  fallback,
  loading = 'lazy',
}: {
  cardId: string;
  alt?: string;
  className?: string;
  fallback?: ReactNode;
  loading?: 'eager' | 'lazy';
}) {
  return (
    <FallbackImg
      alt={alt}
      className={className}
      fallback={fallback}
      loading={loading}
      sources={getCardArtSources(cardId)}
    />
  );
}
