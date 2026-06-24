import { globalStyle, keyframes, style, styleVariants } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';

export type MainMenuActionKind = 'primary' | 'secondary';

const breathe = keyframes({
  '0%, 100%': {
    transform: 'scale(1) translate3d(0, 0, 0)',
    opacity: 0.82,
  },
  '50%': {
    transform: 'scale(1.08) translate3d(0, -1.6%, 0)',
    opacity: 1,
  },
});

const heartbeatPulse = keyframes({
  '0%, 100%': {
    transform: 'translate(-50%, -50%) scale(0.95)',
    opacity: 0.72,
  },
  '50%': {
    transform: 'translate(-50%, -50%) scale(1.08)',
    opacity: 1,
  },
});

const heartbeatRipple = keyframes({
  '0%': {
    transform: 'scale(0.82)',
    opacity: 0,
  },
  '25%': {
    opacity: 0.36,
  },
  '100%': {
    transform: 'scale(1.24)',
    opacity: 0,
  },
});

const titleGlow = keyframes({
  '0%, 100%': {
    textShadow:
      '0 0 18px rgba(244, 213, 141, 0.12), 0 0 42px rgba(244, 213, 141, 0.2), 0 2px 0 rgba(26, 22, 18, 0.85)',
  },
  '50%': {
    textShadow:
      '0 0 22px rgba(244, 213, 141, 0.22), 0 0 52px rgba(244, 213, 141, 0.28), 0 2px 0 rgba(26, 22, 18, 0.85)',
  },
});

const spireSway = keyframes({
  '0%, 100%': {
    transform: 'translateX(-50%) translateY(0)',
  },
  '50%': {
    transform: 'translateX(calc(-50% + 0.2rem)) translateY(-0.4rem)',
  },
});

const runeDrift = keyframes({
  '0%, 100%': {
    transform: 'translate3d(0, 0, 0)',
    opacity: 0.46,
  },
  '50%': {
    transform: 'translate3d(0, -8px, 0)',
    opacity: 0.72,
  },
});

const sparkle = keyframes({
  '0%, 100%': {
    transform: 'scale(0.75)',
    opacity: 0.2,
  },
  '45%': {
    transform: 'scale(1)',
    opacity: 0.82,
  },
  '70%': {
    transform: 'scale(1.25)',
    opacity: 0.38,
  },
});

const threatShift = keyframes({
  '0%, 100%': {
    transform: 'translate3d(0, 0, 0) scale(1)',
  },
  '50%': {
    transform: 'translate3d(0.4rem, -0.5rem, 0) scale(1.04)',
  },
});

const reducedMotion = '(prefers-reduced-motion: reduce)';
const mobile = '(max-width: 640px)';

export const root = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  alignSelf: 'stretch',
  width: '100%',
  maxWidth: 'none',
  minHeight: 0,
  padding: 'clamp(1.5rem, 4vw, 3rem)',
  overflow: 'hidden',
  background:
    'radial-gradient(ellipse 60% 40% at 50% 16%, rgba(208, 188, 255, 0.13) 0%, transparent 60%), radial-gradient(ellipse 85% 65% at 50% 18%, rgba(139, 92, 246, 0.18) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 80% 80%, rgba(45, 212, 191, 0.08) 0%, transparent 45%), linear-gradient(180deg, #0a0a0b 0%, #131314 42%, #0e0e0f 100%)',
  '@media': {
    [mobile]: {
      padding: '1.25rem 1rem',
    },
  },
});

export const archiveActions = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
  gap: '0.45rem',
  marginTop: '0.85rem',
  '@media': {
    [mobile]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
});

export const archiveButton = style({
  minHeight: '2.25rem',
  padding: '0 0.6rem',
  borderRadius: sceneVars.radii.sm,
  border: '1px solid rgba(208, 188, 255, 0.24)',
  background: 'rgba(10, 10, 11, 0.38)',
  color: sceneVars.color.textMuted,
  fontSize: '0.78rem',
  fontWeight: 800,
  cursor: 'pointer',
  transition: 'border-color 140ms ease, color 140ms ease, box-shadow 140ms ease',
  selectors: {
    '&:hover': {
      color: sceneVars.color.textStrong,
      borderColor: 'rgba(251, 191, 36, 0.62)',
      boxShadow: '0 0 20px rgba(251, 191, 36, 0.12)',
    },
  },
});

