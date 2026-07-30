import { keyframes, style, styleVariants } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';

const SERIF = sceneVars.font.display;
const mobileLandscape = '(max-width: 900px) and (orientation: landscape)';

const titleGlow = keyframes({
  '0%, 100%': { textShadow: '0 0 18px rgba(160, 120, 255, 0.35)' },
  '50%': { textShadow: '0 0 30px rgba(160, 120, 255, 0.55)' },
});

const artPulse = keyframes({
  '0%, 100%': { opacity: 0.75, transform: 'scale(1)' },
  '50%': { opacity: 1, transform: 'scale(1.04)' },
});

const rowEnter = keyframes({
  from: { opacity: 0, transform: 'translateX(14px)' },
  to: { opacity: 1, transform: 'translateX(0)' },
});

export const page = style({
  position: 'relative',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  overflowY: 'auto',
  textAlign: 'left',
  background:
    'radial-gradient(ellipse 60% 50% at 32% 45%, rgba(160, 120, 255, 0.1) 0%, transparent 60%), linear-gradient(180deg, #0d0d0e 0%, #131314 60%, #0d0d0e 100%)',
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      opacity: 0.045,
      backgroundImage:
        'linear-gradient(rgba(203, 195, 215, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(203, 195, 215, 0.5) 1px, transparent 1px)',
      backgroundSize: '40px 40px',
    },
  },
});

export const topBar = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  padding: '0.7rem clamp(1rem, 3vw, 2.5rem)',
  borderBottom: '1px solid rgba(73, 68, 84, 0.4)',
});

export const brandMark = style({
  margin: 0,
  fontFamily: SERIF,
  fontSize: '1.05rem',
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: sceneVars.color.accentGlow,
  textShadow: '0 0 10px rgba(208, 188, 255, 0.45)',
});

export const topMeta = style({
  fontSize: '0.82rem',
  letterSpacing: '0.04em',
  color: sceneVars.color.textSubtle,
});

export const topStats = style({ display: 'flex', alignItems: 'center', gap: '0.6rem' });

export const statPill = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  padding: '0.28rem 0.65rem',
  fontSize: '0.84rem',
  fontWeight: 700,
  borderRadius: '999px',
  border: '1px solid rgba(73, 68, 84, 0.5)',
});

export const statPillHp = style({ color: '#ffb4ab' });
export const statPillGold = style({ color: '#ffc640', borderColor: 'rgba(255, 198, 64, 0.4)' });
export const statIcon = style({ width: '0.9rem', height: '0.9rem' });

export const body = style({
  position: 'relative',
  zIndex: 1,
  flex: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'clamp(1.5rem, 4vw, 3.5rem)',
  width: '100%',
  maxWidth: '70rem',
  margin: '0 auto',
  padding: 'clamp(1.5rem, 5vh, 3.5rem) clamp(1rem, 4vw, 2.5rem)',
  minHeight: 0,
  '@media': {
    [mobileLandscape]: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, .95fr)',
      alignItems: 'stretch',
      justifyContent: 'stretch',
      gap: '.7rem',
      padding: '.45rem max(.65rem, env(safe-area-inset-right, 0px)) max(.45rem, env(safe-area-inset-bottom, 0px)) max(.65rem, env(safe-area-inset-left, 0px))',
      overflow: 'hidden',
    },
  },
});

export const leftCol = style({
  flex: '1 1 22rem',
  maxWidth: '34rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  minHeight: 0,
  '@media': { [mobileLandscape]: { maxWidth: 'none', gap: '.38rem' } },
});

export const badge = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  alignSelf: 'flex-start',
  padding: '0.25rem 0.7rem',
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
  borderRadius: '0.35rem',
  color: sceneVars.color.accentGlow,
  background: 'rgba(160, 120, 255, 0.16)',
  border: '1px solid rgba(160, 120, 255, 0.35)',
  '@media': { [mobileLandscape]: { padding: '.16rem .45rem', fontSize: '.7rem', letterSpacing: '.08em' } },
});

export const badgeIcon = style({ width: '0.85rem', height: '0.85rem' });

export const title = style({
  margin: 0,
  fontFamily: SERIF,
  fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
  fontWeight: 700,
  letterSpacing: '0.06em',
  lineHeight: 1.05,
  color: sceneVars.color.textStrong,
  animation: `${titleGlow} 4s ease-in-out infinite`,
  '@media': { [mobileLandscape]: { fontSize: '1.35rem' } },
});

export const artPanel = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 9',
  borderRadius: '0.85rem',
  overflow: 'hidden',
  border: '1px solid rgba(73, 68, 84, 0.5)',
  background:
    'radial-gradient(circle at 50% 78%, rgba(160, 120, 255, 0.45) 0%, rgba(60, 221, 199, 0.12) 35%, rgba(10, 10, 12, 0.95) 70%)',
  boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.6)',
  '@media': { [mobileLandscape]: { flex: 1, minHeight: 0, aspectRatio: 'auto' } },
});

