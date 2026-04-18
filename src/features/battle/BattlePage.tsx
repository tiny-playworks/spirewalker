import { BattleHUD } from './BattleHUD';
import { BattleLogPanel } from './BattleLogPanel';
import { FastModeToggle } from './FastModeToggle';
import { PhaserBattleCanvas } from './PhaserBattleCanvas';

export function BattlePage() {
  return (
    <div className="battle-page">
      <BattleHUD />
      <div className="battle-main">
        <PhaserBattleCanvas />
        <BattleLogPanel />
      </div>
      <div className="battle-footer">
        <FastModeToggle />
        <p className="hint">
          单体牌可拖到敌人身上，或先点卡再点目标；全体牌拖到战区；药水直接点按钮使用。
        </p>
      </div>
    </div>
  );
}
