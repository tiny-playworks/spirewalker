import { globalStyle, keyframes, style, styleVariants } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';

const mobileLandscape = '(max-width: 900px) and (orientation: landscape)';

const drift = keyframes({
  '0%, 100%': { transform: 'translate3d(-4%, 0, 0) scale(1)', opacity: 0.52 },
  '50%': { transform: 'translate3d(4%, -2%, 0) scale(1.05)', opacity: 0.76 },
});

export const root = style({
  position: 'relative',
  isolation: 'isolate',
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  width: '100%',
  minWidth: 0,
  minHeight: 0,
  height: '100dvh',
  overflow: 'hidden',
  color: sceneVars.color.text,
  background: sceneVars.color.canvas,
});

export const tone = styleVariants({
  map: { vars: { [sceneVars.color.sceneGlow]: 'rgba(45, 212, 191, 0.14)' } },
  reward: { vars: { [sceneVars.color.sceneGlow]: 'rgba(251, 191, 36, 0.16)' } },
  shop: { vars: { [sceneVars.color.sceneGlow]: 'rgba(139, 92, 246, 0.18)' } },
  event: { vars: { [sceneVars.color.sceneGlow]: 'rgba(139, 92, 246, 0.2)' } },
  rest: { vars: { [sceneVars.color.sceneGlow]: 'rgba(45, 212, 191, 0.16)' } },
  settlement: { vars: { [sceneVars.color.sceneGlow]: 'rgba(251, 191, 36, 0.14)' } },
});

export const atmosphere = style({
  position: 'absolute',
  inset: 0,
  zIndex: -1,
  overflow: 'hidden',
  pointerEvents: 'none',
  background: `radial-gradient(ellipse 72% 58% at 50% 16%, ${sceneVars.color.sceneGlow}, transparent 66%), linear-gradient(165deg, #09090b 0%, #14131a 48%, #081413 100%)`,
});

export const rift = style({
  position: 'absolute',
  left: '18%',
  right: '12%',
  top: '-44%',
  height: '88%',
  borderRadius: '50%',
  background: `radial-gradient(ellipse, ${sceneVars.color.sceneGlow}, transparent 67%)`,
  filter: 'blur(34px)',
  animation: `${drift} 13s ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});

export const vignette = style({
  position: 'absolute',
  inset: 0,
  background: 'radial-gradient(ellipse at 50% 48%, transparent 42%, rgba(0,0,0,.72) 100%)',
});

export const texture = style({
  position: 'absolute',
  inset: 0,
  opacity: 0.045,
  backgroundImage:
    'linear-gradient(rgba(208,188,255,.34) 1px, transparent 1px), linear-gradient(90deg, rgba(208,188,255,.34) 1px, transparent 1px)',
  backgroundSize: '46px 46px',
  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,.7), transparent 78%)',
});

globalStyle(`${root} > :not(${atmosphere})`, { position: 'relative', zIndex: 1 });

export const header = style({
  zIndex: 30,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
  alignItems: 'center',
  gap: sceneVars.space.md,
  minHeight: '4rem',
  padding: 'max(.55rem, env(safe-area-inset-top, 0px)) max(1rem, env(safe-area-inset-right, 0px)) .55rem max(1rem, env(safe-area-inset-left, 0px))',
  borderBottom: `1px solid ${sceneVars.color.borderSoft}`,
  background: 'linear-gradient(180deg, rgba(8,8,10,.96), rgba(8,8,10,.76))',
  backdropFilter: 'blur(16px)',
  boxShadow: '0 10px 34px rgba(0,0,0,.24)',
  '@media': {
    [mobileLandscape]: {
      minHeight: '2.75rem',
      gridTemplateColumns: 'minmax(0,1fr) auto',
      gap: '.45rem',
      padding: 'max(.28rem, env(safe-area-inset-top, 0px)) max(.55rem, env(safe-area-inset-right, 0px)) .28rem max(.55rem, env(safe-area-inset-left, 0px))',
    },
    '(max-width: 760px)': {
      minHeight: '2.75rem',
      gridTemplateColumns: 'minmax(0,1fr) auto',
      gap: '.45rem',
      padding: 'max(.28rem, env(safe-area-inset-top, 0px)) max(.55rem, env(safe-area-inset-right, 0px)) .28rem max(.55rem, env(safe-area-inset-left, 0px))',
    },
  },
});

export const headerCompact = style({ minHeight: '3.25rem' });

export const identity = style({
  display: 'flex',
  minWidth: 0,
  alignItems: 'center',
  gap: '.72rem',
});

export const brand = style({
  color: sceneVars.color.textStrong,
  fontFamily: sceneVars.font.display,
  fontSize: 'clamp(.88rem, 1.6vw, 1.25rem)',
  letterSpacing: '.16em',
  textShadow: '0 0 20px rgba(251,191,36,.24)',
  whiteSpace: 'nowrap',
  '@media': { [mobileLandscape]: { fontSize: '.78rem', letterSpacing: '.12em' } },
});

export const divider = style({ width: '1px', height: '1.35rem', background: sceneVars.color.border });

export const sceneCopy = style({ display: 'grid', minWidth: 0, gap: '.08rem' });
globalStyle(`${sceneCopy} small`, {
  color: sceneVars.color.textSubtle,
  fontSize: '.7rem',
  letterSpacing: '.12em',
  textTransform: 'uppercase',
});
globalStyle(`${sceneCopy} b`, {
  overflow: 'hidden',
  color: sceneVars.color.textStrong,
  fontSize: '.84rem',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const runMeta = style({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.42rem' });
export const metaChip = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '.28rem',
  minHeight: '1.8rem',
  padding: '.25rem .58rem',
  border: `1px solid ${sceneVars.color.borderSoft}`,
  borderRadius: sceneVars.radii.pill,
  color: sceneVars.color.textMuted,
  background: 'rgba(8,8,10,.56)',
  fontSize: '.75rem',
  fontWeight: 800,
  fontVariantNumeric: 'tabular-nums',
  '@media': {
    [mobileLandscape]: { minHeight: '1.65rem', padding: '.18rem .42rem', fontSize: '.7rem' },
    '(max-width: 760px)': { minHeight: '1.65rem', padding: '.18rem .42rem', fontSize: '.7rem' },
    '(max-width: 620px)': { selectors: { '&:first-child': { display: 'none' } } },
  },
});
globalStyle(`${metaChip} svg`, { width: '.85rem', height: '.85rem' });
export const healthChip = style({ color: '#ffb4ab', borderColor: 'rgba(255,120,110,.28)' });
export const goldChip = style({ color: sceneVars.color.fortune, borderColor: 'rgba(251,191,36,.3)' });
export const headerActions = style({ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '.45rem' });