export const artGlow = style({
  position: 'absolute',
  left: '50%',
  bottom: '18%',
  width: '40%',
  height: '55%',
  transform: 'translateX(-50%)',
  borderRadius: '999px 999px 40% 40%',
  background: 'radial-gradient(circle at 50% 100%, rgba(208, 188, 255, 0.44) 0%, rgba(160, 120, 255, 0.18) 40%, transparent 72%)',
  filter: 'blur(6px)',
  animation: `${artPulse} 3.6s ease-in-out infinite`,
});

export const artShards = style({
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'linear-gradient(160deg, transparent 46%, rgba(60, 221, 199, 0.35) 47%, transparent 49%), linear-gradient(20deg, transparent 52%, rgba(160, 120, 255, 0.3) 53%, transparent 55%)',
  mixBlendMode: 'screen',
  opacity: 0.7,
});

export const rightCol = style({
  flex: '1 1 22rem',
  maxWidth: '30rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  minHeight: 0,
  '@media': {
    [mobileLandscape]: {
      maxWidth: 'none',
      gap: '.4rem',
      overflowY: 'auto',
      overscrollBehavior: 'contain',
    },
  },
});

export const story = style({
  padding: '1rem 1.1rem',
  borderLeft: `3px solid ${sceneVars.color.accent}`,
  borderRadius: '0.5rem',
  background: 'rgba(28, 27, 28, 0.55)',
  backdropFilter: 'blur(10px)',
  fontSize: '0.92rem',
  lineHeight: 1.65,
  color: sceneVars.color.textMuted,
  '@media': { [mobileLandscape]: { padding: '.55rem .65rem', fontSize: '.7rem', lineHeight: 1.42 } },
});

export const optionList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.7rem',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  '@media': { [mobileLandscape]: { gap: '.38rem' } },
});

export const option = style({
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.85rem',
  width: '100%',
  textAlign: 'left',
  padding: '0.85rem 1rem',
  borderRadius: '0.6rem',
  cursor: 'pointer',
  background: 'rgba(20, 20, 22, 0.7)',
  border: '1px solid rgba(73, 68, 84, 0.45)',
  borderLeftWidth: '3px',
  animation: `${rowEnter} 320ms ease-out both`,
  transition: 'transform 180ms ease, background 180ms ease, border-color 180ms ease',
  selectors: {
    '&:hover:not(:disabled)': {
      transform: 'translateX(4px)',
      background: 'rgba(40, 38, 44, 0.8)',
    },
    '&:disabled': { cursor: 'not-allowed', opacity: 0.45 },
  },
  '@media': { [mobileLandscape]: { gap: '.5rem', padding: '.48rem .58rem' } },
});

export const optionTone = styleVariants({
  sacrifice: { borderLeftColor: '#d4846a' },
  gain: { borderLeftColor: sceneVars.color.accent },
  gold: { borderLeftColor: '#ffc640' },
  heal: { borderLeftColor: '#3cddc7' },
  leave: { borderLeftColor: 'rgba(149, 142, 160, 0.6)' },
});

export const optionIcon = style({
  flexShrink: 0,
  width: '1.6rem',
  height: '1.6rem',
  marginTop: '0.1rem',
  '@media': { [mobileLandscape]: { width: '1.15rem', height: '1.15rem' } },
});

export const optionIconTone = styleVariants({
  sacrifice: { color: '#d4846a' },
  gain: { color: sceneVars.color.accentGlow },
  gold: { color: '#ffc640' },
  heal: { color: '#3cddc7' },
  leave: { color: sceneVars.color.textSubtle },
});

export const optionText = style({ display: 'flex', flexDirection: 'column', gap: '0.2rem' });

export const optionTitle = style({
  margin: 0,
  fontFamily: SERIF,
  fontSize: '1.1rem',
  fontWeight: 700,
  '@media': { [mobileLandscape]: { fontSize: '.76rem' } },
});

export const optionTitleTone = styleVariants({
  sacrifice: { color: '#e89a80' },
  gain: { color: sceneVars.color.accentGlow },
  gold: { color: '#ffc640' },
  heal: { color: '#3cddc7' },
  leave: { color: sceneVars.color.textStrong },
});

export const optionDesc = style({
  margin: 0,
  fontSize: '0.82rem',
  lineHeight: 1.5,
  color: sceneVars.color.textSubtle,
  '@media': { [mobileLandscape]: { fontSize: '.58rem', lineHeight: 1.35 } },
});
