import { useState } from 'react';
import { ITEM_BY_ID, RARITY_LABELS } from '@/game/content';
import { deriveStats } from '@/game/derivedStats';
import { getCombatModifiers } from '@/game/progression';
import { getDismantleValue } from '@/game/rewards';
import { useGameStore } from '@/game/store';
import type { CombatHudSnapshot, LootDrop, RewardItem, RunStateV2, WorldOverlay } from '@/game/types';

export function WorldHud({ run }: { run: RunStateV2 | null }) {
  const objective = !run ? '在工坊中选择交互台' : phaseObjective(run);
  return (
    <div className="world-hud" data-testid="world-hud">
      <div className="world-objective"><span>{run ? `试炼房间 ${Math.min(3, run.roomIndex + 1)} / 3` : '辉芯工坊'}</span><strong>{objective}</strong></div>
      {run ? (
        <div className="world-resources">
          <span>生命 <b>{Math.ceil(run.hp)} / {run.maxHp}</b></span>
          <span>护盾 <b>{Math.ceil(run.shield)}</b></span>
          <span>◆ <b>{run.gold}</b></span>
        </div>
      ) : null}
      <div className="world-shortcuts"><kbd>Esc</kbd>暂停 <kbd>C</kbd>人物 <kbd>I</kbd>装备 <kbd>Tab</kbd>属性</div>
      {run ? <div className="world-weapon-switch">{run.weapons.map((slot, index) => <span className={run.activeWeapon === index ? 'active' : ''} key={slot.weapon.uid}><kbd>{index === 0 ? '主' : '副'}</kbd>{ITEM_BY_ID.get(slot.weapon.definitionId)?.name}</span>)}<small>Q / 滚轮切换</small></div> : null}
    </div>
  );
}

export function LootInspector({ drop }: { drop: LootDrop }) {
  const run = useGameStore((state) => state.run);
  const profile = useGameStore((state) => state.profile);
  const resolve = useGameStore((state) => state.resolveLoot);
  const close = useGameStore((state) => state.selectLoot);
  if (!run) return null;
  const item = drop.item;
  const definition = item ? ITEM_BY_ID.get(item.definitionId) : null;
  const modifiers = getCombatModifiers(profile, run.relics);
  const dismantle = item ? getDismantleValue(item, modifiers.dismantleRatio) : 0;
  return (
    <aside className={`loot-inspector ${item ? `rarity-${item.rarity}` : 'rarity-common'}`} data-testid="loot-inspector">
      <button className="inspector-close" onClick={() => close(null)} aria-label="关闭物品详情">×</button>
      <span className="inspector-eyebrow">{item ? `${RARITY_LABELS[item.rarity]} · ${kindLabel(item.kind)}` : '当局资源'}</span>
      <div className={`inspector-glyph glyph-${item?.kind ?? 'gold'}`}>{kindSymbol(item?.kind ?? 'gold')}</div>
      <h2>{definition?.name ?? `${drop.gold} 金币`}</h2>
      <p>{definition?.description ?? '用于本局商店购买、治疗与刷新。离开本局后不会保留。'}</p>
      {item && definition ? <ItemNumbers item={item} /> : <div className="inspector-numbers"><span>收入</span><strong>+{drop.gold}</strong></div>}
      <div className="inspector-actions">
        {!item ? <button className="loot-primary" onClick={() => resolve(drop.id, 'equip')}>收取金币</button> : null}
        {item && item.kind !== 'relic' && item.kind !== 'arcana' ? (
          <>
            <button className="loot-primary" onClick={() => resolve(drop.id, 'equip', { weaponSlot: 0 })}>装到主武器</button>
            <button onClick={() => resolve(drop.id, 'equip', { weaponSlot: 1 })}>装到副武器</button>
          </>
        ) : null}
        {item?.kind === 'relic' && run.relics.length < 8 ? <button className="loot-primary" onClick={() => resolve(drop.id, 'equip')}>装入秘宝槽</button> : null}
        {item?.kind === 'relic' && run.relics.length >= 8 ? (
          <div className="replace-slot-row">{run.relics.map((relic, index) => <button key={relic.uid} onClick={() => resolve(drop.id, 'equip', { relicSlot: index })}>替换 {index + 1}</button>)}</div>
        ) : null}
        {item?.kind === 'arcana' && run.arcana.length < 5 ? <button className="loot-primary" onClick={() => resolve(drop.id, 'equip')}>装入秘仪槽</button> : null}
        {item?.kind === 'arcana' && run.arcana.length >= 5 ? (
          <div className="replace-slot-row">{run.arcana.map((arcana, index) => <button key={arcana.uid} onClick={() => resolve(drop.id, 'equip', { arcanaSlot: index })}>替换 {index + 1}</button>)}</div>
        ) : null}
        {item ? <button className="loot-dismantle" onClick={() => resolve(drop.id, 'dismantle')}>分解 · +{dismantle} 金币</button> : null}
      </div>
    </aside>
  );
}

