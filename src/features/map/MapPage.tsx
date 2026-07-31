import { useEffect, useMemo, useRef, useState } from 'react';
import { Coins, Gem, Heart, Layers, Menu } from 'lucide-react';
import { actFloorCount, createMapRun } from '@/game/core/engine/createMapRun';
import { WANDERING_MERCHANT_EVENT_ID } from '@/game/core/engine/generateBranchingFloor';
import { ALL_CARD_DEFINITIONS } from '@/game/core/definitions/cards';
import { RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import type { MapNode } from '@/game/core/model/map';
import { clearSavedRun } from '@/game/core/persistence/saveRun';
import { useGameStore } from '@/game/store/gameStore';
import { selectMapRunState } from '@/game/store/selectors/mapSelectors';
import { RunSceneShell } from '@/features/run-scene/RunSceneShell';
import { TutorialHint } from '@/features/tutorial/TutorialHint';
import { ArchetypeDot } from '../cards/ArchetypeDot';
import { MapRoute } from './MapRoute';
import { getMapEncounterPreview } from './mapEncounterPreview';
import * as styles from './mapPage.css';
import { MapNodeIcon, type MapNodeVisualKind } from './mapNodeIcons';

const ACT_TITLES: Record<number, string> = {
  1: '镀金废墟',
  2: '碎裂回廊',
  3: '虚空王座',
};

const MAP_LEGEND: { kind: MapNodeVisualKind; label: string }[] = [
  { kind: 'battle', label: '普通战斗' },
  { kind: 'elite', label: '精英战' },
  { kind: 'boss', label: '首领' },
  { kind: 'event', label: '未知事件' },
  { kind: 'shop', label: '商人' },
  { kind: 'rest', label: '休整营火' },
  { kind: 'treasure', label: '宝藏' },
];

type PanelKey = 'relics' | 'deck' | 'menu';

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function nodeTitle(n: MapNode): string {
  if (n.x === 0) return `第 ${n.act} 章 · 营地`;
  switch (n.type) {
    case 'battle':
      return '普通战斗';
    case 'elite':
      return '精英战';
    case 'boss':
      return '首领战';
    case 'shop':
      return '商人营地';
    case 'rest':
      return '篝火休整';
    case 'event':
      return n.eventScriptId === WANDERING_MERCHANT_EVENT_ID ? '游荡商人' : '未知事件';
    case 'treasure':
      return '宝藏';
    default:
      return n.id;
  }
}

function nodeDescription(n: MapNode): string {
  switch (n.type) {
    case 'battle': return '稳定获取卡牌与金币，检验当前构筑的基础循环。';
    case 'elite': return '更高压力的战斗，胜利后有机会取得关键遗物。';
    case 'boss': return '本章最终考验。击破后完成 Act 1 并进入下一章。';
    case 'shop': return '使用金币购买卡牌、遗物和药水，也可精简或升级牌组。';
    case 'rest': return '回复生命，为下一段路线调整风险承受能力。';
    case 'event': return '未知抉择，可能改变生命、金币、卡牌或下一战连势。';
    case 'treasure': return '获得一份无需战斗的补给。';
    default: return '继续向尖塔深处前进。';
  }
}

function deckCounts(deck: string[]): { id: string; count: number }[] {
  const m = new Map<string, number>();
  for (const id of deck) m.set(id, (m.get(id) ?? 0) + 1);
  return [...m.entries()]
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function cardName(id: string): string {
  const def = ALL_CARD_DEFINITIONS[id] ?? ALL_CARD_DEFINITIONS[id.replace(/\+*$/, '')];
  return def?.name ?? id;
}

export function MapPage() {
  const run = useGameStore((s) => s.run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);
  const markTutorialStep = useGameStore((s) => s.markTutorialStep);
  const initRun = useGameStore((s) => s.initRun);
  const returnToMainMenu = useGameStore((s) => s.returnToMainMenu);
  const mapState = selectMapRunState(run);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [panel, setPanel] = useState<PanelKey | null>(null);
  const [legendOpen, setLegendOpen] = useState(false);
  const mapScrollRef = useRef<HTMLDivElement>(null);

  const nextIds = mapState?.nextNodeIds ?? [];
  const currentNodeId = mapState?.map.currentNodeId ?? null;
  useEffect(() => {
    if (nextIds.length === 0) {
      setSelectedNodeId(null);
      setHoveredNodeId(null);
      return;
    }
    if (selectedNodeId && !nextIds.includes(selectedNodeId)) setSelectedNodeId(null);
    if (hoveredNodeId && !nextIds.includes(hoveredNodeId)) setHoveredNodeId(null);
  }, [nextIds, selectedNodeId, hoveredNodeId]);

  useEffect(() => {
    if (!currentNodeId || !mapState) return;
    const container = mapScrollRef.current;
    if (!container) return;

    const frame = window.requestAnimationFrame(() => {
      const target = container.querySelector<SVGGElement>(
        `[data-testid="map-node-${currentNodeId}"]`,
      );
      if (!target) return;
      const targetRect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const targetTop = targetRect.top - containerRect.top + container.scrollTop;
      const isCompactLandscape = window.matchMedia(
        '(max-width: 900px) and (orientation: landscape)',
      ).matches;
      const targetOffset = container.clientHeight * (isCompactLandscape ? 0.44 : 0.72);
      container.scrollTo({
        top: Math.max(0, targetTop - targetOffset),
        behavior: 'auto',
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [currentNodeId, mapState?.map.nodes]);

  const deck = useMemo(() => deckCounts(run?.masterDeck ?? []), [run?.masterDeck]);

  if (!mapState || !run) return null;
  const { map, meta, player, masterDeckSize, currentNode: cur } = mapState;
  const curId = map.currentNodeId;
  const isBossRestNode = cur?.type === 'rest' && meta.actFloor === actFloorCount(meta.act) - 1;
  const actTitle = ACT_TITLES[meta.act] ?? '未知之地';
  const selectedNode = selectedNodeId ? map.nodes[selectedNodeId] : undefined;
  const encounterPreview = selectedNode
    ? getMapEncounterPreview(run, selectedNode, nextIds.includes(selectedNode.id))
    : { visibility: 'hidden' as const };

  const handleSelectNode = (nodeId: string) => {
    if (!nextIds.includes(nodeId)) return;
    markTutorialStep('map');
    setSelectedNodeId(nodeId);
  };

  const togglePanel = (key: PanelKey) => setPanel((p) => (p === key ? null : key));

  return (
    <RunSceneShell tone="map" className={styles.page} testId="map-page">
      <header className={styles.topBar}>
        <div className={styles.brand}>
          <p className={styles.brandMark}>SPIREWALKER</p>
          <span className={styles.brandDivider} aria-hidden />
          <div className={styles.actBlock}>
            <span className={styles.actName} data-testid="current-act">
              第 {meta.act} 章 · {actTitle}
            </span>
            <span className={styles.floorLabel}>第 {meta.actFloor} 层</span>
          </div>
        </div>
        <div className={styles.topRight}>
          <span className={styles.statPillHp} title="生命">
            <Heart className={styles.statIconHp} aria-hidden />
            {player.currentHp}/{player.maxHp}
          </span>
          <span className={styles.statPillGold} title="金币">
            <Coins className={styles.statIconGold} aria-hidden />
            {meta.gold}
          </span>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="菜单"
            aria-expanded={panel === 'menu'}
            onClick={() => togglePanel('menu')}
          >
            <Menu className={styles.iconButtonGlyph} aria-hidden />
          </button>
        </div>
      </header>

      <div className={styles.body}>
        <TutorialHint step="map" title="先选一条路线" placement="top-left">
          点亮前方任意节点，先看清它的类型和压力提示，再确认进入。
        </TutorialHint>
        <aside className={styles.legend} aria-label="地图图例">
          <button
            type="button"
            className={styles.legendToggle}
            aria-expanded={legendOpen}
            onClick={() => setLegendOpen((open) => !open)}
          >
            <span>地图图例</span>
            <span>{legendOpen ? '收起' : '查看'}</span>
          </button>
          <div className={cx(styles.legendContent, !legendOpen && styles.legendContentCollapsed)}>
            <h2 className={styles.legendTitle}>图例</h2>
            <ul className={styles.legendList}>
              {MAP_LEGEND.map(({ kind, label }) => (
                <li key={kind} className={styles.legendItem}>
                  <span
                    className={cx(styles.legendGlyphBase, styles.legendGlyphTone[kind])}
                    aria-hidden
                  >
                    <MapNodeIcon kind={kind} className={styles.legendIcon} />
                  </span>
                  <span className={styles.legendLabel}>{label}</span>
                </li>
              ))}
            </ul>
            <p className={styles.legendHint}>
              <strong>本层路线</strong>
              ：点亮前方节点，查看说明后通过“进入节点”确认。
              {isBossRestNode ? ' 下一层就是 Boss，先决定是否在此休整。' : ''}
              {cur ? ` 当前位置：${nodeTitle(cur)}。` : ''}
            </p>
          </div>
        </aside>

        <div ref={mapScrollRef} className={styles.mapScroll}>
          <MapRoute
            map={map}
            currentNodeId={curId}
            act={meta.act}
            selectedNodeId={selectedNodeId}
            hoveredNodeId={hoveredNodeId}
            selectableNodeIds={new Set(nextIds)}
            onSelectNode={handleSelectNode}
            onHoverNode={setHoveredNodeId}
          />
        </div>

        {selectedNode ? (
          <aside className={styles.nodeDetail} aria-live="polite">
            <span className={cx(styles.nodeDetailIcon, styles.legendGlyphTone[selectedNode.type])} aria-hidden>
              <MapNodeIcon kind={selectedNode.type} className={styles.legendIcon} />
            </span>
            <div className={styles.nodeDetailCopy}>
              <span className={styles.nodeDetailTitle}>
                <strong>{nodeTitle(selectedNode)}</strong>
                {encounterPreview.visibility !== 'hidden' ? (
                  <span className={styles.pressureBadge}>
                    {encounterPreview.pressureLabel}压力
                  </span>
                ) : null}
              </span>
              <p>{nodeDescription(selectedNode)}</p>
              {encounterPreview.visibility === 'exact' ? (
                <span className={styles.encounterPreview}>
                  <span className={styles.encounterPortraits} aria-hidden>
                    {encounterPreview.lineup.map((enemy, index) => (
                      <img
                        key={`${enemy.monsterId}-${index}`}
                        className={styles.encounterPortrait}
                        alt=""
                        src={enemy.portraitUrl}
                      />
                    ))}
                  </span>
                  <span className={styles.encounterIdentity}>
                    <b>{encounterPreview.name}</b>
                    <span>
                      {encounterPreview.lineup.map((enemy) => enemy.name).join(' · ')}
                    </span>
                  </span>
                  <span className={styles.threatTags}>
                    {encounterPreview.tags.map((tag) => (
                      <em key={tag}>{tag}</em>
                    ))}
                  </span>
                </span>
              ) : null}
              {encounterPreview.visibility !== 'hidden' ? (
                <small className={styles.encounterHint}>{encounterPreview.hint}</small>
              ) : null}
            </div>
            <button
              type="button"
              className={styles.enterNodeButton}
              data-testid="enter-selected-map-node"
              onClick={() => dispatchCommand({ type: 'CHOOSE_MAP_NODE', nodeId: selectedNode.id })}
            >进入节点</button>
          </aside>
        ) : null}

        {panel === 'menu' ? (
          <div className={styles.popoverMenu} role="menu">
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => {
                setPanel(null);
                returnToMainMenu();
              }}
            >
              返回主菜单
            </button>
            <button
              type="button"
              className={cx(styles.menuButton, styles.menuButtonDanger)}
              onClick={() => {
                setPanel(null);
                clearSavedRun();
                initRun(createMapRun(Date.now() & 0xffff_ffff));
              }}
            >
              放弃并开新游戏
            </button>
          </div>
        ) : null}

        {panel === 'relics' ? (
          <div className={styles.popover} role="dialog" aria-label="遗物">
            <h3 className={styles.popoverTitle}>遗物</h3>
            {meta.relics.length === 0 ? (
              <p className={styles.popoverEmpty}>尚未获得任何遗物。</p>
            ) : (
              <ul className={styles.popoverList}>
                {meta.relics.map((relicId) => {
                  const def = RELIC_DEFINITIONS[relicId];
                  return (
                    <li key={relicId} className={styles.popoverItem}>
                      <span className={styles.popoverItemHead}>
                        <ArchetypeDot relicId={relicId} />
                        {def?.name ?? relicId}
                      </span>
                      <span className={styles.popoverItemDesc}>
                        {def?.description ?? '暂无说明'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : null}

        {panel === 'deck' ? (
          <div className={styles.popover} role="dialog" aria-label="牌组速览">
            <h3 className={styles.popoverTitle}>牌组速览 · {masterDeckSize} 张</h3>
            <div className={styles.deckGrid}>
              {deck.map((row) => (
                <span key={row.id} className={styles.deckChip}>
                  <ArchetypeDot cardId={row.id} />
                  {cardName(row.id)}
                  <span className={styles.deckChipCount}>×{row.count}</span>
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {panel ? (
          <button
            type="button"
            className={styles.popoverBackdrop}
            aria-label="关闭"
            onClick={() => setPanel(null)}
          />
        ) : null}
      </div>

      <footer className={styles.bottomBar}>
        <button
          type="button"
          className={styles.dockButton}
          aria-expanded={panel === 'relics'}
          onClick={() => togglePanel('relics')}
        >
          <Gem className={styles.dockIcon} aria-hidden />
          遗物 · {meta.relics.length}
        </button>
        <button
          type="button"
          className={styles.dockButton}
          aria-expanded={panel === 'deck'}
          onClick={() => togglePanel('deck')}
        >
          <Layers className={styles.dockIcon} aria-hidden />
          牌组 · {masterDeckSize}
        </button>
      </footer>
    </RunSceneShell>
  );
}
