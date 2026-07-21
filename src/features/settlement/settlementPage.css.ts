import { globalStyle, style } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';

const mobileLandscape = '(max-width: 900px) and (orientation: landscape)';

export const page = style({
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.4rem',
  padding: 'clamp(1.25rem, 4vh, 3rem) 1rem max(1rem, env(safe-area-inset-bottom, 0px))',
  overflowY: 'auto',
  color: sceneVars.color.text,
  background: 'radial-gradient(circle at 50% 16%, rgba(139, 92, 246, 0.22), transparent 24rem), linear-gradient(180deg, #111014, #080809)',
  '@media': {
    [mobileLandscape]: {
      gap: '.5rem',
      padding: '.45rem max(.75rem, env(safe-area-inset-right, 0px)) max(.45rem, env(safe-area-inset-bottom, 0px)) max(.75rem, env(safe-area-inset-left, 0px))',
    },
  },
});
export const hero = style({ textAlign: 'center', maxWidth: '48rem' });
export const emblem = style({
  display: 'grid', placeItems: 'center', width: '4.5rem', height: '4.5rem', margin: '0 auto 1rem',
  borderRadius: '50%', color: '#d0bcff', border: '1px solid rgba(208,188,255,.4)', background: 'rgba(139,92,246,.16)',
  boxShadow: '0 0 44px rgba(139,92,246,.24)',
  '@media': { [mobileLandscape]: { width: '2.4rem', height: '2.4rem', marginBottom: '.25rem' } },
});
globalStyle(`${emblem} svg`, { width: '2rem', height: '2rem', '@media': { [mobileLandscape]: { width: '1.2rem', height: '1.2rem' } } });
export const emblemVictory = style({ color: '#ffe2a3', borderColor: 'rgba(251,191,36,.5)', background: 'rgba(251,191,36,.12)' });
export const eyebrow = style({ margin: 0, color: sceneVars.color.accentGlow, fontSize: '.72rem', fontWeight: 900, letterSpacing: '.2em' });
export const title = style({ margin: '.55rem 0', color: sceneVars.color.textStrong, fontFamily: '"Libre Caslon Text", Georgia, serif', fontSize: 'clamp(2rem, 5vw, 4rem)', '@media': { [mobileLandscape]: { margin: '.1rem 0', fontSize: '1.45rem' } } });
export const subtitle = style({ margin: 0, color: sceneVars.color.textMuted, '@media': { [mobileLandscape]: { fontSize: '.68rem' } } });
export const statsGrid = style({
  display: 'grid', gridTemplateColumns: 'repeat(6, minmax(5rem, 1fr))', gap: '.55rem', width: 'min(58rem, 100%)',
  '@media': {
    '(max-width: 760px) and (orientation: portrait)': { gridTemplateColumns: 'repeat(3, 1fr)' },
    [mobileLandscape]: { gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '.3rem' },
  },
});
export const stat = style({ display: 'grid', placeItems: 'center', gap: '.2rem', padding: '.85rem .4rem', borderRadius: sceneVars.radii.md, border: '1px solid rgba(208,188,255,.17)', background: 'rgba(255,255,255,.035)', '@media': { [mobileLandscape]: { padding: '.35rem .2rem' } } });
globalStyle(`${stat} strong`, { color: sceneVars.color.textStrong, fontSize: '1.45rem', '@media': { [mobileLandscape]: { fontSize: '.95rem' } } });
globalStyle(`${stat} small`, { color: sceneVars.color.textSubtle, fontSize: '.68rem' });
export const detailGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '.8rem',
  width: 'min(68rem, 100%)',
  '@media': {
    '(max-width: 850px) and (orientation: portrait)': { gridTemplateColumns: '1fr' },
    '(max-width: 900px) and (orientation: landscape)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      gap: '.5rem',
    },
  },
});
export const panel = style({ padding: '1rem', borderRadius: sceneVars.radii.lg, border: '1px solid rgba(208,188,255,.18)', background: 'linear-gradient(145deg, rgba(31,29,37,.82), rgba(13,13,15,.88))', '@media': { [mobileLandscape]: { minHeight: 0, padding: '.5rem', overflow: 'hidden' } } });
globalStyle(`${panel} h2`, { display: 'flex', alignItems: 'center', gap: '.45rem', margin: '0 0 .8rem', color: sceneVars.color.textStrong, fontSize: '.95rem' });
globalStyle(`${panel} h2 svg`, { width: '1rem', height: '1rem', color: sceneVars.color.accentGlow });
export const cardList = style({ display: 'grid', gap: '.35rem', maxHeight: '10rem', margin: 0, padding: 0, overflowY: 'auto', listStyle: 'none', '@media': { [mobileLandscape]: { maxHeight: '5.6rem', gap: '.2rem' } } });
globalStyle(`${cardList} li`, { display: 'flex', justifyContent: 'space-between', padding: '.4rem .5rem', borderRadius: '8px', background: 'rgba(255,255,255,.035)', color: sceneVars.color.textMuted });
globalStyle(`${cardList} strong`, { color: sceneVars.color.accentGlow });
export const empty = style({ color: sceneVars.color.textSubtle });
export const routeStats = style({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.55rem' });
globalStyle(`${routeStats} span`, { display: 'grid', gap: '.15rem', padding: '.6rem', borderRadius: '8px', background: 'rgba(255,255,255,.035)', color: sceneVars.color.textSubtle, fontSize: '.74rem' });
globalStyle(`${routeStats} strong`, { color: sceneVars.color.textStrong, fontSize: '1.05rem' });
export const deckList = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '.35rem',
  maxHeight: '10rem',
  margin: 0,
  padding: 0,
  overflowY: 'auto',
  listStyle: 'none',
  '@media': { [mobileLandscape]: { maxHeight: '5.6rem', gap: '.2rem' } },
});
globalStyle(`${deckList} li`, {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '.35rem',
  padding: '.4rem .5rem',
  borderRadius: '8px',
  background: 'rgba(255,255,255,.035)',
  color: sceneVars.color.textMuted,
  fontSize: '.78rem',
});
globalStyle(`${deckList} strong`, { color: sceneVars.color.accentGlow });
export const actions = style({ display: 'flex', gap: '.65rem', flexWrap: 'wrap', justifyContent: 'center', '@media': { [mobileLandscape]: { gap: '.35rem' } } });
export const primary = style({ display: 'inline-flex', alignItems: 'center', gap: '.45rem', minHeight: '2.8rem', padding: '.65rem 1rem', borderRadius: sceneVars.radii.md, border: '1px solid #f4cd7a', color: '#171008', background: 'linear-gradient(135deg,#ffe2a3,#d6a64d)', fontWeight: 900, cursor: 'pointer', '@media': { [mobileLandscape]: { minHeight: '2.2rem', padding: '.35rem .75rem', fontSize: '.68rem' } } });
globalStyle(`${primary} svg`, { width: '1rem', height: '1rem' });
export const secondary = style({ minHeight: '2.8rem', padding: '.65rem 1rem', borderRadius: sceneVars.radii.md, border: '1px solid rgba(208,188,255,.3)', color: sceneVars.color.text, background: 'rgba(208,188,255,.08)', cursor: 'pointer', '@media': { [mobileLandscape]: { minHeight: '2.2rem', padding: '.35rem .75rem', fontSize: '.68rem' } } });
