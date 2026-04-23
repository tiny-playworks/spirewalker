import { useEffect, useState } from 'react';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
import { WANDERING_MERCHANT_EVENT_ID } from '@/game/core/engine/generateBranchingFloor';
import { RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import type { MapNode } from '@/game/core/model/map';
import { clearSavedRun } from '@/game/core/persistence/saveRun';
import { useGameStore } from '@/game/store/gameStore';
import { selectMapRunState } from '@/game/store/selectors/mapSelectors';
import { sceneThemeClass } from '@/styles/sceneTheme.css';
import { MapRoute } from './MapRoute';
import * as styles from './mapPage.css';
import { MapNodeIcon } from './mapNodeIcons';

const MAP_LEGEND: { kind: 'camp' | MapNode['type']; label: string }[] = [
  { kind: 'camp', label: '营地' },
  { kind: 'battle', label: '普通战斗' },
  { kind: 'elite', label: '精英' },
  { kind: 'boss', label: 'Boss' },
  { kind: 'shop', label: '商店' },
  { kind: 'rest', label: '休息' },
  { kind: 'event', label: '事件' },
  { kind: 'treasure', label: '宝箱' },
];

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function nodeTitle(n: MapNode): string {
  if (n.x === 0) return `Act ${n.act} · 营地`;
  switch (n.type) {
    case 'battle':
      return '战斗 · 黏液怪';
    case 'elite':
      return '精英 · 黏液精英';
    case 'boss':
      return 'Boss · 黏液领主';
    case 'shop':
      return '商人营地';
    case 'rest':
      return '篝火休息';
    case 'event':
      return n.eventScriptId === WANDERING_MERCHANT_EVENT_ID ? '游荡商人' : '路过事件';
    case 'treasure':
      return '宝箱';
    default:
      return n.id;
  }
}

export function MapPage() {
  const run = useGameStore((s) => s.run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);
  const initRun = useGameStore((s) => s.initRun);
  const returnToMainMenu = useGameStore((s) => s.returnToMainMenu);
  const mapState = selectMapRunState(run);
  if (!mapState) return null;
  const { map, meta, player, masterDeckSize, currentNode: cur, nextNodeIds: nextIds } = mapState;
  const curId = map.currentNodeId;
  const locationName = cur && curId ? nodeTitle(cur) : '—';
  const character = getCharacterDefinition(meta.characterId);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (nextIds.length === 0) {
      setSelectedNodeId(null);
      setHoveredNodeId(null);
      return;
    }
    if (selectedNodeId && !nextIds.includes(selectedNodeId)) {
      setSelectedNodeId(null);
    }
    if (hoveredNodeId && !nextIds.includes(hoveredNodeId)) {
      setHoveredNodeId(null);
    }
  }, [nextIds, selectedNodeId, hoveredNodeId]);

  const hoveredNode = hoveredNodeId ? map.nodes[hoveredNodeId] ?? null : null;
  const selectedNode = selectedNodeId ? map.nodes[selectedNodeId] ?? null : null;
  const handleSelectNode = (nodeId: string) => {
    if (!nextIds.includes(nodeId)) return;
    if (selectedNodeId === nodeId) {
      dispatchCommand({ type: 'CHOOSE_MAP_NODE', nodeId });
      return;
    }
    setSelectedNodeId(nodeId);
  };

  return (
    <div className={`${sceneThemeClass} ${styles.page}`}>
      <header className={styles.hud}>
        <div className={styles.hudTop}>
          <div className={styles.hudChips} aria-label="冒险状态">
            <div className={styles.chipFloor}>Act {meta.act}</div>
            <div className={styles.chip}>本章第 <strong>{meta.actFloor}</strong> 层</div>
            <div className={styles.chip}>全局第 <strong>{meta.floor}</strong> 层</div>
            <div className={styles.chip}>
              金币 <strong>{meta.gold}</strong>
            </div>
            <div className={styles.chip}>
              药水 <strong>{meta.potions.length}</strong>
            </div>
            <div className={styles.chip}>
              生命{' '}
              <strong>
                {player.currentHp}/{player.maxHp}
              </strong>
            </div>
            <div className={styles.chip}>
              牌组 <strong>{masterDeckSize}</strong> 张
            </div>
            <div className={styles.chip} title={`${character.description}\n被动：${character.passiveDescription}`}>
              角色 <strong>{character.name}</strong>
            </div>
          </div>
          <div className={styles.hudAside}>
            <div className={styles.systemToolbar}>
              <button
                type="button"
                className={cx(styles.toolButtonBase, styles.toolButtonTone.default)}
                onClick={returnToMainMenu}
              >
                返回主菜单
              </button>
              <button
                type="button"
                className={cx(styles.toolButtonBase, styles.toolButtonTone.danger)}
                onClick={() => {
                  clearSavedRun();
                  initRun(createMapRun(Date.now() & 0xffff_ffff));
                }}
              >
                新游戏
              </button>
            </div>
            <div className={styles.hudCurrent}>
              <span className={styles.hudCurrentKey}>当前位置</span>
              <span className={styles.hudCurrentValue}>{locationName}</span>
              <span className={styles.hudCurrentSub}>
                {meta.actFloor === 19 || meta.actFloor === 23 || meta.actFloor === 25
                  ? '下一层就是 Boss，先决定要不要在这里修整。'
                  : '发光营地就是你所在的位置。'}
              </span>
            </div>
          </div>
        </div>
        {meta.relics.length > 0 ? (
          <div className={styles.hudRelics}>
            <span className={styles.hudRelicsKey}>遗物</span>
            <span>
              {meta.relics.map((id) => RELIC_DEFINITIONS[id]?.name ?? id).join('、')}
            </span>
          </div>
        ) : null}
      </header>

      <div className={styles.body}>
        <section className={styles.board} aria-labelledby="map-board-title">
          <aside className={styles.sidePanel}>
            <div className={styles.routeIntro}>
              <h2 id="map-board-title" className={styles.boardTitle}>
                本层路线
              </h2>
              <p className={styles.boardSub}>
                {nextIds.length > 0
                  ? hoveredNode
                    ? `悬停预览：${hoverPreviewHint(hoveredNode)}`
                    : selectedNode
                      ? `已选中：${nodeTitle(selectedNode)}。再点一次该节点直接进入。`
                      : '先点亮一个前方节点，再点一次同一节点直接进入。'
                  : '这一层的路线已经走到尽头。'}
              </p>
            </div>

            <div className={styles.legend} aria-label="地图图例">
              <div className={styles.legendRow}>
                <span className={styles.legendTitle}>节点图例</span>
                <ul className={styles.legendList}>
                  {MAP_LEGEND.map(({ kind, label }) => (
                    <li key={kind} className={styles.legendItem}>
                      <span className={cx(styles.legendGlyphBase, styles.legendGlyphTone[kind])} aria-hidden>
                        <MapNodeIcon kind={kind} className={styles.legendIcon} />
                      </span>
                      <span className={styles.legendLabel}>{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.legendRow}>
                <span className={styles.legendTitle}>路线说明</span>
                <ul className={styles.legendEdgeList}>
                  <li className={styles.legendEdgeItem}>
                    <span className={styles.edgeSwatchBright} aria-hidden />
                    <span className={styles.legendLabel}>亮色：当前可达，或仍属于可前进路径的边</span>
                  </li>
                  <li className={styles.legendEdgeItem}>
                    <span className={styles.edgeSwatchDim} aria-hidden />
                    <span className={styles.legendLabel}>灰色：已经剪枝，后续不会再走到的分支</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.objectiveCard}>
              <span className={styles.objectiveKey}>当前位置</span>
              <strong className={styles.objectiveValue}>{locationName}</strong>
              <span className={styles.objectiveText}>
                {meta.actFloor === 19 || meta.actFloor === 23 || meta.actFloor === 25
                  ? '下一层就是 Boss，先决定要不要在这里修整。'
                  : '发光营地就是你所在的位置。'}
              </span>
            </div>
          </aside>

          <div className={styles.stage}>
            <div className={styles.stageRoute}>
              <div className={styles.boardRoute}>
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function hoverPreviewHint(node: MapNode): string {
  switch (node.routeBias) {
    case 'risk':
      return '这条路线偏高风险，短期更容易遇到硬仗或精英。';
    case 'safe':
      return '这条路线偏稳健，短期更容易接到补给或恢复窗口。';
    default:
      return '这条路线比较平衡，方便再观察后续转向。';
  }
}
