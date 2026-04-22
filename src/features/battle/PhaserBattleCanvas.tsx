import { useEffect, useRef } from 'react';
import type { Game } from 'phaser';
import { createBattleGame } from '@/game/phaser/gameFactory';

export function PhaserBattleCanvas({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const game: Game = createBattleGame(el);

    /** 父容器 flex 变化时只刷新缩放矩阵，不改变游戏内部分辨率（逻辑坐标仍为 DESIGN_WIDTH×DESIGN_HEIGHT）。 */
    const ro = new ResizeObserver(() => {
      game.scale.refresh();
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      game.destroy(true);
    };
  }, []);

  return <div className={className} ref={containerRef} />;
}
