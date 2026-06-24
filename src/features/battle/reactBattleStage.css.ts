import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';

const mobile = '(max-width: 760px)';

export const root = style({
  position: 'relative',
  isolation: 'isolate',
  display: 'grid',
  gridTemplateRows: 'minmax(0, 1fr) minmax(15.5rem, 34%)',
  gap: 0,
  minHeight: 'calc(100vh - 5rem)',
  padding: '0.45rem 0.75rem 0.35rem',
  overflow: 'hidden',
  color: sceneVars.color.text,
  '@media': {
    [mobile]: {
      minHeight: '32rem',
      padding: '0.7rem',
      gridTemplateRows: 'minmax(0, 1fr) minmax(15rem, 34%)',
    },
  },
});

export const backdrop = style({
  position: 'absolute',
  inset: 0,
  zIndex: -2,
  background:
    'radial-gradient(circle at 52% 20%, rgba(139, 92, 246, 0.22), transparent 22rem), radial-gradient(circle at 76% 58%, rgba(45, 212, 191, 0.13), transparent 18rem), linear-gradient(180deg, #0a0a0b 0%, #131314 52%, #0e0e0f 100%)',
});

export const backdropImage = style({
  position: 'absolute',
  inset: 0,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  opacity: 0.4,
  mixBlendMode: 'screen',
  filter: 'brightness(0.46) saturate(1.12)',
});

export const grid = style({
  position: 'absolute',
  inset: 0,
  opacity: 0.12,
  backgroundImage:
    'linear-gradient(rgba(208, 188, 255, 0.42) 1px, transparent 1px), linear-gradient(90deg, rgba(208, 188, 255, 0.42) 1px, transparent 1px)',
  backgroundSize: '40px 40px',
  maskImage: 'radial-gradient(circle at 50% 42%, black, transparent 76%)',
});

export const spire = style({
  position: 'absolute',
  left: '50%',
  top: '7%',
  width: 'min(28rem, 58vw)',
  height: '62%',
  transform: 'translateX(-50%)',
  opacity: 0.32,
  background:
    'linear-gradient(100deg, transparent 38%, rgba(251, 191, 36, 0.14) 40%, rgba(208, 188, 255, 0.32) 50%, rgba(45, 212, 191, 0.12) 60%, transparent 62%)',
  clipPath: 'polygon(50% 0, 64% 32%, 59% 100%, 42% 100%, 36% 32%)',
  filter: 'blur(0.2px) drop-shadow(0 0 34px rgba(139, 92, 246, 0.35))',
});

export const combatLayer = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(16rem, 0.72fr) minmax(0, 1fr)',
  alignItems: 'start',
  justifyItems: 'center',
  gap: 'clamp(3rem, 13vw, 13rem)',
  minHeight: 0,
  padding: 'clamp(1.8rem, 7vh, 4.2rem) clamp(1rem, 5vw, 5rem) 0',
  '@media': {
    [mobile]: {
      gridTemplateColumns: '1fr',
      alignContent: 'center',
      gap: '0.7rem',
      padding: '0.4rem',
    },
  },
});

export const enemyRail = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'clamp(1.4rem, 4vw, 3rem)',
  minWidth: 0,
  '@media': {
    [mobile]: {
      flexWrap: 'wrap',
    },
  },
});

export const unit = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 'clamp(12rem, 16vw, 15rem)',
  minWidth: '12rem',
  padding: 0,
  border: 0,
  background: 'transparent',
  boxShadow: 'none',
});

export const unitTone = styleVariants({
  player: {
    filter: 'drop-shadow(0 0 20px rgba(106, 157, 212, 0.34))',
  },
  enemy: {
    width: 'clamp(15.5rem, 22vw, 21rem)',
    filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.42))',
  },
});

export const unitDead = style({
  opacity: 0.42,
  filter: 'grayscale(0.5)',
});

