import { createMapRun } from '@/game/core/engine/createMapRun';
import { getCharacterDefinition } from '@/game/core/definitions/characters';
import { WANDERING_MERCHANT_EVENT_ID } from '@/game/core/engine/generateBranchingFloor';
import { RELIC_DEFINITIONS } from '@/game/core/definitions/relics';
import type { MapNode } from '@/game/core/model/map';
import { clearSavedRun } from '@/game/core/persistence/saveRun';
import { useGameStore } from '@/game/store/gameStore';
import { selectMapRunState } from '@/game/store/selectors/mapSelectors';
import { MapRoute } from './MapRoute';

const MAP_LEGEND: { glyph: string; label: string }[] = [
  { glyph: '营', label: '营地' },
  { glyph: '战', label: '普通战斗' },
  { glyph: '精', label: '精英' },
  { glyph: '王', label: 'Boss' },
  { glyph: '店', label: '商店' },
  { glyph: '息', label: '休息' },
  { glyph: '事', label: '事件' },
  { glyph: '箱', label: '宝箱' },
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
              {meta.floor >= 2
                ? '第二层随机岔路：线段表示允许前进的一步；高亮为当前可走区域，灰色为已放弃分支。'
                : '第一层随机岔路：线段即合法边，只能点下方「下一步」里与当前格相连的节点；游荡商人会进事件。'}
            </p>
            <div className="map-legend" aria-label="地图图例">
              <div className="map-legend-row">
                <span className="map-legend-title">节点</span>
                <ul className="map-legend-list">
                  {MAP_LEGEND.map(({ glyph, label }) => (
                    <li key={glyph} className="map-legend-item">
                      <span className="map-legend-glyph" aria-hidden>
                        {glyph}
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
            <MapRoute map={map} currentNodeId={curId} floor={meta.floor} />
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
          ) : (
            <ul className="map-choices">
              {nextIds.map((id) => {
                const n = map.nodes[id];
                if (!n) return null;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className="map-node-btn"
                      onClick={() => dispatchCommand({ type: 'CHOOSE_MAP_NODE', nodeId: id })}
                    >
                      <span className="map-node-main">
                        <span className="map-node-title">{nodeTitle(n)}</span>
                        <span className="map-node-type">{typeLabel(n.type)}</span>
                      </span>
                      <span className="map-node-chev" aria-hidden>
                        →
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
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
