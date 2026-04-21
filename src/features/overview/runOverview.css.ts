import { globalStyle, style } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';
import { infoChip, panelSurface, sectionKicker } from '@/styles/uiPrimitives.css';

export const toggle = style([
  infoChip,
  {
    position: 'fixed',
    top: '0.9rem',
    right: '0.9rem',
    zIndex: 70,
    padding: '0.48rem 0.8rem',
    color: '#f0ebe3',
    background: 'rgba(20, 18, 16, 0.88)',
    borderColor: 'rgba(95, 81, 62, 0.9)',
    boxShadow: '0 10px 26px rgba(0, 0, 0, 0.28)',
    cursor: 'pointer',
  },
]);

globalStyle(`${toggle} strong`, {
  fontSize: 'inherit',
  color: 'inherit',
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