export const spriteFrame = style({
  position: 'relative',
  width: '100%',
  height: 'clamp(10rem, 25vh, 16rem)',
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      left: '12%',
      right: '12%',
      bottom: '0.1rem',
      height: '1.2rem',
      borderRadius: '50%',
      background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.58), transparent 70%)',
      filter: 'blur(2px)',
    },
  },
});

export const unitSprite = style({
  position: 'absolute',
  inset: 0,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center bottom',
  backgroundSize: 'contain',
});

export const unitBody = style({
  width: 'min(100%, 17rem)',
  minWidth: 0,
  marginTop: '0.2rem',
});

export const unitHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '0.7rem',
  marginTop: '0.35rem',
  fontSize: '0.78rem',
  color: sceneVars.color.textMuted,
});

globalStyle(`${unitHeader} strong`, {
  color: sceneVars.color.textStrong,
  fontFamily: '"Libre Caslon Text", Georgia, serif',
  fontSize: '1rem',
});

export const hpTrack = style({
  position: 'relative',
  height: '0.72rem',
  overflow: 'hidden',
  borderRadius: sceneVars.radii.pill,
  border: '1px solid rgba(255, 180, 171, 0.28)',
  background: 'rgba(10, 10, 11, 0.72)',
});

globalStyle(`${hpTrack} > span`, {
  position: 'absolute',
  inset: '0 auto 0 0',
  background: 'linear-gradient(90deg, #d4846a, #ffb4ab)',
  boxShadow: '0 0 18px rgba(212, 132, 106, 0.34)',
});

globalStyle(`${hpTrack} > strong`, {
  position: 'absolute',
  inset: 0,
  display: 'grid',
  placeItems: 'center',
  color: '#fff7f2',
  fontSize: '0.64rem',
});

export const blockBadge = style({
  display: 'inline-flex',
  marginTop: '0.35rem',
  padding: '0.18rem 0.5rem',
  borderRadius: sceneVars.radii.pill,
  color: '#d9f7ff',
  background: 'rgba(45, 212, 191, 0.14)',
  border: '1px solid rgba(45, 212, 191, 0.42)',
});

export const statusList = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '0.32rem',
  marginTop: '0.45rem',
});

globalStyle(`${statusList} span`, {
  display: 'grid',
  placeItems: 'center',
  minWidth: '1.8rem',
  height: '1.55rem',
  padding: '0.1rem 0.3rem',
  borderRadius: '7px',
  color: sceneVars.color.textMuted,
  background: 'rgba(208, 188, 255, 0.1)',
  border: '1px solid rgba(208, 188, 255, 0.18)',
  fontSize: '0.7rem',
});

export const statusEmpty = style({
  display: 'inline-block',
  marginTop: '0.45rem',
  color: sceneVars.color.textFaint,
  fontSize: '0.72rem',
});

export const enemyTarget = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.8rem',
  minWidth: '15rem',
  padding: 0,
  border: 0,
  background: 'transparent',
  color: 'inherit',
  textAlign: 'left',
  selectors: {
    '&:disabled': {
      cursor: 'default',
    },
  },
});

export const enemyTargetActive = style({
  cursor: 'crosshair',
});

globalStyle(`${enemyTargetActive} ${unit}`, {
  filter:
    'drop-shadow(0 0 22px rgba(251, 191, 36, 0.42)) drop-shadow(0 0 34px rgba(139, 92, 246, 0.24))',
});

export const intent = style({
  alignSelf: 'center',
  padding: '0.5rem 0.9rem',
  borderRadius: sceneVars.radii.md,
  fontSize: '0.9rem',
  fontWeight: 800,
  border: '1px solid currentColor',
  background: 'rgba(26, 24, 20, 0.48)',
  backdropFilter: 'blur(16px)',
  boxShadow: '0 0 20px rgba(212, 132, 106, 0.2)',
});

export const intentTone = styleVariants({
  attack: { color: '#ffb4ab' },
  block: { color: '#3cddc7' },
  utility: { color: '#d0bcff' },
});

