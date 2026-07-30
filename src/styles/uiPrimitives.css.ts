import { globalStyle, style } from '@vanilla-extract/css';
import { sceneVars } from './sceneTheme.css';

export const panelSurface = style({
  borderRadius: sceneVars.radii.md,
  background:
    'linear-gradient(180deg, rgba(32, 31, 32, 0.78) 0%, rgba(14, 14, 15, 0.7) 100%)',
  border: `1px solid ${sceneVars.color.border}`,
  boxShadow: sceneVars.shadow.panel,
  backdropFilter: 'blur(18px)',
});

export const infoChip = style({
  display: 'inline-flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  gap: '0.25rem',
  padding: '0.22rem 0.48rem',
  fontSize: '0.78rem',
  lineHeight: 1.25,
  color: sceneVars.color.textMuted,
  background: 'rgba(14, 14, 15, 0.48)',
  border: `1px solid ${sceneVars.color.borderSoft}`,
  borderRadius: sceneVars.radii.pill,
});

globalStyle(`${infoChip} strong`, {
  fontSize: '0.86rem',
  fontWeight: 700,
  color: sceneVars.color.textStrong,
});

export const sectionKicker = style({
  margin: 0,
  fontSize: '0.76rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: sceneVars.color.textSubtle,
});

export const threatChip = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '1.65rem',
  padding: '0.22rem 0.55rem',
  border: `1px solid ${sceneVars.color.borderSoft}`,
  borderRadius: sceneVars.radii.pill,
  color: sceneVars.color.textMuted,
  background: sceneVars.color.overlay,
  fontSize: '0.72rem',
  fontWeight: 800,
  letterSpacing: '0.04em',
});

export const fracturedSurface = style({
  position: 'relative',
  overflow: 'hidden',
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      right: '-8%',
      bottom: '-45%',
      width: '52%',
      aspectRatio: '1',
      pointerEvents: 'none',
      opacity: 0.12,
      background:
        'linear-gradient(128deg, transparent 0 44%, rgba(208,188,255,.7) 45% 46%, transparent 47% 55%, rgba(45,212,191,.5) 56% 57%, transparent 58%)',
      transform: 'rotate(-12deg)',
    },
  },
});

export const glassPanel = style({
  borderRadius: sceneVars.radii.lg,
  border: `1px solid ${sceneVars.color.border}`,
  background:
    'linear-gradient(145deg, rgba(32, 31, 32, 0.8), rgba(10, 10, 11, 0.58))',
  boxShadow: sceneVars.shadow.panel,
  backdropFilter: 'blur(18px)',
});

export const labelCaps = style({
  margin: 0,
  fontSize: '0.72rem',
  fontWeight: 800,
  lineHeight: 1,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: sceneVars.color.textSubtle,
});
