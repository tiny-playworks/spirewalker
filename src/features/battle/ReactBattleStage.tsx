import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  buildCardKeywordHints,
  cardTargetLabel,
  cardTypeLabel,
  formatMonsterIntentText,
} from "@/game/core/battleUiText";
import { ALL_CARD_DEFINITIONS } from "@/game/core/definitions/cards";
import { getCardArchetype } from "@/game/core/definitions/cards/archetypes";
import { getStatusMeta } from "@/game/core/definitions/statuses";
import type { BattleState } from "@/game/core/model/battle";
import type { CardDefinition, CardInstance } from "@/game/core/model/card";
import type { CombatUnit } from "@/game/core/model/unit";
import { useGameStore } from "@/game/store/gameStore";
import {
  getCardArtSources,
  getIntentIconSources,
  getStatusIconSources,
  intentCategory,
  intentValueText,
  type IntentCategory,
} from "./combatAssets";
import * as styles from "./reactBattleStage.css";

type DragPayload = { cardInstanceId: string };

const BATTLE_BACKDROP_URL = "/assets/combat/gilded-ruins.png";
const PLAYER_SPRITE_URL = "/assets/combat/player.png";
const ENEMY_SPRITE_URL = "/assets/combat/enemy.png";

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

/** 依次尝试多个图片源，全部加载失败时回退到 fallback 节点（文字/CSS 占位）。 */
function FallbackImg({
  sources,
  alt,
  className,
  fallback = null,
}: {
  sources: string[];
  alt: string;
  className?: string;
  fallback?: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  if (index >= sources.length) return <>{fallback}</>;
  return (
    <img
      className={className}
      alt={alt}
      src={sources[index]}
      draggable={false}
      onError={() => setIndex((i) => i + 1)}
    />
  );
}

const INTENT_CATEGORY_TONE: Record<IntentCategory, keyof typeof styles.intentTone> = {
  attack: "attack",
  defend: "block",
  buff: "utility",
  debuff: "attack",
  unknown: "utility",
};

function effectiveCost(card: CardInstance, battle: BattleState): number {
  return Math.max(
    0,
    card.costForTurn +
      battle.cursePrideCostPressure +
      battle.curseConfusionCostDelta,
  );
}

function cardFocus(def: CardDefinition): {
  value: string;
  label: string;
  tone: "attack" | "block" | "utility";
} {
  let damage = 0;
  let block = 0;
  for (const effect of def.effects) {
    if (effect.type === "damage") damage += effect.value;
    if (effect.type === "block") block += effect.value;
    if (effect.type === "repeat") {
      for (const nested of effect.effects) {
        if (nested.type === "damage") damage += nested.value * effect.times;
        if (nested.type === "block") block += nested.value * effect.times;
      }
    }
    if (
      effect.type === "custom" &&
      effect.scriptId === "momentum_burst_damage"
    ) {
      damage += Number(effect.params?.baseDamage ?? 0);
    }
    if (
      effect.type === "custom" &&
      effect.scriptId === "momentum_guard_by_stacks"
    ) {
      block += Number(effect.params?.baseBlock ?? 0);
    }
  }
  if (damage > 0)
    return { value: String(damage), label: "伤害", tone: "attack" };
  if (block > 0) return { value: String(block), label: "格挡", tone: "block" };
  if (def.type === "power")
    return { value: "持", label: "能力", tone: "utility" };
  return { value: "技", label: cardTypeLabel(def.type), tone: "utility" };
}

export function ReactBattleStage({ className }: { className?: string }) {
  const run = useGameStore((s) => s.run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);
  const fastMode = useGameStore((s) => s.fastMode);
  const battle = run?.battle ?? null;
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);

  useEffect(() => {
    if (!battle || battle.inputMode !== "animation_lock") return;
    const timer = window.setTimeout(
      () => dispatchCommand({ type: "RESOLVE_ANIMATION_DONE" }),
      fastMode ? 120 : 360,
    );
    return () => window.clearTimeout(timer);
  }, [
    battle?.id,
    battle?.inputMode,
    battle?.lastResolvedEvents,
    dispatchCommand,
    fastMode,
  ]);

  useEffect(() => {
    if (!battle?.player.hand.includes(selectedCardId ?? "")) {
      setSelectedCardId(null);
    }
  }, [battle?.player.hand, selectedCardId]);

  const pendingCardId =
    battle?.pendingAction?.type === "play_card"
      ? battle.pendingAction.cardInstanceId
      : null;
  const activeCardId = pendingCardId ?? selectedCardId;
  const player = battle ? battle.units[battle.playerUnitId] : null;
  const enemies = useMemo(() => {
    if (!battle) return [];
    return battle.enemyUnitIds.map((id) => battle.units[id]).filter(Boolean);
  }, [battle]);

  if (!battle || !player) return <div className={className} />;

  const playCard = (cardInstanceId: string, targetUnitId?: string) => {
    dispatchCommand({
      type: "PLAY_CARD",
      cardInstanceId,
      sourceUnitId: battle.playerUnitId,
      targetUnitId,
    });
    setSelectedCardId(null);
  };

  const handleCardClick = (card: CardInstance, def: CardDefinition) => {
    if (!canPlayCard(card, battle)) return;
    if (def.target === "single_enemy") {
      playCard(card.instanceId);
      setSelectedCardId(card.instanceId);
      return;
    }
    playCard(card.instanceId);
  };

  const handleEnemyTarget = (enemyId: string) => {
    const cardId = activeCardId;
    if (!cardId) return;
    playCard(cardId, enemyId);
  };

  return (
    <div className={cx(className, styles.root)}>
      <div className={styles.backdrop} aria-hidden>
        <div
          className={styles.backdropImage}
          style={{ backgroundImage: `url(${BATTLE_BACKDROP_URL})` }}
        />
        <div className={styles.spire} />
        <div className={styles.grid} />
      </div>

      <section className={styles.combatLayer} aria-label="战斗场">
        <UnitPanel unit={player} tone="player" spriteUrl={PLAYER_SPRITE_URL} />

        <div className={styles.enemyRail}>
          {enemies.map((enemy) => (
            <EnemyPanel
              key={enemy.id}
              battle={battle}
              unit={enemy}
              targetActive={Boolean(activeCardId)}
              onTarget={() => handleEnemyTarget(enemy.id)}
              onDropCard={(cardId) => playCard(cardId, enemy.id)}
              spriteUrl={ENEMY_SPRITE_URL}
            />
          ))}
        </div>
      </section>

      <section className={styles.bottomDock} aria-label="战斗操作">
        <div className={styles.leftDock}>
          <Pile label="DRAW" value={battle.player.drawPile.length} />
          <div
            className={styles.energyCore}
            aria-label={`能量 ${battle.player.energy}/${battle.player.maxEnergy}`}
          >
            <strong>{battle.player.energy}</strong>
            <span>ENERGY</span>
          </div>
        </div>

        <section className={styles.hand} aria-label="手牌">
          {battle.player.hand.map((cardInstanceId, index) => {
            const card = battle.player.cards[cardInstanceId];
            const def = card ? ALL_CARD_DEFINITIONS[card.definitionId] : null;
            if (!card || !def) return null;
            const focus = cardFocus(def);
            const playable = canPlayCard(card, battle);
            const selected = activeCardId === card.instanceId;
            const spread =
              battle.player.hand.length <= 1
                ? 0
                : index - (battle.player.hand.length - 1) / 2;
            return (
              <button
                key={card.instanceId}
                type="button"
                draggable={playable}
                className={cx(
                  styles.card,
                  styles.cardTone[getCardArchetype(def.id)],
                  selected && styles.cardSelected,
                  !playable && styles.cardDisabled,
                )}
                style={{
                  transform: `translateY(${Math.abs(spread) * 4}px) rotate(${spread * 7}deg)`,
                  zIndex: 20 + index,
                }}
                title={[def.description, ...buildCardKeywordHints(def)].join(
                  "\n",
                )}
                onClick={() => handleCardClick(card, def)}
                onDragStart={(event) => {
                  if (!playable) return;
                  const payload: DragPayload = {
                    cardInstanceId: card.instanceId,
                  };
                  event.dataTransfer.setData(
                    "application/spirewalker-card",
                    JSON.stringify(payload),
                  );
                  setDraggingCardId(card.instanceId);
                  dispatchCommand({
                    type: "BEGIN_DRAG_CARD",
                    cardInstanceId: card.instanceId,
                    sourceUnitId: battle.playerUnitId,
                  });
                }}
                onDragEnd={() => {
                  setDraggingCardId(null);
                  dispatchCommand({ type: "CANCEL_DRAG_CARD" });
                }}
                data-dragging={
                  draggingCardId === card.instanceId ? "true" : "false"
                }
                data-testid={`battle-card-${card.instanceId}`}
              >
                <span className={styles.cardCost}>
                  {effectiveCost(card, battle)}
                </span>
                <span className={styles.cardHead}>
                  <strong>
                    {def.name}
                    {card.upgraded ? "+" : ""}
                  </strong>
                  <span>{cardTypeLabel(def.type)}</span>
                </span>
                <span
                  className={cx(styles.cardArt, styles.cardArtTone[focus.tone])}
                  aria-hidden
                >
                  <FallbackImg
                    className={styles.cardArtImg}
                    alt=""
                    sources={getCardArtSources(def.id)}
                    fallback={
                      <span
                        className={cx(
                          styles.cardFocus,
                          styles.cardFocusTone[focus.tone],
                        )}
                      >
                        <strong>{focus.value}</strong>
                        <span>{focus.label}</span>
                      </span>
                    }
                  />
                </span>
                <span className={styles.cardDesc}>{def.description}</span>
                <span className={styles.cardFoot}>
                  {cardTargetLabel(def.target)}
                </span>
              </button>
            );
          })}
        </section>

        <div className={styles.rightDock}>
          <Pile label="DISCARD" value={battle.player.discardPile.length} muted />
          <Pile label="EXHAUST" value={battle.player.exhaustPile.length} muted />
          {battle.phase === "victory" ? (
            <button
              type="button"
              className={styles.rewardButton}
              data-testid="leave-battle-to-reward"
              onClick={() => dispatchCommand({ type: "LEAVE_BATTLE_TO_REWARD" })}
            >
              领取奖励
            </button>
          ) : (
            <button
              type="button"
              className={styles.endTurnButton}
              aria-label="结束回合"
              disabled={
                battle.phase !== "player_action" ||
                battle.inputMode === "animation_lock"
              }
              onClick={() => dispatchCommand({ type: "END_TURN" })}
            >
              END TURN »
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

function canPlayCard(card: CardInstance, battle: BattleState): boolean {
  const def = ALL_CARD_DEFINITIONS[card.definitionId];
  if (!def || def.type === "curse" || def.type === "status") return false;
  if (battle.phase !== "player_action" || battle.inputMode === "animation_lock")
    return false;
  if (battle.player.lockedCardInstanceIds.includes(card.instanceId))
    return false;
  return battle.player.energy >= effectiveCost(card, battle);
}

function UnitPanel({
  unit,
  tone,
  spriteUrl,
}: {
  unit: CombatUnit;
  tone: "player" | "enemy";
  spriteUrl: string;
}) {
  const hpRatio =
    unit.maxHp > 0 ? Math.max(0, Math.min(1, unit.hp / unit.maxHp)) : 0;
  return (
    <article
      className={cx(
        styles.unit,
        styles.unitTone[tone],
        !unit.alive && styles.unitDead,
      )}
    >
      <div className={styles.spriteFrame}>
        <div
          className={styles.unitSprite}
          style={{ backgroundImage: `url(${spriteUrl})` }}
        />
      </div>
      <div className={styles.unitBody}>
        <div
          className={styles.hpTrack}
          aria-label={`${unit.name} 生命 ${unit.hp}/${unit.maxHp}`}
        >
          <span style={{ width: `${hpRatio * 100}%` }} />
          <strong>
            {unit.hp}/{unit.maxHp}
          </strong>
        </div>
        <div className={styles.unitHeader}>
          <strong>{unit.name}</strong>
        </div>
        <StatusList unit={unit} />
        {unit.block > 0 ? (
          <span className={styles.blockBadge}>格挡 {unit.block}</span>
        ) : null}
      </div>
    </article>
  );
}

function EnemyPanel({
  battle,
  unit,
  targetActive,
  onTarget,
  onDropCard,
  spriteUrl,
}: {
  battle: BattleState;
  unit: CombatUnit;
  targetActive: boolean;
  onTarget: () => void;
  onDropCard: (cardInstanceId: string) => void;
  spriteUrl: string;
}) {
  const intent = battle.monsters[unit.id]?.intent;
  const intentText = formatMonsterIntentText(intent);
  const category = intentCategory(intent);
  const valueText = intentValueText(intent);
  return (
    <button
      type="button"
      className={cx(
        styles.enemyTarget,
        targetActive && unit.alive && styles.enemyTargetActive,
      )}
      disabled={!targetActive || !unit.alive}
      data-testid={`battle-enemy-${unit.id}`}
      onClick={onTarget}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const raw = event.dataTransfer.getData("application/spirewalker-card");
        if (!raw) return;
        const payload = JSON.parse(raw) as DragPayload;
        onDropCard(payload.cardInstanceId);
      }}
    >
      {unit.alive ? (
        <span
          className={cx(styles.intent, styles.intentTone[INTENT_CATEGORY_TONE[category]])}
          title={intentText}
        >
          <FallbackImg
            className={styles.intentIcon}
            alt=""
            sources={getIntentIconSources(intent)}
          />
          <strong>{valueText ?? intentText}</strong>
        </span>
      ) : null}
      <UnitPanel unit={unit} tone="enemy" spriteUrl={spriteUrl} />
    </button>
  );
}

function StatusList({ unit }: { unit: CombatUnit }) {
  if (unit.statuses.length === 0) return null;
  return (
    <div className={styles.statusList}>
      {unit.statuses.map((status) => {
        const meta = getStatusMeta(status.id);
        return (
          <span
            key={status.id}
            className={styles.statusChip}
            title={`${meta.name}：${meta.description}`}
          >
            <FallbackImg
              className={styles.statusIcon}
              alt={meta.name}
              sources={getStatusIconSources(status.id)}
              fallback={<em className={styles.statusGlyph}>{meta.shortLabel}</em>}
            />
            <b className={styles.statusStacks}>{status.stacks}</b>
          </span>
        );
      })}
    </div>
  );
}

function Pile({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: number;
  muted?: boolean;
}) {
  return (
    <span className={cx(styles.pile, muted && styles.pileMuted)}>
      <small>{label}</small>
      <strong>{value}</strong>
    </span>
  );
}
