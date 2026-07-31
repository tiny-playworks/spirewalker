import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';

const mobile = '(max-width: 820px)';
const mobileLandscape = '(max-width: 900px) and (orientation: landscape)';

export const page = style({
  position: 'relative',
  flex: 1,
  display: 'grid',
  gridTemplateColumns: '18rem minmax(0, 1fr)',
  gap: '1rem',
  minHeight: 0,
  padding: '1rem',
  overflow: 'hidden',
  color: sceneVars.color.text,
  background:
    'radial-gradient(circle at 20% 0%, rgba(139, 92, 246, 0.2), transparent 28rem), radial-gradient(circle at 88% 70%, rgba(45, 212, 191, 0.12), transparent 24rem), linear-gradient(145deg, #070709, #121018 55%, #071311)',
  selectors: {
    '&::after': {
      content: '""',
      pointerEvents: 'none',
      position: 'absolute',
      inset: 0,
      opacity: 0.045,
      backgroundImage:
        'linear-gradient(rgba(208, 188, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(208, 188, 255, 0.5) 1px, transparent 1px)',
      backgroundSize: '44px 44px',
    },
  },
  '@media': {
    [mobile]: {
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'auto minmax(0, 1fr)',
    },
    [mobileLandscape]: {
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'auto minmax(0, 1fr)',
      gap: '.5rem',
      padding: '.5rem',
    },
  },
});

globalStyle(`${page} > *`, {
  position: 'relative',
  zIndex: 1,
});

export const sidebar = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  minHeight: 0,
  padding: '1rem',
  borderRadius: sceneVars.radii.lg,
  border: `1px solid ${sceneVars.color.border}`,
  background:
    'radial-gradient(circle at 20% 0%, rgba(251,191,36,.1), transparent 14rem), linear-gradient(180deg, rgba(28,26,30,.94), rgba(8,8,10,.9))',
  boxShadow: sceneVars.shadow.panel,
  backdropFilter: 'blur(18px)',
  '@media': {
    [mobileLandscape]: {
      display: 'grid',
      gridTemplateColumns: 'auto minmax(0, 1fr) auto auto',
      alignItems: 'center',
      gap: '.5rem',
      padding: '.45rem .55rem',
    },
  },
});

globalStyle(`${sidebar} > div`, {
  '@media': {
    [mobileLandscape]: {
      minWidth: 0,
    },
  },
});

export const kicker = style({
  margin: 0,
  color: sceneVars.color.textSubtle,
  fontSize: '0.72rem',
  fontWeight: 900,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  '@media': {
    [mobileLandscape]: { display: 'none' },
  },
});

export const title = style({
  margin: '0.35rem 0 0',
  color: sceneVars.color.textStrong,
  fontFamily: sceneVars.font.display,
  fontSize: '2rem',
  lineHeight: 1.05,
  '@media': {
    [mobileLandscape]: { fontSize: '1rem', whiteSpace: 'nowrap' },
  },
});

export const nav = style({
  display: 'grid',
  gap: '0.45rem',
  '@media': {
    [mobile]: {
      gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
    },
    [mobileLandscape]: {
      gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
      gap: '.3rem',
    },
  },
});

export const navButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  minHeight: '2.5rem',
  padding: '0 0.72rem',
  borderRadius: sceneVars.radii.sm,
  color: sceneVars.color.textMuted,
  border: '1px solid rgba(149, 142, 160, 0.22)',
  background: 'rgba(10, 10, 11, 0.34)',
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      color: sceneVars.color.textStrong,
      borderColor: 'rgba(208, 188, 255, 0.58)',
    },
  },
  '@media': {
    [mobile]: {
      justifyContent: 'center',
      padding: '0 0.35rem',
      fontSize: '0.78rem',
    },
    [mobileLandscape]: {
      justifyContent: 'center',
      gap: '.2rem',
      minHeight: '2.15rem',
      padding: '0 .2rem',
      fontSize: '.72rem',
    },
  },
});

export const navButtonActive = style({
  color: sceneVars.color.textStrong,
  borderColor: 'rgba(251, 191, 36, 0.62)',
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.26), rgba(251, 191, 36, 0.1))',
  boxShadow: '0 0 24px rgba(139, 92, 246, 0.15)',
});

