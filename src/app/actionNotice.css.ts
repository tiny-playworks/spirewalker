import { keyframes, style } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';

const enter = keyframes({
  from: { opacity: 0, transform: 'translate(-50%, -0.8rem)' },
  to: { opacity: 1, transform: 'translate(-50%, 0)' },
});

export const notice = style({
  position: 'fixed',
  left: '50%',
  top: '4.25rem',
  zIndex: 100,
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.7rem',
  width: 'fit-content',
  maxWidth: 'calc(100vw - 1.2rem)',
  padding: '0.68rem 0.8rem 0.68rem 1rem',
  borderRadius: sceneVars.radii.pill,
  color: sceneVars.color.textStrong,
  border: '1px solid rgba(45, 212, 191, 0.5)',
  background: 'rgba(13, 18, 19, 0.94)',
  boxShadow: '0 14px 40px rgba(0, 0, 0, 0.48), 0 0 24px rgba(45, 212, 191, 0.12)',
  animation: `${enter} 180ms ease-out`,
  fontSize: '0.84rem',
});

export const dismiss = style({
  minWidth: '2rem',
  minHeight: '2rem',
  borderRadius: '50%',
  border: '1px solid rgba(255, 255, 255, 0.14)',
  color: sceneVars.color.textMuted,
  background: 'rgba(255, 255, 255, 0.06)',
  cursor: 'pointer',
});
