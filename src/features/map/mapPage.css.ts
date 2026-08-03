import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';

const tablet = '(max-width: 900px) and (orientation: landscape)';

export const page = style({
  position: 'relative',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  minHeight: 0,
  overflow: 'hidden',
  background:
    'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139, 92, 246, 0.16) 0%, transparent 54%), radial-gradient(ellipse 55% 45% at 92% 82%, rgba(45, 212, 191, 0.09) 0%, transparent 46%), linear-gradient(175deg, #0a0a0b 0%, #131314 44%, #0d0d0e 100%)',
  selectors: {
    '&::after': {
      content: '""',
      pointerEvents: 'none',
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      opacity: 0.04,
      backgroundImage:
        'linear-gradient(rgba(208, 188, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(208, 188, 255, 0.5) 1px, transparent 1px)',
      backgroundSize: '46px 46px',
    },
  },
});

export const pageAct2 = style({
  background:
    'radial-gradient(ellipse 80% 52% at 50% 0%, rgba(139, 92, 246, 0.22) 0%, transparent 58%), radial-gradient(ellipse 52% 46% at 10% 82%, rgba(176, 128, 255, 0.1) 0%, transparent 46%), linear-gradient(175deg, #0b0911 0%, #15111d 44%, #0b0b12 100%)',
});

globalStyle(`${page} > *`, {
  position: 'relative',
  zIndex: 1,
});

/* —— 顶部品牌 / 资源条 —— */

export const topBar = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  padding: '0.7rem clamp(1rem, 3vw, 2rem)',
  borderBottom: '1px solid rgba(208, 188, 255, 0.16)',
  background: 'linear-gradient(180deg, rgba(14, 14, 15, 0.85) 0%, rgba(14, 14, 15, 0.2) 100%)',
  backdropFilter: 'blur(10px)',
  '@media': {
    [tablet]: {
      minHeight: '2.75rem',
      gap: '.35rem',
      padding: 'max(.25rem, env(safe-area-inset-top, 0px)) max(.55rem, env(safe-area-inset-right, 0px)) .25rem max(.55rem, env(safe-area-inset-left, 0px))',
    },
  },
});

export const brand = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.85rem',
  minWidth: 0,
});

export const brandMark = style({
  margin: 0,
  fontFamily: sceneVars.font.display,
  fontSize: '1.18rem',
  fontWeight: 700,
  letterSpacing: '0.22em',
  color: sceneVars.color.textStrong,
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  '@media': { [tablet]: { display: 'none' } },
});

export const brandDivider = style({
  width: '1px',
  height: '1.4rem',
  background: 'rgba(208, 188, 255, 0.3)',
  '@media': { [tablet]: { display: 'none' } },
});

export const actBlock = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: '0.6rem',
  minWidth: 0,
});

export const actName = style({
  fontSize: '0.92rem',
  fontWeight: 700,
  color: sceneVars.color.accentGlow,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '@media': { [tablet]: { fontSize: '0.78rem' } },
});

export const floorLabel = style({
  fontSize: '0.82rem',
  color: sceneVars.color.textSubtle,
  whiteSpace: 'nowrap',
});

export const routeBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '1.4rem',
  padding: '0.1rem 0.48rem',
  borderRadius: sceneVars.radii.pill,
  border: '1px solid rgba(143, 228, 214, 0.35)',
  background: 'rgba(73, 160, 150, 0.12)',
  color: '#9be9da',
  fontSize: '0.7rem',
  fontWeight: 800,
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap',
  '@media': { [tablet]: { fontSize: '0.64rem', padding: '0.08rem 0.35rem' } },
});

export const topRight = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.55rem',
});

const statPillBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.32rem 0.7rem',
  fontSize: '0.86rem',
  fontWeight: 700,
  borderRadius: sceneVars.radii.pill,
  border: '1px solid rgba(208, 188, 255, 0.2)',
  background: 'rgba(10, 10, 11, 0.55)',
  color: sceneVars.color.textStrong,
  '@media': { [tablet]: { gap: '0.25rem', padding: '0.25rem 0.45rem', fontSize: '0.74rem' } },
});

export const statPillHp = style([
  statPillBase,
  {
    borderColor: 'rgba(224, 86, 70, 0.4)',
  },
]);

export const statPillGold = style([
  statPillBase,
  {
    borderColor: 'rgba(244, 191, 96, 0.4)',
  },
]);

