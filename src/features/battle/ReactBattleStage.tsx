import { useEffect, useMemo, useState } from "react";
import { FallbackImg } from "@/features/cards/FallbackImg";
import { CardArtwork } from "@/features/cards/CardArtwork";
import {
  buildCardKeywordHints,
  cardTargetLabel,
  cardTypeLabel,
  formatMonsterIntentText,
} from "@/game/core/battleUiText";
import { ALL_CARD_DEFINITIONS } from "@/game/core/definitions/cards";
import { getCardArchetype } from "@/game/core/definitions/cards/archetypes";
import { getStatusMeta } from "@/game/core/definitions/statuses";
import type { BattleState, CountdownEffect } from "@/game/core/model/battle";
import type { CardDefinition, CardInstance } from "@/game/core/model/card";
import type { CombatUnit } from "@/game/core/model/unit";
import { previewCardPlay, type BattlePreview } from "@/game/core/presentation/battlePreview";
import { buildFeedbackTimeline, feedbackDurationMs, type FeedbackCue } from "@/game/core/presentation/feedbackTimeline";
import { useGameStore } from "@/game/store/gameStore";
import { TutorialHint } from "@/features/tutorial/TutorialHint";
import {
  getIntentIconSources,
  getStatusIconSources,
  intentCategory,
  intentValueText,
  type IntentCategory,
} from "./combatAssets";
import * as styles from "./reactBattleStage.css";
import { getEnemyVisual } from "./enemyVisuals";

type DragPayload = { cardInstanceId: string };

const BATTLE_BACKDROP_URL = "/assets/combat/gilded-ruins.webp";
const ACT2_BATTLE_BACKDROP_URL = "/assets/combat/fractured-tribunal.webp";
const PLAYER_SPRITE_URL = "/assets/combat/player.webp";

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

const INTENT_CATEGORY_TONE: Record<IntentCategory, keyof typeof styles.intentTone> = {
  attack: "attack",
  defend: "block",
  buff: "utility",
  debuff: "attack",
  unknown: "utility",
};

const INTENT_CATEGORY_LABEL: Record<IntentCategory, string> = {
  attack: "攻击",
  defend: "防御",
  buff: "强化",
  debuff: "削弱",
  unknown: "异动",
};

function effectiveCost(card: CardInstance, battle: BattleState): number {
  return Math.max(
    0,
    card.costForTurn +
      battle.cursePrideCostPressure +
      battle.curseConfusionCostDelta,
  );
}

