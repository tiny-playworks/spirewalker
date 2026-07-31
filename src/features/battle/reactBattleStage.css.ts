import { globalStyle, keyframes, style, styleVariants } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';

const mobile = '(max-width: 900px) and (orientation: landscape)';

const hitFlash = keyframes({
  '0%': { filter: 'brightness(1)' },
  '35%': { filter: 'brightness(1.85) saturate(.7)', transform: 'translateX(-4px)' },
  '68%': { transform: 'translateX(3px)' },
  '100%': { filter: 'brightness(1)', transform: 'translateX(0)' },
});

const guardPulse = keyframes({
  '0%': { boxShadow: '0 0 0 rgba(45,212,191,0)' },
  '45%': { boxShadow: '0 0 32px rgba(45,212,191,.42)' },
  '100%': { boxShadow: '0 0 0 rgba(45,212,191,0)' },
});

export const root = style({
  position: 'relative',
  isolation: 'isolate',
  display: 'grid',
  gridTemplateRows: 'minmax(0, 1fr) minmax(13.8rem, 31%)',
  gap: 0,
  minHeight: 0,
  height: '100%',
  padding: 0,
  overflow: 'hidden',
  color: sceneVars.color.text,
  '@media': {
    [mobile]: {
      minHeight: 0,
      padding: 0,
      gridTemplateRows: 'minmax(0, 1fr) 8.35rem',
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

export const backdropAct2 = style({
  background:
    'radial-gradient(circle at 50% 16%, rgba(139, 92, 246, 0.3), transparent 23rem), radial-gradient(circle at 78% 62%, rgba(216, 194, 255, 0.11), transparent 20rem), linear-gradient(180deg, #0b0911 0%, #16111e 52%, #0d0b13 100%)',
});

export const backdropImage = style({
  position: 'absolute',
  inset: 0,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  opacity: 0.72,
  mixBlendMode: 'normal',
  filter: 'brightness(0.5) saturate(1.08)',
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
  alignItems: 'center',
  justifyItems: 'center',
  gap: 'clamp(2rem, 11vw, 10rem)',
  minHeight: 0,
  padding: 'clamp(.75rem, 3vh, 1.5rem) clamp(1rem, 5vw, 5rem) 2rem',
  '@media': {
    [mobile]: {
      gridTemplateColumns: 'minmax(0, 0.82fr) minmax(0, 1.18fr)',
      alignItems: 'center',
      alignContent: 'center',
      gap: '.6rem',
      padding: '.15rem max(.5rem, env(safe-area-inset-right, 0px)) .2rem max(.5rem, env(safe-area-inset-left, 0px))',
    },
  },
});

export const combatLayerTargeting = style({
  position: 'relative',
  zIndex: 40,
});

export const enemyRail = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'clamp(1.4rem, 4vw, 3rem)',
  minWidth: 0,
  '@media': {
    [mobile]: {
      width: '100%',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      overflowX: 'auto',
    },
  },
});

export const unit = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 'clamp(8rem, 16vw, 15rem)',
  minWidth: '8rem',
  padding: 0,
  border: 0,
  background: 'transparent',
  boxShadow: 'none',
  '@media': {
    [mobile]: {
      width: '6.8rem',
      minWidth: '6.8rem',
    },
  },
});

export const unitTone = styleVariants({
  player: {
    filter: 'drop-shadow(0 0 20px rgba(106, 157, 212, 0.34))',
  },
  enemy: {
    width: 'clamp(9rem, 22vw, 21rem)',
    filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.42))',
    '@media': {
      [mobile]: {
        width: '8.2rem',
        minWidth: '8.2rem',
      },
    },
  },
});

export const unitDead = style({
  opacity: 0.42,
  filter: 'grayscale(0.5)',
});

export const unitHit = style({ animation: `${hitFlash} 190ms ease-out` });
export const unitGuarded = style({ animation: `${guardPulse} 260ms ease-out` });

export const spriteFrame = style({
  position: 'relative',
  width: '100%',
  height: 'clamp(10rem, 25vh, 16rem)',
  overflow: 'visible',
  borderRadius: '42% 42% 24% 24%',
  border: 0,
  background:
    'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.16), transparent 62%), linear-gradient(180deg, rgba(18, 18, 22, 0.72), rgba(8, 8, 10, 0.92))',
  boxShadow: 'inset 0 -44px 36px rgba(0,0,0,.45), 0 24px 48px rgba(0,0,0,.36)',
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      left: '12%',
      right: '12%',
      bottom: '-.4rem',
      height: '1.25rem',
      zIndex: -1,
      borderRadius: '50%',
      background: 'rgba(0,0,0,.72)',
      filter: 'blur(8px)',
    },
  },
  '@media': {
    [mobile]: {
      height: '7rem',
      borderRadius: '40% 40% 18% 18%',
    },
  },
});

