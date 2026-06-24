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
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
});

export const routeSvg = style({
  display: 'block',
  width: '100%',
  maxWidth: '40rem',
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
    fill: 'rgba(139, 92, 246, 0.34)',
    stroke: sceneVars.color.accentGlow,
    filter: 'drop-shadow(0 0 14px rgba(139, 92, 246, 0.55))',
  },
  passed: {
    fill: 'rgba(18, 18, 24, 0.7)',
    stroke: 'rgba(120, 132, 116, 0.5)',
  },
  available: {
    opacity: 1,
  },
  locked: {
    opacity: 0.42,
    stroke: 'rgba(80, 78, 92, 0.7)',
    fill: 'rgba(16, 16, 20, 0.8)',
  },
});

const OBSIDIAN_FILL = 'rgba(17, 17, 22, 0.88)';

export const nodeCircleTone = styleVariants({
  battle: {
    fill: OBSIDIAN_FILL,
    stroke: 'rgba(176, 168, 196, 0.55)',
  },
  elite: {
    fill: OBSIDIAN_FILL,
    stroke: 'rgba(215, 96, 78, 0.9)',
  },
  boss: {
    fill: OBSIDIAN_FILL,
    stroke: 'rgba(224, 86, 70, 0.95)',
  },
  shop: {
    fill: OBSIDIAN_FILL,
    stroke: 'rgba(244, 191, 96, 0.88)',
  },
  treasure: {
    fill: OBSIDIAN_FILL,
    stroke: 'rgba(244, 191, 96, 0.88)',
  },
  event: {
    fill: OBSIDIAN_FILL,
    stroke: 'rgba(76, 196, 184, 0.85)',
  },
  rest: {
    fill: OBSIDIAN_FILL,
    stroke: 'rgba(72, 198, 168, 0.85)',
  },
  camp: {
    fill: OBSIDIAN_FILL,
    stroke: 'rgba(244, 213, 141, 0.78)',
  },
});

export const bossFrameOuter = style({
  fill: 'none',
  pointerEvents: 'none',
  stroke: 'rgba(224, 86, 70, 0.34)',
  strokeWidth: 1.5,
  transformBox: 'fill-box',
  transformOrigin: 'center',
});

export const bossFrameInner = style({
  fill: 'none',
  pointerEvents: 'none',
  stroke: 'rgba(224, 86, 70, 0.6)',
  strokeWidth: 1.5,
  transformBox: 'fill-box',
  transformOrigin: 'center',
  filter: 'drop-shadow(0 0 8px rgba(224, 86, 70, 0.3))',
});

export const youAreHere = style({
  pointerEvents: 'none',
});

export const youAreHereBox = style({
  fill: 'rgba(139, 92, 246, 0.22)',
  stroke: 'rgba(208, 188, 255, 0.7)',
  strokeWidth: 1,
  filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.35))',
});

export const youAreHereText = style({
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.14em',
  fill: sceneVars.color.accentGlow,
  textTransform: 'uppercase',
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
    color: '#f4eeff',
  },
  passed: {
    color: '#aeb8a6',
  },
  available: {
    color: '#cbc3d7',
  },
  locked: {
    color: sceneVars.color.textFaint,
    opacity: 0.85,
  },
});

/** 可前往节点的图标按类型上色，呼应外圈描边。 */
export const nodeIconTone = styleVariants({
  battle: { color: '#c8c0dc' },
  elite: { color: '#ff9a86' },
  boss: { color: '#ff9a86' },
  shop: { color: '#f4cf86' },
  treasure: { color: '#f4cf86' },
  event: { color: '#6fe0d2' },
  rest: { color: '#6fe0d2' },
  camp: { color: '#f4d58d' },
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
