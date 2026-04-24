import { globalStyle, style } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';

const tablet = '(max-width: 900px)';

export const page = style({
  position: 'relative',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  padding: 'clamp(0.28rem, 0.8vw, 0.52rem)',
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
  position: 'relative',
  flex: 1,
  minHeight: 0,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
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
  position: 'absolute',
  top: '0.52rem',
  right: '5.7rem',
  zIndex: 3,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '0.45rem',
  marginBottom: 0,
  paddingRight: 0,
  opacity: 0.72,
  transition: 'opacity 120ms ease',
  selectors: {
    '&:hover': {
      opacity: 1,
    },
  },
  '@media': {
    [tablet]: {
      position: 'static',
      justifyContent: 'flex-start',
      marginBottom: '0.22rem',
      opacity: 1,
    },
  },
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
  gap: '0.18rem',
});

export const stageFrame = style({
  position: 'relative',
  flex: 1,
  minHeight: 0,
  padding: '0.08rem',
  borderRadius: '16px',
  background:
    'linear-gradient(135deg, rgba(192, 132, 87, 0.12), rgba(90, 111, 78, 0.05) 42%, rgba(12, 11, 9, 0.88))',
  overflow: 'hidden',
});

export const phaserWrap = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: 'calc(100vh - 5.9rem)',
  borderRadius: '14px',
  border: '1px solid rgba(74, 67, 54, 0.65)',
  background:
    'radial-gradient(ellipse 60% 70% at 50% 55%, rgba(192, 132, 87, 0.08) 0%, transparent 58%), repeating-linear-gradient(90deg, rgba(244, 213, 141, 0.035) 0 1px, transparent 1px 42px), linear-gradient(90deg, #15110d 0%, #211a13 8%, #16120e 18%, #12100d 50%, #16120e 82%, #211a13 92%, #15110d 100%)',
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
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 4,
  width: 'min(19rem, calc(100% - 1.2rem))',
  display: 'flex',
  flexDirection: 'column',
  '@media': {
    [tablet]: {
      top: 'auto',
      left: 0,
      width: '100%',
      maxHeight: '18rem',
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

export const deckPanel = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: '0.8rem 0.75rem',
  borderRadius: '16px',
  background: 'linear-gradient(180deg, rgba(30, 27, 23, 0.82) 0%, rgba(18, 16, 13, 0.64) 100%)',
  border: '1px solid rgba(92, 78, 58, 0.58)',
  backdropFilter: 'blur(6px)',
});

export const deckTitle = style({
  margin: 0,
  fontSize: '0.95rem',
  color: '#f0ebe3',
});

export const deckSummary = style({
  margin: '0.16rem 0 0.7rem',
  fontSize: '0.76rem',
  color: '#9a9488',
});

export const deckGroup = style({
  padding: '0.65rem 0',
  borderTop: '1px solid rgba(61, 53, 40, 0.72)',
  selectors: {
    '&:first-of-type': {
      borderTop: 0,
      paddingTop: 0,
    },
  },
});

export const deckGroupTitle = style({
  margin: '0 0 0.45rem',
  fontSize: '0.78rem',
  color: '#d9cbb4',
});

export const deckList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.45rem',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const deckCardRow = style({
  padding: '0.5rem',
  borderRadius: '8px',
  border: '1px solid rgba(74, 67, 54, 0.58)',
  background: 'rgba(12, 11, 9, 0.42)',
});

globalStyle(`${deckCardRow} p`, {
  margin: '0.22rem 0 0',
  fontSize: '0.72rem',
  lineHeight: 1.35,
  color: '#aaa195',
});

export const deckCardHead = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.4rem',
  fontSize: '0.78rem',
  color: '#f0ebe3',
});

globalStyle(`${deckCardHead} strong`, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.26rem',
  minWidth: 0,
});

globalStyle(`${deckCardHead} span`, {
  flexShrink: 0,
  color: '#d6b48c',
  fontWeight: 700,
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
  padding: '0.02rem 0.15rem 0',
});

export const footerHint = style({
  display: 'none',
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
