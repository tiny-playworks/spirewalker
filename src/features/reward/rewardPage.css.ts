import { globalStyle, keyframes, style, styleVariants } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';

const SERIF = '"Libre Caslon Text", Georgia, serif';

const pulseGlow = keyframes({
  '0%, 100%': { opacity: 0.65, transform: 'scale(1)' },
  '50%': { opacity: 1, transform: 'scale(1.06)' },
});

const shimmer = keyframes({
  to: { backgroundPosition: '200% center' },
});

const cardEnter = keyframes({
  from: { opacity: 0, transform: 'translateY(18px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
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
    'radial-gradient(ellipse 70% 60% at 50% 18%, rgba(160, 120, 255, 0.12) 0%, transparent 60%), linear-gradient(180deg, #0d0d0e 0%, #131314 50%, #0d0d0e 100%)',
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      opacity: 0.05,
      backgroundImage:
        'linear-gradient(rgba(203, 195, 215, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(203, 195, 215, 0.5) 1px, transparent 1px)',
      backgroundSize: '40px 40px',
    },
  },
});

globalStyle(`${page} > *`, { position: 'relative', zIndex: 1 });

export const topBar = style({
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
  fontSize: '1.1rem',
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

export const topGold = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.3rem 0.7rem',
  fontSize: '0.86rem',
  fontWeight: 800,
  borderRadius: '999px',
  border: '1px solid rgba(255, 198, 64, 0.4)',
  color: '#ffc640',
});

export const topGoldIcon = style({ width: '0.95rem', height: '0.95rem', color: '#ffc640' });

export const header = style({
  position: 'relative',
  textAlign: 'center',
  margin: '1.4rem 0 0.4rem',
});

export const headerHalo = style({
  position: 'absolute',
  inset: '-30% 30% auto 30%',
  height: '8rem',
  borderRadius: '999px',
  background: 'rgba(255, 198, 64, 0.18)',
  filter: 'blur(48px)',
  animation: `${pulseGlow} 3.4s ease-in-out infinite`,
  pointerEvents: 'none',
});

export const title = style({
  position: 'relative',
  margin: 0,
  fontFamily: SERIF,
  fontSize: 'clamp(2.6rem, 6vw, 3.8rem)',
  fontWeight: 700,
  letterSpacing: '0.18em',
  background: 'linear-gradient(90deg, #ffc640, #fff6df, #ffc640)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  animation: `${shimmer} 4s linear infinite`,
});

export const subtitle = style({
  margin: '0.4rem 0 0',
  fontSize: '0.78rem',
  fontWeight: 700,
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: 'rgba(255, 198, 64, 0.8)',
});

export const main = style({
  flex: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'clamp(1.5rem, 4vw, 3rem)',
  padding: '1rem clamp(1rem, 4vw, 3rem) 0',
});

export const logPanel = style({
  width: '15rem',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.7rem',
  padding: '1.1rem 1.2rem',
  borderRadius: '0.75rem',
  border: '1px solid rgba(73, 68, 84, 0.45)',
  background: 'rgba(28, 27, 28, 0.6)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 18px 50px rgba(0, 0, 0, 0.4)',
});

export const logTitle = style({
  margin: 0,
  paddingBottom: '0.55rem',
  borderBottom: '1px solid rgba(73, 68, 84, 0.5)',
  fontFamily: SERIF,
  fontSize: '1.15rem',
  fontWeight: 700,
  color: sceneVars.color.accentGlow,
});

export const logRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.6rem',
});

export const logKey = style({
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: sceneVars.color.textSubtle,
});

export const logVal = style({
  fontSize: '1.15rem',
  fontWeight: 800,
  letterSpacing: '-0.01em',
  color: sceneVars.color.textStrong,
});

export const logValTone = styleVariants({
  gold: { color: '#ffc640' },
  teal: { color: '#3cddc7' },
  purple: { color: sceneVars.color.accentGlow },
  plain: {},
});

export const center = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.4rem',
});

export const cardRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'stretch',
  gap: '1.1rem',
});

const cardBase = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '15rem',
  minHeight: '23rem',
  borderRadius: '0.75rem',
  overflow: 'hidden',
  cursor: 'pointer',
  background: 'rgba(32, 31, 32, 0.92)',
  border: '1px solid rgba(73, 68, 84, 0.6)',
  backdropFilter: 'blur(14px)',
  animation: `${cardEnter} 360ms ease-out both`,
  transition: 'transform 280ms ease, box-shadow 280ms ease, border-color 200ms ease',
  selectors: {
    '&:hover': {
      transform: 'translateY(-10px) scale(1.02)',
      zIndex: 5,
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
});

export const card = cardBase;

export const cardRarity = styleVariants({
  common: {
    selectors: { '&:hover': { boxShadow: '0 0 28px rgba(208, 188, 255, 0.18)' } },
  },
  uncommon: {
    borderColor: 'rgba(60, 221, 199, 0.5)',
    selectors: { '&:hover': { boxShadow: '0 0 32px rgba(60, 221, 199, 0.3)' } },
  },
  rare: {
    borderColor: 'rgba(160, 120, 255, 0.6)',
    selectors: { '&:hover': { boxShadow: '0 0 36px rgba(160, 120, 255, 0.4)' } },
  },
  legendary: {
    border: '2px solid transparent',
    backgroundImage:
      'linear-gradient(#201f20, #201f20), linear-gradient(135deg, #ffc640, #e3aa00)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    boxShadow: '0 0 38px rgba(255, 198, 64, 0.28)',
    selectors: { '&:hover': { boxShadow: '0 0 52px rgba(255, 198, 64, 0.45)' } },
  },
});