export function GameOverlayLayer({ hud }: { hud: CombatHudSnapshot | null }) {
  const overlay = useGameStore((state) => state.overlay);
  const run = useGameStore((state) => state.run);
  const settings = useGameStore((state) => state.settings);
  const setOverlay = useGameStore((state) => state.setOverlay);
  const updateSettings = useGameStore((state) => state.updateSettings);
  const abandon = useGameStore((state) => state.abandonRun);
  const returnToTitle = useGameStore((state) => state.returnToTitle);
  const [confirmAbandon, setConfirmAbandon] = useState(false);
  if (overlay === 'none') return null;
  const close = () => setOverlay('none');
  return (
    <div className="game-overlay-backdrop" role="dialog" aria-modal="true" data-overlay={overlay}>
      {overlay === 'pause' ? (
        <aside className="pause-rail">
          <span className="overlay-kicker">游戏已暂停</span>
          <h2>辉芯工坊</h2>
          <button className="pause-resume" onClick={close}>继续游戏</button>
          <button onClick={() => setOverlay('character')}>人物 <kbd>C</kbd></button>
          <button onClick={() => setOverlay('equipment')}>装备 <kbd>I</kbd></button>
          <button onClick={() => setOverlay('stats')}>属性 <kbd>Tab</kbd></button>
          <button onClick={() => setOverlay('codex')}>图鉴</button>
          <button onClick={() => setOverlay('settings')}>设置</button>
          <div className="pause-spacer" />
          {run ? (
            confirmAbandon ? (
              <div className="abandon-confirm"><p>放弃后按当前进度结算经验。</p><button onClick={abandon}>确认放弃本局</button><button onClick={() => setConfirmAbandon(false)}>取消</button></div>
            ) : <button className="abandon-button" onClick={() => setConfirmAbandon(true)}>放弃本局</button>
          ) : <button onClick={returnToTitle}>返回标题</button>}
        </aside>
      ) : (
        <section className="game-data-panel">
          <OverlayHeader overlay={overlay} close={close} />
          {overlay === 'character' ? <CharacterPanel hud={hud} /> : null}
          {overlay === 'equipment' ? <EquipmentPanel run={run} /> : null}
          {overlay === 'stats' ? <StatsPanel run={run} /> : null}
          {overlay === 'codex' ? <CodexPanel /> : null}
          {overlay === 'settings' ? (
            <div className="settings-in-game">
              <label>主音量 <input type="range" min="0" max="1" step="0.05" value={settings.masterVolume} onChange={(event) => updateSettings({ masterVolume: Number(event.target.value) })} /></label>
              <label><input type="checkbox" checked={settings.showDamageNumbers} onChange={(event) => updateSettings({ showDamageNumbers: event.target.checked })} /> 显示伤害数字</label>
              <label><input type="checkbox" checked={settings.reducedMotion} onChange={(event) => updateSettings({ reducedMotion: event.target.checked })} /> 减少镜头与界面动态</label>
            </div>
          ) : null}
          <OverlayTabs active={overlay} onChange={setOverlay} />
        </section>
      )}
    </div>
  );
}

