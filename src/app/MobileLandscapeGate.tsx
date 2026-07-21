import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Smartphone } from 'lucide-react';
import * as styles from './mobileLandscapeGate.css';

const MOBILE_PORTRAIT_QUERY = '(orientation: portrait) and (max-width: 900px)';
const COARSE_POINTER_QUERY = '(pointer: coarse)';

function usesMobileTouchInput(): boolean {
  if (window.matchMedia(COARSE_POINTER_QUERY).matches) return true;
  // 桌面 Chrome 的移动设备模拟有时不会暴露 coarse/maxTouchPoints，移动 UA 作为测试与 WebView 兜底。
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

export function MobileLandscapeGate({ active, children }: { active: boolean; children: ReactNode }) {
  const [blocked, setBlocked] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) {
      setBlocked(false);
      return;
    }
    const portrait = window.matchMedia(MOBILE_PORTRAIT_QUERY);
    const coarse = window.matchMedia(COARSE_POINTER_QUERY);
    const update = () => setBlocked(portrait.matches && usesMobileTouchInput());
    update();
    portrait.addEventListener('change', update);
    coarse.addEventListener('change', update);
    return () => {
      portrait.removeEventListener('change', update);
      coarse.removeEventListener('change', update);
    };
  }, [active]);

  useEffect(() => {
    const content = contentRef.current;
    if (blocked) {
      content?.setAttribute('inert', '');
      document.body.dataset.orientationBlocked = 'true';
    } else {
      content?.removeAttribute('inert');
      delete document.body.dataset.orientationBlocked;
    }
    return () => {
      content?.removeAttribute('inert');
      delete document.body.dataset.orientationBlocked;
    };
  }, [blocked]);

  return (
    <>
      <div ref={contentRef} className={styles.content} aria-hidden={blocked || undefined}>
        {children}
      </div>
      {blocked ? (
        <aside
          className={styles.gate}
          role="dialog"
          aria-modal="true"
          aria-labelledby="landscape-gate-title"
          data-testid="mobile-landscape-gate"
        >
          <div className={styles.halo} aria-hidden />
          <div className={styles.device} aria-hidden>
            <Smartphone />
            <span>↻</span>
          </div>
          <p className={styles.kicker}>尖塔需要更宽的视野</p>
          <h1 id="landscape-gate-title">旋转设备以继续攀登</h1>
          <p>请切换为横屏。对局会保留在原处，旋转后即可继续操作。</p>
        </aside>
      ) : null}
    </>
  );
}