export const closeButton = style({
  marginTop: 'auto',
  minHeight: '2.5rem',
  borderRadius: sceneVars.radii.sm,
  color: '#261a00',
  fontWeight: 900,
  border: '1px solid rgba(251, 191, 36, 0.68)',
  background: 'linear-gradient(135deg, #c08457, #fbbf24)',
  boxShadow: sceneVars.shadow.button,
  cursor: 'pointer',
  '@media': {
    [mobileLandscape]: {
      minHeight: '2.15rem',
      padding: '0 .65rem',
      whiteSpace: 'nowrap',
    },
  },
});

export const resetButton = style({
  minHeight: '2.25rem',
  borderRadius: sceneVars.radii.sm,
  color: sceneVars.color.textMuted,
  border: '1px solid rgba(239, 68, 68, 0.3)',
  background: 'rgba(127, 29, 29, 0.12)',
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      color: '#fecaca',
      borderColor: 'rgba(239, 68, 68, 0.64)',
    },
  },
  '@media': {
    [mobileLandscape]: {
      minHeight: '2.15rem',
      padding: '0 .55rem',
      fontSize: '.7rem',
      whiteSpace: 'nowrap',
    },
  },
});

export const content = style({
  minWidth: 0,
  minHeight: 0,
  overflow: 'auto',
});

export const panel = style({
  minHeight: '100%',
  padding: 'clamp(1rem, 2vw, 1.5rem)',
  borderRadius: sceneVars.radii.lg,
  border: `1px solid ${sceneVars.color.border}`,
  background:
    'linear-gradient(145deg, rgba(30,28,34,.88), rgba(9,9,11,.74)), radial-gradient(circle at 80% 0%, rgba(45,212,191,.08), transparent 28rem)',
  boxShadow: sceneVars.shadow.panelHeavy,
  backdropFilter: 'blur(18px)',
  '@media': {
    [mobileLandscape]: {
      padding: '.8rem',
    },
  },
});

export const sectionTitle = style({
  margin: '0.35rem 0 1rem',
  color: sceneVars.color.textStrong,
  fontFamily: sceneVars.font.display,
  fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
  lineHeight: 1,
  '@media': {
    [mobileLandscape]: { fontSize: '1.8rem', marginBottom: '.75rem' },
  },
});

export const metricRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.65rem',
  marginBottom: '1rem',
});

export const metric = style({
  display: 'inline-grid',
  gap: '0.12rem',
  minWidth: '5.5rem',
  padding: '0.6rem 0.75rem',
  borderRadius: sceneVars.radii.md,
  border: '1px solid rgba(208, 188, 255, 0.22)',
  background: 'rgba(10, 10, 11, 0.42)',
});

globalStyle(`${metric} small`, {
  color: sceneVars.color.textSubtle,
  fontSize: '0.7rem',
});

globalStyle(`${metric} strong`, {
  color: sceneVars.color.textStrong,
  fontSize: '1.55rem',
  lineHeight: 1,
});

export const heroGrid = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(17rem, 0.8fr) minmax(0, 1fr)',
  gap: '1rem',
  '@media': {
    [mobile]: {
      gridTemplateColumns: '1fr',
    },
  },
});

export const fateCard = style({
  padding: '1.25rem',
  borderRadius: sceneVars.radii.lg,
  border: '1px solid rgba(251, 191, 36, 0.42)',
  background: 'radial-gradient(circle at 20% 0%, rgba(251, 191, 36, 0.16), transparent 16rem), rgba(10, 10, 11, 0.48)',
});

globalStyle(`${fateCard} h3`, {
  margin: '0.75rem 0 0.5rem',
  color: sceneVars.color.textStrong,
  fontFamily: sceneVars.font.display,
  fontSize: '1.35rem',
});

globalStyle(`${fateCard} p`, {
  color: sceneVars.color.textMuted,
  lineHeight: 1.55,
});

export const orb = style({
  display: 'grid',
  placeItems: 'center',
  width: '4rem',
  aspectRatio: '1',
  borderRadius: '50%',
  color: '#fbbf24',
  fontSize: '2rem',
  border: '1px solid rgba(251, 191, 36, 0.5)',
  background: 'radial-gradient(circle, rgba(251, 191, 36, 0.2), rgba(139, 92, 246, 0.24) 58%, rgba(10, 10, 11, 0.82))',
});