export const backdrop = style({
  pointerEvents: 'none',
  position: 'absolute',
  inset: 0,
});

export const heartbeat = style({
  position: 'absolute',
  left: '50%',
  top: '27%',
  width: 'min(42rem, 74vw)',
  height: 'min(42rem, 74vw)',
  transform: 'translate(-50%, -50%)',
  borderRadius: '50%',
  background:
    'radial-gradient(circle, rgba(244, 213, 141, 0.13) 0%, rgba(244, 213, 141, 0.07) 22%, rgba(244, 213, 141, 0.02) 42%, transparent 68%)',
  filter: 'blur(10px)',
  animation: `${heartbeatPulse} 3.6s ${sceneVars.motion.easeInOut} infinite`,
  selectors: {
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      inset: '10%',
      borderRadius: '50%',
      border: '1px solid rgba(244, 213, 141, 0.08)',
      opacity: 0,
      transform: 'scale(0.88)',
      animation: `${heartbeatRipple} 3.6s ease-out infinite`,
    },
    '&::after': {
      animationDelay: '-1.8s',
    },
  },
  '@media': {
    [reducedMotion]: {
      animation: 'none',
    },
  },
});

export const aurora = style({
  position: 'absolute',
  inset: '-12%',
  background:
    'radial-gradient(circle at 50% 24%, rgba(244, 213, 141, 0.12) 0%, transparent 24%), radial-gradient(circle at 48% 36%, rgba(192, 132, 87, 0.14) 0%, transparent 28%), radial-gradient(circle at 32% 68%, rgba(122, 150, 105, 0.08) 0%, transparent 26%)',
  filter: 'blur(20px)',
  animation: `${breathe} 5.2s ${sceneVars.motion.easeInOut} infinite`,
  '@media': {
    [reducedMotion]: {
      animation: 'none',
    },
  },
});

export const threats = style({
  position: 'absolute',
  inset: 0,
});

export const threat = style({
  position: 'absolute',
  display: 'block',
  borderRadius: '50%',
  background:
    'radial-gradient(circle at 35% 35%, rgba(80, 48, 32, 0.14), rgba(16, 12, 10, 0.02) 56%, transparent 72%)',
  mixBlendMode: 'screen',
  filter: 'blur(28px)',
  opacity: 0.5,
  animation: `${threatShift} 12s ${sceneVars.motion.easeInOut} infinite`,
  '@media': {
    [reducedMotion]: {
      animation: 'none',
    },
  },
});

export const threatPosition = styleVariants({
  left: {
    left: '8%',
    top: '34%',
    width: '18rem',
    height: '22rem',
    '@media': {
      [mobile]: {
        width: '10rem',
        height: '14rem',
      },
    },
  },
  right: {
    right: '6%',
    top: '18%',
    width: '16rem',
    height: '20rem',
    animationDelay: '-4s',
    '@media': {
      [mobile]: {
        width: '10rem',
        height: '14rem',
      },
    },
  },
  low: {
    left: '50%',
    bottom: '8%',
    width: '24rem',
    height: '12rem',
    transform: 'translateX(-50%)',
    opacity: 0.32,
    animationDelay: '-7s',
    '@media': {
      [mobile]: {
        width: '16rem',
      },
    },
  },
});

export const spireShadow = style({
  position: 'absolute',
  left: '50%',
  bottom: '-8%',
  width: 'min(28rem, 48vw)',
  aspectRatio: '0.7',
  transform: 'translateX(-50%)',
  opacity: 0.34,
  background:
    'linear-gradient(180deg, rgba(244, 213, 141, 0.08) 0%, rgba(244, 213, 141, 0) 14%), linear-gradient(180deg, rgba(16, 14, 12, 0.05) 0%, rgba(16, 14, 12, 0.65) 100%)',
  clipPath:
    'polygon(50% 0%, 58% 12%, 62% 20%, 74% 52%, 88% 100%, 12% 100%, 26% 52%, 38% 20%, 42% 12%)',
  filter: 'blur(1px) drop-shadow(0 0 24px rgba(244, 213, 141, 0.07))',
  animation: `${spireSway} 9s ${sceneVars.motion.easeInOut} infinite`,
  '@media': {
    [reducedMotion]: {
      animation: 'none',
    },
  },
});

