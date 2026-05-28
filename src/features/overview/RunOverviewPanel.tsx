import { useMemo } from 'react';
import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import '@/game/core/definitions/cards/upgradeRules';
import { ARCHETYPE_DISPLAY, summarizeDeckArchetypes } from '@/game/core/definitions/cards/archetypes';
import { ArchetypeDot } from '@/features/cards/ArchetypeDot';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
import { POTION_DEFINITIONS } from '@/game/core/definitions/potions';
import { RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import { getStatusMeta } from '@/game/core/definitions/statuses';
import type { CardDefinition, CardType } from '@/game/core/model/card';
import type { RunState } from '@/game/core/model/run';
import { sceneThemeClass } from '@/styles/sceneTheme.css';
import * as styles from './runOverview.css';

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

interface DeckRow { definitionId: string; count: number }
interface DeckGroup { key: string; label: string; rows: DeckRow[]; total: number }

function deckRows(deck: string[]): DeckRow[] {
  const counts = new Map<string, number>();
  for (const definitionId of deck) counts.set(definitionId, (counts.get(definitionId) ?? 0) + 1);
  return [...counts.entries()]
    .map(([definitionId, count]) => ({ definitionId, count }))
    .sort((a, b) => a.definitionId.localeCompare(b.definitionId));
}

function classifyCard(def: CardDefinition | undefined): { groupKey: string; groupLabel: string } {
  if (!def) return { groupKey: 'other', groupLabel: '其他' };
  if (def.exhaustOnPlay) return { groupKey: 'exhaust', groupLabel: '消耗牌' };
  if (def.id.startsWith('junk_')) return { groupKey: 'junk', groupLabel: '污染牌' };
  const typeLabel: Record<CardType, string> = { attack: '攻击', skill: '技能', power: '能力', curse: '诅咒', status: '状态' };
  return { groupKey: `type_${def.type}`, groupLabel: typeLabel[def.type] };
}

function groupDeckRows(rows: DeckRow[]): DeckGroup[] {
  const groups = new Map<string, DeckGroup>();
  for (const row of rows) {
    const def = CARD_DEFINITIONS[row.definitionId];
    const { groupKey, groupLabel } = classifyCard(def);
    const g = groups.get(groupKey) ?? { key: groupKey, label: groupLabel, rows: [], total: 0 };
    g.rows.push(row);
    g.total += row.count;
    groups.set(groupKey, g);
  }
  const order = ['type_attack', 'type_skill', 'type_power', 'exhaust', 'junk', 'other'];
  return [...groups.values()].sort(
    (a, b) => (order.indexOf(a.key) + 100) - (order.indexOf(b.key) + 100),
  );
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
        className={cx(sceneThemeClass, styles.toggle)}
        aria-expanded={open}
        aria-label={open ? '关闭冒险总览' : '打开冒险总览'}
        title={open ? '关闭冒险总览' : '冒险总览（悬停或点击展开）'}
        onClick={onToggle}
      >
        <span className={styles.toggleDots} aria-hidden>
          <span className={styles.toggleDot} />
          <span className={styles.toggleDot} />
          <span className={styles.toggleDot} />
        </span>
        <span className={styles.toggleLabel}>总览</span>
      </button>
      {open ? <button type="button" className={styles.backdrop} aria-label="关闭总览" onClick={onClose} /> : null}
      <aside className={cx(sceneThemeClass, styles.panel, open && styles.panelOpen)} aria-hidden={!open}>
        <div className={styles.head}>
          <div>
            <p className={styles.kicker}>当前构筑</p>
            <h2 className={styles.title}>冒险总览</h2>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            关闭
          </button>
        </div>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>角色</h3>
          <p className={styles.heroLine}>
            <strong>{character.name}</strong> · {character.title}
          </p>
          <p className={styles.desc}>{character.description}</p>
          <p className={styles.desc}>
            被动 <strong>{character.passiveName}</strong>：{character.passiveDescription}
          </p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>流派身份</h3>
          <p className={styles.empty} style={{ opacity: 0.85 }}>
            当前已构筑进度 · 核心卡 / 核心遗物命中越多，流派识别度越强。
          </p>
          <div className={styles.stats} style={{ marginBottom: 8 }}>
            {(['guard', 'burst', 'mixed', 'neutral'] as const).map((a) => {
              const meta = ARCHETYPE_DISPLAY[a];
              const count = summarizeDeckArchetypes(run.masterDeck)[a];
              return (
                <span
                  key={a}
                  className={styles.statChip}
                  style={{ borderColor: meta.color, color: meta.color }}
                  title={`${meta.name}流派：牌组里 ${count} 张`}
                >
                  {meta.name} · {count}
                </span>
              );
            })}
          </div>
          <ul className={styles.list}>
            {character.buildBranches.map((branch) => {
              const cardHits = branch.coreCardIds.filter(
                (id) => run.masterDeck.some((x) => x === id || x === id + '+' || x === id + '++'),
              );
              const relicHit = run.meta.relics.includes(branch.coreRelicId);
              const score = cardHits.length + (relicHit ? 1 : 0);
              return (
                <li key={branch.id}>
                  <strong>
                    {branch.name} · {score}/3 命中
                  </strong>
                  <span className={styles.listMeta}>
                    核心卡：{branch.coreCardIds
                      .map((id) => {
                        const def = CARD_DEFINITIONS[id];
                        const has = cardHits.includes(id);
                        return `${def?.name ?? id}${has ? '（已入组）' : ''}`;
                      })
                      .join(' / ')}
                    ；核心遗物：
                    <ArchetypeDot relicId={branch.coreRelicId} />
                    {RELIC_DEFINITIONS[branch.coreRelicId]?.name ?? branch.coreRelicId}
                    {relicHit ? '（已持有）' : ''}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>当前状态</h3>
          <div className={styles.stats}>
            <span className={styles.statChip}>Act {run.meta.act}</span>
            <span className={styles.statChip}>章内 {run.meta.actFloor} 层</span>
            <span className={styles.statChip}>全局 {run.meta.floor} 层</span>
            <span className={styles.statChip}>界面 {screenLabel(run)}</span>
            <span className={styles.statChip}>节点 {currentNodeLabel(run)}</span>
            <span className={styles.statChip}>金币 {run.meta.gold}</span>
            <span className={styles.statChip}>
              生命 {currentHp(run)} / {run.player.maxHp}
            </span>
            <span className={styles.statChip}>牌组 {run.masterDeck.length} 张</span>
          </div>
        </section>

        {battleStatuses.length > 0 ? (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>当前战斗状态</h3>
            <ul className={styles.list}>
              {battleStatuses.map((status) => {
                const meta = getStatusMeta(status.id);
                return (
                  <li key={status.id}>
                    <strong>
                      {meta.name} {status.stacks}
                    </strong>
                    <span className={styles.listMeta}>{meta.battleHint}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>遗物</h3>
          {run.meta.relics.length === 0 ? (
            <p className={styles.empty}>暂无遗物</p>
          ) : (
            <ul className={styles.list}>
              {run.meta.relics.map((relicId) => {
                const def = RELIC_DEFINITIONS[relicId];
                return (
                  <li key={relicId}>
                    <strong>
                      <ArchetypeDot relicId={relicId} />
                      {def?.name ?? relicId}
                    </strong>
                    <span className={styles.listMeta}>{def?.description ?? '暂无说明'}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>药水</h3>
          {run.meta.potions.length === 0 ? (
            <p className={styles.empty}>暂无药水</p>
          ) : (
            <ul className={styles.list}>
              {run.meta.potions.map((potionId, index) => {
                const def = POTION_DEFINITIONS[potionId];
                return (
                  <li key={`${potionId}-${index}`}>
                    <strong>{def?.name ?? potionId}</strong>
                    <span className={styles.listMeta}>{def?.description ?? '暂无说明'}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>牌组（共 {run.masterDeck.length} 张）</h3>
          {groupDeckRows(deck).map((group) => (
            <div key={group.key} style={{ marginBottom: 12 }}>
              <p className={styles.empty} style={{ opacity: 0.85 }}>
                {group.label} · {group.total} 张
              </p>
              <ul className={styles.list}>
                {group.rows.map((row) => {
                  const def = CARD_DEFINITIONS[row.definitionId];
                  return (
                    <li key={row.definitionId}>
                      <strong className={styles.deckStrong}>
                        <ArchetypeDot cardId={row.definitionId} />
                        {def?.name ?? row.definitionId} ×{row.count}
                      </strong>
                      <span className={styles.listMeta}>{def?.description ?? '暂无说明'}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>
      </aside>
    </>
  );
}
