import { createTheme } from '@vanilla-extract/css';

export const [sceneThemeClass, sceneVars] = createTheme({
  color: {
    text: '#e5e2e3',
    textStrong: '#f4e8d4',
    textMuted: '#cbc3d7',
    textSubtle: '#958ea0',
    textFaint: '#5f586b',
    panel: 'rgba(32, 31, 32, 0.78)',
    panelAlt: 'rgba(26, 24, 20, 0.82)',
    border: 'rgba(208, 188, 255, 0.34)',
    borderSoft: 'rgba(149, 142, 160, 0.22)',
    accent: '#8b5cf6',
    accentGlow: '#d0bcff',
    hazard: 'rgba(212, 132, 106, 0.92)',
    fortune: 'rgba(251, 191, 36, 0.95)',
    mystery: 'rgba(139, 92, 246, 0.92)',
    relief: 'rgba(45, 212, 191, 0.92)',
    edgeDim: '#494454',
  },
  radii: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    pill: '999px',
  },
  shadow: {
    panel: '0 18px 50px rgba(0, 0, 0, 0.42), 0 0 24px rgba(139, 92, 246, 0.12), inset 0 1px 0 rgba(244, 232, 212, 0.08)',
    panelHeavy: '0 28px 80px rgba(0, 0, 0, 0.58), 0 0 42px rgba(208, 188, 255, 0.16), inset 0 1px 0 rgba(244, 232, 212, 0.08)',
    button: '0 12px 28px rgba(0, 0, 0, 0.36), 0 0 26px rgba(251, 191, 36, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  },
  motion: {
    fast: '140ms',
    normal: '180ms',
    slow: '320ms',
    ease: 'ease',
    easeInOut: 'ease-in-out',
  },
});
