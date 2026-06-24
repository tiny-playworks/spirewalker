import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';

const tablet = '(max-width: 900px)';

export const page = style({
  position: 'relative',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  minHeight: 0,
  overflow: 'auto',
  padding: 'clamp(0.45rem, 1.4vw, 0.85rem)',
  background:
    'radial-gradient(ellipse 90% 55% at 50% 0%, rgba(139, 92, 246, 0.18) 0%, transparent 52%), radial-gradient(ellipse 60% 45% at 100% 60%, rgba(45, 212, 191, 0.1) 0%, transparent 42%), linear-gradient(175deg, #0a0a0b 0%, #131314 42%, #0e0e0f 100%)',
  selectors: {
    '&::after': {
      content: '""',
      pointerEvents: 'none',
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      opacity: 0.035,
      backgroundImage:
        'linear-gradient(rgba(208, 188, 255, 0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(208, 188, 255, 0.55) 1px, transparent 1px)',
      backgroundSize: '40px 40px',
    },
  },
});

globalStyle(`${page} > *`, {
  position: 'relative',
  zIndex: 1,
});

export const hud = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.45rem',
  width: '100%',
  marginBottom: '0.45rem',
  padding: '0.45rem 0.65rem 0.35rem',
  borderRadius: sceneVars.radii.md,
  background: 'linear-gradient(180deg, rgba(32, 31, 32, 0.78) 0%, rgba(14, 14, 15, 0.5) 100%)',
  border: '1px solid rgba(208, 188, 255, 0.3)',
  boxShadow: sceneVars.shadow.panel,
  backdropFilter: 'blur(16px)',
});

export const hudTop = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '0.75rem 1rem',
});

export const hudAside = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  gap: '0.5rem',
  marginLeft: 'auto',
});

export const hudChips = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.45rem',
  alignItems: 'center',
  flex: 1,
  minWidth: 0,
});

const chipBase = style({
  display: 'inline-flex',
  alignItems: 'baseline',
  gap: '0.25rem',
  padding: '0.28rem 0.55rem',
  fontSize: '0.78rem',
  color: sceneVars.color.textMuted,
  background: 'rgba(10, 10, 11, 0.45)',
  border: `1px solid ${sceneVars.color.borderSoft}`,
  borderRadius: sceneVars.radii.pill,
});

export const chip = chipBase;

export const chipFloor = style([
  chipBase,
  {
    fontWeight: 700,
    letterSpacing: '0.06em',
    color: sceneVars.color.fortune,
    borderColor: 'rgba(251, 191, 36, 0.45)',
    background: 'rgba(251, 191, 36, 0.1)',
  },
]);

globalStyle(`${chipBase} strong`, {
  fontSize: '0.88rem',
  fontWeight: 700,
  color: sceneVars.color.textStrong,
});

export const hudCurrent = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '0.15rem',
  padding: '0.3rem 0.55rem',
  borderRadius: '10px',
  border: '1px solid rgba(251, 191, 36, 0.28)',
  background: 'rgba(251, 191, 36, 0.06)',
  minWidth: '8rem',
});

export const systemToolbar = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: '0.45rem',
});

export const hudCurrentKey = style({
  fontSize: '0.68rem',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: sceneVars.color.textSubtle,
});

export const hudCurrentValue = style({
  fontSize: '0.92rem',
  fontWeight: 700,
  color: sceneVars.color.fortune,
  textAlign: 'right',
  lineHeight: 1.25,
  maxWidth: '12rem',
});

export const hudCurrentSub = style({
  fontSize: '0.72rem',
  color: sceneVars.color.textSubtle,
  textAlign: 'right',
});

export const hudRelics = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.35rem 0.5rem',
  alignItems: 'baseline',
  paddingTop: '0.3rem',
  marginTop: '0.15rem',
  borderTop: '1px solid rgba(208, 188, 255, 0.18)',
  fontSize: '0.8rem',
  lineHeight: 1.45,
  color: sceneVars.color.textMuted,
});

export const hudRelicsKey = style({
  flexShrink: 0,
  fontWeight: 700,
  color: sceneVars.color.fortune,
});

export const body = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  width: '100%',
  minHeight: 0,
});