export const unitSprite = style({
  position: 'absolute',
  inset: 0,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center bottom',
  backgroundSize: 'contain',
  borderRadius: 'inherit',
  maskImage: 'linear-gradient(to bottom, #000 0 76%, transparent 100%)',
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
  fontFamily: sceneVars.font.display,
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
  transition: `width ${sceneVars.motion.normal} ${sceneVars.motion.ease}`,
});

globalStyle(`${hpTrack} > strong`, {
  position: 'absolute',
  inset: 0,
  display: 'grid',
  placeItems: 'center',
  color: '#fff7f2',
  fontSize: '0.7rem',
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

export const statusChip = style({
  position: 'relative',
  display: 'inline-grid',
  placeItems: 'center',
  width: '1.85rem',
  height: '1.85rem',
  borderRadius: '8px',
  color: sceneVars.color.textMuted,
  background: 'rgba(208, 188, 255, 0.1)',
  border: '1px solid rgba(208, 188, 255, 0.2)',
});

export const statusIcon = style({
  width: '1.45rem',
  height: '1.45rem',
  objectFit: 'contain',
});

export const statusGlyph = style({
  fontStyle: 'normal',
  fontSize: '0.78rem',
  fontWeight: 800,
  color: sceneVars.color.textStrong,
});

export const statusStacks = style({
  position: 'absolute',
  right: '-0.28rem',
  bottom: '-0.32rem',
  minWidth: '1rem',
  height: '1rem',
  padding: '0 0.18rem',
  display: 'grid',
  placeItems: 'center',
  borderRadius: '999px',
  color: '#0a0a0b',
  background: 'linear-gradient(135deg, #e9ddff, #d0bcff)',
  fontSize: '0.68rem',
  fontWeight: 900,
  boxShadow: '0 0 8px rgba(208, 188, 255, 0.4)',
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
  '@media': {
    [mobile]: {
      minWidth: '7.4rem',
      gap: '0.3rem',
    },
  },
});

export const enemyTargetActive = style({
  cursor: 'default',
});

globalStyle(`${enemyTargetActive} ${unit}`, {
  filter:
    'drop-shadow(0 0 22px rgba(251, 191, 36, 0.42)) drop-shadow(0 0 34px rgba(139, 92, 246, 0.24))',
});

export const intent = style({
  alignSelf: 'center',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.34rem 0.7rem',
  borderRadius: sceneVars.radii.md,
  fontSize: '.9rem',
  fontWeight: 800,
  border: '1px solid currentColor',
  background: 'rgba(26, 24, 20, 0.5)',
  backdropFilter: 'blur(16px)',
  boxShadow: '0 0 20px rgba(212, 132, 106, 0.2)',
  '@media': {
    [mobile]: {
      padding: '.2rem .45rem',
      fontSize: '.72rem',
    },
  },
});

export const intentIcon = style({
  width: '1.15rem',
  height: '1.15rem',
  objectFit: 'contain',
});

export const intentTone = styleVariants({
  attack: { color: '#ffb4ab' },
  block: { color: '#3cddc7' },
  utility: { color: '#d0bcff' },
});

export const intentDetails = style({
  position: 'relative',
  zIndex: 24,
  alignSelf: 'center',
});

globalStyle(`${intentDetails} summary`, { listStyle: 'none', cursor: 'help' });
globalStyle(`${intentDetails} summary::-webkit-details-marker`, { display: 'none' });

export const intentCopy = style({ display: 'grid', gap: '.02rem', minWidth: '2rem' });
globalStyle(`${intentCopy} small`, {
  fontSize: '.7rem',
  fontWeight: 900,
  letterSpacing: '.08em',
  opacity: .72,
});
globalStyle(`${intentCopy} strong`, { fontSize: '.95rem', lineHeight: 1 });

export const intentPopover = style({
  position: 'absolute',
  left: '50%',
  top: 'calc(100% + .4rem)',
  zIndex: 60,
  transform: 'translateX(-50%)',
  width: 'max-content',
  maxWidth: '15rem',
  padding: '.48rem .62rem',
  borderRadius: sceneVars.radii.sm,
  border: `1px solid ${sceneVars.color.border}`,
  color: sceneVars.color.textStrong,
  background: 'rgba(8,8,10,.96)',
  boxShadow: sceneVars.shadow.panel,
  fontSize: '.7rem',
  lineHeight: 1.4,
});

export const activeCounter = style({
  alignSelf: 'center',
  padding: '.22rem .5rem',
  border: '1px solid rgba(255, 180, 171, .48)',
  borderRadius: sceneVars.radii.sm,
  color: '#ffb4ab',
  background: 'rgba(72, 24, 28, .72)',
  fontSize: '.7rem',
  fontWeight: 800,
  letterSpacing: '.02em',
  '@media': {
    [mobile]: {
      padding: '.15rem .36rem',
      fontSize: '.7rem',
    },
  },
});

export const mechanicList = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '.28rem',
  maxWidth: '15rem',
  '@media': {
    [mobile]: { maxWidth: '8.6rem', gap: '.16rem' },
  },
});

