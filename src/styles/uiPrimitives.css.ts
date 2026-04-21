import { globalStyle, style } from '@vanilla-extract/css';
import { sceneVars } from './sceneTheme.css';

export const panelSurface = style({
  borderRadius: sceneVars.radii.md,
  background: 'linear-gradient(180deg, #2e2a22 0%, #252119 100%)',
  border: '1px solid rgba(74, 67, 54, 0.95)',
  boxShadow: sceneVars.shadow.panel,
});

export const infoChip = style({
  display: 'inline-flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  gap: '0.25rem',
  padding: '0.22rem 0.48rem',
  fontSize: '0.78rem',
  lineHeight: 1.25,
  color: '#b8b0a4',
  background: 'rgba(20, 18, 16, 0.45)',
  border: `1px solid ${sceneVars.color.borderSoft}`,
  borderRadius: sceneVars.radii.pill,
});

globalStyle(`${infoChip} strong`, {
  fontSize: '0.86rem',
  fontWeight: 700,
  color: '#f0ebe3',
});

export const sectionKicker = style({
  margin: 0,
  fontSize: '0.76rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: sceneVars.color.textSubtle,
});
