import { createMapRun } from '@/game/core/engine/createMapRun';
import { clearSavedRun, hasSavedRun, loadRunFromLocalStorage } from '@/game/core/persistence/saveRun';
import { useGameStore } from '@/game/store/gameStore';

export function MainMenuPage() {
  const initRun = useGameStore((s) => s.initRun);
  const canContinue = hasSavedRun();

  return (
    <div className="boot main-menu-root">
      <div className="main-menu-backdrop" aria-hidden>
        <div className="main-menu-vignette" />
        <div className="main-menu-grid" />
      </div>
      <div className="main-menu-content">
        <header className="main-menu-header">
          <p className="main-menu-kicker">肉鸽卡牌 · 试玩</p>
          <h1 className="main-menu-title">
            <span className="main-menu-title-main">黏液尖塔</span>
          </h1>
          <p className="main-menu-lead">
            命令驱动战斗与地图，进度自动保存在本机浏览器。
          </p>
        </header>

        <section className="main-menu-card" aria-label="开始游戏">
          <div className="main-menu-card-inner">
            <button
              type="button"
              className="main-menu-btn main-menu-btn--primary"
              disabled={!canContinue}
              onClick={() => {
                const saved = loadRunFromLocalStorage();
                if (saved) initRun(saved);
              }}
            >
              <span className="main-menu-btn-label">继续冒险</span>
              <span className="main-menu-btn-hint">读取上次的存档</span>
            </button>
            {!canContinue ? (
              <p className="main-menu-inline-hint">暂无存档，可从下方开始新一局。</p>
            ) : null}
            <button
              type="button"
              className="main-menu-btn main-menu-btn--secondary"
              onClick={() => {
                clearSavedRun();
                initRun(createMapRun(Date.now() & 0xffff_ffff));
              }}
            >
              <span className="main-menu-btn-label">新游戏</span>
              <span className="main-menu-btn-hint">清空存档并重新出发</span>
            </button>
          </div>
        </section>

        <footer className="main-menu-footer">存档仅保存在本机浏览器中</footer>
      </div>
    </div>
  );
}
