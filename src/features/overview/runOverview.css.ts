import { globalStyle, style } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';
import { infoChip, panelSurface, sectionKicker } from '@/styles/uiPrimitives.css';

/** 靠右纵向居中的「探出」悬浮入口，类似桌面侧栏工具（如 uTools）：默认只露一条，悬停/聚焦/展开时滑入 */
export const toggle = style({
  position: 'fixed',
  top: '50%',
  right: 'max(0px, env(safe-area-inset-right, 0px))',
  zIndex: 70,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '0.42rem',
  margin: 0,
  padding: '0.52rem 0.72rem 0.52rem 0.62rem',
  border: '1px solid rgba(95, 81, 62, 0.5)',
  borderRight: 'none',
  borderRadius: '14px 0 0 14px',
  color: '#ebe4d6',
  fontSize: '0.78rem',
  fontWeight: 600,
  letterSpacing: '0.04em',
  cursor: 'pointer',
  background: 'linear-gradient(90deg, rgba(26, 23, 19, 0.42) 0%, rgba(18, 16, 14, 0.72) 100%)',
  backdropFilter: 'blur(12px)',
  boxShadow: '-6px 0 22px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(244, 213, 141, 0.06)',
  transform: 'translateY(-50%) translateX(calc(100% - 1.35rem))',
  transition: `transform ${sceneVars.motion.normal} ease-out, opacity ${sceneVars.motion.normal} ease-out, box-shadow ${sceneVars.motion.normal} ease-out`,
  opacity: 0.55,
  selectors: {
    '&:hover': {
      transform: 'translateY(-50%) translateX(0)',
      opacity: 1,
      boxShadow: '-10px 0 28px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(244, 213, 141, 0.08)',
    },
    '&:focus-visible': {
      transform: 'translateY(-50%) translateX(0)',
      opacity: 1,
      outline: '2px solid rgba(212, 160, 100, 0.65)',
      outlineOffset: '2px',
    },
    '&[aria-expanded="true"]': {
      transform: 'translateY(-50%) translateX(0)',
      opacity: 1,
      borderColor: 'rgba(185, 154, 110, 0.65)',
      background: 'linear-gradient(90deg, rgba(34, 30, 25, 0.88) 0%, rgba(22, 19, 16, 0.94) 100%)',
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
      transform: 'translateY(-50%) translateX(0)',
      opacity: 0.92,
    },
  },
});

export const toggleDots = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.2rem',
  flexShrink: 0,
  width: '0.55rem',
  padding: '0.12rem 0',
});

export const toggleDot = style({
  width: '4px',
  height: '4px',
  borderRadius: '50%',
  background: 'currentColor',
  opacity: 0.75,
});

export const toggleLabel = style({
  whiteSpace: 'nowrap',
  paddingRight: '0.08rem',
});

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: 71,
  border: 0,
  background: 'rgba(8, 8, 8, 0.42)',
  cursor: 'pointer',
});

export const panel = style([
  panelSurface,
  {
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 72,
    width: 'min(28rem, 92vw)',
    height: '100dvh',
    padding: '1rem 1rem 1.25rem',
    overflow: 'auto',
    transform: 'translateX(104%)',
    transition: `transform ${sceneVars.motion.normal} ease-out`,
    borderRadius: 0,
    borderLeft: '1px solid rgba(74, 67, 54, 0.9)',
    borderRight: 0,
    borderTop: 0,
    borderBottom: 0,
    background: 'linear-gradient(180deg, rgba(33, 29, 24, 0.98) 0%, rgba(23, 21, 18, 0.98) 100%)',
    boxShadow: '-18px 0 44px rgba(0, 0, 0, 0.34)',
  },
]);

export const panelOpen = style({
  transform: 'translateX(0)',
});

export const head = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '1rem',
  marginBottom: '1rem',
});

export const kicker = sectionKicker;

export const title = style({
  margin: 0,
  fontSize: '1.4rem',
  color: sceneVars.color.textStrong,
});

export const closeButton = style({
  padding: '0.42rem 0.7rem',
  borderRadius: sceneVars.radii.sm,
  border: '1px solid rgba(95, 81, 62, 0.9)',
  background: 'rgba(20, 18, 16, 0.8)',
  color: '#f0ebe3',
  cursor: 'pointer',
});

export const section = style({
  padding: '0.8rem 0',
  borderTop: '1px solid rgba(61, 53, 40, 0.8)',
  selectors: {
    '&:first-of-type': {
      borderTop: 0,
      paddingTop: 0,
    },
  },
});

export const sectionTitle = style({
  margin: '0 0 0.45rem',
  fontSize: '1rem',
  color: '#f0ebe3',
});

export const heroLine = style({
  margin: '0.22rem 0',
  color: '#cfc7ba',
  lineHeight: 1.5,
});

export const desc = heroLine;

export const empty = heroLine;

export const stats = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.45rem',
});

export const statChip = infoChip;

export const list = style({
  margin: 0,
  paddingLeft: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.42rem',
});

globalStyle(`${list} li`, {
  color: '#d7d0c3',
  lineHeight: 1.45,
});

export const listMeta = style({
  display: 'block',
  color: '#9a9488',
  fontSize: '0.84rem',
});

export const deckStrong = style({
  color: sceneVars.color.accentGlow,
});
