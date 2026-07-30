import { lazy, Suspense, useEffect, useState } from 'react';
import { AppCursor } from '@/app/AppCursor';
import { MobileLandscapeGate } from '@/app/MobileLandscapeGate';
import type { ArchiveView } from '@/features/archive/ArchivePage';
import { MainMenuPage } from '@/features/main-menu/MainMenuPage';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { useGameStore } from '@/game/store/gameStore';
import * as noticeStyles from './actionNotice.css';
import './routeStyles';

const ArchivePage = lazy(() => import('@/features/archive/ArchivePage').then((module) => ({ default: module.ArchivePage })));
const BattlePage = lazy(() => import('@/features/battle/BattlePage').then((module) => ({ default: module.BattlePage })));
const EventPage = lazy(() => import('@/features/event/EventPage').then((module) => ({ default: module.EventPage })));
const DebugPanel = lazy(() => import('@/features/debug/DebugPanel').then((module) => ({ default: module.DebugPanel })));
const MapPage = lazy(() => import('@/features/map/MapPage').then((module) => ({ default: module.MapPage })));
const RunOverviewPanel = lazy(() => import('@/features/overview/RunOverviewPanel').then((module) => ({ default: module.RunOverviewPanel })));
const RestPage = lazy(() => import('@/features/rest/RestPage').then((module) => ({ default: module.RestPage })));
const RewardPage = lazy(() => import('@/features/reward/RewardPage').then((module) => ({ default: module.RewardPage })));
const ShopPage = lazy(() => import('@/features/shop/ShopPage').then((module) => ({ default: module.ShopPage })));
const SettlementPage = lazy(() => import('@/features/settlement/SettlementPage').then((module) => ({ default: module.SettlementPage })));
const ActTransitionPage = lazy(() => import('@/features/settlement/ActTransitionPage').then((module) => ({ default: module.ActTransitionPage })));

export function App() {
  const run = useGameStore((s) => s.run);
  const profile = useGameStore((s) => s.profile);
  const startRun = useGameStore((s) => s.startRun);
  const resetProfile = useGameStore((s) => s.resetProfile);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [archiveView, setArchiveView] = useState<ArchiveView | null>(null);

  useEffect(() => {
    if (!run) setOverviewOpen(false);
  }, [run]);

  const page = (() => {
    if (archiveView) {
      return <Suspense fallback={<div className="boot">正在展开档案…</div>}><ArchivePage
        view={archiveView}
        run={run}
        profile={profile}
        onChangeView={setArchiveView}
        onClose={() => setArchiveView(null)}
        onResetProfile={resetProfile}
        onStartRun={() => {
          setArchiveView(null);
          startRun(createMapRun(Date.now() & 0xffff_ffff));
        }}
      /></Suspense>;
    }
    if (!run) return <MainMenuPage onOpenArchive={setArchiveView} />;
    if (run.meta.actTransitionFrom) return <Suspense fallback={<div className="boot">正在开启下一章…</div>}><ActTransitionPage /></Suspense>;
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
        return <Suspense fallback={<div className="boot">正在整理本局记录…</div>}><SettlementPage outcome="defeat" onOpenArchive={() => setArchiveView('collection')} /></Suspense>;
      case 'victory':
        return <Suspense fallback={<div className="boot">正在整理本局记录…</div>}><SettlementPage outcome="victory" onOpenArchive={() => setArchiveView('collection')} /></Suspense>;
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
      <MobileLandscapeGate active={Boolean(run)}>
        <Suspense fallback={<div className="boot"><span className="boot-rune">正在读取尖塔回响…</span></div>}>{page}</Suspense>
        {run ? (
          <Suspense fallback={null}><RunOverviewPanel
            run={run}
            open={overviewOpen}
            onToggle={() => setOverviewOpen((value) => !value)}
            onClose={() => setOverviewOpen(false)}
          /></Suspense>
        ) : null}
        <Suspense fallback={null}><DebugPanel /></Suspense>
        <ActionNotice />
      </MobileLandscapeGate>
      <AppCursor />
    </>
  );
}

function ActionNotice() {
  const message = useGameStore((s) => s.actionNotice);
  const clear = useGameStore((s) => s.clearActionNotice);
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(clear, 3200);
    return () => window.clearTimeout(timer);
  }, [message, clear]);
  if (!message) return null;
  return (
    <div className={noticeStyles.notice} role="status">
      <span>{message}</span>
      <button type="button" className={noticeStyles.dismiss} aria-label="关闭提示" onClick={clear}>×</button>
    </div>
  );
}
