import { useEffect, useRef } from 'react';

export function AppCursor() {
  const shellRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shell = shellRef.current;
    const core = coreRef.current;
    const trail = trailRef.current;
    if (!shell || !core || !trail || typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointerQuery.matches || reducedMotionQuery.matches) return;

    document.body.dataset.cursorMode = 'custom';

    let animationFrame = 0;
    let hovered = false;
    let pressed = false;
    let visible = false;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: target.x, y: target.y };
    const echo = { x: target.x, y: target.y };

    const applyState = () => {
      shell.dataset.visible = visible ? 'true' : 'false';
      shell.dataset.hovered = hovered ? 'true' : 'false';
      shell.dataset.pressed = pressed ? 'true' : 'false';
    };

    const animate = () => {
      current.x += (target.x - current.x) * 0.24;
      current.y += (target.y - current.y) * 0.24;
      echo.x += (target.x - echo.x) * 0.12;
      echo.y += (target.y - echo.y) * 0.12;

      core.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      trail.style.transform = `translate3d(${echo.x}px, ${echo.y}px, 0)`;
      animationFrame = window.requestAnimationFrame(animate);
    };

    const syncHoverState = (nextTarget: EventTarget | null) => {
      const element = nextTarget instanceof Element ? nextTarget : null;
      hovered = Boolean(
        element?.closest("button, a, [role='button'], [data-cursor-target='true']"),
      );
      applyState();
    };

    const handlePointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      visible = true;
      syncHoverState(event.target);
    };

    const handlePointerDown = (event: PointerEvent) => {
      pressed = true;
      target.x = event.clientX;
      target.y = event.clientY;
      applyState();
    };

    const handlePointerUp = () => {
      pressed = false;
      applyState();
    };

    const handlePointerLeave = () => {
      visible = false;
      hovered = false;
      pressed = false;
      applyState();
    };

    const handlePointerEnter = () => {
      visible = true;
      applyState();
    };

    applyState();
    animationFrame = window.requestAnimationFrame(animate);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('pointerenter', handlePointerEnter);

    return () => {
      delete document.body.dataset.cursorMode;
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerenter', handlePointerEnter);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div ref={shellRef} className="app-cursor" aria-hidden="true">
      <div ref={trailRef} className="app-cursor-trail" />
      <div ref={coreRef} className="app-cursor-core">
        <div className="app-cursor-core-inner">
          <span className="app-cursor-ring" />
          <span className="app-cursor-glyph">◈</span>
        </div>
      </div>
    </div>
  );
}