function cardFocus(def: CardDefinition, preview?: BattlePreview): {
  value: string;
  label: string;
  tone: "attack" | "block" | "utility";
} {
  if (preview?.playable && preview.damage > 0) {
    return { value: String(preview.damage), label: "预计伤害", tone: "attack" };
  }
  if (preview?.playable && preview.block > 0) {
    return { value: String(preview.block), label: "预计格挡", tone: "block" };
  }
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

function countdownEffectText(effect: CountdownEffect): string {
  switch (effect.type) {
    case 'attack':
      return `爆发 ${effect.value} 点伤害`;
    case 'multi_hit':
      return `连击 ${effect.value} ×${effect.hits}`;
    case 'summon':
      return `召唤 ${effect.count} 个援军`;
    case 'max_hp_down':
      return `生命上限 -${effect.value}`;
    default:
      return '未知效果';
  }
}

type MechanicTone = 'danger' | 'warning' | 'control';

function mechanicBadges(monster: BattleState['monsters'][string] | undefined): Array<{
  key: string;
  label: string;
  detail: string;
  tone: MechanicTone;
}> {
  if (!monster) return [];
  const runtime = monster.runtime;
  const badges: Array<{ key: string; label: string; detail: string; tone: MechanicTone }> = [];
  if ((runtime.thorns ?? 0) > 0) {
    badges.push({ key: 'thorns', label: `反刺 ${runtime.thorns}`, detail: `攻击牌打出后受到 ${runtime.thorns} 点反刺伤害。`, tone: 'danger' });
  }
  if ((runtime.reactiveDamage ?? 0) > 0) {
    badges.push({ key: 'reactive', label: `反制 ${runtime.reactiveDamage}`, detail: `每打出一张牌，受到 ${runtime.reactiveDamage} 点反制伤害。`, tone: 'warning' });
  }
  if (runtime.countdown) {
    badges.push({ key: 'countdown', label: `倒计时 ${runtime.countdown.remaining}`, detail: `倒计时结束：${countdownEffectText(runtime.countdown.effect)}。`, tone: 'danger' });
  }
  return badges;
}

export function ReactBattleStage({ className }: { className?: string }) {
  const run = useGameStore((s) => s.run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);
  const markTutorialStep = useGameStore((s) => s.markTutorialStep);
  const fastMode = useGameStore((s) => s.fastMode);
  const battle = run?.battle ?? null;
  const backdropUrl = run?.meta.act === 2 ? ACT2_BATTLE_BACKDROP_URL : BATTLE_BACKDROP_URL;
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);

  useEffect(() => {
    if (!battle || battle.inputMode !== "animation_lock") return;
    const timer = window.setTimeout(
      () => dispatchCommand({ type: "RESOLVE_ANIMATION_DONE" }),
      feedbackDurationMs(battle.lastResolvedEvents, fastMode),
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

  useEffect(() => {
    if (!battle) return;
    if (battle.turn >= 2) markTutorialStep('turn');
    if (battle.turn >= 2 && battle.playerCardsPlayedThisTurn > 0) markTutorialStep('momentum');
  }, [battle?.playerCardsPlayedThisTurn, battle?.turn, markTutorialStep]);

  const pendingCardId =
    battle?.pendingAction?.type === "play_card"
      ? battle.pendingAction.cardInstanceId
      : null;
  const activeCardId = pendingCardId ?? selectedCardId;
  const activeCardDefinition = activeCardId && battle
    ? ALL_CARD_DEFINITIONS[battle.player.cards[activeCardId]?.definitionId ?? '']
    : undefined;
  const player = battle ? battle.units[battle.playerUnitId] : null;
  const enemies = useMemo(() => {
    if (!battle) return [];
    return battle.enemyUnitIds.map((id) => battle.units[id]).filter(Boolean);
  }, [battle]);
  const feedbackCues = useMemo(
    () => buildFeedbackTimeline(battle?.lastResolvedEvents ?? []),
    [battle?.lastResolvedEvents],
  );
  const previewByCardId = useMemo(() => {
    if (!run || !battle) return new Map<string, BattlePreview>();
    return new Map(
      battle.player.hand.map((cardId) => [cardId, previewCardPlay(run, cardId)]),
    );
  }, [run, battle]);
  const activePreview = activeCardId ? previewByCardId.get(activeCardId) : undefined;
  const targetPreviewByEnemyId = useMemo(() => {
    const previews = new Map<string, BattlePreview>();
    if (!run || !activeCardId) return previews;
    for (const enemy of enemies) {
      previews.set(enemy.id, previewCardPlay(run, activeCardId, enemy.id));
    }
    return previews;
  }, [activeCardId, enemies, run]);

  useEffect(() => {
    if (!activeCardId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      dispatchCommand({ type: "CANCEL_TARGET_SELECTION" });
      setSelectedCardId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeCardId, dispatchCommand]);

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
    markTutorialStep('card');
    playCard(card.instanceId);
  };

  const handleEnemyTarget = (enemyId: string) => {
    const cardId = activeCardId;
    if (!cardId) return;
    markTutorialStep('card');
    playCard(cardId, enemyId);
  };

  return (
    <div className={cx(className, styles.root)}>
      <TutorialHint step="card" title="先出一张牌" placement="top-left">
        点一张可用牌，再点敌人选择目标；卡面上的数字就是当前实际预估。
      </TutorialHint>
      <TutorialHint step="turn" title="结束这一回合" placement="bottom-right">
        伤害和格挡安排好后，按右下角“结束回合”，让敌人执行意图。
      </TutorialHint>
      <TutorialHint step="momentum" title="留意连势变化" placement="top-left">
        每次出牌都会让连势发生变化；积累后用兑现牌把它转成主动伤害。
      </TutorialHint>
      <div className={cx(styles.backdrop, run?.meta.act === 2 && styles.backdropAct2)} aria-hidden>
        <div
          className={styles.backdropImage}
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
        <div className={styles.spire} />
        <div className={styles.grid} />
      </div>

      <section
        className={cx(styles.combatLayer, activeCardId && styles.combatLayerTargeting)}
        aria-label="战斗场"
      >
        <UnitPanel unit={player} tone="player" spriteUrl={PLAYER_SPRITE_URL} feedback={feedbackCues.filter((cue) => cue.unitId === player.id)} />

        <div className={styles.enemyRail}>
          {enemies.map((enemy) => (
            <EnemyPanel
              key={enemy.id}
              battle={battle}
              unit={enemy}
              targetActive={Boolean(activeCardId)}
              onTarget={() => handleEnemyTarget(enemy.id)}
              onDropCard={(cardId) => {
                markTutorialStep('card');
                playCard(cardId, enemy.id);
              }}
              spriteUrl={getEnemyVisual(battle.monsters[enemy.id]?.monsterId ?? '').portraitUrl}
              feedback={feedbackCues.filter((cue) => cue.unitId === enemy.id)}
              preview={targetPreviewByEnemyId.get(enemy.id)}
              activeCardIsAttack={activeCardDefinition?.type === 'attack'}
            />
          ))}
        </div>
      </section>

      <section className={styles.bottomDock} aria-label="战斗操作">
        <div className={styles.leftDock}>
          <Pile label="抽牌" value={battle.player.drawPile.length} testId="battle-draw-count" />
          <div
            className={styles.energyCore}
            aria-label={`能量 ${battle.player.energy}/${battle.player.maxEnergy}`}
          >
            <strong>{battle.player.energy}</strong>
            <span>能量</span>
          </div>
        </div>

        <section className={styles.hand} aria-label="手牌">
          {battle.player.hand.map((cardInstanceId, index) => {
            const card = battle.player.cards[cardInstanceId];
            const def = card ? ALL_CARD_DEFINITIONS[card.definitionId] : null;
            if (!card || !def) return null;
            const preview = previewByCardId.get(card.instanceId);
            const focus = cardFocus(def, preview);
            const playable = canPlayCard(card, battle);
            const locked = battle.player.lockedCardInstanceIds.includes(card.instanceId);
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
                  locked && styles.cardLocked,
                )}
                style={{
                  transform: `translateY(${Math.abs(spread) * 4}px) rotate(${spread * 7}deg)`,
                  zIndex: 20 + index,
                }}
                title={[def.description, ...buildCardKeywordHints(def), ...(locked ? ['锁定原因：本回合结束后解锁。'] : [])].join(
                  "\n",
                )}
                disabled={locked || !playable}
                aria-disabled={locked || !playable}
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
                  <CardArtwork
                    className={styles.cardArtImg}
                    alt=""
                    cardId={def.id}
                    loading="eager"
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
                {locked ? <span className={styles.cardLock}>本回合锁定</span> : null}
                <span className={styles.cardFoot}>
                  {cardTargetLabel(def.target)}
                </span>
              </button>
            );
          })}
        </section>

        <div className={styles.rightDock}>
          {activeCardId ? (
            <div className={styles.targetGuide} role="status">
              <span>选择目标</span>
              {activePreview?.damage ? <strong>预计造成 {activePreview.damage} 点伤害</strong> : null}
              <button
                type="button"
                onClick={() => {
                  dispatchCommand({ type: "CANCEL_TARGET_SELECTION" });
                  setSelectedCardId(null);
                }}
              >取消 Esc</button>
            </div>
          ) : null}
          <Pile label="弃牌" value={battle.player.discardPile.length} muted />
          <Pile label="消耗" value={battle.player.exhaustPile.length} muted />
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
              结束回合
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
  feedback = [],
}: {
  unit: CombatUnit;
  tone: "player" | "enemy";
  spriteUrl: string;
  feedback?: FeedbackCue[];
}) {
  const hpRatio =
    unit.maxHp > 0 ? Math.max(0, Math.min(1, unit.hp / unit.maxHp)) : 0;
  const hit = feedback.some((cue) => cue.tone === 'damage');
  const guarded = feedback.some((cue) => cue.tone === 'block');
  return (
    <article
      className={cx(
        styles.unit,
        styles.unitTone[tone],
        hit && styles.unitHit,
        guarded && styles.unitGuarded,
        !unit.alive && styles.unitDead,
      )}
    >
      <div className={styles.spriteFrame}>
        <div
          className={styles.unitSprite}
          style={{ backgroundImage: `url(${spriteUrl})` }}
        />
        <div className={styles.feedbackLayer} aria-live="polite">
          {feedback.map((cue) => (
            <span
              key={cue.id}
              className={cx(styles.feedbackCue, styles.feedbackCueTone[cue.tone])}
              style={{ animationDelay: `${cue.delayMs}ms` }}
            >{cue.text}</span>
          ))}
        </div>
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
  feedback,
  preview,
  activeCardIsAttack,
}: {
  battle: BattleState;
  unit: CombatUnit;
  targetActive: boolean;
  onTarget: () => void;
  onDropCard: (cardInstanceId: string) => void;
  spriteUrl: string;
  feedback: FeedbackCue[];
  preview?: BattlePreview;
  activeCardIsAttack: boolean;
}) {
  const monster = battle.monsters[unit.id];
  const intent = monster?.intent;
  const intentText = formatMonsterIntentText(intent);
  const category = intentCategory(intent);
  const valueText = intentValueText(intent);
  const activeCounter = (monster?.runtime.counterThreshold ?? 0) > 0
    && (monster?.runtime.counterDamage ?? 0) > 0
    ? {
        threshold: monster!.runtime.counterThreshold!,
        damage: monster!.runtime.counterDamage!,
      }
    : null;
  const previewText = !preview?.playable
    ? null
    : preview.damage > 0
      ? `预计造成 ${preview.damage} 点伤害`
      : preview.statuses.length > 0
        ? `${getStatusMeta(preview.statuses[0].statusId).name} +${preview.statuses[0].value}`
        : null;
  const retaliation = monster?.runtime
    ? (monster.runtime.reactiveDamage ?? 0) + (activeCardIsAttack ? monster.runtime.thorns ?? 0 : 0)
    : 0;
  const mechanics = mechanicBadges(monster);
  return (
    <div
      className={cx(
        styles.enemyTarget,
        targetActive && unit.alive && styles.enemyTargetActive,
      )}
    >
      {unit.alive ? (
        <details className={styles.intentDetails}>
          <summary
            className={cx(styles.intent, styles.intentTone[INTENT_CATEGORY_TONE[category]])}
            title={intentText}
          >
            <FallbackImg
              className={styles.intentIcon}
              alt=""
              sources={getIntentIconSources(intent)}
            />
            <span className={styles.intentCopy}>
              <small>{INTENT_CATEGORY_LABEL[category]}</small>
              <strong>{valueText ?? "?"}</strong>
            </span>
          </summary>
          <span className={styles.intentPopover}>{intentText}</span>
        </details>
      ) : null}
      {unit.alive && activeCounter ? (
        <span
          className={styles.activeCounter}
          title={`反击架势生效中：本回合从第 ${activeCounter.threshold} 张牌起，每张牌受到 ${activeCounter.damage} 点伤害。`}
        >
          反击生效 · 第 {activeCounter.threshold} 张起 -{activeCounter.damage}
        </span>
      ) : null}
      {unit.alive && mechanics.length > 0 ? (
        <div className={styles.mechanicList} aria-label="敌方机制">
          {mechanics.map((mechanic) => (
            <span
              key={mechanic.key}
              className={cx(styles.mechanicBadge, styles.mechanicTone[mechanic.tone])}
              title={mechanic.detail}
            >
              {mechanic.label}
            </span>
          ))}
        </div>
      ) : null}
      <button
        type="button"
        className={styles.enemyHitTarget}
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
        <UnitPanel unit={unit} tone="enemy" spriteUrl={spriteUrl} feedback={feedback} />
        {targetActive && (previewText || retaliation > 0) ? (
          <span className={styles.targetPreview}>
            {previewText}
            {retaliation > 0 ? <em>预计反噬 {retaliation}</em> : null}
          </span>
        ) : null}
      </button>
    </div>
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
  testId,
}: {
  label: string;
  value: number;
  muted?: boolean;
  testId?: string;
}) {
  return (
    <span className={cx(styles.pile, muted && styles.pileMuted)} data-testid={testId}>
      <small>{label}</small>
      <strong>{value}</strong>
    </span>
  );
}
