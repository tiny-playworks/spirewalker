import { useMemo, useState } from 'react';
import { ITEM_BY_ID, RARITY_LABELS } from '@/game/content';
import { calculateSettlement, getCombatModifiers } from '@/game/progression';
import { getItemDefinition } from '@/game/rewards';
import { createEncounterConfig, type EquipTarget } from '@/game/run';
import { useGameStore } from '@/game/store';
import type { CombatEvent, CombatHudSnapshot, RewardItem, RouteOption, RunStateV2, ShopOffer } from '@/game/types';
import { CombatHost } from '@/phaser/CombatHost';
import { CombatHud } from './CombatHud';
import { ItemCard, tagLabel } from './ItemCard';
import { MenuPanelLayer } from './MenuPanels';

export function App() {
  const run = useGameStore((state) => state.run);
  return (
    <main className="game-shell">
      {run ? <RunRouter run={run} /> : <MainMenu />}
      <MenuPanelLayer />
    </main>
  );
}

function MainMenu() {
  const profile = useGameStore((state) => state.profile);
  const savedRunAvailable = useGameStore((state) => state.savedRunAvailable);
  const startRun = useGameStore((state) => state.startRun);
  const continueRun = useGameStore((state) => state.continueRun);
  const openPanel = useGameStore((state) => state.setMenuPanel);
  const grantDebug = useGameStore((state) => state.grantDebugProgress);
  const params = new URLSearchParams(window.location.search);
  const isDebug = params.has('debug');
  const e2eSeed = params.has('e2e') ? 20_260_803 : undefined;
  return (
    <section className="main-menu">
      <div className="key-art" style={{ backgroundImage: `url(${keyArtUrl()})` }} />
      <div className="key-art-wash" />
      <div className="menu-copy">
        <span className="studio-mark">TINY PLAYWORKS · DESKTOP ROGUELITE</span>
        <div className="title-lockup">
          <span className="title-rune">✦</span>
          <h1>辉芯工坊</h1>
          <p>在失控的魔导试炼中，拼出属于你的双枪回路。</p>
        </div>
        <div className="menu-actions">
          <button className="primary-button launch-button" onClick={() => startRun(e2eSeed)} data-testid="new-run">
            <span>开始试炼</span><small>10–15 分钟单人纵切片</small>
          </button>
          {savedRunAvailable ? <button className="secondary-button" onClick={continueRun}>继续上次试炼</button> : null}
          <div className="menu-grid">
            <button className="glass-button" onClick={() => openPanel('global-tree')}><span>共享回路</span><small>{profile.accountAvailablePoints} 点可用</small></button>
            <button className="glass-button" onClick={() => openPanel('character-tree')}><span>角色技能树</span><small>{profile.characters.artificer.availablePoints} 点可用</small></button>
            <button className="glass-button" onClick={() => openPanel('settings')}><span>控制台</span><small>音量与动态效果</small></button>
          </div>
          {isDebug ? <button className="debug-button" onClick={grantDebug}>调试：获得技能点</button> : null}
        </div>
        <div className="profile-strip">
          <span>已出发 <b>{profile.runsStarted}</b> 次</span>
          <span>已通关 <b>{profile.victories}</b> 次</span>
          <span>账号经验 <b>{profile.accountXp}</b></span>
          <span>角色经验 <b>{profile.characters.artificer.xp}</b></span>
        </div>
      </div>
      <div className="desktop-corner">WASD + 鼠标 · 仅桌面端</div>
    </section>
  );
}

function RunRouter({ run }: { run: RunStateV2 }) {
  if (run.screen === 'route') return <RouteScreen run={run} />;
  if (run.screen === 'combat') return <CombatScreen run={run} />;
  if (run.screen === 'reward') return <RewardScreen run={run} />;
  if (run.screen === 'shop') return <ShopScreen run={run} />;
  return <SettlementScreen run={run} />;
}

