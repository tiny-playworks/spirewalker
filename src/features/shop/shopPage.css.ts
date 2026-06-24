import { keyframes, style, styleVariants } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';

const SERIF = '"Libre Caslon Text", Georgia, serif';

const portraitPulse = keyframes({
  '0%, 100%': { opacity: 0.6 },
  '50%': { opacity: 0.9 },
});

const tileEnter = keyframes({
  from: { opacity: 0, transform: 'translateY(12px)' },
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
    'radial-gradient(ellipse 60% 55% at 50% 35%, rgba(160, 120, 255, 0.1) 0%, transparent 62%), linear-gradient(180deg, #0d0d0e 0%, #131314 55%, #0d0d0e 100%)',
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
  fontSize: '1.1rem',
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: sceneVars.color.accentGlow,
  textShadow: '0 0 10px rgba(208, 188, 255, 0.45)',
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
  alignItems: 'stretch',
  gap: 'clamp(1rem, 2.5vw, 1.75rem)',
  width: '100%',
  maxWidth: '78rem',
  margin: '0 auto',
  padding: 'clamp(1.25rem, 3vh, 2rem) clamp(1rem, 3vw, 2.5rem) 2.5rem',
});

/* ---- merchant ---- */
export const merchant = style({
  flex: '0 0 17rem',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  minHeight: '32rem',
  padding: '1.2rem',
  borderRadius: '0.85rem',
  overflow: 'hidden',
  border: '1px solid rgba(73, 68, 84, 0.5)',
  background:
    'radial-gradient(circle at 50% 32%, rgba(120, 80, 200, 0.42) 0%, rgba(20, 16, 30, 0.9) 48%, #0b0b0e 78%), linear-gradient(180deg, #16121f 0%, #0b0b0e 100%)',
  boxShadow: 'inset 0 0 70px rgba(0, 0, 0, 0.7)',
});

export const merchantRune = style({
  position: 'absolute',
  top: '24%',
  left: '50%',
  transform: 'translateX(-50%)',
  fontFamily: SERIF,
  fontSize: '4rem',
  color: 'rgba(208, 188, 255, 0.55)',
  textShadow: '0 0 28px rgba(160, 120, 255, 0.7)',
  animation: `${portraitPulse} 3.8s ease-in-out infinite`,
  pointerEvents: 'none',
});

export const merchantFade = style({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, #0b0b0e 6%, transparent 55%)',
});

export const merchantInfo = style({ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' });

export const merchantName = style({
  margin: 0,
  fontFamily: SERIF,
  fontSize: '1.35rem',
  fontWeight: 700,
  color: sceneVars.color.accentGlow,
});

export const merchantQuote = style({
  margin: 0,
  fontStyle: 'italic',
  fontSize: '0.85rem',
  lineHeight: 1.5,
  color: sceneVars.color.textMuted,
});

export const merchantNote = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  marginTop: '0.3rem',
  fontSize: '0.66rem',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#ffc640',
});

export const noteIcon = style({ width: '0.85rem', height: '0.85rem' });

/* ---- center goods ---- */
export const goods = style({
  flex: '1 1 24rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.1rem',
});

export const sectionHead = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  margin: 0,
  fontFamily: SERIF,
  fontSize: '1.1rem',
  fontWeight: 700,
  color: sceneVars.color.textStrong,
});

export const sectionIcon = style({ width: '1.1rem', height: '1.1rem', color: sceneVars.color.accentGlow });

export const cardGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(9.5rem, 1fr))',
  gap: '0.7rem',
});

const tileBase = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
  textAlign: 'left',
  padding: '0.7rem 0.75rem',
  borderRadius: '0.6rem',
  cursor: 'pointer',
  background: 'rgba(28, 27, 28, 0.6)',
  border: '1px solid rgba(73, 68, 84, 0.5)',
  animation: `${tileEnter} 300ms ease-out both`,
  transition: 'transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease',
  selectors: {
    '&:hover:not(:disabled)': {
      transform: 'translateY(-3px)',
      borderColor: sceneVars.color.accent,
      boxShadow: '0 10px 26px rgba(0, 0, 0, 0.45)',
    },
    '&:disabled': { cursor: 'not-allowed', opacity: 0.45 },
  },
});

export const cardTile = tileBase;

export const tileName = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontFamily: SERIF,
  fontSize: '1rem',
  fontWeight: 700,
  color: sceneVars.color.textStrong,
});

export const tileType = style({
  fontSize: '0.62rem',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
});

export const tileTypeTone = styleVariants({
  attack: { color: '#ffb4ab' },
  skill: { color: '#3cddc7' },
  power: { color: sceneVars.color.accentGlow },
  neutral: { color: sceneVars.color.textSubtle },
});

export const tileDesc = style({
  fontSize: '0.74rem',
  lineHeight: 1.45,
  color: sceneVars.color.textSubtle,
  flex: 1,
});

export const tilePrice = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  marginTop: 'auto',
  fontSize: '0.92rem',
  fontWeight: 800,
  color: '#ffc640',
});

export const tilePriceAffordable = style({});
export const tilePriceTooHigh = style({ color: 'rgba(255, 180, 171, 0.85)' });
export const priceIcon = style({ width: '0.85rem', height: '0.85rem' });