export const board = style({
  flex: 1,
  display: 'grid',
  gridTemplateColumns: '15rem minmax(0, 1fr)',
  gap: '1rem',
  alignItems: 'stretch',
  minHeight: 'calc(100vh - 8.25rem)',
  '@media': {
    [tablet]: {
      gridTemplateColumns: '1fr',
      gap: '0.6rem',
      minHeight: 'auto',
    },
  },
});

export const sidePanel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
  alignSelf: 'start',
  paddingTop: '0.3rem',
  '@media': {
    [tablet]: {
      order: 2,
    },
  },
});

export const routeIntro = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
  padding: '0.8rem 0.9rem',
  borderRadius: sceneVars.radii.md,
  background: 'linear-gradient(180deg, rgba(32, 31, 32, 0.58) 0%, rgba(10, 10, 11, 0.3) 100%)',
  border: '1px solid rgba(208, 188, 255, 0.22)',
});

export const boardTitle = style({
  margin: 0,
  fontSize: '0.76rem',
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: sceneVars.color.textSubtle,
});

export const boardSub = style({
  margin: 0,
  fontSize: '0.84rem',
  lineHeight: 1.5,
  color: sceneVars.color.textMuted,
});

export const boardRoute = style({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const stage = style({
  position: 'relative',
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  alignItems: 'stretch',
});

export const stageRoute = style({
  position: 'relative',
  flex: 1,
  minHeight: 'calc(100vh - 9.5rem)',
  padding: '0.5rem 0.2rem 0.35rem',
  borderRadius: '20px',
  background:
    'radial-gradient(circle at 50% 42%, rgba(139, 92, 246, 0.14), transparent 34%), radial-gradient(circle at 84% 48%, rgba(45, 212, 191, 0.08), transparent 24%)',
  overflow: 'hidden',
  '@media': {
    [tablet]: {
      minHeight: '32rem',
    },
  },
});

export const legend = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  padding: '0.7rem 0.8rem',
  borderRadius: sceneVars.radii.sm,
  background: 'rgba(10, 10, 11, 0.36)',
  border: '1px solid rgba(208, 188, 255, 0.2)',
});

export const legendRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: '0.45rem 0.85rem',
});

globalStyle(`${legendRow} + ${legendRow}`, {
  paddingTop: '0.45rem',
  borderTop: '1px solid rgba(208, 188, 255, 0.18)',
});

export const legendTitle = style({
  flexShrink: 0,
  margin: 0,
  fontSize: '0.72rem',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: sceneVars.color.textSubtle,
});

const legendListBase = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.35rem 0.75rem',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const legendList = legendListBase;

export const legendEdgeList = style([
  legendListBase,
  {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '0.35rem',
    minWidth: 0,
  },
]);

const legendItemBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.78rem',
  color: sceneVars.color.textMuted,
});

export const legendItem = legendItemBase;

export const legendEdgeItem = style([
  legendItemBase,
  {
    alignItems: 'flex-start',
    lineHeight: 1.35,
  },
]);

export const legendGlyphBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.38rem',
  height: '1.38rem',
  borderRadius: '50%',
  fontSize: '0.72rem',
  fontWeight: 700,
  lineHeight: 1,
  border: `2px solid ${sceneVars.color.border}`,
  background: 'linear-gradient(165deg, rgba(53, 52, 54, 0.78) 0%, rgba(10, 10, 11, 0.74) 100%)',
  color: sceneVars.color.textSubtle,
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
});

export const legendGlyphTone = styleVariants({
  battle: { color: sceneVars.color.hazard },
  elite: { color: sceneVars.color.hazard },
  boss: { color: sceneVars.color.hazard },
  shop: { color: sceneVars.color.fortune },
  treasure: { color: sceneVars.color.fortune },
  event: { color: sceneVars.color.accentGlow },
  rest: { color: sceneVars.color.relief },
  camp: { color: sceneVars.color.fortune },
});

export const legendIcon = style({
  width: '0.92rem',
  height: '0.92rem',
});

export const legendLabel = style({
  color: sceneVars.color.textMuted,
});

export const objectiveCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  padding: '0.8rem 0.9rem',
  borderRadius: sceneVars.radii.md,
  background: 'rgba(10, 10, 11, 0.42)',
  border: '1px solid rgba(251, 191, 36, 0.26)',
});

