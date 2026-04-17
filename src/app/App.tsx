import { BattlePage } from '@/features/battle/BattlePage';
import { EventPage } from '@/features/event/EventPage';
import { DebugPanel } from '@/features/debug/DebugPanel';
import { MainMenuPage } from '@/features/main-menu/MainMenuPage';
import { MapPage } from '@/features/map/MapPage';
import { RestPage } from '@/features/rest/RestPage';
import { RewardPage } from '@/features/reward/RewardPage';
import { ShopPage } from '@/features/shop/ShopPage';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { useGameStore } from '@/game/store/gameStore';

export function App() {
  const run = useGameStore((s) => s.run);
  const page = (() => {
    if (!run) return <MainMenuPage />;
    switch (run.screen.type) {
      case 'map':
        return <MapPage />;
      case 'battle':
        return <BattlePage />;
      case 'reward':
        return <RewardPage />;
      case 'shop':
        return <ShopPage />;
      case 'rest':
        return <RestPage />;
      case 'event':
        return <EventPage />;
      case 'game_over':
        return <GameOverScreen />;
      case 'victory':
        return <VictoryScreen />;
      default:
        return (
          <div className="boot">
            未实现的界面：{(run.screen as { type: string }).type}
          </div>
        );
    }
  })();
  return (
    <>
      {page}
      <DebugPanel />
    </>
  );
}

function GameOverScreen() {
  const initRun = useGameStore((s) => s.initRun);
  const returnToMainMenu = useGameStore((s) => s.returnToMainMenu);
  return (
    <div className="boot game-over">
      <p>本次探索结束</p>
      <div className="end-screen-actions">
        <button
          type="button"
          className="btn-end-turn"
          onClick={() => initRun(createMapRun(Date.now() & 0xffff_ffff))}
        >
          再来一局
        </button>
        <button type="button" className="btn-end-turn btn-end-turn--ghost" onClick={returnToMainMenu}>
          返回主菜单
        </button>
      </div>
    </div>
  );
}

function VictoryScreen() {
  const initRun = useGameStore((s) => s.initRun);
  const returnToMainMenu = useGameStore((s) => s.returnToMainMenu);
  return (
    <div className="boot game-over">
      <h2 className="subscreen-title">试玩通关</h2>
      <p className="subscreen-tip">你已击败第二层 Boss，本局试玩路线完结。</p>
      <div className="end-screen-actions">
        <button
          type="button"
          className="btn-end-turn"
          onClick={() => initRun(createMapRun(Date.now() & 0xffff_ffff))}
        >
          再来一局
        </button>
        <button type="button" className="btn-end-turn btn-end-turn--ghost" onClick={returnToMainMenu}>
          返回主菜单
        </button>
      </div>
    </div>
  );
}
