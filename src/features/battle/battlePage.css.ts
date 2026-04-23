import { globalStyle, style } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';

const tablet = '(max-width: 900px)';

export const page = style({
  position: 'relative',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  padding: 'clamp(0.45rem, 1.4vw, 0.85rem)',
  background:
    'radial-gradient(ellipse 90% 55% at 50% 0%, rgba(192, 132, 87, 0.1) 0%, transparent 52%), radial-gradient(ellipse 60% 45% at 100% 60%, rgba(90, 111, 78, 0.06) 0%, transparent 42%), linear-gradient(175deg, #131210 0%, #1a1814 42%, #161412 100%)',
  selectors: {
    '&::after': {
      content: '""',
      pointerEvents: 'none',
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      opacity: 0.035,
      backgroundImage:
        'linear-gradient(rgba(232, 228, 220, 0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(232, 228, 220, 0.55) 1px, transparent 1px)',
      backgroundSize: '40px 40px',
    },
  },
});

globalStyle(`${page} > *`, {
  position: 'relative',
  zIndex: 1,
});

export const main = style({
  flex: 1,
  minHeight: 0,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 10.5rem',
  gap: '0.7rem',
  alignItems: 'stretch',
  '@media': {
    [tablet]: {
      gridTemplateColumns: '1fr',
    },
  },
});

export const mainExpanded = style({
  gridTemplateColumns: 'minmax(0, 1fr)',
});

export const topBar = style({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginBottom: '0.35rem',
  paddingRight: '0.1rem',
});

export const logToggle = style({
  border: '1px solid rgba(120, 105, 83, 0.72)',
  background: 'linear-gradient(180deg, rgba(42, 36, 30, 0.92), rgba(28, 24, 20, 0.88))',
  color: '#d9cbb4',
  borderRadius: '999px',
  padding: '0.24rem 0.62rem',
  fontSize: '0.72rem',
  lineHeight: 1.1,
  letterSpacing: '0.01em',
  cursor: 'pointer',
  transition: 'all 120ms ease',
  selectors: {
    '&:hover': {
      color: '#f2e5cf',
      borderColor: 'rgba(185, 154, 110, 0.88)',
      boxShadow: '0 0 0 1px rgba(185, 154, 110, 0.2)',
    },
    '&[aria-pressed="true"]': {
      color: '#f6e7cf',
      borderColor: 'rgba(212, 165, 100, 0.95)',
      boxShadow: '0 0 0 1px rgba(212, 165, 100, 0.24)',
    },
  },
});

export const stageColumn = style({
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.45rem',
});

export const stageFrame = style({
  position: 'relative',
  flex: 1,
  minHeight: 0,
  padding: '0.15rem',
  borderRadius: '20px',
  background:
    'radial-gradient(circle at 34% 44%, rgba(192, 132, 87, 0.1), transparent 28%), radial-gradient(circle at 72% 38%, rgba(88, 112, 150, 0.08), transparent 24%)',
  overflow: 'hidden',
});

export const phaserWrap = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: 'calc(100vh - 13rem)',
  borderRadius: '18px',
  border: '1px solid rgba(74, 67, 54, 0.65)',
  background: '#0b0a09',
  boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.35), 0 16px 36px rgba(0, 0, 0, 0.24)',
  overflow: 'hidden',
  '@media': {
    [tablet]: {
      minHeight: '32rem',
    },
  },
});

globalStyle(`${phaserWrap} canvas`, {
  imageRendering: 'auto',
});

export const sidebar = style({
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  '@media': {
    [tablet]: {
      maxHeight: '14rem',
    },
  },
});

export const logPanel = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: '0.75rem 0.75rem 0.65rem',
  borderRadius: '16px',
  background: 'linear-gradient(180deg, rgba(30, 27, 23, 0.68) 0%, rgba(21, 19, 16, 0.36) 100%)',
  border: '1px solid rgba(74, 67, 54, 0.48)',
  backdropFilter: 'blur(6px)',
});

export const logTitle = style({
  flexShrink: 0,
  marginBottom: '0.4rem',
  fontSize: '0.72rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#8a8478',
});

export const logList = style({
  flex: 1,
  margin: 0,
  padding: '0 0 0 1rem',
  overflow: 'auto',
  fontSize: '0.72rem',
  lineHeight: 1.4,
  color: '#a69f94',
});

export const logEmpty = style({
  margin: 0,
  fontSize: '0.72rem',
  color: '#6a6458',
});

export const footer = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.6rem 0.9rem',
  padding: '0.05rem 0.15rem 0',
});

export const footerHint = style({
  margin: 0,
  fontSize: '0.79rem',
  lineHeight: 1.35,
  color: '#a69f94',
});

export const fastModeToggle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.8rem',
  color: '#9a9488',
  cursor: 'pointer',
  userSelect: 'none',
});

globalStyle(`${fastModeToggle} input`, {
  accentColor: sceneVars.color.accent,
});