export const objectiveKey = style({
  fontSize: '0.72rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: sceneVars.color.textSubtle,
});

export const objectiveValue = style({
  fontSize: '1.02rem',
  color: sceneVars.color.fortune,
});

export const objectiveText = style({
  fontSize: '0.82rem',
  lineHeight: 1.45,
  color: sceneVars.color.textMuted,
});

const edgeSwatchBase = style({
  display: 'inline-block',
  width: '2rem',
  height: '3px',
  marginTop: '0.38em',
  borderRadius: '2px',
  flexShrink: 0,
});

export const edgeSwatchBright = style([
  edgeSwatchBase,
  {
    background: 'rgba(251, 191, 36, 0.85)',
    opacity: 0.9,
  },
]);

export const edgeSwatchDim = style([
  edgeSwatchBase,
  {
    background: sceneVars.color.edgeDim,
    opacity: 0.28,
  },
]);

export const actionsPanel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
  marginTop: 'auto',
  paddingBottom: '0.25rem',
});

export const toolbar = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
});

export const toolButtonBase = style({
  padding: '0.42rem 0.72rem',
  fontSize: '0.78rem',
  fontWeight: 600,
  cursor: 'pointer',
  color: sceneVars.color.textMuted,
  background: 'rgba(10, 10, 11, 0.55)',
  border: `1px solid ${sceneVars.color.border}`,
  borderRadius: sceneVars.radii.sm,
  transition: [
    `border-color ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
    `background ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
  ].join(', '),
});

export const toolButtonTone = styleVariants({
  default: {},
  danger: {},
});

globalStyle(`${toolButtonBase}:hover`, {
  borderColor: 'rgba(251, 191, 36, 0.62)',
  background: 'rgba(32, 31, 32, 0.9)',
});

globalStyle(`${toolButtonTone.danger}:hover`, {
  borderColor: 'rgba(212, 132, 106, 0.72)',
  color: '#ffb4ab',
});

export const done = style({
  margin: 0,
  padding: '0.65rem 0.85rem',
  borderRadius: '10px',
  border: '1px dashed rgba(251, 191, 36, 0.42)',
  color: sceneVars.color.fortune,
  fontSize: '0.95rem',
  textAlign: 'center',
  background: 'rgba(251, 191, 36, 0.06)',
});

export const selectionPrompt = style({
  margin: 0,
  padding: '0.85rem 1rem',
  borderRadius: sceneVars.radii.md,
  border: '1px dashed rgba(208, 188, 255, 0.36)',
  background: 'rgba(10, 10, 11, 0.32)',
  color: sceneVars.color.textMuted,
  textAlign: 'center',
});

export const decisionPanel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.95rem',
  padding: '1rem 1.05rem 1.05rem',
  borderRadius: sceneVars.radii.lg,
  border: '1px solid rgba(208, 188, 255, 0.32)',
  background: 'linear-gradient(180deg, rgba(32, 31, 32, 0.84) 0%, rgba(10, 10, 11, 0.82) 100%)',
  boxShadow: sceneVars.shadow.panel,
});

export const decisionHead = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem 1rem',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  '@media': {
    [tablet]: {
      flexDirection: 'column',
    },
  },
});

export const decisionCopy = style({
  flex: 1,
  minWidth: 'min(100%, 18rem)',
});

export const decisionKicker = style({
  margin: '0 0 0.25rem',
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: sceneVars.color.textSubtle,
});

export const decisionTitle = style({
  margin: 0,
  fontSize: '1.18rem',
  color: sceneVars.color.textStrong,
});

export const decisionDesc = style({
  margin: '0.4rem 0 0',
  fontSize: '0.9rem',
  lineHeight: 1.55,
  color: sceneVars.color.textMuted,
});

export const decisionBadges = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: '0.4rem',
  '@media': {
    [tablet]: {
      justifyContent: 'flex-start',
    },
  },
});

export const decisionBadgeBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.28rem 0.56rem',
  borderRadius: sceneVars.radii.pill,
  border: '1px solid rgba(95, 81, 62, 0.85)',
  background: 'rgba(20, 18, 16, 0.45)',
  fontSize: '0.76rem',
  color: '#ddd5c8',
});

