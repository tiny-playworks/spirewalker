import type { MonsterIntent } from '@/game/core/model/battle';
import { useGameStore } from '@/game/store/gameStore';
import { selectBattle, selectCurrentEnemyIntents, selectPlayerBattleStats } from '@/game/store/selectors/battleSelectors';
import { PotionBar } from './PotionBar';

function formatHudIntent(intent: MonsterIntent): string {
  switch (intent.type) {
    case 'attack':
      return `攻击 ${intent.value}`;
    case 'block':
      return `防御 ${intent.value}`;
    case 'buff':
      return `增益 ${intent.value}`;
    case 'debuff':
      return `减益 ${intent.value}`;
    case 'attack_buff':
      return `攻击 ${intent.attack} +状态`;
    default:
      return '—';
  }
}

export function BattleHUD() {
  const run = useGameStore((s) => s.run);
  const battle = selectBattle(run);
  const playerStats = selectPlayerBattleStats(run);
  const enemyIntents = selectCurrentEnemyIntents(run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);

  if (!battle) return null;

  const player = battle.units[battle.playerUnitId];
  const canAct = battle.phase === 'player_action';
  const handCount = battle.player.hand.length;
  const outOfEnergy = canAct && battle.player.energy === 0 && handCount > 0;

  return (
    <header className="battle-hud">
      <div className="battle-hud-inner">
        <div className="battle-hud-row battle-hud-row--stats">
          <span className="battle-chip">
            回合 <strong>{playerStats?.turn ?? battle.turn}</strong>
          </span>
          <span className="battle-chip">
            能量 <strong>{playerStats?.energy ?? battle.player.energy}</strong> /{' '}
            {playerStats?.maxEnergy ?? battle.player.maxEnergy}
            {outOfEnergy ? (
              <span className="energy-hint">（已用尽，请结束回合）</span>
            ) : null}
          </span>
          {player ? (
            <span className="battle-chip">
              {player.name} HP <strong>{player.hp}</strong> / {player.maxHp} · 格挡{' '}
              <strong>{player.block}</strong>
            </span>
          ) : null}
          {enemyIntents.map((enemy) => {
            const intentLabel = enemy.intent ? formatHudIntent(enemy.intent) : '—';
            return (
              <span key={enemy.unitId} className="battle-chip battle-chip--accent">
                {enemy.name} HP <strong>{enemy.hp}</strong> / {enemy.maxHp} · 意图{' '}
                <strong>{intentLabel}</strong>
              </span>
            );
          })}
          {battle.phase === 'victory' ? (
            <span className="battle-chip battle-chip--win">胜利</span>
          ) : null}
        </div>
        <div className="battle-hud-row battle-hud-row--actions">
          <div className="battle-hud-buttons">
            {battle.phase === 'victory' ? (
              <button
                type="button"
                className="btn-end-turn"
                onClick={() => dispatchCommand({ type: 'LEAVE_BATTLE_TO_REWARD' })}
              >
                领取奖励
              </button>
            ) : null}
            {battle.phase === 'player_action' ? (
              <button
                type="button"
                className="btn-end-turn"
                disabled={!canAct}
                onClick={() => dispatchCommand({ type: 'END_TURN' })}
              >
                结束回合
              </button>
            ) : null}
          </div>
          <PotionBar />
        </div>
      </div>
    </header>
  );
}