export const bottomDock = style({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: 'minmax(8rem, 0.3fr) minmax(0, 1fr) minmax(9rem, 0.32fr)',
  alignItems: 'end',
  gap: '0.8rem',
  minHeight: 0,
  padding: '0 0.75rem 0.15rem',
  background:
    'linear-gradient(180deg, transparent 0%, rgba(10, 10, 11, 0.54) 22%, rgba(10, 10, 11, 0.9) 100%)',
  '@media': {
    [mobile]: {
      gridTemplateColumns: '1fr',
      alignItems: 'stretch',
    },
  },
});

export const leftDock = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'end',
  gap: '0.45rem',
  minWidth: '14rem',
});

export const rightDock = style({
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'flex-end',
  gap: '0.9rem',
  flexWrap: 'wrap',
});

export const energyCore = style({
  display: 'grid',
  placeItems: 'center',
  width: '7.25rem',
  aspectRatio: '1',
  borderRadius: '50%',
  color: sceneVars.color.textStrong,
  border: '2px solid rgba(208, 188, 255, 0.72)',
  background:
    'radial-gradient(circle, rgba(208, 188, 255, 0.28) 0%, rgba(139, 92, 246, 0.6) 42%, rgba(10, 10, 11, 0.92) 72%)',
  boxShadow:
    '0 0 0 2.2rem rgba(139, 92, 246, 0.16), 0 0 62px rgba(139, 92, 246, 0.62), inset 0 0 30px rgba(208, 188, 255, 0.28)',
});

globalStyle(`${energyCore} strong`, {
  fontSize: '2.45rem',
  lineHeight: 1,
});

globalStyle(`${energyCore} span`, {
  marginTop: '-1.4rem',
  color: sceneVars.color.textMuted,
  fontSize: '0.58rem',
  fontWeight: 900,
  letterSpacing: '0.16em',
});

export const pile = style({
  display: 'grid',
  placeItems: 'center',
  width: '4.5rem',
  height: '6.15rem',
  padding: '0.4rem',
  borderRadius: '10px',
  border: '1px solid rgba(208, 188, 255, 0.24)',
  color: sceneVars.color.textMuted,
  background:
    'linear-gradient(145deg, rgba(32, 31, 32, 0.92), rgba(10, 10, 11, 0.88))',
  boxShadow: '0 14px 28px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
});

export const pileMuted = style({
  opacity: 0.76,
  transform: 'rotate(4deg)',
});

globalStyle(`${pile} small`, {
  color: sceneVars.color.textSubtle,
  fontSize: '0.54rem',
  fontWeight: 900,
  letterSpacing: '0.12em',
});

globalStyle(`${pile} strong`, {
  color: sceneVars.color.textStrong,
  fontSize: '1.18rem',
});

export const turnCluster = style({
  display: 'flex',
  justifyContent: 'center',
  gap: '0.5rem',
  color: sceneVars.color.textMuted,
  fontSize: '0.78rem',
});

globalStyle(`${turnCluster} span`, {
  padding: '0.34rem 0.58rem',
  borderRadius: '999px',
  border: '1px solid rgba(208, 188, 255, 0.18)',
  background: 'rgba(208, 188, 255, 0.08)',
});

const commandButton = style({
  justifySelf: 'end',
  minHeight: '4.1rem',
  minWidth: '12rem',
  padding: '0 1.6rem',
  borderRadius: '10px',
  fontWeight: 900,
  cursor: 'pointer',
  transition: 'transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease',
  selectors: {
    '&:hover:not(:disabled)': {
      transform: 'translateY(-1px)',
    },
    '&:disabled': {
      opacity: 0.46,
      cursor: 'not-allowed',
    },
  },
  '@media': {
    [mobile]: {
      justifySelf: 'stretch',
    },
  },
});

export const endTurnButton = style([
  commandButton,
  {
    color: '#261a00',
    border: '1px solid rgba(251, 191, 36, 0.68)',
    background: 'linear-gradient(135deg, #c08457, #fbbf24)',
    letterSpacing: '0.16em',
    boxShadow: '0 0 34px rgba(251, 191, 36, 0.32), 0 18px 42px rgba(0, 0, 0, 0.42)',
  },
]);

