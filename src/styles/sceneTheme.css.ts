import { createTheme } from '@vanilla-extract/css';

export const [sceneThemeClass, sceneVars] = createTheme({
  color: {
    text: '#e8e4dc',
    textStrong: '#f4e8d4',
    textMuted: '#a69f94',
    textSubtle: '#8a8378',
    textFaint: '#5c564c',
    panel: '#2c2820',
    panelAlt: '#252119',
    border: '#4a4336',
    borderSoft: '#3d3528',
    accent: '#c08457',
    accentGlow: '#f4d58d',
    hazard: 'rgba(171, 101, 73, 0.92)',
    fortune: 'rgba(191, 152, 79, 0.92)',
    mystery: 'rgba(106, 136, 191, 0.92)',
    relief: 'rgba(101, 150, 122, 0.92)',
    edgeDim: '#3d3528',
  },
  radii: {
    sm: '8px',
    md: '12px',
    lg: '14px',
    pill: '999px',
  },
  shadow: {
    panel: '0 12px 32px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    panelHeavy: '0 18px 48px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
    button: '0 10px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  },
  motion: {
    fast: '140ms',
    normal: '180ms',
    slow: '320ms',
    ease: 'ease',
    easeInOut: 'ease-in-out',
  },
});
