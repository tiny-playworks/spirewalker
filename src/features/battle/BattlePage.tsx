import { useState } from 'react';
import { BattleHUD } from './BattleHUD';
import { BattleLogPanel } from './BattleLogPanel';
import { FastModeToggle } from './FastModeToggle';
import { PhaserBattleCanvas } from './PhaserBattleCanvas';
import * as styles from './battlePage.css';

export function BattlePage() {
  const [logOpen, setLogOpen] = useState(false);

  return (
    <div className={styles.page}>
      <BattleHUD />
      <div className={styles.topBar}>
        <button
          className={styles.logToggle}
          type="button"
          onClick={() => setLogOpen((prev) => !prev)}
          aria-pressed={logOpen}
        >
          {logOpen ? '隐藏日志' : '显示日志'}
        </button>
      </div>
      <div className={`${styles.main} ${!logOpen ? styles.mainExpanded : ''}`}>
        <div className={styles.stageColumn}>
          <div className={styles.stageFrame}>
            <PhaserBattleCanvas className={styles.phaserWrap} />
          </div>
          <div className={styles.footer}>
            <FastModeToggle />
            <p className={styles.footerHint}>
              单体牌可拖到敌人身上，或先点卡再点目标；全体牌拖到战区；药水直接点按钮使用。
            </p>
          </div>
        </div>
        {logOpen ? (
          <div className={styles.sidebar}>
            <BattleLogPanel />
          </div>
        ) : null}
      </div>
    </div>
  );
}
