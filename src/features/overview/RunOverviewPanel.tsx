import { useMemo } from 'react';
import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
import { POTION_DEFINITIONS } from '@/game/core/definitions/potions';
import { RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import { getStatusMeta } from '@/game/core/definitions/statuses';
import type { RunState } from '@/game/core/model/run';

function deckRows(deck: string[]) {
  const counts = new Map<string, number>();
  for (const definitionId of deck) counts.set(definitionId, (counts.get(definitionId) ?? 0) + 1);
  return [...counts.entries()]
    .map(([definitionId, count]) => ({ definitionId, count }))
    .sort((a, b) => a.definitionId.localeCompare(b.definitionId));
}

function currentHp(run: RunState): number {
  if (run.screen.type === 'battle' && run.battle) {
    return run.battle.units[run.battle.playerUnitId]?.hp ?? run.player.currentHp;
  }
  return run.player.currentHp;
}

function screenLabel(run: RunState): string {
  switch (run.screen.type) {
    case 'battle':
      return '战斗中';
    case 'reward':
      return '奖励中';
    case 'shop':
      return '商店';
    case 'event':
      return '事件';
    case 'rest':
      return '篝火';
    case 'victory':
      return '通关';
    case 'game_over':
      return '结束';
    case 'map':
      return '地图';
    default:
      return run.screen.type;
  }
}

function currentNodeLabel(run: RunState): string {
  const nodeId = run.map.currentNodeId;
  const node = nodeId ? run.map.nodes[nodeId] : undefined;
  if (!node) return '—';
  switch (node.type) {
    case 'battle':
      return '普通战斗';
    case 'elite':
      return '精英';
    case 'boss':
      return 'Boss';
    case 'shop':
      return '商店';
    case 'rest':
      return '篝火';
    case 'event':
      return '事件';
    case 'treasure':
      return '宝箱';
    default:
      return node.type;
  }
}

export function RunOverviewPanel({
  run,
  open,
  onToggle,
  onClose,
}: {
  run: RunState;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const character = getCharacterDefinition(run.meta.characterId);
  const deck = useMemo(() => deckRows(run.masterDeck), [run.masterDeck]);
  const battleStatuses = run.screen.type === 'battle' && run.battle
    ? run.battle.units[run.battle.playerUnitId]?.statuses ?? []
    : [];

  return (
    <>
      <button
        type="button"
        className="run-overview-toggle"
        aria-expanded={open}
        onClick={onToggle}
      >
        总览
      </button>
      {open ? <button type="button" className="run-overview-backdrop" aria-label="关闭总览" onClick={onClose} /> : null}
      <aside className={`run-overview-panel${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <div className="run-overview-head">
          <div>
            <p className="run-overview-kicker">当前构筑</p>
            <h2 className="run-overview-title">冒险总览</h2>
          </div>
          <button type="button" className="run-overview-close" onClick={onClose}>
            关闭
          </button>
        </div>

        <section className="run-overview-section">
          <h3>角色</h3>
          <p className="run-overview-hero-line">
            <strong>{character.name}</strong> · {character.title}
          </p>
          <p className="run-overview-desc">{character.description}</p>
          <p className="run-overview-desc">
            被动 <strong>{character.passiveName}</strong>：{character.passiveDescription}
          </p>
        </section>

        <section className="run-overview-section">
          <h3>当前状态</h3>
          <div className="run-overview-stats">
            <span>楼层 {run.meta.floor}</span>
            <span>界面 {screenLabel(run)}</span>
            <span>节点 {currentNodeLabel(run)}</span>
            <span>金币 {run.meta.gold}</span>
            <span>
              生命 {currentHp(run)} / {run.player.maxHp}
            </span>
            <span>牌组 {run.masterDeck.length} 张</span>
          </div>
        </section>

        {battleStatuses.length > 0 ? (
          <section className="run-overview-section">
            <h3>当前战斗状态</h3>
            <ul className="run-overview-list">
              {battleStatuses.map((status) => {
                const meta = getStatusMeta(status.id);
                return (
                  <li key={status.id}>
                    <strong>
                      {meta.name} {status.stacks}
                    </strong>
                    <span>{meta.battleHint}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <section className="run-overview-section">
          <h3>遗物</h3>
          {run.meta.relics.length === 0 ? (
            <p className="run-overview-empty">暂无遗物</p>
          ) : (
            <ul className="run-overview-list">
              {run.meta.relics.map((relicId) => {
                const def = RELIC_DEFINITIONS[relicId];
                return (
                  <li key={relicId}>
                    <strong>{def?.name ?? relicId}</strong>
                    <span>{def?.description ?? '暂无说明'}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="run-overview-section">
          <h3>药水</h3>
          {run.meta.potions.length === 0 ? (
            <p className="run-overview-empty">暂无药水</p>
          ) : (
            <ul className="run-overview-list">
              {run.meta.potions.map((potionId, index) => {
                const def = POTION_DEFINITIONS[potionId];
                return (
                  <li key={`${potionId}-${index}`}>
                    <strong>{def?.name ?? potionId}</strong>
                    <span>{def?.description ?? '暂无说明'}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="run-overview-section">
          <h3>牌组</h3>
          <ul className="run-overview-list run-overview-list--deck">
            {deck.map((row) => {
              const def = CARD_DEFINITIONS[row.definitionId];
              return (
                <li key={row.definitionId}>
                  <strong>
                    {def?.name ?? row.definitionId} ×{row.count}
                  </strong>
                  <span>{def?.description ?? '暂无说明'}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </aside>
    </>
  );
}
