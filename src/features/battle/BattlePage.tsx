import { useState } from 'react';
import { useGameStore } from '@/game/store/gameStore';
import { BattleDeckPanel } from './BattleDeckPanel';
import { BattleHUD } from './BattleHUD';
import { BattleLogPanel } from './BattleLogPanel';
import { FastModeToggle } from './FastModeToggle';
import { PotionBar } from './PotionBar';
import { ReactBattleStage } from './ReactBattleStage';
import * as styles from './battlePage.css';

export function BattlePage() {
  const [sidePanel, setSidePanel] = useState<'deck' | 'log' | null>(null);
  const run = useGameStore((s) => s.run);
  const deckSize = run?.masterDeck.length ?? 0;
  const levelTitle = run
    ? `LEVEL ${run.meta.act}-${run.meta.actFloor}: THE GILDED RUINS`
    : 'LEVEL 1-1: THE GILDED RUINS';
  const turn = run?.battle?.turn ?? 1;

  return (
    <div className={styles.page}>
      <div className={styles.headerArea}>
        <div className={styles.headerMain}>
          <BattleHUD />
        </div>
        <div className={styles.levelTitle} aria-label={`${levelTitle}，第 ${turn} 回合`}>
          <strong>{levelTitle}</strong>
          <span>Turn {turn}</span>
        </div>
        <div className={styles.topBar}>
          <FastModeToggle />
          <PotionBar />
          <button
            className={styles.logToggle}
            type="button"
            onClick={() => setSidePanel((prev) => (prev === 'deck' ? null : 'deck'))}
            aria-pressed={sidePanel === 'deck'}
            aria-label={`查看牌组，共 ${deckSize} 张`}
            title={`牌组 ${deckSize}`}
          >
            牌 {deckSize}
          </button>
          <button
            className={styles.logToggle}
            type="button"
            onClick={() => setSidePanel((prev) => (prev === 'log' ? null : 'log'))}
            aria-pressed={sidePanel === 'log'}
            aria-label="查看战斗日志"
            title="日志"
          >
            记
          </button>
        </div>
      </div>
      <div className={`${styles.main} ${!sidePanel ? styles.mainExpanded : ''}`}>
        <div className={styles.stageColumn}>
          <div className={styles.stageFrame}>
            <ReactBattleStage className={styles.stageWrap} />
          </div>
          <div className={styles.footer}>
            <p className={styles.footerHint}>
              单体牌可拖到敌人身上，或先点卡再点目标；全体牌拖到战区；药水直接点按钮使用。
            </p>
          </div>
        </div>
        {sidePanel ? (
          <div className={styles.sidebar}>
            {sidePanel === 'deck' ? <BattleDeckPanel /> : <BattleLogPanel />}
          </div>
        ) : null}
      </div>
    </div>
  );
}
