import { type ReactNode, useEffect, useState } from 'react';

/** 依次尝试多个图片源，全部加载失败时回退到 fallback 节点（文字/CSS 占位）。 */
export function FallbackImg({
  sources,
  alt,
  className,
  fallback = null,
}: {
  sources: string[];
  alt: string;
  className?: string;
  fallback?: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setIndex(0);
  }, [sources.join('|')]);
  if (index >= sources.length) return <>{fallback}</>;
  return (
    <img
      className={className}
      alt={alt}
      src={sources[index]}
      draggable={false}
      onError={() => setIndex((i) => i + 1)}
    />
  );
}