export const statIconHp = style({
  width: '0.95rem',
  height: '0.95rem',
  color: '#ff7a68',
});

export const statIconGold = style({
  width: '0.95rem',
  height: '0.95rem',
  color: sceneVars.color.fortune,
});

export const iconButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  cursor: 'pointer',
  color: sceneVars.color.textMuted,
  background: 'rgba(10, 10, 11, 0.55)',
  border: '1px solid rgba(208, 188, 255, 0.2)',
  borderRadius: sceneVars.radii.sm,
  transition: `border-color ${sceneVars.motion.fast} ${sceneVars.motion.ease}, color ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
});

globalStyle(`${iconButton}:hover`, {
  borderColor: sceneVars.color.accentGlow,
  color: sceneVars.color.textStrong,
});

export const iconButtonGlyph = style({
  width: '1.05rem',
  height: '1.05rem',
});

/* —— 中部：左侧图例 + 中央滚动星图 —— */

export const body = style({
  position: 'relative',
  flex: 1,
  minHeight: 0,
  display: 'flex',
});

export const legend = style({
  position: 'absolute',
  top: '1rem',
  left: 'clamp(0.75rem, 2vw, 1.5rem)',
  zIndex: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
  width: '10.5rem',
  padding: '.45rem .6rem',
  borderRadius: sceneVars.radii.md,
  background: 'linear-gradient(180deg, rgba(20, 19, 22, 0.86) 0%, rgba(12, 12, 14, 0.7) 100%)',
  border: '1px solid rgba(208, 188, 255, 0.2)',
  boxShadow: sceneVars.shadow.panel,
  backdropFilter: 'blur(14px)',
  '@media': {
    [tablet]: {
      position: 'absolute',
      top: '.45rem',
      left: 'max(.45rem, env(safe-area-inset-left, 0px))',
      width: '9.5rem',
      margin: 0,
      padding: '.25rem .45rem',
      gap: '.25rem',
    },
  },
});

export const legendToggle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: '2.5rem',
  padding: '0 0.2rem',
  border: 0,
  background: 'transparent',
  color: sceneVars.color.textStrong,
  fontSize: '0.78rem',
  fontWeight: 800,
  cursor: 'pointer',
});

export const legendContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
});

export const legendContentCollapsed = style({
  display: 'none',
});

export const legendTitle = style({
  margin: 0,
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: sceneVars.color.textSubtle,
});

export const legendList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.45rem',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  '@media': {
    [tablet]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '0.35rem 0.65rem',
    },
  },
});

export const legendItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.55rem',
  fontSize: '0.78rem',
  color: sceneVars.color.textMuted,
});

export const legendGlyphBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: '50%',
  border: '1.5px solid currentColor',
  background: 'rgba(17, 17, 22, 0.85)',
});

export const legendGlyphTone = styleVariants({
  battle: { color: 'rgba(176, 168, 196, 0.85)' },
  elite: { color: '#ff9a86' },
  boss: { color: '#ff9a86' },
  shop: { color: '#f4cf86' },
  treasure: { color: '#f4cf86' },
  event: { color: '#6fe0d2' },
  rest: { color: '#6fe0d2' },
  camp: { color: '#f4d58d' },
});

export const legendIcon = style({
  width: '0.86rem',
  height: '0.86rem',
});

export const legendLabel = style({
  color: sceneVars.color.textMuted,
});

export const legendHint = style({
  margin: 0,
  paddingTop: '0.55rem',
  borderTop: '1px solid rgba(208, 188, 255, 0.16)',
  fontSize: '0.72rem',
  lineHeight: 1.45,
  color: sceneVars.color.textSubtle,
});

globalStyle(`${legendHint} strong`, {
  color: sceneVars.color.accentGlow,
});

export const mapScroll = style({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '1.5rem 1rem 13rem',
  scrollbarWidth: 'thin',
  scrollBehavior: 'smooth',
  '@media': {
    [tablet]: {
      padding: '.2rem max(.45rem, env(safe-area-inset-right, 0px)) 8.75rem max(.45rem, env(safe-area-inset-left, 0px))',
    },
  },
});

/* —— 底部操作坞 —— */

export const bottomBar = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2.25rem',
  padding: '0.6rem 1rem',
  borderTop: '1px solid rgba(208, 188, 255, 0.16)',
  background: 'linear-gradient(0deg, rgba(14, 14, 15, 0.9) 0%, rgba(14, 14, 15, 0.2) 100%)',
  backdropFilter: 'blur(10px)',
  '@media': {
    [tablet]: {
      minHeight: '2.55rem',
      gap: '1.2rem',
      padding: '.2rem max(.65rem, env(safe-area-inset-right, 0px)) max(.2rem, env(safe-area-inset-bottom, 0px)) max(.65rem, env(safe-area-inset-left, 0px))',
    },
  },
});

export const dockButton = style({
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.2rem',
  padding: '0.3rem 0.85rem',
  cursor: 'pointer',
  background: 'transparent',
  border: 'none',
  color: sceneVars.color.textSubtle,
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  borderRadius: sceneVars.radii.sm,
  transition: `color ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
});

