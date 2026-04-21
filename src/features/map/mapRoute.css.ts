import { globalStyle, keyframes, style, styleVariants } from '@vanilla-extract/css';
import type { GlowLevel, RouteTone } from './mapRouteTone';
import { sceneVars } from '@/styles/sceneTheme.css';

const nodePulse = keyframes({
  '0%, 100%': {
    opacity: 0.62,
    transform: 'scale(0.98)',
  },
  '50%': {
    opacity: 1,
    transform: 'scale(1.05)',
  },
});

const nodeHeartbeat = keyframes({
  '0%, 100%': {
    opacity: 0.22,
    transform: 'scale(0.94)',
  },
  '50%': {
    opacity: 0.52,
    transform: 'scale(1.06)',
  },
});

const nodePlayerBlink = keyframes({
  '0%, 100%': {
    transform: 'scale(0.92)',
    opacity: 0.88,
  },
  '50%': {
    transform: 'scale(1.18)',
    opacity: 1,
  },
});

const nodeSelectEcho = keyframes({
  '0%': {
    opacity: 0.32,
    transform: 'scale(0.82)',
  },
  '100%': {
    opacity: 0,
    transform: 'scale(1.14)',
  },
});

const nodeSelectFlash = keyframes({
  '0%': {
    opacity: 0.35,
    transform: 'scale(0.88)',
  },
  '60%': {
    opacity: 1,
    transform: 'scale(1.08)',
  },
  '100%': {
    opacity: 1,
    transform: 'scale(1)',
  },
});

const reducedMotion = '(prefers-reduced-motion: reduce)';

export const route = style({
  margin: 0,
  width: '100%',
  overflowX: 'auto',
});

export const routeSvg = style({
  display: 'block',
  width: '100%',
  minHeight: '11rem',
  maxHeight: '22rem',
});

export const routeEdgeBase = style({
  strokeLinecap: 'round',
  strokeWidth: 2,
  fill: 'none',
  vectorEffect: 'non-scaling-stroke',
  transition: [
    `stroke ${sceneVars.motion.normal} ${sceneVars.motion.ease}`,
    `opacity ${sceneVars.motion.normal} ${sceneVars.motion.ease}`,
    `stroke-width ${sceneVars.motion.normal} ${sceneVars.motion.ease}`,
    `filter ${sceneVars.motion.normal} ${sceneVars.motion.ease}`,
  ].join(', '),
});

export const routeEdgePreview = style({
  stroke: 'rgba(244, 213, 141, 0.92)',
  strokeWidth: 2.7,
  opacity: 1,
  filter: 'drop-shadow(0 0 8px rgba(244, 213, 141, 0.16))',
});

export const routeEdgeEmphasis = styleVariants({
  active: {
    stroke: 'rgba(140, 124, 98, 0.85)',
    opacity: 0.9,
  },
  dim: {
    stroke: sceneVars.color.edgeDim,
    opacity: 0.28,
  },
});

export const routeEdgeTone = styleVariants({
  neutral: {
    stroke: 'rgba(140, 124, 98, 0.76)',
  },
  hazard: {
    stroke: 'rgba(171, 112, 90, 0.72)',
  },
  fortune: {
    stroke: 'rgba(191, 152, 79, 0.68)',
  },
  mystery: {
    stroke: 'rgba(104, 126, 160, 0.68)',
  },
  relief: {
    stroke: 'rgba(102, 140, 117, 0.66)',
  },
});

export const routeEdgeGlow = styleVariants({
  soft: {
    strokeWidth: 2.05,
    opacity: 0.78,
  },
  medium: {
    strokeWidth: 2.18,
    opacity: 0.84,
    filter: 'drop-shadow(0 0 4px rgba(244, 213, 141, 0.04))',
  },
  strong: {
    strokeWidth: 2.45,
    opacity: 0.98,
    filter: 'drop-shadow(0 0 7px rgba(186, 111, 72, 0.16))',
  },
  intense: {
    strokeWidth: 2.65,
    opacity: 1,
    filter: 'drop-shadow(0 0 9px rgba(171, 85, 64, 0.22))',
  },
});

export type RouteEdgeTone = RouteTone;
export type RouteEdgeGlow = GlowLevel;

export const nodeRoot = style({
  WebkitTapHighlightColor: 'transparent',
});

export const nodeRootSelectable = style({
  cursor: 'pointer',
  outline: 'none',
});