function OverlayHeader({ overlay, close }: { overlay: WorldOverlay; close(): void }) {
  const titles: Partial<Record<WorldOverlay, [string, string]>> = {
    character: ['人物', '魔导工匠'], equipment: ['装备', '双武器构筑'], stats: ['属性', '最终派生数值'], codex: ['图鉴', '工坊记录'], settings: ['设置', '游戏选项'],
  };
  const [kicker, title] = titles[overlay] ?? ['暂停', '辉芯工坊'];
  return <header className="overlay-header"><div><span>{kicker}</span><h2>{title}</h2></div><button onClick={close} aria-label="关闭界面">×</button></header>;
}

function OverlayTabs({ active, onChange }: { active: WorldOverlay; onChange(overlay: WorldOverlay): void }) {
  return <nav className="overlay-tabs">
    <button className={active === 'character' ? 'active' : ''} onClick={() => onChange('character')}>人物 C</button>
    <button className={active === 'equipment' ? 'active' : ''} onClick={() => onChange('equipment')}>装备 I</button>
    <button className={active === 'stats' ? 'active' : ''} onClick={() => onChange('stats')}>属性 Tab</button>
    <button className={active === 'codex' ? 'active' : ''} onClick={() => onChange('codex')}>图鉴</button>
  </nav>;
}

function CharacterPanel({ hud }: { hud: CombatHudSnapshot | null }) {
  const profile = useGameStore((state) => state.profile);
  const selectedTalents = Object.values(profile.characters.artificer.selections);
  return <div className="character-panel">
    <div className="character-portrait"><img src={assetUrl('characters/artificer/directions/05.png')} alt="魔导工匠" /><span>魔导工匠</span><small>双枪 · 超频 · 偏转</small></div>
    <div className="character-kit">
      <section><b>右键 · 模块超频</b><p>持续 6 秒：射速 +30%、移速 +15%、换弹速度 +40%。基础冷却 28 秒。</p></section>
      <section><b>固有 · 应急偏转</b><p>完全免疫一次伤害；开局立即可用，基础 60 秒恢复。</p><strong>{hud ? `${hud.deflectionCharges} 层可用` : '离开战斗时已就绪'}</strong></section>
      <section><b>当前角色树</b>{selectedTalents.length ? <ul>{selectedTalents.map((id) => <li key={id}>{id}</li>)}</ul> : <p>尚未选择角色天赋。</p>}</section>
    </div>
  </div>;
}

function EquipmentPanel({ run }: { run: RunStateV2 | null }) {
  const dismantle = useGameStore((state) => state.dismantleEquipped);
  if (!run) return <EmptyRunPanel />;
  const readOnly = run.phase === 'combat';
  return <div className="equipment-panel">
    <div className="equipment-lock">{readOnly ? '战斗中仅可查看；清场后可处理装备' : '当前为安全阶段，可从地面掉落中替换装备'}</div>
    <div className="weapon-systems">
      {run.weapons.map((weapon, index) => <WeaponSystem key={weapon.weapon.uid} index={index} slot={weapon} readOnly={readOnly} onDismantle={dismantle} />)}
    </div>
    <SlotSection title="秘宝" hint="8 格" count={8} items={run.relics} onDismantle={readOnly ? undefined : (index) => dismantle({ kind: 'relic', slot: index })} />
    <SlotSection title="秘仪牌" hint="5 格 · 同名不可重复" count={5} items={run.arcana} onDismantle={readOnly ? undefined : (index) => dismantle({ kind: 'arcana', slot: index })} />
    <SlotSection title="临时效果" hint="独立倒计时，不占装备位" count={Math.max(3, run.temporaryEffects.length)} items={[]} />
  </div>;
}

