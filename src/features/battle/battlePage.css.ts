import { globalStyle, style } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';
import { battleBarControlMinHeight } from './battleHud.css';

const tablet = '(max-width: 900px)';

export const page = style({
  position: 'relative',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  padding: 0,
  background:
    'radial-gradient(ellipse 90% 55% at 50% 0%, rgba(139, 92, 246, 0.18) 0%, transparent 52%), radial-gradient(ellipse 60% 45% at 100% 60%, rgba(45, 212, 191, 0.1) 0%, transparent 42%), linear-gradient(175deg, #0a0a0b 0%, #131314 42%, #0e0e0f 100%)',
  selectors: {
    '&::after': {
      content: '""',
      pointerEvents: 'none',
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      opacity: 0.035,
      backgroundImage:
        'linear-gradient(rgba(208, 188, 255, 0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(208, 188, 255, 0.55) 1px, transparent 1px)',
      backgroundSize: '40px 40px',
    },
  },
});

globalStyle(`${page} > *`, {
  position: 'relative',
  zIndex: 1,
});

/** 顶栏：HUD 与快捷条同一行 flex，避免绝对定位叠在 HUD 上 */
export const headerArea = style({
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'center',
  position: 'relative',
  minHeight: '5rem',
  gap: '0.24rem 0.55rem',
  width: '100%',
  flexShrink: 0,
  padding: '0 1.8rem',
  boxSizing: 'border-box',
  background: 'linear-gradient(180deg, rgba(22, 22, 23, 0.98), rgba(12, 12, 13, 0.96))',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  boxShadow: '0 12px 34px rgba(0, 0, 0, 0.34)',
});

export const headerMain = style({
  flex: '0 1 34rem',
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  '@media': {
    [tablet]: {
      flex: '1 1 100%',
    },
  },
});

export const levelTitle = style({
  position: 'absolute',
  left: '50%',
  top: '0.55rem',
  transform: 'translateX(-50%)',
  display: 'grid',
  justifyItems: 'center',
  gap: '0.28rem',
  minWidth: '26rem',
  color: sceneVars.color.fortune,
  textAlign: 'center',
  pointerEvents: 'none',
});

globalStyle(`${levelTitle} strong`, {
  fontFamily: '"Libre Caslon Text", Georgia, serif',
  fontSize: '1.34rem',
  fontWeight: 900,
  letterSpacing: '0.08em',
  lineHeight: 1,
  textShadow: '0 0 16px rgba(251, 191, 36, 0.24)',
});

globalStyle(`${levelTitle} span`, {
  position: 'relative',
  color: sceneVars.color.textSubtle,
  fontSize: '0.78rem',
  fontWeight: 700,
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
  flex: '1 1 auto',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '0.32rem',
  maxWidth: '100%',
  rowGap: '0.35rem',
  opacity: 0.88,
  transition: 'opacity 120ms ease',
  selectors: {
    '&:hover': {
      opacity: 1,
    },
  },
  '@media': {
    [tablet]: {
      justifyContent: 'flex-start',
      width: '100%',
      opacity: 1,
    },
  },
});

export const logToggle = style({
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: battleBarControlMinHeight,
  minWidth: '1.75rem',
  minHeight: '1.75rem',
  padding: 0,
  border: 0,
  background: 'transparent',
  color: sceneVars.color.textMuted,
  borderRadius: '7px',
  fontSize: '0.76rem',
  lineHeight: 1,
  letterSpacing: '0.01em',
  cursor: 'pointer',
  transition: 'all 120ms ease',
  selectors: {
    '&:hover': {
      color: sceneVars.color.textStrong,
      borderColor: 'rgba(251, 191, 36, 0.72)',
      boxShadow: '0 0 0 1px rgba(251, 191, 36, 0.16), 0 0 22px rgba(251, 191, 36, 0.12)',
    },
    '&[aria-pressed="true"]': {
      color: sceneVars.color.textStrong,
      borderColor: 'rgba(208, 188, 255, 0.82)',
      boxShadow: '0 0 0 1px rgba(208, 188, 255, 0.2), 0 0 24px rgba(139, 92, 246, 0.18)',
    },
  },
});

