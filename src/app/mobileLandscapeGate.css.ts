import { globalStyle, keyframes, style } from '@vanilla-extract/css';

const turn = keyframes({
  '0%, 18%': { transform: 'rotate(0deg)' },
  '55%, 100%': { transform: 'rotate(90deg)' },
});

export const content = style({ display: 'contents' });

globalStyle('body[data-orientation-blocked="true"]', { overflow: 'hidden' });

export const gate = style({
  position: 'fixed',
  inset: 0,
  zIndex: 20000,
  display: 'grid',
  placeContent: 'center',
  justifyItems: 'center',
  gap: '.65rem',
  padding:
    'max(1.5rem, env(safe-area-inset-top, 0px)) max(1.5rem, env(safe-area-inset-right, 0px)) max(1.5rem, env(safe-area-inset-bottom, 0px)) max(1.5rem, env(safe-area-inset-left, 0px))',
  overflow: 'hidden',
  color: '#f4e8d4',
  textAlign: 'center',
  background:
    'radial-gradient(circle at 50% 44%, rgba(139,92,246,.26), transparent 16rem), radial-gradient(circle at 70% 80%, rgba(45,212,191,.12), transparent 18rem), #09090b',
});

export const halo = style({
  position: 'absolute',
  width: '18rem',
  height: '18rem',
  border: '1px solid rgba(208,188,255,.16)',
  borderRadius: '50%',
  boxShadow: '0 0 80px rgba(139,92,246,.18), inset 0 0 70px rgba(45,212,191,.08)',
});

export const device = style({
  position: 'relative',
  zIndex: 1,
  display: 'grid',
  placeItems: 'center',
  width: '5.4rem',
  height: '5.4rem',
  marginBottom: '.5rem',
});

export const kicker = style({
  position: 'relative',
  zIndex: 1,
  margin: 0,
  color: '#fbbf24',
  fontSize: '.7rem',
  fontWeight: 900,
  letterSpacing: '.18em',
});
globalStyle(`${device} svg`, {
  width: '3.8rem',
  height: '3.8rem',
  color: '#d0bcff',
  filter: 'drop-shadow(0 0 16px rgba(139,92,246,.5))',
  animation: `${turn} 2.4s ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', transform: 'rotate(90deg)' },
  },
});
globalStyle(`${device} span`, {
  position: 'absolute',
  right: '-.25rem',
  bottom: '-.2rem',
  color: '#fbbf24',
  fontSize: '1.4rem',
});
globalStyle(`${gate} h1`, {
  position: 'relative',
  zIndex: 1,
  margin: 0,
  fontFamily: 'Georgia, "Songti SC", serif',
  fontSize: 'clamp(1.55rem, 7vw, 2.35rem)',
});
globalStyle(`${gate} > p:last-child`, {
  position: 'relative',
  zIndex: 1,
  maxWidth: '22rem',
  margin: 0,
  color: '#cbc3d7',
  lineHeight: 1.55,
});
