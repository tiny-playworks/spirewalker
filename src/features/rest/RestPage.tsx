import { Anvil, ArrowRight, Flame, HeartPulse, Orbit, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { RunSceneHeader, RunSceneShell } from '@/features/run-scene/RunSceneShell';
import { CARD_DEFINITIONS } from '@/game/core/definitions/cards';
import { listUpgradableDeckIndices } from '@/game/core/definitions/cards/upgradeRules';
import {
  REST_HEAL_RATIO,
  REST_MOMENTUM_GAIN,
} from '@/game/core/systems/rest/restFlow';
import { useGameStore } from '@/game/store/gameStore';
import * as styles from './restPage.css';

export function RestPage() {
  const [selectedUpgradeIndex, setSelectedUpgradeIndex] = useState<number | null>(null);
  const run = useGameStore((state) => state.run);
  const dispatchCommand = useGameStore((state) => state.dispatchCommand);

  if (!run || run.screen.type !== 'rest') return null;

  const { player } = run;
  const heal = Math.floor(player.maxHp * REST_HEAL_RATIO);
  const restoredHp = Math.min(player.maxHp, player.currentHp + heal);
  const currentRatio = (player.currentHp / player.maxHp) * 100;
  const restoredRatio = (restoredHp / player.maxHp) * 100;
  const canHeal = restoredHp > player.currentHp;
  const upgradeIndices = listUpgradableDeckIndices(run.masterDeck);
  const activeUpgradeIndex = selectedUpgradeIndex !== null
    && upgradeIndices.includes(selectedUpgradeIndex)
    ? selectedUpgradeIndex
    : (upgradeIndices[0] ?? null);

  return (
    <RunSceneShell tone="rest" className={styles.page} testId="rest-page">
      <RunSceneHeader title="裂隙营火" eyebrow="休整节点" />
      <div className={styles.body}>
        <section className={styles.scene} aria-label="裂隙中的营火">
          <div
            className={styles.sceneImage}
            style={{ backgroundImage: "url('/assets/scenes/rest-camp.webp')" }}
            aria-hidden
          />
          <div className={styles.sceneShade} aria-hidden />
          <span className={styles.fireSigil} aria-hidden><Flame /></span>
          <div className={styles.sceneCopy}>
            <p>短暂的安全地带</p>
            <h1>让回响慢下来</h1>
            <span>火光穿过铠甲的裂纹，下一段路线仍在雾中等待。</span>
          </div>
        </section>

        <section className={styles.decision}>
          <p className={styles.kicker}><Sparkles aria-hidden /> 本次休整</p>
          <h2>选择一种休整方式</h2>
          <p className={styles.description}>营火只能回应一个愿望：疗伤、锻造，或为下一战起势。</p>

          <div className={styles.optionGrid}>
            <article className={styles.optionCard}>
              <div className={styles.optionHeading}>
                <span className={styles.optionIcon}><HeartPulse aria-hidden /></span>
                <div>
                  <h3>疗伤</h3>
                  <p>回复最大生命的 30%。</p>
                </div>
              </div>
              <div className={styles.healthPreview}>
                <div className={styles.healthNumbers}>
                  <span>当前 {player.currentHp}</span>
                  <strong>{restoredHp}/{player.maxHp}</strong>
                </div>
                <div className={styles.healthTrack} aria-label={`生命将从 ${player.currentHp} 恢复至 ${restoredHp}`}>
                  <span className={styles.healthCurrent} style={{ width: `${currentRatio}%` }} />
                  <span className={styles.healthRestored} style={{ width: `${restoredRatio}%` }} />
                </div>
                <small>{canHeal ? `恢复 ${restoredHp - player.currentHp} 点` : '当前生命已满'}</small>
              </div>
              <button
                type="button"
                className={styles.restButton}
                disabled={!canHeal}
                onClick={() => dispatchCommand({ type: 'RESOLVE_REST_OPTION', option: 'heal' })}
              >
                包扎伤口 <ArrowRight aria-hidden />
              </button>
            </article>

            <article className={styles.optionCard}>
              <div className={styles.optionHeading}>
                <span className={styles.optionIcon}><Anvil aria-hidden /></span>
                <div>
                  <h3>锻造</h3>
                  <p>选择一张牌提升一级。</p>
                </div>
              </div>
              <select
                className={styles.upgradeSelect}
                aria-label="选择要升级的卡牌"
                value={activeUpgradeIndex ?? ''}
                disabled={activeUpgradeIndex === null}
                onChange={(event) => setSelectedUpgradeIndex(Number(event.target.value))}
              >
                {upgradeIndices.map((index) => {
                  const cardId = run.masterDeck[index]!;
                  return (
                    <option key={`${cardId}-${index}`} value={index}>
                      {CARD_DEFINITIONS[cardId]?.name ?? cardId}
                    </option>
                  );
                })}
              </select>
              <button
                type="button"
                className={styles.restButton}
                disabled={activeUpgradeIndex === null}
                onClick={() => {
                  if (activeUpgradeIndex === null) return;
                  dispatchCommand({
                    type: 'RESOLVE_REST_OPTION',
                    option: 'upgrade',
                    masterDeckIndex: activeUpgradeIndex,
                  });
                }}
              >
                强化卡牌 <ArrowRight aria-hidden />
              </button>
            </article>

            <article className={styles.optionCard}>
              <div className={styles.optionHeading}>
                <span className={styles.optionIcon}><Orbit aria-hidden /></span>
                <div>
                  <h3>静心</h3>
                  <p>下一场战斗额外获得 {REST_MOMENTUM_GAIN} 层连势。</p>
                </div>
              </div>
              <div className={styles.meditatePreview}>
                <strong>◈ +{REST_MOMENTUM_GAIN}</strong>
                <span>下一战开局生效</span>
              </div>
              <button
                type="button"
                className={styles.restButton}
                onClick={() => dispatchCommand({ type: 'RESOLVE_REST_OPTION', option: 'meditate' })}
              >
                凝神起势 <ArrowRight aria-hidden />
              </button>
            </article>
          </div>
        </section>
      </div>
    </RunSceneShell>
  );
}
