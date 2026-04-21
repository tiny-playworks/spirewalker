import { style, styleVariants } from '@vanilla-extract/css';
import { sceneVars } from './sceneTheme.css';

export const screenRoot = style({
  flexDirection: 'column',
  alignItems: 'stretch',
  alignSelf: 'center',
  width: '100%',
  maxWidth: '28rem',
  padding: '1.25rem 1.5rem',
});

export const screenWidth = styleVariants({
  regular: {},
  wide: {
    maxWidth: '32rem',
  },
});

export const screenStack = style({
  flexDirection: 'column',
  gap: '1rem',
});

export const title = style({
  margin: '0 0 0.5rem',
  fontSize: '1.35rem',
  color: sceneVars.color.accentGlow,
});

export const tip = style({
  margin: '0 0 1.25rem',
  color: sceneVars.color.textMuted,
  lineHeight: 1.5,
});

export const actionButton = style({
  padding: '0.5rem 1.05rem',
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

export const leaveButton = style({
  marginTop: '1rem',
});

export const actionsRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.75rem',
});

export const choiceList = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

export const eventOptions = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  width: '100%',
  maxWidth: '24rem',
});

const choiceButtonBase = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.35rem',
  width: '100%',
  textAlign: 'left',
  cursor: 'pointer',
  color: sceneVars.color.text,
  borderRadius: sceneVars.radii.sm,
  transition: `border-color ${sceneVars.motion.fast} ${sceneVars.motion.ease}, background ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
  selectors: {
    '&:hover:not(:disabled)': {
      borderColor: sceneVars.color.accent,
    },
    '&:disabled': {
      opacity: 0.45,
      cursor: 'not-allowed',
    },
  },
});

export const choiceButton = style([
  choiceButtonBase,
  {
    padding: '0.85rem 1rem',
    background: sceneVars.color.panel,
    border: `1px solid ${sceneVars.color.border}`,
  },
]);

export const compactChoiceButton = style([
  choiceButtonBase,
  {
    padding: '0.65rem 0.85rem',
    background: sceneVars.color.panel,
    border: `1px solid ${sceneVars.color.border}`,
  },
]);

export const skipButton = style([
  choiceButtonBase,
  {
    padding: '0.75rem 1rem',
    background: sceneVars.color.panelAlt,
    border: '1px solid #5a5346',
  },
]);

export const choiceDesc = style({
  fontSize: '0.85rem',
  color: '#9a9488',
});

export const banner = style({
  margin: '0 0 1rem',
  padding: '0.65rem 0.85rem',
  background: '#2a261d',
  border: '1px solid #5a4e3a',
  borderRadius: sceneVars.radii.sm,
});

export const bannerTone = styleVariants({
  reward: {},
  potion: {
    borderColor: '#4a6b55',
  },
});

export const bannerLine = style({
  margin: 0,
  fontSize: '0.9rem',
  lineHeight: 1.45,
  color: '#d4cbb8',
});

export const bannerTag = style({
  display: 'inline-block',
  marginRight: '0.4rem',
  padding: '0.1rem 0.35rem',
  fontSize: '0.72rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  color: '#1a1814',
  background: sceneVars.color.accent,
  borderRadius: '4px',
});

export const bannerTagTone = styleVariants({
  reward: {},
  potion: {
    background: '#5a8f6e',
  },
});

export const bannerNote = style({
  display: 'block',
  marginTop: '0.25rem',
  fontSize: '0.78rem',
  fontWeight: 400,
  color: '#8a9488',
});

export const skipSection = style({
  marginTop: '1.25rem',
  paddingTop: '1rem',
  borderTop: `1px solid ${sceneVars.color.borderSoft}`,
});

export const skipLabel = style({
  margin: '0 0 0.5rem',
  fontSize: '0.85rem',
  color: '#9a9488',
});

export const sectionTitle = style({
  margin: '0 0 0.5rem',
  fontSize: '1rem',
  fontWeight: 600,
  color: '#c9c2b4',
});

export const sectionList = style({
  margin: '0 0 1rem',
  padding: 0,
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

export const removeHint = style({
  margin: '0 0 0.65rem',
  fontSize: '0.85rem',
  lineHeight: 1.45,
  color: '#8a8378',
});

export const removeList = style({
  marginBottom: '1.25rem',
});
