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
});

export const brand = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.85rem',
  minWidth: 0,
});

export const brandMark = style({
  margin: 0,
  fontFamily: '"Libre Caslon Text", Georgia, serif',
  fontSize: '1.18rem',
  fontWeight: 700,
  letterSpacing: '0.22em',
  color: sceneVars.color.textStrong,
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
});

export const brandDivider = style({
  width: '1px',
  height: '1.4rem',
  background: 'rgba(208, 188, 255, 0.3)',
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
});

export const floorLabel = style({
  fontSize: '0.82rem',
  color: sceneVars.color.textSubtle,
  whiteSpace: 'nowrap',
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
  width: '12.5rem',
  padding: '0.85rem 0.95rem',
  borderRadius: sceneVars.radii.md,
  background: 'linear-gradient(180deg, rgba(20, 19, 22, 0.86) 0%, rgba(12, 12, 14, 0.7) 100%)',
  border: '1px solid rgba(208, 188, 255, 0.2)',
  boxShadow: sceneVars.shadow.panel,
  backdropFilter: 'blur(14px)',
  '@media': {
    [tablet]: {
      position: 'static',
      width: 'auto',
      margin: '0.75rem',
    },
  },
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
  justifyContent: 'center',
  padding: '1.5rem 1rem 2.5rem',
  scrollbarWidth: 'thin',
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
  fontSize: '0.66rem',
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
  fontFamily: '"Libre Caslon Text", Georgia, serif',
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