export const primaryButton = style({
  minHeight: '2.75rem',
  padding: '0 1rem',
  borderRadius: sceneVars.radii.sm,
  color: '#261a00',
  fontWeight: 900,
  border: '1px solid rgba(251, 191, 36, 0.72)',
  background: 'linear-gradient(135deg, #c08457, #fbbf24)',
  boxShadow: sceneVars.shadow.button,
  cursor: 'pointer',
});

export const branchGrid = style({
  display: 'grid',
  gap: '0.75rem',
});

export const smallCard = style({
  display: 'grid',
  gap: '0.35rem',
  padding: '0.9rem',
  borderRadius: sceneVars.radii.md,
  border: '1px solid rgba(208, 188, 255, 0.22)',
  background: 'rgba(10, 10, 11, 0.42)',
});

globalStyle(`${smallCard} span`, {
  color: sceneVars.color.textStrong,
  fontWeight: 900,
});

globalStyle(`${smallCard} strong`, {
  color: '#d0bcff',
});

globalStyle(`${smallCard} small`, {
  color: sceneVars.color.textSubtle,
});

export const cardGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
  gap: '0.75rem',
  '@media': {
    [mobileLandscape]: {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      gap: '.5rem',
    },
  },
});

export const filterBar = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.45rem',
  marginBottom: '0.85rem',
});

export const filterButton = style({
  minHeight: '2.1rem',
  padding: '0 0.75rem',
  borderRadius: '999px',
  color: sceneVars.color.textMuted,
  border: '1px solid rgba(208, 188, 255, 0.22)',
  background: 'rgba(10, 10, 11, 0.42)',
  cursor: 'pointer',
});

export const filterButtonActive = style({
  color: '#171008',
  borderColor: 'rgba(251, 191, 36, 0.72)',
  background: 'linear-gradient(135deg, #ffe2a3, #d6a64d)',
});

export const codexCard = style({
  display: 'grid',
  gridTemplateColumns: '7rem minmax(0, 1fr)',
  minHeight: '9.2rem',
  padding: 0,
  overflow: 'hidden',
  borderRadius: sceneVars.radii.md,
  border: '1px solid rgba(208, 188, 255, 0.22)',
  background: 'linear-gradient(145deg, rgba(27,25,32,.94), rgba(8,8,10,.9))',
  '@media': {
    [mobileLandscape]: {
      gridTemplateColumns: '4.4rem minmax(0, 1fr)',
      minHeight: '6.5rem',
    },
  },
});

export const codexKnown = style({
  borderColor: 'rgba(45, 212, 191, 0.52)',
  boxShadow: '0 0 20px rgba(45, 212, 191, 0.08)',
});

export const codexUnknown = style({
  opacity: 0.58,
  filter: 'saturate(0.3)',
});

export const archetypeTone = styleVariants({
  guard: { borderColor: 'rgba(106,157,212,.4)' },
  burst: { borderColor: 'rgba(212,132,106,.4)' },
  mixed: { borderColor: 'rgba(139,92,246,.46)' },
  neutral: { borderColor: 'rgba(149,142,160,.28)' },
});

export const codexArt = style({
  position: 'relative',
  minHeight: '100%',
  overflow: 'hidden',
  background: sceneVars.color.canvasDeep,
});

export const codexArtImage = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const codexArtFallback = style({
  position: 'absolute',
  inset: 0,
  background:
    'radial-gradient(circle at 50% 34%, rgba(208,188,255,.3), transparent 34%), linear-gradient(145deg, rgba(45,212,191,.12), rgba(139,92,246,.2), rgba(6,6,8,.98))',
});

export const codexArtUnknown = style({
  position: 'absolute',
  inset: 0,
  display: 'grid',
  placeItems: 'center',
  color: sceneVars.color.textFaint,
  fontFamily: sceneVars.font.display,
  fontSize: '2rem',
  background:
    'radial-gradient(circle, rgba(149,142,160,.14), transparent 42%), linear-gradient(145deg, #16151a, #09090b)',
});

export const codexArtShade = style({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(90deg, transparent 52%, rgba(17,16,21,.86) 100%)',
});

export const codexBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '.65rem',
  padding: '.85rem',
  '@media': {
    [mobileLandscape]: {
      gap: '.35rem',
      padding: '.55rem',
    },
  },
});

export const codexHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '0.5rem',
});

globalStyle(`${codexHeader} strong`, {
  color: sceneVars.color.textStrong,
  fontFamily: sceneVars.font.display,
  fontSize: '1rem',
});