function RouteScreen({ run }: { run: RunStateV2 }) {
  const choose = useGameStore((state) => state.chooseRoute);
  return (
    <section className="between-screen route-screen">
      <BetweenHeader run={run} eyebrow="路线抉择" title={`试炼房间 ${run.roomIndex + 1} / 3`} />
      <div className="route-stage">
        <div className="route-connector"><i /><span>只预告类别，宝箱内容仍然未知</span><i /></div>
        <div className="route-options">
          {run.routeChoices.map((route) => <RouteCard key={route.id} route={route} onChoose={() => choose(route)} />)}
        </div>
      </div>
      <LoadoutSummary run={run} />
    </section>
  );
}

function RouteCard({ route, onChoose }: { route: RouteOption; onChoose(): void }) {
  const info = routeInfo(route);
  return (
    <button className={`route-card route-${route.category}`} onClick={onChoose} data-testid={`route-${route.category}`}>
      <span className="route-risk">{route.elite ? '高风险 · 高品质' : '普通战斗'}</span>
      <span className="route-icon">{info.icon}</span>
      <strong>{info.title}</strong>
      <p>{info.description}</p>
      <span className="route-enter">进入房间 <b>→</b></span>
    </button>
  );
}

function CombatScreen({ run }: { run: RunStateV2 }) {
  const profile = useGameStore((state) => state.profile);
  const settings = useGameStore((state) => state.settings);
  const finishCombat = useGameStore((state) => state.finishCombat);
  const [hud, setHud] = useState<CombatHudSnapshot | null>(null);
  const params = new URLSearchParams(window.location.search);
  const boss = run.roomIndex >= 3 && run.currentRoute === null;
  const config = useMemo(() => createEncounterConfig(run, profile, {
    boss,
    debugFast: params.has('e2e'),
    stressTest: params.has('stress'),
  }), [boss, profile, run]);
  return (
    <section className="combat-screen">
      <CombatHost
        config={config}
        masterVolume={settings.masterVolume}
        reducedMotion={settings.reducedMotion}
        showDamageNumbers={settings.showDamageNumbers}
        onHud={setHud}
        onEvent={(_event: CombatEvent) => undefined}
        onResult={(result) => finishCombat(result, boss)}
      />
      <CombatHud hud={hud} boss={boss} />
    </section>
  );
}

function RewardScreen({ run }: { run: RunStateV2 }) {
  const profile = useGameStore((state) => state.profile);
  const claim = useGameStore((state) => state.claimReward);
  const reroll = useGameStore((state) => state.rerollReward);
  const canReroll = profile.globalTalents.includes('fortune-reroll') && !run.chestRerollUsed;
  return (
    <section className="between-screen reward-screen">
      <BetweenHeader run={run} eyebrow={run.currentRoute?.elite ? '精英宝箱' : '战利品'} title="只带走一件" />
      <div className="reward-intro">
        <span className="chest-emblem">✦</span>
        <p>这次不一定是质变。补齐、转向，或者为下一间房留出可能。</p>
        {canReroll ? <button className="text-button" onClick={reroll}>免费重开此宝箱</button> : null}
      </div>
      <div className={`reward-grid rewards-${run.rewardOffers.length}`}>
        {run.rewardOffers.map((item) => (
          <ItemCard key={item.uid} item={item} footer={<EquipButtons item={item} run={run} onEquip={(target) => claim(item, target)} />} />
        ))}
      </div>
    </section>
  );
}

