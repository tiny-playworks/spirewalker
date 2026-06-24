import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';
import { infoChip } from '@/styles/uiPrimitives.css';

const tablet = '(max-width: 900px)';

/** 战斗顶栏一行：状态芯片、主操作、药水、快捷按钮共用，便于垂直对齐 */
export const battleBarControlMinHeight = '2rem';

export const root = style({
  position: 'relative',
  flexShrink: 0,
  width: '100%',
  padding: 0,
});

export const inner = style({
  display: 'block',
  padding: 0,
  borderRadius: 0,
  background: 'transparent',
  border: 0,
  boxShadow: 'none',
  backdropFilter: 'none',
});

export const primaryRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.72rem',
  minHeight: battleBarControlMinHeight,
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

export const brand = style({
  flexShrink: 0,
  color: sceneVars.color.fortune,
  fontFamily: '"Libre Caslon Text", Georgia, serif',
  fontSize: '1.44rem',
  fontWeight: 900,
  letterSpacing: '0.09em',
  textShadow: '0 0 10px rgba(251, 191, 36, 0.32)',
});

export const encounterTitle = style({
  flex: '0 1 auto',
  minWidth: 0,
  maxWidth: '18rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: sceneVars.color.fortune,
  fontFamily: '"Libre Caslon Text", Georgia, serif',
  fontSize: '0.74rem',
  fontWeight: 900,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
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
    borderTop: '1px solid rgba(208, 188, 255, 0.18)',
  },
});

export const chip = infoChip;

globalStyle(`${chip}`, {
  flexShrink: 0,
  boxSizing: 'border-box',
  minHeight: battleBarControlMinHeight,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.34rem',
  padding: '0 0.82rem',
  fontSize: '0.78rem',
  lineHeight: 1,
  background: 'rgba(10, 10, 11, 0.52)',
  borderColor: 'rgba(208, 188, 255, 0.16)',
});

globalStyle(`${chip} strong`, {
  fontSize: '0.84rem',
  fontWeight: 900,
  lineHeight: 1,
});

export const chipTone = styleVariants({
  default: {},
  health: {
    color: '#d0bcff',
    borderColor: 'rgba(208, 188, 255, 0.22)',
  },
  block: {
    color: '#6da7e6',
    borderColor: 'rgba(106, 157, 212, 0.22)',
  },
  gold: {
    color: sceneVars.color.fortune,
    borderColor: 'rgba(251, 191, 36, 0.24)',
  },
  energy: {
    color: sceneVars.color.fortune,
    width: '2.1rem',
    padding: 0,
    justifyContent: 'center',
    borderColor: 'rgba(251, 191, 36, 0.68)',
    background: 'rgba(251, 191, 36, 0.12)',
    boxShadow: '0 0 22px rgba(251, 191, 36, 0.24)',
  },
  accent: {
    width: '2.1rem',
    padding: 0,
    justifyContent: 'center',
    color: '#3cddc7',
    borderColor: 'rgba(45, 212, 191, 0.6)',
    background: 'rgba(45, 212, 191, 0.1)',
  },
  win: {
    borderColor: 'rgba(45, 212, 191, 0.55)',
    background: 'rgba(45, 212, 191, 0.12)',
    color: '#62fae3',
    fontWeight: 700,
  },
});

globalStyle(`${chipTone.accent} strong`, {
  color: sceneVars.color.accentGlow,
});

export const energyHint = style({
  marginLeft: '0.18rem',
  fontSize: '0.6rem',
  fontWeight: 400,
  color: '#ffb4ab',
});

export const muted = style({
  marginLeft: '-0.18rem',
  color: sceneVars.color.textSubtle,
});

export const blockText = style({
  marginLeft: '0.12rem',
  color: '#3cddc7',
  fontWeight: 700,
});

export const intentText = style({
  marginLeft: '0.16rem',
  color: sceneVars.color.textSubtle,
});

/** 仅自动化：胜利按钮在主舞台内，DOM 保留可聚焦的等价入口供 Playwright 使用 */
export const e2eRewardBridge = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
  opacity: 0,
  pointerEvents: 'auto',
});

export const actions = style({
  marginLeft: 'auto',
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '0.42rem',
  flexShrink: 0,
});

export const actionButton = style({
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: battleBarControlMinHeight,
  padding: '0 0.56rem',
  fontSize: '0.66rem',
  lineHeight: 1,
  fontWeight: 600,
  cursor: 'pointer',
  borderRadius: '999px',
  border: '1px solid rgba(208, 188, 255, 0.28)',
  boxShadow: sceneVars.shadow.button,
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
    color: '#261a00',
    background: 'linear-gradient(135deg, #c08457 0%, #fbbf24 100%)',
  },
  ghost: {
    color: sceneVars.color.text,
    background: 'transparent',
    borderColor: 'rgba(208, 188, 255, 0.28)',
    selectors: {
      '&:hover:not(:disabled)': {
        borderColor: sceneVars.color.accentGlow,
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
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '1.75rem',
  minWidth: '1.75rem',
  padding: 0,
  fontSize: '0.72rem',
  lineHeight: 1,
  cursor: 'pointer',
  color: '#d9f7ff',
  background: 'rgba(45, 212, 191, 0.12)',
  border: '1px solid rgba(45, 212, 191, 0.42)',
  borderRadius: '8px',
  transition: `border-color ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
  selectors: {
    '&:hover': {
      borderColor: '#62fae3',
    },
  },
});