export const decisionBadgeTone = styleVariants({
  battle: {
    borderColor: 'rgba(186, 111, 72, 0.62)',
    color: '#f0c3aa',
  },
  elite: {
    borderColor: 'rgba(186, 111, 72, 0.62)',
    color: '#f0c3aa',
  },
  boss: {
    borderColor: 'rgba(186, 111, 72, 0.62)',
    color: '#f0c3aa',
  },
  shop: {
    borderColor: 'rgba(191, 152, 79, 0.62)',
    color: '#f1d898',
  },
  treasure: {
    borderColor: 'rgba(191, 152, 79, 0.62)',
    color: '#f1d898',
  },
  event: {
    borderColor: 'rgba(94, 123, 173, 0.62)',
    color: '#c9daff',
  },
  rest: {
    borderColor: 'rgba(96, 145, 118, 0.62)',
    color: '#c9e4c3',
  },
  lane: {
    color: '#cfc7ba',
  },
});

export const decisionCtaBase = style({
  position: 'relative',
  width: '100%',
  padding: '0.95rem 1.05rem',
  borderRadius: sceneVars.radii.md,
  border: '1px solid rgba(95, 81, 62, 0.85)',
  font: 'inherit',
  fontSize: '0.98rem',
  fontWeight: 700,
  cursor: 'pointer',
  overflow: 'hidden',
  color: '#1a1814',
  background: 'linear-gradient(168deg, #ebc592 0%, #d69a62 38%, #925a36 100%)',
  boxShadow: sceneVars.shadow.button,
  transition: [
    `transform ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
    `box-shadow ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
    `filter ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
  ].join(', '),
  selectors: {
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
    },
    '&::before': {
      background:
        'radial-gradient(circle at 18% 50%, rgba(255, 239, 201, 0.24), transparent 34%), linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 42%)',
      opacity: 0.7,
    },
    '&::after': {
      inset: '-24% auto -24% -12%',
      width: '36%',
      transform: 'rotate(20deg) translate3d(-110%, 0, 0)',
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0))',
      opacity: 0,
      transition: `transform ${sceneVars.motion.normal} ${sceneVars.motion.ease}, opacity ${sceneVars.motion.normal} ${sceneVars.motion.ease}`,
    },
  },
});

globalStyle(`${decisionCtaBase}:hover`, {
  transform: 'translateY(-2px) scale(1.01)',
  filter: 'brightness(1.09) saturate(1.08)',
  boxShadow:
    '0 16px 34px rgba(0, 0, 0, 0.36), 0 0 34px rgba(244, 213, 141, 0.24), inset 0 0 30px rgba(255, 237, 199, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
});

globalStyle(`${decisionCtaBase}:hover::after`, {
  transform: 'rotate(20deg) translate3d(140%, 0, 0)',
  opacity: 1,
});

globalStyle(`${decisionCtaBase}:active`, {
  transform: 'translateY(2px) scale(0.98)',
  filter: 'brightness(0.9) saturate(1.06)',
  boxShadow:
    '0 6px 14px rgba(0, 0, 0, 0.32), inset 0 0 34px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.16)',
});

export const decisionCtaTone = styleVariants({
  battle: {},
  event: {
    color: '#eaf1ff',
    background: 'linear-gradient(168deg, #45618c 0%, #2f4465 40%, #243247 100%)',
  },
  rest: {
    color: '#eff7eb',
    background: 'linear-gradient(168deg, #5d7e63 0%, #45614b 42%, #314538 100%)',
  },
  shop: {
    color: '#231a0a',
    background: 'linear-gradient(168deg, #e5c979 0%, #c89a45 40%, #886321 100%)',
  },
  treasure: {
    color: '#231a0a',
    background: 'linear-gradient(168deg, #e5c979 0%, #c89a45 40%, #886321 100%)',
  },
  elite: {
    color: '#fff1eb',
    background: 'linear-gradient(168deg, #9f5846 0%, #7e3f32 40%, #572820 100%)',
  },
  boss: {
    color: '#fff1eb',
    background: 'linear-gradient(168deg, #9f5846 0%, #7e3f32 40%, #572820 100%)',
  },
});