export const mechanicBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '1.35rem',
  padding: '.16rem .42rem',
  borderRadius: sceneVars.radii.pill,
  fontSize: '.66rem',
  fontWeight: 900,
  letterSpacing: '.02em',
  whiteSpace: 'nowrap',
});

export const mechanicTone = styleVariants({
  danger: {
    color: '#ffe2df',
    border: '1px solid rgba(255, 132, 120, .58)',
    background: 'rgba(92, 26, 32, .78)',
  },
  warning: {
    color: '#fff0c7',
    border: '1px solid rgba(251, 191, 36, .55)',
    background: 'rgba(76, 50, 12, .76)',
  },
  control: {
    color: '#e7ddff',
    border: '1px solid rgba(181, 147, 255, .55)',
    background: 'rgba(48, 28, 86, .76)',
  },
});

export const enemyHitTarget = style({
  position: 'relative',
  display: 'grid',
  justifyItems: 'center',
  padding: 0,
  border: 0,
  color: 'inherit',
  background: 'transparent',
  selectors: {
    '&:disabled': { cursor: 'default' },
    '&:not(:disabled)': { cursor: 'crosshair' },
  },
});

export const targetPreview = style({
  position: 'absolute',
  left: '50%',
  bottom: '-2.2rem',
  zIndex: 40,
  transform: 'translateX(-50%)',
  width: 'max-content',
  maxWidth: '13rem',
  padding: '.34rem .58rem',
  borderRadius: sceneVars.radii.pill,
  border: '1px solid rgba(251,191,36,.58)',
  color: '#fff1c7',
  background: 'rgba(20,14,7,.94)',
  boxShadow: '0 0 28px rgba(251,191,36,.2)',
  fontSize: '.7rem',
  fontWeight: 900,
  '@media': { [mobile]: { bottom: '-1.65rem', fontSize: '.7rem', padding: '.2rem .38rem' } },
});

globalStyle(`${targetPreview} em`, {
  display: 'block',
  marginTop: '.12rem',
  color: '#ffb4ab',
  fontStyle: 'normal',
  fontSize: '.64rem',
});

export const bottomDock = style({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: 'minmax(8rem, 0.3fr) minmax(0, 1fr) minmax(9rem, 0.32fr)',
  gridTemplateRows: 'minmax(0, 1fr)',
  alignItems: 'end',
  gap: '0.8rem',
  minHeight: 0,
  padding: '0 0.75rem 0.15rem',
  background:
    'linear-gradient(180deg, transparent 0%, rgba(10, 10, 11, 0.54) 22%, rgba(10, 10, 11, 0.9) 100%)',
  '@media': {
    [mobile]: {
      gridTemplateColumns: '3.7rem minmax(0, 1fr) 6.8rem',
      alignItems: 'end',
      gap: '0.35rem',
      padding: '0 max(.2rem, env(safe-area-inset-right, 0px)) max(.15rem, env(safe-area-inset-bottom, 0px)) max(.2rem, env(safe-area-inset-left, 0px))',
    },
  },
});

export const leftDock = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'end',
  gap: '0.45rem',
  minWidth: '14rem',
  '@media': {
    [mobile]: {
      minWidth: 0,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '.12rem',
    },
  },
});

