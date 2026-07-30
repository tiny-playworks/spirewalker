import { globalStyle, style } from '@vanilla-extract/css';
import { sceneVars } from '@/styles/sceneTheme.css';

export const page = style({ minHeight: '100vh', display: 'grid', placeContent: 'center', justifyItems: 'center', gap: '1rem', padding: '2rem', textAlign: 'center', color: sceneVars.color.text, background: 'radial-gradient(circle at 50% 40%, rgba(45,212,191,.15), transparent 18rem), radial-gradient(circle at 50% 18%, rgba(139,92,246,.26), transparent 26rem), #09090b' });
export const chapter = style({ color: '#f4cd7a', fontWeight: 900, fontSize: '.72rem', letterSpacing: '.28em' });
export const sigil = style({ display: 'grid', placeItems: 'center', width: '5.5rem', height: '5.5rem', borderRadius: '50%', color: '#d0bcff', border: '1px solid rgba(208,188,255,.42)', background: 'rgba(139,92,246,.12)', boxShadow: '0 0 64px rgba(139,92,246,.32)' });
globalStyle(`${sigil} svg`, { width: '2.4rem', height: '2.4rem' });
export const title = style({ margin: '.4rem 0 0', color: sceneVars.color.textStrong, fontFamily: sceneVars.font.display, fontSize: 'clamp(2rem, 5vw, 4rem)' });
export const copy = style({ maxWidth: '35rem', margin: 0, color: sceneVars.color.textMuted, lineHeight: 1.7 });
export const summary = style({ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '.55rem', margin: '.5rem 0' });
globalStyle(`${summary} span`, { display: 'inline-flex', alignItems: 'center', gap: '.35rem', padding: '.48rem .7rem', borderRadius: '999px', color: sceneVars.color.text, border: '1px solid rgba(208,188,255,.18)', background: 'rgba(255,255,255,.035)', fontSize: '.78rem' });
globalStyle(`${summary} svg`, { width: '.95rem', height: '.95rem', color: '#3cddc7' });
export const continueButton = style({ display: 'inline-flex', alignItems: 'center', gap: '.5rem', minHeight: '3rem', padding: '.7rem 1.1rem', borderRadius: sceneVars.radii.md, color: '#171008', border: '1px solid #f4cd7a', background: 'linear-gradient(135deg,#ffe2a3,#d6a64d)', fontWeight: 900, cursor: 'pointer' });
globalStyle(`${continueButton} svg`, { width: '1rem', height: '1rem' });
