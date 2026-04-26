import { useState } from 'react';
import { useGameStore } from '@/game/store/gameStore';
import { BattleDeckPanel } from './BattleDeckPanel';
import { BattleHUD } from './BattleHUD';
import { BattleLogPanel } from './BattleLogPanel';
import { FastModeToggle } from './FastModeToggle';
import { PhaserBattleCanvas } from './PhaserBattleCanvas';
import { PotionBar } from './PotionBar';
import * as styles from './battlePage.css';

export function BattlePage() {
  const [sidePanel, setSidePanel] = useState<'deck' | 'log' | null>(null);
  const deckSize = useGameStore((s) => s.run?.masterDeck.length ?? 0);

  return (
    <div className={styles.page}>
      <div className={styles.headerArea}>
        <div className={styles.headerMain}>
          <BattleHUD />
        </div>
        <div className={styles.topBar}>
          <FastModeToggle />
          <PotionBar />
          <button
            className={styles.logToggle}
            type="button"
            onClick={() => setSidePanel((prev) => (prev === 'deck' ? null : 'deck'))}
            aria-pressed={sidePanel === 'deck'}
          >
            牌组 {deckSize}
          </button>
          <button
            className={styles.logToggle}
            type="button"
            onClick={() => setSidePanel((prev) => (prev === 'log' ? null : 'log'))}
            aria-pressed={sidePanel === 'log'}
          >
            日志
          </button>
        </div>
      </div>
      <div className={`${styles.main} ${!sidePanel ? styles.mainExpanded : ''}`}>
        <div className={styles.stageColumn}>
          <div className={styles.stageFrame}>
            <PhaserBattleCanvas className={styles.phaserWrap} />
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
