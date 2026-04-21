import { useEffect, useState } from "react";
import { useGameStore } from "@/game/store/gameStore";

type EnemyDebugRow = {
  label: string;
  defId: string;
  intentText: string;
  aiTrace: string;
};

function isDev(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

function formatIntentDebugText(
  intent: EnemyDebugRow["intentText"] extends never
    ? never
    : Record<string, unknown>,
): string {
  if (!intent) return "-";
  switch (intent.type) {
    case "attack":
      return `atk ${intent.value}`;
    case "multi_hit":
      return `multi ${intent.value}x${intent.hits}`;
    case "heavy_charge":
      return `heavy ${intent.value} charge ${intent.charge}`;
    case "block":
      return `blk ${intent.value}`;
    case "buff":
      return `buff ${intent.statusId}:${intent.value}`;
    case "scale":
      return `scale ${intent.stat}:${intent.value}`;
    case "debuff":
      return `debuff ${intent.statusId}:${intent.value}`;
    case "reduce_status":
      return `reduce ${intent.statusId}:${intent.value}`;
    case "summon":
      return `summon ${intent.enemyId} x${intent.count}`;
    case "split_on_death":
      return `split ${intent.enemyId} x${intent.count}`;
    case "revive":
      return `revive ${intent.charges}`;
    case "thorns":
      return `thorns ${intent.damage}`;
    case "reactive":
      return `reactive ${intent.damage}`;
    case "counter":
      return `counter ${intent.threshold}/${intent.damage}`;
    case "pollute_draw":
      return `pollute ${intent.count}`;
    case "lock_hand":
      return `lock ${intent.count}`;
    case "draw_pressure":
      return `draw- ${intent.value}`;
    case "heal":
      return `heal ${intent.value}`;
    case "leech":
      return `leech ${intent.attack}`;
    case "countdown":
      return `countdown ${intent.turns}`;
    case "double_action":
      return `double ${intent.times}`;
    case "phase_shift":
      return `phase ${intent.phase}`;
    case "max_hp_down":
      return `maxhp- ${intent.value}`;
    case "mechanic_reset":
      return `reset ${intent.mode}`;
    case "copy_echo":
      return `echo ${intent.enemyId ?? "self"}`;
    case "punish_multi_play":
      return `punish play>=${intent.threshold} blk ${intent.block}`;
    case "attack_buff":
      return `atk+ ${intent.attack} ${intent.statusId}:${intent.value}`;
  }
  return "-";
}

export function DebugPanel() {
  const run = useGameStore((s) => s.run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isDev()) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "`" || event.key === "~") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isDev() || !run || !open) return null;
  const battle = run.battle;
  const enemyDebugLines: EnemyDebugRow[] = battle
    ? battle.enemyUnitIds.reduce<EnemyDebugRow[]>((acc, id) => {
        const m = battle.monsters[id];
        const u = battle.units[id];
        const intent = m?.intent;
        if (!u || !m) return acc;
        const intentText = formatIntentDebugText(intent ?? {});
        const defId = m.monsterId;
        const aiTrace = m.aiTrace ?? "-";
        acc.push({ label: u.name, defId, intentText, aiTrace });
        return acc;
      }, [])
    : [];

  return (
    <aside className="debug-panel" data-testid="debug-panel">
      <h3>Debug</h3>
      <p>
        screen: <strong>{run.screen.type}</strong> · act:{" "}
        <strong>{run.meta.act}</strong> · actFloor:{" "}
        <strong>{run.meta.actFloor}</strong> · floor:{" "}
        <strong>{run.meta.floor}</strong> · seed: <strong>{run.seed}</strong> ·
        gold: <strong>{run.meta.gold}</strong>
      </p>
      {battle ? (
        <>
          <p>
            phase: <strong>{battle.phase}</strong> · input:{" "}
            <strong>{battle.inputMode}</strong> · encounter:{" "}
            <strong>{battle.encounter.name}</strong> · pending:{" "}
            <strong>{battle.pendingAction ? "yes" : "no"}</strong>
          </p>
          {enemyDebugLines.length > 0 ? (
            <ul className="debug-enemy-list">
              {enemyDebugLines.map((row) => (
                <li key={row.label}>
                  <strong>{row.label}</strong> · def <code>{row.defId}</code> ·{" "}
                  {row.intentText}
                  <br />
                  <span className="debug-ai-trace">AI: {row.aiTrace}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              enemies: <strong>-</strong>
            </p>
          )}
          <p>
            last events:{" "}
            <strong>
              {battle.lastResolvedEvents.map((e) => e.type).join(", ") || "-"}
            </strong>
          </p>
        </>
      ) : null}
      <div className="debug-panel-actions">
        <button
          type="button"
          data-testid="debug-end-turn"
          onClick={() => dispatchCommand({ type: "END_TURN" })}
        >
          下一回合
        </button>
        <button
          type="button"
          data-testid="debug-set-player-hp"
          onClick={() =>
            dispatchCommand({ type: "DEBUG_SET_PLAYER_HP", hp: 5 })
          }
        >
          残血(5)
        </button>
        <button
          type="button"
          data-testid="debug-add-strength"
          onClick={() =>
            dispatchCommand({
              type: "DEBUG_ADD_STATUS",
              statusId: "strength",
              stacks: 2,
            })
          }
        >
          +2力量
        </button>
        <button
          type="button"
          data-testid="debug-add-hand-card"
          onClick={() =>
            dispatchCommand({
              type: "DEBUG_ADD_HAND_CARD",
              definitionId: "bash",
            })
          }
        >
          加测试牌
        </button>
        <button
          type="button"
          data-testid="debug-force-victory"
          onClick={() =>
            dispatchCommand({
              type: "DEBUG_FORCE_BATTLE_OUTCOME",
              outcome: "victory",
            })
          }
        >
          一键胜利
        </button>
        <button
          type="button"
          data-testid="debug-jump-shop"
          onClick={() =>
            dispatchCommand({ type: "DEBUG_JUMP_SCREEN", screen: "shop" })
          }
        >
          跳商店
        </button>
        <button
          type="button"
          data-testid="debug-jump-event"
          onClick={() =>
            dispatchCommand({ type: "DEBUG_JUMP_SCREEN", screen: "event" })
          }
        >
          跳事件
        </button>
        <button
          type="button"
          data-testid="debug-jump-reward"
          onClick={() =>
            dispatchCommand({ type: "DEBUG_JUMP_SCREEN", screen: "reward" })
          }
        >
          跳奖励
        </button>
      </div>
    </aside>
  );
}