export const relicGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(11rem, 1fr))',
  gap: '0.7rem',
});

/* ---- rituals ---- */
export const ritualRow = style({ display: 'flex', flexWrap: 'wrap', gap: '0.7rem' });

export const ritualButton = style({
  flex: '1 1 9rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.9rem 0.8rem',
  borderRadius: '0.6rem',
  cursor: 'pointer',
  background: 'rgba(28, 27, 28, 0.6)',
  border: '1px solid rgba(73, 68, 84, 0.5)',
  transition: 'transform 160ms ease, border-color 160ms ease',
  selectors: {
    '&:hover:not(:disabled)': { transform: 'translateY(-3px)' },
    '&:disabled': { cursor: 'not-allowed', opacity: 0.45 },
  },
});

export const ritualButtonActive = style({ borderColor: sceneVars.color.accent });

export const ritualIconWrap = style({
  display: 'grid',
  placeItems: 'center',
  width: '2.6rem',
  height: '2.6rem',
  borderRadius: '999px',
  border: '1px solid currentColor',
});

export const ritualIconPurge = style({ color: '#ffb4ab' });
export const ritualIconEnhance = style({ color: '#3cddc7' });
export const ritualIcon = style({ width: '1.2rem', height: '1.2rem' });

export const ritualLabel = style({
  fontSize: '0.85rem',
  fontWeight: 700,
  color: sceneVars.color.textStrong,
});

export const ritualPrice = style({ fontSize: '0.72rem', color: sceneVars.color.textSubtle });

export const ritualPanel = style({
  marginTop: '0.2rem',
  padding: '0.85rem 1rem',
  borderRadius: '0.6rem',
  border: '1px solid rgba(73, 68, 84, 0.5)',
  background: 'rgba(18, 18, 20, 0.6)',
});

export const ritualHint = style({
  margin: '0 0 0.6rem',
  fontSize: '0.78rem',
  lineHeight: 1.5,
  color: sceneVars.color.textSubtle,
});

export const removeList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const removeItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  width: '100%',
  textAlign: 'left',
  padding: '0.5rem 0.7rem',
  borderRadius: '0.45rem',
  cursor: 'pointer',
  fontSize: '0.82rem',
  color: sceneVars.color.textMuted,
  background: 'rgba(28, 27, 28, 0.5)',
  border: '1px solid rgba(73, 68, 84, 0.4)',
  transition: 'border-color 150ms ease',
  selectors: {
    '&:hover:not(:disabled)': { borderColor: '#ffb4ab' },
    '&:disabled': { cursor: 'not-allowed', opacity: 0.45 },
  },
});

export const removePrice = style({ marginLeft: 'auto', fontWeight: 700, color: '#ffc640' });

/* ---- right rail ---- */
export const rail = style({
  flex: '0 0 15rem',
  alignSelf: 'flex-start',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
});

export const railPanel = style({
  padding: '0.9rem 1rem',
  borderRadius: '0.7rem',
  border: '1px solid rgba(73, 68, 84, 0.45)',
  background: 'rgba(20, 20, 22, 0.6)',
  backdropFilter: 'blur(10px)',
});

export const railPanelWealth = style({
  border: '1px solid rgba(255, 198, 64, 0.5)',
  boxShadow: 'inset 0 0 24px rgba(255, 198, 64, 0.08)',
});

export const railLabel = style({
  margin: '0 0 0.4rem',
  fontSize: '0.66rem',
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: sceneVars.color.textSubtle,
});

export const wealthValue = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.45rem',
  fontSize: '1.9rem',
  fontWeight: 800,
  color: '#ffc640',
});

export const wealthIcon = style({ width: '1.5rem', height: '1.5rem' });

export const railRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: '0.78rem',
  color: sceneVars.color.textMuted,
});

export const hpBar = style({
  marginTop: '0.45rem',
  height: '0.5rem',
  borderRadius: '999px',
  overflow: 'hidden',
  background: 'rgba(73, 68, 84, 0.5)',
});

export const hpFill = style({
  height: '100%',
  borderRadius: '999px',
  background: 'linear-gradient(90deg, #ff8a7a, #ffb4ab)',
});

export const relicChips = style({ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' });

export const relicChip = style({
  display: 'grid',
  placeItems: 'center',
  width: '2rem',
  height: '2rem',
  borderRadius: '0.45rem',
  fontSize: '0.7rem',
  fontWeight: 700,
  color: sceneVars.color.accentGlow,
  background: 'rgba(160, 120, 255, 0.14)',
  border: '1px solid rgba(160, 120, 255, 0.3)',
});

export const railEmpty = style({ fontSize: '0.76rem', color: sceneVars.color.textFaint });

export const leaveButton = style({
  marginTop: '0.15rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.4rem',
  padding: '0.7rem 1rem',
  borderRadius: '0.6rem',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: 700,
  color: sceneVars.color.textStrong,
  background: 'rgba(28, 27, 28, 0.7)',
  border: '1px solid rgba(73, 68, 84, 0.6)',
  transition: 'border-color 160ms ease, background 160ms ease',
  selectors: {
    '&:hover': { borderColor: sceneVars.color.accentGlow, background: 'rgba(40, 38, 44, 0.8)' },
  },
});

export const leaveIcon = style({ width: '1rem', height: '1rem' });
