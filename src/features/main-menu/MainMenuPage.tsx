import { createMapRun } from "@/game/core/engine/createMapRun";
import type { RunState } from "@/game/core/model/run";
import {
  clearSavedRun,
  loadRunFromLocalStorage,
} from "@/game/core/persistence/saveRun";
import { useGameStore } from "@/game/store/gameStore";

const WORLD_ECHOES = ["裂响纹章", "连势", "黏液怪"] as const;

function describeScreen(type: RunState["screen"]["type"]) {
  switch (type) {
    case "battle":
      return "战斗间隙";
    case "reward":
      return "战利品前";
    case "shop":
      return "行商处";
    case "rest":
      return "营火旁";
    case "event":
      return "异象前";
    case "victory":
      return "凯旋余烬";
    case "game_over":
      return "终局回声";
    case "map":
    case "main_menu":
    default:
      return "尖塔途中";
  }
}

function describeSavedRun(run: RunState) {
  return `你停在第 ${run.meta.floor} 层的${describeScreen(run.screen.type)}，携带 ${run.meta.relics.length} 件遗物与 ${run.meta.gold} 枚金币。`;
}

export function MainMenuPage() {
  const initRun = useGameStore((s) => s.initRun);
  const savedRun = loadRunFromLocalStorage();
  const canContinue = savedRun !== null;
  const journeyState = canContinue ? "火种仍在燃烧" : "你的旅途尚未开始";
  const journeyHint = canContinue
    ? describeSavedRun(savedRun)
    : "没有留下任何足迹，但尖塔已经在雾中等待新的闯入者。";

  return (
    <div className="boot main-menu-root">
      <div className="main-menu-backdrop" aria-hidden>
        <div className="main-menu-heartbeat" />
        <div className="main-menu-aurora" />
        <div className="main-menu-threats">
          <span className="main-menu-threat main-menu-threat--left" />
          <span className="main-menu-threat main-menu-threat--right" />
          <span className="main-menu-threat main-menu-threat--low" />
        </div>
        <div className="main-menu-spire-shadow main-menu-spire-shadow--far" />
        <div className="main-menu-spire-shadow" />
        <div className="main-menu-runes">
          {WORLD_ECHOES.map((echo, index) => (
            <span key={echo} className={`main-menu-rune main-menu-rune--${index + 1}`}>
              {echo}
            </span>
          ))}
        </div>
        <div className="main-menu-sparks">
          <span className="main-menu-spark main-menu-spark--1" />
          <span className="main-menu-spark main-menu-spark--2" />
          <span className="main-menu-spark main-menu-spark--3" />
          <span className="main-menu-spark main-menu-spark--4" />
        </div>
        <div className="main-menu-vignette" />
        <div className="main-menu-grid" />
      </div>
      <div className="main-menu-content">
        <header className="main-menu-header">
          <p className="main-menu-kicker">肉鸽卡牌 · 试玩</p>
          <h1 className="main-menu-title">
            <span className="main-menu-title-main">尖塔行者</span>
          </h1>
          <p className="main-menu-lead">
            命令驱动战斗与地图，在一层层抉择中向尖塔更深处推进。
          </p>
          <p className="main-menu-tagline">在按下开始之前，先听见尖塔的回响。</p>
        </header>

        <section className="main-menu-card" aria-label="开始游戏">
          <div className="main-menu-card-inner">
            <div className="main-menu-status-block">
              <p className="main-menu-status-kicker">旅程回响</p>
              <p className="main-menu-status-title">{journeyState}</p>
              <p className="main-menu-inline-hint">{journeyHint}</p>
            </div>
            <button
              type="button"
              className="main-menu-btn main-menu-btn--primary"
              disabled={!canContinue}
              onClick={() => {
                const saved = loadRunFromLocalStorage();
                if (saved) initRun(saved);
              }}
            >
              <span className="main-menu-btn-flare" />
              <span className="main-menu-btn-copy">
                <span className="main-menu-btn-label">继续冒险</span>
                <span className="main-menu-btn-hint">
                  {canContinue ? "拾起上次停下的火种" : "需要先留下可追寻的足迹"}
                </span>
              </span>
              <span className="main-menu-btn-mark" aria-hidden>
                ◈
              </span>
            </button>
            <button
              type="button"
              className="main-menu-btn main-menu-btn--secondary"
              onClick={() => {
                clearSavedRun();
                initRun(createMapRun(Date.now() & 0xffff_ffff));
              }}
            >
              <span className="main-menu-btn-flare" />
              <span className="main-menu-btn-copy">
                <span className="main-menu-btn-label">新游戏</span>
                <span className="main-menu-btn-hint">踏入尖塔，开启一段新的征途</span>
              </span>
              <span className="main-menu-btn-mark" aria-hidden>
                ↟
              </span>
            </button>
          </div>
        </section>

        <footer className="main-menu-footer">存档仅保存在本机浏览器中，火种不会跨设备流转。</footer>
      </div>
    </div>
  );
}