export const nodeCore = style({
  transformBox: 'fill-box',
  transformOrigin: 'center',
  transition: `filter ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
});

export const nodeCircleBase = style({
  strokeWidth: 2,
  fill: sceneVars.color.panel,
  stroke: sceneVars.color.border,
  transition: [
    `fill ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
    `stroke ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
    `opacity ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
    `filter ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
  ].join(', '),
});

export const nodeCircleInteractive = style({
  filter: 'drop-shadow(0 0 0 rgba(244, 213, 141, 0))',
});

export const nodeCircleState = styleVariants({
  current: {
    fill: '#342c24',
    stroke: sceneVars.color.accent,
    filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35))',
  },
  passed: {
    fill: '#2e3428',
    stroke: '#5a6b4e',
  },
  available: {
    opacity: 0.88,
  },
  locked: {
    opacity: 0.38,
    stroke: '#3a352e',
    fill: '#25221c',
  },
});

export const nodeCircleTone = styleVariants({
  battle: {
    fill: '#33251e',
    stroke: 'rgba(186, 111, 72, 0.75)',
  },
  elite: {
    fill: '#39231f',
    stroke: 'rgba(171, 85, 64, 0.82)',
  },
  boss: {
    fill: '#39231f',
    stroke: 'rgba(171, 85, 64, 0.82)',
  },
  shop: {
    fill: '#342d20',
    stroke: 'rgba(191, 152, 79, 0.82)',
  },
  treasure: {
    fill: '#342d20',
    stroke: 'rgba(191, 152, 79, 0.82)',
  },
  event: {
    fill: '#212834',
    stroke: 'rgba(94, 123, 173, 0.82)',
  },
  rest: {
    fill: '#233026',
    stroke: 'rgba(96, 145, 118, 0.82)',
  },
  camp: {
    fill: '#342d20',
    stroke: 'rgba(244, 213, 141, 0.7)',
  },
});

export const nodeCircleSelected = style({
  filter: 'drop-shadow(0 0 16px rgba(244, 213, 141, 0.3))',
});

export const nodeHoverRing = style({
  fill: 'none',
  stroke: 'rgba(244, 213, 141, 0.72)',
  strokeWidth: 2,
  filter: 'drop-shadow(0 0 10px rgba(244, 213, 141, 0.18))',
});

export const nodeThreatRing = style({
  fill: 'none',
  pointerEvents: 'none',
  strokeWidth: 2.4,
  opacity: 0.92,
});

export const nodeThreatTone = styleVariants({
  elite: {
    stroke: 'rgba(202, 95, 77, 0.92)',
    filter: 'drop-shadow(0 0 10px rgba(202, 95, 77, 0.24))',
  },
  boss: {
    stroke: 'rgba(215, 88, 68, 0.96)',
    filter: 'drop-shadow(0 0 12px rgba(215, 88, 68, 0.28))',
  },
});

export const nodeThreatHalo = style({
  fill: 'rgba(171, 85, 64, 0.1)',
  pointerEvents: 'none',
  filter: 'blur(1px)',
});

export const nodeIconBase = style({
  color: sceneVars.color.textSubtle,
  pointerEvents: 'none',
  overflow: 'visible',
});

export const nodeIconState = styleVariants({
  current: {
    color: sceneVars.color.accentGlow,
  },
  passed: {
    color: '#c4d2b4',
  },
  available: {
    color: '#a69f94',
  },
  locked: {
    color: sceneVars.color.textFaint,
    opacity: 0.85,
  },
});

globalStyle(`${nodeRootSelectable}:hover ${nodeCircleInteractive}`, {
  strokeWidth: 2.35,
  filter: 'drop-shadow(0 0 10px rgba(244, 213, 141, 0.24))',
});

globalStyle(`${nodeRootSelectable}:hover ${nodeIconBase}`, {
  color: '#f0ebe3',
});

export const nodeHit = style({
  fill: 'transparent',
});

export const nodeAura = style({
  fill: 'none',
  pointerEvents: 'none',
  stroke: 'rgba(244, 213, 141, 0.38)',
  strokeWidth: 2.5,
  animation: `${nodePulse} 2.8s ${sceneVars.motion.easeInOut} infinite`,
  '@media': {
    [reducedMotion]: {
      animation: 'none',
    },
  },
});

export const nodeHeart = style({
  fill: 'rgba(244, 213, 141, 0.1)',
  pointerEvents: 'none',
  animation: `${nodeHeartbeat} 1.9s ${sceneVars.motion.easeInOut} infinite`,
  '@media': {
    [reducedMotion]: {
      animation: 'none',
    },
  },
});

export const nodeSelectionEcho = style({
  fill: 'none',
  pointerEvents: 'none',
  stroke: 'rgba(244, 213, 141, 0.22)',
  strokeWidth: 5,
  filter: 'blur(1px)',
  animation: `${nodeSelectEcho} ${sceneVars.motion.slow} ease-out`,
  '@media': {
    [reducedMotion]: {
      animation: 'none',
    },
  },
});

export const nodeSelection = style({
  fill: 'none',
  pointerEvents: 'none',
  stroke: 'rgba(244, 213, 141, 0.82)',
  strokeWidth: 2.5,
  strokeDasharray: '4 3',
  filter: 'drop-shadow(0 0 10px rgba(244, 213, 141, 0.34))',
  animation: `${nodeSelectFlash} 260ms ease-out`,
  '@media': {
    [reducedMotion]: {
      animation: 'none',
    },
  },
});

export const nodePlayer = style({
  fill: sceneVars.color.accentGlow,
  filter: 'drop-shadow(0 0 6px rgba(244, 213, 141, 0.45))',
  animation: `${nodePlayerBlink} 1.85s ${sceneVars.motion.easeInOut} infinite`,
  '@media': {
    [reducedMotion]: {
      animation: 'none',
    },
  },
});

export const nodeTag = style({
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  fill: sceneVars.color.accentGlow,
  pointerEvents: 'none',
});
