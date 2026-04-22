import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';
import { infoChip } from '@/styles/uiPrimitives.css';

const tablet = '(max-width: 900px)';

export const root = style({
  flexShrink: 0,
  width: '100%',
  padding: '0 0 0.45rem',
});

export const inner = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  padding: '0.45rem 0.65rem 0.4rem',
  borderRadius: sceneVars.radii.md,
  background: 'linear-gradient(180deg, rgba(40, 35, 28, 0.78) 0%, rgba(31, 28, 23, 0.46) 100%)',
  border: '1px solid rgba(84, 72, 57, 0.58)',
  boxShadow: '0 8px 22px rgba(0, 0, 0, 0.14)',
  backdropFilter: 'blur(8px)',
});

export const row = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.35rem 0.55rem',
});

export const rowTone = styleVariants({
  stats: {
    alignItems: 'flex-start',
  },
  meta: {
    alignItems: 'stretch',
    gap: '0.75rem',
  },
  actions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: '0.55rem',
    paddingTop: '0.25rem',
    borderTop: '1px solid rgba(61, 53, 40, 0.55)',
  },
});

export const chip = infoChip;

export const chipTone = styleVariants({
  default: {},
  accent: {
    borderColor: 'rgba(192, 132, 87, 0.38)',
    background: 'rgba(192, 132, 87, 0.08)',
  },
  win: {
    borderColor: 'rgba(90, 111, 78, 0.55)',
    background: 'rgba(90, 111, 78, 0.12)',
    color: '#c4d2b4',
    fontWeight: 700,
  },
});

globalStyle(`${chipTone.accent} strong`, {
  color: sceneVars.color.accentGlow,
});

export const energyHint = style({
  marginLeft: '0.25rem',
  fontSize: '0.78rem',
  fontWeight: 400,
  color: '#9a9488',
});

export const strip = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.32rem 0.45rem',
});

export const stripLabel = style({
  minWidth: '4.5rem',
  fontSize: '0.76rem',
  color: '#8a8478',
});

export const stripEmpty = style({
  fontSize: '0.78rem',
  color: '#7d7669',
});

export const stripList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.38rem',
});

const stripPillBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  padding: '0.22rem 0.42rem',
  borderRadius: sceneVars.radii.pill,
  border: '1px solid rgba(108, 93, 72, 0.92)',
  background: 'rgba(20, 18, 16, 0.48)',
  color: '#d8d0c3',
  fontSize: '0.74rem',
  lineHeight: 1.2,
});

export const statusPill = stripPillBase;

export const statusPillKey = style({
  display: 'inline-grid',
  placeItems: 'center',
  width: '1.2rem',
  height: '1.2rem',
  borderRadius: sceneVars.radii.pill,
  background: 'rgba(192, 132, 87, 0.18)',
  color: sceneVars.color.accentGlow,
  fontSize: '0.72rem',
  fontWeight: 700,
});

export const statusPillValue = style({
  color: '#f0ebe3',
});

export const metaGroup = style({
  flex: 1,
  minWidth: '15rem',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.6rem',
  padding: '0.3rem 0.45rem',
  borderRadius: '10px',
  background: 'rgba(20, 18, 16, 0.24)',
  border: '1px solid rgba(61, 53, 40, 0.48)',
  '@media': {
    [tablet]: {
      minWidth: '100%',
    },
  },
});

export const metaLabel = stripLabel;

export const metaList = stripList;

export const metaPill = style([
  stripPillBase,
  {
    borderColor: 'rgba(90, 111, 78, 0.32)',
  },
]);

export const buttons = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.5rem',
});

export const actionButton = style({
  padding: '0.46rem 0.95rem',
  fontSize: '0.84rem',
  fontWeight: 600,
  cursor: 'pointer',
  borderRadius: sceneVars.radii.sm,
  border: '1px solid rgba(90, 60, 40, 0.45)',
  boxShadow: '0 2px 0 rgba(0, 0, 0, 0.18)',
  transition: `border-color ${sceneVars.motion.fast} ${sceneVars.motion.ease}, background ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
  selectors: {
    '&:disabled': {
      opacity: 0.45,
      cursor: 'not-allowed',
    },
  },
});

export const actionButtonTone = styleVariants({
  primary: {
    color: '#1a1814',
    background: 'linear-gradient(180deg, #d4a078 0%, #c08457 100%)',
  },
  ghost: {
    color: sceneVars.color.text,
    background: 'transparent',
    borderColor: '#5a5346',
    selectors: {
      '&:hover:not(:disabled)': {
        borderColor: sceneVars.color.accent,
      },
    },
  },
});

export const potionBar = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '0.45rem 0.6rem',
});

export const potionBarLabel = style({
  fontSize: '0.8rem',
  color: '#8a8478',
});

export const potionList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.4rem',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const potionButton = style({
  padding: '0.3rem 0.55rem',
  fontSize: '0.82rem',
  cursor: 'pointer',
  color: '#c8e6ff',
  background: '#2a3544',
  border: '1px solid #4a5f78',
  borderRadius: '6px',
  transition: `border-color ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
  selectors: {
    '&:hover': {
      borderColor: '#7ab0d4',
    },
  },
});
