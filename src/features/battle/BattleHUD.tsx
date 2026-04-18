import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import { formatMonsterIntentText } from '@/game/core/battleUiText';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
import { RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import { getStatusMeta } from '@/game/core/definitions/statuses';
import { useGameStore } from '@/game/store/gameStore';
import { selectBattle, selectCurrentEnemyIntents, selectPlayerBattleStats } from '@/game/store/selectors/battleSelectors';
import { PotionBar } from './PotionBar';

function buildRelicTooltip(relicId: string): string {
  const def = RELIC_DEFINITIONS[relicId];
  if (!def) return relicId;
  const battleHint =
    relicId === 'vajra' || relicId === 'wind_chime' || relicId === 'tactical_gloves'
      ? '本战开局已自动生效。'
      : relicId === 'burst_emblem' || relicId === 'insight_lens' || relicId === 'guard_knot'
        ? '满足条件时会在本战中生效。'
        : '当前战斗中持续提供它的效果。';
  return `${def.name}\n${def.description}\n${battleHint}`;
}

function StatusStrip({
  title,
  statuses,
}: {
  title: string;
  statuses: Array<{ id: string; stacks: number }>;
}) {
  if (statuses.length === 0) {
    return (
      <div className="battle-status-strip">
        <span className="battle-status-strip-label">{title}</span>
        <span className="battle-status-empty">暂无状态</span>
      </div>
    );
  }

  return (
    <div className="battle-status-strip">
      <span className="battle-status-strip-label">{title}</span>
      <div className="battle-status-list">
        {statuses.map((status) => {
          const meta = getStatusMeta(status.id);
          return (
            <span
              key={`${title}-${status.id}`}
              className="battle-status-pill"
              title={`${meta.name}\n${meta.description}\n${meta.battleHint}`}
            >
              <span className="battle-status-pill-k">{meta.shortLabel}</span>
              <span className="battle-status-pill-v">
                {meta.name} {status.stacks}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
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
  const selectingTarget = battle.inputMode === 'selecting_target' && battle.pendingAction?.type === 'play_card';
  const pendingCardInstanceId = selectingTarget ? battle.pendingAction?.cardInstanceId ?? null : null;
  const pendingCard = pendingCardInstanceId
    ? battle.player.cards[pendingCardInstanceId]
    : null;
  const pendingCardName = pendingCard
    ? CARD_DEFINITIONS[pendingCard.definitionId]?.name ?? pendingCard.definitionId
    : null;
  const playerStatuses = player?.statuses ?? [];
  const character = getCharacterDefinition(run?.meta.characterId ?? 'walker');
  const hasRelics = Boolean(run?.meta.relics.length);
  const enemyStatusRows = enemyIntents
    .map((enemy) => {
      const unit = battle.units[enemy.unitId];
      return {
        unitId: enemy.unitId,
        name: enemy.name,
        statuses: unit?.statuses ?? [],
      };
    })
    .filter((enemy) => enemy.statuses.length > 0);

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
          <span
            className="battle-chip"
            title={`${character.description}\n被动：${character.passiveDescription}`}
          >
            角色 <strong>{character.name}</strong> · {character.passiveName}
          </span>
          {enemyIntents.map((enemy) => {
            const intentLabel = formatMonsterIntentText(enemy.intent);
            return (
              <span
                key={enemy.unitId}
                className="battle-chip battle-chip--accent"
                title={enemy.intent ? intentLabel : '当前没有已知意图。'}
              >
                {enemy.name} HP <strong>{enemy.hp}</strong> / {enemy.maxHp} · 意图{' '}
                <strong>{intentLabel}</strong>
              </span>
            );
          })}
          {battle.phase === 'victory' ? (
            <span className="battle-chip battle-chip--win">胜利</span>
          ) : null}
          {selectingTarget ? (
            <span className="battle-chip battle-chip--accent">
              已选中 {pendingCardName ?? '当前卡牌'}：点击敌人确认；再次点该牌或点“取消选目标”退出
            </span>
          ) : null}
        </div>
        {player ? <StatusStrip title={`${player.name} 状态`} statuses={playerStatuses} /> : null}
        {enemyStatusRows.map((enemy) => (
          <StatusStrip key={enemy.unitId} title={`${enemy.name} 状态`} statuses={enemy.statuses} />
        ))}
        {hasRelics ? (
          <div className="battle-hud-row battle-hud-row--meta">
            <div className="battle-meta-group">
            <span className="battle-meta-label">遗物</span>
            {run?.meta.relics.length ? (
              <div className="battle-meta-list">
                {run.meta.relics.map((relicId) => {
                  const def = RELIC_DEFINITIONS[relicId];
                  return (
                    <span
                      key={relicId}
                      className="battle-meta-pill"
                      title={buildRelicTooltip(relicId)}
                    >
                      {def?.name ?? relicId}
                    </span>
                  );
                })}
              </div>
            ) : (
              <span className="battle-status-empty">暂无遗物</span>
            )}
          </div>
          </div>
        ) : null}
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
            {selectingTarget ? (
              <button
                type="button"
                className="btn-end-turn btn-end-turn--ghost"
                onClick={() => dispatchCommand({ type: 'CANCEL_TARGET_SELECTION' })}
              >
                取消选目标
              </button>
            ) : null}
          </div>
          <PotionBar />
        </div>
      </div>
    </header>
  );
}