export const rewardButton = style([
  commandButton,
  {
    color: '#00201c',
    border: '1px solid rgba(45, 212, 191, 0.72)',
    background: 'linear-gradient(135deg, #2dd4bf, #62fae3)',
    boxShadow: '0 0 32px rgba(45, 212, 191, 0.22)',
  },
]);

export const hand = style({
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'center',
  gap: 'clamp(0rem, 0.45vw, 0.45rem)',
  minWidth: 0,
  overflow: 'visible',
  padding: '0 0.2rem 0.65rem',
  perspective: '1000px',
  transform: 'translateY(-4rem)',
});

export const card = style({
  position: 'relative',
  flex: '0 0 clamp(8.3rem, 10.6vw, 10rem)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '0.28rem',
  minHeight: '12.2rem',
  padding: '0.62rem',
  color: sceneVars.color.text,
  textAlign: 'left',
  borderRadius: '14px',
  border: '1px solid rgba(251, 191, 36, 0.28)',
  background:
    'linear-gradient(180deg, rgba(36, 30, 22, 0.96), rgba(10, 10, 11, 0.96))',
  boxShadow:
    '0 16px 34px rgba(0, 0, 0, 0.42), inset 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 0 18px rgba(251, 191, 36, 0.08)',
  cursor: 'pointer',
  transformOrigin: 'bottom center',
  transition: 'transform 180ms cubic-bezier(0.25, 0.8, 0.25, 1), border-color 140ms ease, box-shadow 140ms ease',
  selectors: {
    '&:hover:not(:disabled)': {
      transform: 'translateY(-2.5rem) scale(1.08) rotate(0deg) !important',
      borderColor: 'rgba(251, 191, 36, 0.68)',
      boxShadow: '0 20px 42px rgba(0, 0, 0, 0.44), 0 0 34px rgba(251, 191, 36, 0.15)',
      zIndex: '80 !important',
    },
    '&[data-dragging="true"]': {
      opacity: 0.66,
    },
  },
});

export const cardTone = styleVariants({
  guard: {
    background: 'linear-gradient(180deg, rgba(106, 157, 212, 0.38), rgba(10, 10, 11, 0.96) 54%)',
  },
  burst: {
    background: 'linear-gradient(180deg, rgba(212, 132, 106, 0.42), rgba(10, 10, 11, 0.96) 54%)',
  },
  mixed: {
    background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.44), rgba(10, 10, 11, 0.96) 54%)',
  },
  neutral: {
    background: 'linear-gradient(180deg, rgba(149, 142, 160, 0.24), rgba(10, 10, 11, 0.94) 58%)',
  },
});

export const cardSelected = style({
  transform: 'translateY(-2.3rem) scale(1.06) rotate(0deg) !important',
  borderColor: '#fbbf24',
  boxShadow: '0 0 0 1px rgba(251, 191, 36, 0.32), 0 0 42px rgba(251, 191, 36, 0.22)',
});

export const cardDisabled = style({
  opacity: 0.5,
  cursor: 'not-allowed',
});

export const cardCost = style({
  position: 'absolute',
  right: '0.5rem',
  top: '0.48rem',
  display: 'grid',
  placeItems: 'center',
  width: '2rem',
  aspectRatio: '1',
  borderRadius: '50%',
  color: '#3c0091',
  fontWeight: 900,
  background: 'linear-gradient(135deg, #e9ddff, #d0bcff)',
  boxShadow: '0 0 22px rgba(208, 188, 255, 0.28)',
});

export const cardHead = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  paddingRight: '2.2rem',
  minHeight: '2.15rem',
});

globalStyle(`${cardHead} strong`, {
  color: sceneVars.color.textStrong,
  fontFamily: '"Libre Caslon Text", Georgia, serif',
  fontSize: '1rem',
  lineHeight: 1.15,
});

globalStyle(`${cardHead} span`, {
  color: sceneVars.color.textSubtle,
  fontSize: '0.62rem',
  fontWeight: 800,
});