globalStyle(`${codexHeader} > span, ${codexBody} p`, {
  color: sceneVars.color.textMuted,
  lineHeight: 1.45,
});
globalStyle(`${codexHeader} > span`, { fontSize: '.7rem', whiteSpace: 'nowrap' });
globalStyle(`${codexBody} p`, { margin: 0, fontSize: '.78rem' });

export const relicGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))',
  gap: '0.75rem',
});

export const relicCard = style({
  display: 'grid',
  gridTemplateColumns: '2rem minmax(0, 1fr)',
  gap: '0.2rem 0.65rem',
  padding: '0.85rem',
  borderRadius: sceneVars.radii.md,
  border: '1px solid rgba(208, 188, 255, 0.2)',
  background: 'rgba(10, 10, 11, 0.42)',
});

export const relicOwned = style({
  borderColor: 'rgba(251, 191, 36, 0.52)',
  boxShadow: '0 0 28px rgba(251, 191, 36, 0.1)',
});

export const relicKnown = style({
  borderColor: 'rgba(45, 212, 191, 0.42)',
});

export const relicUnknown = style({
  opacity: 0.56,
  filter: 'saturate(0.25)',
});

export const relicGlyph = style({
  gridRow: '1 / span 2',
  color: '#fbbf24',
  fontSize: '1.35rem',
});

globalStyle(`${relicCard} strong`, {
  color: sceneVars.color.textStrong,
});

globalStyle(`${relicCard} p`, {
  gridColumn: '2',
  margin: 0,
  color: sceneVars.color.textMuted,
  lineHeight: 1.45,
});

export const archiveSubsection = style({
  marginTop: '2rem',
  paddingTop: '1.2rem',
  borderTop: '1px solid rgba(208, 188, 255, 0.16)',
});

export const subsectionTitle = style({
  margin: '0.35rem 0 0.8rem',
  color: sceneVars.color.textStrong,
  fontFamily: sceneVars.font.display,
  fontSize: '1.45rem',
});

export const eventGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))',
  gap: '0.75rem',
});

export const eventCard = style({
  display: 'grid',
  gap: '0.35rem',
  minHeight: '8.5rem',
  padding: '0.85rem',
  borderRadius: sceneVars.radii.md,
  border: '1px solid rgba(45, 212, 191, 0.2)',
  background: 'linear-gradient(145deg, rgba(45, 212, 191, 0.1), rgba(10, 10, 11, 0.48))',
});

globalStyle(`${eventCard} strong`, {
  color: sceneVars.color.textStrong,
});

globalStyle(`${eventCard} span, ${eventCard} p, ${eventCard} small`, {
  color: sceneVars.color.textMuted,
  lineHeight: 1.45,
});

globalStyle(`${eventCard} p`, {
  margin: 0,
});

export const timeline = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
  gap: '0.6rem',
});

globalStyle(`${timeline} span`, {
  display: 'flex',
  alignItems: 'center',
  gap: '0.55rem',
  padding: '0.65rem 0.75rem',
  borderRadius: '10px',
  color: sceneVars.color.textStrong,
  background: 'rgba(10, 10, 11, 0.42)',
  border: '1px solid rgba(208, 188, 255, 0.18)',
});

globalStyle(`${timeline} small`, {
  color: sceneVars.color.textSubtle,
});

export const achievementList = style({
  display: 'grid',
  gap: '0.75rem',
});

export const achievement = style({
  display: 'grid',
  gridTemplateColumns: '5.5rem 9rem minmax(0, 1fr)',
  gap: '0.75rem',
  alignItems: 'center',
  padding: '0.8rem 0.9rem',
  borderRadius: sceneVars.radii.md,
  border: '1px solid rgba(208, 188, 255, 0.18)',
  background: 'rgba(10, 10, 11, 0.42)',
  '@media': {
    [mobile]: {
      gridTemplateColumns: '1fr',
    },
  },
});

export const achievementDone = style({
  borderColor: 'rgba(45, 212, 191, 0.5)',
  background: 'linear-gradient(90deg, rgba(45, 212, 191, 0.12), rgba(10, 10, 11, 0.42))',
});

globalStyle(`${achievement} span`, {
  color: '#3cddc7',
  fontSize: '0.72rem',
  fontWeight: 900,
});

globalStyle(`${achievement} strong`, {
  color: sceneVars.color.textStrong,
});

globalStyle(`${achievement} p`, {
  margin: 0,
  color: sceneVars.color.textMuted,
});
