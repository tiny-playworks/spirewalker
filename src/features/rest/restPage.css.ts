import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';

const flamePulse = keyframes({
  '0%, 100%': { transform: 'translate(-50%,-50%) scale(.94)', opacity: .75 },
  '50%': { transform: 'translate(-50%,-54%) scale(1.06)', opacity: 1 },
});

const mobile = '(max-width: 900px) and (orientation: landscape)';

export const page = style({ background: 'transparent' });

export const body = style({
  flex: 1,
  minHeight: 0,
  display: 'grid',
  gridTemplateColumns: 'minmax(0,1.12fr) minmax(22rem,.88fr)',
  gap: 'clamp(1rem,3vw,2.5rem)',
  alignItems: 'center',
  width: 'min(72rem,100%)',
  margin: '0 auto',
  padding: 'clamp(1.25rem,4vh,2.5rem) clamp(1rem,4vw,3rem)',
  '@media': {
    [mobile]: {
      gridTemplateColumns: 'minmax(0,1.05fr) minmax(17rem,.95fr)',
      gap: '.75rem',
      padding: '.5rem max(.65rem, env(safe-area-inset-right, 0px)) max(.5rem, env(safe-area-inset-bottom, 0px)) max(.65rem, env(safe-area-inset-left, 0px))',
    },
  },
});

export const scene = style({
  position: 'relative',
  minHeight: '30rem',
  overflow: 'hidden',
  borderRadius: sceneVars.radii.lg,
  border: `1px solid ${sceneVars.color.borderSoft}`,
  background: 'radial-gradient(circle at 50% 65%, rgba(45,212,191,.2), transparent 32%), #0b1011',
  boxShadow: sceneVars.shadow.panelHeavy,
  '@media': { [mobile]: { minHeight: 0, height: '100%' } },
});

export const sceneImage = style({
  position: 'absolute',
  inset: 0,
  backgroundImage: 'radial-gradient(circle at 50% 65%, rgba(45,212,191,.28), transparent 30%)',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  filter: 'saturate(.9) brightness(.72)',
});

export const sceneShade = style({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, rgba(4,6,7,.98) 4%, rgba(4,6,7,.18) 64%), radial-gradient(circle at 50% 35%, transparent 30%, rgba(0,0,0,.5) 100%)',
});

export const fireSigil = style({
  position: 'absolute',
  left: '50%',
  top: '42%',
  display: 'grid',
  placeItems: 'center',
  width: '6.5rem',
  height: '6.5rem',
  transform: 'translate(-50%,-50%)',
  borderRadius: '50%',
  color: '#62fae3',
  background: 'radial-gradient(circle, rgba(45,212,191,.34), transparent 66%)',
  filter: 'drop-shadow(0 0 24px rgba(45,212,191,.45))',
  animation: `${flamePulse} 2.8s ease-in-out infinite`,
  '@media': {
    [mobile]: { width: '4.5rem', height: '4.5rem' },
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});
globalStyle(`${fireSigil} svg`, { width: '2.7rem', height: '2.7rem' });

export const sceneCopy = style({ position: 'absolute', left: '1.4rem', right: '1.4rem', bottom: '1.3rem' });
globalStyle(`${sceneCopy} p`, { margin: 0, color: sceneVars.color.relief, fontSize: '.68rem', fontWeight: 900, letterSpacing: '.16em' });
globalStyle(`${sceneCopy} h1`, { margin: '.35rem 0', color: sceneVars.color.textStrong, fontFamily: 'Georgia,"Songti SC",serif', fontSize: 'clamp(1.65rem,4vw,2.7rem)' });
globalStyle(`${sceneCopy} span`, { color: sceneVars.color.textMuted, fontSize: '.82rem', lineHeight: 1.55 });

export const decision = style({
  display: 'flex',
  flexDirection: 'column',
  padding: 'clamp(1.25rem,3vw,2rem)',
  borderRadius: sceneVars.radii.lg,
  border: `1px solid ${sceneVars.color.border}`,
  background: 'linear-gradient(145deg,rgba(29,29,33,.9),rgba(10,10,12,.88))',
  boxShadow: sceneVars.shadow.panel,
  '@media': { [mobile]: { padding: '.85rem 1rem', height: '100%', justifyContent: 'center' } },
});

export const kicker = style({ display: 'flex', alignItems: 'center', gap: '.35rem', margin: 0, color: sceneVars.color.relief, fontSize: '.68rem', fontWeight: 900, letterSpacing: '.14em' });
globalStyle(`${kicker} svg`, { width: '.9rem', height: '.9rem' });
globalStyle(`${decision} h2`, { margin: '.6rem 0 .35rem', color: sceneVars.color.textStrong, fontFamily: 'Georgia,"Songti SC",serif', fontSize: 'clamp(1.6rem,4vw,2.45rem)' });
export const description = style({ margin: 0, color: sceneVars.color.textMuted, lineHeight: 1.55, fontSize: '.86rem' });

export const healthPreview = style({ margin: '1.3rem 0', padding: '1rem', borderRadius: sceneVars.radii.md, border: '1px solid rgba(45,212,191,.25)', background: 'rgba(45,212,191,.055)', '@media': { [mobile]: { margin: '.7rem 0', padding: '.65rem' } } });
export const healthNumbers = style({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.6rem', color: sceneVars.color.textMuted, fontSize: '.78rem' });
globalStyle(`${healthNumbers} span`, { display: 'inline-flex', alignItems: 'center', gap: '.3rem' });
globalStyle(`${healthNumbers} svg`, { width: '.9rem', height: '.9rem', color: '#ff9c91' });
globalStyle(`${healthNumbers} strong`, { color: '#62fae3', fontSize: '.9rem' });
export const healthTrack = style({ position: 'relative', height: '.7rem', margin: '.7rem 0 .45rem', overflow: 'hidden', borderRadius: sceneVars.radii.pill, background: 'rgba(255,255,255,.08)' });
export const healthRestored = style({ position: 'absolute', inset: '0 auto 0 0', borderRadius: 'inherit', background: 'linear-gradient(90deg,rgba(45,212,191,.34),#62fae3)', boxShadow: '0 0 18px rgba(45,212,191,.25)' });
export const healthCurrent = style({ position: 'absolute', inset: '0 auto 0 0', zIndex: 1, borderRadius: 'inherit', background: 'linear-gradient(90deg,#d4846a,#ffb4ab)' });
globalStyle(`${healthPreview} small`, { color: sceneVars.color.textSubtle });

export const restButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '.45rem',
  minHeight: '3.1rem',
  padding: '.7rem 1rem',
  borderRadius: sceneVars.radii.md,
  color: '#061615',
  background: 'linear-gradient(135deg,#62fae3,#2dd4bf)',
  border: '1px solid #80fff0',
  boxShadow: '0 0 30px rgba(45,212,191,.2)',
  fontWeight: 900,
  cursor: 'pointer',
  transition: `transform ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
  selectors: { '&:hover': { transform: 'translateY(-2px)' } },
  '@media': { [mobile]: { minHeight: '2.55rem' } },
});
globalStyle(`${restButton} svg`, { width: '1rem', height: '1rem' });