export const cardFocus = style({
  position: 'relative',
  zIndex: 1,
  display: 'inline-flex',
  alignItems: 'baseline',
  gap: '0.4rem',
  width: 'fit-content',
  padding: '0.26rem 0.5rem',
  borderRadius: sceneVars.radii.pill,
  border: '1px solid currentColor',
});

export const cardArt = style({
  position: 'relative',
  display: 'grid',
  placeItems: 'center',
  minHeight: '4.8rem',
  overflow: 'hidden',
  borderRadius: '9px',
  border: '1px solid rgba(251, 191, 36, 0.2)',
  background:
    'radial-gradient(circle, rgba(251, 191, 36, 0.12), transparent 34%), radial-gradient(circle at 48% 54%, rgba(208, 188, 255, 0.2), transparent 44%), rgba(10, 10, 11, 0.38)',
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: '0.6rem',
      border: '1px solid rgba(208, 188, 255, 0.16)',
      transform: 'rotate(45deg)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: '0.4rem',
      opacity: 0.86,
      filter: 'blur(0.2px)',
    },
  },
});

export const cardArtTone = styleVariants({
  attack: {
    background:
      'radial-gradient(circle at 52% 70%, rgba(255, 180, 171, 0.22), transparent 32%), linear-gradient(150deg, rgba(8, 20, 28, 0.96), rgba(10, 10, 11, 0.92))',
    selectors: {
      '&::after': {
        background:
          'linear-gradient(120deg, transparent 0 32%, rgba(98, 250, 227, 0.88) 34% 39%, transparent 42% 100%), linear-gradient(134deg, transparent 0 46%, rgba(255, 180, 171, 0.68) 48% 51%, transparent 54% 100%)',
        clipPath: 'polygon(18% 100%, 38% 46%, 30% 46%, 62% 0, 52% 41%, 68% 40%, 32% 100%)',
      },
    },
  },
  block: {
    background:
      'radial-gradient(circle at 50% 48%, rgba(251, 191, 36, 0.22), transparent 38%), linear-gradient(160deg, rgba(21, 28, 33, 0.96), rgba(10, 10, 11, 0.92))',
    selectors: {
      '&::after': {
        background:
          'radial-gradient(circle at 50% 35%, rgba(255, 235, 176, 0.7), transparent 24%), linear-gradient(180deg, rgba(208, 188, 255, 0.36), rgba(251, 191, 36, 0.26))',
        clipPath: 'polygon(50% 4%, 78% 18%, 70% 72%, 50% 96%, 30% 72%, 22% 18%)',
      },
    },
  },
  utility: {
    background:
      'radial-gradient(circle at 50% 50%, rgba(45, 212, 191, 0.26), transparent 40%), linear-gradient(150deg, rgba(18, 13, 32, 0.98), rgba(10, 10, 11, 0.92))',
    selectors: {
      '&::after': {
        border: '0.5rem solid rgba(62, 250, 227, 0.64)',
        borderLeftColor: 'transparent',
        borderBottomColor: 'rgba(208, 188, 255, 0.62)',
        borderRadius: '50%',
        transform: 'rotate(-28deg)',
        boxShadow: '0 0 24px rgba(45, 212, 191, 0.38)',
      },
    },
  },
});

globalStyle(`${cardFocus} strong`, {
  fontSize: '1.28rem',
});

globalStyle(`${cardFocus} span`, {
  fontSize: '0.62rem',
  fontWeight: 800,
});

export const cardFocusTone = styleVariants({
  attack: { color: '#ffb4ab' },
  block: { color: '#3cddc7' },
  utility: { color: '#d0bcff' },
});

export const cardDesc = style({
  flex: 1,
  color: sceneVars.color.textMuted,
  fontSize: '0.72rem',
  lineHeight: 1.35,
  padding: '0.42rem',
  borderRadius: '8px',
  background: 'rgba(10, 10, 11, 0.34)',
});

export const cardFoot = style({
  color: sceneVars.color.textSubtle,
  fontSize: '0.62rem',
  fontWeight: 800,
});
