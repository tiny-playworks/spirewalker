import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';
import { infoChip } from '@/styles/uiPrimitives.css';

const tablet = '(max-width: 900px)';

export const root = style({
  flexShrink: 0,
  width: '100%',
  padding: '0 0 0.4rem',
});

export const inner = style({
  display: 'block',
  padding: '0.38rem 5.2rem 0.38rem 0.55rem',
  borderRadius: '12px',
  background:
    'linear-gradient(180deg, rgba(38, 34, 28, 0.94) 0%, rgba(24, 22, 18, 0.9) 100%)',
  border: '1px solid rgba(92, 78, 58, 0.72)',
  boxShadow: '0 10px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(244, 213, 141, 0.06)',
  '@media': {
    [tablet]: {
      paddingRight: '0.55rem',
    },
  },
});

export const primaryRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.42rem',
  minHeight: '2.15rem',
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  '@media': {
    [tablet]: {
      flexWrap: 'wrap',
      overflowX: 'visible',
    },
  },
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

globalStyle(`${chip}`, {
  flexShrink: 0,
  padding: '0.27rem 0.52rem',
  fontSize: '0.76rem',
  background: 'rgba(12, 11, 9, 0.46)',
  borderColor: 'rgba(82, 70, 52, 0.82)',
});

export const chipTone = styleVariants({
  default: {},
  accent: {
    borderColor: 'rgba(192, 132, 87, 0.55)',
    background: 'rgba(192, 132, 87, 0.12)',
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

export const actions = style({
  marginLeft: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '0.42rem',
  flexShrink: 0,
});

export const actionButton = style({
  padding: '0.36rem 0.8rem',
  fontSize: '0.78rem',
  fontWeight: 600,
  cursor: 'pointer',
  borderRadius: '8px',
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
  flexShrink: 0,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '0.35rem',
});

export const potionBarLabel = style({
  display: 'none',
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
  padding: '0.32rem 0.58rem',
  fontSize: '0.76rem',
  cursor: 'pointer',
  color: '#d9e7f2',
  background: 'rgba(42, 53, 68, 0.82)',
  border: '1px solid rgba(95, 121, 150, 0.72)',
  borderRadius: '8px',
  transition: `border-color ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
  selectors: {
    '&:hover': {
      borderColor: '#7ab0d4',
    },
  },
});