function WeaponSystem({ index, slot, readOnly, onDismantle }: {
  index: number;
  slot: RunStateV2['weapons'][number];
  readOnly: boolean;
  onDismantle(target: { kind: 'muzzle' | 'core' | 'relic' | 'arcana'; weaponSlot?: 0 | 1; slot?: number }): void;
}) {
  return <section className="weapon-system">
    <header><span>{index === 0 ? '主武器' : '副武器'}</span><kbd>{index === 0 ? 'Q / 滚轮切换' : '独立后台换弹'}</kbd></header>
    <div className="weapon-slot-row">
      <EquipmentSlot label="武器本体" item={slot.weapon} required />
      <EquipmentSlot label="枪头模块" item={slot.muzzle} onDismantle={readOnly || !slot.muzzle ? undefined : () => onDismantle({ kind: 'muzzle', weaponSlot: index as 0 | 1 })} />
      <EquipmentSlot label="元素核心" item={slot.core} onDismantle={readOnly || !slot.core ? undefined : () => onDismantle({ kind: 'core', weaponSlot: index as 0 | 1 })} />
    </div>
  </section>;
}

function SlotSection({ title, hint, count, items, onDismantle }: { title: string; hint: string; count: number; items: RewardItem[]; onDismantle?(index: number): void }) {
  return <section className="slot-section"><header><b>{title}</b><span>{hint}</span></header><div className="slot-grid">
    {Array.from({ length: count }, (_, index) => <EquipmentSlot key={items[index]?.uid ?? `empty-${title}-${index}`} label={`${index + 1}`} item={items[index] ?? null} onDismantle={items[index] && onDismantle ? () => onDismantle(index) : undefined} />)}
  </div></section>;
}

function EquipmentSlot({ label, item, required = false, onDismantle }: { label: string; item: RewardItem | null; required?: boolean; onDismantle?(): void }) {
  const definition = item ? ITEM_BY_ID.get(item.definitionId) : null;
  return <div className={`equipment-slot ${item ? `rarity-${item.rarity}` : 'empty'}`} title={definition?.description}>
    <small>{label}</small>{onDismantle ? <button className="slot-dismantle" onClick={onDismantle} title="分解此装备">×</button> : null}<i>{item ? kindSymbol(item.kind) : '+'}</i><b>{definition?.name ?? (required ? '必需槽位' : '空槽')}</b>{item ? <span>{RARITY_LABELS[item.rarity]}</span> : null}
  </div>;
}

function StatsPanel({ run }: { run: RunStateV2 | null }) {
  const profile = useGameStore((state) => state.profile);
  if (!run) return <EmptyRunPanel />;
  const stats = deriveStats(profile, run);
  return <div className="stats-panel">
    <div className="general-stats">
      <Stat label="最大生命" value={stats.maxHp.toFixed(0)} />
      <Stat label="开局护盾" value={stats.startingShield.toFixed(0)} />
      <Stat label="移动速度" value={stats.moveSpeed.toFixed(0)} />
      <Stat label="闪避冷却" value={`${(stats.dashCooldownMs / 1_000).toFixed(2)} 秒`} />
      <Stat label="暴击" value={`${(stats.critChance * 100).toFixed(0)}% × ${stats.critMultiplier.toFixed(1)}`} />
      <Stat label="超频冷却" value={`${(stats.overclockCooldownMs / 1_000).toFixed(0)} 秒`} />
      <Stat label="偏转恢复" value={`${(stats.deflectionCooldownMs / 1_000).toFixed(0)} 秒`} />
      <Stat label="拆解返还" value={`${(stats.dismantleRatio * 100).toFixed(0)}%`} />
    </div>
    <div className="weapon-stat-columns">{stats.weapons.map((weapon, index) => <section key={weapon.name}><header><span>{index === 0 ? '主武器' : '副武器'}</span><h3>{weapon.name}</h3></header>
      <Stat label="单弹伤害" value={weapon.damage.toFixed(1)} />
      <Stat label="射速" value={`${weapon.fireRate.toFixed(2)} /秒`} />
      <Stat label="弹匣" value={`${weapon.magazine}`} />
      <Stat label="实际换弹" value={`${(weapon.reloadMs / 1_000).toFixed(2)} 秒`} />
      <Stat label="持续 DPS" value={weapon.sustainedDps.toFixed(1)} />
      <Stat label="弹道" value={`${weapon.projectileCount} 发 · 穿透 ${weapon.pierce} · 弹跳 ${weapon.bounces}`} />
      <Stat label="爆炸半径" value={`${weapon.explosionRadius}`} />
      <Stat label="元素" value={tagLabel(weapon.element)} />
    </section>)}</div>
    <p className="stats-source-note">这里与战斗共用同一个纯 TypeScript 派生函数；更换装备后数值立即重算。</p>
  </div>;
}