function ShopScreen({ run }: { run: RunStateV2 }) {
  const profile = useGameStore((state) => state.profile);
  const buy = useGameStore((state) => state.buyShopItem);
  const reroll = useGameStore((state) => state.rerollShop);
  const heal = useGameStore((state) => state.healAtShop);
  const startBoss = useGameStore((state) => state.startBoss);
  const modifiers = getCombatModifiers(profile, run.relics);
  const healPrice = Math.max(1, Math.round(25 * (1 - modifiers.shopDiscount)));
  const freeReroll = profile.globalTalents.includes('workshop-reroll') && !run.shopFreeRerollUsed;
  const rerollPrice = freeReroll ? 0 : 20 + run.shopRerollCount * 5;
  return (
    <section className="between-screen shop-screen">
      <BetweenHeader run={run} eyebrow="Boss 前强制整备" title="琥珀商栈" />
      <div className="shop-toolbar">
        <div><span>持有金币</span><strong>◆ {run.gold}</strong></div>
        <button className="secondary-button" disabled={run.gold < healPrice || run.hp >= run.maxHp} onClick={heal}>修复 30 生命 · {healPrice} 金币</button>
        <button className="secondary-button" disabled={run.gold < rerollPrice} onClick={reroll}>{freeReroll ? '免费刷新货架' : `刷新货架 · ${rerollPrice}`}</button>
      </div>
      <div className="shop-grid">
        {run.shopOffers.map((offer) => <ShopCard key={offer.id} offer={offer} run={run} onBuy={(target) => buy(offer.id, target)} />)}
      </div>
      <div className="boss-gate">
        <div><span className="eyebrow">最终房间</span><strong>失控熔炉守卫已经苏醒</strong><p>离开商店后无法返回。</p></div>
        <button className="danger-button" onClick={startBoss} data-testid="start-boss">挑战 Boss →</button>
      </div>
      <LoadoutSummary run={run} />
    </section>
  );
}

function ShopCard({ offer, run, onBuy }: { offer: ShopOffer; run: RunStateV2; onBuy(target: EquipTarget): void }) {
  return (
    <div className={`shop-offer ${offer.sold ? 'sold' : ''}`}>
      <ItemCard item={offer.item} compact />
      <div className="shop-price">◆ {offer.price}</div>
      {offer.sold ? <span className="sold-stamp">已售出</span> : (
        <EquipButtons item={offer.item} run={run} onEquip={onBuy} disabled={run.gold < offer.price} compact />
      )}
    </div>
  );
}

function EquipButtons({ item, run, onEquip, disabled = false, compact = false }: {
  item: RewardItem;
  run: RunStateV2;
  onEquip(target: EquipTarget): void;
  disabled?: boolean;
  compact?: boolean;
}) {
  if (item.kind === 'relic') {
    if (run.relics.length < 6) return <button className="card-button" disabled={disabled} onClick={() => onEquip({})}>带走秘宝</button>;
    return (
      <div className="replace-buttons">
        {run.relics.map((relic, index) => (
          <button disabled={disabled} key={relic.uid} onClick={() => onEquip({ relicSlot: index })}>替换 {index + 1}</button>
        ))}
      </div>
    );
  }
  return (
    <div className={`equip-pair ${compact ? 'compact' : ''}`}>
      <button className="card-button" disabled={disabled} onClick={() => onEquip({ weaponSlot: 0 })}>{item.kind === 'weapon' ? '替换' : '装到'}主武器</button>
      <button className="card-button secondary" disabled={disabled} onClick={() => onEquip({ weaponSlot: 1 })}>{item.kind === 'weapon' ? '替换' : '装到'}副武器</button>
    </div>
  );
}