globalStyle(`${dockButton}:hover, ${dockButton}[aria-expanded='true']`, {
  color: sceneVars.color.accentGlow,
});

export const dockIcon = style({
  width: '1.2rem',
  height: '1.2rem',
});

/* —— 弹层（遗物 / 牌组 / 菜单） —— */

export const popoverBackdrop = style({
  position: 'absolute',
  inset: 0,
  zIndex: 30,
  border: 'none',
  background: 'rgba(6, 6, 8, 0.45)',
  backdropFilter: 'blur(2px)',
  cursor: 'pointer',
});

export const popover = style({
  position: 'absolute',
  zIndex: 31,
  bottom: '4.25rem',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'min(30rem, calc(100vw - 2rem))',
  maxHeight: '60vh',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
  padding: '1rem 1.1rem',
  borderRadius: sceneVars.radii.lg,
  border: '1px solid rgba(208, 188, 255, 0.3)',
  background: 'linear-gradient(180deg, rgba(24, 23, 27, 0.96) 0%, rgba(12, 12, 14, 0.94) 100%)',
  boxShadow: sceneVars.shadow.panelHeavy,
});

export const popoverMenu = style([
  popover,
  {
    bottom: 'auto',
    top: '3.4rem',
    left: 'auto',
    right: 'clamp(0.75rem, 2vw, 2rem)',
    transform: 'none',
    width: 'min(14rem, calc(100vw - 2rem))',
  },
]);

export const popoverTitle = style({
  margin: 0,
  fontFamily: sceneVars.font.display,
  fontSize: '1.1rem',
  color: sceneVars.color.textStrong,
});

export const popoverEmpty = style({
  margin: 0,
  fontSize: '0.85rem',
  color: sceneVars.color.textSubtle,
});

export const popoverList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const popoverItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.15rem',
  padding: '0.5rem 0.65rem',
  borderRadius: sceneVars.radii.sm,
  background: 'rgba(10, 10, 11, 0.5)',
  border: '1px solid rgba(208, 188, 255, 0.14)',
});

export const popoverItemHead = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.88rem',
  fontWeight: 700,
  color: sceneVars.color.textStrong,
});

export const popoverItemDesc = style({
  fontSize: '0.78rem',
  lineHeight: 1.4,
  color: sceneVars.color.textMuted,
});

export const deckGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(8.5rem, 1fr))',
  gap: '0.4rem',
});

export const deckChip = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.35rem',
  padding: '0.36rem 0.5rem',
  borderRadius: sceneVars.radii.sm,
  background: 'rgba(10, 10, 11, 0.5)',
  border: '1px solid rgba(208, 188, 255, 0.14)',
  fontSize: '0.8rem',
  color: sceneVars.color.text,
});

export const deckChipCount = style({
  marginLeft: 'auto',
  fontSize: '0.74rem',
  fontWeight: 700,
  color: sceneVars.color.accentGlow,
});

export const menuButton = style({
  display: 'block',
  width: '100%',
  padding: '0.6rem 0.7rem',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: sceneVars.color.text,
  background: 'rgba(10, 10, 11, 0.5)',
  border: '1px solid rgba(208, 188, 255, 0.18)',
  borderRadius: sceneVars.radii.sm,
  transition: `border-color ${sceneVars.motion.fast} ${sceneVars.motion.ease}`,
});

globalStyle(`${menuButton}:hover`, {
  borderColor: sceneVars.color.accentGlow,
});

export const menuButtonDanger = style({
  borderColor: 'rgba(224, 86, 70, 0.4)',
  color: '#ffb4ab',
});

