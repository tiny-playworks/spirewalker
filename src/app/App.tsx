import { useEffect, useState } from 'react';
import { AppCursor } from '@/app/AppCursor';
import { BattlePage } from '@/features/battle/BattlePage';
import { EventPage } from '@/features/event/EventPage';
import { DebugPanel } from '@/features/debug/DebugPanel';
import { MainMenuPage } from '@/features/main-menu/MainMenuPage';
import { MapPage } from '@/features/map/MapPage';
import { RunOverviewPanel } from '@/features/overview/RunOverviewPanel';
import { RestPage } from '@/features/rest/RestPage';
import { RewardPage } from '@/features/reward/RewardPage';
import { ShopPage } from '@/features/shop/ShopPage';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { useGameStore } from '@/game/store/gameStore';
import { sceneThemeClass } from '@/styles/sceneTheme.css';
import * as subscreenStyles from '@/styles/subscreen.css';

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export function App() {
  const run = useGameStore((s) => s.run);
  const [overviewOpen, setOverviewOpen] = useState(false);

  useEffect(() => {
    if (!run) setOverviewOpen(false);
  }, [run]);

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
      {run ? (
        <RunOverviewPanel
          run={run}
          open={overviewOpen}
          onToggle={() => setOverviewOpen((value) => !value)}
          onClose={() => setOverviewOpen(false)}
        />
      ) : null}
      <DebugPanel />
      <AppCursor />
    </>
  );
}

function GameOverScreen() {
  const initRun = useGameStore((s) => s.initRun);
  const returnToMainMenu = useGameStore((s) => s.returnToMainMenu);
  return (
    <div className={cx('boot', sceneThemeClass, subscreenStyles.screenRoot, subscreenStyles.screenStack)}>
      <p>本次探索结束</p>
      <div className={subscreenStyles.actionsRow}>
        <button
          type="button"
          className={cx(subscreenStyles.actionButton, subscreenStyles.actionButtonTone.primary)}
          onClick={() => initRun(createMapRun(Date.now() & 0xffff_ffff))}
        >
          再来一局
        </button>
        <button
          type="button"
          className={cx(subscreenStyles.actionButton, subscreenStyles.actionButtonTone.ghost)}
          onClick={returnToMainMenu}
        >
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
    <div className={cx('boot', sceneThemeClass, subscreenStyles.screenRoot, subscreenStyles.screenStack)}>
      <h2 className={subscreenStyles.title}>试玩通关</h2>
      <p className={subscreenStyles.tip}>你已击败第二层 Boss，本局试玩路线完结。</p>
      <div className={subscreenStyles.actionsRow}>
        <button
          type="button"
          className={cx(subscreenStyles.actionButton, subscreenStyles.actionButtonTone.primary)}
          onClick={() => initRun(createMapRun(Date.now() & 0xffff_ffff))}
        >
          再来一局
        </button>
        <button
          type="button"
          className={cx(subscreenStyles.actionButton, subscreenStyles.actionButtonTone.ghost)}
          onClick={returnToMainMenu}
        >
          返回主菜单
        </button>
      </div>
    </div>
  );
}
