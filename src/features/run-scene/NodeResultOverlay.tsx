import { ArrowRight, Check, Sparkles } from 'lucide-react';
import * as styles from './nodeResultOverlay.css';

export type NodeResultSource = 'reward' | 'shop' | 'event' | 'rest';

const SOURCE_LABEL: Record<NodeResultSource, string> = {
  reward: '战利已经收好',
  shop: '交易已经完成',
  event: '抉择留下了回响',
  rest: '营火重新点亮了脚步',
};

export function NodeResultOverlay({
  source,
  message,
  onContinue,
}: {
  source: NodeResultSource;
  message: string;
  onContinue: () => void;
}) {
  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="node-result-title" data-testid="node-result-overlay">
      <section className={styles.panel}>
        <span className={styles.emblem} aria-hidden>
          <Check />
        </span>
        <p className={styles.kicker}><Sparkles aria-hidden /> 节点结果</p>
        <h2 id="node-result-title">{SOURCE_LABEL[source]}</h2>
        <p className={styles.message}>{message}</p>
        <button type="button" className={styles.continueButton} onClick={onContinue} autoFocus>
          确认，继续攀登 <ArrowRight aria-hidden />
        </button>
      </section>
    </div>
  );
}