export const stageColumn = style({
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
});

export const stageFrame = style({
  position: 'relative',
  flex: 1,
  minHeight: 0,
  padding: 0,
  borderRadius: 0,
  background: 'rgba(10, 10, 11, 0.92)',
  overflow: 'hidden',
});

export const stageWrap = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: 'calc(100vh - 5rem)',
  borderRadius: 0,
  border: 0,
  background:
    'radial-gradient(ellipse 60% 70% at 50% 55%, rgba(139, 92, 246, 0.14) 0%, transparent 58%), repeating-linear-gradient(90deg, rgba(208, 188, 255, 0.035) 0 1px, transparent 1px 42px), linear-gradient(90deg, #0a0a0b 0%, #131314 50%, #0a0a0b 100%)',
  boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.35), 0 16px 44px rgba(0, 0, 0, 0.34)',
  overflow: 'hidden',
  '@media': {
    [tablet]: {
      minHeight: '32rem',
    },
  },
});

globalStyle(`${stageWrap} canvas`, {
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
  background: 'linear-gradient(180deg, rgba(32, 31, 32, 0.82) 0%, rgba(14, 14, 15, 0.56) 100%)',
  border: '1px solid rgba(208, 188, 255, 0.28)',
  backdropFilter: 'blur(14px)',
});

export const deckPanel = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: '0.8rem 0.75rem',
  borderRadius: '16px',
  background: 'linear-gradient(180deg, rgba(32, 31, 32, 0.84) 0%, rgba(14, 14, 15, 0.66) 100%)',
  border: '1px solid rgba(208, 188, 255, 0.3)',
  backdropFilter: 'blur(14px)',
});

export const deckTitle = style({
  margin: 0,
  fontSize: '0.95rem',
  color: sceneVars.color.textStrong,
});

export const deckSummary = style({
  margin: '0.16rem 0 0.7rem',
  fontSize: '0.76rem',
  color: sceneVars.color.textSubtle,
});

export const deckGroup = style({
  padding: '0.65rem 0',
  borderTop: '1px solid rgba(149, 142, 160, 0.22)',
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
  color: sceneVars.color.textMuted,
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
  border: '1px solid rgba(208, 188, 255, 0.2)',
  background: 'rgba(10, 10, 11, 0.42)',
});

globalStyle(`${deckCardRow} p`, {
  margin: '0.22rem 0 0',
  fontSize: '0.72rem',
  lineHeight: 1.35,
  color: sceneVars.color.textSubtle,
});

export const deckCardHead = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.4rem',
  fontSize: '0.78rem',
  color: sceneVars.color.textStrong,
});

globalStyle(`${deckCardHead} strong`, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.26rem',
  minWidth: 0,
});

globalStyle(`${deckCardHead} span`, {
  flexShrink: 0,
  color: sceneVars.color.fortune,
  fontWeight: 700,
});

export const logTitle = style({
  flexShrink: 0,
  marginBottom: '0.4rem',
  fontSize: '0.72rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: sceneVars.color.textSubtle,
});

export const logList = style({
  flex: 1,
  margin: 0,
  padding: '0 0 0 1rem',
  overflow: 'auto',
  fontSize: '0.72rem',
  lineHeight: 1.4,
  color: sceneVars.color.textMuted,
});

export const logEmpty = style({
  margin: 0,
  fontSize: '0.72rem',
  color: sceneVars.color.textFaint,
});

export const footer = style({
  display: 'none',
});

export const footerHint = style({
  display: 'none',
});

export const fastModeToggle = style({
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.24rem',
  minHeight: '1.75rem',
  padding: '0 0.2rem',
  fontSize: '0.58rem',
  fontWeight: 900,
  letterSpacing: '0.08em',
  lineHeight: 1,
  color: sceneVars.color.textSubtle,
  cursor: 'pointer',
  userSelect: 'none',
});

globalStyle(`${fastModeToggle} input`, {
  accentColor: sceneVars.color.accent,
  width: '0.72rem',
  height: '0.72rem',
  flexShrink: 0,
});