export const spireShadowFar = style({
  left: '68%',
  bottom: '6%',
  width: 'min(15rem, 26vw)',
  opacity: 0.16,
  filter: 'blur(6px)',
  animationDuration: '13s',
  animationDelay: '-5s',
});

export const runes = style({
  position: 'absolute',
  inset: 0,
});

export const rune = style({
  position: 'absolute',
  padding: '0.28rem 0.55rem',
  border: '1px solid rgba(192, 132, 87, 0.16)',
  borderRadius: sceneVars.radii.pill,
  background: 'rgba(26, 22, 18, 0.26)',
  color: 'rgba(244, 213, 141, 0.18)',
  fontSize: '0.72rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  backdropFilter: 'blur(2px)',
  animation: `${runeDrift} 12s ${sceneVars.motion.easeInOut} infinite`,
  '@media': {
    [reducedMotion]: {
      animation: 'none',
    },
  },
});

export const runePosition = styleVariants({
  first: {
    top: '18%',
    left: '18%',
    '@media': {
      [mobile]: {
        left: '8%',
      },
    },
  },
  second: {
    top: '30%',
    right: '16%',
    animationDelay: '-3s',
    '@media': {
      [mobile]: {
        right: '8%',
      },
    },
  },
  third: {
    right: '22%',
    bottom: '20%',
    animationDelay: '-6s',
    '@media': {
      [mobile]: {
        right: '10%',
        bottom: '16%',
      },
    },
  },
});

export const sparks = style({
  position: 'absolute',
  inset: 0,
});

export const spark = style({
  position: 'absolute',
  width: '0.38rem',
  height: '0.38rem',
  borderRadius: '50%',
  background: 'rgba(244, 213, 141, 0.75)',
  boxShadow: '0 0 16px rgba(244, 213, 141, 0.45)',
  animation: `${sparkle} 4.5s ${sceneVars.motion.easeInOut} infinite`,
  '@media': {
    [reducedMotion]: {
      animation: 'none',
    },
  },
});

export const sparkPosition = styleVariants({
  first: {
    top: '26%',
    left: '50%',
  },
  second: {
    top: '42%',
    left: '24%',
    animationDelay: '-1.4s',
  },
  third: {
    top: '48%',
    right: '22%',
    animationDelay: '-2.4s',
  },
  fourth: {
    bottom: '18%',
    left: '56%',
    animationDelay: '-3.2s',
  },
});

export const vignette = style({
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, transparent 20%, transparent 72%, rgba(0, 0, 0, 0.28) 100%), radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(0, 0, 0, 0.62) 100%)',
});

export const grid = style({
  position: 'absolute',
  inset: 0,
  opacity: 0.04,
  backgroundImage:
    'linear-gradient(rgba(232, 228, 220, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(232, 228, 220, 0.5) 1px, transparent 1px)',
  backgroundSize: '48px 48px',
});

export const content = style({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  maxWidth: '30rem',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '1.9rem',
  textAlign: 'center',
  '@media': {
    [mobile]: {
      gap: '1.5rem',
    },
  },
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.65rem',
});

export const kicker = style({
  margin: 0,
  fontSize: '0.72rem',
  fontWeight: 600,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: sceneVars.color.textSubtle,
});

export const title = style({
  margin: 0,
  lineHeight: 1.05,
});

