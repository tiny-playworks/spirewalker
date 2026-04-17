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
          单体攻击拖到敌人上；顺劈等全体牌拖到右侧战域或任意敌人上再松手；防御任意处松手。药水点按钮使用。
        </p>
      </div>
    </div>
  );
}
