import { CHARACTER_TALENTS, GLOBAL_TALENTS } from '@/game/content';
import { accountPointCost, characterPointCost } from '@/game/progression';
import { useGameStore } from '@/game/store';

export function MenuPanelLayer() {
  const panel = useGameStore((state) => state.menuPanel);
  const close = useGameStore((state) => state.setMenuPanel);
  if (panel === 'none') return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="workshop-modal">
        <button className="modal-close" onClick={() => close('none')} aria-label="关闭">×</button>
        {panel === 'global-tree' ? <GlobalTree /> : null}
        {panel === 'character-tree' ? <CharacterTree /> : null}
        {panel === 'settings' ? <SettingsPanel /> : null}
      </div>
    </div>
  );
}

function GlobalTree() {
  const profile = useGameStore((state) => state.profile);
  const buy = useGameStore((state) => state.buyGlobalTalent);
  const reset = useGameStore((state) => state.resetGlobalTree);
  const branches = [
    { id: 'survival', name: '生存回路', icon: '◇' },
    { id: 'workshop', name: '工坊经营', icon: '⚙' },
    { id: 'fortune', name: '寻宝感应', icon: '✦' },
  ] as const;
  return (
    <section className="tree-panel">
      <div className="panel-heading">
        <div><span className="eyebrow">账号共享</span><h2>全局技能树</h2></div>
        <div className="point-badge">可用技能点 <strong>{profile.accountAvailablePoints}</strong></div>
      </div>
      <p className="tree-intro">所有角色共同受益，三条分支最终都能点满。下一个技能点需要 {accountPointCost(profile.accountTotalPoints)} 经验。</p>
      <div className="global-branches">
        {branches.map((branch) => (
          <div className={`talent-branch branch-${branch.id}`} key={branch.id}>
            <h3><span>{branch.icon}</span>{branch.name}</h3>
            {GLOBAL_TALENTS.filter((talent) => talent.branch === branch.id).map((talent) => {
              const purchased = profile.globalTalents.includes(talent.id);
              return (
                <button
                  type="button"
                  className={`talent-node ${purchased ? 'purchased' : ''}`}
                  key={talent.id}
                  onClick={() => buy(talent.id)}
                  disabled={purchased}
                >
                  <span className="talent-tier">{talent.tier}</span>
                  <span><strong>{talent.name}</strong><small>{talent.description}</small></span>
                  <b>{purchased ? '已激活' : `${talent.cost} 点`}</b>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <button className="text-button" onClick={reset}>免费重置全局树</button>
    </section>
  );
}

function CharacterTree() {
  const profile = useGameStore((state) => state.profile);
  const choose = useGameStore((state) => state.chooseCharacterTalent);
  const reset = useGameStore((state) => state.resetCharacterTree);
  const character = profile.characters.artificer;
  return (
    <section className="tree-panel">
      <div className="panel-heading">
        <div><span className="eyebrow">魔导工匠 · 角色专属</span><h2>超频与偏转技能树</h2></div>
        <div className="point-badge">可用角色点 <strong>{character.availablePoints}</strong></div>
      </div>
      <p className="tree-intro">每层三选一，同层切换会自动退还旧节点。下一个角色点需要 {characterPointCost(character.totalPoints)} 经验。</p>
      <div className="character-tiers">
        {[1, 2, 3, 4, 5].map((tier) => (
          <div className="character-tier" key={tier}>
            <div className="tier-marker"><span>{tier}</span><small>{tier} 点阶</small></div>
            <div className="tier-options">
              {CHARACTER_TALENTS.filter((talent) => talent.tier === tier).map((talent) => {
                const selected = character.selections[String(tier)] === talent.id;
                return (
                  <button className={`character-node ${selected ? 'selected' : ''}`} key={talent.id} onClick={() => choose(talent.id)}>
                    <strong>{talent.name}</strong>
                    <small>{talent.description}</small>
                    <b>{selected ? '当前选择' : `${talent.cost} 点`}</b>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button className="text-button" onClick={reset}>免费重置角色树</button>
    </section>
  );
}

function SettingsPanel() {
  const settings = useGameStore((state) => state.settings);
  const update = useGameStore((state) => state.updateSettings);
  return (
    <section className="settings-panel">
      <span className="eyebrow">桌面端设置</span>
      <h2>工坊控制台</h2>
      <label className="setting-row">
        <span><strong>主音量</strong><small>射击、命中与反馈音效</small></span>
        <input type="range" min="0" max="1" step="0.05" value={settings.masterVolume} onChange={(event) => update({ masterVolume: Number(event.target.value) })} />
        <b>{Math.round(settings.masterVolume * 100)}%</b>
      </label>
      <label className="setting-row checkbox-row">
        <span><strong>减少动态效果</strong><small>缩短奖励动画并关闭镜头震动</small></span>
        <input type="checkbox" checked={settings.reducedMotion} onChange={(event) => update({ reducedMotion: event.target.checked })} />
      </label>
      <label className="setting-row checkbox-row">
        <span><strong>显示伤害数字</strong><small>在敌人上方显示命中数值</small></span>
        <input type="checkbox" checked={settings.showDamageNumbers} onChange={(event) => update({ showDamageNumbers: event.target.checked })} />
      </label>
      <div className="desktop-only-note">仅支持桌面键鼠，设计分辨率 1920×1080。</div>
    </section>
  );
}
