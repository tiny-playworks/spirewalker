import { useEffect, useMemo, useState } from 'react';
import { createMapRun } from '@/game/core/engine/createMapRun';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
import { WANDERING_MERCHANT_EVENT_ID } from '@/game/core/engine/generateBranchingFloor';
import { RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import type { MapNode } from '@/game/core/model/map';
import { clearSavedRun } from '@/game/core/persistence/saveRun';
import { useGameStore } from '@/game/store/gameStore';
import { selectMapRunState } from '@/game/store/selectors/mapSelectors';
import { MapRoute } from './MapRoute';
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

function nodeTitle(n: MapNode): string {
  if (n.x === 0) return n.floor >= 2 ? '第二层 · 营地' : '营地';
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
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nextIds[0] ?? null);

  useEffect(() => {
    if (nextIds.length === 0) {
      setSelectedNodeId(null);
      return;
    }
    if (!selectedNodeId || !nextIds.includes(selectedNodeId)) {
      setSelectedNodeId(nextIds[0] ?? null);
    }
  }, [nextIds, selectedNodeId]);

  const nextNodes = useMemo(
    () => nextIds.map((id) => map.nodes[id]).filter((node): node is MapNode => Boolean(node)),
    [nextIds, map.nodes],
  );
  const selectedNode = selectedNodeId ? map.nodes[selectedNodeId] ?? null : null;

  return (
    <div className="map-page">
      <header className="map-hud">
        <div className="map-hud-top">
          <div className="map-hud-chips" aria-label="冒险状态">
            <div className="map-chip map-chip--floor">第 {meta.floor} 层</div>
            <div className="map-chip">
              金币 <strong>{meta.gold}</strong>
            </div>
            <div className="map-chip">
              药水 <strong>{meta.potions.length}</strong>
            </div>
            <div className="map-chip">
              生命{' '}
              <strong>
                {player.currentHp}/{player.maxHp}
              </strong>
            </div>
            <div className="map-chip">
              牌组 <strong>{masterDeckSize}</strong> 张
            </div>
            <div className="map-chip" title={`${character.description}\n被动：${character.passiveDescription}`}>
              角色 <strong>{character.name}</strong>
            </div>
          </div>
          <div className="map-hud-current">
            <span className="map-hud-current-k">当前位置</span>
            <span className="map-hud-current-v">{locationName}</span>
            <span className="map-hud-current-sub">发光营地就是你所在的位置</span>
          </div>
        </div>
        {meta.relics.length > 0 ? (
          <div className="map-hud-relics">
            <span className="map-hud-relics-k">遗物</span>
            <span className="map-hud-relics-v">
              {meta.relics.map((id) => RELIC_DEFINITIONS[id]?.name ?? id).join('、')}
            </span>
          </div>
        ) : null}
      </header>

      <div className="map-body">
        <section className="map-board" aria-labelledby="map-board-title">
          <div className="map-board-head">
            <h2 id="map-board-title" className="map-board-title">
              本层路线
            </h2>
            <p className="map-board-sub">
              {nextIds.length > 0
                ? '先在地图上点亮一个前方节点，再从下方确认行动。'
                : '这一层的路线已经走到尽头。'}
            </p>
            <div className="map-legend" aria-label="地图图例">
              <div className="map-legend-row">
                <span className="map-legend-title">节点</span>
                <ul className="map-legend-list">
                  {MAP_LEGEND.map(({ kind, label }) => (
                    <li key={kind} className="map-legend-item">
                      <span className={`map-legend-glyph map-legend-glyph--${kind}`} aria-hidden>
                        <MapNodeIcon kind={kind} className="map-legend-icon" />
                      </span>
                      <span className="map-legend-label">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="map-legend-row">
                <span className="map-legend-title">连线</span>
                <ul className="map-legend-list map-legend-list--edges">
                  <li className="map-legend-item map-legend-item--edge">
                    <span
                      className="map-legend-edge-swatch map-legend-edge-swatch--bright"
                      aria-hidden
                    />
                    <span className="map-legend-label">
                      亮色：经过当前格，或两端仍在「仍可前进」范围内的边
                    </span>
                  </li>
                  <li className="map-legend-item map-legend-item--edge">
                    <span
                      className="map-legend-edge-swatch map-legend-edge-swatch--dim"
                      aria-hidden
                    />
                    <span className="map-legend-label">
                      灰色：已剪枝、不再能走到的分支
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="map-board-route">
            <MapRoute
              map={map}
              currentNodeId={curId}
              floor={meta.floor}
              selectedNodeId={selectedNodeId}
              selectableNodeIds={new Set(nextIds)}
              onSelectNode={(id) => {
                if (nextIds.includes(id)) setSelectedNodeId(id);
              }}
            />
          </div>
        </section>

        <section className="map-actions-panel">
          <div className="map-toolbar">
            <button type="button" className="map-tool-btn" onClick={returnToMainMenu}>
              返回主菜单
            </button>
            <button
              type="button"
              className="map-tool-btn map-tool-btn--danger"
              onClick={() => {
                clearSavedRun();
                initRun(createMapRun(Date.now() & 0xffff_ffff));
              }}
            >
              新游戏（清存档）
            </button>
          </div>
          {nextIds.length === 0 ? (
            <p className="map-done">本层线路已清空。</p>
          ) : !selectedNode ? (
            <p className="map-selection-prompt">在地图上选择一个前方节点，继续你的路线。</p>
          ) : (
            <div className="map-decision-panel">
              <div className="map-decision-head">
                <div className="map-decision-copy">
                  <p className="map-decision-kicker">当前抉择</p>
                  <h3 className="map-decision-title">
                    {laneLabelForNode(selectedNode, nextNodes)} · {nodeTitle(selectedNode)}
                  </h3>
                  <p className="map-decision-desc">{decisionHintForNode(selectedNode)}</p>
                </div>
                <div className="map-decision-badges">
                  <span className={`map-decision-badge map-decision-badge--${selectedNode.type}`}>
                    {typeLabel(selectedNode.type)}
                  </span>
                  <span className="map-decision-badge map-decision-badge--lane">
                    {laneLabelForNode(selectedNode, nextNodes)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className={`map-decision-cta map-decision-cta--${selectedNode.type}`}
                onClick={() => dispatchCommand({ type: 'CHOOSE_MAP_NODE', nodeId: selectedNode.id })}
              >
                前往 {nodeTitle(selectedNode)}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function laneLabelForNode(node: MapNode, peers: MapNode[]): string {
  const ordered = [...peers].sort((a, b) => a.y - b.y);
  if (ordered.length <= 1) return '唯一路线';
  const index = ordered.findIndex((peer) => peer.id === node.id);
  if (index <= 0) return '上路';
  if (index === ordered.length - 1) return '下路';
  if (ordered.length === 3 && index === 1) return '中路';
  return `第 ${index + 1} 路`;
}

function decisionHintForNode(node: MapNode): string {
  switch (node.type) {
    case 'battle':
      return '正面战斗，拿下这一战后继续向前推进。';
    case 'elite':
      return '危险更高，但回报也更重，适合状态稳定时出手。';
    case 'boss':
      return '这一战会决定本层的终点，确认状态再踏进去。';
    case 'shop':
      return '用金币换取节奏，补牌、补药水或找关键资源。';
    case 'rest':
      return '喘口气，修整自己，为后面的强敌留余地。';
    case 'event':
      return '未知会带来岔路，可能是机遇，也可能是代价。';
    case 'treasure':
      return '拿走奖励，再决定这份收益要如何转化成优势。';
    default:
      return '选择这条路线，继续向尖塔深处推进。';
  }
}

function typeLabel(t: string): string {
  switch (t) {
    case 'battle':
      return '普通战';
    case 'elite':
      return '精英';
    case 'boss':
      return 'Boss';
    case 'shop':
      return '商店';
    case 'rest':
      return '休息';
    case 'event':
      return '事件';
    case 'treasure':
      return '宝箱';
    default:
      return t;
  }
}