function SettlementScreen({ run }: { run: RunStateV2 }) {
  const profile = useGameStore((state) => state.profile);
  const lastSettlement = useGameStore((state) => state.lastSettlement);
  const startRun = useGameStore((state) => state.startRun);
  const returnToMenu = useGameStore((state) => state.returnToMenu);
  const breakdown = lastSettlement ?? calculateSettlement(run.report);
  const victory = run.outcome === 'victory';
  return (
    <section className={`settlement-screen ${victory ? 'victory' : 'defeat'}`}>
      <div className="settlement-art" style={{ backgroundImage: `url(${keyArtUrl()})` }} />
      <div className="settlement-panel">
        <span className="eyebrow">{victory ? '试炼完成' : '工匠已撤回'}</span>
        <h1>{victory ? '熔炉重新安静下来' : '这局没有白打'}</h1>
        <p>{victory ? '你的构筑通过了第一次完整验证。更高难度以后再说。' : '局内装备已经消散，但两种经验都被带回了工坊。'}</p>
        <div className="xp-columns">
          <div><span>账号经验</span><strong>+{breakdown.total}</strong><small>当前可用 {profile.accountAvailablePoints} 点</small></div>
          <div><span>角色经验</span><strong>+{breakdown.characterTotal}</strong><small>当前可用 {profile.characters.artificer.availablePoints} 点</small></div>
        </div>
        <div className="settlement-breakdown">
          <span>房间 <b>{breakdown.roomXp}</b></span>
          <span>精英 <b>{breakdown.eliteXp}</b></span>
          <span>Boss <b>{breakdown.bossReachXp + breakdown.bossVictoryXp}</b></span>
          <span>收获 <b>{breakdown.rewardXp}</b></span>
          <span>战斗 <b>{breakdown.combatXp}</b></span>
          <span>效率 <b>{breakdown.efficiencyXp}</b></span>
        </div>
        <div className="settlement-actions">
          <button className="primary-button" onClick={() => startRun()} data-testid="retry-run">再开一局</button>
          <button className="secondary-button" onClick={returnToMenu}>返回工坊</button>
        </div>
      </div>
    </section>
  );
}

function BetweenHeader({ run, eyebrow, title }: { run: RunStateV2; eyebrow: string; title: string }) {
  return (
    <header className="between-header">
      <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div>
      <div className="run-resources"><span>生命 <b>{Math.ceil(run.hp)} / {run.maxHp}</b></span><span>护盾 <b>{Math.ceil(run.shield)}</b></span><span>金币 <b>◆ {run.gold}</b></span></div>
    </header>
  );
}

function LoadoutSummary({ run }: { run: RunStateV2 }) {
  return (
    <aside className="loadout-summary">
      <div className="loadout-title"><span>当前构筑</span><small>主副武器独立换弹</small></div>
      {run.weapons.map((slot, index) => {
        const weapon = getItemDefinition(slot.weapon);
        return (
          <div className={`loadout-weapon tag-${weapon.tag}`} key={slot.weapon.uid}>
            <b>{index === 0 ? '主' : '副'}</b>
            <span><strong>{weapon.name}</strong><small>{RARITY_LABELS[slot.weapon.rarity]} · {tagLabel(weapon.tag)}</small></span>
            <i>{slot.muzzle ? ITEM_BY_ID.get(slot.muzzle.definitionId)?.name : '空枪头'}</i>
            <i>{slot.core ? ITEM_BY_ID.get(slot.core.definitionId)?.name : '空核心'}</i>
          </div>
        );
      })}
      <div className="relic-strip">
        {Array.from({ length: 6 }, (_, index) => {
          const relic = run.relics[index];
          return <span key={relic?.uid ?? `empty-${index}`} title={relic ? ITEM_BY_ID.get(relic.definitionId)?.name : '空秘宝位'}>{relic ? '✦' : '·'}</span>;
        })}
      </div>
    </aside>
  );
}

function routeInfo(route: RouteOption) {
  if (route.category === 'weapon') return { icon: '⌁', title: '武器宝箱', description: '战斗后从三把武器中带走一把。' };
  if (route.category === 'muzzle') return { icon: '➤', title: '枪头模块', description: '改变弹道、穿透、分裂或爆炸。' };
  if (route.category === 'core') return { icon: '◈', title: '核心模块', description: '为武器装入电弧、爆破或霜晶触发。' };
  if (route.category === 'relic') return { icon: '✦', title: '秘宝宝箱', description: '获得一件持续生效的被动秘宝。' };
  if (route.category === 'gold') return { icon: '◆', title: '金币储藏', description: '内容稳定，方便在 Boss 前完成购买。' };
  return { icon: '♜', title: '精英工坊', description: '更危险的敌人，品质明显更高但类别未知。' };
}

function keyArtUrl(): string {
  return new URL('assets/v2/art/workshop-key-art.webp', document.baseURI).href;
}
