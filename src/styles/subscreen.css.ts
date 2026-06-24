import { style, styleVariants } from '@vanilla-extract/css';
import { sceneVars } from './sceneTheme.css';

export const screenRoot = style({
  flexDirection: 'column',
  alignItems: 'stretch',
  alignSelf: 'center',
  width: '100%',
  maxWidth: '28rem',
  padding: '1.25rem 1.5rem',
  borderRadius: sceneVars.radii.lg,
  border: `1px solid ${sceneVars.color.border}`,
  background:
    'linear-gradient(145deg, rgba(32, 31, 32, 0.82), rgba(10, 10, 11, 0.68))',
  boxShadow: sceneVars.shadow.panelHeavy,
  backdropFilter: 'blur(18px)',
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
  fontFamily: '"Libre Caslon Text", Georgia, serif',
  fontSize: '1.65rem',
  color: sceneVars.color.textStrong,
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
  border: `1px solid ${sceneVars.color.border}`,
  boxShadow: sceneVars.shadow.button,
  transition: `border-color ${sceneVars.motion.fast} ${sceneVars.motion.ease}, background ${sceneVars.motion.fast} ${sceneVars.motion.ease}, transform ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
  selectors: {
    '&:hover:not(:disabled)': {
      transform: 'translateY(-1px)',
    },
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
    background: 'linear-gradient(145deg, rgba(32, 31, 32, 0.78), rgba(10, 10, 11, 0.52))',
    border: `1px solid ${sceneVars.color.border}`,
    boxShadow: '0 0 24px rgba(139, 92, 246, 0.08)',
  },
]);

export const compactChoiceButton = style([
  choiceButtonBase,
  {
    padding: '0.65rem 0.85rem',
    background: 'linear-gradient(145deg, rgba(32, 31, 32, 0.72), rgba(10, 10, 11, 0.5))',
    border: `1px solid ${sceneVars.color.border}`,
  },
]);

export const skipButton = style([
  choiceButtonBase,
  {
    padding: '0.75rem 1rem',
    background: 'rgba(10, 10, 11, 0.58)',
    border: '1px solid rgba(251, 191, 36, 0.34)',
  },
]);

export const choiceDesc = style({
  fontSize: '0.85rem',
  color: sceneVars.color.textMuted,
});

export const banner = style({
  margin: '0 0 1rem',
  padding: '0.65rem 0.85rem',
  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.12), rgba(10, 10, 11, 0.48))',
  border: '1px solid rgba(251, 191, 36, 0.34)',
  borderRadius: sceneVars.radii.sm,
});

export const bannerTone = styleVariants({
  reward: {},
  potion: {
    borderColor: 'rgba(45, 212, 191, 0.4)',
  },
});

export const bannerLine = style({
  margin: 0,
  fontSize: '0.9rem',
  lineHeight: 1.45,
  color: sceneVars.color.textMuted,
});

export const bannerTag = style({
  display: 'inline-block',
  marginRight: '0.4rem',
  padding: '0.1rem 0.35rem',
  fontSize: '0.72rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  color: '#261a00',
  background: sceneVars.color.fortune,
  borderRadius: '4px',
});

export const bannerTagTone = styleVariants({
  reward: {},
  potion: {
    color: '#00201c',
    background: sceneVars.color.relief,
  },
});

export const bannerNote = style({
  display: 'block',
  marginTop: '0.25rem',
  fontSize: '0.78rem',
  fontWeight: 400,
  color: sceneVars.color.textSubtle,
});

export const skipSection = style({
  marginTop: '1.25rem',
  paddingTop: '1rem',
  borderTop: `1px solid ${sceneVars.color.borderSoft}`,
});

export const skipLabel = style({
  margin: '0 0 0.5rem',
  fontSize: '0.85rem',
  color: sceneVars.color.textSubtle,
});

export const sectionTitle = style({
  margin: '0 0 0.5rem',
  fontSize: '1rem',
  fontWeight: 600,
  color: sceneVars.color.textStrong,
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
  color: sceneVars.color.textSubtle,
});

export const removeList = style({
  marginBottom: '1.25rem',
});