export const titleMain = style({
  display: 'inline-block',
  fontFamily: "'Baskerville Old Face', 'Palatino Linotype', Georgia, serif",
  fontSize: 'clamp(2.4rem, 8vw, 4rem)',
  fontWeight: 700,
  letterSpacing: '0.18em',
  color: '#f5ddb0',
  textShadow:
    '0 0 18px rgba(244, 213, 141, 0.12), 0 0 42px rgba(244, 213, 141, 0.2), 0 2px 0 rgba(26, 22, 18, 0.85)',
  animation: `${titleGlow} 5.5s ${sceneVars.motion.easeInOut} infinite`,
  '@media': {
    [mobile]: {
      letterSpacing: '0.14em',
    },
    [reducedMotion]: {
      animation: 'none',
    },
  },
});

export const lead = style({
  margin: '0.35rem 0 0',
  maxWidth: '23rem',
  fontSize: '0.98rem',
  lineHeight: 1.7,
  color: '#b8b0a4',
});

export const tagline = style({
  margin: 0,
  fontSize: '0.8rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#8f8577',
});

export const card = style({
  position: 'relative',
  borderRadius: sceneVars.radii.lg,
  padding: '1px',
  background: 'linear-gradient(145deg, rgba(192, 132, 87, 0.35), rgba(61, 53, 40, 0.9))',
  boxShadow: sceneVars.shadow.panelHeavy,
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: '1px',
      borderRadius: '13px',
      background:
        'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, transparent 24%), radial-gradient(circle at top center, rgba(244, 213, 141, 0.06), transparent 55%)',
      pointerEvents: 'none',
    },
  },
});

export const cardInner = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.95rem',
  padding: '1.35rem 1.25rem 1.25rem',
  borderRadius: '13px',
  background: 'linear-gradient(180deg, rgba(44, 40, 32, 0.96) 0%, rgba(33, 29, 23, 0.98) 100%)',
  border: '1px solid rgba(74, 67, 54, 0.95)',
  backdropFilter: 'blur(8px)',
  '@media': {
    [mobile]: {
      padding: '1.1rem 1rem 1rem',
    },
  },
});

export const statusBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  alignItems: 'center',
  paddingBottom: '0.85rem',
  borderBottom: '1px solid rgba(78, 68, 54, 0.8)',
});

export const statusKicker = style({
  margin: 0,
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
  color: '#7e766c',
});

export const statusTitle = style({
  margin: 0,
  fontSize: '1.15rem',
  fontWeight: 700,
  color: '#f3d8a0',
});

export const inlineHint = style({
  margin: 0,
  maxWidth: '24rem',
  fontSize: '0.82rem',
  lineHeight: 1.55,
  color: '#93897b',
});

export const actionButtonBase = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  width: '100%',
  padding: '1rem 1.1rem 1rem 1.15rem',
  borderRadius: sceneVars.radii.md,
  font: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
  overflow: 'hidden',
  transition: [
    `transform ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
    `box-shadow ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
    `filter ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
    `border-color ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
    `background ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
  ].join(', '),
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: '1px',
      borderRadius: '11px',
      background:
        'radial-gradient(circle at 18% 50%, rgba(244, 213, 141, 0.16), transparent 42%), linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 35%)',
      opacity: 0,
      transition: `opacity ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
    },
  },
  '@media': {
    [mobile]: {
      padding: '0.95rem 0.95rem 0.95rem 1rem',
      gap: '0.75rem',
    },
    [reducedMotion]: {
      transition: 'none',
    },
  },
});

export const actionButtonKind = styleVariants({
  primary: {
    border: '1px solid #a6744a',
    color: '#1a1612',
    background: 'linear-gradient(168deg, #ebc592 0%, #d69a62 38%, #925a36 100%)',
    boxShadow:
      '0 10px 24px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 219, 161, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
  },
  secondary: {
    border: `1px solid ${sceneVars.color.border}`,
    color: sceneVars.color.text,
    background: 'linear-gradient(180deg, rgba(48, 42, 34, 0.92) 0%, rgba(30, 27, 22, 0.98) 100%)',
    boxShadow: '0 10px 24px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
  },
});

export const actionButtonDisabled = style({
  cursor: 'not-allowed',
  filter: 'grayscale(0.25) brightness(0.72)',
  opacity: 0.55,
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.18)',
});

export const actionButtonCopy = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.22rem',
  alignItems: 'flex-start',
  minWidth: 0,
});