export const rightDock = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'flex-end',
  gap: '0.9rem',
  flexWrap: 'wrap',
  '@media': {
    [mobile]: {
      alignItems: 'stretch',
      justifyContent: 'flex-end',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      gap: '.18rem',
      minWidth: 0,
    },
  },
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
  '@media': {
    [mobile]: {
      width: '3.35rem',
      boxShadow: '0 0 0 0.8rem rgba(139, 92, 246, 0.12), 0 0 28px rgba(139, 92, 246, 0.42), inset 0 0 18px rgba(208, 188, 255, 0.24)',
    },
  },
});

globalStyle(`${energyCore} strong`, {
  fontSize: '2.45rem',
  lineHeight: 1,
  '@media': {
    [mobile]: {
      fontSize: '1.5rem',
    },
  },
});

globalStyle(`${energyCore} span`, {
  marginTop: '-1.4rem',
  color: sceneVars.color.textMuted,
  fontSize: '0.58rem',
  fontWeight: 900,
  letterSpacing: '0.16em',
  '@media': {
    [mobile]: {
      marginTop: '-0.8rem',
      fontSize: '0.68rem',
    },
  },
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
  '@media': {
    [mobile]: {
      width: '3.35rem',
      height: '4.25rem',
      padding: '0.25rem',
    },
  },
});

export const pileMuted = style({
  opacity: 0.76,
  transform: 'rotate(4deg)',
  '@media': {
    [mobile]: { display: 'none' },
  },
});

globalStyle(`${pile} small`, {
  color: sceneVars.color.textSubtle,
  fontSize: '0.68rem',
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
      minHeight: '3.1rem',
      width: '100%',
      minWidth: 0,
      padding: '0 0.45rem',
      fontSize: '0.7rem',
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
  transform: 'translateY(-2.2rem)',
  '@media': {
    [mobile]: {
      justifyContent: 'flex-start',
      gap: '0.35rem',
      overflowX: 'auto',
      overflowY: 'visible',
      padding: '0 0.1rem 0.2rem',
      transform: 'none',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'thin',
    },
  },
});

export const card = style({
  position: 'relative',
  flex: '0 0 clamp(8.6rem, 11.6vw, 9.4rem)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '0.28rem',
  minHeight: '13rem',
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
  '@media': {
    [mobile]: {
      flexBasis: '5.5rem',
      height: '7.65rem',
      minHeight: 0,
      maxHeight: '7.65rem',
      padding: '.3rem',
      gap: '.1rem',
      overflow: 'hidden',
      transform: 'none !important',
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
  '@media': {
    [mobile]: {
      flexBasis: '7.35rem',
      height: '9rem',
      maxHeight: '9rem',
      transform: 'translateY(-0.8rem) scale(1.02) rotate(0deg) !important',
    },
  },
});

export const cardDisabled = style({
  opacity: 0.5,
  cursor: 'not-allowed',
});

export const cardLocked = style({
  borderColor: 'rgba(255, 132, 120, .72)',
  boxShadow: '0 0 0 1px rgba(255, 132, 120, .18), 0 14px 32px rgba(0, 0, 0, .42)',
});

export const cardLock = style({
  position: 'absolute',
  left: '.45rem',
  top: '.45rem',
  padding: '.16rem .34rem',
  borderRadius: sceneVars.radii.pill,
  color: '#ffe2df',
  background: 'rgba(92, 26, 32, .9)',
  border: '1px solid rgba(255, 132, 120, .58)',
  fontSize: '.6rem',
  fontWeight: 900,
  zIndex: 2,
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
  '@media': { [mobile]: { top: '.24rem', right: '.24rem', width: '1.5rem', fontSize: '.7rem' } },
});

export const cardHead = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  paddingRight: '2.2rem',
  minHeight: '2.15rem',
  '@media': { [mobile]: { gap: '.05rem', minHeight: '1.35rem', paddingRight: '1.55rem' } },
});

globalStyle(`${cardHead} strong`, {
  color: sceneVars.color.textStrong,
  fontFamily: sceneVars.font.display,
  fontSize: '1rem',
  lineHeight: 1.15,
  '@media': { [mobile]: { fontSize: '.76rem', lineHeight: 1.05 } },
});

