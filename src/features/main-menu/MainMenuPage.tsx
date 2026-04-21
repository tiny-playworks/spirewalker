import { createMapRun } from "@/game/core/engine/createMapRun";
import type { RunState } from "@/game/core/model/run";
import {
  clearSavedRun,
  loadRunFromLocalStorage,
} from "@/game/core/persistence/saveRun";
import { useGameStore } from "@/game/store/gameStore";
import { sceneThemeClass } from "@/styles/sceneTheme.css";
import * as styles from "./mainMenu.css";

const WORLD_ECHOES = ["裂响纹章", "连势", "黏液怪"] as const;

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

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
    <div className={`boot ${sceneThemeClass} ${styles.root}`}>
      <div className={styles.backdrop} aria-hidden>
        <div className={styles.heartbeat} />
        <div className={styles.aurora} />
        <div className={styles.threats}>
          <span className={`${styles.threat} ${styles.threatPosition.left}`} />
          <span className={`${styles.threat} ${styles.threatPosition.right}`} />
          <span className={`${styles.threat} ${styles.threatPosition.low}`} />
        </div>
        <div className={`${styles.spireShadow} ${styles.spireShadowFar}`} />
        <div className={styles.spireShadow} />
        <div className={styles.runes}>
          {WORLD_ECHOES.map((echo, index) => (
            <span
              key={echo}
              className={`${styles.rune} ${
                index === 0
                  ? styles.runePosition.first
                  : index === 1
                    ? styles.runePosition.second
                    : styles.runePosition.third
              }`}
            >
              {echo}
            </span>
          ))}
        </div>
        <div className={styles.sparks}>
          <span className={`${styles.spark} ${styles.sparkPosition.first}`} />
          <span className={`${styles.spark} ${styles.sparkPosition.second}`} />
          <span className={`${styles.spark} ${styles.sparkPosition.third}`} />
          <span className={`${styles.spark} ${styles.sparkPosition.fourth}`} />
        </div>
        <div className={styles.vignette} />
        <div className={styles.grid} />
      </div>
      <div className={styles.content}>
        <header className={styles.header}>
          <p className={styles.kicker}>肉鸽卡牌 · 试玩</p>
          <h1 className={styles.title}>
            <span className={styles.titleMain}>尖塔行者</span>
          </h1>
          <p className={styles.lead}>
            命令驱动战斗与地图，在一层层抉择中向尖塔更深处推进。
          </p>
          <p className={styles.tagline}>在按下开始之前，先听见尖塔的回响。</p>
        </header>

        <section className={styles.card} aria-label="开始游戏">
          <div className={styles.cardInner}>
            <div className={styles.statusBlock}>
              <p className={styles.statusKicker}>旅程回响</p>
              <p className={styles.statusTitle}>{journeyState}</p>
              <p className={styles.inlineHint}>{journeyHint}</p>
            </div>
            <button
              type="button"
              className={cx(
                styles.actionButtonBase,
                styles.actionButtonKind.primary,
                !canContinue && styles.actionButtonDisabled,
              )}
              disabled={!canContinue}
              onClick={() => {
                const saved = loadRunFromLocalStorage();
                if (saved) initRun(saved);
              }}
            >
              <span className={styles.actionButtonFlare} />
              <span className={styles.actionButtonCopy}>
                <span className={styles.actionButtonLabel}>继续冒险</span>
                <span className={cx(styles.actionButtonHintBase, styles.actionButtonHintTone.primary)}>
                  {canContinue ? "拾起上次停下的火种" : "需要先留下可追寻的足迹"}
                </span>
              </span>
              <span className={styles.actionButtonMark} aria-hidden>
                ◈
              </span>
            </button>
            <button
              type="button"
              className={cx(styles.actionButtonBase, styles.actionButtonKind.secondary)}
              data-testid="new-game-button"
              onClick={() => {
                clearSavedRun();
                initRun(createMapRun(Date.now() & 0xffff_ffff));
              }}
            >
              <span className={styles.actionButtonFlare} />
              <span className={styles.actionButtonCopy}>
                <span className={styles.actionButtonLabel}>新游戏</span>
                <span
                  className={cx(styles.actionButtonHintBase, styles.actionButtonHintTone.secondary)}
                >
                  踏入尖塔，开启一段新的征途
                </span>
              </span>
              <span className={styles.actionButtonMark} aria-hidden>
                ↟
              </span>
            </button>
          </div>
        </section>

        <footer className={styles.footer}>存档仅保存在本机浏览器中，火种不会跨设备流转。</footer>
      </div>
    </div>
  );
}