export const actionButtonFlare = style({
  position: 'absolute',
  left: '-15%',
  top: '-45%',
  width: '60%',
  height: '180%',
  transform: 'rotate(22deg)',
  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0) 65%)',
  opacity: 0,
  transition: `opacity ${sceneVars.motion.normal} ${sceneVars.motion.ease}, transform ${sceneVars.motion.normal} ${sceneVars.motion.ease}`,
  '@media': {
    [reducedMotion]: {
      transition: 'none',
    },
  },
});

export const actionButtonLabel = style({
  fontSize: '1.05rem',
  fontWeight: 700,
  '@media': {
    [mobile]: {
      fontSize: '1rem',
    },
  },
});

export const actionButtonHintBase = style({
  fontSize: '0.78rem',
  fontWeight: 500,
  lineHeight: 1.5,
  opacity: 0.92,
  '@media': {
    [mobile]: {
      fontSize: '0.76rem',
    },
  },
});

export const actionButtonHintTone = styleVariants({
  primary: {
    color: 'rgba(26, 22, 18, 0.75)',
  },
  secondary: {
    color: '#9a9488',
  },
});

export const actionButtonMark = style({
  position: 'relative',
  zIndex: 1,
  flexShrink: 0,
  fontSize: '1.1rem',
  color: 'inherit',
  opacity: 0.8,
  transition: `transform ${sceneVars.motion.fast} ${sceneVars.motion.ease}, opacity ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
  '@media': {
    [reducedMotion]: {
      transition: 'none',
    },
  },
});

globalStyle(`${actionButtonBase}:hover:not(:disabled) ${actionButtonFlare}`, {
  opacity: 1,
  transform: 'rotate(22deg) translate3d(10%, 3%, 0)',
});

globalStyle(`${actionButtonBase}:hover:not(:disabled)::after`, {
  opacity: 1,
});

globalStyle(`${actionButtonBase}:hover:not(:disabled) ${actionButtonMark}`, {
  opacity: 1,
  transform: 'translateX(3px) scale(1.08)',
});

globalStyle(`${actionButtonKind.primary}:hover:not(:disabled)`, {
  filter: 'brightness(1.04)',
  transform: 'translateY(-2px) scale(1.02)',
  boxShadow:
    '0 16px 34px rgba(0, 0, 0, 0.42), 0 0 28px rgba(244, 213, 141, 0.18), inset 0 0 24px rgba(255, 236, 188, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
});

globalStyle(`${actionButtonKind.primary}:active:not(:disabled)`, {
  transform: 'translateY(2px) scale(0.98)',
  boxShadow:
    '0 4px 12px rgba(0, 0, 0, 0.3), 0 0 24px rgba(244, 213, 141, 0.22), inset 0 0 32px rgba(255, 244, 214, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
});

globalStyle(`${actionButtonKind.secondary}:hover:not(:disabled)`, {
  borderColor: 'rgba(192, 132, 87, 0.6)',
  background: 'linear-gradient(180deg, rgba(58, 50, 40, 0.96) 0%, rgba(34, 30, 24, 0.99) 100%)',
  transform: 'translateY(-2px) scale(1.02)',
  boxShadow:
    '0 16px 34px rgba(0, 0, 0, 0.3), 0 0 20px rgba(192, 132, 87, 0.09), inset 0 0 18px rgba(244, 213, 141, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
});

globalStyle(`${actionButtonKind.secondary}:active:not(:disabled)`, {
  transform: 'translateY(2px) scale(0.98)',
  boxShadow:
    '0 4px 12px rgba(0, 0, 0, 0.28), 0 0 16px rgba(192, 132, 87, 0.16), inset 0 0 20px rgba(244, 213, 141, 0.1)',
});

globalStyle(`${actionButtonBase}:focus-visible`, {
  outline: '2px solid rgba(244, 213, 141, 0.8)',
  outlineOffset: '2px',
});

export const footer = style({
  maxWidth: '24rem',
  margin: '0 auto',
  fontSize: '0.72rem',
  lineHeight: 1.5,
  letterSpacing: '0.04em',
  color: sceneVars.color.textFaint,
});