function CodexPanel() {
  return <div className="codex-panel"><div className="codex-silhouette">?</div><h3>图鉴柜已经接入</h3><p>G2 先提供游戏内入口和只读界面。已发现登记、未发现剪影与完整筛选会在 G3 随正式掉落池一起接入。</p></div>;
}

function ItemNumbers({ item }: { item: RewardItem }) {
  const definition = ITEM_BY_ID.get(item.definitionId);
  if (!definition) return null;
  if (definition.kind === 'weapon') return <div className="inspector-number-grid"><Stat label="伤害" value={definition.damage.toFixed(0)} /><Stat label="射速" value={definition.fireRate.toFixed(2)} /><Stat label="弹匣" value={`${definition.magazine}`} /><Stat label="换弹" value={`${(definition.reloadMs / 1_000).toFixed(2)} 秒`} /></div>;
  if (definition.kind === 'muzzle') return <div className="inspector-number-grid"><Stat label="弹丸" value={`${definition.projectileCount ?? 1}`} /><Stat label="穿透" value={`${definition.pierce ?? 0}`} /><Stat label="弹跳" value={`${definition.bounces ?? 0}`} /><Stat label="爆炸" value={`${definition.explosionRadius ?? 0}`} /></div>;
  if (definition.kind === 'core') return <div className="inspector-numbers"><span>元素回路</span><strong>{tagLabel(definition.tag)}</strong></div>;
  return <div className="inspector-numbers"><span>生效方式</span><strong>{definition.kind === 'relic' ? '持续被动' : '条件触发'}</strong></div>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="data-stat"><span>{label}</span><b>{value}</b></div>;
}

function EmptyRunPanel() {
  return <div className="empty-run-panel"><strong>尚未出发</strong><p>进入远征后，这里会显示本局的双武器、秘宝、秘仪牌和最终属性。</p></div>;
}

function phaseObjective(run: RunStateV2): string {
  if (run.phase === 'route') return '走到一扇实体路线门前并按 E';
  if (run.phase === 'combat') return '清理本房敌人';
  if (run.phase === 'chest') return '靠近落地宝箱并按 E';
  if (run.phase === 'loot') return '逐件处理所有落地物品';
  return 'G2 核心体验已跑通';
}

function kindLabel(kind: RewardItem['kind']): string {
  if (kind === 'weapon') return '武器本体';
  if (kind === 'muzzle') return '枪头模块';
  if (kind === 'core') return '元素核心';
  if (kind === 'relic') return '秘宝';
  return '秘仪牌';
}

function kindSymbol(kind: RewardItem['kind'] | 'gold'): string {
  if (kind === 'weapon') return '⌁';
  if (kind === 'muzzle') return '➤';
  if (kind === 'core') return '◈';
  if (kind === 'relic') return '✦';
  if (kind === 'arcana') return '♢';
  return '◆';
}

function tagLabel(tag: string): string {
  if (tag === 'arc') return '电弧';
  if (tag === 'blast') return '爆破';
  if (tag === 'frost') return '霜晶';
  return '中性';
}

function assetUrl(path: string): string {
  return new URL(`assets/v2/${path}`, document.baseURI).href;
}