globalStyle(`${cardHead} span`, {
  color: sceneVars.color.textSubtle,
  fontSize: '0.7rem',
  fontWeight: 800,
  '@media': { [mobile]: { fontSize: '.68rem' } },
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
  '@media': { [mobile]: { minHeight: '3.2rem', borderRadius: '6px' } },
});

export const cardArtImg = style({
  position: 'absolute',
  inset: 0,
  zIndex: 4,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '8px',
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
  fontSize: '0.7rem',
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
  '@media': {
    [mobile]: {
      display: 'none',
      padding: '.2rem',
      overflow: 'hidden',
      fontSize: '.7rem',
      lineHeight: 1.3,
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 2,
    },
  },
});

export const cardFoot = style({
  color: sceneVars.color.textSubtle,
  fontSize: '0.7rem',
  fontWeight: 800,
  '@media': { [mobile]: { display: 'none', fontSize: '.68rem' } },
});

globalStyle(`${cardSelected} ${cardDesc}`, {
  '@media': {
    [mobile]: {
      display: '-webkit-box',
    },
  },
});

globalStyle(`${cardSelected} ${cardFoot}`, {
  '@media': {
    [mobile]: {
      display: 'block',
    },
  },
});

const cuePop = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, 0.65rem) scale(0.72)' },
  '22%': { opacity: 1, transform: 'translate(-50%, -0.2rem) scale(1.12)' },
  '72%': { opacity: 1, transform: 'translate(-50%, -1.15rem) scale(1)' },
  '100%': { opacity: 0, transform: 'translate(-50%, -2rem) scale(0.94)' },
});

export const feedbackLayer = style({
  position: 'absolute',
  inset: 0,
  zIndex: 12,
  pointerEvents: 'none',
});

export const feedbackCue = style({
  position: 'absolute',
  left: '50%',
  top: '34%',
  padding: '0.25rem 0.55rem',
  borderRadius: '999px',
  fontSize: 'clamp(0.9rem, 2vw, 1.35rem)',
  fontWeight: 900,
  letterSpacing: '0.04em',
  textShadow: '0 2px 12px rgba(0, 0, 0, 0.9)',
  opacity: 0,
  animation: `${cuePop} 520ms ease-out both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animationDuration: '1ms' },
  },
});

export const feedbackCueTone = styleVariants({
  damage: { color: '#fff4ef', background: 'rgba(185, 70, 52, 0.78)', border: '1px solid #ffb4ab' },
  block: { color: '#eafffb', background: 'rgba(20, 117, 112, 0.78)', border: '1px solid #3cddc7' },
  status: { color: '#f6efff', background: 'rgba(91, 55, 146, 0.8)', border: '1px solid #d0bcff' },
  momentum: { color: '#eafffb', background: 'rgba(10, 94, 92, .88)', border: '1px solid #62fae3', boxShadow: '0 0 22px rgba(45,212,191,.32)' },
  defeat: { color: '#fff1c7', background: 'rgba(122, 78, 12, 0.85)', border: '1px solid #fbbf24' },
});

export const targetGuide = style({
  position: 'absolute',
  right: 0,
  bottom: 'calc(100% + 0.45rem)',
  zIndex: 80,
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  padding: '0.48rem 0.7rem',
  maxWidth: 'min(22rem, calc(100vw - 2rem))',
  whiteSpace: 'normal',
  borderRadius: sceneVars.radii.pill,
  color: sceneVars.color.textStrong,
  border: '1px solid rgba(251, 191, 36, 0.45)',
  background: 'rgba(10, 10, 11, 0.9)',
  boxShadow: '0 12px 34px rgba(0, 0, 0, 0.45)',
  '@media': {
    [mobile]: {
      bottom: 'calc(100% + 6.2rem)',
      minWidth: '12rem',
      maxWidth: 'min(15rem, calc(100vw - 1rem))',
      whiteSpace: 'nowrap',
      fontSize: '0.72rem',
      gap: '0.35rem',
      padding: '.35rem .45rem',
    },
  },
});

globalStyle(`${targetGuide} > span`, { color: '#fbbf24', fontWeight: 900 });
globalStyle(`${targetGuide} > strong`, { fontSize: '0.78rem' });
globalStyle(`${targetGuide} > button`, {
  minHeight: '2rem',
  padding: '0.25rem 0.6rem',
  borderRadius: '999px',
  color: sceneVars.color.text,
  border: '1px solid rgba(208, 188, 255, 0.3)',
  background: 'rgba(208, 188, 255, 0.1)',
});
