import { useEffect, useState, type CSSProperties } from 'react';
import { RARITY_LABELS } from '@/game/content';
import type { CombatHudSnapshot } from '@/game/types';

export function CombatHud({ hud, boss }: { hud: CombatHudSnapshot | null; boss: boolean }) {
  const hudScale = useHudScale();
  if (!hud) return <div className="combat-loading">正在接通魔导回路…</div>;
  const hpRatio = Math.max(0, hud.hp / hud.maxHp);
  return (
    <div
      className="combat-hud"
      aria-live="polite"
      data-projectiles={hud.projectilesActive}
      data-effects={hud.effectsActive}
      data-elapsed-ms={Math.round(hud.elapsedMs)}
      style={{ '--hud-scale': hudScale } as CSSProperties}
    >
      <div className="hud-survival">
        <div className="portrait-orb"><span>匠</span></div>
        <div className="survival-bars">
          <div className="bar-label"><span>生命</span><b>{Math.ceil(hud.hp)} / {hud.maxHp}</b></div>
          <div className="health-track"><span style={{ width: `${hpRatio * 100}%` }} /></div>
          <div className="shield-line">护盾 <b>{Math.ceil(hud.shield)}</b></div>
        </div>
      </div>

      {boss && hud.bossHp !== null && hud.bossMaxHp !== null ? (
        <div className="boss-hud">
          <span>失控熔炉守卫</span>
          <div><i style={{ width: `${Math.max(0, hud.bossHp / hud.bossMaxHp) * 100}%` }} /></div>
        </div>
      ) : null}

      {hud.eliteObjective ? (
        <div className={`elite-objective ${hud.eliteObjective.completed ? 'completed' : hud.eliteObjective.failed ? 'failed' : ''}`} data-testid="elite-objective">
          <span>精英目标</span>
          <b>{eliteObjectiveText(hud.eliteObjective)}</b>
        </div>
      ) : null}

      <div className="hud-status">
        <StatusOrb label="偏转" value={hud.deflectionCharges > 0 ? `${hud.deflectionCharges} 层` : seconds(hud.deflectionCooldownMs)} ready={hud.deflectionCharges > 0} />
        <StatusOrb label="超频" value={hud.overclockRemainingMs > 0 ? `持续 ${seconds(hud.overclockRemainingMs)}` : hud.overclockCooldownMs > 0 ? seconds(hud.overclockCooldownMs) : '就绪'} ready={hud.overclockCooldownMs <= 0 || hud.overclockRemainingMs > 0} />
        <StatusOrb label="闪避" value={hud.dashCooldownMs > 0 ? seconds(hud.dashCooldownMs) : '就绪'} ready={hud.dashCooldownMs <= 0} />
      </div>

      <div className="weapon-dock">
        {hud.weapons.map((weapon, index) => (
          <div className={`weapon-slot ${hud.activeWeapon === index ? 'active' : ''} tag-${weapon.tag}`} key={`${weapon.name}-${index}`}>
            <span className="slot-key">{index === 0 ? '主' : '副'}</span>
            <div>
              <strong>{weapon.name}</strong>
              <small>{RARITY_LABELS[weapon.rarity]} · {weapon.reloading ? '换弹中' : `${weapon.ammo} / ${weapon.magazine}`}</small>
              <div className="reload-track"><i style={{ width: `${weapon.reloadProgress * 100}%` }} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="combat-meta">
        <span>敌人 {hud.enemiesRemaining}</span>
        <span>{formatTime(hud.elapsedMs)}</span>
        <span className={hud.fps < 50 ? 'fps-low' : ''}>{Math.round(hud.fps)} FPS</span>
      </div>
      <div className="control-hint">WASD 移动 · 左键射击 · R 换弹 · Q/滚轮切枪 · Space 闪避 · 右键超频 · Esc 暂停</div>
    </div>
  );
}

function eliteObjectiveText(objective: CombatHudSnapshot['eliteObjective']): string {
  if (!objective) return '';
  if (objective.completed) return '完成 · 宝箱额外 +1 件';
  if (objective.failed) return '失败 · 仍可获得基础精英奖励';
  if (objective.type === 'speed') return `90 秒内清场 · 剩余 ${Math.max(0, 90 - Math.floor(objective.elapsedMs / 1_000))} 秒`;
  if (objective.type === 'low-damage') return `承伤不超过 20% · 当前 ${Math.ceil(objective.damageTaken)}`;
  return `摧毁过载装置 ${objective.overloadsDestroyed} / ${objective.overloadsTotal} · ${Math.max(0, 12 - Math.floor(objective.elapsedMs / 1_000))} 秒`;
}

function useHudScale(): number {
  const readScale = () => Math.min(4 / 3, Math.max(0.75, window.innerWidth / 1_920));
  const [scale, setScale] = useState(readScale);
  useEffect(() => {
    const update = () => setScale(readScale());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function StatusOrb({ label, value, ready }: { label: string; value: string; ready: boolean }) {
  return (
    <div className={`status-orb ${ready ? 'ready' : ''}`}>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function seconds(ms: number): string {
  return `${Math.max(0, ms / 1_000).toFixed(ms < 10_000 ? 1 : 0)}s`;
}

function formatTime(ms: number): string {
  const total = Math.floor(ms / 1_000);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
