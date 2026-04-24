import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import type { CardDefinition, CardType } from '@/game/core/model/card';
import { useGameStore } from '@/game/store/gameStore';
import { ArchetypeDot } from '../cards/ArchetypeDot';
import * as styles from './battlePage.css';

interface DeckRow {
  definitionId: string;
  count: number;
}

interface DeckGroup {
  key: string;
  label: string;
  rows: DeckRow[];
  total: number;
}

function deckRows(deck: string[]): DeckRow[] {
  const counts = new Map<string, number>();
  for (const definitionId of deck) counts.set(definitionId, (counts.get(definitionId) ?? 0) + 1);
  return [...counts.entries()]
    .map(([definitionId, count]) => ({ definitionId, count }))
    .sort((a, b) => a.definitionId.localeCompare(b.definitionId));
}

function classifyCard(def: CardDefinition | undefined): { key: string; label: string } {
  if (!def) return { key: 'other', label: '其他' };
  if (def.exhaustOnPlay) return { key: 'exhaust', label: '消耗牌' };
  if (def.id.startsWith('junk_')) return { key: 'junk', label: '污染牌' };
  const labels: Record<CardType, string> = { attack: '攻击', skill: '技能', power: '能力' };
  return { key: `type_${def.type}`, label: labels[def.type] };
}

function groupDeckRows(rows: DeckRow[]): DeckGroup[] {
  const groups = new Map<string, DeckGroup>();
  for (const row of rows) {
    const def = CARD_DEFINITIONS[row.definitionId];
    const { key, label } = classifyCard(def);
    const group = groups.get(key) ?? { key, label, rows: [], total: 0 };
    group.rows.push(row);
    group.total += row.count;
    groups.set(key, group);
  }
  const order = ['type_attack', 'type_skill', 'type_power', 'exhaust', 'junk', 'other'];
  return [...groups.values()].sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
}

export function BattleDeckPanel() {
  const deck = useGameStore((s) => s.run?.masterDeck ?? []);
  const groups = groupDeckRows(deckRows(deck));

  return (
    <div className={styles.deckPanel} data-testid="battle-deck-panel">
      <h2 className={styles.deckTitle}>当前牌组</h2>
      <p className={styles.deckSummary}>共 {deck.length} 张</p>
      {groups.map((group) => (
        <section key={group.key} className={styles.deckGroup}>
          <h3 className={styles.deckGroupTitle}>
            {group.label} · {group.total}
          </h3>
          <ul className={styles.deckList}>
            {group.rows.map((row) => {
              const def = CARD_DEFINITIONS[row.definitionId];
              return (
                <li key={row.definitionId} className={styles.deckCardRow}>
                  <div className={styles.deckCardHead}>
                    <strong>
                      <ArchetypeDot cardId={row.definitionId} />
                      {def?.name ?? row.definitionId}
                    </strong>
                    <span>×{row.count}</span>
                  </div>
                  <p>{def?.description ?? '暂无说明'}</p>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
