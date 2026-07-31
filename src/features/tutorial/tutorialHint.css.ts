import { style } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';

export const root = style({
  position: 'absolute',
  zIndex: 62,
  display: 'grid',
  gap: '.24rem',
  width: 'min(14.5rem, calc(100% - 1.4rem))',
  maxHeight: 'min(11rem, calc(100% - 1.4rem))',
  overflow: 'auto',
  padding: '.62rem .72rem .58rem',
  border: '1px solid rgba(233, 185, 107, .42)',
  borderRadius: '12px',
  color: '#eee6d8',
  background: 'linear-gradient(145deg, rgba(34, 30, 25, .96), rgba(21, 19, 17, .94))',
  boxShadow: '0 10px 28px rgba(0, 0, 0, .28), inset 0 1px 0 rgba(255, 218, 145, .08)',
  pointerEvents: 'none',
  '@media': {
    '(max-width: 900px) and (orientation: landscape)': {
      width: 'min(15rem, 48vw)',
      padding: '.58rem .68rem .55rem',
      fontSize: '.82rem',
    },
    '(max-width: 560px) and (orientation: portrait)': {
      width: 'min(15rem, calc(100% - 1.2rem))',
    },
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});

export const placement = {
  'top-left': style({ top: '.8rem', left: '.7rem' }),
  'bottom-left': style({ bottom: '5.6rem', left: '.7rem' }),
  'bottom-right': style({ right: '.7rem', bottom: '5.6rem' }),
} as const;

export const kicker = style({
  color: sceneVars.color.accentGlow,
  fontSize: '.66rem',
  fontWeight: 800,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
});

export const title = style({ fontSize: '.9rem', lineHeight: 1.25 });

export const copy = style({
  margin: 0,
  color: '#bdb3a3',
  fontSize: '.77rem',
  lineHeight: 1.5,
});

export const dismiss = style({
  justifySelf: 'start',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '.24rem',
  marginTop: '.12rem',
  padding: '.16rem .3rem',
  border: 0,
  color: '#9b9284',
  background: 'transparent',
  fontSize: '.68rem',
  cursor: 'pointer',
  pointerEvents: 'auto',
  selectors: {
    '&:hover': { color: '#f0c77e' },
    '&:focus-visible': { outline: '2px solid rgba(240, 199, 126, .65)', outlineOffset: '2px' },
  },
});