export const cardArt = style({
  position: 'relative',
  height: '52%',
  width: '100%',
  overflow: 'hidden',
});

export const cardArtImg = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  opacity: 0.85,
});

export const cardArtFallback = styleVariants({
  guard: { background: 'radial-gradient(circle at 50% 40%, rgba(106, 157, 212, 0.5), rgba(10, 10, 11, 0.95))' },
  burst: { background: 'radial-gradient(circle at 50% 40%, rgba(212, 132, 106, 0.5), rgba(10, 10, 11, 0.95))' },
  mixed: { background: 'radial-gradient(circle at 50% 40%, rgba(179, 138, 212, 0.5), rgba(10, 10, 11, 0.95))' },
  neutral: { background: 'radial-gradient(circle at 50% 40%, rgba(149, 142, 160, 0.4), rgba(10, 10, 11, 0.95))' },
});

export const cardArtFade = style({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, #201f20 2%, transparent 60%)',
});

export const rarityBadge = style({
  position: 'absolute',
  top: '0.5rem',
  left: '0.5rem',
  padding: '0.18rem 0.45rem',
  fontSize: '0.6rem',
  fontWeight: 800,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  borderRadius: '0.25rem',
  color: '#261a00',
  background: '#ffc640',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
});

export const rarityBadgeRare = style({
  color: '#23005c',
  background: sceneVars.color.accentGlow,
});

export const cardBody = style({
  position: 'relative',
  zIndex: 1,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
  padding: '0.85rem 1rem 1rem',
});

export const cardName = style({
  margin: 0,
  fontFamily: SERIF,
  fontSize: '1.18rem',
  fontWeight: 700,
  color: sceneVars.color.accentGlow,
});

export const cardMeta = style({
  margin: 0,
  fontSize: '0.66rem',
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
});

export const cardMetaTone = styleVariants({
  attack: { color: '#ffb4ab' },
  skill: { color: '#3cddc7' },
  power: { color: sceneVars.color.accentGlow },
});

export const cardDesc = style({
  margin: '0.15rem 0 0',
  fontSize: '0.82rem',
  lineHeight: 1.5,
  color: sceneVars.color.textMuted,
});

export const cardAccent = style({
  marginTop: 'auto',
  height: '3px',
  borderRadius: '999px',
});

export const cardAccentTone = styleVariants({
  attack: { background: 'linear-gradient(90deg, #d4846a, #ffb4ab)' },
  skill: { background: 'linear-gradient(90deg, #00a392, #3cddc7)' },
  power: { background: 'linear-gradient(90deg, #a078ff, #d0bcff)' },
  legendary: { background: 'linear-gradient(90deg, #ffc640, #e3aa00, #5a4100)' },
});

export const pills = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.45rem 1.2rem',
  borderRadius: '999px',
  border: '1px solid rgba(73, 68, 84, 0.4)',
  background: 'rgba(14, 14, 15, 0.5)',
  backdropFilter: 'blur(10px)',
  flexWrap: 'wrap',
  justifyContent: 'center',
});

export const pill = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
  padding: '0.3rem 0.6rem',
});

export const pillIcon = style({ width: '1.2rem', height: '1.2rem' });

export const pillGoldText = style({
  fontSize: '1.1rem',
  fontWeight: 800,
  color: '#ffc640',
});

export const pillRelicKey = style({
  fontSize: '0.62rem',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: sceneVars.color.textSubtle,
});

export const pillRelicVal = style({
  fontFamily: SERIF,
  fontSize: '0.95rem',
  color: sceneVars.color.accentGlow,
  lineHeight: 1.1,
});

export const pillDivider = style({
  width: '1px',
  alignSelf: 'stretch',
  background: 'rgba(73, 68, 84, 0.5)',
});

export const footer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.7rem',
  padding: '1.5rem 1rem 2rem',
});

export const skipButton = style({
  position: 'relative',
  overflow: 'hidden',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.7rem 1.6rem',
  borderRadius: '0.5rem',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.78rem',
  fontWeight: 800,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: '#5a4100',
  background: 'linear-gradient(135deg, #ffc640 0%, #e3aa00 55%, #5a4100 130%)',
  boxShadow: '0 0 22px rgba(255, 198, 64, 0.32)',
  transition: 'transform 200ms ease, box-shadow 200ms ease',
  selectors: {
    '&:hover': {
      transform: 'scale(1.04)',
      boxShadow: '0 0 32px rgba(255, 198, 64, 0.55)',
    },
  },
});

export const ghostButton = style({
  padding: '0.5rem 1.1rem',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: sceneVars.color.textMuted,
  background: 'transparent',
  border: '1px solid rgba(73, 68, 84, 0.6)',
  transition: 'border-color 160ms ease, color 160ms ease',
  selectors: {
    '&:hover': { borderColor: sceneVars.color.accentGlow, color: sceneVars.color.textStrong },
  },
});

export const upgradePanel = style({
  width: 'min(34rem, calc(100vw - 2rem))',
  marginTop: '0.4rem',
  padding: '0.9rem 1rem',
  borderRadius: '0.75rem',
  border: '1px solid rgba(73, 68, 84, 0.5)',
  background: 'rgba(20, 20, 22, 0.7)',
});

export const upgradeHint = style({
  margin: '0 0 0.6rem',
  fontSize: '0.8rem',
  lineHeight: 1.5,
  color: sceneVars.color.textSubtle,
});