export const nodeDetail = style({
  position: 'absolute',
  left: '50%',
  bottom: '0.8rem',
  zIndex: 20,
  transform: 'translateX(-50%)',
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr) auto',
  alignItems: 'center',
  gap: '0.75rem',
  width: 'min(46rem, calc(100% - 2rem))',
  padding: '0.7rem 0.8rem',
  borderRadius: sceneVars.radii.lg,
  border: '1px solid rgba(208, 188, 255, 0.34)',
  background: 'linear-gradient(135deg, rgba(29, 27, 34, 0.96), rgba(11, 11, 13, 0.96))',
  boxShadow: sceneVars.shadow.panelHeavy,
  '@media': {
    [tablet]: {
      bottom: '0.45rem',
      width: 'calc(100% - 0.8rem)',
      gap: '0.5rem',
      padding: '0.55rem',
    },
  },
});

export const nodeDetailIcon = style({
  display: 'grid',
  placeItems: 'center',
  width: '2.7rem',
  height: '2.7rem',
  borderRadius: '50%',
  border: '1px solid currentColor',
  '@media': { [tablet]: { width: '2.25rem', height: '2.25rem' } },
});

export const nodeDetailCopy = style({ minWidth: 0 });
export const nodeDetailTitle = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '.45rem',
});
globalStyle(`${nodeDetailTitle} strong`, {
  color: sceneVars.color.textStrong,
  fontFamily: sceneVars.font.display,
  fontSize: '0.98rem',
});
globalStyle(`${nodeDetailCopy} p`, {
  margin: '0.14rem 0 0',
  color: sceneVars.color.textMuted,
  fontSize: '0.76rem',
  lineHeight: 1.35,
  '@media': { [tablet]: { display: 'none' } },
});

export const pressureBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '1.45rem',
  padding: '.15rem .45rem',
  borderRadius: sceneVars.radii.pill,
  border: `1px solid ${sceneVars.color.relief}`,
  color: sceneVars.color.relief,
  background: sceneVars.color.reliefSoft,
  fontSize: '.7rem',
  fontWeight: 900,
});

export const encounterPreview = style({
  display: 'flex',
  alignItems: 'center',
  gap: '.48rem',
  minWidth: 0,
  marginTop: '.36rem',
});

export const encounterPortraits = style({
  display: 'flex',
  flexShrink: 0,
});

export const encounterPortrait = style({
  width: '2.1rem',
  height: '2.1rem',
  objectFit: 'cover',
  border: `1px solid ${sceneVars.color.hazard}`,
  borderRadius: '50%',
  background: sceneVars.color.canvasDeep,
  boxShadow: '0 0 14px rgba(212,132,106,.18)',
  selectors: {
    '& + &': { marginLeft: '-.45rem' },
  },
  '@media': { [tablet]: { width: '1.75rem', height: '1.75rem' } },
});

export const encounterIdentity = style({
  display: 'grid',
  minWidth: 0,
  gap: '.04rem',
});
globalStyle(`${encounterIdentity} b`, {
  overflow: 'hidden',
  color: sceneVars.color.textStrong,
  fontSize: '.78rem',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
globalStyle(`${encounterIdentity} > span`, {
  overflow: 'hidden',
  color: sceneVars.color.textSubtle,
  fontSize: '.7rem',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const threatTags = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '.25rem',
  marginLeft: 'auto',
  '@media': { [tablet]: { display: 'none' } },
});
globalStyle(`${threatTags} em`, {
  padding: '.13rem .4rem',
  border: `1px solid ${sceneVars.color.hazardSoft}`,
  borderRadius: sceneVars.radii.pill,
  color: sceneVars.color.hazard,
  background: sceneVars.color.hazardSoft,
  fontSize: '.68rem',
  fontStyle: 'normal',
  fontWeight: 800,
});

export const encounterHint = style({
  display: 'block',
  marginTop: '.24rem',
  overflow: 'hidden',
  color: sceneVars.color.textMuted,
  fontSize: '.7rem',
  lineHeight: 1.3,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const enterNodeButton = style({
  minHeight: '2.75rem',
  padding: '0.55rem 0.9rem',
  borderRadius: sceneVars.radii.md,
  color: '#171008',
  border: '1px solid #f4cd7a',
  background: 'linear-gradient(135deg, #ffe2a3, #d6a64d)',
  fontWeight: 900,
  cursor: 'pointer',
  boxShadow: '0 0 22px rgba(251, 191, 36, 0.2)',
  '@media': { [tablet]: { minHeight: '2.4rem', padding: '.4rem .65rem' } },
});
