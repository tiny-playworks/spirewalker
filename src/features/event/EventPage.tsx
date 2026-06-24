import type { ComponentType } from 'react';
import {
  BookOpen,
  Coins,
  Droplets,
  Flame,
  Footprints,
  Gem,
  HeartPulse,
  type LucideProps,
  Triangle,
} from 'lucide-react';
import {
  BURST_ALTAR_EVENT_ID,
  PURGING_POOL_EVENT_ID,
  STILLNESS_SHRINE_EVENT_ID,
  WANDERING_MERCHANT_EVENT_ID,
} from '@/game/core/engine/generateBranchingFloor';
import type { RunState } from '@/game/core/model/run';
import { useGameStore } from '@/game/store/gameStore';
import { sceneThemeClass } from '@/styles/sceneTheme.css';
import * as styles from './eventPage.css';

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

type Tone = 'sacrifice' | 'gain' | 'gold' | 'heal' | 'leave';

interface EventOption {
  optionId: string;
  tone: Tone;
  icon: ComponentType<LucideProps>;
  title: string;
  desc: string;
  disabled?: boolean;
}

interface EventView {
  title: string;
  story: string;
  options: EventOption[];
}

function buildEventView(run: RunState): EventView | null {
  const eventId = run.screen.type === 'event' ? run.screen.eventId : null;
  switch (eventId) {
    case WANDERING_MERCHANT_EVENT_ID: {
      const hasVajra = run.meta.relics.includes('vajra');
      return {
        title: '游荡商人',
        story:
          '一名披着尘土的游荡商人在岔路口拦下你，行囊里塞满了来路不明的好处。挑一样带走，再继续你的攀登。',
        options: [
          { optionId: 'gold', tone: 'gold', icon: Coins, title: '收下金币', desc: '获得 25 金币。' },
          { optionId: 'heal', tone: 'heal', icon: HeartPulse, title: '喝口热汤', desc: '回复 12 点生命。' },
          {
            optionId: 'relic',
            tone: 'gain',
            icon: Gem,
            title: '瓦哈纳神像',
            desc: hasVajra ? '你已拥有此遗物。' : '每场战斗开始时 +1 力量。',
            disabled: hasVajra,
          },
        ],
      };
    }
    case STILLNESS_SHRINE_EVENT_ID: {
      const hasGuardKnot = run.meta.relics.includes('guard_knot');
      return {
        title: '静守祠',
        story:
          '祠堂寂静无声，稳势的余韵在空气中缓缓回荡。在稳住连势与立刻补强之间，你只能选一条路。',
        options: [
          {
            optionId: 'guard_relic',
            tone: 'sacrifice',
            icon: Flame,
            title: '割血换稳势结',
            desc: hasGuardKnot ? '你已拥有此遗物。' : '失去 6 点生命，获得稳势结。',
            disabled: hasGuardKnot,
          },
          { optionId: 'guard_card', tone: 'gain', icon: BookOpen, title: '学会守势', desc: '牌组加入 1 张守势。' },
          { optionId: 'leave', tone: 'leave', icon: Footprints, title: '离开', desc: '什么也不拿，返回地图。' },
        ],
      };
    }
    case BURST_ALTAR_EVENT_ID: {
      const hasBurstEmblem = run.meta.relics.includes('burst_emblem');
      return {
        title: '裂响祭坛',
        story:
          '祭坛上残留着爆裂的焦痕，空气里仍有未散的轰鸣。它能让你更早兑现连势，但要先付出一点代价。',
        options: [
          {
            optionId: 'burst_relic',
            tone: 'sacrifice',
            icon: Flame,
            title: '割血换裂响纹章',
            desc: hasBurstEmblem ? '你已拥有此遗物。' : '失去 6 点生命，获得裂响纹章。',
            disabled: hasBurstEmblem,
          },
          { optionId: 'burst_card', tone: 'gain', icon: BookOpen, title: '学会破势击', desc: '牌组加入 1 张破势击。' },
          { optionId: 'leave', tone: 'leave', icon: Footprints, title: '离开', desc: '保持现状，返回地图。' },
        ],
      };
    }
    case PURGING_POOL_EVENT_ID: {
      const hasStrike = run.masterDeck.includes('strike');
      const hasDefend = run.masterDeck.includes('defend');
      return {
        title: '净手池',
        story:
          '池水清澈见底，倒映出你牌组里那些拖沓的基础牌。把一张沉进池中，换一副更干净的牌组。',
        options: [
          {
            optionId: 'remove_strike',
            tone: 'sacrifice',
            icon: Droplets,
            title: '删 1 张打击',
            desc: hasStrike ? '从牌组移除 1 张打击。' : '牌组里没有打击。',
            disabled: !hasStrike,
          },
          {
            optionId: 'remove_defend',
            tone: 'sacrifice',
            icon: Droplets,
            title: '删 1 张防御',
            desc: hasDefend ? '从牌组移除 1 张防御。' : '牌组里没有防御。',
            disabled: !hasDefend,
          },
          { optionId: 'leave', tone: 'leave', icon: Footprints, title: '离开', desc: '保持牌组不变，返回地图。' },
        ],
      };
    }
    default:
      return null;
  }
}

export function EventPage() {
  const run = useGameStore((s) => s.run);
  const dispatchCommand = useGameStore((s) => s.dispatchCommand);

  if (!run || run.screen.type !== 'event') return null;

  const view = buildEventView(run);
  if (!view) {
    return (
      <div className="boot">
        <p>未知事件：{run.screen.eventId}</p>
      </div>
    );
  }

  return (
    <div className={cx(sceneThemeClass, styles.page)} data-testid="event-page">
      <header className={styles.topBar}>
        <p className={styles.brandMark}>Spirewalker</p>
        <span className={styles.topMeta}>
          第 {run.meta.act} 章 · 第 {run.meta.actFloor} 层
        </span>
        <div className={styles.topStats}>
          <span className={cx(styles.statPill, styles.statPillHp)}>
            <HeartPulse className={styles.statIcon} aria-hidden />
            {run.player.currentHp}/{run.player.maxHp}
          </span>
          <span className={cx(styles.statPill, styles.statPillGold)}>
            <Coins className={styles.statIcon} aria-hidden />
            {run.meta.gold}
          </span>
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.leftCol}>
          <span className={styles.badge}>
            <Triangle className={styles.badgeIcon} aria-hidden />
            神秘事件
          </span>
          <h1 className={styles.title}>{view.title}</h1>
          <div className={styles.artPanel} aria-hidden>
            <span className={styles.artShards} />
            <span className={styles.artGlow} />
          </div>
        </div>

        <div className={styles.rightCol}>
          <p className={styles.story}>{view.story}</p>
          <ul className={styles.optionList}>
            {view.options.map((opt, index) => {
              const Icon = opt.icon;
              return (
                <li key={opt.optionId}>
                  <button
                    type="button"
                    className={cx(styles.option, styles.optionTone[opt.tone])}
                    style={{ animationDelay: `${index * 70}ms` }}
                    disabled={opt.disabled}
                    onClick={() =>
                      dispatchCommand({ type: 'RESOLVE_EVENT_OPTION', optionId: opt.optionId })
                    }
                  >
                    <Icon className={cx(styles.optionIcon, styles.optionIconTone[opt.tone])} aria-hidden />
                    <span className={styles.optionText}>
                      <span className={cx(styles.optionTitle, styles.optionTitleTone[opt.tone])}>
                        {opt.title}
                      </span>
                      <span className={styles.optionDesc}>{opt.desc}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
