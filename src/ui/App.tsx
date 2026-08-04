import { calculateSettlement } from '@/game/progression';
import { useGameStore } from '@/game/store';
import { GameHost } from '@/phaser/GameHost';
import { MenuPanelLayer } from './MenuPanels';

export function App() {
  const gameMode = useGameStore((state) => state.gameMode);
  return (
    <main className="game-shell">
      {gameMode === 'title' ? <TitleScreen /> : null}
      {gameMode === 'workshop' || gameMode === 'run' ? <GameHost /> : null}
      {gameMode === 'settlement' ? <SettlementScreen /> : null}
      <MenuPanelLayer />
    </main>
  );
}

function TitleScreen() {
  const profile = useGameStore((state) => state.profile);
  const savedRunAvailable = useGameStore((state) => state.savedRunAvailable);
  const enterWorkshop = useGameStore((state) => state.enterWorkshop);
  const continueRun = useGameStore((state) => state.continueRun);
  const openPanel = useGameStore((state) => state.setMenuPanel);
  const grantDebug = useGameStore((state) => state.grantDebugProgress);
  const isDebug = new URLSearchParams(window.location.search).has('debug');
  return (
    <section className="title-screen">
      <div className="title-key-art" style={{ backgroundImage: `url(${keyArtUrl()})` }} />
      <div className="title-shade" />
      <div className="title-menu">
        <span className="studio-mark">TINY PLAYWORKS · DESKTOP ROGUELITE</span>
        <div className="title-lockup"><span className="title-rune">✦</span><h1>辉芯工坊</h1><p>踏进工坊，亲手启动你的下一次双枪试炼。</p></div>
        <nav className="title-actions">
          <button className="title-primary" onClick={enterWorkshop} data-testid="enter-workshop">进入工坊</button>
          {savedRunAvailable ? <button onClick={continueRun} data-testid="continue-run">继续上次试炼</button> : null}
          <button onClick={() => openPanel('global-tree')}>共享回路 <small>{profile.accountAvailablePoints} 点可用</small></button>
          <button onClick={() => openPanel('character-tree')}>角色技能树 <small>{profile.characters.artificer.availablePoints} 点可用</small></button>
          <button onClick={() => openPanel('settings')}>设置</button>
          {isDebug ? <button onClick={grantDebug}>调试：获得技能点</button> : null}
        </nav>
        <div className="title-profile"><span>出发 {profile.runsStarted}</span><span>通关 {profile.victories}</span><span>账号经验 {profile.accountXp}</span><span>角色经验 {profile.characters.artificer.xp}</span></div>
      </div>
      <div className="desktop-corner">WASD + 鼠标 · 仅桌面端</div>
    </section>
  );
}

function SettlementScreen() {
  const run = useGameStore((state) => state.run);
  const profile = useGameStore((state) => state.profile);
  const lastSettlement = useGameStore((state) => state.lastSettlement);
  const returnToWorkshop = useGameStore((state) => state.returnToWorkshop);
  const startRun = useGameStore((state) => state.startRun);
  if (!run) return null;
  const breakdown = lastSettlement ?? calculateSettlement(run.report);
  return (
    <section className="settlement-screen defeat">
      <div className="settlement-art" style={{ backgroundImage: `url(${keyArtUrl()})` }} />
      <div className="settlement-panel">
        <span className="eyebrow">工匠已撤回</span>
        <h1>这局没有白打</h1>
        <p>局内装备已经消散，但已经取得的账号经验和角色经验都带回了工坊。</p>
        <div className="xp-columns"><div><span>账号经验</span><strong>+{breakdown.total}</strong><small>当前可用 {profile.accountAvailablePoints} 点</small></div><div><span>角色经验</span><strong>+{breakdown.characterTotal}</strong><small>当前可用 {profile.characters.artificer.availablePoints} 点</small></div></div>
        <div className="settlement-breakdown"><span>房间 <b>{breakdown.roomXp}</b></span><span>精英 <b>{breakdown.eliteXp}</b></span><span>收获 <b>{breakdown.rewardXp}</b></span><span>战斗 <b>{breakdown.combatXp}</b></span><span>效率 <b>{breakdown.efficiencyXp}</b></span></div>
        <div className="settlement-actions"><button className="primary-button" onClick={() => startRun()} data-testid="retry-run">再开一局</button><button className="secondary-button" onClick={returnToWorkshop}>返回工坊</button></div>
      </div>
    </section>
  );
}

function keyArtUrl(): string {
  return new URL('assets/v2/art/workshop-key-art.webp', document.baseURI).href;
}
