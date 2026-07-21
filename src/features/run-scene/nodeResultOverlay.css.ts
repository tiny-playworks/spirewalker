import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';

const reveal = keyframes({
  from: { opacity: 0, transform: 'translateY(.8rem) scale(.97)' },
  to: { opacity: 1, transform: 'translateY(0) scale(1)' },
});

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: 500,
  display: 'grid',
  placeItems: 'center',
  padding: 'max(1rem, env(safe-area-inset-top, 0px)) max(1rem, env(safe-area-inset-right, 0px)) max(1rem, env(safe-area-inset-bottom, 0px)) max(1rem, env(safe-area-inset-left, 0px))',
  background: 'radial-gradient(circle at 50% 44%, rgba(139,92,246,.2), transparent 22rem), rgba(3,3,5,.78)',
  backdropFilter: 'blur(10px)',
});

export const panel = style({
  position: 'relative',
  display: 'grid',
  justifyItems: 'center',
  width: 'min(29rem, 100%)',
  padding: '2rem clamp(1.25rem, 4vw, 2.2rem) 1.5rem',
  overflow: 'hidden',
  textAlign: 'center',
  borderRadius: sceneVars.radii.lg,
  border: '1px solid rgba(208,188,255,.34)',
  color: sceneVars.color.text,
  background: 'linear-gradient(145deg, rgba(29,27,35,.98), rgba(9,9,11,.98))',
  boxShadow: sceneVars.shadow.panelHeavy,
  animation: `${reveal} ${sceneVars.motion.normal} ${sceneVars.motion.ease} both`,
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      left: '18%',
      right: '18%',
      top: '-5rem',
      height: '9rem',
      borderRadius: '50%',
      background: 'rgba(45,212,191,.2)',
      filter: 'blur(36px)',
    },
  },
  '@media': {
    '(max-width: 900px) and (orientation: landscape)': {
      width: 'min(34rem, 78vw)',
      padding: '.8rem 1.2rem .75rem',
      gridTemplateColumns: 'auto 1fr auto',
      columnGap: '.8rem',
      textAlign: 'left',
      alignItems: 'center',
    },
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});

export const emblem = style({
  position: 'relative',
  display: 'grid',
  placeItems: 'center',
  width: '3.6rem',
  height: '3.6rem',
  marginBottom: '.8rem',
  borderRadius: '50%',
  color: '#071615',
  background: 'linear-gradient(135deg,#62fae3,#2dd4bf)',
  boxShadow: '0 0 36px rgba(45,212,191,.28)',
  '@media': { '(max-width: 900px) and (orientation: landscape)': { gridRow: '1 / span 3', margin: 0 } },
});
globalStyle(`${emblem} svg`, { width: '1.6rem', height: '1.6rem', strokeWidth: 3 });

export const kicker = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '.35rem',
  margin: 0,
  color: sceneVars.color.relief,
  fontSize: '.68rem',
  fontWeight: 900,
  letterSpacing: '.16em',
});
globalStyle(`${kicker} svg`, { width: '.85rem', height: '.85rem' });
globalStyle(`${panel} h2`, {
  margin: '.55rem 0 .3rem',
  color: sceneVars.color.textStrong,
  fontFamily: 'Georgia, "Songti SC", serif',
  fontSize: 'clamp(1.35rem, 4vw, 2rem)',
  '@media': { '(max-width: 900px) and (orientation: landscape)': { margin: '.1rem 0', fontSize: '1.2rem' } },
});

export const message = style({
  margin: '0 0 1.25rem',
  color: sceneVars.color.textMuted,
  lineHeight: 1.6,
  '@media': { '(max-width: 900px) and (orientation: landscape)': { margin: 0, fontSize: '.76rem' } },
});

export const continueButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '.45rem',
  minHeight: '2.9rem',
  padding: '.65rem 1.05rem',
  borderRadius: sceneVars.radii.md,
  color: '#171008',
  background: 'linear-gradient(135deg,#ffe2a3,#d6a64d)',
  border: '1px solid #f4cd7a',
  boxShadow: sceneVars.shadow.button,
  fontWeight: 900,
  cursor: 'pointer',
  '@media': { '(max-width: 900px) and (orientation: landscape)': { gridColumn: 3, gridRow: '1 / span 3', minHeight: '2.5rem' } },
});
globalStyle(`${continueButton} svg`, { width: '1rem', height: '1rem' });

